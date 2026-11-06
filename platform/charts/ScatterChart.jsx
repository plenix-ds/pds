/* Plenix · ScatterChart
   Summary: Items plotted as points by two measures, to show how they relate (07 Data Display › Charts › Scatter plot):
     clusters, a correlation, the outliers. As a bubble chart (Bubble chart) each point's area shows a third measure;
     a trend line can show the fit of each series.
   Usage:
     <ScatterChart title="Size and downloads of assets" description="Larger assets are downloaded less."
       xTitle="Size (MB)" yTitle="Downloads" series={[{ id: 'img', label: 'Images', points: [{ x: 2.4, y: 310, label: 'hero.jpg' }, …] }]} />
     <ScatterChart variant="bubble" sizeTitle="Views" series={teams} …/>      // points: { x, y, size }
     <ScatterChart trend series={…} …/>
   Props:
     title: the chart's name (required); description: its takeaway
     series: the groups of points, in order: [{ id, label, points: [{ x, y, size, label }] }]; one group needs no legend
       (a legend lists them when there are two or more)
     variant: "points" (default: a scatter plot, every point the same size) | "bubble" (the area of each point is its size)
     trend: draws each series' least-squares line across its points (default false)
     xTitle, yTitle: the measures with their units: the axis titles, the table's columns and the tooltip's names (required)
     sizeTitle: the third measure of a bubble chart, with its unit
     xFormat, yFormat, sizeFormat: (value) => text (default the axis's format / formatNumber)
     size: the plot's height, as ChartFrame ("sm" | "md" default | "lg")
     strings: the words it says: { series: "Series", item: "Item", hint } (hint: the chart interaction's)
     className: more classes on the figure
   Behavior:
     Both axes fit the data (they need not start at zero) on round ticks; the axis titles name the measures.
     Bubbles: area, not radius, follows the size (the largest bubble 24px across its radius); smaller bubbles are drawn on
       top of larger ones, and every point is a little transparent, so overlaps stay visible.
     Keyboard: one Tab stop; the arrow keys move through the points (by series, then left to right), each spoken with its
       values; the pointer over a point does the same. The active point gets a ring and the tooltip.
     The frame's "Show the data" table lists every point with its measures.
   Notes:
     Built on ChartFrame, the chart parts (Axis, GridLines, ChartLegend, ChartTooltip) and the chart-a11y helpers. Series take
       the categorical colors by their order; the trend line is dashed, so it is told from the points by more than color.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.jsx';
import { seriesColor } from './scales.ts';
import { ChartLegend } from './parts/ChartLegend.tsx';
import { ChartTooltip } from './parts/ChartTooltip.tsx';
import { useChartPoints } from './a11y.ts';
import { useEChartsPlot, plotGrid } from './echarts/EChartsPlot.jsx';
import { gridRoom } from './chart-helpers.ts';
import { useStrings } from '../providers/LocaleProvider.tsx';

// the drawing's geometry on the 4px grid: a point's radius, the largest and smallest bubble's, the active ring's room
const POINT = 4, BUBBLE_MAX = 24, BUBBLE_MIN = 4, RING = 4;
// the fill is the data color at the token's opacity, the outline the color itself (as the old drawing's fill-opacity)
const withAlpha = (rgb, a) => { const m = String(rgb).match(/rgba?\(([^)]+)\)/); if (!m) return rgb; const [r, g, b] = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')'; };
const NO_MARGIN = Object.freeze({ top: 0, end: 0, bottom: 0, start: 0 });

// the least-squares line through points: [[x0, y0], [x1, y1]] across their x range, or null
function fit(points) {
  const n = points.length;
  if (n < 2) return null;
  let sx = 0, sy = 0, sxx = 0, sxy = 0, lo = Infinity, hi = -Infinity;
  points.forEach((p) => { sx += p.x; sy += p.y; sxx += p.x * p.x; sxy += p.x * p.y; lo = Math.min(lo, p.x); hi = Math.max(hi, p.x); });
  const d = n * sxx - sx * sx;
  if (!d) return null;
  const m = (n * sxy - sx * sy) / d, b = (sy - m * sx) / n;
  return [[lo, m * lo + b], [hi, m * hi + b]];
}

export function ScatterChart({ title, description, series = [], variant = 'points', trend = false, xTitle, yTitle, sizeTitle, xFormat, yFormat, sizeFormat,
  size = 'md', strings, className }) {
  const t = useStrings('chart.scatterChart', strings);
  const v = variant === 'bubble' ? 'bubble' : 'points';
  const groups = series.map((s, i) => ({ id: s.id === undefined ? i : s.id, label: s.label, color: seriesColor(i),
    points: (s.points || []).map((p) => ({ x: Number(p.x), y: Number(p.y), size: Number(p.size), label: p.label })).filter((p) => isFinite(p.x) && isFinite(p.y)) }));
  // every point in reading order (by series, then left to right): the keyboard's and the table's order
  const all = [];
  groups.forEach((g) => g.points.slice().sort((a, b) => a.x - b.x).forEach((p) => all.push(Object.assign({ series: g }, p))));
  const fx = (n) => (typeof xFormat === 'function' ? xFormat(n) : formatNumber(n));
  const fy = (n) => (typeof yFormat === 'function' ? yFormat(n) : formatNumber(n));
  const fs = (n) => (typeof sizeFormat === 'function' ? sizeFormat(n) : formatNumber(n));
  const many = groups.length > 1, named = all.some((p) => p.label !== undefined);
  const say = (p) => [many ? p.series.label : null, p.label].filter(Boolean).join(', ') + ': ' + xTitle + ' ' + fx(p.x) + ', ' + yTitle + ' ' + fy(p.y) + (v === 'bubble' && sizeTitle ? ', ' + sizeTitle + ' ' + fs(p.size) : '');
  const keys = useChartPoints({ count: all.length, describe: (i) => say(all[i]) });
  const columns = [].concat(many ? [{ title: t.series, field: 'series', kind: 'name' }] : [], named ? [{ title: t.item, field: 'item', kind: 'name', rowLabel: true }] : [],
    [{ title: xTitle, field: 'x', kind: 'data', align: 'right' }, { title: yTitle, field: 'y', kind: 'data', align: 'right' }],
    v === 'bubble' ? [{ title: sizeTitle || '', field: 'size', kind: 'data', align: 'right' }] : []);
  const table = { columns, data: all.map((p, i) => ({ id: i + 1, series: p.series.label, item: p.label, x: fx(p.x), y: fy(p.y), size: fs(p.size) })) };
  const legend = many ? <ChartLegend items={groups.map((g) => ({ id: g.id, label: g.label, color: g.color }))} /> : undefined;
  const fits = trend ? groups.map((g) => fit(g.points)) : [];
  const maxSize = Math.max(0, ...all.map((p) => (isFinite(p.size) ? p.size : 0)));
  const radius = (p) => (v !== 'bubble' || !maxSize || !isFinite(p.size) ? (plot.tokens ? plot.tokens.scatter.r : POINT) : Math.max(BUBBLE_MIN, BUBBLE_MAX * Math.sqrt(Math.max(0, p.size) / maxSize)));
  // the formats the drawing calls, kept current without redrawing (a format written inline is a new function each render)
  const fmts = React.useRef(null); fmts.current = { fx, fy };

  const plot = useEChartsPlot();
  const dataKey = JSON.stringify(groups.map((g) => g.points)) + '|' + v + '|' + (trend ? 1 : 0) + '|' + xTitle + '|' + yTitle;
  const option = React.useCallback((tk) => {
    const bubble = v === 'bubble';
    // bubbles keep the largest radius of room inside the plot, so none is cut at an edge
    const room = gridRoom(NO_MARGIN, tk.top);
    if (bubble) { room.top += BUBBLE_MAX; room.right += BUBBLE_MAX; room.bottom += BUBBLE_MAX; room.left += BUBBLE_MAX; }
    const named = { nameLocation: 'middle', nameMoveOverlap: true };
    return {
      animationDuration: tk.motion, animationDurationUpdate: tk.motion,
      grid: Object.assign(room, { outerBoundsMode: 'same', outerBoundsContain: 'all' }),
      xAxis: Object.assign({ type: 'value', name: xTitle, nameGap: tk.tickOffset * 2 + tk.tick.fontSize, scale: true, axisLine: { show: true, lineStyle: { color: tk.axis.color, width: tk.axis.width } },
        splitLine: { show: true, lineStyle: { color: tk.grid.color, width: tk.grid.width } }, axisLabel: { formatter: (n) => fmts.current.fx(n) }, inverse: false }, named),
      yAxis: Object.assign({ type: 'value', name: yTitle, nameGap: 0, position: 'left', scale: true, axisLabel: { formatter: (n) => fmts.current.fy(n) } }, named),
      series: groups.map((g) => {
        const color = tk.color(g.color);
        // larger bubbles first, so the smaller ones sit on top
        const pts = g.points.slice().sort((a, b) => (bubble ? radius(b) - radius(a) : 0));
        return { type: 'scatter', id: 'p' + g.id, name: g.label, silent: true, emphasis: { disabled: true }, itemStyle: { color: withAlpha(color, bubble ? tk.scatter.bubbleOpacity : tk.scatter.pointOpacity), borderColor: color, borderWidth: tk.scatter.outline },
          symbolSize: (val) => 2 * (bubble ? radius({ size: val[2] }) : tk.scatter.r), data: pts.map((p) => [p.x, p.y, p.size]) };
      }).concat(groups.map((g, i) => (fits[i] ? { type: 'line', id: 't' + g.id, silent: true, emphasis: { disabled: true }, showSymbol: false, symbol: 'none', lineStyle: { color: tk.color(g.color), width: tk.scatter.trend.width, type: [tk.scatter.trend.dash, tk.scatter.trend.gap] }, itemStyle: { color: tk.color(g.color) }, data: fits[i], z: 1 } : null)).filter(Boolean)),
    };
  }, [dataKey]);   // eslint-disable-line react-hooks/exhaustive-deps

  const draw = (dims) => {
    const layer = plot.layer(dims, option);
    const c = plot.chart;
    const g = c ? plotGrid(c) : null;
    if (!g) return layer;
    const px = (p) => c.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [p.x, p.y]);
    // the pointer's geometry: the nearest point within its own radius and a finger's reach
    keys.interaction.register({
      nearest: (x, y) => {
        let best = null, d = Infinity;
        all.forEach((p, i) => { const q = px(p); const dist = Math.hypot(q[0] - x, q[1] - y); if (dist < d && dist <= Math.max(radius(p), 12)) { d = dist; best = { r: 0, c: i }; } });
        return best;
      },
    });
    const inner = { width: g.width, height: g.height };
    const a = keys.index !== null && keys.index !== undefined && all[keys.index] ? all[keys.index] : null;
    const at = a ? px(a) : null;
    // the overlay works in the grid's own coordinates (its top left corner at 0,0), as the plot did
    return [layer, (
      <g key="plx-chart-overlay" transform={'translate(' + g.x + ',' + g.y + ')'}>
        {a ? <circle className="plx-chart-keys__ring" cx={at[0] - g.x} cy={at[1] - g.y} r={radius(a) + RING} /> : null}
        {a ? <ChartTooltip x={at[0] - g.x} y={at[1] - g.y} inner={inner} title={a.label || a.series.label}
          items={[{ label: xTitle, value: fx(a.x), color: a.series.color }, { label: yTitle, value: fy(a.y), color: a.series.color }].concat(v === 'bubble' && sizeTitle ? [{ label: sizeTitle, value: fs(a.size), color: a.series.color }] : [])} /> : null}
      </g>
    )];
  };

  return (
    <ChartFrame interaction={keys.interaction} title={title} description={description} size={size} margin={NO_MARGIN} table={table} legend={legend} className={cx('plx-scatter', 'plx-scatter--' + v, className)}>
      {draw}
    </ChartFrame>
  );
}
