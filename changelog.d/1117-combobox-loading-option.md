### Fixed

- `Combobox` (and `CountrySelect`, which uses it): while its options load, the open list shows its loading row as a disabled option, so the listbox is never left without an option (axe aria-required-children, #1117).
