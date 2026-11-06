/* Plenix design system · library part w08A (wave 8, lane A): the chart parts (platform/charts/parts: Axis, GridLines,
   ChartLegend, ChartTooltip, DataLabel, ReferenceLine and its threshold kind, ChartAnnotation; the base the charts of
   wave 9 compose), FeatureCard (Feature card) and UserCard (User card, and its duplicate leaf Profile card). Action list
   and Grouped list are answered in w00A. Every color is an existing role or a data-viz step. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, use = H.use, noop = H.noop, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', HIG = 'Apple HIG';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var ART = function (n) { return '../../dam/assets/thumb-' + n + '.svg'; };
  var CSS = ['charts/parts/chart-parts.css'];

  /* ── the sample data every chart part draws ── */
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  var SERIES = [{ id: 'web', label: 'Web', values: [120, 180, 150, 240, 310, 280] }, { id: 'ios', label: 'iOS', values: [80, 95, 130, 160, 190, 230] },
    { id: 'android', label: 'Android', values: [60, 70, 90, 110, 150, 170] }].map(function (s, i) { return Object.assign({ color: 'categorical-' + (i + 1) }, s); });   // seriesColor(i)
  var TABLE = { columns: [{ title: 'Month', field: 'month', kind: 'name', rowLabel: true }].concat(SERIES.map(function (s) { return { title: s.label, field: s.id, kind: 'data', align: 'right' }; })),
    data: MONTHS.map(function (m, i) { var o = { id: i + 1, month: m }; SERIES.forEach(function (s) { o[s.id] = s.values[i]; }); return o; }) };
  var legendItems = function (values) { return SERIES.map(function (s) { return { id: s.id, label: s.label, color: s.color, value: values ? P.formatNumber(s.values.reduce(function (a, b) { return a + b; }, 0)) : undefined }; }); };
  var path = function (x, y, values) { return values.map(function (v, i) { return (i ? 'L' : 'M') + P.scalePosition(x, MONTHS[i]) + ',' + y(v); }).join(''); };

  // a line chart of the three series with its axes and grid; o: { shown (ids), frame (ChartFrame props), extra(d, x, y), margin }
  var Lines = function (o) {
    o = o || {};
    var shown = o.shown || SERIES.map(function (s) { return s.id; });
    return h(P.ChartFrame, Object.assign({ title: 'Sign-ups by platform', description: 'Sign-ups grew on every platform from January to June; the web stays ahead.', table: TABLE, margin: o.margin }, o.frame), function (d) {
      var x = P.scaleBand({ domain: MONTHS, range: [0, d.inner.width], paddingInner: 0 });
      var y = P.scaleLinear({ domain: [0, 310], range: [d.inner.height, 0], nice: true });
      return h('g', null, o.noGrid ? null : h(P.GridLines, { scale: y, inner: d.inner }), o.before ? o.before(d, x, y) : null,
        SERIES.filter(function (s) { return shown.indexOf(s.id) >= 0; }).map(function (s) { return h('path', { key: s.id, className: 'plx-chart__line', 'data-plx-dataviz': s.color, d: path(x, y, s.values) }); }),
        h(P.Axis, { scale: y, orient: 'left', inner: d.inner, margin: d.margin, label: o.yLabel }), h(P.Axis, { scale: x, orient: 'bottom', inner: d.inner, margin: d.margin, label: o.xLabel }),
        o.extra ? o.extra(d, x, y) : null);
    });
  };
  // columns of one series (the web), for data labels and reference lines
  var Columns = function (o) {
    o = o || {};
    var web = SERIES[0];
    return h(P.ChartFrame, Object.assign({ title: 'Web sign-ups per month', description: 'Web sign-ups peaked at 310 in May.', table: { columns: TABLE.columns.slice(0, 2), data: TABLE.data }, size: o.size }, o.frame), function (d) {
      var x = P.scaleBand({ domain: MONTHS, range: [0, d.inner.width] });
      var y = P.scaleLinear({ domain: [0, 350], range: [d.inner.height, 0], nice: true });
      return h('g', null, h(P.GridLines, { scale: y, inner: d.inner }), o.before ? o.before(d, x, y) : null,
        MONTHS.map(function (m, i) { return h('rect', { key: m, className: 'plx-chart__mark', 'data-plx-dataviz': web.color, x: x(m), y: y(web.values[i]), width: x.bandwidth(), height: d.inner.height - y(web.values[i]) }); }),
        h(P.Axis, { scale: y, orient: 'left', inner: d.inner, margin: d.margin }), h(P.Axis, { scale: x, orient: 'bottom', inner: d.inner, margin: d.margin }),
        o.extra ? o.extra(d, x, y, web) : null);
    });
  };

  /* ── 07 Data Display › Charts › Chart legend: ChartLegend ── */
  var Toggle = function () {
    var s = use([]);
    return box(560, h(Lines, { shown: SERIES.map(function (x) { return x.id; }).filter(function (id) { return s[0].indexOf(id) < 0; }),
      frame: { legend: h(P.ChartLegend, { items: legendItems(), shape: 'line', interactive: true, hidden: s[0], onToggle: function (id, visible) { s[1](visible ? s[0].filter(function (x) { return x !== id; }) : s[0].concat([id])); } }) } }));
  };
  var chartLegend = { id: 'chart-legend', lab: true, icon: 'list-bullets', sec: 'data-display', sub: 'Charts', leaf: 'Chart legend', title: 'Chart legend',
    plenix: 'ChartLegend, ChartFrame legend', src: 'charts/parts/ChartLegend.tsx', also: ['charts/ChartFrame.tsx'], css: CSS, blocks: ['plx-chart-legend'],
    level: 'Foundation', interaction: 'Selection',
    aliases: ['Legend', 'Key', 'Series key', 'Color key', 'Interactive legend'],
    text: 'The key to a chart’s series: each series’ swatch in its data-viz color, its name and, when it helps, its value (a total, a share) in the data font. It is real text in the frame, so assistive technology reads the series names (ChartFrame legend: under the plot by default, above it in a tight card, beside it with legendPosition="end"). When interactive, each item is a toggle button (aria-pressed) that shows or hides its series; a hidden series keeps its place with a hollow swatch, and the last one shown cannot be hidden.',
    use: ['Two or more series whose marks cannot be labeled directly', 'Items in the order of the series in the chart (the stacking or line order), with seriesColor(i) by that order',
      'shape="line" for line series; the square swatch for bars, areas and slices', 'interactive when people compare a few series at a time; the chart then draws only the visible ones'],
    avoid: ['A legend for a single series: the title names it', 'A legend when the lines or bars can be labeled directly (DataLabel at the line ends)',
      'Color as the only link between a name and its marks when two colors are close: label directly or add markers', 'Names cut short: they wrap'],
    related: ['chart-foundations', 'chart-tooltip', 'dataviz-colors', 'use-of-color'],
    map: [[CAR, 'Legends', 'Direct'], [FLU, 'Legends', 'Direct'], [SPE, 'Legend', 'Direct'], [POL, 'Legend', 'Direct'], [HIG, 'Charts (legend)', 'Partial'], ['Frappe', 'Frappe Charts legend', 'Direct']],
    variantPages: [
      vp('Legend under the chart', 'Placement', 'Under the plot (default)', { variant: 'horizontal' }, 'The series in a row under the plot that wraps when the frame is narrow.', 'Most charts: people read the chart, then the key', 'Long lists of series: filter or group them'),
      vp('Legend beside the chart', 'Placement', 'Beside the plot', { variant: 'vertical' }, 'One series per line after the plot (legendPosition="end", orientation="vertical"); the plot keeps the rest of the width.', 'Wide frames and long series names', 'Narrow cards: the plot gets too small'),
      vp('Interactive legend', 'Behavior', 'Interactive', { variant: 'interactive' }, 'Each item a toggle button that shows or hides its series; a hidden series has a hollow swatch and a muted name.', 'Comparing two or three of several series', 'Charts whose series must all be seen together, such as a stack that adds up to a total')
    ],
    examples: [
      ['Placement', [
        ['Under the plot (default)', function () { return box(560, h(Lines, { frame: { legend: h(P.ChartLegend, { items: legendItems(), shape: 'line' }) } })); }, 'plx-chart-legend--horizontal', 'legendPosition=' + q('bottom')],
        ['Above the plot', function () { return box(560, h(Lines, { frame: { legendPosition: 'top', legend: h(P.ChartLegend, { items: legendItems(), shape: 'line' }) } })); }, null, 'legendPosition=' + q('top')],
        ['Beside the plot', function () { return box(720, h(Lines, { frame: { legendPosition: 'end', legend: h(P.ChartLegend, { items: legendItems(true), shape: 'line', orientation: 'vertical' }) } })); }, 'plx-chart-legend--vertical', 'orientation=' + q('vertical')]], { prop: 'legendPosition' }],
      ['Behavior', [['Interactive', function () { return h(Toggle); }, 'plx-chart-legend--interactive', 'interactive']]],
      ['Swatch: square for bars and areas, line for lines; values in the data font', function () { return box(480, h(P.Stack, { gap: 'md' }, h(P.ChartLegend, { items: legendItems() }), h(P.ChartLegend, { items: legendItems(true), shape: 'line' }))); }]] };

  /* ── 07 Data Display › Charts › Chart tooltip: ChartTooltip ── */
  var tipItems = function (i) { return SERIES.map(function (s) { return { label: s.label, value: P.formatNumber(s.values[i]), color: s.color }; }); };
  var Hover = function () {
    var s = use(3);
    return box(560, h(Lines, { frame: { legend: h(P.ChartLegend, { items: legendItems(), shape: 'line' }) }, extra: function (d, x) {
      return h('g', null, MONTHS.map(function (m, i) { return h('rect', { key: m, className: 'ds-w08a-hit', x: x(m), y: 0, width: x.bandwidth(), height: d.inner.height, onMouseEnter: function () { s[1](i); } }); }),
        h(P.ChartTooltip, { variant: 'shared', x: P.scalePosition(x, MONTHS[s[0]]), inner: d.inner, title: MONTHS[s[0]] + ' 2026', titleKind: 'data', items: tipItems(s[0]) }));
    } }));
  };
  var chartTooltip = { id: 'chart-tooltip', lab: true, icon: 'message', sec: 'data-display', sub: 'Charts', leaf: 'Chart tooltip', title: 'Chart tooltip',
    plenix: 'ChartTooltip', src: 'charts/parts/ChartTooltip.tsx', css: CSS, blocks: ['plx-chart-tooltip'], level: 'Foundation', interaction: 'Overlay',
    aliases: ['Data tooltip', 'Chart callout', 'Crosshair tooltip', 'Shared tooltip'],
    text: 'Shows the exact values at one place on a chart, where the pointer or the keyboard is: one point’s value (single), or every series’ value at one x position with a crosshair line down the plot (shared). It sits beside the point on the side with room, on the popover’s surface. Its heading is the point’s category or date; each value follows its series’ swatch and name, in the data font. It does not take the pointer, so the marks stay reachable as the pointer moves along the chart.',
    use: ['Every interactive chart, for the exact values the axes only approximate', 'shared on line and area charts with several series: one tooltip lists them all at that x, in the legend’s order',
      'The axis’s format with full precision (formatNumber, formatDate); titleKind="data" when the heading is a date or a number'],
    avoid: ['Information that exists only in the tooltip: the data table and the description carry it too', 'Actions or links in a chart tooltip: it does not take the pointer', 'A tooltip that covers the mark it describes'],
    related: ['chart-foundations', 'chart-legend', 'tooltip', 'popover'],
    map: [[CAR, 'Tooltip (charts)', 'Direct'], [FLU, 'Charts callout', 'Direct'], [SPE, 'Chart tooltip', 'Direct'], [POL, 'Tooltip (viz)', 'Direct'], [HIG, 'Charts (selection)', 'Partial'], ['Frappe', 'Frappe Charts tooltip', 'Direct']],
    variantPages: [
      vp('Single-point tooltip', 'Variant', 'Single', { variant: 'single' }, 'The value of one point, above it (under it near the top of the plot), with the series’ swatch and name.', 'Columns, bars and points: one value at a time', 'Several series at one x: the shared tooltip'),
      vp('Shared tooltip', 'Variant', 'Shared', { variant: 'shared' }, 'Every series at one x position, listed in the legend’s order, with a crosshair line down the plot.', 'Line and area charts with several series', 'A single series: the single tooltip is enough')
    ],
    examples: [
      ['Variant', [
        ['Single', function () { return box(560, h(Columns, { extra: function (d, x, y, web) { return h(P.ChartTooltip, { x: P.scalePosition(x, 'Apr'), y: y(web.values[3]), inner: d.inner, title: 'April', items: [{ label: 'Web', value: P.formatNumber(240), color: web.color }] }); } })); }, null, 'variant=' + q('single')],
        ['Shared', function () { return box(560, h(Lines, { extra: function (d, x) { return h(P.ChartTooltip, { variant: 'shared', x: P.scalePosition(x, 'May'), inner: d.inner, title: 'May 2026', titleKind: 'data', items: tipItems(4) }); } })); }, null, 'variant=' + q('shared')]], { prop: 'variant' }],
      ['Follows the pointer: move along the chart (the chart interaction adds the keyboard)', function () { return h(Hover); }],
      ['Near the end of the plot it goes before the point', function () { return box(560, h(Lines, { extra: function (d, x) { return h(P.ChartTooltip, { variant: 'shared', x: P.scalePosition(x, 'Jun'), inner: d.inner, title: 'June 2026', titleKind: 'data', items: tipItems(5) }); } })); }]] };

  /* ── 07 Data Display › Charts › Data label: DataLabel ── */
  var Bars = function () {
    var web = SERIES[0];
    return h(P.ChartFrame, { title: 'Web sign-ups per month', description: 'Web sign-ups peaked at 310 in May.', table: { columns: TABLE.columns.slice(0, 2), data: TABLE.data }, margin: { end: 40 } }, function (d) {
      var y = P.scaleBand({ domain: MONTHS, range: [0, d.inner.height] });
      var x = P.scaleLinear({ domain: [0, 350], range: [0, d.inner.width], nice: true });
      return h('g', null, h(P.GridLines, { scale: x, direction: 'vertical', inner: d.inner }),
        MONTHS.map(function (m, i) { return h('rect', { key: m, className: 'plx-chart__mark', 'data-plx-dataviz': web.color, x: 0, y: y(m), width: x(web.values[i]), height: y.bandwidth() }); }),
        MONTHS.map(function (m, i) { return h(P.DataLabel, { key: m, x: x(web.values[i]), y: P.scalePosition(y, m), value: web.values[i], position: 'end' }); }),
        h(P.Axis, { scale: y, orient: 'left', inner: d.inner, margin: d.margin }), h(P.Axis, { scale: x, orient: 'bottom', inner: d.inner, margin: d.margin }));
    });
  };
  var dataLabel = { id: 'chart-data-label', lab: true, icon: 'tags', sec: 'data-display', sub: 'Charts', leaf: 'Data label', title: 'Data label',
    plenix: 'DataLabel', src: 'charts/parts/DataLabel.tsx', css: CSS, blocks: ['plx-chart-data-label'], level: 'Foundation', interaction: 'Static',
    aliases: ['Value label', 'Direct label', 'Mark label'],
    text: 'A value written on the chart beside its mark, in the data font: above a column (top), after the end of a bar (end), or centered on a point or a slice with a halo in the surface color (center), so it stays readable over a line or a mark. A number is formatted in the reader’s locale; a string is shown as it is.',
    use: ['Bar and column charts with few marks where the exact values matter', 'The values people compare: the last, the highest, the target, rather than every mark', 'The axis’s format and precision'],
    avoid: ['Labels on every point of a dense line or scatter chart: the tooltip gives them on demand', 'Labels that overlap: drop the less important ones', 'Labels as the only source of the values: the data table keeps them'],
    related: ['chart-foundations', 'chart-tooltip', 'chart-axis'],
    map: [[CAR, 'Axes and labels', 'Partial'], [SPE, 'Data label', 'Partial'], [FLU, 'Charts', 'Partial'], [HIG, 'Charts (annotations)', 'Partial'], ['Frappe', 'Frappe Charts value labels', 'Partial']],
    variantPages: [
      vp('Data label on top', 'Position', 'Top (columns)', { variant: 'top' }, 'Above the column, centered on it.', 'Column charts', 'Bars: the label goes after their end'),
      vp('Data label at the end', 'Position', 'End (bars)', { variant: 'end' }, 'After the end of the bar, centered on its height.', 'Bar charts: values read along the bars', 'Columns: the label goes on top'),
      vp('Centered data label', 'Position', 'Center (points)', { variant: 'center' }, 'On the point, with a halo in the surface color.', 'Points and large marks', 'Small marks where the text covers the data')
    ],
    examples: [
      ['Position', [
        ['Top (columns)', function () { return box(560, h(Columns, { extra: function (d, x, y, web) { return MONTHS.map(function (m, i) { return h(P.DataLabel, { key: m, x: P.scalePosition(x, m), y: y(web.values[i]), value: web.values[i] }); }); } })); }, 'plx-chart-data-label--top', 'position=' + q('top')],
        ['End (bars)', function () { return box(560, h(Bars)); }, 'plx-chart-data-label--end', 'position=' + q('end')],
        ['Center (points)', function () { return box(560, h(Lines, { shown: ['web'], extra: function (d, x, y) { return [4, 5].map(function (i) { return h(P.DataLabel, { key: i, x: P.scalePosition(x, MONTHS[i]), y: y(SERIES[0].values[i]), value: SERIES[0].values[i], position: 'center' }); }); } })); }, 'plx-chart-data-label--center', 'position=' + q('center')]], { prop: 'position' }]] };

  /* ── 07 Data Display › Charts › Axis: Axis ── */
  var chartAxis = { id: 'chart-axis', lab: true, icon: 'horizontal-rule', sec: 'data-display', sub: 'Charts', leaf: 'Axis', title: 'Axis',
    plenix: 'Axis, scalePosition, scaleTicks, scaleLabel', src: 'charts/parts/Axis.tsx', also: ['charts/parts/position.ts'], css: CSS.concat(['system/charts.css']), blocks: ['plx-chart-axis'],
    level: 'Foundation', interaction: 'Static',
    aliases: ['Chart axis', 'Value axis', 'Category axis', 'Time axis', 'Axis title'],
    text: 'A scale along one side of the plot: its tick labels at the scale’s ticks (the middle of each band on a band scale), in the data font and the reader’s locale, the axis line where it is the baseline, and an optional axis title naming the measure and its unit. Bottom and left are the usual pair; right and top are for a second unit or a chart read from the top.',
    use: ['Every cartesian chart: line, area, bar, column, scatter, histogram', 'The value axis from zero for bars and areas (the scale’s domain); lines and points may start elsewhere',
      'An axis title with the unit when the chart’s title does not say it: “Uploads”, “Size (MB)”; give the frame margin room for it', 'ticks to thin the labels of a narrow chart; never uneven steps'],
    avoid: ['Axes on pies, donuts, treemaps and sparklines', 'Two value axes for one unit; two units on one chart: prefer two charts', 'Rotated or cut tick labels: fewer ticks, or a band scale with shorter names'],
    related: ['chart-foundations', 'chart-grid-line', 'numbers-and-units'],
    map: [[CAR, 'Axes and labels', 'Direct'], [SPE, 'Axis', 'Direct'], [FLU, 'Charts axis', 'Partial'], [HIG, 'Charts (axes)', 'Direct'], ['Frappe', 'Frappe Charts axis', 'Direct']],
    variantPages: [
      vp('Bottom axis', 'Side', 'Bottom (default)', { variant: 'bottom' }, 'Under the plot: the axis line and the labels centered under their ticks.', 'Categories and time across the chart', 'Bars, whose categories run down the left'),
      vp('Left axis', 'Side', 'Left', { variant: 'left' }, 'Before the plot: the labels end before it; no line by default (the grid lines carry the values).', 'The value axis of columns and lines; the categories of bars', 'A second unit: the right axis'),
      vp('Right axis', 'Side', 'Right', { variant: 'right' }, 'After the plot: the labels start after it.', 'A second unit beside the first, or the latest value read at the end', 'One unit on both sides'),
      vp('Top axis', 'Side', 'Top', { variant: 'top' }, 'Above the plot: the labels sit above it.', 'Tall charts read from the top, such as a timeline', 'Most charts: the bottom axis')
    ],
    examples: [
      ['Side', [
        ['Bottom (default)', function () { return box(560, h(Columns)); }, 'plx-chart-axis--bottom', 'orient=' + q('bottom')],
        ['Left', function () { return box(560, h(Lines, { margin: { start: 56 }, yLabel: 'Sign-ups' })); }, 'plx-chart-axis--left', 'orient=' + q('left')],
        ['Right', function () { return box(560, h(P.ChartFrame, { title: 'Storage used', description: 'The value axis on the right, read at the latest week.', margin: { start: 8, end: 40 } }, function (d) {
          var x = P.scaleLinear({ domain: [1, 12], range: [0, d.inner.width] }), y = P.scaleLinear({ domain: [0, 8.4], range: [d.inner.height, 0], nice: true });
          var W = [3.2, 3.6, 4.1, 4.0, 4.8, 5.5, 5.9, 6.4, 6.3, 7.1, 7.8, 8.4];
          return h('g', null, h(P.GridLines, { scale: y, inner: d.inner }), h('path', { className: 'plx-chart__line', 'data-plx-dataviz': P.seriesColor(0), d: W.map(function (v, i) { return (i ? 'L' : 'M') + x(i + 1) + ',' + y(v); }).join('') }),
            h(P.Axis, { scale: y, orient: 'right', inner: d.inner, margin: d.margin }), h(P.Axis, { scale: x, orient: 'bottom', inner: d.inner, margin: d.margin, ticks: 6 }));
        })); }, 'plx-chart-axis--right', 'orient=' + q('right')],
        ['Top', function () { return box(560, h(P.ChartFrame, { title: 'Release window', description: 'The time axis above the plot.', size: 'sm', margin: { top: 24, bottom: 8 } }, function (d) {
          var x = P.scaleTime({ domain: [new Date(2026, 8, 1), new Date(2026, 9, 1)], range: [0, d.inner.width] });
          return h('g', null, h(P.GridLines, { scale: x, direction: 'vertical', inner: d.inner, ticks: 4 }), h('rect', { className: 'plx-chart__mark', x: x(new Date(2026, 8, 8)), y: d.inner.height / 3, width: x(new Date(2026, 8, 22)) - x(new Date(2026, 8, 8)), height: d.inner.height / 3 }),
            h(P.Axis, { scale: x, orient: 'top', inner: d.inner, margin: d.margin, ticks: 4 }));
        })); }, 'plx-chart-axis--top', 'orient=' + q('top')]], { prop: 'orient' }],
      ['Axis titles: the measure and its unit, at the margin’s edge', function () { return box(560, h(Lines, { margin: { start: 64, bottom: 44 }, yLabel: 'Sign-ups', xLabel: 'Month (2026)' })); }]] };

  /* ── 07 Data Display › Charts › Grid line: GridLines ── */
  var chartGrid = { id: 'chart-grid-line', lab: true, icon: 'grid-2x2', sec: 'data-display', sub: 'Charts', leaf: 'Grid line', title: 'Grid line',
    plenix: 'GridLines', src: 'charts/parts/GridLines.tsx', css: ['system/charts.css'].concat(CSS), blocks: ['plx-chart-grid'], level: 'Foundation', interaction: 'Static',
    aliases: ['Gridlines', 'Chart grid', 'Major grid lines'],
    text: 'Thin lines across the plot at the ticks of one scale, behind the marks, in the subtle border color, so values can be read against the axis. Horizontal lines follow a vertical value axis (columns and lines); vertical lines follow a horizontal one (bars, time).',
    use: ['Horizontal grid lines on column and line charts, vertical ones on bar charts', 'The same ticks as the axis beside them (the ticks prop on both)', 'Drawn first, so every mark sits on top'],
    avoid: ['Both directions where one is enough; both only on scatter plots read precisely', 'Grid lines on sparklines, pies and donuts', 'A grid line that means something (a target): that is a reference line'],
    related: ['chart-axis', 'chart-reference-line', 'chart-foundations'],
    map: [[CAR, 'Grid (charts)', 'Partial'], [SPE, 'Axis grid', 'Partial'], [FLU, 'Charts', 'Partial'], [HIG, 'Charts (grid lines)', 'Partial']],
    variantPages: [
      vp('Horizontal grid lines', 'Direction', 'Horizontal (default)', { variant: 'horizontal' }, 'Across the plot at the value axis’s ticks.', 'Columns, lines and areas', 'Bars: their values run across'),
      vp('Vertical grid lines', 'Direction', 'Vertical', { variant: 'vertical' }, 'Up the plot at a horizontal scale’s ticks.', 'Bars, and time axes with few ticks', 'Columns: their values run up')
    ],
    examples: [
      ['Direction', [
        ['Horizontal (default)', function () { return box(560, h(Columns)); }, null, 'direction=' + q('horizontal')],
        ['Vertical', function () { return box(560, h(Bars)); }, null, 'direction=' + q('vertical')]], { prop: 'direction' }]] };

  /* ── 07 Data Display › Charts › Reference line and Threshold: ReferenceLine ── */
  var avg = Math.round(SERIES[0].values.reduce(function (a, b) { return a + b; }, 0) / MONTHS.length);
  var Weekly = function (o) {
    var pts = [62, 70, 68, 81, 92, 88, 76, 95, 84, 71].map(function (v, i) { return { date: new Date(2026, 8, 1 + i * 3), value: v }; });
    return h(P.ChartFrame, { title: 'Storage used', description: o.description, size: 'md',
      table: { columns: [{ title: 'Date', field: 'date', kind: 'data' }, { title: 'Used (%)', field: 'v', kind: 'data', align: 'right' }], data: pts.map(function (p, i) { return { id: i + 1, date: P.formatDate(p.date), v: p.value }; }) } }, function (d) {
      var x = P.scaleTime({ domain: [pts[0].date, pts[pts.length - 1].date], range: [0, d.inner.width] });
      var y = P.scaleLinear({ domain: [0, 100], range: [d.inner.height, 0] });
      return h('g', null, h(P.GridLines, { scale: y, inner: d.inner }), o.lines(d, x, y),
        h('path', { className: 'plx-chart__line', 'data-plx-dataviz': P.seriesColor(0), d: pts.map(function (p, i) { return (i ? 'L' : 'M') + x(p.date) + ',' + y(p.value); }).join('') }),
        h(P.Axis, { scale: y, orient: 'left', inner: d.inner, margin: d.margin, format: function (v) { return v + '%'; } }), h(P.Axis, { scale: x, orient: 'bottom', inner: d.inner, margin: d.margin, ticks: 4 }));
    });
  };
  var pct = function (v) { return v + '%'; };
  var referenceLine = { id: 'chart-reference-line', lab: true, icon: 'horizontal-rule', sec: 'data-display', sub: 'Charts', leaf: 'Reference line', title: 'Reference line',
    plenix: 'ReferenceLine', src: 'charts/parts/ReferenceLine.tsx', css: CSS, blocks: ['plx-chart-reference'], variantClasses: ['plx-chart-reference--y', 'plx-chart-reference--x'], level: 'Foundation', interaction: 'Static',
    aliases: ['Rule', 'Target line', 'Average line', 'Marker line', 'Event line'],
    covers: [],
    text: 'A labeled, dashed line across the chart at a value that gives context: a target, an average, last year’s figure (horizontal, on the value axis), or a date such as a release (vertical, on the time axis). Its name and value sit at its end (or the top of the plot), the value in the data font. The dash tells it from a series, which is solid; kind="threshold" is the same line for a limit, in an alert color.',
    use: ['Averages, medians, targets and prior-period values; a key date on a time axis', 'A name that says what it is (“Average”, “Target”) and the axis’s format for its value', 'The reference in the chart’s description too, and in the table when it is not derived from it'],
    avoid: ['More than two reference lines on one chart', 'A limit that calls for action: that is a threshold (kind="threshold")', 'A value outside the axis: widen the scale’s domain so the line shows'],
    related: ['chart-threshold', 'chart-grid-line', 'chart-annotation'],
    map: [[SPE, 'Reference line', 'Direct'], [CAR, 'Thresholds (charts)', 'Partial'], [HIG, 'Charts (rule marks)', 'Direct'], ['Frappe', 'Frappe Charts markers', 'Partial']],
    variantPages: [
      vp('Horizontal reference line', 'Axis', 'Horizontal (a value)', { variant: 'y' }, 'Across the plot at a value of the vertical scale, its name and value above its end.', 'Targets, averages, prior periods', 'Dates: the vertical line'),
      vp('Vertical reference line', 'Axis', 'Vertical (a date)', { variant: 'x' }, 'Up the plot at a value of the horizontal scale, its name at the top after it.', 'A release, a launch, a change in how data is counted', 'A span of time: the range annotation')
    ],
    examples: [
      ['Axis', [
        ['Horizontal (a value)', function () { return box(560, h(Columns, { extra: function (d, x, y) { return h(P.ReferenceLine, { scale: y, value: avg, inner: d.inner, label: 'Average' }); } })); }, 'plx-chart-reference--y', 'axis=' + q('y')],
        ['Vertical (a date)', function () { return box(560, h(Weekly, { description: 'Use climbed after the September 13 release.', lines: function (d, x) { return h(P.ReferenceLine, { axis: 'x', scale: x, value: new Date(2026, 8, 13), inner: d.inner, label: 'Release 3.2', showValue: false }); } })); }, 'plx-chart-reference--x', 'axis=' + q('x')]], { prop: 'axis' }]] };
  var threshold = { id: 'chart-threshold', lab: true, icon: 'warning', sec: 'data-display', sub: 'Charts', leaf: 'Threshold', title: 'Threshold', purpose: 'Marks a limit the data should stay under or above, so values past it stand out.',
    plenix: 'ReferenceLine kind="threshold"', src: 'charts/parts/ReferenceLine.tsx', css: CSS, blocks: ['plx-chart-reference'], variantClasses: ['plx-chart-reference--threshold'],
    level: 'Foundation', interaction: 'Static', docsFrom: 'chart-reference-line',
    aliases: ['Limit line', 'Alert line', 'SLA line', 'Budget line'],
    text: 'A limit the data should stay under or above (a service level, a budget, a quota), drawn as a dashed line a step heavier than a reference line, in the data-viz alert colors: warning, or critical for the limit that matters most. Its name and value are written at its end, so color is never the only cue.',
    use: ['Service levels, budgets, quotas and alert limits', 'level="critical" for the hard limit, "warning" for the early one; at most two per chart', 'The axis range kept wide enough to show the limit even when the data stays far from it'],
    avoid: ['Neutral context such as an average: a reference line', 'Status colors on ordinary series', 'A threshold without its name and value'],
    related: ['chart-reference-line', 'dataviz-colors', 'use-of-color'],
    map: [[CAR, 'Thresholds (charts)', 'Direct'], [SPE, 'Reference line', 'Partial'], [HIG, 'Charts (rule marks)', 'Partial'], ['Frappe', 'Frappe Charts markers', 'Partial']],
    variantPages: [
      vp('Warning threshold', 'Level', 'Warning (default)', { variant: 'warning' }, 'The early limit, in the alert warning color.', 'A limit to watch before it is reached', 'The hard limit: critical'),
      vp('Critical threshold', 'Level', 'Critical', { variant: 'critical' }, 'The hard limit, in the alert critical color.', 'A limit that must not be crossed', 'More than one critical line on a chart')
    ],
    examples: [
      ['Level', [
        ['Warning (default)', function () { return box(560, h(Weekly, { description: 'Use passed the 80% warning level three times.', lines: function (d, x, y) { return h(P.ReferenceLine, { kind: 'threshold', scale: y, value: 80, inner: d.inner, label: 'Warning', format: pct }); } })); }, 'plx-chart-reference--threshold', 'level=' + q('warning')],
        ['Critical', function () { return box(560, h(Weekly, { description: 'Use stayed under the 90% limit except once.', lines: function (d, x, y) { return h(P.ReferenceLine, { kind: 'threshold', level: 'critical', scale: y, value: 90, inner: d.inner, label: 'Limit', format: pct }); } })); }, null, 'level=' + q('critical')]], { prop: 'level' }],
      ['Both levels on one chart', function () { return box(560, h(Weekly, { description: 'Use passed the warning level three times and the limit once.', lines: function (d, x, y) { return h('g', null, h(P.ReferenceLine, { kind: 'threshold', scale: y, value: 80, inner: d.inner, label: 'Warning', format: pct }), h(P.ReferenceLine, { kind: 'threshold', level: 'critical', scale: y, value: 90, inner: d.inner, label: 'Limit', format: pct })); } })); }]] };

  /* ── 07 Data Display › Charts › Annotation: ChartAnnotation ── */
  var chartAnnotation = { id: 'chart-annotation', lab: true, icon: 'pin', sec: 'data-display', sub: 'Charts', leaf: 'Annotation', title: 'Chart annotation',
    plenix: 'ChartAnnotation', src: 'charts/parts/ChartAnnotation.tsx', css: CSS, blocks: ['plx-chart-annotation'], level: 'Foundation', interaction: 'Static',
    aliases: ['Chart note', 'Callout', 'Event marker', 'Highlighted range'],
    text: 'A short note on a chart that explains what happened: a ring on one data point with a leader line to its note (above it, or under it when the point is high), or a shaded span of the plot behind the marks with its name at its top (a sale, an outage). It is not a comment thread: that is Collaboration › Annotation.',
    use: ['Outliers, outages, launches and changes in how data is counted', 'One or two notes per chart, a few words each, sentence case', 'The same note in the chart’s description or the data table'],
    avoid: ['Notes on every point', 'Values as notes: that is a data label', 'A note that covers the data: place it under the point (placement="bottom") or use a range'],
    related: ['chart-reference-line', 'chart-data-label', 'chart-foundations'],
    map: [[SPE, 'Annotation', 'Partial'], [CAR, 'Charts (annotations)', 'Partial'], [HIG, 'Charts (annotations)', 'Partial']],
    variantPages: [
      vp('Point annotation', 'Kind', 'Point (above)', { variant: 'top' }, 'A ring on the point, a leader line up to the note.', 'A spike or a single event', 'A period: the range'),
      vp('Point annotation below', 'Kind', 'Point (below)', { variant: 'bottom' }, 'The note under the point, for a point near the top of the plot.', 'High points where the note would leave the plot', 'Low points: above'),
      vp('Range annotation', 'Kind', 'Range', { variant: 'range' }, 'A shaded span down the plot behind the marks, named at its top.', 'Periods: a sale, an outage, a holiday', 'A single moment: the point')
    ],
    examples: [
      ['Kind', [
        ['Point (above)', function () { return box(560, h(Lines, { shown: ['web'], extra: function (d, x, y) { return h(P.ChartAnnotation, { x: P.scalePosition(x, 'Apr'), y: y(240), inner: d.inner, label: 'Campaign' }); } })); }, 'plx-chart-annotation--top', 'placement=' + q('top')],
        ['Point (below)', function () { return box(560, h(Lines, { shown: ['web'], extra: function (d, x, y) { return h(P.ChartAnnotation, { x: P.scalePosition(x, 'May'), y: y(310), inner: d.inner, label: 'Launch', placement: 'bottom' }); } })); }, 'plx-chart-annotation--bottom', 'placement=' + q('bottom')],
        ['Range', function () { return box(560, h(Lines, { before: function (d, x) { return h(P.ChartAnnotation, { kind: 'range', x: x('Mar'), x2: x('Apr') + x.bandwidth(), inner: d.inner, label: 'Spring sale' }); } })); }, 'plx-chart-annotation--range', 'kind=' + q('range')]], { prop: 'kind' }]] };

  /* ── 07 Data Display › Cards and objects › Feature card: FeatureCard ── */
  var FEATURES = [['sparkle', 'purple', 'Smart tags', 'Tags your pictures as they upload.'], ['share', 'blue', 'Share links', 'Send a folder to anyone, no account needed.'], ['lock', 'green', 'Permissions', 'Choose who sees and edits each collection.']];
  var feature = function (f, o) { return h(P.FeatureCard, Object.assign({ icon: f[0], hue: f[1], title: f[2], description: f[3], href: '#feature' }, o)); };
  var featureCard = { id: 'feature-card', lab: true, icon: 'sparkle', sec: 'data-display', sub: 'Cards and objects', leaf: 'Feature card', title: 'Feature card',
    plenix: 'FeatureCard', src: 'patterns/FeatureCard/FeatureCard.tsx', level: 'Pattern', interaction: 'Navigation', statesFrom: ['card'],
    aliases: ['Feature tile', 'Callout card', 'Promo card', 'Entry-point card', 'Capability card'],
    text: 'A Card that presents one feature or task: its icon tile (or a picture across the top), its name as the heading and one sentence on what it does for people. The whole card is one link (href) or button (onOpen) through Card’s opener: one Tab stop, a hover lift and a focus outline. Horizontal puts the media before the text, for lists and narrow columns.',
    use: ['Home, empty and onboarding pages: two to six features of equal weight in a ContentGrid', 'A name that says the feature or starts with the task’s verb; one sentence on the benefit', 'The same variant for every card of a set'],
    avoid: ['Urgent news: a banner or a notification', 'Records (assets, projects): their own cards or the DataGrid', 'More than one action in a feature card: it is one target'],
    related: ['card', 'icon-tile', 'media-card'],
    map: [[CAR, 'Tile (clickable)', 'Partial'], [MAT, 'Cards', 'Partial'], [POL, 'Callout card', 'Partial'], [FLU, 'Card', 'Partial'], [ATL, 'Card (spotlight)', 'Partial']],
    variantPages: [
      vp('Feature card with icon', 'Variant', 'Icon (default)', { variant: 'icon' }, 'An icon tile above the name and the sentence.', 'Sets of features with icons of the Plenix set', 'Pictures that explain better: the image variant'),
      vp('Feature card with image', 'Variant', 'Image', { variant: 'image' }, 'A 16:9 picture across the top, out to the card’s edges.', 'Features shown best by a picture or an illustration', 'Small grids where pictures crowd the text'),
      vp('Horizontal feature card', 'Variant', 'Horizontal', { variant: 'horizontal' }, 'The icon tile (or a square picture) before the name and the sentence.', 'Narrow columns and lists of features', 'Grids of wide cards: the icon variant')
    ],
    examples: [
      ['Variant', [
        ['Icon (default)', function () { return box(280, feature(FEATURES[0])); }, 'plx-feature-card--icon', 'variant=' + q('icon')],
        ['Image', function () { return box(280, feature(FEATURES[1], { variant: 'image', image: ART('14') })); }, 'plx-feature-card--image', 'variant=' + q('image')],
        ['Horizontal', function () { return box(400, feature(FEATURES[2], { variant: 'horizontal' })); }, 'plx-feature-card--horizontal', 'variant=' + q('horizontal')]], { prop: 'variant' }],
      ['A set in a ContentGrid', function () { return box(900, h(P.ContentGrid, { size: 'lg', label: 'Features' }, FEATURES.map(function (f) { return h('div', { key: f[2] }, feature(f)); }))); }],
      ['A button card (onOpen) and a static card (no target)', function () { return row(box(280, feature(FEATURES[0], { href: undefined, onOpen: noop })), box(280, feature(FEATURES[2], { href: undefined, tone: 'success', icon: 'circle-check', title: 'Backups on', description: 'Every night at 2:00.' }))); }]] };

  /* ── 03 Content & Identity › Identity › User card: UserCard ── */
  var MAYA = { name: 'Maya Chen', secondary: 'Senior designer · Brand team', presence: 'online', role: 'Owner',
    details: [{ icon: 'mail', label: 'maya.chen@example.org' }, { icon: 'phone', label: '+1 415 555 0134', data: true }, { icon: 'clock', label: h('span', null, h(P.Text, { variant: 'data' }, '9:42 AM'), ' local time') }] };
  var acts = function () { return [h(P.Button, { key: 'm', icon: 'message' }, 'Message'), h(P.Button, { key: 'c', variant: 'ghost', icon: 'phone' }, 'Call')]; };
  var person = function (o) { return h(P.UserCard, Object.assign({}, MAYA, o)); };
  var userCard = { id: 'user-card', lab: true, icon: 'person', sec: 'content', sub: 'Identity', leaf: 'User card', title: 'User card',
    plenix: 'UserCard', src: 'patterns/UserCard/UserCard.tsx', level: 'Pattern', interaction: 'Display',
    aliases: ['Profile card', 'Person card', 'Contact card', 'People card', 'Member card'],
    covers: [],
    text: 'A person on a Card: the avatar, the name as the heading (a link to the profile with href), a line with their title or team, a role badge, their presence (the avatar’s dot, and words after the name for assistive technology), a few ways to reach them in an icon list (phone numbers and times in the data font), and the actions for this person. A cover picture can head the card, with the avatar overlapping its edge. Compact is one row for lists and side panels.',
    use: ['People directories, team pages and the person a record belongs to', 'Details that help people reach or recognize the person: email, phone, local time, location', 'Actions named with verbs: Message, Call, Follow; at most two or three'],
    avoid: ['A person inline in text or a row: Persona', 'A preview that opens on hover: the hover card (it shows a user card’s content)', 'Private details the viewer may not see', 'A full profile: link to it (href)'],
    related: ['profile-summary', 'avatar', 'hover-card', 'card'],
    map: [[ATL, 'Profile card', 'Direct'], [FLU, 'Persona (in a card)', 'Partial'], [MAT, 'Cards', 'Partial'], [POL, 'Card with avatar', 'Partial']],
    variantPages: [
      vp('User card', 'Variant', 'Default', { variant: 'default' }, 'The avatar above the name, the line, the role and the details.', 'Directories and team pages in a grid', 'Lists: the compact card'),
      vp('Compact user card', 'Variant', 'Compact', { variant: 'compact' }, 'One row: a 40px avatar, the name and the line, the actions at the end; long text is cut with an ellipsis.', 'Side panels and stacked lists of people', 'When the details matter: the default card'),
      vp('User card with actions', 'Variant', 'With actions', { variant: 'actions' }, 'Buttons for this person at the card’s foot.', 'Directories where people message or call from the card', 'Destructive actions: they go on the profile'),
      vp('User card with cover', 'Variant', 'With cover', { variant: 'cover' }, 'A 21:9 picture across the top, the avatar overlapping its edge in a ring of the card’s surface.', 'Profiles and team pages where people choose a cover', 'Dense grids: the cover takes room')
    ],
    examples: [
      ['Variant', [
        ['Default', function () { return box(320, person({ role: undefined })); }, 'plx-user-card--default', 'UserCard'],
        ['Compact', function () { return box(400, person({ variant: 'compact', actions: h(P.Button, { variant: 'ghost', icon: 'message' }, 'Message') })); }, 'plx-user-card--compact', 'variant=' + q('compact')],
        ['With actions', function () { return box(320, person({ href: '#person', actions: acts() })); }, 'plx-user-card--actions', 'actions'],
        ['With cover', function () { return box(320, person({ cover: ART('16'), actions: acts() })); }, 'plx-user-card--cover', 'cover']], { prop: 'variant' }],
      ['A team in a ContentGrid', function () { return box(900, h(P.ContentGrid, { size: 'lg', label: 'Brand team' }, [['Maya Chen', 'Senior designer', 'online'], ['Alex Kim', 'Writer', 'away'], ['Sam Ortiz', 'Producer', 'busy']].map(function (p) { return h('div', { key: p[0] }, h(P.UserCard, { name: p[0], secondary: p[1], presence: p[2], href: '#person', actions: h(P.Button, { icon: 'message' }, 'Message') })); }))); }],
      ['Compact cards in a side panel list', function () { return box(360, h(P.Stack, { gap: 'sm' }, ['Maya Chen', 'Alex Kim'].map(function (n) { return h(P.UserCard, { key: n, variant: 'compact', name: n, secondary: n.toLowerCase().replace(' ', '.') + '@example.org' }); }))); }]] };

  /* ── 07 Data Display › Cards and objects › Profile card: the same UserCard (duplicate leaf) ── */
  var profileCard = { id: 'profile-card', icon: 'person', sec: 'data-display', sub: 'Cards and objects', leaf: 'Profile card', title: 'Profile card',
    plenix: 'UserCard', src: 'patterns/UserCard/UserCard.tsx', level: 'Pattern', interaction: 'Display', variantClasses: [], docsFrom: 'user-card',
    aliases: ['Person card', 'People card'],
    text: 'The profile card is the user card (UserCard): one person with their avatar, name, title, role, presence, ways to reach them and the actions that concern them.',
    use: ['People directories and team pages: UserCard in a ContentGrid'], avoid: ['A preview on hover: the hover card'],
    related: ['user-card', 'hover-card', 'profile-summary'],
    map: [[ATL, 'Profile card', 'Direct'], [MAT, 'Cards', 'Partial']],
    examples: [['A profile card (UserCard)', function () { return box(320, person({ href: '#person', actions: acts() })); }]] };

  return [userCard, profileCard, featureCard, chartLegend, chartTooltip, dataLabel, chartAxis, chartGrid, threshold, referenceLine, chartAnnotation];
});
