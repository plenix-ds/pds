/* Plenix · useVirtualizer
   Summary: Renders only the items of a long collection that are in view (plus a few on each side), so a list, a file
     grid or a log of thousands of items stays fast. The items that are not rendered are stood in for by gaps the
     stylesheet sizes (system/virtual.css): no style is ever written, and the scroll bar keeps its true length.
   Usage:
     const v = useVirtualizer({ count: files.length });
     <div ref={v.viewportRef} className="plx-file-list" role="list">            // the scroll container
       <VirtualProbe />
       {v.segments.map((s) => s.gap ? <VirtualGap key={s.key} count={s.count} />
         : <div key={s.key} role="listitem" {...v.itemProps(s.index)}>{files[s.index].name}</div>)}
     </div>
     .plx-file-list { --plx-sys-virtual-item-size: var(--plx-sys-data-grid-row-height); overflow-y: auto; }
   Props:
     count: how many items there are
     mode: "fixed" (default: every item is one row of --plx-sys-virtual-item-size) or "measured" (items take their own
       size, in a grid each row the height of its tallest item; the token is the estimate for the rows not rendered)
     axis: "y" (default, a vertical list) or "x" (a horizontal strip)
     grid: true lays items out in rows of as many columns as fit (a CSS grid container); gaps then stand for whole rows
     overscan: how many rows are rendered beyond each edge of the view (default 4)
     sticky: indexes of group headers; the header of the group in view stays rendered (give it VIRTUAL_STICKY_CLASS)
     returns: { viewportRef, segments, itemProps(index), scrollToIndex(index, { align }), range: { start, end }, columns }
     scrollToIndex(index, { align: "nearest" }): scrolls only as far as brings the item into view (none when it is in view),
       for keys that move an active item (issue 815); without it the item goes to the start of the view
     segments: in order, { key, index } for an item to render and { key, gap: true, count } for a run of items (rows, in a
       grid) not rendered
     itemProps(index): data-plx-virtual-index, aria-posinset and aria-setsize for the item (spread them on it)
     VirtualGap: { count, axis }: the stand-in for count items (rows); VirtualProbe: { axis }: measures one item (render it
       first in the viewport)
   Behavior:
     The viewport is in the Tab order (tabIndex 0, unless it has a tabindex of its own), so keyboard users can scroll it;
     name it (aria-label) and give it its role (list, grid, listbox).
     The view follows the scroll position and the viewport's size (a ResizeObserver). The focused item stays rendered
     while it has focus, so keyboard navigation and screen readers do not lose it. With measured items the browser's
     scroll anchoring keeps the content still while gaps replace items of another size.
     Items carry their position in the whole collection (aria-posinset of aria-setsize), so screen readers announce
     "12 of 4,000" even though only a few are in the page.
   Notes:
     Not for short collections (under a few hundred items): render them all. Not where browser find (Ctrl F) over every
     item matters, unless the page offers its own search. DataGrid keeps the table renderer's own rendering.
     The item size token and --plx-sys-virtual-item-gap must match the container's layout: set them in its stylesheet.
     A grid container sizes its rows by their content (no grid-auto-rows): a gap is one grid row across every column.
*/
import React from 'react';
import { isRtl } from '../utils/direction.ts';

export const VIRTUAL_STICKY_CLASS = 'plx-virtual-sticky';

export type VirtualAxis = 'x' | 'y';
export type VirtualSegment = { key: string; index: number; gap?: undefined; count?: undefined } | { key: string; gap: true; count: number; index?: undefined };
export type VirtualGapProps = { count: number; axis?: VirtualAxis };
export type VirtualProbeProps = { axis?: VirtualAxis };
export type VirtualizerOptions = { count?: number; mode?: 'fixed' | 'measured'; axis?: VirtualAxis; grid?: boolean; overscan?: number; sticky?: number[] };

// a count as powers of two: 13 → [8, 4, 1] (one generated rule per power in system/virtual.css)
export function gapPieces(count: number): number[] {
  const out: number[] = [];
  let n = Math.max(0, Math.floor(count));
  for (let p = 1 << 20; p >= 1; p >>= 1) while (n >= p) { out.push(p); n -= p; }
  return out;
}

