/* Plenix · WaterfallChart
   Summary: A waterfall chart (07 Data Display › Charts › Waterfall): how a starting total becomes an end total through
     a series of increases and decreases. Totals are columns from zero; each change floats from the running total before
     it to the one after, with a thin connector between them, its signed value above it, and the increase, decrease and
     total colors named in a legend. With totals, subtotal columns show the running total part way.
   Usage:
     <WaterfallChart title="Revenue, last year to this year" description="New customers made up for the price change."
       data={[{ label: 'Last year', value: 820, total: true }, { label: 'New customers', value: 240 }, { label: 'Churn', value: -110 },
         { label: 'Price change', value: -60 }, { label: 'Upsell', value: 90 }]} endLabel="This year" format={(v) => formatCurrency(v * 1000, 'USD')} />
   Props:
     title, description: the chart's name and its takeaway (ChartFrame) (title required)
     data: the steps in order: [{ label, value, total }]; a change (value + or −) floats from the running total; a total
       (total: true) is a column from zero: with a value it sets the running total (the start), without one it shows the
       running total so far (a subtotal: the "with totals" variant)
     endLabel: the name of the end total column added after the last step (default strings.end); false: none
     format: (value) => text (default formatNumber); changes are written with their sign (+40, −25)
     yLabel: the value axis's title; size, margin: as ChartFrame
     legend: shows what the colors mean: Increase, Decrease, Total (default true)
     interactive: keyboard, pointer, tooltip and live region (default true); onSelect({ c, step }): a click or Enter
     strings: { end: "End", step: "Step", change: "Change", total: "Total", running: "Running total", increase: "Increase",
       decrease: "Decrease" }
     className: more classes on the figure
   Behavior:
     One Tab stop: ← → move from step to step, Home and End to the first and the end total; each says "<step>: change
       +40, running total 1,060" in the live region and shows it in the tooltip.
     Increases and decreases differ by color and by the sign of their labels, so color is never the only cue.
   Notes:
     Increase and decrease take the data-viz status steps (positive, negative), totals the first categorical color; the
       connector and the value axis are tokens (--plx-comp-waterfall-chart-*). Up to about ten steps: group the small ones.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.jsx';
import { seriesColor } from './scales.ts';
import { DataLabel } from './parts/DataLabel.tsx';
import { ChartLegend } from './parts/ChartLegend.tsx';
import { ChartTooltip, chartTooltipText } from './parts/ChartTooltip.tsx';
import { useChartInteraction } from './interaction.ts';
import { useEChartsPlot, plotGrid } from './echarts/EChartsPlot.jsx';
import { gridRoom, waterfallSteps } from './chart-helpers.js';
import { tickLineHeight } from './echarts/engine.js';
import { snapToGrid } from '../utils/grid.ts';
import { useStrings } from '../providers/LocaleProvider.tsx';

const NO_MARGIN = Object.freeze({ top: 0, end: 0, bottom: 0, start: 0 });
const GAP = '30%';   // the room between the columns, as a share of a column

const COLORS = { up: 'status-positive', down: 'status-negative', total: seriesColor(0) };

export function WaterfallChart({ title, description, data = [], endLabel, format, yLabel, size = 'md', margin, legend = true, interactive = true, onSelect,
  strings, frameStrings, interactionStrings, className }) {
  const t = useStrings('chart.waterfallChart', strings);
  const fmt = typeof format === 'function' ? format : (v) => formatNumber(v);
  const signed = (v) => (v > 0 ? '+' + fmt(v) : v < 0 ? '\u2212' + fmt(-v) : fmt(0));
  const bars = waterfallSteps(data, endLabel === undefined ? t.end : endLabel);
  const items = (b) => (b.kind === 'total' ? [{ label: t.total, value: fmt(b.to), color: COLORS.total }]
    : [{ label: t.change, value: signed(b.change), color: COLORS[b.kind] }, { label: t.running, value: fmt(b.to) }]);
  const ia = useChartInteraction({
    rows: 1, columns: bars.length, mode: 'point', select: typeof onSelect === 'function', strings: interactionStrings,
    onSelect: (cell) => onSelect && onSelect(Object.assign({ step: bars[cell.c] }, cell)),
    describe: (cell) => chartTooltipText({ title: bars[cell.c].label, items: items(bars[cell.c]) }),
  });
  const table = {
    columns: [{ title: t.step, field: 's', kind: 'name', rowLabel: true }, { title: t.change, field: 'c', kind: 'data', align: 'right' }, { title: t.running, field: 'r', kind: 'data', align: 'right' }],
    data: bars.map((b, i) => ({ id: i + 1, s: b.label, c: b.kind === 'total' ? t.total : signed(b.change), r: fmt(b.to) })),
  };
  const legendNode = legend ? <ChartLegend items={[{ id: 'up', label: t.increase, color: COLORS.up }, { id: 'down', label: t.decrease, color: COLORS.down }, { id: 'total', label: t.total, color: COLORS.total }]} /> : null;
  // the formats the drawing calls, kept current without redrawing (a format written inline is a new function each render)
  const fmts = React.useRef(null); fmts.current = { fmt };

  const plot = useEChartsPlot();
  const dataKey = JSON.stringify(bars.map((b) => [b.label, b.kind, b.from, b.to])) + '|' + yLabel + '|' + (margin ? [margin.top, margin.end, margin.bottom, margin.start].join(':') : '');
  const option = React.useCallback((tk) => {
    // the room above the plot for the signed values written at the bars' tops
    const room = gridRoom(margin, tk.top);
    room.top = Math.max(room.top, Math.ceil(tk.tick.fontSize + tk.tickOffset * 2));
    // and under it for the step names (ECharts does not measure them here)
    room.bottom = Math.max(room.bottom, snapToGrid(tk.tickOffset + tickLineHeight(tk, bars.map((b) => String(b.label))), { round: 'up' }));
    const named = { nameLocation: 'middle', nameMoveOverlap: true };
    // a step floats from the running total before it to the one after: a transparent base, then the step in its color; a step across zero is two parts, up and down from the baseline
    const lo = (b) => Math.min(b.from, b.to), hi = (b) => Math.max(b.from, b.to);
    const base = bars.map((b) => (lo(b) >= 0 ? lo(b) : hi(b) <= 0 ? hi(b) : 0));
    const up = bars.map((b) => (lo(b) >= 0 ? hi(b) - lo(b) : hi(b) > 0 ? hi(b) : 0));
    const down = bars.map((b) => (hi(b) <= 0 ? lo(b) - hi(b) : lo(b) < 0 ? lo(b) : 0));
    const paint = (list) => list.map((v, i) => ({ value: v, itemStyle: { color: tk.color(COLORS[bars[i].kind]) } }));
    const part = (id, list) => ({ type: 'bar', id, stack: 'step', silent: true, barCategoryGap: GAP, z: 2, emphasis: { focus: 'self', blurScope: 'coordinateSystem', itemStyle: {} }, blur: { itemStyle: { opacity: tk.dim } }, data: paint(list) });
    return {
      animationDuration: tk.motion, animationDurationUpdate: tk.motion,
      grid: Object.assign(room, { outerBoundsMode: 'same', outerBoundsContain: 'all' }),
      xAxis: Object.assign({ type: 'category', data: bars.map((b) => String(b.label)), boundaryGap: true, inverse: false, axisLine: { show: true, lineStyle: { color: tk.axis.color, width: tk.axis.width } } }, named),
      yAxis: Object.assign({ type: 'value', name: yLabel, nameGap: 0, position: 'left', axisLabel: { formatter: (v) => fmts.current.fmt(v) } }, named),
      series: [{ type: 'bar', id: 'base', stack: 'step', silent: true, barCategoryGap: GAP, itemStyle: { color: 'transparent', borderWidth: 0 }, emphasis: { disabled: true }, blur: { itemStyle: { opacity: 1 } }, z: 2, data: base },
        part('up', up), part('down', down)]
        // the connector from one step's end to the next step's start: a dashed level between the two columns
        .concat(bars.slice(1).map((b, i) => ({ type: 'line', id: 'c' + i, silent: true, showSymbol: false, emphasis: { disabled: true }, z: 1, lineStyle: { color: tk.waterfall.color, width: tk.waterfall.width, type: [tk.waterfall.dash, tk.waterfall.dash] },
          data: bars.map((x, k) => (k === i || k === i + 1 ? bars[i].to : null)) }))),
    };
  }, [dataKey]);   // eslint-disable-line react-hooks/exhaustive-deps

  // the step in focus is ECharts' emphasis: the others dim to the interaction's dim token
  const activeKey = ia.active ? String(ia.active.c) : '';
  React.useEffect(() => {
    const c = plot.chart;
    if (!c) return;
    c.dispatchAction({ type: 'downplay' });
    if (ia.active) {
      const b = bars[ia.active.c];
      if (b) c.dispatchAction({ type: 'highlight', seriesId: Math.max(b.from, b.to) > 0 || Math.min(b.from, b.to) >= 0 ? 'up' : 'down', dataIndex: ia.active.c });
    }
  }, [activeKey, plot.chart]);   // eslint-disable-line react-hooks/exhaustive-deps

  const draw = (dims) => {
    const layer = plot.layer(dims, option);
    const c = plot.chart;
    const g = c ? plotGrid(c) : null;
    if (!g || !bars.length) return layer;
    const step = g.width / bars.length;
    const at = (i) => c.convertToPixel({ xAxisIndex: 0 }, i);
    const yAt = (v) => c.convertToPixel({ yAxisIndex: 0 }, v);
    ia.register({ columnAt: (px) => Math.min(bars.length - 1, Math.max(0, Math.floor((px - g.x) / step))), nearest: (px) => (px < g.x || px > g.x + g.width ? null : { r: 0, c: Math.min(bars.length - 1, Math.max(0, Math.floor((px - g.x) / step))) }) });
    const inner = { width: g.width, height: g.height };
    const top = (b) => yAt(Math.max(b.from, b.to)) - g.y;
    const a = ia.active, sel = ia.selected;
    // a column's width: the step less the gap between columns
    const bw = step / (1 + parseFloat(GAP) / 100);
    return [layer, (
      <g key="plx-chart-overlay" className="plx-waterfall-chart__plot" transform={'translate(' + g.x + ',' + g.y + ')'}>
        {bars.map((b, i) => <DataLabel key={'l' + i} x={at(i) - g.x} y={top(b)} value={b.kind === 'total' ? fmt(b.to) : signed(b.change)} />)}
        {sel && bars[sel.c] ? <rect className="plx-chart-selected plx-waterfall-chart__selected" fill="none" x={at(sel.c) - g.x - bw / 2} y={top(bars[sel.c])} width={bw} height={Math.max(0, Math.abs(yAt(bars[sel.c].from) - yAt(bars[sel.c].to)))} /> : null}
        {a && bars[a.c] ? <ChartTooltip x={at(a.c) - g.x} y={top(bars[a.c])} inner={inner} title={bars[a.c].label} items={items(bars[a.c])} /> : null}
      </g>
    )];
  };

  return (
    <ChartFrame title={title} description={description} size={size} margin={NO_MARGIN} table={table} legend={legendNode}
      interaction={interactive ? ia : undefined} strings={frameStrings}
      className={cx('plx-waterfall-chart', bars.some((b, i) => b.kind === 'total' && i > 0 && !b.end) && 'plx-waterfall-chart--subtotals', className)}>
      {draw}
    </ChartFrame>
  );
}
export { waterfallSteps } from './chart-helpers.js';
