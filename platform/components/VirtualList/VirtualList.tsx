/* Plenix · VirtualList
   Summary: A long list (hundreds to many thousands of items) that renders only the rows in and near its view, in a
     bordered scroll area: rows of one height (fixed), rows that take their own height (variable), or rows under group
     headers that stay at the top while their group scrolls (groups). The scroll bar keeps the length of the whole list
     and every row its place in it ("12 of 4,000"). It is useVirtualizer drawn as a Platform list.
   Usage:
     <VirtualList label="Activity" items={events} showCount />
     <VirtualList label="Notes" mode="variable" items={notes} renderItem={(note) => <NoteRow note={note} />} />
     <VirtualList label="People" groups={[{ id: 'a', label: 'A', items: [...] }, …]} height="lg" />
     <VirtualList label="Log" count={total} renderItem={(item, index) => line(index)} loading={busy} onEndReached={more} />
   Props:
     label: the list's accessible name (required: the scroll area is a Tab stop and screen readers name it)
     items: the rows: [{ id, label, description, meta, icon }] drawn as a row (an icon, the label, a muted description and
       a technical value in the data font at the end), or anything renderItem draws
     groups: instead of items, rows under headers: [{ id, label, items }]; each header stays at the top while its group
       scrolls and says how many items it holds
     count: instead of items, how many rows there are; renderItem(undefined, index) draws each one (rows built on demand)
     unread(item) or unreadKeys with onUnreadChange(keys, {unreadCount}): key-based unread state. onItemOpen(item) enables click/Enter opening; markReadOnOpen and readDelay match DataGrid.
     renderItem(item, index): draws a row's content (default: the row of icon, label, description and meta)
     getKey(item, index): a stable key for a row (default item.id, else its index)
     mode: "fixed" (default: every row one line at the list row height, cut with an ellipsis) | "variable" (rows take
       their own height and wrap; the row height is the estimate for the rows not drawn)
     height: the scroll area's height: "sm" | "md" (default) | "lg" | "fill" (its container's height)
     showCount: the number of items above the list ("4,000 items", in the data font); default false
     loading: a row with a spinner and Loading… at the end while more rows come; default false
     onEndReached(): runs once each time the end of the list nears the view (load the next rows)
     overscan: how many rows are drawn beyond each edge of the view (default 4)
     strings: the words, for other languages: { count: (n) => "4,000 items", group: (n) => "12 items", loading:
       "Loading…", empty: "No items" }
     className: more classes on the wrapper
     ref: { scrollToIndex(index), element } (the scroll area): jump to a row (search results, "go to today")
   Behavior:
     The scroll area is one Tab stop named by label: the arrow keys, Page Up and Page Down, Home and End scroll it. Links
       and buttons inside rows are Tab stops of their own; a row that holds focus stays drawn while it scrolls out of view.
     Each row is a list item with its place in the whole list (aria-posinset of aria-setsize). Rows outside the view are
       stood in for by gaps the stylesheet sizes (system/virtual.css): nothing is written as a style.
     Groups: the header of the group in view stays at the top (sticky) on the list's surface.
     onEndReached runs when the last rows come into the drawn window and nothing is loading; again after more rows arrive.
   Notes:
     Not for short lists (under a few hundred rows): use List or render them all. Not where browser find (Ctrl F) across
       every row matters, unless the page offers its own search. Tables are the DataGrid, which has its own rendering.
*/
import React from 'react';
import { useUnread } from '../DataGrid/unread.js';
import { cx } from '../../utils/cx.ts';
import { Icon, type IconValue } from '../Icon/Icon.tsx';
import { Spinner } from '../Loading/Loading.tsx';
import { formatNumber } from '../../utils/format.ts';
import { useVirtualizer, VirtualGap, VirtualProbe, VIRTUAL_STICKY_CLASS } from '../../hooks/useVirtualizer.ts';
import { useStrings, useLocale } from '../../providers/LocaleProvider.tsx';

const HEIGHTS = ['sm', 'md', 'lg', 'fill'];

