### Added
- `Text` takes `overflow="dialog"` (with `lines` or `truncate`) and `overflowLabel`: while the text is cut, a small button at the inline end opens the whole text in a Dialog titled with the label. `PropertyList.Item` takes `lines` (2 to 4) and `overflow` (`"dialog"` by default with `lines`) and does the same for a read-only value. New words `text.fullText`, `text.fullTextOf`, `text.fullTextTitle` (#1122).

### Changed
- One measure of "is this text cut" (`isCut`) now serves `Text`'s Show more, the DataGrid cell's full-text tooltip and the new button. No behaviour change (#1122).
