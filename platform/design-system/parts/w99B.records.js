/* Plenix · DataGrid: collection persistence, row commands and mixed-direction records. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, record = H.record("data-grid");
  if (!record) return [];
  var Demo = function () {
    var fields = [{ value: "name", label: "Name" }], rows = [{ id: 1, name: "Quarterly report" }, { id: 2, name: "تقرير سنوي" }];
    var v = P.useCollectionView(fields, { storageKey: "ds.dt-high", text: function (r) { return r.name; }, sort: [{ field: "name", dir: "asc" }] });
    var selected = React.useState([]), info = React.useState({ count: 0, hidden: 0 }), message = React.useState("");
    return h(P.Stack, { gap: "sm" },
      h(P.CommandBar, { label: "Reports", find: h(P.CommandBarSearch, Object.assign({ placeholder: "Search reports" }, v.searchProps)),
        view: h(P.ViewMenu, v.viewProps), selection: Object.assign({}, info[0], { onClear: function () { selected[1]([]); info[1]({ count: 0, hidden: 0 }); } }) }),
      h(P.DataGrid, Object.assign({ label: "Reports", data: rows, columns: [{ title: "Name", field: "name" }], selectable: true, selected: selected[0],
        rowMenu: [{ label: "Open", icon: "open", action: function (r) { message[1]("Opened " + r.name); } }],
        onSelectionChange: function (keys, state) { selected[1](keys); info[1](state); } }, v.tableProps)),
      h(P.Text, { as: "p", role: "status" }, message[0]));
  };
  record.examples.push(["Remembered collection and row actions", Demo]);
  return [];
});
