/* Plenix · RadarChart
   Summary: The profile of one item, or of two or three compared, across several measures on one scale (07 Data Display ›
     Charts › Radar chart): one spoke per measure from the center (zero) to the scale's end, rings at the scale's ticks,
     and each item a closed shape through its values, its outline in the series' color and its area lightly filled so
     overlapping shapes stay visible. Drawn in ChartFrame with a legend (compare), a tooltip and the data grid.
   Usage:
     <RadarChart title="Asset quality" description="The hero image scores high on every measure but file size."
       axes={[{ key: 'res', label: 'Resolution' }, { key: 'color', label: 'Color' }, { key: 'meta', label: 'Metadata' }, { key: 'size', label: 'File size' }, { key: 'rights', label: 'Rights' }]}
       series={[{ id: 'hero', label: 'Hero image', values: { res: 9, color: 8, meta: 7, size: 4, rights: 9 } }]} max={10} />
   Props:
     title: the chart's name (required); description: its takeaway (ChartFrame)
     axes: the measures, clockwise from the top: [{ key, label }] (four to eight read best)
     series: the items: [{ id, label, values, color }]; values an object by axis key or an array in the axes' order
     max: the scale's end (default the largest value on a round number); every spoke starts at zero
     rings: about how many rings (default 4: the scale's round ticks)
     format: (value) => text (ring values, tooltip, table); default formatNumber
     showPoints: draws a point at each value (default true); the points are the tooltip's targets
     legend: true | false (default: shown with two items or more); legendPosition: ChartFrame's
     tooltip: shows the item's value on the measure under the pointer (default true)
     size, margin, hideCaption, className: ChartFrame's
     strings: { measure: "Measure" } and ChartFrame's strings
   Behavior:
     Every measure shares the scale: normalize measures of different units first (to a score, a percentage), or use bars.
     Hover a point: the tooltip shows the item and the measure's value. The data grid lists every value.
   Notes:
     Shapes' outlines and points take the series' data-viz color (the frame's line and point); the area takes the same
       color at the low opacity (radar-chart tokens). Spokes and rings are the frame's grid lines; the measures' names are
       UI text, the ring values the data font. Compare three items at most.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.jsx';
import { niceTicks } from './scales.js';
import { ChartLegend } from './parts/ChartLegend.jsx';
import { ChartTooltip } from './parts/ChartTooltip.jsx';
import { useChartHover, withColors, legendItems, finite } from './chart-kit.js';
import { useEChartsPlot } from './echarts/EChartsPlot.jsx';
import { useStrings } from '../providers/LocaleProvider.tsx';

const NO_MARGIN = Object.freeze({ top: 0, end: 0, bottom: 0, start: 0 });
// px: the room around the web for the measures' names (on the 4px grid); the start and end sides take the longest name
const WEB_MARGIN = { top: 24, bottom: 24 };
const CHAR = 7;   // px: about one character of the measures' names (the label font at 12px)

export function RadarChart({ title, description, hideCaption, size = 'lg', axes = [], series = [], max, rings = 4, format, showPoints = true, legend, legendPosition,
  tooltip = true, margin, strings, className }) {
  const t = useStrings('chart.radarChart', strings);
  const fmt = (v) => (typeof format === 'function' ? format(v) : formatNumber(v));
  const [active, hover] = useChartHover();
  const list = withColors(series);
  const valueOf = (s, ai) => finite(Array.isArray(s.values) ? s.values[ai] : (s.values || {})[axes[ai].key]);
  const top = max !== undefined ? Number(max) : list.reduce((a, s) => Math.max(a, Math.max.apply(null, [0].concat(axes.map((x, ai) => valueOf(s, ai))))), 0) || 1;
  // the scale's end: the given max, or the round tick above the largest value
  const scale = niceTicks(0, max !== undefined ? top : top, rings).ticks.filter((v) => v <= (max !== undefined ? top : Infinity));
  const end = max !== undefined ? top : scale[scale.length - 1];
  // the rings: the scale's round ticks (the outermost is the scale's end), each ring's value written up the first spoke (the outermost left out: the first measure's name sits there)
  const ringValues = scale.filter((v) => v > 0 && v < end);
  const side = Math.ceil((axes.reduce((n, a) => Math.max(n, String(a.label || '').length), 0) * CHAR + 8) / 4) * 4;
  const m = Object.assign({}, WEB_MARGIN, { start: side, end: side }, margin);
  const table = {
    columns: [{ title: t.measure, field: 'measure', kind: 'name', rowLabel: true }].concat(list.map((s, si) => ({ title: s.label, field: 's' + si, kind: 'data', align: 'right' }))),
    data: axes.map((a, ai) => { const row = { id: ai + 1, measure: a.label }; list.forEach((s, si) => { row['s' + si] = fmt(valueOf(s, ai)); }); return row; })
  };
  const showLegend = legend === undefined ? list.length > 1 : !!legend;
  const key = showLegend ? <ChartLegend items={legendItems(list)} orientation={legendPosition === 'end' ? 'vertical' : 'horizontal'} /> : null;
  // the format the drawing calls, kept current without redrawing (a format written inline is a new function each render)
  const fmts = React.useRef(null); fmts.current = { fmt };

  const plot = useEChartsPlot();
  const dataKey = JSON.stringify([axes.map((a) => [a.key, a.label]), list.map((s) => [s.id, s.color, axes.map((a, ai) => valueOf(s, ai))]), end, rings, showPoints, m]);
  const option = React.useCallback((tk, dims) => {
    // the web fills the plot less the room for the measures' names (the frame's old margin), centered
    const R = Math.max(0, Math.min(dims.width - m.start - m.end, dims.height - m.top - m.bottom) / 2);
    return {
      animationDuration: tk.motion, animationDurationUpdate: tk.motion,
      radar: { center: ['50%', '50%'], radius: R, startAngle: 90, clockwise: true, splitNumber: Math.max(1, scale.filter((v) => v > 0).length), shape: 'polygon', indicator: axes.map((a) => ({ name: a.label, max: end, min: 0 })),
        axisName: { color: tk.radar.label.color, fontFamily: tk.radar.label.fontFamily, fontSize: tk.radar.label.fontSize, fontWeight: tk.radar.label.fontWeight },
        axisLabel: { show: false },
        axisLine: { lineStyle: { color: tk.grid.color, width: tk.grid.width } }, splitLine: { lineStyle: { color: tk.grid.color, width: tk.grid.width } }, splitArea: { show: false } },
      series: list.map((s) => ({ type: 'radar', id: String(s.id), name: s.label, silent: true, emphasis: { disabled: true }, symbol: 'circle', symbolSize: showPoints ? tk.radar.point * 2 : 0,
        lineStyle: { color: tk.color(s.color), width: tk.lineWidth }, itemStyle: { color: tk.color(s.color), borderColor: tk.point.outline, borderWidth: tk.point.outlineWidth },
        areaStyle: { color: tk.color(s.color), opacity: tk.radar.area }, data: [{ value: axes.map((a, ai) => valueOf(s, ai)), name: s.label }] })),
    };
  }, [dataKey]);   // eslint-disable-line react-hooks/exhaustive-deps

  const draw = (dims) => {
    const layer = plot.layer(dims, option);
    const c = plot.chart;
    const radar = c ? c.getModel().getComponent('radar') : null;
    const cs = radar && radar.coordinateSystem;
    if (!cs) return layer;
    const at = (v, ai) => { const p = cs.dataToPoint(v, ai); return { x: p[0], y: p[1] }; };
    let tip = null;
    if (tooltip && active !== null) {
      const [si, ai] = String(active).split(':').map(Number);
      if (list[si] && axes[ai]) {
        const p = at(valueOf(list[si], ai), ai);
        tip = <ChartTooltip x={p.x} y={p.y} inner={{ width: dims.width, height: dims.height }} title={axes[ai].label} items={[{ label: list[si].label, value: fmt(valueOf(list[si], ai)), color: list[si].color }]} />;
      }
    }
    // the points are the tooltip's targets: a round hit area over each, in the frame's overlay
    return [layer, (
      <g key="plx-chart-overlay">
        {ringValues.map((v) => { const p = at(v, 0); return <text key={'v' + v} className="plx-chart__tick-label plx-radar-chart__ring-label" x={p.x} y={p.y}>{fmt(v)}</text>; })}
        {tooltip ? list.map((s, si) => axes.map((a, ai) => { const p = at(valueOf(s, ai), ai); return <circle key={s.id + a.key} className="plx-radar-chart__hit" fill="none" stroke="none" pointerEvents="all" cx={p.x} cy={p.y} r={Math.max(8, plot.tokens ? plot.tokens.radar.point : 4)} {...hover(si + ':' + ai)} />; })) : null}
        {tip}
      </g>
    )];
  };

  return (
    <ChartFrame title={title} description={description} hideCaption={hideCaption} size={size} margin={NO_MARGIN} legend={key} legendPosition={legendPosition}
      table={table} strings={strings} className={cx('plx-radar-chart', list.length > 1 && 'plx-radar-chart--compare', className)}>
      {draw}
    </ChartFrame>
  );
}
