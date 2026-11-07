/* Plenix · chart helpers (platform/charts/chart-helpers.ts)
   Summary: The small, pure helpers the chart files share and the public API exports (gridRoom, pieSlices, binValues). They live apart from the
     chart components so the components can load on their own (charts/lazy.tsx) while these stay in the first load.
   Notes: Moved out of LineChart.tsx, PieChart.tsx and BarChart.tsx without any change to the code; those files still export them. */
import { snapToGrid } from '../utils/grid.ts';
import { niceTicks, seriesColor } from './scales.ts';
import { finite } from './chart-kit.ts';

const OTHER_COLOR = 'categorical-6';

// the room around the plot, from ChartFrame's margin prop (pixels on the grid)
export const gridRoom = (margin: any, top: any) => {
  const m = margin || {};
  const at = (k: any, d: any) => snapToGrid(m[k] === undefined ? d : m[k]);
  return { top: at('top', top), right: at('end', 0), bottom: at('bottom', 0), left: at('start', 0) };
};

// the parts to draw: colors by the data's order, the smallest beyond maxSlices grouped into Other, sorted by size
/** @public a slice as the application gives it */
export type PieDatum = { id?: string | number; label: string; value: number; color?: string };
/** @public a waterfall bar as the application gives it */
export type WaterfallDatum = { label: string; value?: number | null; total?: boolean };
export function pieSlices(data: PieDatum[], { sort = true, maxSlices = 6, other = 'Other' }: { sort?: boolean; maxSlices?: number; other?: string } = {}) {
  const parts = (data || []).map((d: any, i: any) => ({ id: d.id === undefined ? String(i) : d.id, label: d.label, value: Math.max(0, finite(d.value)), color: d.color, index: i }))
    .filter((d: any) => d.value > 0);
  let kept: any[] = parts, rest: any[] = [];
  if (parts.length > maxSlices) {
    const bySize = parts.slice().sort((a: any, b: any) => b.value - a.value);
    const keep = new Set(bySize.slice(0, Math.max(1, maxSlices - 1)).map((d: any) => d.id));
    kept = parts.filter((d: any) => keep.has(d.id)); rest = parts.filter((d: any) => !keep.has(d.id));
  }
  kept = kept.map((d: any, i: any) => Object.assign({}, d, { color: d.color || seriesColor(i) }));
  if (sort) kept.sort((a: any, b: any) => b.value - a.value);
  if (rest.length) kept.push({ id: '__other', label: other, value: rest.reduce((a: any, d: any) => a + d.value, 0), color: OTHER_COLOR, index: -1, parts: rest });
  const total = kept.reduce((a: any, d: any) => a + d.value, 0);
  return kept.map((d: any) => Object.assign(d, { share: total ? d.value / total : 0 }));
}

export function binValues(values: number[], { bins, domain }: { bins?: number; domain?: number[] } = {}) {
  const v = (values || []).map(Number).filter((x: any) => isFinite(x));
  if (!v.length) return [];
  const lo = domain ? Number(domain[0]) : Math.min.apply(null, v);
  const hi = domain ? Number(domain[1]) : Math.max.apply(null, v);
  const n = Math.max(1, Math.round(bins || Math.ceil(Math.log2(v.length) + 1)));
  const t = niceTicks(lo, hi, n);
  let edges = t.ticks;
  if (edges.length < 2) edges = [t.start, t.start + t.step];
  const out = edges.slice(0, -1).map((x0, i) => ({ x0, x1: edges[i + 1], count: 0 }));
  v.forEach((x: any) => {
    if (x < edges[0] || x > edges[edges.length - 1]) return;
    const i = Math.min(out.length - 1, Math.floor((x - edges[0]) / t.step));
    if (i >= 0) out[i].count += 1;
  });
  return out;
}

// each bar: its kind, the running total before and after it
export function waterfallSteps(data: WaterfallDatum[] = [], endLabel?: string | false) {
  let run = 0;
  const out: Array<{ label: string; kind: string; from: number; to: number; change: number | null; end?: boolean }> = data.map((d, i) => {
    const v = typeof d.value === 'number' && isFinite(d.value) ? d.value : null;
    if (d.total) {
      if (v !== null && (i === 0 || d.value !== undefined)) run = v;
      return { label: d.label, kind: 'total', from: 0, to: run, change: null };
    }
    const from = run; run += v || 0;
    return { label: d.label, kind: (v || 0) < 0 ? 'down' : 'up', from, to: run, change: v || 0 };
  });
  if (endLabel !== false && (!out.length || out[out.length - 1].kind !== 'total')) out.push({ label: endLabel as string, kind: 'total', from: 0, to: run, change: null, end: true });
  return out;
}

// a quantile of sorted values, interpolated between the two nearest
function quantile(sorted: number[], p: number): number {
  if (!sorted.length) return 0;
  const i = (sorted.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}

// the five-number summary with Tukey's whiskers: { min, q1, median, q3, max, outliers, n }
export function boxStats(values: number[]) {
  const v = (values || []).map(Number).filter((x: any) => isFinite(x)).sort((a: any, b: any) => a - b);
  if (!v.length) return null;
  const q1 = quantile(v, 0.25), median = quantile(v, 0.5), q3 = quantile(v, 0.75), fence = (q3 - q1) * 1.5;
  const inside = v.filter((x: any) => x >= q1 - fence && x <= q3 + fence);
  return { min: inside[0], q1, median, q3, max: inside[inside.length - 1], outliers: v.filter((x: any) => x < q1 - fence || x > q3 + fence), n: v.length };
}
