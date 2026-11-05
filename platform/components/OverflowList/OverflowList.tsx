/* Plenix · OverflowList
   Summary: A row of items that shows the ones that fit and puts the rest behind a "…" button that opens them in a menu
     (06 Navigation & Discovery › Local navigation): the behavior the Toolbar and the command bar have, for any row of items.
   Usage:
     <OverflowList label="Page actions" items={[{ id: 'share', label: 'Share', icon: 'share', onSelect: share }, { id: 'export', label: 'Export', href: '/export' }]} />
     <OverflowList items={tags.map((t) => ({ id: t, label: t, content: <Tag>{t}</Tag> }))} />   // your own element in the row; the menu still lists the label
   Props:
     items: the row, in order: [{ id, label, icon, href, disabled, onSelect, content }]; id is unique; label is the text of its row
       button and of its menu item; onSelect(id) runs when it is chosen, in the row or in the menu; href makes it a link
     items[].content: an element drawn in the row in place of the ghost button (a Tag, a Badge, a link); the menu lists the item by label
     label: the accessible name of the row (a group); without it the row has no name
     size: the size of the ghost buttons and of the "…" button: "sm" | "md" (default "md")
     strings: the words it shows and announces, for other languages: { more: "More items" }
     className: more classes on the row
   Behavior:
     The row never wraps. Every item is shown while they all fit; when they do not, the last ones go into the menu, one at a time from the end,
       until the rest and the "…" button fit. The "…" button is the last thing in the row (at the end in both directions) and opens a menu of the
       folded items in their order, as the Toolbar's More does.
     The fit is the command bar's (utils/barFit.ts: useBarFit): it starts from every item shown whenever the row's width, the items or their labels
       change, folds one more item at a time before the browser paints until the row fits, and starts again when the page's fonts finish loading
       (waiting while the menu is open or focus is in the row, so the list under the person never changes). An item is drawn once; its own element (content) is wrapped in a span that does not shrink.
     Nothing changes the focus order except the folding itself: a folded item leaves the Tab order and is a menu item; the "…" button is one
       more Tab stop. When the item that has focus folds, focus moves to the "…" button, so the keyboard user is not sent to the top of the page.
       The menu is the Menu's (arrow keys, Escape, Home and End).
   Notes:
     For a few items whose names are short; a long list of choices is a Select or a Menu.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useBarFit } from '../../utils/barFit.ts';
import { Button } from '../Button/Button.tsx';
import type { IconValue } from '../Icon/Icon.tsx';
import { Menu, MenuItem } from '../Menu/Menu.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import MoreIcon from 'plenix-platform/icons/plenix/more';

type OverflowItem = {
  id: string;
  /** the button's text, and its name in the "…" menu */
  label: React.ReactNode;
  icon?: IconValue;
  href?: string;
  disabled?: boolean;
  onSelect?(id: string): void;
  /** your own element instead of a button */
  content?: React.ReactNode;
};
type OverflowListProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  items?: OverflowItem[];
  /** the group's accessible name */
  label?: string;
  /** the buttons' size; default "md" */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  strings?: Catalog | null;
};
export function OverflowList({ items = [], label, size = 'md', strings, className, ...rest }: OverflowListProps) {
  const t = useStrings('overflowList', strings) as { more: string };
  const row = React.useRef<HTMLDivElement>(null);
  const focused = React.useRef(false);   // focus is on an item of the row (not on the "…" button): if that item folds, the "…" button takes it
  const key = items.map((i) => i.id + ':' + i.label).join('|') + '|' + size;
  const step = useBarFit(row, key, items.length, 0, ':self');
  const shown = Math.max(0, items.length - step);
  const choose = (it: OverflowItem) => () => { if (it.onSelect) it.onSelect(it.id); };
  const folded = items.slice(shown);

  // the item that had focus folded away: focus would fall to the page; the "…" button takes it
  React.useLayoutEffect(() => {
    const el = row.current;
    if (!el || !focused.current || el.contains(document.activeElement)) return;
    const more = el.querySelector<HTMLElement>('[aria-haspopup]');
    if (more) { focused.current = false; more.focus(); }
  }, [shown]);

  const drawn = (it: OverflowItem) => (it.content !== undefined && it.content !== null ? <span key={it.id} className="plx-overflow-list__item">{it.content}</span>
    : <Button key={it.id} className="plx-overflow-list__item" variant="ghost" size={size} icon={it.icon} href={it.href} disabled={it.disabled} onClick={choose(it)}>{it.label}</Button>);
  return (
    <div ref={row} role={label ? 'group' : undefined} aria-label={label || undefined} className={cx('plx-overflow-list', className)}
      onFocus={(e) => { focused.current = !(e.target as Element).closest('[aria-haspopup]'); }} onBlur={() => { focused.current = false; }} {...rest}>
      {items.slice(0, shown).map(drawn)}
      {folded.length ? (
        <Menu label={t.more} placement="bottom-end" className="plx-overflow-list__item" trigger={<Button variant="ghost" size={size} iconOnly icon={MoreIcon} label={t.more} />}>
          {folded.map((it) => <MenuItem key={it.id} icon={it.icon} href={it.href} disabled={it.disabled} onSelect={choose(it)}>{it.label}</MenuItem>)}
        </Menu>
      ) : null}
    </div>
  );
}
