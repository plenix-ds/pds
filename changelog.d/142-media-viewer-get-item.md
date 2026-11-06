### Added

- MediaViewer takes `count` and `getItem(index)` for long lists (#142, ADR 0020). It builds only the shown item and its previous and next, once each per open, instead of the whole `items` array. `items` works as before.
