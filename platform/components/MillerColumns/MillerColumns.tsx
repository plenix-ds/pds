/* Plenix · MillerColumns
   Summary: A hierarchy browsed in side-by-side columns: choosing an item in one column lists its children in the next, so
     the whole path stays in view (the column view of a file browser). An optional preview column shows the chosen item.
   Usage:
     <MillerColumns label="Assets" items={tree} path={path} onPathChange={setPath} onOpen={(item) => open(item)} />
     <MillerColumns label="Assets" items={tree} defaultPath={['brand']} renderPreview={(item) => <AssetSummary item={item} />} />
     <MillerColumns label="Regions" items={regions} resizable />
   Props:
     items: the top level: [{ id, label, icon, description, children, disabled }]; an item with children (an array, empty
       when it has none yet) is a parent and shows a chevron; an item without children is a leaf; with loadChildren, an item
       with hasChildren: true and no children array is a parent whose children load when it is first chosen
     loadChildren(item): returns the item's children (an array or a promise of one) the first time it is chosen (issue 814,
       useBranchLoader): its column shows a spinner and "Loading…", a failure says so with Try again, never asked twice
     path: the chosen item of each column, by id from the left ([] for none), for a controlled view
     defaultPath: the path it starts with, uncontrolled
     onPathChange(path, item): runs when the path changes, with the item chosen last (undefined when a column is left)
     onOpen(item, path): runs when a leaf is opened: Enter or a double click
     renderPreview(item): what the preview column shows for the chosen leaf (the last item of the path when it has no
       children); without it there is no preview column
     checked: ids of the leaves that are checked: each leaf then shows a checkbox mark (a multiple choice, as Cascader's)
     expandOnHover: pointing at a parent opens it, as a click does (Cascader's hover trigger); default false
     openOnClick: a single click on a leaf opens it too (onOpen), as in a picker; default false (a double click)
     resizable: each column has an edge people drag, or move with the arrow keys, in steps of 40px from 160px to 360px;
       default false
     columnWidths: the width step of each column (1 to 6: 160px to 360px; default 3, 240px), for a controlled width
     onColumnWidthsChange(widths): runs when a column is resized
     label: the name of the whole view and of its first column (required)
     strings: the words it shows and announces, for other languages: { empty: "No items", resize: "Resize the {label}
       column", preview: "Preview of {label}" }
     className: more classes on the view
   Behavior:
     Each column is a listbox named by its parent, one Tab stop each: Arrow Up and Down choose an item in the column (its
       children open in the next column at once), Home and End the first and last, Arrow Right moves into the children
       (choosing the first), Arrow Left back to the parent's column, Enter opens a leaf (onOpen) or moves into a parent;
       typing a letter moves to the next item that starts with it. The active item is the column's aria-activedescendant.
     Tabbing into a column with nothing chosen chooses its first item; a click chooses the item clicked, also as the
       column's first focus (a searchable Cascader's first click chose the first item instead: issue 814).
     Choosing a parent clears the columns to its right; the newest column scrolls into view.
     A column with no children says so (strings.empty). Long columns scroll on their own (each list is focusable).
     A parent to load (hasChildren) is chosen like any other; its column is aria-busy and its spinner announces "Loading
       {label}" while the children arrive; a failure is announced, and Arrow Right on the parent (or Try again) asks again.
     In a right-to-left page the columns run from the right and Arrow Left and Right swap.
   Notes:
     For narrow windows, show one level at a time instead (drilldown navigation); for a value in a form, Cascader.
     Widths are steps, never numbers: data-plx-width sets one of the six column width tokens.
     Cascader hands its own branch loader (useBranchLoader) to its columns through an internal loader prop, so its search and
       its path see the same loaded children; an application passes loadChildren instead.
     The checkbox marks (checked) are drawn with the Checkbox control but are inert and hidden: the row is the target and
       its aria-checked says whether it is checked.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Icon } from '../Icon/Icon.tsx';
import { tokenPx } from '../../patterns/AppShell/AppShell.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import type { IconValue } from '../Icon/Icon.tsx';
import ChevronRightIcon from 'plenix-platform/icons/plenix/chevron-right';
import { fill } from '../../utils/fill.ts';
import { useBranchLoader, BranchStatus } from '../../hooks/useBranchLoader.ts';
import type { BranchNode, BranchLoader, LoadChildren } from '../../hooks/useBranchLoader.ts';

const MIN_STEP = 1, MAX_STEP = 6, DEFAULT_STEP = 3;
type Id = string | number;
type MillerItem = BranchNode & { icon?: IconValue; description?: React.ReactNode; disabled?: boolean; children?: MillerItem[] | null };
type Column = { items: MillerItem[]; parent: MillerItem | null };
const EMPTY: MillerItem[] = [];

/** @public the prop type (ADR 0011) */
export type MillerColumnsProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  /** the top level: { id, label, icon, description, disabled, children } */
  items?: MillerItem[];
  /** loads a parent's children when it is chosen */
  loadChildren?: LoadChildren<MillerItem>;
  /** a branch loader shared with another part */
  loader?: BranchLoader<MillerItem>;
  /** the chosen ids, one per column (controlled) */
  path?: Id[];
  defaultPath?: Id[];
  onPathChange?: (path: Id[], item?: MillerItem) => void;
  /** a leaf opened (Enter, double click; click with openOnClick) */
  onOpen?: (item: MillerItem, path: Id[]) => void;
  /** a preview column for the chosen leaf */
  renderPreview?: (item: MillerItem) => React.ReactNode;
  /** leaf ids drawn checked (shows check marks) */
  checked?: Id[];
  expandOnHover?: boolean;
  openOnClick?: boolean;
  resizable?: boolean;
  /** each column's width step (1 to 6) */
  columnWidths?: number[];
  onColumnWidthsChange?: (widths: number[]) => void;
  label?: string;
  strings?: Catalog | null;
  className?: string;
};

