# ADR 0056: Compact person cards: MetricCard `type="person" layout="tile"`, and WidgetGrid `itemSize="sm"` for 5–6 per row

- **Status:** accepted
- **Date:** 2026-11-10
- **Deciders:** pds1-ds-architect (G3), on the owner's request (chat, 2026-11-10, #1240, D-0166). G2 (`pds1-design-director`) owns the look and the values.
- **Issue:** #1240 (S2).

## Context

- `MetricCard type="person"` draws:
  - a header (the name and role);
  - a divider;
  - a large picture (about 96px) beside a large value.
- Each card is about 240px tall, and 4 fit per row. The owner: "it takes up so much space for nothing… an adjustment to our cards to be more practical with spacing", not a patch.
- **The reference the owner likes** is about 160px tall, with 6 per row:
  - a 48px rounded-square photo beside the name (bold, up to 2 lines) and the role (muted);
  - an inset divider;
  - the count small at the inline end (the number in the data font, the unit a small uppercase label).
- `MetricCard.layout` already has `"tile"`: no header, the title, then the value at the end. Today it ignores `person` (no picture).
- `WidgetGrid columns="auto"` uses `repeat(auto-fill, minmax(size-70u, 1fr))`, a 280px minimum, so 3–4 fit at 1366px.
- **VERSIONING.md and D-0107:** a default that reflows existing screens is MAJOR. A new look is opt-in in 1.x and becomes the default in 2.0.0.

## Options

| Option | For | Against |
|---|---|---|
| **A. `type="person" layout="tile"` is the compact person card; WidgetGrid `itemSize?: "md" \| "sm"` sets the minimum column width (`"sm"` lets 5–6 fit), with at most 6 columns; both opt-in in 1.x, the person default becomes the tile in 2.0.0** | No new prop on MetricCard: `tile` already means "compact, the value at the end". CTM sets two props. The default doesn't reflow other apps in a MINOR. | The person default changes only in 2.0.0. |
| B. Change the person default now | What the owner's words favor | A reflowing default in a MINOR (VERSIONING.md, D-0107). |
| C. A new `density` prop on MetricCard | Explicit | A second axis that overlaps `size` and `layout`. |

## Decision

**Option A** (the default switch in 2.0.0 is recorded here; the owner may ask for it sooner as a MAJOR).

### MetricCard

- **`type="person" layout="tile"`:** the compact person card (G2's design for the values):
  - a row with the `person` picture (Avatar, about 48px, a rounded square, initials when there is no `src`, the existing `gender`), then the name (the title, bold, up to 2 lines) over the role (the context, muted);
  - an inset divider;
  - the value at the inline end: `value` in the data font, sized down from the hero metric, with `unit` as a small label after it;
  - an empty or hidden value shows the existing empty treatment (`–`, or the app's `value="Hidden"` in the muted text);
  - RTL mirrors through logical properties.
- **Classes:** `plx-metric-card--person-tile` on the root, and the parts `__person-row`, `__person-text` and `__person-value` (the BEM names; G2 may rename them in the design, before the build).
- **Comp tokens:** `metric-card-person-tile-*` (the photo size, the gaps, the value size, the unit size), comp -> sys over existing refs, to G2's values. The value's font is the data role (`type-roles.json`: data, ADR 0055).
- **Other types with `layout="tile"`:** unchanged.
- **Without `layout`:** the person card is unchanged in 1.x.

### WidgetGrid

- **`itemSize?: "md" | "sm"`**, default `"md"` (today's 280px minimum, unchanged).
  - `"sm"`: a smaller minimum column width (new comp token `widget-grid-item-min-width-sm`, over an existing `plx-ref.size-*` step G2 picks, about 176–200px), capped at 6 columns, so 5–6 fit from 1366px to 1920px.
  - `columns={2|3|4}` still wins when it is set.
- **Class:** `plx-widget-grid--item-sm`.

### 2.0.0

- `type="person"` defaults to `layout="tile"`, and the old person layout stays as `layout="stacked"`. This is listed in VERSIONING's 2.0.0 notes.

## Consequences

- **Semver: MINOR (1.7.0).** Added: the person tile, its classes and tokens, `WidgetGrid.itemSize`, its class and token. Nothing changes without the new props. No deprecation.
- **CTM** sets `layout="tile"` on its council MetricCards and `itemSize="sm"` on the WidgetGrid: two props, no CSS.

## Enforced by

- G3 on the build PR: the API diff matches this entry.
- Checks 6 and 7: the tokens are comp -> sys, with no values in their names. `type-roles`: the person value's font is data.
- Behavior tests (#1240):
  - the tile shows the picture beside the name and role, with the value at the inline end;
  - initials show without `src`;
  - an empty value shows the empty treatment;
  - RTL mirrors;
  - a WidgetGrid with `itemSize="sm"` holds 5 columns at 1366px and 6 at 1920px;
  - the default `"md"` keeps today's count;
  - the default person card is unchanged.
