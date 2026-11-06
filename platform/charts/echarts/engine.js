/* Plenix · Chart engine (platform/charts/echarts/engine.js)
   Summary: How a Plenix chart draws with Apache ECharts (issue 353, owner 2026-10-26): loads the vendored engine
     (platform/vendor/echarts/echarts.min.js, window.PlenixECharts), reads the chart tokens where the chart is, and builds
     the ECharts theme from them. The chart components keep their names, props and Plenix layer (ChartFrame, the
     interaction, the live region, the legend, the tooltip, "Show the data"); ECharts draws the plot.
   Usage:
     loadECharts().then((E) => E.init(el, plenixTheme(chartTokens(el)), { renderer: 'svg', width, height }));
     const t = chartTokens(el); t.color('categorical-2')   // a data-viz step as the color it is where el is
   Props:
     loadECharts(win): resolves with the given window's PlenixECharts ({ init, version }), loading it through the page's
       engines script (platform/engines/plenix-engines.js) on first use; without that script it rejects with a plain message
     chartTokens(el): the chart tokens as the Platform's own chart classes resolve them where el is (theme, density and
       scope included): { color(step), colors, lineWidth, tick, title, axis, grid, point, separator, slice, area, dim, motion }
     plenixTheme(tokens): the ECharts theme (colors in the categorical order of seriesColor, the axis and grid lines, the
       data font for tick labels, the label font for axis titles, the line, point and bar styles)
   Behavior:
     Only the first chart on a page loads the engine; later charts reuse the same promise. Pages without a chart never
       load it. A failed load rejects and is forgotten, so the next chart that mounts tries again.
     The tokens are read through a hidden probe of the frame's own mark classes (plx-chart__line, plx-chart__mark,
       plx-chart__tick-label, plx-chart-axis__label, plx-chart__axis-line, plx-chart__grid-line, …), so a token change
       restyles both drawings; nothing here holds a color, width or font of its own.
   Notes:
     ECharts writes the sizes and fonts of what it draws on its own SVG elements (inside .plx-chart__engine); the values
       are the tokens read here.
     Dark mode: the charts read the tokens again when the page's mode, theme or density changes (EChartsPlot). */

import { engine } from '../../utils/engines.ts';

export function loadECharts(win) {
  const w = win || (typeof window !== 'undefined' ? window : null);
  if (!w) return Promise.reject(new Error('ECharts needs a browser'));
  if (w.PlenixECharts) return Promise.resolve(w.PlenixECharts);
  return engine('echarts', w);
}

const NS = 'http://www.w3.org/2000/svg';
const num = (v) => parseFloat(v) || 0;
// a duration token in milliseconds ("200ms" or "0.2s")
const ms = (v) => { const s = String(v).trim(); return /ms$/.test(s) ? num(s) : /s$/.test(s) ? num(s) * 1000 : num(s); };

