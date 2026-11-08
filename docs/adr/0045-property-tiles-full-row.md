# ADR 0045: PropertyList tiles "columnCount" and Item "span" (long text across the full row)

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on #1052 (pds1-product-lead) and #1053 (pds1-design-director, design `docs/pds1/slices/1043/design.md` §1), which ask for the same thing. Decision D-0136 (owner may switch).
- **Issues:** #1052 (S2) and #1053 (S3). This extends ADR 0044 (`variant="tiles"`, #1043) and changes nothing in it.

## Context

- The tiles variation draws two tiles per row, and one when the list is narrower than 496px (ADR 0044).
- The owner's study (`docs/read-only-field-study/`) puts long values (notes, grounds, a recommendation) in a list whose tiles each take the full row. It does this with `dl.one`, which sets `--cols: 1`.
- `PropertyList` has no such option. `columnCount`, mentioned in design §1 (from 946 §2), does not exist on `main`.
- A `PropertyGroup` holds one PropertyList (ADR 0033). So a group that mixes short fields and one long field can't use a second list, and it needs a per-item option too (#1052 AC-1).

## Options

| Option | For | Against |
|---|---|---|
| **A. List `columnCount?: 1 \| 2` and item `span?: "full"`, both only with tiles** | The list option is the study's `dl.one` and design §1. The item option covers a mixed group without breaking the one-list rule. | Two small props. |
| B. The list option only | One prop | A group with one long field must split into two groups, which changes the outline. |
| C. The item option only | One prop | An all-long list marks every item. The study's list-level switch has no match. |

## Decision

**Option A** (D-0136; reply B or C on #1052 to switch).

### `PropertyList.columnCount?: 1 | 2` (default `2`)

- It applies only with `variant="tiles"`. Set without it, a `devWarn` says it is ignored.
- **`1`:** every tile takes the full row, at every width.
- **`2`:** today's ADR 0044 grid, which still falls to one per row below the tile minimum.
- **Class:** `plx-property-list--single` (only with `1`).
- The name is `columnCount`, not `columns`, because `layout="columns"` already means the label-beside-value layout.

### `PropertyList.Item.span?: "full"`

- In a tiles list with two columns, the item's tile spans the whole row (`grid-column: 1 / -1`). The tiles around it stay two per row (#1052 AC-1).
- It is an enum, so it can grow later (for example a fixed span), without a second prop.
- Outside a tiles list, or with `columnCount={1}`, it changes nothing, with no warning, because the tile already takes the row.
- **Class:** `plx-property-list__item--full`.

### Both

- **No new tokens or values.** The tile, gap and minimum width are ADR 0044's (`property-list-tiles-*`).
- **RTL:** these are grid-placement rules only, so the layout mirrors with the page (AC-2).

## Consequences

- **Semver: MINOR.** *Added:* `PropertyList.columnCount`, `PropertyList.Item.span` and two classes. Nothing changes without them.
- It ships with #1043 in 1.3.0. The build that ships ADR 0044 builds both.
- CTM puts long text in a full-row tile, as the study does.

## Enforced by

- G3 on the build PR: the API diff matches ADR 0044 and this entry.
- The build PR's tests:
  - `columnCount={1}` gives one tile per row at 1366px;
  - in a two-column tiles list, `span="full"` spans the row and the others stay two per row;
  - `columnCount` without tiles warns and changes nothing;
  - RTL mirrors.
- Check 12: the gallery specimen `property-group-tiles` gains one full-row tile (design §4).
