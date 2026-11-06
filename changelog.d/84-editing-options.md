### Added

- DataGrid (ADR 0016, #84 F4): the `editing` options `enterEdits` (`false`: Enter does not start an edit; F2 and a double click still do), `typeToReplace` (`false`: a typed character does not start an edit) and `rangeSelect` (`true`: dragging or Shift with the arrows selects a block of cells, the `cellSelection` option by its ADR name). The `editing` options can also come from `TableSettings`; the table's own win. Unset, nothing changes.
