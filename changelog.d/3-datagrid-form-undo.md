### Changed

- DataGrid: with `editing.undo`, a saved row form (Form Edit) is one undo step (#3, ADR 0021, part 4). Without `onRecordEdit` the changed fields reach `onCellEdit` once each in one step. With it, the save, the undo and the redo all use `onRecordEdit(record, changes, { source })`: the undo passes the same fields at their earlier values with `source: "undo"`, the redo the saved values with `source: "redo"`, and the save passes `source: "edit"`. `info` is optional, so existing handlers see nothing new. Nothing changes without the option.
