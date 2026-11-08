# ADR 0043: DataGrid "lines" and "overflow" (a cell clamped to N lines, and its full text on hover and focus)

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on CTM's request (#1044, CTM D-0062) and D-0133 (pds1-product-lead at G1, owner may switch). The names proposed in D-0133 are kept.
- **Issue:** #1044 (S2). Brief: `docs/pds1/slices/1044/brief.md`.

## Context

- `columns[].wrap` already clamps a cell (`.plx-data-grid__value--lines`) to the lines that fit the row-height step.
  - At the compact density, the default row is 36px, and only one line fits. So `wrap: true` looked like one line in CTM.
  - Apps must know to pick `rowHeight="medium"` themselves.
- A truncated cell gives no full text on keyboard focus. CTM uses the `title` attribute, which works on hover only.
- A `Tooltip` around a cell's content grows its trigger span to the text's width, so the cell never truncates.
- Plenix already has the pattern for "a tooltip only when cut":
  - `useTruncated(ref)` (`utils/overflow.ts`) reports when a box cuts its text, across one line or after several;
  - `Tooltip disabled={!cut} describe={false}` uses it (PropertyList labels, batch 270).
  - D-0091: a tooltip appears only where something is hidden.

## Options

| Option | For | Against |
|---|---|---|
| **A. `lines?: number` and `overflow?: "tooltip" \| "none"` on a column** (D-0133) | `lines` is `Text lines`' name. An enum can grow (for example `"expand"`), and the grid owns the row step and the tooltip. | Two props. |
| B. `maxLines` and `tooltip?: boolean` | Reads plainly | `maxLines` is a second name for what `Text` calls `lines`, and a boolean can't grow. |
| C. Apps set `rowHeight` and wrap their own Tooltip | No new API | Every app solves it differently, and keyboard users miss the text (D-0133 B). |

## Decision

**Option A** (D-0133; reply B or C on #1044 to switch).

### `DataGridColumn.lines?: number`

- An integer from 1 to 4. A value outside that range gets a `devWarn`, and the grid uses the nearest of 1 or 4.
- It implies `wrap` (the column starts wrapped). The cell shows at most `lines` lines, then an ellipsis at the inline end.
- **Row height:** the grid uses the smallest row-height step (`short`, `medium`, `tall`, `extra-tall`) whose height fits the largest `lines` among the wrapped columns shown, at the current density.
  - The app's `rowHeight`, or the person's View choice, wins when it is taller.
  - The fit is measured from the row-height and line-height tokens (computed style), never from numbers in the code.
  - Every row keeps the same height, so virtual rows still work.
- **Wrap off:** when the person turns Wrap text off for the column in its menu, the column shows one line. It then no longer counts toward the fit.
- **Clamp:** the clamp is `min(lines, the lines that fit the row)`. The class `plx-data-grid__value--lines-<n>` (n = 1 to 4) sets the cap, with no inline style.

### `DataGridColumn.overflow?: "tooltip" | "none"`

- **Default:** `"tooltip"` for a column that wraps (`wrap`, kind `"wrap"` or `lines`), and `"none"` for every other column. An app may set `"tooltip"` on any column, for example a one-line text column.
- **`"tooltip"`:**
  - When the cell's text is actually cut, a Tooltip with the full text shows on pointer hover and on keyboard focus of the cell, the grid's roving focus included.
  - Text that fits gets no tooltip (AC-3, D-0091).
  - The text is the cell's formatted value, or the rendered cell's text content for a `render` column.
  - The tooltip wraps within the tooltip's max-width token and stays in the viewport through the Tooltip's own placement. It mirrors in RTL.
- **Measured on demand:** the cut is checked with `useTruncated` logic when the cell is hovered or focused, not with a ResizeObserver per cell, so 10,000 rows cost nothing extra.
- **Accessibility (AC-5):**
  - The clamp is visual only (CSS line clamp), so the cell's full text stays in the accessibility tree.
  - The tooltip uses `describe={false}`, so a screen reader doesn't read the text twice.
- **No new keyboard shortcut.** Escape closes the tooltip as Tooltip does.

### Fixed: a Tooltip inside a cell takes the cell's width (AC-4)

- `.plx-data-grid__cell .plx-tooltip__trigger` becomes a block box with `min-inline-size: 0` and `max-inline-size: 100%`, so the content inside can truncate.
- This is a style fix only, scoped to grid cells. No public API changes, and Tooltips outside the grid don't change.

### Not in this change

- `lines` in the narrow card layout (brief P2).
- No new tokens: the row-height steps, the line height and the tooltip max width exist.

## Consequences

- **Semver: MINOR.**
  - *Added:* `columns[].lines`, `columns[].overflow` and the classes `plx-data-grid__value--lines-1` to `-4`.
  - *Fixed:* a Tooltip in a cell grew past the cell.
- **Behavior change:** existing `wrap` columns now show the full-text tooltip when cut, through the new default `overflow: "tooltip"`. The tooltip shows only where text is hidden (D-0091), so this is an improvement, not a break. Set `overflow: "none"` to opt out.
- Default row heights are unchanged. A grid grows taller only when a column sets `lines`.
- CTM drops its `Text truncate` and `title` workaround for `lines: 2` (CTM#271).
- The `DataGrid.tsx` header docs describe both props, and the docs gain a "Long text in a cell" example.

## Enforced by

- G3 on the build PR: the API diff matches this entry (two column props, no others).
- Check 7 (token names): the build adds no tokens. If one is needed, it needs a new ADR entry.
- The build PR's tests (brief AC-1 to AC-6):
  - `lines: 2` at compact density shows 2 lines, then an ellipsis, with every row the same step height;
  - a taller `rowHeight` wins;
  - a tooltip shows on hover and on keyboard focus only when the text is cut;
  - a fitting cell shows no tooltip;
  - `overflow: "none"` shows none;
  - a Tooltip child doesn't widen the cell;
  - the full text is in the accessibility tree, with no duplicate description;
  - in RTL, the ellipsis is at the inline end and the tooltip mirrors;
  - `lines: 0` and `lines: 9` warn and are clamped.
