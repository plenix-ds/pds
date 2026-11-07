### Added

- `Field` takes `span` (`1 | 2 | 3 | "full"`): the columns it takes as a direct child of a grid (`Columns`). The default is `"full"` for a Field whose control is a `Textarea` or a `RichTextEditor`, otherwise `1`. A spanning Field lets its control fill it, so the single-line fields' 600px cap no longer shortens a Textarea; set `span={1}` to keep it in one column (ADR 0029, #947).

### Fixed

- A `Textarea` in a multi-column form now spans the row: it ends exactly at the inline end of the last column instead of stopping at 600px.
