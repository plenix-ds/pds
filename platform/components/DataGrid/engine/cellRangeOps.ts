/* Plenix · DataGrid engine · cell range operations (loaded when first used)
   Summary: The heavy half of cell range selection (issue 465): where a Shift and arrow press moves the end of the block, the block as
     tab-separated text, the counts, what onCellSelectionChange is told, and the words a screen reader hears. useCellRange.js keeps the
     range and its rectangle (what every cell draws from) and loads this file with one dynamic import the first time a person extends a
     block, so a grid that never uses the option, and the npm package's first load, do not carry it.
   Usage:
     import('./cellRangeOps.ts').then((ops) => { ops.use({ cellText, announce, formatNumber }); ... });   // the grid's helpers, handed in
     import('./cellRangeOps.ts').then((ops) => ops.extendTo({ range, row, c, key, rtl, rowAt, model, ordered }));
     ops.textOf(rect, model, ordered); ops.countOf(rect, model); ops.detailsOf({ rect, model, ordered, index }); ops.said(loc, key, n)
   Props:
     range: { anchor, focus }, each { key: the row's id, field: the column's id }; rect: { r0, r1, c0, c1 } in model and column order;
     rowAt: Map from a row's id to its place in model; model: the rows the grid shows; ordered: the visible columns, in order; index: the records' key field;
     rtl: the grid's direction; loc: the locale (t); key: the pressed key; n: a count.
   Behavior:
     The rules are the ones documented in useCellRange.js: the arrows are mirrored in right to left, group rows have no cells and are skipped, a block
       never leaves the grid, and the copy is every record between the block's first and last row (a cell with a tab, a line break or a quote is quoted).
   Notes:
     In the iife builds (the CDN script, the applications) the dynamic import is inlined by the bundler (inlineDynamicImports), so the pages that open from
       file:// need no second file; the npm package splits it into a chunk.
*/
// The grid's own helpers (a cell's text, a count in words, the polite announcement) are handed in by useCellRange.js, not imported here: this file
// stays a leaf, so the chunk the npm package splits it into does not point back into the engine's.
/** a cell of the grid: its row's id and its column's id */
export type CellPoint = { key: string; field: string };
/** the block: where it began and where its focus end is */
export type CellRange = { anchor: CellPoint; focus: CellPoint };
/** the block as a rectangle in model and column order */
export type CellRect = { r0: number; r1: number; c0: number; c1: number };
type ModelRow = { id: string; original?: Record<string, unknown> };
type OrderedColumn = { id: string };
type RangeHelpers = { cellText: (record: Record<string, unknown>, id: string) => string; announce: (text: string) => void; formatNumber: (n: number) => string };
let helpers: RangeHelpers;
export const use = (given: RangeHelpers): void => { helpers = given; };

