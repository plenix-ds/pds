/* Plenix · Chart accessibility (platform/charts/a11y.js)
   Summary: The helpers behind the chart accessibility rules (07 Data Display › Charts › Chart accessibility): a summary
     sentence of a series for the chart's description (summarizeSeries), textures that tell series apart without their
     color (ChartPatterns, chartPattern), and keyboard reading of a chart's points one at a time, each value spoken
     (useChartPoints, on the standard chart interaction). ChartFrame already gives every chart its name, its description and its data grid.
   Usage:
     const summary = summarizeSeries(values, { labels: months });      // "Up 133% from 120 to 280; lowest 120 (Jan), highest 310 (May)."
     <ChartFrame title="Sign-ups" description={summary} table={…}>…</ChartFrame>
     // textures: the defs once in the plot, then a texture over each mark that needs one
     <ChartPatterns id={uid} />
     <rect className="plx-chart__mark" data-plx-dataviz={seriesColor(i)} … />
     <rect className="plx-chart-pattern" fill={patternFill(uid, i)} … />
     // keyboard and pointer: the standard chart interaction, one value at a time; the active value gets the tooltip
     const pts = useChartPoints({ count: rows.length, describe: (i) => rows[i].name + ', ' + formatNumber(rows[i].value) });
     <ChartFrame interaction={pts.interaction} …>{() => … pts.index === i …}</ChartFrame>   // a mark: onMouseEnter={() => pts.hover(i)}
   Props:
     summarizeSeries(values, { labels, format, strings }): one sentence on a series: its direction and change from the first
       to the last value, then its lowest and highest values (with their labels when given); format(value) formats a value
       (default formatNumber); strings: { up: "Up {change}", down: "Down {change}", flat: "Flat", range: "from {first} to
       {last}", low: "lowest {value}", high: "highest {value}", at: "{value} ({label})", empty: "No data" }
     CHART_PATTERNS: the textures, in order: "diagonal", "dots", "cross", "horizontal", "vertical", "reverse"
     chartPattern(index): the texture of series index (by the series' order, like seriesColor); after six it starts again
     patternFill(id, index): the fill that draws that texture ('url(#<id>-<texture>)'), for a mark's overlay
     ChartPatterns: <defs> with the six textures (id: a prefix unique on the page, React.useId); drawn inside the plot
     useChartPoints({ count, describe, select, onSelect, strings }) → { interaction, index, hover }: useChartInteraction
       (platform/charts/interaction.ts) in "point" mode over count values in data order; pass interaction to ChartFrame;
       index is the active value (pointer or keyboard) or null; hover(i) from a mark's pointer events (null on leave);
       describe(i) is said for each value; strings: the interaction's words (CHART_INTERACTION_STRINGS)
   Behavior:
     Context hooks on a containing SVG group: --plx-comp-chart-pattern-vector-effect and
       --plx-comp-chart-keys-vector-effect (default none), --plx-comp-chart-keys-linejoin (default miter).
       GeoMap sets non-scaling-stroke and round on its view; these parts own the resulting declarations.
     The SVG stays one image to assistive technology; the keyboard reading is ChartFrame's interactive plot (one Tab stop,
       the arrow keys, Home and End, Escape; each value said in the live region), the same on every Plenix chart. The chart
       draws its tooltip (and a ring) at index, so sighted keyboard users see the same value.
     Textures are drawn in the surface color over the mark's own color, so the mark keeps its data color and gains a
       second cue; the swatch of a legend can carry the same texture.
   Notes:
     No color is written here: the textures take the chart-a11y tokens (surface color strokes), marks keep data-plx-dataviz.
     Charts draw once, with no animation: reduced motion has nothing to remove. A chart that adds motion must drop it under
       prefers-reduced-motion. */
import React from 'react';
import { formatNumber, formatPercent } from '../utils/format.ts';
import { useChartInteraction } from './interaction.ts';
import { fill } from '../utils/fill.ts';

const h = React.createElement;
const SUMMARY = { up: 'Up {change}', down: 'Down {change}', flat: 'Flat', range: 'from {first} to {last}', low: 'lowest {value}', high: 'highest {value}', at: '{value} ({label})', empty: 'No data' };

