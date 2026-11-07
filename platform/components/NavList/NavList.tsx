/* Plenix · NavList
   Summary: A list of places in a side navigation (settings sections, folders of a screen).
   Usage:
     <NavList label="Settings" value={current} onSelect={go}
       groups={[{ heading: 'Account', items: [{ id, label, icon, count, href }] }]} />
   Props:
     label: the accessible name of the navigation
     items: one ungrouped list of items: [{ id, label, icon, count, href, muted, disabled, onPin, pinned, actions }]
     groups: groups of items, in order: [{ heading, icon, defaultExpanded, collapsible, items }]; use instead of items
     groups[].heading: the group's heading; a CollapsibleSection header (the accent section header with a chevron)
     groups[].icon: an icon in the group heading (optional)
     groups[].defaultExpanded: whether the group starts open; default true
     groups[].collapsible: false keeps the group always open and its heading stays a plain label; default true
     value: the id of the current item
     onSelect(id): runs when an item is chosen
     items[].href: makes the item a link; otherwise it is a button
     items[].icon: an icon name or element before the label; the current item's "folder" shows as "folder-open" (batch 242)
     items[].count: shown right after the name, small, italic and in parentheses ("Branding (326)")
     items[].muted: an incomplete place (it exists but has nothing in it yet): its text and icon in the muted content role; it still opens
     items[].disabled: disables a button item
     items[].onPin(id): makes the row pinnable; runs from its pin button
     items[].pinned: the row is pinned; its pin button stays shown, filled
     items[].actions: other controls beside the row (a remove button)
     items[].children: makes the item a subgroup: a row with a chevron that folds the rows inside it (same item shape)
     items[].defaultExpanded: whether a subgroup starts open; default false (it also opens while it holds the current item)
     className: more classes on the navigation
     locale: the language the counts are formatted in (default: the page's language, document.documentElement.lang)
     strings: the words it shows and announces, for other languages: { pin: "Pin", unpin: "Unpin", pinItem: "Pin {label}",
       unpinItem: "Unpin {label}" } (pin and unpin are the pin button's tooltip; pinItem and unpinItem its name)
   Behavior:
     A row's actions (item.actions) show on hover and when the row holds keyboard focus; on touch they always show. The pin
       is different: it shows a state, so a pinned row keeps it (batch 272).
     The current item carries aria-current="page".
     An item with href is a link; otherwise it is a button and onSelect(id) runs.
     A collapsible group heading folds its rows, the same in every navigation pane.
     A group heading wraps to evenly balanced lines, at most 2 (--plx-comp-collapsible-section-title-lines, --plx-comp-nav-list-heading-lines); past them the last
       line ends in an ellipsis and the full heading shows in a tooltip (owner, issue 502). A one-line heading is 32px high, two lines 40px. A folding heading is
       a button: the tooltip shows on hover and keyboard focus and its name is the full heading. A static heading (collapsible: false) is plain text: a cut one shows its
       full text on hover only (owner, issue 502, answer A); a screen reader reads the whole heading.
     A subgroup row is a button with aria-expanded; its chevron points right while closed and down while open, and its
     count follows its name. A subgroup holding the current item opens when that item becomes current; while closed it
     marks its own row as holding the current page.
     The pin button shows while the row is hovered or focused, and stays (filled) while the row is pinned.
   Notes:
     item.actions are siblings of the row's own button, never inside it.
*/
import React from 'react';
import { numeralLocale } from '../../utils/format.ts';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { Icon, stateIcon, iconKey } from '../Icon/Icon.tsx';
import type { IconModule, IconValue } from '../Icon/Icon.tsx';
import { CollapsibleSection } from '../CollapsibleSection/CollapsibleSection.tsx';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { useTruncated } from '../../utils/overflow.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';
import ChevronRightIcon from 'plenix-platform/icons/plenix/chevron-right';
import FolderOpenIcon from 'plenix-platform/icons/plenix/folder-open';
import PinIcon from 'plenix-platform/icons/plenix/pin';
import PinFilledIcon from 'plenix-platform/icons/plenix/pin-filled';

