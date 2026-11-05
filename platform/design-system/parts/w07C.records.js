/* Plenix design system · library part w07C (wave 7, lane C): the chart foundations (platform/charts: scales, ChartFrame),
   TimeZoneSelect (Time-zone selector), TreeSelect (Tree select), TransferList (Transfer list, and the duplicate leaf Dual
   listbox), BottomSheetNav (Bottom-sheet navigation) and the mobile forms of NavPane (Bottom navigation; Mobile tab bar,
   Mobile navigation drawer, Mobile menu, Navigation drawer and Adaptive navigation answered by it). layout/Sidebar,
   layout/Rail and page-structures/Sidebar are answered in w00A. Every color is an existing role or data-viz step. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, use = H.use, noop = H.noop, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', ANT = 'Ant Design', HIG = 'Apple HIG';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var frame = function (child, cls) { return h('div', { 'data-ds-wrap': true, className: 'ds-w07c-open' + (cls ? ' ' + cls : '') }, child); };

  /* ── 07 Data Display › Charts › Chart foundations: platform/charts (scales, ChartFrame) ── */
  var MONTHS = [['Jan', 120], ['Feb', 180], ['Mar', 150], ['Apr', 240], ['May', 310], ['Jun', 280]];
  var DAYS = [42, 38, 51, 47, 60, 72, 66, 58, 75, 81, 77, 90, 86, 94].map(function (v, i) { return { date: new Date(2026, 8, 1 + i), value: v }; });
  var SIZES = [['report.pdf', 48000], ['logo.svg', 3200], ['banner.psd', 84000000], ['cross-014.png', 2400000], ['notes.txt', 900], ['video.mp4', 310000000]];
  // the value axis: grid lines across the plot and the tick labels before it (the data font)
  var yAxis = function (y, inner) {
    return h('g', null, y.ticks().map(function (v) {
      return h('g', { key: String(v) }, h('line', { className: 'plx-chart__grid-line', x1: 0, x2: inner.width, y1: y(v), y2: y(v) }),
        h('text', { className: 'plx-chart__tick-label plx-chart__tick-label--y', x: -8, y: y(v) }, y.format(v)));
    }));
  };
  // the category or time axis: the baseline and the labels under it
  var xAxis = function (ticks, at, label, inner) {
    return h('g', null, h('line', { className: 'plx-chart__axis-line', x1: 0, x2: inner.width, y1: inner.height, y2: inner.height }),
      ticks.map(function (t, i) { return h('text', { key: i, className: 'plx-chart__tick-label plx-chart__tick-label--x', x: at(t), y: inner.height + 8 }, label(t)); }));
  };
  var MONTH_TABLE = { columns: [{ title: 'Month', field: 'month', kind: 'name', rowLabel: true }, { title: 'Uploads', field: 'n', kind: 'data', align: 'right' }],
    data: MONTHS.map(function (m, i) { return { id: i + 1, month: m[0], n: m[1] }; }) };
  var Columns = function (props) {
    return h(P.ChartFrame, Object.assign({ title: 'Uploads per month', description: 'Uploads rose from 120 in January to 310 in May.', table: MONTH_TABLE }, props), function (d) {
      var x = P.scaleBand({ domain: MONTHS.map(function (m) { return m[0]; }), range: [0, d.inner.width] });
      var y = P.scaleLinear({ domain: [0, 310], range: [d.inner.height, 0], nice: true });
      return h('g', null, yAxis(y, d.inner),
        MONTHS.map(function (m) { return h('rect', { key: m[0], className: 'plx-chart__mark', 'data-plx-dataviz': P.seriesColor(0), x: x(m[0]), y: y(m[1]), width: x.bandwidth(), height: d.inner.height - y(m[1]) }); }),
        xAxis(x.ticks(), function (k) { return x(k) + x.bandwidth() / 2; }, String, d.inner));
    });
  };
  var Line = function (props) {
    return h(P.ChartFrame, Object.assign({ title: 'Downloads per day', description: 'Daily downloads in September, rising from about 40 to over 90.',
      table: { columns: [{ title: 'Date', field: 'date', kind: 'data' }, { title: 'Downloads', field: 'value', kind: 'data', align: 'right' }], data: DAYS.map(function (p, i) { return { id: i + 1, date: P.formatDate(p.date), value: p.value }; }) } }, props), function (d) {
      var x = P.scaleTime({ domain: [DAYS[0].date, DAYS[DAYS.length - 1].date], range: [0, d.inner.width] });
      var y = P.scaleLinear({ domain: [0, 94], range: [d.inner.height, 0], nice: true });
      var path = DAYS.map(function (p, i) { return (i ? 'L' : 'M') + x(p.date) + ',' + y(p.value); }).join('');
      return h('g', null, yAxis(y, d.inner), h('path', { className: 'plx-chart__line', 'data-plx-dataviz': P.seriesColor(1), d: path }),
        DAYS.map(function (p, i) { return h('circle', { key: i, className: 'plx-chart__point', 'data-plx-dataviz': P.seriesColor(1), cx: x(p.date), cy: y(p.value), r: 4 }); }),
        xAxis(x.ticks(4), x, function (t) { return x.format(t, 4); }, d.inner));
    });
  };
  // a linear x as well as y: storage used by week number
  var WEEKS = [3.2, 3.6, 4.1, 4.0, 4.8, 5.5, 5.9, 6.4, 6.3, 7.1, 7.8, 8.4];
  var Linear = function () {
    return h(P.ChartFrame, { title: 'Storage used', description: 'Storage grew from 3.2 to 8.4 GB over twelve weeks.',
      table: { columns: [{ title: 'Week', field: 'week', kind: 'data' }, { title: 'Storage (GB)', field: 'gb', kind: 'data', align: 'right' }], data: WEEKS.map(function (v, i) { return { id: i + 1, week: i + 1, gb: P.formatNumber(v, { decimals: 1 }) }; }) } }, function (d) {
      var x = P.scaleLinear({ domain: [1, 12], range: [0, d.inner.width] });
      var y = P.scaleLinear({ domain: [0, 8.4], range: [d.inner.height, 0], nice: true });
      var path = WEEKS.map(function (v, i) { return (i ? 'L' : 'M') + x(i + 1) + ',' + y(v); }).join('');
      return h('g', null, yAxis(y, d.inner), h('path', { className: 'plx-chart__line', 'data-plx-dataviz': P.seriesColor(0), d: path }),
        xAxis(x.ticks(6), x, function (t) { return x.format(t, 6); }, d.inner));
    });
  };
  var Log = function () {
    return h(P.ChartFrame, { title: 'File sizes', description: 'Six files from under a kilobyte to over 300 megabytes, on a logarithmic scale.', margin: { start: 64 },
      table: { columns: [{ title: 'File', field: 'name', kind: 'data', rowLabel: true }, { title: 'Size', field: 'size', kind: 'data', align: 'right' }], data: SIZES.map(function (s, i) { return { id: i + 1, name: s[0], size: P.formatBytes(s[1]) }; }) } }, function (d) {
      var x = P.scaleBand({ domain: SIZES.map(function (s) { return s[0]; }), range: [0, d.inner.width], paddingInner: 0.4 });
      var y = P.scaleLog({ domain: [100, 1e9], range: [d.inner.height, 0] });
      return h('g', null, h('g', null, y.ticks().filter(function (v, i) { return i % 2 === 0; }).map(function (v) {
        return h('g', { key: v }, h('line', { className: 'plx-chart__grid-line', x1: 0, x2: d.inner.width, y1: y(v), y2: y(v) }), h('text', { className: 'plx-chart__tick-label plx-chart__tick-label--y', x: -8, y: y(v) }, P.formatBytes(v, { decimals: 0 })));
      })), SIZES.map(function (s) { return h('rect', { key: s[0], className: 'plx-chart__mark', 'data-plx-dataviz': P.seriesColor(2), x: x(s[0]), y: y(s[1]), width: x.bandwidth(), height: d.inner.height - y(s[1]) }); }),
        xAxis(x.ticks(), function (k) { return x(k) + x.bandwidth() / 2; }, function (k) { return k.split('.')[1]; }, d.inner));
    });
  };
  var Ticks = function () {
    var cases = [[0, 87], [0, 1.3], [-12, 48], [1200, 9800]];
    return h(P.Table, { label: 'Nice ticks', data: cases.map(function (c, i) { var n = P.niceTicks(c[0], c[1]); return { id: i + 1, data: c[0] + ' to ' + c[1], step: String(n.step), ticks: n.ticks.join(', ') }; }),
      columns: [{ title: 'Data from … to', field: 'data', kind: 'data', width: '--plx-ref-size-160px' }, { title: 'Step', field: 'step', kind: 'data', width: '--plx-ref-size-100px' }, { title: 'Ticks (niceTicks)', field: 'ticks', kind: 'data' }] });
  };
  var chartFoundations = { id: 'chart-foundations', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Chart foundations', title: 'Chart foundations',
    plenix: 'ChartFrame, scaleLinear, scaleLog, scaleBand, scaleTime, niceTicks, seriesColor', src: 'charts/ChartFrame.jsx', also: ['charts/scales.js'], css: ['system/charts.css'],
    level: 'Foundation', interaction: 'Static', variantClasses: [],
    aliases: ['Chart frame', 'Scales', 'Axes math', 'Chart kit', 'Chart primitives'],
    text: 'The base of every Plenix chart (platform/charts, no dependency). ChartFrame is the figure: the title and description (the chart’s name and takeaway); a plot that fills its container’s width and measures itself, with margins for the axes (tokens); and the data as a table one click away. Scales turn values into positions: linear and log for amounts, band for categories, time for dates. niceTicks puts the ticks on round numbers and calendar steps, and each scale formats its tick labels in the reader’s locale. Marks take their colors from the data-viz scales (seriesColor(i) with data-plx-dataviz); lines, grid lines and tick labels take theirs from the frame’s classes. A chart writes only geometry.',
    use: ['ChartFrame around every chart: a title that names it and a description that says what it shows', 'A table on every chart with the same values (table={{ columns, data }}), so no one has to see the chart to get the data',
      'scaleLinear with nice for amounts from zero; scaleLog only when values span several orders of magnitude, and say so in the description', 'scaleBand for categories in their own order; scaleTime for dates, its ticks on calendar steps',
      'seriesColor(i) by the series’ order in the data, and the data font for every tick label (plx-chart__tick-label)'],
    avoid: ['A color, size or font written in a chart: only geometry (x, y, width, height, d) and classes', 'A value axis that does not start at zero for bars and columns', 'A chart without a table or a description',
      'Tick labels in the UI font, or with different decimals on one axis', 'More than six series in one chart: group the small ones or filter'],
    related: ['dataviz-colors', 'data-grid', 'numbers-and-units'],
    map: [[CAR, 'Charts (Carbon Charts: axes, scales, chart holder)', 'Partial'], [SPE, 'Data visualization: chart fundamentals', 'Partial'], [ATL, 'Data visualization', 'Partial'], [POL, 'Polaris Viz (chart container)', 'Partial'], [HIG, 'Charts', 'Partial']],
    variantPages: [
      vp('Band scale', 'Scale', 'Band (categories)', { variant: 'band' }, 'One band per category in the domain’s order, with padding between bands: columns and bars.', 'Months, products, regions: categories in their own order', 'Continuous values: use a linear or time scale'),
      vp('Linear scale', 'Scale', 'Linear (amounts)', { variant: 'linear' }, 'Amounts on a straight line from the domain to the range, widened to round ticks with nice.', 'Counts, sizes, money, percentages', 'Values that span several orders of magnitude: a log scale'),
      vp('Time scale', 'Scale', 'Time (dates)', { variant: 'time' }, 'Dates on a continuous axis; ticks on calendar steps (hours, days, months, years) in local time.', 'Series over time', 'A few periods named as categories (quarters): a band scale'),
      vp('Log scale', 'Scale', 'Log (orders of magnitude)', { variant: 'log' }, 'Powers of ten an equal step apart, so values from bytes to gigabytes share one axis.', 'Values that span several orders of magnitude, said in the description', 'Bars that compare amounts people read as lengths')
    ],
    examples: [
      ['Scale', [
        ['Band (categories)', function () { return box(560, h(Columns)); }, 'plx-chart__mark', 'scaleBand'],
        ['Linear (amounts)', function () { return box(560, h(Linear)); }, 'plx-chart__grid-line', 'scaleLinear'],
        ['Time (dates)', function () { return box(560, h(Line)); }, 'plx-chart__line', 'scaleTime'],
        ['Log (orders of magnitude)', function () { return box(560, h(Log)); }, 'plx-chart__tick-label', 'scaleLog']], { prop: 'scale' }],
      ['Nice ticks: niceTicks(min, max) on steps of 1, 2 and 5', function () { return box(560, h(Ticks)); }],
      ['Responsive frame: the same chart at two widths (it measures its container)', function () { return row(box(280, h(Columns, { size: 'sm', title: 'Narrow' })), box(500, h(Columns, { size: 'sm', title: 'Wide' }))); }],
      ['Margins: the default margins (tokens) and a wider start margin for long labels', function () { return row(box(320, h(Columns, { size: 'sm', title: 'Default margins' })), box(320, h(Columns, { size: 'sm', title: 'margin={{ start: 64 }}', margin: { start: 64 } }))); }]] };

  /* ── 05 Forms › Date, time, and color › Time-zone selector: TimeZoneSelect ── */
  var Zone = function (props) {
    var s = use(props.start || 'America/Los_Angeles');
    return box(320, h(P.Field, { label: 'Time zone' }, h(P.TimeZoneSelect, Object.assign({ value: s[0], onChange: s[1] }, props.select))));
  };
  var timeZone = { id: 'time-zone-select', lab: true, icon: 'clock', sec: 'forms', sub: 'Date, time, and color', leaf: 'Time-zone selector', title: 'Time-zone selector',
    plenix: 'TimeZoneSelect, timeZoneOptions', src: 'components/TimeZoneSelect/TimeZoneSelect.jsx', level: 'Component', interaction: 'Selection', statesFrom: ['combobox'],
    aliases: ['Time zone picker', 'Time zone select', 'Timezone dropdown', 'IANA time zone'],
    text: 'A combobox over every IANA time zone the browser knows (Intl.supportedValuesOf): each zone by its city, under its region, with its offset from UTC in the data font. People find a zone by typing a city (“Tokyo”), a region, its long name (“Pacific”) or an offset (“+5:30”). Offsets are worked out for a date (now by default), so they follow daylight saving time. Closed, the field shows the city and its offset.',
    use: ['Settings and events where a time belongs to a place: a person’s time zone, a meeting’s, a schedule’s', 'Grouped by region (default) when people know the city; sorted by offset when they know the offset', 'A Field with a label; the browser’s own zone as the default value'],
    avoid: ['Asking for an offset alone (UTC+1): offsets change with daylight saving time, zones do not', 'Every zone where only a few apply: pass zones', 'Showing abbreviations (PST) as the choice: they are ambiguous'],
    related: ['combobox', 'numbers-and-units'],
    map: [[ATL, 'Timezone select (community)', 'Partial'], [ANT, 'Select (time zones)', 'Partial'], [CAR, 'Combo box', 'Partial'], [MAT, 'Exposed dropdown menu', 'Partial']],
    variantPages: [
      vp('Time zones grouped by region', 'List', 'Grouped by region (default)', { variant: 'grouped' }, 'Each region a heading (Africa, Americas, Asia…), its cities in alphabetical order, the offset at the end of each.', 'People who look for their city', 'People who think in offsets: sort by offset'),
      vp('Time zones by offset', 'List', 'Sorted by offset', { variant: 'offset' }, 'One list from west to east, the zones of each offset together.', 'Scheduling across offsets, comparing zones', 'People who only know their city'),
      vp('Time zones without offsets', 'List', 'Without offsets', { variant: 'plain' }, 'Cities only (showOffset={false}), for a narrow field.', 'Narrow fields where the offset shows elsewhere', 'Choosing for a meeting time: show the offset'),
      vp('Time zone search', 'Content', 'Search', { variant: 'grouped', content: 'search' }, 'Typing filters by city, region, IANA name, long name and offset; the number of matches is announced.', 'Every time-zone field: the list is long', 'Scrolling the whole list as the only way')
    ],
    examples: [
      ['List', [['Grouped by region (default)', function () { return frame(h(Zone)); }, 'plx-combobox__group', 'grouped'],
        ['Sorted by offset', function () { return frame(h(Zone, { start: 'Asia/Kolkata', select: { grouped: false } })); }, 'plx-time-zone-select__offset', 'grouped={false}'],
        ['Without offsets', function () { return frame(h(Zone, { start: 'Europe/Berlin', select: { showOffset: false } })); }, 'plx-time-zone-select__city', 'showOffset={false}']], { prop: 'grouped' }],
      ['Content', [['Search', function () { return frame(h(Zone, { start: 'Asia/Tokyo', select: { placeholder: 'Type a city or an offset' } })); }, 'plx-time-zone-select__field-offset', 'value']]],
      ['A few zones', function () { return frame(h(Zone, { start: 'Europe/London', select: { zones: ['America/New_York', 'Europe/London', 'Europe/Berlin', 'Asia/Singapore', 'Australia/Sydney'] } })); }]] };

  /* ── 05 Forms › Select and lookup › Tree select: TreeSelect ── */
  var FOLDERS = [
    { id: 'lit', label: 'Liturgical', icon: 'folder', children: [{ id: 'crosses', label: 'Crosses', icon: 'folder' }, { id: 'borders', label: 'Borders', icon: 'folder', children: [{ id: 'gold', label: 'Gold', icon: 'folder' }, { id: 'silver', label: 'Silver', icon: 'folder' }] }, { id: 'banners', label: 'Banners', icon: 'folder' }] },
    { id: 'brand', label: 'Branding', icon: 'folder', children: [{ id: 'logos', label: 'Logos', icon: 'folder' }, { id: 'colors', label: 'Colors', icon: 'folder' }] },
    { id: 'shelf', label: 'Bookshelf', icon: 'folder' }];
  var Pick = function (props) {
    var one = use(props.start === undefined ? 'gold' : props.start), many = use(['crosses', 'gold']);
    return box(320, h(P.Field, { label: props.multiple ? 'Categories' : 'Folder' }, props.multiple
      ? h(P.TreeSelect, Object.assign({ nodes: FOLDERS, multiple: true, values: many[0], onChange: many[1] }, props.select))
      : h(P.TreeSelect, Object.assign({ nodes: FOLDERS, value: one[0], onChange: one[1] }, props.select))));
  };
  var treeSelect = { id: 'tree-select', lab: true, icon: 'folder', sec: 'forms', sub: 'Select and lookup', leaf: 'Tree select', title: 'Tree select',
    plenix: 'TreeSelect', src: 'components/TreeSelect/TreeSelect.jsx', level: 'Component', interaction: 'Selection', statesFrom: ['text-field', 'tree-view'],
    aliases: ['Tree picker', 'Hierarchical select', 'Folder picker', 'Tree dropdown', 'Cascading tree select'],
    text: 'A field whose choices are a hierarchy. It shows the chosen item (or the first two and how many more) and opens a Popover with the tree, drawn and driven like the Tree: one Tab stop, with the arrows to move, open and close. With one choice, choosing an item closes the popover. With several, each row has a checkbox; a parent checks or clears everything under it and shows mixed when only part of it is checked. A search field keeps the matching items and the items above them, opened. At a phone width the popover is a bottom sheet.',
    use: ['Choosing a folder, a category or an organization unit from a hierarchy people know', 'Multiple with checkboxes for filters over branches (a whole branch at once)', 'Search when the tree is more than about two levels or thirty items'],
    avoid: ['A flat list: use a select or Combobox', 'Moving through a hierarchy to see its content: use the tree view or Miller columns', 'Very large hierarchies loaded on demand: use an entity or file picker'],
    related: ['tree-view', 'combobox', 'popover'],
    map: [[ANT, 'TreeSelect', 'Direct'], [CAR, 'Tree view in a dropdown (IBM Products)', 'Partial'], [ATL, 'Select (nested options)', 'Partial'], [FLU, 'Tree in a popover', 'Partial']],
    variantPages: [
      vp('Tree select with one choice', 'Choice', 'One choice (default)', { variant: 'single' }, 'Choosing an item closes the popover and shows it in the field.', 'A folder, a parent category, a location', 'Several values: use multiple'),
      vp('Tree select with checkboxes', 'Choice', 'Several, with checkboxes', { variant: 'multiple' }, 'A checkbox on each row; a parent checks its whole branch and shows mixed when part of it is checked.', 'Filters over branches of a hierarchy', 'One value: the checkboxes suggest several'),
      vp('Tree select with search', 'Choice', 'With search', { variant: 'search' }, 'A search field over the tree keeps the matches and their parents, opened; ↓ moves into the tree.', 'Deep or long trees', 'A tree of a dozen items: the search only adds a step')
    ],
    examples: [['Width (a field used alone is never wider than its container; P-52)', [['XS (48px)', function () { return box(360, h(P.TreeSelect, { width: 'xs', label: 'Folder', nodes: [{ id: 'a', label: 'Projects', children: [{ id: 'b', label: 'Website' }] }] })); }, 'plx-tree-select--width-xs', 'width="xs"'], ['SM (80px)', function () { return box(360, h(P.TreeSelect, { width: 'sm', label: 'Folder', nodes: [{ id: 'a', label: 'Projects', children: [{ id: 'b', label: 'Website' }] }] })); }, 'plx-tree-select--width-sm', 'width="sm"'], ['MD (100px)', function () { return box(360, h(P.TreeSelect, { width: 'md', label: 'Folder', nodes: [{ id: 'a', label: 'Projects', children: [{ id: 'b', label: 'Website' }] }] })); }, 'plx-tree-select--width-md', 'width="md"'], ['LG (220px)', function () { return box(360, h(P.TreeSelect, { width: 'lg', label: 'Folder', nodes: [{ id: 'a', label: 'Projects', children: [{ id: 'b', label: 'Website' }] }] })); }, 'plx-tree-select--width-lg', 'width="lg"'], ['Fill: the whole width', function () { return box(360, h(P.TreeSelect, { width: 'fill', label: 'Folder', nodes: [{ id: 'a', label: 'Projects', children: [{ id: 'b', label: 'Website' }] }] })); }, 'plx-tree-select--width-fill', 'width="fill"']], { prop: 'width' }],
      
      ['Choice', [['One choice (default)', function () { return frame(h(Pick)); }, 'plx-tree-select__value', 'value'],
        ['Several, with checkboxes', function () { return frame(h(Pick, { multiple: true })); }, 'plx-tree-select--multiple', 'multiple values'],
        ['With search', function () { return frame(h(Pick, { select: { search: true } })); }, 'plx-tree-select__panel', 'search']], { prop: 'multiple' }],
      // issue 814: each folder's items load when it is opened (as from a server, after 700ms)
      ['Loading', [['Branches that load when opened', function () { return frame(h(Pick, { start: '', select: { nodes: [{ id: 'icons', label: 'Icons', icon: 'folder', hasChildren: true }, { id: 'feasts', label: 'Feasts', icon: 'folder', hasChildren: true }],
        loadChildren: function (n) { return new Promise(function (ok) { setTimeout(function () { ok(['One', 'Two', 'Three'].map(function (x) { return { id: n.id + '-' + x, label: n.label + ' ' + x, icon: 'document' }; })); }, 700); }); } } })); }, null, 'loadChildren']]],
      // issue 815: 5,000 items under one folder; above 200 visible rows the tree in the popover draws only the rows in view
      ['Large', [['5,000 items (virtualized)', function () { var files = []; for (var i = 1; i <= 5000; i++) files.push({ id: 'f' + i, label: 'Scan ' + i, icon: 'document' });
        return frame(h(Pick, { start: '', select: { nodes: [{ id: 'scans', label: 'Scans', icon: 'folder', children: files }], defaultExpanded: ['scans'] } })); }, 'plx-tree--virtual', 'virtualized']]],
      ['Field', [['Empty', function () { return frame(h(Pick, { start: '', select: { placeholder: 'Choose a folder' } })); }, 'plx-tree-select__placeholder', 'placeholder'],
        ['Invalid', function () { return box(320, h(P.Field, { label: 'Folder', error: 'Choose a folder.' }, h(P.TreeSelect, { nodes: FOLDERS, onChange: noop }))); }, null, 'invalid'],
        ['Disabled', function () { return box(320, h(P.Field, { label: 'Folder' }, h(P.TreeSelect, { nodes: FOLDERS, value: 'gold', disabled: true }))); }, null, 'disabled']]]] };

  /* ── 10 Patterns › Selection and organization › Transfer list (and Dual listbox): TransferList ── */
  var COLUMNS = ['Name', 'Type', 'Size', 'Modified', 'Created', 'Owner', 'Category', 'Tags', 'Dimensions', 'Color space', 'Resolution', 'Copyright', 'Location', 'Status']
    .map(function (n, i) { return { value: n.toLowerCase().replace(/\s+/g, '-'), label: n, meta: 'c' + String(i + 1).padStart(2, '0') }; });
  var MANY = []; for (var mi = 1; mi <= 2000; mi++) MANY.push({ value: 'p' + mi, label: 'Person ' + mi, meta: 'ID ' + (10000 + mi) });
  var Transfer = function (props) {
    var s = use(props.start || ['name', 'type', 'size', 'modified']);
    return box(props.width || 600, h(P.TransferList, Object.assign({ label: 'Columns', options: COLUMNS, value: s[0], onChange: s[1], titles: { source: 'Hidden columns', target: 'Shown columns' } }, props.list)));
  };
  var transferList = { id: 'transfer-list', lab: true, icon: 'move', sec: 'patterns', sub: 'Selection and organization', leaf: 'Transfer list', title: 'Transfer list',
    plenix: 'TransferList', src: 'components/TransferList/TransferList.jsx', level: 'Component', interaction: 'Selection',
    covers: ['Dual listbox'],
    aliases: ['Dual listbox', 'Shuttle', 'List builder', 'Two-list selector', 'Pick list'],
    text: 'Two lists for choosing a subset of many items: the items not chosen on one side, the chosen ones on the other, and Add, Add all, Remove and Remove all between them. Each list is a listbox with one Tab stop and a checkbox on each row; its header checks every item it shows and counts them in the data font (2/12). A move is announced and the moved items stay checked, so a wrong move is one click back. Optionally, the chosen list keeps an order of its own (Move up, Move down), each list has a search field, and long lists draw only the rows in view.',
    use: ['Choosing a subset from about fifteen items or more where both what is chosen and what is not matter: columns to show, members of a group, fields to export', 'ordered when the order of the chosen items matters (columns, a sequence)', 'search on both sides from about thirty items; virtualized from a few hundred'],
    avoid: ['A handful of items: use a checkbox group', 'One value: use a select or Combobox', 'Reordering alone: use a sortable list', 'A transfer list on a phone for long lists: a multi-select with search fits better'],
    related: ['checkbox', 'combobox', 'interactive-list', 'patterns-dual-listbox'],
    map: [[ANT, 'Transfer', 'Direct'], [CAR, 'Add/select (IBM Products)', 'Partial'], [ATL, 'Dual list box (community)', 'Partial'], ['Salesforce Lightning', 'Dueling picklist', 'Direct']],
    states: [['Enabled', 'Both lists framed, the buttons that can act enabled', 'The default'], ['Hover', 'The row under the pointer tinted', ':hover'],
      ['Focused', 'The list’s frame in the focus color (no ring); the active row tinted', ':focus-visible on the listbox'], ['Checked', 'The row’s checkbox checked and the selected fill', 'aria-selected'],
      ['Mixed', 'The header’s checkbox mixed while some rows are checked', 'indeterminate'], ['Disabled', 'Rows in the disabled text color, every button disabled', 'disabled']],
    variantPages: [
      vp('Transfer list', 'Variant', 'Basic (default)', { variant: 'basic' }, 'Two lists and the move buttons between them.', 'Choosing a subset of a known set', 'Fewer than about fifteen items: a checkbox group'),
      vp('Transfer list with search', 'Variant', 'With search', { variant: 'search' }, 'A search field in each list filters what it shows and what its checkbox checks.', 'Lists of more than about thirty items', 'Short lists: the field only takes room'),
      vp('Transfer list with an ordered target', 'Variant', 'Ordered target', { variant: 'ordered' }, 'The chosen list keeps its order; Move up and Move down move its checked items.', 'Columns, steps, any sequence', 'Sets where order means nothing'),
      vp('Virtualized transfer list', 'Variant', 'Virtualized', { variant: 'virtualized' }, 'Only the rows in view are drawn (useVirtualizer); the scroll bar keeps its true length and positions are announced.', 'Thousands of items', 'Short lists: render them all')
    ],
    examples: [
      ['Variant', [['Basic (default)', function () { return h(Transfer); }, 'plx-transfer-list--md', 'options value'],
        ['With search', function () { return h(Transfer, { list: { search: true } }); }, 'plx-transfer-list__search', 'search'],
        ['Ordered target', function () { return h(Transfer, { list: { ordered: true } }); }, 'plx-transfer-list__tools', 'ordered'],
        ['Virtualized', function () { return h(Transfer, { start: ['p3', 'p7'], list: { label: 'People', options: MANY, search: true, virtualized: true, titles: { source: 'People', target: 'Team' } } }); }, 'plx-transfer-list__list--virtual', 'virtualized']], { prop: 'search · ordered · virtualized' }],
      ['Size', [['Small', function () { return h(Transfer, { list: { size: 'sm' } }); }, 'plx-transfer-list--sm', 'size=' + q('sm')], ['Large', function () { return h(Transfer, { list: { size: 'lg' } }); }, 'plx-transfer-list--lg', 'size=' + q('lg')]], { prop: 'size' }],
      ['Narrow: the lists stack', function () { return h(Transfer, { width: 320 }); }],
      ['Disabled', function () { return h(Transfer, { list: { disabled: true } }); }]] };
  var dualListbox = { id: 'patterns-dual-listbox', icon: 'move', sec: 'patterns', sub: 'Selection and organization', leaf: 'Dual listbox', title: 'Dual listbox',
    plenix: 'TransferList', src: 'components/TransferList/TransferList.jsx', level: 'Component', interaction: 'Selection', statesFrom: ['transfer-list'], variantClasses: [], docsFrom: 'transfer-list',
    aliases: ['Dual list box', 'Two listboxes'], related: ['transfer-list'],
    text: 'A dual listbox is the transfer list: two listboxes, the items not chosen and the chosen ones, with buttons that move the checked items between them (TransferList).',
    use: ['The same as the transfer list: a subset of many items, both sides visible'], avoid: ['A single listbox with checkboxes when the chosen items need not be seen together'],
    map: [['Salesforce Lightning', 'Dueling picklist', 'Direct'], [ANT, 'Transfer', 'Direct']],
    examples: [['Two listboxes', function () { return h(Transfer, { list: { search: true } }); }]] };

  /* ── 06 Navigation › Mobile navigation › Bottom-sheet navigation: BottomSheetNav ── */
  var PLACES = [{ id: 'home', label: 'Home', icon: 'home' }, { id: 'files', label: 'Files', icon: 'folder' }, { id: 'notes', label: 'Notes', icon: 'doc-text' }, { id: 'tasks', label: 'Tasks', icon: 'checklist' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar' }, { id: 'messages', label: 'Messages', icon: 'message' }, { id: 'contacts', label: 'Contacts', icon: 'person' }, { id: 'bookmarks', label: 'Bookmarks', icon: 'bookmark' }];
  var VIEWS = [{ heading: 'Notes', items: [{ id: 'all', label: 'All notes', icon: 'doc-text', count: 24 }, { id: 'pinned', label: 'Pinned', icon: 'pin', count: 3 }, { id: 'shared', label: 'Shared with me', icon: 'share', count: 7 }] },
    { heading: 'Notebooks', items: [{ id: 'work', label: 'Work', icon: 'folder', count: 9 }, { id: 'home2', label: 'Home', icon: 'folder', count: 5 }] }];
  var SheetNav = function (props) {
    var open = use(false), cur = use(props.layout === 'grid' ? 'notes' : 'all');
    return h('div', null, h(P.Button, { icon: props.layout === 'grid' ? 'app-switcher' : 'menu-lines', onClick: function () { open[1](true); } }, props.layout === 'grid' ? 'Applications' : 'Go to'),
      h(P.BottomSheetNav, Object.assign({ open: open[0], onClose: function () { open[1](false); }, value: cur[0], onSelect: cur[1] }, props.layout === 'grid'
        ? { layout: 'grid', title: 'Applications', items: PLACES } : { title: 'Go to', groups: VIEWS })));
  };
  var bottomSheetNav = { id: 'bottom-sheet-navigation', lab: true, icon: 'menu-lines', sec: 'navigation', sub: 'Mobile navigation', leaf: 'Bottom-sheet navigation', title: 'Bottom-sheet navigation',
    plenix: 'BottomSheetNav', src: 'patterns/BottomSheetNav/BottomSheetNav.jsx', level: 'Pattern', interaction: 'Navigation', statesFrom: ['navigation-menu', 'sheet'],
    aliases: ['Navigation sheet', 'Bottom drawer menu', 'More sheet', 'Action sheet navigation'],
    text: 'Places to go in a sheet that rises from the bottom of a phone: a section’s views as NavList rows (groups, icons, counts), or a few top-level places as a grid of icon tiles. It is the Sheet’s bottom form, so it has the grabber, the medium and large heights, Escape and the scrim; choosing a place closes it and shows that place.',
    use: ['A second set of places on a phone: a section’s views, the other applications', 'The list for more than about eight places or places with counts; the grid for a few places known by their icons', 'Open it from a bar item or a button that names it (Go to, Applications)'],
    avoid: ['The application’s main destinations: they are the bottom navigation bar (NavPane at Narrow)', 'Actions: use an action sheet or a menu', 'Wide windows: the same places belong in the navigation pane'],
    related: ['bottom-navigation', 'sheet', 'navigation-menu', 'side-navigation'],
    map: [[MAT, 'Bottom sheets (navigation)', 'Partial'], [HIG, 'Sheets', 'Partial'], [ATL, 'Mobile navigation', 'Partial'], [POL, 'Navigation (mobile)', 'Partial']],
    variantPages: [
      vp('Bottom-sheet navigation list', 'Layout', 'List (default)', { variant: 'list' }, 'NavList rows in the sheet: groups, icons, counts; the current place marked.', 'A section’s views and folders', 'A few top-level places: the grid'),
      vp('Bottom-sheet navigation grid', 'Layout', 'Grid', { variant: 'grid' }, 'Icon tiles three or four to a row, each at least the touch target; the current tile filled.', 'A few top-level places known by their icons', 'More than about twelve places or places with counts: the list')
    ],
    examples: [['Layout', [['List (default)', function () { return h(SheetNav, { layout: 'list' }); }, 'plx-bottom-sheet-nav--list', 'layout=' + q('list')],
      ['Grid', function () { return h(SheetNav, { layout: 'grid' }); }, 'plx-bottom-sheet-nav--grid', 'layout=' + q('grid')]], { prop: 'layout' }]] };

  /* ── 06 Navigation › Mobile navigation › Bottom navigation: NavPane at Narrow (and the leaves it answers) ── */
  // what NavPane draws at the Narrow window class, with its own classes: the bar of the page's destinations and Browse
  var DEST = [['home', 'Home'], ['folder', 'Files'], ['chart', 'Reports'], ['person', 'People']];
  var Bar = function (props) {
    var s = use(props.current || 'Home');
    return h('nav', { 'aria-label': 'Asset Manager', className: 'plx-nav-bar' }, DEST.map(function (d) {
      var on = s[0] === d[1] && !props.browse;
      return h('button', { key: d[1], type: 'button', className: 'plx-nav-bar__item' + (on ? ' is-current' : ''), 'aria-current': on ? 'page' : undefined, onClick: function () { s[1](d[1]); } },
        h(P.Icon, { name: d[0], filled: on }), h('span', { className: 'plx-nav-bar__label' }, d[1]));
    }), h('button', { type: 'button', className: 'plx-nav-bar__item' + (props.browse ? ' is-current' : ''), 'aria-current': props.browse ? 'page' : undefined }, h(P.Icon, { name: 'menu-lines', filled: !!props.browse }), h('span', { className: 'plx-nav-bar__label' }, 'Browse')));
  };
  var paneBody = function () { return h(P.NavList, { label: 'Asset Manager', items: [{ id: 'all', label: 'All Categories', icon: 'folder', count: 4546 }, { id: 'b', label: 'Branding', icon: 'folder', count: 326 }, { id: 'c', label: 'Crosses', icon: 'folder', count: 1284 }] }); };
  // a phone-sized frame: the main region, and the pane over it as the shell places it (overlay at Medium, screen at Narrow)
  var Phone = function (props) {
    return h('div', { className: 'ds-w07c-phone' }, h('div', { className: 'ds-w07c-phone__main' },
      props.mode === 'overlay' ? h(P.ToolRail, { label: 'Asset Manager', className: 'plx-nav-pane-rail' }, h(P.ToolRail.Item, { icon: 'panel-left-open', label: 'Expand sidebar' }), h(P.ToolRail.Divider), h(P.ToolRail.Item, { icon: 'home', label: 'Home' }), h(P.ToolRail.Item, { icon: 'folder', label: 'Files' })) : null,
      h('div', { className: 'ds-w07c-phone__content' }, h(P.Text, { tone: 'subtle', size: 'sm' }, 'The page’s main region')),
      props.mode === 'overlay' ? h('div', { className: 'plx-app-shell__scrim', 'aria-hidden': 'true' }) : null,
      props.mode !== 'bar' ? h('nav', { 'aria-label': 'Asset Manager', className: 'plx-nav-pane plx-nav-pane--' + props.mode }, h('div', { className: 'plx-nav-pane__header' }, h('span', { className: 'plx-nav-pane__title' }, 'Asset Manager')),
        h('div', { className: 'plx-nav-pane__body' }, paneBody())) : null), props.mode !== 'overlay' ? h(Bar, { browse: props.mode === 'screen' }) : null);
  };
  var bottomNav = { id: 'bottom-navigation', lab: true, icon: 'app-switcher', sec: 'navigation', sub: 'Mobile navigation', leaf: 'Bottom navigation', title: 'Bottom navigation',
    plenix: 'NavPane', src: 'patterns/NavPane/NavPane.jsx', blocks: ['plx-nav-bar'], level: 'Composite', interaction: 'Navigation', statesFrom: ['navigation-rail'],
    covers: ['Mobile tab bar', 'Mobile navigation drawer', 'Mobile menu', 'layout/Adaptive navigation', 'overlays/Navigation drawer'],
    aliases: ['Bottom navigation bar', 'Tab bar', 'Mobile tab bar', 'Navigation bar (Material)', 'Mobile navigation drawer', 'Mobile menu', 'Adaptive navigation', 'Navigation drawer'],
    text: 'One navigation pane, its form chosen by the window class (Platforms Standard 3.3, 4.1): the page gives NavPane its content and rail items once, and the shell picks the form. Wide (840px and up): the pane beside the main region, or collapsed to a rail. Medium (600–839px): the rail; its Expand opens the expanded rail over the main region with a scrim, as wide as the pane and never the whole window; Escape or a click on the scrim closes it. Narrow (under 600px): never a drawer. With two or more rail items, the page’s top-level destinations form a bar along the bottom: up to four, then Browse, which opens the pane as a screen of its own with every other place in it (the pane’s title, groups and footer); with fewer, a parent row at the top opens it. Each destination shows its icon and its label and is at least the touch target; the current one is in the selected color with its icon filled. Choosing a place in the screen closes it. A second set of places can open in a bottom sheet (BottomSheetNav).',
    use: ['NavPane inside AppShell on every page: the forms follow the window', 'Rail items for the destinations that should stay one press away at every width', 'Narrow, with two to four top-level destinations: the page’s rail items become the bottom bar', 'Labels of one short word under every icon', 'Browse for everything else: the pane opens as a screen; choosing a place closes it', 'Medium: the rail stays, the expanded rail opens over the page'],
    avoid: ['A hamburger or partial-width drawer at Narrow: the pane is a screen (Platforms Standard 4.1, 6.4)', 'A dropdown menu of the application’s places under a hamburger button', 'More than four destinations in the bar: the rest are in the pane', 'Actions in the bar: they belong in the page’s action bar', 'A bar on Medium and Wide windows: the rail and the pane are there', 'Opening the expanded rail over the page at Wide: the pane sits beside the main region there', 'Tabs that switch views of one page along the bottom: use tabs or a segmented control at the top', 'A navigation built per breakpoint by the page', 'Hiding destinations at small widths: they move into Browse'],
    related: ['side-navigation', 'navigation-rail', 'bottom-sheet-navigation', 'side-drawer', 'application-shell', 'breakpoints'],
    map: [[MAT, 'Navigation (adaptive: bar, rail, drawer)', 'Direct'], [MAT, 'Navigation bar', 'Direct'], [MAT, 'Navigation drawer (modal)', 'Partial'], [HIG, 'Tab bars', 'Direct'], [HIG, 'Tab bars and sidebars (adaptable)', 'Partial'], [HIG, 'Tab bars (More)', 'Partial'], [HIG, 'Sidebars', 'Partial'], [FLU, 'Tab bar (mobile)', 'Partial'], [FLU, 'Nav drawer (overlay)', 'Direct'], [ATL, 'Mobile navigation (bottom)', 'Partial'], [CAR, 'UI shell side nav (overlay)', 'Partial']],
    variantPages: [
      vp('Bottom navigation bar', 'Form', 'Bottom bar (default)', { variant: 'bar' }, 'The page’s destinations along the bottom, up to four, then Browse; the current one in the selected color.', 'Narrow windows with two or more top-level destinations', 'Medium and Wide windows: the rail and the pane'),
      vp('Navigation drawer over the page', 'Form', 'Overlay drawer', { variant: 'overlay' }, 'At Medium the rail stays and its Expand opens the expanded rail over the main region, with a scrim; Escape or a click outside closes it.', 'Medium windows (600–839px)', 'Narrow windows: the pane is a screen, never a drawer'),
      vp('Navigation pane as a screen', 'Form', 'Screen', { variant: 'screen' }, 'Browse opens the whole pane as a screen over the main region, the bar still below it; choosing a place shows the main region again.', 'Every other place at Narrow', 'A partial-width drawer at Narrow')
    ],
    examples: [['Form', [['Bottom bar (default)', function () { return box(360, h(Phone, { mode: 'bar' })); }, 'plx-nav-bar', 'rail'],
      ['Overlay drawer', function () { return box(360, h(Phone, { mode: 'overlay' })); }, 'plx-nav-pane--overlay', 'rail (Medium)'],
      ['Screen', function () { return box(360, h(Phone, { mode: 'screen' })); }, 'plx-nav-pane--screen', 'rail (Narrow, Browse)']], { prop: 'rail' }],
      ['The bar', function () { return box(360, h(Bar, {})); }],
      ['Narrow: the pane as a screen', function () { return box(360, h(Phone, { mode: 'screen' })); }],
      ['Medium: the expanded rail over the page', function () { return box(360, h(Phone, { mode: 'overlay' })); }],
      ['Forms by window class', function () { return row(box(360, h(Phone, { mode: 'bar' })), box(360, h(Phone, { mode: 'overlay' })), box(360, h(Phone, { mode: 'screen' }))); }]], also: [] };
  // the leaves NavPane answers with these forms: thin records pointing at it
  var thin = function (r) {
    return Object.assign({ plenix: 'NavPane', src: 'patterns/NavPane/NavPane.jsx', level: 'Composite', interaction: 'Navigation', statesFrom: ['navigation-rail'], variantClasses: [], docsFrom: 'bottom-navigation',
      related: ['bottom-navigation', 'side-navigation'] }, r);
  };
  return [chartFoundations, timeZone, treeSelect, transferList, dualListbox, bottomSheetNav, bottomNav, ];
});