export function summarizeSeries(values: number[], { labels, format, strings }: { labels?: string[]; format?: (value: number) => string; strings?: Record<string, string> } = {}) {
  const t = Object.assign({}, SUMMARY, strings);
  const f = typeof format === 'function' ? format : (v: any) => formatNumber(v);
  const pts = (values || []).map((v: any, i: any) => ({ v: Number(v), i })).filter((p: any) => isFinite(p.v));
  if (!pts.length) return t.empty;
  const first = pts[0], last = pts[pts.length - 1];
  let lo = pts[0], hi = pts[0];
  pts.forEach((p: any) => { if (p.v < lo.v) lo = p; if (p.v > hi.v) hi = p; });
  const change = first.v ? (last.v - first.v) / Math.abs(first.v) : 0;
  const dir = Math.abs(change) < 0.005 && last.v === first.v ? t.flat : fill(change >= 0 ? t.up : t.down, { change: formatPercent(Math.abs(change), { decimals: 0 }) });
  const at = (p: any) => (labels && labels[p.i] !== undefined ? fill(t.at, { value: f(p.v), label: labels[p.i] }) : f(p.v));
  return dir + ' ' + fill(t.range, { first: f(first.v), last: f(last.v) }) + '; ' + fill(t.low, { value: at(lo) }) + ', ' + fill(t.high, { value: at(hi) }) + '.';
}

export const CHART_PATTERNS = Object.freeze(['diagonal', 'dots', 'cross', 'horizontal', 'vertical', 'reverse']);
export function chartPattern(index: number) {
  const n = CHART_PATTERNS.length, i = Math.floor(Number(index) || 0);
  return CHART_PATTERNS[((i % n) + n) % n];
}
export function patternFill(id: string, index: number) { return 'url(#' + id + '-' + chartPattern(index) + ')'; }

// one 8 × 8 tile per texture (SVG geometry, on the 4px grid); strokes and dots take the chart-a11y classes
const TILE = 8;
const SHAPES = {
  diagonal: [['path', { d: 'M-2,2 L2,-2 M0,8 L8,0 M6,10 L10,6' }]],
  dots: [['circle', { cx: 4, cy: 4, r: 1.5 }]],
  cross: [['path', { d: 'M-2,2 L2,-2 M0,8 L8,0 M6,10 L10,6 M-2,6 L2,10 M0,0 L8,8 M6,-2 L10,2' }]],
  horizontal: [['path', { d: 'M0,4 L8,4' }]],
  vertical: [['path', { d: 'M4,0 L4,8' }]],
  reverse: [['path', { d: 'M-2,6 L2,10 M0,0 L8,8 M6,-2 L10,2' }]],
};

/** @public */
export type ChartPatternsProps = { id?: string };
export function ChartPatterns({ id }: ChartPatternsProps) {
  if (!id) return null;
  return h('defs', { className: 'plx-chart-patterns' }, CHART_PATTERNS.map((name) => h('pattern', { key: name, id: id + '-' + name, width: TILE, height: TILE, patternUnits: 'userSpaceOnUse' },
    (SHAPES as Record<string, any[]>)[name].map(([tag, geo]: any, k: number) => h(tag, Object.assign({ key: k, className: tag === 'circle' ? 'plx-chart-pattern__dot' : 'plx-chart-pattern__stroke' }, geo))))));
}

// a chart whose values are marks of their own (a funnel's steps, a treemap's tiles, a map's regions, scatter points):
// the standard chart interaction (useChartInteraction, one value at a time) with the pointer read from the mark under it
export function useChartPoints({ count = 0, describe, select = false, onSelect, strings }: { count?: number; describe?: (index: number) => string; select?: boolean; onSelect?: (index: number) => void; strings?: Record<string, string> } = {}) {
  const hovered = React.useRef<any>(null);
  const interaction = useChartInteraction({ rows: 1, columns: count, mode: 'point', select, strings,
    onSelect: typeof onSelect === 'function' ? (cell: any) => onSelect(cell.c) : undefined,
    describe: typeof describe === 'function' ? (cell: any) => describe(cell.c) : undefined });
  interaction.register({ nearest: () => hovered.current });
  const hover = (i: number | null) => { hovered.current = i === null || i === undefined ? null : { r: 0, c: i }; interaction.setActive(hovered.current, 'pointer'); };
  return { interaction, index: interaction.active ? interaction.active.c : null, hover };
}
