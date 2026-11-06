/* Plenix · Sparkline
   Summary: A word-sized chart without axes that shows the shape of a trend (07 Data Display › Charts › Sparkline): a line,
     a filled area or small bars, with an optional dot on the latest value, next to the number it describes: in a metric
     card, a table cell or a sentence.
   Usage:
     <Sparkline values={[40, 42, 39, 47, 51, 49, 56]} label="Downloads, last 7 days" />
     <Sparkline values={weekly} variant="area" size="fill" showLast label="Storage used, 12 weeks" format={(v) => v + ' GB'} />
     <Sparkline values={daily} variant="bar" color="categorical-2" decorative />   // the text beside it says the trend
   Props:
     values: the numbers, oldest first (required)
     variant: "line" (default) | "area" (the line with a light fill under it) | "bar" (one small column per value, from zero)
     size: "inline" (default: a word-sized 96 × 24, in a sentence or a table cell) | "fill" (the container's width, 32 tall:
       a metric card)
     showLast: a dot on the latest value (default false; line and area: on bars the latest is the last column)
     color: the data-viz step of its color ("categorical-1" by default, seriesColor(i) for a series' own)
     label: what it shows ("Downloads, last 7 days"); with the summary it is the accessible name
     labels: the values' labels (dates, months), for the summary's lowest and highest
     format: (value) => text for the summary (default formatNumber)
     decorative: hides it from assistive technology when the text beside it already says the trend (default false)
     strings: the summary's words, for other languages (summarizeSeries strings)
     className: more classes on the sparkline
   Behavior:
     It measures its own box and draws the values across it: the lowest value at the bottom, the highest at the top (bars
       from zero); the latest dot sits inside the box. Apache ECharts draws it (a line or bar chart with no axes, issue 353),
       once the chart engine has loaded (the first chart on a page loads it).
     It is one image to assistive technology, named by label and a summary of the trend ("Up 40% from 40 to 56; lowest 39,
       highest 56."); decorative removes it from the reading order instead.
   Notes:
     No axes, grid lines or legend: a sparkline gives the shape; the number beside it gives the value. Use the same time
       range for every sparkline of a set. Its color is a data-viz step (data-plx-dataviz); sizes, the line and the dot are
       --plx-comp-sparkline-* tokens, read by the ECharts theme (echarts/engine.ts); no style is written here. It keeps no "Show the data" table: it stands next to the number it describes, and its
       name says the trend; link to the full chart (with its table) when there is one.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { summarizeSeries } from './a11y.ts';
import { scaleLinear, scaleBand } from './scales.ts';
import { EChartsHost } from './echarts/EChartsPlot.tsx';

// the room kept inside the box so the line and the dot are not cut (geometry, the 4px grid)
const PAD = 4;
const VARIANTS = ['line', 'area', 'bar'];
// the gap between bars, a share of each bar's step (geometry: scaleBand's paddingInner)
const BAR_GAP = 0.2;
const NONE = Object.freeze([]);

export function Sparkline({ values = NONE, variant = 'line', size = 'inline', showLast = false, color, label, labels, format, decorative = false, strings, className, ...rest }) {
  const ref = React.useRef(null);
  const [box, setBox] = React.useState({ width: 0, height: 0 });
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const next = { width: Math.floor(r.width), height: Math.floor(r.height) };
      setBox((b) => (b.width === next.width && b.height === next.height ? b : next));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const v = VARIANTS.indexOf(variant) >= 0 ? variant : 'line';
  const s = size === 'fill' ? 'fill' : 'inline';
  const nums = values.map(Number).filter((x) => isFinite(x));
  const name = [label, nums.length ? summarizeSeries(values, { labels, format, strings }) : null].filter(Boolean).join(': ');
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': name };
  const key = nums.join(',');
  // a line or bar chart with no axes, on the same geometry as the SVG sparkline it replaces: the value range is
  // scaleLinear's (a flat run widens to nice ticks, so a flat line keeps its place and an area its band); the line's
  // points run from PAD to the width less PAD (a single value at the start edge); the bars sit where scaleBand put them (no
  // outer gap)
  const option = React.useCallback((tk, size) => {
    const k = tk.sparkline, last = nums.length - 1, bar = v === 'bar';
    const lo = Math.min.apply(null, nums), hi = Math.max.apply(null, nums);
    if (bar) {
      // the bars where scaleBand put them (paddingOuter 0): ECharts centers each bar in its band with half the gap on
      // either side, so the grid reaches out by that half gap at both ends (outerBoundsMode none: past the box)
      const x = scaleBand({ domain: nums.map((n, i) => i), range: [0, size.width], paddingInner: BAR_GAP, paddingOuter: 0 });
      const y = scaleLinear({ domain: [Math.min(0, lo), Math.max(0, hi)] }).domain();
      const left = x(0) - x.step() * BAR_GAP / 2, right = size.width - left - x.step() * nums.length;
      return {
        animationDuration: tk.motion, animationDurationUpdate: tk.motion,
        grid: { left, right, top: 0, bottom: 0, outerBoundsMode: 'none' },
        xAxis: { type: 'category', show: false, boundaryGap: true, data: nums.map((n, i) => i) },
        yAxis: { type: 'value', show: false, min: y[0], max: y[1] },
        series: [{ type: 'bar', silent: true, barCategoryGap: BAR_GAP * 100 + '%', itemStyle: { color: k.bar }, data: nums }],
      };
    }
    const y = scaleLinear({ domain: [lo, hi] }).domain();
    return {
      animationDuration: tk.motion, animationDurationUpdate: tk.motion,
      grid: { left: PAD, right: PAD, top: PAD, bottom: PAD },
      xAxis: { type: 'value', show: false, min: 0, max: Math.max(1, last) },
      yAxis: { type: 'value', show: false, min: y[0], max: y[1] },
      series: [{ type: 'line', silent: true, emphasis: { disabled: true }, lineStyle: { color: k.color, width: k.lineWidth, cap: 'round', join: 'round' },
        areaStyle: v === 'area' ? { color: k.color, opacity: k.areaOpacity, origin: 'start' } : undefined,
        data: nums.map((n, i) => (showLast && i === last
          ? { value: [i, n], symbol: 'circle', symbolSize: k.last.r * 2, itemStyle: { color: k.color, borderColor: k.last.outline, borderWidth: k.last.outlineWidth } }
          : { value: [i, n], symbol: 'none' })) }],
    };
  }, [key, v, showLast]);
  return (
    <span ref={ref} className={cx('plx-sparkline', 'plx-sparkline--' + v, 'plx-sparkline--' + s, className)} data-plx-dataviz={color || undefined} {...a11y} {...rest}>
      {box.width > 0 && box.height > 0 && nums.length ? (
        <EChartsHost width={box.width} height={box.height} option={option} />
      ) : null}
    </span>
  );
}