/** @public a ready-made row: { id, label, description, meta, icon } (ADR 0011) */
export type VirtualListItem = { id?: string | number; label?: React.ReactNode; description?: React.ReactNode; meta?: React.ReactNode; icon?: IconValue; [key: string]: unknown };
/** @public rows under a header: { id, label, items } */
export type VirtualListGroup = { id?: string | number; label?: React.ReactNode; items?: VirtualListItem[] };
/** @public the handle a ref gives: jump to a row, or the scroll area */
export type VirtualListHandle = { scrollToIndex: (index: number) => void; readonly element: HTMLElement | null };
type VirtualListRow = { header: true; group: VirtualListGroup; n: number; item?: undefined } | { header?: false; item: VirtualListItem | undefined };
/** @public the prop type (ADR 0011) */
export type VirtualListProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** the list's accessible name (required: the scroll area is a Tab stop) */
  label: string;
  items?: VirtualListItem[];
  groups?: VirtualListGroup[];
  /** instead of items: how many rows there are; renderItem(undefined, index) draws each one */
  count?: number;
  renderItem?: (item: VirtualListItem | undefined, index: number) => React.ReactNode;
  getKey?: (item: VirtualListItem | undefined, index: number) => string | number;
  mode?: 'fixed' | 'variable';
  height?: 'sm' | 'md' | 'lg' | 'fill';
  showCount?: boolean;
  loading?: boolean;
  onEndReached?: () => void;
  overscan?: number;
  strings?: Record<string, unknown> | null;
  className?: string;
  unread?: (item: VirtualListItem | undefined) => boolean;
  unreadKeys?: Array<string | number>;
  onUnreadChange?: (keys: Array<string | number>, info: { unreadCount: number }) => void;
  markReadOnOpen?: boolean;
  readDelay?: number;
  onItemOpen?: (item: VirtualListItem | undefined) => void;
};

function Row({ item }: { item: VirtualListItem | undefined }) {
  if (!item || typeof item !== 'object') return <span className="plx-virtual-list__text"><span className="plx-virtual-list__label">{String(item)}</span></span>;
  return (
    <>
      {item.icon ? <span className="plx-virtual-list__icon" aria-hidden="true"><Icon name={item.icon} /></span> : null}
      <span className="plx-virtual-list__text">
        <span className="plx-virtual-list__label">{item.label}</span>
        {item.description ? <span className="plx-virtual-list__description">{item.description}</span> : null}
      </span>
      {item.meta !== undefined && item.meta !== null ? <span className="plx-virtual-list__meta">{item.meta}</span> : null}
    </>
  );
}

