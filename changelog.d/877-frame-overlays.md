### Fixed

- AppShell `frame="centered"`: a Drawer opens from the frame's edge, not the window's, and the toasts stay inside the frame; the Dialog is unchanged and every backdrop still covers the whole window. The Drawer layer and the toast region read the frame's width from `--plx-comp-shell-context-frame-width`, set on the page root while a centered frame is shown (#877, D-0093).

### Added

- `data-plx-frame="centered"` on `<html>` while a centered frame is shown (ADR 0023 addendum).
