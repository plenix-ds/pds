# 1044: DataGrid, a cell clamped to N lines, and the full text on hover and focus

Source: plenix-ds/pds#1044, from CTM (LighthouseCollection/CTM#271, CTM D-0062; the owner wants a long recommendation to wrap to two lines ending in "…"), on Plenix 1.2.0. Decision: D-0133.

## Goal

- A long text cell shows up to two lines ending in "…". Hovering it or focusing it with the keyboard shows the full text, in a tooltip that fits the screen.

## Already implemented

- `platform/components/DataGrid/DataGrid.tsx`: `columns[].wrap` / kind `"wrap"` shows "the lines that fit the row height step, then an ellipsis". `rowHeight: "short" | "medium" | "tall" | "extra-tall"`. Density rows are 36 / 40 / 48px, so at the default compact density only one line fits. That's why `wrap: true` looked like one line in CTM.
- `columns[].description`: the header's tooltip (ADR 0025, #924).
- `Tooltip`: around arbitrary content, its trigger span grows to the text width (#1044 item 2).

## P0

- `columns[].lines: n` (G3 names it): the cell shows at most n lines, then "…". The grid uses the smallest row-height step that fits n lines at the density, so `lines: 2` works without the app picking `rowHeight`. It works with virtual rows (a fixed row height per grid).
- A truncated cell's full text on **hover and keyboard focus** (G3 names it, for example `columns[].overflow: "tooltip"`, on by default for `wrap`/`lines` columns). The tooltip shows only when the text is actually cut. Its width is capped by the tooltip's max-width token and it wraps, staying in the viewport. The text is also the cell's accessible description.
- Tooltip: as a cell's child, its trigger takes the cell's width, so the cell can truncate (fixes item 2).

## P1

- Docs: a "Long text in a cell" example (2 lines and the tooltip) replacing the `Text truncate` + `title` workaround.

## P2

- `lines` in the card layouts (narrow).

## Non-goals

- No change to the default row heights.
- No tooltip on cells whose text fits (D-0091: no tooltips where nothing is hidden).

## Affected packages

- `@plenix-ds/react` (DataGrid, Tooltip), `@plenix-ds/styles`.

## Acceptance

- **AC-1:** Given `columns: [{ field: "recommendation", lines: 2 }]` at compact density and long text, when the grid renders, then the cell shows two lines ending in "…", and every row has the same height (the smallest step that fits two lines).
- **AC-2:** Given that cell, when it's hovered or receives keyboard focus, then a tooltip shows the full text, wraps within the max-width token, and stays inside the viewport.
- **AC-3:** Given a cell whose text fits, then no tooltip appears.
- **AC-4:** Given a `Tooltip` wrapping cell content, then its trigger is no wider than the cell and the text truncates.
- **AC-5:** Given a screen reader on the cell, then the full text is available (accessible description).
- **AC-6:** Given RTL, then the ellipsis is at the inline end and the tooltip mirrors.

## Anything unclear

| Question | Answer |
|---|---|
| Prop names | G3 decides (D-0133 proposes `lines` and `overflow: "tooltip"`). It does not block G1. |
