# ADR 0036: Timeline variant "grouped" and the category slots 1–8

- **Status:** accepted
- **Date:** 2026-11-08
- **Deciders:** pds1-ds-architect (G3), on the CTM owner's variation (CTM D-0058, relayed as D-0115). Decision D-0116 (owner may switch).
- **Issue:** #987 (S1)

## Context

- The owner locked in CTM's case timeline as a Plenix variation. The reference is LighthouseCollection/CTM#255, `docs/design/timeline-study.html`. It has:
  - year groups, newest first, with a rotated watermark year;
  - each event in its own container, tinted in its category's colour, with no dots;
  - a calendar date icon at the start of the event;
  - upcoming events dashed, with "Pending";
  - an optional legend that filters the categories.
- The ask names a token set `category-1…8`, which CTM maps to its eight case categories: plum, slate, teal, violet, copper, navy, green and gold.
- **Plenix already has a category palette.** It has 21 named hues, each with `category-<hue>`, `-on`, `-soft`, `-soft-border` and `-on-soft`, in light and dark.
  - `[data-plx-category="<hue>"]` (`platform/system/steps.css`) publishes them as `--plx-comp-category-*` context values. Tag, DataPill and Avatar read them.
  - Pill text on the soft tint is in check 8 (`CONTRAST_PAIRS`).
- **Every one of CTM's eight colors has a near hue:** magenta, gray, teal, purple, orange, navy, green and yellow. `data-color-*` has only seven hues and no soft border.
- `Timeline` today: `items[]` with `time`, `dateTime`, `title`, `description`, `icon`, `badge` and `content`; `orientation`; `align`. It has no strings.

## Options

| Option | For | Against |
|---|---|---|
| **A. Slots `category-1…8` as sys -> sys aliases of existing category hues, read per theme by a container mix; `variant="grouped"`; items carry a `category` object** | No new colours. A curated set of eight that works in dark mode, and one mechanism (`data-plx-category`) for every part. | 40 alias names and two amount roles. |
| B. Apps use the hue names directly, with no slots | No new tokens | Each app picks its own eight, so the timelines of two apps differ. The owner asked for a set. |
| C. New refs for plum, copper, slate and gold | Closest to the study | New palette colours that the existing hues already cover; the palette is frozen. |

## Decision

