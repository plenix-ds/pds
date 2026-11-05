/* Plenix · BulkActions deprecation. w98B is a loader-compatible name (wBLK is rejected by the shared loader). */
DSParts.records.push(function (H) {
  var record = H.record('bulk-action-bar');
  if (record) {
    record.text = "Deprecated for one release. Use CommandBar's selection state instead.";
    record.avoid = (record.avoid || []).concat(["Do not add new BulkActions bars; use CommandBar's selection state."]);
    record.related = Array.from(new Set((record.related || []).concat(['command-bar'])));
  }
  return [];
});
