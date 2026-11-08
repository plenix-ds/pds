# ADR 0044: PropertyGroup and PropertyList "variant: tiles" (the owner's read-only look as a named variation)

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on the owner's words relayed on #1043 ("this new look to be registered as a new variation style in the PDS!") and D-0132 (A: a named variation, default unchanged). Decision D-0135 (owner may switch).
- **Issue:** #1043 (S1).
  - Brief: `docs/pds1/slices/1043/brief.md`.
  - Design (G2): `docs/pds1/slices/1043/design.md`. It owns the look, the sizes, the narrow-width rule and the DESIGN.md "Variations" entry. This entry owns the names.

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
  - It falls to one tile per row when the list is too narrow. G2 names the width as a token.
  - The list gets the classes `plx-property-list--stacked plx-property-list--tiles`.
- **With `layout`:**
  - `layout="stacked"` together with `"tiles"` is allowed and changes nothing.
  - `layout="columns"` together with `"tiles"` gets a `devWarn`, and the tiles win.
- **`"default"`:** today's behavior exactly. `layout` defaults to `columns` (D-0107), and `layout="stacked"` is unchanged from 1.2.0 (AC-4, AC-5).

### `PropertyList.Item.status?: { label: React.ReactNode; tone: BadgeProps['tone']; icon: IconValue }`

- It draws the value as a `Badge` with its icon, in every variant and layout.
- **`icon` is required** (owner rule: a status always has its icon, for example check for done, pencil for unsaved, alert for problems).
  - There is no default map. Badge has nine tones (active, waiting, action-required and others) whose meanings are the app's.
  - A missing icon is a type error and a `devWarn`.
- With both `status` and `children`, a `devWarn` fires and `status` wins.
- New class: `plx-property-list__status`.

### Tokens (comp -> sys only; no new colors, per the brief's non-goals)

- `plx-comp.property-list-tiles-column-gap` -> `{plx-sys.space-inline-lg}` (16px).
- `plx-comp.property-list-tiles-row-gap` -> `{plx-sys.space-stack-lg}` (16px).
- `plx-comp.property-list-tiles-min-inline-size`: the width below which tiles go one per row. Its sys target comes from G2's design.md, and it is never a raw value.
- The tile, label, value and heading tokens are the existing `property-list-*` and `property-group-*` tokens.

### Not in this change

- The 1.x default stays `columns` (D-0107). Making `"tiles"` the default is a 2.0.0 question for the owner (brief P2).
- No Panel API. The docs show the variation inside a Panel, using the existing header.

## Consequences

- **Semver: MINOR.** *Added:* `PropertyGroup.variant`, `PropertyList.variant`, `PropertyList.Item.status`, three comp tokens and the classes `plx-property-group--tiles`, `plx-property-list--tiles` and `plx-property-list__status`.
- Nothing changes for apps that don't set `variant` or `status`.
- CTM uses `<PropertyGroup variant="tiles">` on every read-only card, and `status` for its status values (CTM#273).
- DESIGN.md gets a "Variations" entry (G2): its name, D-0132 and D-0135, and when to use it. The docs and the gallery get light, dark, RTL and compact specimens, with visual baselines (check 12).

## Enforced by

- G3 on the build PR: the API diff matches this entry (three props, no others).
- Checks 6 and 7 on the three tokens.
- The build PR's tests (brief AC-1 to AC-6):
  - a `"tiles"` group gives its list the stacked and tiles classes, two tiles per row, with no other props;
  - a list's own `variant` wins over its group's;
  - `status` gives a Badge with its icon;
  - `layout="columns"` with tiles warns and draws tiles;
  - without `variant`, the output is unchanged from 1.2.0 for both layouts;
  - two groups are 40px apart, with a gold heading;
  - RTL mirrors;
  - in dark mode, the label and value measure 4.5:1 or more on the tile;
  - a narrow list shows one tile per row.
- Check 12: visual baselines, light and dark, plus RTL and compact (the change touches density and text).
