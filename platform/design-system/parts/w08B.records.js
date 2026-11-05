/* Plenix design system · library part w08B (wave 8, lane B): VirtualList (Virtualized list), Carousel (Carousel), and
   the patterns PeopleGroup (Team, and its group kind: Group), PermissionSummary (Permission summary) and QueryBuilder
   (Query builder, on the command bar's condition model, utils/fields.ts). Every color is an existing role. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, box = H.box, use = H.use, noop = H.noop, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', ANT = 'Ant Design';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var ART = function (n) { return '../../dam/assets/thumb-' + n + '.svg'; };

  /* ── shared demo data ── */
  var WORDS = ['Banner', 'Poster', 'Leaflet', 'Wreath', 'Register', 'Window', 'Altar', 'Choir', 'Bell', 'Garden'];
  var KINDS = [['ed-image', 'PNG'], ['document', 'PDF'], ['ed-image', 'JPG'], ['doc-text', 'TXT']];
  var assetAt = function (i) {
    var k = KINDS[i % KINDS.length];
    return { id: 'a' + i, icon: k[0], label: WORDS[i % WORDS.length] + ' ' + P.formatNumber(i + 1), description: k[1] + ' · ' + ['Brand', 'Campaigns', 'Archive'][i % 3], meta: P.formatBytes(1200 + (i * 7919) % 900000) };
  };
  // the demo lists are made the first time a demo draws (P's formatting is there only in the page)
  var lazy = function (make) { var v; return function () { return v || (v = make()); }; };
  var ASSETS = lazy(function () { var l = []; for (var i = 0; i < 4000; i++) l.push(assetAt(i)); return l; });
  var SENTENCES = ['Proof approved.', 'The north aisle banner needs a second proof before it goes to print.', 'Captions added to the archive scans.',
    'The printer asked for the poster at A3 with a 3 mm bleed; the file we sent was A4, so the layout has to be checked again before Friday.', 'Colors match the style guide.',
    'Moved to the Easter folder.', 'The wreath photo is too dark on the website; ask the volunteer who took it for the original file, or retake it on Sunday in daylight.'];
  var NOTES = lazy(function () { var out = []; for (var ni = 0; ni < 1500; ni++) {
    var text = SENTENCES[ni % SENTENCES.length] + (ni % 3 === 2 ? ' ' + SENTENCES[(ni + 3) % SENTENCES.length] : '');
    out.push({ id: 'n' + ni, icon: 'pencil', label: 'Note ' + P.formatNumber(ni + 1), description: text, meta: 'v' + (1 + ni % 9) });
  } return out; });
  var FIRST = ['Ada', 'Alex', 'Amara', 'Ben', 'Bianca', 'Carlos', 'Chen', 'Dana', 'David', 'Elena', 'Emeka', 'Farah', 'Felix', 'Grace', 'Hana', 'Ivan', 'Jonas', 'Julia', 'Kofi', 'Lena', 'Maya', 'Mateo', 'Nadia', 'Omar', 'Priya', 'Raphael', 'Rosa', 'Sofia', 'Tariq', 'Uma', 'Victor', 'Wen', 'Yara', 'Zoe'];
  var LAST = ['Kim', 'Chen', 'Maher', 'Nair', 'Weber', 'Rossi', 'Okafor', 'Silva', 'Haddad', 'Novak', 'Ortiz', 'Park', 'Sato', 'Brandt', 'Costa'];
  var GROUPS = lazy(function () {
    var all = []; LAST.forEach(function (l) { FIRST.forEach(function (f) { all.push(l + ', ' + f); }); });
    all.sort();
    var by = {}; all.forEach(function (n, i) { var k = n.charAt(0); (by[k] = by[k] || []).push({ id: 'p' + i, icon: 'person', label: n, meta: 'ext. ' + (2000 + i) }); });
    return Object.keys(by).sort().map(function (k) { return { id: k, label: k, items: by[k] }; });
  });
  var PEOPLE = [
    { id: 'mc', name: 'Maya Chen', presence: 'online' }, { id: 'ak', name: 'Alex Kim', presence: 'away' }, { id: 'rm', name: 'Jordan Avery' },
    { id: 'pn', name: 'Priya Nair', presence: 'busy' }, { id: 'jw', name: 'Jonas Weber' }, { id: 'sr', name: 'Sofia Rossi' }, { id: 'ko', name: 'Kofi Okafor' }, { id: 'ls', name: 'Lena Silva' }
  ];
  var FIELDS = [
    { value: 'name', label: 'Name', kind: 'text' },
    { value: 'type', label: 'Type', kind: 'select', options: [{ value: 'Image', label: 'Image' }, { value: 'Video', label: 'Video' }, { value: 'Document', label: 'Document' }] },
    { value: 'tags', label: 'Tags', kind: 'multi', options: [{ value: 'Easter', label: 'Easter' }, { value: 'Advent', label: 'Advent' }, { value: 'Print', label: 'Print' }, { value: 'Web', label: 'Web' }] },
    { value: 'size', label: 'Size (MB)', kind: 'number' },
    { value: 'modified', label: 'Modified', kind: 'date' }
  ];
  var ROWS = []; for (var ri = 0; ri < 240; ri++) ROWS.push({ id: ri, name: WORDS[ri % WORDS.length] + ' ' + (ri + 1), type: ['Image', 'Video', 'Document'][ri % 3], tags: [['Easter'], ['Advent', 'Print'], ['Web'], []][ri % 4], size: (ri * 37) % 120, modified: '2026-' + String(1 + ri % 10).padStart(2, '0') + '-' + String(1 + (ri * 3) % 28).padStart(2, '0') });

  /* ── 07 Data display › Lists and collections › Virtualized list: VirtualList ── */
  var VL = function (props) {
    var s = use(props.grow ? ASSETS().slice(0, 60) : null), busy = use(false);
    var more = function () { if (!props.grow || busy[0] || s[0].length >= 240) return; busy[1](true); setTimeout(function () { s[1](function (l) { return ASSETS().slice(0, l.length + 60); }); busy[1](false); }, 700); };
    return box(props.width || 560, h(P.VirtualList, Object.assign({ label: props.label || 'Assets', showCount: true }, props.grow ? { items: s[0], loading: busy[0], onEndReached: more } : {}, props.v)));
  };
  var virtualList = { id: 'virtual-list', lab: true, icon: 'list-lines', sec: 'data-display', sub: 'Lists and collections', leaf: 'Virtualized list', title: 'Virtualized list',
    plenix: 'VirtualList', src: 'components/VirtualList/VirtualList.jsx', also: ['hooks/useVirtualizer.ts'], level: 'Component', interaction: 'Display',
    aliases: ['Virtual list', 'Windowed list', 'Long list', 'Infinite list', 'Virtual scroll'],
    text: 'A list of hundreds to many thousands of rows in a bordered scroll area that draws only the rows in and near its view (useVirtualizer). The rest are gaps the stylesheet sizes, so the scroll bar keeps the whole list’s length, and each row says its place in it ("12 of 4,000"). Fixed rows are one line at the list row height; variable rows wrap and take their own height; a group keeps its header at the top while it scrolls. The scroll area is a named Tab stop, the count shows above the list in the data font, and a loading row at the end asks for more.',
    use: ['Lists that can pass a few hundred rows: logs, activity, people directories, asset libraries', 'Fixed rows whenever the content fits one line: the fastest and steadiest', 'Groups for a long sorted list (A to Z, by day)', 'onEndReached with loading to bring the next rows from the server'],
    avoid: ['Short lists: render them (List, or a plain list of rows)', 'Rows and columns people sort and filter: use the DataGrid', 'Pages where browser find across every row matters, unless the page offers its own search'],
    related: ['virtualization', 'pagination', 'data-grid', 'list'],
    map: [[MAT, 'Lazy lists (LazyColumn)', 'Partial'], [ANT, 'List (virtual)', 'Partial'], [FLU, 'List (virtualized)', 'Partial'], [SPE, 'ListView (virtualized)', 'Partial']],
    variantPages: [
      vp('Fixed-height virtualized list', 'Rows', 'Fixed rows (default)', { variant: 'fixed' }, 'Every row one line at the list row height, the label and its description side by side, cut with an ellipsis; the technical value at the end in the data font.', 'Most long lists: logs, files, people', 'Text that must be read whole: use variable rows'),
      vp('Variable-height virtualized list', 'Rows', 'Variable rows', { variant: 'variable' }, 'Rows wrap and take their own height. The row height is the estimate for the rows not drawn; the browser keeps the view still as real rows replace it.', 'Notes, messages and comments of different lengths', 'Rows that are all one line: fixed rows are steadier'),
      vp('Grouped virtualized list', 'Rows', 'With groups', { variant: 'groups' }, 'A header per group with its name and how many it holds; the header of the group in view stays at the top on the sticky surface.', 'Long sorted lists: names A to Z, events by day', 'One group, or groups of a few rows: plain rows read better')
    ],
    examples: [
      ['Rows', [['Fixed rows (default)', function () { return h(VL, { v: { items: ASSETS() } }); }, 'plx-virtual-list--fixed', 'mode="fixed"'],
        ['Variable rows', function () { return h(VL, { label: 'Notes', v: { items: NOTES(), mode: 'variable' } }); }, 'plx-virtual-list--variable', 'mode="variable"'],
        ['With groups', function () { return h(VL, { label: 'People', v: { groups: GROUPS(), height: 'lg' } }); }, 'plx-virtual-list--groups', 'groups']], { prop: 'mode' }],
      ['Loading', [['Loading more at the end', function () { return h(VL, { grow: true, label: 'Recent assets' }); }, null, 'loading onEndReached'],
        ['Empty', function () { return h(VL, { label: 'Search results', v: { items: [], strings: { empty: 'No assets match these filters.' } } }); }, null, 'items={[]}']]]
    ] };

  /* ── 07 Data display › Specialized displays › Carousel: Carousel ── */
  var slide = function (n, title, meta) { return h(P.MediaCard, { key: title, src: ART(n), alt: '', title: title, meta: meta, aspect: '16/9', onOpen: noop }); };
  var SLIDES = [slide(10, 'Easter banner, north aisle', 'PNG · 2.4 MB'), slide(12, 'Advent wreath', 'JPG · 1.1 MB'), slide(14, 'Choir poster', 'PDF · 640 kB'),
    slide(16, 'Archive register, 1919', 'TIFF · 18 MB'), slide(18, 'Garden open day', 'JPG · 3.2 MB'), slide(20, 'Bell tower', 'JPG · 2.7 MB')];
  var Car = function (props) { return box(props.width || 560, h(P.Carousel, Object.assign({ label: 'Featured assets' }, props.c), SLIDES.slice(0, props.n || 5))); };
  var carousel = { id: 'carousel', lab: true, icon: 'cards-large', sec: 'data-display', sub: 'Specialized displays', leaf: 'Carousel', title: 'Carousel',
    plenix: 'Carousel', src: 'components/Carousel/Carousel.tsx', also: ['hooks/useGesture.ts'], level: 'Component', interaction: 'Navigation',
    aliases: ['Slider', 'Slideshow', 'Image carousel', 'Content rotator', 'Gallery strip'],
    text: 'Shows a few items of equal weight one (or a few) at a time, in a strip that scrolls sideways and snaps to each. Under it: Previous and Next, and a dot for each page (the current one in the default content color, the others in the strong border color); people swipe on touch and drag with a mouse. With several per view, part of the next item shows at the end, so people see there is more. It never moves by itself unless the page turns autoplay on; then a Pause button shows, and it waits while it is pointed at or holds focus.',
    use: ['A handful of featured items people may browse: assets, announcements, highlights', 'One per view for a picture or a panel that needs the width; several per view for cards', 'Autoplay only for decorative content, with Pause, never for content people must read'],
    avoid: ['Content people need: put it on the page, not in a later slide', 'Long sets: use a grid or a list', 'Autoplay without a way to pause it (WCAG 2.2.2), or as the default'],
    related: ['media-card', 'image', 'pagination'],
    map: [[MAT, 'Carousel', 'Direct'], [FLU, 'Carousel', 'Direct'], [ANT, 'Carousel', 'Direct']],
    variantPages: [
      vp('Carousel with one slide per view', 'Per view', 'One per view (default)', { variant: 'one' }, 'One slide fills the width; Previous and Next move one slide, a dot per slide.', 'A picture or a panel that needs the whole width', 'Cards: show several at a time'),
      vp('Carousel with several slides per view', 'Per view', 'Several per view', { variant: 'several' }, 'Two to four slides share the width, with a part of the next one at the end; Previous and Next move a page.', 'Cards and thumbnails people compare as they browse', 'Pictures that need the width'),
      vp('Carousel with dots', 'Controls', 'Dots', { content: 'dots' }, 'Only the page dots under the strip: each a 24px target with its page in its name; swipe and the keys still move it.', 'Short sets of pictures where the dots show the length', 'Many pages: Previous and Next are easier than small dots'),
      vp('Carousel with arrows', 'Controls', 'Arrows', { content: 'arrows' }, 'Only Previous and Next, which turn off at the ends.', 'Longer sets, or narrow spaces where dots do not fit', 'Sets where people jump to a page: keep the dots'),
      vp('Carousel with autoplay', 'Motion', 'Autoplay with Pause', { content: 'autoplay' }, 'Off by default. Turned on, the pages move on by themselves with a Pause button first in the controls; it waits while pointed at or in focus, and stays paused for people who ask for less motion.', 'Decorative highlights on a landing page', 'Anything people must read or act on')
    ],
    examples: [
      ['Per view', [['One per view (default)', function () { return h(Car, {}); }, null, 'perView={1}'],
        ['Several per view', function () { return h(Car, { width: 720, n: 6, c: { perView: 3, label: 'Recent uploads' } }); }, 'plx-carousel--multiple', 'perView={3}']], { prop: 'perView' }],
      ['Controls', [['Arrows and dots (default)', function () { return h(Car, {}); }, null, 'controls=' + q('both')],
        ['Dots', function () { return h(Car, { c: { controls: 'dots' } }); }, null, 'controls=' + q('dots')],
        ['Arrows', function () { return h(Car, { c: { controls: 'arrows' } }); }, null, 'controls=' + q('arrows')]], { prop: 'controls' }],
      ['Motion', [['Autoplay with Pause', function () { return h(Car, { c: { autoplay: true, label: 'Highlights' } }); }, null, 'autoplay']]]
    ] };

  /* ── 03 Content › Identity › Team and Group: PeopleGroup ── */
  var team = function (o) { return box(o.width || 480, h(P.PeopleGroup, Object.assign({ name: 'Brand team', description: 'Design, print and the parish style guide', members: PEOPLE, href: '#team-brand', onShowMembers: noop }, o.g))); };
  var peopleGroup = { id: 'people-group', lab: true, icon: 'settings-users', sec: 'content', sub: 'Identity', leaf: 'Team', title: 'Team',
    plenix: 'PeopleGroup', src: 'patterns/PeopleGroup/PeopleGroup.jsx', level: 'Pattern', interaction: 'Display',
    aliases: ['Team card', 'Team identity', 'Team row', 'Squad'],
    text: 'Shows a team as one identity in a row: its own picture or initials, its name (a link to the team’s page), the word Team and its member count, what it does, and its members’ avatars with +N for the rest. The word Team is read with the name, so a team is never taken for a person: Plenix avatars are rounded squares for everyone, so the shape cannot tell them apart.',
    use: ['Where ownership or access belongs to a team: a project’s owner, a shared folder’s audience', 'Pickers and lists that mix people and teams (each team as this row)', 'The member count as a number people can trust: from the directory, not the avatars shown'],
    avoid: ['A few people with no shared identity: use an avatar group', 'A permission or directory group: use the group kind', 'One person: use the profile summary'],
    related: ['user-group', 'avatar-group', 'profile-summary', 'permission-summary'],
    map: [[ATL, 'Avatar (square, for teams and projects)', 'Partial'], [FLU, 'Persona with AvatarGroup', 'Partial'], [MAT, 'List item with avatar', 'Partial']],
    variantPages: [
      vp('Team with members', 'Kind', 'Team', { variant: 'team' }, 'The team’s picture or initials, its name as a link, Team, what it does, and its members’ avatars with +N.', 'A team that owns or shares something', 'Directory groups: use the group kind'),
      vp('Team with member count', 'Count', 'With member count', { content: 'count' }, 'The member count after the kind, the number in the data font: “8 members”.', 'Every team and group people choose between', 'A count from the avatars on screen: use the directory’s')
    ],
    examples: [
      ['Kind', [['Team', function () { return team({}); }, 'plx-people-group--team', 'kind=' + q('team')],
        ['Group', function () { return team({ g: { kind: 'group', name: 'Archive editors', description: null, members: null, count: 48, source: 'Synced from directory', href: null } }); }, 'plx-people-group--group', 'kind=' + q('group')]], { prop: 'kind' }],
      ['Count', [['With member count', function () { return team({ g: { count: 8 } }); }, null, 'count={8}'],
        ['Without a count', function () { return team({ g: { href: null, onShowMembers: null } }); }, null, 'members']]],
      ['In a list of owners', function () {
        return box(480, h(P.Stack, { gap: 'md' }, h(P.PeopleGroup, { name: 'Web team', description: 'Site and newsletter', members: PEOPLE.slice(2, 7), count: 5, max: 3 }),
          h(P.PeopleGroup, { name: 'Parish office', description: 'Bookings and records', members: PEOPLE.slice(0, 4), count: 4 }),
          h(P.Persona, { name: 'Maya Chen', secondary: 'Designer · Brand team', presence: 'online' })));
      }]
    ] };
  var userGroup = { id: 'user-group', icon: 'settings-users', sec: 'content', sub: 'Identity', leaf: 'Group', title: 'Group',
    plenix: 'PeopleGroup kind="group"', src: 'patterns/PeopleGroup/PeopleGroup.jsx', level: 'Pattern', interaction: 'Display', variantClasses: ['plx-people-group--group'],
    aliases: ['User group', 'Permission group', 'Security group', 'Directory group', 'Distribution list'],
    text: 'A permission or directory group as one row: the group icon tile, its name, the word Group, how many members it holds (the number in the data font) and where it comes from (“Synced from directory”), with Show members to list them on demand. It is PeopleGroup with kind="group": members are not shown inline, because a group is managed as a whole and can hold hundreds.',
    use: ['Access settings and sharing: a group granted a role', 'Pickers that offer groups beside people and teams', 'The source for a synced group, which is managed in the directory and read only here'],
    avoid: ['A team with a people-facing identity: use the team kind', 'Showing a group’s members inline: open them on demand'],
    related: ['people-group', 'avatar-group', 'permission-summary', 'share'],
    map: [[ATL, 'User picker (groups)', 'Partial'], [FLU, 'People picker (groups)', 'Partial']],
    examples: [
      ['Kind', [['Group', function () { return team({ g: { kind: 'group', name: 'Archive editors', description: null, members: null, count: 48, source: 'Synced from directory', href: null } }); }, 'plx-people-group--group', 'kind=' + q('group')]]],
      ['A local group with a description', function () { return team({ g: { kind: 'group', name: 'Volunteers', description: 'Everyone who helps on open days', members: null, count: 23, href: '#group-volunteers' } }); }],
      ['Groups granted access', function () {
        return box(480, h(P.Stack, { gap: 'md' }, h(P.PeopleGroup, { kind: 'group', name: 'All staff', count: 64, source: 'Synced from directory', onShowMembers: noop }),
          h(P.PeopleGroup, { kind: 'group', name: 'Print vendors', count: 3, onShowMembers: noop })));
      }]
    ] };

  /* ── 03 Content › Identity › Permission summary: PermissionSummary ── */
  var perm = function (o) { return box(o.width || 520, h(P.PermissionSummary, Object.assign({ access: 'Your team can edit', icon: 'settings-users', detail: 'From the Marketing folder · 12 people',
    can: ['View', 'Comment', 'Edit details', 'Download'], cannot: ['Share', 'Delete'], onManage: noop }, o.p))); };
  var permissionSummary = { id: 'permission-summary', lab: true, icon: 'settings-permissions', sec: 'content', sub: 'Identity', leaf: 'Permission summary', title: 'Permission summary',
    plenix: 'PermissionSummary', src: 'patterns/PermissionSummary/PermissionSummary.jsx', level: 'Pattern', interaction: 'Display',
    aliases: ['Access summary', 'Who has access', 'Sharing summary', 'Role summary'],
    text: 'Shows who can reach an item and what they may do, before anyone shares or changes it: the access in words with its icon, audience first (“Your team can edit”), where it comes from (“From the Marketing folder · 12 people”), then Can and Cannot as two short lists, each right with a check in the success color or a cross in the danger color. Compact folds each list into one sentence. Manage access opens the sharing settings; the summary itself changes nothing.',
    use: ['The top of a sharing dialog and an item’s details pane', 'Inherited or restricted access: name where it comes from', 'The rights people ask about (share, delete, download), not every permission'],
    avoid: ['Changing access here: Manage access opens the sharing dialog', 'The icon or the colors alone: the words carry the access and each right', 'A role’s full grid of rights: that is the permissions editor'],
    related: ['share', 'people-group', 'user-group', 'list'],
    map: [],
    variantPages: [
      vp('Permission summary with can and cannot', 'Form', 'Can and cannot lists (default)', { variant: 'list' }, 'The access line, then Can and Cannot side by side (stacked when narrow), each a small heading over its checks or crosses.', 'Sharing dialogs and details panes with room', 'Tight spaces: use compact'),
      vp('Compact permission summary', 'Form', 'Compact', { variant: 'compact' }, 'The access line and one sentence for each list: “Can view, comment, and download”, “Cannot share or delete”.', 'Side panels, popovers and rows', 'Many rights: the sentence gets long; use the lists')
    ],
    examples: [
      ['Form', [['Can and cannot lists (default)', function () { return perm({}); }, null, 'variant=' + q('list')],
        ['Compact', function () { return perm({ width: 400, p: { variant: 'compact', icon: 'lock', access: 'Only you can edit', detail: 'Shared with 2 people to view', can: ['View', 'Comment'], cannot: ['Share', 'Delete'] } }); }, 'plx-permission-summary--compact', 'variant=' + q('compact')]], { prop: 'variant' }],
      ['Access', [['Anyone with the link', function () { return perm({ p: { icon: 'link', access: 'Anyone with the link can view', detail: 'Link created by Maya Chen', can: ['View', 'Download'], cannot: ['Comment', 'Edit', 'Share'], onManage: null, manageHref: '#sharing' } }); }, null, 'icon=' + q('link') + ' manageHref'],
        ['One person', function () { return perm({ p: { icon: 'person', access: 'Jordan Avery can comment', detail: null, can: ['View', 'Comment'], cannot: ['Edit', 'Share', 'Delete'] } }); }, null, 'icon=' + q('person')]]]
    ] };

  /* ── 06 Navigation › Search, filter, and discovery › Query builder: QueryBuilder ── */
  var cond = function (id, field, op, value) { return { id: id, field: field, op: op, value: value }; };
  var RULE = { join: 'and', items: [cond('r1', 'type', 'any', ['Image'])] };
  var GROUP = { join: 'or', items: [cond('r1', 'tags', 'any', ['Easter']), cond('r2', 'name', 'contains', 'banner')] };
  var NESTED = { join: 'and', items: [cond('r1', 'type', 'any', ['Image', 'Video']),
    { id: 'g1', group: true, join: 'or', items: [cond('r2', 'size', 'gt', 40), { id: 'g2', group: true, join: 'and', items: [cond('r3', 'modified', 'within', 'month'), cond('r4', 'tags', 'none', ['Print'])] }] }] };
  var QB = function (props) {
    var s = use(props.start || { join: 'and', items: [] }), v = use(props.view || 'builder');
    var n = ROWS.filter(function (r) { return P.matchesFilter(s[0], r, FIELDS, '2026-10-15'); }).length;
    return box(props.width || 760, h(P.QueryBuilder, Object.assign({ label: 'Asset search', fields: FIELDS, value: s[0], onChange: s[1], matches: n, view: v[0], onViewChange: v[1] }, props.q)));
  };
  var queryBuilder = { id: 'query-builder', lab: true, icon: 'ed-filters', sec: 'navigation', sub: 'Search, filter, and discovery', leaf: 'Query builder', title: 'Query builder',
    plenix: 'QueryBuilder, formatQuery', src: 'patterns/QueryBuilder/QueryBuilder.jsx', also: ['utils/fields.ts'], level: 'Composite', interaction: 'Filter', statesFrom: ['segmented-control', 'button'],
    aliases: ['Condition builder', 'Rule builder', 'Advanced search', 'Segment builder', 'Where clause'],
    text: 'Builds a query from rules and groups of rules, for an advanced search, a saved view, an automation’s trigger or an audience. Each rule has a field, an operator in the field type’s words and a value in that type’s own control (text, a number input, a date picker, a combobox of options). Each group joins its rules with And or Or and may hold groups of its own; a rail at its start marks the level. The match count shows beside the Builder and Text switch; the text view reads the whole query back as one sentence. It uses the command bar’s condition model, so matchesFilter tests rows against it.',
    use: ['A query that is its own object: a saved search, an automation, a segment', 'And and or together: one group for each change of join', 'The match count, so people see what their rules do', 'The text view to check the query in words, or to copy it'],
    avoid: ['Narrowing the collection in front of people: use the command bar’s Filter (FilterPanel)', 'More than three levels of groups: maxDepth stays at 3 or less', 'Operators as symbols people must learn: use the field type’s words'],
    related: ['filter-panel', 'command-bar', 'combobox', 'date-picker', 'number-input', 'search-workspace'],
    map: [[ATL, 'JQL basic search', 'Partial'], [ANT, 'QueryFilter (Pro components)', 'Partial'], [CAR, 'Filtering', 'Partial'], [POL, 'Segment editor', 'Partial']],
    variantPages: [
      vp('Query builder rule', 'Structure', 'Rule', { variant: 'rule' }, 'One rule: Where, the field, its operator and a value in the field type’s control, and Remove rule.', 'A single condition: Type is any of Image', 'A one-rule query with no need to grow: use a filter'),
      vp('Query builder group', 'Structure', 'Group (and / or)', { variant: 'group' }, 'Rules joined by the group’s And or Or switch, with words beside it that say what it means (All rules, Any rule). Each rule after the first starts with the join word.', 'Several conditions that all, or any, must hold', 'Mixing and and or in one group: add a group for the other join'),
      vp('Nested query builder', 'Structure', 'Nested groups', { variant: 'nested' }, 'Groups inside groups, up to maxDepth (three levels by default), each level marked by a rail at its start rather than a frame.', 'An or inside an and: Image and (larger than 40 MB or modified this month)', 'Deeper than three levels: split the query'),
      vp('Query builder text view', 'View', 'Text view', { variant: 'text' }, 'The whole query as one sentence in a code block with Copy; unfinished rules are left out.', 'Checking a query in words, copying it into a note or a ticket', 'Editing: the builder edits, the text reads')
    ],
    examples: [
      ['Structure', [['Rule', function () { return h(QB, { start: RULE }); }, null, 'value={{ items: [rule] }}'],
        ['Group (and / or)', function () { return h(QB, { start: GROUP }); }, null, 'join="or"'],
        ['Nested groups', function () { return h(QB, { start: NESTED }); }, null, 'maxDepth={3}']]],
      ['View', [['Builder (default)', function () { return h(QB, { start: NESTED, width: 760 }); }, null, 'view="builder"'],
        ['Text view', function () { return h(QB, { start: NESTED, view: 'text' }); }, null, 'view="text"']], { prop: 'view' }],
      ['Empty, rules only (maxDepth 1)', function () { return h(QB, { q: { maxDepth: 1, views: false } }); }]
    ] };

  return [virtualList, carousel, peopleGroup, userGroup, permissionSummary, queryBuilder];
});
