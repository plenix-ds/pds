# 1043: the owner's read-only look as a named variation

Source: plenix-ds/pds#1043, the owner (2026-11-08, "this new look to be registered as a new variation style in the PDS!"), relayed by ctm3-product-lead. Decisions: D-0106 (the look), D-0107 (1.x default stays columns), D-0132 (this variation). Study: `docs/read-only-field-study/`.

## Goal

- An app gets the whole read-only look by naming one variation, so no card misses it because it didn't know the right prop (CTM#273).

## Already implemented

- `platform/patterns/PropertyList/PropertyList.tsx`: `layout="columns" | "stacked"`. Stacked carries the D-0106 tiles, label and value roles.
- `PropertyGroup` (heading, level, children: one PropertyList): the gold group heading and the 40px gap only between two groups (#980, ADR 0033).
- Panel header: the card heading with the glow and inset divider (#946, #982). The glow corner fix is #1031.
- DESIGN.md §3: the read-only preset.

## P0

- One entry point (G3 names it; for example `<PropertyGroup variant="tiles">`, with the same value accepted by `PropertyList`), which sets the full D-0106 look: tiles 2 per row with 16px gaps, the gold group heading, navy label, semibold value, and a status shown as a Badge with its icon. It's built on the existing `layout="stacked"` roles and tokens, with no new colors.
- **The tile frames the whole field** (label and value together), as in the study. Today 1.2.0 boxes only the value (`.plx-property-list__value` carries the background; `platform/patterns/PropertyList/property-list.css`). #1050 item 1.
- **Two tiles per row** from the variation alone. `PropertyList` has no `columnCount` in 1.2.0, and CTM lays out columns itself with `Columns`. Add the column count (G3 names it; one per row under a 480px container, and `1` stays allowed for long notes). #1050 item 2.
- `layout="stacked"` keeps working (it's the same look). The default stays `columns` in 1.x (D-0107).
- DESIGN.md: a "Variations" entry naming the variation, its decision id and when to use it.
- The component docs and the docs site gallery show it.

## P1

- Visual specimens and baselines (check 12): light, dark, RTL and compact.
- A docs example inside a Panel, showing the header glow and inset divider.

## P2

- Make it the default in 2.0.0, if the owner wants that (D-0107 says a reflowing default is MAJOR).

## Non-goals

- No new colors or tokens beyond comp roles over existing sys tokens.
- No change to the 1.x default.
- No change to editable forms.

## Affected packages

- `@plenix-ds/react` (PropertyGroup, PropertyList), `@plenix-ds/styles`, docs site, DESIGN.md.

## Acceptance

- **AC-1:** Given `<PropertyGroup variant="tiles">` with a PropertyList inside, when it renders, then the list has the stacked tile classes, 2 tiles per row, and the D-0106 label, value and heading tokens, with no other props set.
- **AC-2:** Given a status value, then it shows as a Badge with its icon.
- **AC-3:** Given two groups with the variation, then the gap between them is 40px and the heading is gold (computed style).
- **AC-4:** Given `layout="stacked"` without the variation, then the output is unchanged from 1.2.0.
- **AC-5:** Given no variation and no layout, then PropertyList renders `columns` (D-0107).
- **AC-7:** Given the variation, then the label and the value sit inside one tile (the tile's background and border wrap both), not a boxed value under a bare label.
- **AC-8:** Given the variation in a container wider than 480px, then tiles are 2 per row with no app layout. Under 480px, they're 1 per row.
- **AC-9:** Given a Panel with a title that is not collapsed, then the inset divider shows under the header (it's in 1.2.0 already, hidden only when collapsed; #1050 item 3).
- **AC-6:** Given `dir="rtl"`, then the tiles and labels mirror. Given dark mode, then label and value contrast on the tile is ≥ 4.5:1.

## Anything unclear

| Question | Answer |
|---|---|
| The variation's name | G3 decides (D-0132 proposes `variant="tiles"`). It does not block G1. |
| Default in 1.x? | Answered: no, D-0107 stands unless the owner changes it. |