export const VirtualList = React.forwardRef<VirtualListHandle, VirtualListProps>(function VirtualList({ label, items, groups, count, renderItem, getKey, mode = 'fixed', height = 'md',
  showCount = false, loading = false, onEndReached, overscan, strings, className, unread: unreadPredicate, unreadKeys, onUnreadChange, markReadOnOpen, readDelay, onItemOpen, ...rest }, ref) {
  const t = useStrings('virtualList', strings);
  const loc = useLocale();
  // "N items": plural messages in the catalog; an app's own function in strings still wins
  const words = t as Record<string, string>;   // the catalog's words (strings, plus two that an app may give as functions)
  const countText = (n: number): string => (typeof t.count === 'function' ? (t.count as (n: number) => string)(n) : loc.t('virtualList.count', { count: n, n: formatNumber(n) }));
  const groupText = (n: number): string => (typeof t.group === 'function' ? (t.group as (n: number) => string)(n) : loc.t('virtualList.group', { count: n, n: formatNumber(n) }));
  // the rows in order: a group's header, then its items
  const rows = React.useMemo((): VirtualListRow[] | null => {
    if (groups) {
      const out: VirtualListRow[] = [];
      groups.forEach((g) => { const list = g.items || []; out.push({ header: true, group: g, n: list.length }); list.forEach((it) => out.push({ item: it })); });
      return out;
    }
    return items ? items.map((it) => ({ item: it })) : null;
  }, [items, groups]);
  const unreadRecords=React.useMemo(()=>rows?rows.filter(row=>!row.header).map(row=>row.item):[],[rows]);
  const unreadKey=React.useCallback((item: VirtualListItem | undefined)=>getKey?getKey(item,unreadRecords.indexOf(item)):item?.id??unreadRecords.indexOf(item),[getKey,unreadRecords]);
  const unread=useUnread(unreadRecords,unreadKey,{unread:unreadPredicate,unreadKeys,onUnreadChange,markReadOnOpen,readDelay});
  const total = rows ? rows.length : Math.max(0, count || 0);
  const itemCount = groups ? groups.reduce((n: number, g) => n + (g.items || []).length, 0) : total;
  const sticky = React.useMemo(() => (groups && rows ? rows.reduce<number[]>((l, r, i) => (r.header ? l.concat(i) : l), []) : undefined), [groups, rows]);
  const v = useVirtualizer({ count: total, mode: mode === 'variable' ? 'measured' : 'fixed', overscan, sticky });
  React.useImperativeHandle(ref, () => ({ scrollToIndex: v.scrollToIndex, get element() { return v.viewportRef.current; } }), [v.scrollToIndex]);

  // the end of the list in the drawn window: ask for more once per length
  const asked = React.useRef(-1);
  React.useEffect(() => {
    if (!onEndReached || loading || !total) return;
    if (v.range.end >= total && asked.current !== total) { asked.current = total; onEndReached(); }
  }, [v.range.end, total, loading]);

  const draw = (index: number) => {
    const r = rows ? rows[index] : null;
    if (r && r.header) {
      return (
        <div key={'h' + index} role="listitem" className={cx('plx-virtual-list__item', 'plx-virtual-list__header', VIRTUAL_STICKY_CLASS)} {...v.itemProps(index)}>
          <span className="plx-virtual-list__header-label">{r.group.label}</span>
          <span className="plx-virtual-list__header-count">{groupText(r.n)}</span>
        </div>
      );
    }
    const item = r ? r.item : undefined;
    const key = getKey ? getKey(item, index) : item && typeof item === 'object' && item.id !== undefined ? item.id : index;
    return (
      <div key={key} role="listitem" className="plx-virtual-list__item" data-plx-unread={unread.has(item)||undefined} aria-label={unread.has(item)?words.unreadRow.replace('{label}',String(item?.label??key)):undefined} tabIndex={onItemOpen?0:undefined} onClick={()=>{if(onItemOpen){onItemOpen(item);unread.open(item);}}} onKeyDown={event=>{if(onItemOpen&&event.key==='Enter'&&event.target===event.currentTarget){onItemOpen(item);unread.open(item);}}} {...v.itemProps(index)}>
        {renderItem ? renderItem(item, index) : <Row item={item} />}
      </div>
    );
  };

  return (
    <div className={cx('plx-virtual-list', 'plx-virtual-list--' + (mode === 'variable' ? 'variable' : 'fixed'), groups && 'plx-virtual-list--groups', className)} {...rest}>
      {showCount ? <div className="plx-virtual-list__count">{countText(itemCount)}</div> : null}
      <div ref={v.viewportRef as React.RefObject<HTMLDivElement>} role={total || loading ? 'list' : undefined} aria-label={label} aria-busy={loading || undefined}
        className="plx-virtual-list__viewport" data-plx-height={HEIGHTS.indexOf(height) >= 0 ? height : 'md'}>
        {total ? <VirtualProbe /> : null}
        {v.segments.map((s) => (s.gap ? <VirtualGap key={s.key} count={s.count} /> : draw(s.index)))}
        {loading ? <div role="listitem" className="plx-virtual-list__loading"><Spinner size="sm" label={words.loading} /><span aria-hidden="true">{words.loading}</span></div> : null}
        {!total && !loading ? <p className="plx-virtual-list__empty">{words.empty}</p> : null}
      </div>
    </div>
  );
});