export function VirtualGap({ count, axis = 'y' }: VirtualGapProps) {
  if (!count) return null;
  return React.createElement('div', { className: 'plx-virtual-gap', 'data-plx-axis': axis, 'aria-hidden': 'true' },
    gapPieces(count).map((p, i) => React.createElement('div', { key: i, className: 'plx-virtual-gap__piece', 'data-plx-axis': axis, 'data-plx-span': String(p) })));
}

export function VirtualProbe({ axis = 'y' }: VirtualProbeProps) {
  return React.createElement('div', { className: 'plx-virtual-probe', 'data-plx-axis': axis, 'data-plx-virtual-probe': '', 'aria-hidden': 'true' });
}

export function useVirtualizer({ count = 0, mode = 'fixed', axis = 'y', grid = false, overscan = 4, sticky }: VirtualizerOptions = {}) {
  const viewportRef = React.useRef<HTMLElement>(null);
  const [view, setView] = React.useState({ offset: 0, size: 0, pitch: 0, columns: 1 });
  const viewNow = React.useRef(view); viewNow.current = view;   // the view of the last render, read by measure
  const [focused, setFocused] = React.useState(-1);
  const sizes = React.useRef(new Map<number, number>());   // measured mode: index → size along the axis
  const shown = React.useRef({ start: 0, end: 0 });   // the rows rendered last
  const horizontal = axis === 'x';

  // reads the scroll position, the viewport's size, one item's pitch (the probe) and, in a grid, the columns
  const measure = React.useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const probe = el.querySelector<HTMLElement>(':scope > [data-plx-virtual-probe]');
    const pitch = probe ? (horizontal ? probe.offsetWidth : probe.offsetHeight) : 0;
    let columns = 1;
    if (grid) {
      const items = el.querySelectorAll<HTMLElement>(':scope > [data-plx-virtual-index]');
      if (items.length) {
        const top = items[0].offsetTop;
        let n = 0;
        while (n < items.length && items[n].offsetTop === top) n++;
        // no wrap seen while more items exist: guess wider, render more and look again
        columns = n === items.length && items.length < count ? Math.min(count, Math.max(n, view.columns * 2)) : n;
      }
    }
    if (mode === 'measured') {
      // a list: each item's own size. A grid: each row's, the tallest of its cards, with the gap between rows (so a gallery of cards of
      // different heights looks as the same cards drawn all at once)
      const rowGap = grid ? parseFloat(getComputedStyle(el).rowGap) || 0 : 0;
      const rowSize = new Map<number, number>();
      el.querySelectorAll<HTMLElement>(':scope > [data-plx-virtual-index]').forEach((it) => {
        const index = Number(it.getAttribute('data-plx-virtual-index')), size = horizontal ? it.offsetWidth : it.offsetHeight;
        if (grid) { const row = Math.floor(index / columns); rowSize.set(row, Math.max(rowSize.get(row) || 0, size + rowGap)); } else sizes.current.set(index, size);
      });
      if (grid) rowSize.forEach((size, row) => sizes.current.set(row, size));
    }
    const offset = Math.abs(horizontal ? el.scrollLeft : el.scrollTop);
    const size = horizontal ? el.clientWidth : el.clientHeight;
    // nothing moved: no update at all. (The layout effect measures after every render; a set state that only bails out in
    // its updater still counts as a nested update, and in a tree whose rows re-render on focus that never settled: issue 815.)
    const was = viewNow.current;
    if (was.offset === offset && was.size === size && was.pitch === pitch && was.columns === columns) return;
    setView((v) => (v.offset === offset && v.size === size && v.pitch === pitch && v.columns === columns ? v : { offset, size, pitch, columns }));
  }, [horizontal, grid, mode, count, view.columns]);

  React.useLayoutEffect(() => { measure(); });
  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;
    // a scroll container people reach with the keyboard (WCAG 2.1.1): in the Tab order unless the page placed it already
    if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
    const onScroll = () => measure();
    const onFocus = (e: FocusEvent) => { const it = (e.target as Element).closest && (e.target as Element).closest('[data-plx-virtual-index]'); setFocused(it && el.contains(it) ? Number(it.getAttribute('data-plx-virtual-index')) : -1); };
    const onBlur = (e: FocusEvent) => { if (!el.contains(e.relatedTarget as Node | null)) setFocused(-1); };
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('focusin', onFocus);
    el.addEventListener('focusout', onBlur);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => measure()) : null;
    if (ro) ro.observe(el);
    return () => { el.removeEventListener('scroll', onScroll); el.removeEventListener('focusin', onFocus); el.removeEventListener('focusout', onBlur); if (ro) ro.disconnect(); };
  }, [measure]);

  const columns = grid ? Math.max(1, view.columns) : 1;
  const rows = Math.ceil(count / columns);
  const pitch = view.pitch || 1;
  // the first row in view. Fixed items: the offset in pitches. Measured items: from the window rendered last, walking
  // through its items' own sizes (the gap before it counts in pitches), so a window that moves keeps the same first
  // item while scroll anchoring shifts the offset by the difference (no back-and-forth between two windows)
  let first: number;
  const last = shown.current;
  if (mode === 'measured' && view.offset >= last.start * pitch) {
    let pos = last.start * pitch, i = last.start;
    while (i < last.end && pos + (sizes.current.get(i) || pitch) <= view.offset) { pos += sizes.current.get(i) || pitch; i++; }
    if (i >= last.end) i += Math.floor((view.offset - pos) / pitch);
    first = Math.min(rows, i);
  } else first = Math.min(rows, Math.floor(view.offset / pitch));
  let fill = 0, covered = 0;
  const target = view.size || pitch * 10;
  while (first + fill < rows && covered < target) {
    covered += mode === 'measured' ? (sizes.current.get(first + fill) || pitch) : pitch;
    fill++;
  }
  const startRow = Math.max(0, first - overscan);
  const endRow = Math.min(rows, first + fill + overscan);   // exclusive
  const start = startRow * columns, end = Math.min(count, endRow * columns);
  shown.current = { start: startRow, end: endRow };

  // rows outside the window that stay rendered: the focused item's row and the sticky header of the group in view
  const pinned: number[] = [];
  if (focused >= 0 && focused < count) pinned.push(Math.floor(focused / columns));
  const header = (sticky || []).filter((i) => i < start).sort((a, b) => b - a)[0];
  if (header !== undefined && !grid) pinned.push(header);

  const segments: VirtualSegment[] = [];
  const rowsOut = [...new Set(pinned)].filter((r) => r < startRow || r >= endRow).sort((a, b) => a - b);
  let at = 0;
  const pushRows = (from: number, to: number) => { for (let i = from * columns; i < Math.min(count, to * columns); i++) segments.push({ key: 'i' + i, index: i }); };
  const pushGap = (from: number, to: number) => { if (to > from) segments.push({ key: 'g' + from, gap: true, count: to - from }); };
  rowsOut.filter((r) => r < startRow).forEach((r) => { pushGap(at, r); pushRows(r, r + 1); at = r + 1; });
  pushGap(at, startRow);
  pushRows(startRow, endRow);
  at = endRow;
  rowsOut.filter((r) => r >= endRow).forEach((r) => { pushGap(at, r); pushRows(r, r + 1); at = r + 1; });
  pushGap(at, rows);

  const itemProps = React.useCallback((index: number) => ({ 'data-plx-virtual-index': index, 'aria-posinset': index + 1, 'aria-setsize': count }), [count]);
  const scrollToIndex = React.useCallback((index: number, options?: { align?: 'start' | 'nearest' }) => {
    const el = viewportRef.current;
    if (!el) return;
    let offset = Math.floor(index / columns) * pitch;
    // align "nearest" (issue 815: the keys move the active row): scroll only as far as brings the row into view
    if (options && options.align === 'nearest') {
      const now = Math.abs(horizontal ? el.scrollLeft : el.scrollTop), size = horizontal ? el.clientWidth : el.clientHeight;
      if (offset >= now && offset + pitch <= now + size) return;
      if (offset + pitch > now + size) offset = offset + pitch - size;
    }
    if (horizontal) el.scrollLeft = isRtl(el) ? -offset : offset; else el.scrollTop = offset;
    measure();
  }, [columns, pitch, horizontal, measure]);

  return { viewportRef, segments, itemProps, scrollToIndex, range: { start, end }, columns };
}
