# ADR 0044: PropertyGroup and PropertyList "variant: tiles" (the owner's read-only look as a named variation)

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on the owner's words relayed on #1043 ("this new look to be registered as a new variation style in the PDS!") and D-0132 (A: a named variation, default unchanged). Decision D-0135 (owner may switch).
- **Issue:** #1043 (S1).
  - Brief: `docs/pds1/slices/1043/brief.md`.
  - Design (G2, PR #1048, D-0134): `docs/pds1/slices/1043/design.md`. It owns the look, the precedence and the narrow-width rule. This entry owns the names and the tokens.

## Context

- The read-only look (D-0106) exists today only as `PropertyList layout="stacked"`.
  - It draws one tile per row. The owner's study draws two tiles per row with 16px gaps.
  - The default is still `columns` (D-0107), so apps miss the look unless they know the prop (CTM#273).
- `PropertyGroup` already draws the gold group heading and the 40px gap between groups (ADR 0033).
- The Panel header already draws the card heading with the glow and the inset divider (#946, #982). The variation needs no Panel API.
- A status value is whatever the app passes as children. Nothing makes it a Badge with its icon.
- The precedent for a named variation is `Timeline variant: "default" | "grouped"` (ADR 0036, D-0115).

## Options

| Option | For | Against |
|---|---|---|
| **A. `variant?: "default" \| "tiles"` on `PropertyGroup` (passed to its lists) and on `PropertyList`; plus `PropertyList.Item.status`** | One name sets the whole look, the same way Timeline's variation does. A group sets it once for its list. `layout` keeps its meaning. | Two props named `variant`, kept in step. |
| B. A third layout, `layout="tiles"`, on PropertyList only | One prop | It mixes a look with a layout axis. PropertyGroup can't set it, so every list still has to know the value. |
| C. `variant="read-only"` | Names the use | Every PropertyList is read-only, so the name doesn't tell the looks apart. "Tiles" is the word DESIGN.md and D-0106 use. |

## Decision

**Option A** (D-0135; reply B or C on #1043 to switch).

### `PropertyGroup.variant?: "default" | "tiles"` (default `"default"`)

- With `"tiles"`, the group adds the class `plx-property-group--tiles` and gives the variation to every `PropertyList` inside it.
- It passes it through an internal context, which is not exported.
- The heading, its level and the 40px gap are unchanged. They are already the D-0106 look.

### `PropertyList.variant?: "default" | "tiles"` (default: the enclosing group's variant, else `"default"`)

- An explicit `variant` on the list wins over its group's.
- **`"tiles"`:**
  - It is the D-0106 look in one go: `layout="stacked"` items, each on a porcelain tile, **two tiles per row** with the variation's gaps, the navy label and the semibold value.
  - It falls to one tile per row when the list is too narrow: a tile is never narrower than `size-field-tile-min` (240px).
  - That is an intrinsic grid (G2 §1), not a container query.
  - It reuses the stacked classes and adds no CSS values of its own (G2 §7).
  - The list gets the classes `plx-property-list--stacked plx-property-list--tiles`.
- **With `layout`** (G2 design §1, D-0134):
  - An explicit `layout` on the list wins over the variation, and a `devWarn` says the two disagree.
  - `layout="stacked"` with `"tiles"` agrees, so it gets no warning.
- **`"default"`:** today's behavior exactly. `layout` defaults to `columns` (D-0107), and `layout="stacked"` is unchanged from 1.2.0 (AC-4, AC-5).

### `PropertyList.Item.status?: { label: React.ReactNode; tone: BadgeProps['tone']; icon: IconValue }`

- It draws the value as a `Badge` with its icon, in every variant and layout.
- **`icon` is required** (owner rule: a status always has its icon, for example check for done, pencil for unsaved, alert for problems).
  - There is no default map. Badge has nine tones (active, waiting, action-required and others) whose meanings are the app's.
  - A missing icon is a type error and a `devWarn`.
- With both `status` and `children`, a `devWarn` fires and `status` wins.
- New class: `plx-property-list__status`.
- Tile classes set by a tiles list on its parts (build #1059): `plx-property-list__item--tile` and `plx-property-list__value--tile`.

### Tokens (ref -> sys -> comp; no new colors, per the brief's non-goals; G2 §1)

- `plx-sys.size-field-tile-min` -> `{plx-ref.size-60u}` (240px): the narrowest read-only tile.
- `plx-comp.property-list-tiles-min-inline-size` -> `{plx-sys.size-field-tile-min}`.
- `plx-comp.property-list-tiles-gap` -> `{plx-sys.space-stack-field}` (16px), both axes.
  - In `components.density-compact.tokens.json` it is `{plx-sys.space-stack-sm}` (8px).
- `plx-comp.property-list-tiles-padding-block` -> `{plx-sys.space-inset-sm}` (8px): the tile's block padding in tiles lists only (G2 review on #1059, 946 §4).
  - In `components.density-compact.tokens.json` it is `{plx-sys.space-inset-xs}` (4px).
  - Plain `stacked` keeps `property-list-value-padding-block` (`space-inset-xs`, 4px), so AC-4 holds.
- `plx-comp.property-list-tiles-padding-inline` -> `{plx-sys.space-inset-md}` (12px) at every density, so it has no compact override (G2 on #1059: D-0106 sets the tile at 8px by 12px).
  - Plain `stacked` keeps `property-list-value-padding-inline` (8px).
- Standard and comfortable use the base values. Groups stay 40px apart at every density.
- The tile, label, value and heading tokens are the existing `property-list-*` and `property-group-*` tokens.
- The build PR adds these three tokens together with the CSS that reads them, because CI rejects a token that nothing reads. G3 labels that PR `agent:pds1-ds-architect` for the ownership check.

### Not in this change

- **No `columnCount` prop.** G2 §1 mentions `columnCount={1}` (946 §2), but PropertyList has no such prop on `main`. A one-per-row option for long notes needs its own ADR entry first.
- The 1.x default stays `columns` (D-0107). Making `"tiles"` the default is a 2.0.0 question for the owner (brief P2).
- No Panel API. The docs show the variation inside a Panel, using the existing header.

## Consequences

- **Semver: MINOR.** *Added:* `PropertyGroup.variant`, `PropertyList.variant`, `PropertyList.Item.status`, one sys and four comp tokens, with two compact overrides and the classes `plx-property-group--tiles`, `plx-property-list--tiles` and `plx-property-list__status`.
- Nothing changes for apps that don't set `variant` or `status`.
- CTM uses `<PropertyGroup variant="tiles">` on every read-only card, and `status` for its status values (CTM#273).
- DESIGN.md gets a "Variations" entry (G2): its name, D-0132 and D-0135, and when to use it. The docs and the gallery get light, dark, RTL and compact specimens, with visual baselines (check 12).

## Enforced by

- G3 on the build PR: the API diff matches this entry (three props, no others).
- Checks 6 and 7 on the five new tokens and the two compact overrides.
- The build PR's tests (brief AC-1 to AC-6):
  - a `"tiles"` group gives its list the stacked and tiles classes, two tiles per row, with no other props;
  - a list's own `variant` wins over its group's;
  - `status` gives a Badge with its icon;
  - an explicit `layout="columns"` with tiles warns, and `columns` wins;
  - an odd last tile sits alone at the inline start, at half width (G2 §5);
  - without `variant`, the output is unchanged from 1.2.0 for both layouts;
  - two groups are 40px apart, with a gold heading;
  - RTL mirrors;
  - in dark mode, the label and value measure 4.5:1 or more on the tile;
  - a narrow list shows one tile per row;
  - the computed tile padding is 8px by 12px and the gap is 16px in standard; in compact, 4px by 12px and 8px.
- Check 12: visual baselines, light and dark, plus RTL and compact (the change touches density and text).
