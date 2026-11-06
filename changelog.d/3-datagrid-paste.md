### Added

- DataGrid: `editing.paste` turns on Ctrl+V of a copied block (#3, ADR 0021, part 2): tab-separated rows as Excel and Google Sheets write them, landing at the active cell or the selected block, through each column's editor rules and `validate`, stopping at the edge. Each cell reaches `onCellEdit` once with `source: "paste"`; the pasted and skipped counts are announced; with `editing.undo` a paste is one undo step. Off by default. New words: cells pasted, skipped and not saved (Arabic to follow from the i18n Engineer).
