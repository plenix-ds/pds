---
# PDS design contract, v0 (Phase 0, D-0004). Lint checks 1-12 (plan §7) read this front matter
# and design.rules.json. Values are the ones in platform/tokens today, unless a line says "defect".
version: 0
status: active
owner: pds1-design-director
tokens: platform/tokens          # moves to tokens/ with the monorepo scaffold (#178)
radius:                          # D-0005
  scale_px: [0, 2, 4, 6]
  circle: true                   # allowed by D-0005; no Platform part uses it today
  round_mark_px: 6               # dots, tracks, markers, grabbers: plx-sys.shape-mark (owner, 2026-10-27; shape-pill is its deprecated alias)
  pill_px: 4
  table_px: 2
type:                            # D-0006
  family:
    text: DM Sans
    data: Reddit Mono            # numbers in data only, never in prose
    arabic: IBM Plex Sans Arabic
    arabic_title: Readex Pro
  min_px: 12
  roles:                         # px; size / weight / line height
    caption:   { size: 12, weight: 400, line: 1.5 }   # defect: 11 today, fixed to 12
    eyebrow:   { size: 12, weight: 700, line: 1.5, tracking: widest }  # defect: 11 today, fixed to 12
    secondary: { size: 12, weight: 400, line: 1.5 }
    label:     { size: 12, weight: 600, line: 1.5 }
    body:      { size: 13, weight: 400, line: 1.5 }
    heading:   { size: 13, weight: 600, line: 1.5 }
    lead:      { size: 15, weight: 400, line: 1.7 }
    surface-title: { size: 15, weight: 700, line: 1.5 }  # dialog and sheet titles, as drawn today (#122)
    title:     { size: 20, weight: 700, line: 1.5 }
    display:   { size: 20, weight: 600, line: 1.3, tracking: tight }
    field-label: { size: 12, weight: 600, line_px: 16 }  # read-only label (D-0101, #946)
    field-value: { size: 15, weight: 400, line_px: 24 }  # read-only value, stacked layout (D-0101, #946)
  allowed_sizes_px: [12, 13, 14, 15, 18, 20, 24, 28, 36]
density:                         # D-0007; "standard-comfortable" is retired
  modes: [compact, standard, comfortable]
  default: standard
  control_height_px:   { compact: 24, standard: 32, comfortable: 36 }
  inline_height_px:    { compact: 24, standard: 28, comfortable: 32 }
  dialog_height_px:    { compact: 36, standard: 36, comfortable: 40 }
  row_height_px:       { compact: 36, standard: 40, comfortable: 48 }
  table_font_px:       { compact: 12, standard: 13, comfortable: 13 }
space:
  grid_px: 4
  scale_px: [4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 64]
motion:
  durations_s: { instant: 0.08, quick: 0.12, fast: 0.15, base: 0.2, slow: 0.25 }
  loops_s: { fast: 0.7, base: 1.1, slow: 1.4 }
  easing: { standard: ease, enter: "cubic-bezier(0.2, 0, 0, 1)" }
  press_scale: 0.98
  reduced_motion: all durations 0 (reference.reduced-motion.tokens.json)
  forbid: ["transition: all"]
icons:                           # D-0011
  set: Material Symbols Sharp
  weight: 300
  colour: currentColor
  sizes_px: { xs: 12, sm: 16, md: 20, lg: 24, xl: 48 }
  mirror_in_rtl: platform/icons/layout.js MIRROR list
colour:                          # D-0008, D-0009
  accent: plx-ref.color-blue-400 # sys.brand-primary; the default theme
  contrast_min: { text: 4.5, large_text: 3, ui_boundary: 3 }
  themes: [light, dark]
  new_colours: forbidden         # exception: gray-250 (owner)
focus:
  ring: { colour: plx-sys.focus-ring-color, width_px: 2, offset_px: 2 }
states: [default, hover, focus, active, disabled, loading, error, selected]
---