// the icon takes the row's state as its own (Styling Standard 3.6): filled on the current row; an Icon element the caller
// gives keeps its own fill when it sets one
// the current item is the open one: a folder shows as an open folder (filled, like every current icon)
const OPEN_ICONS: Record<string, IconModule> = { folder: FolderOpenIcon };
const iconOf = (icon: unknown, on: boolean) => (on && OPEN_ICONS[iconKey(icon) as string]) || icon;

// one row of the list: a destination, or (with children) a group that opens in place
/** @public V is the item ids' type: onSelect hands back the ids it was given (#925) */
export type NavItem<V extends string = string> = {
  id: V;
  label: React.ReactNode;
  href?: string;
  icon?: IconValue | React.ReactNode;
  count?: number | string;
  muted?: boolean;
  disabled?: boolean;
  children?: NavItem<V>[];
  defaultExpanded?: boolean;
  actions?: React.ReactNode;
  pinned?: boolean;
  onPin?: (id: V) => void;
};
export type NavGroup<V extends string = string> = { heading?: React.ReactNode; items: NavItem<V>[]; collapsible?: boolean; icon?: IconValue | React.ReactNode; defaultExpanded?: boolean };
type NavWords = { unpinItem: string; pinItem: string; unpin: string; pin: string };
type RowProps = { item: NavItem; current?: string; onSelect?: (id: string) => void; t: NavWords; loc: string };

const holds = (item: NavItem, current: string | undefined): boolean => !!item.children && item.children.some((c) => c.id === current || holds(c, current));

function SubGroup({ item, current, onSelect, t, loc }: RowProps) {
  const inside = holds(item, current);
  const [open, setOpen] = React.useState(!!item.defaultExpanded || inside);
  React.useEffect(() => { if (inside) setOpen(true); }, [inside, current]);
  const id = useUid('plx-nav-sub');
  return (
    <li className="plx-nav-list__entry">
      <button type="button" className={cx('plx-nav-list__item', 'plx-nav-list__item--group', inside && !open && 'is-current-parent')}
        aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <span className="plx-nav-list__icon plx-nav-list__icon--group"><Icon name={open ? ChevronDownIcon : ChevronRightIcon} filled={false} /></span>
        <span className="plx-nav-list__label"><span className="plx-nav-list__name">{item.label}</span>
          {item.count !== undefined ? <span className="plx-nav-list__count">({item.count})</span> : null}</span>
      </button>
      <ul id={id} aria-label={item.label as string} hidden={!open} className="plx-nav-list__items plx-nav-list__items--nested">
        {open ? item.children!.map((it) => <Item key={it.id} item={it} current={current} onSelect={onSelect} t={t} loc={loc} />) : null}
      </ul>
    </li>
  );
}

