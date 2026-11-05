/* Plenix · lane 201: collection state documentation. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P;
  function Example() {
    var fields = [{ value: 'name', label: 'Name', kind: 'text' }, { value: 'kind', label: 'Kind', kind: 'select', options: [{ value: 'note', label: 'Note' }, { value: 'file', label: 'File' }] }];
    var rows = [{ id: 1, name: 'Meeting notes', kind: 'note' }, { id: 2, name: 'Project brief', kind: 'file' }];
    var view = P.useCollectionView(fields, { data: rows, text: function (row) { return row.name; }, quick: { kind: 'list' } });
    return h(P.Stack, null,
      h(P.CommandBar, { label: 'Collection', find: h(P.CommandBarSearch, Object.assign({ placeholder: 'Search records' }, view.searchProps)), view: h(P.ViewMenu, view.viewProps) }),
      h(P.DataGrid, Object.assign({ label: 'Records', data: rows, columns: [{ field: 'name', title: 'Name' }, { field: 'kind', title: 'Kind' }] }, view.tableProps)));
  }
  return [{ id: 'use-collection-view', title: 'Collection view state', leaf: 'Collection view state', sec: 'interaction', sub: 'Behavioral utilities',
    icon: 'table', plenix: 'useCollectionView', src: 'hooks/useCollectionView.ts', css: [], level: 'Utility', interaction: 'Utility',
    text: 'One state owner for collection search, filters, sorting, grouping, columns and presentation. Connect its panel props and tableProps to the same collection.',
    use: ['A command bar and DataGrid that share collection state', 'Facet counts from options.data, or rows reported through tableProps.onReady'],
    avoid: ['Separate state for each panel and the table', 'Expecting counts before rows are supplied'],
    related: ['command-bar', 'data-grid'], map: [['Apple HIG', 'Collections', 'Partial'], ['Material 3', 'Collection and states', 'Partial']],
    examples: [['Search and table state', function () { return h(Example); }], ['Options and returned props', function () { return h(P.CodeBlock, { language: 'javascript' }, 'const view = useCollectionView(fields, {\n  text: row => row.name, quick: { kind: "list" },\n  columns: { order: ["name", "kind"], hidden: [] },\n  sort: [{ field: "name", dir: "asc" }],\n  view: { layout: "list", size: "m", height: "short" },\n  storageKey: "records", data: rows, today: "2026-10-20"\n});\n// searchProps -> CommandBarSearch; filterProps -> FilterPanel\n// quickProps(key) -> QuickFilter (counts exclude its own selection)\n// sortProps -> SortPanel; groupProps -> GroupPanel\n// columnsProps -> ColumnsMenu; viewProps -> ViewMenu\n// tableProps -> DataGrid; reset() clears saved collection state'); }]] }];
});