// a tick label's line height (owner, arabic-font-35; issue 413): the font size, unless a label is in a script whose letters
// reach below it (Arabic); then the deepest such label, measured, so ECharts keeps room for it under the axis. Latin labels
// are never measured, so their charts do not change.
const DEEP_SCRIPT = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
export function tickLineHeight(t, texts) {
  const size = t.tick.fontSize, deep = (texts || []).map(String).filter((x) => DEEP_SCRIPT.test(x));
  if (!deep.length || typeof document === 'undefined') return size;
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return size;
  ctx.font = (t.tick.fontWeight || 400) + ' ' + size + 'px ' + t.tick.fontFamily; ctx.textBaseline = 'top';
  let h = size;
  for (const x of deep) { const m = ctx.measureText(x); h = Math.max(h, Math.ceil(m.actualBoundingBoxDescent - Math.min(0, -m.actualBoundingBoxAscent))); }
  return h;
}
export function chartTokens(where) {
  const doc = where.ownerDocument, win = doc.defaultView;
  const svg = doc.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'plx-visually-hidden');
  svg.setAttribute('aria-hidden', 'true');
  const mk = (tag, cls, attrs) => {
    const e = doc.createElementNS(NS, tag);
    e.setAttribute('class', cls);
    Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k]));
    svg.appendChild(e);
    return e;
  };
  const line = mk('path', 'plx-chart__line', { 'data-plx-dataviz': 'categorical-1' });
  const tick = mk('text', 'plx-chart__tick-label'), title = mk('text', 'plx-chart-axis__label');
  const axis = mk('line', 'plx-chart__axis-line'), grid = mk('line', 'plx-chart__grid-line');
  const point = mk('circle', 'plx-chart__point plx-line-chart__point');
  const joined = mk('rect', 'plx-chart__mark plx-bar-chart__bar plx-bar-chart__bar--joined');
  const slice = mk('path', 'plx-chart__mark plx-pie-chart__slice');
  const swatch = mk('rect', 'plx-chart__mark');
  const spark = { line: mk('path', 'plx-sparkline__line'), area: mk('path', 'plx-sparkline__area'), bar: mk('rect', 'plx-sparkline__bar'), last: mk('circle', 'plx-sparkline__last') };
  const tree = { link: mk('path', 'plx-tree-chart__link'), node: mk('circle', 'plx-tree-chart__node'), folded: mk('circle', 'plx-tree-chart__node plx-tree-chart__node--folded'),
    focus: mk('circle', 'plx-tree-chart__node plx-tree-chart__node--focus'), name: mk('text', 'plx-tree-chart__name'),
    nameFocus: mk('text', 'plx-tree-chart__name plx-tree-chart__name--focus'), detail: mk('text', 'plx-tree-chart__detail') };
  const conn = mk('line', 'plx-waterfall-chart__connector'), selected = mk('rect', 'plx-chart-selected');
  const bul = [mk('rect', 'plx-bullet-chart__range--1'), mk('rect', 'plx-bullet-chart__range--2'), mk('rect', 'plx-bullet-chart__range--3'), mk('line', 'plx-bullet-chart__target')];
  const gau = [mk('path', 'plx-gauge__track'), mk('path', 'plx-gauge__band')];
  where.appendChild(svg);
  const cs = (e) => win.getComputedStyle(e);
  const font = (e) => { const s = cs(e); return { color: s.fill, fontFamily: s.fontFamily, fontSize: num(s.fontSize), fontWeight: s.fontWeight }; };
  const host = cs(where);
  const prop = (name) => host.getPropertyValue(name).trim();
  // a length token in pixels (px, or rem on the root's font size)
  const len = (v) => (/rem$/.test(v) ? num(v) * num(win.getComputedStyle(doc.documentElement).fontSize) : num(v));
  const colorCache = {};
  const t = {
    lineWidth: num(cs(line).strokeWidth),
    tick: font(tick), title: font(title),
    axis: { color: cs(axis).stroke, width: num(cs(axis).strokeWidth) },
    grid: { color: cs(grid).stroke, width: num(cs(grid).strokeWidth) },
    point: { r: num(cs(point).r), outline: cs(point).stroke, outlineWidth: num(cs(point).strokeWidth) },
    separator: { color: cs(joined).stroke, width: num(cs(joined).strokeWidth) },
    slice: { color: cs(slice).stroke, width: num(cs(slice).strokeWidth) },
    area: { opacity: num(prop('--plx-comp-area-chart-fill-opacity')), stacked: num(prop('--plx-comp-area-chart-stacked-fill-opacity')) },
    // the gap between a tick label and its axis, and the room above the plot (half the top tick label)
    tickOffset: len(prop('--plx-comp-chart-axis-tick-offset')),
    top: len(prop('--plx-comp-chart-margin-block-start')),
    // the page's writing direction from the dir attribute (:dir), not the computed direction: the engine element itself
    // is drawn left to right (system/charts.css) so the engine's anchors hold, and the chart mirrors through its options
    rtl: typeof where.matches === 'function' && where.matches(':dir(rtl)'),
    // a sparkline's own look (its color follows the sparkline's data-viz step, where it is)
    sparkline: { color: cs(spark.line).stroke, lineWidth: num(cs(spark.line).strokeWidth), areaOpacity: num(cs(spark.area).fillOpacity),
      bar: cs(spark.bar).fill, last: { r: num(cs(spark.last).r), outline: cs(spark.last).stroke, outlineWidth: num(cs(spark.last).strokeWidth) } },
    // a tree's look (TreeChart): its lines, a node's ring and fill (filled when folded), the node in focus, the name and
    // detail fonts, and its room: the gap beside a label, a leaf's height across, a level's height down
    tree: { link: { color: cs(tree.link).stroke, width: num(cs(tree.link).strokeWidth) },
      node: { r: num(cs(tree.node).r), fill: cs(tree.node).fill, color: cs(tree.node).stroke, width: num(cs(tree.node).strokeWidth) },
      folded: cs(tree.folded).fill, focus: { color: cs(tree.focus).stroke, width: num(cs(tree.focus).strokeWidth) },
      name: font(tree.name), nameFocus: font(tree.nameFocus), detail: font(tree.detail),
      gap: len(prop('--plx-comp-tree-chart-label-gap')), leaf: len(prop('--plx-comp-tree-chart-leaf-spacing')), level: len(prop('--plx-comp-tree-chart-level-spacing')) },
    // a scatter plot's look (ScatterChart): a point's radius, its fill opacity (a bubble's own), its outline, and the trend line's width and dashes
    scatter: { r: len(prop('--plx-comp-scatter-point-radius')), pointOpacity: num(prop('--plx-comp-scatter-point-opacity')), bubbleOpacity: num(prop('--plx-comp-scatter-bubble-opacity')),
      outline: len(prop('--plx-comp-scatter-point-outline-width')), trend: { width: len(prop('--plx-comp-scatter-trend-width')), dash: len(prop('--plx-comp-scatter-trend-dash')), gap: len(prop('--plx-comp-scatter-trend-gap')) } },
    // a lollipop's look (LollipopChart): the stem's width, the dot's radius and its outline
    lollipop: { stem: len(prop('--plx-comp-lollipop-stem-width')), r: len(prop('--plx-comp-lollipop-dot-radius')), outline: prop('--plx-comp-lollipop-dot-outline'), outlineWidth: len(prop('--plx-comp-lollipop-dot-outline-width')) },
    // a waterfall's connector between one step's end and the next step's start, and the outline of the selected step
    waterfall: { color: cs(conn).stroke, width: num(cs(conn).strokeWidth), dash: num(cs(conn).strokeDasharray.split(/[ ,]+/)[0]) },
    selected: { color: cs(selected).stroke, width: num(cs(selected).strokeWidth) },
    // a bullet chart's look (BulletChart): the three range bands (poor, fair, good) and the target mark
    bullet: { ranges: [cs(bul[0]).fill, cs(bul[1]).fill, cs(bul[2]).fill], target: { color: cs(bul[3]).stroke, width: num(cs(bul[3]).strokeWidth) } },
    // a gauge's look (Gauge): the track's color and width, the threshold bands' width (user units of the 160-wide dial)
    gauge: { track: cs(gau[0]).stroke, trackWidth: num(cs(gau[0]).strokeWidth), bandWidth: num(cs(gau[1]).strokeWidth) },
    // the values not in focus dim to the interaction's token; the drawing's animation is the motion token (reduced motion: 0)
    dim: num(prop('--plx-comp-chart-interaction-dim-opacity')) || 1,
    motion: ms(prop('--plx-sys-motion-duration-slow')),
  };
  // a data-viz step ("categorical-3", "sequential-5") as the color it is here
  t.color = (step) => {
    if (!step) step = 'categorical-1';
    if (!(step in colorCache)) {
      swatch.setAttribute('data-plx-dataviz', step);
      const out = !svg.isConnected;
      if (out) where.appendChild(svg);
      colorCache[step] = cs(swatch).fill;
      if (out) svg.remove();
    }
    return colorCache[step];
  };
  t.colors = [1, 2, 3, 4, 5, 6].map((i) => t.color('categorical-' + i));
  svg.remove();
  return t;
}

