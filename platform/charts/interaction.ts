/* Plenix · Chart interaction (platform/charts/interaction.ts)
   Summary: How people explore a Plenix chart (07 Data Display › Charts › Chart interaction): one Tab stop per chart, the
     arrow keys move between the values (columns across, series or rows up and down), the value in focus or under the
     pointer shows the ChartTooltip and is said in the live region, a crosshair follows lines and areas, a click or Enter
     selects a value, legend toggles show and hide series, and a brush (a drag, or Shift with the arrow keys) zooms to a
     range with a Reset zoom button to come back. The charts of wave 9 build on it; ChartFrame wires it to its plot.
   Usage:
     const ia = useChartInteraction({ rows: series.length, columns: data.length, series, zoom: true, select: true,
       describe: ({ r, c }) => chartTooltipText({ title: labels[c], items: … }), labelOf: (c) => labels[c], onSelect });
     <ChartFrame title="…" interaction={ia} legend={<ChartLegend items={items} {...ia.legendProps} />}>
       {({ inner }) => { ia.register({ nearest: (x, y) => …, columnAt: (x) => … }); … ia.active ? <ChartTooltip … /> : null }}
     </ChartFrame>
     <ChartFocusMark x={x} y={y} color={seriesColor(r)} />        // the value in focus, on its mark
     {ia.brush ? <ChartBrush x0={x(ia.brush[0])} x1={x(ia.brush[1])} inner={inner} /> : null}
   Props:
     useChartInteraction(options) → the chart's interaction (pass it to ChartFrame's interaction prop). options:
       rows: the number of series (line, area) or rows (heat map) (default 1)
       columns: the number of values per row: x positions, cells, words, nodes (required)
       mode: "x" (default: a column at a time, every series at that x: line and area, the shared tooltip) | "point" (one
         value at a time; the other series are dimmed: heat maps, scatter, network nodes)
       series: [{ id, label }] in the rows' order, for the legend toggles (legendProps) and the announcements
       defaultHidden: ids of the series hidden at first; hidden / onToggle(id, visible): the parent controls them
       zoom: a brush zooms to a range of columns (default false); select: Enter, Space or a click selects (default false)
       onSelect({ r, c }): runs when a value is selected (a click on a point, Enter)
       describe({ r, c }): the sentence the live region says for a value (chartTooltipText(…) of the tooltip it shows)
       labelOf(c): a column's name, for the zoom announcements ("Mar")
       move(active, key, { shift }): custom navigation for charts that are not a grid (a network: the next connected
         node in the arrow's direction); returns the next { r, c } or null to stay
       first(): the value the first arrow key goes to (default the first column of the first series shown)
       strings: the words it says, for other languages (STRINGS below)
     The interaction it returns: active ({ r, c } or null: the value under the pointer or in focus), source ("pointer" |
       "keyboard"), selected, brush ([from, to] columns while marking a range), zoom ([from, to] or null), view() →
       [from, to] the columns shown, visible(id), hidden, legendProps ({ interactive, hidden, onToggle }), isDimmed(r),
       register(geometry), setActive, select, resetZoom, and the handlers ChartFrame attaches to the plot.
     ChartFocusMark({ x, y, color, className }): the ring on the value in focus (geometry only)
     ChartBrush({ x0, x1, inner, className }): the marked range, shaded down the plot
     chartAnnounce(text): says a sentence in the page's polite live region (announce)
   Behavior:
     Keyboard: Tab reaches the plot once; ← → move along the columns, ↑ ↓ between the series or rows (hidden series are
       skipped), Home and End go to the first and last column shown; Enter or Space selects (select), Escape clears.
       With zoom, Shift + ← → marks a range from the value in focus and Enter zooms to it; Reset zoom (a button above the
       plot) shows everything again. Each move says the value in the live region (polite).
     Pointer: moving over the plot shows the nearest value (mode "x": the nearest column); a click selects it; with
       zoom, a drag across the plot marks a range and zooms to it when released.
     The tooltip and the ring stay inside the plot; they are hidden from assistive technology like the rest of the plot:
       the live region and the data grid carry the values. Leaving the plot or Escape clears them.
   Notes:
     Geometry stays in the chart: register() gives the interaction the chart's nearest() and columnAt() for the
       pointer; the interaction keeps indices, so a resize or a zoom never loses the value in focus.
     Dimming, the ring, the brush and the focus border are CSS on chart-interaction tokens (chart-interaction.css);
       transitions use the motion tokens, so reduced motion removes them.
*/
import React from 'react';
import { announce } from '../utils/announce.tsx';
import { cx } from '../utils/cx.ts';
import { fill } from '../utils/fill.ts';

