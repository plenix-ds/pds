/* Plenix design system · library part w09B (wave 9, lane B): the charts built on ChartFrame and the chart parts
   (platform/charts): BarChart (Bar chart, and its Column chart, Stacked bar chart and Histogram forms), ComboChart,
   PieChart (Pie chart, and its Donut chart form), BulletChart, BoxPlot, RadarChart, SankeyDiagram and TimelineChart
   (Timeline visualization); and the pattern ComparisonView (Comparison view, and its duplicate leaf Compare in
   Patterns). Every color is a data-viz step or an existing role; every chart keeps ChartFrame's "Show the data" table. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', HIG = 'Apple HIG', MAT = 'Material 3';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var ART = function (n) { return '../../dam/assets/thumb-' + n + '.svg'; };
  var CSS = function (own) { return ['charts/' + own, 'system/charts.css', 'charts/parts/chart-parts.css']; };

  /* ── the sample data ── */
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  var TEAMS = ['Design', 'Marketing', 'Sales', 'Support', 'Legal'];
  var STORAGE = [{ id: 'gb', label: 'Storage (GB)', values: [420, 310, 260, 120, 60] }];
  var BY_KIND = [{ id: 'img', label: 'Images', values: [240, 150, 90, 40, 20] }, { id: 'vid', label: 'Videos', values: [130, 120, 110, 30, 10] }, { id: 'doc', label: 'Documents', values: [50, 40, 60, 50, 30] }];
  var UPLOADS = [{ id: 'img', label: 'Images', values: [320, 360, 410, 380, 450, 520] }, { id: 'vid', label: 'Videos', values: [80, 95, 120, 110, 150, 170] }];
  // file sizes in MB: a fixed, skewed sample (most files small, a few large)
  var SIZES = (function () { var out = [], seed = 7; for (var i = 0; i < 160; i++) { seed = (seed * 9301 + 49297) % 233280; var r = seed / 233280; out.push(Math.round(Math.pow(r, 2.2) * 58 * 10) / 10 + 0.4); } return out; })();
  var CHANGE = [{ id: 'delta', label: 'Change (GB)', values: [42, -18, 25, -32, 10] }];

  /* ── 07 Data Display › Charts › Bar chart (and Column chart, Stacked bar chart, Histogram): BarChart ── */
  var bar = function (o) { return h(P.BarChart, Object.assign({ title: 'Storage by team', description: 'Design uses the most storage, four times what Support uses.', categories: TEAMS, series: STORAGE, valueLabel: 'Storage (GB)' }, o)); };
  var barChart = { id: 'bar-chart', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Bar chart', title: 'Bar chart',
    plenix: 'BarChart, binValues', src: 'charts/BarChart.tsx', also: ['charts/chart-kit.ts'], css: CSS('bar-chart.css'), blocks: ['plx-bar-chart'],
    level: 'Component', interaction: 'Display',
    aliases: ['Horizontal bar chart', 'Column chart', 'Vertical bar chart', 'Grouped bar chart', 'Stacked bar chart', '100% stacked bar chart', 'Histogram'],
    covers: ['Column chart', 'Stacked bar chart', 'Histogram'],
    text: 'Amounts compared as bar lengths along a value axis that starts at zero: horizontal bars for long category names or rankings, vertical columns for periods (Column chart). Several series sit side by side in each category (grouped), stack into the category’s total (stacked), or show each series’ share of its category (percent: Stacked bar chart). Given raw numbers (histogram), it counts how many fall in each range of equal width and draws the ranges as touching columns (Histogram). The legend, the tooltip, value labels and the data table come from the chart parts.',
    use: ['Comparing amounts across categories, sorted by value unless the order is natural (months, steps)', 'Horizontal bars for long names and rankings; vertical columns for periods and short names',
      'Grouped for two or three series compared within each category; stacked to compare totals and their make-up; percent to compare shares across categories',
      'The histogram for the distribution of one measure: its center, spread and skew', 'showValues when the exact values matter and the bars are few'],
    avoid: ['A value axis that does not start at zero', 'More than about five stacked segments: group the rest as Other', 'Grouped bars with more than three series: use small charts or a table',
      'Continuous time with many points: the line chart', 'Parts of one whole with few parts and one message: the pie chart'],
    related: ['chart-foundations', 'chart-legend', 'chart-tooltip', 'chart-data-label', 'combo-chart', 'box-plot', 'pie-chart'],
    map: [[CAR, 'Bar (simple, grouped, stacked), Histogram', 'Direct'], [FLU, 'Horizontal and vertical bar charts', 'Direct'], [SPE, 'Bar chart', 'Direct'], [POL, 'Bar chart', 'Direct'], [ATL, 'Data visualization', 'Partial'], [HIG, 'Charts (BarMark)', 'Direct'], ['Frappe', 'Frappe Charts bar chart', 'Direct']],
    variantPages: [
      vp('Horizontal bar chart', 'Orientation', 'Bar (horizontal)', { size: 'horizontal' }, 'Bars from the start side, category names before them, the value axis along the bottom.', 'Long category names and rankings', 'Periods: columns read left to right in time'),
      vp('Column chart', 'Orientation', 'Column (vertical)', { size: 'vertical' }, 'Columns up from the baseline, the categories or periods along the bottom, the value axis on the start side.', 'Periods such as months, and short names', 'Long names: horizontal bars'),
      vp('Grouped bar chart', 'Layout', 'Grouped', { variant: 'grouped' }, 'Two or three series side by side in each category, with a legend.', 'Comparing a few series within each category', 'Many series: the bars get thin'),
      vp('Stacked bar chart', 'Layout', 'Stacked', { variant: 'stacked' }, 'The series stacked into the category’s total, in the legend’s order; the total is written at the stack’s end with showValues.', 'Totals and their make-up across categories', 'Comparing the inner segments precisely: grouped bars'),
      vp('Percent stacked bar chart', 'Layout', 'Percent', { variant: 'percent' }, 'Each category stacked to 100%: every series as its share of the category.', 'Comparing shares across categories of different sizes', 'When the totals matter: the stacked bars'),
      vp('Histogram', 'Layout', 'Histogram (binned)', { variant: 'histogram' }, 'Raw values counted in ranges of equal width on round edges, drawn as touching columns.', 'The distribution of one measure', 'Categories: a column chart')
    ],
    examples: [
      ['Orientation', [
        ['Bar (horizontal)', function () { return box(560, bar({ showValues: true })); }, 'plx-bar-chart--horizontal', 'orientation=' + q('horizontal')],
        ['Column (vertical)', function () { return box(560, bar({ orientation: 'vertical', title: 'Uploads per month', description: 'Image uploads rose most months.', categories: MONTHS, series: UPLOADS.slice(0, 1), valueLabel: 'Uploads' })); }, 'plx-bar-chart--vertical', 'orientation=' + q('vertical')]], { prop: 'orientation' }],
      ['Layout', [
        ['Grouped', function () { return box(560, bar({ orientation: 'vertical', title: 'Uploads per month by kind', description: 'Images lead every month; videos grow fastest.', categories: MONTHS, series: UPLOADS, valueLabel: 'Uploads' })); }, 'plx-bar-chart--grouped', 'layout=' + q('grouped')],
        ['Stacked', function () { return box(560, bar({ layout: 'stacked', title: 'Storage by team and kind', description: 'Images take most of the storage in every team.', series: BY_KIND, showValues: true })); }, 'plx-bar-chart--stacked', 'layout=' + q('stacked')],
        ['Percent', function () { return box(560, bar({ layout: 'percent', title: 'Storage mix by team', description: 'Videos are a third of Sales’ storage.', series: BY_KIND, valueLabel: 'Share of storage', showValues: true })); }, 'plx-bar-chart--percent', 'layout=' + q('percent')],
        ['Histogram (binned)', function () { return box(560, h(P.BarChart, { orientation: 'vertical', title: 'File sizes', description: 'Most files are under 10 MB; a few large videos reach 58 MB.', histogram: { values: SIZES, bins: 6 }, categoryLabel: 'Size (MB)', valueLabel: 'Files' })); }, 'plx-bar-chart--histogram', 'histogram={{ values, bins }}']], { prop: 'layout' }],
      ['Negative values go the other way from the zero line', function () { return box(560, bar({ title: 'Storage change this month', description: 'Marketing and Support freed space; Design grew most.', series: CHANGE, valueLabel: 'Change (GB)', showValues: true })); }],
      ['In a small card (size "sm", legend above the plot)', function () { return box(360, bar({ size: 'sm', orientation: 'vertical', layout: 'stacked', title: 'Uploads', description: 'Six months, by kind.', categories: MONTHS, series: UPLOADS, valueLabel: undefined, legendPosition: 'top' })); }]] };

  /* ── 07 Data Display › Charts › Combo chart: ComboChart ── */
  var RATE = [{ id: 'rate', label: 'Approval rate', values: [0.86, 0.88, 0.91, 0.89, 0.92, 0.9] }];
  var combo = function (o) { return h(P.ComboChart, Object.assign({ title: 'Uploads and approval rate', description: 'Uploads grew by 60% while the approval rate held near 90%.', categories: MONTHS, bars: UPLOADS.slice(0, 1), lines: RATE, axis: 'dual', barLabel: 'Uploads', lineLabel: 'Approval rate', formatLine: function (v) { return P.formatPercent(v); } }, o)); };
  var comboChart = { id: 'combo-chart', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Combo chart', title: 'Combo chart',
    plenix: 'ComboChart', src: 'charts/ComboChart.tsx', also: ['charts/chart-kit.ts'], css: CSS('combo-chart.css'), blocks: ['plx-combo-chart'],
    level: 'Component', interaction: 'Display',
    aliases: ['Bar and line chart', 'Dual-axis chart', 'Column and line chart', 'Mixed chart'],
    text: 'Two related measures on one category axis: columns for the main amount, and a line with points for the second (a rate, a target, a running figure). Both share one value axis when they have the same unit, or each has its own (axis="dual": the columns’ axis on the start side, the line’s on the end side, each titled with its unit). The legends name each series and its kind (square swatches for columns, line swatches for lines); one tooltip per category gives every value.',
    use: ['An amount and a rate that move together: uploads and approval rate, sales and margin', 'Actual columns against a target line on one axis', 'axis="dual" only when the units differ, with both axes titled with their unit'],
    avoid: ['More than two chart types', 'Dual axes when one would do: two charts read more safely', 'Two lines on two axes: readers compare the crossing, which means nothing'],
    related: ['bar-chart', 'chart-foundations', 'chart-legend', 'chart-tooltip', 'chart-axis'],
    map: [[CAR, 'Combo', 'Direct'], [POL, 'Combo chart', 'Direct'], [FLU, 'Charts', 'Partial'], [HIG, 'Charts (BarMark with LineMark)', 'Partial'], ['Frappe', 'Frappe Charts axis-mixed chart', 'Direct']],
    variantPages: [
      vp('Bar and line combo chart', 'Variant', 'Bar + line', { variant: 'shared' }, 'Columns and a line on one value axis: the same unit, such as actuals against a target.', 'Actuals and targets of one measure', 'Measures in different units: two axes'),
      vp('Dual-axis combo chart', 'Variant', 'Two axes', { variant: 'dual' }, 'The line on its own axis at the end side, fitted to its values, each axis titled with its unit.', 'An amount and a rate', 'When one axis would do')
    ],
    examples: [
      ['Variant', [
        ['Bar + line', function () { return box(560, combo({ title: 'Uploads against target', description: 'Uploads beat the target from April.', axis: 'shared', lines: [{ id: 'target', label: 'Target', values: [340, 350, 360, 380, 400, 420] }], lineLabel: undefined, formatLine: undefined })); }, null, 'axis=' + q('shared')],
        ['Two axes', function () { return box(560, combo()); }, 'plx-combo-chart--dual', 'axis=' + q('dual')]], { prop: 'axis' }],
      ['Two column series and a line', function () { return box(640, combo({ bars: UPLOADS, title: 'Uploads by kind and approval rate', description: 'Both kinds grew; the approval rate held near 90%.' })); }]] };

  /* ── 07 Data Display › Charts › Pie chart (and Donut chart): PieChart ── */
  var PARTS = [{ id: 'video', label: 'Videos', value: 540 }, { id: 'img', label: 'Images', value: 260 }, { id: 'doc', label: 'Documents', value: 120 }, { id: 'audio', label: 'Audio', value: 45 }];
  var MANY = PARTS.concat([{ id: 'font', label: 'Fonts', value: 12 }, { id: 'arch', label: 'Archives', value: 18 }, { id: 'code', label: 'Code', value: 6 }]);
  var pie = function (o) { return h(P.PieChart, Object.assign({ title: 'Storage by file type', description: 'Videos take more than half of the storage.', data: PARTS, format: function (v) { return P.formatNumber(v) + ' GB'; }, legendPosition: 'end' }, o)); };
  var pieChart = { id: 'pie-chart', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Pie chart', title: 'Pie chart',
    plenix: 'PieChart, pieSlices', src: 'charts/PieChart.tsx', also: ['charts/chart-kit.ts'], css: CSS('pie-chart.css'), blocks: ['plx-pie-chart'],
    level: 'Component', interaction: 'Display',
    aliases: ['Donut chart', 'Doughnut chart', 'Ring chart', 'Half donut', 'Semicircle chart'],
    covers: ['Donut chart'],
    text: 'The shares of a few parts in one whole: slices from 12 o’clock, largest first, clockwise, parted by a thin line in the surface color. The donut is a ring with the total or a key value in its hollow center (Donut chart); the half ring sits across the top with its value under it. Beyond six parts the smallest are grouped into Other. A part keeps its color by its order in the data; the legend gives each part’s share, the tooltip its value and share, the data table all of them.',
    use: ['Two to five parts of one whole that add up to 100%', 'One clearly dominant part or a simple message', 'The donut when a total or a key value in the center helps; the half ring for one value against its whole in a small card'],
    avoid: ['Parts of similar size or many parts: the bar chart', 'Comparing wholes over time or side by side: the stacked bar chart', 'Several donuts side by side to compare: a percent stacked bar chart'],
    related: ['bar-chart', 'chart-legend', 'chart-tooltip', 'dataviz-colors', 'progress-circle'],
    map: [[CAR, 'Pie, Donut', 'Direct'], [FLU, 'Pie chart, Donut chart', 'Direct'], [SPE, 'Donut chart', 'Direct'], [POL, 'Donut chart', 'Direct'], [HIG, 'Charts (SectorMark)', 'Direct'], ['Frappe', 'Frappe Charts pie and donut chart', 'Direct']],
    variantPages: [
      vp('Pie (full circle)', 'Variant', 'Pie', { variant: 'pie' }, 'Slices from 12 o’clock, largest first, clockwise; the legend gives each share.', 'Two to five parts with one message', 'Parts of similar size'),
      vp('Donut chart', 'Variant', 'Donut', { variant: 'donut' }, 'A ring with the total and its label in the hollow center.', 'A total that matters with its make-up', 'Many thin slices'),
      vp('Donut with center value', 'Variant', 'With center value', { variant: 'center' }, 'A ring with a chosen value in the center, such as the share of the largest part.', 'One headline figure with its parts', 'A value the ring does not show'),
      vp('Half donut', 'Variant', 'Half', { variant: 'half' }, 'A half ring across the top, the value and its label under its middle.', 'One value against its whole in a small card', 'More than three parts')
    ],
    examples: [
      ['Variant', [
        ['Pie', function () { return box(560, pie({ showValues: true })); }, 'plx-pie-chart--pie', 'variant=' + q('pie')],
        ['Donut', function () { return box(560, pie({ variant: 'donut', centerValue: '985 GB', centerLabel: 'Total' })); }, 'plx-pie-chart--donut', 'variant=' + q('donut')],
        ['With center value', function () { return box(560, pie({ variant: 'donut', centerValue: '55%', centerLabel: 'Videos' })); }, null, 'centerValue=' + q('55%')],
        ['Half', function () { return box(400, h(P.PieChart, { variant: 'half', size: 'sm', title: 'Quota used', description: '72% of the 1 TB quota is used.', data: [{ id: 'used', label: 'Used', value: 720 }, { id: 'free', label: 'Free', value: 280, color: 'categorical-6' }], sort: false, centerValue: '72%', centerLabel: 'of 1 TB', format: function (v) { return P.formatNumber(v) + ' GB'; } })); }, 'plx-pie-chart--half', 'variant=' + q('half')]], { prop: 'variant' }],
      ['Seven parts: the smallest are grouped into Other', function () { return box(560, pie({ data: MANY, variant: 'donut' })); }]] };

  /* ── 07 Data Display › Charts › Bullet chart: BulletChart ── */
  var KPIS = [{ id: 'up', label: 'Uploads', value: 820, target: 750, ranges: [400, 700, 1000] }, { id: 'rv', label: 'Reviews', value: 610, target: 600, ranges: [300, 550, 1000] },
    { id: 'ap', label: 'Approvals', value: 420, target: 560, ranges: [350, 600, 1000] }];
  var bullet = function (o) { return h(P.BulletChart, Object.assign({ title: 'Quarter against targets', description: 'Uploads and reviews beat their targets; approvals are behind.', items: KPIS, valueLabel: 'Items this quarter' }, o)); };
  var bulletChart = { id: 'bullet-chart', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Bullet chart', title: 'Bullet chart',
    plenix: 'BulletChart', src: 'charts/BulletChart.tsx', also: ['charts/chart-kit.ts'], css: CSS('bullet-chart.css'), blocks: ['plx-bullet-chart'],
    level: 'Component', interaction: 'Display',
    aliases: ['Bullet graph', 'Target bar', 'KPI bar'],
    text: 'Key measures against their targets, each in a compact row on one value axis from zero: a short value bar over three bands for its qualitative ranges (poor, fair, good, in neutral shades, the darkest nearest zero) and a line across at its target. Horizontal rows stack in a dashboard card; vertical columns fit a wide strip. The tooltip names the range a value is in; the data table lists value, target and ranges.',
    use: ['Measures with a target: uploads against quota, response time against a goal', 'Dense dashboards: several measures of one unit stacked', 'Ranges that people agreed on (poor, fair, good)'],
    avoid: ['A measure without a target: the bar chart', 'Shares of a whole: the stacked bar chart', 'Measures of different units in one chart: one chart each'],
    related: ['bar-chart', 'gauge', 'metric', 'chart-reference-line'],
    map: [[CAR, 'Bullet', 'Direct'], [FLU, 'Charts', 'Partial'], [HIG, 'Charts (BarMark with RuleMark)', 'Partial']],
    variantPages: [
      vp('Horizontal bullet chart', 'Orientation', 'Horizontal', { size: 'horizontal' }, 'One row per measure, names before the bars, the value axis along the bottom.', 'Dashboards and cards: rows stack', 'Many measures in a wide strip: columns'),
      vp('Vertical bullet chart', 'Orientation', 'Vertical', { size: 'vertical' }, 'One column per measure, names along the bottom, the value axis on the start side.', 'A wide strip of a few measures', 'Long measure names')
    ],
    examples: [
      ['Orientation', [
        ['Horizontal', function () { return box(560, bullet()); }, 'plx-bullet-chart--horizontal', 'orientation=' + q('horizontal')],
        ['Vertical', function () { return box(480, bullet({ orientation: 'vertical' })); }, 'plx-bullet-chart--vertical', 'orientation=' + q('vertical')]], { prop: 'orientation' }],
      ['One measure in a small card', function () { return box(360, bullet({ size: 'sm', items: KPIS.slice(0, 1), title: 'Uploads this quarter', description: '820 of a 750 target: good.' })); }]] };

  /* ── 07 Data Display › Charts › Box plot: BoxPlot ── */
  var REVIEWS = [{ id: 'design', label: 'Design', values: [4, 6, 7, 8, 9, 10, 12, 13, 15, 18, 30, 34] }, { id: 'legal', label: 'Legal', values: [8, 9, 10, 11, 11, 12, 13, 14, 15, 16] },
    { id: 'brand', label: 'Brand', values: [2, 3, 3, 4, 5, 5, 6, 7, 8, 9, 21] }, { id: 'web', label: 'Web', values: [5, 6, 6, 7, 8, 9, 9, 10, 11, 12] }];
  var boxPlot = function (o) { return h(P.BoxPlot, Object.assign({ title: 'Review time by team', description: 'Legal reviews are steady; Design varies most, with two very long reviews. Whiskers reach 1.5 × the box.', groups: REVIEWS, valueLabel: 'Hours' }, o)); };
  var boxPlotRec = { id: 'box-plot', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Box plot', title: 'Box plot',
    plenix: 'BoxPlot, boxStats', src: 'charts/BoxPlot.tsx', also: ['charts/chart-kit.ts'], css: CSS('box-plot.css'), blocks: ['plx-box-plot'],
    level: 'Component', interaction: 'Display',
    aliases: ['Box and whisker plot', 'Boxplot', 'Five-number summary'],
    text: 'Distributions compared by their summaries. For each group: a box from the first to the third quartile (the middle half of its values), a line at the median, whiskers to the lowest and highest values within 1.5 times the box’s length, and the values beyond them as outlier points. Groups share one value axis. The tooltip gives the five numbers; the data table gives them all, with the outliers and the count. It takes raw values (and computes the summary) or a summary already made.',
    use: ['Comparing the spread and center of several groups compactly', 'Audiences used to statistical summaries, with the whisker rule in the description', 'Large samples: a box summarizes them'],
    avoid: ['A general audience without an explanation: the histogram', 'Small samples: plot the points', 'One group: the histogram shows more'],
    related: ['bar-chart', 'chart-foundations', 'chart-tooltip'],
    map: [[CAR, 'Boxplot', 'Direct'], [FLU, 'Charts', 'Partial'], [HIG, 'Charts (RectangleMark with RuleMark)', 'Partial']],
    variantPages: [
      vp('Vertical box plot', 'Orientation', 'Vertical', { size: 'vertical' }, 'One box per group along the bottom, the value axis on the start side.', 'A few groups with short names', 'Long group names: horizontal'),
      vp('Horizontal box plot', 'Orientation', 'Horizontal', { size: 'horizontal' }, 'Groups down the start side, the value axis along the bottom.', 'Long group names, many groups', 'Periods: vertical'),
      vp('Box plot with outliers', 'Outliers', 'With outliers', { variant: 'outliers' }, 'The values beyond the whiskers, as points.', 'Data with notable extremes', 'When extremes are errors: clean the data first')
    ],
    examples: [
      ['Orientation', [
        ['Vertical', function () { return box(560, boxPlot()); }, 'plx-box-plot--vertical', 'orientation=' + q('vertical')],
        ['Horizontal', function () { return box(560, boxPlot({ orientation: 'horizontal' })); }, 'plx-box-plot--horizontal', 'orientation=' + q('horizontal')]], { prop: 'orientation' }],
      ['Outliers', [
        ['With outliers', function () { return box(560, boxPlot()); }, null, 'showOutliers'],
        ['Without outliers', function () { return box(560, boxPlot({ showOutliers: false, description: 'Legal reviews are steady; Design varies most.' })); }, null, 'showOutliers={false}']], { prop: 'showOutliers' }],
      ['From a summary already made (stats)', function () { return box(560, h(P.BoxPlot, { title: 'Upload size by quarter', description: 'Sizes grew each quarter.', valueLabel: 'MB', groups: [{ id: 'q1', label: 'Q1', stats: { min: 1, q1: 3, median: 5, q3: 8, max: 14, outliers: [22] } }, { id: 'q2', label: 'Q2', stats: { min: 2, q1: 4, median: 7, q3: 10, max: 17, outliers: [] } }, { id: 'q3', label: 'Q3', stats: { min: 2, q1: 5, median: 8, q3: 12, max: 19, outliers: [27, 31] } }] })); }]] };

  /* ── 07 Data Display › Charts › Radar chart: RadarChart ── */
  var AXES = [{ key: 'res', label: 'Resolution' }, { key: 'color', label: 'Color' }, { key: 'meta', label: 'Metadata' }, { key: 'size', label: 'File size' }, { key: 'rights', label: 'Rights' }, { key: 'alt', label: 'Alt text' }];
  var HERO = { id: 'hero', label: 'Hero image', values: { res: 9, color: 8, meta: 7, size: 4, rights: 9, alt: 6 } };
  var BANNER = { id: 'banner', label: 'Banner', values: { res: 6, color: 7, meta: 9, size: 8, rights: 5, alt: 9 } };
  var radar = function (o) { return h(P.RadarChart, Object.assign({ title: 'Asset quality', description: 'The hero image scores high on all but file size.', axes: AXES, series: [HERO], max: 10 }, o)); };
  var radarChart = { id: 'radar-chart', lab: true, icon: 'chart', sec: 'data-display', sub: 'Charts', leaf: 'Radar chart', title: 'Radar chart',
    plenix: 'RadarChart', src: 'charts/RadarChart.jsx', also: ['charts/chart-kit.ts'], css: CSS('radar-chart.css'), blocks: ['plx-radar-chart'],
    level: 'Component', interaction: 'Display',
    aliases: ['Spider chart', 'Web chart', 'Star chart', 'Polar chart'],
    text: 'The profile of one item, or two or three compared, across several measures on one scale. A spoke per measure runs from the center (zero) to the scale’s end, with rings at the scale’s round ticks. Each item is a closed shape through its values, outlined in its color with its area lightly filled so overlapping shapes stay visible. Measure names sit off the spokes’ ends; ring values are in the data font.',
    use: ['Comparing a profile across four to eight measures on one scale (scores, percentages)', 'Strengths and weaknesses of one item, or two or three items compared', 'A max that is the scale’s real end (10 for scores of 10)'],
    avoid: ['Measures of different units: normalize them or use bars', 'More than three items: grouped bars', 'Reading exact values: the table or bars'],
    related: ['bar-chart', 'chart-legend', 'chart-foundations'],
    map: [[CAR, 'Radar', 'Direct'], [FLU, 'Charts', 'Partial'], [HIG, 'Charts', 'Partial']],
    variantPages: [
      vp('Single radar chart', 'Variant', 'Single', { variant: 'single' }, 'One item’s shape across the measures; no legend (the title names it).', 'One item’s profile', 'Comparing exact values'),
      vp('Compare radar chart', 'Variant', 'Compare', { variant: 'compare' }, 'Two or three items’ shapes over each other, each in its series color, with a legend.', 'Two or three items compared', 'More than three items')
    ],
    examples: [
      ['Variant', [
        ['Single', function () { return box(560, radar()); }, null, 'series={[hero]}'],
        ['Compare', function () { return box(560, radar({ series: [HERO, BANNER], description: 'The banner leads on metadata and size; the hero image on resolution.' })); }, null, 'series={[hero, banner]}']], { prop: 'series' }]] };

  /* ── 07 Data Display › Charts › Sankey diagram: SankeyDiagram ── */
  var FLOW_NODES = [{ id: 'web', label: 'Web' }, { id: 'app', label: 'App' }, { id: 'api', label: 'API' }, { id: 'review', label: 'Review' }, { id: 'auto', label: 'Auto-approved' },
    { id: 'ok', label: 'Approved' }, { id: 'no', label: 'Rejected' }, { id: 'wait', label: 'Waiting' }];
  var FLOW_LINKS = [{ source: 'web', target: 'review', value: 520 }, { source: 'web', target: 'auto', value: 100 }, { source: 'app', target: 'review', value: 300 }, { source: 'app', target: 'auto', value: 80 },
    { source: 'api', target: 'auto', value: 240 }, { source: 'review', target: 'ok', value: 560 }, { source: 'review', target: 'no', value: 160 }, { source: 'review', target: 'wait', value: 100 }, { source: 'auto', target: 'ok', value: 420 }];
  var sankeyDiagram = { id: 'sankey-diagram', lab: true, icon: 'merge', sec: 'data-display', sub: 'Charts', leaf: 'Sankey diagram', title: 'Sankey diagram',
    plenix: 'SankeyDiagram, sankeyLayout', src: 'charts/SankeyDiagram.tsx', also: ['charts/chart-kit.ts'], css: CSS('sankey-diagram.css'), blocks: ['plx-sankey-diagram'],
    level: 'Component', interaction: 'Display',
    aliases: ['Flow diagram', 'Alluvial diagram', 'Flow chart (quantities)'],
    text: 'How a quantity flows, splits and merges through stages: a bar per node (a source, a stage, an outcome) in columns from left to right, with bands between them as wide as the amounts that move. It has its own layout, without a dependency: columns by the longest path, nodes ordered to keep bands from crossing, outcomes in the last column. A band takes its source’s color at a low opacity and darkens with its node under the pointer; names and totals sit beside the nodes.',
    use: ['Flows between groups through one or more stages: where uploads come from and where they end up', 'Branching and merging that a funnel cannot show', 'A few nodes per column, with small flows grouped'],
    avoid: ['A simple linear drop-off: the funnel', 'Many thin flows: group them', 'Flows that loop back: the diagram flows one way'],
    related: ['chart-foundations', 'chart-tooltip', 'funnel'],
    map: [[FLU, 'Sankey chart', 'Direct'], [CAR, 'Alluvial diagram', 'Partial'], [HIG, 'Charts', 'Partial']],
    variantPages: [
      vp('Horizontal Sankey diagram', 'Variant', 'Horizontal', { variant: 'horizontal' }, 'Columns of nodes from left to right, the bands between them; names after the nodes, before them in the last column.', 'Flows through stages', 'A single drop-off: the funnel')
    ],
    examples: [
      ['Variant', [
        ['Horizontal', function () { return box(720, h(P.SankeyDiagram, { title: 'Where uploads end up', description: 'Most uploads are approved; one in eight is rejected and a few wait for review.', nodes: FLOW_NODES, links: FLOW_LINKS })); }, null, 'SankeyDiagram']]],
      ['Two stages, without totals', function () { return box(560, h(P.SankeyDiagram, { size: 'md', title: 'Uploads by source and kind', description: 'The web brings most images.', showValues: false,
        nodes: [{ id: 'web', label: 'Web' }, { id: 'app', label: 'App' }, { id: 'img', label: 'Images' }, { id: 'vid', label: 'Videos' }],
        links: [{ source: 'web', target: 'img', value: 480 }, { source: 'web', target: 'vid', value: 140 }, { source: 'app', target: 'img', value: 160 }, { source: 'app', target: 'vid', value: 220 }] })); }]] };

  /* ── 07 Data Display › Specialized displays › Timeline visualization: TimelineChart ── */
  var LANES = [{ id: 'video', label: 'Launch video' }, { id: 'banners', label: 'Banners' }, { id: 'photos', label: 'Product photos' }];
  var ITEMS = [{ id: 1, lane: 'video', label: 'Script', start: '2026-08-24', end: '2026-09-02' }, { id: 2, lane: 'video', label: 'Shoot', start: '2026-09-07', end: '2026-09-16' },
    { id: 3, lane: 'video', label: 'Approved', start: '2026-10-02' }, { id: 4, lane: 'banners', label: 'Design', start: '2026-09-01', end: '2026-09-18' },
    { id: 5, lane: 'banners', label: 'Shipped', start: '2026-09-22' }, { id: 6, lane: 'photos', label: 'Studio', start: '2026-09-10', end: '2026-09-24' }, { id: 7, lane: 'photos', label: 'Retouch', start: '2026-09-28', end: '2026-10-09' }];
  var EVENTS = [{ id: 'a', label: 'Brief', start: '2026-09-01' }, { id: 'b', label: 'First cut', start: '2026-09-14' }, { id: 'c', label: 'Review', start: '2026-09-21' }, { id: 'd', label: 'Approved', start: '2026-10-02' }];
  var timeline = function (o) { return h(P.TimelineChart, Object.assign({ title: 'Campaign assets', description: 'The video ran two weeks past its shoot; the banners shipped first.', lanes: LANES, items: ITEMS, today: '2026-10-05' }, o)); };
  var timelineChart = { id: 'timeline-chart', lab: true, icon: 'schedule', sec: 'data-display', sub: 'Specialized displays', leaf: 'Timeline visualization', title: 'Timeline visualization',
    plenix: 'TimelineChart', src: 'charts/TimelineChart.jsx', also: ['charts/chart-kit.ts'], css: CSS('timeline-chart.css'), blocks: ['plx-timeline-chart'],
    level: 'Component', interaction: 'Display',
    aliases: ['Timeline chart', 'Time chart', 'Event timeline', 'Swimlane timeline'],
    text: 'When things happened and how long they lasted, on one time axis in calendar steps. Events are points at their date; periods are bars from start to end. They sit on one track or on lanes (one per asset, team or category, each in its own data-viz color), each item with its short name above its mark, plus an optional today line. The tooltip gives an item’s full dates; the data table lists every item with its lane and dates.',
    use: ['Events and periods across weeks or months: an asset’s versions, a campaign’s work', 'Lanes to compare sequences side by side', 'today to place the plan against now'],
    avoid: ['A short activity log: the Timeline list', 'Tasks with dependencies and progress: the Gantt chart', 'Many items in one lane that overlap: split the lane or leave the names to the tooltip'],
    related: ['timeline', 'chart-foundations', 'chart-reference-line', 'gantt-chart'],
    map: [[CAR, 'Charts (time series)', 'Partial'], [SPE, 'Charts', 'Partial'], [HIG, 'Charts (RuleMark, PointMark)', 'Partial']],
    variantPages: [
      vp('Timeline events', 'Variant', 'Events', { variant: 'events' }, 'Points at their dates on one track, each with its name above it.', 'Milestones and moments', 'Durations: ranges'),
      vp('Timeline ranges', 'Variant', 'Ranges', { variant: 'ranges' }, 'Bars from each period’s start to its end on one track.', 'Periods and their overlaps', 'Instants: events'),
      vp('Timeline lanes', 'Variant', 'Lanes', { variant: 'lanes' }, 'One lane per asset or team, events and ranges together, names on the start side.', 'Comparing sequences side by side', 'One sequence: a single track')
    ],
    examples: [
      ['Variant', [
        ['Events', function () { return box(560, h(P.TimelineChart, { size: 'sm', title: 'Launch video milestones', description: 'Approved four weeks after the brief.', items: EVENTS })); }, 'plx-timeline-chart--single', 'items (no end)'],
        ['Ranges', function () { return box(560, h(P.TimelineChart, { size: 'sm', title: 'Product photos', description: 'Retouching started as the studio days ended.', items: ITEMS.filter(function (i) { return i.lane === 'photos'; }).map(function (i) { return Object.assign({}, i, { lane: undefined }); }) })); }, null, 'items (with end)'],
        ['Lanes', function () { return box(720, timeline()); }, null, 'lanes']], { prop: 'items' }],
      ['Without names on the marks (the tooltip and the table keep them)', function () { return box(560, timeline({ labels: false, size: 'sm', today: undefined })); }]] };

  /* ── 07 Data Display › Specialized displays › Comparison view: ComparisonView (and 10 Patterns › Compare) ── */
  var VERSIONS = [
    { id: 'v2', title: 'Version 2', meta: '2 Oct 2026', image: { src: ART('12'), alt: 'Hero banner, version 2' }, values: { format: 'JPEG', size: '2.4 MB', width: '1920 px', height: '1080 px', color: 'sRGB', owner: 'Maya Chen' } },
    { id: 'v3', title: 'Version 3', meta: '9 Oct 2026', image: { src: ART('14'), alt: 'Hero banner, version 3' }, values: { format: 'PNG', size: '3.1 MB', width: '1920 px', height: '1080 px', color: 'Display P3', owner: 'Maya Chen' } }];
  var ATTRS = [{ key: 'format', label: 'Format' }, { key: 'size', label: 'Size', kind: 'data' }, { key: 'width', label: 'Width', kind: 'data' }, { key: 'height', label: 'Height', kind: 'data' }, { key: 'color', label: 'Color profile' }, { key: 'owner', label: 'Owner' }];
  var V4 = { id: 'v4', title: 'Version 4', meta: '14 Oct 2026', image: { src: ART('16'), alt: 'Hero banner, version 4' }, values: { format: 'PNG', size: '1.8 MB', width: '2560 px', height: '1440 px', color: 'Display P3', owner: 'Alex Kim' } };
  var compare = function (o) { return h(P.ComparisonView, Object.assign({ label: 'Compare versions of Hero banner', items: VERSIONS, attributes: ATTRS }, o)); };
  var comparisonView = { id: 'comparison-view', lab: true, icon: 'view-table', sec: 'data-display', sub: 'Specialized displays', leaf: 'Comparison view', title: 'Comparison view',
    plenix: 'ComparisonView', src: 'patterns/ComparisonView/ComparisonView.jsx', level: 'Pattern', interaction: 'Display',
    aliases: ['Compare', 'Side-by-side view', 'Version comparison', 'Before and after', 'Diff view'],
    text: 'Two to four items or versions side by side, with their differences marked. Shown as a pane per item (its name, its version or date in the data font, its preview, and its attributes in rows aligned across the panes); as the same attributes in a table with a column per item; or as two pictures over each other with a slider that moves the line between before and after. Values that differ from the first item carry a Changed badge, the count of differences heads the view, and Show only differences hides the rows that match. Panes can scroll together (scroll) and stack on a narrow view.',
    use: ['Reviewing versions of an asset, a document or a setting before approving or restoring one', 'Choosing between a few options across the same attributes', 'The slider for pictures: retouching, crops, color changes', 'Naming each pane by its version and date'],
    avoid: ['Many items compared on attributes: the comparison table', 'One item and a list of changes when that reads clearer: the version history', 'Marking differences with color alone: the badge says Changed', 'More than four panes: let people choose which to compare'],
    related: ['comparison-table', 'compare', 'badge', 'segmented-control', 'slider', 'table'],
    map: [[ATL, 'Compare (patterns)', 'Partial'], [CAR, 'Data table (comparison)', 'Partial'], [SPE, 'Compare', 'Partial'], [MAT, 'Supporting pane layouts', 'Partial'], ['Frappe', 'Version diff', 'Partial']],
    variantPages: [
      vp('Side-by-side comparison', 'Variant', 'Side by side columns', { variant: 'columns' }, 'A pane per item with its preview and its attributes in aligned rows.', 'Versions with previews', 'More than four items'),
      vp('Feature matrix comparison', 'Variant', 'Feature matrix', { variant: 'matrix' }, 'A Table with a row per attribute and a column per item; differing values carry a badge.', 'Many attributes, few items', 'Pictures that need to be seen'),
      vp('Before and after slider', 'Variant', 'Image slider (before/after)', { variant: 'slider' }, 'Two pictures over each other; a slider moves the line between before and after.', 'Retouching, crops and color changes of one picture', 'Pictures of different shapes'),
      vp('Highlighted differences', 'Variant', 'Highlight differences', { variant: 'differences' }, 'Show only differences on: only the rows that changed, each with its Changed badge.', 'Long attribute lists', 'When the matching values matter for the decision')
    ],
    examples: [
      ['Variant', [
        ['Side by side columns', function () { return box(720, compare({ modes: ['columns', 'matrix', 'slider'] })); }, null, 'mode=' + q('columns')],
        ['Feature matrix', function () { return box(720, compare({ defaultMode: 'matrix', items: VERSIONS.concat([V4]), modes: ['columns', 'matrix'] })); }, null, 'mode=' + q('matrix')],
        ['Image slider (before/after)', function () { return box(720, compare({ defaultMode: 'slider', modes: ['columns', 'slider'], defaultPosition: 40 })); }, null, 'mode=' + q('slider')],
        ['Highlight differences', function () { return box(720, compare({ defaultOnlyDifferences: true })); }, null, 'defaultOnlyDifferences']], { prop: 'mode' }],
      ['Linked scrolling: the panes scroll together (scroll)', function () { return box(720, compare({ scroll: true, items: VERSIONS.map(function (v) { return Object.assign({}, v, { content: h(P.Text, { variant: 'secondary' }, 'Exported from the brand library for the autumn campaign. The crop keeps the product centered at every width; the headline sits in the safe area.') }); }) })); }],
      ['Narrow: the panes stack', function () { return box(400, compare()); }]] };

  // 10 Patterns › Review and approval › Compare: the same ComparisonView (duplicate leaf)
  var comparePattern = { id: 'compare', icon: 'view-table', sec: 'patterns', sub: 'Review and approval', leaf: 'Compare', title: 'Compare',
    plenix: 'ComparisonView', src: 'patterns/ComparisonView/ComparisonView.jsx', level: 'Pattern', interaction: 'Display', variantClasses: [], docsFrom: 'comparison-view',
    aliases: ['Compare versions', 'Side by side', 'Diff'],
    text: 'Comparing is the comparison view (ComparisonView): two to four items or versions side by side, their attributes aligned. Differences are marked with a Changed badge and counted. It offers Show only differences for long lists, a table form, and a before-and-after slider for pictures.',
    use: ['Before approving or restoring a version: the versions side by side', 'Choosing between options on the same attributes'], avoid: ['More items than fit side by side: let people pick which to compare'],
    related: ['comparison-view', 'comparison-table'],
    map: [[ATL, 'Compare (patterns)', 'Partial'], [SPE, 'Compare', 'Partial'], ['Frappe', 'Version diff', 'Partial']],
    examples: [['Compare two versions before approving (ComparisonView)', function () { return box(720, compare({ modes: ['columns', 'matrix', 'slider'] })); }]] };

  return [barChart, comboChart, pieChart, bulletChart, boxPlotRec, radarChart, sankeyDiagram, timelineChart, comparisonView, comparePattern];
});
