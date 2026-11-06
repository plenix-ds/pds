/* Plenix · LineChart
   Summary: A line chart (07 Data Display › Charts › Line chart, and its Step chart variant): one line per series through
     its values over an ordered range, usually time, drawn in ChartFrame with its axes, grid lines and data grid. Lines
     are straight between values (curve "linear") or hold each value until the next change (curve "step"); points mark
     the values when there are few of them. It is interactive: one Tab stop, the arrow keys and the pointer move a
     crosshair with the shared tooltip, the value is said in the live region, the legend shows and hides series, and a
     brush can zoom to a range. The plot is drawn by Apache ECharts (platform/charts/echarts, issue 353) in the Plenix theme.
   Usage:
     <LineChart title="Sign-ups by platform" description="Sign-ups grew on every platform; the web stays ahead."
       data={rows} x="month" series={[{ id: 'web', label: 'Web' }, { id: 'ios', label: 'iOS' }]} yLabel="Sign-ups" />
     <LineChart title="Price per seat" data={prices} x="date" series={[{ id: 'price', label: 'Price' }]} curve="step" points
       format={(v) => formatCurrency(v, 'USD')} />
     <LineChart … zoom onSelect={({ r, c }) => openDay(rows[c])} overlay={({ inner, y }) => <ReferenceLine scale={y} value={250} inner={inner} label="Target" />} />
   Props:
     title, description: the chart's name and its takeaway (ChartFrame) (title required)
     data: the rows, in the x order: [{ month: 'Jan', web: 120, ios: 80 }, …]; a missing value (null) breaks the line
     x: a string: the field of each row that holds its x value (default "x"): a name (categories), a Date (time) or a number
     series: the lines, in the legend's order: [{ id, label, field }] (field defaults to id); colors follow that order
       (seriesColor(i))
     xType: "auto" (default: from the first x value) | "band" (categories) | "time" | "linear"
     curve: "linear" (default: straight between values) | "step" (holds each value until the next one: the Step chart)
     step: where a step changes: "after" (default: at the next value) | "before" (at this value)
     points: draws a point on every value (default false; true for few values, or when the moments matter)
     zero: true starts the value axis at zero (default true); false lets a trend fill the plot (say so in the description)
     yDomain: [min, max] of the value axis, instead of the data's
     format: (value) => text for values (ticks, tooltip, table), default formatNumber; formatX: (x) => text for x values
       (default: formatDate for time, formatNumber for numbers, the name for categories)
     xLabel, yLabel: the axis titles (the measure and its unit); the plot makes room for them and for every tick label
     size, legendPosition: as ChartFrame; margin: more room around the plot ({ top, end, bottom, start }, pixels on the
       4px grid; default none: the labels' room is made inside the plot)
     legend: "auto" (default: a legend when there are two or more series; interactive toggles) | false | a node
     interactive: true gives it the keyboard, pointer, tooltip and live region (default true)
     zoom: true adds a brush (a drag, or Shift with the arrow keys) that zooms to a range of x values; Reset zoom shows all (default false)
     onSelect({ r, c, row, series }): a click or Enter on a value selects it (the selected value keeps its ring)
     overlay({ inner, x, y, at }): more SVG on top of the lines: reference lines, thresholds, annotations (x and y place a
       value in the plot, as scales do: y(250), y.ticks(); at(i) the x position of row i)
     strings: the words it shows, for other languages: { category: "Category" } (the table's first column without
       xLabel); the frame's and the interaction's words are theirs (frameStrings, interactionStrings)
     className: more classes on the figure
   Behavior:
     One Tab stop: ← → move the crosshair along the values, ↑ ↓ between the series, Home and End to the ends; each move
       says the values at that x in the live region (the series in focus first). The pointer does the same on hover.
     A missing value is a gap: the line is not drawn across it, and the table shows a dash.
     The legend's toggles hide and show series (the last one shown stays); the value axis follows the series shown.
     With zoom, the axis shows the marked range only; the Reset zoom button above the plot brings back all values.
     The plot draws once the chart engine has loaded (the first chart on a page loads it); the caption, legend and data
       grid show at once.
   Notes:
     Every color is a data-viz step (seriesColor by the series' order); the lines, points, axes, grid lines and labels
       take the frame's chart tokens through the ECharts theme (echarts/engine.js); the focus ring, crosshair and tooltip
       are the chart interaction's. No style is written in this file.
     Up to about five series; more lines tangle: use small multiples. Unordered categories: a bar or column chart.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber, formatDate, formatPercent, parseDate } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.tsx';
import type { ChartInner, ChartMargin, ChartValue } from './chart-types.ts';
import { seriesColor, scaleTime, wholeDays } from './scales.ts';
import { ChartLegend } from './parts/ChartLegend.tsx';
import { ChartTooltip, chartTooltipText } from './parts/ChartTooltip.tsx';
import { useChartInteraction, ChartFocusMark, ChartBrush } from './interaction.ts';
import { useEChartsPlot, plotGrid } from './echarts/EChartsPlot.tsx';
import { tickLineHeight } from './echarts/engine.ts';
import { snapToGrid } from '../utils/grid.ts';
import { gridRoom } from './chart-helpers.ts';
import { halfRoom } from './chart-kit.ts';
import { useStrings } from '../providers/LocaleProvider.tsx';

const DASH = '—';
// an empty list that stays the same between renders (the drawing redraws when its data changes)
const NONE: any[] = Object.freeze([]) as any;

// the room one tick label needs along the x axis, in pixels: fewer date ticks on a narrow chart (as before ECharts)
const TICK_ROOM = 64;

const isNum = (v: any) => typeof v === 'number' && isFinite(v);
const typeOf = (v: any) => (v instanceof Date ? 'time' : typeof v === 'number' ? 'linear' : 'band');
export { gridRoom } from './chart-helpers.ts';
// ECharts' axis ticks, for an overlay's scale
const axisTicks = (chart: any, axis: any) => {
  try { return chart.getModel().getComponent(axis, 0).axis.scale.getTicks().map((t: any) => t.value); } catch (e) { return []; }
};

// the shared engine of LineChart and AreaChart (kind "area": filled down to the baseline or the series under it)
/** @public one line (or area) of a series chart */
export type ChartSeries = { id: string; label: string; /** the row field; defaults to id */ field?: string };
/** @public the props every line and area chart takes */
export type LineChartProps = {
  title: string;
  description?: string;
  /** the rows, in the x order; a missing value (null) breaks the line */
  data?: Record<string, unknown>[];
  /** the field of each row that holds its x value (default "x") */
  x?: string;
  series?: ChartSeries[];
  xType?: 'auto' | 'band' | 'time' | 'linear';
  curve?: 'linear' | 'step';
  step?: 'after' | 'before';
  points?: boolean;
  zero?: boolean;
  yDomain?: [number, number];
  format?(value: number): string;
  formatX?(value: ChartValue): string;
  xLabel?: string;
  yLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  margin?: ChartMargin;
  legend?: 'auto' | false | React.ReactNode;
  legendPosition?: 'bottom' | 'top' | 'end';
  interactive?: boolean;
  zoom?: boolean;
  /** a click or Enter on a value selects it */
  onSelect?(cell: { r: number; c: number; row: Record<string, unknown>; series: ChartSeries }): void;
  /** more SVG on top of the lines: reference lines, thresholds, annotations */
  overlay?(draw: { inner: ChartInner; x: (value: ChartValue) => number | undefined; y: ((value: number) => number) & { ticks(): number[] }; at(index: number): number }): React.ReactNode;
  strings?: Record<string, string>;
  frameStrings?: Record<string, string>;
  interactionStrings?: Record<string, string>;
  className?: string;
};
/** @public the area chart's props: the line chart's and how areas stack */
export type AreaChartProps = LineChartProps & { stack?: 'none' | 'stacked' | 'percent' };
export function SeriesChart({ kind = 'line', title, description, data = NONE, x = 'x', series = NONE, xType = 'auto', curve = 'linear', step = 'after',
  points = false, stack = 'none', zero = true, yDomain, format, formatX, xLabel, yLabel, size = 'md', margin, legend = 'auto', legendPosition = 'bottom',
  interactive = true, zoom = false, onSelect, overlay, strings, frameStrings, interactionStrings, className }: LineChartProps & { kind?: 'line' | 'area'; stack?: 'none' | 'stacked' | 'percent' }) {
  const t: any = useStrings('chart.lineChart', strings);
  const area = kind === 'area';
  const stacked = area && (stack === 'stacked' || stack === 'percent');
  const percent = area && stack === 'percent';
  const list = series.map((s: any, i: any) => ({ id: s.id === undefined ? 'series-' + i : s.id, label: s.label === undefined ? String(s.id) : s.label, field: s.field || s.id, color: s.color || seriesColor(i) }));
  const xv = data.map((row: any) => (row ? row[x] : undefined));
  const type = xType === 'auto' ? typeOf(xv.find((v: any) => v !== undefined && v !== null)) : xType;
  // a time axis reads its values with the shared reader: a date-only "YYYY-MM-DD" is that calendar day where the reader is (issue 342)
  const xs = type === 'time' ? xv.map((v: any) => (typeof v === 'number' ? new Date(v) : parseDate(v) || new Date(NaN))) : xv;
  const days = type === 'time' && wholeDays(xs.filter((d: any) => !isNaN(d.getTime())));
  const raw = (s: any, c: any): number | null => { const v = data[c] ? data[c][list[s].field] : undefined; return isNum(v) ? (v as number) : null; };
  const fmtX = typeof formatX === 'function' ? formatX : type === 'time' ? (v: any) => formatDate(v) : type === 'linear' ? (v: any) => formatNumber(v) : (v: any) => String(v);
  const fmtV = typeof format === 'function' ? format : (v: any) => formatNumber(v);
  const shown = (s: any) => ia.visible(list[s].id);
  // the formats the drawing calls, kept current without redrawing (a format written inline is a new function each render)
  const fmts = React.useRef<any>(null);
  fmts.current = { fmtX, fmtV };

  const ia = useChartInteraction({
    rows: list.length, columns: data.length, mode: 'x', series: list, zoom, select: typeof onSelect === 'function',
    onSelect: (cell) => onSelect && onSelect(Object.assign({ row: data[cell.c], series: list[cell.r] }, cell)),
    labelOf: (c) => fmtX(xs[c]), strings: interactionStrings,
    describe: (cell) => chartTooltipText({ title: fmtX(xs[cell.c]), items: tipItems(cell.c, cell.r) }),
  });

  // stacked values: the bottom and the top of each series at each column (shown series only); percent: shares of 1
  const level = (s: any, c: any): number[] | null => {
    if (!stacked) { const v = raw(s, c); return v === null ? null : [0, v]; }
    let base = 0, total = 0;
    for (let k = 0; k < list.length; k++) if (shown(k)) total += raw(k, c) || 0;
    for (let k = 0; k < s; k++) if (shown(k)) base += raw(k, c) || 0;
    const v = raw(s, c) || 0;
    const div = percent ? (total || 1) : 1;
    return [base / div, (base + v) / div];
  };
  function tipItems(c: any, first?: any) {
    const items: any = [];
    list.forEach((s: any, i: any) => {
      if (!shown(i)) return;
      const v = raw(i, c);
      const share: any = percent && v !== null ? level(i, c) : null;
      items.push({ label: s.label, value: v === null ? DASH : percent ? formatPercent(share[1] - share[0]) + ' (' + fmtV(v) + ')' : fmtV(v), color: s.color, i });
    });
    if (first !== undefined) items.sort((a: any, b: any) => (a.i === first ? -1 : b.i === first ? 1 : 0));
    return items;
  }

  const table: { columns: any[]; data: any[] } = {
    columns: ([{ title: xLabel || t.category, field: 'x', kind: type === 'band' ? 'name' : 'data', rowLabel: true }] as any[])
      .concat(list.map((s: any, i: any) => ({ title: s.label, field: 's' + i, kind: 'data', align: 'right' }))),
    data: data.map((row: any, c: any) => { const o: Record<string, any> = { id: c + 1, x: fmtX(xs[c]) }; list.forEach((s: any, i: any) => { const v = raw(i, c); o['s' + i] = v === null ? DASH : fmtV(v); }); return o; }),
  };
  const legendNode = legend === 'auto' ? (list.length > 1
    ? <ChartLegend items={list.map((s: any) => ({ id: s.id, label: s.label, color: s.color }))} shape={area ? 'square' : 'line'} {...((interactive ? ia.legendProps : {}) as any)} />
    : null) : legend || null;

  // the drawing: the shown range of columns, the shown series; ECharts lays out the axes and their labels
  const plot = useEChartsPlot();
  const [v0, v1] = ia.view();
  const shownKey = list.map((s: any, i: any) => (shown(i) ? '1' : '0')).join('');
  const domainKey = Array.isArray(yDomain) ? yDomain.join(':') : '';
  const marginKey = margin ? [margin.top, margin.end, margin.bottom, margin.start].join(':') : '';
  // the x value ECharts places column c at: its index in the shown range (categories), its time or its number
  const xValue = (c: any) => (type === 'band' ? c - v0 : type === 'time' ? +xs[c] : Number(xs[c]));
  const option = React.useCallback((tk: any, size: any) => {
    const cols: any = []; for (let c = v0; c <= v1; c++) cols.push(c);
    // dates: the Platform's calendar ticks and their labels (Jun 2026, or the app's formatX), about one per TICK_ROOM
    const timeLabels = (sz: any) => {
      // dates without a time get day ticks or coarser, never hours (issue 593)
      const ts = scaleTime({ domain: [xs[v0], xs[v1]], range: [0, sz.width], unit: days ? 'day' : undefined });
      const count = Math.max(2, Math.floor(sz.width / TICK_ROOM));
      const ticks = ts.ticks(count);
      const text = (v: any) => (typeof formatX === 'function' ? fmts.current.fmtX(new Date(v)) : ts.format(new Date(v), count));
      return { customValues: ticks.map((d: any) => +d), formatter: text, last: ticks.length ? text(+ticks[ticks.length - 1]) : '' };
    };
    const room = gridRoom(margin, tk.top);
    // ECharts does not measure labels at its own tick values: the room under the plot and after it for the date labels
    const dates = type === 'time' ? timeLabels(size) : null;
    // the x labels' line height: the font size, or more for Arabic labels (tickLineHeight)
    const xTexts = type === 'band' ? cols.map((c: any) => fmts.current.fmtX(xs[c])) : dates ? dates.customValues.map(dates.formatter) : [];
    const xLine = tickLineHeight(tk, xTexts);
    if (dates) {
      room.bottom = Math.max(room.bottom, snapToGrid(tk.tickOffset + xLine, { round: 'up' }));
      room.right = Math.max(room.right, halfRoom(dates.last));
    }
    const named = { nameLocation: 'middle', nameMoveOverlap: true };
    const rule = { show: true, lineStyle: { color: tk.axis.color, width: tk.axis.width } };
    // time and sequence run left to right in every language, Arabic pages included (owner, issue 584 B); the labels
    // and the legend still follow the page's direction
    const xAxis = Object.assign({ name: xLabel, nameGap: tk.tickOffset * 2 + xLine, inverse: false }, named,
      type === 'band' ? Object.assign({ type: 'category', boundaryGap: false, data: xTexts }, xLine > tk.tick.fontSize ? { axisLabel: { lineHeight: xLine } } : {})
        : { type: type === 'time' ? 'time' : 'value', min: xValue(v0), max: xValue(v1), axisLine: rule, splitLine: { show: false },
          axisLabel: dates ? { customValues: dates.customValues, formatter: dates.formatter } : { formatter: (v: any) => fmts.current.fmtX(v) } });
    const yAxis = Object.assign({ type: 'value', name: yLabel, nameGap: 0, position: 'left',
      axisLabel: { formatter: (v: any) => (percent ? formatPercent(v) : fmts.current.fmtV(v)) } }, named,
      percent ? { min: 0, max: 1 } : Array.isArray(yDomain) ? { min: yDomain[0], max: yDomain[1] } : { scale: !(zero || area) });
    const value = (i: any, c: any) => {
      if (!stacked) return raw(i, c);
      const l = level(i, c) as number[];
      return percent ? l[1] - l[0] : raw(i, c) || 0;
    };
    return {
      animationDuration: tk.motion, animationDurationUpdate: tk.motion,
      grid: Object.assign(room, { outerBoundsMode: 'same', outerBoundsContain: 'all' }),
      xAxis, yAxis,
      series: list.map((s: any, i: any) => {
        const color = tk.color(s.color);
        return {
          type: 'line', id: String(s.id), name: s.label, silent: true, emphasis: { disabled: true },
          showSymbol: !!points, connectNulls: false, stack: stacked ? 'total' : undefined,
          step: curve === 'step' ? (step === 'before' ? 'start' : 'end') : false,
          lineStyle: { color }, itemStyle: { color },
          areaStyle: area ? { color, opacity: stacked ? tk.area.stacked : tk.area.opacity } : undefined,
          data: shownKey[i] === '1' ? cols.map((c: any) => (type === 'band' ? value(i, c) : [xValue(c), value(i, c)])) : [],
        };
      }),
    };
  }, [data, series, x, type, curve, step, points, stack, zero, domainKey, xLabel, yLabel, shownKey, v0, v1, marginKey]);

  const draw = (dims: any) => {
    const layer = plot.layer(dims, option);
    const c = plot.chart;
    const g = c ? plotGrid(c) : null;
    if (!g) return layer;
    const cols: any = []; for (let k = v0; k <= v1; k++) cols.push(k);
    const posOf = (col: any) => c.convertToPixel({ xAxisIndex: 0 }, xValue(col));
    const yPx = (v: any) => c.convertToPixel({ yAxisIndex: 0 }, v);
    // the pointer's geometry: the nearest shown column, then the nearest series at it
    const columnAt = (px: any) => cols.reduce((best: any, k: any) => (Math.abs(posOf(k) - px) < Math.abs(posOf(best) - px) ? k : best), cols[0]);
    ia.register({
      columnAt,
      nearest: (px: any, py: any) => {
        const col = columnAt(px); let r = null, d = Infinity;
        list.forEach((s: any, i: any) => { const l = shown(i) ? level(i, col) : null; if (l && (stacked || raw(i, col) !== null) && Math.abs(yPx(l[1]) - py) < d) { d = Math.abs(yPx(l[1]) - py); r = i; } });
        return r === null ? null : { r, c: col };
      },
    });
    // the overlay works in the grid's own coordinates (its top left corner at 0,0), as the old plot's inner area
    const inner = { width: g.width, height: g.height };
    const X = (v: any) => (type === 'band' ? posOf(xs.indexOf(v)) : c.convertToPixel({ xAxisIndex: 0 }, type === 'time' ? +(typeof v === 'number' ? new Date(v) : parseDate(v) || new Date(NaN)) : Number(v))) - g.x;
    const Y = (v: any) => yPx(v) - g.y;
    Y.ticks = () => axisTicks(c, 'yAxis'); Y.format = (v: any) => fmtV(v); Y.domain = () => { const tk = Y.ticks(); return [tk[0], tk[tk.length - 1]]; };
    const at = (col: any) => posOf(col) - g.x;
    const a = ia.active && ia.active.c >= v0 && ia.active.c <= v1 ? ia.active : null;
    const sel = ia.selected && ia.selected.c >= v0 && ia.selected.c <= v1 && shown(ia.selected.r) ? ia.selected : null;
    const selLevel = sel && raw(sel.r, sel.c) !== null ? level(sel.r, sel.c) : null;
    const top = (i: any, col: any) => { const l = shown(i) && (stacked || raw(i, col) !== null) ? level(i, col) : null; return l ? Y(l[1]) : null; };
    return [layer, (
      <g key="plx-chart-overlay" className={cx('plx-line-chart__plot', area && 'plx-area-chart__plot')} transform={'translate(' + g.x + ',' + g.y + ')'}>
        {ia.brush ? <ChartBrush x0={at(ia.brush[0])} x1={at(ia.brush[1])} inner={inner} /> : null}
        {typeof overlay === 'function' ? overlay({ inner, x: X, y: Y, at }) : null}
        {selLevel ? <ChartFocusMark className="plx-chart-selected" x={at(sel.c)} y={Y(selLevel[1])} color={list[sel.r].color} /> : null}
        {a ? list.map((s: any, i: any) => { const y = top(i, a.c); return y === null ? null : <ChartFocusMark key={s.id} x={at(a.c)} y={y} color={s.color} />; }) : null}
        {a ? <ChartTooltip variant="shared" x={at(a.c)} inner={inner} title={fmtX(xs[a.c])} titleKind={type === 'band' ? 'text' : 'data'} items={tipItems(a.c)} /> : null}
      </g>
    )];
  };

  return (
    <ChartFrame title={title} description={description} size={size} margin={{ top: 0, end: 0, bottom: 0, start: 0 }} table={table} legend={legendNode} legendPosition={legendPosition}
      interaction={interactive ? ia : undefined} strings={frameStrings}
      className={cx(area ? 'plx-area-chart' : 'plx-line-chart', area && stacked && 'plx-area-chart--stacked', className)}>
      {draw}
    </ChartFrame>
  );
}

export function LineChart(props: LineChartProps) {
  return <SeriesChart {...props} kind="line" stack="none" />;
}
