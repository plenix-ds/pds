/* Plenix design system · library part w07K: the command bar (the owner's decisions of 2026-10-14, from the command bar
   study): the Command bar pattern (CommandBar, its four situations and three layouts, ViewMenu) and its find-and-view
   panels: FilterPanel (Filter panel; also Advanced filters; the Query builder is its own record, w08B), SortPanel (Sort control), GroupPanel
   (Grouping), ColumnsMenu and ManageColumnsDialog (Reordering) and QuickFilter (Quick filters). Every color is an existing
   role. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, box = H.box, use = H.use, noop = H.noop;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', ANT = 'Ant Design', AIR = 'Airtable';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };

  /* ── the sample collections: assets (both), an activity log (filters only), team members (menu only), storage (neither) ── */
  var TYPES = ['Image', 'Document', 'Video'], CATS = ['Projects', 'Brand', 'Marketing', 'Finance'];
  var NAMES = ['Hero banner', 'Logo', 'Annual report', 'Teaser', 'Brochure', 'Icon set'];
  var ASSETS = Array.from({ length: 18 }, function (x, i) { return { id: i + 1, name: NAMES[i % 6] + ' ' + (i + 1), type: TYPES[i % 3], category: CATS[i % 4], size: (i * 37) % 90 + 1, modified: '2026-10-' + String((i % 14) + 1).padStart(2, '0') }; });
  var ASSET_FIELDS = [{ value: 'name', label: 'Name', kind: 'text' }, { value: 'type', label: 'Type', kind: 'select', options: TYPES }, { value: 'category', label: 'Category', kind: 'select', options: CATS },
    { value: 'size', label: 'Size (MB)', kind: 'number' }, { value: 'modified', label: 'Modified', kind: 'date' }];
  var ASSET_COLUMNS = [{ title: 'Name', field: 'name', kind: 'name' }, { title: 'Type', field: 'type', type: 'select' }, { title: 'Category', field: 'category', type: 'select' },
    { title: 'Size (MB)', field: 'size', kind: 'data', sorter: 'number', align: 'right' }, { title: 'Modified', field: 'modified', kind: 'data', sorter: 'date' }];
  var PEOPLE = ['Maya Chen', 'Liam Novak', 'Ava Lopez', 'Noah Singh'], ACTS = ['Uploaded', 'Edited', 'Shared', 'Moved'], APPS = ['DAM', 'Notes', 'Tasks'];
  var EVENTS = Array.from({ length: 16 }, function (x, i) { return { id: i + 1, person: PEOPLE[i % 4], action: ACTS[(i * 3) % 4], item: NAMES[i % 6] + ' ' + (i + 1), app: APPS[i % 3], time: '2026-10-' + String(14 - (i % 13)).padStart(2, '0') }; });
  var EVENT_FIELDS = [{ value: 'person', label: 'Person', kind: 'select', options: PEOPLE }, { value: 'action', label: 'Action', kind: 'select', options: ACTS }, { value: 'item', label: 'Item', kind: 'text' },
    { value: 'app', label: 'App', kind: 'select', options: APPS }, { value: 'time', label: 'Time', kind: 'date' }];
  var EVENT_COLUMNS = [{ title: 'Person', field: 'person', kind: 'name' }, { title: 'Action', field: 'action', type: 'select' }, { title: 'Item', field: 'item' }, { title: 'App', field: 'app', type: 'select' }, { title: 'Time', field: 'time', kind: 'data', sorter: 'date' }];
  var MEMBERS = PEOPLE.map(function (n, i) { return { id: i + 1, name: n, email: n.split(' ')[0].toLowerCase() + '@example.com', role: ['Owner', 'Admin', 'Editor', 'Viewer'][i] }; });
  var MEMBER_COLUMNS = [{ title: 'Name', field: 'name', kind: 'name' }, { title: 'Email', field: 'email', kind: 'data' }, { title: 'Role', field: 'role', type: 'select' }];
  var STORAGE = [{ id: 1, kind: 'Images', files: 1284, size: '12.4 GB' }, { id: 2, kind: 'Documents', files: 312, size: '1.1 GB' }, { id: 3, kind: 'Video', files: 48, size: '38.9 GB' }];
  var STORAGE_COLUMNS = [{ title: 'File type', field: 'kind', kind: 'name' }, { title: 'Files', field: 'files', kind: 'data', align: 'right' }, { title: 'Size', field: 'size', kind: 'data', align: 'right' }];
  var NEW_ITEMS = function () { return [h(P.MenuItem, { key: 'f', icon: 'folder-add' }, 'Folder'), h(P.MenuItem, { key: 'u', icon: 'upload' }, 'Upload files'), h(P.MenuItem, { key: 'i', icon: 'import' }, 'Import from link')]; };
  var FEW = [{ id: 'new', label: 'New', icon: 'plus', items: NEW_ITEMS() }, { id: 'upload', label: 'Upload', icon: 'upload', onSelect: noop }];
  var MANY = FEW.concat([['folder-add', 'New folder'], ['import', 'Import'], ['export', 'Export'], ['share', 'Share'], ['settings-permissions', 'Permissions'], ['gear', 'Settings']].map(function (x) { return { id: x[1], label: x[1], icon: x[0], onSelect: noop }; }));
  var BULK = [{ id: 'download', label: 'Download', icon: 'download-arrow', onSelect: noop }, { id: 'move', label: 'Move', icon: 'move', onSelect: noop }, { id: 'share', label: 'Share', icon: 'share', onSelect: noop },
    { id: 'rename', label: 'Rename', icon: 'rename', single: true, onSelect: noop }, { id: 'delete', label: 'Delete', icon: 'trash', danger: true, onSelect: noop }];
  var plural = function (n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); };

  // the bar and its table, live: the panels drive the table (useCollectionView)
  var Collection = function (props) {
    var sit = props.sit || 'both';
    var data = sit === 'filters' ? EVENTS : ASSETS, fields = sit === 'filters' ? EVENT_FIELDS : ASSET_FIELDS;
    var sel = use(props.selected || []);
    var v = P.useCollectionView(fields, { text: function (r) { return sit === 'filters' ? r.person + ' ' + r.action + ' ' + r.item : r.name; }, quick: sit === 'both' ? { category: 'list' } : {}, today: '2026-10-14' });
    var n = v.count(data);
    var find = h(React.Fragment, null, h(P.CommandBarSearch, Object.assign({ placeholder: sit === 'filters' ? 'Search activity' : 'Search assets' }, v.searchProps)), h(P.FilterPanel, v.filterProps));
    // the app's quick filter: when the bar is short of room it folds into More after the commands (the Fluent model)
    var quickFilters = sit === 'both' ? [Object.assign({ id: 'category', label: 'Category', icon: 'settings-categories', noun: 'category', options: CATS }, v.quickProps('category'))] : [];
    var view = h(React.Fragment, null, h(P.SortPanel, v.sortProps), h(P.GroupPanel, v.groupProps), h(P.ColumnsMenu, v.columnsProps), h(P.ViewMenu, Object.assign({ gallery: sit === 'both' }, v.viewProps)));
    // the selection (the swap, owner 2026-10-15): while rows are selected the bar holds these commands
    var selection = sit === 'filters' ? null : { count: sel[0].length, noun: 'asset', onClear: function () { sel[1]([]); }, actions: BULK };
    return h('div', { className: 'ds-w07k-screen' },
      h(P.CommandBar, { label: sit === 'filters' ? 'Activity log' : 'Assets', layout: props.layout, narrow: props.narrow, actions: sit === 'filters' ? [] : props.many ? MANY : FEW,
        count: plural(n, sit === 'filters' ? 'event' : 'asset'), find: find, quickFilters: quickFilters, view: view, end: sit === 'filters' ? h(P.Button, { size: 'sm', variant: 'ghost', icon: 'export' }, 'Export') : null, selection: selection }),
      props.table === false ? null : h(P.DataGrid, Object.assign({ label: sit === 'filters' ? 'Activity log' : 'Assets', data: data, columns: sit === 'filters' ? EVENT_COLUMNS : ASSET_COLUMNS, selectable: sit !== 'filters',
        selected: sel[0], onSelectionChange: sel[1], height: '--plx-ref-size-240px' }, v.tableProps)));
  };
  // menu only: team members, an action, and the selection's commands when members are selected; no find or view
  var Members = function () {
    var sel = use([]);
    var roles = ['Admin', 'Editor', 'Viewer'].map(function (r) { return { id: r, label: 'Make ' + r.toLowerCase(), onSelect: noop }; });
    return h('div', { className: 'ds-w07k-screen' },
      h(P.CommandBar, { label: 'Team members', actions: [{ id: 'invite', label: 'Invite member', icon: 'plus', onSelect: noop }],
        selection: { count: sel[0].length, noun: 'member', onClear: function () { sel[1]([]); },
          actions: [{ id: 'role', label: 'Change role', icon: 'settings-permissions', items: roles }, { id: 'resend', label: 'Resend invitation', icon: 'mail', onSelect: noop }, { id: 'remove', label: 'Remove', icon: 'trash', danger: true, onSelect: noop }] } }),
      h(P.DataGrid, { label: 'Team members', data: MEMBERS, columns: MEMBER_COLUMNS, selectable: true, selected: sel[0], onSelectionChange: sel[1] }));
  };
  var Storage = function () { return h(P.DataGrid, { label: 'Storage by file type', data: STORAGE, columns: STORAGE_COLUMNS }); };
  // a bar alone (the cards): no table under it
  var bar = function (props) { return box(props.width || null, h(Collection, Object.assign({ table: false }, props))); };
  // the Fluent model (owner, 2026-10-15): an on/off setting is a toggle command, a pick of one value a choices command;
  // folded into More they become a checked item and a submenu; the status text sits with the count
  var Settings = function (props) {
    var auto = use(true), who = use('rm');
    var actions = [{ id: 'mail', label: 'Send', icon: 'mail', onSelect: noop },
      { id: 'auto', label: 'Auto refresh', icon: 'refresh', toggle: true, pressed: auto[0], onSelect: auto[1] },
      { id: 'who', label: 'Profile', icon: 'person', value: who[0], onChange: who[1], choices: [{ value: 'rm', label: 'Jordan' }, { value: 'sm', label: 'Sarah' }, { value: 'jd', label: 'John' }] },
      { id: 'pin', label: 'Pin', icon: 'pin', onSelect: noop }];
    return box(props.width || null, h(P.CommandBar, { label: 'Posts', narrow: props.narrow, actions: actions, count: '24 posts', status: 'Synced 2 min ago', sticky: false,
      find: h(P.CommandBarSearch, { placeholder: 'Search posts', value: '', onChange: noop }), view: h(P.Button, { size: 'sm', variant: 'ghost', icon: 'sort' }, 'Sort') }));
  };

  /* ── 10 Patterns › Data-management workflows › Data-table workflow: the Command bar ── */
  var commandBar = { id: 'command-bar', lab: true, icon: 'view-table', sec: 'patterns', sub: 'Data-management workflows', leaf: 'Data-table workflow', title: 'Command bar',
    plenix: 'CommandBar, CommandBarButton, CommandBarSearch, ViewMenu, useCollectionView', src: 'patterns/CommandBar/CommandBar.jsx', also: ['patterns/ViewMenu/ViewMenu.jsx', 'patterns/CommandBar/BarActions.jsx', 'hooks/useCollectionView.ts', 'utils/barFit.ts'],
    css: ['patterns/CommandBar/command-bar.css'], blocks: ['plx-command-bar', 'plx-bar-actions'], level: 'Pattern', interaction: 'Action', statesFrom: ['button', 'action-menu'],
    aliases: ['Menu bar', 'Collection toolbar', 'Table toolbar', 'View bar', 'Find bar', 'Data-table workflow'],
    text: 'The bar over a collection: one white framed bar of one height, fixed at the top of the content while the content scrolls; the table never moves. With nothing selected it holds the actions, then the search and the filters, then Sort, Group, Columns and View, and the count at the end. With rows selected it swaps (Microsoft 365): the selection’s commands, Delete last, replace only the page’s actions; the search, the filters and Sort, Group, Columns and View stay; "× N selected" at the end clears the selection. A page that only finds has a view bar. Every button is ghost, with its icon and label; when the bar does not fit, icons only with tooltips, then the commands fold into More one at a time from the end, Delete last.',
    use: [
      'Four situations. Filters only (an activity log): the view bar, no selection. Menu only (team members): the actions, which swap to the selection’s commands, no find side. Both (assets): actions, find and view in one bar; many actions fold into More. Neither (storage by file type): no bar, the plain table',
      'One bar, one height: a selection swaps its content (the selection’s commands; Sort, Group, Columns and View stay; "× N selected" at the end), never a second bar or row, so the table never moves',
      'One white framed bar (3A) with 4px corners, fixed at the top of the content while the content scrolls; never tinted while rows are selected',
      'Every button ghost (no outline): the actions, the find-and-view controls and the selection’s commands; no primary by default (a page may mark one)',
      'Icon and label while the bar fits; icons only with tooltips when it does not; then the actions fold into More (⋮) one at a time from the end, Delete last. More appears only on real overflow',
      'Within a state, commands are never hidden: one that does not apply (Rename with two rows selected) is disabled, with a tooltip saying why',
      'The search first on the find side at one fixed width (240px); narrow, its icon in the same place opens the field across the bar (× clears, Escape closes, the focus returns)',
      'Filter, the app’s quick filters (Category, Type, Tags, Date), Sort, Group, Columns and View, in that order. Filter and Group read their names, tinted with a count badge while active; a quick filter and Sort show the choice in force ("Status: In review", "Sort: Updated", "+1" for more), tinted. Icons only, they keep the count badge and the tooltip says the choice',
      'A hovered button’s icon takes the action color (red commands keep red); hover, pressed and on are neutral gray',
      'Delete and other destructive commands last, after a divider, in the danger color; one that cannot be undone asks to confirm (DeleteFlow or ConfirmDialog)',
      'Sort, Filter, Group, View and Columns each keep their own button at every width: never merged into one control',
      'Short of room (the Fluent model, owner 2026-10-15): first every labeled control becomes its icon; then the search becomes its icon and the count and status step out; then the commands fold into More from the end, Delete last; then the quick filters fold into More, each a submenu of checkable values. Sort, Filter, Group, Columns and View never fold',
      'The bar holds commands only: an on/off setting is a toggle command, a pick of one value a choices command; no other controls in the bar',
      'The row height in the View menu only: the table has no view button of its own',
      'The menus’ thin chevron (expand_more, muted) on every menu button'
    ],
    avoid: [
      'Buttons above the bar in the page header (New, Upload): they belong to the bar',
      'Filter chips under the bar, or a second bar or row: a selection bar under the bar, a separate action bar for many actions',
      'A bar that turns blue on a selection, changes height, or floats at the bottom: the selection swaps the bar’s content in place',
      'Gray, borderless, tinted or raised bars: the bar is white and framed',
      'Text-only buttons, or outlined buttons in the bar',
      'Hiding a command that does not apply yet: show it disabled with its reason',
      'One merged "View options" control at narrow widths',
      'A search squeezed to an odd width'
    ],
    related: ['filter-panel', 'sort-panel', 'group-panel', 'columns-menu', 'quick-filter', 'data-grid', 'search-input', 'toolbar'],
    map: [[CAR, 'Data table toolbar and batch actions', 'Partial'], [FLU, 'CommandBar', 'Direct'], [ATL, 'Page header actions', 'Partial'], [AIR, 'View bar', 'Direct'], [POL, 'IndexFilters', 'Partial']],
    variantPages: [
      vp('One bar (1A)', 'Layout', 'One bar (1A)', { variant: 'one' }, 'The actions at the start, the search and the filters after a divider, Sort, Group, Columns and View at the end, the count last.', 'Pages with actions and a collection to find in: assets, files, records', 'A second bar for many actions: they fold into More'),
      vp('Command bar with rows selected', 'Layout', 'Rows selected (the swap)', { variant: 'selected' }, 'The selection’s commands, Delete last; Sort, Group, Columns and View where they were; "× N selected" at the end clears the selection. Same height: the table does not move.', 'Any collection whose rows can be selected', 'A selection bar under the bar, or a bar that turns blue'),
      vp('View bar (1F)', 'Layout', 'View bar (1F)', { variant: 'view' }, 'No actions: the search and a named button per view setting, the count and Export at the end.', 'Pages that only find: an activity log, an audit trail, a report', 'Pages with actions: use one bar'),
      vp('Command bar with icon and label', 'Width', 'Icon and label', { content: 'labels' }, 'Every control with its icon and label while the bar fits on one line.', 'The bar at a page’s width', 'Squeezing labels: the bar steps down to icons on its own'),
      vp('Narrow command bar', 'Width', 'Icons only, the search as its icon (narrow)', { content: 'icons' }, 'Icons with tooltips, the search as its icon, and the actions that still do not fit in More; Filter, Sort, Group, Columns and View keep their own buttons.', 'A side panel’s width, a narrow window', 'Merging Filter, Sort, Group and View into one control')
    ],
    examples: [
      ['Both: one bar (1A) over the table; select rows to see the swap', function () { return box(null, h(Collection, { sit: 'both' })); }],
      ['Both, two rows selected: the bar swapped to the selection’s commands', function () { return box(null, h(Collection, { sit: 'both', selected: [1, 2] })); }],
      ['Filters only: the view bar (1F) on an activity log', function () { return box(null, h(Collection, { sit: 'filters' })); }],
      ['Menu only: team members; select members to see their commands', function () { return box(null, h(Members)); }],
      ['Neither: the plain table, no bar', function () { return box(560, h(Storage)); }],
      ['Layout', [['One bar (1A)', function () { return bar({ sit: 'both' }); }, null, 'layout="one"'],
        ['Rows selected (the swap)', function () { return bar({ sit: 'both', selected: [1, 2] }); }, null, 'selection={{ count: 2, … }}'],
        ['View bar (1F)', function () { return bar({ sit: 'filters' }); }, null, 'layout="view"']], { prop: 'layout' }],
      ['Width', [['Icon and label', function () { return bar({ sit: 'both' }); }, null, 'narrow={false}'],
        ['Icons only, the search as its icon (narrow)', function () { return bar({ sit: 'both', narrow: true, width: 400 }); }, null, 'narrow']]],
      ['Toggle and choices commands (the Fluent model)', [['Wide: a pressed toggle, a choice showing its value, the status with the count', function () { return h(Settings, { width: 760 }); }, null, 'actions[].toggle, actions[].choices, status'],
        ['A side panel’s width: icons first, then the count and status step out, then the commands fold into More', function () { return h(Settings, { narrow: true, width: 380 }); }, null, 'narrow']]],
      ['The View menu (6B): layout, card size and row height, the parts that do not apply disabled', function () { var v = use({ layout: 'list', size: 'm', height: 'short' }); return box(320, h(P.Toolbar, { label: 'View' }, h(P.ViewMenu, { value: v[0], onChange: v[1] }))); }]
    ] };

  /* ── 06 Navigation › Search, filter, and discovery › Filter panel: FilterPanel ── */
  var FilterDemo = function (props) { var f = use(props.value || { join: 'and', items: [] }); return h(P.FilterPanel, { fields: ASSET_FIELDS, value: f[0], onChange: f[1], inline: props.inline }); };
  var filterPanel = { id: 'filter-panel', lab: true, icon: 'filter', sec: 'navigation', sub: 'Search, filter, and discovery', leaf: 'Filter panel', title: 'Filter panel',
    plenix: 'FilterPanel, matchesFilter', src: 'patterns/FilterPanel/FilterPanel.jsx', also: ['utils/fields.ts', 'patterns/CommandBar/panel-parts.jsx'], css: ['patterns/CommandBar/find-panel.css'], blocks: ['plx-find-panel', 'plx-find-pick', 'plx-find-pill'],
    level: 'Composite', interaction: 'Filter', statesFrom: ['button', 'action-menu'], covers: ['Advanced filters'],
    aliases: ['Filter', 'Advanced filter', 'Condition builder', 'Where clause'],
    text: 'The command bar’s Filter, in the Airtable style: a Filter button that opens a panel of conditions. Conditions join with Where on the first row, then and or or; each has a field with its type icon, an operator in the field type’s words, and a value (text, a number, a date, the past week, or options shown as pills in their colors). Condition groups go one level deep. The panel holds every possibility, so it is never labeled "advanced"; quick filters are shortcuts beside it.',
    use: ['Every collection whose records people narrow by their fields', 'The button reads Filter; with conditions it takes the tint and a count badge', 'Operators by the field’s type: contains, is any of, has any of, =, is before, is within', 'Condition groups for an or inside an and'],
    avoid: ['Filter chips under the command bar: except on the Search workspace, set filters show in their buttons', 'Labeling it "Advanced"', 'A filter that applies on Apply: conditions apply as they change'],
    related: ['command-bar', 'quick-filter', 'sort-panel', 'group-panel', 'data-grid'],
    map: [[AIR, 'Filter', 'Direct'], [ATL, 'JQL basic filters', 'Partial'], [CAR, 'Filtering (panel)', 'Partial'], [ANT, 'QueryFilter', 'Partial']],
    variantPages: [
      vp('Filter button', 'Bar button', 'Filter (no conditions)', { variant: 'idle' }, 'The bar button with its icon and the word Filter.', 'The bar while nothing is filtered', 'Rewording it ("Filtered by 2 fields"): the word stays, the badge counts'),
      vp('Active filter button', 'Bar button', 'Filter with conditions (tint and count)', { variant: 'active' }, 'The tint and a count badge while conditions apply.', 'Showing that the rows are filtered', 'A second marker elsewhere'),
      vp('Filter panel with conditions', 'Panel', 'The panel with conditions and a group', { content: 'conditions' }, 'Where, and, or; fields, operators, values as pills; a condition group on the sunken surface.', 'Narrowing by several fields', 'More than one level of groups')
    ],
    examples: [
      ['Bar button', [['Filter (no conditions)', function () { return box(240, h(P.Toolbar, { label: 'Find' }, h(FilterDemo))); }, null, 'value={{ items: [] }}'],
        ['Filter with conditions (tint and count)', function () { return box(240, h(P.Toolbar, { label: 'Find' }, h(FilterDemo, { value: { join: 'and', items: [{ id: 'a', field: 'type', op: 'any', value: ['Image'] }, { id: 'b', field: 'name', op: 'contains', value: 'logo' }] } }))); }, null, 'value={{ items: [2 conditions] }}']]],
      ['Panel', [['The panel with conditions and a group', function () { return box(720, h(FilterDemo, { inline: true, value: { join: 'and', items: [{ id: 'a', field: 'type', op: 'any', value: ['Image', 'Video'] }, { id: 'b', field: 'category', op: 'none', value: ['Finance'] },
        { id: 'g', group: true, join: 'or', items: [{ id: 'c', field: 'size', op: 'gt', value: '40' }, { id: 'd', field: 'modified', op: 'within', value: 'week' }] }] } })); }, null, 'inline']]]
    ] };

  /* ── 06 Navigation › Search, filter, and discovery › Sort control: SortPanel ── */
  var SortDemo = function (props) { var s = use(props.value || []); return h(P.SortPanel, { fields: ASSET_FIELDS, value: s[0], onChange: s[1], grouped: props.grouped, inline: props.inline }); };
  var sortPanel = { id: 'sort-panel', lab: true, icon: 'sort', sec: 'navigation', sub: 'Search, filter, and discovery', leaf: 'Sort control', title: 'Sort control',
    plenix: 'SortPanel, compareLevels', src: 'patterns/SortPanel/SortPanel.jsx', also: ['utils/fields.ts'], css: ['patterns/CommandBar/find-panel.css'], blocks: ['plx-find-panel'], level: 'Composite', interaction: 'Filter', statesFrom: ['button', 'action-menu'],
    aliases: ['Sort', 'Sort by', 'Multi-sort', 'Order by'],
    text: 'The command bar’s Sort, in the Airtable style: a Sort button that opens the sort levels, plus Add another sort. Each level has a field with its type icon, a direction in the field type’s words (A → Z, 1 → 9, Oldest → newest), remove and a handle. While the collection is grouped, the panel reads "Sort within groups by".',
    use: ['Ordering a collection by one field or several', 'The button shows the sort in force (a pop-up button): Sort while there is none, "Sort: Updated" with one level, "Sort: Updated +1" with more, tinted', 'Reordering levels by drag, the handle’s Move up and Move down, or Alt + Arrow Up / Down'],
    avoid: ['A sort menu with a fixed list of orders', 'Wording that hides the field ("Sorted by 1 field")'],
    related: ['command-bar', 'group-panel', 'filter-panel', 'data-grid'],
    map: [[AIR, 'Sort', 'Direct'], [CAR, 'Data table sorting', 'Partial'], [POL, 'IndexFilters sort', 'Partial']],
    variantPages: [
      vp('Sort button', 'Bar button', 'Sort (no levels)', { variant: 'idle' }, 'The bar button with its icon and the word Sort.', 'The bar while the rows keep their own order', 'Rewording it'),
      vp('Sort panel with levels', 'Panel', 'Two sort levels', { content: 'levels' }, 'Two levels: the main sort first, the next where the first is the same.', 'Ordering by a field, then another', 'More levels than people can follow'),
      vp('Sort within groups', 'Panel', 'Sort within groups by', { content: 'grouped' }, 'The title while the collection is grouped.', 'Ordering the rows inside each group', 'Sorting the groups themselves: their order is the Group panel’s')
    ],
    examples: [
      ['Bar button', [['Sort (no levels)', function () { return box(240, h(P.Toolbar, { label: 'View' }, h(SortDemo))); }, null, 'value={[]}']]],
      ['Panel', [['Two sort levels', function () { return box(560, h(SortDemo, { inline: true, value: [{ field: 'modified', dir: 'desc' }, { field: 'name', dir: 'asc' }] })); }, null, 'inline'],
        ['Sort within groups by', function () { return box(560, h(SortDemo, { inline: true, grouped: true, value: [{ field: 'name', dir: 'asc' }] })); }, null, 'grouped']]]
    ] };

  /* ── 10 Patterns › Selection and organization › Grouping: GroupPanel ── */
  var GroupDemo = function (props) { var g = use(props.value || []); return h(P.GroupPanel, { fields: ASSET_FIELDS.filter(function (f) { return f.kind === 'select'; }), value: g[0], onChange: g[1], inline: props.inline }); };
  var groupPanel = { id: 'group-panel', lab: true, icon: 'group-by', sec: 'patterns', sub: 'Selection and organization', leaf: 'Grouping', title: 'Grouping',
    plenix: 'GroupPanel', src: 'patterns/GroupPanel/GroupPanel.jsx', css: ['patterns/CommandBar/find-panel.css'], blocks: ['plx-find-panel'], level: 'Composite', interaction: 'Filter', statesFrom: ['button', 'action-menu'],
    aliases: ['Group by', 'Group', 'Subgroup', 'Nested groups'],
    text: 'The command bar’s Group, in the Airtable style: a Group button (the group-by icon, stacked rows) opens the group levels, each with a field, its order, a … menu (Hide empty groups), remove and a handle; below them Add subgroup, and Collapse all and Expand all at the top. The DataGrid draws each level as nested Airtable-style group rows.',
    use: ['Gathering records that share a value under one header', 'A subgroup to split each group again', 'Collapse all and Expand all over a long grouped table'],
    avoid: ['Grouping by a free-text field: every row becomes its own group', 'More than two or three levels'],
    related: ['command-bar', 'sort-panel', 'data-grid'],
    map: [[AIR, 'Group', 'Direct'], [ATL, 'Group by (boards)', 'Partial'], [ANT, 'Table expandable groups', 'Partial']],
    variantPages: [
      vp('Group button', 'Bar button', 'Group (not grouped)', { variant: 'idle' }, 'The bar button with the group-by icon and the word Group.', 'The bar while the table is not grouped', 'A list-bullets icon: Group has its own icon'),
      vp('Group panel with a subgroup', 'Panel', 'A group and a subgroup', { content: 'levels' }, 'Two levels: the outer group first; Collapse all and Expand all at the top.', 'Grouping by type, then by category', 'Deep nesting')
    ],
    examples: [
      ['Bar button', [['Group (not grouped)', function () { return box(240, h(P.Toolbar, { label: 'View' }, h(GroupDemo))); }, null, 'value={[]}']]],
      ['Panel', [['A group and a subgroup', function () { return box(600, h(GroupDemo, { inline: true, value: [{ field: 'type', dir: 'asc' }, { field: 'category', dir: 'asc' }] })); }, null, 'inline']]]
    ] };

  /* ── 10 Patterns › Selection and organization › Reordering: ColumnsMenu and ManageColumnsDialog ── */
  var COL_FIELDS = ASSET_FIELDS.map(function (f) { return { value: f.value, label: f.label }; });
  var ColumnsDemo = function (props) { var c = use({ order: ['name', 'type', 'category', 'size', 'modified'], hidden: ['size'] }); return props.dialog ? h(P.ManageColumnsDialog, { fields: COL_FIELDS, value: c[0], onChange: c[1] }) : h(P.ColumnsMenu, { fields: COL_FIELDS, value: c[0], onChange: c[1], inline: props.inline }); };
  var columnsMenu = { id: 'columns-menu', lab: true, icon: 'fields', sec: 'patterns', sub: 'Selection and organization', leaf: 'Reordering', title: 'Reordering',
    plenix: 'ColumnsMenu, ManageColumnsDialog', src: 'patterns/ColumnsMenu/ColumnsMenu.jsx', css: ['patterns/CommandBar/find-panel.css'], blocks: ['plx-columns-list'], level: 'Composite', interaction: 'Drag and drop', statesFrom: ['button', 'checkbox'],
    aliases: ['Columns', 'Manage columns', 'Hide fields', 'Column chooser', 'First column', 'Reorder'],
    text: 'Reordering a list, here a collection’s columns. The Columns dropdown lists every column with a handle that opens a Move up and Move down menu and a checkbox (shown or hidden), under a First column select (the first is pinned). Manage columns is the same list in a dialog, with a find field, Show all, Hide all and a First column select, applied with Apply. Every move has a way without dragging (the handle’s menu, or Alt + Arrow Up / Down on a focused row), and each move is announced.',
    use: ['Choosing which columns show and in which order', 'First column for the column that names the rows', 'The dialog for a long column list'],
    avoid: ['Drag as the only way to move', 'Hiding the first column'],
    related: ['command-bar', 'data-grid', 'group-panel'],
    map: [[AIR, 'Hide fields', 'Partial'], [CAR, 'Data table column customization', 'Partial'], [FLU, 'DataGrid column options', 'Partial']],
    variantPages: [
      vp('Columns dropdown', 'Form', 'The Columns dropdown', { variant: 'dropdown' }, 'The list in the bar’s dropdown; changes apply at once.', 'Hiding or moving a few columns', 'A very long list: use the dialog'),
      vp('Manage columns dialog', 'Form', 'The Manage columns dialog', { variant: 'dialog' }, 'The list in a dialog with a find field, Show all, Hide all and First column; applied with Apply.', 'Many columns, or several changes at once', 'One quick change: the dropdown is closer')
    ],
    examples: [
      ['Form', [['The Columns dropdown', function () { return box(560, h(ColumnsDemo, { inline: true })); }, null, 'inline'],
        ['The Manage columns dialog', function () { return box(240, h(ColumnsDemo, { dialog: true })); }, null, '<ManageColumnsDialog>']]]
    ] };

  /* ── 06 Navigation › Search, filter, and discovery › Quick filters: QuickFilter ── */
  var TAGS = ['Approved', 'Draft', 'Client', 'Internal', 'Print', 'Web', 'Archive', 'Hero'];
  var QuickDemo = function (props) {
    var v = use(props.kind === 'date' ? { preset: '7', from: '', to: '' } : props.value || []);
    return h(P.QuickFilter, { kind: props.kind, label: props.kind === 'date' ? 'Date' : 'Tags', icon: props.kind === 'date' ? 'calendar' : 'tags', noun: 'tag', options: TAGS, value: v[0], onChange: v[1], inline: props.inline });
  };
  var quickFilter = { id: 'quick-filter', lab: true, icon: 'tags', sec: 'navigation', sub: 'Search, filter, and discovery', leaf: 'Quick filters', title: 'Quick filters',
    plenix: 'QuickFilter, matchesDate', src: 'patterns/QuickFilter/QuickFilter.jsx', css: ['patterns/CommandBar/find-panel.css'], blocks: ['plx-find-panel'], level: 'Composite', interaction: 'Filter', statesFrom: ['button', 'checkbox'],
    aliases: ['Category filter', 'Type filter', 'Tags filter', 'Date filter', 'Date range filter', 'Label filter'],
    text: 'An application’s own shortcuts beside Filter: Category, Type, Tags and Date; an app shows its own Category or Type button only when it has categories or types. The list kind opens a searchable checklist of the field’s values shown as their pills (the GitHub labels style); the date kind opens presets and a date range (the Google Analytics style). The Filter panel still holds every possibility.',
    use: ['The one or two questions an app’s people ask most (Category, Type, Tags, Date)', 'Between Filter and Sort in the bar', 'The find field fills the panel', 'The button shows the choice in force (a pop-up button): "Status: In review", "Tags: Client +2", "Date: Last 7 days"; its name alone while it does not filter'],
    avoid: ['Quick filters an app does not have', 'A row of chips under the command bar: except on the Search workspace, set filters show in their buttons'],
    related: ['command-bar', 'filter-panel'],
    map: [[POL, 'Filters (quick)', 'Partial'], ['GitHub', 'Labels filter', 'Direct'], ['Google Analytics', 'Date range', 'Direct']],
    variantPages: [
      vp('Checklist quick filter', 'Kind', 'Searchable checklist (Tags, Category, Type)', { variant: 'list' }, 'A find field that fills the panel, then each value as a checkbox with its pill; Clear in the footer.', 'Tags, categories, types', 'A field with one or two values: a filter condition is enough'),
      vp('Date quick filter', 'Kind', 'Presets and a range (Date)', { variant: 'date' }, 'Any time, Last 7 days, Last 30 days, This year, or a custom range from and to.', 'Dates people narrow by most', 'Exact timestamps: use a Filter condition')
    ],
    examples: [
      ['Kind', [['Searchable checklist (Tags, Category, Type)', function () { return box(320, h(QuickDemo, { inline: true, value: ['Client'] })); }, null, 'kind="list"'],
        ['Presets and a range (Date)', function () { return box(320, h(QuickDemo, { kind: 'date', inline: true })); }, null, 'kind="date"']]],
      ['In the bar: Tags and Date', function () { return box(360, h(P.Toolbar, { label: 'Quick filters' }, h(QuickDemo, { value: ['Client'] }), h(QuickDemo, { kind: 'date' }))); }]
    ] };

  return [commandBar, filterPanel, sortPanel, groupPanel, columnsMenu, quickFilter];
});
