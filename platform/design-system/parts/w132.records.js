/* Plenix · CommandBar folding: quick filters and an opted-in end control. */
DSParts.records.push(function (H) {
  var record = H.record('command-bar'), h = H.h, P = H.P;
  if (!record) return [];
  function Narrow() {
    var fields = [{ value: 'status', label: 'Status', kind: 'select', options: ['Draft', 'Published'] }];
    var view = P.useCollectionView(fields, { quick: { status: { kind: 'single', required: true } } });
    return h(P.CommandBar, { label: 'Posts', find: h(P.CommandBarSearch, Object.assign({ placeholder: 'Search posts' }, view.searchProps)),
      actions: [{ label: 'Refresh', icon: 'refresh', onSelect: H.noop }, { label: 'Archive', icon: 'archive', onSelect: H.noop }],
      quickFilters: [Object.assign({ label: 'Status', icon: 'filter', options: fields[0].options }, view.quickProps('status'))] });
  }
  record.examples.push(['Narrow folding', [['Quick filters in More', function () { return H.box(128, h(Narrow)); }, null, 'quickFilters={[{ kind: "single", required: true, ... }]}']]]);
  return [];
});
