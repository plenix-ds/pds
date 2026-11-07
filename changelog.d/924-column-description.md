### Added

- **DataGrid column `description`** (RedSave P-70, #924, ADR 0025): a short plain-text explanation of a column. It shows as the header's tooltip on hover and keyboard focus, and the header's `aria-describedby` points at it, so a screen reader reads it after the title. A column without one is unchanged.
