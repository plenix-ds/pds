### Added

- AppShell: a `frame` prop, `"full"` (default, as before) or `"centered"` (D-0093, ADR 0023, #862), with `onFrameChange`. With `"centered"` the shell is 1366px wide, centered at the full window height, on a grey backdrop with a wide shadow, and the AppHeader gets a toggle at its end to expand to the full window and back (remembered). New tokens: `--plx-sys-shell-frame-outside` and `--plx-sys-shell-frame-shadow` (the breakpoint and the width come with ADR 0023). New words: `appShell.frame.expand` and `appShell.frame.restore` (Arabic pending approval).
