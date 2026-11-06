/* Plenix · BoxPlot
   Summary: Distributions compared by their summaries (07 Data Display › Charts › Box plot): for each group a box from
     the first to the third quartile (the middle half of its values) with a line at the median, whiskers to the lowest
     and highest values within 1.5 times the box's length, and the values beyond them drawn as outlier points; vertical
     (groups along the bottom) or horizontal. Drawn in ChartFrame on one shared value axis, with a tooltip and the data
     table of every summary.
   Usage:
     <BoxPlot title="Review time by team" description="Design reviews take longest and vary most." valueLabel="Hours"
       groups={[{ id: 'design', label: 'Design', values: [4, 6, 7, 9, 12, 30] }, { id: 'legal', label: 'Legal', values: […] }]} />
     <BoxPlot orientation="horizontal" groups={[{ label: 'Q1', stats: { min: 2, q1: 4, median: 6, q3: 9, max: 14, outliers: [22] } }]} … />
   Props:
     title: the chart's name (required); description: its takeaway (ChartFrame)
     groups: [{ id, label, values }] (the raw values: the summary is computed) or [{ id, label, stats: { min, q1, median,
       q3, max, outliers } }] (a summary already made: min and max are the whiskers' ends)
     orientation: "vertical" (default: one box per group along the bottom) | "horizontal" (groups down the start side)
     showOutliers: draws the values beyond the whiskers as points (default true)
     valueLabel, categoryLabel: the axis titles; format: (value) => text (ticks, tooltip, table)
     tooltip: shows the group's summary under the pointer (default true)
     size, margin, hideCaption, className, legend, legendPosition: ChartFrame's
     strings: { group: "Group", min: "Minimum", q1: "First quartile", median: "Median", q3: "Third quartile", max: "Maximum",
       outliers: "Outliers", n: "Values" } and ChartFrame's strings
   Behavior:
     Quartiles are interpolated between the sorted values (the method spreadsheets use); whiskers end at the most extreme
       values within 1.5 × the interquartile range of the box (Tukey); say so in the description for a general audience.
     Every group shares one value axis. Hover a group: the tooltip lists its five numbers. The table lists them all, with
       the outliers and the number of values.
   Notes:
     The box is the frame's mark (the first categorical color); the median line takes the surface color across it, the
       whiskers the subtle content color, outliers the frame's point (box-plot tokens). For a few values plot the points.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.jsx';
import { niceTicks } from './scales.js';
import { ChartTooltip } from './parts/ChartTooltip.tsx';
import { useChartHover } from './chart-kit.js';
import { useEChartsPlot, plotGrid } from './echarts/EChartsPlot.jsx';
import { gridRoom, boxStats } from './chart-helpers.js';
import { snapToGrid } from '../utils/grid.ts';
import { useStrings } from '../providers/LocaleProvider.tsx';

const NO_MARGIN = Object.freeze({ top: 0, end: 0, bottom: 0, start: 0 });
const BAND = 1 / 1.4;   // a box's thickness as a share of its group's row (the room between groups is 40% of a box)

export function BoxPlot({ title, description, hideCaption, size, groups = [], orientation = 'vertical', showOutliers = true, valueLabel, categoryLabel, format,
  tooltip = true, legend, legendPosition, margin, strings, className }) {
  const t = useStrings('chart.boxPlot', strings);
  const o = orientation === 'horizontal' ? 'horizontal' : 'vertical';
  const across = o === 'horizontal';
  const fmt = (v) => (typeof format === 'function' ? format(v) : formatNumber(v));
  const [active, hover] = useChartHover();
  const list = groups.map((g, i) => ({ id: g.id === undefined ? String(i) : g.id, label: g.label, s: g.stats ? Object.assign({ outliers: [] }, g.stats) : boxStats(g.values) })).filter((g) => g.s);
  let lo = Infinity, hi = -Infinity;
  list.forEach((g) => { [g.s.min, g.s.max].concat(showOutliers ? g.s.outliers : []).forEach((v) => { lo = Math.min(lo, v); hi = Math.max(hi, v); }); });
  if (!isFinite(lo)) { lo = 0; hi = 1; }
  if (lo > 0 && lo < (hi - lo)) lo = 0;   // from zero when zero is near the data
  const table = {
    columns: [{ title: categoryLabel || t.group, field: 'group', kind: 'name', rowLabel: true }]
      .concat(['min', 'q1', 'median', 'q3', 'max'].map((k) => ({ title: t[k], field: k, kind: 'data', align: 'right' })))
      .concat([{ title: t.outliers, field: 'outliers', kind: 'data' }, { title: t.n, field: 'n', kind: 'data', align: 'right' }]),
    data: list.map((g, i) => ({ id: i + 1, group: g.label, min: fmt(g.s.min), q1: fmt(g.s.q1), median: fmt(g.s.median), q3: fmt(g.s.q3), max: fmt(g.s.max),
      outliers: (g.s.outliers || []).map(fmt).join(', '), n: g.s.n === undefined ? '' : fmt(g.s.n) }))
  };
  // the format the drawing calls, kept current without redrawing (a format written inline is a new function each render)
  const fmts = React.useRef(null); fmts.current = { fmt };

  const plot = useEChartsPlot();
  const dataKey = JSON.stringify(list.map((g) => [g.id, g.label, g.s])) + '|' + o + '|' + showOutliers + '|' + valueLabel + '|' + categoryLabel + '|' + (margin ? [margin.top, margin.end, margin.bottom, margin.start].join(':') : '');
  const option = React.useCallback((tk) => {
    const room = gridRoom(margin, 0);
    // under the plot: the vertical chart's group names; the horizontal chart's value labels and title are laid out by ECharts
    if (!across) room.bottom = Math.max(room.bottom, snapToGrid(tk.tickOffset + tk.tick.fontSize + (categoryLabel ? tk.tickOffset * 2 + tk.title.fontSize : 0), { round: 'up' }));
    const named = { nameLocation: 'middle', nameMoveOverlap: true };
    const nameRoom = tk.tickOffset * 2 + tk.tick.fontSize;
    const valAxis = Object.assign({ type: 'value', min: niceTicks(lo, hi, 5).ticks[0], max: niceTicks(lo, hi, 5).ticks.slice(-1)[0], name: valueLabel, nameGap: across ? nameRoom : 0, inverse: across && tk.rtl, axisLabel: { formatter: (v) => fmts.current.fmt(v) },
      axisLine: { show: across, lineStyle: { color: tk.axis.color, width: tk.axis.width } } }, named);
    const catAxis = Object.assign({ type: 'category', data: list.map((g) => g.label), inverse: across, position: across ? (tk.rtl ? 'right' : 'left') : 'bottom', boundaryGap: true, name: categoryLabel, nameGap: across ? 0 : nameRoom,
      axisLine: { show: !across, lineStyle: { color: tk.axis.color, width: tk.axis.width } } }, named);
    const w = (Math.round(BAND * 10000) / 100) + '%';
    return {
      animationDuration: tk.motion, animationDurationUpdate: tk.motion,
      grid: Object.assign(room, { outerBoundsMode: 'same', outerBoundsContain: 'all' }),
      xAxis: across ? valAxis : catAxis, yAxis: across ? catAxis : valAxis,
      series: [
        // the box (the data color), the whiskers and their caps (the whisker token); the median is the frame's overlay in its own token
        { type: 'boxplot', id: 'box', silent: true, boxWidth: [w, w], z: 2, itemStyle: { color: tk.color('categorical-1'), borderColor: tk.boxplot.whisker.color, borderWidth: tk.boxplot.whisker.width }, emphasis: { disabled: true },
          data: list.map((g) => [g.s.min, g.s.q1, g.s.median, g.s.q3, g.s.max]) },
      ].concat(showOutliers ? [{ type: 'scatter', id: 'outliers', silent: true, symbolSize: tk.boxplot.outlier.r * 2, z: 3, itemStyle: { color: tk.boxplot.outlier.fill, borderColor: tk.boxplot.outlier.outline, borderWidth: tk.boxplot.outlier.outlineWidth }, emphasis: { disabled: true },
        data: list.flatMap((g, i) => (g.s.outliers || []).map((v) => (across ? [v, i] : [i, v]))) }] : []),
    };
  }, [dataKey]);   // eslint-disable-line react-hooks/exhaustive-deps

  const draw = (dims) => {
    const layer = plot.layer(dims, option);
    const c = plot.chart;
    const g = c ? plotGrid(c) : null;
    if (!g || !list.length) return layer;
    const step = (across ? g.height : g.width) / list.length, thick = step * BAND;
    const at = (i, v) => { const p = c.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, across ? [v, i] : [i, v]); return { x: p[0] - g.x, y: p[1] - g.y }; };
    const inner = { width: g.width, height: g.height };
    const ai = active === null ? -1 : list.findIndex((x) => x.id === active);
    let tip = null;
    if (tooltip && ai >= 0) {
      const gr = list[ai], end = at(ai, gr.s.max);
      tip = <ChartTooltip x={end.x} y={end.y} inner={inner} title={gr.label} items={['max', 'q3', 'median', 'q1', 'min'].map((k) => ({ label: t[k], value: fmt(gr.s[k]), color: 'categorical-1' }))} />;
    }
    return [layer, (
      <g key="plx-chart-overlay" transform={'translate(' + g.x + ',' + g.y + ')'}>
        {list.map((gr, i) => { const p = at(i, gr.s.median); return across
          ? <line key={'m' + gr.id} className="plx-box-plot__median" x1={p.x} x2={p.x} y1={p.y - thick / 2} y2={p.y + thick / 2} />
          : <line key={'m' + gr.id} className="plx-box-plot__median" x1={p.x - thick / 2} x2={p.x + thick / 2} y1={p.y} y2={p.y} />; })}
        {tooltip ? list.map((gr, i) => { const p = at(i, gr.s.median); return across
          ? <rect key={'h' + gr.id} className="plx-box-plot__group" fill="none" pointerEvents="all" x={0} y={p.y - step / 2} width={g.width} height={step} {...hover(gr.id)} />
          : <rect key={'h' + gr.id} className="plx-box-plot__group" fill="none" pointerEvents="all" x={p.x - step / 2} y={0} width={step} height={g.height} {...hover(gr.id)} />; }) : null}
        {tip}
      </g>
    )];
  };

  return (
    <ChartFrame title={title} description={description} hideCaption={hideCaption} size={size} margin={NO_MARGIN} legend={legend} legendPosition={legendPosition}
      table={table} strings={strings} className={cx('plx-box-plot', 'plx-box-plot--' + o, className)}>
      {draw}
    </ChartFrame>
  );
}
// boxStats stays in the first load (chart-helpers.js); BoxPlot re-exports it
export { boxStats } from './chart-helpers.js';
