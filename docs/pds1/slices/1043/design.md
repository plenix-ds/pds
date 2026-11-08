# #1043 The read-only look as a named variation (G2)

- **Request:** the owner, 2026-11-08: "this new look to be registered as a new variation style in the PDS!"
  - Brief (G1): `brief.md` (PR #1045).
  - Decisions: D-0106 (the look), D-0107 (1.x default stays `columns`), D-0132 (a named variation, not the default).
- **Extends:** `PropertyGroup` and `PropertyList` (`platform/patterns/`), with their existing `layout="stacked"` roles and tokens, and the Panel header (glow and inset divider, #946, #982).
  - There is no new component and there are no new colours or tokens.
  - It follows the grouped Timeline model (D-0115): a variation of an existing part.
- **What it is:** one name that sets the whole D-0106 look, so an app cannot get half of it.
  - The look is defined, value by value, in `docs/pds1/slices/946/design.md` §1, §2 and §4 and in DESIGN.md §3 "Read-only fields". This file does not repeat or change any of those values.
  - It only names the bundle, defines what the name switches on, and lists the specimens.
- **Name:** `variant="tiles"` (proposed in D-0132). G3 (DS Architect) confirms the name and the API shape. If G3 renames it, only the name in this file and in DESIGN.md changes.

## 1. What the variation switches on

| Part | With the variation | Source |
|---|---|---|
| PropertyList inside the group | `layout="stacked"`: porcelain tiles, 1px same-tint border, 6px radius, 8/12px padding, 2 per row (`columnCount` 2), 16px gaps (`space-stack-field`), equal height in a row | 946 §2 |
| One per row when narrow | a tile is never narrower than **240px**. Two tiles fit from a 496px list (240 + 16 + 240), and anything narrower shows one per row. It is an intrinsic grid, `repeat(auto-fill, minmax(max(<min>, (100% - <gap>) / 2), 1fr))`, not a container query, because a container query cannot read a token. Tokens: comp `property-list-tiles-min-inline-size` → **new sys `size-field-tile-min`** → `plx-ref.size-60u` (240px). This replaces 946's 480px container rule for tiles | G3 ask on #1043 |
| Group heading | `group-heading` role, 13px medium, gold (brown-600 light, yellow-300 dark), sentence case, 12px above the list, 40px between groups (`space-stack-group`) | 946 §1–2 |
| Label | `field-label`, 11px regular, navy (blue-700 light, blue-275 dark), sentence case | D-0106 |
| Value | `field-value`, 13px semibold, `content-default`; data values in Reddit Mono at the same size | D-0106 |
| Status value | an existing `Badge` with its icon (size `md`), at the value's start, on the value line. It is never a dot or bare coloured text | owner rule (statuses are badges with an icon) |
| Inside a Panel | nothing extra to set: the Panel header already has the glow and the inset divider in 1.2.x. The docs example puts the variation inside `Panel` | #946, #982, glow corner fix #1031 |

- **Precedence:**
  - `variant="tiles"` on `PropertyGroup` reaches its PropertyList.
  - An explicit `layout` on that PropertyList still wins. A dev warning says the two disagree.
  - `columnCount={1}` on a list stays allowed (long notes, 946 §2).
- **Status values:** the app passes a `Badge` as the value. Whether `PropertyList.Item` gets a `status` shorthand is G3's call. Either way, the look is the Badge above.
- **Without the variation**, nothing changes:
  - `layout="stacked"` renders as in 1.2.0 (AC-4).
  - No layout renders `columns` (D-0107, AC-5).

## 2. State matrix (the variation; the values are 946's)

| State | Tile / pair | Group heading | Panel header |
|---|---|---|---|
| default | 946 §1 tokens | 946 §1 tokens | 946 §1 tokens |
| hover | n/a (static text; a link or control in a value keeps its own hover) | n/a (static) | n/a (the toggle keeps its hover) |
| focus | n/a (not focusable; a link or control in a value keeps the 2px `focus-ring-color` ring, visible on the tile) | n/a | n/a (the toggle keeps its ring) |
| active | n/a (not pressable) | n/a | n/a |
| disabled | n/a (read-only is not disabled, DESIGN.md §9; full contrast) | n/a | n/a |
| loading | **changed by D-0130:** no Skeleton line. The Panel body shows `LoadingState` (spinner and label after 1s, #1032) and the tiles are not drawn until the values arrive. A single late value keeps its tile and label, with an `sm` spinner in the value's place | n/a | n/a (the body loads) |
| error | n/a (no input; a failed load is the body's error with one Retry, `docs/content/messaging.md`) | n/a | n/a |
| selected | n/a (the text can be selected and copied) | n/a | n/a |
| empty | the tile keeps full height and shows the app's empty text in the value style, never blank. A group with no items is not rendered | not rendered with no items | a panel with no values is the app's EmptyState |
| long text | the label wraps between words. The value wraps (`overflow-wrap: anywhere`) and is never cut. Tiles in a row stretch to equal height. A Badge never wraps (it ends in an ellipsis with a Tooltip, D-0010) | wraps | wraps; the icon stays on the first line |

## 3. Densities, light and dark, Arabic

- **Densities** (946 §4): tile padding-block 4 / 8 / 8px and gaps 8 / 16 / 16px (compact / standard / comfortable). Groups are 40px apart at every density. Type does not change.
- **Light and dark:**
  - Label and value are 4.5:1 or more on the tile (946 §1, AC-6).
  - A Badge uses its own soft roles, which are already AA in both themes.
- **Forced colours:** tile borders in `CanvasText`, and no glow.
- **Arabic and RTL:**
  - The tiles fill from the inline start (the right).
  - Labels and values mirror. Data values and `kind="id"` keep their Isolate rules.
  - The Badge icon sits at its inline start.
  - There are no new words.

## 4. Gallery and specimens (P1)

- **Docs site gallery:** one "Read-only tiles" entry under PropertyGroup. It shows a Panel ("CASE SUMMARY") with two groups (four tiles, then two tiles), one status Badge value, one data value and one empty value.
- **Specimens for check 12:** `property-group-tiles`, in light and dark at standard density, compact (density code touched), and RTL (direction and text). Viewports are 1366 and 1920 (946 §7).
- **The owner's study** `docs/read-only-field-study/` (★ preset) is the visual reference. Where the study and DESIGN.md differ, DESIGN.md wins. Its tokens are the source.

## 5. Edge cases

- **3× English:** labels, values and group headings wrap, and the tiles in a row grow to the tallest. Nothing overlaps at 1024×640.
- **An odd number of tiles:** the last tile sits alone at the inline start, at half width. It does not stretch across the row.
- **A list under 496px:** one tile per row (the 240px tile minimum, §1).
- **10,000 rows:** n/a. A PropertyList holds one item's details. Lists of items go in a DataGrid.

## 6. Messages

- None added. Empty text and errors follow `docs/content/messaging.md`, and their wording is the Technical Writer's.

## 7. Choices the engineer must not invent

- **No values of its own:** every value comes from 946 §1, §2 and §4 through the existing `stacked` classes. The variation adds no new CSS values, and must not copy the stacked CSS into a second rule.
- **The name and precedence** as in §1 (ADR 0044, D-0135).
- **The one-per-row width:** `size-field-tile-min` (240px) through the intrinsic grid in §1. No container query and no other breakpoint.
- **Status:** an existing Badge with its icon.
- **Loading:** `LoadingState` (D-0130), never Skeleton.
- **Tests:** AC-1 to AC-6 (brief), plus the odd-tile case and the explicit-`layout`-wins case.

## 8. Evidence

- Ran: read DESIGN.md §3, `docs/pds1/slices/946/design.md`, `PropertyList.tsx`, `PropertyGroup.tsx`, the `Badge` API, and the brief on PR #1045.
- Ran: the 946 loading row (a Skeleton line) is superseded by D-0130. A note was added in 946 §3.
- Planned: the CI visual specimens (§4) on the build PR.
