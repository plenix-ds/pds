# pill-padding-649

A pill (a small rounded label such as "Needs decision") in a table cell has the same space on both sides, and its text starts at the start edge (it was centered until #848, owner 2026-11-07).

- File: `tests/pill-padding-649.test.js`

## What it checks
- Each pill has 4px of padding before and after its text (the old build had 6px and 10px).
- The text is as far from one edge of the pill as from the other, within half a pixel.
- Every pill in a column has the same width, on the 4px grid: the widest text plus two paddings and two borders, rounded up, and no more.
- A narrower pill's text starts at the start edge of that shared width (#848).
- It checks a column of identical pills and a column of mixed widths, in the compact and the standard density, left to right and right to left (RTL, for Arabic).
- No script errors.

## Why it exists
- Issue #649 "DataGrid and Table pills: side padding must equal top and bottom padding"; owner 2026-10-29 (in the file header).
- The file header explains the fault: the text sat 7px from one edge and about 14px from the other.
- Added in commit 211003b6 (2026-10-29) "#649: a DataGrid or Table pill has equal padding at both sides, and its content is centered in the column's shared width".

## How it checks
- Opens `tests/fixtures/platform-host.html` in headless Chrome four times (two directions, two densities), draws a four-row DataGrid with pill cells, and measures each pill's padding, width and text position.

## What a failure means
- Status pills would look lopsided, with the text pushed to one side, and pills in one column could have different widths.

## When it runs
- A child of `layout` (AUTOMATIC in `tests/run.js`): layout starts it as a separate process when the DataPill, the DataGrid or the Table changes, or when this test's own file, or a fixture it loads, changes (issue #756). In a full run it always runs.
- CI: the "fixtures" browser job (`ci.yml`), which runs layout, on every pull request and on pushes to styling/phase-2 and main. Full suite (`full.yml`): the "fixtures" job.

## What it needs
- Headless Chrome and the local test server (`tests/lib.js`).
- `tests/fixtures/platform-host.html`.