**Option A** (D-0116; reply B or C on #987 to switch).

### Tokens

Final, to G2's measured design (PR #992, `docs/pds1/slices/987/design.md` §1c). The pill category roles are the same in every theme. A pastel container on the dark surface would glare, and the dark `content-muted` would fail on it. So the slots alias the pill hues, and containers read them differently in dark, through per-theme mix amounts.

- **Slots** (sys -> sys aliases, light and dark theme files). For each slot n: `category-<n>`, `-on`, `-soft`, `-soft-border` and `-on-soft` read the hue's matching role.

  | Slot | Hue (CTM's use) |
  |---|---|
  | `category-1` | `magenta` (plum: Marriage) |
  | `category-2` | `gray` (slate: Application) |
  | `category-3` | `teal` (Filing) |
  | `category-4` | `purple` (violet: Assignment) |
  | `category-5` | `orange` (copper: Interviews & hearings) |
  | `category-6` | `navy` (Council decision) |
  | `category-7` | `green` (Decree) |
  | `category-8` | `yellow` (gold: Communications) |

  - No new colour ref. A slot never points at a ref.
- **`steps.css`:** `[data-plx-category="1"]` through `"8"` publish the same `--plx-comp-category-*` values as the named hues.
- **A coloured container** (light / dark, as G2 measured):

  | Part | Light | Dark |
  |---|---|---|
  | Fill | `-soft` | `-soft-border` mixed 5% into `surface-default` |
  | Border | `-soft-border` | `-soft-border` mixed 35% into `surface-default` |
  | Title, date band | `-on-soft` | `-soft-border` |

  - The band is never `-on`.
  - **Token-only, one CSS rule for both modes** (as built in PR #1009):
    - The slots are per theme. In light they alias the hue. In dark, `-soft` and `-soft-border` are `{plx-sys.surface-default}` and `-on-soft` is `{plx-sys.category-<hue>-soft-border}`, all sys -> sys.
    - fill: `color-mix(in srgb, var(on-soft) var(--plx-sys-category-tint-amount), var(soft))`.
    - border: `color-mix(in srgb, var(on-soft) var(--plx-sys-category-tint-border-amount), var(soft-border))`.
    - title and band: `on-soft`.
    - `category-tint-amount` is `mix-amount-none` / `mix-amount-2xs` (5%). `category-tint-border-amount` is `mix-amount-none` / `mix-amount-lg` (35%).
    - Light gives exactly `soft`, `soft-border` and `on-soft`. Dark gives G2's 5% fill and 35% border, with the title from the hue's `soft-border`.
  - **New refs (amounts, not colours):** `mix-amount-none` 0%, `mix-amount-2xs` 5% and `mix-amount-lg` 35%. At 8%, slots 2, 5 and 6 fall below 4.5:1 (G2 and CE1 measured), so 8% is not used.
- **Check 8:** for all eight slots, light and dark, the title colour and `content-muted` on the computed fill are ≥ 4.5:1. The rule computes the mix. G2 measured ≥ 4.67.
- **New sys role `content-decorative`:** the watermark. Light `gray-200`, dark `gray-700`. It is never used for text people must read; check 8 excludes it by its `use` note.
- **Group gap:** new sys `space-stack-3xl`, in the density files. Standard and comfortable read the new ref `space-20u` (80px); compact reads `space-16u` (64px).
- **Comp tokens `timeline-grouped-*`** (comp -> sys only) follow G2's §1b.
  - Where G2 names a size with no sys role yet (the 56px date tile, the 72 × 2px rule, the 4 × 8px ring, the 24px watermark column), the build PR adds a purpose-named sys role over an existing `plx-ref.size-*` step, under G3 review.
  - An event's colours always come from `--plx-comp-category-*` through the mixes above.

### API (`Timeline`)

- **`variant?: "default" | "grouped"`**, default `"default"` (unchanged).
  - `"grouped"` is vertical only: `orientation` and `align` are ignored, and `devWarn` says so.
  - There is no `groupBy` prop: `"grouped"` groups by year. A later grouping is a new value, MINOR.
- **Order:** the items are drawn in the order given, and consecutive items with the same year form a group. The app reverses the array to switch latest-first and oldest-first. In `"grouped"`, `dateTime` (ISO 8601) is required on every item; `devWarn` names the items without it.
- **New item fields:**
  - `category?: { id: string; label: React.ReactNode; color: CategoryColor }`.
    - `CategoryColor` is `"1"…"8"` or a category hue name. It is exported as a type.
    - The label is drawn as the end tag (a `Tag` with `data-plx-category`).
  - `upcoming?: boolean`: the dashed outline and the grey band. The tile shows the month and day when `dateTime` is given, and the word Pending when it isn't (G2). An upcoming item may leave out `dateTime`, and it joins the group before it.
- **Legend:**
  - `legend?: boolean`, default false. The legend lists each distinct `category.id` in item order, as toggle buttons (`aria-pressed`).
  - `hiddenCategories?: string[]` and `onHiddenCategoriesChange?(ids: string[])` make it controlled. Without them it is uncontrolled.
  - A hidden category's events are not rendered. A year group with no visible event is dropped.
- **Date icon:** month and day come from `dateTime` through `Intl.DateTimeFormat` in the page's locale, so there are no month words in the catalog. The icon's accessible name is the full date. The watermark year is `aria-hidden`.
- **Semantics:**
  - Each year is a `<section aria-labelledby>`, with the year as a heading. `headingLevel?: 2–6` defaults to 3.
  - Inside each section, the events are an `<ol>`.
  - The legend comes before the groups, as a `role="group"` named by `strings.legend`.
- **Strings (new, `timeline` namespace):**
  - `pending`: "Pending".
  - `legend`: "Filter by category".
  - Through `strings` and the catalog. Arabic needs the owner's approval (D-0012): @pds1-i18n-engineer proposes both words on #987 now. The build's English ships behind them.
- **Classes:** `plx-timeline--grouped`, `plx-timeline__group`, `__year`, `__watermark`, `__event`, `__event--upcoming`, `__date`, `__date-band`, `__legend`, and `__legend-item`.
- **RTL:** logical properties. The watermark and the date column mirror.

## Consequences

- **Semver: MINOR.** Everything is added; `variant="default"` doesn't change.
- **Added:**
  - the `variant` prop and the item fields `category` and `upcoming`;
  - the props `legend`, `hiddenCategories`, `onHiddenCategoriesChange` and `headingLevel`;
  - the type `CategoryColor`;
  - the 40 slot aliases, `category-tint-amount`, `category-tint-border-amount`, `content-decorative`, `space-stack-3xl`, the refs `mix-amount-none`, `-2xs`, `-lg` and `space-20u`, the sys size and type roles for the date tile and the watermark (`size-calendar-tile`, `size-calendar-band`, `size-section-rule`, `size-watermark`, `text-calendar-day-font-size`, `text-watermark-font-size`), the type `TimelineCategory`, the `timeline-grouped-*` comp tokens, the classes, and the two strings.
- CTM moves its case timeline onto `variant="grouped"` and maps its categories to slots 1–8 (CTM#242).

## Enforced by

- G3 on the build PR: the API diff matches this entry.
- Check 6: the slots are sys -> sys, and `timeline-grouped-*` is comp -> sys. Check 7: no values in the names.
- Check 8: slot text on its tint, and the title (`-on-soft`) on the tint, ≥ 4.5:1, light and dark.
- `token-definitions`: no new colour ref. The new refs are three mix amounts and one space step.
- Locale check (G6): `timeline.pending` and `timeline.legend` exist in `en.json`; `ar.js` gets them only after owner approval.
- The build PR's behavior tests (plan §7e):
  - grouping and order;
  - the legend toggles from the keyboard, with `aria-pressed`;
  - the date's accessible name;
  - the watermark is `aria-hidden`;
  - an upcoming event shows Pending;
  - mirroring in RTL;
  - 1000 events.
