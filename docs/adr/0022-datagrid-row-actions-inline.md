# ADR 0022: DataGrid shows row actions as icons on hover; `inline` on a row menu item

- **Status:** accepted
- **Date:** 2026-11-06
- **Deciders:** pds1-ds-architect (G3), on the Design Director's design (G2, #836) for the owner's rule (D-0087, #800)
- **Issue:** #800 (S1, AC-5)

## Context

- The owner's rule (D-0087): on a wide grid with room, the row's actions are icons only, at the inline end, shown on row hover. With no room, they are the ⋮ menu, pinned to the inline-end edge.
- DataGrid already has `rowMenu: DataGridMenuAction<R>[]`: each item has `label`, `icon`, `onSelect`, `danger`, `disabled` and `separator`. A `kind: "actions"` column already shows row buttons while the row is hovered or selected.
- The design (`docs/pds1/slices/800-column-fit/hover-actions.md`, #836) takes the inline icons from `rowMenu`. It shows, in order, the items that have an icon and aren't `danger`, at most three. Delete always stays in ⋮. An app can override that per item.

## Options

| Option | For | Against |
|---|---|---|
| **A. One optional field on the menu item: `inline?: boolean`** | The choice sits beside the item it is about; no new DataGrid prop; the default (the design's rule) needs nothing | One more field on `DataGridMenuAction` |
| B. A DataGrid prop `rowActions` (a second list) | Separate from the menu | Two lists of the same actions that drift apart; more API |
| C. No override, only the design's rule | No API at all | An app can't keep an item out of the row (or put a non-default one in) |

## Decision

**Option A** (D-0090).

- `DataGridMenuAction<R>` gains `inline?: boolean`.
  - **Unset (the default):** the design's rule. The item shows inline when it has an `icon`, isn't `danger`, isn't a `separator`, and is among the first three such items.
  - **`inline: false`:** never inline, always in ⋮.
  - **`inline: true`:** inline when it has an `icon` (an item without an icon can't be icon-only, so it stays in ⋮). It still counts toward the three.
  - **A `danger` item is never inline, whatever `inline` says.** A destructive action always stays in ⋮, after its divider (hover-actions.md §1, fit-and-overflow §3), so a misclick on a hovered row can't delete. `inline: true` on a `danger` item is ignored, and it warns once in development.
- No other prop changes.
  - A `kind: "actions"` column keeps its behavior.
  - On touch, the ⋮ always shows instead.
  - With no room, every inline icon folds into the ⋮ together.
- The behavior (hover, focus within, selected, hidden without moving anything, one Tab stop) is the design's, tested by AC-5's behavior tests.

## Consequences

- **Semver: MINOR.** A new optional field (*Added*), and the inline icons are *Changed (visual)* for grids with a `rowMenu`. Nothing is removed. An app that wants the old look sets `inline: false` on its items.
- `DataGridColumnMenuAction` (the column header menu) doesn't get the field. It has no hover icons.

## Check

- G3 on the build PR: the diff adds only `inline?: boolean` to `DataGridMenuAction`, and no other prop or token. CI's `types` check sees no new `any`.
- The AC-5 behavior tests in `docs/pds1/slices/800-column-fit/brief.md`, including one where a `danger` item with `inline: true` stays in ⋮.
