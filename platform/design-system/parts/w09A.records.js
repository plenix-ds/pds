/* Plenix design system · library part w09A (wave 9, lane A): the chart interaction (platform/charts/interaction.js:
   keyboard, pointer, tooltip, live region, legend toggles, brush and zoom) and the charts built on it: LineChart (Line
   chart, and its Step chart leaf), AreaChart, Gauge, HeatMap, WaterfallChart, WordCloud, NetworkGraph (Graph / network)
   and Diagram. Every color is an existing role or a data-viz step. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, box = H.box, row = H.row, use = H.use, q = H.q;
  var CAR = 'Carbon', FLU = 'Fluent 2', SPE = 'Spectrum', POL = 'Polaris', ATL = 'Atlassian', MAT = 'Material 3', HIG = 'Apple HIG';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var noop = function () {};

  /* ── the sample data ── */
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  var PLATFORMS = [{ id: 'web', label: 'Web' }, { id: 'ios', label: 'iOS' }, { id: 'android', label: 'Android' }];
  var SIGNUPS = MONTHS.map(function (m, i) { return { month: m, web: [120, 180, 150, 240, 310, 280, 300, 330][i], ios: [80, 95, 130, 160, 190, 230, 240, 250][i], android: [60, 70, 90, 110, 150, 170, 180, 200][i] }; });
  var GAPPY = SIGNUPS.map(function (r, i) { return Object.assign({}, r, { ios: i === 5 ? null : r.ios }); });
  var PRICES = [9, 9, 12, 12, 15, 15, 15, 18].map(function (v, i) { return { date: new Date(2026, i, 1), price: v }; });
  var LIMITS = [50, 50, 100, 100, 100, 250, 250, 250].map(function (v, i) { return { date: new Date(2026, i, 1), limit: v, used: [32, 41, 64, 80, 92, 140, 180, 210][i] }; });
  var STORAGE = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'].map(function (w, i) { return { week: w, video: [40, 46, 52, 61, 66, 74, 80, 92][i], images: [30, 32, 33, 36, 38, 39, 42, 44][i], documents: [12, 12, 13, 13, 14, 15, 15, 16][i] }; });
  var STORE_SERIES = [{ id: 'video', label: 'Video' }, { id: 'images', label: 'Images' }, { id: 'documents', label: 'Documents' }];
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], HOURS = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  var UPLOADS = DAYS.map(function (d, r) { return HOURS.map(function (x, c) { return r === 2 && c === 4 ? null : Math.round(20 + 30 * Math.sin((c + 1) / 3) + r * 4); }); });
  var EDITS = []; for (var i = 0; i < 140; i++) EDITS.push({ date: new Date(2026, 4, 3 + i), value: Math.max(0, ((i * 37) % 11) - (i % 7 === 0 || i % 7 === 6 ? 6 : 0)) });
  var REVENUE = [{ label: 'Last year', value: 820, total: true }, { label: 'New customers', value: 240 }, { label: 'Churn', value: -110 }, { label: 'Price change', value: -60 }, { label: 'Upsell', value: 90 }];
  var REVENUE_TOTALS = [{ label: 'Last year', value: 820, total: true }, { label: 'New customers', value: 240 }, { label: 'Churn', value: -110 }, { label: 'First half', total: true }, { label: 'Price change', value: -60 }, { label: 'Upsell', value: 90 }];
  var k = function (v) { return '$' + P.formatNumber(v) + 'K'; };
  var TERMS = 'search sharing folders tags export speed upload comments preview offline sync mobile versions permissions approvals metadata filters captions'.split(' ');
  var WORDS = TERMS.map(function (w, i) { return { text: w, value: Math.round(60 - i * 3.1), group: i % 3 ? 'ask' : 'praise' }; });
  var WORD_GROUPS = [{ id: 'praise', label: 'Praise' }, { id: 'ask', label: 'Requests' }];
  var GN = [['logo', 'Logo', 'asset'], ['palette', 'Palette', 'asset'], ['font', 'Typeface', 'asset'], ['photos', 'Product photos', 'asset'], ['spring', 'Spring campaign', 'campaign'], ['summer', 'Summer sale', 'campaign'], ['site', 'Website', 'channel'], ['email', 'Newsletter', 'channel']]
    .map(function (x) { return { id: x[0], label: x[1], group: x[2] }; });
  var GE = [['spring', 'logo'], ['spring', 'palette'], ['summer', 'logo'], ['summer', 'photos'], ['site', 'spring'], ['email', 'summer'], ['site', 'font'], ['email', 'font', 'reuses', 'dashed']]
    .map(function (x) { return { source: x[0], target: x[1], label: x[2], kind: x[3] }; });
  var GG = [{ id: 'asset', label: 'Assets' }, { id: 'campaign', label: 'Campaigns' }, { id: 'channel', label: 'Channels' }];
  var FN = [{ id: 'start', label: 'Upload a file', shape: 'terminal' }, { id: 'scan', label: 'Scan for problems' }, { id: 'check', label: 'Meets the rules?', shape: 'decision' }, { id: 'ok', label: 'Publish it' },
    { id: 'back', label: 'Return to the owner' }, { id: 'log', label: 'Write the audit log', shape: 'data' }, { id: 'end', label: 'Done', shape: 'terminal' }];
  var FE = [['start', 'scan'], ['scan', 'check'], ['check', 'ok', 'Yes'], ['check', 'back', 'No'], ['ok', 'log'], ['back', 'log'], ['log', 'end']].map(function (x) { return { source: x[0], target: x[1], label: x[2] }; });
  var BN = [{ id: 'app', label: 'Asset app', detail: 'React', group: 'web' }, { id: 'ds', label: 'Platform', detail: 'Components', group: 'web' }, { id: 'api', label: 'API', detail: 'Node', group: 'server' },
    { id: 'db', label: 'Database', detail: 'Postgres', group: 'server' }, { id: 'cdn', label: 'CDN', detail: 'Files', group: 'server' }];
  var BE = [['app', 'ds'], ['app', 'api'], ['api', 'db'], ['api', 'cdn']].map(function (x) { return { source: x[0], target: x[1] }; });
  var BG = [{ id: 'web', label: 'Web' }, { id: 'server', label: 'Server' }];

  var lines = function (o) { return h(P.LineChart, Object.assign({ title: 'Sign-ups by platform', description: 'Sign-ups grew on every platform from January to August; the web stays ahead.', data: SIGNUPS, x: 'month', series: PLATFORMS, yLabel: 'Sign-ups', margin: { start: 56, bottom: 44 } }, o)); };
  var oneLine = function (o) { return h(P.LineChart, Object.assign({ title: 'Web sign-ups per month', description: 'Web sign-ups peaked at 330 in August.', data: SIGNUPS, x: 'month', series: [PLATFORMS[0]] }, o)); };
  var Selecting = function () {
    var s = use(null);
    return h(P.Stack, { gap: 'sm' }, lines({ onSelect: function (x) { s[1](x.row.month + ' · ' + x.series.label); } }), h(P.Text, { variant: 'secondary' }, s[0] ? 'Selected: ' + s[0] : 'Click a point, or press Enter on one.'));
  };

  /* ── 07 Data Display › Charts › Chart interaction: useChartInteraction and ChartFrame's interaction ── */
  var chartInteraction = { id: 'chart-interaction', lab: true, icon: 'select', sec: 'data-display', sub: 'Charts', leaf: 'Chart interaction', title: 'Chart interaction',
    plenix: 'useChartInteraction, ChartFrame interaction, ChartFocusMark, ChartBrush, chartAnnounce, chartTooltipText', src: 'charts/interaction.ts', also: ['charts/ChartFrame.tsx', 'charts/parts/ChartTooltip.tsx'], css: ['charts/chart-interaction.css'],
    level: 'Foundation', interaction: 'Navigation',
    aliases: ['Chart keyboard navigation', 'Crosshair', 'Hover tooltip', 'Brush', 'Zoom', 'Legend toggle', 'Drill down', 'Point selection'],
    text: 'How people explore every Plenix chart. The plot is one Tab stop: the arrow keys move between the values (columns across, series or rows up and down). The value in focus or under the pointer shows the chart tooltip and is said in the live region; a crosshair follows lines and areas. A click or Enter selects a value. Legend toggles show and hide series (the last one stays). A brush (a drag, or Shift with the arrow keys and Enter) zooms to a range; Reset zoom above the plot brings everything back. While one value is active in a chart of points, the other series step back. The chart keeps its geometry and the interaction keeps indices, so a resize or a zoom never loses the value in focus.',
    use: ['Every chart with more than a handful of values: the Plenix charts are interactive by default', 'describe() that says what the tooltip shows (chartTooltipText), so the screen and the live region never differ',
      'zoom on long time series; select when a value opens something (a day, a record)', 'Legend toggles to compare a few of several series'],
    avoid: ['Information that exists only on hover: the description and the data table carry it too', 'Zoom or drill-down on small static charts', 'A second Tab stop per point: one stop per chart, the arrow keys inside it',
      'Animated transitions that ignore reduced motion: the dimming uses the motion tokens'],
    related: ['chart-tooltip', 'chart-legend', 'chart-foundations', 'line-chart', 'live-regions'],
    map: [[CAR, 'Legends (interaction) and zoom bar', 'Direct'], [FLU, 'Charts interaction', 'Partial'], [SPE, 'Chart interactivity', 'Partial'], [POL, 'Polaris Viz (tooltips, legends)', 'Partial'], [HIG, 'Charts (selection, audio graphs)', 'Partial']],
    states: [['Rest', 'The plot with a transparent border; no tooltip', 'The default'], ['Focus', 'The plot’s border takes the focus color (no outer ring); the first arrow key shows the first value', ':focus-visible'],
      ['Active value', 'The tooltip, the crosshair (lines and areas) and a dot on the value; in a chart of points the other series step back', 'plx-chart__plot--dimming, plx-chart-focus'],
      ['Selected', 'The selected mark keeps an outline in the strong content color', 'plx-chart-selected'], ['Marking a range', 'The brush shades the range down the plot', 'plx-chart-brush'],
      ['Zoomed', 'The axis shows the range only; Reset zoom above the plot', 'ChartFrame actions']],
    variantPages: [
      vp('Hover crosshair', 'Behavior', 'Crosshair and tooltip', { variant: 'crosshair' }, 'The pointer or the arrow keys move a crosshair along the values; the shared tooltip lists every series at that x and the live region says it.', 'Line and area charts', 'Charts of single marks: the single tooltip on the mark'),
      vp('Brush and zoom', 'Behavior', 'Brush and zoom', { variant: 'brush' }, 'A drag (or Shift with the arrow keys) marks a range; releasing it (or Enter) zooms to it; Reset zoom shows everything again.', 'Long time series read at two scales', 'Short series: everything fits'),
      vp('Legend toggle', 'Behavior', 'Legend toggles', { variant: 'legend' }, 'Each legend item is a toggle button that shows or hides its series; the axis follows the series shown and the change is announced.', 'Comparing two or three of several series', 'A stack whose total matters: hiding a part changes it'),
      vp('Click a point', 'Behavior', 'Select a value', { variant: 'select' }, 'A click or Enter selects the value in focus; it keeps an outline and onSelect opens what it stands for.', 'A value that opens something: a day, a record, a filter', 'Charts where a click does nothing: leave select off')
    ],
    examples: [
      ['Behavior', [
        ['Crosshair and tooltip', function () { return box(720, lines()); }, null, 'interactive'],
        ['Brush and zoom', function () { return box(720, lines({ zoom: true, description: 'Drag across the plot, or press Shift with the arrow keys and then Enter, to zoom.' })); }, null, 'zoom'],
        ['Legend toggles', function () { return box(720, lines({ description: 'Hide a platform with its legend toggle.' })); }, null, 'legend'],
        ['Select a value', function () { return box(720, h(Selecting)); }, null, 'onSelect']], { prop: 'behavior' }],
      ['Points: one value at a time, the other cells step back (a heat map)', function () { return box(720, h(P.HeatMap, { title: 'Uploads by hour', description: 'Most uploads arrive on weekday mornings.', rows: DAYS, columns: HOURS, values: UPLOADS, valueLabel: 'Uploads' })); }],
      ['Your own chart: useChartInteraction with ChartFrame', function () {
        return box(560, h(function Own() {
          var vals = [120, 180, 150, 240, 310, 280];
          var ia = P.useChartInteraction({ columns: 6, describe: function (c) { return P.chartTooltipText({ title: MONTHS[c.c], items: [{ label: 'Web', value: P.formatNumber(vals[c.c]) }] }); } });
          return h(P.ChartFrame, { title: 'Web sign-ups', description: 'Columns with the interaction wired in by hand.', interaction: ia, table: { columns: [{ title: 'Month', field: 'm', kind: 'name', rowLabel: true }, { title: 'Web', field: 'v', kind: 'data', align: 'right' }], data: vals.map(function (v, i) { return { id: i + 1, m: MONTHS[i], v: v }; }) } }, function (d) {
            var x = P.scaleBand({ domain: MONTHS.slice(0, 6), range: [0, d.inner.width] }), y = P.scaleLinear({ domain: [0, 320], range: [d.inner.height, 0], nice: true });
            ia.register({ nearest: function (px) { var c = Math.min(5, Math.max(0, Math.floor(px / x.step()))); return { r: 0, c: c }; } });
            var a = ia.active;
            return h('g', null, h(P.GridLines, { scale: y, inner: d.inner }),
              vals.map(function (v, i) { return h('rect', { key: i, className: 'plx-chart__mark plx-chart-dim' + (a && a.c !== i ? ' plx-chart-dim--off' : ''), 'data-plx-dataviz': P.seriesColor(0), x: x(MONTHS[i]), y: y(v), width: x.bandwidth(), height: d.inner.height - y(v) }); }),
              h(P.Axis, { scale: y, orient: 'left', inner: d.inner, margin: d.margin }), h(P.Axis, { scale: x, orient: 'bottom', inner: d.inner, margin: d.margin }),
              a ? h(P.ChartTooltip, { x: P.scalePosition(x, MONTHS[a.c]), y: y(vals[a.c]), inner: d.inner, title: MONTHS[a.c], items: [{ label: 'Web', value: P.formatNumber(vals[a.c]), color: P.seriesColor(0) }] }) : null);
          });
        }));
      }]] };

  /* ── 07 Data Display › Charts › Line chart: LineChart ── */
  var lineChart = { id: 'line-chart', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Line chart', title: 'Line chart',
    plenix: 'LineChart', src: 'charts/LineChart.tsx', css: ['charts/line-chart.css'], blocks: ['plx-line-chart'], level: 'Component', interaction: 'Navigation', statesFrom: ['chart-interaction'],
    aliases: ['Line graph', 'Trend chart', 'Time series', 'Multi-line chart'],
    text: 'Lines through each series’ values over an ordered range, usually time, in ChartFrame with the value axis, the category or time axis, grid lines and the data table. Up to about five series take the categorical data-viz colors in their order, with an interactive legend. Points mark the values when there are few or the moments matter. A missing value is a gap, never a line across it. Interactive by default: one Tab stop, a crosshair with the shared tooltip under the pointer or the arrow keys, each value said in the live region, and an optional brush to zoom.',
    use: ['Change over time or another continuous measure', 'Comparing the trends of two to five series', 'zero={false} when the trend matters more than the size, said in the description', 'An overlay for a target or a threshold (ReferenceLine), a note on an outlier (ChartAnnotation)'],
    avoid: ['Unordered categories: a bar or column chart', 'More than about five series: small multiples', 'Lines drawn across missing values', 'Values that hold between changes: the step chart'],
    related: ['area-chart', 'step-chart', 'chart-interaction', 'chart-legend', 'chart-tooltip'],
    map: [[CAR, 'Line', 'Direct'], [FLU, 'Line chart', 'Direct'], [SPE, 'Line chart', 'Direct'], [POL, 'Line chart', 'Direct'], [HIG, 'Charts (LineMark)', 'Direct'], ['Frappe', 'Frappe Charts line chart', 'Direct']],
    variantPages: [
      vp('Single line', 'Variant', 'Line', { variant: 'line' }, 'One series: no legend (the title names it), the crosshair with a single value.', 'One measure over time', 'Several series: the multi-series chart'),
      vp('Multi-series line chart', 'Variant', 'Multiple series', { variant: 'multi' }, 'Two to five lines in the categorical colors, an interactive legend, the shared tooltip listing every series at that x.', 'Comparing trends', 'More than five lines'),
      vp('Line chart with points', 'Variant', 'With points', { variant: 'points' }, 'A point on every value, in the series’ color with a ring of the surface.', 'Few values, or when each moment matters', 'Dense series: points crowd the line')
    ],
    examples: [
      ['Variant', [
        ['Line', function () { return box(720, oneLine()); }, null, 'LineChart'],
        ['Multiple series', function () { return box(720, lines()); }, null, 'series'],
        ['With points', function () { return box(720, oneLine({ points: true, data: SIGNUPS.slice(0, 6), description: 'Six values, each marked.' })); }, null, 'points']], { prop: 'variant' }],
      ['A missing value is a gap (iOS in June)', function () { return box(720, lines({ data: GAPPY, description: 'iOS sign-ups were not counted in June.' })); }],
      ['Time on the x axis, a target overlay and zoom', function () {
        return box(720, h(P.LineChart, { title: 'Storage used', description: 'Use passed the warning level in July.', data: LIMITS, x: 'date', series: [{ id: 'used', label: 'Used (GB)' }], zoom: true, points: true,
          overlay: function (o) { return h(P.ReferenceLine, { kind: 'threshold', scale: o.y, value: 200, inner: o.inner, label: 'Warning' }); } }));
      }]] };

  /* ── 07 Data Display › Charts › Step chart: LineChart curve="step" ── */
  var stepChart = { id: 'step-chart', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Step chart', title: 'Step chart', purpose: 'Shows values that change at moments and hold in between, such as prices, plans or limits.',
    plenix: 'LineChart curve="step"', src: 'charts/LineChart.tsx', css: ['charts/line-chart.css'], level: 'Component', interaction: 'Navigation', statesFrom: ['chart-interaction'], docsFrom: 'line-chart', variantClasses: [],
    aliases: ['Step line', 'Staircase chart', 'Step-after line'],
    text: 'A line chart whose lines hold each value until the next change, then jump: prices, plans, limits, stock levels. It is LineChart with curve="step": step="after" (the default) changes at the next value, step="before" at this one. Points mark the moments of change.',
    use: ['Values that change at moments and hold in between: pricing tiers, quotas, inventory', 'points to mark each change', 'Saying in the description whether a step changes at the start or the end of a period'],
    avoid: ['Continuous measures: a straight line chart', 'Categories: a bar chart', 'Steps across missing values'],
    related: ['line-chart', 'area-chart', 'chart-interaction'],
    map: [[CAR, 'Step', 'Direct'], [HIG, 'Charts (LineMark .stepEnd)', 'Partial']],
    variantPages: [
      vp('Step chart', 'Variant', 'Step after (default)', { variant: 'step' }, 'Each value holds until the next one; the jump is at the next value.', 'Prices and limits that change on a date', 'Smooth trends'),
      vp('Step before', 'Variant', 'Step before', { variant: 'step-before' }, 'The jump is at the value itself; the value holds back to the one before.', 'Values that apply up to the moment they are recorded', 'Most step data: step after')
    ],
    examples: [
      ['Variant', [
        ['Step after (default)', function () { return box(720, h(P.LineChart, { title: 'Price per seat', description: 'The price rose three times this year, to $18 in August.', data: PRICES, x: 'date', series: [{ id: 'price', label: 'Price' }], curve: 'step', points: true, format: function (v) { return '$' + v; } })); }, null, 'curve=' + q('step')],
        ['Step before', function () { return box(720, h(P.LineChart, { title: 'Price per seat', description: 'Each price applies up to its date.', data: PRICES, x: 'date', series: [{ id: 'price', label: 'Price' }], curve: 'step', step: 'before', points: true, format: function (v) { return '$' + v; } })); }, null, 'step=' + q('before')]], { prop: 'step' }],
      ['Two series: the plan’s limit and the storage used', function () { return box(720, h(P.LineChart, { title: 'Plan limit and storage used', description: 'Upgrades raised the limit before use reached it.', data: LIMITS, x: 'date', series: [{ id: 'limit', label: 'Limit (GB)' }, { id: 'used', label: 'Used (GB)' }], curve: 'step' })); }]] };

  /* ── 07 Data Display › Charts › Area chart: AreaChart ── */
  var areaChart = { id: 'area-chart', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Area chart', title: 'Area chart',
    plenix: 'AreaChart', src: 'charts/AreaChart.tsx', css: ['charts/line-chart.css'], blocks: ['plx-area-chart'], level: 'Component', interaction: 'Navigation', statesFrom: ['chart-interaction'],
    aliases: ['Stacked area chart', '100% area chart', 'Volume chart'],
    text: 'A line chart filled down to the zero baseline, to show a volume over time. Plain: one or two areas, see-through where they overlap. Stacked: each series sits on the one before it, so the top edge is the total. Percent: the stack fills 100% and the areas are the shares (the tooltip gives the share and the value). Built on LineChart: the same axes, table and interaction.',
    use: ['A volume or a total over time', 'stack="stacked" for parts that add up to a total, the most stable part first (at the bottom)', 'stack="percent" for how the shares change, not the total'],
    avoid: ['More than two overlapping areas without a stack: a line chart', 'Comparing the inner series of a stack exactly: lines', 'A value axis that does not start at zero'],
    related: ['line-chart', 'chart-interaction', 'chart-legend'],
    map: [[CAR, 'Area (simple, stacked)', 'Direct'], [FLU, 'Area chart', 'Direct'], [SPE, 'Area chart', 'Direct'], [POL, 'Stacked area chart', 'Variant'], [HIG, 'Charts (AreaMark)', 'Direct'], ['Frappe', 'Frappe Charts line chart (region fill)', 'Partial']],
    variantPages: [
      vp('Area chart', 'Stack', 'Area', { variant: 'area' }, 'Each area from zero, see-through where they overlap.', 'One or two series', 'Three or more overlapping areas'),
      vp('Stacked area chart', 'Stack', 'Stacked', { variant: 'stacked' }, 'Series on top of each other; the top edge is their total.', 'Parts of a total over time', 'Parts that must be compared exactly'),
      vp('Percent area chart', 'Stack', 'Percent', { variant: 'percent' }, 'The stack fills 100%: the areas are the shares; the axis and the tooltip in percent.', 'How the mix changes over time', 'When the total matters: stacked')
    ],
    examples: [
      ['Stack', [
        ['Area', function () { return box(720, h(P.AreaChart, { title: 'Active users', description: 'Web use grew faster than iOS.', data: SIGNUPS, x: 'month', series: PLATFORMS.slice(0, 2) })); }, null, 'stack=' + q('none')],
        ['Stacked', function () { return box(720, h(P.AreaChart, { title: 'Storage by file type', description: 'Video takes most of the growth.', data: STORAGE, x: 'week', series: STORE_SERIES, stack: 'stacked', yLabel: 'Storage (GB)', margin: { start: 56 } })); }, 'plx-area-chart--stacked', 'stack=' + q('stacked')],
        ['Percent', function () { return box(720, h(P.AreaChart, { title: 'Share of sign-ups by platform', description: 'The web’s share stays near half.', data: SIGNUPS, x: 'month', series: PLATFORMS, stack: 'percent' })); }, 'plx-area-chart--stacked', 'stack=' + q('percent')]], { prop: 'stack' }]] };

  /* ── 07 Data Display › Charts › Gauge: Gauge ── */
  var pct = function (v) { return v + '%'; };
  var THRESH = [{ value: 80, level: 'warning', label: 'Nearly full' }, { value: 95, level: 'critical', label: 'Full' }];
  var gauge = { id: 'gauge', lab: true, icon: 'progress', sec: 'data-display', sub: 'Charts', leaf: 'Gauge', title: 'Gauge',
    plenix: 'Gauge', src: 'charts/Gauge.tsx', css: ['charts/gauge.css'], blocks: ['plx-gauge'], level: 'Component', interaction: 'Static',
    aliases: ['Meter', 'Dial', 'Radial gauge', 'Speedometer'],
    text: 'One value inside a known range: a semicircle track filled up to the value, with the minimum and maximum at the ends. The value sits in the middle in the data font, with a few words under it. With thresholds, the warning and critical ranges run along the outside of the track in the data-viz alert colors, and a status badge names the range the value is in. Assistive technology reads it as a meter (role meter): its value text says the value, its label and the range.',
    use: ['One value with a known minimum and maximum: storage, a quota, a score', 'A headline indicator, one or two on a dashboard', 'Thresholds with names, so the badge says what the color means'],
    avoid: ['Several gauges to compare values: a bar or bullet chart', 'A value without a range: a metric', 'Status shown by color alone: the badge names it'],
    related: ['progress-bar', 'metric', 'chart-threshold', 'dataviz-colors'],
    map: [[CAR, 'Gauge', 'Direct'], [CAR, 'Meter', 'Variant'], [FLU, 'Gauge chart', 'Direct'], [SPE, 'Meter', 'Partial'], [HIG, 'Gauges', 'Direct']],
    variantPages: [
      vp('Semicircle gauge', 'Variant', 'Semicircle', { variant: 'semicircle' }, 'The track, the fill to the value, the value and its label in the middle, the ends under the arc.', 'One value in a range', 'Values without a range'),
      vp('Gauge with thresholds', 'Variant', 'With thresholds', { variant: 'thresholds' }, 'Warning and critical ranges outside the track, and a status badge naming the range the value is in.', 'Limits people act on: storage, quotas', 'Ranges without a name'),
      vp('Small gauge', 'Size', 'Small', { size: 'sm' }, 'A 160px dial for a card.', 'Dashboard cards', 'The page’s main figure'),
      vp('Large gauge', 'Size', 'Large', { size: 'lg' }, 'A 240px dial for the page’s main figure.', 'A status page’s headline', 'Cards: small')
    ],
    examples: [
      ['Variant', [
        ['Semicircle', function () { return h(P.Gauge, { title: 'Storage used', value: 72, format: pct, label: 'of 100 GB' }); }, null, 'Gauge'],
        ['With thresholds', function () { return h(P.Gauge, { title: 'Storage used', description: 'Storage is nearly full.', value: 86, format: pct, label: 'of 100 GB', thresholds: THRESH }); }, 'plx-gauge--thresholds', 'thresholds']], { prop: 'variant' }],
      ['Size', [
        ['Small', function () { return h(P.Gauge, { title: 'Seats used', value: 38, max: 50, label: 'of 50 seats', size: 'sm' }); }, 'plx-gauge--sm', 'size=' + q('sm')],
        ['Medium (default)', function () { return h(P.Gauge, { title: 'Seats used', value: 38, max: 50, label: 'of 50 seats' }); }, 'plx-gauge--md', 'size=' + q('md')],
        ['Large', function () { return h(P.Gauge, { title: 'Seats used', value: 38, max: 50, label: 'of 50 seats', size: 'lg' }); }, 'plx-gauge--lg', 'size=' + q('lg')]], { prop: 'size' }],
      ['Over the critical threshold, and a range under every threshold named (strings.ok)', function () { return row(h(P.Gauge, { title: 'API quota', value: 97, format: pct, thresholds: THRESH }), h(P.Gauge, { title: 'API quota', value: 42, format: pct, thresholds: THRESH, strings: { ok: 'Healthy' } })); }]] };

  /* ── 07 Data Display › Charts › Heat map: HeatMap ── */
  var heatMap = { id: 'heat-map', lab: true, icon: 'grid-3x2', sec: 'data-display', sub: 'Charts', leaf: 'Heat map', title: 'Heat map',
    plenix: 'HeatMap', src: 'charts/HeatMap.jsx', css: ['charts/heat-map.css'], blocks: ['plx-heat-map', 'plx-heat-map-scale'], level: 'Component', interaction: 'Navigation', statesFrom: ['chart-interaction'],
    aliases: ['Heatmap', 'Matrix chart', 'Calendar heat map', 'Contribution graph', 'Punch card'],
    text: 'A grid of cells colored by value: where a row and a column meet (matrix), or one cell per day laid out in weeks (calendar). The colors come from the sequential data-viz scale, or the diverging one around a midpoint. A missing value is an empty cell with a dashed edge, never the lowest color. The color scale under the plot shows the seven steps from the lowest value to the highest. The arrow keys move from cell to cell; the tooltip shows each cell’s value and the live region says it.',
    use: ['Patterns across two dimensions: hour by weekday, team by month', 'The calendar for activity over days and weeks', 'The diverging scale around a meaningful midpoint (change, difference from a target)'],
    avoid: ['Exact values: a table', 'A categorical palette: the sequential or diverging scale', 'Missing values in the lowest color'],
    related: ['dataviz-colors', 'chart-interaction', 'calendar-view'],
    map: [[CAR, 'Heatmap', 'Direct'], [FLU, 'Heat map chart', 'Direct'], [SPE, 'Heat map', 'Partial'], [HIG, 'Charts (RectangleMark)', 'Partial'], ['Frappe', 'Frappe Charts heatmap', 'Direct']],
    variantPages: [
      vp('Matrix heat map', 'Variant', 'Matrix', { variant: 'matrix' }, 'Rows by columns with their names on the axes.', 'Two categorical or time dimensions', 'One dimension: a bar chart'),
      vp('Calendar heat map', 'Variant', 'Calendar', { variant: 'calendar' }, 'A column per week, a row per weekday, month names on top, weekday names on the start side.', 'Daily activity over months', 'Hourly data: the matrix')
    ],
    examples: [
      ['Variant', [
        ['Matrix', function () { return box(720, h(P.HeatMap, { title: 'Uploads by hour', description: 'Most uploads arrive on weekday mornings; Wednesday at noon was not counted.', rows: DAYS, columns: HOURS, values: UPLOADS, valueLabel: 'Uploads' })); }, 'plx-heat-map--matrix', 'variant=' + q('matrix')],
        ['Calendar', function () { return box(720, h(P.HeatMap, { variant: 'calendar', title: 'Daily edits', description: 'Edits are steady on weekdays and quiet on weekends.', data: EDITS, valueLabel: 'Edits' })); }, 'plx-heat-map--calendar', 'variant=' + q('calendar')]], { prop: 'variant' }],
      ['Diverging scale around zero', function () {
        var change = DAYS.map(function (d, r) { return HOURS.map(function (x, c) { return Math.round(10 * Math.sin((c + r) / 2)); }); });
        return box(720, h(P.HeatMap, { title: 'Change in uploads from last week', description: 'Mornings rose; afternoons fell.', rows: DAYS, columns: HOURS, values: change, scale: 'diverging', valueLabel: 'Change', format: function (v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v); } }));
      }]] };

  /* ── 07 Data Display › Charts › Waterfall: WaterfallChart ── */
  var waterfall = { id: 'waterfall-chart', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Waterfall', title: 'Waterfall',
    plenix: 'WaterfallChart, waterfallSteps', src: 'charts/WaterfallChart.tsx', css: ['charts/waterfall-chart.css'], blocks: ['plx-waterfall-chart'], level: 'Component', interaction: 'Navigation', statesFrom: ['chart-interaction'],
    variantClasses: ['plx-waterfall-chart--subtotals'],
    aliases: ['Waterfall chart', 'Bridge chart', 'Variance chart', 'Cascade chart'],
    text: 'How a starting total becomes an end total through increases and decreases. Totals are columns from zero; each change floats from the running total before it, with its signed value above it (+240, −110) and a dashed connector to the next. Increases, decreases and totals each have their own color, named in the legend. With totals, subtotal columns show the running total part way.',
    use: ['Breaking down a change: revenue from last year to this year, a budget variance', 'Steps in a logical or largest-first order', 'Subtotals at natural breaks: a step marked as a total with no amount, so the chart shows the running total there.'],
    avoid: ['Unrelated values: a bar chart', 'More than about ten steps: group the small ones', 'Colors without signs: the labels carry + and −'],
    related: ['chart-data-label', 'chart-interaction', 'dataviz-colors'],
    map: [[CAR, 'Simple charts (waterfall: general practice)', 'Partial'], [FLU, 'Charts', 'Partial'], [POL, 'Polaris Viz (bar chart)', 'Partial']],
    variantPages: [
      vp('Waterfall chart', 'Variant', 'Start to end', { variant: 'default' }, 'A start total, the changes, and the end total added after them.', 'One change explained step by step', 'Unrelated amounts'),
      vp('Waterfall with totals', 'Variant', 'With totals', { variant: 'totals' }, 'Subtotal columns part way show the running total at a break (a half year, a quarter).', 'Long bridges with natural breaks', 'Short bridges: the end total is enough')
    ],
    examples: [
      ['Variant', [
        ['Start to end', function () { return box(720, h(P.WaterfallChart, { title: 'Revenue, last year to this year', description: 'New customers made up for churn and the price change.', data: REVENUE, endLabel: 'This year', format: k, margin: { start: 56 } })); }, null, 'WaterfallChart'],
        ['With totals', function () { return box(720, h(P.WaterfallChart, { title: 'Revenue, last year to this year', description: 'Revenue passed $950K by the first half.', data: REVENUE_TOTALS, endLabel: 'This year', format: k, margin: { start: 56 } })); }, 'plx-waterfall-chart--subtotals', 'total']], { prop: 'variant' }]] };

  /* ── 07 Data Display › Charts › Word cloud: WordCloud ── */
  var wordCloud = { id: 'word-cloud', lab: true, icon: 'text-card', sec: 'data-display', sub: 'Charts', leaf: 'Word cloud', title: 'Word cloud',
    plenix: 'WordCloud, wordCloudLayout', src: 'charts/WordCloud.jsx', css: ['charts/word-cloud.css'], blocks: ['plx-word-cloud'], level: 'Component', interaction: 'Navigation', statesFrom: ['chart-interaction'],
    aliases: ['Tag cloud', 'Term cloud', 'Text cloud'],
    text: 'The main terms of a body of text, each sized by how often it appears (five steps of the type scale) and placed around the middle, largest first, on a round or a square spiral. Words stay horizontal; groups such as praise and requests take the categorical colors, with a legend. A first impression only: the table under it lists every term and its count, sorted, and onSelect lets a word filter a list.',
    use: ['A first look at free text: feedback, search terms, tags', 'The top 50 terms or fewer', 'onSelect to open the items that use a word'],
    avoid: ['Comparing counts: a sorted bar chart', 'Decisions on the cloud alone', 'Rotated words'],
    related: ['chart-interaction', 'tag', 'chart-legend'],
    map: [[CAR, 'Word cloud', 'Direct']],
    variantPages: [
      vp('Spiral word cloud', 'Layout', 'Spiral', { variant: 'spiral' }, 'A round cloud: the largest word in the middle, the rest on a spiral around it.', 'Most clouds', 'Wide, short plots: the rectangular layout fills them better'),
      vp('Rectangular word cloud', 'Layout', 'Rectangular', { variant: 'rectangular' }, 'A square spiral: a boxier cloud that fills a wide plot.', 'Wide panels and banners', 'Small square cards')
    ],
    examples: [
      ['Layout', [
        ['Spiral', function () { return box(720, h(P.WordCloud, { title: 'What people asked for', description: 'Search and sharing lead the feedback.', words: WORDS, groups: WORD_GROUPS, valueLabel: 'Mentions', onSelect: noop })); }, 'plx-word-cloud--spiral', 'layout=' + q('spiral')],
        ['Rectangular', function () { return box(720, h(P.WordCloud, { title: 'What people asked for', description: 'Search and sharing lead the feedback.', words: WORDS, layout: 'rectangular', valueLabel: 'Mentions' })); }, 'plx-word-cloud--rectangular', 'layout=' + q('rectangular')]], { prop: 'layout' }]] };

  /* ── 07 Data Display › Specialized displays › Graph / network: NetworkGraph ── */
  var networkGraph = { id: 'network-graph', lab: true, icon: 'share', sec: 'data-display', sub: 'Specialized displays', leaf: 'Graph / network', title: 'Graph / network',
    plenix: 'NetworkGraph, forceLayout, layeredLayout, graphLayers, graphNeighbors, useGraphView', src: 'charts/NetworkGraph.jsx', css: ['charts/network-graph.css'], blocks: ['plx-network-graph'], level: 'Component', interaction: 'Navigation', statesFrom: ['chart-interaction'],
    aliases: ['Network diagram', 'Node-link diagram', 'Relationship graph', 'Dependency graph', 'Lineage graph'],
    text: 'Nodes joined by edges, to show how items connect: dependencies, lineage, the campaigns that use an asset. A force layout lets the structure find its shape; the hierarchical layout arranges it in layers from the roots. Edges can be directed (an arrowhead), labeled, and dashed for a second kind of link. Zoom in, Zoom out and Fit sit above the plot (+ − 0 on the keyboard); dragging the background pans. One Tab stop: the arrow keys follow the edges. The node in focus and its neighbors stand out while the rest step back, and the live region says the node and what it is connected to.',
    use: ['Exploring relationships, dependencies and lineage', 'Groups in the categorical colors, with a legend', 'The table of nodes and connections as the graph’s text alternative'],
    avoid: ['Strict hierarchies: a tree view', 'Hundreds of nodes at once: filter or cluster first', 'Edge kinds shown by color alone: dashes and labels'],
    related: ['diagram', 'chart-interaction', 'tree-view'],
    map: [[CAR, 'Network diagram', 'Direct'], [SPE, 'Graph', 'Partial']],
    variantPages: [
      vp('Force layout', 'Layout', 'Force', { variant: 'force' }, 'Connected nodes pull together, all nodes push apart; the same data always draws the same graph.', 'Networks without a top or a start', 'Flows with a direction: hierarchical'),
      vp('Hierarchical graph', 'Layout', 'Hierarchical', { variant: 'hierarchical' }, 'Layers from the roots, down or to the right, each layer ordered by its parents.', 'Dependencies and lineage', 'Networks with many cycles'),
      vp('Zoom and pan', 'Behavior', 'Zoom and pan', { variant: 'zoom' }, 'Zoom in, Zoom out and Fit above the plot; + − 0 on the keyboard; a drag of the background pans.', 'Graphs too dense to read whole', 'Small graphs: zoomable={false}')
    ],
    examples: [
      ['Layout', [
        ['Force', function () { return box(720, h(P.NetworkGraph, { title: 'Where the brand assets are used', description: 'The logo is used by both campaigns; the newsletter reuses the typeface.', nodes: GN, edges: GE, groups: GG, directed: true })); }, 'plx-network-graph--force', 'layout=' + q('force')],
        ['Hierarchical', function () { return box(720, h(P.NetworkGraph, { title: 'Where the brand assets are used', description: 'Channels lead to campaigns, campaigns to assets.', nodes: GN, edges: GE, groups: GG, directed: true, layout: 'hierarchical' })); }, 'plx-network-graph--hierarchical', 'layout=' + q('hierarchical')]], { prop: 'layout' }],
      ['Behavior', [['Zoom and pan', function () { return box(720, h(P.NetworkGraph, { title: 'Where the brand assets are used', description: 'Zoom with the buttons or + and −; drag the background to pan.', nodes: GN, edges: GE, groups: GG, directed: true, onSelect: noop })); }, null, 'zoomable']]],
      ['Left to right, undirected', function () { return box(720, h(P.NetworkGraph, { title: 'Related collections', description: 'Collections that share assets.', nodes: GN, edges: GE, groups: GG, layout: 'hierarchical', direction: 'right', size: 'md' })); }]] };

  /* ── 07 Data Display › Specialized displays › Diagram: Diagram ── */
  var diagram = { id: 'diagram', lab: true, icon: 'merge', sec: 'data-display', sub: 'Specialized displays', leaf: 'Diagram', title: 'Diagram',
    plenix: 'Diagram', src: 'charts/Diagram.jsx', css: ['charts/diagram.css'], blocks: ['plx-diagram'], level: 'Component', interaction: 'Navigation', statesFrom: ['chart-interaction'],
    aliases: ['Flowchart', 'Flow diagram', 'Boxes and arrows', 'Process diagram', 'Architecture diagram'],
    text: 'Shapes joined by connectors that explain a process, a system or a structure. Flowchart: a step is a box, a decision a diamond with labeled branches, the start and end are pills, data is a slanted box. Boxes and arrows: every node is a box with a title and a line, inside its group. Laid out in layers in one reading direction, drawn at its own size (smaller only in a narrow container). Interactive: the arrow keys walk the flow and the live region says each step and where it leads. Read-only: a picture with its steps as a table.',
    use: ['Workflows, approval paths, architectures', 'Labels that start with a verb; the same shape for the same meaning', 'The table of steps as the diagram’s text alternative'],
    avoid: ['Data values: a chart', 'A few steps in order: a numbered list', 'Two reading directions in one diagram', 'Color as meaning: the shapes and labels carry it'],
    related: ['network-graph', 'chart-interaction', 'progress-steps'],
    map: [[CAR, 'Flow charts (tree and network diagrams)', 'Partial']],
    variantPages: [
      vp('Flowchart', 'Variant', 'Flowchart', { variant: 'flowchart' }, 'Shapes by meaning (step, decision, start or end, data), connectors with branch labels.', 'Processes and decisions', 'Systems without a flow: boxes and arrows'),
      vp('Boxes and arrows', 'Variant', 'Boxes and arrows', { variant: 'boxes' }, 'Boxes with a title and a line, inside their groups, joined by arrows.', 'Architectures and structures', 'Decisions: the flowchart'),
      vp('Read-only diagram', 'Variant', 'Read-only', { variant: 'read-only' }, 'No Tab stop and no zoom buttons: a picture with its steps in the table.', 'Explanations inside a document', 'Large diagrams people need to explore')
    ],
    examples: [
      ['Variant', [
        ['Flowchart', function () { return box(720, h(P.Diagram, { title: 'How an upload is approved', description: 'Every upload is checked; rejected ones go back to the owner.', nodes: FN, edges: FE })); }, 'plx-diagram--flowchart', 'variant=' + q('flowchart')],
        ['Boxes and arrows', function () { return box(720, h(P.Diagram, { title: 'How the asset app is built', description: 'The app talks to the API, which keeps files on the CDN.', variant: 'boxes', direction: 'right', nodes: BN, edges: BE, groups: BG })); }, 'plx-diagram--boxes', 'variant=' + q('boxes')],
        ['Read-only', function () { return box(720, h(P.Diagram, { title: 'How an upload is approved', description: 'Every upload is checked; rejected ones go back to the owner.', nodes: FN, edges: FE, direction: 'right', interactive: false })); }, 'plx-diagram--read-only', 'interactive={false}']], { prop: 'variant' }]] };

  return [chartInteraction, lineChart, stepChart, areaChart, gauge, heatMap, waterfall, wordCloud, networkGraph, diagram];
});
