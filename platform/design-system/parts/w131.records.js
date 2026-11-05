/* Plenix · required single-choice quick filter; extend the existing record. */
DSParts.records.push(function (H) {
  var record = H.record('quick-filter'), h = H.h, P = H.P;
  if (!record) return [];
  function Required() {
    var fields = [{ value: 'status', label: 'Status', kind: 'select', options: ['Draft', 'Published'] }];
    var view = P.useCollectionView(fields, { quick: { status: { kind: 'single', required: true } } });
    return h(P.QuickFilter, Object.assign({ label: 'Status', options: fields[0].options, inline: true }, view.quickProps('status')));
  }
  record.examples.push(['Required', [['Required single choice', function () { return H.box(320, h(Required)); }, null, 'kind="single" required']]]);
  return [];
});
