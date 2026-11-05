/* Plenix · DataGridEngine query-flag trial. Existing records and default examples stay intact. */
DSParts.records.push(function (H) {
  if (typeof location === 'undefined' || new URLSearchParams(location.search).get('engine') !== 'next') return [];
  var record = H.record('data-grid'), P = H.P, h = H.h;
  if (!record || !P.DataGridEngine) return [];
  var rows = Array.from({ length: 600 }, function (_, i) { return { id: i, name: 'Person ' + String(i).padStart(4, '0'), team: i % 2 ? 'Design' : 'Engineering', count: 600 - i }; });
  var columns = [{ title: 'Name', field: 'name', kind: 'name', width: '--plx-ref-size-240px' }, { title: 'Team', field: 'team', width: '--plx-ref-size-160px', filter: 'list' }, { title: 'Count', field: 'count', kind: 'data', type: 'number', sorter: 'number', width: '--plx-ref-size-160px' }];
  function table(Component, label) { return h(Component, { label: label, data: rows, columns: columns, selectable: true, height: '--plx-ref-size-400px', narrow: 'table' }); }
  record.examples.push(['TanStack core trial', [
    ['Current engine', function () { return table(P.DataGrid, 'Current engine'); }],
    ['TanStack engine', function () { return table(P.DataGridEngine, 'TanStack engine'); }]
  ]]);
  return [];
});
