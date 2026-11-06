# ADR 0018: CommandBar with rows selected adds the selection's commands, it doesn't swap

- **Status:** accepted
- **Date:** 2026-11-06
- **Deciders:** pds1-ds-architect (G3), on the owner's decision of 2026-10-19 (plenix-platform#195: "add, don't swap")
- **Issue:** #140 (S3, RedSave P-53)

## Context

- Today (`CommandBar.jsx`, `selection`): while `selection.count` is above 0, the bar holds `selection.actions` **instead of** the page's `actions` (the swap; owner, issue 454, 2026-10-15). Search and the filters already stay.
- RedSave (owner): "when selecting multiple.. i should still be able to do actions". Owner decision, 2026-10-19 (later, so it wins): **add, don't swap.** The selection's commands come first, then a separator, then the page's commands. `"swap"` stays available for small bars, and a command may say whether it shows with a selection.

## Options

| Option | For | Against |
|---|---|---|
| **A. `selection.mode?: 'add' \| 'swap'` (default `'add'`); `actions[].selection?: 'also' \| 'only' \| 'never'` (default `'also'`)** | The owner's words as written; one field on the existing `selection` object, one on each command | Changes the default |
| B. Keep swap as the default, add `'add'` as an option | No default change | Not what the owner decided |
| C. A new `selectionActions` placement prop | — | A second way to say the same thing |

## Decision

**Option A.**

- **`selection.mode?: 'add' | 'swap'`, default `'add'`:**
  - `add`: the bar draws the count and Clear ("× N selected"), the selection's commands, a separator (only when both groups have commands), then the page's `actions` (each filtered by its `selection` field, below), then search and filters. The order and the look are the design's (G2, `docs/pds1/slices/140-commandbar-selection/design.md`).
  - `swap`: today's behavior, the page's actions give way.
  - Search, filters and quick filters stay in both. The `count`, `status` and `end` rules while rows are selected are unchanged.
- **`actions[].selection?: 'also' | 'only' | 'never'`, default `'also'`.** It applies to the page's `actions` while rows are selected:
  - `also`: shown with or without a selection;
  - `only`: shown only while rows are selected (a page command that acts on the selection);
  - `never`: hidden while rows are selected.
  - With `mode: 'swap'`, page actions are hidden whatever their `selection`.
- **Overflow (the design's):** the page's commands fold into More first, then the selection's. More keeps the two groups apart with a divider. The count, Clear and search never fold.
- **Words:** no new catalog keys. The bar's name while rows are selected stays `selection.label` (default "{label} actions").

## Consequences

- **Semver: MINOR, with a *Breaking* entry** (0.x, VERSIONING.md: a changed default that changes existing screens). Bars with a selection now also show the page's commands. To keep the old bar, set `selection.mode: 'swap'`. The changelog says so.
- The CommandBar header's "the swap" text is rewritten, citing this ADR and both owner decisions.
- `BarActions` (BulkActions, the page's actions) follows the same rules, since it draws the commands.

## Enforced by

- G2 (the separator, the order and the fold) and G3 review of the build PR: the two fields as above, the default `'add'`.
- The behavior tests: the add order with the separator; `'only'` and `'never'`; `'swap'` as today; folding into More; RTL.
