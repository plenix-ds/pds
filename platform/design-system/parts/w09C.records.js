/* Plenix design system · library part w09C (wave 9, lane C): chart accessibility (the rules and platform/charts/a11y.js),
   Sparkline, Metric's trend and card (Metric card), LollipopChart, ScatterChart (Scatter plot) and its Bubble chart,
   FunnelChart (Funnel), Treemap, GanttChart, and GeoMap (Map) with its Choropleth map. Every chart is drawn in ChartFrame
   with the chart parts; every color is a data-viz step or an existing role. The map's regions are a made-up sample
   layout (not a real place): Plenix ships no geography. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', HIG = 'Apple HIG';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var pct = function (v) { return P.formatPercent(v, { decimals: 0 }); };

  /* ── the sample data ── */
  var DAILY = [40, 42, 39, 47, 51, 49, 56, 58, 54, 61, 66, 64];
  var WEEKS = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'];
  var TEAMS = [{ label: 'Design', value: 412 }, { label: 'Marketing', value: 356 }, { label: 'Product', value: 298 }, { label: 'Sales', value: 251 }, { label: 'Support', value: 204 }, { label: 'Legal', value: 96 }];
  var MONTHS = [{ label: 'Jan', value: 120 }, { label: 'Feb', value: 180 }, { label: 'Mar', value: 150 }, { label: 'Apr', value: 240 }, { label: 'May', value: 310 }, { label: 'Jun', value: 280 }];
  var ASSETS = [
    { id: 'img', label: 'Images', points: [[2.4, 310, 'hero.jpg'], [1.1, 420, 'logo.png'], [4.8, 260, 'team.jpg'], [6.2, 180, 'office.jpg'], [3.3, 290, 'banner.png'], [0.6, 460, 'icon.svg'], [8.1, 150, 'poster.tif'], [5.4, 210, 'cover.jpg']] },
    { id: 'vid', label: 'Videos', points: [[48, 120, 'launch.mp4'], [32, 160, 'demo.mov'], [86, 60, 'keynote.mp4'], [64, 90, 'tour.mp4'], [21, 190, 'teaser.mp4'], [74, 70, 'webinar.mp4']] }
  ].map(function (s) { return { id: s.id, label: s.label, points: s.points.map(function (p) { return { x: p[0], y: p[1], label: p[2] }; }) }; });
  var SIZES = [{ id: 'img', label: 'Images', points: ASSETS[0].points }];
  var BUBBLES = [{ id: 'teams', label: 'Teams', points: [{ x: 412, y: 7.4, size: 220, label: 'Design' }, { x: 356, y: 5.1, size: 96, label: 'Marketing' }, { x: 298, y: 6.2, size: 140, label: 'Product' },
    { x: 251, y: 3.8, size: 48, label: 'Sales' }, { x: 204, y: 2.9, size: 30, label: 'Support' }, { x: 96, y: 1.6, size: 12, label: 'Legal' }] }];
  var GROUPED = [{ id: 'brand', label: 'Brand team', points: [{ x: 120, y: 6.1, size: 80 }, { x: 180, y: 7.2, size: 140 }, { x: 90, y: 4.4, size: 40 }] },
    { id: 'web', label: 'Web team', points: [{ x: 240, y: 3.1, size: 60 }, { x: 300, y: 4.8, size: 120 }, { x: 210, y: 2.2, size: 30 }] }];
  var FUNNEL = [{ label: 'Visited', value: 12400 }, { label: 'Started sign-up', value: 5200 }, { label: 'Signed up', value: 3900 }, { label: 'Uploaded a file', value: 2100 }, { label: 'Shared a file', value: 1260 }];
  var FOLDERS = [{ label: 'Video', value: 220 }, { label: 'Photos', value: 96 }, { label: 'Design files', value: 48 }, { label: 'Documents', value: 22 }, { label: 'Audio', value: 14 }, { label: 'Archives', value: 8 }, { label: 'Other', value: 4 }];
  var TEAM_FOLDERS = [
    { label: 'Design', children: [{ label: 'Video', value: 120 }, { label: 'Design files', value: 48 }, { label: 'Photos', value: 40 }, { label: 'Other', value: 12 }] },
    { label: 'Marketing', children: [{ label: 'Video', value: 80 }, { label: 'Photos', value: 44 }, { label: 'Documents', value: 14 }] },
    { label: 'Product', children: [{ label: 'Video', value: 20 }, { label: 'Photos', value: 12 }, { label: 'Documents', value: 8 }, { label: 'Audio', value: 14 }] }];
  var D = function (d) { return new Date(2026, 8, d); };
  var TASKS = [
    { id: 'brief', label: 'Brief', start: D(1), end: D(4), progress: 1, status: 'Done' },
    { id: 'research', label: 'Research', start: D(3), end: D(10), progress: 1, status: 'Done', dependsOn: ['brief'] },
    { id: 'design', label: 'Design', start: D(10), end: D(22), progress: 0.5, status: 'On track', dependsOn: ['research'] },
    { id: 'copy', label: 'Copy', start: D(12), end: D(19), progress: 0.3, status: 'Late', dependsOn: ['research'] },
    { id: 'review', label: 'Asset review', start: D(22), end: D(26), progress: 0, status: 'Not started', dependsOn: ['design', 'copy'] },
    { id: 'launch', label: 'Launch', start: D(29), milestone: true, status: 'Planned', dependsOn: ['review'] }];
  var plain = function (o) { return TASKS.map(function (t) { var c = Object.assign({}, t); if (!o.deps) delete c.dependsOn; return c; }).filter(function (t) { return o.milestones || !t.milestone; }); };
  // the sample map: nine made-up regions on a 3 × 3 grid with shared, uneven edges (not a real place)
  var NAMES = [['Northwest', 'North', 'Northeast'], ['West', 'Central', 'East'], ['Southwest', 'South', 'Southeast']];
  var XS = [-20, -15, -10, -4], YS = [38, 35, 32, 29];
  var jig = function (i, j) { return (i === 0 || i === 3 || j === 0 || j === 3) ? 0 : ((i * 7 + j * 3) % 5 - 2) * 0.4; };
  var at = function (i, j) { return [XS[i] + jig(i, j), YS[j] + jig(j, i)]; };
  var REGIONS = { type: 'FeatureCollection', features: [] };
  NAMES.forEach(function (r, j) { r.forEach(function (n, i) {
    REGIONS.features.push({ type: 'Feature', id: n.toLowerCase(), properties: { name: n }, geometry: { type: 'Polygon', coordinates: [[at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j + 1), at(i, j)]] } });
  }); });
  var SHARE = { northwest: 0.42, north: 0.38, northeast: 0.31, west: 0.27, central: 0.35, east: 0.22, southwest: 0.12, south: 0.18 };   // southeast: no data
  var CHANGE = { northwest: 0.06, north: 0.03, northeast: -0.02, west: 0.01, central: 0.04, east: -0.05, southwest: -0.08, south: 0, southeast: 0.02 };
  var SITES = [{ id: 'a', label: 'North depot', lon: -14.2, lat: 36.4 }, { id: 'b', label: 'Harbor office', lon: -18.1, lat: 33.2 }, { id: 'c', label: 'East studio', lon: -6.3, lat: 33.9 }, { id: 'd', label: 'South warehouse', lon: -11.8, lat: 30.1 }];

  /* ── 07 Data Display › Charts › Chart accessibility: the rules (a11y.js: summarizeSeries, ChartPatterns, useChartPoints) ── */
  var SERIES3 = [[120, 180, 150, 240], [80, 95, 130, 160], [60, 70, 90, 110]];
  var Q = ['Q1', 'Q2', 'Q3', 'Q4'];
  var Patterned = function () {
    var uid = 'ds-w09c-pat' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
    var names = ['Web', 'iOS', 'Android'];
    return h(P.ChartFrame, { title: 'Sign-ups by platform', description: 'Each platform has its color and its texture, so the columns are told apart without color.',
      legend: h(P.ChartLegend, { items: names.map(function (n, i) { return { id: n, label: n + ' (' + P.chartPattern(i) + ')', color: P.seriesColor(i) }; }) }),
      table: { columns: [{ title: 'Quarter', field: 'q', kind: 'name', rowLabel: true }].concat(names.map(function (n, i) { return { title: n, field: 's' + i, kind: 'data', align: 'right' }; })),
        data: Q.map(function (q, k) { return { id: k + 1, q: q, s0: SERIES3[0][k], s1: SERIES3[1][k], s2: SERIES3[2][k] }; }) } }, function (d) {
      var x = P.scaleBand({ domain: Q, range: [0, d.inner.width] }), y = P.scaleLinear({ domain: [0, 240], range: [d.inner.height, 0], nice: true });
      var w = x.bandwidth() / 3;
      return h('g', null, h(P.ChartPatterns, { id: uid }), h(P.GridLines, { scale: y, inner: d.inner }),
        Q.map(function (q, k) { return h('g', { key: q }, SERIES3.map(function (s, i) {
          var geo = { x: x(q) + i * w, y: y(s[k]), width: w, height: d.inner.height - y(s[k]) };
          return h('g', { key: i }, h('rect', Object.assign({ className: 'plx-chart__mark', 'data-plx-dataviz': P.seriesColor(i) }, geo)), h('rect', Object.assign({ className: 'plx-chart-pattern', fill: P.patternFill(uid, i) }, geo)));
        })); }),
        h(P.Axis, { scale: y, orient: 'left', inner: d.inner, margin: d.margin }), h(P.Axis, { scale: x, orient: 'bottom', inner: d.inner, margin: d.margin }));
    });
  };
  var Summarized = function () {
    var text = P.summarizeSeries(DAILY, { labels: WEEKS });
    return h(P.Stack, { gap: 'sm' }, h(P.ChartFrame, { title: 'Downloads per week', description: text, size: 'sm',
      table: { columns: [{ title: 'Week', field: 'w', kind: 'name', rowLabel: true }, { title: 'Downloads', field: 'v', kind: 'data', align: 'right' }], data: DAILY.map(function (v, i) { return { id: i + 1, w: WEEKS[i], v: v }; }) } }, function (d) {
      var x = P.scaleLinear({ domain: [0, DAILY.length - 1], range: [0, d.inner.width] }), y = P.scaleLinear({ domain: [30, 70], range: [d.inner.height, 0], nice: true });
      return h('g', null, h(P.GridLines, { scale: y, inner: d.inner }), h('path', { className: 'plx-chart__line', 'data-plx-dataviz': P.seriesColor(0), d: DAILY.map(function (v, i) { return (i ? 'L' : 'M') + x(i) + ',' + y(v); }).join('') }),
        h(P.Axis, { scale: y, orient: 'left', inner: d.inner, margin: d.margin }));
    }), h(P.Text, { as: 'p', variant: 'data' }, 'summarizeSeries(values, { labels }) → "' + text + '"'));
  };
  var contrastRows = function () {
    var surface = P.tokenValue('--plx-sys-surface-default');
    return [1, 2, 3, 4, 5, 6].map(function (i) {
      var c = P.tokenValue('--plx-sys-dataviz-categorical-' + i), r = P.contrastRatio(c, surface);
      return { id: i, step: 'categorical-' + i, ratio: isNaN(r) ? '—' : r.toFixed(2) + ' : 1', meets: isNaN(r) ? '—' : P.meetsContrast(r, 'non-text') ? 'Meets 3 : 1' : 'Below 3 : 1: add a texture or a label' };
    });
  };
  var chartA11y = { id: 'chart-accessibility', lab: true, icon: 'view-table', sec: 'data-display', sub: 'Charts', leaf: 'Chart accessibility', title: 'Chart accessibility',
    plenix: 'summarizeSeries, ChartPatterns, chartPattern, patternFill, useChartPoints', src: 'charts/a11y.js', css: ['charts/chart-a11y.css'], blocks: ['plx-chart-keys', 'plx-chart-pattern'],
    level: 'Foundation', interaction: 'Navigation', statesFrom: ['chart-interaction'],   // the plot's focus and keys are the chart interaction's
    aliases: ['Accessible charts', 'Chart a11y', 'Data grid fallback', 'Chart keyboard navigation', 'Chart textures', 'Chart summary'],
    text: 'The rules that make every Plenix chart usable without seeing it, without a mouse and without telling colors apart. ChartFrame gives each chart a name (its title), a takeaway (its description) and its data as a table one click away; summarizeSeries writes that takeaway for a series; ChartPatterns adds textures so series differ by more than color. On line, scatter, heat map, treemap, waterfall and similar charts, the chart interaction (ChartFrame’s plot; useChartPoints for charts of separate marks) lets the keyboard read the values one by one, each spoken; on the others the keyboard reaches “Show the data”, the same values as a table. Charts draw once, with no motion, and keep their marks at 3:1 against the surface.',
    use: ['A title and a description on every chart: the description is the finding (“Up 60% since week 1, highest in week 11”), summarizeSeries when it is a trend',
      'The data table (ChartFrame’s Table) on every chart, with the same values in the axis’s format', 'Textures (ChartPatterns) when series are compared side by side, or labels on the marks',
      'ChartFrame’s interactive plot (useChartPoints, the chart interaction): one Tab stop, the arrow keys through the points, each spoken; the active point shown with a ring and the tooltip',
      'Marks at 3:1 against the chart surface and text at 4.5:1; check the data-viz scales on the Contrast rules page'],
    avoid: ['A chart treated as decoration when it carries data', 'Values only in a tooltip or on hover: the table and the description carry them too', 'Color as the only way to tell series apart',
      'Animation in charts; when one is needed, none under reduced motion', 'A tab stop on every mark: one stop for the chart, arrow keys inside'],
    related: ['chart-foundations', 'chart-legend', 'chart-tooltip', 'dataviz-colors', 'use-of-color', 'contrast-rules'],
    map: [[CAR, 'Data visualization accessibility', 'Direct'], [FLU, 'Charts accessibility', 'Direct'], [SPE, 'Data visualization accessibility', 'Partial'], [POL, 'Data visualization accessibility', 'Partial'], [HIG, 'Charting data (accessibility)', 'Partial']],
    variantPages: [
      vp('Data grid fallback', 'Rule', 'Data grid fallback', { variant: 'table' }, 'Every chart’s values as a table under it, behind “Show the data” (ChartFrame table).', 'Every chart: the values for screen readers, keyboards and people who prefer numbers', 'A table with other values or rounding than the chart'),
      vp('Chart summary text', 'Rule', 'Summary text', { variant: 'summary' }, 'The chart’s description says the finding; summarizeSeries writes it for a trend.', 'Every chart’s description, and sparklines’ names', 'A description that repeats the title'),
      vp('Chart patterns', 'Rule', 'Patterns', { variant: 'patterns' }, 'A texture over each series’ marks in the surface color, by the series’ order (chartPattern).', 'Bars, columns, areas and regions compared side by side', 'Lines and points: label them, or vary their markers'),
      vp('Chart keyboard navigation', 'Rule', 'Keyboard point navigation', { variant: 'keyboard' }, 'One Tab stop around the chart; the arrow keys move through the points, Home and End to the ends, each spoken; the active point has a ring and the tooltip.', 'Every chart people explore point by point', 'A tab stop on each mark')
    ],
    examples: [
      ['Rule', [
        ['Data grid fallback', function () { return box(560, h(P.LollipopChart, { title: 'Uploads by team', description: 'Design uploads the most; legal the least. Open “Show the data” for every value.', data: TEAMS, sort: 'desc', valueTitle: 'Uploads' })); }, null, 'ChartFrame table'],
        ['Summary text', function () { return box(560, h(Summarized)); }, null, 'summarizeSeries'],
        ['Patterns', function () { return box(560, h(Patterned)); }, 'plx-chart-pattern', 'ChartPatterns'],
        ['Keyboard point navigation', function () { return box(560, h(P.ScatterChart, { title: 'Size and downloads of images', description: 'Tab to the chart, then use the arrow keys: each image is read with its size and downloads.', xTitle: 'Size (MB)', yTitle: 'Downloads', series: SIZES })); }, 'plx-chart-keys', 'ChartKeys']]],
      ['Contrast of marks: each categorical color against the chart surface (read live from the tokens)', function () { return box(560, h(P.Table, { label: 'Contrast of the categorical colors', data: contrastRows(),
        columns: [{ title: 'Data-viz step', field: 'step', kind: 'data', rowLabel: true }, { title: 'Against the surface', field: 'ratio', kind: 'data', align: 'right' }, { title: 'Non-text rule (3 : 1)', field: 'meets', kind: 'wrap' }] })); }],
      ['Reduced motion: charts draw once, with no animation; a chart that adds motion drops it under prefers-reduced-motion', function () { return box(560, h(P.Sparkline, { values: DAILY, size: 'fill', variant: 'area', showLast: true, label: 'Downloads per week', labels: WEEKS })); }]] };

  /* ── 07 Data Display › Charts › Sparkline: Sparkline ── */
  var sparkline = { id: 'sparkline', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Sparkline', title: 'Sparkline',
    plenix: 'Sparkline', src: 'charts/Sparkline.jsx', css: ['charts/sparkline.css'], blocks: ['plx-sparkline'], level: 'Component', interaction: 'Display',
    aliases: ['Microchart', 'Trend line', 'Inline chart', 'Word-sized chart'],
    text: 'A word-sized chart with no axes that shows the shape of a trend next to the number it describes: a line, a filled area or small columns, and a dot on the latest value. Inline, it is 96 × 24, for a sentence or a table cell; fill takes its container’s width, for a metric card. Assistive technology reads it as one image named by its label and a summary of the trend (or hidden from it when the text beside it says the trend).',
    use: ['Next to a number in a metric card or a table cell, for the trend behind it', 'A column of sparklines over the same period, to compare shapes', 'showLast when the latest value matters; bars for counts per day or week'],
    avoid: ['Exact values: a full line chart with axes and its table', 'A sparkline without the number it describes', 'Different periods in one set', 'Axes, grid lines or a legend on it'],
    related: ['metric-card', 'metric', 'chart-foundations', 'chart-accessibility'],
    map: [[CAR, 'Sparkline', 'Direct'], [FLU, 'Sparkline', 'Direct'], [POL, 'Sparkline', 'Direct'], [SPE, 'Sparkline', 'Partial'], [HIG, 'Charts (sparkline)', 'Partial']],
    variantPages: [
      vp('Line sparkline', 'Variant', 'Line (default)', { variant: 'line' }, 'The trend as a line across the box, the lowest value at the bottom and the highest at the top.', 'Most trends: rates, totals, levels', 'Counts per period where each period stands alone: bars'),
      vp('Area sparkline', 'Variant', 'Area', { variant: 'area' }, 'The line with a light fill of its color under it.', 'A trend that should weigh more on a card', 'A row of many sparklines: lines are lighter'),
      vp('Bar sparkline', 'Variant', 'Bar', { variant: 'bar' }, 'One small column per value, from zero.', 'Counts per day or week', 'Long series: the columns get too thin'),
      vp('Sparkline with last point', 'Variant', 'With last point', { variant: 'last' }, 'A dot on the latest value, ringed in the surface color.', 'When the latest value is the number beside it', 'Bars: the last column already shows it'),
      vp('Inline sparkline', 'Size', 'Inline (default)', { size: 'inline' }, 'A word-sized box, 96 × 24.', 'Sentences and table cells', 'Cards: fill'),
      vp('Full-width sparkline', 'Size', 'Fill', { size: 'fill' }, 'The container’s width, 32 tall.', 'Metric cards', 'Text: inline')
    ],
    examples: [
      ['Variant', [
        ['Line (default)', function () { return h(P.Sparkline, { values: DAILY, label: 'Downloads per week', labels: WEEKS }); }, 'plx-sparkline--line', 'variant=' + q('line')],
        ['Area', function () { return h(P.Sparkline, { values: DAILY, variant: 'area', label: 'Downloads per week' }); }, 'plx-sparkline--area', 'variant=' + q('area')],
        ['Bar', function () { return h(P.Sparkline, { values: DAILY, variant: 'bar', color: P.seriesColor(1), label: 'Uploads per week' }); }, 'plx-sparkline--bar', 'variant=' + q('bar')],
        ['With last point', function () { return h(P.Sparkline, { values: DAILY, showLast: true, label: 'Downloads per week' }); }, 'plx-sparkline__last', 'showLast']], { prop: 'variant' }],
      ['Size', [
        ['Inline (default)', function () { return h(P.Text, { as: 'p' }, 'Downloads rose 60% over twelve weeks ', h(P.Sparkline, { values: DAILY, decorative: true }), ' to ', h(P.Text, { variant: 'data' }, '64'), ' a week.'); }, 'plx-sparkline--inline', 'size=' + q('inline')],
        ['Fill', function () { return box(240, h(P.Sparkline, { values: DAILY, size: 'fill', variant: 'area', showLast: true, label: 'Downloads per week' })); }, 'plx-sparkline--fill', 'size=' + q('fill')]], { prop: 'size' }],
      ['In a table: one sparkline per row, the same twelve weeks', function () { return box(560, h(P.Table, { label: 'Downloads by asset', data: [['hero.jpg', 64, DAILY], ['logo.png', 41, DAILY.map(function (v) { return 90 - v; })], ['team.jpg', 52, DAILY.map(function (v, i) { return 40 + (i % 4) * 6; })]].map(function (r, i) { return { id: i + 1, name: r[0], last: r[1], trend: r[2] }; }),
        columns: [{ title: 'Asset', field: 'name', kind: 'data', rowLabel: true }, { title: 'Last week', field: 'last', kind: 'data', align: 'right' }, { title: 'Twelve weeks', field: 'trend', kind: 'wrap', render: function (r) { return h(P.Sparkline, { values: r.trend, label: r.name + ', downloads per week' }); } }] })); }]] };

  /* ── 07 Data Display › Cards and objects › Metric card: MetricCard (owner, 2026-10-19) ── */
  var MC = function (props, w) { return box(w || 300, h(P.MetricCard, props)); };
  var mcUp = function (a, v) { return { amount: a, direction: 'up', versus: v }; };
  var mcDown = function (a, v) { return { amount: a, direction: 'down', versus: v }; };
  var mcMore = function () { return [h(P.MenuItem, { key: 1, icon: 'open' }, 'Open details'), h(P.MenuItem, { key: 2, icon: 'download-alt' }, 'Export data')]; };
  var mcYear = function () { return h(P.Select, { size: 'sm', 'aria-label': 'Year', defaultValue: '2025', options: [{ value: '2025', label: '2025' }, { value: '2024', label: '2024' }] }); };
  var mcSales = function (extra) { return Object.assign({ icon: 'field-currency', title: 'Sales revenue', context: 'This month', menu: mcMore(), value: '$1.77M', change: mcUp('15%', 'vs last month'), goodWhen: 'up' }, extra); };
  var metricCard = { id: 'metric-card', icon: 'chart', sec: 'data-display', sub: 'Cards and objects', leaf: 'Metric card', title: 'Metric card',
    plenix: 'MetricCard', src: 'components/MetricCard/MetricCard.jsx', css: ['components/MetricCard/metric-card.css'], blocks: ['plx-metric-card'],
    level: 'Component', interaction: 'Display',
    aliases: ['KPI card', 'Stat card', 'Big number card', 'Scorecard', 'Tile', 'Dashboard card'],
    text: 'One key figure in a card, with one anatomy for every kind of data: the header names what is measured (icon, title, info, the period filter, More, then a context line with the scope or the period); the body shows the value with its unit or target, a status, the change and the one visual its type draws; a footer note closes it. The type follows the shape of the data (12 types), the layout where the card sits (5), the style how strongly it stands out (5; the `appearance` setting). Every value is a Plenix token: the frame is Panel\u2019s, the colors are the data colors, the value uses the display sizes 24, 28 and 36.',
    use: ['The key numbers at the top of a dashboard, the same period on every card', 'type by the shape of the data: one number (value), its history (trend), against a target (progress), a score with zones (gauge), parts of a total (breakdown), two sides (comparison), the top items (list), a few figures about one subject (summary), one person (person), days (week, month), rows (table)',
      'goodWhen for which way is good; the change carries good or bad with its arrow and color', 'href to the detailed view: the whole card is the target', 'state for loading, empty, error and stale data: the header stays so people know which card it is'],
    avoid: ['A colored value: the value is never colored; the change and the status carry the meaning', 'Zero for missing data: leave the value out and the card shows a dash', 'filled or gradient on a type that draws a colored visual (only value and summary)', 'More than about six cards in a row: group them or use a table', 'The old <Metric card>: deprecated, use MetricCard'],
    related: ['metric', 'card', 'sparkline', 'gauge', 'progress-bar', 'avatar'],
    map: [[CAR, 'Tile (dashboard)', 'Partial'], [SPE, 'Big number', 'Partial'], [POL, 'Metric card (Polaris Viz)', 'Partial'], [FLU, 'Card (metric)', 'Partial'], [ATL, 'Card', 'Partial']],
    examples: [
      ['Type', [
        ['Value (default): one number', function () { return MC({ icon: 'checklist', title: 'Open tasks', context: 'All projects', info: 'Tasks not marked done.', menu: mcMore(), value: '128', change: mcUp('12', 'since last week'), goodWhen: 'down' }); }, null, 'type="value"'],
        ['Trend: the number and its recent history', function () { return MC({ type: 'trend', icon: 'image-b', title: 'Assets added', context: 'Last 30 days', value: '1,284', change: mcUp('12.5%', 'vs previous 30 days'), goodWhen: 'up', trend: [38, 41, 40, 44, 47, 45, 52, 49, 55, 58, 54, 61], footer: 'Updated 5 minutes ago' }); }, null, 'type="trend"'],
        ['Progress: against a target', function () { return MC({ type: 'progress', icon: 'briefcase', title: 'Tasks done', context: 'Kitchen renovation', value: '36', target: '147', progress: { value: 36, max: 147 }, status: { tone: 'active', label: '24%' }, footer: 'On pace to finish by Nov 30' }); }, null, 'type="progress"'],
        ['Progress rows', function () { return MC({ type: 'progress', icon: 'checklist', title: 'Granted vs submitted', context: '2025', filter: mcYear(), rows: [{ id: 'a', label: 'Annulments (both parties)', detail: '18 / 24', value: 18, max: 24, tone: 'good' }, { id: 'b', label: 'Annulments (one party)', detail: '6 / 8', value: 6, max: 8, tone: 'good' }, { id: 'c', label: 'Petitions denied', detail: '8 / 32', value: 8, max: 32, tone: 'bad' }] }, 360); }, null, 'rows'],
        ['Gauge: a score with zones', function () { return MC({ type: 'gauge', icon: 'database', title: 'Storage used', context: 'Library \u00b7 1 TB', gauge: { value: 86, format: function (v) { return v + '%'; }, label: 'of 1 TB', thresholds: [{ value: 80, level: 'warning', label: 'Nearly full' }, { value: 95, level: 'critical', label: 'Full' }] } }); }, null, 'type="gauge"'],
        ['Breakdown, bar: parts of a total', function () { return MC({ type: 'breakdown', icon: 'chart', title: 'Tasks by status', context: 'All projects', value: '278', unit: 'tasks', parts: [{ id: 't', label: 'To do', value: 145 }, { id: 'p', label: 'In progress', value: 72 }, { id: 'r', label: 'Review', value: 39 }, { id: 'd', label: 'Done', value: 22, color: 'green' }] }); }, null, 'type="breakdown"'],
        ['Breakdown, donut', function () { return MC({ type: 'breakdown', breakdown: 'donut', icon: 'person', title: 'Applicants by gender', context: '2025', filter: mcYear(), value: '60', unit: 'applicants', parts: [{ id: 'f', label: 'Female', value: 33 }, { id: 'm', label: 'Male', value: 27 }] }); }, null, 'breakdown="donut"'],
        ['Breakdown, ranges: ordered ranges', function () { return MC({ type: 'breakdown', breakdown: 'ranges', icon: 'clock', title: 'Duration before divorce', context: '2025 \u00b7 60 cases', parts: [{ id: 1, label: '0\u20135 years', detail: '23 cases', value: 23 }, { id: 2, label: '6\u201310 years', detail: '21 cases', value: 21 }, { id: 3, label: '11\u201315 years', detail: '11 cases', value: 11 }, { id: 4, label: '16+ years', detail: '5 cases', value: 5 }] }); }, null, 'breakdown="ranges"'],
        ['Comparison: two sides of one unit', function () { return MC({ type: 'comparison', icon: 'checklist', title: 'Done vs open', context: 'This sprint', compare: [{ label: 'Done', value: '29' }, { label: 'Open', value: '67' }] }); }, null, 'type="comparison"'],
        ['List, ranked: the top items', function () { return MC({ type: 'list', icon: 'star', title: 'Most active projects', context: 'Last 30 days', items: [{ id: 1, label: 'Kitchen renovation', value: 471, icon: 'briefcase', color: 'blue' }, { id: 2, label: 'Brand refresh', value: 427, icon: 'briefcase', color: 'purple' }, { id: 3, label: 'Q4 launch', value: 383, icon: 'briefcase', color: 'green' }] }); }, null, 'type="list"'],
        ['List, bars', function () { return MC({ type: 'list', list: 'bars', icon: 'settings-users', title: 'Case load by member', context: '2025', items: [{ id: 1, label: 'Fr. Gawargious Kotta', value: '14' }, { id: 2, label: 'Fr. Youhana Ibrahim', value: '12' }, { id: 3, label: 'Fr. Boules Mikhail', value: '10' }] }); }, null, 'list="bars"'],
        ['List, records: what needs action', function () { return MC({ type: 'list', list: 'records', icon: 'checklist', title: 'Overdue tasks', context: 'Assigned to you', items: [{ id: 1, label: 'Fix the upload limit', href: '#t1', status: { tone: 'negative', icon: 'alert', label: '5 days' } }, { id: 2, label: 'Review brand guide', status: { tone: 'waiting', icon: 'clock', label: '2 days' } }] }); }, null, 'list="records"'],
        ['Summary: 2\u20134 figures about one subject', function () { return MC({ type: 'summary', icon: 'calendar', title: 'Today', context: 'Mon, Oct 19', metrics: [{ value: '5', label: 'Tasks due' }, { value: '6.5', unit: 'hrs', label: 'Logged' }, { label: 'Meetings' }] }); }, null, 'type="summary"'],
        ['Person: one number about one person', function () { return MC({ type: 'person', person: { name: 'Maya Chen', role: 'Designer', gender: 'female' }, value: '12', unit: 'open tasks', change: mcUp('3', 'since last week'), goodWhen: 'none' }); }, null, 'type="person"'],
        ['Person with progress', function () { return MC({ type: 'person', person: { name: 'Daniel Okafor', role: 'Sales lead', gender: 'male' }, value: '$48.2K', unit: 'this quarter', progress: { value: 80 }, footer: 'Quota $60K' }); }, null, 'progress'],
        ['Week, bars: a value per day', function () { return MC({ type: 'week', icon: 'clock', title: 'Hours logged', context: 'This week', value: '35.5', unit: 'hrs', days: [7, 8, 9, 6, 5.5, 0, null] }); }, null, 'type="week"'],
        ['Week, marks: yes or no per day', function () { return MC({ type: 'week', week: 'marks', icon: 'calendar', title: 'Hours goal hit', context: 'This week \u00b7 9.5 hrs a day', value: '4', target: '7 days', days: [true, false, true, true, false, true, null] }); }, null, 'week="marks"'],
        ['Month: a level per day', function () { return MC({ type: 'month', icon: 'calendar', title: 'Days worked', context: 'October 2026', value: '11', target: '22 work days', month: { year: 2026, month: 10, levels: [2, 3, 2, 0, 2, 3, 1, 2, 2, 3, 0, 2, 1], today: 19 }, footer: 'Darker: more hours' }); }, null, 'type="month"'],
        ['Table: a total and its rows', function () { return MC({ type: 'table', icon: 'clock', title: 'Hours by project', context: 'This month', value: '128', unit: 'hrs', table: { columns: [{ title: 'Project', field: 'p', rowLabel: true }, { title: 'Hours', field: 'h', align: 'right' }], data: [{ id: 1, p: 'Kitchen renovation', h: '46' }, { id: 2, p: 'Brand refresh', h: '38' }, { id: 3, p: 'Q4 launch', h: '29' }] } }, 360); }, null, 'type="table"']], { prop: 'type' }],
      ['Layout', [
        ['Stacked (default): the visual under the figure', function () { return MC({ type: 'trend', icon: 'image-b', title: 'Assets added', context: 'Last 30 days', value: '1,284', change: mcUp('12.5%', 'vs previous 30 days'), goodWhen: 'up', trend: [38, 41, 40, 44, 47, 52] }); }, null, 'layout="stacked"'],
        ['Beside: the visual at the end (two columns wide)', function () { return MC({ type: 'trend', layout: 'beside', icon: 'field-currency', title: 'Total revenue', context: 'This month', value: '$98,450', change: mcUp('12.5%', 'from last month'), goodWhen: 'up', trend: [60, 52, 40, 48, 70, 90, 80], trendVariant: 'line' }, 560); }, 'plx-metric-card--beside', 'layout="beside"'],
        ['Inline: the context beside the value', function () { return MC({ layout: 'inline', icon: 'document', title: 'New cases', context: 'This month', value: '8' }); }, 'plx-metric-card--inline', 'layout="inline"'],
        ['Tile: no header, the value at the end', function () { return MC({ layout: 'tile', title: 'Cases to assign', value: '12', href: '#/data-display/metric-card' }, 240); }, 'plx-metric-card--tile', 'layout="tile"'],
        ['Icon start: a large icon tile first', function () { return MC({ layout: 'icon-start', icon: 'upload', title: 'Surveys sent', value: '5,050' }, 260); }, 'plx-metric-card--icon-start', 'layout="icon-start"']], { prop: 'layout' }],
      ['Appearance', [
        ['Plain (default)', function () { return MC(mcSales({})); }, null, 'appearance="plain"'],
        ['Edge: a start edge in the color', function () { return MC(mcSales({ appearance: 'edge' })); }, 'plx-metric-card--edge', 'appearance="edge"'],
        ['Soft: the color\u2019s soft fill', function () { return MC(mcSales({ appearance: 'soft' })); }, 'plx-metric-card--soft', 'appearance="soft"'],
        ['Filled: the color as the fill, white text', function () { return MC(mcSales({ appearance: 'filled' })); }, 'plx-metric-card--filled', 'appearance="filled"'],
        ['Gradient: a radial gradient between two data colors', function () { return MC(mcSales({ appearance: 'gradient' })); }, 'plx-metric-card--gradient', 'appearance="gradient"']], { prop: 'appearance' }],
      ['Color', ['blue', 'green', 'purple', 'red', 'brown', 'gray'].map(function (c) {
        return [c.charAt(0).toUpperCase() + c.slice(1) + (c === 'blue' ? ' (default)' : ''), function () { return MC(mcSales({ appearance: 'soft', color: c }), 260); }, null, 'color="' + c + '"'];
      }), { prop: 'color' }],
      ['Size', [
        ['SM: 24px value', function () { return MC({ icon: 'checklist', title: 'Open tasks', context: 'All projects', value: '128', size: 'sm' }, 240); }, 'plx-metric-card--sm', 'size="sm"'],
        ['MD (default): 28px value', function () { return MC({ icon: 'checklist', title: 'Open tasks', context: 'All projects', value: '128' }, 240); }, null, 'size="md"'],
        ['LG: 36px value, a dashboard\u2019s first row', function () { return MC({ icon: 'checklist', title: 'Open tasks', context: 'All projects', value: '128', size: 'lg' }, 240); }, 'plx-metric-card--lg', 'size="lg"']], { prop: 'size' }],
      ['State', [
        ['Ready (default)', function () { return MC({ icon: 'image-b', title: 'Assets added', context: 'Last 30 days', value: '1,284' }); }, null, 'state="ready"'],
        ['Loading: placeholders, the header stays', function () { return MC({ state: 'loading', icon: 'image-b', title: 'Assets added', context: 'Last 30 days' }); }, null, 'state="loading"'],
        ['Empty: a dash and why', function () { return MC({ state: 'empty', icon: 'image-b', title: 'Assets added', context: '2024', emptyText: 'No assets were added in 2024' }); }, null, 'state="empty"'],
        ['Error: the message and Try again', function () { return MC({ state: 'error', icon: 'image-b', title: 'Assets added', context: 'Last 30 days', onRetry: function () {} }); }, null, 'state="error"'],
        ['Stale: an Out of date badge', function () { return MC({ state: 'stale', icon: 'image-b', title: 'Assets added', context: 'Last 30 days', value: '1,284', footer: 'Last updated 3 days ago' }); }, null, 'state="stale"']], { prop: 'state' }],
      ['Link', [['A link card: the title goes to the details, the whole card is its target', function () { return MC({ icon: 'folder', title: 'Files', context: 'Shared with you', value: '2,480', change: mcUp('4.1%', 'since last month'), goodWhen: 'up', href: '#/data-display/metric-card' }); }, 'plx-metric-card--link', 'href']], { prop: 'href' }],
      ['The change: good when up, good when down, neither', function () { return h(P.ContentGrid, { size: 'md', label: 'Changes' },
        h('div', null, h(P.MetricCard, { title: 'Revenue', value: '$98K', change: mcUp('12%', 'vs last month'), goodWhen: 'up' })),
        h('div', null, h(P.MetricCard, { title: 'Open bugs', value: '130', change: mcUp('8', 'since last week'), goodWhen: 'down' })),
        h('div', null, h(P.MetricCard, { title: 'Team size', value: '24', change: mcDown('1', 'since last month'), goodWhen: 'none' }))); }],
      ['A dashboard row: the same period on every card', function () { return h(P.ContentGrid, { size: 'md', label: 'This month' },
        h('div', null, h(P.MetricCard, mcSales({ size: 'lg' }))),
        h('div', null, h(P.MetricCard, { type: 'trend', size: 'lg', icon: 'image-b', title: 'Assets added', context: 'This month', value: '1,284', change: mcUp('12.5%', 'vs last month'), goodWhen: 'up', trend: [38, 41, 40, 44, 47, 52] })),
        h('div', null, h(P.MetricCard, { type: 'progress', size: 'lg', icon: 'briefcase', title: 'Tasks done', context: 'This month', value: '36', target: '147', progress: { value: 36, max: 147 } }))); }]] };

  /* ── 07 Data Display › Charts › Lollipop chart: LollipopChart ── */
  var lollipop = { id: 'lollipop-chart', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Lollipop chart', title: 'Lollipop chart',
    plenix: 'LollipopChart', src: 'charts/LollipopChart.jsx', css: ['charts/lollipop-chart.css'], blocks: ['plx-lollipop'], level: 'Component', interaction: 'Display',
    aliases: ['Lollipop', 'Dot plot (with stems)', 'Stem chart'],
    text: 'A bar chart drawn light: each category’s value is a thin stem from zero ending in a dot, so many similar values compare without a wall of bars. Horizontal by default (names down the side, sorted largest first), or vertical for categories with an order of their own. Built on ChartFrame and the chart parts, read point by point with the keyboard.',
    use: ['Many categories with similar values, ranked', 'A ranked list where the end value matters', 'sort="desc" unless the categories have an order (months: vertical, in order)'],
    avoid: ['Stacked or grouped values: bars', 'A value axis that does not start at zero', 'Audiences who expect plain bars in a report'],
    related: ['chart-foundations', 'chart-axis', 'chart-data-label', 'chart-accessibility'],
    map: [[CAR, 'Lollipop chart', 'Direct'], [SPE, 'Dot plot', 'Partial'], [HIG, 'Charts (RuleMark with PointMark)', 'Partial']],
    variantPages: [
      vp('Horizontal lollipop chart', 'Orientation', 'Horizontal (default)', { variant: 'horizontal' }, 'Stems across from zero, the category names down the start side.', 'Ranked categories, long names', 'Categories in time order: vertical'),
      vp('Vertical lollipop chart', 'Orientation', 'Vertical', { variant: 'vertical' }, 'Stems up from zero, the categories along the bottom.', 'Categories with an order: months, steps', 'Long names: horizontal')
    ],
    examples: [
      ['Orientation', [
        ['Horizontal (default)', function () { return box(560, h(P.LollipopChart, { title: 'Uploads by team', description: 'Design uploads the most, four times as much as legal.', data: TEAMS, sort: 'desc', valueTitle: 'Uploads' })); }, 'plx-lollipop--horizontal', 'orientation=' + q('horizontal')],
        ['Vertical', function () { return box(560, h(P.LollipopChart, { orientation: 'vertical', title: 'Web sign-ups per month', description: 'Sign-ups peaked at 310 in May.', data: MONTHS, valueTitle: 'Sign-ups', showValues: true })); }, 'plx-lollipop--vertical', 'orientation=' + q('vertical')]], { prop: 'orientation' }],
      ['With values at the dots', function () { return box(560, h(P.LollipopChart, { title: 'Uploads by team', description: 'Design uploads the most.', data: TEAMS, sort: 'desc', valueTitle: 'Uploads', showValues: true, color: P.seriesColor(2) })); }]] };

  /* ── 07 Data Display › Charts › Scatter plot and Bubble chart: ScatterChart ── */
  var scatter = { id: 'scatter-chart', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Scatter plot', title: 'Scatter plot',
    plenix: 'ScatterChart', src: 'charts/ScatterChart.jsx', css: ['charts/scatter-chart.css'], blocks: ['plx-scatter'], level: 'Component', interaction: 'Display',
    aliases: ['Scatter chart', 'XY chart', 'Point chart', 'Correlation chart'],
    text: 'Items plotted as points by two measures, to show how they relate: a correlation, clusters, the outliers. Both axes fit the data and name their measures with units; points are a little transparent so overlaps show; groups take the categorical colors with a legend; a dashed trend line can show each group’s fit. Every point is read with the keyboard and listed in the table.',
    use: ['The relation between two measures over many items', 'Clusters and outliers', 'trend for the direction of a relation; the description says how strong it is'],
    avoid: ['Trends over time: a line chart', 'A handful of items: a table', 'More than four groups: filter, or small multiples'],
    related: ['bubble-chart', 'chart-axis', 'chart-legend', 'chart-accessibility'],
    map: [[CAR, 'Scatter', 'Direct'], [SPE, 'Scatter plot', 'Direct'], [FLU, 'Scatter chart', 'Partial'], [POL, 'Scatter (Polaris Viz)', 'Partial'], [HIG, 'Charts (PointMark)', 'Direct']],
    variantPages: [
      vp('Scatter plot', 'Variant', 'Points (default)', { variant: 'points' }, 'Every point the same size, a little transparent.', 'Two measures over many items', 'A third measure that matters: the bubble chart'),
      vp('Scatter plot with trend line', 'Variant', 'With trend line', { variant: 'trend' }, 'Each group’s least-squares line, dashed, across its points.', 'Showing the direction of a relation', 'Few points, or no relation: the line suggests one'),
      vp('Bubble variant of the scatter plot', 'Variant', 'Bubble (size)', { variant: 'bubble' }, 'Each point’s area is a third measure (the Bubble chart).', 'Three related measures per item', 'Precise size comparison: bars')
    ],
    examples: [
      ['Variant', [
        ['Points (default)', function () { return box(560, h(P.ScatterChart, { title: 'Size and downloads of assets', description: 'Larger files are downloaded less; videos sit apart from images.', xTitle: 'Size (MB)', yTitle: 'Downloads', series: ASSETS })); }, 'plx-scatter--points', 'variant=' + q('points')],
        ['With trend line', function () { return box(560, h(P.ScatterChart, { trend: true, title: 'Size and downloads of images', description: 'The larger an image, the fewer downloads: about 40 fewer per megabyte.', xTitle: 'Size (MB)', yTitle: 'Downloads', series: SIZES })); }, 'plx-scatter__trend', 'trend'],
        ['Bubble (size)', function () { return box(560, h(P.ScatterChart, { variant: 'bubble', title: 'Assets, downloads and storage by team', description: 'Design has the most assets, the most downloads per asset and the most storage.', xTitle: 'Assets', yTitle: 'Downloads per asset', sizeTitle: 'Storage (GB)', series: BUBBLES })); }, 'plx-scatter--bubble', 'variant=' + q('bubble')]], { prop: 'variant' }]] };
  var bubble = { id: 'bubble-chart', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Bubble chart', title: 'Bubble chart',
    plenix: 'ScatterChart variant="bubble"', src: 'charts/ScatterChart.jsx', css: ['charts/scatter-chart.css'], blocks: ['plx-scatter'], variantClasses: ['plx-scatter--bubble'], level: 'Component', interaction: 'Display',
    aliases: ['Bubble plot', 'Proportional point chart'],
    text: 'A scatter plot with a third measure as bubble area: each bubble sits at its two measures and its area (not its radius) follows the third; the largest bubble is 48px wide (a 24px radius). Smaller bubbles are drawn on top of larger ones, and every bubble is half transparent so overlaps stay visible; the tooltip and the table give the three values.',
    use: ['Three related measures per item, such as assets, downloads and storage', 'A moderate number of items that do not overlap heavily', 'sizeTitle with its unit, so the tooltip and the table name the third measure'],
    avoid: ['A third measure that does not matter: a scatter plot', 'Precise comparison of sizes: bars', 'Dozens of bubbles in one place'],
    related: ['scatter-chart', 'chart-legend', 'chart-accessibility'],
    map: [[CAR, 'Bubble', 'Direct'], [SPE, 'Scatter plot (size)', 'Partial'], [HIG, 'Charts (PointMark with symbolSize)', 'Partial']],
    variantPages: [
      vp('Bubble chart', 'Variant', 'Bubble (default)', { variant: 'bubble' }, 'One group of bubbles: position by two measures, area by the third.', 'Comparing items on three measures', 'More than about twenty bubbles'),
      vp('Grouped bubble chart', 'Variant', 'In groups', { variant: 'groups' }, 'Bubbles in groups, each in its categorical color, with a legend.', 'Comparing two or three groups', 'Groups that overlap entirely: separate charts')
    ],
    examples: [
      ['Variant', [
        ['Bubble (default)', function () { return box(560, h(P.ScatterChart, { variant: 'bubble', title: 'Assets, downloads and storage by team', description: 'Design has the most assets, the most downloads per asset and the most storage.', xTitle: 'Assets', yTitle: 'Downloads per asset', sizeTitle: 'Storage (GB)', series: BUBBLES })); }, 'plx-scatter--bubble', 'variant=' + q('bubble')],
        ['In groups', function () { return box(560, h(P.ScatterChart, { variant: 'bubble', title: 'Campaigns by team', description: 'The brand team’s campaigns get more downloads per asset.', xTitle: 'Assets', yTitle: 'Downloads per asset', sizeTitle: 'Storage (GB)', series: GROUPED })); }, null, 'series']], { prop: 'series' }]] };

  /* ── 07 Data Display › Charts › Funnel: FunnelChart ── */
  var funnel = { id: 'funnel-chart', lab: true, icon: 'filter', sec: 'data-display', sub: 'Charts', leaf: 'Funnel', title: 'Funnel',
    plenix: 'FunnelChart', src: 'charts/FunnelChart.jsx', css: ['charts/funnel-chart.css'], blocks: ['plx-funnel'], level: 'Component', interaction: 'Display',
    aliases: ['Funnel chart', 'Conversion funnel', 'Drop-off chart'],
    text: 'How many items remain at each step of an ordered process: one bar per stage on a zero baseline (never a tapered shape), with its count and the share kept from the stage before. The stage before’s length shows behind each bar in the sunken surface color, so the drop shows. Vertical (stages down the side) or horizontal (stages along the bottom).',
    use: ['Strictly ordered stages where each is a subset of the one before: sign-up, checkout, onboarding', 'Finding the step with the largest drop; say it in the description', 'The same period for every stage'],
    avoid: ['Stages that can be skipped or repeated: a Sankey diagram', 'Unrelated categories: a bar chart', 'A tapered shape: it distorts the lengths'],
    related: ['chart-foundations', 'chart-data-label', 'chart-accessibility'],
    map: [[POL, 'Funnel chart (Polaris Viz)', 'Direct'], [CAR, 'Bar chart (simple)', 'Partial'], [SPE, 'Bar chart', 'Partial']],
    variantPages: [
      vp('Vertical funnel', 'Orientation', 'Vertical (default)', { variant: 'vertical' }, 'Stages down the side, bars across, the count and share at each bar’s end.', 'Long stage names; most funnels', 'Few stages in a wide, short card: horizontal'),
      vp('Horizontal funnel', 'Orientation', 'Horizontal', { variant: 'horizontal' }, 'Stages along the bottom, columns up, the count and share above each.', 'Three to five stages with short names in a wide frame', 'Long stage names: vertical')
    ],
    examples: [
      ['Orientation', [
        ['Vertical (default)', function () { return box(640, h(P.FunnelChart, { title: 'Sign-up funnel, September', description: 'The largest drop is the first: 42% of visitors start signing up.', data: FUNNEL, valueTitle: 'People' })); }, 'plx-funnel--vertical', 'orientation=' + q('vertical')],
        ['Horizontal', function () { return box(640, h(P.FunnelChart, { orientation: 'horizontal', title: 'Sign-up funnel, September', description: 'The largest drop is the first: 42% of visitors start signing up.', data: FUNNEL.slice(0, 4), valueTitle: 'People' })); }, 'plx-funnel--horizontal', 'orientation=' + q('horizontal')]], { prop: 'orientation' }]] };

  /* ── 07 Data Display › Charts › Treemap: Treemap ── */
  var treemap = { id: 'treemap', lab: true, icon: 'grid-2x2', sec: 'data-display', sub: 'Charts', leaf: 'Treemap', title: 'Treemap',
    plenix: 'Treemap', src: 'charts/Treemap.jsx', css: ['charts/treemap.css'], blocks: ['plx-treemap'], level: 'Component', interaction: 'Display',
    aliases: ['Tree map', 'Space-filling chart', 'Mosaic'],
    text: 'The parts of a whole as rectangles whose areas are their sizes, laid out by the squarified algorithm, largest first from the top start corner: many parts in little room. Flat: every tile in one color. Nested: each group framed and named, its tiles in the group’s color. Names and values show on tiles big enough for them, on a halo in the surface color; the tooltip and the table always have them.',
    use: ['Many parts of a whole: storage by folder, budget by team', 'Two levels: groups and their parts (nested)', 'A description that names the largest parts'],
    avoid: ['Precise comparison: a bar chart', 'Two to five parts: a donut or bars', 'More than two levels: drill in instead', 'Negative values'],
    related: ['chart-foundations', 'chart-tooltip', 'chart-accessibility'],
    map: [[CAR, 'Treemap', 'Direct'], [SPE, 'Treemap', 'Partial'], [FLU, 'Treemap', 'Partial']],
    variantPages: [
      vp('Flat treemap', 'Variant', 'Flat', { variant: 'flat' }, 'One level: every part a tile in one color, largest first.', 'The parts of one whole', 'Parts that belong to groups: nested'),
      vp('Nested treemap', 'Variant', 'Nested', { variant: 'nested' }, 'Groups framed and named, their parts inside in the group’s color.', 'Two levels: teams and their folders', 'More than six groups: their colors repeat')
    ],
    examples: [
      ['Variant', [
        ['Flat', function () { return box(640, h(P.Treemap, { title: 'Storage by folder', description: 'Video takes over half of the 412 GB; photos a quarter.', data: FOLDERS, valueTitle: 'Size (GB)' })); }, 'plx-treemap--flat', 'data'],
        ['Nested', function () { return box(640, h(P.Treemap, { title: 'Storage by team and folder', description: 'Design uses half of the storage, most of it video.', data: TEAM_FOLDERS, valueTitle: 'Size (GB)' })); }, 'plx-treemap--nested', 'data (children)']], { prop: 'variant' }]] };

  /* ── 07 Data Display › Charts › Gantt chart: GanttChart ── */
  var gantt = { id: 'gantt-chart', lab: true, icon: 'schedule', sec: 'data-display', sub: 'Charts', leaf: 'Gantt chart', title: 'Gantt chart',
    plenix: 'GanttChart', src: 'charts/GanttChart.jsx', css: ['charts/gantt-chart.css'], blocks: ['plx-gantt'], level: 'Component', interaction: 'Display',
    aliases: ['Gantt', 'Project schedule', 'Timeline chart', 'Roadmap chart'],
    text: 'A schedule on a time axis: one row per task with a bar from its start to its end, the part not done yet textured (so progress shows without a second color) and the share done after it; diamonds for milestones; arrows from a task to the tasks that wait for it; a dashed line at today. Read-only: the keyboard reads every task, and the table lists each with its dates, progress, status and dependencies.',
    use: ['Project schedules, release plans and bookings where start, end and dependencies matter', 'today to show what is late; status in words for every task', 'About ten tasks per chart (size lg); split longer plans by phase'],
    avoid: ['A plain list of dates: a table or a timeline', 'Quantities over time: a line or column chart', 'Status told by bar color alone', 'Editing by dragging without keyboard alternatives'],
    related: ['timeline', 'chart-reference-line', 'chart-accessibility', 'calendar'],
    map: [[CAR, 'Gantt (not defined)', 'Partial'], [ATL, 'Timeline (Jira plans)', 'Partial'], [SPE, 'Timeline', 'Partial']],
    variantPages: [
      vp('Gantt chart tasks', 'Variant', 'Tasks', { variant: 'tasks' }, 'A bar per task from its start to its end, the part not done textured, the share done after it.', 'Any schedule', 'Tasks without dates: a list'),
      vp('Gantt chart dependencies', 'Variant', 'Dependencies', { variant: 'dependencies' }, 'An arrow from the end of a task to the start of each task that waits for it.', 'Plans where one task blocks another', 'Tasks that only overlap: no arrow'),
      vp('Gantt chart milestones', 'Variant', 'Milestones', { variant: 'milestones' }, 'A diamond at a single date: a launch, a review.', 'Dates that mark a point, not a span', 'Tasks of a day: a short bar'),
      vp('Gantt chart today line', 'Variant', 'Today line', { variant: 'today' }, 'A dashed line at today with its name, so what is late shows.', 'Schedules in progress', 'Plans in the past or the far future')
    ],
    examples: [
      ['Variant', [
        ['Tasks', function () { return box(720, h(P.GanttChart, { title: 'Brand refresh schedule', description: 'Design and copy overlap in mid-September.', tasks: plain({}), size: 'md' })); }, 'plx-gantt__bar', 'tasks'],
        ['Dependencies', function () { return box(720, h(P.GanttChart, { title: 'Brand refresh schedule', description: 'The asset review waits on design and copy.', tasks: plain({ deps: true }), size: 'md' })); }, 'plx-gantt__link', 'dependsOn'],
        ['Milestones', function () { return box(720, h(P.GanttChart, { title: 'Brand refresh schedule', description: 'The launch is on September 29.', tasks: plain({ milestones: true }) })); }, 'plx-gantt__milestone', 'milestone'],
        ['Today line', function () { return box(720, h(P.GanttChart, { title: 'Brand refresh schedule', description: 'On September 15 copy is behind: 30% done with four days left.', tasks: plain({ deps: true, milestones: true }), today: D(15) })); }, 'plx-chart-reference--x', 'today']], { prop: 'variant' }]] };

  /* ── 07 Data Display › Specialized displays › Map, and Charts › Choropleth map: GeoMap ── */
  var geoMap = { id: 'geo-map', lab: true, icon: 'pin', sec: 'data-display', sub: 'Specialized displays', leaf: 'Map', title: 'Map',
    plenix: 'GeoMap', src: 'charts/GeoMap.jsx', css: ['charts/geo-map.css'], blocks: ['plx-geo-map'], level: 'Component', interaction: 'Display',
    aliases: ['Geographic map', 'Location map', 'Region map', 'Marker map'],
    text: 'A map drawn from the app’s own geography: regions from GeoJSON (fitted to the frame, Mercator or plain longitude and latitude) as land in the sunken surface with outlines, and markers at places in a data-viz color. Zoom buttons and dragging move around; the wheel never zooms, so the page keeps scrolling. No tiles and no network: Plenix ships no geography. The sample regions on this page are a made-up layout, not a real place.',
    use: ['Where things are when location is the point: sites, assets, deliveries', 'The places also as a table (the frame’s data grid), with names and coordinates', 'Shapes kept with the app: a public-domain source such as Natural Earth, simplified'],
    avoid: ['Location that is incidental: show the address as text', 'Comparing regional values precisely: a table or bars', 'Capturing the page’s scroll for zoom', 'Markers in more than one color without a legend'],
    related: ['choropleth-map', 'chart-accessibility', 'chart-tooltip'],
    map: [[CAR, 'Spatial charts', 'Partial'], [HIG, 'Maps', 'Partial'], [MAT, 'Maps (Google Maps)', 'Partial']],
    variantPages: [
      vp('Outline map', 'Variant', 'Regions', { variant: 'outline' }, 'The regions as land in the sunken surface, outlined.', 'The frame for regions people pick or read', 'Values per region: the choropleth'),
      vp('Map with markers', 'Variant', 'Markers', { variant: 'markers' }, 'Places as dots in a data-viz color over the regions, each named in the tooltip and the table.', 'Sites, offices, deliveries', 'Hundreds of places: cluster them first')
    ],
    examples: [
      ['Variant', [
        ['Regions', function () { return box(640, h(P.GeoMap, { title: 'Sales regions (sample)', description: 'Nine made-up regions on a 3 by 3 layout.', features: REGIONS, size: 'md' })); }, 'plx-geo-map__region', 'features'],
        ['Markers', function () { return box(640, h(P.GeoMap, { title: 'Sites (sample)', description: 'Four sites: two in the north, one on the coast, one in the south.', features: REGIONS, markers: SITES, size: 'md' })); }, 'plx-geo-map__marker', 'markers']], { prop: 'variant' }]] };
  var choropleth = { id: 'choropleth-map', lab: true, icon: 'grid-3x2', sec: 'data-display', sub: 'Charts', leaf: 'Choropleth map', title: 'Choropleth map',
    plenix: 'GeoMap values', src: 'charts/GeoMap.jsx', css: ['charts/geo-map.css'], blocks: ['plx-geo-map'], variantClasses: [], level: 'Component', interaction: 'Display',
    aliases: ['Filled map', 'Heat map (geographic)', 'Shaded region map'],
    text: 'A map whose regions are shaded by a measure: GeoMap with values. Each region takes a step of the sequential data-viz scale (seven steps from the lowest value to the highest), or of the diverging scale around the middle for a change. The legend lists the steps and their ranges in the data font; a region without a value carries the no-data texture. The table lists every region with its value.',
    use: ['Rates and shares per region (normalized values), such as the share of active users', 'scale="diverging" for a change that goes both ways', 'A description that names the highest and lowest regions'],
    avoid: ['Raw counts that follow population: normalize, or markers sized by the count', 'Regions whose size distorts their weight: a bar chart of regions', 'Categorical colors for ordered values'],
    related: ['geo-map', 'dataviz-colors', 'chart-accessibility'],
    map: [[CAR, 'Choropleth map', 'Direct'], [SPE, 'Map (choropleth)', 'Partial']],
    variantPages: [
      vp('Sequential choropleth', 'Scale', 'Sequential (default)', { variant: 'sequential' }, 'Low to high in seven steps of one hue; regions without data textured.', 'Shares, rates and levels', 'A change around zero: diverging'),
      vp('Diverging choropleth', 'Scale', 'Diverging', { variant: 'diverging' }, 'Seven steps of two hues around the middle of the range.', 'Changes and differences that go both ways', 'Values that only grow: sequential')
    ],
    examples: [
      ['Scale', [
        ['Sequential (default)', function () { return box(640, h(P.GeoMap, { title: 'Share of active users by region (sample)', description: 'The northwest has the highest share (42%), the southwest the lowest (12%); the southeast has no data.', features: REGIONS, values: SHARE, format: pct, valueTitle: 'Active users', size: 'md' })); }, null, 'scale=' + q('sequential')],
        ['Diverging', function () { return box(640, h(P.GeoMap, { title: 'Change in active users by region (sample)', description: 'The northwest grew most (+6 points); the southwest fell most (−8 points).', features: REGIONS, values: CHANGE, scale: 'diverging', format: function (v) { return P.formatPercent(v, { decimals: 0, signed: true }); }, valueTitle: 'Change', size: 'md' })); }, null, 'scale=' + q('diverging')]], { prop: 'scale' }]] };

  return [chartA11y, sparkline, metricCard, lollipop, scatter, bubble, funnel, treemap, gantt, geoMap, choropleth];
});
