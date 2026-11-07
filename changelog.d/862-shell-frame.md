### Added

- AppShell: a `frame` prop, `"full"` (default, as before) or `"1366"` (D-0093, #862). With `"1366"` the shell is 1366px wide, centered at the full window height, on a grey backdrop with a wide shadow, and the AppHeader gets a toggle at its end to expand to the full window and back (remembered). New tokens: `--plx-ref-breakpoint-frame`, `--plx-sys-shell-frame-width`, `--plx-sys-shell-backdrop`, `--plx-sys-shell-frame-shadow`. New words: `appShell.frame.expand` and `appShell.frame.restore` (Arabic pending approval).
