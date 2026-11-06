/* Plenix design system · library part w10B (wave 10, lane B): the patterns DeleteFlow (Delete flow, and Delete in Common
   actions), DuplicateAction (Duplicate, in Common actions and in Creation and editing), Publish (Publish, Unpublish),
   ReviewFlow with WorkflowStatus and ReviewQueue (Review flow, Approve, Reject, Data review workflow, Human review) and
   AssignControl (Assign, Delegate). Statuses are Badges of their meaning with an icon; every color is an existing role. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, box = H.box, use = H.use, noop = H.noop, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };

  /* ── shared demo data ── */
  var CATS = [{ id: 'c1', label: 'Easter' }, { id: 'c2', label: 'Advent' }, { id: 'c3', label: 'Weddings' }, { id: 'c4', label: 'Funerals' },
    { id: 'c5', label: 'Choir' }, { id: 'c6', label: 'Youth group' }, { id: 'c7', label: 'Open day' }];
  var PEOPLE = [
    { value: 'mc', label: 'Maya Chen', description: 'Designer · Brand team', presence: 'online' },
    { value: 'ak', label: 'Alex Kim', description: 'Editor · Web team', presence: 'away' },
    { value: 'rm', label: 'Jordan Avery', description: 'Parish office' },
    { value: 'pn', label: 'Priya Nair', description: 'Archive', presence: 'busy' },
    { value: 'jw', label: 'Jonas Weber', description: 'Print vendor' }
  ];
  var REVIEWERS = [{ id: 'mc', name: 'Maya Chen', decision: 'approved' }, { id: 'ak', name: 'Alex Kim' }];
  var HISTORY = [{ id: 'h1', name: 'Maya Chen', decision: 'approved', comment: 'Colors match the style guide.', time: '10:24 AM', dateTime: '2026-10-15T10:24' },
    { id: 'h2', name: 'Priya Nair', decision: 'changes-requested', comment: 'Add the bleed for print.', time: 'Oct 13', dateTime: '2026-10-13T16:02' }];
  var QUEUE = [
    { id: 1, name: 'Easter banner, north aisle', type: 'Image', submittedBy: 'Maya Chen', submitted: '2026-10-14', status: 'in-review' },
    { id: 2, name: 'Advent wreath poster', type: 'Document', submittedBy: 'Alex Kim', submitted: '2026-10-13', status: 'in-review' },
    { id: 3, name: 'Choir rehearsal video', type: 'Video', submittedBy: 'Priya Nair', submitted: '2026-10-12', status: 'changes-requested' },
    { id: 4, name: 'Archive register, 1919', type: 'Document', submittedBy: 'Jonas Weber', submitted: '2026-10-10', status: 'in-review' },
    { id: 5, name: 'Garden open day flyer', type: 'Image', submittedBy: 'Jordan Avery', submitted: '2026-10-09', status: 'in-review' }
  ];
  var GENERATED = [
    { id: 1, name: 'Alt text: Easter banner', type: 'Alt text', submittedBy: 'Assistant', submitted: '2026-10-15', status: 'in-review' },
    { id: 2, name: 'Tags: Advent wreath poster', type: 'Tags', submittedBy: 'Assistant', submitted: '2026-10-15', status: 'in-review' },
    { id: 3, name: 'Summary: vestry minutes', type: 'Summary', submittedBy: 'Assistant', submitted: '2026-10-14', status: 'in-review' }
  ];

  /* ── 10 Patterns › Creation and editing › Delete flow: DeleteFlow ── */
  // a list of categories with the flow's trigger; deleted ones go away, Undo brings them back, Reset starts again
  var DelDemo = function (props) {
    var s = use(CATS.slice(0, props.n || 3));
    var list = s[0];
    var take = function (gone) { var ids = gone.map(function (x) { return x.id; }); s[1](function (l) { return l.filter(function (x) { return ids.indexOf(x.id) < 0; }); }); };
    var give = function (back) { s[1](function (l) { return CATS.filter(function (c) { return l.some(function (x) { return x.id === c.id; }) || back.some(function (x) { return x.id === c.id; }); }); }); };
    var targets = props.one ? list.slice(0, 1) : list;
    return box(560, h(P.Stack, { gap: 'sm' },
      list.length ? h(P.List, { items: list.map(function (x) { return { icon: 'tags', children: x.label }; }) }) : h(P.Text, { variant: 'secondary', as: 'p' }, 'No categories.'),
      h('div', { className: 'ds-demo-row' },
        list.length ? h(P.DeleteFlow, Object.assign({ items: targets, noun: 'category', plural: 'categories', onDelete: take, onRestore: give,
          trigger: h(P.Button, { variant: 'danger-secondary', icon: 'trash' }, targets.length === 1 ? 'Delete ' + targets[0].label : 'Delete ' + targets.length + ' categories') }, props.f)) : null,
        h(P.Button, { variant: 'ghost', onClick: function () { s[1](CATS.slice(0, props.n || 3)); } }, 'Reset'))));
  };
  var deleteFlow = { id: 'delete-flow', lab: true, icon: 'trash', sec: 'patterns', sub: 'Creation and editing', leaf: 'Delete flow', title: 'Delete flow',
    plenix: 'DeleteFlow', src: 'patterns/DeleteFlow/DeleteFlow.tsx', level: 'Pattern', interaction: 'Action', statesFrom: ['button', 'confirmation-dialog'],
    aliases: ['Delete confirmation', 'Destructive flow', 'Remove flow', 'Soft delete', 'Trash'],
    text: 'Deleting in one of four forms, chosen by what can come back. Confirm asks first, with the count in the question (“Delete 2 categories?”), lists what goes and says it cannot be undone; focus starts on Cancel and Delete is the danger button. Type to confirm asks for the item’s name before a delete with a wide reach. Undo deletes at once and offers Undo in the toast; the delete is final when the toast leaves. Move to trash moves the items at once, with Undo in the toast.',
    use: ['Confirm for what cannot come back: a category, a member, a published page', 'Type to confirm for a project, a library or an account: deletes that take much with them', 'Undo or Move to trash whenever the items can come back: one press, no question', 'The count and the names in the question; the consequence in one sentence'],
    avoid: ['A question before every small, reversible delete: offer Undo', 'Delete for taking an item out of a list or a collection: that is Remove, not destructive', '“Are you sure?” or “these items”: name the action and the count', 'Disabling Delete until the name is typed: it is checked when Delete is pressed'],
    related: ['delete-action', 'confirmation-dialog', 'undo-pattern', 'popconfirm'],
    map: [[CAR, 'Danger modal', 'Partial'], [ATL, 'Modal dialog (danger)', 'Partial'], [POL, 'Modal (destructive)', 'Partial'], [SPE, 'Alert dialog (destructive)', 'Partial'], [MAT, 'Dialogs; snackbar with undo', 'Partial'], ['Django', 'Admin delete confirmation page', 'Direct'], ['Frappe', 'frappe.confirm', 'Direct']],
    variantPages: [
      vp('Delete with confirmation', 'Form', 'Confirm (default)', { variant: 'confirm' }, 'An alert dialog in the destructive look: the question with the count, the names, the consequence and “This cannot be undone.”; Cancel takes focus.', 'Deletes that cannot come back', 'Items that go to a trash: use Move to trash'),
      vp('Type-to-confirm delete', 'Form', 'Type to confirm', { variant: 'type' }, 'The confirmation with a field that asks for the item’s name, shown in the data font; a mismatch is said under the field when Delete is pressed.', 'A project, a library or an account: a delete with a wide reach', 'Everyday deletes: one more step for no reason'),
      vp('Delete with undo', 'Form', 'Undo', { variant: 'undo' }, 'No question: the items go at once and the toast offers Undo while it shows; onCommit makes the delete final when it leaves.', 'Single items people delete often: notes, comments, tags', 'Deletes that others feel at once: confirm instead'),
      vp('Move to trash', 'Form', 'Move to trash', { variant: 'trash' }, 'No question: the items move to the trash, and the toast says so with Undo and how long the trash keeps them.', 'Files and assets with a trash to restore from', 'A trash nobody can open: say where it is')
    ],
    examples: [
      ['Form', [['Confirm (default)', function () { return h(DelDemo, { f: { consequence: 'Their assets stay, without these categories.' } }); }, null, 'variant=' + q('confirm')],
        ['Type to confirm', function () { return h(DelDemo, { one: true, f: { variant: 'type', noun: 'category', consequence: 'Its 214 assets lose this category.' } }); }, 'plx-delete-flow--type', 'variant=' + q('type')],
        ['Undo', function () { return h(DelDemo, { one: true, f: { variant: 'undo', onCommit: noop } }); }, null, 'variant=' + q('undo')],
        ['Move to trash', function () { return h(DelDemo, { f: { variant: 'trash', retention: 30 } }); }, null, 'variant=' + q('trash')]], { prop: 'variant' }],
      ['Items', [['One item', function () { return h(DelDemo, { one: true, f: {} }); }, null, 'items={[item]}'],
        ['Several items, five named', function () { return h(DelDemo, { n: 7, f: { consequence: 'Their assets stay, without these categories.' } }); }, null, 'items={[…7]}']]]
    ] };

  /* ── 04 Actions › Common actions › Delete: the action (DeleteFlow) ── */
  var BulkDelete = function () {
    var rows = use(CATS.slice(0, 5)), sel = use([]), ask = use(false);
    var chosen = rows[0].filter(function (x) { return sel[0].indexOf(x.id) >= 0; });
    return box(720, h(P.Stack, { gap: 'sm' },
      h(P.CommandBar, { label: 'Categories', count: rows[0].length + ' categories', actions: [{ id: 'new', label: 'New category', icon: 'plus', onSelect: noop }],
        selection: { count: sel[0].length, noun: 'category', plural: 'categories', onClear: function () { sel[1]([]); },
          actions: [{ id: 'rename', label: 'Rename', icon: 'rename', single: true, onSelect: noop }, { id: 'delete', label: 'Delete', icon: 'trash', danger: true, onSelect: function () { ask[1](true); } }] } }),
      h(P.DataGrid, { label: 'Categories', data: rows[0], index: 'id', selectable: true, selected: sel[0], onSelectionChange: sel[1], columns: [{ title: 'Name', field: 'label', kind: 'name' }] }),
      h(P.DeleteFlow, { items: chosen, noun: 'category', plural: 'categories', consequence: 'Their assets stay, without these categories.', open: ask[0], onClose: function () { ask[1](false); },
        onDelete: function (gone) { var ids = gone.map(function (x) { return x.id; }); rows[1](rows[0].filter(function (x) { return ids.indexOf(x.id) < 0; })); sel[1]([]); } })));
  };
  var deleteAction = { id: 'delete-action', icon: 'trash', sec: 'actions', sub: 'Common actions', leaf: 'Delete', title: 'Delete',
    plenix: 'DeleteFlow (the action), CommandBar selection', src: 'patterns/DeleteFlow/DeleteFlow.tsx', level: 'Pattern', interaction: 'Action', statesFrom: ['button'],
    variantClasses: [], docsFrom: 'delete-flow', aliases: ['Remove', 'Trash', 'Destroy'],
    text: 'The Delete command itself: a danger button, a destructive menu item, or the last command of a selection in the command bar. It starts the delete flow: a confirmation with the count for what cannot come back, Undo in a toast for what can.',
    use: ['Delete last, after a divider, in the danger color: in menus, toolbars and the command bar’s selection', 'The same verb on the trigger and on the confirming button', 'The count when several are selected: “Delete 2 categories?”'],
    avoid: ['The danger style for reversible removals such as Remove from collection', 'A question for small reversible deletes: offer Undo', 'Delete as the only way to clear a field or a filter'],
    related: ['delete-flow', 'command-bar', 'confirmation-dialog'],
    map: [[CAR, 'Danger button', 'Partial'], [ATL, 'Button (danger)', 'Partial'], [POL, 'Button (critical)', 'Partial'], [SPE, 'Alert dialog (destructive)', 'Partial']],
    examples: [['A selection’s Delete: the command bar swaps, the question names the count', function () { return h(BulkDelete); }],
      ['One item’s Delete', function () { return h(DelDemo, { one: true, f: {} }); }]] };

  /* ── 04 Actions › Common actions › Duplicate: DuplicateAction ── */
  var DupDemo = function (props) {
    var s = use(['Easter banner']);
    var names = s[0];
    var add = function (n) { s[1](function (l) { return l.concat(n); }); };
    var drop = function (n) { s[1](function (l) { return l.filter(function (x) { return x !== n; }); }); };
    return box(560, h(P.Stack, { gap: 'sm' },
      h(P.List, { items: names.map(function (x) { return { icon: 'ed-image', children: x }; }) }),
      h('div', { className: 'ds-demo-row' }, h(P.DuplicateAction, Object.assign({ name: 'Easter banner', noun: 'asset', taken: names, onDuplicate: add, onUndo: drop }, props.d)),
        h(P.Button, { variant: 'ghost', onClick: function () { s[1](['Easter banner']); } }, 'Reset'))));
  };
  var OPTIONS = [{ id: 'tags', label: 'Tags', defaultChecked: true }, { id: 'comments', label: 'Comments' }, { id: 'sharing', label: 'Sharing and members' }];
  var duplicateAction = { id: 'duplicate-action', lab: true, icon: 'ed-copy', sec: 'actions', sub: 'Common actions', leaf: 'Duplicate', title: 'Duplicate',
    plenix: 'DuplicateAction, copyName', src: 'patterns/DuplicateAction/DuplicateAction.jsx', level: 'Pattern', interaction: 'Action', statesFrom: ['button'],
    aliases: ['Copy item', 'Make a copy', 'Clone'],
    text: 'Copies one item and puts the copy next to the original. Copy of the name duplicates at once: the copy is “Copy of Easter banner”, then “Copy of Easter banner (2)”, and a toast gives its name with Undo. Then rename asks first: a small dialog with the copy’s name selected, a line saying what is copied, and checkboxes for what else comes along.',
    use: ['Items people make in similar forms: boards, templates, rules, assets', 'Copy of the name for a quick copy people rename later', 'Then rename when the copy needs its own name now, or a choice of what to copy', 'Comments, members and sharing left out unless people choose them'],
    avoid: ['Copying to the clipboard: that is Copy', 'A copy that should go elsewhere or under a new name for good: that is Save as', 'Duplicating in bulk without saying how many were made'],
    related: ['duplicate-pattern', 'prompt-dialog', 'toast'],
    map: [[MAT, 'Menus (Duplicate item)', 'Partial'], [ATL, 'Dropdown menu (Duplicate)', 'Partial']],
    variantPages: [
      vp('Duplicate with a copy name', 'Form', 'Copy of the name (default)', { variant: 'copy' }, 'One press: the copy is named “Copy of …” (numbered when taken), placed next to the original, and the toast says its name with Undo.', 'Quick copies people rename later', 'A copy that needs its own name now: use Then rename'),
      vp('Duplicate then rename', 'Form', 'Then rename', { variant: 'rename' }, 'A small dialog: the name field holds the copy’s name, selected; a muted line says what it copies; Duplicate checks the name.', 'Copies that need a name of their own', 'Every copy: it adds a step'),
      vp('Duplicate with what to copy', 'Form', 'With what to copy', { content: 'options' }, 'The rename dialog with checkboxes under the source line: tags, comments, members; only what people check comes along.', 'Items with history or people attached', 'Choices nobody needs: keep the dialog short')
    ],
    examples: [
      ['Form', [['Copy of the name (default)', function () { return h(DupDemo, {}); }, null, 'variant=' + q('copy')],
        ['Then rename', function () { return h(DupDemo, { d: { variant: 'rename', source: 'PNG · 2.4 MB' } }); }, null, 'variant=' + q('rename')],
        ['With what to copy', function () { return h(DupDemo, { d: { variant: 'rename', source: 'PNG · 2.4 MB', options: OPTIONS } }); }, 'plx-duplicate-action--options', 'options']], { prop: 'variant' }],
      ['As a menu item', function () {
        var o = use(false), s = use(['Advent board']);
        return box(560, h(P.Stack, { gap: 'sm' }, h(P.List, { items: s[0].map(function (x) { return { icon: 'cards-small', children: x }; }) }),
          h('div', { className: 'ds-demo-row' }, h(P.Menu, { label: 'Board', trigger: h(P.Button, { caret: true }, 'Board') }, h(P.MenuItem, { icon: 'rename', onSelect: noop }, 'Rename'),
            h(P.MenuItem, { icon: 'ed-copy', onSelect: function () { o[1](true); } }, 'Duplicate'), h(P.MenuDivider), h(P.MenuItem, { icon: 'trash', danger: true, onSelect: noop }, 'Delete')),
          h(P.DuplicateAction, { variant: 'rename', name: 'Advent board', noun: 'board', taken: s[0], open: o[0], onClose: function () { o[1](false); }, trigger: false,
            onDuplicate: function (n) { s[1](s[0].concat(n)); }, options: OPTIONS.slice(1) }))));
      }]
    ] };
  var duplicatePattern = { id: 'duplicate-pattern', icon: 'ed-copy', sec: 'patterns', sub: 'Creation and editing', leaf: 'Duplicate', title: 'Duplicate (pattern)',
    plenix: 'DuplicateAction, copyName', src: 'patterns/DuplicateAction/DuplicateAction.jsx', level: 'Pattern', interaction: 'Action', statesFrom: ['duplicate-action'],
    variantClasses: [], docsFrom: 'duplicate-action', aliases: ['Copy flow', 'Clone flow'],
    text: 'The duplicate workflow is the Duplicate action: a copy named “Copy of …” next to the original, with Undo in the toast, or a rename dialog first. Its page is in Actions › Common actions › Duplicate.',
    use: ['Starting a new item from an existing one, in the item’s menu or as a bulk action', 'Saying in the toast what the copy is called'],
    avoid: ['A new name in another place for good: use Save as', 'Copying private fields without saying so'],
    related: ['duplicate-action', 'prompt-dialog'],
    examples: [['Copy of the name, with Undo', function () { return h(DupDemo, {}); }]] };

  /* ── 10 Patterns › Review and approval › Publish: Publish ── */
  var PubDemo = function (props) {
    var s = use(props.start || 'draft'), at = use(props.at || null), when = use(props.when || '2026-10-15T10:24');
    return box(props.width || 560, h(P.Publish, Object.assign({ name: 'Easter banner', audience: 'everyone in the library', status: s[0], scheduledFor: at[0], publishedAt: when[0], by: 'Maya Chen',
      onPublish: function () { s[1]('published'); when[1](new Date().toISOString().slice(0, 16)); }, onSchedule: function (v) { at[1](v); s[1]('scheduled'); },
      onCancelSchedule: function () { s[1]('draft'); }, onUnpublish: function () { s[1]('draft'); } }, props.p)));
  };
  var publish = { id: 'publish', lab: true, icon: 'visibility', sec: 'patterns', sub: 'Review and approval', leaf: 'Publish', title: 'Publish',
    plenix: 'Publish, WorkflowStatus', src: 'patterns/Publish/Publish.jsx', level: 'Pattern', interaction: 'Action', statesFrom: ['button', 'confirmation-dialog'],
    aliases: ['Go live', 'Release', 'Schedule publishing', 'Make visible'],
    text: 'An item’s publishing state and the actions that change it, in one row: the status badge with its icon (Draft, Scheduled, Published), a line saying when and by whom with the time in the data font, then the actions for that state. Publish asks first and says who will see it; Schedule asks for a date and time; a scheduled item offers Cancel schedule and Publish now; a published item offers Unpublish.',
    use: ['Content and assets that others see: pages, assets in a shared library, announcements', 'Schedule when the release time matters', 'The audience in the question: “It becomes visible to everyone in the library.”', 'Status only for people who cannot publish'],
    avoid: ['Publishing on save: publishing is its own action', 'Publish for a private save: that is Save', 'Approval itself: an item waiting for sign-off is in a review flow'],
    related: ['unpublish', 'review-flow', 'confirmation-dialog', 'date-picker'],
    map: [[POL, 'Publishing (visibility card)', 'Partial'], [ATL, 'Lozenge with publish button', 'Partial'], [CAR, 'Tag status with a primary action', 'Partial'], ['Frappe', 'Web Page and Website Item (published)', 'Partial']],
    variantPages: [
      vp('Publish now', 'State', 'Publish now (default)', { variant: 'draft' }, 'A draft: the neutral Draft badge with its pencil, “Not published”, then Schedule and Publish; Publish asks first, naming the audience.', 'Items ready to go live now', 'Items that still need sign-off'),
      vp('Scheduled publishing', 'State', 'Schedule', { variant: 'scheduled' }, 'The Scheduled badge with its clock and the time in the data font, then Cancel schedule and Publish now; Schedule asks for a date and time in the future.', 'Releases tied to a date: services, campaigns, notices', 'Times people cannot see in their own time zone'),
      vp('Unpublish', 'State', 'Unpublish', { variant: 'published' }, 'The Published badge, when and by whom, and Unpublish, which asks first and says who loses access; its toast offers Undo.', 'Content that is wrong or out of date', 'Removing it for good: that is Delete'),
      vp('Publishing status', 'State', 'Status only', { variant: 'status' }, 'The badge and the line, with no actions.', 'People who can see but not publish; lists and headers', 'Pages where people expect to change it')
    ],
    examples: [
      ['State', [['Publish now (default)', function () { return h(PubDemo, {}); }, null, 'status=' + q('draft')],
        ['Schedule', function () { return h(PubDemo, { start: 'scheduled', at: '2026-10-20T09:00' }); }, null, 'status=' + q('scheduled')],
        ['Unpublish', function () { return h(PubDemo, { start: 'published' }); }, null, 'status=' + q('published')],
        ['Status only', function () { return h(PubDemo, { start: 'published', p: { readOnly: true } }); }, 'plx-publish--read-only', 'readOnly']], { prop: 'status' }],
      ['Narrow: the actions wrap under the status', function () { return h(PubDemo, { width: 320, start: 'scheduled', at: '2026-10-20T09:00' }); }]
    ] };
  var unpublish = { id: 'unpublish', icon: 'visibility-off', sec: 'patterns', sub: 'Review and approval', leaf: 'Unpublish', title: 'Unpublish',
    plenix: 'Publish (status="published", onUnpublish)', src: 'patterns/Publish/Publish.jsx', level: 'Pattern', interaction: 'Action', statesFrom: ['button'],
    variantClasses: [], docsFrom: 'publish', aliases: ['Take down', 'Hide', 'Withdraw'],
    purpose: 'Takes a published item back out of view, after saying who will lose access, without deleting it.',
    anatomy: ['Status — the Published badge with its eye icon (required)', 'Unpublish — the button offered while the item is published (required)', 'Question — a confirmation dialog: “Unpublish {name}?”, saying who it is hidden from (required)', 'Toast — “{name} unpublished”, with Undo, which publishes it again (required)'],
    behavior: { pointer: 'Unpublish asks first; after the answer the badge goes back to Draft and the toast offers Undo.', keyboard: 'Unpublish is a button in reading order; the question takes Tab, Enter and Escape as dialogs do.', focus: 'Canceling the question returns focus to Unpublish.', responsive: 'As Publish: one row that wraps; on narrow widths the action moves under the status.', motion: 'None of its own.', loading: 'Not applicable: the caller changes the status, and the badge follows it.', error: 'Not applicable: the caller reports a failure; the badge stays Published until the status changes.' },
    a11y: { name: 'The button is named Unpublish; the question is a dialog named by its title.', announce: 'The result is toasted, or announced without a ToastProvider: “Easter banner” unpublished.', focus: 'The question is a dialog with focus inside.', contrast: 'The badge’s word and icon carry the state; its color repeats them.', motion: 'Nothing to reduce.' },
    content: { labels: 'Published, then Draft.', actions: 'Unpublish, and Undo in the toast.', errors: 'Not applicable: there is no error text.', localization: 'Every word comes from strings: unpublish, unpublishTitle, unpublishMessage, unpublished and undo.' },
    text: 'Takes a published item away from its audience and keeps it. The question names the item and who loses access; the status goes back to Draft; the toast offers Undo, which publishes it again.',
    use: ['Content that is wrong, out of date or needs changes', 'Saying who loses access and what stops working: links, embeds'],
    avoid: ['Deleting content you want to keep: unpublish it instead, so it is hidden but not lost', 'Unpublishing without a question when others are using it'],
    related: ['publish', 'confirmation-dialog', 'undo-pattern'],
    examples: [['Published: Unpublish asks first', function () { return h(PubDemo, { start: 'published' }); }]] };

  /* ── 10 Patterns › Review and approval › Review flow: ReviewFlow ── */
  var RevDemo = function (props) {
    var st = use(props.status || 'in-review'), hist = use(props.history || HISTORY), rev = use(props.reviewers || REVIEWERS);
    return box(props.width || 560, h(P.ReviewFlow, Object.assign({ title: 'Easter banner, north aisle', detail: 'Submitted by Jordan Avery', status: st[0], reviewers: rev[0], history: hist[0],
      onDecision: function (d, c) {
        st[1](d);
        rev[1](rev[0].map(function (r) { return r.id === 'ak' ? Object.assign({}, r, { decision: d }) : r; }));
        hist[1]([{ id: 'n' + hist[0].length, name: 'Alex Kim', decision: d, comment: c, time: 'Now', dateTime: new Date().toISOString().slice(0, 16) }].concat(hist[0]));
      } }, props.r)));
  };
  var reviewFlow = { id: 'review-flow', lab: true, icon: 'doc-search', sec: 'patterns', sub: 'Review and approval', leaf: 'Review flow', title: 'Review flow',
    plenix: 'ReviewFlow, WorkflowStatus', src: 'patterns/ReviewFlow/ReviewFlow.jsx', level: 'Pattern', interaction: 'Action', statesFrom: ['button', 'text-area'],
    aliases: ['Approval flow', 'Sign-off', 'Review panel', 'Moderation'],
    text: 'Reviews one item in a panel: its title and who submitted it, its status badge with its icon, the reviewers and their decisions, a comment, and the decisions in order (Reject, Request changes, then Approve last). Reject and Request changes need a comment; without one, the field says why and takes focus. The history lists every decision, newest first. The human-review form adds a notice that a person checks generated content before it is used.',
    use: ['Work that needs sign-off before it takes effect: assets for print, pages, policies', 'The status everywhere the item appears, as the same badge', 'A reason with every Reject and Request changes, kept in the history'],
    avoid: ['Review steps for low-risk changes: edit with history instead', 'Hiding the status from the person who submitted it', 'Approve and Reject side by side in the same style'],
    related: ['review-approve', 'review-reject', 'data-review-workflow', 'human-review', 'publish', 'badge'],
    map: [[ATL, 'Lozenge and approval actions (Jira workflow)', 'Partial'], [CAR, 'Tag status with actions', 'Partial'], [FLU, 'Approvals (Teams)', 'Partial'], ['Frappe', 'Workflow', 'Direct']],
    variantPages: [
      vp('Review panel', 'Form', 'Review panel (default)', { variant: 'panel' }, 'The title, the In review badge, the reviewers and their decisions, the comment, the three decisions and the history.', 'A side panel or a section beside the item under review', 'A batch of items: use the review queue'),
      vp('Human review of generated content', 'Form', 'Human review', { variant: 'human' }, 'The panel with an info notice first: the content was generated and a person checks it before it is used.', 'Generated text, tags or summaries that take effect only after a person approves them', 'Content people wrote themselves'),
      vp('Approve in a review', 'Decision', 'Approve', { variant: 'approved' }, 'The primary button, last. It runs at once, with the comment if there is one, and the badge turns Approved.', 'Signing off work that meets the bar', 'Approving for someone else without a record'),
      vp('Reject with a reason', 'Decision', 'Reject with reason', { variant: 'rejected' }, 'The danger outline button, first. It runs only with a comment, and the badge turns Rejected.', 'Work that will not go ahead', 'Work that can be fixed: request changes'),
      vp('Request changes in a review', 'Decision', 'Request changes', { variant: 'changes' }, 'Request changes needs a comment saying what to change; the badge turns Changes requested and the item goes back to its author.', 'Work that can be fixed and sent again', 'A final no: reject')
    ],
    examples: [
      ['Form', [['Review panel (default)', function () { return h(RevDemo, {}); }, null, 'kind=' + q('review')],
        ['Human review', function () { return h(RevDemo, { r: { kind: 'human', title: 'Summary of the vestry minutes', detail: 'Generated from Minutes, October.pdf' }, reviewers: [], history: [] }); }, null, 'kind=' + q('human')]], { prop: 'kind' }],
      ['Decision', [['Approve', function () { return h(RevDemo, { status: 'approved', reviewers: [{ id: 'mc', name: 'Maya Chen', decision: 'approved' }, { id: 'ak', name: 'Alex Kim', decision: 'approved' }] }); }, null, 'onDecision("approved", comment)'],
        ['Reject with reason', function () { return h(RevDemo, { status: 'rejected', history: [{ id: 'r1', name: 'Alex Kim', decision: 'rejected', comment: 'This photo is not ours to use.', time: '11:02 AM', dateTime: '2026-10-15T11:02' }].concat(HISTORY) }); }, null, 'onDecision("rejected", reason)'],
        ['Request changes', function () { return h(RevDemo, { status: 'changes-requested', history: HISTORY.slice(1) }); }, null, 'onDecision("changes-requested", comment)']]],
      ['Statuses (WorkflowStatus)', function () { return h('div', { className: 'ds-demo-row' }, ['draft', 'in-review', 'approved', 'changes-requested', 'rejected', 'published', 'scheduled'].map(function (s) { return h(P.WorkflowStatus, { key: s, status: s }); })); }],
      ['Read only: the status and the history', function () { return box(560, h(P.ReviewFlow, { title: 'Advent wreath poster', status: 'approved', reviewers: REVIEWERS.slice(0, 1), history: HISTORY })); }]
    ] };
  var approve = { id: 'review-approve', icon: 'circle-check', sec: 'patterns', sub: 'Review and approval', leaf: 'Approve', title: 'Approve',
    plenix: 'ReviewFlow (onDecision "approved"), WorkflowStatus', src: 'patterns/ReviewFlow/ReviewFlow.jsx', level: 'Pattern', interaction: 'Action', statesFrom: ['button'],
    variantClasses: [], docsFrom: 'review-flow', aliases: ['Accept', 'Sign off'],
    text: 'Accepts the work and moves it on. It is the primary button, last among the decisions and apart from Reject. It runs at once, with the comment if there is one; the reviewer’s decision and the item’s badge turn Approved (success, with its check), and the history records who and when.',
    use: ['The primary decision of a review panel', 'A question first only when approving also publishes or spends something'],
    avoid: ['Approving on someone’s behalf without recording it', 'Approve next to Reject in the same style'],
    related: ['review-flow', 'review-reject', 'publish'],
    examples: [['Approve with a comment', function () { return h(RevDemo, { status: 'in-review' }); }]] };
  var reject = { id: 'review-reject', icon: 'close', sec: 'patterns', sub: 'Review and approval', leaf: 'Reject', title: 'Reject',
    plenix: 'ReviewFlow (onDecision "rejected"), ReviewQueue', src: 'patterns/ReviewFlow/ReviewFlow.jsx', level: 'Pattern', interaction: 'Action', statesFrom: ['button', 'text-area'],
    variantClasses: [], docsFrom: 'review-flow', aliases: ['Decline', 'Request changes'],
    text: 'Declines the work, with a reason. It is the danger outline button, first among the decisions. Without a comment it does not run: the field says “Say why, so the author knows what to change.” and takes focus. Request changes is the fixable no, also with a reason. In the review queue, both ask for the reason in a dialog named with the count.',
    use: ['A final no, with the reason the author needs', 'Request changes when the work can be fixed and sent again'],
    avoid: ['Rejecting without a reason', 'Reject as the primary button'],
    related: ['review-flow', 'review-approve', 'data-review-workflow'],
    examples: [['Press Reject without a comment: the reason is asked for', function () { return h(RevDemo, { status: 'in-review', history: [] }); }]] };

  /* ── 10 Patterns › Data-management workflows › Data review workflow: ReviewQueue ── */
  var QueueDemo = function (props) {
    var s = use(props.items || QUEUE);
    return box(720, h(P.ReviewQueue, { label: props.label || 'Waiting for review', items: s[0], noun: 'item',
      onDecision: function (ids, d) { s[1](s[0].map(function (x) { return ids.indexOf(x.id) >= 0 ? Object.assign({}, x, { status: d }) : x; })); } }));
  };
  var dataReview = { id: 'data-review-workflow', icon: 'checklist', sec: 'patterns', sub: 'Data-management workflows', leaf: 'Data review workflow', title: 'Data review workflow',
    plenix: 'ReviewQueue, WorkflowStatus', src: 'patterns/ReviewFlow/ReviewFlow.jsx', level: 'Pattern', interaction: 'Action', statesFrom: ['data-grid', 'command-bar'],
    variantClasses: [], docsFrom: 'review-flow', aliases: ['Review queue', 'Moderation queue', 'Approval queue', 'Batch review'],
    text: 'Many items reviewed at once: a DataGrid of what waits for review (name, type, who submitted it, when, in the data font, and the status badge) under a command bar. Selecting rows swaps the bar to Approve, Request changes and Reject (last, in the danger color); the two that need a reason ask for it in a dialog named with the count (“Reject 2 items?”), then the statuses change and a toast says how many. The review panel ends on Approve, the step that moves work forward; the bar ends on Reject, the danger action, as command bars always do.',
    use: ['A batch after an import, a bulk edit or automated tagging', 'Filtering to what needs attention first', 'One reason for a bulk Reject or Request changes, kept with each item'],
    avoid: ['Showing every record when only some need review', 'Approving a batch without seeing it', 'A list without the status of each item'],
    related: ['review-flow', 'command-bar', 'data-grid', 'human-review'],
    map: [[CAR, 'Data table with batch actions', 'Partial'], [ATL, 'Dynamic table with bulk actions', 'Partial'], [POL, 'Index table with bulk actions', 'Partial']],
    examples: [['Select rows, then decide', function () { return h(QueueDemo, {}); }]] };

  /* ── 12 Specialized › AI and intelligent UI › Human review: ReviewFlow kind="human" ── */
  var humanReview = { id: 'human-review', icon: 'sparkle', sec: 'specialized', sub: 'AI and intelligent UI', leaf: 'Human review', title: 'Human review',
    plenix: 'ReviewFlow kind="human", ReviewQueue', src: 'patterns/ReviewFlow/ReviewFlow.jsx', level: 'Pattern', interaction: 'Action', statesFrom: ['button', 'text-area'],
    variantClasses: [], docsFrom: 'review-flow', aliases: ['Human in the loop', 'AI review', 'Approve generated content'],
    text: 'Generated results wait for a person before they take effect. The review panel’s human form says so in an info notice first, then offers the same decisions as any review: Reject, Request changes, Approve. Many results at once go in the review queue, with the assistant as their submitter.',
    use: ['High-impact or uncertain generated results: alt text, summaries, tags applied to many assets', 'Where policy needs a person to sign off', 'The same decision words as every other review'],
    avoid: ['A review with no real choice: Reject must stop the result', 'Sending every result to review when only some need it'],
    related: ['review-flow', 'data-review-workflow', 'notice'],
    examples: [['One generated result', function () { return h(RevDemo, { r: { kind: 'human', title: 'Summary of the vestry minutes', detail: 'Generated from Minutes, October.pdf' }, reviewers: [], history: [] }); }],
      ['A queue of generated results', function () { return h(QueueDemo, { items: GENERATED, label: 'Generated, waiting for review' }); }]] };

  /* ── 10 Patterns › Review and approval › Assign: AssignControl ── */
  var AsDemo = function (props) {
    var v = use(props.value === undefined ? null : props.value), d = use(props.delegation || null);
    return box(props.width || 560, h(P.AssignControl, Object.assign({ label: 'Assignee', people: PEOPLE, value: v[0], onChange: v[1], me: 'rm',
      delegation: d[0], onDelegate: d[1], onEndDelegation: function () { d[1](null); } }, props.a)));
  };
  var assignControl = { id: 'assign-control', lab: true, icon: 'person', sec: 'patterns', sub: 'Review and approval', leaf: 'Assign', title: 'Assign',
    plenix: 'AssignControl', src: 'patterns/AssignControl/AssignControl.tsx', level: 'Pattern', interaction: 'Selection', statesFrom: ['entity-picker', 'button'],
    aliases: ['Assignee', 'Owner', 'Reassign', 'Assign to me'],
    text: 'Shows who is responsible for an item, in one row. Unassigned: the people picker, searchable by name and email, with Assign to me beside it. Assigned: the person’s avatar, name and detail, with Reassign and Unassign; Reassign swaps the row to the picker until a person is chosen (Escape puts it back). Each change is announced.',
    use: ['Tasks, reviews and requests that need one owner', 'Assign to me as the shortcut for the person using the page', 'The assignee’s full name with the avatar, never initials alone'],
    avoid: ['Several owners for one item: they are reviewers or members', 'Assigning people who cannot open the item', 'Hiding who is assigned behind a button'],
    related: ['delegate', 'entity-picker', 'profile-summary', 'review-flow'],
    map: [[ATL, 'User picker (assignee)', 'Partial'], [FLU, 'People picker', 'Partial'], [POL, 'Autocomplete with avatars', 'Partial'], ['Frappe', 'Assign To', 'Direct']],
    variantPages: [
      vp('Assign an owner', 'Form', 'Assign (default)', { variant: 'assign' }, 'Nobody assigned: the people picker with Assign to me beside it.', 'Items without an owner yet', 'Items that always have one: show the assignee'),
      vp('Reassign', 'Form', 'Reassign', { variant: 'reassign' }, 'The assignee as a Persona with Reassign and Unassign; Reassign swaps the row to the picker with focus in it.', 'Handing an item to someone else', 'Adding a second person: they are a reviewer'),
      vp('Delegate with dates', 'Form', 'Delegate with dates', { variant: 'delegate' }, 'Shows to whom, and the start and end dates in the data font, with Change and End delegation. Delegate opens a dialog with the person, the dates and a note.', 'Approvals and reviews while someone is away', 'Giving access the delegate does not already have')
    ],
    examples: [
      ['Form', [['Assign (default)', function () { return h(AsDemo, {}); }, null, 'value={null}'],
        ['Reassign', function () { return h(AsDemo, { value: 'mc' }); }, 'plx-assign-control--assigned', 'value=' + q('mc')],
        ['Delegate with dates', function () { return h(AsDemo, { a: { variant: 'delegate', label: 'Approvals' }, delegation: { to: 'ak', start: '2026-10-20', end: '2026-10-27' } }); }, 'plx-assign-control--delegate', 'variant=' + q('delegate')]], { prop: 'variant' }],
      ['Without Assign to me or Unassign', function () { return h(AsDemo, { value: 'pn', a: { me: null, clearable: false, label: 'Reviewer' } }); }]
    ] };
  var delegate = { id: 'delegate', icon: 'forward', sec: 'patterns', sub: 'Review and approval', leaf: 'Delegate', title: 'Delegate',
    plenix: 'AssignControl variant="delegate"', src: 'patterns/AssignControl/AssignControl.tsx', level: 'Pattern', interaction: 'Selection', statesFrom: ['entity-picker', 'date-picker'],
    variantClasses: [], docsFrom: 'assign-control', aliases: ['Out of office', 'Act on behalf of', 'Hand over'],
    text: 'Lets someone act for a person for a set time. The row shows to whom, and the start and end dates in the data font. Delegate (or Change) opens a dialog with the person, the dates as a range and a note; the person and both dates are checked when Delegate is pressed. End delegation ends it early.',
    use: ['Approvers and reviewers who will be away', 'Always with an end date; it ends by itself', 'Both names on the affected items: “on behalf of”'],
    avoid: ['Granting more access than the delegate already has', 'A delegation with no end'],
    related: ['assign-control', 'date-picker', 'entity-picker'],
    examples: [['Not delegated yet', function () { return h(AsDemo, { a: { variant: 'delegate', label: 'Approvals' } }); }],
      ['Delegated', function () { return h(AsDemo, { a: { variant: 'delegate', label: 'Approvals' }, delegation: { to: 'ak', start: '2026-10-20', end: '2026-10-27', note: 'Back on Tuesday.' } }); }]] };

  return [deleteFlow, deleteAction, duplicateAction, duplicatePattern, publish, unpublish, reviewFlow, approve, reject, dataReview, humanReview, assignControl, delegate];
});
