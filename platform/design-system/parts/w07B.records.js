/* Plenix design system · library part w07B (wave 7, lane B): MillerColumns (Miller columns), Cascader, EntityPicker
   (Entity picker, and its people preset: People picker), TimePicker (Time picker), RelativeDateInput (Relative date
   input), LoadMore (Load more / infinite scroll), and the patterns ImageUpload (Image upload, with ImageCrop) and
   AvatarUpload (Avatar upload). Every color is an existing role. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, box = H.box, use = H.use, noop = H.noop, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', ANT = 'Ant Design';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var frame = function (cls, child) { return h('div', { 'data-ds-wrap': true, className: 'ds-w07b-' + cls }, child); };
  var ART = function (n) { return '../../dam/assets/thumb-' + n + '.svg'; };

  /* ── shared demo data ── */
  var file = function (id, label, icon, description) { return { id: id, label: label, icon: icon || 'ed-image', description: description }; };
  var ASSETS = [
    { id: 'brand', label: 'Brand', icon: 'folder', children: [
      { id: 'logos', label: 'Logos', icon: 'folder', children: [file('logo-full', 'Parish logo, full color', 'ed-image', 'Vector logo'), file('logo-mono', 'Parish logo, one color', 'ed-image', 'Vector logo'), file('wordmark', 'Wordmark', 'ed-image', 'Vector logo')] },
      { id: 'colors', label: 'Colors', icon: 'folder', children: [file('palette', 'Palette', 'document', 'Print guide')] },
      { id: 'type', label: 'Typefaces', icon: 'folder', children: [] }] },
    { id: 'campaigns', label: 'Campaigns', icon: 'folder', children: [
      { id: 'easter', label: 'Easter 2026', icon: 'folder', children: [file('banner-north', 'Banner, north aisle'), file('banner-south', 'Banner, south aisle'), file('poster', 'Poster A3')] },
      { id: 'advent', label: 'Advent 2025', icon: 'folder', children: [file('wreath', 'Wreath photo'), file('calendar', 'Calendar', 'document', 'Print guide')] }] },
    { id: 'archive', label: 'Archive', icon: 'archive', children: [file('scan-1919', 'Scan of the first register', 'ed-image', 'Archive scan'), file('scan-1952', 'Scan of the second register', 'ed-image', 'Archive scan')] },
    file('readme', 'Read me', 'document', 'Plain text')
  ];
  var REGIONS = [
    { id: 'europe', label: 'Europe', children: [
      { id: 'france', label: 'France', children: [{ id: 'paris', label: 'Paris' }, { id: 'lyon', label: 'Lyon' }, { id: 'lille', label: 'Lille' }] },
      { id: 'germany', label: 'Germany', children: [{ id: 'berlin', label: 'Berlin' }, { id: 'munich', label: 'Munich' }] },
      { id: 'italy', label: 'Italy', children: [{ id: 'rome', label: 'Rome' }, { id: 'milan', label: 'Milan' }] }] },
    { id: 'americas', label: 'Americas', children: [
      { id: 'us', label: 'United States', children: [{ id: 'new-york', label: 'New York' }, { id: 'chicago', label: 'Chicago' }, { id: 'boston', label: 'Boston' }] },
      { id: 'canada', label: 'Canada', children: [{ id: 'toronto', label: 'Toronto' }, { id: 'montreal', label: 'Montreal' }] }] },
    { id: 'asia', label: 'Asia Pacific', children: [
      { id: 'japan', label: 'Japan', children: [{ id: 'tokyo', label: 'Tokyo' }] },
      { id: 'australia', label: 'Australia', children: [{ id: 'sydney', label: 'Sydney' }, { id: 'melbourne', label: 'Melbourne' }] }] }
  ];
  var PEOPLE = [
    { value: 'mc', label: 'Maya Chen', description: 'maya.chen@example.org', presence: 'online' },
    { value: 'ak', label: 'Alex Kim', description: 'alex.kim@example.org', presence: 'away' },
    { value: 'rm', label: 'Jordan Avery', description: 'jordan.avery@example.com' },
    { value: 'pn', label: 'Priya Nair', description: 'priya.nair@example.org', presence: 'busy' },
    { value: 'jw', label: 'Jonas Weber', description: 'jonas.weber@example.org' },
    { value: 'sr', label: 'Sofia Rossi', description: 'sofia.rossi@example.org' },
    { value: 'mc2', label: 'Maya Chen', description: 'maya.chen@parish.example' }
  ];
  var TEAMS = [
    { value: 'brand', label: 'Brand team', description: 'Design and print', meta: '8 people' },
    { value: 'web', label: 'Web team', description: 'Site and newsletter', meta: '5 people' },
    { value: 'archive', label: 'Archive volunteers', description: 'Scanning and cataloging', meta: '12 people' },
    { value: 'office', label: 'Parish office', description: 'Bookings and records', meta: '4 people' }
  ];
  var PROJECTS = [
    { value: 'p1042', label: 'Easter campaign', description: 'Campaigns · Brand team', meta: 'PRJ-1042', icon: 'briefcase' },
    { value: 'p1043', label: 'North aisle banners', description: 'Print · Brand team', meta: 'PRJ-1043', icon: 'briefcase' },
    { value: 'p0998', label: 'Archive scanning', description: 'Archive · ongoing', meta: 'PRJ-0998', icon: 'briefcase' },
    { value: 'p1051', label: 'Website refresh', description: 'Web · Web team', meta: 'PRJ-1051', icon: 'briefcase' },
    { value: 'p1060', label: 'Easter campaign, print', description: 'Print · Parish office', meta: 'PRJ-1060', icon: 'briefcase' }
  ];

  /* ── 06 Navigation › Hierarchical navigation › Miller columns: MillerColumns ── */
  var Preview = function (props) {
    var it = props.item;
    return h(P.Stack, { gap: 'sm' }, h(P.Image, { src: ART(it.id.length % 2 ? '12' : '14'), alt: '', ratio: '4-3' }),
      h(P.Text, { as: 'p', variant: 'heading' }, it.label), it.description ? h(P.Text, { as: 'p', variant: 'secondary' }, it.description) : null);
  };
  var Miller = function (props) {
    var s = use(props.start || ['campaigns', 'easter', 'banner-north']), w = use([]);
    return box(props.width || 720, h(P.MillerColumns, Object.assign({ label: 'Assets', items: ASSETS, path: s[0], onPathChange: s[1], onOpen: noop,
      columnWidths: props.resizable ? w[0] : undefined, onColumnWidthsChange: props.resizable ? w[1] : undefined }, props.mc)));
  };
  var preview = { renderPreview: function (item) { return h(Preview, { item: item }); } };
  var millerColumns = { id: 'miller-columns', lab: true, icon: 'view-table', sec: 'navigation', sub: 'Hierarchical navigation', leaf: 'Miller columns', title: 'Miller columns',
    plenix: 'MillerColumns', src: 'components/MillerColumns/MillerColumns.jsx', level: 'Component', interaction: 'Navigation',
    aliases: ['Column view', 'Cascading lists', 'Finder columns', 'Column browser'],
    text: 'A deep hierarchy browsed in columns side by side: choosing an item lists its children in the next column, so the whole path stays in view and each level keeps its place. Each column is a listbox named by its parent; Arrow Up and Down choose in a column (the children open at once), Arrow Right moves into them, Arrow Left back. An optional preview column shows the chosen item; with resizable, each column’s edge moves in 40px steps.',
    use: ['Browsing deep folder, category or location trees on wide windows', 'A preview column when people check what they found before opening it', 'Resizable columns when names are long'],
    avoid: ['Narrow windows: show one level at a time (drilldown navigation)', 'Flat lists or two short levels: use a list or a tree', 'Choosing a value in a form: use Cascader'],
    related: ['tree-view', 'breadcrumbs', 'cascader'],
    map: [[SPE, 'Column view (macOS pattern)', 'Partial'], [FLU, 'Tree (column layout)', 'Partial'], [CAR, 'Tree view', 'Partial']],
    variantPages: [
      vp('Miller columns', 'Layout', 'Columns (default)', { variant: 'plain' }, 'A column per level, the chosen path in the selected fill; each column scrolls on its own and the newest scrolls into view.', 'Browsing a deep hierarchy on a wide window', 'Narrow windows: use drilldown navigation'),
      vp('Miller columns with a preview', 'Layout', 'With preview column', { variant: 'preview' }, 'The chosen leaf shown in a last column: its picture, name and details.', 'File and asset browsers where people check an item before opening it', 'Previews people never look at: they take a column of room'),
      vp('Resizable Miller columns', 'Layout', 'Resizable', { variant: 'resizable' }, 'An edge after each column people drag, or move with the arrow keys, in six steps from 160 to 360 pixels.', 'Long names that are cut off at the default width', 'A width that changes by the pixel: the steps keep columns on the grid'),
      vp('Miller columns with the keyboard', 'Behavior', 'Keyboard', { content: 'keyboard' }, 'The column in focus outlines its chosen row: Arrow Up and Down choose, Right moves into the children, Left back, Enter opens, a letter jumps.', 'Every column view: the keys are the same in each', 'Moving focus to each row: the column keeps one Tab stop')
    ],
    examples: [
      ['Layout', [['Columns (default)', function () { return h(Miller, {}); }, null, 'MillerColumns'],
        ['With preview column', function () { return h(Miller, { mc: preview, width: 900 }); }, null, 'renderPreview'],
        ['Resizable', function () { return h(Miller, { resizable: true, mc: { resizable: true } }); }, 'plx-miller-columns--resizable', 'resizable']]],
      ['Behavior', [['Keyboard', function () { return h(Miller, { start: ['brand', 'logos'] }); }, null, 'Arrow keys, Enter'],
        ['With checkboxes', function () { return h(Miller, { start: ['europe', 'france'], mc: { label: 'Offices', items: REGIONS, checked: ['paris', 'lyon'] } }); }, 'plx-miller-columns--checks', 'checked']]]] };

  /* ── 05 Forms › Select and lookup › Cascader ── */
  var Casc = function (props) {
    var s = use(props.multiple ? (props.start || ['paris', 'berlin']) : (props.start || 'lyon'));
    var c = Object.assign({ options: REGIONS, label: 'Office' }, props.c, props.multiple ? { values: s[0], onChange: s[1] } : { value: s[0], onChange: function (v) { s[1](v); } });
    return frame('popup', box(360, h(P.Field, { label: props.multiple ? 'Offices' : 'Office', error: props.error }, h(P.Cascader, c))));
  };
  var cascader = { id: 'cascader', lab: true, icon: 'list-lines', sec: 'forms', sub: 'Select and lookup', leaf: 'Cascader', title: 'Cascader',
    plenix: 'Cascader', src: 'components/Cascader/Cascader.jsx', level: 'Component', interaction: 'Selection',
    aliases: ['Cascading select', 'Hierarchical select', 'Nested select', 'Drill-down select'],
    text: 'A form field whose value is a leaf of a hierarchy (region, country, city), chosen level by level in columns that open under the field; the field shows the whole path, “Europe / France / Paris”. The columns are MillerColumns: parents open on a click (or as the pointer rests on them, expandTrigger="hover"), a leaf is the value. Search finds leaves at every level by name and lists them with their paths; multiple checks several leaves, shown as tags.',
    use: ['Hierarchies of two to four levels where only the last level is a valid answer', 'Each level short enough to scan (up to about 15 items)', 'Search when people know the name but not where it sits'],
    avoid: ['Flat lists: use a select or a combobox', 'When people must see the whole tree at once: use a tree', 'Values in the middle of the hierarchy: a cascader chooses leaves only'],
    related: ['miller-columns', 'combobox', 'native-select', 'field'],
    map: [[ANT, 'Cascader', 'Direct'], [ATL, 'Select (nested)', 'Partial'], [CAR, 'Dropdown', 'Partial']],
    variantPages: [
      vp('Cascader opened by a click', 'Trigger', 'Click (default)', { variant: 'click' }, 'A parent opens its children in the next column when it is chosen, by a click or the arrow keys.', 'Most cascaders', 'Levels people skim quickly with the pointer: hover can be faster'),
      vp('Cascader opened on hover', 'Trigger', 'Hover', { variant: 'hover' }, 'Resting the pointer on a parent opens its children; a click on a leaf chooses it. The keys work as with click.', 'Short levels people move through quickly with a mouse', 'Touch screens, where there is no hover: the click works there anyway'),
      vp('Cascader with search', 'Search', 'Search', { variant: 'search' }, 'A search field at the top of the list: typing lists every matching leaf with its path, as one listbox.', 'Large hierarchies where people know the name', 'Short hierarchies: the columns are enough'),
      vp('Cascader with several values', 'Choice', 'Multiple', { variant: 'multiple' }, 'Each leaf with a checkbox; the chosen leaves as tags in the field, each with its remove button.', 'Several offices, categories or locations at once', 'One value: keep the single field')
    ],
    examples: [
      ['Trigger', [['Click (default)', function () { return h(Casc, {}); }, null, 'expandTrigger="click"'], ['Hover', function () { return h(Casc, { c: { expandTrigger: 'hover' } }); }, null, 'expandTrigger="hover"']], { prop: 'expandTrigger' }],
      ['Search', [['Search', function () { return h(Casc, { c: { searchable: true } }); }, null, 'searchable']]],
      ['Choice', [['Multiple', function () { return h(Casc, { multiple: true, c: { multiple: true } }); }, 'plx-cascader--multiple', 'multiple']]],
      // issue 814: each region's countries load when it is opened (as from a server, after 700ms)
      ['Loading', [['Children that load when opened', function () { return h(Casc, { start: '', c: { options: [{ id: 'eu', label: 'Europe', hasChildren: true }, { id: 'af', label: 'Africa', hasChildren: true }],
        loadChildren: function (n) { return new Promise(function (ok) { setTimeout(function () { ok((n.id === 'eu' ? ['France', 'Italy'] : ['Egypt', 'Kenya']).map(function (x) { return { id: n.id + '-' + x, label: x }; })); }, 700); }); } } }); }, null, 'loadChildren']]],
      ['State', [['Empty', function () { return h(Casc, { start: '' }); }, null, 'placeholder'], ['Invalid', function () { return h(Casc, { start: '', error: 'Choose an office.' }); }, null, 'invalid'],
        ['Disabled', function () { return h(Casc, { c: { disabled: true } }); }, null, 'disabled']]]] };

  /* ── 05 Forms › Select and lookup › Entity picker and People picker: EntityPicker ── */
  var Pick = function (props) {
    var s = use(props.multiple ? (props.start || []) : (props.start === undefined ? '' : props.start));
    var e = Object.assign({}, props.e, props.multiple ? { multiple: true, values: s[0], onChange: s[1] } : { value: s[0], onChange: function (v) { s[1](v); } });
    return frame('popup', box(400, h(P.Field, { label: props.label, error: props.error }, h(P.EntityPicker, e))));
  };
  var entityPicker = { id: 'entity-picker', lab: true, icon: 'doc-search', sec: 'forms', sub: 'Select and lookup', leaf: 'Entity picker', title: 'Entity picker',
    plenix: 'EntityPicker', src: 'components/EntityPicker/EntityPicker.jsx', level: 'Component', interaction: 'Selection',
    aliases: ['Record picker', 'Lookup field', 'Reference field', 'Relation picker', 'Object picker'],
    text: 'A search-and-choose field that links a record to other records of one kind: projects, assets, teams or people. Each suggestion shows enough to tell similar records apart: the record’s icon tile (or a person’s avatar), its name, a detail line and a technical value such as an ID in the data font. It is the WAI-ARIA combobox: results filter as people type (or come from loadOptions for a large directory), their number is announced, and Browse all opens a dialog when search alone is not enough.',
    use: ['Linking a record to another: a task to its project, an asset to its campaign', 'Collections too large to list: search by name or ID', 'kind="people" for people (the people picker), kind="teams" for teams'],
    avoid: ['A few fixed choices: use a select', 'Values that are not records: use a combobox', 'Showing only names when several records share one'],
    related: ['people-picker', 'combobox', 'async-select', 'profile-summary', 'field'],
    map: [[FLU, 'Tag picker', 'Partial'], [ATL, 'Select', 'Partial'], [CAR, 'Combo box', 'Partial'], [POL, 'Autocomplete', 'Partial']],
    variantPages: [
      vp('People entity picker', 'Kind', 'People', { variant: 'people' }, 'The person’s avatar with presence, their name and email: the people picker.', 'Assigning, sharing, mentioning, inviting', 'Teams or records: their own kinds'),
      vp('Team entity picker', 'Kind', 'Teams', { variant: 'teams' }, 'A team icon tile, the team’s name, what it does and its size.', 'Sharing with or assigning to a group', 'Single people: use people'),
      vp('Record entity picker', 'Kind', 'Records (default)', { variant: 'records' }, 'The record’s icon tile, its name, a detail line and its ID in the data font.', 'Projects, assets, accounts and other records', 'People: use people'),
      vp('Single entity picker', 'Choice', 'Single', { content: 'single' }, 'One record; the field shows its icon or avatar before its name.', 'A record’s one owner or parent', 'Several links: use multiple'),
      vp('Multiple entity picker', 'Choice', 'Multiple', { content: 'multiple' }, 'Several records as tags in the field, each with its remove button; the list stays open while choosing.', 'Reviewers, watchers, related records', 'One required value')
    ],
    examples: [
      ['Kind', [['People', function () { return h(Pick, { label: 'Owner', start: 'mc', e: { kind: 'people', options: PEOPLE } }); }, null, 'kind=' + q('people')],
        ['Teams', function () { return h(Pick, { label: 'Team', start: 'brand', e: { kind: 'teams', options: TEAMS } }); }, null, 'kind=' + q('teams')],
        ['Records (default)', function () { return h(Pick, { label: 'Project', e: { entityName: 'projects', options: PROJECTS, onBrowse: noop } }); }, null, 'entityName=' + q('projects')]], { prop: 'kind' }],
      ['Choice', [['Single', function () { return h(Pick, { label: 'Project', start: 'p1042', e: { entityName: 'projects', options: PROJECTS } }); }, null, 'value'],
        ['Multiple', function () { return h(Pick, { label: 'Reviewers', multiple: true, start: ['mc', 'pn'], e: { kind: 'people', options: PEOPLE } }); }, 'plx-entity-picker--multiple', 'multiple']]],
      ['State', [['Invalid', function () { return h(Pick, { label: 'Project', error: 'Choose a project.', e: { entityName: 'projects', options: PROJECTS } }); }, null, 'invalid'],
        ['Disabled', function () { return h(Pick, { label: 'Project', start: 'p1042', e: { entityName: 'projects', options: PROJECTS, disabled: true } }); }, null, 'disabled'],
        ['Loading from a directory', function () { return h(Pick, { label: 'Owner', e: { kind: 'people', loadOptions: function (t) { return new Promise(function (r) { setTimeout(function () { r(PEOPLE.filter(function (p) { return (p.label + ' ' + p.description).toLowerCase().indexOf(t.toLowerCase()) >= 0; })); }, 600); }); } } }); }, null, 'loadOptions']]]] };
  var peoplePicker = { id: 'people-picker', icon: 'person', sec: 'forms', sub: 'Select and lookup', leaf: 'People picker', title: 'People picker',
    plenix: 'EntityPicker kind="people"', src: 'components/EntityPicker/EntityPicker.jsx', level: 'Component', interaction: 'Selection', statesFrom: ['entity-picker'], variantClasses: [], docsFrom: 'entity-picker',
    aliases: ['User picker', 'Person picker', 'Assignee picker', 'Member picker'], related: ['entity-picker', 'profile-summary', 'avatar'],
    text: 'The people picker is EntityPicker with kind="people": people search by name or email, and each suggestion shows the person’s avatar (with their presence), name and email, so two people with the same name can be told apart. It takes one person, or several as removable tags. A large directory loads as people type (loadOptions), and the number of people found is announced.',
    use: ['Assigning, sharing with, mentioning or inviting people', 'Always the email (or a role) as the second line', 'loadOptions for a directory too large to list'],
    avoid: ['Teams or records: use the entity picker with their kind', 'A handful of known people: use a select'],
    map: [[FLU, 'People picker', 'Direct'], [ATL, 'User picker', 'Direct']],
    examples: [['People', [['One person', function () { return h(Pick, { label: 'Owner', start: 'mc', e: { kind: 'people', options: PEOPLE } }); }, null, 'kind=' + q('people')],
      ['Several people', function () { return h(Pick, { label: 'Reviewers', multiple: true, start: ['ak', 'rm'], e: { kind: 'people', options: PEOPLE } }); }, null, 'kind=' + q('people') + ' multiple']]]] };

  /* ── 05 Forms › Date, time, and color › Time picker: TimePicker ── */
  var Time = function (props) {
    var s = use(props.start === undefined ? '14:30' : props.start);
    return frame('popup', box(240, h(P.Field, { label: props.label || 'Start time', description: props.description, error: props.error }, h(P.TimePicker, Object.assign({ value: s[0], onChange: s[1] }, props.t)))));
  };
  var timePicker = { id: 'time-picker', lab: true, icon: 'clock', sec: 'forms', sub: 'Date, time, and color', leaf: 'Time picker', title: 'Time picker',
    plenix: 'TimePicker', src: 'components/TimePicker/TimePicker.jsx', level: 'Component', interaction: 'Input',
    aliases: ['Time field', 'Time input', 'Time selector', 'Clock picker'],
    text: 'A time of day, typed or chosen, on the reader’s clock (12 or 24 hours) and in the data font. The list form is a field people type in (“2pm”, “14:30”, “1430”), with the times at each step (15 minutes by default) in a list under it; the segments form has a spin button for the hour, the minute and the period. The value is always “HH:MM” on a 24-hour clock, whatever the reader sees; min and max keep it inside the hours that are allowed.',
    use: ['Meeting times, schedules and deadlines', 'A step that matches the task: 15 or 30 minutes for meetings, 1 minute where exact times matter', 'The time zone in the description when people in several zones use the data'],
    avoid: ['Durations: use a number input with a unit', 'A list of every minute: use a step, or the segments', 'A clock dial alone: people must be able to type'],
    related: ['number-input', 'text-field', 'field'],
    map: [[CAR, 'Time picker', 'Direct'], [ATL, 'Date time picker (time)', 'Direct'], [MAT, 'Time pickers', 'Direct'], [FLU, 'Time picker', 'Direct'], [SPE, 'Time field', 'Direct'], [ANT, 'TimePicker', 'Direct']],
    variantPages: [
      vp('Time picker with a list', 'Form', 'List (default)', { variant: 'list' }, 'A field people type in, with the times at each step in a list under it.', 'Most times in forms: people type or pick', 'Times to the minute in a long day: the list gets long; use the segments'),
      vp('Time picker in segments', 'Form', 'Segments', { variant: 'segments' }, 'Spin buttons for the hour, the minute and the period: arrows step them, digits type them.', 'Exact times, and keyboards without pointer use', 'Choosing among a few set times: use the list'),
      vp('12-hour time picker', 'Clock', '12-hour clock', { content: 'h12' }, 'Hours 1 to 12 with AM and PM, as in the United States.', 'Readers whose locale uses a 12-hour clock (the default follows the locale)', 'Forcing 12 hours on readers who use 24'),
      vp('24-hour time picker', 'Clock', '24-hour clock', { content: 'h24' }, 'Hours 00 to 23, no period.', 'Readers whose locale uses a 24-hour clock, and technical schedules', 'Forcing 24 hours on readers who use 12'),
      vp('Time picker with a 30-minute step', 'Step', 'Every 30 minutes', { content: 'step' }, 'The list offers every half hour between min and max.', 'Bookings and meetings that start on the half hour', 'Times people need to the minute')
    ],
    examples: [['Width (a field used alone is never wider than its container; P-52)', [['XS (48px)', function () { return box(360, h(P.TimePicker, { width: 'xs', label: 'Start time' })); }, 'plx-time-picker--width-xs', 'width="xs"'], ['SM (80px)', function () { return box(360, h(P.TimePicker, { width: 'sm', label: 'Start time' })); }, 'plx-time-picker--width-sm', 'width="sm"'], ['MD (100px)', function () { return box(360, h(P.TimePicker, { width: 'md', label: 'Start time' })); }, 'plx-time-picker--width-md', 'width="md"'], ['LG (220px)', function () { return box(360, h(P.TimePicker, { width: 'lg', label: 'Start time' })); }, 'plx-time-picker--width-lg', 'width="lg"'], ['Fill: the whole width', function () { return box(360, h(P.TimePicker, { width: 'fill', label: 'Start time' })); }, 'plx-time-picker--width-fill', 'width="fill"']], { prop: 'width' }],
      
      ['Form', [['List (default)', function () { return h(Time, {}); }, null, 'variant=' + q('list')], ['Segments', function () { return h(Time, { t: { variant: 'segments' } }); }, 'plx-time-picker--segments', 'variant=' + q('segments')]], { prop: 'variant' }],
      ['Clock', [['12-hour clock', function () { return h(Time, { t: { hourCycle: '12' } }); }, null, 'hourCycle=' + q('12')], ['24-hour clock', function () { return h(Time, { t: { hourCycle: '24' } }); }, null, 'hourCycle=' + q('24')]], { prop: 'hourCycle' }],
      ['Step', [['Every 30 minutes', function () { return h(Time, { label: 'Booking', description: 'Between 8:00 AM and 6:00 PM', t: { step: 30, min: '08:00', max: '18:00' } }); }, null, 'step={30} min max']]],
      ['State', [['Empty', function () { return h(Time, { start: '' }); }, null, 'value=""'], ['Invalid', function () { return h(Time, { error: 'Choose a time after the start.' }); }, null, 'invalid'],
        ['Disabled', function () { return h(Time, { t: { disabled: true } }); }, null, 'disabled']]]] };

  /* ── 05 Forms › Date, time, and color › Relative date input: RelativeDateInput ── */
  var NOW = '2026-03-07T12:00:00';
  var Rel = function (props) {
    var s = use(props.start === undefined ? 'last-7-days' : props.start);
    return box(560, h(P.Field, { label: props.label || 'Modified' }, h(P.RelativeDateInput, Object.assign({ value: s[0], onChange: function (v) { s[1](v); }, now: NOW }, props.r))));
  };
  var relativeDateInput = { id: 'relative-date-input', lab: true, icon: 'calendar', sec: 'forms', sub: 'Date, time, and color', leaf: 'Relative date input', title: 'Relative date input',
    plenix: 'RelativeDateInput, resolveRelativeDate', src: 'components/RelativeDateInput/RelativeDateInput.tsx', level: 'Component', interaction: 'Input', statesFrom: ['native-select', 'number-input'],
    aliases: ['Rolling date range', 'Relative date filter', 'Date preset', 'Dynamic date'],
    text: 'A date range counted from today, for filters, saved searches and rules that must stay right as time passes: a preset (Last 7 days, Next 30 days) or a custom amount and unit (the last 3 months). The dates it means today are written under it in the data font, so people can check them; the value stays relative (a preset id or { direction, amount, unit }) and resolveRelativeDate turns it into dates when it is used.',
    use: ['Filters, saved views and automation rules where a rolling window is what people mean', 'The presets people use most first; Custom for the rest', 'Storing the relative value, never the dates it resolved to'],
    avoid: ['A fixed date such as a contract date: use a date picker', 'Free text that cannot be shown back clearly', 'Hiding the resolved dates'],
    related: ['native-select', 'number-input', 'filter-bar', 'field'],
    map: [[ATL, 'Date range (relative presets)', 'Partial'], [ANT, 'RangePicker presets', 'Partial']],
    variantPages: [
      vp('Relative date input, past presets', 'Direction', 'Past presets (default)', { variant: 'past' }, 'Today, Yesterday, Last 7, 30 and 90 days, Last 12 months, and Custom.', 'Filters on what already happened: modified, created, sent', 'Due dates and plans: use future'),
      vp('Relative date input, future presets', 'Direction', 'Future presets', { variant: 'future' }, 'Today, Tomorrow, Next 7, 30 and 90 days, Next 12 months, and Custom.', 'Due dates, bookings and plans', 'History: use past'),
      vp('Relative date input, custom range', 'Direction', 'Custom n units', { variant: 'custom' }, 'The amount (a NumberInput in the data font) and the unit (days, weeks, months, years) beside the preset.', 'Windows the presets do not cover: the last 3 weeks', 'A custom range for a preset that exists')
    ],
    examples: [
      ['Direction', [['Past presets (default)', function () { return h(Rel, {}); }, null, 'direction=' + q('past')],
        ['Future presets', function () { return h(Rel, { label: 'Due', start: 'next-30-days', r: { direction: 'future' } }); }, null, 'direction=' + q('future')],
        ['Custom n units', function () { return h(Rel, { label: 'Created', start: { direction: 'past', amount: 3, unit: 'week' } }); }, 'plx-relative-date-input--custom', '{ direction, amount, unit }'],
        ['Both directions', function () { return h(Rel, { label: 'Date', start: { direction: 'future', amount: 2, unit: 'month' }, r: { direction: 'both' } }); }, null, 'direction=' + q('both')]], { prop: 'direction' }],
      ['State', [['Any time (empty)', function () { return h(Rel, { start: '' }); }, null, 'value=""'], ['Disabled', function () { return h(Rel, { r: { disabled: true } }); }, null, 'disabled']]]] };

  /* ── 06 Navigation › Content navigation › Load more / infinite scroll: LoadMore ── */
  var NAMES = ['Banner, north aisle', 'Banner, south aisle', 'Poster A3', 'Wreath photo', 'Calendar', 'Scan, 1919', 'Scan, 1952', 'Parish logo', 'Wordmark', 'Palette', 'Easter cross', 'Gold leaf border'];
  var Feed = function (props) {
    var n = use(props.start || 4), busy = use(false), total = props.total || (props.infinite ? 40 : 12), area = React.useRef(null);
    var more = function () { busy[1](true); setTimeout(function () { busy[1](false); n[1](function (x) { return Math.min(total, x + 4); }); }, 700); };
    var list = h(P.List, { label: 'Assets', items: Array.from({ length: n[0] }, function (x, i) { return { icon: 'ed-image', children: NAMES[i % NAMES.length] + (i < NAMES.length ? '' : ', copy ' + Math.ceil((i + 1 - NAMES.length) / NAMES.length)) }; }) });
    var lm = h(P.LoadMore, Object.assign({ onLoadMore: more, loading: props.loading || busy[0], hasMore: n[0] < total, shown: n[0], total: total, pageSize: 4 }, props.infinite ? { mode: 'infinite', root: area } : {}));
    if (props.infinite) return box(360, h('div', { ref: area, className: 'ds-w07b-scroll', tabIndex: 0, role: 'region', 'aria-label': 'Assets, loading as you scroll' }, list, lm));
    return box(360, h(P.Stack, { gap: 'xs' }, list, lm));
  };
  // LoadMore is drawn on the Pagination page (inventory.js), with this part's feed
  H.addExamples('pagination', [['Mode', [['Button (default)', function () { return h(Feed, {}); }, null, 'mode=' + q('button')], ['Infinite (sentinel)', function () { return h(Feed, { infinite: true }); }, 'plx-load-more--infinite', 'mode=' + q('infinite')]], { prop: 'mode' }],
    ['State', [['Loading', function () { return h(Feed, { loading: true }); }, null, 'loading'], ['End of list', function () { return h(Feed, { start: 12, total: 12 }); }, null, 'hasMore={false}']]]]);

  /* ── 05 Forms › File and media input › Image upload: ImageUpload, ImageCrop ── */
  var pic = function (n, name, size) { return { id: 'demo-' + n, url: ART(n), name: name, size: size, alt: '' }; };
  var Upload = function (props) {
    var s = use(props.start || []);
    return box(props.width || 400, h(P.Field, { label: props.label || 'Cover image', description: props.description }, h(P.ImageUpload, Object.assign({ value: s[0], onChange: s[1] }, props.u))));
  };
  var Crop = function () { var done = use(''); return box(360, h(P.Stack, { gap: 'sm' }, h(P.ImageCrop, { src: ART('14'), ratio: '16-9', onApply: function () { done[1]('Applied'); }, onCancel: noop }), done[0] ? h(P.Text, { as: 'p', variant: 'secondary' }, done[0]) : null)); };
  var imageUpload = { id: 'image-upload', lab: true, icon: 'ed-image', sec: 'forms', sub: 'File and media input', leaf: 'Image upload', title: 'Image upload',
    plenix: 'ImageUpload, ImageCrop', src: 'patterns/ImageUpload/ImageUpload.jsx', level: 'Pattern', interaction: 'Input',
    aliases: ['Image uploader', 'Photo upload', 'Image picker', 'Picture input'],
    text: 'Adds images and shows a preview of each before they are saved, built from Platform components. A DropZone takes the images, with a Choose button (the browser’s file input) as the keyboard way in. Each image then shows as a preview (Image) with its name and size in the data font, Replace and Remove, and a Description field for its alt text when others will see it. A fixed ratio keeps every preview in one shape (aspect locked). With crop, ImageCrop opens before an image is kept: people zoom and move the picture in the frame, and the cropped picture is what is saved.',
    use: ['Covers, product photos and attachments where the look matters', 'A ratio (and crop) wherever the picture is shown in a fixed shape', 'The formats and the size people should use in the description', 'Alt text for images other people will see'],
    avoid: ['Files that are not images: use a file input', 'Profile pictures: use the avatar upload', 'Drag and drop as the only way in: the Choose button is always there'],
    related: ['file-input', 'drop-zone', 'image', 'avatar-upload'],
    map: [[POL, 'Drop zone (image)', 'Variant'], [CAR, 'File uploader', 'Partial'], [SPE, 'Drop zone', 'Partial'], [ANT, 'Upload (picture card)', 'Direct']],
    variantPages: [
      vp('Single image upload', 'Images', 'Single (default)', { variant: 'single' }, 'One image: the drop zone until it is chosen, then its preview with Replace and Remove.', 'A cover, a header image, one photo', 'Several photos of one thing: use multiple'),
      vp('Multiple image upload', 'Images', 'Multiple', { variant: 'multiple' }, 'A grid of square previews, each with its remove button, and the drop zone after them until the maximum.', 'Product photos, galleries', 'One image people replace'),
      vp('Image upload with crop', 'Shape', 'With crop', { variant: 'crop' }, 'Each chosen image opens in ImageCrop: drag or use the arrow keys to move it, Zoom to enlarge it, Apply to keep the crop.', 'Pictures shown in a fixed shape where the subject matters', 'Pictures shown whole: skip the crop'),
      vp('Aspect-locked image upload', 'Shape', 'Aspect locked', { variant: 'locked' }, 'Previews in one ratio (16:9 here); other shapes are cut at the edges in the preview.', 'Covers and banners of a fixed shape', 'Pictures shown in their own shape: keep auto')
    ],
    examples: [
      ['Images', [['Single (default)', function () { return h(Upload, { u: { maxSize: 5000000, description: 'PNG or JPG, up to 5 MB' } }); }, null, 'ImageUpload'],
        ['Multiple', function () { return h(Upload, { label: 'Product photos', width: 560, start: [pic('12', 'chair-front.svg', 48213), pic('14', 'chair-side.svg', 51022)], u: { multiple: true, max: 6 } }); }, 'plx-image-upload--multiple', 'multiple max']]],
      ['Shape', [['With crop', function () { return h(Crop); }, null, 'crop (ImageCrop)'],
        ['Aspect locked', function () { return h(Upload, { start: [pic('16', 'easter-banner.svg', 120400)], u: { ratio: '16-9', altText: true } }); }, 'plx-image-upload--locked', 'ratio=' + q('16-9')]]],
      ['Content', [['Chosen, with a description', function () { return h(Upload, { start: [pic('12', 'north-aisle.svg', 48213)], u: { altText: true } }); }, null, 'altText']]]] };

  /* ── 05 Forms › File and media input › Avatar upload: AvatarUpload ── */
  var Av = function (props) {
    var s = use(props.src);
    return box(400, h(P.Field, { label: props.label || 'Profile photo' }, h(P.AvatarUpload, Object.assign({ name: props.name || 'Maya Chen', src: s[0], description: 'At least 200 × 200 pixels', onChange: function (p) { s[1](p ? p.url : undefined); } }, props.a))));
  };
  var avatarUpload = { id: 'avatar-upload', lab: true, icon: 'person', sec: 'forms', sub: 'File and media input', leaf: 'Avatar upload', title: 'Avatar upload',
    plenix: 'AvatarUpload', src: 'patterns/AvatarUpload/AvatarUpload.jsx', level: 'Pattern', interaction: 'Input', statesFrom: ['button', 'file-input'],
    aliases: ['Profile photo', 'Profile picture upload', 'Change avatar', 'Account picture'],
    text: 'Sets a person’s (or a team’s) picture, built from Platform components. The Avatar shows it as it will look (the picture, or the initials without one), with Change photo (the browser’s file input drawn as a secondary button) and Remove photo, which goes back to the initials. A square crop step (ImageCrop) comes before the new picture is kept. The Avatar keeps Plenix’s rounded square in every size.',
    use: ['Profile and account settings', 'Team, workspace and app pictures', 'The smallest useful size in the hint (“At least 200 × 200 pixels”)'],
    avoid: ['General images: use the image upload', 'Pictures that come from an identity provider and cannot change here: show the Avatar and say where to change it'],
    related: ['avatar', 'image-upload', 'file-input'],
    map: [[ATL, 'Avatar (editable)', 'Partial'], [ANT, 'Upload (avatar)', 'Direct']],
    variantPages: [
      vp('Avatar upload', 'Picture', 'Square (default)', { variant: 'square' }, 'The current picture in the Avatar’s rounded square, with Change photo beside it.', 'Every profile picture', 'A circle: Plenix avatars are rounded squares'),
      vp('Avatar upload with remove', 'Picture', 'With remove', { variant: 'remove' }, 'Remove photo beside Change photo while there is a picture; it goes back to the initials.', 'Pictures people may want to take away', 'A required picture'),
      vp('Avatar upload with crop', 'Picture', 'Crop step', { variant: 'crop' }, 'A chosen picture opens in a square crop frame with Zoom, Apply and Cancel.', 'Every new picture: faces are rarely centered', 'Pictures already cropped by the system')
    ],
    examples: [
      ['Picture', [['Square (default)', function () { return h(Av, { a: { removable: false } }); }, null, 'AvatarUpload'],
        ['With remove', function () { return h(Av, { src: ART('12') }); }, null, 'removable'],
        ['Crop step', function () { return box(400, h(P.ImageCrop, { src: ART('16'), ratio: '1-1', output: 512, onApply: noop, onCancel: noop })); }, null, 'crop']]],
      ['Team', [['A team picture', function () { return h(Av, { label: 'Team picture', name: 'Brand team', a: { removable: false, crop: false } }); }, null, 'name']]]] };

  return [millerColumns, cascader, entityPicker, peoplePicker, timePicker, relativeDateInput, imageUpload, avatarUpload];
});
