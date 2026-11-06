/* Plenix · BarChart
   Summary: Amounts compared as the lengths of bars (07 Data Display › Charts › Bar chart, Column chart, Stacked bar
     chart, Histogram): one bar per category along a value axis that starts at zero, horizontal (bars: long names,
     ranking) or vertical (columns: periods), one series or several side by side (grouped), stacked into a total
     (stacked), or as shares of each category's total (percent); and the histogram, touching columns that count how
     many values fall in each range. Drawn in ChartFrame with its axes, grid lines, legend, tooltip and data grid.
   Usage:
     <BarChart title="Storage by team" description="Design uses the most storage." categories={['Design', 'Marketing', 'Sales']}
       series={[{ id: 'gb', label: 'Storage (GB)', values: [420, 310, 120] }]} valueLabel="Storage (GB)" showValues />
     <BarChart orientation="vertical" layout="stacked" title="Uploads per month" categories={months}
       series={[{ id: 'img', label: 'Images', values: […] }, { id: 'vid', label: 'Videos', values: […] }]} />
     <BarChart orientation="vertical" title="File sizes" histogram={{ values: sizes, bins: 8 }} categoryLabel="Size (MB)" valueLabel="Files" />
   Props:
     title: the chart's name (required); description: its takeaway in a sentence or two (ChartFrame)
     categories: the category names, in the order to draw them (sort by value unless the order is natural: months, steps)
     series: [{ id, label, values, color }]: values one per category (a missing value draws nothing); color an optional
       data-viz step (default seriesColor by the series' order)
     orientation: "horizontal" (default: bars, categories down the start side) | "vertical" (columns, categories along
       the bottom)
     layout: "grouped" (default: series side by side in each category) | "stacked" (series stacked into the category's
       total) | "percent" (stacked to 100%: each series' share of its category)
     histogram: { values, bins, domain, format } draws a histogram instead of categories and series: values are the raw
       numbers, bins about how many ranges (default from the number of values), on round edges of equal width; domain
       [min, max] limits the range; format(edge) writes the range axis's labels
     valueLabel, categoryLabel: the axis titles (the measure with its unit); room is made for them
     format: (value) => text for the values (tooltip, labels, table); default formatNumber in the reader's locale
     showValues: writes each value at its bar's end (grouped), each stack's total (stacked), each share inside its segment
       when it fits (percent), or each count (histogram) (default false)
     legend: true | false: the series' legend (default: shown when there are two series or more)
     legendPosition: "bottom" (default) | "top" | "end" (ChartFrame)
     tooltip: shows the values of the bar under the pointer (default true)
     size, hideCaption, className: ChartFrame's; margin: more room around the plot ({ top, end, bottom, start }, pixels on the
       4px grid; the labels' room is made inside the plot)
     strings: { category: "Category", total: "Total", range: "Range", count: "Count" } and ChartFrame's strings
   Behavior:
     The value axis starts at zero (negative values go the other way from a zero line); stacked bars stack positive values
       up and negative values down; percent stacks only positive values.
     One Tab stop: the arrow keys move between the bars (along the categories, and across the series: bars across, ↑ ↓
       move down the categories and ← → across the series; columns, ← → along the categories and ↑ ↓ through the
       series), Home and End to the first and last category; the pointer does the same on hover. The bar in focus keeps
       its color and the others dim; its tooltip shows its value (grouped), its category's values (stacked, percent: with
       each share) or its range and count (histogram), and the live region says it. The legend's toggles hide and show
       series. The data grid lists every value.
     Histogram bins touch (no gap: the range is continuous) and have equal widths on round edges.
     The plot draws once the chart engine has loaded (the first chart on a page loads it); the caption, legend and data
       grid show at once.
   Notes:
     Colors come from the data-viz scales (seriesColor by the series' order); stacked segments and bins are parted by a
       thin line in the surface color (bar-chart tokens); axes, grid lines and labels take the frame's chart tokens
       through the ECharts theme (echarts/engine.js). The plot is drawn by Apache ECharts (issue 353); no style is written here.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber, formatPercent } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.tsx';
import { ChartLegend } from './parts/ChartLegend.tsx';
import { ChartTooltip, chartTooltipText } from './parts/ChartTooltip.tsx';
import { DataLabel } from './parts/DataLabel.tsx';
import { useChartInteraction } from './interaction.ts';
import { labelRoom, withColors, legendItems } from './chart-kit.ts';
import { useEChartsPlot, plotGrid, NO_MARGIN } from './echarts/EChartsPlot.tsx';
import { tickLineHeight } from './echarts/engine.ts';
import { gridRoom, binValues } from './chart-helpers.ts';
import { snapToGrid } from '../utils/grid.ts';
import { useStrings } from '../providers/LocaleProvider.tsx';

const LAYOUTS = ['grouped', 'stacked', 'percent'];
// px: the least room a segment needs for its share written inside it (percent)
const INSIDE_LABEL_MIN = 32;
// the gaps between bars, as shares of a category's band (geometry: the old scaleBand's paddings)
// an empty list that stays the same between renders (the drawing redraws when its data changes)
const NONE = Object.freeze([]);
const CATEGORY_GAP = '20%', SERIES_GAP = '10%';

// a bar's box in plot pixels, whatever way ECharts measured it (a negative width or height for bars that go back)
const boxOf = (l) => (l && isFinite(l.x) && isFinite(l.width) ? { x: Math.min(l.x, l.x + l.width), y: Math.min(l.y, l.y + l.height), width: Math.abs(l.width), height: Math.abs(l.height) } : null);

export { binValues } from './chart-helpers.ts';

export function BarChart({ title, description, hideCaption, size, categories = NONE, series = NONE, orientation = 'horizontal', layout = 'grouped',
  histogram, valueLabel, categoryLabel, format, showValues = false, legend, legendPosition, tooltip = true, margin, strings, className }) {
  const t = useStrings('chart.barChart', strings);
  const o = orientation === 'vertical' ? 'vertical' : 'horizontal';
  const across = o === 'horizontal';
  const bins = histogram && Array.isArray(histogram.values) ? binValues(histogram.values, histogram) : null;
  const mode = bins ? 'histogram' : LAYOUTS.indexOf(layout) >= 0 ? layout : 'grouped';
  const joined = mode !== 'grouped';
  const fmt = (v) => (typeof format === 'function' ? format(v) : formatNumber(v));
  const edgeFmt = (v) => (bins && typeof histogram.format === 'function' ? histogram.format(v) : formatNumber(v));
  const fmts = React.useRef(null);
  fmts.current = { fmt, edgeFmt };

  const list = bins ? withColors([{ id: 'count', label: valueLabel || t.count, values: bins.map((b) => b.count) }]) : withColors(series);
  const cats = bins ? bins.map((b, i) => i) : categories;
  const val = (si, ci) => { const x = Number(list[si].values[ci]); return list[si].values[ci] !== null && list[si].values[ci] !== undefined && isFinite(x) ? x : null; };
  const rangeText = (b) => edgeFmt(b.x0) + '–' + edgeFmt(b.x1);
  const catName = (ci) => (bins ? rangeText(bins[ci]) : String(cats[ci]));

  // the series shown (the legend's toggles), and each category's total of the shown series' positive values
  const showLegend = legend === undefined ? !bins && list.length > 1 : !!legend && !bins;
  const ia = useChartInteraction({
    rows: list.length, columns: cats.length, mode: 'point', series: list, strings: undefined,
    move: (cur, k) => step(cur, k), labelOf: (ci) => catName(ci),
    describe: (cell) => chartTooltipText(tip(cell.c, cell.r)),
  });
  const shown = (si) => ia.visible(list[si].id);
  const total = (ci) => list.reduce((a, s, si) => a + (shown(si) ? Math.max(0, val(si, ci) || 0) : 0), 0);
  const share = (si, ci) => (total(ci) ? Math.max(0, val(si, ci) || 0) / total(ci) : 0);
  // the keyboard: along the categories and across the series, in the directions they are drawn
  function step(cur, k) {
    const n = cats.length;
    const alongPrev = across ? 'ArrowUp' : 'ArrowLeft', alongNext = across ? 'ArrowDown' : 'ArrowRight';
    if (k === alongPrev) return { r: cur.r, c: Math.max(0, cur.c - 1) };
    if (k === alongNext) return { r: cur.r, c: Math.min(n - 1, cur.c + 1) };
    if (k === 'Home') return { r: cur.r, c: 0 };
    if (k === 'End') return { r: cur.r, c: n - 1 };
    // across the series: stacked columns go up the stack; everything else in the series' order
    const d = across ? (k === 'ArrowRight' ? 1 : -1) : joined ? (k === 'ArrowUp' ? 1 : -1) : (k === 'ArrowDown' ? 1 : -1);
    for (let r = cur.r + d; r >= 0 && r < list.length; r += d) if (shown(r)) return { r, c: cur.c };
    return cur;
  }
  // what the tooltip shows (and the live region says) for a bar: { title, items }
  function tip(ci, si) {
    if (bins) return { title: rangeText(bins[ci]), titleKind: 'data', items: [{ label: valueLabel || t.count, value: fmt(bins[ci].count), color: list[0].color }] };
    if (mode === 'grouped') return { title: String(cats[ci]), items: [{ label: list[si].label, value: val(si, ci) === null ? '–' : fmt(val(si, ci)), color: list[si].color }] };
    const items = [];
    list.forEach((s, i) => { if (!shown(i)) return; const v = val(i, ci); items.push({ label: s.label, value: v === null ? '–' : mode === 'percent' && total(ci) ? formatPercent(share(i, ci)) : fmt(v), color: s.color, i }); });
    items.sort((a, b) => (a.i === si ? -1 : b.i === si ? 1 : 0));
    return { title: String(cats[ci]) + ' · ' + fmt(total(ci)), items };
  }

  const table = bins
    ? { columns: [{ title: categoryLabel || t.range, field: 'range', kind: 'data', rowLabel: true }, { title: valueLabel || t.count, field: 'count', kind: 'data', align: 'right' }],
      data: bins.map((b, i) => ({ id: i + 1, range: rangeText(b), count: fmt(b.count) })) }
    : { columns: [{ title: categoryLabel || t.category, field: 'category', kind: 'name', rowLabel: true }]
      .concat(list.map((s, si) => ({ title: s.label, field: 's' + si, kind: 'data', align: 'right' })))
      .concat(mode !== 'grouped' && list.length > 1 ? [{ title: t.total, field: 'total', kind: 'data', align: 'right' }] : []),
    data: cats.map((c, ci) => {
      const all = list.reduce((a, s, si) => a + Math.max(0, val(si, ci) || 0), 0);
      const row = { id: ci + 1, category: String(c) };
      list.forEach((s, si) => { const v = val(si, ci); row['s' + si] = v === null ? '' : mode === 'percent' && all ? fmt(v) + ' (' + formatPercent(Math.max(0, v) / all) + ')' : fmt(v); });
      row.total = fmt(all);
      return row;
    }) };
  const key = showLegend ? <ChartLegend items={legendItems(list)} orientation={legendPosition === 'end' ? 'vertical' : 'horizontal'} {...ia.legendProps} /> : null;

  // the drawing
  const plot = useEChartsPlot();
  const shownKey = list.map((s, si) => (shown(si) ? '1' : '0')).join('');
  const marginKey = margin ? [margin.top, margin.end, margin.bottom, margin.start].join(':') : '';
  const value = (si, ci) => (mode === 'percent' ? (val(si, ci) === null ? null : share(si, ci)) : val(si, ci));
  const option = React.useCallback((tk) => {
    // room for the values written at the bars' ends (across: after the longest; columns: a label's line above)
    const room = gridRoom(margin, across ? 0 : tk.top);
    if (showValues && mode !== 'percent') {
      const ends = mode === 'stacked' ? cats.map((c, ci) => fmts.current.fmt(total(ci))) : list.reduce((a, s, si) => a.concat(cats.map((c, ci) => (val(si, ci) === null ? '' : fmts.current.fmt(val(si, ci))))), []);
      if (across) room.right = Math.max(room.right, labelRoom(ends));
      else room.top = Math.max(room.top, snapToGrid(tk.tick.fontSize + tk.tickOffset * 2, { round: 'up' }));
    }
    const named = { nameLocation: 'middle', nameMoveOverlap: true };
    const valAxis = Object.assign({ type: 'value', name: valueLabel, nameGap: across ? (tk.tickOffset * 2 + tk.tick.fontSize) : 0, inverse: across && tk.rtl,
      axisLabel: { formatter: (v) => (mode === 'percent' ? formatPercent(v) : fmts.current.fmt(v)) } }, named, mode === 'percent' ? { min: 0, max: 1 } : {});
    // the category labels' line height under columns: the font size, or more for Arabic labels (tickLineHeight)
    const catLine = across || bins ? tk.tick.fontSize : tickLineHeight(tk, cats.map(String));
    const catAxis = Object.assign({ type: 'category', data: cats.map((c, ci) => (bins ? String(ci) : String(c))), inverse: across, name: bins ? undefined : categoryLabel,
      nameGap: across ? 0 : tk.tickOffset * 2 + catLine, position: across ? (tk.rtl ? 'right' : 'left') : 'bottom',
      axisLabel: bins ? { show: false } : catLine > tk.tick.fontSize ? { lineHeight: catLine } : {} }, named);
    // a histogram's range axis: the bins' edges on a number axis laid over the bins
    const edges = bins ? Object.assign({ type: 'value', min: bins[0].x0, max: bins[bins.length - 1].x1, interval: bins.length <= 12 ? bins[0].x1 - bins[0].x0 : undefined,
      inverse: across, position: across ? (tk.rtl ? 'right' : 'left') : 'bottom', name: categoryLabel, nameGap: across ? 0 : tk.tickOffset * 2 + tk.tick.fontSize,
      axisLine: { show: false }, splitLine: { show: false }, axisLabel: { formatter: (v) => fmts.current.edgeFmt(v) } }, named) : null;
    const cat = bins ? [catAxis, edges] : catAxis;
    const sep = joined ? { borderColor: tk.separator.color, borderWidth: tk.separator.width } : {};
    return {
      animationDuration: tk.motion, animationDurationUpdate: tk.motion,
      grid: Object.assign(room, { outerBoundsMode: 'same', outerBoundsContain: 'all' }),
      xAxis: across ? valAxis : cat, yAxis: across ? cat : valAxis,
      series: list.map((s, si) => ({
        type: 'bar', id: String(s.id), name: s.label, silent: true, stack: mode === 'stacked' || mode === 'percent' ? 'total' : undefined,
        barCategoryGap: bins ? '0%' : CATEGORY_GAP, barGap: SERIES_GAP,
        itemStyle: Object.assign({ color: tk.color(s.color) }, sep),
        emphasis: { focus: 'self', blurScope: 'coordinateSystem', itemStyle: { color: tk.color(s.color) } }, blur: { itemStyle: { opacity: tk.dim } },
        data: shownKey[si] === '1' ? cats.map((c, ci) => value(si, ci)) : [],
      })),
    };
  }, [categories, series, histogram, mode, o, showValues, valueLabel, categoryLabel, shownKey, marginKey]);

  // the bar in focus is ECharts' emphasis: the others dim to the interaction's dim token
  const activeKey = ia.active ? ia.active.r + ':' + ia.active.c : '';
  React.useEffect(() => {
    const c = plot.chart;
    if (!c) return;
    c.dispatchAction({ type: 'downplay' });
    if (ia.active) c.dispatchAction({ type: 'highlight', seriesIndex: ia.active.r, dataIndex: ia.active.c });
  }, [activeKey, plot.chart]);

  const draw = (dims) => {
    const layer = plot.layer(dims, option);
    const c = plot.chart;
    const g = c ? plotGrid(c) : null;
    if (!g) return layer;
    const bar = (si, ci) => { if (!shown(si) || value(si, ci) === null) return null; const d = c.getModel().getSeriesByIndex(si); return d ? boxOf(d.getData().getItemLayout(ci)) : null; };
    // the pointer: the category under it, then the bar nearest to it across the category
    ia.register({
      nearest: (px, py) => {
        const at = c.convertFromPixel({ gridIndex: 0 }, [px, py]);
        const ci = Math.max(0, Math.min(cats.length - 1, Math.round(at ? at[across ? 1 : 0] : 0)));
        let best = null, d = Infinity;
        list.forEach((s, si) => {
          const b = bar(si, ci); if (!b) return;
          const dist = mode === 'grouped' || bins ? Math.abs((across ? b.y + b.height / 2 : b.x + b.width / 2) - (across ? py : px))
            : (across ? (px < b.x ? b.x - px : px > b.x + b.width ? px - b.x - b.width : 0) : (py < b.y ? b.y - py : py > b.y + b.height ? py - b.y - b.height : 0));
          if (dist < d) { d = dist; best = si; }
        });
        return best === null ? null : { r: best, c: ci };
      },
    });
    const inner = { width: g.width, height: g.height };
    // a bar's end: the middle of its thickness at its far end (from zero), in the grid's coordinates
    const endOf = (b, negative) => (across ? { x: (negative ? b.x : b.x + b.width) - g.x, y: b.y + b.height / 2 - g.y } : { x: b.x + b.width / 2 - g.x, y: (negative ? b.y + b.height : b.y) - g.y });
    const labels = [];
    if (showValues) cats.forEach((cname, ci) => {
      if (mode === 'stacked') {
        const tops = list.map((s, si) => (val(si, ci) !== null && val(si, ci) >= 0 ? bar(si, ci) : null)).filter(Boolean);
        if (!tops.length) return;
        const b = tops.reduce((a, x) => (across ? (x.x + x.width > a.x + a.width ? x : a) : (x.y < a.y ? x : a)));
        const e = endOf(b, false);
        labels.push(<DataLabel key={'t' + ci} x={e.x} y={e.y} value={fmt(total(ci))} position={across ? 'end' : 'top'} />);
        return;
      }
      list.forEach((s, si) => {
        const b = bar(si, ci); if (!b) return;
        if (mode === 'percent') {
          if ((across ? b.width : b.height) < INSIDE_LABEL_MIN) return;
          labels.push(<DataLabel key={'l' + ci + ':' + si} x={b.x + b.width / 2 - g.x} y={b.y + b.height / 2 - g.y} value={formatPercent(share(si, ci))} position="center" />);
          return;
        }
        // the far end from zero (bars across: the right end; columns: the top), so a negative value's label sits on the
        // empty side of the zero line
        const e = endOf(b, false);
        labels.push(<DataLabel key={'l' + ci + ':' + si} x={e.x} y={e.y} value={fmt(val(si, ci))} position={across ? 'end' : 'top'} />);
      });
    });
    let tipNode = null;
    const a = ia.active;
    if (tooltip && a && cats[a.c] !== undefined && shown(a.r)) {
      const b = mode === 'grouped' || bins ? bar(a.r, a.c) : list.map((s, si) => bar(si, a.c)).filter(Boolean).reduce((x, y) => (!x ? y : across ? (y.x + y.width > x.x + x.width ? y : x) : (y.y < x.y ? y : x)), null);
      if (b) {
        const e = endOf(b, false), tp = tip(a.c, a.r);
        tipNode = <ChartTooltip x={e.x} y={e.y} inner={inner} title={tp.title} titleKind={tp.titleKind || 'text'} items={tp.items} />;
      }
    }
    return [layer, <g key="plx-chart-overlay" transform={'translate(' + g.x + ',' + g.y + ')'}>{labels}{tipNode}</g>];
  };

  return (
    <ChartFrame title={title} description={description} hideCaption={hideCaption} size={size} margin={NO_MARGIN} legend={key} legendPosition={legendPosition}
      table={table} interaction={ia} strings={strings} className={cx('plx-bar-chart', 'plx-bar-chart--' + o, 'plx-bar-chart--' + mode, className)}>
      {draw}
    </ChartFrame>
  );
}
