# ADR 0047: "overflow: dialog" (a corner icon that opens the full text of a cut text)

- **Status:** accepted
- **Date:** 2026-11-09
- **Deciders:** pds1-ds-architect (G3), on the owner's request relayed on #1122 (chat, 2026-11-09). Decision D-0140 (owner may switch).
- **Issue:** #1122 (S1).
  - Brief: `docs/pds1/slices/1122/brief.md` (PR #1123).
  - Design (G2, PR #1125, D-0141): `docs/pds1/slices/1122/design.md`. It owns the look, the corner and the states.
  - G2 (`pds1-design-director`) owns the look: the icon, the corner, the hover and focus states, and whether short overflow expands in place. This entry owns the names, the shared part and the tokens.

## Context

- Three parts already cut long text, each with its own way to see the rest:
  - `Text lines={2..4} expandable`: a "Show more" button **under** the text (`ExpandableText`, which measures the text itself).
  - DataGrid `columns[].lines` with `overflow: "tooltip"` (ADR 0043): the full text in a tooltip, measured on demand by `CutText` in `DataGrid/cells.tsx`.
  - `PropertyList.Item` labels: a tooltip while cut, through `useTruncated` (`utils/overflow.ts`). Its values have no line count at all.
- The owner asks for a small corner icon that shows the full text, in place or in a dialog. Nothing on `main` draws it.
- That is three measures of "is it cut" today. The Component Engineer asked (on #1122) that the new part read **one** measure.
- ADR 0043 made DataGrid's `overflow` an enum so it could grow. This entry grows it.
- The `expand` icon exists in the Plenix set, and `Dialog` already draws a title, a scrolling body and Close.

## Options

| Option | For | Against |
|---|---|---|
| **A. One word everywhere: `overflow?: "none" \| "dialog"` on `Text` and `PropertyList.Item` (with `lines` on the item), and `"dialog"` added to DataGrid's `columns[].overflow`. One internal part draws the icon and the Dialog.** | The same prop name and value in all three places, matching ADR 0043. No new export. The look stays G2's. | Three props, one per host. |
| B. A new exported `<FullText label lines>` wrapper that apps put around any text | One part to learn | A second way to clamp text next to `Text lines`. PropertyList and DataGrid would still need props to use it, so the API grows twice. |
| C. Extend `expandable` to `expandable?: boolean \| "dialog"` | No new prop name on Text | A boolean that turns into an enum reads badly, and DataGrid already calls this `overflow`. |

## Decision

**Option A** (D-0140; reply B or C on #1122 to switch).

### The shared part (internal, not exported)

- `platform/utils/overflow.ts` gains `isCut(el)`: the measure from `CutText` (the clamp lifted for the moment of the measure, then the natural height and width compared to the box).
  - `useTruncated`, `ExpandableText` and `CutText` all call `isCut`, so the three parts read one measure.
  - This is an internal refactor with no API change.
- `platform/components/Text/FullTextAction.tsx` holds the internal `FullTextAction`: the icon button and its Dialog. `Text`, `PropertyList.Item` and DataGrid cells import it. It is not in the package index.
  - The look is G2's (D-0141): a ghost `2xs` icon-only `Button` with the `expand` glyph (not mirrored), at the inline-end, block-end corner. It is not an icon in a box.
  - It has `aria-haspopup="dialog"` and the accessible name "Show full text: {label}", or "Show full text" without a label.
  - The Dialog is the existing `Dialog` at `size="md"`. Its title is the label, or "Full text" without one. Its body is the full text, scrolling, with `dir="auto"`, and Close is the Dialog's own. Closing returns focus to the button.
  - **It shows only while the text is cut** (D-0091). The text that fits gets no icon.
  - The clamp is visual only, so the full text stays in the page for search, copy and screen readers (brief AC-3).

### `Text.overflow?: "none" | "dialog"` (default `"none"`) and `Text.overflowLabel?: string`

- `"dialog"` takes effect with `lines` (2 to 4) or `truncate`. Without either, it does nothing and gets a `devWarn`.
- `overflowLabel` names the button and titles the Dialog. Without it, the generic words are used.
- With `expandable` also set, a `devWarn` fires and `overflow="dialog"` wins.
- The text and the icon share a wrapper with the class `plx-text-full`. The text gets `plx-text-full__text`, the button gets `plx-text-full__action`, and the Dialog body gets `plx-text-full__body`.
- The measure watches the box's size (a ResizeObserver per `Text`, as `ExpandableText` does today), so the icon appears and leaves as the width changes.
- The default stays `"none"` in 1.x, so no existing `Text lines` gains an icon without the app asking.
- Panel and Card bodies need no API: a `Text lines={3} overflow="dialog"` inside them is enough (brief AC-5).

### `PropertyList.Item.lines?: 2 | 3 | 4` and `PropertyList.Item.overflow?: "none" | "dialog"`

- `lines` clamps the item's value to that many lines. Any other number gets a `devWarn` and no clamp.
- `overflow` defaults to `"dialog"` when `lines` is set, so a cut value always keeps a way to its whole text (the truncation ladder). `"none"` opts out.
- The label is the item's `label`: its text when it is a string, or its text content otherwise.
- This works in every variant and layout, and is meant for `variant="tiles"` (ADR 0044).
- With `status`, `lines` and `overflow` are ignored. A status is a Badge, not text.

### DataGrid `columns[].overflow?: "tooltip" | "none" | "dialog"` (ADR 0043's prop, one value added)

- `"dialog"` keeps the clamp. The icon shows at the cell's inline end on row hover and while the cell has focus, only when the cell's text is cut.
- The cut is measured on demand when the cell is hovered or focused, as for `"tooltip"`, with no observer per cell.
- The label is the column's `title`.
- **Keyboard:** the grid has no key that enters a cell's controls (`engine/keys.ts`). F2 on a focused read-only cut cell opens the Dialog, and the cell gets `aria-keyshortcuts="F2"`. F2 still edits an editable cell, and Enter still opens the row. Closing the Dialog returns focus to the cell.
- `"dialog"` and `"tooltip"` don't combine. The default stays as ADR 0043 set it.
- This part is P1 in the brief. It may ship in a later PR under this entry.

### Words (the catalog, `text` namespace; `Text.strings` already overrides it)

- `text.fullText`: "Show full text"
- `text.fullTextOf`: "Show full text: {label}"
- `text.fullTextTitle`: "Full text"
- Close is the existing `dialog.close`.
- The Arabic words come from `pds1-i18n-engineer` and need the owner's approval (D-0012). Until then, the English keys ship and `ar.js` gets no unapproved Arabic.

### Tokens (ref -> sys -> comp)

- **`plx-comp.text-full-action-gap`** -> `{plx-sys.space-inline-xs}` (4px): the gap between the cut text and the corner button in a box (G2).
  - It is added in the build PR together with the CSS that reads it, because CI rejects a token nothing reads. That PR is labeled `agent:pds1-ds-architect` for the ownership check.
  - The button and the Dialog use their existing tokens.
  - Any other token needs a new ADR entry.

### Not in this change

- **In-place expansion from the corner icon.** G2 (D-0141) chose the Dialog only for 1.4.0. If the owner picks in-place (G2 option B1), the value `"expand"` is reserved for it on all three props. It is added by a new entry, as a minor.
- An app-wide default (brief P2).
- Editing in the Dialog (brief non-goal).

## Consequences

- **Semver: MINOR (1.4.0).**
  - *Added:* the token `plx-comp.text-full-action-gap`, `Text.overflow`, `Text.overflowLabel`, `PropertyList.Item.lines`, `PropertyList.Item.overflow`, the value `"dialog"` for DataGrid `columns[].overflow`, the classes `plx-text-full`, `plx-text-full__text`, `plx-text-full__action` and `plx-text-full__body`, and the three catalog keys.
  - *Changed (internal):* one cut measure (`isCut`) behind `useTruncated`, `ExpandableText` and `CutText`.
- **No deprecation.** `Text expandable` stays as the "Show more" button under the text.
- **Bundle:** DataGrid keeps its dialogs out of the default path (`engine/chromeRare.tsx`, `engine/rare.tsx`). The grid's `"dialog"` cell loads the Dialog the same way, on first open, so the `{ DataGrid }` one-part limit (D-0139, 455 KB) gains only the icon button and the measure.
  - If the size check still fails, the Release Architect raises the limit with a new decision record. Nobody removes the feature to fit.
- CTM adopts it in its read-only tiles (`PropertyList.Item lines={3}`) right after 1.4.0. Adoption is checked in CTM's code, not assumed from the release (lesson of 2026-11-09).

## Enforced by

- G3 on each build PR: the API diff matches this entry, with no other new props, exports or tokens.
- Check 6 (token tiers) and check 7 (token names) on the build PR, for `plx-comp.text-full-action-gap` (a comp token pointing at sys, never at ref, with no value in its name).
- `node tools/ci/adr-index.mjs --check`: this file's heading and status.
- The build PR's tests (brief AC-1 to AC-5):
  - a cut value shows the icon, and a fitting one shows none;
  - click, Enter and Space open the Dialog titled with the label, and closing it returns focus;
  - the button's name is "Show full text: {label}", and the full text stays in the accessibility tree;
  - in RTL, the icon sits at the inline end and the Dialog mirrors;
  - `Text lines={3} overflow="dialog"` in a Panel body behaves the same;
  - `overflow="dialog"` without `lines` or `truncate`, and with `expandable`, each warns.
