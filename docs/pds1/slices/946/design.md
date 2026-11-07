# #946 Read-only fields and card headings: the owner's preset (G2)

- **Request:** the owner, 2026-11-07. He chose the ★ preset of CTM's read-only field study (CTM D-0050, LighthouseCollection/CTM#216, `docs/design/read-only-field-study.html`) as the Plenix default. It is recorded as **D-0106** (#965).
- **Replaces:** option B (the Fluent 2 field, D-0101) and the 15px value and 20px gap set in this file before. D-0103 (ADR 0030) is amended on the values below. Its role and token *names* stay.
- **Extends:** `PropertyList` (`platform/patterns/PropertyList`), the read-only region (`platform/system/read-only.css`, `<ReadOnly>`) and the `Panel` header (`platform/components/Card/card.css`, `.plx-panel__header`). There is one new part, `PropertyGroup`, which is a heading over a list.
- **Reading applied (D-0107, decision card on #946):**
  - Tiles go on `layout="stacked"` and on read-only controls. `columns` gets the new label and value type and colour, without tiles. The default layout stays `columns` until 2.0.0 (VERSIONING: changing a default that reflows screens is MAJOR). CTM already passes `layout="stacked"`.
  - The card heading style goes on the **Panel** header (the card with a header band and divider). The compact `Card` title is unchanged.

## 1. Levels (light / dark)

| Level | Type | Colour, light | Colour, dark | Contrast (light / dark) |
|---|---|---|---|---|
| Card heading (Panel title) | 14px (`font-size-300`), bold 700, line 20px, UPPERCASE, tracking `letter-spacing-caps` (0.06em) | `content-default` (gray-900) | `content-default` (gray-200) | 11.6 / 8.0 |
| Card heading icon | `control-icon-standard`, `currentColor` | as heading | as heading | ≥ 3 (UI) |
| Group heading | 13px (`font-size-200`), medium 500, line 20px, sentence case, no line | **gold** = `plx-ref.color-brown-600` | **gold** = `plx-ref.color-yellow-300` | 6.8 on white / 5.7 on gray-800 |
| Field label | **11px**, regular 400, line 16px, sentence case | **navy** = `plx-ref.color-blue-700` | **navy** = `plx-ref.color-blue-275` | 6.8 / 5.5 on the tile |
| Field value | 13px (`font-size-200`), semibold 600, line 20px | `content-default` (gray-900) | `content-default` (gray-200) | 11.6 / 7.5 on the tile |
| Data value (`data`) | Reddit Mono 13px, 600, line 20px, `tabular-nums` | as value | as value | as value |
| Tile fill | n/a | **porcelain** `#fbfaf9` (new ref) | **porcelain dark** `#484847` (new ref) | n/a |
| Tile border, 1px | n/a | **porcelain border** `#edebe8` (new ref) | **porcelain border dark** `#555350` (new ref) | decorative; the text carries the field |
| Header glow | `linear-gradient(to block-end, tile fill, surface)` over the header box only | tile fill → `surface-default` | tile fill → `surface-default` | n/a |
| Header divider | `border-width-thin`, inset by `panel-header-padding-inline` on both sides | `border-subtle` | `border-subtle` | decorative |
| Status in a value | Badge with its icon (DESIGN §1). Never a dot (the study's dot is not Plenix) | badge tokens | badge tokens | badge rule |

- **Token names and values are G3's** (PR #969, ADR 0032, D-0109; final): `read-only-tile`, `read-only-tile-border`, `read-only-glow`, `read-only-label`, `read-only-group-heading`, the type roles `text-field-label-*`, `text-field-value-*`, `text-group-heading-*` and `text-card-heading-*`, and `space-stack-group` (40px). The new refs are `porcelain-50/-200/-750/-800`, owner-approved under D-0106. Gold, navy and both inks are existing refs.
- **Read-only controls** in `<ReadOnly>` re-point `read-only-background` and `read-only-border` to the tile and its border.
- **More contrast:** the tile border becomes `border-strong` (G3).
- **Type floor:** only the field label (11px) is below 12px. It is D-0106's exception for this one role. 13px is above the floor. The study only flags it under its 14px readability advice, so it needs no exception.
- **Rules that come with it** (D-0106): the label is lighter than its value (regular against semibold, 11 against 13). Label and value are ≥ 4.5:1 on the tile in both themes (the table above). No two levels share a look.

## 2. Layout

| | Stacked (tiles) | Columns (dense panes) |
|---|---|---|
| Grid | `columnCount` 2 (default) or 1; 16px column gap (`space-inline-lg`); collapses to 1 column below a 480px container (container query) | unchanged: label column + value |
| Between tiles (block) | 16px: **`space-stack-field` is 16px** (the preset's gap; it was 20px) | padding-block 4 / 8 / 12px by density (unchanged) |
| Tile | radius 6px (`shape-sm`), padding-block 8px, padding-inline 12px, 1px tile border | no tile; `border-subtle` hairline between pairs (unchanged) |
| Label → value | 4px (`space-stack-xs`) | label column gap (unchanged) |
| Tile height | 8 + 16 + 4 + 20 + 8 + 2 = 58px for one line, equal in a row (`align-items: stretch`) | n/a |

- **New prop:** `columnCount?: 1 | 2` on `PropertyList`, stacked only (MINOR). Long text, such as notes or grounds, goes in its own `columnCount={1}` list, like the study's single-column list.
- **PropertyGroup** (new, MINOR): `<PropertyGroup heading="Parties" headingLevel={3}>` wraps one PropertyList.
  - The heading sits 12px above the list (`space-stack-md`).
  - There are **40px between groups** (`space-stack-group`), set on the block-start of each group except the first. The first group starts at the panel's body padding.
- **Panel header:** padding is unchanged (`panel-header-padding-block/-inline`). The full-width `border-bottom` is replaced by the inset divider. The glow fills the header box and does not reach under the body. A collapsed panel shows no divider, as today, and keeps its glow.

## 3. State matrix

| State | PropertyList tile / pair | Panel header | PropertyGroup heading |
|---|---|---|---|
| default | §1 tokens | §1 tokens | §1 tokens |
| hover | n/a (static text; no hover fill. A link or control in a value keeps its own hover) | n/a (the existing toggle keeps its hover) | n/a (static) |
| focus | n/a (not focusable; a link or control in a value keeps `focus-ring-color` 2px, offset 2px, which is visible on the tile) | n/a (the toggle keeps its ring) | n/a |
| active | n/a (not pressable) | n/a (the toggle keeps its press) | n/a |
| disabled | n/a (read-only is not disabled, DESIGN §9; the value keeps full contrast) | n/a | n/a |
| loading | the tile keeps its size and holds a Skeleton line of 20px in place of the value. The label stays | n/a (the body loads) | n/a |
| error | n/a (no input. An invalid value is the app's Badge or Notice, `docs/content/messaging.md`) | n/a | n/a |
| selected | n/a (not selectable; the text can be selected and copied) | n/a | n/a |
| empty | the tile stays at full height. The value shows the app's empty text (wording is the Technical Writer's, e.g. "None recorded") in the value style, never blank | n/a | a group with no items is not rendered |
| long text | the label wraps between words. The value wraps (`overflow-wrap: anywhere`) and is never cut. Tiles in a row stretch to equal height | the heading wraps, never cut. The icon stays on the first line (`align-items: flex-start`) | wraps |

## 4. Densities, themes, Arabic

- **Type and colour do not change with density.**
  - Tile padding-block is 4 / 8 / 8px (compact / standard / comfortable).
  - The gap between tiles is 8 / 16 / 16px.
  - The gap between groups is 40px at every density.
- **Light and dark:** §1 gives every value for both themes. Contrast is computed against the tile, the surface and gray-800.
- **Forced colours:** tiles show `CanvasText` borders, and the glow is dropped (`background-image: none`).
- **Arabic:** the RTL check runs, because the sizes change.
  - The heading's `text-transform` has no effect in Arabic, and **letter-spacing is 0 under `:lang(ar)`** so the letters still join.
  - Logical properties only (`inset-inline`, `to block-end`).
  - IBM Plex Sans Arabic takes the same roles.
  - `data` and `kind="id"` values keep their Isolate behaviour.

## 5. Edge cases

- **3× English:** labels and values wrap, and tiles grow to the tallest in their row. Panel headings wrap. Nothing overlaps at 1024×640, 1366 or 1920.
- **Empty values:** see `empty`. A whole panel with no values is the app's EmptyState.
- **10,000 rows:** n/a. A PropertyList holds one item's details. Lists of items are a DataGrid.

## 6. Messages

- None added. Empty text and errors follow `docs/content/messaging.md`, and their wording is the Technical Writer's.

## 7. Choices the engineer must not invent

- Every value in §1, §2 and §4. No other gap, padding, colour or size.
- The glow is a gradient between two tokens. It is not an inline style, and it has no extra stop.
- The divider is inset by exactly the header's padding-inline.
- The icon uses `currentColor`. There is no icon in a box.
- Tests (CE, D-0106 check): label and value ≥ 4.5:1 on the tile in light and dark. Visual baselines at 1366 and 1920, light and dark at standard density, plus RTL.