function Item({ item, current, onSelect, t, loc }: RowProps) {
  if (item.children) return <SubGroup item={item} current={current} onSelect={onSelect} t={t} loc={loc} />;
  const on = item.id === current;
  const props: React.HTMLAttributes<HTMLElement> = { className: cx('plx-nav-list__item', item.muted && 'plx-nav-list__item--muted', on && 'is-current', (item.actions || item.onPin) && 'plx-nav-list__item--in-actions'), 'aria-current': on ? 'page' : undefined };
  const content = (
    <>
      {item.icon ? <span className={cx('plx-nav-list__icon', item.muted && !on && 'plx-nav-list__icon--muted')}>{stateIcon(iconOf(item.icon, on), on)}</span> : null}
      <span className="plx-nav-list__label"><span className="plx-nav-list__name">{item.label}</span>
        {item.count !== undefined ? <span className="plx-nav-list__count">({typeof item.count === 'number' ? item.count.toLocaleString(loc) : item.count})</span> : null}</span>
    </>
  );
  return (
    <li className={cx('plx-nav-list__entry', (item.actions || item.onPin) && 'plx-nav-list__entry--actions', (item.actions || item.onPin) && on && 'plx-nav-list__entry--current', item.pinned && 'is-pinned')}>
      {item.href ? <a href={item.href} {...props} onClick={onSelect ? () => onSelect(item.id) : undefined}>{content}</a>
        : <button type="button" {...props} disabled={item.disabled || undefined} onClick={() => onSelect && onSelect(item.id)}>{content}</button>}
      {item.actions || item.onPin ? <span className="plx-nav-list__actions">
        {item.onPin ? <button type="button" className={cx('plx-nav-list__pin', item.pinned && 'plx-nav-list__pin--pinned')} aria-pressed={!!item.pinned} aria-label={(item.pinned ? t.unpinItem : t.pinItem).split('{label}').join(item.label as string)}
          title={item.pinned ? t.unpin : t.pin} onClick={() => item.onPin!(item.id)}><Icon name={item.pinned ? PinFilledIcon : PinIcon} filled={!!item.pinned} /></button> : null}
        {item.actions}
      </span> : null}
    </li>
  );
}

function Group({ heading, items, current, onSelect, collapsible = true, icon, defaultExpanded = true, t, loc }: NavGroup & Omit<RowProps, 'item'>) {
  const id = useUid('plx-nav');
  const headingRef = React.useRef<HTMLSpanElement>(null);
  const cut = useTruncated(headingRef);   // a static heading cut after its lines: its full text goes in a Tooltip
  if (heading && collapsible) {
    return (
      <CollapsibleSection className="plx-nav-list__group" title={heading} icon={icon} defaultExpanded={defaultExpanded} headingLevel={null}>
        <ul aria-label={heading as string} className="plx-nav-list__items">
          {items.map((it) => <Item key={it.id} item={it} current={current} onSelect={onSelect} t={t} loc={loc} />)}
        </ul>
      </CollapsibleSection>
    );
  }
  return (
    <div className="plx-nav-list__group">
      {heading ? <Tooltip content={heading} disabled={!cut} describe={false} className="plx-nav-list__tip"><div id={id} className="plx-nav-list__heading"><span ref={headingRef} className="plx-nav-list__heading-text">{heading}</span></div></Tooltip> : null}
      <ul aria-labelledby={heading ? id : undefined} className="plx-nav-list__items">
        {items.map((it) => <Item key={it.id} item={it} current={current} onSelect={onSelect} t={t} loc={loc} />)}
      </ul>
    </div>
  );
}

export type NavListProps<V extends string = string> = {
  /** the navigation's name */
  label?: string;
  /** one list without headings */
  items?: NavItem<V>[];
  /** lists under headings (collapsible by default) */
  groups?: NavGroup<V>[];
  /** the current item's id */
  value?: V;
  onSelect?: (id: V) => void;
  locale?: string;
  strings?: Catalog | null;
  className?: string;
};
export function NavList<V extends string = string>(props: NavListProps<V>) {
  // the rows read ids as strings; V only types what the app passes in and gets back
  const { label, items, groups, value, onSelect, locale, strings, className } = props as unknown as NavListProps;
  const t = useStrings('navList', strings) as NavWords;
  const loc = numeralLocale(locale || (typeof document !== 'undefined' && document.documentElement.lang) || undefined);
  const all: NavGroup[] = groups || [{ heading: null, items: items || [] }];
  return (
    <nav aria-label={label} className={cx('plx-nav-list', className)}>
      {all.map((g, i) => <Group key={(g.heading || i) as React.Key} heading={g.heading} items={g.items} collapsible={g.collapsible} icon={g.icon} defaultExpanded={g.defaultExpanded} current={value} onSelect={onSelect} t={t} loc={loc} />)}
    </nav>
  );
}
