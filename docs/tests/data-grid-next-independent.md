# data-grid-next-independent

The table's independent renderer (DataGridEngine) works on its own, with none of the old grid code loaded.

- File: `tests/data-grid-next-independent.test.js`

## What it checks
- Built on its own, the renderer does not pull in the DataGrid wrapper or any vendored (copied-in) grid engine, and it does use the TanStack table and virtual-scroll libraries.
- In the browser, with requests for other vendored scripts blocked: 600 records draw only some rows; sorting, selecting and filtering work.
- No old-engine access, no Platform bundle, no old-engine script on the page, nothing blocked, and no script errors.

## Why it exists
- Its header: "Proves DataGridEngine builds and operates with no legacy grid JavaScript."
- Added in commit 76ebc7a4 (2026-10-16) "0.49.0: DataTableNext on TanStack (phase 1, #128); DataTable option B (#126)". Issue #128 is "Task: DataTableNext, a TanStack Table trial with the same API, look and capabilities".

## How it checks
- Bundles `platform/components/DataGrid/DataGridEngine.tsx` alone with esbuild and reads the list of files it used.
- Opens a page made by the test that loads only platform.css and React (no Platform script), adds the bundle, blocks other vendored scripts, and draws a 600-row grid.

## What a failure means
- The new renderer could secretly depend on the old engine, so removing the old code would break tables.

## When it runs
- A child of `data-grid` (AUTOMATIC in `tests/run.js`): data-grid starts it as a separate process before its own checks. Before issue #756 it was started by hand only.
- In changed mode it runs when the DataGrid, DataGridEngine or Table changes, or when this test's own file (or a fixture it loads) changes. In a full run it always runs.
- It is skipped when data-grid is started with `DT_ONLY`.
- CI: the "behavior" browser job (`ci.yml`), on every pull request and on pushes to styling/phase-2 and main. Full suite (`full.yml`): the "behavior" job.
- By hand: `node tests/data-grid-next-independent.test.js`.
- The DataGrid README lists it under the grid's validation.

## What it needs
- Headless Chrome and the local test server (`tests/lib.js`).
- The esbuild package and the installed TanStack packages.
