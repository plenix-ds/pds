/* Plenix design system · part w16A: the SplitView and ReadingPane demo (owner, 2026-10-16: the Outlook-style layout, two
   panels side by side or stacked, with a divider between), drawn on the Secondary pane page. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, use = H.use, q = H.q;
  var ITEMS = ['Kitchen render, second round', 'Invoice 2026-114', 'Brand kit: new logo files', 'Site walkthrough notes', 'Floor plan comments', 'Hero banner sizes']
    .map(function (s, i) { return { id: i + 1, from: ['Maya Chen', 'Omar Haddad', 'Sofia Rossi', 'Liam Walsh', 'Ana Souza', 'Kenji Mori'][i], subject: s, received: '2026-10-' + String(16 - i).padStart(2, '0') }; });
  var COLS = [{ title: 'From', field: 'from', kind: 'name' }, { title: 'Subject', field: 'subject' }, { title: 'Received', field: 'received', kind: 'data' }];
  // a split view in a frame of a set height (the demo's room; on a page it fills the multi-pane main area)
  var Demo = function (props) {
    var o = use(1);
    var item = ITEMS.filter(function (x) { return x.id === o[0]; })[0];
    return h('div', { className: 'ds-demo-frame ds-demo-frame--fill ' + DS.sampleClass('block-size', H.W(500)) }, h(P.SplitView, { label: 'Inbox', firstLabel: 'Message list', orientation: props.orientation, defaultSize: props.orientation === 'stacked' ? 200 : 400,
      first: h(P.DataGrid, { label: 'Inbox', data: ITEMS, columns: COLS, mode: 'fill', narrow: 'table', viewMenu: false, selectable: true, selected: [o[0]], onSelectionChange: function (k) { if (k.length === 1) o[1](k[0]); }, onRowClick: function (record) { o[1](record.id);  } }),
      second: h(P.ReadingPane, { label: item ? item.subject : 'Nothing selected', actions: h(P.Toolbar, { label: 'Message actions' }, h(P.Button, { size: 'sm', icon: 'reply' }, 'Reply'), h(P.Button, { size: 'sm', icon: 'forward' }, 'Forward'), h(P.Button, { size: 'sm', variant: 'ghost', icon: 'archive' }, 'Archive')),
        empty: h(P.EmptyState, { icon: 'mail', title: 'Select an item to read' }) },
        item ? h(P.Stack, { gap: 'md' }, h(P.Text, { as: 'h3', variant: 'title' }, item.subject), h(P.Inline, { gap: 'sm' }, h(P.Persona, { name: item.from, size: 'sm' }), h(P.Text, { variant: 'data' }, item.received)), h(P.Text, { as: 'p' }, 'Thanks for the update. I looked through the files and added a few notes for the next round.')) : null) }));
  };
  // SplitView is drawn on the Secondary pane page (inventory.js)
  H.addExamples('secondary-pane', [
        ['Orientation', [
          ['Side by side (default)', function () { return h(Demo, { orientation: 'side-by-side' }); }, 'plx-split-view--side-by-side', 'orientation=' + q('side-by-side'), { full: true }],
          ['Stacked', function () { return h(Demo, { orientation: 'stacked' }); }, 'plx-split-view--stacked', 'orientation=' + q('stacked'), { full: true }]], { prop: 'orientation' }]]);
  return [];
});
