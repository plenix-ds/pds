/* Plenix · LollipopChart
   Summary: A bar chart drawn light (07 Data Display › Charts › Lollipop chart): each category's value is a thin stem from
     zero ending in a dot, so many similar values compare without a wall of bars. Horizontal (categories down the side,
     the default) or vertical (categories along the bottom).
   Usage:
     <LollipopChart title="Uploads by team" description="Design uploads the most; legal the least."
       data={[{ label: 'Design', value: 412 }, { label: 'Marketing', value: 356 }, …]} valueTitle="Uploads" sort="desc" />
     <LollipopChart orientation="vertical" title="Downloads per month" data={months} showValues />
   Props:
     title: the chart's name (required); description: its takeaway, one or two sentences
     data: the categories, in order: [{ label, value }] (required)
     orientation: "horizontal" (default: stems across, the names down the start side) | "vertical" (stems up)
     sort: "none" (default: the data's order; categories with an order of their own, such as months) | "desc" (largest
       first) | "asc"
     color: the data-viz step of the marks ("categorical-1" by default)
     showValues: writes each value at the end of its stem (DataLabel; default false)
     format: (value) => text for values in the axis, the tooltip and the labels (default the scale's / formatNumber)
     categoryTitle, valueTitle: the data grid's column names; valueTitle (the measure, with its unit) also names the value
       in the tooltip
     size: the plot's height, as ChartFrame ("sm" | "md" default | "lg")
     strings: the words it says, for other languages: { category: "Category", value: "Value", hint } (hint: the chart interaction's)
     className: more classes on the figure
   Behavior:
     The value axis starts at zero (stems are lengths); negative values point the other way from zero.
     Keyboard: the chart is one Tab stop; the arrow keys move through the categories in order (Home, End), each spoken with
       its value; the pointer over a category does the same. The active dot gets a ring and the tooltip.
     The frame's "Show the data" table lists every category and its value.
   Notes:
     Built on ChartFrame, the chart parts (Axis, GridLines, DataLabel, ChartTooltip) and the chart-a11y helpers. Stems and
       dots take the data-viz color; the dot's radius and the stem's width are --plx-comp-lollipop-* tokens. Use bars for
       stacked or grouped values.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.jsx';
import { seriesColor } from './scales.js';
import { DataLabel } from './parts/DataLabel.jsx';
import { ChartTooltip } from './parts/ChartTooltip.jsx';
import { useChartPoints } from './a11y.js';
import { useEChartsPlot, plotGrid } from './echarts/EChartsPlot.jsx';
import { gridRoom } from './chart-helpers.js';
import { useStrings } from '../providers/LocaleProvider.tsx';

const NO_MARGIN = Object.freeze({ top: 0, end: 0, bottom: 0, start: 0 });
// the ring around the active dot (SVG geometry, the 4px grid): its radius, and the dot's room at a value's end
const RING = 8;

export function LollipopChart({ title, description, data = [], orientation = 'horizontal', sort = 'none', color, showValues = false, format,
  categoryTitle, valueTitle, size = 'md', strings, className }) {
  const t = useStrings('chart.lollipopChart', strings);
  const o = orientation === 'vertical' ? 'vertical' : 'horizontal';
  const across = o === 'horizontal';
  const rows = React.useMemo(() => {
    const r = data.map((d, i) => ({ id: i + 1, label: String(d.label), value: Number(d.value) }));
    if (sort === 'desc') r.sort((a, b) => b.value - a.value);
    if (sort === 'asc') r.sort((a, b) => a.value - b.value);
    return r;
  }, [data, sort]);
  const fmt = (v) => (typeof format === 'function' ? format(v) : formatNumber(v));
  const keys = useChartPoints({ count: rows.length, describe: (i) => rows[i].label + ', ' + fmt(rows[i].value) });
  const mark = color || seriesColor(0);
  const table = { columns: [{ title: categoryTitle || t.category, field: 'label', kind: 'name', rowLabel: true }, { title: valueTitle || t.value, field: 'shown', kind: 'data', align: 'right' }],
    data: rows.map((r) => ({ id: r.id, label: r.label, shown: fmt(r.value) })) };
  // the format the drawing calls, kept current without redrawing (a format written inline is a new function each render)
  const fmts = React.useRef(null); fmts.current = { fmt };

  const plot = useEChartsPlot();
  const dataKey = JSON.stringify(rows.map((r) => [r.label, r.value])) + '|' + o + '|' + mark + '|' + (showValues ? 1 : 0);
  const option = React.useCallback((tk) => {
    // room for the dots' rings at a value's end and for the values written there
    const room = gridRoom(NO_MARGIN, across ? 0 : tk.top);
    if (showValues) { if (across) room.right = Math.max(room.right, 48); else room.top = Math.max(room.top, Math.ceil(tk.tick.fontSize + tk.tickOffset * 2 + RING)); }
    const named = { nameLocation: 'middle', nameMoveOverlap: true };
    const valAxis = Object.assign({ type: 'value', nameGap: 0, inverse: across && tk.rtl, axisLabel: { formatter: (v) => fmts.current.fmt(v) }, axisLine: { show: false } }, named);
    const catAxis = Object.assign({ type: 'category', data: rows.map((r) => r.label), inverse: across, position: across ? (tk.rtl ? 'right' : 'left') : 'bottom', boundaryGap: true,
      axisLine: { show: true, lineStyle: { color: tk.axis.color, width: tk.axis.width } } }, named);
    const color = tk.color(mark), r = tk.lollipop.r;
    return {
      animationDuration: tk.motion, animationDurationUpdate: tk.motion,
      grid: Object.assign(room, { outerBoundsMode: 'same', outerBoundsContain: 'all' }),
      xAxis: across ? valAxis : catAxis, yAxis: across ? catAxis : valAxis,
      series: [
        // the stem: a thin bar from zero to the value
        { type: 'bar', id: 'stem', silent: true, barWidth: tk.lollipop.stem, itemStyle: { color }, emphasis: { disabled: true }, z: 1, data: rows.map((x) => x.value) },
        // the dot at the value's end
        { type: 'scatter', id: 'dot', silent: true, symbolSize: r * 2, itemStyle: { color, borderColor: tk.lollipop.outline, borderWidth: tk.lollipop.outlineWidth }, emphasis: { disabled: true }, z: 3,
          data: rows.map((x, i) => (across ? [x.value, i] : [i, x.value])) },
      ],
    };
  }, [dataKey]);   // eslint-disable-line react-hooks/exhaustive-deps

  const draw = (dims) => {
    const layer = plot.layer(dims, option);
    const c = plot.chart;
    const g = c ? plotGrid(c) : null;
    if (!g || !rows.length) return layer;
    const at = (r, i) => { const p = c.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, across ? [r.value, i] : [i, r.value]); return { x: p[0] - g.x, y: p[1] - g.y }; };
    const step = (across ? g.height : g.width) / rows.length;
    const inner = { width: g.width, height: g.height };
    const a = keys.index !== null && keys.index !== undefined && rows[keys.index] ? keys.index : null;
    const dot = RING / 2;
    return [layer, (
      <g key="plx-chart-overlay" transform={'translate(' + g.x + ',' + g.y + ')'}>
        {showValues ? rows.map((r, i) => { const p = at(r, i); return <DataLabel key={'v' + r.id} x={across ? p.x + (plot.tokens && plot.tokens.rtl ? -dot : dot) : p.x} y={across ? p.y : p.y - dot} value={fmt(r.value)} position={across ? 'end' : 'top'} className="plx-lollipop__value" />; }) : null}
        {rows.map((r, i) => {
          const p = at(r, i);
          return across
            ? <rect key={'h' + r.id} className="plx-chart-keys__hit" x={0} y={p.y - step / 2} width={g.width} height={step} onMouseEnter={() => keys.hover(i)} onMouseLeave={() => keys.hover(null)} />
            : <rect key={'h' + r.id} className="plx-chart-keys__hit" x={p.x - step / 2} y={0} width={step} height={g.height} onMouseEnter={() => keys.hover(i)} onMouseLeave={() => keys.hover(null)} />;
        })}
        {a !== null ? <circle className="plx-chart-keys__ring" cx={at(rows[a], a).x} cy={at(rows[a], a).y} r={RING} /> : null}
        {a !== null ? <ChartTooltip x={at(rows[a], a).x} y={at(rows[a], a).y} inner={inner} title={rows[a].label} items={[{ label: valueTitle || t.value, value: fmt(rows[a].value), color: mark }]} /> : null}
      </g>
    )];
  };

  return (
    <ChartFrame interaction={keys.interaction} title={title} description={description} size={size} margin={NO_MARGIN} table={table} className={cx('plx-lollipop', 'plx-lollipop--' + o, className)}>
      {draw}
    </ChartFrame>
  );
}
