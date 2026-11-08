### Added

- `LoadingState` (new export): a region's loading state, a ring and a label ("Loading cases…") centred in the region, shown only after about a second so a fast load shows nothing. It is a status region from the start (announced once, when the label appears), keeps the region's least height, shows a `ProgressBar` with the label when `progress` is known, and the ring stands still with reduced motion. Props `label`, `progress`, `delay`, `size` (default `"lg"`), `labelPosition` (`"after"` by default, or `"below"`) and `strings`; only the outermost one draws. `Spinner` takes `labelPosition` (`"hidden"` by default) and `delay`. New tokens `motion-loading-region-delay` and `spinner-label-*`.
- `DataGrid` and `ListingPage` take `loading`: with no rows to show, the grid draws the loading state in its placeholder row (ADR 0042, D-0130, #1032).

### Changed

- `EntityTitle loading`, `MetricCard state="loading"` and the `DataGrid` remote loading rows draw the loading state (a ring after a delay) instead of skeleton bars or bare text. `Skeleton` stays exported, opt-in only: no Plenix component, pattern or template uses it by default (a new check-system rule enforces it).
- The spinner's arc is `feedback-info-solid`, so it reads at least 3:1 on the dark surface (it was 2.04:1).

### Fixed

- The `LoadingOverlay` message tokens point at system tokens, not references.
