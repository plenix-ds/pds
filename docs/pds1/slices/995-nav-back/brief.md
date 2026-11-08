# 995: a back-to-parent item in a side pane, and the pane title hierarchy

Source: plenix-ds/pds#995, the CTM owner (2026-11-07), relayed by ctm3-product-lead (CTM#263). Part of 1.2.0 (#1001, D-0121).

## Goal

- A side pane (a case's navigation, for example) has a quiet "Back to cases" item at its top: start-aligned, with a back-arrow icon on the nav icons' column. The pane title below it ("Case Overview") is the strongest text in the pane.

## Already implemented

- `platform/patterns/SecondaryPane/SecondaryPane.tsx`: `title`, `icon`, `collapsible` with `rail` (ToolRail.Item), `onBack` plus `strings.back` ("Back to {name}"), a Back control only at Narrow (list → detail; `secondary-pane.css`, `.plx-secondary-pane-back`).
- `platform/components/NavList/NavList.tsx`: `items` and `groups` with icons; the item row and icon column.

## P0

- A documented back item at the top of a SecondaryPane (G3 names the prop; for example `back={{ label, href | onClick }}`). It is a link or button styled as a quiet nav row: secondary text, smaller than the items, a back-arrow icon on the items' icon column, start-aligned, no fill, not full width centered.
- Pane title order, documented in DESIGN.md: back item (quietest) › pane title (strongest) › group headings › items.
- Keyboard: it's the first stop in the pane. Accessible name: the label ("Back to cases"). In RTL, the arrow mirrors.
- EN/AR through the catalog; the default label reuses `strings.back`.

## P1

- Collapsed rail: the back item shows as the first rail icon, with its label as the tooltip and the accessible name.
- A docs example: a case navigation with "Back to cases".

## P2

- None.

## Non-goals

- No change to the Narrow list → detail Back control, beyond sharing its string and icon.
- No breadcrumbs in the pane.
- No new colors or tokens beyond sys roles over existing refs.

## Affected packages

- `@plenix-ds/react` (SecondaryPane, maybe NavList), `@plenix-ds/styles`.

## Acceptance

- **AC-1:** Given a SecondaryPane with a back item and a title, when it renders, then the back item comes first, start-aligned, with its icon on the same inline-start column as the NavList item icons, and no filled background.
- **AC-2:** Given the same pane, then the title's font size and weight are greater than the back item's and the nav items'.
- **AC-3:** Given keyboard focus entering the pane, then the back item is the first focusable element, and Enter activates it (link or onClick).
- **AC-4:** Given `dir="rtl"`, then the arrow mirrors and the item aligns to the inline start (the right).
- **AC-5:** Given a collapsed pane, then the rail shows the back icon first, with the label as the tooltip and the accessible name.
- **AC-6:** Given no label, then the item reads `strings.back` with the parent name.

## Anything unclear

| Question | Answer |
|---|---|
| The prop name and where it lives | G3 decides (DS Architect). It does not block G1. |
