### Added

- `PagePanes` (and the type `PagePanesProps`): the wrapper of a `SecondaryPane` and the content beside it. It renders `<div class="plx-page-panes">` and takes div attributes; there is no layout change (ADR 0040, D-0126, #998).

### Deprecated

- Writing the `plx-page-panes` class by hand. Use `PagePanes`; the class becomes internal in 2.0.0.
