/* Plenix · PieChart
   Summary: The shares of a few parts in one whole (07 Data Display › Charts › Pie chart, Donut chart): a circle cut into
     slices from 12 o'clock, largest first, clockwise (pie); a ring with the total or a key value in its hollow center
     (donut); or a half ring across the top with its value under it (half). Small parts are grouped into Other. Drawn in
     ChartFrame with a legend that gives each part's share, a tooltip and the data grid.
   Usage:
     <PieChart title="Storage by file type" description="Videos take more than half of the storage."
       data={[{ id: 'video', label: 'Videos', value: 540 }, { id: 'img', label: 'Images', value: 260 }, { id: 'doc', label: 'Documents', value: 120 }]} />
     <PieChart variant="donut" title="Storage by file type" data={parts} centerLabel="GB used" format={(v) => formatNumber(v)} />
     <PieChart variant="half" title="Quota used" data={[{ id: 'used', label: 'Used', value: 72 }, { id: 'free', label: 'Free', value: 28 }]}
       centerValue="72%" centerLabel="of 1 TB" />
   Props:
     title: the chart's name (required); description: its takeaway (ChartFrame)
     data: the parts: [{ id, label, value, color }] (values above zero; color an optional data-viz step, default by the
       part's order in the data)
     variant: "pie" (default) | "donut" (a ring with a center value) | "half" (a half ring across the top, the value under
       its middle)
     centerValue: the donut's or the half ring's value (default the total, formatted); centerLabel: the words under it
       (default strings.total)
     sort: slices largest first, clockwise from the top (default true; false keeps the data's order); Other stays last
     maxSlices: the most slices drawn (default 6): the smallest parts beyond them are grouped into one Other slice
     format: (value) => text for the values (center, tooltip, table); default formatNumber
     showValues: writes each share on its slice when the slice is large enough (8% or more) (default false)
     legend: false hides the legend (default shown, each part with its share); legendPosition: ChartFrame's
     tooltip: shows the part under the pointer, its value and share (default true)
     interactive: keyboard, pointer, tooltip and live region (default true)
     size, margin, hideCaption, className: ChartFrame's
     strings: { part: "Part", value: "Value", share: "Share", total: "Total", other: "Other" } and ChartFrame's strings
   Behavior:
     A part keeps its color by its order in the data, not by its size; Other takes the neutral categorical color.
     One Tab stop: the arrow keys move from slice to slice (clockwise with → and ↓), Home and End to the first and last;
       the pointer does the same on hover. The slice in focus keeps its color and the others dim; the tooltip shows its
       name, value and share, and the live region says it. The legend and the data grid carry every part's value and
       share.
     The plot draws once the chart engine has loaded (the first chart on a page loads it); the caption, legend and data
       grid show at once.
   Notes:
     Two to five parts read best; for many parts or parts of similar size use a bar chart. Slices are parted by a thin line
       in the surface color (pie-chart tokens); the hole is 60% of the radius (geometry). The slices are drawn by Apache
       ECharts (issue 353) in the Plenix theme (echarts/engine.js); the center value, the shares and the tooltip are Plenix's.
       No style is written here.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber, formatPercent } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.jsx';
import { seriesColor } from './scales.ts';
import { ChartLegend } from './parts/ChartLegend.tsx';
import { ChartTooltip, chartTooltipText } from './parts/ChartTooltip.tsx';
import { DataLabel } from './parts/DataLabel.tsx';
import { useChartInteraction } from './interaction.ts';
import { legendItems, finite } from './chart-kit.ts';
import { pieSlices } from './chart-helpers.ts';
import { useEChartsPlot, NO_MARGIN } from './echarts/EChartsPlot.jsx';
import { snapToGrid } from '../utils/grid.ts';
import { useStrings } from '../providers/LocaleProvider.tsx';

const VARIANTS = ['pie', 'donut', 'half'];
const HOLE = 0.6;            // the hollow center's radius, a share of the ring's radius
const LABEL_MIN = 0.08;      // the least share written on its slice
// px: a margin that keeps the ring off the frame's edges (on the 4px grid)
const RING_MARGIN = { top: 8, end: 8, bottom: 8, start: 8 };
const TURN = Math.PI * 2;

// the point at an angle (0 = 12 o'clock, clockwise) and a radius from the center
const at = (cx0, cy0, r, a) => [cx0 + r * Math.sin(a), cy0 - r * Math.cos(a)];

export { pieSlices } from './chart-helpers.ts';

export function PieChart({ title, description, hideCaption, size, data = [], variant = 'pie', centerValue, centerLabel, sort = true, maxSlices = 6,
  format, showValues = false, legend, legendPosition, tooltip = true, interactive = true, margin, strings, className }) {
  const t = useStrings('chart.pieChart', strings);
  const v = VARIANTS.indexOf(variant) >= 0 ? variant : 'pie';
  const half = v === 'half';
  const fmt = (x) => (typeof format === 'function' ? format(x) : formatNumber(x));
  const slices = pieSlices(data, { sort, maxSlices, other: t.other });
  const total = slices.reduce((a, d) => a + d.value, 0);
  const table = {
    columns: [{ title: t.part, field: 'part', kind: 'name', rowLabel: true }, { title: t.value, field: 'value', kind: 'data', align: 'right' }, { title: t.share, field: 'share', kind: 'data', align: 'right' }],
    data: slices.map((d, i) => ({ id: i + 1, part: d.label, value: fmt(d.value), share: formatPercent(d.share) }))
  };
  const key = legend === false ? null : <ChartLegend items={legendItems(slices, (d) => formatPercent(d.share))} orientation={legendPosition === 'end' ? 'vertical' : 'horizontal'} />;
  const center = v === 'pie' ? null : { value: centerValue === undefined ? fmt(total) : centerValue, label: centerLabel === undefined ? t.total : centerLabel };
  const tipOf = (i) => ({ title: slices[i].label, items: [{ label: t.value, value: fmt(slices[i].value) + ' · ' + formatPercent(slices[i].share), color: slices[i].color }] });

  // one slice at a time: every arrow key steps around the ring (→ ↓ clockwise, ← ↑ back)
  const ia = useChartInteraction({
    rows: 1, columns: slices.length, mode: 'point', strings: undefined,
    move: (cur, k) => ({ r: 0, c: k === 'Home' ? 0 : k === 'End' ? slices.length - 1 : Math.max(0, Math.min(slices.length - 1, cur.c + (k === 'ArrowRight' || k === 'ArrowDown' ? 1 : -1))) }),
    labelOf: (i) => (slices[i] ? slices[i].label : ''),
    describe: (cell) => (slices[cell.c] ? chartTooltipText(tipOf(cell.c)) : ''),
  });

  // the ring's geometry in the plot (the same as before ECharts: the frame's plot less the ring's margin)
  const m = {};
  Object.keys(RING_MARGIN).forEach((k) => { m[k] = snapToGrid(margin && margin[k] !== undefined ? margin[k] : RING_MARGIN[k]); });
  const ring = (dims) => {
    const w = Math.max(0, dims.width - m.start - m.end), h = Math.max(0, dims.height - m.top - m.bottom);
    const r1 = Math.max(0, half ? Math.min(w / 2, h) : Math.min(w, h) / 2);
    return { w, h, r1, r0: v === 'pie' ? 0 : r1 * HOLE, cx0: w / 2, cy0: half ? h : h / 2, from: half ? -Math.PI / 2 : 0, sweep: half ? Math.PI : TURN };
  };
  const angles = (G) => { let a = G.from; return slices.map((d) => { const a0 = a; a += d.share * G.sweep; return [a0, a]; }); };

  const plot = useEChartsPlot();
  const dataKey = slices.map((d) => d.id + ':' + d.value + ':' + d.color).join('|');
  const option = React.useCallback((tk, dims) => {
    const G = ring(dims);
    return {
      animationDuration: tk.motion, animationDurationUpdate: tk.motion,
      series: [{
        type: 'pie', id: 'parts', silent: true, center: [m.start + G.cx0, m.top + G.cy0], radius: [G.r0, G.r1],
        startAngle: half ? 180 : 90, endAngle: half ? 0 : 'auto', clockwise: true, avoidLabelOverlap: false,
        label: { show: false }, labelLine: { show: false },
        emphasis: { scale: false, focus: 'self' }, blur: { itemStyle: { opacity: tk.dim } },
        data: slices.map((d) => ({ name: d.label, value: d.value, itemStyle: { color: tk.color(d.color) } })),
      }],
    };
  }, [dataKey, v, m.top, m.end, m.bottom, m.start]);

  const activeKey = ia.active ? String(ia.active.c) : '';
  React.useEffect(() => {
    const c = plot.chart;
    if (!c) return;
    c.dispatchAction({ type: 'downplay', seriesIndex: 0 });
    if (ia.active) c.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: ia.active.c });
  }, [activeKey, plot.chart]);

  const draw = (dims) => {
    const layer = plot.layer(dims, option);
    const G = ring(dims);
    const A = angles(G);
    ia.register({
      nearest: (px, py) => {
        const dx = px - m.start - G.cx0, dy = py - m.top - G.cy0, r = Math.sqrt(dx * dx + dy * dy);
        if (r > G.r1 || r < G.r0) return null;
        let a = Math.atan2(dx, -dy);
        if (!half && a < 0) a += TURN;
        const i = A.findIndex(([a0, a1]) => a >= a0 && a < a1);
        return i < 0 ? null : { r: 0, c: i };
      },
    });
    if (!plot.chart) return layer;
    const inner = { width: G.w, height: G.h };
    const a = ia.active && slices[ia.active.c] ? ia.active.c : null;
    let tip = null;
    if (tooltip && a !== null) {
      const [px, py] = at(G.cx0, G.cy0, (G.r0 + G.r1) / 2, (A[a][0] + A[a][1]) / 2), tp = tipOf(a);
      tip = <ChartTooltip x={px} y={py} inner={inner} title={tp.title} items={tp.items} />;
    }
    return [layer, (
      <g key="plx-chart-overlay" transform={'translate(' + m.start + ',' + m.top + ')'}>
        {showValues ? slices.map((d, i) => {
          if (d.share < LABEL_MIN) return null;
          const [px, py] = at(G.cx0, G.cy0, G.r0 ? (G.r0 + G.r1) / 2 : G.r1 * 0.62, (A[i][0] + A[i][1]) / 2);
          return <DataLabel key={'l' + d.id} x={px} y={py} value={formatPercent(d.share)} position="center" />;
        }) : null}
        {center ? (
          <g className="plx-pie-chart__center">
            <text className="plx-pie-chart__center-value" x={G.cx0} y={G.cy0}>{center.value}</text>
            {center.label ? <text className="plx-pie-chart__center-label" x={G.cx0} y={G.cy0}>{center.label}</text> : null}
          </g>
        ) : null}
        {tip}
      </g>
    )];
  };

  return (
    <ChartFrame title={title} description={description} hideCaption={hideCaption} size={size} margin={NO_MARGIN} legend={key} legendPosition={legendPosition}
      table={table} interaction={interactive ? ia : undefined} strings={strings} className={cx('plx-pie-chart', 'plx-pie-chart--' + v, className)}>
      {draw}
    </ChartFrame>
  );
}
