### Added

- `DataGridColumn.description` (plain text, in the app's language): what the column means. It is the header's Tooltip (on hover over the title and on the keyboard focus of the header, even when the title is not cut) and the header's accessible description (`aria-describedby`, not part of its name). A column without one is unchanged; no icon is added to the header (ADR 0025, #924).
