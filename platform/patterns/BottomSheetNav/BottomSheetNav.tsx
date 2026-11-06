/* Plenix · BottomSheetNav
   Summary: Navigation in a bottom sheet (06 Navigation › Mobile navigation › Bottom-sheet navigation): the places of an
     application or a section, opened from a bar or a button on a phone, in a Sheet that rises from the bottom; as a
     list (NavList: groups, icons, counts) or as a grid of icon tiles. Choosing a place closes the sheet.
   Usage:
     <BottomSheetNav open={open} onClose={close} title="Go to" value={section} onSelect={go}
       items={[{ id: 'notes', label: 'All notes', icon: 'doc-text', count: 24 }, …]} />
     <BottomSheetNav layout="grid" open={open} onClose={close} title="Applications" value={app} onSelect={go} items={apps} />
   Props:
     open: whether the sheet shows; onClose(): runs from Close, Escape, the scrim and after a choice
     title: the sheet's title; it names the sheet and the navigation (default "Navigation")
     items: the places: [{ id, label, icon, count, href }] (count and href in the list layout); or groups (list layout):
       [{ heading, items }] as NavList takes them
     value: the id of the current place (aria-current="page")
     onSelect(id): runs when a place is chosen, before the sheet closes
     layout: "list" (default; NavList rows) | "grid" (icon tiles, three or four to a row; for a few top-level places
       known by their icons)
     detent: the sheet's starting height: "medium" (default) | "large"
     footer: a row pinned under the places (an account or settings button)
     strings: the words it shows, for other languages: { title: "Navigation", close: "Close" }
     className: more classes on the sheet
   Behavior:
     The Sheet's behavior: focus moves into the sheet and returns to the opener when it closes; Escape and the scrim
       close it; the grabber moves between the medium and large heights; the page does not scroll behind it.
     A place in the list is a link (href: the page it opens replaces this one) or a button (onSelect: the sheet closes, so
       the person sees the place they chose); a tile in the grid is a button (onSelect).
     The grid's tiles are at least the touch target in both directions; the current tile has the selected fill and its
       icon filled.
   Notes:
     For phones and narrow windows: on wider windows the same places belong in the navigation pane (NavPane), which at
       Narrow already shows a bottom navigation bar whose Browse opens the pane. Use this sheet for a second set of places
       (a section's views, the other applications) or for a page without a pane. More than about twelve places: the
       list, with groups.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Sheet } from '../../components/Sheet/Sheet.tsx';
import { NavList } from '../../components/NavList/NavList.tsx';
import { RowButton } from '../../components/RowButton/RowButton.tsx';
import { Icon } from '../../components/Icon/Icon.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';

/** @public a place in the navigation */
export type BottomSheetItem = { id: string; label: string; icon?: unknown; count?: number; href?: string };
/** @public */
export type BottomSheetNavProps = {
  open: boolean;
  onClose?(): void;
  title?: string;
  items?: BottomSheetItem[];
  /** groups (list layout), as NavList takes them */
  groups?: Array<{ heading?: string; items: BottomSheetItem[] }>;
  value?: string;
  onSelect?(id: string): void;
  layout?: 'list' | 'grid';
  detent?: 'medium' | 'large';
  footer?: React.ReactNode;
  strings?: Record<string, string>;
  className?: string;
};
export function BottomSheetNav({ open, onClose, title, items, groups, value, onSelect, layout = 'list', detent = 'medium', footer, strings, className }: BottomSheetNavProps) {
  const t: any = useStrings('bottomSheetNav', strings);
  const name = title || t.title;
  const choose = (id: any) => { if (onSelect) onSelect(id); if (onClose) onClose(); };
  const body = layout === 'grid' ? (
    <nav aria-label={name} className="plx-bottom-sheet-nav__grid">
      {(items || []).map((it) => (
        <RowButton key={it.id} className="plx-bottom-sheet-nav__tile" current={it.id === value ? 'page' : undefined} selected={it.id === value} onClick={() => choose(it.id)}>
          <span className="plx-bottom-sheet-nav__tile-icon" aria-hidden="true"><Icon name={it.icon as any} filled={it.id === value} /></span>
          <span className="plx-bottom-sheet-nav__tile-label">{it.label}</span>
        </RowButton>
      ))}
    </nav>
  ) : (
    <div className="plx-bottom-sheet-nav__list">
      <NavList label={name} items={(groups ? undefined : items) as any} groups={groups as any} value={value} onSelect={choose} />
    </div>
  );
  return (
    <Sheet open={open} onClose={onClose} title={name} form="bottom" detent={detent} footer={footer} closeLabel={t.close}
      className={cx('plx-bottom-sheet-nav', 'plx-bottom-sheet-nav--' + layout, className)}>
      {body}
    </Sheet>
  );
}
