# ADR 0025: DataGrid column `description`: the header's tooltip and accessible description

- **Status:** accepted
- **Date:** 2026-11-07
- **Deciders:** pds1-ds-architect (G3), on RedSave's fix request P-70 (#924, triaged from #922). Decision D-0097 (owner may switch).
- **Issue:** #924 (S3)

## Context

- **RedSave** has header titles whose meaning isn't obvious and needs a way to explain them.
- **The rest of P-70** (computed `field`, `headerAlign`) shipped in 0.93.1 (#893). Header labels are always start-aligned (D-0087).
- **DataGridColumn** has no explanatory text today. The column menu's `columnMenu` actions are the app's own (one may be "description", to edit it), not a display.
- **D-0091** is about icon buttons' tooltips and doesn't apply to header titles.

## Options

| Option | For | Against |
|---|---|---|
| **A. `description?: string` on `DataGridColumn`** | Names the content, not the display: the same text is the tooltip and the screen reader's description. Matches Airtable's and Notion's "field description". | None found. |
| B. `tooltip?: string` | Names what sighted people see | Hides that it's also the accessible description; ties the API to one display. |
| C. `headerTooltip?: React.ReactNode` | Rich content | A rich tooltip can't be an accessible description, and invites links and controls in a tooltip. |

## Decision

**Option A** (D-0097; reply B or C on #924 to switch).

- **API:** `DataGridColumn<R>.description?: string`. Plain text, written in the app's language (the app translates it, like `title`). No other prop changes.
- **Behavior:**
  - Hovering the header title, or focusing the header with the keyboard, shows the description in the design system's `Tooltip`, with its usual delays.
  - The header cell gets `aria-describedby` pointing at the description's text, so a screen reader reads it after the title.
  - No icon is added to the header (D-0087's plain headers). A column without a description is unchanged.
  - The tooltip uses logical placement, so it's correct in RTL.
- **Not included:** the static `Table` (its headers aren't focusable) and the `Field` type of the collection panels. Either can follow when an app asks.

## Consequences

- **Semver: MINOR** (a new optional prop).
- Header markup gains one `aria-describedby` only when `description` is set.

## Check

- A behaviour test in `tests/` (plan §7e): hover and keyboard focus show the description; the header's accessible description equals it; a column without one has no `aria-describedby`.
- `tests/fixtures/redsave-types.tsx`: a `DataGridColumn<Row>` with `description` compiles.