export const CHART_INTERACTION_STRINGS = Object.freeze({
  hint: 'Use the arrow keys to move between the values.',
  hintSelect: ' Enter selects a value.',
  hintZoom: ' Shift with the left and right arrow keys marks a range; Enter zooms to it.',
  plot: '{title}, interactive chart',
  resetZoom: 'Reset zoom',
  zoomed: 'Showing {from} to {to}.',
  zoomReset: 'Showing all values.',
  range: 'From {from} to {to}. Press Enter to zoom.',
  shown: '{name} shown',
  hidden: '{name} hidden',
  selected: 'Selected. {text}',
});

const clamp = (v: any, lo: any, hi: any) => Math.min(hi, Math.max(lo, v));

export function chartAnnounce(text: string) { if (text) announce(text); }

/** @public a value of the chart: row (series) and column (position) */
export type ChartCell = { r: number; c: number };
/** @public the options of useChartInteraction */
export type ChartInteractionOptions = {
  rows?: number;
  columns?: number;
  mode?: 'x' | 'point';
  series?: Array<{ id: string | number; label?: string }>;
  defaultHidden?: Array<string | number>;
  hidden?: Array<string | number>;
  onToggle?(id: string | number, visible: boolean): void;
  zoom?: boolean;
  select?: boolean;
  onSelect?(cell: ChartCell): void;
  describe?(cell: ChartCell): string;
  labelOf?(column: number): string;
  move?(active: ChartCell, key: string, modifiers: { shift: boolean; view?: [number, number] }): ChartCell | null;
  first?(): ChartCell | null;
  strings?: Record<string, string>;
};
/** @public the geometry a chart registers: the value nearest a point, and the column at an x */
export type ChartGeometry = { nearest?(x: number, y: number): ChartCell | null; columnAt?(x: number): number | null };
/** @public a key press, as far as the interaction reads it */
export type ChartKeyEvent = { key: string; shiftKey?: boolean; preventDefault(): void };
/** @public what useChartInteraction returns: pass it to ChartFrame as `interaction` */
export type ChartInteraction = {
  interactive: true;
  mode: 'x' | 'point';
  active: ChartCell | null;
  source: 'pointer' | 'keyboard' | null;
  selected: ChartCell | null;
  brush: [number, number] | null;
  zoom: [number, number] | null;
  zoomed: boolean;
  focused: boolean;
  hidden: Array<string | number>;
  strings: Record<string, string>;
  hint: string;
  view(): [number, number];
  visible(id: string | number): boolean;
  isDimmed(row: number): boolean;
  legendProps: { interactive: true; hidden: Array<string | number>; onToggle(id: string | number, visible: boolean): void };
  register(geometry: ChartGeometry): void;
  setActive(cell: ChartCell | null, from?: 'pointer' | 'keyboard'): void;
  select(cell: ChartCell | null): void;
  resetZoom(): void;
  setZoom(from: number, to: number): void;
  keyDown(event: ChartKeyEvent): void;
  pointerDown(x: number, y: number, event?: { button?: number }): void;
  pointerMove(x: number, y: number): void;
  pointerUp(x: number, y: number): void;
  pointerLeave(): void;
  onFocus(): void;
  onBlur(): void;
};
export function useChartInteraction({ rows = 1, columns = 0, mode = 'x', series, defaultHidden = [], hidden: hiddenProp, onToggle,
  zoom = false, select = false, onSelect, describe, labelOf, move, first, strings }: ChartInteractionOptions = {}): ChartInteraction {
  const t = Object.assign({}, CHART_INTERACTION_STRINGS, strings);
  const [active, setActiveState] = React.useState<any>(null);
  const [source, setSource] = React.useState<any>(null);
  const [selected, setSelected] = React.useState<any>(null);
  const [brush, setBrush] = React.useState<any>(null);
  const [zoomRange, setZoom] = React.useState<any>(null);
  const [ownHidden, setOwnHidden] = React.useState(defaultHidden);
  const [focused, setFocused] = React.useState(false);
  const geometry = React.useRef<any>(null);
  const drag = React.useRef<any>(null);
  const hidden = hiddenProp === undefined ? ownHidden : hiddenProp;
  const ids = (series || []).map((s: any, i: any) => (s.id === undefined ? i : s.id));
  const rowShown = (r: any) => !ids.length || hidden.indexOf(ids[r]) < 0;
  const n = Math.max(0, columns);
  const view = (): [number, number] => (zoomRange ? [clamp(zoomRange[0], 0, n - 1), clamp(zoomRange[1], 0, n - 1)] : [0, Math.max(0, n - 1)]);
  const say = (cell: any) => { if (cell && typeof describe === 'function') chartAnnounce(describe(cell)); };
  const label = (c: any) => (typeof labelOf === 'function' ? labelOf(c) : String(c + 1));

  const setActive = (cell: any, from: any) => {
    setActiveState((a: any) => (a && cell && a.r === cell.r && a.c === cell.c ? a : cell));
    if (from) setSource(from);
  };
  const doSelect = (cell: any) => {
    if (!select || !cell) return;
    setSelected(cell);
    if (typeof onSelect === 'function') onSelect(cell);
    if (typeof describe === 'function') chartAnnounce(fill(t.selected, { text: describe(cell) }));
  };
  const applyZoom = (a: any, b: any) => {
    const from = Math.min(a, b), to = Math.max(a, b);
    if (to <= from) { setBrush(null); return; }
    setZoom([from, to]); setBrush(null);
    setActiveState((x: any) => (x && (x.c < from || x.c > to) ? { r: x.r, c: from } : x));
    chartAnnounce(fill(t.zoomed, { from: label(from), to: label(to) }));
  };
  const resetZoom = () => { setZoom(null); setBrush(null); chartAnnounce(t.zoomReset); };
  const firstRow = () => { for (let r = 0; r < rows; r++) if (rowShown(r)) return r; return 0; };
  const stepRow = (r: any, d: any) => { for (let k = r + d; k >= 0 && k < rows; k += d) if (rowShown(k)) return k; return r; };

  const keyDown = (e: any) => {
    const k = e.key;
    const [v0, v1] = view();
    const cur = active && rowShown(active.r) ? active : null;
    let next: any = null;
    if (k === 'Escape') {
      if (brush) { setBrush(null); e.preventDefault(); return; }
      if (cur || selected) { setActiveState(null); setSelected(null); e.preventDefault(); }
      return;
    }
    if ((k === 'Enter' || k === ' ') && (zoom && brush || select)) {
      e.preventDefault();
      if (zoom && brush) applyZoom(brush[0], brush[1]);
      else doSelect(cur);
      return;
    }
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].indexOf(k) < 0) return;
    e.preventDefault();
    const start = { r: firstRow(), c: v0 };
    if (zoom && e.shiftKey && (k === 'ArrowLeft' || k === 'ArrowRight') && cur && !move) {
      const anchor = brush ? brush[0] : cur.c;
      const end = clamp((brush ? brush[1] : cur.c) + (k === 'ArrowRight' ? 1 : -1), v0, v1);
      setBrush([anchor, end]);
      setActive({ r: cur.r, c: end }, 'keyboard');
      chartAnnounce(fill(t.range, { from: label(Math.min(anchor, end)), to: label(Math.max(anchor, end)) }));
      return;
    }
    if (brush) setBrush(null);
    if (!cur) next = typeof first === 'function' ? first() || start : start;
    else if (typeof move === 'function') next = move(cur, k, { shift: e.shiftKey, view: [v0, v1] }) || cur;
    else if (k === 'ArrowLeft') next = { r: cur.r, c: clamp(cur.c - 1, v0, v1) };
    else if (k === 'ArrowRight') next = { r: cur.r, c: clamp(cur.c + 1, v0, v1) };
    else if (k === 'Home') next = { r: cur.r, c: v0 };
    else if (k === 'End') next = { r: cur.r, c: v1 };
    else if (k === 'ArrowUp') next = { r: stepRow(cur.r, -1), c: cur.c };
    else next = { r: stepRow(cur.r, 1), c: cur.c };
    setActive(next, 'keyboard');
    say(next);
  };

  const nearest = (x: any, y: any) => (geometry.current && typeof geometry.current.nearest === 'function' ? geometry.current.nearest(x, y) : null);
  const columnAt = (x: any) => {
    if (geometry.current && typeof geometry.current.columnAt === 'function') return geometry.current.columnAt(x);
    const cell = nearest(x, 0); return cell ? cell.c : null;
  };
  const pointerDown = (x: any, y: any, e: any) => {
    if (!zoom || (e && e.button !== undefined && e.button !== 0)) return;
    const c = columnAt(x);
    if (c === null || c === undefined) return;
    drag.current = { from: c, moved: false };
  };
  const pointerMove = (x: any, y: any) => {
    if (drag.current) {
      const c = columnAt(x);
      if (c !== null && c !== undefined && c !== drag.current.from) { drag.current.moved = true; setBrush([drag.current.from, c]); }
    }
    const cell = nearest(x, y);
    if (cell && rowShown(cell.r)) setActive(cell, 'pointer');
    else if (!focused || source === 'pointer') setActiveState(null);
  };
  const pointerUp = (x: any, y: any) => {
    const d = drag.current; drag.current = null;
    if (d && d.moved) { const c = columnAt(x); applyZoom(d.from, c === null || c === undefined ? d.from : c); return; }
    const cell = nearest(x, y);
    if (cell && rowShown(cell.r)) doSelect(cell);
  };
  const pointerLeave = () => { drag.current = null; if (!focused || source === 'pointer') setActiveState(null); };
  const onFocus = () => setFocused(true);
  const onBlur = () => { setFocused(false); setActiveState(null); setBrush(null); };

  const toggle = (id: any, visible: any) => {
    if (hiddenProp === undefined) setOwnHidden((h: Array<string | number>) => (visible ? h.filter((x) => x !== id) : h.concat([id])));
    if (typeof onToggle === 'function') onToggle(id, visible);
    const s = (series || []).find((x: any, i: any) => (x.id === undefined ? i : x.id) === id);
    chartAnnounce(fill(visible ? t.shown : t.hidden, { name: s ? s.label : id }));
    setActiveState((a: any) => (a && ids[a.r] === id && !visible ? null : a));
  };

  return {
    interactive: true, mode, active, source, selected, brush, zoom: zoomRange, zoomed: !!zoomRange, focused, hidden, strings: t,
    hint: t.hint + (select ? t.hintSelect : '') + (zoom && !move ? t.hintZoom : ''),
    view, visible: (id: any) => hidden.indexOf(id) < 0, isDimmed: (r: any) => mode === 'point' && !!active && active.r !== r,
    legendProps: { interactive: true, hidden, onToggle: toggle },
    register: (g: any) => { geometry.current = g; },
    setActive, select: doSelect, resetZoom, setZoom: applyZoom,
    keyDown, pointerDown, pointerMove, pointerUp, pointerLeave, onFocus, onBlur,
  };
}

/** @public */
export type ChartFocusMarkProps = { x: number; y: number; color?: string; className?: string };
export function ChartFocusMark({ x, y, color, className }: ChartFocusMarkProps) {
  if (x === undefined || x === null || y === undefined || y === null || isNaN(x) || isNaN(y)) return null;
  return React.createElement('circle', { className: cx('plx-chart-focus', className), 'data-plx-dataviz': color || undefined, cx: x, cy: y });
}

/** @public */
export type ChartBrushProps = { x0: number; x1: number; inner: { width: number; height: number }; className?: string };
export function ChartBrush({ x0, x1, inner, className }: ChartBrushProps) {
  if (x0 === undefined || x1 === undefined || !inner) return null;
  const a = Math.min(x0, x1), b = Math.max(x0, x1);
  return React.createElement('rect', { className: cx('plx-chart-brush', className), x: a, y: 0, width: Math.max(0, b - a), height: inner.height });
}
