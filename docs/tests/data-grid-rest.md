# data-grid-rest

The rest of the table fixes keep working: file sizes, missing values, rich cells, column widths, the narrow switch, and undo for row actions.

- File: `tests/data-grid-rest.test.js`

## What it checks
- File sizes: a bytes column shows sizes in a readable form, start-aligned like other cells (D-0087), in the data font; it sorts by the real number and can be filtered with input such as "10 MB"; a bad input never matches.
- Missing or deleted values: a column's "Unavailable" text is shown; deleted values are italic; zero and false are kept.
- Rich cells (avatar and name, tags, badges): drawn without a separate React portal; sorted by their visible text; badges centered and with an icon; taller rows keep the avatar and name on one line.
- Only the rich cells in view are mounted; scrolling mounts new ones and releases old ones; unmounting releases them all.
- Column widths accept CSS lengths (px, ch, calc, clamp) and size tokens, and leave no measuring element behind.
- The app's `narrowAt` sets where the grid turns into a list.
- Undo for row and selection actions: undo appears only after the action finishes; it gets the original record and the result; it keeps the selection captured at the time; a failed action shows an error with no undo; a failed undo says "Could not undo" and can be tried again.
- Checkbox names stay right after off-screen sorting, grouping and reordering.

## Why it exists
- Issue #117 "Task: DataTable fixes for RedSave, the rest (DT-5, 6, 8, 12, 13, 14, 15, 18)", including #79 (DT-8, narrow switch), #83 (DT-12, missing values), #84 (DT-13, file sizes), #85 (DT-14, undo), #86 (DT-15, rich cells as portals) and #89 (DT-18, column widths).
- Added in commit b8594c6e (2026-10-16) "0.42.0: Waves 14 A and 15 A, the rest of RedSave's DataTable list, RedSave fixes".

## How it checks
- Builds the DataGrid, its toast provider and helpers from source with esbuild, loads them into `tests/fixtures/platform-host.html`, draws grids, and reads the cells, toasts and counts.
- With `DT_ENGINE=next` (when run alone) it uses the independent renderer.

## What a failure means
- File sizes could sort wrongly or show raw numbers, missing values could look like real ones, large tables with rich cells could slow down, and an undo could restore the wrong rows or none.

## When it runs
- A module of `data-grid` (AUTOMATIC in `tests/run.js`): data-grid loads it into its own browser whenever data-grid has anything to check: a table view whose app or test-site page changed, a change to the DataGrid, DataGridEngine or Table, or a change to this file. In a full run it always runs.
- It does not run when data-grid is started with `DT_ENGINE=next`.
- CI: the "behavior" browser job (`ci.yml`), on every pull request and on pushes to styling/phase-2 and main. Full suite (`full.yml`): the "behavior" job.
- It can also be run alone: `node tests/data-grid-rest.test.js`. The DataGrid README lists it under the grid's validation.

## What it needs
- Headless Chrome and the local test server (`tests/lib.js`).
- The esbuild package, and `tests/fixtures/platform-host.html`.
