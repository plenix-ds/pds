### Changed
- SettingsLayout's navigation is a docked SecondaryPane (flush beside the main nav, full height, titled "Settings", collapsible and resizable, remembered per page); new props `navTitle`, `pane`, `strings` (#1242).
- Navigation panes keep one width at every window size: the main nav and a secondary pane are 240px (`secondary-pane-width-md` 220 to 240, `shell-nav-min-width` 140 to 200); the arrow keys on a resize edge move 8px. Enter or a double-click on a pane's edge returns it to 240px instead of collapsing it; Collapse is the pane's button and Ctrl+[. The side panel keeps its window steps, only outside the centered frame (#1243).

### Deprecated
- The tokens `shell-nav-width-from-wide`, `shell-nav-width-from-ultrawide` and `secondary-pane-width-{sm,md,lg}-from-{wide,ultrawide}` and the classes `plx-settings__nav` and `plx-settings__frame`; removed in 2.0.0.
