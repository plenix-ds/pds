/* Plenix · DataGrid engine · cell range selection
   Summary: The block of cells a person selects with Shift and the arrow keys (issue 465, owner, 2026-11-01: an option, off by default):
     the range itself (an anchor cell and the cell that has focus, each a row and a column), the rectangle it covers in the order the
     grid shows rows and columns, what Ctrl or Command with C copies (the block as tab-separated text that Excel and Google Sheets paste as
     rows and columns), and what a screen reader hears (how many cells are selected, how many were copied).
   Usage:
     import { useCellRange } from './engine/useCellRange.js';
     const cellRange = useCellRange({ enabled: !!props.cellSelection && !isStatic, model, ordered, index, onChange: props.onCellSelectionChange });
     cellRange.rect                      // { r0, r1, c0, c1 } in model and column order, or null (no range, or one cell)
     cellRange.cellClasses(rowIndex, columnIndex)   // { inside, top, bottom, start, end } for one cell
     cellRange.extend({ row, c, key, rtl, focusCell })   // Shift + an arrow, Home or End on a cell
     cellRange.collapse(); cellRange.copy(); cellRange.read()
   Props:
     enabled: the grid's cellSelection option; false makes every method do nothing and the grid behave as it did before.
     model: the rows the grid shows (group rows included; they have no record and no cells); ordered: the visible columns, in order;
     index: the records' key field; onChange(details): the grid's onCellSelectionChange ({ from, to, cellCount, rowCount, columnCount, fields }, or null when the block ends).
   Behavior:
     The range is kept as keys (a row's id and a column's id), so it survives scrolling and virtualization; the copy reads the grid's data, not
     the page, so a block of any size copies at once. One cell is not a range: with the anchor and the focus on the same cell there is no
     rectangle. Shift with an arrow moves the focus end one cell (the focus cell scrolls into view and keeps keyboard focus); Shift with Home
     or End goes to the first or last column of the row; when focus is on a cell the block never reached (moved there by script), Shift
     with an arrow starts a new block from that cell; Escape, a plain arrow or a mouse press on a cell collapses the block to the active cell. In right to
     left the arrows are mirrored, and so are the block's start and end edges (they are logical).
     The count is announced politely once the arrow keys pause (400 ms), never once per key press while Shift and an arrow repeat.
   Notes:
     The rules of moving the block, the copy's text, the counts and the announcements are in cellRangeOps.js, loaded with one dynamic import the first
       time a block is extended (the npm package splits it into a chunk, so a grid without the option does not carry it; the iife builds inline it).
     Moved to its own file with the other concerns of the engine (issue 714); the rule that nothing changes for a grid without the option is
     proved by the engine's differential probe, run with the option off.
*/
import React from 'react';
import { useLocale } from '../../../providers/LocaleProvider.tsx';
import { announce } from '../../../utils/announce.tsx';
import { formatNumber } from '../../../utils/format.ts';
import { valueAt } from '../state.ts';
import { valueText } from '../cells.jsx';

// the operations, loaded on first use (a block can only exist once they are loaded, so everything but the first extend finds them ready)
let ops = null, loading = null;
const load = () => loading || (loading = import('./cellRangeOps.js').then((m) => { m.use({ cellText: (record, id) => valueText(valueAt(record, id)), announce, formatNumber }); return (ops = m); }));
const run = (fn) => (ops ? fn(ops) : load().then(fn));   // in order: presses before the load finishes are applied one after another

