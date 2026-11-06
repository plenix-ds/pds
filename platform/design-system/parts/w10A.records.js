/* Plenix design system · library part w10A (wave 10, lane A): drag and drop. The engine (utils/dnd.ts: its own page, and
   the pages of Drag and drop, Reposition and Accessible drag and drop drawn on it), DragHandle, SortableList (Reordering
   is answered in w07K by the columns list), DropZone as a drop target (an extension), Resizable (with PanelSplitter,
   promoted from AppShell) and RenameAction. Every color is an existing role. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, use = H.use, noop = H.noop, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', HIG = 'Apple HIG';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var DND_CSS = ['system/dnd.css'];

  /* ── the sample data ── */
  var STEPS = [{ id: 's1', name: 'Upload the scans' }, { id: 's2', name: 'Tag the pictures' }, { id: 's3', name: 'Pick the cover' }, { id: 's4', name: 'Write the captions' }, { id: 's5', name: 'Publish the collection' }];
  var VIEWS = [{ id: 'v1', name: 'Recent uploads', icon: 'upload' }, { id: 'v2', name: 'Brand kit', icon: 'folder' }, { id: 'v3', name: 'Needs review', icon: 'flag' }, { id: 'v4', name: 'Archive', icon: 'archive' }, { id: 'v5', name: 'Pinned', icon: 'pin' }, { id: 'v6', name: 'Shared with me', icon: 'share' }];
  var ASSETS = [{ id: 'a1', name: 'Cross 014.png', type: 'image' }, { id: 'a2', name: 'Border 007.svg', type: 'image' }, { id: 'a3', name: 'Letterhead.pdf', type: 'document' }];
  var withIcon = function (x) { return h(P.Inline, { gap: 'sm' }, h(P.Icon, { name: x.icon }), h(P.Text, null, x.name)); };

  /* ── live examples (each a small component: the spec renders an example as one) ── */
  var Sortable = function (p) {
    var s = use(p.items || STEPS);
    return box(p.width || 400, h(P.SortableList, Object.assign({ label: p.label || 'Steps', items: s[0], onReorder: s[1] }, p.props || {})));
  };
  var Board = function () {
    var cols = use({ todo: STEPS.slice(0, 3), done: STEPS.slice(3) });
    var LISTS = [['todo', 'To do'], ['done', 'Done']];
    var move = function (m) {
      var next = Object.assign({}, cols[0]);
      var moved = P.transferItem(next[m.from.list], m.from.index, next[m.to.list], m.to.index);
      next[m.from.list] = moved[0]; next[m.to.list] = moved[1];
      cols[1](next);
    };
    return box(720, h('div', { className: 'ds-w10a-two' }, LISTS.map(function (l) {
      return h(P.Stack, { key: l[0], gap: 'sm' }, h(P.Text, { variant: 'label' }, l[1]),
        h(P.SortableList, { id: l[0], group: 'w10a-board', label: l[1], items: cols[0][l[0]], onMove: move,
          onReorder: function (items) { var n = Object.assign({}, cols[0]); n[l[0]] = items; cols[1](n); } }));
    })));
  };
  // a data item dropped on targets: assets onto folders (the folders are drop zones that take some kinds)
  var Asset = function (p) {
    var d = P.useDraggable({ data: p.asset, type: p.asset.type, name: p.asset.name });
    var takers = d.targets();
    return h('div', Object.assign({}, d.props, { className: 'ds-w10a-asset ' + d.props.className }),
      h(P.Menu, { label: 'Move ' + p.asset.name, trigger: h(P.DragHandle, { dnd: d.handleProps }) },
        takers.length ? takers.map(function (t) { return h(P.MenuItem, { key: t.id, icon: 'move', onSelect: t.drop }, 'Move to ' + t.name); }) : h(P.MenuItem, { disabled: true }, 'No folder takes it')),
      h(P.Icon, { name: p.asset.type === 'image' ? 'image-a-2' : 'doc-text' }), h(P.Text, { variant: 'data' }, p.asset.name));
  };
  var Folders = function (p) {
    var log = use([]);
    var put = function (folder) { return function (asset) { log[1](function (l) { return [asset.name + ' moved to ' + folder].concat(l).slice(0, 3); }); }; };
    return box(600, h(P.Stack, { gap: 'md' },
      h(P.Stack, { gap: 'sm' }, ASSETS.map(function (a) { return h(Asset, { key: a.id, asset: a }); })),
      h('div', { className: 'ds-w10a-two' },
        h(P.DropZone, { name: 'Pictures', accepts: function (d, type) { return type === 'image'; }, onDropItem: put('Pictures'), rejectContent: h(P.Text, null, 'Pictures takes images only') }, h(P.Icon, { name: 'folder', size: 'lg' }), h(P.Text, { variant: 'label' }, 'Pictures'), h(P.Text, { variant: 'secondary' }, 'Drop images here')),
        h(P.DropZone, { name: 'Documents', accepts: function (d, type) { return type === 'document'; }, onDropItem: put('Documents'), rejectContent: h(P.Text, null, 'Documents takes documents only') }, h(P.Icon, { name: 'folder', size: 'lg' }), h(P.Text, { variant: 'label' }, 'Documents'), h(P.Text, { variant: 'secondary' }, 'Drop documents here'))),
      p.log === false ? null : h(P.LiveRegion, { kind: 'log', visible: true }, log[0].length ? h(P.Stack, { gap: 'none' }, log[0].map(function (t, i) { return h(P.Text, { key: i }, t); })) : h(P.Text, { variant: 'secondary' }, 'Drag an asset by its handle onto a folder, or press Space on the handle'))));
  };
  // a free move: a note on a board, by pointer, keyboard (pick up, arrows, drop) or the Move menu
  var Note = function (p) {
    var pos = use(p.at || { x: 0, y: 0 });
    var r = P.useReposition({ position: pos[0], onMove: pos[1], bounds: p.frame, name: p.name });
    var step = function (dx, dy) { return function () { r.moveBy(dx, dy); }; };
    return h('div', Object.assign({}, r.props, { className: 'ds-w10a-note ' + r.props.className }),
      h(P.Text, { variant: 'label' }, p.name),
      h(P.Menu, { label: 'Move ' + p.name, placement: 'bottom-end', trigger: h(P.Button, { size: 'xs', variant: 'ghost', iconOnly: true, icon: 'more', label: 'Move ' + p.name }) },
        h(P.MenuItem, { onSelect: step(-32, 0) }, 'Move left'), h(P.MenuItem, { onSelect: step(32, 0) }, 'Move right'),
        h(P.MenuItem, { onSelect: step(0, -32) }, 'Move up'), h(P.MenuItem, { onSelect: step(0, 32) }, 'Move down')));
  };
  var NoteBoard = function () {
    var frame = React.useRef(null);
    return box(600, h('div', { ref: frame, className: 'ds-w10a-board', role: 'group', 'aria-label': 'Mood board' },
      h(Note, { name: 'Cover ideas', frame: frame }), h(Note, { name: 'Color notes', frame: frame, at: { x: 240, y: 64 } })));
  };
  var Sized = function (p) {
    var s = use({ width: p.width, height: p.height });
    return h(P.Stack, { gap: 'sm' },
      h(P.Resizable, Object.assign({ label: p.label, axis: p.axis, width: p.axis === 'vertical' ? undefined : s[0].width, height: p.axis === 'horizontal' ? undefined : s[0].height,
        defaultWidth: p.width, defaultHeight: p.height, onResize: s[1], className: 'ds-w10a-sized' }, p.props || {}),
        h('div', { className: 'ds-w10a-sized__body' }, h(P.Text, { variant: 'label' }, p.label), h(P.Text, { variant: 'secondary' }, p.hint))),
      h(P.Text, { variant: 'data' }, (p.axis === 'vertical' ? '' : 'width ' + s[0].width + 'px') + (p.axis === 'both' ? ' · ' : '') + (p.axis === 'horizontal' ? '' : 'height ' + s[0].height + 'px')));
  };
  // the divider as SplitView draws it (owner, divider-words-410-34): two panels with the divider between, the split view's room
  // around them, its outer corners and the square corners at the divider all come from SplitView itself (no spec styles)
  var MAIL = [['Maya Chen', 'Kitchen render, second round'], ['Omar Haddad', 'Invoice 2026-114'], ['Sofia Rossi', 'Brand kit: new logo files'], ['Liam Walsh', 'Site walkthrough notes']]
    .map(function (x, i) { return { id: i + 1, from: x[0], subject: x[1] }; });
  var MAIL_COLS = [{ title: 'From', field: 'from', kind: 'name' }, { title: 'Subject', field: 'subject' }];
  var Divider = function () {
    var o = use(1);
    var item = MAIL.filter(function (x) { return x.id === o[0]; })[0];
    return h('div', { className: 'ds-demo-frame ds-demo-frame--fill ' + DS.sampleClass('block-size', H.W(320)) }, h(P.SplitView, { label: 'Inbox', firstLabel: 'Message list', defaultSize: 360,
      first: h(P.DataGrid, { label: 'Inbox', data: MAIL, columns: MAIL_COLS, mode: 'fill', narrow: 'table', viewMenu: false, selectable: true, selected: [o[0]], onSelectionChange: function (k) { if (k.length === 1) o[1](k[0]); }, onRowClick: function (r) { o[1](r.id); } }),
      second: h(P.ReadingPane, { label: item ? item.subject : 'Nothing selected', empty: h(P.EmptyState, { icon: 'mail', title: 'Select an item to read' }) },
        item ? h(P.Stack, { gap: 'sm' }, h(P.Text, { variant: 'heading' }, item.subject), h(P.Text, { variant: 'secondary' }, item.from)) : null) }));
  };
  var Rename = function (p) {
    var v = use(p.value || 'Cross 014.png');
    return h(P.Stack, { gap: 'sm' }, h(P.RenameAction, Object.assign({ value: v[0], onRename: v[1], names: ['Border 007.svg', 'Letterhead.pdf'], extension: true }, p.props || {})),
      h(P.Text, { variant: 'secondary' }, 'Other names in this folder: Border 007.svg, Letterhead.pdf'));
  };
  var RenameFromMenu = function () {
    var v = use('Brand kit'), open = use(false);
    return row(h(P.Menu, { label: 'Folder actions', trigger: h(P.Button, { caret: true }, 'Actions') },
      h(P.MenuItem, { icon: 'rename', onSelect: function () { open[1](true); } }, 'Rename…'), h(P.MenuItem, { icon: 'share', onSelect: noop }, 'Share')),
      h(P.Text, null, v[0]),
      h(P.RenameAction, { variant: 'dialog', open: open[0], onClose: function () { open[1](false); }, value: v[0], onRename: v[1], names: ['Archive', 'Pictures'] }));
  };
  var Handles = function () {
    return row(h(P.DragHandle, { label: 'Move Hero banner' }), h(P.DragHandle, { label: 'Move column Status', orientation: 'horizontal' }), h(P.DragHandle, { label: 'Move Archive', disabled: true }));
  };
  var KEYS = function (rows) {
    return box(600, h(P.Table, { label: 'Keys', data: rows.map(function (r, i) { return { id: i + 1, key: r[0], does: r[1] }; }),
      columns: [{ title: 'Key', field: 'key', kind: 'data', rowLabel: true }, { title: 'What it does', field: 'does', kind: 'wrap' }] }));
  };
  var API = function (rows) {
    return box(720, h(P.Table, { label: 'The engine', data: rows.map(function (r, i) { return { id: i + 1, name: r[0], what: r[1] }; }),
      columns: [{ title: 'Export', field: 'name', kind: 'data', rowLabel: true }, { title: 'What it does', field: 'what', kind: 'wrap' }] }));
  };
  var DND_STATES = [['Rest', 'The item in its place; the handle shows the grab pointer', 'The default'],
    ['Dragging', 'Raised (the overlay shadow), a little transparent, following the pointer; the page shows the grabbing pointer', 'data-plx-dnd-state="dragging"'],
    ['Picked up', 'Raised the same way, fully opaque; its handle takes the selected fill and aria-pressed', 'data-plx-dnd-state="picked"'],
    ['Drop position', 'A line in the focus ring’s color in the gap where the item lands', 'data-plx-drop="before|after"'],
    ['Target over', 'A dashed outline and the hover fill on the target under the item', 'data-plx-drop-state="over"'],
    ['Target refusing', 'A dashed outline in the danger color, the not-allowed pointer and words', 'data-plx-drop-state="reject"']];

  return [
    /* ── 04 Actions › Common actions › Rename: RenameAction ── */
    { id: 'rename-action', lab: true, icon: 'rename', sec: 'actions', sub: 'Common actions', leaf: 'Rename', title: 'Rename',
      plenix: 'RenameAction', src: 'patterns/RenameAction/RenameAction.tsx', level: 'Pattern', interaction: 'Editing',
      aliases: ['Rename', 'Edit name', 'Change name', 'F2'],
      text: 'Gives something a new name: in place, where the name turns into a field (inline, InlineEdit), or in a small dialog opened from a button or an actions menu (dialog). Both check the new name the same way: not empty, no slash or backslash, not the name of another item in the same place. A file keeps its extension, so only the name before it is selected.',
      use: ['Inline where the name is a heading or a row that people rename often (a board, a folder in a tree)', 'The dialog from an actions menu ("Rename…") where the name is not editable in place',
        'names: the other names in the same place, so a duplicate is refused before saving', 'extension for file names: the extension stays as it is'],
      avoid: ['Items people do not own: leave the action out, or disable it and give the reason', 'Editing other fields with it: use an edit form', 'Retyping the whole name: the current name is always in the field'],
      related: ['inline-edit', 'dialog', 'action-menu'],
      statesFrom: ['inline-edit', 'dialog'],
      map: [[FLU, 'Rename (File explorer pattern)', 'Partial'], [SPE, 'Inline edit (rename)', 'Partial'], [ATL, 'Inline edit', 'Partial'], [HIG, 'Text fields (rename)', 'Partial'], ['Frappe', 'Rename Document', 'Direct']],
      variantPages: [
        vp('Inline rename', 'Variant', 'Inline (default)', { variant: 'inline' }, 'The name is a button; activating it (or F2 on it) turns it into a field with the name selected; Enter saves, Escape puts it back.', 'Names shown where people work: a board’s title, a folder in a tree', 'Lists of many names at once: the dialog keeps the list still'),
        vp('Rename dialog', 'Variant', 'Dialog', { variant: 'dialog' }, 'A small dialog with the name selected and its rules under the field; Rename saves, Cancel puts it back.', 'Rename from an actions menu or a toolbar', 'Names already shown as editable text: rename them in place')
      ],
      examples: [
        ['Variant', [
          ['Inline (default)', function () { return box(400, h(Rename, null)); }, 'plx-rename-action--inline', 'variant=' + q('inline')],
          ['Dialog', function () { return box(400, h(Rename, { props: { variant: 'dialog' } })); }, 'plx-rename-action--dialog', 'variant=' + q('dialog')]], { prop: 'variant' }],
        ['From an actions menu: Rename… opens the dialog (open and onClose)', function () { return h(RenameFromMenu); }],
        ['Its rules: try an empty name, a slash, or Border 007.svg', function () { return box(400, h(Rename, { value: 'Letterhead.pdf', props: { variant: 'dialog', names: ['Border 007.svg', 'Cross 014.png'] } })); }]] },

    /* ── 10 Patterns › Selection and organization › Sortable list: SortableList ── */
    { id: 'sortable-list', lab: true, icon: 'list-bullets', sec: 'patterns', sub: 'Selection and organization', leaf: 'Sortable list', title: 'Sortable list',
      plenix: 'SortableList, useSortable', src: 'patterns/SortableList/SortableList.tsx', also: ['utils/dnd.ts'], css: ['patterns/SortableList/sortable-list.css', 'system/dnd.css'], level: 'Pattern', interaction: 'Drag and drop',
      aliases: ['Reorderable list', 'Rearrangeable list', 'Drag to reorder', 'Rank list', 'Kanban column'],
      text: 'A list people put in their own order. Each item drags by its handle, moves with the keyboard (Space to pick it up, the arrow keys, Space to drop) and has a way without dragging: its handle’s menu of moves, or move buttons. It is a column of rows or tiles in a grid; lists of one group take each other’s items (a board). The list never changes the order itself: onReorder hands the new order to the page.',
      use: ['Orders people set by hand and that are kept: steps, priorities, pinned views, the order of fields', 'The handle (default) when the item holds other controls; handles={false} for plain items',
        'moveButtons where moves are frequent and the list is short', 'A group of lists for a board (To do, Done) with one onMove'],
      avoid: ['Sorting by a value: a table column’s sort, or the Sort panel', 'Very long lists: a Move to action or a position field', 'Drag as the only way: the handle’s menu or the move buttons are always there'],
      related: ['columns-menu', 'drag-handle', 'dnd-engine', 'dashboard-grid'],
      statesFrom: ['drag-handle'],
      map: [[ATL, 'Pragmatic drag and drop (list)', 'Direct'], [SPE, 'ListView (drag and drop)', 'Partial'], [FLU, 'Reorderable list', 'Partial'], [MAT, 'Lists (drag to reorder)', 'Partial'], [HIG, 'Lists and tables (reorder)', 'Partial']],
      variantPages: [
        vp('Vertical sortable list', 'Layout', 'Vertical (default)', { variant: 'vertical' }, 'One row per item in a column; Arrow Up and Down move a picked-up item.', 'Steps, priorities, fields', 'Many small items that fit side by side: the grid'),
        vp('Sortable grid', 'Layout', 'Grid', { variant: 'grid' }, 'Tiles in rows that wrap; the arrow keys move a tile across and up and down a row.', 'Pinned views, cards, pictures', 'Rows with long text: the vertical list'),
        vp('Sortable list with handles', 'Moving', 'Handles (default)', { variant: 'handles' }, 'Each item drags by its handle; a click on the handle opens its menu of moves.', 'Items that hold their own controls or links', 'Plain items where the whole row can drag'),
        vp('Sortable list with move buttons', 'Moving', 'With move buttons', { variant: 'buttons' }, 'Move up and Move down at the end of each item, always visible.', 'Short lists people reorder often', 'Long lists: the buttons repeat on every row')
      ],
      examples: [
        ['Layout', [
          ['Vertical (default)', function () { return h(Sortable, null); }, 'plx-sortable-list--vertical', 'layout=' + q('vertical')],
          ['Grid', function () { return h(Sortable, { width: 600, items: VIEWS, label: 'Pinned views', props: { layout: 'grid', renderItem: withIcon } }); }, 'plx-sortable-list--grid', 'layout=' + q('grid')]], { prop: 'layout' }],
        ['Moving', [
          ['Handles (default)', function () { return h(Sortable, null); }, 'plx-sortable-list--handles', 'handles'],
          ['With move buttons', function () { return h(Sortable, { props: { moveButtons: true } }); }, 'plx-sortable-list--buttons', 'moveButtons']], { prop: 'moveButtons' }],
        ['The whole item drags (handles={false}; on touch after a long press)', function () { return h(Sortable, { props: { handles: false, moveButtons: true } }); }],
        ['Between lists: a group (Arrow Left / Right moves a picked-up item to the other list)', function () { return h(Board); }]] },

    /* ── 13 Interaction › Interaction foundations › Drag handle: DragHandle ── */
    { id: 'drag-handle', lab: true, icon: 'drag', sec: 'interaction', sub: 'Interaction foundations', leaf: 'Drag handle', title: 'Drag handle',
      plenix: 'DragHandle', src: 'components/DragHandle/DragHandle.tsx', level: 'Component', interaction: 'Drag and drop',
      aliases: ['Grip', 'Drag grip', 'Reorder handle', 'Grabber', 'Drag indicator'],
      text: 'The grip that moves an item: a small button with the drag icon (six dots). The drag-and-drop engine turns it into a drag for the pointer and a pick-up for the keyboard. Vertical (the dots stand) for rows that move up and down; horizontal (the dots lie) for columns and tabs that move sideways. A click without moving does what the handle’s other props say: as a Menu’s trigger, it opens the menu of moves.',
      use: ['Rows, cards and panels people reorder or move, when the item holds other controls', 'A name with a verb and the item ("Move Hero banner")', 'The menu of moves on it (Move up, Move down, Move to the start and end), so people can move the item without dragging'],
      avoid: ['A handle on items that cannot move', 'A handle smaller than the inline control size', 'The handle as the only way to move: give it a menu, or move buttons'],
      related: ['sortable-list', 'dnd-engine', 'dashboard-grid', 'accessible-drag-and-drop'],
      map: [[ATL, 'Drag handle (Pragmatic drag and drop)', 'Direct'], [SPE, 'Drag button (useDraggableItem)', 'Partial'], [FLU, 'Reorder handle', 'Partial'], [MAT, 'Drag handle', 'Partial']],
      variantPages: [
        vp('Vertical drag handle', 'Orientation', 'Vertical (default)', { variant: 'vertical' }, 'The dots stand: the item moves up and down.', 'Rows in a list, panels in a column', 'Items in a row: use the horizontal handle'),
        vp('Horizontal drag handle', 'Orientation', 'Horizontal', { variant: 'horizontal' }, 'The dots lie: the item moves sideways.', 'Columns, tabs, chips in a row', 'Rows in a column: use the vertical handle')
      ],
      examples: [
        ['Orientation', [
          ['Vertical (default)', function () { return h(P.DragHandle, { label: 'Move Hero banner' }); }, 'plx-drag-handle--vertical', 'orientation=' + q('vertical')],
          ['Horizontal', function () { return h(P.DragHandle, { label: 'Move column Status', orientation: 'horizontal' }); }, 'plx-drag-handle--horizontal', 'orientation=' + q('horizontal')]], { prop: 'orientation' }],
        ['At rest, horizontal and disabled', function () { return h(Handles); }],
        ['In a sortable list: press Space on a handle, move with the arrow keys, drop with Space', function () { return h(Sortable, { items: STEPS.slice(0, 3) }); }]] },

    /* ── 10 Patterns › Selection and organization › Drop target: DropZone (extended) ── */
    { id: 'drop-target', lab: true, icon: 'move', sec: 'patterns', sub: 'Selection and organization', leaf: 'Drop target', title: 'Drop target',
      plenix: 'DropZone (onDropItem, accepts, reject), useDropTarget', src: 'components/DropZone/DropZone.tsx', also: ['utils/dnd.ts'], level: 'Component', interaction: 'Drag and drop',
      variantClasses: [],
      aliases: ['Drop area', 'Drop zone', 'Droppable', 'Move target', 'Folder target'],
      text: 'A place that takes dragged items and shows whether it takes what is over it. The drop zone with onDropItem is a target for items dragged in the page (an asset dropped on a folder, a card on a column). It is highlighted while an item it takes is over it, and refuses while one it does not take is over it: the danger color, the not-allowed pointer and its own words (rejectContent). The keyboard reaches it too: a picked-up item moves from target to target with the arrow keys.',
      use: ['Folders, columns and collections that take moved items', 'accepts for the kinds it takes, with idle text that names them ("Drop images here")', 'rejectContent that says why it refuses ("Pictures takes images only")', 'A Move to menu on each item for the same move without dragging (useDraggable().targets())'],
      avoid: ['A target as the only way to move or add: a Move to action, or a Choose files button', 'Color as the only sign of refusal: the words and the pointer say it too', 'Many targets highlighted at once: only the one under the item shows its state'],
      related: ['drop-zone', 'drag-and-drop', 'dnd-engine'],
      states: [['Idle', 'The dashed region with its idle text', 'The default'], ['Over, taken', 'The highlight: the active fill and border', '.is-active'], ['Over, refused', 'The border in the danger color, the not-allowed pointer and rejectContent', '.is-reject']],
      map: [[SPE, 'DropZone', 'Direct'], [POL, 'Drop zone', 'Partial'], [ATL, 'Pragmatic drag and drop (drop target)', 'Direct'], [CAR, 'File uploader (drop container)', 'Partial']],
      variantPages: [
        vp('Data drop target', 'Variant', 'Data drop target', { variant: 'data' }, 'A drop zone that takes items dragged in the page (onDropItem), not only files.', 'Folders, columns and collections', 'File uploads: the drop zone as it is'),
        vp('Drop target that refuses', 'State', 'Accepts or rejects', { variant: 'data', state: 'reject' }, 'Highlighted while an item it takes is over it; the danger border, the not-allowed pointer and its words while one it does not take is.', 'Targets that take some kinds only', 'Targets that take everything: leave accepts out')
      ],
      examples: [
        ['Variant', [['Data drop target', function () { return h(Folders, { log: false }); }, null, 'onDropItem']]],
        ['State', [['Accepts or rejects', function () { return box(560, h('div', { className: 'ds-w10a-two' },
          h(P.DropZone, { active: true }, h(P.Icon, { name: 'folder', size: 'lg' }), h(P.Text, { variant: 'label' }, 'Pictures'), h(P.Text, { variant: 'secondary' }, 'Drop to move here')),
          h(P.DropZone, { reject: true, rejectContent: [h(P.Icon, { key: 'i', name: 'do-not-disturb', size: 'lg' }), h(P.Text, { key: 't', variant: 'label' }, 'Documents takes documents only')] }, 'Documents'))); }, null, 'accepts']]],
        ['Assets onto folders: drag by the handle, press Space on it, or use its Move to menu', function () { return h(Folders); }]] },

    /* ── 10 Patterns › Selection and organization › Resize: Resizable ── */
    { id: 'resizable', lab: true, icon: 'expand', sec: 'patterns', sub: 'Selection and organization', leaf: 'Resize', title: 'Resize',
      plenix: 'Resizable, PanelSplitter', src: 'components/Resizable/Resizable.tsx', level: 'Component', interaction: 'Drag and drop',
      aliases: ['Resizable', 'Resize handle', 'Splitter', 'Window splitter', 'Resizable box'],
      text: 'An area people make wider or taller by dragging its edge. Resizable is a box with a resize edge on its end, its bottom or both (dragged, or moved with the keyboard; no size menu, owner 2026-10-16); PanelSplitter is the same edge on the panes of the shell (the navigation, a secondary pane, the inspector). Every size is on the 4px grid: a drag moves one grid line at a time and stays on one when let go, the arrow keys step through the size tokens, and steps narrows the settled sizes to a few.',
      use: ['A preview, an editor or a picture people size to their work', 'Limits that keep the content usable (minWidth, maxWidth, minHeight, maxHeight)', 'steps for a few named sizes (small, medium, large)', 'The panes of a page: their own resizable prop (PanelSplitter)'],
      avoid: ['Table columns: the DataGrid sizes its own', 'Free pixel sizes: every size is a size token', 'A resize edge without its keyboard way'],
      related: ['inspector-region', 'secondary-pane', 'side-navigation'],
      map: [[ATL, 'Page layout (resizable panels)', 'Partial'], [FLU, 'Splitter', 'Partial'], [SPE, 'Split view', 'Partial'], [MAT, 'Pane expansion drag handle', 'Partial'], [HIG, 'Split views', 'Partial']],
      variantPages: [
        vp('Resize horizontally', 'Axis', 'Horizontal (default)', { variant: 'horizontal' }, 'The end edge changes the width.', 'Previews and side areas', 'Text areas: they grow taller'),
        vp('Resize vertically', 'Axis', 'Vertical', { variant: 'vertical' }, 'The bottom edge changes the height.', 'Notes, logs and editors', 'Areas whose width matters'),
        vp('Resize in both directions', 'Axis', 'Both', { variant: 'both' }, 'Both edges, and a corner the pointer drags in both directions.', 'Pictures and canvases', 'Areas held by a layout on one side'),
        vp('Resize to size steps', 'Behavior', 'Snapped to size steps', { variant: 'steps' }, 'Only the sizes in steps (each a size token): a drag snaps to the nearest, the arrow keys step through them.', 'A few named sizes', 'Areas people size freely: every size token')
      ],
      examples: [
        ['Axis', [
          ['Horizontal (default)', function () { return h(Sized, { label: 'Preview', axis: 'horizontal', width: 320, hint: 'Drag the end edge, or focus it and use the arrow keys' }); }, 'plx-resizable--horizontal', 'axis=' + q('horizontal')],
          ['Vertical', function () { return box(400, h(Sized, { label: 'Notes', axis: 'vertical', height: 120, hint: 'Drag the bottom edge' })); }, 'plx-resizable--vertical', 'axis=' + q('vertical')],
          ['Both', function () { return h(Sized, { label: 'Picture', axis: 'both', width: 280, height: 160, hint: 'Drag the corner, or either edge' }); }, 'plx-resizable--both', 'axis=' + q('both')]], { prop: 'axis' }],
        ['Behavior', [['Snapped to size steps', function () { return h(Sized, { label: 'Panel', axis: 'horizontal', width: 320, hint: 'Small, medium or large: 240, 320 or 400px', props: { steps: [240, 320, 400] } }); }, 'plx-resizable--steps', 'steps={[240, 320, 400]}']]],
        ['Variant', [
          ['Divider: the edge is the whole gap to the next panel, two thin lines, a light fill and a three-line grip (SplitView)', function () { return h(Divider); }, 'plx-resizable--divider', 'variant=' + q('divider'), { full: true }],
          ['Fill: the content is a column its children fill', function () { return h(Sized, { label: 'Panel', axis: 'horizontal', width: 320, hint: 'Its child takes the whole height', props: { fill: true } }); }, 'plx-resizable--fill', 'fill']]]] },

    /* ── 10 Patterns › Selection and organization › Drag and drop: the engine's data-item drag ── */
    { id: 'drag-and-drop', icon: 'move', sec: 'patterns', sub: 'Selection and organization', leaf: 'Drag and drop', title: 'Drag and drop',
      plenix: 'useDraggable, useDropTarget, DropZone, DragHandle', src: 'utils/dnd.ts', css: DND_CSS, level: 'Pattern', interaction: 'Drag and drop',
      aliases: ['DnD', 'Drag to move', 'Move by dragging', 'Drop to upload'],
      text: 'Moving something by dragging it to a new place: an item onto a target (an asset onto a folder, a card onto a column), an item within or between lists (Sortable list), files from the computer onto a drop zone, or an element on a canvas (Reposition). Dragging is always a shortcut: the same move is a menu item (Move to), a button or a key, and every pick-up, move and drop is announced.',
      use: ['Moving, reordering and filing as an accelerator beside a visible Move to action', 'useDraggable on the item and DropZone (onDropItem, accepts) on each target', 'Words on each target that say what it takes', 'Undo after a drop that changes where something lives'],
      avoid: ['Drag as the only way to complete a task (WCAG 2.5.7)', 'Moves that are hard to undo: an explicit action that confirms', 'Drop targets that only change color'],
      related: ['dnd-engine', 'drop-target', 'sortable-list', 'reposition', 'accessible-drag-and-drop'],
      states: DND_STATES,
      map: [[ATL, 'Pragmatic drag and drop', 'Direct'], [SPE, 'Drag and drop (React Aria)', 'Direct'], [POL, 'Drop zone', 'Partial'], [CAR, 'File uploader', 'Partial'], [HIG, 'Drag and drop', 'Direct']],
      examples: [
        ['An item onto targets: drag by the handle; or Space on the handle, the arrow keys to choose a folder, Space to drop; or Move to in its menu', function () { return h(Folders); }],
        ['Within and between lists (Sortable list)', function () { return h(Board); }]] },

    /* ── 10 Patterns › Selection and organization › Reposition: a free move ── */
    { id: 'reposition', icon: 'expand', sec: 'patterns', sub: 'Selection and organization', leaf: 'Reposition', title: 'Reposition',
      plenix: 'useReposition', src: 'utils/dnd.ts', css: DND_CSS, level: 'Pattern', interaction: 'Drag and drop',
      aliases: ['Free move', 'Move on a canvas', 'Drag to position', 'Nudge'],
      text: 'Moving an element to any place on a board or a canvas (a note, a layer, a widget). Drag it with the pointer, or focus it, pick it up with Space, move it with the arrow keys (8px, Shift 32px) and drop it with Space; Escape puts it back. It stays inside its frame and on the 4px grid; the place is a transform set through the Web Animations API, never a style attribute.',
      use: ['Boards, canvases and layouts where the place itself carries meaning', 'A Move menu (left, right, up, down) beside the element: the way without dragging (moveBy)', 'bounds: the frame it stays in'],
      avoid: ['Lists and grids whose order is what matters: Sortable list', 'Positions the system decides: explain them instead', 'Free pixel positions: the move snaps to the grid'],
      related: ['dnd-engine', 'drag-and-drop', 'dashboard-grid'],
      states: [['Rest', 'In its place; focusable, with the instructions as its description', 'The default'], ['Dragging', 'Raised, a little transparent, following the pointer', 'data-plx-dnd-state="dragging"'], ['Picked up', 'Raised; the arrow keys move it, Space drops it', 'data-plx-dnd-state="picked"']],
      map: [[ATL, 'Pragmatic drag and drop (free movement)', 'Partial'], [SPE, 'Drag and drop (move)', 'Partial'], [FLU, 'Drag and drop', 'Partial'], [HIG, 'Drag and drop', 'Partial']],
      examples: [['Two notes on a board: drag them, or focus one, press Space, move with the arrow keys (Shift for farther) and press Space; or use its Move menu', function () { return h(NoteBoard); }]] },

    /* ── 13 Interaction › Accessibility › Accessible drag and drop ── */
    { id: 'accessible-drag-and-drop', icon: 'settings-permissions', sec: 'interaction', sub: 'Accessibility', leaf: 'Accessible drag and drop', title: 'Accessible drag and drop',
      plenix: 'useSortable, useDraggable, useReposition, DND_STRINGS', src: 'utils/dnd.ts', css: DND_CSS, level: 'Foundation', interaction: 'Utility',
      aliases: ['Keyboard drag and drop', 'Dragging movements', 'WCAG 2.5.7', 'Move without dragging'],
      text: 'Every drag in Plenix works by keyboard (WCAG 2.2, 2.1.1) and without dragging (2.5.7 Dragging movements). The handle is a button: Space or Enter picks the item up, the arrow keys move it, Space or Enter drops it and Escape puts it back. A menu of moves or move buttons give the same moves to a single pointer. The live region announces every pick-up, move, drop and cancel, with the item’s name and its new position.',
      use: ['The engine’s hooks for every drag: the keyboard, the announcements and the instructions come with them', 'A menu of moves on the handle, or move buttons, for one-pointer users', 'The item’s own name in every announcement ("Hero banner, position 2 of 5")', 'Focus kept on the moved item’s handle'],
      avoid: ['A drag that lacks a keyboard way or a single-pointer way', 'Targets told apart by color only', 'Announcing pixel positions where a place or a position is meaningful'],
      related: ['dnd-engine', 'live-regions', 'drag-handle', 'sortable-list'],
      map: [[SPE, 'Drag and drop (React Aria: keyboard and screen reader)', 'Direct'], [ATL, 'Pragmatic drag and drop accessibility', 'Direct'], [FLU, 'Drag and drop accessibility', 'Partial']],
      examples: [
        ['The keys of every drag', function () { return KEYS([['Space, Enter', 'Pick up the item on its handle; again to drop it where it is'], ['Arrow Up, Arrow Down', 'Move it one place in a list (a row in a grid)'], ['Arrow Left, Arrow Right', 'Move it one place in a row or a grid; to the neighboring list of a group; to the next target'],
          ['Home, End', 'Move it to the start or the end of its list'], ['Shift + arrow', 'A free move: a large step'], ['Escape', 'Put it back where it was picked up'], ['Tab', 'Drop it where it is and move on']]); }],
        ['Try it: Space on a handle, the arrow keys, Space; a screen reader hears every step', function () { return h(Sortable, { items: STEPS.slice(0, 4) }); }],
        ['The words it says (DND_STRINGS)', function () { return KEYS([['pickedUp', P.DND_STRINGS.pickedUp], ['moved', P.DND_STRINGS.moved], ['dropped', P.DND_STRINGS.dropped], ['canceled', P.DND_STRINGS.canceled], ['over', P.DND_STRINGS.over], ['overReject', P.DND_STRINGS.overReject]]); }]] },

    /* ── 13 Interaction › Behavioral utilities › Drag-and-drop engine: utils/dnd.ts ── */
    { id: 'dnd-engine', icon: 'code-blocks', sec: 'interaction', sub: 'Behavioral utilities', leaf: 'Drag-and-drop engine', title: 'Drag-and-drop engine',
      plenix: 'useSortable, useDraggable, useDropTarget, useReposition, useDndSession, moveItem, transferItem, setDragOffset, clearDragOffset, mergeDndProps, DND_STRINGS', src: 'utils/dnd.ts', css: DND_CSS, level: 'Foundation', interaction: 'Utility',
      aliases: ['dnd', 'Drag and drop library', 'Sortable', 'Draggable', 'Droppable'],
      text: 'The Platform’s one drag-and-drop engine (utils/dnd.ts). It gives pointer, pen and touch dragging past the gesture slop (a long press on touch for items without a handle), a keyboard equivalent for every drag, announcements through the live region, auto-scroll near the edges of the scrolling region, and drop targets with a visible state. Four hooks share one session: useSortable (lists, and moves between the lists of a group), useDraggable and useDropTarget (an item onto targets, including the browser’s own file drags), and useReposition (a free move). system/dnd.css draws the states from the attributes the hooks set.',
      use: ['The engine for every drag in the Platform and the applications: a page never writes drag code of its own', 'The hooks’ handleProps on a DragHandle (mergeDndProps when the handle is a Menu’s trigger)', 'onReorder and onMove keep the order in the page’s state', 'The tokens: --plx-sys-dnd-autoscroll-edge and -speed, the keyboard steps, the drag treatment'],
      avoid: ['The HTML draggable attribute for moves inside the page: it has no keyboard and no touch', 'A style attribute for a dragged item’s position', 'A second drag library'],
      related: ['drag-and-drop', 'accessible-drag-and-drop', 'live-regions', 'gesture-interaction', 'sortable-list'],
      map: [[ATL, 'Pragmatic drag and drop', 'Direct'], [SPE, 'React Aria drag and drop (useDrag, useDrop, useDraggableCollection)', 'Direct'], [FLU, 'Drag and drop', 'Partial']],
      examples: [
        ['The engine’s exports', function () { return API([['useSortable(options)', 'A list people reorder: listProps, itemProps(i), handleProps(i), moveTo(i, to), canMove(i, step); a group moves items between lists (onMove)'],
          ['useDraggable(options)', 'An item dropped on targets: props, handleProps, targets() for a Move to menu'], ['useDropTarget(options)', 'A place that takes items (accepts, onDrop) and the browser’s own drags (native): state null, ready, over or reject'],
          ['useReposition(options)', 'A free move inside bounds, on the grid: props, position, moveBy(dx, dy)'], ['useDndSession()', 'The drag under way (or null), for a component that draws its own states'],
          ['moveItem, transferItem', 'The new list after a move within a list, or the two lists after a move between them'], ['setDragOffset, clearDragOffset', 'Move an element by a transform through the Web Animations API, snapped to the grid; settle back'],
          ['mergeDndProps(a, b)', 'One element’s props from the engine’s and a component’s: the engine’s handler runs first'], ['DND_STRINGS', 'The words it announces, for other languages']]); }],
        ['Sortable: a list, a grid and a board', function () { return h(P.Stack, { gap: 'lg' }, h(Sortable, { items: STEPS.slice(0, 3) }), h(Board)); }],
        ['Draggable and drop targets', function () { return h(Folders); }],
        ['Reposition', function () { return h(NoteBoard); }]] }
  ];
});
