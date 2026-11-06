/* Plenix · HeatMap
   Summary: A heat map (07 Data Display › Charts › Heat map): a grid of cells whose color shows the value where a row and
     a column meet (matrix: hour by weekday, team by month), or one cell per day laid out in weeks (calendar heat map),
     colored by the sequential data-viz scale (or the diverging one around a midpoint), with a scale legend from the lowest
     to the highest value. Interactive: one Tab stop, the arrow keys move from cell to cell, each cell's value shows in
     the tooltip and is said in the live region.
   Usage:
     <HeatMap title="Uploads by hour" description="Most uploads arrive on weekday mornings." rows={['Mon', 'Tue', …]}
       columns={['8:00', '9:00', …]} values={[[4, 12, …], …]} valueLabel="Uploads" />
     <HeatMap variant="calendar" title="Daily edits" data={days.map((d) => ({ date: d.date, value: d.edits }))} valueLabel="Edits" />
     <HeatMap … scale="diverging" min={-10} max={10} format={(v) => formatPercent(v / 100, { sign: true })} />
   Props:
     title, description: the chart's name and its takeaway (ChartFrame) (title required)
     variant: "matrix" (default: rows × columns) | "calendar" (one cell per day: a column per week, a row per weekday)
     rows, columns: the matrix's row and column names, top to bottom and in reading order (matrix)
     values: the matrix's values, values[row][column]; null is a missing value (matrix)
     data: the days, [{ date, value }] (calendar); days without a value inside the range are missing values
     valueLabel: what a value is ("Uploads"): the tooltip's and the table's name for it (default strings.value)
     scale: "sequential" (default: one hue, the lowest lightest) | "diverging" (two hues around the midpoint of min and max)
     min, max: the scale's ends (default the data's lowest and highest; diverging: symmetric around zero)
     format: (value) => text (default formatNumber)
     size, margin: as ChartFrame (calendar defaults to size "sm")
     interactive: keyboard, pointer, tooltip and live region (default true); onSelect({ r, c, value }): a click or Enter
     strings: the words it shows: { value: "Value", row: "Row", column: "Column", date: "Date", missing: "No data",
       low: "Low", high: "High", scale: "Color scale" }; weekday and month names follow the reader's locale
     className: more classes on the figure
   Behavior:
     ← → move along a row (calendar: a week earlier or later), ↑ ↓ along a column (calendar: the day before or after);
       Home and End go to the row's ends. Each move says "<row>, <column>: <value>" in the live region.
     A missing value is drawn as an empty cell with a dashed edge (never the lowest color) and says "No data".
     The scale legend under the plot shows the seven steps from the lowest value to the highest.
   Notes:
     Cell colors are data-viz steps (datavizStep, data-plx-dataviz); never a categorical palette. Exact values matter:
       the tooltip and the table carry them. Cell gaps, edges and the legend's swatches are --plx-comp-heat-map-* tokens.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber, formatDate, formatLocale, numeralLocale, parseDate } from '../utils/format.ts';
import { datavizStep, DATAVIZ_SCALES } from '../utils/dataviz.ts';
import { ChartFrame } from './ChartFrame.jsx';
import { useEChartsPlot } from './echarts/EChartsPlot.jsx';
import { ChartTooltip, chartTooltipText } from './parts/ChartTooltip.jsx';
import { useChartInteraction } from './interaction.js';
import { useStrings } from '../providers/LocaleProvider.tsx';

const DAY = 24 * 60 * 60 * 1000;
const NO_MARGIN = Object.freeze({ top: 0, end: 0, bottom: 0, start: 0 });
const cols0 = (n) => { const out = []; for (let c = 0; c < n; c++) out.push(c); return out; };
// the gap between cells, as a fraction of a cell (band padding: geometry)
const GAP = 0.1;

// a value's day where the reader is: a date-only "YYYY-MM-DD" through the shared reader (utils/format.ts parseDate, issue 342)
const dayStart = (d) => { const x = new Date((parseDate(d) || new Date(NaN)).getTime()); x.setHours(0, 0, 0, 0); return x; };
const keyOf = (d) => d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();

// the calendar's grid: a column per week (Sunday first), a row per weekday, and each cell's date and value
function calendarGrid(data) {
  const days = (data || []).filter((d) => d && d.date !== undefined).map((d) => ({ date: dayStart(d.date), value: typeof d.value === 'number' && isFinite(d.value) ? d.value : null }));
  if (!days.length) return { weeks: 0, cells: [], first: null, last: null };
  days.sort((a, b) => a.date - b.date);
  const first = days[0].date, last = days[days.length - 1].date;
  const start = new Date(first.getTime()); start.setDate(start.getDate() - start.getDay());
  const byDay = {}; days.forEach((d) => { byDay[keyOf(d.date)] = d.value; });
  const weeks = Math.floor(Math.round((last - start) / DAY) / 7) + 1;
  const cells = [];
  for (let w = 0; w < weeks; w++) for (let r = 0; r < 7; r++) {
    const date = new Date(start.getTime()); date.setDate(start.getDate() + w * 7 + r);
    const inside = date >= first && date <= last;
    cells.push({ r, c: w, date, inside, value: inside && byDay[keyOf(date)] !== undefined ? byDay[keyOf(date)] : null });
  }
  return { weeks, cells, first, last, start };
}

export function HeatMap({ title, description, variant = 'matrix', rows = [], columns = [], values = [], data, valueLabel, scale = 'sequential', min, max,
  format, size, margin, interactive = true, onSelect, strings, frameStrings, interactionStrings, className }) {
  const t = useStrings('chart.heatMap', strings);
  const calendar = variant === 'calendar';
  const fmt = typeof format === 'function' ? format : (v) => formatNumber(v);
  const vLabel = valueLabel || t.value;
  const locale = numeralLocale(formatLocale());
  const cal = calendar ? calendarGrid(data) : null;
  const weekday = (r) => new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2026, 0, 4 + r));   // Jan 4 2026 is a Sunday
  const rowNames = calendar ? [0, 1, 2, 3, 4, 5, 6].map(weekday) : rows;
  const nCols = calendar ? cal.weeks : columns.length;
  const cellAt = (r, c) => (calendar ? cal.cells[c * 7 + r] : { r, c, inside: true, value: values[r] && typeof values[r][c] === 'number' && isFinite(values[r][c]) ? values[r][c] : null });
  const all = [];
  for (let c = 0; c < nCols; c++) for (let r = 0; r < rowNames.length; r++) { const x = cellAt(r, c); if (x && x.inside && x.value !== null) all.push(x.value); }
  let lo = min !== undefined ? min : all.length ? Math.min.apply(null, all) : 0;
  let hi = max !== undefined ? max : all.length ? Math.max.apply(null, all) : 1;
  if (scale === 'diverging' && min === undefined && max === undefined) { const m = Math.max(Math.abs(lo), Math.abs(hi)); lo = -m; hi = m; }
  const sc = scale === 'diverging' ? 'diverging' : 'sequential';
  const titleOf = (cell) => (calendar ? formatDate(cell.date) : rowNames[cell.r] + ', ' + columns[cell.c]);
  const valueOf = (cell) => (cell.value === null ? t.missing : fmt(cell.value));
  const insideAt = (r, c) => { const x = cellAt(r, c); return !!(x && x.inside); };

  const ia = useChartInteraction({
    rows: rowNames.length, columns: nCols, mode: 'point', select: typeof onSelect === 'function', strings: interactionStrings,
    onSelect: (cell) => onSelect && onSelect(Object.assign({ value: cellAt(cell.r, cell.c).value }, cell)),
    describe: (cell) => { const x = cellAt(cell.r, cell.c); return chartTooltipText({ title: titleOf(x), items: [{ label: vLabel, value: valueOf(x) }] }); },
    labelOf: (c) => (calendar ? formatDate(cal.cells[c * 7].date) : columns[c]),
    first: () => { for (let c = 0; c < nCols; c++) for (let r = 0; r < rowNames.length; r++) if (insideAt(r, c)) return { r, c }; return null; },
    // a grid; the calendar skips the days outside its range
    move: (a, key) => {
      const d = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[key];
      if (key === 'Home' || key === 'End') {
        const cs = []; for (let c = 0; c < nCols; c++) if (insideAt(a.r, c)) cs.push(c);
        return cs.length ? { r: a.r, c: key === 'Home' ? cs[0] : cs[cs.length - 1] } : a;
      }
      if (!d) return a;
      for (let r = a.r + d[0], c = a.c + d[1]; r >= 0 && r < rowNames.length && c >= 0 && c < nCols; r += d[0], c += d[1]) if (insideAt(r, c)) return { r, c };
      return a;
    },
  });

  const table = calendar ? {
    columns: [{ title: t.date, field: 'd', kind: 'data', rowLabel: true }, { title: vLabel, field: 'v', kind: 'data', align: 'right' }],
    data: cal.cells.filter((x) => x.inside).map((x, i) => ({ id: i + 1, d: formatDate(x.date), v: valueOf(x) })),
  } : {
    columns: [{ title: t.row, field: 'r', kind: 'name', rowLabel: true }, { title: t.column, field: 'c', kind: 'name' }, { title: vLabel, field: 'v', kind: 'data', align: 'right' }],
    data: [].concat.apply([], rowNames.map((rn, r) => columns.map((cn, c) => ({ id: r * columns.length + c + 1, r: rn, c: cn, v: valueOf(cellAt(r, c)) })))),
  };
  const hasMissing = (() => { for (let c = 0; c < nCols; c++) for (let r = 0; r < rowNames.length; r++) { const x = cellAt(r, c); if (x && x.inside && x.value === null) return true; } return false; })();
  const steps = []; for (let k = 1; k <= DATAVIZ_SCALES[sc]; k++) steps.push(sc + '-' + k);
  const legend = (
    <div className="plx-heat-map-scale" role="group" aria-label={t.scale}>
      <span className="plx-heat-map-scale__end">{fmt(lo)}</span>
      <span className="plx-heat-map-scale__steps" aria-hidden="true">
        {steps.map((s) => <span key={s} className="plx-heat-map-scale__swatch" data-plx-dataviz={s} />)}
      </span>
      <span className="plx-heat-map-scale__end">{fmt(hi)}</span>
      {hasMissing ? <span className="plx-heat-map-scale__missing"><span className="plx-heat-map-scale__swatch plx-heat-map-scale__swatch--missing" aria-hidden="true" />{t.missing}</span> : null}
    </div>
  );

  // the cells ECharts draws, one by one in their data-viz step (a missing value an empty cell with a dashed edge); the frame keeps the keyboard, the ring, the tooltip and the pointer
  const plot = useEChartsPlot();
  const cellList = [];
  for (let c = 0; c < nCols; c++) for (let r = 0; r < rowNames.length; r++) { const x = cellAt(r, c); if (x && x.inside) cellList.push({ r, c, value: x.value }); }
  const dataKey = JSON.stringify([cellList, sc, lo, hi, calendar, rowNames, calendar ? null : columns, nCols, margin]);
  const room = (tk) => {
    // the room beside and above the cells for the row and column names (the old frame's margins)
    const m = Object.assign(calendar ? { top: 24, start: 40 } : {}, margin);
    const left = m.start !== undefined ? m.start : Math.max(32, Math.ceil(rowNames.reduce((n, x) => Math.max(n, String(x).length), 0) * 7 + tk.tickOffset * 2));
    return { left, top: m.top !== undefined ? m.top : 0, right: m.end !== undefined ? m.end : 8, bottom: calendar ? (m.bottom !== undefined ? m.bottom : 0) : (m.bottom !== undefined ? m.bottom : Math.ceil(tk.tick.fontSize + tk.tickOffset * 2)) };
  };
  // the grid in pixels: the calendar's cells are square (the smaller of the two steps)
  const gridOf = (tk, dims) => {
    const rm = room(tk), w = Math.max(0, dims.width - rm.left - rm.right), h = Math.max(0, dims.height - rm.top - rm.bottom);
    if (!calendar) return { left: rm.left, top: rm.top, width: w, height: h };
    const st = Math.min(w / Math.max(1, nCols), h / 7);
    return { left: rm.left, top: rm.top, width: st * nCols, height: st * 7 };
  };
  const option = React.useCallback((tk, dims) => {
    const g = gridOf(tk, dims), step = Math.min(g.width / Math.max(1, nCols), g.height / Math.max(1, rowNames.length)), gap = Math.round(step * GAP * 100) / 100;
    const hm = tk.heatmap;
    const thin = Math.max(1, Math.ceil(nCols / Math.max(2, Math.floor(g.width / 48))));
    const monthAt = calendar ? new Set(cols0(nCols).filter((c) => { const d = cal.cells[c * 7].date; const prev = c ? cal.cells[(c - 1) * 7].date : null; return !prev || prev.getMonth() !== d.getMonth(); })) : null;
    const months = calendar ? [...monthAt].filter((c, k, a) => k === a.length - 1 || a[k + 1] - c >= 3) : [];
    const named = { splitLine: { show: false }, axisTick: { show: false } };
    return {
      animationDuration: 0, animationDurationUpdate: 0,
      grid: { left: g.left, top: g.top, width: g.width, height: g.height, outerBoundsMode: 'none' },
      xAxis: Object.assign({ type: 'category', data: cols0(nCols).map(String), position: calendar ? 'top' : 'bottom', axisLine: { show: false }, axisLabel: { interval: (i) => (calendar ? months.indexOf(i) >= 0 : i % thin === 0), formatter: (v) => (calendar ? new Intl.DateTimeFormat(locale, { month: 'short' }).format(cal.cells[Number(v) * 7].date) : String(columns[Number(v)])), hideOverlap: false } }, named),
      yAxis: Object.assign({ type: 'category', data: rowNames.map((x, r) => String(r)), inverse: true, axisLine: { show: false }, axisLabel: { interval: (i) => (calendar ? i === 1 || i === 3 || i === 5 : true), formatter: (v) => String(rowNames[Number(v)]) } }, named),
      series: [{ type: 'heatmap', id: 'cells', silent: true, progressive: 0, emphasis: { disabled: true },
        data: cellList.map((x) => (x.value === null
          ? { value: [x.c, x.r, 0], itemStyle: { color: hm.empty, borderColor: hm.emptyEdge, borderWidth: hm.edgeWidth || 1, borderType: [hm.dash, hm.dash], borderRadius: hm.radius } }
          : { value: [x.c, x.r, x.value], itemStyle: { color: tk.color(datavizStep(sc, x.value, lo, hi)), borderColor: hm.surface, borderWidth: gap, borderRadius: hm.radius } })) }],
    };
  }, [dataKey]);   // eslint-disable-line react-hooks/exhaustive-deps

  const draw = (dims) => {
    const layer = plot.layer(dims, option);
    const tk = plot.tokens, chart = plot.chart;
    if (!chart || !tk || !nCols || !rowNames.length) return layer;
    const g = gridOf(tk, dims), cw = g.width / nCols, ch = g.height / rowNames.length;
    const pick = (px, py) => {
      const c = Math.floor((px - g.left) / cw), r = Math.floor((py - g.top) / ch);
      return px < g.left || py < g.top || px > g.left + g.width || py > g.top + g.height || c < 0 || r < 0 || c >= nCols || r >= rowNames.length || !insideAt(r, c) ? null : { r, c };
    };
    ia.register({ nearest: pick, columnAt: (px) => Math.min(nCols - 1, Math.max(0, Math.floor((px - g.left) / cw))) });
    const a = ia.active && insideAt(ia.active.r, ia.active.c) ? ia.active : null;
    const sel = ia.selected;
    const box = (cell) => ({ x: g.left + cell.c * cw, y: g.top + cell.r * ch, width: cw, height: ch });
    const inner = { width: dims.width, height: dims.height };
    return [layer, (
      <g key="plx-chart-overlay" className="plx-heat-map__plot">
        {sel ? <rect className="plx-chart-selected plx-heat-map__focus-box" fill="none" {...box(sel)} /> : null}
        {a ? <rect className="plx-heat-map__focus" {...box(a)} /> : null}
        {a ? <ChartTooltip x={g.left + (a.c + 0.5) * cw} y={g.top + a.r * ch} inner={inner} title={titleOf(cellAt(a.r, a.c))} titleKind={calendar ? 'data' : 'text'}
          items={[{ label: vLabel, value: valueOf(cellAt(a.r, a.c)), color: cellAt(a.r, a.c).value === null ? undefined : datavizStep(sc, cellAt(a.r, a.c).value, lo, hi) }]} /> : null}
      </g>
    )];
  };

  return (
    <ChartFrame title={title} description={description} size={size || (calendar ? 'sm' : 'md')} margin={NO_MARGIN} table={table} legend={legend}
      interaction={interactive ? ia : undefined} strings={frameStrings}
      className={cx('plx-heat-map', 'plx-heat-map--' + (calendar ? 'calendar' : 'matrix'), className)}>
      {draw}
    </ChartFrame>
  );
}
