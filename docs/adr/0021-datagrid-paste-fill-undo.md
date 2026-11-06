# ADR 0021: DataGrid paste, fill and undo (`editing.paste`, `.fill`, `.undo`)

- **Status:** accepted
- **Date:** 2026-11-06
- **Deciders:** pds1-ds-architect (G3), on the Component Engineer's proposal (#3)
- **Issue:** #3 (S3: work in a Plenix table as in Excel or Google Sheets: paste a block, fill down, undo a mistake)

## Context

- A block of cells can already be selected (`cellSelection`, #465) and copied with Ctrl+C. Cells edit through `onCellEdit(record, { field, value, previous, row })`, which may return a promise (ADR 0016). Undo exists only for row actions, as a toast.
- The owner (2026-10-28, on #84 and #83): paste, fill and undo are each opt-in; with them off, the grid behaves exactly as today. He asked for Ctrl+D and a fill handle for fill.
- ADR 0016 already gives DataGrid one `editing` options object (`types`, `typeToReplace`, `enterEdits`, `rangeSelect`) that `TableSettings` can default for every table.

## Options

| Option | For | Against |
|---|---|---|
| **A. Three booleans in the existing `editing` object (`paste`, `fill`, `undo`); every change still reaches the app through `onCellEdit`, with a new `source` field** | One home for editing options; `TableSettings` defaults them; no new callback | `onCellEdit` runs once per cell for a pasted block |
| B. Three new top-level DataGrid props | Matches the issue's wording | A second place for editing options; `TableSettings` can't default them without more API |
| C. A batch callback `onCellsEdit(changes[])` | One save call per paste | A second save path beside `onCellEdit`; the async rules (spinner, rejection) would need defining twice |

## Decision

**Option A.**

```ts
editing?: {
  /* … ADR 0016's fields … */
  paste?: boolean;   // Ctrl+V / Cmd+V pastes a copied block (default false)
  fill?: boolean;    // Ctrl+D / Cmd+D fills down; the fill handle fills down or right (default false)
  undo?: boolean;    // Ctrl+Z / Cmd+Z undoes a cell edit; Ctrl+Y / Cmd+Shift+Z redoes (default false)
};
onCellEdit?(record, change: { field, value, previous, row, source?: 'edit' | 'paste' | 'fill' | 'undo' | 'redo' }): void | Promise<void>;
```

- **Off by default.** With a flag off, its keys do what they do today (Ctrl+V in a cell editor pastes text as before), and no fill handle is drawn.
- **Paste:**
  - The block (tab-separated rows, as Excel, Google Sheets and Ctrl+C write) lands at the active cell, or fills the selected block.
  - Each value goes through the column's `validate`. Cells that aren't editable, or that `validate` refuses, are skipped.
  - One announcement (catalog, the i18n Engineer's words) gives how many cells were pasted and how many skipped.
  - A paste past the last row or column stops at the edge; it adds no rows.
- **Fill:** Ctrl+D copies the selected block's top row down through it. The fill handle (on the block's end corner, logical: the bottom inline-end) drags down or toward the inline-end. No fill-right key: Ctrl+R reloads the page in a browser.
- **Undo:**
  - One undo step is one user action (a typed edit, one paste, one fill). Each step undoes its cells together, by calling `onCellEdit` with the previous values (`source: 'undo'`), and redo the same way (`source: 'redo'`).
  - The history is per grid and holds the last 100 steps. A step whose cells no longer hold the values it left them with (the data changed from outside) ends the history there, so a refetch with the same values keeps it (as built in #612).
- **Every change goes through `onCellEdit`,** once per cell, with `source` saying why. The async rules of ADR 0016 hold per cell: a spinner, and a rejected promise puts the old value back.
  - A paste or fill whose cells partly reject keeps the accepted ones and announces the rejected count.
  - `source` is `'edit'` for a typed edit, so existing apps that ignore it see no change.
- **`TableSettings`** can default `paste`, `fill` and `undo`, like the other `editing` fields; the table's own `editing` wins.
- **No new token:** the fill handle uses the cell-range selection's existing outline tokens and the 4px grid.

## Consequences

- **Semver: MINOR** (three optional fields in `editing`, an optional `source` on the change, new catalog keys). Nothing changes without the flags.
- The issue's wording (`paste`, `fill`, `undo` as props) is met as `editing.paste`, `editing.fill` and `editing.undo`.

## Enforced by

- G3 review of the build PR: the three fields in `editing` (default false), `source` on the change, no new callback.
- The behavior tests: a 3 by 4 paste fills 12 cells; skipped and refused cells are counted and announced; Ctrl+D fills down; the fill handle fills down and toward the inline-end (RTL); one undo restores a whole paste; redo; the flags off change nothing; a partly rejected paste keeps the accepted cells.