export const MillerColumns = React.forwardRef<HTMLDivElement, MillerColumnsProps>(function MillerColumns({ items: given = EMPTY, loadChildren, loader: shared, path, defaultPath = [], onPathChange, onOpen, renderPreview,
  checked, expandOnHover = false, openOnClick = false, resizable = false, columnWidths, onColumnWidthsChange, label, strings, className, ...rest }, ref) {
  const t = useStrings('millerColumns', strings) as Record<string, string>;
  const own = useBranchLoader(shared ? undefined : loadChildren);
  const loader = shared || own;
  const items = loader.merge(given);   // each loaded parent's children in place (issue 814)
  // a parent: children here (an array, maybe empty), or children to load
  const hasKids = (it?: MillerItem | null) => !!(it && (Array.isArray(it.children) || loader.needs(it)));
  const auto = 'plx-mc' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const [ownPath, setOwnPath] = React.useState<Id[]>(defaultPath);
  const ids = path !== undefined ? path : ownPath;
  const [ownWidths, setOwnWidths] = React.useState<number[]>([]);
  const widths = columnWidths || ownWidths;
  const lists = React.useRef<Array<HTMLUListElement | null>>([]), columns = React.useRef<Array<HTMLDivElement | null>>([]);
  const focusAt = React.useRef<number | null>(null);
  const pressing = React.useRef(false);   // a click focuses its column: that focus must not choose the first item over the clicked one

  // the columns: the top level, then the children of each chosen parent
  const cols: Column[] = [{ items, parent: null }];
  const chosen: MillerItem[] = [];
  for (let i = 0; i < ids.length; i++) {
    const it = cols[i].items.find((x) => x.id === ids[i]);
    if (!it) break;
    chosen.push(it);
    if (hasKids(it)) cols.push({ items: it.children || [], parent: it });
    else break;
  }
  // each chosen parent that has not loaded asks for its children once
  React.useEffect(() => { loader.ensure(chosen.filter((it) => loader.needs(it))); });
  const last = chosen[chosen.length - 1];
  const preview = renderPreview && last && !hasKids(last) ? last : null;

  const setPath = (next: Id[], item?: MillerItem) => {
    if (path === undefined) setOwnPath(next);
    if (onPathChange) onPathChange(next, item);
  };
  const choose = (level: number, item?: MillerItem) => { if (!item || item.disabled) return; setPath(chosen.slice(0, level).map((x) => x.id).concat([item.id]), item); };
  const focusList = (level: number) => { focusAt.current = level; };
  React.useEffect(() => {
    if (focusAt.current === null) return;
    const el = lists.current[focusAt.current];
    focusAt.current = null;
    if (el) el.focus();
  });
  // the newest column, and each column's active item, scroll into view
  const depth = cols.length + (preview ? 1 : 0);
  React.useEffect(() => {
    const col = columns.current[depth - 1];
    if (col && col.scrollIntoView) col.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [depth]);
  React.useEffect(() => {
    chosen.forEach((it, level) => { const o = document.getElementById(optId(level, it.id)); if (o && o.scrollIntoView) o.scrollIntoView({ block: 'nearest', inline: 'nearest' }); });
  }, [ids.join('/')]);

  const optId = (level: number, id: Id) => auto + '-' + level + '-' + String(id).replace(/[^a-zA-Z0-9_-]/g, '_');
  const rtl = () => typeof document !== 'undefined' && lists.current[0] && getComputedStyle(lists.current[0]).direction === 'rtl';
  const enabled = (list: MillerItem[]) => list.filter((x) => !x.disabled);
  const onKey = (level: number) => (e: React.KeyboardEvent<HTMLUListElement>) => {
    const list = cols[level].items, here = chosen[level], usable = enabled(list);
    const at = here ? usable.indexOf(here) : -1;
    let key = e.key;
    if (rtl() && (key === 'ArrowLeft' || key === 'ArrowRight')) key = key === 'ArrowLeft' ? 'ArrowRight' : 'ArrowLeft';
    if (key === 'ArrowDown') { e.preventDefault(); choose(level, usable[Math.min(usable.length - 1, at + 1)]); }
    else if (key === 'ArrowUp') { e.preventDefault(); choose(level, usable[Math.max(0, at - 1)]); }
    else if (key === 'Home') { e.preventDefault(); choose(level, usable[0]); }
    else if (key === 'End') { e.preventDefault(); choose(level, usable[usable.length - 1]); }
    else if (key === 'ArrowRight' || (key === 'Enter' && hasKids(here))) {
      if (!here) { e.preventDefault(); choose(level, usable[0]); return; }
      if (hasKids(here)) {
        e.preventDefault();
        if (loader.needs(here) && loader.statusOf(here) === 'failed') loader.retry(here);   // a parent that failed to load asks again
        const first = enabled(here.children || [])[0];
        if (first) { setPath(chosen.slice(0, level + 1).map((x) => x.id).concat([first.id]), first); }
        focusList(level + 1);
      }
    } else if (key === 'ArrowLeft') {
      if (level > 0) { e.preventDefault(); setPath(chosen.slice(0, level).map((x) => x.id), undefined); focusList(level - 1); }
    } else if (key === 'Enter') {
      if (here && onOpen) { e.preventDefault(); onOpen(here, chosen.slice(0, level + 1).map((x) => x.id)); }
    } else if (key.length === 1 && /\S/.test(key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const k = key.toLowerCase();
      const order = usable.slice(at + 1).concat(usable.slice(0, at + 1));
      const hit = order.find((x) => String(x.label).toLowerCase().indexOf(k) === 0);
      if (hit) { e.preventDefault(); choose(level, hit); }
    }
  };

  const widthOf = (level: number) => Math.min(MAX_STEP, Math.max(MIN_STEP, widths[level] || DEFAULT_STEP));
  const setWidth = (level: number, step: number) => {
    const next = cols.map((c, i) => widthOf(i));
    next[level] = Math.min(MAX_STEP, Math.max(MIN_STEP, step));
    if (!columnWidths) setOwnWidths(next);
    if (onColumnWidthsChange) onColumnWidthsChange(next);
  };
  const onResizeKey = (level: number) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    const grow = rtl() ? 'ArrowLeft' : 'ArrowRight', shrink = rtl() ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === grow) { e.preventDefault(); setWidth(level, widthOf(level) + 1); }
    else if (e.key === shrink) { e.preventDefault(); setWidth(level, widthOf(level) - 1); }
    else if (e.key === 'Home') { e.preventDefault(); setWidth(level, MIN_STEP); }
    else if (e.key === 'End') { e.preventDefault(); setWidth(level, MAX_STEP); }
  };
  const onResizeDown = (level: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const start = e.clientX, from = widthOf(level), step = tokenPx('--plx-comp-miller-columns-resize-step') || 1, dir = rtl() ? -1 : 1;
    const move = (ev: PointerEvent) => setWidth(level, from + Math.round(((ev.clientX - start) * dir) / step));
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };

  return (
    <div ref={ref} role="group" aria-label={label} className={cx('plx-miller-columns', resizable && 'plx-miller-columns--resizable', checked && 'plx-miller-columns--checks', className)} {...rest}>
      {cols.map((col, level) => {
        const here = chosen[level];
        const name = col.parent ? (col.parent.label as string | undefined) : label;
        return (
          <React.Fragment key={level + '-' + (col.parent ? col.parent.id : 'root')}>
            <div ref={(el) => { columns.current[level] = el; }} className="plx-miller-columns__column" data-plx-width={widthOf(level)}>
              <ul ref={(el) => { lists.current[level] = el; }} className="plx-miller-columns__list" role="listbox" tabIndex={0} aria-label={name}
                aria-busy={col.parent && loader.needs(col.parent) && loader.statusOf(col.parent) !== 'failed' ? true : undefined}
                aria-activedescendant={here ? optId(level, here.id) : undefined} onKeyDown={onKey(level)}
                onFocus={() => { if (!pressing.current && !here && col.items.length) choose(level, enabled(col.items)[0]); }}>
                {col.items.length ? col.items.map((it) => {
                  const on = here && here.id === it.id, parent = hasKids(it), isChecked = checked && !parent && checked.indexOf(it.id) >= 0;
                  return (
                    <li key={it.id} id={optId(level, it.id)} role="option" aria-selected={!!on} aria-disabled={it.disabled || undefined}
                      aria-checked={checked && !parent ? !!isChecked : undefined}
                      className={cx('plx-miller-columns__item', on && 'is-selected', on && level === chosen.length - 1 && 'is-current', it.disabled && 'is-disabled')}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { choose(level, it); const el = lists.current[level]; pressing.current = true; if (el) el.focus(); pressing.current = false;
                        if (openOnClick && !parent && !it.disabled && onOpen) onOpen(it, chosen.slice(0, level).map((x) => x.id).concat([it.id])); }}
                      onDoubleClick={() => { if (!parent && !it.disabled && onOpen) onOpen(it, chosen.slice(0, level).map((x) => x.id).concat([it.id])); }}
                      onMouseEnter={expandOnHover && parent && !it.disabled ? () => choose(level, it) : undefined}>
                      {checked && !parent ? <input type="checkbox" className="plx-check__input plx-miller-columns__mark" tabIndex={-1} aria-hidden="true" {...{ inert: "" }} checked={!!isChecked} readOnly /> : null}
                      {it.icon ? <span className="plx-miller-columns__icon" aria-hidden="true"><Icon name={it.icon} filled={!!on} /></span> : null}
                      <span className="plx-miller-columns__text">
                        <span className="plx-miller-columns__label">{it.label}</span>
                        {it.description ? <span className="plx-miller-columns__description">{it.description}</span> : null}
                      </span>
                      {parent ? <span className="plx-miller-columns__chevron" aria-hidden="true"><Icon icon={ChevronRightIcon} filled={false} /></span> : null}
                    </li>
                  );
                }) : col.parent && loader.needs(col.parent)
                  ? <li className="plx-miller-columns__empty" role="presentation"><BranchStatus loader={loader} node={col.parent} className="plx-miller-columns__status" /></li>
                  : <li className="plx-miller-columns__empty" role="presentation">{t.empty}</li>}
              </ul>
            </div>
            {resizable ? <div className="plx-miller-columns__resizer" role="separator" aria-orientation="vertical" tabIndex={0} aria-label={fill(t.resize, { label: name })}
              aria-valuemin={MIN_STEP} aria-valuemax={MAX_STEP} aria-valuenow={widthOf(level)} onKeyDown={onResizeKey(level)} onPointerDown={onResizeDown(level)} /> : null}
          </React.Fragment>
        );
      })}
      {preview ? (
        <div ref={(el) => { columns.current[cols.length] = el; }} className="plx-miller-columns__preview" role="region" tabIndex={0} aria-label={fill(t.preview, { label: preview.label })}>
          {(renderPreview as (item: MillerItem) => React.ReactNode)(preview)}
        </div>
      ) : null}
    </div>
  );
});
