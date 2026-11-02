/* Plenix design system · part w99P: DataPill (owner, 2026-10-19): a value shown as a pill, the gender pills (a person
   in blue with the male icon or in pink with the female icon; unknown: gray with the person icon) and DataGrid's pill
   view (cells="pill": every value a pill with its column's type icon). */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, box = H.box, row = H.row;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris';
  var people = [
    { id: 61, n: 'CTM-2026-00061', a: { name: 'Michael Hanna', gender: 'male' }, r: { name: 'Sarah Hanna', gender: 'female' }, d: '2026-05-09', f: 639 },
    { id: 60, n: 'CTM-2026-00060', a: { name: 'Marina Abdel-Malik', gender: 'female' }, r: { name: 'George Abdel-Malik', gender: 'male' }, d: '2026-05-10', f: 797 },
    { id: 59, n: 'CTM-2026-00059', a: { name: 'Peter Tawfik', gender: 'male' }, r: { name: 'Christine Tawfik', gender: 'female' }, d: '2026-05-11', f: 874 },
    { id: 58, n: 'CTM-2026-00058', a: { name: 'Irene Girgis', gender: 'female' }, r: { name: 'Andrew Girgis' }, d: '2026-05-16', f: 1042 }
  ];
  var band = function (v) { return v < 700 ? 'green' : v < 900 ? 'yellow' : 'red'; };
  return [
    { id: 'data-pill', sec: 'data-display', sub: 'Labels and indicators', leaf: 'Data pill', title: 'Data pill', plenix: 'DataPill', src: 'components/DataPill/DataPill.tsx',
      css: ['components/DataPill/data-pill.css'], blocks: ['plx-data-pill'], level: 'Component', interaction: 'Static', icon: 'person',
      aliases: ['Value pill', 'Data chip', 'Gender pill', 'Person pill'],
      text: 'A value shown as a pill (a case number, a person, a date, a price, an airport code, Yes or No) at the size of the text around it, with a color and an icon that say something about it. It never makes a row taller: its height is the density’s inline control height. A person carries their gender: blue with the male icon, pink with the female icon; an unknown gender keeps the default color and the person icon.',
      use: ['Values in a table that read faster as pills: codes, people, dates, times, prices, places (DataGrid cells="pill")', 'A person’s name with their gender: a pill in a table, or plain (no box) in running text and lists', 'A value band by color: a price from green to red, the hour of the day by the sun or the moon'],
      avoid: ['The gender icon beside the person’s own avatar or picture: icons never repeat; the name keeps its color and drops the icon (icon={false})', 'A keyword or a category next to content: use Tag', 'A workflow status: use Badge', 'Color as the only meaning: the icon and the words carry it too (the gender is also said to assistive technology)'],
      related: ['tag', 'badge', 'avatar', 'data-grid'],
      map: [[ATL, 'Lozenge', 'Partial'], [MAT, 'Assist chip', 'Partial'], [FLU, 'Tag', 'Partial'], [POL, 'Badge', 'Partial'], [CAR, 'Tag', 'Partial']],
      examples: [
        ['Size', [
          ['Default: the height of the text line it sits in', function () { return h(P.DataPill, { gender: 'male' }, 'Michael Hanna'); }, null, '(no size)'],
          ['md: 24px tall, 6px before the icon and 10px after the value (the pill in a table cell)', function () { return h(P.Stack, { gap: 'xs' }, h(P.DataPill, { size: 'md', gender: 'male' }, 'Michael Hanna'), h(P.DataPill, { size: 'md', gender: 'female' }, 'Marina Abdel-Malik')); }, 'plx-data-pill--md', 'size="md"']]],
        ['Gender', [
          ['Male: blue, the male icon', function () { return h(P.DataPill, { gender: 'male' }, 'Michael Hanna'); }, null, 'gender="male"'],
          ['Female: pink, the female icon', function () { return h(P.DataPill, { gender: 'female' }, 'Marina Abdel-Malik'); }, null, 'gender="female"'],
          ['Unknown: the default color and the person icon', function () { return h(P.DataPill, { person: true }, 'Jordan Lee'); }, null, 'person'],
          ['Beside a picture: the name keeps its color, never repeats the icon', function () { return h(P.Stack, { gap: 'xs' }, h(P.Inline, { gap: 'sm' }, h(P.Avatar, { name: 'Maya Chen', gender: 'female', size: 'md' }), h(P.DataPill, { variant: 'plain', gender: 'female', icon: false }, 'Maya Chen')), h(P.Inline, { gap: 'sm' }, h(P.Avatar, { name: 'Jeff Torres', gender: 'male', size: 'md' }), h(P.DataPill, { variant: 'plain', gender: 'male', icon: false }, 'Jeff Torres'))); }, null, 'icon={false}'],
          ['Plain names in running text and lists', function () { return h(P.Stack, { gap: 'xs' }, h(P.DataPill, { variant: 'plain', gender: 'female' }, 'Jessica O’Brien'), h(P.DataPill, { variant: 'plain', gender: 'male' }, 'Patrick O’Brien'), h(P.DataPill, { variant: 'plain', person: true }, 'Jordan Lee')); }, 'plx-data-pill--plain', 'variant="plain"']], { prop: 'gender' }],
        ['Variant', [
          ['Soft (default): a soft fill, a border two shades darker', function () { return row(h(P.DataPill, { data: true }, 'CTM-2026-00061'), h(P.DataPill, { tone: 'orange', icon: 'calendar' }, 'Sat May 9'), h(P.DataPill, { tone: 'green' }, 'Yes')); }, 'plx-data-pill--soft', 'variant="soft"'],
          ['Solid: the color as the fill (a strong value)', function () { return row(h(P.DataPill, { tone: 'green', variant: 'solid', data: true }, '$639'), h(P.DataPill, { tone: 'yellow', variant: 'solid', data: true }, '$797'), h(P.DataPill, { tone: 'red', variant: 'solid', data: true }, '$1,042'), h(P.DataPill, { tone: 'purple', variant: 'solid', data: true }, 'CPH')); }, 'plx-data-pill--solid', 'variant="solid"']], { prop: 'variant' }],
        ['Content', [
          ['Data: a technical value in the data font', function () { return row(h(P.DataPill, { data: true }, 'CTM-2026-00060'), h(P.DataPill, { tone: 'blue', icon: 'clock', data: true }, '9:45am')); }, 'plx-data-pill--data', 'data'],
          ['Fill: the whole width of its cell', function () { return box(240, h(P.DataPill, { gender: 'female', fill: true }, 'Christine Tawfik')); }, 'plx-data-pill--fill', 'fill']], { prop: 'data' }],
        ['Table (static): the pill view, cells="pill": every value a pill with its column’s icon; people by gender; a price band by color; in each column every pill is as wide as its widest (always on, owner uniform-pills-always-35). DataGrid (the grid) takes the same option', function () {
          return box(860, h(P.Table, { label: 'Cases', cells: 'pill', data: people, columns: [
            { field: 'n', title: 'Case #', kind: 'data' },
            { field: 'a', title: 'Applicant', type: 'person' },
            { field: 'r', title: 'Respondent', type: 'person' },
            { field: 'd', title: 'Hearing', type: 'date' },
            { field: 'f', title: 'Fee', type: 'currency', pill: function (v) { return { tone: band(v), variant: 'solid' }; } }] }));
        }]] }

  ];
});