export function useCellRange({ enabled, model, ordered, index, onChange, frame, scroller }) {
  const loc = useLocale();
  const [range, setRangeState] = React.useState(null);
  const told = React.useRef(false);   // onChange has been given a range: it is told when the range ends too
  const down = React.useRef(false);   // the primary mouse button is down on a cell
  const latest = React.useRef({}), rangeRef = React.useRef(null), trail = React.useRef(null);   // trail: the cells the block's focus end has been on ('rowId|field'), anchor included
  const setRange = (next) => { rangeRef.current = typeof next === 'function' ? next(rangeRef.current) : next; setRangeState(rangeRef.current); };

  // the position of each record row in the model (group rows have no cells)
  const rowAt = React.useMemo(() => {
    const at = new Map();
    if (enabled) model.forEach((row, i) => { if (row.original) at.set(row.id, i); });
    return at;
  }, [enabled, model]);
  const rect = React.useMemo(() => {
    if (!enabled || !range) return null;
    const a = rowAt.get(range.anchor.key), f = rowAt.get(range.focus.key);
    const ca = ordered.findIndex((c) => c.id === range.anchor.field), cf = ordered.findIndex((c) => c.id === range.focus.field);
    if (a === undefined || f === undefined || ca < 0 || cf < 0) return null;
    const r = { r0: Math.min(a, f), r1: Math.max(a, f), c0: Math.min(ca, cf), c1: Math.max(ca, cf) };
    return r.r0 === r.r1 && r.c0 === r.c1 ? null : r;
  }, [enabled, range, rowAt, ordered]);
  latest.current = { range, rect, model, ordered, index, onChange, rowAt };

  // what the caller is told, and how many cells are selected once the keys pause (Shift and an arrow repeat: one announcement, not one per press)
  React.useEffect(() => {
    if (!enabled) return undefined;
    const { onChange: tell } = latest.current;
    if (!rect) { if (told.current) { told.current = false; if (tell) tell(null); } return undefined; }
    if (!ops) return undefined;   // a rectangle exists only after the operations are loaded
    if (tell) { told.current = true; tell(ops.detailsOf({ rect, model, ordered, index })); }
    const timer = setTimeout(() => ops.said(loc, 'dataGrid.cellsSelected', ops.countOf(rect, model)), 400);
    return () => clearTimeout(timer);
  }, [rect]);   // eslint-disable-line react-hooks/exhaustive-deps

  const none = { rect: null, enabled: false, range: null, cellClasses: () => null, extend: () => false, press: () => {}, collapse: () => {}, copy: () => false, read: () => null };
  if (!enabled) return none;

  const collapse = () => setRange((old) => (old ? null : old));
  const text = () => (ops && rect ? ops.textOf(rect, model, ordered) : '');
  const copy = () => {
    const t = text();
    if (!t) return false;
    try { if (navigator.clipboard) navigator.clipboard.writeText(t); } catch (e) { /* the browser refused the clipboard: nothing to say */ }
    ops.said(loc, 'dataGrid.cellsCopied', ops.countOf(rect, model));
    return true;
  };
  // Shift with an arrow, Home or End (the rules are in cellRangeOps.js). The press is always taken; the block moves once the operations are loaded,
  // from the block's own latest range (so keys that repeat before a frame has drawn still start from where the last one ended)
  const extend = ({ row, c, key, rtl, focusCell }) => {
    run((o) => {
      const now = latest.current, moved = o.extendTo({ range: rangeRef.current, trail: trail.current, row, c, key, rtl, rowAt: now.rowAt, model: now.model, ordered: now.ordered });
      if (!moved) return;
      if (moved.collapse) { collapse(); return; }
      trail.current = moved.trail;
      setRange(moved.range);
      focusCell(moved.nr, moved.nc, moved.step);
    });
    return true;
  };
  // a press on a cell (the option cellSelection): Shift with a click makes the block from where it began (or the cell that has focus) to this cell; a plain
  // press ends the block and, as the pointer moves over other cells with the button down, starts a new one from this cell (the rules are in cellRangeOps.js)
  const press = ({ e, row, c, focusCell }) => {
    if (e.button !== 0) return;
    const cell = { key: row.id, field: c.field };
    const reach = (range, to, from) => {
      const now = latest.current;
      if (from || !trail.current) trail.current = new Set([range.anchor.key + '|' + range.anchor.field]);   // a new block starts its trail at its anchor
      trail.current.add(to.key + '|' + to.field);
      setRange(range);
      return [now.rowAt.get(to.key), now.ordered.findIndex((x) => x.id === to.field)];
    };
    if (e.shiftKey) {
      e.preventDefault();   // Shift with a click would select text
      run((o) => {
        const anchor = (rangeRef.current && rangeRef.current.anchor) || o.focusedCell(frame && frame.current) || cell;
        const [r, k] = reach({ anchor, focus: cell }, cell, true);
        if (r !== undefined && k >= 0) focusCell(r, k);
      });
      return;
    }
    collapse();
    down.current = true;
    const release = () => { down.current = false; window.removeEventListener('mouseup', release, true); };
    window.addEventListener('mouseup', release, true);
    let began = false;
    run((o) => o.beginDrag({
      anchor: cell, frame: frame && frame.current, scroller: scroller && scroller.current, rowAt: latest.current.rowAt, ordered: latest.current.ordered, isDown: () => down.current,
      onMove: (range, to) => { reach(range, to, !began); began = true; },
      onEnd: (last, moved) => { if (!moved) return; const now = latest.current, r = now.rowAt.get(last.key), k = now.ordered.findIndex((x) => x.id === last.field); if (r !== undefined && k >= 0) focusCell(r, k); },
    }));
  };
  const cellClasses = (rowIndex, columnIndex) => {
    if (!rect || rowIndex < rect.r0 || rowIndex > rect.r1 || columnIndex < rect.c0 || columnIndex > rect.c1) return null;
    return { inside: true, top: rowIndex === rect.r0, bottom: rowIndex === rect.r1, start: columnIndex === rect.c0, end: columnIndex === rect.c1 };
  };
  // what the adapter reads: the block as rows and columns of records and fields
  const read = () => {
    if (!rect || !ops) return null;
    const rows = [];
    for (let i = rect.r0; i <= rect.r1; i += 1) if (model[i] && model[i].original) rows.push(model[i].original);
    return { rows, fields: ordered.slice(rect.c0, rect.c1 + 1).map((c) => c.id), text: text() };
  };
  return { enabled: true, rect, range, rowAt, cellClasses, extend, press, collapse, copy, read };
}
