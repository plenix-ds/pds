/* The dashboard study (issue 861): the owner's Dashboard Design System Specification 1.0 (2026-11-01), the same content
   and the same mockups, rebuilt on the Plenix Platform. Every mock is made of Platform components (window.Plenix): Panel,
   ActivityList, Checkbox, Badge (always with its icon), Count, Tag, Button, SegmentedControl, MetricCard, ProgressBar,
   EventChip, DateBadge, Persona, Notice, Banner, EmptyState, Skeleton, Menu, Toast (useUndo), WidgetGrid and Table.
   Plain script (no build): React.createElement as h. The layout rules and the diagrams are in dashboard-spec.css.
   The original is unchanged in original/Dashboard_Design_System_Specification.html. */
(function () {
  'use strict';
  var h = React.createElement, P = window.Plenix;
  var useState = React.useState, useRef = React.useRef, useLayoutEffect = React.useLayoutEffect;

  /* ── small helpers ── */
  var txt = function (variant, children, as, more) { return h(P.Text, Object.assign({ variant: variant, as: as }, more || {}), children); };
  var para = function (children, cls) { return h(P.Text, { as: 'p', className: cls }, children); };
  var h3 = function (children, id) { return h(P.Text, { as: 'h3', variant: 'heading', id: id }, children); };
  var h4 = function (children) { return h(P.Text, { as: 'h4', variant: 'label' }, children); };
  var badge = function (tone, icon, children, size) { return h(P.Badge, { tone: tone, icon: icon, size: size }, children); };
  // a decision chip of the original (adopted, variant, conditional, open): a Badge with its icon, never a dot
  var KIND = { ad: ['success', 'circle-check'], va: ['active', 'cards-medium'], dn: ['neutral', 'database'], op: ['action-required', 'flag'] };
  var chip = function (kind, children) { return badge(KIND[kind][0], KIND[kind][1], children); };
  var cond = function (children) { return badge('neutral', 'database', children || 'Conditional', 'sm'); };
  var bullets = function (items, label) { return h(P.List, { variant: 'bullets', label: label, items: items.map(function (x) { return { children: x }; }) }); };
  var stack = function (gap) { return function () { return h.apply(null, [P.Stack, { gap: gap }].concat([].slice.call(arguments))); }; };
  var inline = function (gap, more) { return function () { return h.apply(null, [P.Inline, Object.assign({ gap: gap }, more || {})].concat([].slice.call(arguments))); }; };
  var cols = function (n, items) { return h('div', { className: 'dss-cols' + (n === 3 ? ' dss-cols--3' : '') }, items); };
  // a static table (Table): the first column names the row; every column wraps; header labels start-aligned
  var table = function (label, heads, rows, widths) {
    return h(P.Table, { label: label, index: 'id',
      data: rows.map(function (r, i) { var o = { id: 'r' + i }; r.forEach(function (c, j) { o['c' + j] = c; }); return o; }),
      columns: heads.map(function (t, j) { return { title: t, field: 'c' + j, wrap: true, rowLabel: j === 0 ? true : undefined, width: widths && widths[j] ? widths[j] : undefined, render: function (rec) { return rec['c' + j]; } }; }) });
  };
  var beh = function (rows, heads) { return table('Behavior', heads || ['When', 'What happens'], rows); };
  // the card actions of the mocks: a ghost button with a chevron goes to the full list; icon-only ghost buttons
  var allBtn = function (label, children) { return h(P.Button, { variant: 'ghost', size: 'xs', iconEnd: 'chevron-right', label: label }, children || 'All'); };
  var iconBtn = function (icon, label, onClick) { return h(P.Button, { variant: 'ghost', size: 'xs', iconOnly: true, icon: icon, label: label, onClick: onClick }); };
  var optBtn = function (label) { return iconBtn('more', label || 'Card options'); };
  var count = function (n, tone, label) { return h(P.Count, { value: n, variant: 'pill', tone: tone, label: label }); };
  var actions = function () { return h.apply(null, [P.Inline, { gap: 'xs' }].concat([].slice.call(arguments))); };
  var panel = function (o, children) { return h(P.Panel, Object.assign({ headingLevel: 4 }, o), children); };
  // a row's end: the time, replaced by its actions on hover or focus (the pointer mode)
  var revealEnd = function (time, buttons) { return [h('span', { key: 't', className: 'dss-row__time' }, time), h('span', { key: 'a', className: 'dss-row__actions' }, buttons)]; };
  var lines = function () { return h(P.Stack, { gap: 'xs' }, h('i', { className: 'dss-line', 'data-w': '80' }), h('i', { className: 'dss-line', 'data-w': '70' }), h('i', { className: 'dss-line', 'data-w': '60' })); };

  /* a switch between a widget's approved variants: a SegmentedControl above the mock */
  function Variants(props) {
    var s = useState(props.value);
    return h(P.Stack, { gap: 'sm' },
      h(P.SegmentedControl, { label: props.label, size: 'sm', options: props.options, value: s[0], onChange: s[1] }),
      props.caption ? txt('secondary', props.caption, 'p') : null,
      props.render(s[0]));
  }

  /* ── a section of the page ── */
  function Section(props) {
    return h('section', { className: 'dss-section', id: props.id, 'aria-labelledby': props.id + '-h' },
      txt('eyebrow', props.eyebrow),
      h(P.Text, { as: 'h2', variant: 'title', id: props.id + '-h' }, props.title),
      props.lead ? h(P.Text, { as: 'p', variant: 'lead', className: 'dss-prose' }, props.lead) : null,
      props.children);
  }

  /* ── a widget's dossier: its number and name, the decisions, the mock on its stage, then its text ── */
  function Dossier(d) {
    var id = 'd-' + d.n;
    return h('article', { className: 'dss-dossier' + (d.wide ? ' dss-dossier--wide' : ''), id: id, 'aria-labelledby': id + '-h' },
      inline('sm', { align: 'baseline' })(txt('data', d.n), h(P.Text, { as: 'h3', variant: 'title', id: id + '-h' }, d.title)),
      d.decided ? inline('sm', { wrap: true })(txt('eyebrow', 'Standard'), d.decided.map(function (c, i) { return h(React.Fragment, { key: i }, chip(c[0], c[1])); })) : null,
      h('div', { className: 'dss-dossier__grid' },
        stack('xs')(txt('eyebrow', 'Sample content' + (d.hint ? ' · ' + d.hint : '')), h('div', { className: 'dss-stage' }, h(d.mock))),
        h('div', { className: 'dss-dossier__text' },
          stack('sm')(h4('Information and presentation'), bullets(d.info, 'Information and presentation'),
            d.variants ? h4('Variants') : null, d.variants ? para(d.variants) : null),
          stack('sm')(h4('Behavior'), beh(d.behavior)),
          stack('sm')(h4('States, permissions, mobile'), para(d.states)))));
  }

  /* ════════════════ the widget mocks ════════════════ */

  /* 5.1 Notifications: unread rows, Mark all read with Undo, groups New and Yesterday */
  var NOTIFS = [
    { id: 'n1', group: 'New', icon: 'hdr-upload', title: 'Fr. Daniel uploaded 12 new assets to Liturgy', time: '5 min', unread: true },
    { id: 'n2', group: 'New', icon: 'circle-check', title: 'Sarah M. approved your batch download request', time: '22 min', unread: true },
    { id: 'n3', group: 'New', icon: 'message', title: 'Maya Chen sent a message: Round 3 concepts — confirm Thursday?', meta: 'Also in Emails', time: '10:24 AM', unread: true },
    { id: 'n4', group: 'Yesterday', icon: 'clock', title: 'Task due Mar 8: Deliver logo concepts round 3', meta: 'Also in To do', time: 'Yesterday' },
    { id: 'n5', group: 'Yesterday', icon: 'image-b', title: 'Version 3 of Banner Icon Set is now live', time: 'Yesterday' }];
  function useReadState(rows) {
    var s = useState(function () { var o = {}; rows.forEach(function (r) { o[r.id] = !!r.unread; }); return o; });
    var toggle = function (id) { s[1](function (u) { var n = Object.assign({}, u); n[id] = !u[id]; return n; }); };
    return [s[0], s[1], toggle];
  }
  function NotificationsMock() {
    var st = useReadState(NOTIFS), unread = st[0], undoable = P.useUndo();
    var n = NOTIFS.filter(function (r) { return unread[r.id]; }).length;
    var markAll = function () {
      var was = Object.assign({}, unread), none = {}; NOTIFS.forEach(function (r) { none[r.id] = false; });
      st[1](none); undoable('Marked ' + n + ' as read', { onUndo: function () { st[1](was); } });
    };
    return panel({ icon: 'hdr-bell', title: 'Notifications',
      actions: actions(n ? count(n, 'info', n + ' new') : null, h(P.Button, { variant: 'ghost', size: 'xs', disabled: !n, onClick: markAll }, 'Mark all read'), optBtn()),
      footer: allBtn('View all notifications', 'View all') },
    h(P.Stack, { gap: 'sm' }, ['New', 'Yesterday'].map(function (g) {
      return h(P.Stack, { key: g, gap: 'xs' }, h(P.SectionHeading, { level: 5 }, g),
        h(P.ActivityList, { label: g, titleLines: 2, stacked: true }, NOTIFS.filter(function (r) { return r.group === g; }).map(function (r) {
          return h(P.ActivityList.Item, { key: r.id, className: 'dss-reveal', unread: unread[r.id], leading: h(P.Icon, { name: r.icon }), title: r.title, meta: r.meta,
            onOpen: function () { st[2](r.id); },
            actions: revealEnd(txt('data', r.time), [h(React.Fragment, { key: 'r' }, iconBtn('check', unread[r.id] ? 'Mark read' : 'Mark unread', function () { st[2](r.id); })), h(React.Fragment, { key: 'o' }, iconBtn('open', 'Open'))]) });
        })));
    })));
  }

  /* 5.2 To do: tick a task, Undo; groups Due soon and Later; Completed counts what is done */
  var TODOS = [
    { id: 't1', group: 'Due soon', title: 'Deliver logo concepts round 3', due: 'Sun, Mar 8', high: true, soon: true },
    { id: 't2', group: 'Due soon', title: 'Get second plumbing quote', due: 'Tue, Mar 10', high: true },
    { id: 't3', group: 'Due soon', title: 'Upload expense receipts Jan–Feb', due: 'Tue, Mar 10' },
    { id: 't4', group: 'Later', title: 'Set up brand asset folder', due: 'Thu, Mar 12' },
    { id: 't5', group: 'Later', title: 'File Q1 estimated tax payment', due: 'Sun, Mar 15', high: true },
    { id: 't6', group: 'Later', title: 'Confirm countertop material', due: 'Sun, Mar 15' },
    { id: 't7', group: 'Later', title: 'Book Madrid hotel — Chueca', due: 'Fri, Mar 20' }];
  function TaskRows(props) {
    var done = props.done;
    return h(P.Stack, { gap: 'none' }, props.rows.map(function (t) {
      return h('div', { key: t.id, className: 'dss-row dss-reveal' },
        h('div', { className: 'dss-row__main' }, h(P.Checkbox, { label: t.title, description: t.description, checked: !!done[t.id], onChange: function () { props.onToggle(t); }, className: done[t.id] ? 'dss-done' : undefined })),
        h('div', { className: 'dss-row__end' },
          t.risk ? badge('waiting', 'warning', t.risk, 'sm') : null,
          t.high ? h(P.Icon, { name: 'flag', label: 'High priority' }) : null,
          t.due ? revealEnd(t.soon ? badge('waiting', 'clock', t.due, 'sm') : txt('data', t.due), [h(React.Fragment, { key: 'd' }, iconBtn('calendar', 'Change due date')), h(React.Fragment, { key: 'm' }, iconBtn('more', 'More'))]) : null));
    }));
  }
  function useTicks() {
    var s = useState({}), undoable = P.useUndo();
    var toggle = function (t) {
      var next = !s[0][t.id];
      s[1](function (d) { var n = Object.assign({}, d); n[t.id] = next; return n; });
      if (next) undoable('Task completed', { onUndo: function () { s[1](function (d) { var n = Object.assign({}, d); n[t.id] = false; return n; }); } });
    };
    return [s[0], toggle];
  }
  function TodoMock() {
    var tk = useTicks(), done = tk[0];
    var open = TODOS.filter(function (t) { return !done[t.id]; }), fin = TODOS.filter(function (t) { return done[t.id]; });
    var group = function (g) { var rows = open.filter(function (t) { return t.group === g; }); return rows.length ? h(P.Stack, { key: g, gap: 'xs' }, h(P.SectionHeading, { level: 5, actions: count(rows.length, 'neutral', rows.length + ' tasks') }, g), h(TaskRows, { rows: rows, done: done, onToggle: tk[1] })) : null; };
    return panel({ icon: 'circle-check', title: 'To do', actions: actions(count(open.length, 'neutral', open.length + ' open'), allBtn('View all tasks'), optBtn()) },
      h(P.Stack, { gap: 'sm' }, group('Due soon'), group('Later'),
        fin.length ? h(P.Stack, { gap: 'xs' }, h(P.SectionHeading, { level: 5 }, 'Completed (' + fin.length + ')'), h(TaskRows, { rows: fin, done: done, onToggle: tk[1] })) : null));
  }

  /* 5.3 Emails: sender, subject and preview; project tag and attachment; Archive and Mark read on hover */
  var EMAILS = [
    { id: 'e1', from: 'Maya Chen', subj: 'Round 3 concepts — confirm Thursday?', time: '10:24 AM', tag: ['Apex', 'blue'], files: 1, unread: true },
    { id: 'e2', from: 'ABC Plumbing', subj: 'Kitchen quote follow-up', time: '9:41 AM', tag: ['Kitchen', 'orange'], unread: true },
    { id: 'e3', from: 'Luis Herrera', subj: 'Q1 tax docs ready for review', time: 'Yesterday' },
    { id: 'e4', from: 'James Whitfield', subj: 'RE: SOW — one small change', time: 'Yesterday' },
    { id: 'e5', from: 'Booking.com', subj: 'Your Madrid reservation is confirmed', time: 'Mar 3', tag: ['Spain', 'green'] }];
  function EmailsMock() {
    var st = useReadState(EMAILS), unread = st[0];
    var n = EMAILS.filter(function (r) { return unread[r.id]; }).length;
    return h(P.Stack, { gap: 'sm', className: 'dss-mock-narrow' },
      panel({ icon: 'mail', title: 'Emails', actions: actions(n ? count(n, 'info', n + ' unread') : null, allBtn('Open the inbox', 'Inbox'), optBtn()) },
        h(P.ActivityList, { label: 'Emails', stacked: true }, EMAILS.map(function (e) {
          return h(P.ActivityList.Item, { key: e.id, className: 'dss-reveal', unread: unread[e.id], leading: h(P.Avatar, { name: e.from, size: 'md' }), title: e.from,
            meta: e.subj + ' · Preview text from the mail provider…', onOpen: function () { st[2](e.id); },
            actions: [h('span', { key: 'm', className: 'dss-row__time' }, h(P.Inline, { gap: 'xs' }, txt('data', e.time), e.tag ? h(P.Tag, { category: e.tag[1] }, e.tag[0]) : null, e.files ? h(P.Inline, { gap: 'none' }, h(P.Icon, { name: 'attachment', label: 'Attachments' }), txt('data', String(e.files))) : null)),
              h('span', { key: 'a', className: 'dss-row__actions' }, iconBtn('archive', 'Archive'), iconBtn('check', unread[e.id] ? 'Mark read' : 'Mark unread', function () { st[2](e.id); }))] });
        }))),
      inline('xs', { wrap: true })(cond(), txt('secondary', 'Preview, project tag and attachment marker need those fields from the mail connection.')));
  }

  /* 5.4 Calendar: variant A (day strip and agenda, the default), B (date header and agenda), C (week strip and timeline) */
  var DAYS3 = [['wed', 'Wed 4', 'Wednesday, Mar 4'], ['thu', 'Thu 5', 'Thursday, Mar 5'], ['fri', 'Fri 6', 'Friday, Mar 6']];
  var agendaRow = function (time, chipEl, o) {
    o = o || {};
    return h('div', { className: 'dss-agenda__row' + (o.past ? ' dss-past' : '') }, txt('data', time, 'span', { className: 'dss-agenda__time' }), h(P.Inline, { gap: 'sm', wrap: true }, chipEl, o.next ? badge('active', 'clock', 'Next · in 45 min', 'sm') : null));
  };
  var agenda = function (withNow) {
    return h('div', { className: 'dss-agenda' },
      agendaRow('9:00 AM', h(P.EventChip, { title: 'Standup — Apex team', color: 'blue', onClick: function () {} }), { past: true }),
      withNow ? h('div', { className: 'dss-now' }, txt('label', 'Now 1:15 PM')) : null,
      agendaRow('2:00 PM', h(P.EventChip, { title: 'Contractor call (ABC)', color: 'brown', onClick: function () {} }), { next: withNow }),
      agendaRow('4:30 PM', h(P.EventChip, { title: 'Budget review — kitchen', color: 'brown', onClick: function () {} })));
  };
  function CalendarA() {
    var s = useState(1), i = s[0];
    return panel({ icon: 'calendar', title: 'Calendar', description: DAYS3[i][2],
      actions: actions(i === 1 ? badge('active', 'calendar', 'Today', 'sm') : null, iconBtn('chevron-left', 'Previous day', function () { s[1](Math.max(0, i - 1)); }),
        h(P.Button, { variant: 'ghost', size: 'xs', onClick: function () { s[1](1); } }, 'Today'), iconBtn('chevron-right', 'Next day', function () { s[1](Math.min(2, i + 1)); }), allBtn('Open the calendar')) },
    h(P.Stack, { gap: 'sm' },
      h(P.SegmentedControl, { label: 'Day', size: 'sm', options: DAYS3.map(function (d) { return { value: d[0], label: d[1] }; }), value: DAYS3[i][0], onChange: function (v) { s[1](DAYS3.map(function (d) { return d[0]; }).indexOf(v)); } }),
      i === 1 ? agenda(true) : h(P.EmptyState, { title: 'Nothing scheduled', icon: 'calendar', action: h(P.Button, { size: 'sm', icon: 'plus' }, 'Add event') }, 'This day is open.')));
  }
  function CalendarB() {
    return panel({ icon: 'calendar', title: 'Thursday, Mar 5', description: 'Today',
      actions: actions(h(P.Button, { variant: 'ghost', size: 'xs' }, 'Today'), iconBtn('chevron-left', 'Previous day'), iconBtn('chevron-right', 'Next day')) }, agenda(false));
  }
  var WEEK = [['sat', 'Sat 31'], ['sun', 'Sun 1'], ['mon', 'Mon 2'], ['tue', 'Tue 3'], ['wed', 'Wed 4'], ['thu', 'Thu 5'], ['fri', 'Fri 6']];
  function CalendarC() {
    var s = useState('thu');
    var hours = ['9 AM', '10', '11', '12 PM', '1', '2 PM', '3', '4', '5 PM'];
    return panel({ icon: 'calendar', title: 'Upcoming schedule', description: 'Thursday, Mar 5', actions: actions(allBtn('Open the calendar')) },
      h(P.Stack, { gap: 'sm' },
        h(P.SegmentedControl, { label: 'Day', size: 'sm', options: WEEK.map(function (d) { return { value: d[0], label: d[1] }; }), value: s[0], onChange: s[1] }),
        h('div', { className: 'dss-timeline' },
          hours.map(function (t, i) { return h('div', { key: t, className: 'dss-timeline__hour', 'data-row': String(i + 1) }, txt('caption', t)); }),
          h('div', { className: 'dss-timeline__event', 'data-row': '1' }, h(P.EventChip, { title: 'Standup — Apex team', time: '9:00 AM', color: 'blue', fill: true })),
          h('div', { className: 'dss-timeline__event', 'data-row': '6' }, h(P.EventChip, { title: 'Contractor call (ABC)', time: '2:00 PM', color: 'brown', fill: true })),
          h('div', { className: 'dss-timeline__event', 'data-row': '8' }, h(P.EventChip, { title: 'Budget review — kitchen', time: '4:30 PM', color: 'brown', fill: true }))),
        txt('secondary', 'Block length uses the real duration when the calendar supplies one.', 'p')));
  }
  function CalendarMock() {
    return h(Variants, { label: 'Calendar variant', value: 'a', caption: 'Responsive rule: B in a narrow card, A or C when the card is expanded. Default: A.',
      options: [{ value: 'a', label: 'A · Strip and agenda (default)' }, { value: 'b', label: 'B · Date header and agenda' }, { value: 'c', label: 'C · Week strip and timeline' }],
      render: function (v) { return v === 'a' ? h(CalendarA) : v === 'b' ? h(CalendarB) : h(CalendarC); } });
  }

  /* 5.5 Notes: filter by category, newest first */
  var NOTES = [['AI tools comparison', 'Research', 'Mar 3'], ['Contractor comparison', 'Kitchen', 'Mar 2'], ['Typography shortlist', 'Apex', 'Mar 1'], ['Hotel shortlist — Madrid', 'Spain', 'Feb 28'], ['Cabinet style decisions', 'Kitchen', 'Feb 22'], ['Kickoff meeting recap', 'Apex', 'Feb 20']];
  var CAT = { Kitchen: 'orange', Apex: 'blue', Spain: 'green', Research: 'grey' };
  function NotesMock() {
    var s = useState('All');
    var rows = NOTES.filter(function (n) { return s[0] === 'All' || n[1] === s[0]; });
    return panel({ icon: 'doc-text', title: 'Notes', actions: actions(iconBtn('plus', 'New note'), allBtn('View all notes')) },
      h(P.Stack, { gap: 'sm' },
        h(P.SegmentedControl, { label: 'Filter notes', size: 'sm', options: ['All', 'Kitchen', 'Apex', 'Spain', 'Research'].map(function (c) { return { value: c, label: c }; }), value: s[0], onChange: s[1] }),
        rows.length ? h(P.ActivityList, { label: 'Notes' }, rows.map(function (n) {
          return h(P.ActivityList.Item, { key: n[0], leading: h(P.Icon, { name: 'doc-text' }), title: n[0], onOpen: function () {}, actions: h(P.Inline, { gap: 'sm' }, h(P.Tag, { category: CAT[n[1]] }, n[1]), txt('data', n[2])) });
        })) : h(P.EmptyState, { title: 'No notes in ' + s[0], action: h(P.Button, { size: 'sm', icon: 'plus' }, 'New note') })));
  }

  /* 5.6 Projects: tiles, rows or adaptive; the project color is a ColorSwatch (a data color) */
  var PROJECTS = [['Kitchen Renovation', 'Personal', 2, 2, 'brown'], ['Apex Co — Brand Refresh', 'Client', 2, 2, 'blue'], ['Spain — June 2026', 'Personal', 1, 1, 'green'], ['Tax & Finances 2026', 'Personal', 0, 2, 'purple']];
  var notesWord = function (n) { return n + (n === 1 ? ' note' : ' notes'); };
  var tiles = function () {
    return panel({ icon: 'briefcase', title: 'Projects', actions: actions(allBtn('View all projects'), optBtn()) },
      h(P.ContentGrid, { size: 'md', label: 'Projects' }, PROJECTS.map(function (p) {
        return h(P.Card, { key: p[0], title: p[0], onOpen: function () {}, actions: optBtn('Options for ' + p[0]),
          meta: h(P.Inline, { gap: 'xs', wrap: true }, h(P.ColorSwatch, { color: p[4], size: 'sm' }), h(P.Tag, null, p[1]), txt('secondary', notesWord(p[2])), cond(p[3] + ' open tasks')) });
      })));
  };
  var rowsView = function () {
    return panel({ icon: 'briefcase', title: 'Projects', actions: actions(count(PROJECTS.length, 'neutral', PROJECTS.length + ' projects'), allBtn('View all projects'), optBtn()),
      footer: allBtn('View all 12 projects', '8 more · View all') },
    h(P.Stack, { gap: 'none' }, PROJECTS.map(function (p) {
      return h(P.RowButton, { key: p[0], onClick: function () {} },
        h(P.Inline, { gap: 'sm', inset: 'sm' }, h(P.ColorSwatch, { color: p[4] }),
          h(P.Stack, { gap: 'none', grow: true }, txt('strong', p[0]), txt('secondary', p[1] + ' · ' + notesWord(p[2]))),
          cond('health · milestone · owner')));
    })));
  };
  function ProjectsMock() {
    return h(Variants, { label: 'Projects presentation', value: 't', caption: 'Adaptive switches by project count and card width.',
      options: [{ value: 't', label: 'Tiles' }, { value: 'r', label: 'Rows' }, { value: 'ad', label: 'Adaptive' }],
      render: function (v) {
        return v === 't' ? tiles() : v === 'r' ? rowsView() : h(P.Stack, { gap: 'sm' }, txt('label', '4 or fewer projects → tiles', 'p'), tiles(), txt('label', 'More projects → rows', 'p'), rowsView());
      } });
  }

  /* 5.7 Contacts: pointer (Message and Call on hover or focus) and touch (visible actions) */
  var PEOPLE = ['Maya Chen', 'Jeff Torres', 'Luis Herrera', 'James Whitfield', 'Sarah Morgan'];
  var contacts = function (mode) {
    return panel({ icon: 'settings-users', title: 'Contacts', actions: actions(allBtn('View all contacts'), optBtn()) },
      h(P.ActivityList, { label: 'Contacts' }, PEOPLE.map(function (n) {
        return h(P.ActivityList.Item, { key: n, className: mode === 'p' ? 'dss-reveal' : undefined, leading: h(P.Avatar, { name: n, size: 'md' }), title: n, onOpen: function () {},
          actions: mode === 'p' ? h('span', { className: 'dss-row__actions' }, iconBtn('message', 'Message ' + n), iconBtn('phone', 'Call ' + n))
            : h(P.Inline, { gap: 'xs' }, iconBtn('message', 'Message ' + n), iconBtn('more', 'More for ' + n)) });
      })));
  };
  function ContactsMock() {
    return h(Variants, { label: 'Input mode', value: 'p', caption: 'Switches automatically on touch devices. Hover the rows in the pointer view.',
      options: [{ value: 'p', label: 'Pointer: hover or focus' }, { value: 't', label: 'Touch: visible actions' }], render: contacts });
  }

  /* 5.8 KPI cards (parish office): MetricCard, with the reflow on a phone */
  function ParishKpis() {
    return h(P.Stack, { gap: 'md' },
      h('div', { className: 'dss-kpis' },
        h(P.MetricCard, { icon: 'person', title: 'Active members', value: '381', href: '#d-5.8', change: { amount: '26', direction: 'up', versus: 'joined since 2024' }, goodWhen: 'up' }),
        h(P.MetricCard, { icon: 'home', title: 'Households', value: '120', href: '#d-5.8', footer: '≈ 3.2 members per household (conditional)' }),
        h(P.MetricCard, { type: 'progress', icon: 'settings-users', title: 'Servants signed up', context: 'Next 8 days', value: '18', target: '25', href: '#d-5.8', progress: { value: 18, max: 25, tone: 'info' }, status: { tone: 'waiting', icon: 'clock', label: '7 open' }, footer: '18 of 25 slots filled' })),
      txt('label', 'On a phone: reflow', 'p'),
      h('div', { className: 'dss-phone' },
        h('div', { className: 'dss-kpis dss-kpis--phone' },
          h(P.MetricCard, { size: 'sm', title: 'Active members', value: '381' }),
          h(P.MetricCard, { size: 'sm', title: 'Households', value: '120' }),
          h(P.MetricCard, { type: 'progress', size: 'sm', title: 'Servants signed up', value: '18', target: '25', progress: { value: 18, max: 25 }, status: { tone: 'waiting', icon: 'clock', label: '7 open' } })),
        txt('secondary', 'Reflow on a phone: nothing scrolls out of view.', 'p')));
  }

  /* 5.9 Page header and quick actions */
  function ParishHeader() {
    return h(P.Inline, { gap: 'md', justify: 'between', wrap: true },
      h(P.Stack, { gap: 'none' }, h(P.Text, { as: 'p', variant: 'title' }, 'Parish office'), txt('secondary', 'Sunday, October 25, 2026')),
      h(P.Inline, { gap: 'xs', wrap: true },
        h(P.Button, { variant: 'ghost', icon: 'doc-text' }, 'Print bulletin'), h(P.Button, { variant: 'ghost', icon: 'mail' }, 'Email the parish'), h(P.Button, { variant: 'ghost', icon: 'voice' }, 'Announcements'),
        h(P.Divider, { orientation: 'vertical' }),
        h(P.Button, { icon: 'settings-customize' }, 'Customize'), h(P.Button, { variant: 'primary', icon: 'field-currency' }, 'Record a gift')));
  }

  /* 5.10 Services and feasts: a DateBadge with the day's services; feasts and fasts with a countdown */
  var SERVICES = [['Sun', '25', true, [['Divine Liturgy', '8:00 AM · Church']]], ['Wed', '28', false, [['Divine Liturgy', '7:00 AM · Church'], ['Bible Study', '7:00 PM · Fellowship hall']]],
    ['Fri', '30', false, [['Youth Meeting', '7:00 PM · Youth room']]], ['Sat', '31', false, [['Vespers and Midnight Praises', '6:00 PM · Church']]]];
  var FEASTS = [['The Nativity Fast begins', 'Nov 25, 2026 · in 31 days', ['waiting', 'schedule', 'Fast']], ['The month of Kiahk begins', 'Dec 10, 2026 · in 46 days', ['neutral', 'calendar', 'Season']],
    ['Feast of the Nativity', 'Jan 7, 2027 · in 74 days', ['active', 'calendar', 'Feast']], ['Feast of St. John the Beloved', 'Jan 12, 2027 · in 79 days', ['active', 'star', 'Patron feast']]];
  function ServicesMock() {
    return panel({ icon: 'calendar', title: 'Services and feasts', actions: actions(allBtn('Open the calendar', 'Calendar'), optBtn()) },
      h(P.Stack, { gap: 'md' },
        h(P.Stack, { gap: 'sm' }, h(P.SectionHeading, { level: 5 }, 'This week'), SERVICES.map(function (d) {
          return h(P.Inline, { key: d[1], gap: 'sm', align: 'start' }, h(P.DateBadge, { weekday: d[0], day: d[1], today: d[2] }),
            h(P.Stack, { gap: 'xs', grow: true }, d[3].map(function (e) { return h(P.Stack, { key: e[0], gap: 'none' }, txt('strong', e[0]), txt('secondary', e[1])); })),
            d[2] ? badge('active', 'calendar', 'Today', 'sm') : null);
        })),
        h(P.Stack, { gap: 'sm' }, h(P.SectionHeading, { level: 5 }, 'Feasts and fasts'), FEASTS.map(function (f) {
          return h(P.Inline, { key: f[0], gap: 'sm', justify: 'between' }, h(P.Stack, { gap: 'none' }, txt('strong', f[0]), txt('secondary', f[1])), badge(f[2][0], f[2][1], f[2][2], 'sm'));
        }))));
  }

  /* 5.11 Today's tasks (parish): sorted by urgency; the line at risk carries a warning badge */
  var TODAY = [{ id: 'p1', title: 'Find a servant for the sound desk', description: 'Nov 1, 7:30 AM', risk: 'Nobody signed up yet' }, { id: 'p2', title: 'Confirm the Agape meal count', description: 'Agape Kitchen asked by 10:00 AM' },
    { id: 'p3', title: 'Print the weekly bulletin', description: '120 copies for the Divine Liturgy' }, { id: 'p4', title: 'Send the Sunday School reminder', description: 'Grades 1–6, classes at 11:30 AM' }];
  function TodayMock() {
    var tk = useTicks(), open = TODAY.filter(function (t) { return !tk[0][t.id]; }).length;
    return panel({ icon: 'checklist', title: 'Today’s tasks', actions: actions(count(open, 'neutral', open + ' open'), optBtn()) }, h(TaskRows, { rows: TODAY, done: tk[0], onToggle: tk[1] }));
  }

  /* 5.12 Visitors to welcome */
  function VisitorsMock() {
    var V = [['Mina Mikhail', 'East'], ['George Hanna', 'North'], ['Mina Boutros', 'South']];
    return panel({ icon: 'person', title: 'Visitors to welcome', actions: actions(count(3, 'neutral', '3 visitors'), optBtn()) },
      h(P.ActivityList, { label: 'Visitors' }, V.map(function (v) {
        return h(P.ActivityList.Item, { key: v[0], className: 'dss-reveal', leading: h(P.Avatar, { name: v[0], size: 'md' }), title: v[0], meta: 'Visitor · ' + v[1] + ' district', onOpen: function () {},
          actions: h('span', { className: 'dss-row__actions' }, iconBtn('mail', 'Email ' + v[0])) });
      })));
  }

  /* 5.13 Giving: A two bars and a delta, B paired bars and the difference (default), C actual against target */
  var MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O'];
  var year = function () {
    return h(P.Stack, { gap: 'xs', className: 'dss-divided' },
      txt('secondary', 'January to October'), h(P.Text, { variant: 'title', tabular: true }, '$947,894'),
      h('div', { className: 'dss-months' }, MONTHS.map(function (m, i) {
        var tip = i === 8 ? 'Sep $254,231' : i === 9 ? 'Oct $260,718' : 'No value';
        return h(P.Tooltip, { key: i, content: tip }, h('span', { tabIndex: 0, 'aria-label': tip, className: 'dss-bar ' + (i === 9 ? 'dss-bar--now' : i === 8 ? 'dss-bar--before' : 'dss-bar--none'), 'data-h': i === 9 ? '87' : i === 8 ? '85' : '35' }));
      })),
      h('div', { className: 'dss-months__labels', 'aria-hidden': 'true' }, MONTHS.map(function (m, i) { return txt('caption', m, 'span', { key: i }); })),
      txt('secondary', 'Hatched bars: no monthly value available in sample data.', 'p'));
  };
  var updated = function () { return h(P.Inline, { gap: 'xs' }, h(P.Icon, { name: 'clock' }), txt('secondary', 'Updated this morning')); };
  var up = function (t) { return h(P.Inline, { gap: 'none' }, h(P.Icon, { name: 'arrow-up' }), txt('success', t)); };
  var pairs = function (second) {
    return h('div', { className: 'dss-pairs' },
      h('div', { className: 'dss-pairs__item' }, h('i', { className: 'dss-pairs__bar dss-bar--now', 'data-h': '60' }), txt('caption', 'Oct'), txt('data', '$260,718')),
      second === 'target' ? h('div', { className: 'dss-pairs__item' }, h('div', { className: 'dss-pairs__target' }, txt('data', '?')), txt('caption', 'Target'))
        : h('div', { className: 'dss-pairs__item' }, h('i', { className: 'dss-pairs__bar dss-bar--before', 'data-h': '56' }), txt('caption', 'Sep'), txt('data', '$254,231')));
  };
  var givingPanel = function (body) { return panel({ icon: 'field-currency', title: 'Giving', actions: actions(allBtn('Open the giving history', 'History'), optBtn()), footer: updated() }, h(P.Stack, { gap: 'md' }, body, year())); };
  function GivingMock() {
    return h(Variants, { label: 'Giving comparison', value: 'b', caption: 'C appears only when a target exists in the data.',
      options: [{ value: 'a', label: 'A · Two bars and a delta' }, { value: 'b', label: 'B · Paired bars and difference (default)' }, { value: 'c', label: 'C · Actual against target' }],
      render: function (v) {
        if (v === 'a') return givingPanel(h(P.Stack, { gap: 'sm' }, txt('secondary', 'October'), h(P.Text, { variant: 'display', tabular: true }, '$260,718'),
          h(P.Inline, { gap: 'xs', wrap: true }, up('3%'), txt('secondary', 'vs September'), cond('State the comparison window')),
          h(P.ProgressBar, { label: 'October · $260,718', value: 260718, max: 260718, color: 'blue', size: 'sm' }),
          h(P.ProgressBar, { label: 'September · $254,231', value: 254231, max: 260718, color: 'gray', size: 'sm' })));
        if (v === 'b') return givingPanel(h(P.Stack, { gap: 'sm' }, h(P.Inline, { gap: 'xs', wrap: true }, txt('secondary', 'October to date vs September 1 to 25'), cond('Confirm window')),
          h(P.Inline, { gap: 'sm', align: 'baseline' }, h(P.Text, { variant: 'display', tabular: true }, '+$6,487'), up('+2.6%')), pairs('sep')));
        return givingPanel(h(P.Stack, { gap: 'sm' }, txt('secondary', 'October against target'), h(P.Text, { variant: 'display', tabular: true }, '$260,718'),
          h(P.Inline, { gap: 'xs' }, txt('secondary', 'Target'), cond('Needs budget data')), pairs('target')));
      } });
  }

  /* 5.14 In the office: the status is a Badge with its icon and word (never a dot on the avatar) */
  var STAFF = [['Fr. Daniel Boulos', 'Parish priest', ['success', 'circle-check', 'In the office']], ['Nevine Mikhail', 'Church office secretary', ['success', 'circle-check', 'In the office']],
    ['Fr. Antony Wahba', 'Associate priest', ['active', 'do-not-disturb', 'In a meeting']], ['Hany Fahmy', 'Visitation servant', ['waiting', 'clock', 'Away']], ['Sarah Ibrahim', 'Food Pantry lead', ['neutral', 'remove', 'Not in today']]];
  function OfficeMock() {
    return panel({ icon: 'home', title: 'In the office', description: 'Who is in today', actions: actions(count(2, 'success', '2 in the office'), optBtn()) },
      h(P.ActivityList, { label: 'In the office', stacked: true }, STAFF.map(function (s) {
        return h(P.ActivityList.Item, { key: s[0], className: 'dss-reveal', leading: h(P.Avatar, { name: s[0], size: 'md' }), title: s[0], meta: s[1], onOpen: function () {},
          actions: revealEnd(badge(s[2][0], s[2][1], s[2][2], 'sm'), [h(React.Fragment, { key: 'm' }, iconBtn('message', 'Message ' + s[0])), h(React.Fragment, { key: 'c' }, iconBtn('phone', 'Call ' + s[0]))]) });
      })));
  }

  /* 5.15 Livestream: live, idle (the default), error, loading */
  function LivestreamMock() {
    var s = useState('idle'), v = s[0];
    var facts = function (a, b, c, d) { return h(P.PropertyList, null, h(P.PropertyList.Item, { label: a, data: true }, b), h(P.PropertyList.Item, { label: c, data: true }, d)); };
    var body = v === 'live' ? h(P.Stack, { gap: 'sm' }, h(P.Inline, { gap: 'sm', justify: 'between' }, badge('success', 'voice', 'Live now'), h(P.Button, { size: 'sm', icon: 'open' }, 'Open stream')), facts('Started', '8:00 AM', 'Watching', '214'))
      : v === 'idle' ? h(P.Stack, { gap: 'sm' }, h(P.Inline, { gap: 'sm', wrap: true }, badge('neutral', 'stop', 'Offline'), txt('secondary', 'Next stream: Sunday, 8:00 AM')), facts('Last stream', 'Oct 25, 8:00 AM', 'Viewers', '214'))
        : v === 'error' ? h(P.Stack, { gap: 'sm' }, facts('Last stream', 'Oct 25, 8:00 AM', 'Viewers', '214'),
          h(P.Notice, { tone: 'warning', title: 'Status not refreshed.', actions: h(P.Button, { size: 'xs', icon: 'refresh' }, 'Retry now') }, 'The sound room’s encoder is switched off on weekdays. Showing the last stream. Retrying automatically.'))
          : h(P.Stack, { gap: 'sm' }, h(P.Skeleton, { width: '200px', height: '16px' }), h(P.Skeleton, { width: '120px', height: '16px' }), h(P.Skeleton, { width: '240px', height: '16px' }));
    return h(P.Stack, { gap: 'sm' },
      h(P.SegmentedControl, { label: 'Preview state', size: 'sm', options: [{ value: 'live', label: 'Live' }, { value: 'idle', label: 'Idle' }, { value: 'error', label: 'Error' }, { value: 'loading', label: 'Loading' }], value: v, onChange: s[1] }),
      panel({ icon: 'audio', title: 'Livestream', description: 'The Divine Liturgy is streamed every Sunday', actions: optBtn() }, body));
  }

  /* 5.16 KPI tiles (engineering): a value or "–" with its reason; one banner when the tiles share a cause */
  function EngineeringKpis() {
    return h(P.Stack, { gap: 'md' },
      h(P.Banner, { tone: 'info', placement: 'pane', actions: h(P.Button, { size: 'sm', icon: 'refresh' }, 'Retry') }, 'Some GitHub project data is unavailable. Counts may be incomplete.'),
      h('div', { className: 'dss-kpis dss-kpis--four' },
        h(P.MetricCard, { icon: 'briefcase', title: 'Projects', value: '12', href: '#d-5.16', footer: 'Saved projects and connected repositories' }),
        h(P.MetricCard, { icon: 'circle-info', title: 'Open issues', href: '#d-5.16', status: { tone: 'active', icon: 'circle-info', label: 'GitHub data incomplete' } }),
        h(P.MetricCard, { icon: 'progress', title: 'In progress', href: '#d-5.16', status: { tone: 'active', icon: 'circle-info', label: 'GitHub data incomplete' } }),
        h(P.Card, { icon: 'code-blocks', title: 'Work environments', meta: 'Environments are per project' },
          h(P.Menu, { label: 'Projects', trigger: h(P.Button, { caret: true }, 'Choose project') }, h(P.MenuItem, null, 'plenix-platform'), h(P.MenuItem, null, 'st-john-test-site')))));
  }

  /* 5.17 Needs attention */
  var ATTN = [['Integration master plan: reuse Amux UI/runtime and approved solutions with GitHub as master', 'the-aiteam/aiteam #22'], ['Owner decision: make the Button’s style file smaller', 'plenix-ds/plenix-platform #746', '#711'],
    ['Owner decision: which parts become extras', 'plenix-ds/plenix-platform #745', '#707']];
  function AttentionMock() {
    return panel({ icon: 'warning', title: 'Needs attention', actions: actions(count(3, 'warning', '3 need attention'), allBtn('View all that needs attention', 'View all'), optBtn()) },
      h(P.ActivityList, { label: 'Needs attention', titleLines: 2, stacked: true }, ATTN.map(function (a) {
        return h(P.ActivityList.Item, { key: a[1], className: 'dss-reveal', leading: h(P.Icon, { name: 'warning' }), title: a[0], onOpen: function () {},
          meta: h(P.Inline, { gap: 'xs', wrap: true }, badge('action-required', 'flag', 'Decision', 'sm'), txt('data', a[1]), a[2] ? badge('neutral', 'snooze', 'Deferred', 'sm') : null, a[2] ? txt('data', a[2]) : null),
          actions: revealEnd(h(P.Icon, { name: 'chevron-right' }), h(P.Button, { size: 'xs' }, 'Review')) });
      })));
  }

  /* 5.18 Recent GitHub work: the row is the link */
  function GithubMock() {
    var W = [['Owner request: every app linked directly to the CDN so it updates when the CDN updates', 842], ['MenuBar: a File, Edit, View menu bar across the top of an app', 805], ['Owner request: a better way of testing for the future (research only)', 841]];
    return panel({ icon: 'git-pull-request', title: 'Recent GitHub work', actions: actions(allBtn('View the activity', 'View activity'), optBtn()) },
      h(P.ActivityList, { label: 'Recent GitHub work', titleLines: 2, stacked: true }, W.map(function (w) {
        return h(P.ActivityList.Item, { key: w[1], className: 'dss-reveal', leading: h(P.Icon, { name: 'circle-info' }), title: w[0], meta: h(P.Text, { variant: 'data' }, 'plenix-ds/plenix-platform #' + w[1]),
          href: 'https://github.com/plenix-ds/plenix-platform/issues/' + w[1], actions: h('span', { className: 'dss-row__actions' }, h(P.Icon, { name: 'open', label: 'Opens GitHub' })) });
      })));
  }

  /* 5.19 Agent runs: safeguards as statuses */
  function AgentsMock() {
    var row = function (icon, label, end) { return h(P.Inline, { key: label, gap: 'sm', justify: 'between' }, h(P.Inline, { gap: 'sm' }, h(P.Icon, { name: icon }), txt('body', label)), end); };
    return panel({ icon: 'sparkle', title: 'Agent runs', actions: actions(allBtn('Open agent runs', 'Open'), optBtn()) },
      h(P.Stack, { gap: 'sm' }, row('code', 'Developer execution', badge('neutral', 'stop', 'Off', 'sm')), row('checklist', 'Application tests', badge('neutral', 'stop', 'Off', 'sm')),
        row('lock', 'Protected runs and workers', cond('Counts need a data source'))));
  }

  /* ════════════════ the interactive foundations ════════════════ */

  /* 2.1 the grid explorer: the content width, the profile, the columns and the regions */
  function GridExplorer() {
    var w = useState(1100), g = useState('a'), width = w[0], prof = g[0];
    var by = width < 640 ? 4 : width < 960 ? 8 : width < 1440 ? 12 : 16, n = by, eff = width;
    if (prof !== 'b') { n = Math.min(by, 12); eff = Math.min(width, 1440); }
    var span = Math.max(3, Math.min(17, Math.round(eff / 100)));
    var boxes = [['Header', n, '']];
    if (n < 8) boxes.push(['Main work', n, 'lg'], ['Side', n, '']);
    else if (prof === 'c') { if (n < 12) boxes.push(['Main work', n, 'lg'], ['Side', n, '']); else boxes.push(['Main · 8 cols', 8, 'xl'], ['Side · 4 cols', 4, 'xl']); }
    else { var k = n >= 16 ? 4 : n >= 12 ? 3 : 2; for (var i = 0; i < k; i++) boxes.push(['Card', n / k, 'lg']); }
    var note = { a: 'Bounded: at most 12 columns, content held to 1440px.', b: 'Fluid: no cap, up to 16 columns on wide screens.', c: 'Rail: main region 8 of 12, side region 4 of 12, stacked below 960px.' }[prof];
    var colsArr = []; for (var c = 0; c < n; c++) colsArr.push(h('i', { key: c, className: 'dss-gx__col' }));
    return panel({ title: 'Grid explorer' }, h(P.Stack, { gap: 'sm' },
      h(P.Slider, { label: 'Content width', value: width, min: 320, max: 1700, step: 10, unit: ' px', onChange: w[1] }),
      h(P.SegmentedControl, { label: 'Layout profile', size: 'sm', options: [{ value: 'a', label: 'Bounded' }, { value: 'c', label: 'Rail' }, { value: 'b', label: 'Fluid' }], value: prof, onChange: g[1] }),
      h('div', { className: 'dss-gx' }, h('div', { className: 'dss-gx__frame', 'data-span': String(span) },
        h('div', { className: 'dss-gx__grid', 'data-cols': String(n), 'aria-hidden': 'true' }, colsArr),
        h('div', { className: 'dss-gx__grid', 'data-cols': String(n) }, boxes.map(function (b, i) { return h('div', { key: i, className: 'dss-gx__box', 'data-span': String(b[1]), 'data-h': b[2] || undefined }, txt('label', b[0])); })))),
      h(P.Text, { as: 'p', variant: 'secondary', 'aria-live': 'polite' }, n + ' columns at ' + width + 'px content width. ' + note)));
  }

  /* 3.1 the page header variants */
  var headerTools = function () { return h(P.Inline, { gap: 'sm', wrap: true }, h(P.Button, { icon: 'hdr-search' }, 'Search ', h(P.Kbd, null, 'Ctrl K')), h(P.Button, { icon: 'settings-customize' }, 'Customize')); };
  function HeaderVariants() {
    return h(Variants, { label: 'Page header variant', value: 'a', caption: 'Use A for a personal daily dashboard, B where a friendly landing is wanted, C for parish and engineering where scope and freshness matter.',
      options: [{ value: 'a', label: 'A · Date and counts' }, { value: 'b', label: 'B · Greeting and overview' }, { value: 'c', label: 'C · Page name and scope' }],
      render: function (v) {
        var left = v === 'a' ? h(P.Stack, { gap: 'none' }, h(P.Text, { as: 'p', variant: 'title' }, 'Saturday, October 31'), txt('secondary', '3 new notifications · 2 unread emails · 7 open tasks'))
          : v === 'b' ? h(P.Stack, { gap: 'none' }, txt('secondary', 'Good evening'), h(P.Text, { as: 'p', variant: 'title' }, 'Overview'), txt('secondary', 'Saturday, October 31 · Synced 2 min ago'))
            : h(P.Stack, { gap: 'none' }, h(P.Text, { as: 'p', variant: 'title' }, 'Personal workspace'), txt('secondary', 'Scope: all projects · Synced 2 min ago · Saturday, October 31'));
        return h('div', { className: 'dss-stage' }, h(P.Inline, { gap: 'md', justify: 'between', wrap: true }, left, headerTools()));
      } });
  }

  /* 3.2 the density preview: Plenix's display density on the Contacts list; the row height is measured */
  function DensityPreview() {
    var d = useState('standard'), m = useState('p'), rh = useState(null), box = useRef(null);
    useLayoutEffect(function () {
      var el = box.current && box.current.querySelector('li');
      rh[1](el ? Math.round(el.getBoundingClientRect().height) : null);
    }, [d[0], m[0]]);
    return panel({ title: 'Density preview' }, h(P.Stack, { gap: 'sm' },
      h(P.SegmentedControl, { label: 'Display density', size: 'sm', options: [{ value: 'compact', label: 'Compact' }, { value: 'standard', label: 'Standard' }, { value: 'comfortable', label: 'Comfortable' }], value: d[0], onChange: d[1] }),
      h(P.SegmentedControl, { label: 'Input mode', size: 'sm', options: [{ value: 'p', label: 'Pointer: hover or focus' }, { value: 't', label: 'Touch: visible actions' }], value: m[0], onChange: m[1] }),
      txt('secondary', 'Switches automatically on touch devices. Hover the rows in the pointer view.', 'p'),
      h('div', { 'data-plx-density': d[0], ref: box, className: 'dss-stage' }, contacts(m[0])),
      h(P.Text, { as: 'p', variant: 'secondary' }, 'Row height now: ', txt('data', rh[0] ? rh[0] + 'px' : '—'), '. The lists of the Platform follow the display density.')));
  }

  /* 4 Customize mode: the WidgetGrid, entered with Customize; size from the widget's menu; Saved and Undo; Reset */
  var LAYOUT = [{ id: 'todo', title: 'To do', icon: 'circle-check' }, { id: 'cal', title: 'Calendar', icon: 'calendar' }, { id: 'notif', title: 'Notifications', icon: 'hdr-bell' },
    { id: 'mail', title: 'Emails', icon: 'mail', span: '2' }, { id: 'con', title: 'Contacts', icon: 'settings-users' }, { id: 'proj', title: 'Projects', icon: 'briefcase', span: '2' }];
  function CustomizeDemo() {
    var e = useState(false), it = useState(LAYOUT), prev = useState(null), msg = useState(null), edit = e[0], items = it[0];
    var change = function (next, text) { prev[1](items); it[1](next); msg[1](text); P.announce && P.announce(text); };
    var size = function (w, s) { change(items.map(function (x) { return x.id === w.id ? Object.assign({}, x, { span: s }) : x; }), w.title + ' resized to ' + (s === '2' ? 'Standard' : 'Compact') + '.'); };
    return h('div', { className: 'dss-dnd' },
      h('div', { className: 'dss-dnd__bar' },
        h(P.Button, { icon: edit ? 'check' : 'settings-customize', variant: edit ? 'primary' : 'secondary', onClick: function () { e[1](!edit); msg[1](null); prev[1](null); } }, edit ? 'Done' : 'Customize'),
        edit ? h(P.Button, { variant: 'ghost', onClick: function () { change(LAYOUT, 'Layout reset.'); } }, 'Reset layout') : null,
        msg[0] ? badge('success', 'check', 'Saved') : null,
        txt('secondary', edit ? (msg[0] || 'Customizing. Changes save at once.') : 'Viewing. Handles and hints are hidden.'),
        edit && prev[0] ? h(P.Button, { variant: 'ghost', size: 'sm', icon: 'ed-undo', onClick: function () { var p = prev[0]; prev[1](items); it[1](p); msg[1]('Previous layout restored.'); } }, 'Undo') : null),
      h(P.WidgetGrid, { label: 'Dashboard', columns: 3, items: items,
        onReorder: edit ? function (ids) { change(ids.map(function (id) { return items.filter(function (x) { return x.id === id; })[0]; }), 'Moved.'); } : undefined,
        renderItem: function (w, handle) {
          return panel({ icon: w.icon, title: w.title, actions: edit ? actions(
            h(P.Menu, { label: 'Size of ' + w.title, placement: 'bottom-end', trigger: iconBtn('expand', 'Size of ' + w.title) },
              h(P.MenuItem, { type: 'radio', checked: w.span !== '2', onSelect: function () { size(w, '1'); } }, 'Compact (one column)'),
              h(P.MenuItem, { type: 'radio', checked: w.span === '2', onSelect: function () { size(w, '2'); } }, 'Standard (two columns)')), handle) : null }, lines());
        } }),
      txt('secondary', 'Reference behavior: choose Customize, then drag a handle, click a handle for its Move menu, or focus a handle and use the arrow keys; the size button sets Compact or Standard.', 'p'));
  }

  /* ════════════════ the page ════════════════ */

  var PRINCIPLES = [['P1', 'Hierarchy before styling', 'Every dashboard orders content by what needs action. Fix grid and hierarchy first, then card anatomy, then rows, icons and states.'],
    ['P2', 'Purpose decides the component', 'Metric, queue, agenda, feed, project row, presence list and status notice are distinct components. A bordered box with a title is not a component.'],
    ['P3', 'Role decides the template', 'Personal, parish and engineering dashboards share one shell, tokens and interaction rules, and differ in what comes first.'],
    ['P4', 'Trust in data', 'Every number states unit, scope, period and source freshness. Missing data is never shown as a value or as zero.'],
    ['P5', 'Every state is designed', 'Loading, empty, stale or partial, error, permission restricted and pending are specified for every widget. An error is never shown as empty.'],
    ['P6', 'One source of truth', 'An item shown in several places (notification, attention item, to-do row) links to one underlying entity.'],
    ['P7', 'Customization is a mode', 'Rearranging happens in an explicit Customize mode with a non-drag alternative, Undo and per-person storage.'],
    ['P8', 'Accessible by construction', 'WCAG 2.2 AA, keyboard completion of every task, visible focus, no information carried by color alone, reduced motion respected.'],
    ['P9', 'Platform tokens', 'Plenix DS owns color, type, radius, spacing and icons. This specification adds no parallel style system.'],
    ['P10', 'Samples are not requirements', 'Mockups use sample content. Conditional elements appear only when the data source provides them.']];

  // the original's reference values, each mapped to the Plenix token or component that replaces it
  var MAPPING = [
    ['Canvas #F4F6F9 (--bg)', '--plx-sys-surface-canvas; the mock stages use --plx-sys-surface-sunken'],
    ['Card surface #FFFFFF (--surface)', 'Panel and Card: --plx-sys-surface-default'],
    ['Second surface #EEF1F5 (--surface-2)', '--plx-sys-surface-sunken; row hover is the component’s own state role'],
    ['Lines #DFE3EA and #CBD1DB (--line, --line-2)', '--plx-sys-border-default and --plx-sys-border-strong (--plx-sys-border-subtle between dossiers)'],
    ['Ink #14171C, #444B57, #666E7C (--ink, --ink-2, --ink-3)', '--plx-sys-content-default, --plx-sys-content-muted, --plx-sys-content-subtle (Text body, secondary, caption)'],
    ['Accent #0F6CBD, its tint and ink (--brand, --brand-tint, --brand-ink)', 'The Plenix accent and action roles: --plx-sys-accent-surface, --plx-sys-accent-border, --plx-sys-accent-content; Button primary for the main action'],
    ['Success, warning, danger and their tints (--ok, --warn, --bad)', 'Badge tones success, waiting, negative (--plx-sys-status-pill-*); Notice and Banner tones (--plx-sys-feedback-*)'],
    ['Project colors orange, blue, green, violet, gray (--c-*)', 'Data colors brown, blue, green, purple, gray (--plx-sys-data-color-*) on ColorSwatch and EventChip; category colors on Tag'],
    ['Shadow (--shadow)', 'The components’ own elevation: --plx-sys-shadow-menu for menus, the WidgetGrid’s drag state'],
    ['Manrope, Public Sans, JetBrains Mono', 'DM Sans for UI text, Reddit Mono for data (Text variants title, display, body, secondary, data)'],
    ['Type: page title 24, card title 14 semibold, KPI value 32/40, row 14, metadata 12', 'Text title (20), Panel title, MetricCard value (size md 28, lg 36), Text body, Text secondary and data (12)'],
    ['Corners 8 to 14px; pills 999px', 'Corners 2 to 6px: --plx-sys-radius-card-4px and -6px, --plx-sys-radius-table-2px; Badge and Count pills at 4px'],
    ['Spacing 6, 10, 14, 18, 22px', 'The 4px grid: --plx-sys-space-* and --plx-ref-space-4px to -64px'],
    ['Row heights 48 / 40 and 44 / 36 (Standard and Dense profiles)', 'Plenix display density: Compact, Standard, Comfortable (data-plx-density); the list rows follow it'],
    ['Stroke icons, 16 and 20px, one SVG family', 'Icon from the Plenix set (Material Symbols Sharp, weight 300), sizes sm 16 and md 20'],
    ['Card (.mk) with header, body, footer', 'Panel (icon, title, description, actions, footer)'],
    ['Row (.rw), unread dot (.ud), type icon in a tinted circle (.ty)', 'ActivityList.Item (leading, title, meta, actions, unread); the type icon is a plain Icon'],
    ['Count chip (.cnt)', 'Count (pill), its word as the accessible name'],
    ['Status pill and tag (.pill, .tgc, .dchip, .stc)', 'Badge with its icon for a status; Tag with a category color for a category'],
    ['Buttons (.btn, .btn.pri, .btn.ghost) and the text link button (.lnk)', 'Button secondary, primary and ghost; “All” and “View all” are ghost Buttons with a chevron'],
    ['Icon button (.ib)', 'Button ghost iconOnly with its label (and tooltip)'],
    ['Segmented switch (.seg)', 'SegmentedControl'],
    ['Checkbox (.cb)', 'Checkbox'],
    ['Avatar (.av) with a presence dot (.ps)', 'Avatar; the presence is a Badge with its icon and word'],
    ['KPI card (.kpi) and meter (.meter)', 'MetricCard (value, change, status, progress) and ProgressBar'],
    ['Day leaf (.dleaf) and event bar (.ev .bar)', 'DateBadge and EventChip'],
    ['Inline notice (.inl), banner (.bnr), toast (.mk-toast), skeleton (.sk), empty (.empty)', 'Notice, Banner (placement pane), Toast with Undo (useUndo), Skeleton, EmptyState'],
    ['Move and size menu (.menu2), drag tiles (.dtile)', 'WidgetGrid (handle, Move menu, arrow keys, announcements) and Menu'],
    ['Tables (.tbl), key and value lists (.beh)', 'Table'],
    ['Keyboard key (.kbd), code (.code)', 'Kbd, CodeBlock'],
    ['The page’s own theme button', 'Plenix appearance: PlenixWorkspace.setMode (System, Light, Dark)']];

  var CHANGES = [
    ['Colors, type, radius, spacing and icons', 'Every reference value is replaced by its Plenix token or component (the table at the top).', 'Tokens only; no new colors'],
    ['Corners 8 to 14px on cards, panels, stages and the phone frame (20px)', 'Corners 4 or 6px; menus as the Menu draws them.', 'Corners 2 to 6px'],
    ['Pills with full round corners (999px)', 'Badge and Count pills with 4px corners.', 'Corners 2 to 6px'],
    ['Spacing of 6, 10, 14, 18 and 22px; row heights 48, 40, 44 and 36px', 'Spacing on the 4px grid; row heights from Plenix display density (Compact, Standard, Comfortable).', 'The 4px grid; Plenix density'],
    ['The type icon in a tinted circle (Notifications), in a warning-tinted square (Needs attention) and the header icon tile', 'A plain Icon before the text.', 'No icon in a box'],
    ['Unread, presence and live shown with a dot (.ud, .ps, .livedot); the project dot', 'Presence and live are Badges with an icon and a word. Unread uses the ActivityList’s own unread mark; the project color is a ColorSwatch.', 'Statuses are badges with an icon, never a dot'],
    ['Status and decision pills without icons (Default, Variant, Conditional, Open; Fast, Feast; Off; Next; 7 open; GitHub data incomplete)', 'Each is a Badge with its icon. Categories (Kitchen, Apex, Spain) are Tags with a category color, never a status tone.', 'Statuses are badges with an icon'],
    ['Text link buttons (“All”, “Inbox”, “View all”, “History”) and the object name in link color inside a notification', 'Ghost Buttons with a chevron; the object name is plain text (the row opens it).', 'No action links; Fluent buttons'],
    ['“+ 8 more · View all” as a text line', 'A ghost Button “8 more · View all” in the card footer.', 'No action links'],
    ['Red for “In a meeting”', 'Blue (active) Badge with the do-not-disturb icon; red stays for errors and overdue.', 'The original’s own rule: red is for errors and overdue'],
    ['Count chips with a word (“3 new”, “7 open”, “2 in”)', 'Count pills show the number; the word is their accessible name.', 'Count is the Platform’s count'],
    ['Customize: three sizes (Compact, Standard, Wide) and a corner grip to resize', 'WidgetGrid sizes are one or two columns: Compact and Standard from a size menu. Wide (three columns) and the corner grip are listed as a follow-up.', 'Platform components only'],
    ['Customize: Space picks up, arrows move, Enter drops, Escape cancels', 'WidgetGrid keys: Arrow Up and Down move the focused handle; Enter or Space opens the Move menu. Each move is announced.', 'Platform components only'],
    ['A custom time grid, now-line and week strip', 'The week and day strips are SegmentedControls; the events are EventChips on an hour grid drawn with tokens.', 'Platform components only'],
    ['Giving bars and their tooltips drawn by hand with raw heights', 'Bars on token heights with the Tooltip component; the A comparison is two ProgressBars on one baseline.', 'No inline styles'],
    ['Grid explorer width set with an inline style', 'The frame width steps in 100px units through a data attribute.', 'No inline styles'],
    ['The page’s own theme switch and dark palette', 'Plenix appearance (System, Light, Dark) and the theme’s dark roles.', 'Plenix’s theme switch'],
    ['Table header labels', 'Start-aligned, as the Table draws them.', 'Table header labels left-aligned'],
    ['Work environments drawn as a KPI tile with a button', 'A Card with a menu button (it is a launcher, not a metric).', 'Purpose decides the component (P2)'],
    ['Print, megaphone and video glyphs', 'The nearest Plenix icons: doc-text for Print bulletin, voice for Announcements, audio for Livestream.', 'Icons from the Plenix set']];

  var CONFIRM = [
    ['Roles for giving and visitors', 'Which roles may see giving totals and amounts, and visitor contact details.', 'Giving, Visitors, notifications', null],
    ['Role-shared layouts', 'Whether a layout can be published to a role, such as a parish default for staff.', 'Customize mode', null],
    ['Giving data', 'Whether October is month to date, and whether monthly values and a target exist.', 'Giving', null],
    ['Households', 'Whether to add a supporting figure or merge the count into Members.', 'Parish KPIs', null],
    ['Project fields', 'Whether status, owner, progress, milestone and last activity exist.', 'Projects',
      'Projects are demo data today (suite/shared.jsx). Status exists (active, paused, completed; archived in the badge map). Progress is computed as tasks done over all tasks, not stored. There is no owner, milestone or last-activity field. Open choice: suite projects, or real engineering work such as GitHub issues and projects.'],
    ['Mail connection', 'Which fields (preview, tag, attachment) and which write actions the connection supports.', 'Emails',
      'Email is demo data today, with no mail connection. It has a preview and an unread state, and a project name, the nearest thing to a tag. There is no label or attachment field. Reply, Archive and Mark read have no working action yet; the Gmail, Outlook and IMAP connectors are planned. Open choices: which mailbox, and whether the dashboard may act on mail or only show it.'],
    ['Agent runs', 'Which run figures (running, queued, last run) have a data source.', 'Agent runs',
      'AITEAM reports live runs per GitHub issue. There is no queue and no last run across all issues; those need new code. Plenix and St. John have no source. Open choice: what “agent run” means (AITEAM workloads, the team’s sessions, or CI runs).'],
    ['Plenix DS mapping', 'The accent and token names. Reference values on this page are replaced when mapped.', 'All widgets', 'This study maps them (the table at the top); the owner confirms the mapping.'],
    ['Header and Giving defaults', 'Header A for personal and C for parish and engineering; Giving B, with C only when a target exists. Stated as defaults here, pending confirmation.', 'Header, Giving', null],
    ['Density profiles', 'Standard 48 / 40 and Dense 44 / 36 are both specified. Confirm which applications use Dense.', 'Density', 'In this study the profiles are shown as Plenix display density (Compact, Standard, Comfortable).']];

  var SOURCES = [['Michelin design system: Principles of a dashboard', 'https://designsystem.michelin.com/data-visualization/design-guidelines/principles-of-a-dashboard'], ['IBM Carbon: Dashboards', 'https://carbondesignsystem.com/data-visualization/dashboards'],
    ['PatternFly: Dashboard design guidelines', 'https://patternfly.org/patterns/dashboard/design-guidelines'], ['Shopify Help: Shopify Home', 'https://help.shopify.com/en/manual/shopify-admin/shopify-home'],
    ['Shopify: Metrics card pattern', 'https://shopify.dev/docs/api/app-home/v1.0/patterns/compositions/metrics-card'], ['Polaris: Card guidelines', 'https://polaris.shopify.com/components/deprecated/legacy-card'],
    ['Stripe Support: Dashboard home charts', 'https://support.stripe.com/questions/customize-your-dashboard-home-page-charts-for-better-business-insights'], ['Stripe: Chart layout for Stripe Apps', 'https://docs.stripe.com/stripe-apps/patterns/chart-layout'],
    ['Notion Help: Dashboards view', 'https://www.notion.com/ar/help/dashboards'], ['Asana Help: Set up your ideal workspace', 'https://help.asana.com/s/article/set-up-your-ideal-workspace'],
    ['SaaSUI: Metric and KPI card UX patterns', 'https://www.saasui.design/blog/saas-metric-kpi-card-ux-patterns'], ['SaaSFrame: Dashboard design guide', 'https://www.saasframe.io/patterns/dashboard?fefca4bb_page=1'],
    ['Atlassian Design: Empty state', 'https://atlassian.design/components/empty-state/code'], ['Q2 Tecton: Designing for states', 'https://tecton.q2developer.com/patterns/designing-for-states/'],
    ['WCAG 2.5.7 Dragging Movements', 'https://tabnav.com/academy/wcag/success-criterion-2.5.7'], ['Accessible keyboard drag announcements', 'https://docs.rs/crate/dioxus-dnd/3.0.1/source/docs/concepts/accessibility.md'],
    ['Orbix: Bento grid dashboard design', 'https://www.orbix.studio/blogs/bento-grid-dashboard-design-aesthetics'], ['Dribbble: Dashboards collection (inspiration only)', 'https://dribbble.com/Jonanzing/collections/5590315-Dashboards']];

  // the widget dossiers, in the original's order and words
  var PERSONAL = [
    { n: '5.1', title: 'Notifications', mock: NotificationsMock, hint: 'click rows, Mark all read', decided: [['ad', 'Plain header icon'], ['ad', 'Dedupe']],
      info: ['A plain type icon before each row (no tinted circle); unread rows carry the unread mark and semibold text.', 'Sentence: actor, action, object.', 'Time: relative within a day, then clock time, then date. Newest first.', 'Groups: New, Yesterday, Earlier.', 'Duplicates collapse to one line with a pointer (“Also in Emails”).', 'Count in an info (blue) Count pill, never red.'],
      behavior: [['Hover or focus a row', 'Time is replaced by Mark read and Open.'], ['Click a row', 'Opens the target and marks it read.'], ['Mark all read', 'Clears every unread mark in the defined scope. Undo for 5 seconds.'], ['New item arrives', 'A “1 new” pill. The list never moves under the pointer or focus.'], ['Keyboard', 'Up and Down move, Enter opens, Space toggles read.']],
      states: 'Empty (“All caught up”), no matches, loading and sync failed are different states. A badge counts one defined scope. Sensitive previews follow role checks. Mobile: urgent and actionable items first, the rest behind View all.' },
    { n: '5.2', title: 'To do', mock: TodoMock, hint: 'tick a task', decided: [['dn', 'Conditional project color']],
      info: ['Checkbox first, then title, then due date at the end.', 'Groups: Overdue, Due soon, Later. Overdue items stay on the list.', 'Priority: a flag for High only. Medium and Low carry no marker.', 'Due text such as “Sun, Mar 8”. Inside 3 days a waiting Badge with the clock; after, a negative Badge with the word “Overdue”.', 'Count in a neutral Count pill (“7 open”).', 'A project color appears only when tasks are linked to projects.'],
      behavior: [['Tick the checkbox', 'Strikes through, moves to Completed, Undo toast.'], ['Hover or focus', 'Date is replaced by Change date and More.'], ['Click the title', 'Opens the task in a side panel, keeping scope.'], ['Checkbox, menu, date', 'Separate click targets.'], ['Keyboard', 'Space toggles, Enter opens.']],
      states: 'Empty: “Nothing due”, with Add task. “All done” differs from “no match”. Overdue is judged in the workspace time zone. A failed completion restores the row. Recurring tasks create the next occurrence by explicit rules. Mobile: next actions first; project and date wrap beneath.' },
    { n: '5.3', title: 'Emails', mock: EmailsMock, wide: true, hint: 'click rows, hover', decided: [['dn', 'Conditional preview, tag, attachment']],
      info: ['Avatar, sender, subject and a one-line preview.', 'Project tag and attachment marker at the end, beside the time.', 'Unread: the unread mark and semibold text.', 'Header: envelope icon, unread Count, Inbox button.'],
      behavior: [['Hover or focus', 'Time is replaced by Archive and Mark read. Without write access only Open shows.'], ['Click a row', 'Opens the thread in a reading pane.'], ['Mark read', 'The unread mark clears and the count updates.'], ['Touch', 'Actions stay visible or sit in a row menu.']],
      states: 'Empty: “Inbox zero”, which differs from a disconnected provider. Sync errors keep cached sender and subject with a timestamp. Message bodies never appear in shared dashboard views. Mobile: sender, subject and time only.' },
    { n: '5.4', title: 'Calendar', mock: CalendarMock, hint: 'switch variant', decided: [['ad', 'Default A'], ['va', 'Variants B, C']],
      info: ['Default A: day strip, then an agenda with a time column and an EventChip in the project color. A now-line and a Next badge.', 'Color equals project color (a data color).', 'Past events are dimmed. The next event carries “Next · in 45 min”.', 'Time zone is visible when it differs from the viewer’s.'],
      variants: 'A strip and agenda (default). B date header and agenda: full date, Today and arrows, most room for events. C week strip and timeline. Use B in a narrow card, A or C when expanded.',
      behavior: [['Click ‹ › or a day', 'Switches the agenda. Today returns.'], ['Click an event', 'Detail popover: time, calendar, place or join link if present.'], ['Empty day', '“Nothing scheduled” and Add event.'], ['Time passes', 'The now-line moves each minute and the Next badge updates.']],
      states: 'Loading: three skeleton rows. Error: cached events stay, with source and time. All-day, multi-day, cancelled and overlapping events have explicit rules. Mobile: date-grouped agenda; details open in a full-screen sheet. The now-line is fixed at 1:15 PM here for illustration.' },
    { n: '5.5', title: 'Notes', mock: NotesMock, hint: 'use the filter',
      info: ['Sorted by last edited, newest first.', 'Title, category Tag in the category color, date at the end.', 'Filter options built from the categories in use.', 'Plain document icon at the start.'],
      behavior: [['Choose a filter', 'Filters in place. Remembered per person.'], ['Click a row', 'Opens the note.'], ['Hover 500ms', 'Shows the first two lines (conditional).'], ['+ in the header', 'Creates a note in the active category.']],
      states: 'Empty filter: “No notes in Spain” and New note. Offline edits show pending sync. A conflict never overwrites another author. Mobile: three recent notes and quick capture.' },
    { n: '5.6', title: 'Projects', mock: ProjectsMock, wide: true, hint: 'tiles, rows, adaptive', decided: [['va', 'Variants'], ['dn', 'Conditional fields']],
      info: ['Tiles: fill the row, two-line name, type Tag, notes count, the project color as a ColorSwatch.', 'Rows: one line per project with its ColorSwatch. Health, milestone and owner appear when those fields exist.', 'Adaptive: tiles for 4 or fewer projects, rows beyond that, also by card width.', 'Purple replaces red for Tax & Finances.', 'A ProgressBar appears only when a denominator exists.'],
      variants: 'Tiles, Rows or Adaptive. All three are approved; choose by project count and available metadata.',
      behavior: [['Click a card or row', 'Opens the project. The whole element is one target.'], ['Hover', 'The card shows its hover state; the ⋯ menu offers Rename, Color, Archive.'], ['Keyboard', 'Tab to an item, Enter opens.'], ['Narrow screens', 'Tiles become rows.']],
      states: 'Empty: “Create your first project”. Partial permissions: only authorized projects show, and hidden counts are not leaked. Stale health shows last-updated time and owner.' },
    { n: '5.7', title: 'Contacts', mock: ContactsMock, hint: 'hover a row', decided: [['va', 'Pointer and touch']],
      info: ['Avatar and name. A second line (role) only where the data exists.', 'Pointer: Message and Call appear on hover or focus.', 'Touch: one visible primary action and an overflow menu on every row.', 'Only channels that exist and are permitted are shown.'],
      variants: 'Pointer (hover or focus) and Touch (visible actions) are one component in two input modes.',
      behavior: [['Hover or focus', 'Message and Call appear at the end.'], ['Click the row', 'Opens a contact sheet with labeled Message, Email and Call.'], ['Touch device', 'The touch layout applies automatically.'], ['Arrow keys', 'Move between rows.']],
      states: 'Empty: “No contacts yet” and Import. Unknown presence is not offline. Phone numbers follow permissions. Mobile: top favorites plus search.' }];
  var PARISH = [
    { n: '5.8', title: 'KPI cards', mock: ParishKpis, wide: true, decided: [['ad', 'Reflow on phone'], ['op', 'Households: open']],
      info: ['Anatomy (MetricCard): title with icon, the value, one support line, an optional ProgressBar.', 'Members: “381” and “↑ 26 joined since 2024”. Name the baseline date and define “active”.', 'Households: a supporting figure, or merged into Members.', 'Servants: “18 of 25 slots filled · next 8 days”, a 72% ProgressBar, “7 open”.', 'Units such as “active” and “households” belong in the title.'],
      behavior: [['Click the card', 'Opens the filtered list with the same scope.'], ['Hover or focus', 'The card shows its hover state; the title is the link.'], ['Hover the change', 'Tooltip states the window. New members and net growth are different numbers.'], ['Click “7 open”', 'Opens only the unfilled slots.'], ['Data changes', 'Counts up for 300ms with no layout shift.']],
      states: 'Loading: skeleton. Error: “–” and Retry, never a zero. Zero required slots reads “not scheduled”. Restricted users see only authorized aggregates. Growth history is never inferred from the current count. Mobile: tiles reflow into one block.' },
    { n: '5.9', title: 'Page header and quick actions', mock: ParishHeader, wide: true,
      info: ['One action row in the header: “Record a gift” primary; Print bulletin, Email the parish and Announcements as ghost Buttons with icons; Customize secondary.', 'Subtitle is the date only. Header variant C (page name and scope).', 'No standing instruction text. Customizing help belongs to Customize mode.', 'Narrow: the ghost actions collapse into “More actions”.'],
      behavior: [['Record a gift', 'Opens the form in a side panel. Closing returns focus to the button.'], ['Hover a ghost button', 'Its hover fill and a tooltip with its shortcut.'], ['Customize', 'Enters Customize mode and becomes Done.'], ['Below 900px', 'Actions collapse into a menu.']],
      states: 'A disabled action stays visible with a tooltip naming the missing permission. Finance actions follow roles.' },
    { n: '5.10', title: 'Services and feasts', mock: ServicesMock,
      info: ['DateBadge with the day’s events beside it, in chronological order.', 'Two lines per event: name, then time and place.', 'Today: the DateBadge’s today look and a Today Badge.', 'Feasts and fasts use the same row anatomy with a countdown in days. Badges: Fast waiting, Season neutral, Feast active, Patron feast active with a star.', 'Follows the parish’s configured calendar tradition and time zone.'],
      behavior: [['Click a service', 'Opens details with location, recurrence and volunteer links.'], ['Click a feast', 'Opens the calendar on that date.'], ['Hover a countdown', 'Shows the weekday.'], ['Midnight', '“This week” rolls forward.']],
      states: 'If today is empty, show the next scheduled service. An imported-calendar failure keeps cached events with source and time. Mobile: date-grouped agenda; services and feasts as tabs when narrow.' },
    { n: '5.11', title: 'Today’s tasks', mock: TodayMock, hint: 'tick a task',
      info: ['Sorted by urgency: gaps and deadlines first.', 'A waiting Badge on the line at risk (“Nobody signed up yet”).', 'Time-boxed tasks take the waiting Badge one hour before.'],
      behavior: [['Tick a task', 'Same as To do, with Undo.'], ['Click “Nobody signed up yet”', 'Opens the unfilled sound-desk slot.'], ['Time passes', '“by 10:00 AM” takes the waiting Badge before the deadline.']],
      states: 'All done: “Nothing left for today”. Uncovered roles from the servants view surface here.' },
    { n: '5.12', title: 'Visitors to welcome', mock: VisitorsMock, hint: 'hover a visitor',
      info: ['Name, district and follow-up status. Email only on hover or in the record.', 'States: unassigned, assigned, contacted, follow-up due.', 'Avatar rows.'],
      behavior: [['Hover a visitor', 'Email appears. The row opens the visit record.'], ['Assign host', 'Opens a reviewable draft. Consent and role rules apply.'], ['Complete follow-up', 'Records who acted and when.']],
      states: 'Contact details follow role checks and retention policy. Empty: “No visitors to welcome”. Mobile: names and status first; contact actions in the record.' },
    { n: '5.13', title: 'Giving', mock: GivingMock, hint: 'switch A, B, C; hover bars', decided: [['ad', 'Default B'], ['va', 'Variants A, C']],
      info: ['A: headline amount with “↑ 3% vs September” and two bars on one zero baseline.', 'B: “+$6,487 (+2.6%)” with the dates compared and paired bars.', 'C: actual against target, shown only when a target exists.', 'Year: total, then monthly columns with month letters and the current month highlighted. Months without data are hatched.', 'One card, one divider. “Updated this morning” as a footer line.'],
      variants: 'A, B or C. Default B; C only with a target.',
      behavior: [['Hover or focus a bar', 'Tooltip with month and amount.'], ['Click a bar', 'Opens that month in History with the same filters.'], ['Click the change', 'Explains the calculation and the dates compared.'], ['Period and fund filters', 'Change the metric and chart together. The chart also exists as a table.']],
      states: 'The comparison window is always stated. A zero prior period gives no percentage. “No transactions”, “pending reconciliation” and “stale import” are separate states. Error keeps the last value with “as of”. Gross, net, refunds and restricted funds are labeled.' },
    { n: '5.14', title: 'In the office', mock: OfficeMock, hint: 'hover a row',
      info: ['Name and role on two lines, the status as a Badge with its icon and word.', 'Badges: In the office success (check), In a meeting active (do not disturb), Away waiting (clock), Not in today neutral.', 'Sorted: in the office, in a meeting, away, out.', '“As of” time from the source (conditional).', 'Header count: “2 in”.'],
      behavior: [['Hover or focus', 'Message and Call appear.'], ['Click a row', 'Opens the person’s card.'], ['Status changes', 'The Badge changes in place. The row re-sorts on refresh, never under the pointer.'], ['Expired status', 'Shows “unconfirmed”, not offline.']],
      states: 'Unknown is not offline. Only the person or an administrator changes a status. Location is never inferred from activity. Error: hide badges, keep names.' },
    { n: '5.15', title: 'Livestream', mock: LivestreamMock, hint: 'switch states',
      info: ['Default state: a neutral Offline Badge with “Next stream: Sunday, 8:00 AM”.', 'Live: a Live now Badge with its icon, viewer count, Open stream.', 'Error: one inline Notice; last values stay; automatic retry with back-off; Retry now is secondary.', 'Loading: Skeleton on first load only.', 'Live viewers are distinct from replay views.'],
      behavior: [['Page opens', 'Status is fetched.'], ['Fetch fails', 'Last values stay. The notice appears after the second failure.'], ['Retry now', 'Spinner, then the notice updates in place.'], ['Stream starts', 'Card flips to Live without a reload.'], ['Screen reader', 'The notice is announced once.']],
      states: 'Offline is neutral. “Unable to check” is uncertain, not offline. An encoder fault during a scheduled stream is a true incident. Mobile: one status, the next time, and Watch or replay.' }];
  var ENGINEERING = [
    { n: '5.16', title: 'KPI tiles', mock: EngineeringKpis, wide: true,
      info: ['A value or “–”, never a word. The dash carries a reason Badge.', 'One Banner with Retry when several tiles share the cause.', 'The whole tile is the link. No button.', 'Work environments is a project picker (a Card with a menu), not a metric.', 'A cached count shows its timestamp and coverage.'],
      behavior: [['Click a tile', 'Opens that list. A tile showing “–” still opens, with coverage explained.'], ['Retry in the banner', 'Re-fetches only the failed sources.'], ['Choose project', 'Searchable menu. Picking one opens its environments.'], ['Hover', 'The card shows its hover state.']],
      states: 'Loading, verified zero, stale cached and unavailable are separate. Missing data never becomes zero. Mobile: a compact status row when unavailable.' },
    { n: '5.17', title: 'Needs attention', mock: AttentionMock, hint: 'hover a row',
      info: ['Title clamped to two lines.', 'Meta line: a Decision Badge, repo and number (the data font for identifiers), and a Deferred Badge with its issue number.', 'Groups: Decisions needed, Blocked, Overdue. Deferred items stay out of the urgent view until due.', 'Header count “3” in a warning Count pill.'],
      behavior: [['Hover or focus', 'A Review button replaces the chevron.'], ['Click a row', 'Opens the decision in an inspector with the source link.'], ['Dismiss', 'Hides a notification, not the underlying issue.'], ['View all', 'Opens the full list with the same scope.']],
      states: 'If coverage is incomplete, the card says “Known items” and never claims a complete count. Empty: “Nothing needs a decision”. Mobile: promoted above secondary statistics; shows reason and due date.' },
    { n: '5.18', title: 'Recent GitHub work', mock: GithubMock, hint: 'hover a row',
      info: ['The row is the link, with an open icon on hover.', 'Title on two lines; repo and number as meta.', 'An icon per item type where known.', 'Time (“2 h ago”) (conditional).', 'Repeated events on one item are grouped.'],
      behavior: [['Click a row', 'Opens GitHub in a new tab.'], ['Hover', 'The row’s hover state and the open icon.'], ['View activity', 'Opens a filtered log: Assigned to me, Followed, All permitted.'], ['Keyboard', 'Enter opens, Up and Down move.']],
      states: 'No activity differs from disconnected GitHub. A connection failure leaves the last known activity with a timestamp. Deleted or inaccessible items have a safe fallback. Mobile: three recent events.' },
    { n: '5.19', title: 'Agent runs', mock: AgentsMock,
      info: ['Safeguards as status: Developer execution Off, Application tests Off (neutral Badges with the stop icon).', 'Run summary (running, queued, last run) only with a data source.', 'The whole card is the link, plus a header button. The description sits in a tooltip.', 'Queued, running, awaiting approval, succeeded, failed and cancelled are distinct.'],
      behavior: [['Click the card', 'Opens agent runs. Never starts compute.'], ['Hover an Off badge', 'Explains what Off means and who can change it.'], ['A run is active', 'The header shows a Running Badge and a count.'], ['Approve, retry, cancel', 'Separate authorized workflows that show scope and consequences.']],
      states: 'Disabled is not failed. Controls a user cannot run are hidden, with the capability explained. Mobile: pending approvals first; logs open on their own page.' }];

  var NAV = [['mapping', 'Mapping to Plenix'], ['principles', '01 Principles'], ['layout', '02 Layout'], ['system', '03 Foundations'], ['customize', '04 Customize mode'], ['widgets', '05 Widgets'],
    ['templates', '06 Templates'], ['standards', '07 Data and states'], ['a11y', '08 Accessibility'], ['build', '09 Implementation'], ['open', '10 Items to confirm'], ['sources', '11 Sources'], ['changes', 'Changes from the original']];

  /* the strips of the three layout profiles */
  var strip = function (n, w, cap) {
    var cells = []; for (var i = 0; i < n; i++) cells.push(h('i', { key: i }));
    return h(React.Fragment, null, h('div', { className: 'dss-strip', 'data-cols': String(n), 'data-w': String(w), 'aria-hidden': 'true' }, cells), txt('caption', cap, 'p'));
  };
  var box = function (title, hgt, kpi, linesN) {
    var l = []; for (var i = 0; i < (linesN || 0); i++) l.push(h('i', { key: i, className: 'dss-line', 'data-w': ['80', '70', '60'][i % 3] }));
    return h('div', { className: 'dss-box' + (kpi ? ' dss-box--kpi' : ''), 'data-h': hgt }, txt('label', title), l);
  };
  var hatch = function (hgt) { return h('div', { className: 'dss-hatch', 'data-h': hgt, title: 'Unused space' }); };
  var wf = function (cls, span, hgt, title, sub) { return h('div', { className: 'dss-wf__cell' + (cls ? ' dss-wf__cell--' + cls : ''), 'data-span': span, 'data-h': hgt }, txt('label', title), sub ? txt('caption', sub) : null); };
  var template = function (title, header, kpis, main, side, note) {
    return panel({ title: title }, h(P.Stack, { gap: 'sm' },
      h('div', { className: 'dss-wf' }, wf('header', '12', null, header), kpis.map(function (k) { return h(React.Fragment, { key: k }, wf('kpi', '4', null, k)); })),
      h('div', { className: 'dss-wf' },
        h('div', { className: 'dss-wf__col', 'data-span': '8' }, main.map(function (m) { return h(React.Fragment, { key: m[0] }, wf(null, null, m[1], m[0])); })),
        h('div', { className: 'dss-wf__col', 'data-span': '4' }, side.map(function (m) { return h(React.Fragment, { key: m[0] }, wf(null, null, m[1], m[0])); }))),
      txt('secondary', note, 'p')));
  };

  function Appearance() {
    var W = window.PlenixWorkspace, s = useState(function () { try { return (W && W.mode && W.mode()) || 'system'; } catch (e) { return 'system'; } });
    return h(P.SegmentedControl, { label: 'Appearance', size: 'sm', options: [{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }], value: s[0],
      onChange: function (v) { s[1](v); if (W && W.setMode) W.setMode(v); } });
  }

  function Page() {
    return h('div', { className: 'dss-page' },
      h('nav', { className: 'dss-nav', 'aria-label': 'Sections' },
        h(P.Stack, { gap: 'none' }, txt('strong', 'Dashboard design system'), txt('secondary', 'Specification 1.0 · Nov 1, 2026 · on Plenix')),
        h(P.Anchor, { label: 'On this page', items: NAV.map(function (n) { return n[0] === 'widgets' ? { id: n[0], label: n[1], children: [{ id: 'd-5.1', label: 'Personal' }, { id: 'd-5.8', label: 'Parish office' }, { id: 'd-5.16', label: 'Engineering' }] } : { id: n[0], label: n[1] }; }) }),
        h(Appearance)),
      h('main', { className: 'dss-main' },
        h('header', { className: 'dss-top' },
          txt('eyebrow', 'Dashboard design system · Specification 1.0 · Plenix study'),
          h(P.Text, { as: 'h1', variant: 'display' }, 'Dashboard design system'),
          h(P.Text, { as: 'p', variant: 'lead' }, 'The canonical specification for personal, parish-office and engineering dashboards: layout, foundations, customization, every widget, data states and implementation. Mockups are interactive and use sample content.'),
          para('This page is the owner’s specification of November 1, 2026, rebuilt on the Plenix Platform: the same content and the same mockups, drawn with Plenix components and tokens. Where the original conflicts with a Plenix rule, Plenix wins and the change is listed at the end. The original is kept unchanged: ', 'dss-prose'),
          h(P.Link, { href: 'original/Dashboard_Design_System_Specification.html', variant: 'standalone' }, 'The original specification')),
        h('section', { className: 'dss-section', id: 'mapping', 'aria-labelledby': 'mapping-h' },
          txt('eyebrow', 'Mapping'),
          h(P.Text, { as: 'h2', variant: 'title', id: 'mapping-h' }, 'The original’s reference values in Plenix'),
          para('The original states reference values until they are mapped to Plenix. Each one maps to a Plenix token or component.', 'dss-prose'),
          table('Mapping to Plenix', ['Original reference value', 'Plenix token or component'], MAPPING)),

        h(Section, { id: 'principles', eyebrow: '01 / Principles', title: 'Principles', lead: 'Ten principles govern every dashboard. “Must” and “never” are requirements. “Should” is the default that needs a reason to depart from.' },
          table('Principles', ['ID', 'Principle', 'Standard'], PRINCIPLES),
          h('div', { className: 'dss-key' }, h(P.Tag, null, 'Sample content'), txt('secondary', 'mockups use sample data'), cond(), txt('secondary', 'element appears only when its data exists'),
            chip('va', 'Variant'), txt('secondary', 'an approved alternative'), chip('ad', 'Default'), txt('secondary', 'the standard unless a variant is named'))),

        h(Section, { id: 'layout', eyebrow: '02 / Layout', title: 'Layout' },
          h3('2.1 Container grid'),
          para('The grid measures the content region, not the viewport, because the application shell has navigation. Columns follow the container: 4 below 640px, 8 from 640, 12 from 960, 16 from 1440. A profile sets a column cap, a maximum width and optional regions. Three profiles cover every dashboard; the same grid serves all of them.', 'dss-prose'),
          cols(3, [
            panel({ key: 'b', title: 'Bounded' }, h('div', { className: 'dss-vz' }, strip(12, 100, '1440 and wider: 12 columns, held at 1440px'), strip(12, 80, '960 to 1439: 12 columns'), strip(8, 50, '640 to 959: 8 columns'), strip(4, 30, 'Below 640: 4 columns'))),
            panel({ key: 'f', title: 'Fluid' }, h('div', { className: 'dss-vz' }, strip(16, 100, '1440 and wider: 16 columns, no cap'), strip(12, 80, '960 to 1439: 12 columns'), strip(8, 50, '640 to 959: 8 columns'), strip(4, 30, 'Below 640: 4 columns'))),
            panel({ key: 'r', title: 'Rail' }, h('div', { className: 'dss-vz' }, strip(12, 100, '12 columns: main 8, side 4'), strip(12, 80, '960 to 1439: main 8, side 4'), strip(8, 50, 'Below 960: regions stack'), strip(4, 30, 'Below 640: one stream')))]),
          h(GridExplorer),
          cols(2, [
            panel({ key: 'bp', title: 'Container breakpoints' }, table('Container breakpoints', ['Container width', 'Columns'], [['Below 640', '4 columns, one stream, in priority order.'], ['640 to 959', '8 columns.'], ['960 to 1439', '12 columns.'], ['1440 and wider', '16 columns in Fluid. Bounded stops at 12 columns and holds the page at 1440px.']])),
            panel({ key: 'pr', title: 'Profiles as configuration' }, h(P.Stack, { gap: 'sm' },
              h(P.CodeBlock, { language: 'text', label: 'Profiles' }, 'Bounded   columns: by container, max 12    maxWidth: 1440   regions: [full]\nFluid     columns: by container, up to 16  maxWidth: none   regions: [full]\nRail      columns: by container, max 12    maxWidth: 1440   regions: [main 8, side 4]  (stacks below 960)'),
              txt('secondary', 'Container queries drive the column count. DOM order always equals reading order. The profile shape is illustrative; field names follow Plenix DS conventions once defined.', 'p')))]),
          h3('2.2 Row layout modes'),
          para('Structured hybrid is the default. The other two are approved variants. Each application’s specification names its mode.', 'dss-prose'),
          cols(3, [
            panel({ key: 's', title: 'Structured hybrid', actions: chip('ad', 'Default') }, h(P.Stack, { gap: 'sm' }, h('div', { className: 'dss-vz' },
              h('div', { className: 'dss-boxes' }, box('KPI', null, true), box('KPI', null, true), box('KPI', null, true)),
              h('div', { className: 'dss-boxes dss-boxes--main-side' }, h('div', { className: 'dss-boxes__col' }, box('To do', 'md', false, 3), box('Notes', 'sm', false, 2)), h('div', { className: 'dss-boxes__col' }, box('Calendar', 'md', false, 2), box('Contacts', 'md', false, 2))),
              txt('caption', 'KPI cards share one height. Main and side regions stack independently.', 'p')),
            para([txt('strong', 'Use for ', 'span', { key: 'u' }), 'operational dashboards with a KPI strip above queues: parish office, engineering, and any dashboard that mixes summary figures with lists.']))),
            panel({ key: 'e', title: 'Equal-height grid', actions: chip('va', 'Variant') }, h(P.Stack, { gap: 'sm' }, h('div', { className: 'dss-vz' },
              h('div', { className: 'dss-boxes' }, h('div', { className: 'dss-box', 'data-h': 'xl' }, txt('label', 'Notifications'), h('i', { className: 'dss-line', 'data-w': '80' }), h('i', { className: 'dss-line', 'data-w': '70' }), hatch('sm')),
                box('Calendar', 'xl', false, 6), h('div', { className: 'dss-box', 'data-h': 'xl' }, txt('label', 'Contacts'), h('i', { className: 'dss-line', 'data-w': '70' }), hatch('md'))),
              txt('caption', 'Every card in a row is as tall as the tallest. Short cards show unused space (hatched).', 'p')),
            para([txt('strong', 'Use for ', 'span', { key: 'u' }), 'overview boards whose cards carry similar weight: finance summaries, project tiles, wall displays.']))),
            panel({ key: 'i', title: 'Independent stacks', actions: chip('va', 'Variant') }, h(P.Stack, { gap: 'sm' }, h('div', { className: 'dss-vz' },
              h('div', { className: 'dss-boxes dss-boxes--two' }, h('div', { className: 'dss-boxes__col' }, box('To do', 'lg', false, 4), box('Notes', 'sm', false, 2)), h('div', { className: 'dss-boxes__col' }, box('Calendar', 'sm', false, 2), box('Emails', 'md', false, 3), box('Contacts', null, false, 1))),
              txt('caption', 'Each column stacks cards at their natural height. Bottoms are ragged, with no filler.', 'p')),
            para([txt('strong', 'Use for ', 'span', { key: 'u' }), 'work dashboards whose lists have very different lengths: personal dashboard, notes and mail views.'])))]),
          h3('2.3 Page structure and tiers'),
          cols(2, [
            panel({ key: 'w', title: 'Page structure' }, h('div', { className: 'dss-wf' }, wf('header', '12', null, 'Page header', 'Variant A, B or C. Counts as a summary line.'), wf('alert', '12', null, 'Conditional strip: data problem or context', 'One banner when several tiles share one cause'),
              wf('kpi', '4', null, 'KPI'), wf('kpi', '4', null, 'KPI'), wf('kpi', '4', null, 'KPI'), wf(null, '8', 'lg', 'Attention: work to act on', 'Main region'), wf(null, '4', 'lg', 'Performance and time-sensitive', 'Side region'), wf(null, '12', null, 'Exploration: reference cards', 'Projects, notes, contacts'))),
            panel({ key: 't', title: 'Information tiers' }, bullets([
              [txt('strong', 'Attention: ', 'span', { key: 'a' }), 'overdue items, failures, approvals, urgent gaps. Must be actionable without searching.'],
              [txt('strong', 'Performance: ', 'span', { key: 'a' }), 'metrics with period and comparison. Scope is explicit.'],
              [txt('strong', 'Exploration: ', 'span', { key: 'a' }), 'recent work, notes, contacts, history.'],
              'Role templates reorder the tiers: parish coverage first for the parish office, blockers first for engineering, finance KPIs first for finance.',
              'Every widget declares its role, source, period, permissions, action, size and destination view.'], 'Information tiers'))]),
          h3('2.4 Sizes and limits'),
          table('Sizes and limits', ['Topic', 'Standard'], [['Widths', 'Compact, Standard and Wide. A widget’s minimum width is set by its content, not by the grid.'], ['Lists', 'A card previews 3 to 6 rows, then “View all (N)”. Nested scrolling is avoided.'],
            ['Metrics', 'Compact tiles of about 112 to 144px.'], ['Guideline', '4 cards per row and 12 per page by default. A warning, not a block.'], ['Mobile', 'One ordered column in priority order. Essential KPIs reflow into a block and never scroll sideways.']])),

        h(Section, { id: 'system', eyebrow: '03 / Foundations', title: 'Foundations' },
          h3('3.1 Page header'),
          para('Three approved variants. Counts appear in the header summary in every variant. A primary action is optional and is not part of the default header.', 'dss-prose'),
          h(HeaderVariants),
          h3('3.2 Density'),
          cols(2, [h(DensityPreview, { key: 'd' }),
            panel({ key: 'r', title: 'Rules' }, bullets(['Standard profile (default): the Plenix Standard density.', 'Dense profile: the Plenix Compact density, for power-user desktop lists such as engineering queues. The original’s 48 / 40 and 44 / 36 row heights are the reference; Plenix’s density steps replace them.', 'Density changes padding and metadata, never hierarchy or permissions.', 'Hit areas are at least 44px on touch at every density.'], 'Density rules'))]),
          h3('3.3 Type, color, icons, tokens'),
          table('Type, color, icons, tokens', ['Topic', 'Standard (in Plenix)'], [
            ['Tokens', 'Plenix DS owns color, type, radius, spacing and icons. The original’s reference values are mapped to Plenix tokens (the table at the top). A dashboard token is added only for a semantic need that no existing token covers.'],
            ['Accent', 'The Plenix accent and action roles (--plx-sys-accent-*, Button primary) replace the reference accent #0F6CBD.'],
            ['Type', 'Page title Text title, card title the Panel title, KPI value the MetricCard value, row text Text body, metadata Text secondary or data (never below 12). Tabular figures for counts, money and times. Reddit Mono for technical values.'],
            ['Surface', 'Canvas, then default-surface cards with a 1px border and 4 or 6px corners. Elevation only for a dragged item, menus and dialogs.'],
            ['Header', 'Title at the start, one relevant action at the end, overflow menu only for real settings. A plain 16px icon, no tile. Subtitle only when it adds scope, such as “Next 8 days”.'],
            ['Counts', 'A neutral or info Count pill. Red is reserved for errors and overdue.'],
            ['Icons', 'The Plenix icon set (Material Symbols Sharp, weight 300). 16px inline, 20px for page-level actions. One glyph per concept. Icon-only buttons have accessible names.'],
            ['Status', 'A Badge with its icon and a word. Never color alone, never a dot. Project colors never reuse status red.'],
            ['Rows', 'Whole row or tile is the target. Actions appear on hover or focus and replace the timestamp. They stay visible on touch.'],
            ['Motion', 'Minimal feedback only: a drop settling, a toast. Nothing animates for decoration. All motion stops under reduced motion (the Plenix motion tokens).']]),
          h3('3.4 Date, time and language'),
          bullets(['12-hour clock by default. Dates follow the locale.', 'Right-to-left layout and Arabic are supported on every dashboard. Long Arabic and English strings must not break the grid.', 'Lists are sorted. Time is relative within a day (“5 min”), then clock time, then date. Overdue is a visible state.', 'Time zone is explicit wherever events or deadlines are shown.'], 'Date, time and language')),

        h(Section, { id: 'customize', eyebrow: '04 / Customize mode', title: 'Customize mode', lead: 'Customizing is a page-level mode. View mode shows no handles and no instruction text. Every change saves at once and can be undone.' },
          h('div', { className: 'dss-stage' }, h(CustomizeDemo)),
          cols(2, [
            panel({ key: 'i', title: 'Interaction' }, table('Interaction', ['Step', 'Standard'], [
              ['Enter', 'One Customize button in the page header. It becomes Done. Handles and the size button appear only now.'],
              ['Move: menu', 'A click on a widget’s handle opens its Move menu (Move earlier, Move later, Move to the start, Move to the end); the size button sets the width. This is the single-pointer alternative to dragging (WCAG 2.2 SC 2.5.7).'],
              ['Move: drag', 'Drag from the handle only. The dragged widget fades and the widget under the pointer shows the drop ring. On touch, press and hold the handle for 300ms to lift.'],
              ['Move: keyboard', 'On a focused handle, Arrow Up moves earlier and Arrow Down later; Enter or Space opens the Move menu. A live region announces “Calendar, position 2 of 6”. Focus stays on the handle.'],
              ['Resize', 'The size button sets Compact (one column) or Standard (two columns).'],
              ['Save', 'Autosave on every change. “Saved” and Undo appear. Reset to default is always available and reversible.']])),
            panel({ key: 'r', title: 'Rules' }, bullets([
              [txt('strong', 'Limits: ', 'span', { key: 'a' }), 'default guideline of 4 cards per row and 12 per page. A warning, not a block.'],
              [txt('strong', 'Storage: ', 'span', { key: 'a' }), 'region, size and order with a revision number, per person and per dashboard. Never raw x and y.'],
              [txt('strong', 'Hide is not delete: ', 'span', { key: 'a' }), 'hiding a card removes it from the page, not its records. Critical notices cannot be hidden.'],
              [txt('strong', 'Conflicts: ', 'span', { key: 'a' }), 'if two sessions edit one layout, alert and merge or reload. Never overwrite silently.'],
              [txt('strong', 'Mobile: ', 'span', { key: 'a' }), 'one ordered column. The Move menu moves cards; long-press drag is optional.'],
              [txt('strong', 'Defaults: ', 'span', { key: 'a' }), 'role-aware defaults may exist. Layout changes never bypass permissions.']], 'Customize rules'))])),

        h(Section, { id: 'widgets', eyebrow: '05 / Widgets', title: 'Widgets', lead: 'Each widget is specified by its information, its behavior, and its states. Mockups are interactive. Where a widget has approved variants, a switch above it shows each one.' },
          h(P.Text, { as: 'h3', variant: 'title', className: 'dss-group-title' }, 'Personal dashboard'),
          PERSONAL.map(function (d) { return h(Dossier, Object.assign({ key: d.n }, d)); }),
          h(P.Text, { as: 'h3', variant: 'title', className: 'dss-group-title' }, 'Parish office'),
          PARISH.map(function (d) { return h(Dossier, Object.assign({ key: d.n }, d)); }),
          h(P.Text, { as: 'h3', variant: 'title', className: 'dss-group-title' }, 'Engineering'),
          ENGINEERING.map(function (d) { return h(Dossier, Object.assign({ key: d.n }, d)); })),

        h(Section, { id: 'templates', eyebrow: '06 / Templates', title: 'Dashboard templates', lead: 'Structured hybrid on the container grid: an equal-height KPI strip, then a main region of 8 columns and a side region of 4 that stack independently at 12 columns.' },
          cols(3, [
            h(React.Fragment, { key: 'p' }, template('Personal', 'Header A · counts as summary', ['Due soon', 'Unread', 'Active projects'], [['To do', 'xl'], ['Emails', 'md'], ['Projects', 'sm']], [['Calendar', 'md'], ['Notifications', 'md'], ['Contacts', 'sm'], ['Notes', 'sm']], 'Projects switch between tiles and rows by count.')),
            h(React.Fragment, { key: 'o' }, template('Parish office', 'Header C · Customize · Record a gift', ['Members', 'Households', 'Servants 18 / 25'], [['Today’s tasks', 'md'], ['Services and feasts', 'xl'], ['Giving', '2xl']], [['In the office', 'lg'], ['Livestream', 'md'], ['Visitors to welcome', 'md'], ['Notifications', 'md']], 'Visitors are a separate card from tasks.')),
            h(React.Fragment, { key: 'e' }, template('Engineering', 'Header C · scope and synced time · banner when data is partial', ['Projects', 'Open issues', 'In progress'], [['Needs attention', '2xl'], ['Recent GitHub work', 'lg']], [['Agent runs', 'md'], ['Work environments: project picker', 'sm']], 'Work environments is a launcher, not a KPI.'))])),

        h(Section, { id: 'standards', eyebrow: '07 / Data, states and permissions', title: 'Data, states and permissions' },
          h3('7.1 Six states'),
          table('Six states', ['State', 'Standard', 'In Plenix'], [
            ['Loading', 'A skeleton that matches the final shape. No fake zeros. No indefinite spinner.', 'Skeleton; MetricCard state "loading"'],
            ['Empty', 'Says what is empty and offers the next step. Distinguishes “no data” from “no match for this filter” and from “not permitted”.', 'EmptyState (inline), with one action'],
            ['Stale or partial', 'Keeps the last good data. Shows source, coverage and last successful update. Never mixes missing sources with current ones.', 'MetricCard state "stale"; a Banner (placement pane) for a shared cause'],
            ['Error', 'A local explanation, what remains trustworthy, and Retry. Diagnostic codes sit behind Details. Never shown as empty.', 'Notice or RetryNotice; EmptyState tone "error"'],
            ['Permission restricted', 'No sensitive previews, aggregates or hidden-record counts. Offers access only where the product supports it.', 'EmptyState kind "permission-denied"'],
            ['Pending', 'Immediate local feedback for reversible changes, then confirmation. Roll back and explain if the server rejects it.', 'Toast with Undo (useUndo); Button loading']]),
          h3('7.2 Behavior standards'),
          table('Behavior standards', ['Topic', 'Standard'], [
            ['Zero and missing', 'A zero denominator is “not scheduled”, never 100%. Missing data never becomes zero. Verified zero, stale value and unavailable look different.'],
            ['One entity', 'An item shown as a notification, an attention item and a to-do row links to one entity and one source of truth. Duplicates collapse to one line with a pointer such as “Also in Emails”.'],
            ['Drill-in', 'Opening a KPI, task, project or chart keeps the current scope, filters and period. Back returns to the dashboard with scroll position and filters preserved.'],
            ['Click targets', 'Checkbox, menu and contact actions are separate from row navigation. A row never triggers a nested action.'],
            ['Refresh', 'Background updates never steal focus, move the page, or reorder the focused row. New items arrive as a “1 new” pill. Each source shows “synced X ago”.'],
            ['Presence', 'Status has a source and a time. Unknown is not offline. An expired status becomes “unconfirmed”.'],
            ['Authorization', 'Role checks apply to source queries, aggregates, previews, exports and actions, not only to what is drawn. A widget saved in a layout never bypasses permissions.'],
            ['Concurrency', 'Two sessions editing one layout produce an alert and a merge or reload, never a silent overwrite.'],
            ['Evidence', 'A chart never invents a series from a total. Chart data also exists as a table.']])),

        h(Section, { id: 'a11y', eyebrow: '08 / Accessibility and language', title: 'Accessibility and language' },
          table('Accessibility and language', ['Topic', 'Standard'], [
            ['Conformance', 'WCAG 2.2 level AA: contrast, visible focus, accessible names, text alternatives for charts, reduced motion.'],
            ['Dragging', 'Everything done by dragging has a single-pointer way that does not drag (SC 2.5.7) and a keyboard way. These are separate requirements.'],
            ['Keyboard', 'Every task completes by keyboard. Focus order follows reading order. Focus returns to the trigger after a dialog or a move.'],
            ['Touch', 'Hit areas at least 44px. Hover actions have a visible touch equivalent.'],
            ['Screen readers', 'Moves, saves and errors are announced once, not repeatedly. Icon-only buttons have specific names.'],
            ['Color', 'Status never relies on color alone. Test in grayscale and high contrast.'],
            ['Language', 'Right-to-left, long Arabic and English strings, locale dates, 12-hour clock.'],
            ['Test widths', '320, 375, 768, 1024, 1440 and ultrawide. 200% zoom. Lists of 100 or more rows. Long names.']])),

        h(Section, { id: 'build', eyebrow: '09 / Implementation', title: 'Implementation' },
          h3('9.1 Sequence'),
          cols(3, [
            panel({ key: '1', title: 'Phase 1 · Meaning and standards' }, bullets(['Inventory widgets, sources, periods and permissions.', 'Map Plenix DS tokens, icons and header anatomy.', 'Fix layout mode and profile per application.', 'Define states for each data source.'], 'Phase 1')),
            panel({ key: '2', title: 'Phase 2 · Grid and primitives' }, bullets(['Container grid and region model.', 'Card frame, row, KPI, queue, agenda, state notice.', 'Source adapters with timestamp and coverage.', 'Layout engine with Customize, Undo and storage.'], 'Phase 2')),
            panel({ key: '3', title: 'Phase 3 · Widgets and roles' }, bullets(['High-value widgets: tasks, agenda, notifications, projects.', 'Parish and engineering widgets.', 'Role templates built on the primitives.', 'Tests across widths, languages and roles.'], 'Phase 3'))]),
          h3('9.2 Widget dossier format'),
          para('Every widget is specified with the same sections: Information and presentation, Behavior, States, permissions and mobile, Variants.', 'dss-prose'),
          h3('9.3 Definition of done'),
          bullets(['Each metric names unit, scope, period and drill-in. Unavailable and zero never look the same.', 'Each widget has loading, empty, error, stale, permission and pending behavior where it applies.', 'Keyboard and touch can do the same things. Every drag has a clickable alternative.',
            'No hover-only essential information. No truncated critical text without a way to read it.', 'Role checks apply to queries, counts, previews and actions.', 'Persistence survives refresh. A failed save never claims success.', 'No chart is filled with invented data.', 'Icons come from the one shared Icon component (the Plenix icon set).'], 'Definition of done'),
          h3('9.4 Validation scenarios'),
          table('Validation scenarios', ['Scenario', 'Measure'], [
            ['An engineer identifies a blocked decision and opens its source.', 'Time, wrong turns, whether urgency and incomplete coverage are understood.'],
            ['A parish administrator fills the next unstaffed service slot.', 'Correct service and role, conflict awareness, successful assignment.'],
            ['A personal user completes a task, joins an event and finds a collaborator.', 'Completion without accidental navigation, date comprehension, correct channel.'],
            ['A finance user compares giving periods and drills to transactions.', 'Correct reading of period, amount and currency, and access limits.'],
            ['Keyboard and touch users move Calendar ahead of Notes.', 'Successful non-drag rearrangement, focus continuity, understanding of saved state.']])),

        h(Section, { id: 'open', eyebrow: '10 / Items to confirm', title: 'Items to confirm before implementation', lead: 'These depend on data, roles or platform decisions that the specification cannot settle. Every item stays open until the owner confirms it.' },
          table('Items to confirm', ['Item', 'What is needed', 'Affects', 'Status', 'Today in Plenix'], CONFIRM.map(function (c) { return [c[0], c[1], c[2], badge('action-required', 'flag', 'To confirm', 'sm'), c[3] || '—']; }), [null, null, null, '--plx-ref-size-30u'])),

        h(Section, { id: 'sources', eyebrow: '11 / Sources', title: 'Sources' },
          h3('Internal design studies'),
          bullets([[txt('strong', 'Claude: ', 'span', { key: 'a' }), 'Dashboard Redesign Study, Dashboard Studies Compared, Dashboard Decision Workbook (Nov 1, 2026)'], [txt('strong', 'ChatGPT: ', 'span', { key: 'a' }), 'Dashboard Systems: Enterprise UX Audit and Redesign Study; cross-review and owner selections (Nov 1, 2026)'],
            [txt('strong', 'Perplexity: ', 'span', { key: 'a' }), 'Dashboard redesign study: enterprise patterns, card specifications and prototype; consolidated review and Round 2 selections (Nov 1, 2026)']], 'Internal design studies'),
          h3('External references'),
          h('div', { className: 'dss-sources' }, h(P.List, { variant: 'bullets', label: 'External references', items: SOURCES.map(function (s) { return { children: h(P.Link, { href: s[1], external: true }, s[0]) }; }) })),
          txt('secondary', 'Dribbble is inspiration only and is not usability evidence. Where a reference describes a product pattern, this specification adopts the pattern, not the product’s appearance.', 'p')),

        h('section', { className: 'dss-section', id: 'changes', 'aria-labelledby': 'changes-h' },
          txt('eyebrow', 'Changes'),
          h(P.Text, { as: 'h2', variant: 'title', id: 'changes-h' }, 'Changes from the original'),
          para('Where the original conflicts with a Plenix rule, this page follows Plenix. Nothing else is dropped: every section, mock, rule and open item of the original is here.', 'dss-prose'),
          table('Changes from the original', ['In the original', 'In this study', 'Plenix rule'], CHANGES))));
  }

  ReactDOM.createRoot(document.getElementById('root')).render(h(P.ToastProvider, null, h(Page)));
})();
