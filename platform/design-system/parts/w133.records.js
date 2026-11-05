/* Plenix · MediaCard's five token-backed shapes. Extend the existing record. */
DSParts.records.push(function (H) {
  var record = H.record('media-card'), h = H.h, P = H.P, shapes = ['4/3', '1/1', '16/9', '9/16', '3/4'];
  if (!record) return [];
  function card(shape) { return h(P.MediaCard, { key: shape, aspect: shape, icon: 'image-b', title: shape + ' media', meta: 'JPG' }); }
  record.examples.push(['Portrait and landscape', shapes.map(function (shape) { return [shape + ' shape', function () { return H.box(240, card(shape)); }, null, 'aspect="' + shape + '"']; })]);
  record.examples.push(['Mixed shapes', function () { return H.box(800, h(P.ContentGrid, { size: 'sm', label: 'Mixed media shapes' }, shapes.map(card))); }]);
  return [];
});
