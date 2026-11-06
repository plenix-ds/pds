/* Plenix · ComboChart
   Summary: Two related measures on one category axis (07 Data Display › Charts › Combo chart): columns for the primary
     measure (an amount from zero) and a line with points for the second (a rate, a target, a running figure), on one
     shared value axis or on two (the columns' on the start side, the line's on the end side) when their units differ.
     Drawn in ChartFrame with both legends, a shared tooltip per category and the data grid.
   Usage:
     <ComboChart title="Uploads and approval rate" description="Uploads doubled while the approval rate held near 90%."
       categories={months} bars={[{ id: 'up', label: 'Uploads', values: […] }]}
       lines={[{ id: 'rate', label: 'Approval rate', values: […] }]} axis="dual" barLabel="Uploads" lineLabel="Approval rate"
       formatLine={(v) => formatPercent(v)} />
   Props:
     title: the chart's name (required); description: its takeaway (ChartFrame)
     categories: the category names, in order (periods left to right)
     bars: [{ id, label, values, color }]: the column series (grouped side by side when there are several)
     lines: [{ id, label, values, color }]: the line series (one point per category); colors continue after the bars'
     axis: "shared" (default: one value axis for both; same unit) | "dual" (the lines on their own axis at the end side;
       give both axes a title with its unit)
     barLabel, lineLabel: the value axes' titles (with dual: the start axis's and the end axis's); categoryLabel: the
       category axis's title
     formatBar, formatLine: (value) => text for each kind's values (axis ticks, tooltip, table); default formatNumber
     showPoints: draws a point at each line value (default true)
     legend: false hides the two legends (columns with square swatches, lines with line swatches)
     legendPosition, size, margin, hideCaption, className: ChartFrame's
     tooltip: shows every series' value at the category under the pointer (default true)
     strings: { category: "Category", bars: "Columns", lines: "Lines" } (the legends' names) and ChartFrame's strings
   Behavior:
     The column axis starts at zero; with axis="dual" the line axis is fitted to the line's values (nice round ends) and
       says so with its own ticks and title, so the two scales are never read as one.
     Hover anywhere over a category: a crosshair and one tooltip with every series' value in the legends' order.
   Notes:
     Two chart types at most: never a third. Colors come from the data-viz scales by the series' order (columns first).
     Points are the frame's point marks; their radius is a combo-chart token.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.jsx';
import { seriesColor } from './scales.js';
import { ChartLegend } from './parts/ChartLegend.jsx';
import { ChartTooltip } from './parts/ChartTooltip.jsx';
import { useChartHover, legendItems } from './chart-kit.js';
import { useEChartsPlot, plotGrid } from './echarts/EChartsPlot.jsx';
import { gridRoom } from './LineChart.jsx';
import { useStrings } from '../providers/LocaleProvider.tsx';

const NO_MARGIN = Object.freeze({ top: 0, end: 0, bottom: 0, start: 0 });
const isNum = (v) => v !== null && v !== undefined && isFinite(Number(v));

export function ComboChart({ title, description, hideCaption, size, categories = [], bars = [], lines = [], axis = 'shared', barLabel, lineLabel, categoryLabel,
  formatBar, formatLine, showPoints = true, legend, legendPosition, tooltip = true, margin, strings, className }) {
  const t = useStrings('chart.comboChart', strings);
  const dual = axis === 'dual';
  const fb = (v) => (typeof formatBar === 'function' ? formatBar(v) : formatNumber(v));
  const fl = (v) => (typeof formatLine === 'function' ? formatLine(v) : formatNumber(v));
  const [active, hover] = useChartHover();
  const cols = bars.map((s, i) => Object.assign({}, s, { id: s.id === undefined ? 'b' + i : s.id, color: s.color || seriesColor(i) }));
  const lns = lines.map((s, i) => Object.assign({}, s, { id: s.id === undefined ? 'l' + i : s.id, color: s.color || seriesColor(cols.length + i) }));
  const table = {
    columns: [{ title: categoryLabel || t.category, field: 'category', kind: 'name', rowLabel: true }]
      .concat(cols.map((s, i) => ({ title: s.label, field: 'b' + i, kind: 'data', align: 'right' })))
      .concat(lns.map((s, i) => ({ title: s.label, field: 'l' + i, kind: 'data', align: 'right' }))),
    data: categories.map((c, ci) => {
      const row = { id: ci + 1, category: String(c) };
      cols.forEach((s, i) => { const v = s.values[ci]; row['b' + i] = v === null || v === undefined ? '' : fb(v); });
      lns.forEach((s, i) => { const v = s.values[ci]; row['l' + i] = v === null || v === undefined ? '' : fl(v); });
      return row;
    })
  };
  const key = legend === false ? null : (
    <div className={cx('plx-combo-chart__legend', legendPosition === 'end' && 'plx-combo-chart__legend--vertical')}>
      {cols.length ? <ChartLegend items={legendItems(cols)} label={t.bars} orientation={legendPosition === 'end' ? 'vertical' : 'horizontal'} /> : null}
      {lns.length ? <ChartLegend items={legendItems(lns)} shape="line" label={t.lines} orientation={legendPosition === 'end' ? 'vertical' : 'horizontal'} /> : null}
    </div>
  );
  // the formats the drawing calls, kept current without redrawing (a format written inline is a new function each render)
  const fmts = React.useRef(null); fmts.current = { fb, fl };

  const plot = useEChartsPlot();
  const dataKey = JSON.stringify([categories, cols.map((s) => [s.id, s.values, s.color]), lns.map((s) => [s.id, s.values, s.color]), dual, showPoints, barLabel, lineLabel, categoryLabel,
    margin ? [margin.top, margin.end, margin.bottom, margin.start] : null]);
  const option = React.useCallback((tk) => {
    const room = gridRoom(margin, tk.top);
    const named = { nameLocation: 'middle', nameMoveOverlap: true };
    const valueAxis = (name, position, format, extra) => Object.assign({ type: 'value', name, nameGap: 0, position, axisLabel: { formatter: (v) => format(v) } }, named, extra);
    return {
      animationDuration: tk.motion, animationDurationUpdate: tk.motion,
      grid: Object.assign(room, { outerBoundsMode: 'same', outerBoundsContain: 'all' }),
      xAxis: Object.assign({ type: 'category', data: categories.map(String), boundaryGap: true, name: categoryLabel, nameGap: tk.tickOffset * 2 + tk.tick.fontSize, inverse: false,
        axisLine: { show: true, lineStyle: { color: tk.axis.color, width: tk.axis.width } } }, named),
      // the columns' axis starts at zero; with dual axes the lines have their own, fitted to their values
      yAxis: dual ? [valueAxis(barLabel, 'left', (v) => fmts.current.fb(v), { min: 0 }), valueAxis(lineLabel, 'right', (v) => fmts.current.fl(v), { scale: true, splitLine: { show: false } })]
        : [valueAxis(barLabel, 'left', (v) => fmts.current.fb(v), { min: Math.min(0, ...cols.concat(lns).flatMap((s) => s.values.filter(isNum).map(Number))) })],
      series: cols.map((s) => ({ type: 'bar', id: 'b' + s.id, name: s.label, silent: true, emphasis: { disabled: true }, barCategoryGap: '25%', barGap: '10%', itemStyle: { color: tk.color(s.color) },
        data: s.values.map((v) => (isNum(v) ? Number(v) : null)) }))
        .concat(lns.map((s) => ({ type: 'line', id: 'l' + s.id, name: s.label, silent: true, emphasis: { disabled: true }, yAxisIndex: dual ? 1 : 0, showSymbol: !!showPoints, connectNulls: false,
          lineStyle: { color: tk.color(s.color) }, itemStyle: { color: tk.color(s.color) }, z: 3, data: s.values.map((v) => (isNum(v) ? Number(v) : null)) }))),
    };
  }, [dataKey]);   // eslint-disable-line react-hooks/exhaustive-deps

  const draw = (dims) => {
    const layer = plot.layer(dims, option);
    const c = plot.chart;
    const g = c ? plotGrid(c) : null;
    if (!g) return layer;
    const step = categories.length ? g.width / categories.length : 0;
    const at = (ci) => c.convertToPixel({ xAxisIndex: 0 }, ci) - g.x;
    const inner = { width: g.width, height: g.height };
    let tip = null;
    if (tooltip && active !== null && categories[active] !== undefined) {
      const ci = Number(active);
      tip = <ChartTooltip variant="shared" x={at(ci)} inner={inner} title={String(categories[ci])}
        items={cols.map((s) => ({ label: s.label, value: s.values[ci] === undefined || s.values[ci] === null ? '–' : fb(s.values[ci]), color: s.color }))
          .concat(lns.map((s) => ({ label: s.label, value: s.values[ci] === undefined || s.values[ci] === null ? '–' : fl(s.values[ci]), color: s.color })))} />;
    }
    return [layer, (
      <g key="plx-chart-overlay" transform={'translate(' + g.x + ',' + g.y + ')'}>
        {tooltip ? categories.map((cat, ci) => <rect key={'hit' + ci} className="plx-combo-chart__hit" x={at(ci) - step / 2} y={0} width={step} height={g.height} {...hover(ci)} />) : null}
        {tip}
      </g>
    )];
  };

  return (
    <ChartFrame title={title} description={description} hideCaption={hideCaption} size={size} margin={NO_MARGIN} legend={key} legendPosition={legendPosition}
      table={table} strings={strings} className={cx('plx-combo-chart', dual && 'plx-combo-chart--dual', className)}>
      {draw}
    </ChartFrame>
  );
}