export function plenixTheme(t) {
  const label = { color: t.tick.color, fontFamily: t.tick.fontFamily, fontSize: t.tick.fontSize, margin: t.tickOffset, hideOverlap: true };
  const name = { color: t.title.color, fontFamily: t.title.fontFamily, fontSize: t.title.fontSize, fontWeight: t.title.fontWeight };
  const base = { axisLabel: label, nameTextStyle: name, axisTick: { show: false } };
  const rule = { show: true, lineStyle: { color: t.axis.color, width: t.axis.width } };
  const gridLines = { show: true, lineStyle: { color: t.grid.color, width: t.grid.width } };
  return {
    color: t.colors,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: t.tick.fontFamily, color: t.tick.color, fontSize: t.tick.fontSize },
    categoryAxis: Object.assign({}, base, { axisLine: rule, splitLine: { show: false } }),
    timeAxis: Object.assign({}, base, { axisLine: rule, splitLine: { show: false } }),
    valueAxis: Object.assign({}, base, { axisLine: { show: false }, splitLine: gridLines }),
    line: { symbol: 'circle', symbolSize: t.point.r * 2, lineStyle: { width: t.lineWidth, cap: 'round', join: 'round' },
      itemStyle: { borderColor: t.point.outline, borderWidth: t.point.outlineWidth } },
    bar: { itemStyle: { borderWidth: 0 } },
    pie: { itemStyle: { borderColor: t.slice.color, borderWidth: t.slice.width, borderJoin: 'round' } },
  };
}