// a spreadsheet's text: cells by tab, rows by line break; a cell with a tab, a line break or a quote is quoted, its quotes doubled
const quoted = (text: string): string => (/[\t\n\r"]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text);

export const textOf = (r: CellRect | null, rows: ModelRow[], cols: OrderedColumn[]): string => {
  if (!r) return '';
  const lines: string[] = [];
  for (let i = r.r0; i <= r.r1; i += 1) {
    const row = rows[i];
    if (!row || !row.original) continue;
    lines.push(cols.slice(r.c0, r.c1 + 1).map((c) => quoted(helpers.cellText(row.original as Record<string, unknown>, c.id))).join('\t'));
  }
  return lines.join('\n');
};
// the records between the first and last row of the block (group rows have none)
export const rowsIn = (r: CellRect | null, rows: ModelRow[]): number => {
  let n = 0;
  if (r) for (let i = r.r0; i <= r.r1; i += 1) if (rows[i] && rows[i].original) n += 1;
  return n;
};
export const countOf = (r: CellRect | null, rows: ModelRow[]): number => (r ? rowsIn(r, rows) * (r.c1 - r.c0 + 1) : 0);
export const detailsOf = ({ rect, model, ordered, index }: { rect: CellRect; model: ModelRow[]; ordered: OrderedColumn[]; index: string }) => ({
  from: { rowId: (model[rect.r0].original as Record<string, unknown>)[index], field: ordered[rect.c0].id },
  to: { rowId: (model[rect.r1].original as Record<string, unknown>)[index], field: ordered[rect.c1].id },
  cellCount: countOf(rect, model), rowCount: rowsIn(rect, model), columnCount: rect.c1 - rect.c0 + 1, fields: ordered.slice(rect.c0, rect.c1 + 1).map((c) => c.id)
});
export const said = (loc: { t: (key: string, values: Record<string, unknown>) => string }, key: string, n: number): void => helpers.announce(loc.t(key, { count: n, n: helpers.formatNumber(n) }));

// Shift with an arrow, Home or End: the focus end of the block moves, the anchor stays where the block began. The focus end is the block's own
// (not the cell that has DOM focus): focus follows a frame later, and keys that repeat must not start from where it still is. When keyboard focus is on
// a cell the block never reached (moved there by script, or by any means other than these keys: trail is the cells its focus end has been on), the block's
// focus end and the DOM focus disagree, so the old block ends and a new one starts from the cell that has focus.
// Returns { range, nr, nc, step, trail } (the new range, the cell to focus, the cells reached), { collapse: true } when nothing moves and an old block
// elsewhere ends, or null when nothing moves.
export const extendTo = ({ range, trail, row, c, key, rtl, rowAt, model, ordered }: { range: CellRange | null; trail: Set<string> | null; row: { id: string }; c: { field: string }; key: string; rtl: boolean; rowAt: Map<string, number>; model: ModelRow[]; ordered: OrderedColumn[] }) => {
  const here = { key: row.id, field: c.field };
  const cont = range && trail && trail.has(here.key + '|' + here.field) ? range : null;
  const from = cont ? cont.focus : here;
  const r = rowAt.get(from.key), at = ordered.findIndex((x) => x.id === from.field);
  if (r === undefined || at < 0) return null;
  let nr = r, nc = at;
  if (key === 'ArrowDown') nr = r + 1;
  else if (key === 'ArrowUp') nr = r - 1;
  else if (key === 'ArrowLeft') nc = at + (rtl ? 1 : -1);
  else if (key === 'ArrowRight') nc = at + (rtl ? -1 : 1);
  else if (key === 'Home') nc = 0;
  else if (key === 'End') nc = ordered.length - 1;
  else return null;
  const step = nr < r ? -1 : 1;
  while (model[nr] && !model[nr].original) nr += step;   // a group row has no cells: skip it
  nc = Math.max(0, Math.min(ordered.length - 1, nc));
  if (!model[nr] || !model[nr].original || (nr === r && nc === at)) return range && !cont ? { collapse: true } : null;   // the edge: nothing moves (an old block elsewhere ends)
  const reached = (cont ? trail : new Set([here.key + '|' + here.field])) as Set<string>;
  reached.add(model[nr].id + '|' + ordered[nc].id);
  return { range: { anchor: cont ? cont.anchor : here, focus: { key: model[nr].id, field: ordered[nc].id } }, nr, nc, step, trail: reached };
};

// ---- the pointer (issue 465, part 2): Shift with a click, and a drag
// the cell under a point of the page: { key: the row's id, field: the column's id }, or null when it is not a cell of this grid
export const cellAt = (x: number, y: number, frame: HTMLElement | null): CellPoint | null => {
  const el = document.elementFromPoint(x, y), cell = el && el.closest('[role="gridcell"][data-plx-field]'), row = cell && cell.closest('[data-plx-record]');
  if (!cell || !row || !frame || !frame.contains(cell)) return null;
  return { key: row.getAttribute('data-plx-record') as string, field: cell.getAttribute('data-plx-field') as string };
};
// the cell that has keyboard focus: where a Shift with a click starts a block when there is none
export const focusedCell = (frame: HTMLElement | null): CellPoint | null => {
  const cell = document.activeElement && document.activeElement.closest && document.activeElement.closest('[role="gridcell"][data-plx-field]'), row = cell && cell.closest('[data-plx-record]');
  return cell && row && frame && frame.contains(cell) ? { key: row.getAttribute('data-plx-record') as string, field: cell.getAttribute('data-plx-field') as string } : null;
};

const EDGE = 32;   // how near a scroll edge the pointer has to be, in pixels, before the grid scrolls under it
const MOST = 24;   // the most it scrolls in one frame
const toward = (v: number, lo: number, hi: number): number => (v < lo + EDGE ? Math.max(-MOST, (v - lo - EDGE) / 2) : v > hi - EDGE ? Math.min(MOST, (v - hi + EDGE) / 2) : 0);

// A drag from a cell with the primary mouse button: the block follows the pointer over the cells, the grid scrolls when the pointer is near its edge
// (the rows and columns drawn change under it: the cell under the pointer is read again each frame), and a release ends it. isDown says whether the
// button is still pressed (the operations may load after a quick release: then there is no drag). onMove(range, cell) on each new cell, onEnd(cell) once.
// Returns a function that stops it.
export const beginDrag = ({ anchor, frame, scroller, rowAt, ordered, isDown, onMove, onEnd }: { anchor: CellPoint; frame: HTMLElement | null; scroller: HTMLElement | null; rowAt: Map<string, number>; ordered: OrderedColumn[]; isDown: () => boolean; onMove: (range: CellRange, cell: CellPoint) => void; onEnd: (cell: CellPoint, moved: boolean) => void }): (() => void) => {
  if (!isDown()) return () => {};
  let last = anchor, frameId = 0, x = 0, y = 0, moved = false;
  const hit = () => {
    const c = cellAt(x, y, frame);
    if (!c || !rowAt.has(c.key) || !ordered.some((col) => col.id === c.field) || (c.key === last.key && c.field === last.field)) return;
    last = c; moved = true; onMove({ anchor, focus: c }, c);
  };
  const edge = () => {
    if (!scroller) return;
    const r = scroller.getBoundingClientRect(), dy = toward(y, r.top, r.bottom), dx = toward(x, r.left, r.right);
    if (!dx && !dy) { frameId = 0; return; }
    scroller.scrollTop += dy; scroller.scrollLeft += dx; hit();
    frameId = requestAnimationFrame(edge);
  };
  const move = (e: MouseEvent) => { if (e.buttons === 0) { up(); return; } x = e.clientX; y = e.clientY; hit(); if (!frameId) edge(); };   // no button down: released outside the window, the drag ends
  const nothing = (e: Event) => e.preventDefault();   // no text selection while dragging
  const stop = () => {
    window.removeEventListener('mousemove', move, true); window.removeEventListener('mouseup', up, true); document.removeEventListener('selectstart', nothing, true);
    if (frameId) cancelAnimationFrame(frameId);
  };
  const up = () => { stop(); onEnd(last, moved); };
  window.addEventListener('mousemove', move, true); window.addEventListener('mouseup', up, true); document.addEventListener('selectstart', nothing, true);
  return stop;
};
