/* Plenix · FunnelChart
   Summary: How many items remain at each step of an ordered process (07 Data Display › Charts › Funnel): one bar per
     stage on a zero baseline, its count and the share kept from the stage before, with the previous stage's length
     behind it so the drop shows. Vertical (stages top to bottom, the default) or horizontal (left to right).
   Usage:
     <FunnelChart title="Sign-up funnel, September" description="Most people drop between the form and the first upload."
       data={[{ label: 'Visited', value: 12400 }, { label: 'Started sign-up', value: 5200 }, { label: 'Signed up', value: 3900 }, …]} />
     <FunnelChart orientation="horizontal" … />
   Props:
     title: the chart's name (required); description: its takeaway (the step with the largest drop)
     data: the stages, in the process's order: [{ label, value }]; each stage a subset of the one before (required)
     orientation: "vertical" (default: stages down the side, bars across) | "horizontal" (stages along the bottom, columns up)
     color: the data-viz step of the bars ("categorical-1" by default)
     format: (value) => text for counts (default formatNumber)
     valueTitle: what is counted ("People"): the table's column and the tooltip's name
     size: the plot's height, as ChartFrame ("sm" | "md" default | "lg")
     strings: the words it says: { stage: "Stage", value: "Count", kept: "Kept from the step before", ofFirst: "Of the first
       step", hint } (hint: the chart interaction's)
     className: more classes on the figure
   Behavior:
     Bars are lengths on a zero baseline (no tapered shape), so they compare truly. Each label shows the count and, from
       the second stage on, the share kept from the stage before ("3,900 · 75%").
     The stage before's length is drawn behind each bar in the sunken surface color: the gap is the drop.
     Keyboard: one Tab stop; the arrow keys move through the stages, each spoken with its count and share; the pointer over
       a stage does the same. The active bar gets a ring and the tooltip.
     The frame's "Show the data" table lists each stage, its count, the share kept and the share of the first stage.
   Notes:
     Built on ChartFrame, the chart parts (Axis, DataLabel, ChartTooltip) and the chart-a11y helpers. Use a Sankey
       diagram when items can skip or repeat stages, a bar chart for categories that are not steps.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber, formatPercent } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.tsx';
import { seriesColor, niceTicks } from './scales.ts';
import { DataLabel } from './parts/DataLabel.tsx';
import { ChartTooltip } from './parts/ChartTooltip.tsx';
import { useChartPoints } from './a11y.ts';
import { useEChartsPlot, plotGrid } from './echarts/EChartsPlot.tsx';
import { gridRoom } from './chart-helpers.ts';
import { labelRoom } from './chart-kit.ts';
import { snapToGrid } from '../utils/grid.ts';
import { useStrings } from '../providers/LocaleProvider.tsx';

const NO_MARGIN = Object.freeze({ top: 0, end: 0, bottom: 0, start: 0 });
// the room between the active bar and its ring (SVG geometry, the 4px grid)
const RING = 4;
const BAND = 1 / 1.24;   // a bar's thickness as a share of its stage's row (the room between stages is 24% of a bar)

// a stage name in one or two lines, split at the word nearest its middle (the horizontal funnel's names under narrow columns)
const twoLines = (s) => {
  const w = s.split(' ');
  if (w.length < 2) return [s];
  let best = 1, diff = Infinity;
  for (let i = 1; i < w.length; i++) { const d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length); if (d < diff) { diff = d; best = i; } }
  return [w.slice(0, best).join(' '), w.slice(best).join(' ')];
};

export function FunnelChart({ title, description, data = [], orientation = 'vertical', color, format, valueTitle, size = 'md', strings, className }) {
  const t = useStrings('chart.funnelChart', strings);
  const o = orientation === 'horizontal' ? 'horizontal' : 'vertical';
  const vertical = o === 'vertical';
  const rows = data.map((d, i) => ({ id: i + 1, label: String(d.label), value: Math.max(0, Number(d.value) || 0) }));
  const first = rows.length ? rows[0].value : 0;
  rows.forEach((r, i) => { r.kept = i && rows[i - 1].value ? r.value / rows[i - 1].value : null; r.share = first ? r.value / first : null; });
  const fmt = (v) => (typeof format === 'function' ? format(v) : formatNumber(v));
  const pct = (v) => (v === null ? '' : formatPercent(v, { decimals: 0 }));
  const keys = useChartPoints({ count: rows.length, describe: (i) => rows[i].label + ', ' + fmt(rows[i].value) + (rows[i].kept !== null ? ', ' + pct(rows[i].kept) + ' ' + t.kept.toLowerCase() : '') });
  const mark = color || seriesColor(0);
  const table = { columns: [{ title: t.stage, field: 'label', kind: 'name', rowLabel: true }, { title: valueTitle || t.value, field: 'shown', kind: 'data', align: 'right' },
    { title: t.kept, field: 'kept', kind: 'data', align: 'right' }, { title: t.ofFirst, field: 'share', kind: 'data', align: 'right' }],
    data: rows.map((r) => ({ id: r.id, label: r.label, shown: fmt(r.value), kept: pct(r.kept), share: pct(r.share) })) };
  const label = (r) => fmt(r.value) + (r.kept !== null ? ' \u00b7 ' + pct(r.kept) : '');
  const top = Math.max(1, first, ...rows.map((r) => r.value));
  const niceTop = niceTicks(0, top, 5).ticks.slice(-1)[0];

  const plot = useEChartsPlot();
  const dataKey = JSON.stringify(rows.map((r) => [r.label, r.value])) + '|' + o + '|' + mark;
  const option = React.useCallback((tk) => {
    // the room beside the bars for what is written at their ends, and for the stage names under a horizontal funnel (two lines)
    const room = gridRoom(NO_MARGIN, 0);
    if (vertical) room.right = Math.max(room.right, labelRoom(rows.map(label)));
    else { room.top = Math.max(room.top, snapToGrid(tk.tick.fontSize + tk.tickOffset * 2, { round: 'up' })); room.bottom = Math.max(room.bottom, snapToGrid(tk.tickOffset + tk.tick.fontSize * 2 + 4, { round: 'up' })); }
    const named = { nameLocation: 'middle', nameMoveOverlap: true };
    const valAxis = Object.assign({ type: 'value', min: 0, max: niceTop, show: false, inverse: vertical && tk.rtl }, named);
    const catAxis = Object.assign({ type: 'category', data: rows.map((r) => r.label), inverse: vertical, position: vertical ? (tk.rtl ? 'right' : 'left') : 'bottom', boundaryGap: true, axisLine: { show: true, lineStyle: { color: tk.axis.color, width: tk.axis.width } },
      axisLabel: vertical ? {} : { interval: 0, hideOverlap: false, formatter: (v) => twoLines(String(v)).join('\n'), lineHeight: tk.tick.fontSize + 2 } }, named);
    const w = (Math.round(BAND * 10000) / 100) + '%';
    return {
      animationDuration: tk.motion, animationDurationUpdate: tk.motion,
      grid: Object.assign(room, { outerBoundsMode: 'same', outerBoundsContain: 'all' }),
      xAxis: vertical ? valAxis : catAxis, yAxis: vertical ? catAxis : valAxis,
      series: [
        // the stage before's length behind each bar: the gap is the drop
        { type: 'bar', id: 'drop', silent: true, barGap: '-100%', barWidth: w, z: 1, itemStyle: { color: tk.funnel.drop }, emphasis: { disabled: true }, data: rows.map((r, i) => (i ? rows[i - 1].value : null)) },
        { type: 'bar', id: 'bar', silent: true, barGap: '-100%', barWidth: w, z: 2, itemStyle: { color: tk.color(mark) }, emphasis: { disabled: true }, data: rows.map((r) => r.value) },
      ],
    };
  }, [dataKey]);   // eslint-disable-line react-hooks/exhaustive-deps

  const draw = (dims) => {
    const layer = plot.layer(dims, option);
    const c = plot.chart;
    const g = c ? plotGrid(c) : null;
    if (!g || !rows.length) return layer;
    const px = (i, v) => { const p = c.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, vertical ? [v, i] : [i, v]); return { x: p[0] - g.x, y: p[1] - g.y }; };
    const step = (vertical ? g.height : g.width) / rows.length, thick = step * BAND;
    const inner = { width: g.width, height: g.height };
    const a = keys.index !== null && keys.index !== undefined && rows[keys.index] ? keys.index : null;
    const bar = (i) => { const e = px(i, rows[i].value), z = px(i, 0); return vertical ? { x: Math.min(e.x, z.x), y: e.y - thick / 2, width: Math.abs(e.x - z.x), height: thick } : { x: e.x - thick / 2, y: Math.min(e.y, z.y), width: thick, height: Math.abs(e.y - z.y) }; };
    return [layer, (
      <g key="plx-chart-overlay" transform={'translate(' + g.x + ',' + g.y + ')'}>
        {rows.map((r, i) => { const e = px(i, r.value); return <DataLabel key={'l' + r.id} x={e.x} y={e.y} value={label(r)} position={vertical ? 'end' : 'top'} />; })}
        {rows.map((r, i) => {
          const e = px(i, 0);
          return <rect key={'h' + r.id} className="plx-chart-keys__hit" x={vertical ? 0 : e.x - step / 2} y={vertical ? e.y - step / 2 : 0} width={vertical ? g.width : step} height={vertical ? step : g.height}
            onMouseEnter={() => keys.hover(i)} onMouseLeave={() => keys.hover(null)} />;
        })}
        {a !== null ? (() => { const b = bar(a); return <rect className="plx-chart-keys__ring" x={b.x - RING} y={b.y - RING} width={b.width + 2 * RING} height={b.height + 2 * RING} />; })() : null}
        {a !== null ? (() => { const e = px(a, rows[a].value); return <ChartTooltip x={e.x} y={e.y} inner={inner} title={rows[a].label}
          items={[{ label: valueTitle || t.value, value: fmt(rows[a].value), color: mark }].concat(rows[a].kept !== null ? [{ label: t.kept, value: pct(rows[a].kept) }, { label: t.ofFirst, value: pct(rows[a].share) }] : [])} />; })() : null}
      </g>
    )];
  };

  return (
    <ChartFrame interaction={keys.interaction} title={title} description={description} size={size} margin={NO_MARGIN} table={table} className={cx('plx-funnel', 'plx-funnel--' + o, className)}>
      {draw}
    </ChartFrame>
  );
}
