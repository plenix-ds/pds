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
| **A. Slots `category-1…8` over existing palette shades, per mode; `variant="grouped"`; items carry a `category` object** | No new colours. The slots give apps a curated, contrast-checked set of eight that works in dark mode, and one mechanism (`data-plx-category`) for every part. | 32 slot roles beside the pill hues. |
| B. Apps use the hue names directly, with no slots | No new tokens | Each app picks its own eight, so the timelines of two apps differ. The owner asked for a set. |
| C. New refs for plum, copper, slate and gold | Closest to the study | New palette colours that the existing hues already cover; the palette is frozen. |

## Decision

**Option A** (D-0116; reply B or C on #987 to switch).

### Tokens

Revised the same day after G2 (PR #992, D-0117): the pill palette keeps light tints in dark mode, and a container that size would glare. The slots therefore get their own per-mode values, and the names stay G3's.

- **Slots** (sys, light and dark theme files). For each n there are four roles. No new colour ref; they are existing palette shades.
  - `category-<n>-on-soft`: the text (an event's title, the tag text, the legend swatch).
  - `category-<n>`: the date band. It equals `-on-soft`.
  - `category-<n>-soft`: the tint base.
  - `category-<n>-soft-border`: the border base.

  | Slot | CTM | Light text / tint / border | Dark text |
  |---|---|---|---|
  | 1 | plum | pink-700 / pink-100 / pink-300 | pink-300 |
  | 2 | slate | gray-700 / gray-100 / gray-300 | blue-250 |
  | 3 | teal | cyan-700 / cyan-100 / cyan-300 | cyan-300 |
  | 4 | violet | purple-700 / purple-100 / purple-300 | purple-300 |
  | 5 | copper | brown-500 / orange-100 / orange-300 | orange-200 |
  | 6 | navy | blue-700 / blue-100 / blue-300 | blue-275 |
  | 7 | green | green-700 / green-100 / green-200 | green-200 |
  | 8 | gold | brown-600 / yellow-100 / yellow-300 | yellow-300 |

  - In dark mode, `-soft` and `-soft-border` are `{plx-sys.surface-default}`, and the hue comes from the mix below.
- **The mix, token-only** (the ADR 0004 pattern). A container draws:
  - fill: `color-mix(in srgb, var(--plx-comp-category-on-soft) var(--plx-sys-category-tint-mix), var(--plx-comp-category-soft))`;
  - border: `color-mix(in srgb, var(--plx-comp-category-on-soft) var(--plx-sys-category-border-mix), var(--plx-comp-category-soft-border))`.
  - New sys roles, per theme:
    - `category-tint-mix`: light `{plx-ref.mix-amount-none}` (0%, so the fill is the 100 shade exactly), dark `{plx-ref.mix-amount-xs}` (8%).
    - `category-border-mix`: light `mix-amount-none`, dark `{plx-ref.mix-amount-lg}`.
  - New refs (not colours): `mix-amount-none` 0% and `mix-amount-lg` 35%.
- **`steps.css`:** `[data-plx-category="1"]` through `"8"` publish `--plx-comp-category-on-soft`, `-soft`, `-soft-border` and `--plx-comp-data-color` from the slot. They don't set `--plx-comp-data-color-on-soft`: the slots are for coloured containers, not filled avatars or pills. The 21 named pill hues are unchanged.
- **Check 8**, light and dark, for all eight slots:
  - `category-<n>-on-soft` on the tint ≥ 4.5:1, and `content-muted` on the tint ≥ 4.5:1.
  - The dark tint is computed by the rule from the mix. G2 measured all of them at ≥ 4.56.
- **The watermark:** new sys role `decorative-mix` (`{plx-ref.mix-amount-xs}`, 8%). The component draws `color-mix(in srgb, var(--plx-sys-content-default) var(--plx-sys-decorative-mix), var(--plx-sys-surface-default))` through its comp tokens. It is never used for text people must read, and check 8 skips it.
- **Group gap:** new sys `space-stack-3xl`, in the density files. Standard and comfortable read the new ref `space-20u` (80px); compact reads `space-16u` (64px).
- **Comp tokens `timeline-grouped-*`** (comp -> sys only) follow G2's table (§1b of `docs/pds1/slices/987/design.md`).
  - Where G2 names a size with no sys role yet (the 56px date tile, the 72 × 2px rule, the 4 × 8px ring, the 24px watermark column), the build PR adds a purpose-named sys role over an existing `plx-ref.size-*` step, under G3 review.
  - The colours of an event always come from `--plx-comp-category-*`.

### API (`Timeline`)

- **`variant?: "default" | "grouped"`**, default `"default"` (unchanged).
  - `"grouped"` is vertical only: `orientation` and `align` are ignored, and `devWarn` says so.
  - There is no `groupBy` prop: `"grouped"` groups by year. A later grouping is a new value, MINOR.
- **Order:** the items are drawn in the order given, and consecutive items with the same year form a group. The app reverses the array to switch latest-first and oldest-first. In `"grouped"`, `dateTime` (ISO 8601) is required on every item; `devWarn` names the items without it.
- **New item fields:**
  - `category?: { id: string; label: React.ReactNode; color: CategoryColor }`.
    - `CategoryColor` is `"1"…"8"` or a category hue name. It is exported as a type.
    - The label is drawn as the end tag (a `Tag` with `data-plx-category`).
  - `upcoming?: boolean`: the dashed outline, the grey band and the word Pending.
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
  - the 32 slot roles, `category-tint-mix`, `category-border-mix`, `decorative-mix`, `space-stack-3xl`, the refs `mix-amount-none`, `mix-amount-lg` and `space-20u`, the `timeline-grouped-*` comp tokens, the classes, and the two strings.
- CTM moves its case timeline onto `variant="grouped"` and maps its categories to slots 1–8 (CTM#242).

## Enforced by

- G3 on the build PR: the API diff matches this entry.
- Check 6: the slots are sys -> sys, and `timeline-grouped-*` is comp -> sys. Check 7: no values in the names.
- Check 8: slot text on its tint, and the title (`-on-soft`) on the tint, ≥ 4.5:1, light and dark.
- `token-definitions`: no new colour ref; the three new refs are a mix amount pair and one space step.
- Locale check (G6): `timeline.pending` and `timeline.legend` exist in `en.json`; `ar.js` gets them only after owner approval.
- The build PR's behavior tests (plan §7e):
  - grouping and order;
  - the legend toggles from the keyboard, with `aria-pressed`;
  - the date's accessible name;
  - the watermark is `aria-hidden`;
  - an upcoming event shows Pending;
  - mirroring in RTL;
  - 1000 events.
