# #1152 Grouped Timeline, compact look with a calendar date tile (G2)

- **Request:** the CTM owner chose this design for CTM's Key Dates card (CTM#239), each choice approved (chat, 2026-11-10, **D-0145**). Brief: `docs/pds1/slices/1152/brief.md`. Approved picture and study: LighthouseCollection/CTM `preview-239/2026-11-10/` at 110f45a (`key-dates-compact.png`, `key-dates-standard.png`, `key-dates-compact-study.html`).
- **Extends:** the grouped `Timeline` (`variant="grouped"`, #987, D-0115, D-0117, ADR 0036; `docs/pds1/slices/987/design.md`). It is a second look of the same variation, not a new component. The plain (rail) Timeline does not change.
- **Prop and names:** G3, ADR 0048 (PR #1154, D-0146): `<Timeline variant="grouped" density="compact">`, class `plx-timeline--compact`, tokens `timeline-grouped-compact-*`. This file sets the values ADR 0048 leaves to G2.
- **Readings applied (D-0148, the owner may switch):**
  - **A. 6px and 10px are snapped to the 4px grid:** compact padding is **8px** on every side and standard is **12px** on every side. 6px and 10px are retired (DESIGN §5, #301). The owner's intent, equal start and block padding, holds exactly. Reply **B** for 4px compact padding (tighter than the picture).
  - **A. The compact tile shows no "Pending" word:** 12px "Pending" is about 46px wide and does not fit a 40px tile (the study draws it at about 6px, below the 12px minimum). An undated compact event shows an empty dashed page with the grey band, and its tag reads "{category} · Pending" (the existing `timeline.pending`, no new string). Reply **B** to widen every compact tile to 52px so the word fits.
  - **A. The standard look takes the new tile and equal padding too** (brief P1; it matches `key-dates-standard.png`). The year heading's line goes in both looks, and the standard look keeps its watermark. Reply **B** to keep the standard look as built in 1.2.0.
  - **The month's white is the theme's `content-inverse`:** white in light (6.77–9.15:1 on the 8 bands). In dark the band is the light category shade, where white measures 1.54–1.91:1 (a contrast defect, fixed without asking). Dark therefore uses black (`content-inverse` in dark, 10.99–13.62:1).

## 1. Look

### 1a. Anatomy, compact (LTR; inline-start on the left)

```
2026                                                            ← year heading, surface-title role, no line
┌────────────────────────────────────────────────────────────┐
│ ┌────┐                                                     │
│ │NOV │ Intake interview  Fr. Youhanna met the appl…  [Interviews & hearings] │  ← one line
│ │ 6  │                                                     │
│ └────┘                                                     │
└────────────────────────────────────────────────────────────┘  8px on every side
```

- **Width:** the timeline's inline size stops at **760px** (`content-max-list` over `content-max-sm`, ADR 0048: the nearest content-max step to the study's 720px, so no new ref) and sits at the inline start. A narrower container makes it narrower.
- **Year group:** the heading, then the events. Groups are **32px** apart (`space-stack-2xl`). The heading is **8px** above its first event (`space-stack-sm`).
- **Year heading:** the **surface-title** role (15px, 700), `content-default`, `tabular-nums`. **No line under it.** It stays a real heading element.
- **No watermark** in the compact look: the row has one column.
- **Event box:** one box per event, 6px corners (`shape-sm`), a 1px border, the category tint and border (unchanged from #987 §1c, light and dark). Upcoming: a dashed border.
  - **Padding: 8px on every side** (`space-inset-sm`): inline-start = inline-end = block-start = block-end.
  - Events in a year are **4px** apart (`space-stack-xs`).
  - Grid: tile (40px) | 8px gap | body (`minmax(0, 1fr)`) | 8px gap | tag (auto). Everything is centred on the block axis.
- **Body, one line:** the title, then 8px (`space-inline-sm`), then the description, on one baseline.
  - **Title:** the **heading** role (13px, 600), the category title colour (#987 §1c). It keeps its full width. Only when the title alone is wider than the body does it also end in an ellipsis.
  - **Description:** the **body** role (13px), `content-muted`. One line that ends in an ellipsis. It shrinks first.
  - Cut text shows in full in the Plenix Tooltip while it is cut, the same way as Tag and EntityTitle (`useTruncated`, `describe={false}`; fit-and-overflow §5). The full text stays in the accessibility tree.
- **Tag** (inline-end): the existing grouped tag (4px corners, one line, 12px, 600, category text and border), centred on the block axis.
  - Past event: "{category}".
  - Upcoming with a date: "{category} · upcoming".
  - Upcoming without a date: "{category} · Pending" (reading A above).
  - The suffix takes the tag's own colour (it is not drawn apart), so ADR 0048's `-tag-upcoming-text` is not added.
- **Date tile, compact: 40 × 40px** (`size-10u`), 6px corners, `surface-default` page, 1px `border-strong` border (dashed when upcoming).
  - **No binder rings** (no `::before` or `::after`).
  - **Band: 16px** (`size-calendar-band`) along the top, in the category title colour, its top corners following the tile.
  - **Month inside the band:** 13px, 700, UPPERCASE, `content-inverse`, centred, line height 1, so about 1.5px sit above it ("larger" than the 12px label, as the owner asked; it is 12px today).
  - **Day:** 15px (surface-title size), 700, `content-strong`, `tabular-nums`, centred in the 22px under the band.
  - **Upcoming band:** `border-default` (grey). Its month is `content-default` (light 7.84:1, dark 5.86:1), never `content-inverse` (light 1.54:1).
  - **Undated:** the dashed page and grey band only. The word goes to the tag (reading A).

### 1b. Standard look, as changed by this request (P1)

- Unchanged: the 56px tile, the watermark, 80px between groups, 8px between events, two lines (title over description), wrapping text, 12px column gaps, the tag.
- **No line under the year heading** (`::after` removed).
- **Padding: 12px on every side** (`space-inset-md`; was 12 block, 16 inline). Density keeps it equal: compact region 8px, comfortable 16px.
- **Tile:** no rings. **Band: 20px** (`size-5u`). **Month inside the band:** 14px, 700, UPPERCASE, `content-inverse` (upcoming: `content-default`), line height 1. **Day:** 18px, 700 (unchanged), centred in the 34px under the band. "Pending" stays under the band (12px, 600, `content-muted`); it fits 54px.

### 1c. Token values (names and tiers: ADR 0048; comp → sys only)

| Token | Standard look | Compact look (`timeline-grouped-compact-*` unless noted) |
|---|---|---|
| max inline size | none | `-max-inline-size` → `content-max-list` (760, over `content-max-sm`) |
| group gap | `timeline-grouped-group-gap`, unchanged (80; compact region 64) | `-group-gap` → `space-stack-2xl` (32) |
| heading gap | `timeline-grouped-heading-gap`, unchanged (12) | `-heading-gap` → `space-stack-sm` (8) |
| heading font size | `timeline-grouped-heading-font-size`, unchanged (title, 20) | `-heading-font-size` → `text-surface-title-font-size` (15) |
| heading rule | not drawn; `-heading-rule-*` deprecated with the rings | not drawn (no node, ADR 0048) |
| watermark | unchanged | not drawn (no node) |
| event gap | `timeline-grouped-event-gap`, unchanged (8; comfortable 12) | `-event-gap` → `space-stack-xs` (4) |
| event padding | `-event-padding-block` and `-padding-inline` both `space-inset-md` (12); compact region both `space-inset-sm` (8); comfortable both `space-inset-lg` (16) | both `space-inset-sm` (8) through the root's `data-plx-density="compact"` |
| column gap | `timeline-grouped-event-column-gap`, unchanged (12) | `-column-gap` → `space-inline-sm` (8) |
| title to description | stacked, unchanged | `-body-gap` → `space-inline-sm` (8) |
| tile | `size-calendar-tile`, unchanged (56) | `-date-size` → `size-calendar-tile-sm` (40, `size-10u`) |
| band | `size-calendar-band` → `size-5u` (20; was 16) | `-date-band-size` → `size-calendar-band-sm` → `size-4u` (16) |
| month size | `timeline-grouped-date-month-font-size` → new sys `text-calendar-month-font-size` (14) | `-date-month-font-size` → new sys `text-calendar-month-sm-font-size` (13) |
| month ink | `timeline-grouped-date-month-text` → `content-inverse` | `-date-month-text` → `content-inverse` (per theme: white light, black dark; no new role needed) |
| month ink, upcoming band | new `timeline-grouped-date-month-upcoming-text` → `content-default` | the same token |
| day size | `text-calendar-day-font-size`, unchanged (18) | `-date-day-font-size` → new sys `text-calendar-day-sm-font-size` (15) |
| rings | not drawn; `timeline-grouped-date-ring-*` deprecated, removed in 2.0.0 (ADR 0048) | not drawn |

- No new colours, radii or refs. 13, 14 and 15px are on the type scale (`allowed_sizes_px`). The new `text-calendar-*` roles sit beside the existing `text-calendar-day-font-size`.
- The band keeps the category title colour from #987 §1c (light `category-on-soft`, dark the soft-border shade). The band is never `category-on`.

## 2. State matrix (compact look; the standard look is #987 §2 with §1b above)

| State | Tokens / behaviour |
|---|---|
| default (past) | §1a: tint and 1px category border, title in the category title colour, `content-muted` description, category band with a `content-inverse` month, `content-strong` day |
| hover | Events: n/a (static, as in #987). A cut title or description: the Tooltip opens (Tooltip's own tokens). Links inside take Link's hover |
| focus | Events: n/a (not focusable). Links inside: `focus-ring-color`, 2px, 2px offset. Legend button: as #987 |
| active | n/a (static). Legend button: `state-pressed` + `motion-press-scale`, as #987 |
| disabled | n/a (nothing to disable) |
| loading | n/a in the component. The app shows Skeleton rows, each 58px high (the compact event height), in the timeline's place |
| error | n/a in the component. A failed load is the app's Notice in the region (§5) |
| selected | Legend button pressed, as #987 (solid or hollow swatch). Events: n/a |
| upcoming, dated | dashed box border and tile border, `border-default` band, `content-default` month, day shown, tag "{category} · upcoming" |
| upcoming, undated | dashed box and tile, grey band, no month or day, tag "{category} · Pending"; the `<time>` hidden text is "Pending" |
| empty (no events) | renders nothing. The app shows EmptyState (§5) |
| empty (all categories hidden) | as #987: no group renders and the legend shows every swatch hollow |
| empty values | no description: the title alone, then the tag. No category: the neutral set from #987 (`surface-sunken`, `border-default`, `content-default` title), a `border-default` band with a `content-default` month, and no tag |
| long text | one line. The description ends in an ellipsis first, then the title. The full text shows in a Tooltip while cut. The tag never cuts while it fits (D-0010). If the tag alone is wider than half the event, it ends in an ellipsis with a Tooltip (fit-and-overflow, badges and tags) |

- **Motion:** none added. The legend keeps #987's.
- **Names:** unchanged from #987 §2 (heading plus ordered list per year; the tile `aria-hidden`; `<time>` with the full date or "Pending"; the category read from the tag). Colour is never the only cue: the tag names the category, and the dashed border and the tag's "upcoming" or "pending" mark the state.

## 3. Densities, themes, Arabic

- **Densities:** the compact look is one size: 8px padding, 4px gaps and the 40px tile in every region density. The standard look follows region density with equal padding (8, 12, 16px).
- **Light and dark:** the tint, border, title and description pairings are #987 §1c (all ≥ 4.5:1 in both themes). The new pairing, the month on the band, measures:

| Slot | Light, white on band | Dark, black on band |
|---|---|---|
| 1 magenta | 9.15 | 12.27 |
| 2 gray | 7.11 | 13.62 |
| 3 teal | 8.09 | 13.25 |
| 4 purple | 9.09 | 11.34 |
| 5 orange | 9.06 | 10.99 |
| 6 navy | 7.10 | 11.19 |
| 7 green | 7.92 | 12.18 |
| 8 yellow | 6.77 | 12.34 |
| upcoming (grey band, `content-default`) | 7.84 | 5.86 |

- **Forced colours:** box and tile border `CanvasText`, band `CanvasText`, month `Canvas`, title and description `CanvasText`, the dashed border kept.
- **RTL:** the tile sits at the right and the tag at the left (logical grid). The ellipsis sits at the left end of the cut line. The month comes from `Intl` for the locale. Arabic digits follow DESIGN §10.
- **Arabic words:** "· upcoming" in the tag is new catalog text, `timeline.upcoming` (§5); "Pending" already has approved Arabic. Until the owner approves the Arabic (D-0012), the tag shows the category name alone in Arabic. CI adds the RTL and compact shots (text, direction and density change).

## 4. Edge cases

- **3× English:** the description cuts, then the title. The tag holds. At Narrow (< 600px, D-0092) the tag moves under the body, as in #987, and the line holds the title and description.
- **Empty values:** see the state matrix. An event with neither description nor category is the title alone on the neutral set.
- **One event, one year:** one heading, one box, no group gap.
- **10,000 events:** all render, and every event is a fixed 58px (40px tile, 2 × 8px padding, 2 × 1px border), so nothing is measured to lay out. `useTruncated` observes each line; past about a dozen events the plain Timeline's rule applies (the app shows the latest years and a "Show earlier" Button). Virtualisation is out of scope (static list).
- **A 760px cap on a 1920px screen:** the timeline sits at the inline start with the empty space at the inline end. It is never centred.

## 5. Messages (placement per `docs/content/messaging.md`; wording is the Technical Writer's)

- **Empty, no events:** the app's EmptyState in the timeline's place.
- **Load failed:** the app's Notice in the timeline's region.
- **New string (ADR 0048):** `timeline.upcoming` ("upcoming"), drawn as "· upcoming" after the tag label. The undated suffix reuses `timeline.pending` ("Pending"). Wording is the Technical Writer's, and Arabic is proposed by the i18n Engineer for the owner to approve (D-0012). Until it is approved, the Arabic tag shows the category alone.

## 6. Choices the engineer must not invent

- The values in §1c, the 760px cap at the inline start, the 40px compact tile and the 58px compact event.
- Equal padding on all four sides in both looks and every density.
- No rings in either look. The month inside the band in `content-inverse`, and in `content-default` on the grey upcoming band.
- In the compact look: no watermark, no heading line, one line per event, the description cut before the title, and the tag at the inline end.
- Which look the region density does not change (compact is one size; §3).
- **Tests (AC-1 to AC-7 in the brief, plus):**
  - the computed padding is equal on all four sides, in both looks and the three densities;
  - the tile has no `::before` or `::after` box, in both looks;
  - the month's computed colour is `content-inverse` on a category band and `content-default` on the upcoming band;
  - month-on-band contrast ≥ 4.5:1 for all 8 slots, light and dark;
  - an undated compact event has no month or day and its tag ends with "· Pending";
  - a long description is one line with `text-overflow: ellipsis`, and the Tooltip appears only while it is cut;
  - the timeline's inline size is ≤ 760px in a 1200px container and starts at the inline start, in LTR and RTL;
  - RTL places the tile on the right and the tag on the left.
