# ADR 0047: "overflow: expand" (a corner icon that shows the full text of a cut text)

- **Status:** accepted
- **Date:** 2026-11-09
- **Deciders:** pds1-ds-architect (G3), on the owner's request relayed on #1122 (chat, 2026-11-09). Decision D-0141 (owner may switch). The look is G2's D-0140.
- **Issue:** #1122 (S1).
  - Brief: `docs/pds1/slices/1122/brief.md` (PR #1123).
  - Design (G2, PR #1125, D-0140): `docs/pds1/slices/1122/design.md`. It owns the look, the corner, the states, the glyphs and the 12-line threshold. This entry owns the names, the shared part and the tokens.

## Context

- Three parts already cut long text, each with its own way to see the rest:
  - `Text lines={2..4} expandable`: a "Show more" button **under** the text (`ExpandableText`, which measures the text itself).
  - DataGrid `columns[].lines` with `overflow: "tooltip"` (ADR 0043): the full text in a tooltip, measured on demand by `CutText` in `DataGrid/cells.tsx`.
  - `PropertyList.Item` labels: a tooltip while cut, through `useTruncated` (`utils/overflow.ts`). Its values have no line count at all.
- The owner asks for a small corner icon that "expands more to show full text or opens the full text in modal". Nothing on `main` draws it.
- G2 (D-0140) gives one behavior with both outcomes:
  - in a box (a tile, a card or Panel body), the text unfolds in place when it is 12 lines or fewer, and otherwise opens a Dialog;
  - in a grid cell, it always opens the Dialog, because a row never grows.
- That is three measures of "is it cut" today. The Component Engineer asked (on #1122) that the new part read **one** measure.
- ADR 0043 made DataGrid's `overflow` an enum so it could grow. This entry grows it.

## Options

| Option | For | Against |
|---|---|---|
| **A. One word everywhere: `overflow?: "none" \| "expand"` on `Text` and `PropertyList.Item` (with `lines` on the item), and `"expand"` added to DataGrid's `columns[].overflow`. One internal part draws the icon, the unfolding and the Dialog.** | The same prop name and value in all three places, matching ADR 0043. The value names what the person does (the owner's "expands"), whichever of G2's two outcomes applies. No new export. | Three props, one per host. In a grid, "expand" always means the Dialog. |
| A2. Two values, `"expand"` and `"dialog"`, that the app chooses between | The app picks the outcome | G2 picks the outcome by length. Two values would let apps contradict the design. |
| B. A new exported `<FullText>` wrapper that apps put around any text | One part to learn | A second way to clamp text next to `Text lines`. PropertyList and DataGrid would still need props to use it, so the API grows twice. |
| C. Extend `expandable` to `expandable?: boolean \| "corner"` | No new prop name on Text | A boolean that turns into an enum reads badly, and DataGrid already calls this `overflow`. |

## Decision

**Option A** (D-0141; reply A2, B or C on #1122 to switch).

### The shared part (internal, not exported)

- `platform/utils/overflow.ts` gains `isCut(el)`: the measure from `CutText` (the clamp lifted for the moment of the measure, then the natural height and width compared to the box).
  - `useTruncated`, `ExpandableText` and `CutText` all call `isCut`, so the three parts read one measure.
  - The same measure gives the natural line count (natural height divided by the line height from computed style) for the 12-line threshold.
  - This is an internal refactor with no API change.
- `platform/components/Text/FullTextAction.tsx` holds the internal `FullTextAction`: the corner button, the unfolding and the Dialog. `Text`, `PropertyList.Item` and DataGrid cells import it. It is not in the package index.
- **The look is G2's design §** "The button" to "Touch", which includes:
  - `Button variant="ghost" size="xs" iconOnly`;
  - `chevron-down` and `chevron-up` in place, `expand` for the Dialog;
  - the inline-end, block-end corner;
  - the Dialog at `size="md"` with the label as title, `pre-wrap` and Close.
  - This entry adds no look of its own.
- **Names:**
  - The accessible name is "Show full text: {label}", or "Show full text" without a label.
  - In place, the button has `aria-expanded` and `aria-controls`. For the Dialog, it has `aria-haspopup="dialog"`.
  - Closing the Dialog returns focus to the button, or to the cell in a grid.
- **It shows only while the text is cut, or while it is unfolded** (D-0091). The text that fits gets no icon.
- The clamp is visual only, so the full text stays in the page for search, copy and screen readers (brief AC-3).

### `Text.overflow?: "none" | "expand"` (default `"none"`) and `Text.overflowLabel?: string`

- `"expand"` takes effect with `lines` (2 to 4) or `truncate`. Without either, it does nothing and gets a `devWarn`.
- `overflowLabel` names the button and titles the Dialog. Without it, the generic words are used.
- With `expandable` also set, a `devWarn` fires and `overflow="expand"` wins. `expandable` stays the "Show more" button under prose (G2, D-0140).
- The text and the icon share a wrapper with the class `plx-text-full`. The button gets `plx-text-full__action`.
- The measure watches the box's size (a ResizeObserver per `Text`, as `ExpandableText` does today), so the icon appears and leaves as the width changes.
- The default stays `"none"` in 1.x, so no existing `Text lines` gains an icon without the app asking (G2: clamping is opt-in).
- Panel and Card bodies need no API: a `Text lines={3} overflow="expand"` inside them is enough (brief AC-5).

### `PropertyList.Item.lines?: 2 | 3 | 4` and `PropertyList.Item.overflow?: "none" | "expand"`

- `lines` clamps the item's value to that many lines. Any other number gets a `devWarn` and no clamp. Without `lines`, a value still wraps and is never cut (DESIGN.md §3, D-0106).
- `overflow` defaults to `"expand"` when `lines` is set, so a cut value always keeps a way to its whole text (the truncation ladder). `"none"` opts out.
- The label is the item's `label`: its text when it is a string, or its text content otherwise.
- This works in every variant and layout, and is meant for `variant="tiles"` (ADR 0044).
- With `status`, `lines` and `overflow` are ignored. A status is a Badge, not text.

### DataGrid `columns[].overflow?: "tooltip" | "none" | "expand"` (ADR 0043's prop, one value added)

- `"expand"` keeps the clamp. The corner icon shows on row hover and on the active cell, only when the cell's text is cut. It always opens the Dialog.
- The cut is measured on demand when the cell is hovered or focused, as for `"tooltip"`, with no observer per cell.
- The label is the column's `title`.
- **Keyboard:** F2 on a read-only cut cell opens the Dialog (G2). Closing it returns focus to the cell.
- With `"expand"`, the text keeps its full-text Tooltip (#1044) as G2 specifies. The button's own Tooltip shows only on the button.
- The default stays as ADR 0043 set it. This part is P1 in the brief, and may ship in a later PR under this entry.

### Words (the catalog, `text` namespace; `Text.strings` already overrides it)

- `text.fullText`: "Show full text"
- `text.fullTextOf`: "Show full text: {label}"
- `text.fullTextTitle`: "Full text"
- Collapse in place reuses the button's name with `aria-expanded`, and Close is the existing `dialog.close`.
- Arabic: `pds1-i18n-engineer` proposed it on #1122 from owner-approved Plenix words (`dataGrid.fullText`, #427). It is written into `ar.js` in its own PR after the build (G6).

### Tokens (ref -> sys -> comp)

- **`plx-sys.fit-expand-max-lines`** = `12` (`$type: number`) in `semantic/fit.tokens.json`, next to `fit-lines`. It is the most lines a cut text unfolds in place. Past it, the text opens in the Dialog (G2).
  - It is a raw count at the sys tier, as `fit-lines` is. A count has no ref scale to point to.
  - The part reads it from computed style (`--plx-sys-fit-expand-max-lines`), never as a number in the code.
- **`plx-comp.text-full-action-gap`** -> `{plx-sys.space-inline-xs}` (4px): the gap between the text and the corner button (G2).
- Both are added in the build PR together with the code and CSS that read them, because CI rejects a token nothing reads. That PR is labeled `agent:pds1-ds-architect` for the ownership check.
- The button, the Dialog and the motion use their existing tokens. Any other token needs a new ADR entry.

### Not in this change

- An app-wide default (brief P2), and clamping read-only values by default (G2 option B1).
- Replacing "Show more" with the corner icon (G2 option B2).
- Editing in the Dialog (brief non-goal).

## Consequences

- **Semver: MINOR (1.4.0).**
  - *Added:*
    - the props `Text.overflow`, `Text.overflowLabel`, `PropertyList.Item.lines` and `PropertyList.Item.overflow`;
    - the value `"expand"` for DataGrid `columns[].overflow`;
    - the classes `plx-text-full` and `plx-text-full__action`;
    - the tokens `plx-sys.fit-expand-max-lines` and `plx-comp.text-full-action-gap`;
    - the three catalog keys.
  - *Changed (internal):* one cut measure (`isCut`) behind `useTruncated`, `ExpandableText` and `CutText`.
- **No deprecation.** `Text expandable` stays as the "Show more" button under the text.
- **Bundle:** DataGrid keeps its dialogs out of the default path (`engine/chromeRare.tsx`, `engine/rare.tsx`). The grid's `"expand"` cell loads the Dialog the same way, on first open, so the `{ DataGrid }` one-part limit (D-0139, 455 KB) gains only the icon button and the measure.
  - If the size check still fails, the Release Architect raises the limit with a new decision record. Nobody removes the feature to fit.
- CTM adopts it in its read-only tiles (`PropertyList.Item lines={3}`) right after 1.4.0. Adoption is checked in CTM's code, not assumed from the release (lesson of 2026-11-09).

## Enforced by

- G3 on each build PR: the API diff matches this entry, with no other new props, exports or tokens.
- Check 6 (token tiers: the comp token points at sys, never at ref) and check 7 (token names: no value in a name) on the build PR.
- `node tools/ci/adr-index.mjs --check`: this file's heading and status.
- The build PR's tests (brief AC-1 to AC-5, G2 design §7):
  - a cut value shows the icon, and a fitting one shows none;
  - text of 12 lines or fewer unfolds in place with `aria-expanded`, and longer text opens the Dialog titled with the label;
  - closing the Dialog returns focus;
  - the button's name is "Show full text: {label}", and the full text stays in the accessibility tree;
  - in RTL, the icon sits at the inline end and the Dialog mirrors;
  - `Text lines={3} overflow="expand"` in a Panel body behaves the same;
  - `overflow="expand"` without `lines` or `truncate`, and with `expandable`, each warns.
