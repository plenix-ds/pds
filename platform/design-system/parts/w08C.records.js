/* Plenix design system · library part w08C (wave 8, lane C): RoleLabel (Role), SearchResult (Search result item) and
   SearchResultGroup (Search result groups), ResourceList (Resource list, and the duplicate leaf Object list), Timeline
   (Timeline) and the expandable Card (Expandable card). Filter panel and Sort control are answered in w07K (FilterPanel,
   SortPanel). Every color is an existing role: a role is the tag look (gray, or a custom role's category color), a
   match is bold, the timeline's markers are neutral. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, box = H.box, use = H.use, noop = H.noop;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', ANT = 'Ant Design', PRI = 'Primer';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var data = function (v) { return h(P.Text, { variant: 'data' }, v); };

  /* ── 03 Content › Identity › Role: RoleLabel ── */
  var roleLabel = { id: 'role-label', lab: true, icon: 'settings-permissions', sec: 'content', sub: 'Identity', leaf: 'Role', title: 'Role',
    plenix: 'RoleLabel', src: 'components/RoleLabel/RoleLabel.tsx', level: 'Component', interaction: 'Static',
    aliases: ['Role label', 'Role badge', 'Permission level', 'Access level', 'Member role'],
    text: 'Shows a person’s role on a project, a folder or a workspace: the role’s icon, then its name, in the tag look. The built-in roles (Owner, Editor, Viewer) are gray; a custom role is gray too, or the category color the application gives it. A role says what someone may do, not a state, so it is never drawn as a status: no status colors, no dot.',
    use: ['Beside a person’s name in a member list, a share dialog or a profile', 'The built-in names (Owner, Editor, Viewer) whenever they fit, so every application says the same', 'A custom role’s category color from the application’s data, when people tell many custom roles apart by color'],
    avoid: ['A status color (success, waiting, negative) for a role: a role is not a state', 'A role label as the control that changes the role: put a Select or a menu beside it', 'Colors for the built-in roles: they stay gray so color means a category'],
    related: ['tag', 'avatar', 'badge'],
    map: [[PRI, 'Label', 'Partial'], [CAR, 'Tag (read-only)', 'Partial'], [ATL, 'Lozenge', 'Partial'], [FLU, 'Tag', 'Partial'], [POL, 'Badge', 'Partial'], [MAT, 'Assist chip', 'Partial']],
    variantPages: [
      vp('Owner role', 'Role', 'Owner', { variant: 'owner' }, 'The person who owns the item and decides who else has access: the shield icon and the word Owner.', 'The one person (or team) who owns a project or a folder', 'Several owners where one person decides: name the others Editor'),
      vp('Editor role', 'Role', 'Editor', { variant: 'editor' }, 'Someone who can change the item: the pencil and the word Editor.', 'People who can edit and upload', 'People who can only comment: a custom role says it'),
      vp('Viewer role', 'Role', 'Viewer', { variant: 'viewer' }, 'Someone who can only look: the eye and the word Viewer.', 'Read-only access', 'Hiding a viewer’s actions without the label: say why they are missing'),
      vp('Custom role', 'Role', 'Custom (a category color)', { variant: 'custom' }, 'A role the organization defined, by its own name, with the person icon; gray, or the category color the application gives it.', 'Roles beyond the three built-in ones (Billing admin, Reviewer)', 'A category color that repeats a status color’s meaning')
    ],
    examples: [
      ['Role', [['Owner', function () { return h(P.RoleLabel, { role: 'owner' }); }, null, 'role="owner"'],
        ['Editor', function () { return h(P.RoleLabel, { role: 'editor' }); }, null, 'role="editor"'],
        ['Viewer', function () { return h(P.RoleLabel, { role: 'viewer' }); }, null, 'role="viewer"'],
        ['Custom (a category color)', function () { return h(P.TagList, null, h(P.RoleLabel, { role: 'custom', label: 'Billing admin', category: 'teal' }), h(P.RoleLabel, { role: 'Reviewer' })); }, null, 'role="custom" label category']], { prop: 'role' }],
      ['Without the icon', function () { return h(P.TagList, null, h(P.RoleLabel, { role: 'owner', icon: false }), h(P.RoleLabel, { role: 'editor', icon: false }), h(P.RoleLabel, { role: 'viewer', icon: false })); }],
      ['Beside a name: a member list', function () {
        return box(420, h(P.ResourceList, { label: 'Members', noun: 'member', items: [
          { id: 'm1', name: 'Maya Chen', description: 'maya@plenix.example', avatar: { name: 'Maya Chen' }, meta: h(P.RoleLabel, { role: 'owner' }) },
          { id: 'm2', name: 'Luis Herrera', description: 'luis@plenix.example', avatar: { name: 'Luis Herrera' }, meta: h(P.RoleLabel, { role: 'editor' }) },
          { id: 'm3', name: 'Ana Ruiz', description: 'ana@plenix.example', avatar: { name: 'Ana Ruiz' }, meta: h(P.RoleLabel, { role: 'viewer', description: 'Can view and download' }) }] }));
      }]] };

  /* ── 06 Navigation › Search, filter, and discovery › Search result item: SearchResult ── */
  var RESULTS = {
    page: { kind: 'page', title: 'Cabinet quotes and layouts', path: ['Projects', 'Kitchen renovation'], snippet: 'Three quotes for the cabinets: the second covers the island and the pantry doors.', meta: 'Note · edited 10/12/2026' },
    file: { kind: 'file', title: 'Cabinet quote.pdf', icon: 'file-pdf', path: ['Files', 'Kitchen renovation', 'Quotes'], snippet: 'Quote for the upper and lower cabinets, the island and the pantry doors.', meta: '2.4 MB · 10/12/2026' },
    person: { kind: 'person', title: 'Maya Chen', snippet: 'Designer on Kitchen renovation and Brand kit.', meta: 'maya@plenix.example' }
  };
  var result = function (key, extra) {
    var r = RESULTS[key], m = r.meta.split(' · ');
    var meta = key === 'file' ? h(P.Text, { variant: 'data' }, r.meta) : key === 'page' ? [m[0] + ' · edited ', data(m[1].slice(7))] : data(r.meta);
    return h(P.SearchResult, Object.assign({ kind: r.kind, title: r.title, icon: r.icon, snippet: r.snippet, meta: meta, href: '#' }, extra));
  };
  var list = function (children, width) { return box(width || 520, h(P.SearchResultGroup, { label: 'Search results' }, children)); };
  var searchResult = { id: 'search-result', lab: true, icon: 'search', sec: 'navigation', sub: 'Search, filter, and discovery', leaf: 'Search result item', title: 'Search result item',
    plenix: 'SearchResult, highlightMatches', src: 'components/SearchResult/SearchResult.jsx', blocks: ['plx-search-result'], level: 'Component', interaction: 'Navigation',
    aliases: ['Search result', 'Result row', 'Hit', 'Search hit', 'Result card'],
    text: 'One search result: what it is (a page or a note with its icon, a file with its thumbnail, a person with their avatar), its name as a link that covers the row, its path above the name, the snippet (a few words around the match) and its details. The words searched for are bold in the name and the snippet, never colored. The row has one Tab stop; its actions have their own.',
    use: ['Every result in a search page or a search panel, one row per result', 'query on every result, so people see why it matched', 'The path when results with the same name sit in different places', 'Details that tell results apart: type, size, the date it changed, its owner'],
    avoid: ['A colored highlight for the match: bold is the Plenix mark (the search field’s suggestions use it too)', 'Several links in one result: the name is the only link; put the rest in actions', 'A table of results people do not compare by column'],
    related: ['search-result-group', 'search-workspace', 'search-input', 'thumbnail', 'avatar'],
    map: [[ATL, 'Quick search result', 'Partial'], [POL, 'Search results (top bar)', 'Partial'], [MAT, 'Search view results', 'Partial'], [FLU, 'Search results (Microsoft Search)', 'Partial'], [CAR, 'Search (results list)', 'Partial']],
    variantPages: [
      vp('Page search result', 'Kind', 'Page (default)', { variant: 'page' }, 'A page, a note or a record: its icon in a thumbnail, the name, the snippet and its details.', 'Notes, pages, projects, records', 'Files: show their type or picture'),
      vp('File search result', 'Kind', 'File', { variant: 'file' }, 'A file: its picture or its type’s icon in the thumbnail, its size and date in the data font.', 'Documents, images, uploads', 'Folders full of results: link to the folder instead'),
      vp('Person search result', 'Kind', 'Person', { variant: 'person' }, 'A person: their avatar, their name, what they do and their email in the data font.', 'Members, contacts, authors', 'A person who is only the owner of a result: put them in its details'),
      vp('Search result with highlight', 'Content', 'With highlight', { variant: 'page', content: 'highlight' }, 'The words searched for in bold, in the name and in the snippet.', 'Every result list that answers a query', 'Color for the match'),
      vp('Search result with path', 'Content', 'With path', { variant: 'file', content: 'path' }, 'Above the name, where the result sits from the top down, with chevrons between the places.', 'Results that share a name in different places', 'A path of one place: leave it out')
    ],
    examples: [
      ['Kind', [['Page (default)', function () { return list(result('page')); }, null, 'kind="page"'],
        ['File', function () { return list(result('file')); }, null, 'kind="file"'],
        ['Person', function () { return list(result('person')); }, null, 'kind="person"']], { prop: 'kind' }],
      ['Content', [['With highlight', function () { return list(result('page', { query: 'cabinet quotes' })); }, 'plx-search-result__match', 'query'],
        ['With path', function () { return list(result('file', { path: RESULTS.file.path })); }, 'plx-search-result__path', 'path={[…]}']], { prop: 'query / path' }],
      ['Selected (its preview beside the list), with actions', function () {
        return list([result('page', { key: 1, query: 'quote', path: RESULTS.page.path, selected: true, actions: h(P.Button, { size: 'xs', variant: 'ghost', iconOnly: true, icon: 'more', label: 'More' }) }),
          result('file', { key: 2, query: 'quote', path: RESULTS.file.path, actions: h(P.Button, { size: 'xs', variant: 'ghost', iconOnly: true, icon: 'more', label: 'More' }) })]);
      }]] };

  /* ── 06 Navigation › Search, filter, and discovery › Search result groups: SearchResultGroup ── */
  var Groups = function (props) {
    var more = use(false);
    var files = [result('file', { key: 1, query: 'quote', path: RESULTS.file.path }), h(P.SearchResult, { key: 2, kind: 'file', icon: 'file-png', title: 'Island quote sketch.png', query: 'quote', href: '#', path: ['Files', 'Kitchen renovation'], meta: data('840 KB · 10/09/2026') })];
    if (more[0]) files.push(h(P.SearchResult, { key: 3, kind: 'file', icon: 'file-pdf', title: 'Pantry quote.pdf', query: 'quote', href: '#', path: ['Files', 'Kitchen renovation', 'Quotes'], meta: data('1.1 MB · 10/02/2026') }));
    return box(560, h(P.Stack, { gap: 'lg' },
      h(P.SearchResultGroup, { heading: 'Pages', count: 1, moreHref: props.link ? '#' : undefined, moreLabel: 'Show all pages' }, result('page', { query: 'quote', path: RESULTS.page.path })),
      h(P.SearchResultGroup, { heading: 'Files', count: 3, onMore: props.link || more[0] ? undefined : function () { more[1](true); }, moreHref: props.link ? '#' : undefined, moreLabel: props.link ? 'Show all 3 files' : 'Show 1 more' }, files),
      props.people ? h(P.SearchResultGroup, { heading: 'People', count: 1 }, result('person', { query: 'maya' })) : null));
  };
  var searchGroups = { id: 'search-result-group', lab: true, icon: 'list-lines', sec: 'navigation', sub: 'Search, filter, and discovery', leaf: 'Search result groups', title: 'Search result groups',
    plenix: 'SearchResultGroup', src: 'components/SearchResult/SearchResult.jsx', blocks: ['plx-search-result-group'], level: 'Component', interaction: 'Navigation', statesFrom: ['search-result'],
    aliases: ['Grouped results', 'Result sections', 'Federated search results', 'Results by type'],
    text: 'The first few results of one kind, under a heading that names the kind and its count (Pages 1, Files 12), then a link to all of them or a button that shows more in place. A search across kinds shows one group per kind, in the order people need them; a search of one kind needs no groups.',
    use: ['A search across kinds: pages, files, people, settings', 'The first three to five results of each kind, then a link to the rest', 'The count after the heading, so people know how much is behind the link'],
    avoid: ['Groups for a search of one kind: one list', 'Empty groups: leave out a kind with no results', 'More than about five groups: let people filter by kind instead'],
    related: ['search-result', 'search-workspace', 'link'],
    map: [[ATL, 'Quick search (result groups)', 'Partial'], [FLU, 'Search results (verticals)', 'Partial'], [MAT, 'Search view (sections)', 'Partial'], [SPE, 'Search with sections', 'Partial']],
    variantPages: [
      vp('Result groups with a link to all', 'Footer', 'A link to all (default)', { variant: 'link' }, 'Under the results, a standalone link to the page of all the results of this kind.', 'A search panel or a page of results that has a page per kind', 'A list that can grow in place: show more instead'),
      vp('Result groups with show more', 'Footer', 'Show more in place', { variant: 'button' }, 'Under the results, a button that shows more of them in the same group.', 'A few more results that fit here', 'Hundreds of results: link to their page'),
      vp('Result groups by kind', 'Footer', 'Heading only', { variant: 'none' }, 'The heading and its count above every result of the kind, with no footer.', 'A kind with only a few results', 'Leaving out results with no way to reach them')
    ],
    examples: [
      ['Footer', [['A link to all (default)', function () { return h(Groups, { link: true }); }, 'plx-search-result-group__more', 'moreHref'],
        ['Show more in place', function () { return h(Groups); }, null, 'onMore'],
        ['Heading only', function () { return box(560, h(P.SearchResultGroup, { heading: 'People', count: 1 }, result('person', { query: 'maya' }))); }, 'plx-search-result-group__count', 'heading count']], { prop: 'moreHref / onMore' }],
      ['Three kinds', function () { return h(Groups, { link: true, people: true }); }]] };

  /* ── 07 Data Display › Lists and collections › Resource list: ResourceList (and Object list) ── */
  var PROJECTS = [
    { id: 'p1', name: 'Kitchen renovation', description: 'Cabinet quotes and layouts', thumbnail: { icon: 'folder' }, files: 12, date: '10/12/2026', group: 'Personal', owner: 'Maya Chen' },
    { id: 'p2', name: 'Brand kit', description: 'Logos, colors and type for the new site', thumbnail: { icon: 'image-b' }, files: 48, date: '10/09/2026', group: 'Work', owner: 'Luis Herrera' },
    { id: 'p3', name: 'Quarterly report', description: 'Figures and charts for the third quarter', thumbnail: { icon: 'doc-text' }, files: 7, date: '10/01/2026', group: 'Work', owner: 'Ana Ruiz' },
    { id: 'p4', name: 'Garden plans', description: 'Planting plan and supplier list', thumbnail: { icon: 'folder' }, files: 5, date: '09/28/2026', group: 'Personal', owner: 'Maya Chen' }];
  var more = function (name) { return h(P.Button, { size: 'xs', variant: 'ghost', iconOnly: true, icon: 'more', label: 'More actions for ' + name }); };
  var itemsOf = function (kind) {
    return PROJECTS.map(function (p) {
      var it = { id: p.id, name: p.name, description: p.description, href: '#', meta: [data(String(p.files)), ' files'] };
      if (kind === 'avatar') { it.name = p.owner; it.description = p.name; it.avatar = { name: p.owner }; it.meta = data(p.date); }
      else it.thumbnail = p.thumbnail;
      if (kind === 'actions') { it.meta = data(p.date); it.actions = more(p.name); }
      if (kind === 'grouped') it.group = p.group;
      return it;
    });
  };
  var Resources = function (props) {
    var s = use(props.selectable ? ['p2'] : []);
    var items = itemsOf(props.kind);
    if (props.kind === 'grouped') items = items.filter(function (it) { return it.group === 'Personal'; }).concat(items.filter(function (it) { return it.group === 'Work'; }));
    return box(props.width || 560, h(P.ResourceList, Object.assign({ label: props.kind === 'avatar' ? 'Owners' : 'Projects', noun: props.kind === 'avatar' ? 'owner' : 'project', items: items,
      selectable: !!props.selectable, selected: s[0], onSelectionChange: s[1] }, props.list)));
  };
  var resources = function (kind, extra) { return function () { return h(Resources, Object.assign({ kind: kind }, extra)); }; };
  var resourceList = { id: 'resource-list', lab: true, icon: 'list-bullets', sec: 'data-display', sub: 'Lists and collections', leaf: 'Resource list', title: 'Resource list',
    plenix: 'ResourceList', src: 'patterns/ResourceList/ResourceList.jsx', level: 'Pattern', interaction: 'Selection', statesFrom: ['checkbox'],
    aliases: ['Object list', 'Record list', 'Item list', 'Entity list', 'Collection list'], covers: [],
    text: 'Records of one kind in a list people scan and open one at a time. Each row has the record’s picture (a thumbnail or an avatar), its name (which opens it and covers the row), a line about it, its details at the end and a few actions. With selectable, a checkbox before each row and a select-all checkbox in the header select records for actions on several at once. The command bar over the list (CommandBar, passed as bar) holds the collection’s commands and swaps to the selection’s while rows are selected. Rows can be grouped under headings, each with its count.',
    use: ['Projects, people, customers, folders: records with a name, a picture and a few details', 'selectable when the collection has actions for several records at once (move, share, delete)', 'The CommandBar as bar for the collection’s commands, search, filters and sort', 'Groups when people think of the records in a few groups (Personal, Work)'],
    avoid: ['Records people compare by column or sort by a column: use the DataGrid', 'More than three actions on a row: put them in a menu', 'A list without names: every row needs the record’s name'],
    related: ['data-grid', 'activity-stream', 'command-bar', 'checkbox', 'thumbnail', 'avatar'],
    map: [[POL, 'Resource list', 'Direct'], [CAR, 'Structured list (selectable)', 'Partial'], [MAT, 'Lists (with leading and trailing elements)', 'Partial'], [FLU, 'List (multiple selection)', 'Partial'], [SPE, 'ListView', 'Partial'], [ATL, 'Dynamic table', 'Partial']],
    variantPages: [
      vp('Resource list with media', 'Variant', 'Media (thumbnails)', { variant: 'media' }, 'Each row starts with the record’s picture or its kind’s icon in a thumbnail.', 'Projects, files, products: records with a picture or a type', 'People: use their avatar'),
      vp('Resource list with avatars', 'Variant', 'Avatar', { variant: 'avatar' }, 'Each row starts with a person’s or a team’s avatar.', 'Members, contacts, owners', 'Records that are not people'),
      vp('Selectable resource list', 'Variant', 'Selectable', { variant: 'selectable' }, 'A checkbox before each row and a select-all checkbox in the header, which says how many are selected.', 'Collections with actions on several records at once', 'Lists without such actions: the checkboxes only add noise'),
      vp('Resource list with actions', 'Variant', 'With actions', { variant: 'actions' }, 'A few ghost icon buttons or a menu at the end of each row, above the name’s target.', 'One or two actions people take often on one record', 'More than three: put them in a menu'),
      vp('Grouped resource list', 'Variant', 'Grouped', { variant: 'grouped' }, 'The records under headings, each with its count; groups keep the order they first appear in.', 'A few groups people know (Personal, Work)', 'Many groups of one or two: filter instead')
    ],
    examples: [['A field at the row’s end (P-52): a set share of the row; the field fills it; one shows only on hover and keeps its space', function () { var tags = [{ value: 'c', label: 'Client' }, { value: 'v', label: 'Vendor' }, { value: 'f', label: 'Friend' }]; return box(560, h(P.ResourceList, { label: 'People', items: [{ id: 1, name: 'Maya Chen', description: 'Apex Co', avatar: { name: 'Maya Chen', gender: 'female' }, field: h(P.Combobox, { label: 'Tags for Maya Chen', multiple: true, creatable: true, options: tags, values: ['c'], size: 'sm' }) }, { id: 2, name: 'Jeff Torres', description: 'ABC Plumbing', avatar: { name: 'Jeff Torres', gender: 'male' }, fieldOnHover: true, field: h(P.Combobox, { label: 'Tags for Jeff Torres', multiple: true, creatable: true, options: tags, values: ['v'], size: 'sm' }) }] })); }],
      
      ['Variant', [['Media (thumbnails)', resources('media'), null, 'items[].thumbnail'],
        ['Avatar', resources('avatar'), null, 'items[].avatar'],
        ['Selectable', resources('media', { selectable: true }), 'plx-resource-list__select', 'selectable'],
        ['With actions', resources('actions'), 'plx-resource-list__actions', 'items[].actions'],
        ['Grouped', resources('grouped'), 'plx-resource-list__group', 'items[].group']], { prop: 'items / selectable' }],
      ['With the command bar over it', function () {
        return h(Resources, { kind: 'media', selectable: true, width: 640, list: { bar: h(P.CommandBar, { label: 'Projects', sticky: false, count: '4 projects',
          actions: [{ id: 'new', label: 'New project', icon: 'plus', onSelect: noop }, { id: 'import', label: 'Import', icon: 'import', onSelect: noop }] }) } });
      }],
      ['Empty', function () { return box(560, h(P.ResourceList, { label: 'Projects', noun: 'project', items: [], showCount: true, emptyState: h(P.EmptyState, { icon: 'folder', title: 'No projects yet', description: 'Create a project to keep its files together.' }) })); }]] };
  var objectList = { id: 'data-display-object-list', icon: 'list-bullets', sec: 'data-display', sub: 'Lists and collections', leaf: 'Object list', title: 'Object list',
    plenix: 'ResourceList', src: 'patterns/ResourceList/ResourceList.jsx', level: 'Pattern', interaction: 'Selection', statesFrom: ['resource-list'], variantClasses: [], docsFrom: 'resource-list',
    aliases: ['Entity list', 'Record list'],
    text: 'An object list is Plenix’s resource list (ResourceList): the objects of one kind, each with its picture, its name that opens it, a line about it, its details and actions, selectable for actions on several.',
    use: ['Objects of one kind people scan and open one at a time', 'selectable with the command bar when the collection has actions on several objects'],
    avoid: ['Objects people compare by column: the DataGrid', 'A second list component for objects: use ResourceList'],
    related: ['resource-list', 'data-grid'],
    examples: [['Objects with their pictures', resources('media')]] };

  /* ── 07 Data Display › Lists and collections › Timeline: Timeline ── */
  var EVENTS = [
    { id: 1, time: 'Oct 2, 2026', dateTime: '2026-10-02', title: 'Project created', description: 'Maya Chen set up Kitchen renovation.', icon: 'folder-add' },
    { id: 2, time: 'Oct 6, 2026', dateTime: '2026-10-06', title: 'Quotes uploaded', description: 'Three cabinet quotes, 4.2 MB.', icon: 'upload' },
    { id: 3, time: 'Oct 9, 2026', dateTime: '2026-10-09', title: 'Quote approved', description: 'Luis Herrera approved the second quote.', icon: 'circle-check', badge: h(P.Badge, { tone: 'success', icon: 'check' }, 'Approved') },
    { id: 4, time: 'Oct 12, 2026', dateTime: '2026-10-12', title: 'Shared with the client', description: 'Ana Ruiz can view the project.', icon: 'share' }];
  var plain = EVENTS.map(function (e) { var c = Object.assign({}, e); delete c.icon; return c; });
  var timeline = { id: 'timeline', lab: true, icon: 'schedule', sec: 'data-display', sub: 'Lists and collections', leaf: 'Timeline', title: 'Timeline',
    plenix: 'Timeline', src: 'components/Timeline/Timeline.tsx', level: 'Component', interaction: 'Static',
    aliases: ['History', 'Event timeline', 'Activity timeline', 'Milestones', 'Chronology'],
    text: 'Events in the order they happened, each a marker on one line with its date or time (in the data font), a title and a line or two about it. Down the page by default; across it for a few milestones (the row scrolls sideways and is one Tab stop); or alternating on both sides of a line down the middle (one side again at Narrow widths). A marker is a small circle, or the event’s icon in a circle. Markers and the line are neutral: an event’s state is a Badge after its title.',
    use: ['A record’s history: created, changed, approved, shared', 'A plan’s milestones across the page (horizontal)', 'Icons that say what kind of event it was (upload, approval, share)', 'A Badge after the title for an event’s state'],
    avoid: ['Colored markers for states: use a Badge', 'Dozens of events: show the latest and a way to see earlier ones, or use the activity stream', 'Dates on a scale (a schedule): use a Gantt chart or a calendar'],
    related: ['activity-stream', 'badge', 'progress-steps'],
    map: [[ANT, 'Timeline', 'Direct'], [PRI, 'Timeline', 'Direct'], [CAR, 'Progress indicator (vertical)', 'Partial'], [MAT, 'Lists (with dividers)', 'Partial'], [ATL, 'Activity feed', 'Partial']],
    variantPages: [
      vp('Vertical timeline', 'Variant', 'Vertical (default)', { variant: 'vertical' }, 'Events down the page, the markers on a line at the start, the content after them.', 'A record’s history in a page or a side panel', 'A few milestones across a wide page: horizontal'),
      vp('Horizontal timeline', 'Variant', 'Horizontal', { variant: 'horizontal' }, 'Events in a row, each a marker over its content, the line across the markers; the row scrolls sideways.', 'Three to six milestones of a plan', 'Long descriptions or many events'),
      vp('Timeline with icons', 'Variant', 'With icons', { variant: 'icons' }, 'Each marker is the event’s icon in a circle, so the kind of event shows at a glance.', 'Histories that mix kinds of events', 'One kind of event: the small circles are enough'),
      vp('Alternating timeline', 'Variant', 'Alternating', { variant: 'alternate' }, 'A line down the middle, the events taking turns on each side; one side again below the Narrow width.', 'A story or a history read as a page of its own', 'Side panels and narrow columns')
    ],
    examples: [
      ['Variant', [['Vertical (default)', function () { return box(420, h(P.Timeline, { label: 'Project history', items: plain })); }, null, 'orientation="vertical"'],
        ['Horizontal', function () { return box(560, h(P.Timeline, { label: 'Project milestones', orientation: 'horizontal', items: plain })); }, 'plx-timeline--horizontal', 'orientation="horizontal"'],
        ['With icons', function () { return box(420, h(P.Timeline, { label: 'Project history', items: EVENTS })); }, 'plx-timeline__marker--icon', 'items[].icon'],
        ['Alternating', function () { return box(640, h(P.Timeline, { label: 'Project history', align: 'alternate', items: EVENTS })); }, 'plx-timeline--alternate', 'align="alternate"']], { prop: 'orientation / align' }]] };

  /* ── 07 Data Display › Cards and objects › Expandable card: Card expandable ── */
  var Expand = function (props) {
    return box(320, h(P.Card, Object.assign({ title: 'Kitchen renovation', meta: ['Personal · ', data('12'), ' files'], expandable: true }, props),
      h(P.Stack, { gap: 'xs' }, h(P.Text, null, 'Cabinet quotes and layouts for the new kitchen.'), h(P.Text, { variant: 'secondary' }, [data('3'), ' quotes · last change ', data('10/12/2026')]))));
  };
  var expandableCard = { id: 'expandable-card', lab: true, icon: 'cards-medium', sec: 'data-display', sub: 'Cards and objects', leaf: 'Expandable card', title: 'Expandable card',
    plenix: 'Card expandable', src: 'components/Card/Card.tsx', level: 'Component', interaction: 'Disclosure', variantClasses: [],
    aliases: ['Collapsible card', 'Expanding card', 'Expandable tile', 'Accordion card'],
    text: 'A Card whose body opens and closes. Its header (the title, the actions and the Expand/Collapse button at the end) and its meta stay as the summary; the body shows only when it is open. The toggle is a button with aria-expanded; its chevron points down when open. A card can both open (its title links to the record) and expand: the toggle sits above the title’s target.',
    use: ['Cards in a grid or a list where the details matter only sometimes', 'A summary in the title and meta that is enough to decide whether to open it', 'defaultExpanded for the one card people need first'],
    avoid: ['Hiding what everyone needs: show it', 'Forms or settings in a card that closes: use a collapsible Panel', 'An expandable card inside another one'],
    related: ['card', 'panel', 'overlays-disclosure'],
    map: [[CAR, 'Expandable tile', 'Direct'], [MAT, 'Cards (expanding)', 'Partial'], [FLU, 'Card (with a disclosure)', 'Partial'], [ANT, 'Collapse (card)', 'Partial'], [ATL, 'Expand (card)', 'Partial']],
    variantPages: [
      vp('Expandable card', 'Variant', 'Expandable', { variant: 'expandable' }, 'The Expand/Collapse button at the end of the header; open, the body under the meta, closed, the header and meta only.', 'Details people open only sometimes', 'Content everyone needs')
    ],
    examples: [
      ['Variant', [['Expandable', function () { return h(Expand, { defaultExpanded: true }); }, 'plx-card__toggle', 'expandable']], { prop: 'expandable' }],
      ['Closed (its summary)', function () { return h(Expand); }],
      ['Opens and expands', function () { return h(Expand, { onOpen: noop, defaultExpanded: true, actions: h(P.Button, { size: 'xs', variant: 'ghost', iconOnly: true, icon: 'more', label: 'More' }) }); }]] };

  return [roleLabel, searchResult, searchGroups, resourceList, objectList, timeline, expandableCard];
});
