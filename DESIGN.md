---
# PDS design contract, v0 (Phase 0, D-0004). Lint checks 1-12 (plan §7) read this front matter
# and design.rules.json. Values are the ones in platform/tokens today, unless a line says "defect".
version: 0
status: active
owner: pds1-design-director
tokens: platform/tokens          # moves to tokens/ with the monorepo scaffold (#178)
radius:                          # D-0005
  scale_px: [0, 2, 4, 6]
  circle: true                   # 50% only for dots, toggles, avatars and round marks
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
    title:     { size: 20, weight: 700, line: 1.5 }
    display:   { size: 20, weight: 600, line: 1.3, tracking: tight }
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
- Body and heading are both 13px. Hierarchy comes from weight (400 → 600) and from title or display (20px). That is the existing language, recorded as is.

## 4. Shape (D-0005)

| Role | Radius | Token |
|---|---|---|
| Tables and grid cells | 2px | `plx-sys.radius-table-2px` |
| Controls, inputs, compact parts, pills, badges, tags, count pills | 4px | `plx-sys.shape-xs` |
| Cards, surfaces, menus, dialogs, large media | 6px | `plx-sys.shape-sm` |
| Dots, toggle thumbs, round avatars, beacons | circle (50%) | `border-radius: 50%` |
| Flush edges | 0 | `plx-sys.shape-none` |

- No other radius value (check 2).
- Pills are 4px, never round. This replaces the old written "pills at 6".
- `plx-sys.shape-pill` resolves to 6px today. Despite its name, it isn't used for pills. See D-0030.

## 5. Space and density (D-0007)

- Everything sits on the 4px grid. Spacing comes from `plx-sys.space-*` roles (inline, stack, inset, cluster, layout, component-gap, container-inset, region-space). 6px and 10px exist only as `plx-ref` steps inside components.
- There are three densities: **compact, standard (default), comfortable**. A density is set on a region with `data-plx-density` and changes only heights, row heights, icon sizes and paddings, never colours or radii.
- Heights for each density are in the front matter. Every height a component uses comes from `plx-sys.control-height-*` or `plx-sys.*-row-height`, never a fixed number.
- `semantic.density-standard-comfortable.tokens.json` is retired. Removing it is a DS Architect task (section 12).

## 6. Icons (D-0011)

- Material Symbols Sharp, weight 300, from `platform/icons/`. There are two optical drawings: 20 (for the `xs`, `sm` and `md` sizes) and 24 (for `lg` and `xl`).
- An icon colours itself with `currentColor`. It takes its colour from the text around it and has no fill token of its own.
- Sizes come from `plx-sys.icon-size-*` (12, 16, 20, 24, 48).
- **RTL:** icons that point along the reading direction (arrows, chevrons, first/last page, forward, send, reply, undo/redo, panel open/close, log in/out) flip. The list is `MIRROR` in `platform/icons/layout.js`. All other icons (check, search, clock, media play) never flip.
- An icon-only control has an accessible name and a tooltip.

## 7. Motion

- Durations come only from `plx-sys.motion-duration-*`, and easing from `plx-sys.motion-ease-*` (check 5).
- `transition: all` is forbidden. Name each property that moves.
- Every animation has a `prefers-reduced-motion: reduce` guard. The reduced-motion token file sets every duration to 0. Loops (spinners, shimmer) stop and show a static state instead.
- A press scales to 0.98 (`motion-press-scale`). Something that enters scales from 0.96 with `motion-ease-enter`.

## 8. Data display

### DataGrid and Table

- The DataGrid runs on TanStack Table, under `platform/components/DataGrid`. There is one grid. Features are added to it, never forked.
- Row heights come from the density: 36 / 40 / 48px. Cell text uses `table-font-size` (12 / 13 / 13px).
- **Numbers** (check 10): number, currency, percent and duration cells use `font-variant-numeric: tabular-nums` and are end-aligned (`text-align: end`). Their header label stays start-aligned (section 1). Dates and IDs are not numbers: they stay start-aligned.
- Empty cell: an empty string shows nothing. Use `—` only where the column spec asks for it (the wording is the Technical Writer's).
- Long text in a cell: one line, ending in an ellipsis, with the full value in a tooltip. Headers follow the table-header ladder in `fit-and-overflow.md`.
- 10,000 rows: the grid virtualises (`plx-sys.virtual-*`). Only visible rows are in the DOM. The header stays sticky.

### Pills (D-0010)

- Pills stay as defined in `docs/pills-and-colors.md`: soft fill, soft border, on-soft text, 4px corners.
- **A pill never wraps.** One line (`white-space: nowrap`). When it is too wide, its text ends in an ellipsis and its icon stays.
- **Pills in a row have equal height** (check 11). Every pill in a row uses the same height token (`data-pill-min-height` or `data-pill-md-height`). The `plain` variant keeps the same block size as a filled pill (section 12).
- A status pill always has its icon.

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
| 4 | Caption and eyebrow roles at 11px. 11 more token references to sizes 09/10/11 (focus-order, field, chart, calendar, slider and others) | below 12px | Point to `font-size-12`; retire refs 09/10/11 |
| 5 | DataGrid number cells: end-aligned but without `tabular-nums` | check 10 | Add `font-variant-numeric: tabular-nums` to `cell--align-right` |
| 6 | `.plx-data-pill--plain` sets `min-block-size: 0`, so a plain pill next to a filled pill is shorter | check 11 | Keep the pill height token on `plain` |
| 7 | `semantic.density-standard-comfortable` still ships | D-0007 | Remove it, with a deprecation note |

- Dark `border-default` and `border-subtle` (1.37:1) are decorative dividers, so they are not a defect. Control boundaries use `field-border` and `control-border`, which measure 4.00:1.
- Items 1 to 3 wait for the light work to finish (D-0025). The token changes (1 to 4, 7) belong to the DS Architect, and the CSS changes (5, 6) to a Component Engineer. Each fix comes with a test that fails before it.

## 13. Changing this file

- The scales and the look change only through a new owner decision in `decisions.yaml`.
- Recording what already exists, and fixing a defect from section 12, is the Design Director's job and goes through a PR.
