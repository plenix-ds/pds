# #987 Timeline, grouped variation (year groups, category containers, calendar date) (G2)

- **Request:** the owner, through CTM (D-0058, CTM#255, `docs/design/timeline-study.html`): "lock this in as variation in pds, and implement in ctm". Recorded as **D-0115**. The study's defaults are the design: year on top plus a faint year beside each event, the date inside a calendar icon, a tinted container with a coloured title, the category tag shown, latest first.
- **Extends:** `Timeline` (`platform/components/Timeline`). It is a new variation of the same component, not a new component. The neutral marker-and-line variations stay as they are. The API (`variant`, `groupBy`, order, category, legend, heading level) is G3's.
- **Readings applied (D-0117, the owner may switch):**
  - **No new colours.** All eight category hues already exist in the palette (`plx-ref`), light and dark, and every text pairing is ≥ 4.5:1 (§1c). D-0115 allows new refs for missing hues, but none is needed.
  - **The study's off-grid sizes are snapped to PDS scales:** 10px to the event becomes 12px, the 6px heading-to-line gap becomes 8px, the 14px event padding becomes 16px, and the 10px gap between events becomes 8px. The month is 12px (the study draws it at about 10px, below the 12px minimum). Extra-bold (800) becomes bold (700), the heaviest weight token.
  - **Upcoming events don't fade.** The study's 85% opacity is dropped, because it pushes dark-mode text below 4.5:1. The dashed outline and the grey band carry the state.
  - **A hidden legend category isn't faded to 40%.** Its swatch becomes hollow and its text `content-muted`, so it stays readable (≥ 4.5:1).
  - **The order is a prop, not a built-in control.** Latest first by default. An app that wants a toggle places a SegmentedControl above the timeline. The legend is built in, and opt-in.

## 1. Look

### 1a. Anatomy (vertical; inline-start is the left in LTR)

```
2026                                   ← year heading (title role)
▔▔▔▔                                   ← 72 × 2px soft line
┃ ┌──────┐  Title (category colour)        [Category]   ← event container
2 │ NOV  │  Description (content-muted)                    (tinted, 6px corners)
0 │  14  │
2 └──────┘
6                                      ← watermark year, rotated, decorative
```

- **Year group:** the heading, then the events. Groups are 80px apart, with no divider. The latest year comes first.
- **Year heading:** **title** role (20px, 700), `content-default`, DM Sans with `tabular-nums`. Under it, 8px down, a soft line 72px wide and 2px high, in `border-strong`, with 2px corners (`radius-table-2px`). It is a real heading element (level set by G3's prop).
- **Watermark year:** a column 24px wide, at the inline-start, aligned with the year heading's start edge. It holds the year rotated to read bottom-to-top, 24px bold, centred on each event, 8px from the event. Colour: `content-default` mixed `mix-amount-xs` (8%) into `surface-default` (#ededee light, #505050 dark). It is decorative (`aria-hidden="true"`). It sits in each event's own row, so it can never overlap the heading or another watermark: an event is at least 80px tall (56px tile + 2 × 12px padding), and the rotated year is about 56px.
- **Event container:** `shape-sm` (6px), a 1px border, padding 12px block and 16px inline. Its grid has 4 columns: date tile (56px), 12px gap, body (`minmax(0, 1fr)`), 12px gap, tag (auto). Events in a year are 8px apart.
  - Fill: the category **tint**. Border: the category **border**. Title: the category **text**, `heading` role (13px, 600). Description: `content-muted`, `body` role (13px). Optional `badge` (a status Badge with its icon) follows the title, as in the plain Timeline.
- **Category tag** (at the inline-end): `shape-xs` (4px), 1px border in the category **border**, fill `surface-default`, text in the category **text**, **label** role (12px, 600), one line (pill rules, D-0010). It holds the category name only.
- **Date tile** (the calendar icon): 56 × 56px, `shape-sm` (6px). This is the date drawn as a calendar page, not an icon in a box (D-0024 does not apply).
  - Page: fill `surface-default`, a 1px border in `border-strong`.
  - Top band 16px high, filled with the category **band** colour, with its top corners following the tile.
  - Two binder rings: 4 × 8px bars at 25% and 75% of the width, crossing the band's top edge by 4px, in `content-default`, with `radius-table-2px`.
  - Month: **eyebrow**-like, 12px, 700, UPPERCASE, `content-default`, centred under the band.
  - Day: 18px, 700, `content-strong`, `tabular-nums`, centred.
  - DM Sans for both (a date graphic, like a heading, not a data cell; §3 of DESIGN.md keeps Reddit Mono for data cells).
  - The date column is always 56px, so every event lines up without measuring. A tile with no date shows "Pending" (12px, 600, `content-muted`) centred under the band.
- **Upcoming event:** the container's border is **dashed** (same colour). The tile's band is `border-default` (grey) and its page border is dashed. With a known date, the month and day show. Without one, it shows "Pending".
- **Legend (optional):** a list of toggle buttons beside or above the timeline (the app places it). Each is a ghost Button (Fluent, `aria-pressed`) with a 12 × 12px swatch (`shape-xs`) filled in the category **text** colour, then the category name in `content-default`.
  - Off: the swatch is hollow (a 1px border in the category text colour, transparent fill), and the name is `content-muted`.
  - Hiding a category hides its events. A year with no visible event is hidden.

### 1b. Comp tokens for G3 (`timeline-grouped-*`, comp → sys only)

| Comp token | Value |
|---|---|
| `-group-gap` | 80px (compact 64px); a new sys space step for G3 to name |
| `-heading-text` | `content-default` |
| `-heading-font` | type role **title** |
| `-heading-rule-size` | 72 × 2px |
| `-heading-rule-color` | `border-strong` |
| `-heading-rule-gap` | `space-stack-sm` (8px) |
| `-heading-gap` (heading to first event) | `space-stack-md` (12px) |
| `-watermark-size` | 24px, 700 |
| `-watermark-color` | `content-default` mixed `mix-amount-xs` into `surface-default` |
| `-watermark-width` / `-watermark-gap` | 24px / `space-inline-sm` (8px) |
| `-event-gap` | `space-stack-sm` (8px) |
| `-event-padding` | 12px block, 16px inline (`space-inset-md` / `space-inset-lg`) |
| `-event-radius` | `shape-sm` |
| `-event-border-width` | `border-width-thin` (1px) |
| `-column-gap` | `space-inline-md` (12px) |
| `-date-size` | 56px |
| `-date-radius` | `shape-sm` |
| `-date-band-size` | 16px |
| `-date-ring` | 4 × 8px, `content-default`, `radius-table-2px` |
| `-date-border-color` | `border-strong` |
| `-date-pending-band` | `border-default` |
| `-tag-radius` | `shape-xs` |
| `-legend-swatch-size` | 12px, `shape-xs` |

### 1c. Category set `category-1…8` (all existing refs; contrast measured)

Light: tint and border are the family's 100 and 300 shades. Dark: text is a light shade, tint is that text mixed `mix-amount-xs` (8%) into `surface-default`, border is the text mixed 35% into `surface-default`. The band uses the text colour in both modes. CTM's names are its own mapping (the app maps its categories to tokens).

| # | CTM | Light text | Light tint | Light border | Text/tint L | Dark text | Text/tint D | Muted/tint D |
|---|---|---|---|---|---|---|---|---|
| 1 | plum | pink-700 | pink-100 | pink-300 | 7.91 | pink-300 | 4.94 | 5.40 |
| 2 | slate | gray-700 | gray-100 | gray-300 | 6.41 | blue-250 | 5.12 | 5.41 |
| 3 | teal | cyan-700 | cyan-100 | cyan-300 | 7.46 | cyan-300 | 5.29 | 5.40 |
| 4 | violet | purple-700 | purple-100 | purple-300 | 8.14 | purple-300 | 4.56 | 5.48 |
| 5 | copper | brown-500 | orange-100 | orange-300 | 6.26 | orange-200 | 5.75 | 5.35 |
| 6 | navy | blue-700 | blue-100 | blue-300 | 6.20 | blue-275 | 5.02 | 5.42 |
| 7 | green | green-700 | green-100 | green-200 | 6.92 | green-200 | 4.89 | 5.47 |
| 8 | gold | brown-600 | yellow-100 | yellow-300 | 6.37 | yellow-300 | 4.95 | 5.46 |

- `content-muted` on every light tint: ≥ 6.21. `content-default` on every tint: ≥ 6.59 (dark), ≥ 10.56 (light). Tag text on `surface-default`: ≥ 6.77 (light), ≥ 5.10 (dark).
- The dark-mode tint is a `color-mix` of tokens with a ref amount (ADR 0004), not a new colour. G3 adds a 35% amount step for the border, or picks the nearest existing step if it keeps the border visible.
- Each token has `-text`, `-tint`, `-border` and `-band`. The existing 19 pill categories are unchanged: this set is for coloured containers, where a light pill tint would glare in dark mode.

## 2. State matrix

| State | Tokens / behaviour |
|---|---|
| default (past event) | §1: tint, border, category text title, `content-muted` description, solid band |
| hover | n/a (events are static, as in the plain Timeline). A link inside the title or content takes Link's hover. Legend button: `state-hover` |
| focus | Events: n/a (not focusable; links inside take the focus ring). Legend button: `focus-ring-color`, 2px, 2px offset |
| active | Legend button: `state-pressed` + `motion-press-scale`. Events: n/a (static) |
| disabled | n/a (nothing to disable; a hidden category is a filter, not disabled) |
| loading | n/a in the component (static). The app shows Skeleton rows in the timeline's place while it loads, per Skeleton |
| error | n/a in the component. A failed load is the app's Notice in the region (§5) |
| selected | Legend button pressed (`aria-pressed="true"`): solid swatch, `content-default` text. Not pressed: hollow swatch, `content-muted`. Events: n/a |
| upcoming | dashed container and tile border, `border-default` band, "Pending" when no date. Title stays the category text (contrast unchanged) |
| empty (no events) | the component renders nothing. The app shows EmptyState (§5) |
| empty (all categories hidden) | the year groups are hidden. One line in `content-muted`, `body` role, in place of the groups, with no action (the legend is the action). Wording: the Technical Writer's |
| empty values | no description: the body is the title alone, vertically centred on the tile. No category: neutral set (`gray-100` tint, `border-default` border, `content-default` title), and no tag. No date and not upcoming: the tile shows the band only and the accessible name says "No date" |
| long text | title and description wrap (`overflow-wrap: anywhere`), never cut. The tag stays one line (D-0010). Below the Narrow width (600px, D-0092), the tag moves under the body in column 2 and ends in an ellipsis with a Tooltip only if wider than that column |

- **Motion:** only the legend button's `background-color` and `color`, `motion-duration-quick`, with a reduced-motion guard. Hiding events doesn't animate.
- **Names:**
  - The timeline is a list of year groups. Each group is a heading and an ordered list of events.
  - The tile is `aria-hidden`. The date is a `<time dateTime>` with the full date as visually hidden text ("November 14, 2026"; "Pending" for no date).
  - The category is read from the tag. The legend is a group named by its heading, with `aria-pressed` on each button.
  - Colour is never the only cue: the tag names the category, and the dashed outline and "Pending" mark upcoming events.

## 3. Densities, themes, Arabic

- **Densities:** only spacing changes. Event padding is 8/12px (compact), 12/16px (standard) and 16/16px (comfortable). The event gap is 8, 8 and 12px. The group gap is 64, 80 and 80px. The tile, type and watermark don't change.
- **Light and dark:** §1c. The canvas under the timeline is `surface-default` (#444 in dark). Forced colours: container and tile border `CanvasText`, band `CanvasText`, title `CanvasText`, dashed border kept, watermark hidden.
- **RTL:** the watermark column and the tile go to the right, and the tag to the left (logical grid). The watermark rotation reads bottom-to-top in both directions. Numbers follow the locale (`ar-EG` uses Arabic-Indic digits, DESIGN §10). Month names come from `Intl` for the locale, so they are not new catalog words. "Pending", the legend heading and the empty line are catalog strings, proposed by the i18n Engineer (D-0012). CI adds the RTL shot (text and direction change).

## 4. Edge cases

- **3× English:** titles and descriptions wrap. The tag is a single line, under the body at Narrow. The legend buttons wrap as a list, never their labels' letters.
- **One event / one year:** one heading, one event, no group gap.
- **A year with many events:** each event has its own watermark, as in the study.
- **1,000+ events:** all groups render. The tile is a fixed 56px, so nothing is measured in JavaScript (the study measures the date column; this design doesn't need to). Beyond about a dozen events, the plain Timeline's rule applies: the app shows the latest years and a "Show earlier" Button below the last group. Virtualisation is out of scope (static list).
- **Events without a year** (no date and not upcoming): they go in a last group headed by the catalog's "No date" string.
- **Upcoming with a date in the past** (data error): drawn as upcoming. The app owns the data.

## 5. Messages (placement per `docs/content/messaging.md`; wording is the Technical Writer's)

- **Empty, no events:** EmptyState in the timeline's place ("No events yet." + one action, if the app has one).
- **Empty, all categories hidden:** one `content-muted` line in place of the groups, with no action.
- **Load failed:** the app's Notice in the timeline's region (Error pattern).
- **New strings:** "Pending", "No date", the legend heading ("Categories"), the all-hidden line, and the full-date accessible text pattern (from `Intl`). The i18n Engineer proposes the Arabic words.

## 6. Choices the engineer must not invent

- The tokens and sizes in §1b and the eight mappings in §1c. No other colours, and no opacity on events or legend items.
- The fixed 56px date column, the 12px gaps, the watermark in each event's own row, and the tag at the inline-end (under the body at Narrow).
- Latest first by default; order is a prop. The legend is opt-in and hides empty years.
- **Tests:**
  - grouping by year and both orders;
  - the year heading is a heading and each group an ordered list;
  - the watermark and tile are `aria-hidden`, and the `<time>` carries the full date;
  - upcoming: dashed outline and "Pending";
  - the legend toggles `aria-pressed`, hides events, and hides an empty year;
  - all hidden shows the line;
  - title and date text contrast ≥ 4.5:1 for all 8 categories, light and dark;
  - RTL places the tile and watermark on the right;
  - 3× text wraps without overlap.