# PDS design contract (DESIGN.md)

This file records the PDS design language as it is today (D-0004). It is a record, not a redesign.

- The front matter holds the scales. Lint checks 1 to 12 (plan §7) read it, together with `design.rules.json`.
- Tokens live in `platform/tokens/` (DTCG JSON), in tiers ref → sys → comp. They move to `tokens/` with the monorepo scaffold.
- Defects inside these definitions get fixed as bugs: contrast below AA, wrapping, uneven heights, sizes below 12px. Section 12 lists the open ones.
- Any change to the look needs a new owner decision in `decisions.yaml`.
- Existing standards still apply and are not repeated here: `platform/standards/fit-and-overflow.md` (content that does not fit), `platform/standards/icons.md` (drawing rules), `docs/pills-and-colors.md` (pill and category colours), `docs/i18n/arabic.md` (Arabic).

## 1. Character

- Quiet, dense, work-focused UI for data-heavy applications. Fluent-style controls on near-white surfaces, with one blue accent.
- **Buttons** and menu commands are Fluent 2 style (D-0023): 1px borders, 4px corners; filled primary in the accent colour, outlined secondary, ghost for toolbars.
- **No icon in a box** (D-0024). By default an icon is never drawn on its own tinted tile; a box stays only where a specific usage calls for it.
- **Footers have no fill** (D-0102, #948). Save and Cancel sit at the end, on the surface of the card, form or dialog that holds them, never on a grey band. A hairline separates them only where content passes under or scrolls behind them (a sticky bar, a dialog whose body scrolls). Details: `docs/pds1/slices/948/design.md`.
- **No action links.** An action is a Button, never a text link. Links only navigate.
- **Statuses are badges with an icon,** never a bare coloured dot. A dot only shows presence (online/away).
- **Table header labels are start-aligned** (left in LTR, right in RTL), including the header of a number column.
- **Logical properties only:** `inline-start` and `inline-end`, never left and right. That is what makes RTL work.
- **Colours only through tokens.** No hex, rgb or named colours outside `plx-ref`. No inline styles, except in the rich-text engine and in ECharts options built from token values. No `!important`.

## 2. Colour

- The accent is `plx-ref.color-blue-400` (#2a6fdb), exposed as `plx-sys.brand-primary` and `plx-sys.accent-*`. Its current use is the default theme (D-0008). Theming comes later.
- Components read `plx-sys` roles (`surface-*`, `content-*`, `border-*`, `state-*`, `feedback-*`, `accent-*`), never `plx-ref` colours directly (check 6).
- Text roles, from strongest to weakest: `content-strong`, `content-default`, `content-muted`, `content-subtle`, `content-disabled`. Disabled text is the only role allowed below 4.5:1.
- Feedback has five tones: neutral, info, success, warning, danger. Each tone has `solid`, `on-solid`, `solid-label`, `soft`, `soft-border` and `content`.
- Category colours (19) and status pills follow `docs/pills-and-colors.md`.
- **Contrast** (check 8): every text role pairs with every surface it can sit on, in light and dark: `surface-canvas`, `-default`, `-raised`, `-sunken`, `state-hover`, `state-selected`. Each pair is at least 4.5:1, or 3:1 for text at 18px and up (or 14px bold and up). Control boundaries (`field-border`, `control-border`) are at least 3:1. Decorative dividers (`border-subtle`, `border-divider`) are exempt.

### Dark mode (D-0009)

- Dark mode stays as defined. The canvas is `plx-ref.color-black`, and the default and raised surfaces are `gray-800` (#444444).
- Only contrast defects get fixed. Dark mode is worked last (D-0025): its defects are listed in section 12 and fixed after the light work is done.

## 3. Type (D-0006)

- **DM Sans** for all text. Arabic falls back to IBM Plex Sans Arabic, and Arabic titles to Readex Pro.
- **Reddit Mono** (`plx-sys.font-data`) is for numbers in data: grid and table cells, metrics, counts in data views, codes and IDs. It is also used for code.
- **Never mono in prose.** "7 events" in a sentence, a heading or a button stays in DM Sans. Numbers there use `font-variant-numeric: tabular-nums` only when they need to line up.
- Sizes come only from the type roles in the front matter (check 3). No numeric `font-size` in CSS. Nothing below 12px. `font-size-09`, `-10` and `-11` are retired (section 12).
- **surface-title** (15px, 700) is the title of a dialog or a sheet, recorded as Plenix draws it today (#122). Page and section titles use **title** (20px).
- Body and heading are both 13px. Hierarchy comes from weight (400 → 600) and from title or display (20px). That is the existing language, recorded as is.

### Read-only fields (D-0101, #946)

- A read-only label and its value never share a look. The label is quieter in colour and stronger in weight, and the value is larger. This is the Fluent 2 field (D-0078).
- **Stacked (recommended for read-only details; the default from 2.0.0, ADR 0030):** the label above its value.
  - The label uses **field-label**: 12px, semibold, 16px line, `content-muted`.
  - The value uses **field-value**: 15px, regular, 24px line, `content-default`. A data value is Reddit Mono at 15px.
  - The label sits 4px above its value. Pairs are 20px apart (`space-stack-field`) at every density.
- **Columns (`layout="columns"`, the default in 1.x, for dense panes):** the label column and the value on one line.
  - The label is **field-label**. The value is **body** (13px, 20px line).
  - A `border-subtle` hairline separates the pairs, with none after the last.
  - Each pair has 4 / 8 / 12px of padding-block, by density.
- **Inside `<ReadOnly>`**, a Field's label takes **field-label**. Its value stays in the sunken read-only control at the control's size, so heights don't change.
- A value wraps between words. It is never cut. A status in a value is a Badge with its icon.
- Applies to PropertyList and to any description list (`dl`) of an item's details. Details: `docs/pds1/slices/946/design.md`.

## 4. Shape (D-0005)

| Role | Radius | Token |
|---|---|---|
| Tables and grid cells | 2px | `plx-sys.radius-table-2px` |
| Controls, inputs, compact parts, pills, badges, tags, count pills | 4px | `plx-sys.shape-xs` |
| Cards, surfaces, menus, dialogs, large media | 6px | `plx-sys.shape-sm` |
| Round marks: status dots, progress tracks, timeline markers, step circles, grabbers, beacons, typing dots | 6px (owner, 2026-10-27: "no longer round") | `plx-sys.shape-mark` |
| A true circle | 50% | allowed by D-0005, but no Platform part uses it; avatars are rounded squares |
| Flush edges | 0 | `plx-sys.shape-none` |

- No other radius value (check 2).
- Pills are 4px, never round. This replaces the old written "pills at 6".
- `plx-sys.shape-mark` (6px) is the round-mark radius. Its old name `plx-sys.shape-pill` is a deprecated alias until 2.0.0, and no pill reads it (D-0030, #240, ADR 0008).

## 5. Space and density (D-0007)

- Everything sits on the 4px grid. Spacing comes from `plx-sys.space-*` roles (inline, stack, inset, cluster, layout, component-gap, container-inset, region-space). There are no off-grid steps: 6px and 10px are retired (#301) and their readers moved to grid roles.
- There are three densities: **compact, standard (default), comfortable**. A density is set on a region with `data-plx-density` and changes only heights, row heights, icon sizes and paddings, never colours or radii.
- Heights for each density are in the front matter. Every height a component uses comes from `plx-sys.control-height-*` or `plx-sys.*-row-height`, never a fixed number.
- `semantic.density-standard-comfortable.tokens.json` is retired. Removing it is a DS Architect task (section 12).

### Screen sizes (D-0092)

- **Design at 1440×900**, the middle of the common laptops.
- **Every change must also look right at 1366×768** (the smallest common laptop, where Fluent 2's 1366 band starts) **and at 1920×1080** (the most common desktop screen).
- **The minimum is 1024×640** (AppShell's `minSize`). Nothing scrolls sideways or overlaps there. Below it, the page follows the fit and reflow ladders (`fit-and-overflow.md`) down to 320px wide (WCAG 1.4.10).
- **These are screen sizes, not viewports.** Browser chrome takes about 130px off the height, so a 1920×1080 screen gives a viewport near 1920×950. Judge layouts at the viewport.
- **Phones and tablets** are parked (D-0013).
- **The visual checks** run at 1366×768 and 1920×1080 (light, standard density, plus RTL and compact when the change touches them), and once at 1024×640 for the minimum.

## 6. Icons (D-0011)

- Material Symbols Sharp, weight 300, from `platform/icons/`. There are two optical drawings: 20 (for the `xs`, `sm` and `md` sizes) and 24 (for `lg` and `xl`).
- An icon colours itself with `currentColor`. It takes its colour from the text around it and has no fill token of its own.
- Sizes come from `plx-sys.icon-size-*` (12, 16, 20, 24, 48).
- **RTL:** icons that point along the reading direction (arrows, chevrons, first/last page, forward, send, reply, undo/redo, panel open/close, log in/out) flip. The list is `MIRROR` in `platform/icons/layout.js`. All other icons (check, search, clock, media play) never flip.
- **An icon-only control always has an accessible name** (`aria-label`). It also shows its name in the **Tooltip**, **except the known set below** (D-0091, owner, 2026-11-07: "there is no need to have tool tips on things that are known"). Known buttons show **no visual tooltip** and keep their accessible name.
- **The known set** (following Microsoft Fluent and Windows, D-0078), by the button's **role** in a Plenix part, not by glyph:
  - **Close / dismiss (X):** Dialog, Drawer, Sheet, Popover, Toast, Banner, Notice and side-panel close; a Tag or chip's remove X.
  - **Clear (X in a field):** the clear button inside Input, SearchField, Combobox, DatePicker and the other fields.
  - **Search (magnifier)** inside a search field.
  - **Back (arrow):** the back button in a page or panel header.
  - **Previous / next (chevrons):** in Pagination, the calendar and DatePicker months, Carousel and MediaViewer.
  - **Expand / collapse (chevron):** a disclosure, accordion, tree or grid row toggle, and a group header.
  - **Show more:** the ⋮ row menu in a **DataGrid row**, because it sits beside the row's own icons. Everywhere else ⋮ "More actions" keeps its tooltip.
- **Always keep the Tooltip on:** ⋮ More outside a grid row, sort, filter, settings, the password show/hide eye, copy, download, share, print, every app or domain icon, and any icon button an app makes (unless it passes `tooltip={false}` on purpose for one of the roles above).
- A button whose **label is hidden by a bar's fit** (fit-and-overflow §2) always shows its Tooltip, known icon or not: the person saw the word before.

## 7. Motion

- Durations come only from `plx-sys.motion-duration-*`, and easing from `plx-sys.motion-ease-*` (check 5).
- `transition: all` is forbidden. Name each property that moves.
- Every animation has a `prefers-reduced-motion: reduce` guard. The reduced-motion token file sets every duration to 0. Loops (spinners, shimmer) stop and show a static state instead.
- A press scales to 0.98 (`motion-press-scale`). Something that enters scales from 0.96 with `motion-ease-enter`.

## 8. Data display

### DataGrid and Table

- The DataGrid runs on TanStack Table, under `platform/components/DataGrid`. There is one grid. Features are added to it, never forked.
- Row heights come from the density: 36 / 40 / 48px. Cell text uses `table-font-size` (12 / 13 / 13px).
- **Numbers** (check 10): number, currency, percent and duration cells use `font-variant-numeric: tabular-nums`. Like all cell content they are **start-aligned**, under their start-aligned header (D-0087, owner 2026-11-06; this replaces the earlier end alignment). A column may set `align`.
- Empty cell: an empty string shows nothing. Use `—` only where the column spec asks for it (the wording is the Technical Writer's).
- Long text in a cell: one line, ending in an ellipsis, with the full value in a tooltip. Headers follow the table-header ladder in `fit-and-overflow.md`.
- **Column widths (D-0087):**
  - Each column is as wide as the wider of its whole header and its widest value. An app's set width is a minimum for compact columns.
  - Spare room is shared evenly, except with narrow columns (D-0108).
  - **Narrow columns** (natural width under 80px: "#", short IDs, short numbers, single pills) are as wide as their content plus cell padding, at least 32px. They take no spare room. Their header options button reserves no width: it overlays at the inline end on hover, on focus and while its menu is open. Touch keeps the reserve. Details: `docs/pds1/slices/966/design.md`.
  - Only long text truncates first, then compact headers; values stay whole until the grid switches to cards.
  - The checkbox column is fixed. Row actions are icons at the inline-end on hover when there's room, else a pinned ⋮.
  - Details: `docs/pds1/slices/800-column-fit/design.md`.
- 10,000 rows: the grid virtualises (`plx-sys.virtual-*`). Only visible rows are in the DOM. The header stays sticky.

### Pills (D-0010)

- Pills stay as defined in `docs/pills-and-colors.md`: soft fill, soft border, on-soft text, 4px corners.
- **A pill never wraps.** One line (`white-space: nowrap`). When it is too wide, its text ends in an ellipsis and its icon stays.
- **Pills in a row have equal height** (check 11). Every boxed pill (soft or solid) in a row uses the same height token (`data-pill-min-height` or `data-pill-md-height`). The `plain` variant has no box: it is a name in running text, so it keeps `min-block-size: 0` and is not measured.
- A status pill always has its icon.
- **Pills in a grid column share one width** (owner rule, uniform pills): every standard pill in a column is as wide as the column's widest pill in the current view, person pills included. The column's sizing (D-0087) never shrinks a pill below that width.
- **A pill's label is start-aligned** (D-0087, owner, 2026-11-07: "text should not be centered"): its icon, then its text from the inline-start, never centred in a wider pill. A cut label ends in an ellipsis with the full text in the Tooltip.

### Charts

- Charts use Apache ECharts (D-0027), bundled locally, themed only from tokens (`plx-sys.dataviz-*`, `plx-sys.font-*`). Inline styles are allowed only in ECharts options built from token values.
- Palettes: categorical 1 to 6, sequential 1 to 7, diverging 1 to 7, and status colours.
- Axis and label text uses `dataviz-label` at 12px or more. Numbers on axes and in tooltips use `tabular-nums`.

## 9. States

Every component declares a state manifest (check 9). Each state is a token set or `n/a(reason)`.

| State | Tokens and behaviour |
|---|---|
| default | the component's `plx-comp-*` tokens, built on `surface-*` / `content-*` / `border-*` |
| hover | `state-hover` background, `state-hover-border` border; accent parts use `accent-state-hover` / `action-primary-background-hover` |
| focus | `:focus-visible` only: a ring in `focus-ring-color`, 2px wide, 2px offset. The ring is never removed. In forced colours it uses the system `Highlight` colour |
| active | `state-pressed` (accent: `accent-state-pressed`), plus `motion-press-scale` |
| disabled | `content-disabled` and `state-disabled-opacity` (0.5). No events fire. Not focusable, or `aria-disabled` and announced, per the component spec |
| loading | `aria-busy="true"`. The control keeps its width. A spinner (`motion-loading-*`) appears after `motion-loading-delay`. Clicks are blocked |
| error | `feedback-danger-solid` border, `feedback-danger-content` message under the field, linked by `aria-describedby`, `aria-invalid="true"` |
| selected | `state-selected` background, `state-selected-border` (or `selected-border`), `selected-content` text; pressed while selected: `state-selected-pressed`. `aria-selected` / `aria-checked` / `aria-current` as fits |
| empty | the EmptyState pattern: `content-muted` text with one Button action at most. The wording is the Technical Writer's (`docs/content/messaging.md`) |
| long text | the ladder for its kind in `fit-and-overflow.md`. Tested at 3× the English length |

- Read-only is not disabled. It uses `read-only-background`, `read-only-content` and `read-only-border`, and can still be focused.
- Every new design brief includes this matrix for the change, in light and dark, at every density it touches.

## 10. RTL and Arabic

- Logical properties only, utilities included (check 4). "Start" means right in RTL. A pinned-start column sits on the right in RTL.
- Mirror only what shows direction (section 6). Numbers keep their own direction: `ar-EG` formats with Arabic-Indic digits. IDs, emails and URLs stay Latin.
- Every visible string goes through the catalog. Arabic words need the owner's approval (D-0012, `docs/i18n/arabic.md`).

## 11. Where messages go

- Field errors go under their field. Errors from a whole form go in ErrorSummary at the top. Results of an action go in a Toast. A page-wide condition goes in a Banner. Advice that belongs to a section goes in a Notice.
- The placement standard is `docs/content/messaging.md`, owned by the Technical Writer. The file doesn't exist yet: until it does, the list above is the rule.

## 12. Defects inside the definitions (fixed as bugs, no owner question)

| # | Defect | Measured | Fix (existing palette only) |
|---|---|---|---|
| 1 | Dark (listed, fixed after light, D-0025): `content-subtle` (gray-500) | 3.05:1 on #444, 2.22:1 on hover | Point to gray-300, the same as `content-muted`, as light mode already does: 6.31:1 and 4.61:1 |
| 2 | Dark (listed, D-0025): `feedback-neutral-solid-label` (gray-600) | 1.91:1 on #444 | gray-300: 6.31:1 |
| 3 | Dark (listed, D-0025): `feedback-success-solid-label` (green-300) | 3.49:1 on #444 | green-200: 5.65:1 |
| 4 | Caption and eyebrow roles at 11px, among 80 token references to sizes 09/10/11 (focus-order, field, chart, tooltip, calendar, slider and others), plus `.plx-u-fs-09/10/11` (removed since, #125) | below 12px | Point to `font-size-12`; deprecate refs 09/10/11 (#214) |
| 5 | DataGrid number cells: end-aligned but without `tabular-nums` | check 10 | Add `font-variant-numeric: tabular-nums` to `cell--align-right` (#214) |
| 7 | `semantic.density-standard-comfortable` still ships (one token, `radius-control`, shared by standard and comfortable) | D-0007 | Move the token into the standard and comfortable files; remove the set (#214) |
| 8 | `category-olive-on` (black) on `category-olive` (green-500), light and dark | 3.91:1 | white: 5.37:1, as the other dark category fills (#251) |
| 9 | Light `accent-field-placeholder` (blue-300) on `accent-field-background` (blue-600) | 3.44:1 | blue-200: 4.73:1 (#251) |
| 10 | Dark `content-link-visited` on `state-hover` / `state-selected` (listed, D-0025) | 3.84:1 | dark phase (#251) |

- Dark `border-default` and `border-subtle` (1.37:1) are decorative dividers, so they are not a defect. Control boundaries use `field-border` and `control-border`, which measure 4.00:1.
- Items 1 to 3 wait for the light work to finish (D-0025), tracked in #206. Items 4, 5 and 7 are fixed in #214.
- Not a defect: the plain pill's `min-block-size: 0` (no box, running text). An earlier draft listed it. Each fix comes with a test that fails before it.

## 13. Changing this file

- The scales and the look change only through a new owner decision in `decisions.yaml`.
- Recording what already exists, and fixing a defect from section 12, is the Design Director's job and goes through a PR.
