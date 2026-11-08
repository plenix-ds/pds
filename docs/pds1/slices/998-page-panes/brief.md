# 998: PagePanes, a documented wrapper for the side pane and content pair

Source: plenix-ds/pds#998, found checking CTM (owner, 2026-11-08, D-0121). Part of 1.2.0 (#1001).

## Goal

- Apps place a side pane beside the page content with an exported component, not a raw `<div className="plx-page-panes">`.

## Already implemented

- `platform/patterns/AppShell/app-shell.css` (`.plx-page-panes`), `platform/patterns/SecondaryPane/secondary-pane.css` (its `:has()` rules), `platform/patterns/SecondaryPane/SecondaryPane.tsx` docs, and `platform/templates/templates/Templates.tsx` ~100, which use the raw div.
- CTM uses the raw div: `static/ctm/app.js` ~1999.

## P0

- Export `PagePanes` (G3 may pick another name), rendering the same element and class, passing `className` and other props through.
- Update the SecondaryPane docs, the templates and the manifest to use it.

## P1

- Mark the raw-class usage deprecated in the docs, so it is removed in 2.0.0.

## P2

- None.

## Non-goals

- No layout change: same CSS, same behaviour.

## Affected packages

- `@plenix-ds/react`, the manifest.

## Acceptance

- **AC-1:** Given `<PagePanes>{pane}{content}</PagePanes>`, when it renders, then the DOM equals today's `<div class="plx-page-panes">` with the same children.
- **AC-2:** Given a SecondaryPane in list mode inside PagePanes, then the `:has()` rules still hide the content at Narrow (same as today).
- **AC-3:** Given the docs and the templates, then no example writes `plx-page-panes` by hand.

## Anything unclear

| Question | Answer |
|---|---|
| — | None. |
