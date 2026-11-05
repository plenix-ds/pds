### Added

- DataGrid: a column's `validate(value, record)` (ADR 0016, #84 phase 1). It may return a message, or a promise of one. A message keeps the cell open: the editor is `aria-invalid`, the message shows under the cell (linked by `aria-describedby`, announced) and nothing is saved; `null` saves as before. Columns without `validate` behave as before.
