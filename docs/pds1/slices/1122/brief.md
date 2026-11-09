# 1122: long text, a corner icon that expands it or opens the full text in a dialog

Source: plenix-ds/pds#1122, the owner (chat, 2026-11-09): "when there is large text there a little corner icons that expands more to show full text or opens the full text in modal". Fluent first (D-0078). No tooltip where nothing is hidden (D-0091).

## Goal

- When a long text is cut, people see a small icon at the corner of its box. Using it shows the whole text, in place or in a dialog, with the mouse, the keyboard or a screen reader.

## Already implemented

- `platform/components/Text/Text.tsx`: `lines` 2 to 4 and `expandable` (a "Show more" button under the text).
- `platform/components/DataGrid/cells.tsx`: `columns[].lines` and `overflow: "tooltip"` (#1044).
- `PropertyList.Item` in `variant="tiles"` (#1043), with `span="full"` for long text (#1052).
- The truncation ladder in the spec (`platform/design-system/parts/w00B.records.js`): every cut keeps a way to see the whole.

## P0

- One shared part (G3 names it), used by `Text` (with `lines`), `PropertyList.Item` in tiles, and Panel or card bodies. It shows a small icon button at the inline-end corner of the box, **only while the text is cut**.
- Activating it opens the full text in a Dialog: title = the field's label (or a given title), the text scrollable, Close; focus returns to the icon. G2 may choose in-place expansion below a length threshold.
- The button's accessible name is "Show full text: {label}". It's keyboard reachable, and RTL mirrors it. Tokens only, no icon in a box, corners and grid per DESIGN.md.
- EN/AR strings through the catalog.

## P1

- DataGrid cells: the same icon on row hover and focus, as an alternative to the tooltip (`overflow: "dialog"`).
- Docs examples: a long note in a tiles group, and a long description in a card.

## P2

- An app-wide default (always a dialog, or always in place).

## Non-goals

- No change to text that fits.
- No editing in the dialog.

## Affected packages

- `@plenix-ds/react` (Text, PropertyList, DataGrid, Dialog use), `@plenix-ds/styles`, the i18n catalog.

## Acceptance

- **AC-1:** Given a tile whose value is cut at its line count, then a corner icon button shows at the inline-end corner. Given a value that fits, then no icon shows.
- **AC-2:** Given the icon is activated (click, Enter or Space), then a Dialog opens titled with the field's label and showing the full text. Closing it returns focus to the icon.
- **AC-3:** Given a screen reader, then the button is named "Show full text: {label}", and the full text is in the page (clamped, not removed).
- **AC-4:** Given `dir="rtl"`, then the icon sits at the inline end (the left) and the dialog mirrors.
- **AC-5:** Given `Text lines={3}` with the new option inside a Panel body, then the same icon and dialog behaviour applies.

## Anything unclear

| Question | Answer |
|---|---|
| Where is the spec the owner saw? | Not in Plenix or CTM (searched). The owner is asked. This brief builds his description, so it does not block G1. |
| In place or dialog? | G2 decides (both are allowed by the owner's words). |
