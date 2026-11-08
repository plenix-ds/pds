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
| **A. Slots `category-1…8` as sys -> sys aliases of existing category hues; `variant="grouped"`; items carry a `category` object** | No new colours or refs. The slots give apps a curated, contrast-checked set of eight, and one mechanism (`data-plx-category`) for every part. | Eight alias names over the hue names. |
| B. Apps use the hue names directly, with no slots | No new tokens | Each app picks its own eight, so the timelines of two apps differ. The owner asked for a set. |
| C. New refs for plum, copper, slate and gold | Closest to the study | New palette colours that the existing hues already cover; the palette is frozen. |

## Decision

**Option A** (D-0116; reply B or C on #987 to switch).

### Tokens

- **New sys aliases** (light and dark theme files; sys -> sys; no new ref). For each slot n: `category-<n>`, `-on`, `-soft`, `-soft-border` and `-on-soft` read the hue's matching role.

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

  - G2 may swap a slot to another existing hue. A slot never points at a ref.
- **`steps.css`:** `[data-plx-category="1"]` through `"8"` publish the same `--plx-comp-category-*` values as the named hues. Any part that takes a category also takes the slots.
- **Check 8:** `category-<n>-on-soft` on `category-<n>-soft` is ≥ 4.5:1, light and dark, for all eight slots.
- **New sys role `content-decorative`:** the watermark year's ink. Light `gray-200`, dark `gray-700`. It is purpose-named and never used for text people must read; check 8 excludes it by its `use` note.
- **Comp tokens** `timeline-grouped-*` (comp -> sys only; G2 sets which sys roles):
  - year heading type and colour, its underline size and colour, the gap between groups;
  - the event radius (`shape-sm`), padding, and the gap between events;
  - the date column gap; the calendar icon radius, band height and ring size;
  - the watermark gap.
  - The colours of an event come from `--plx-comp-category-*`, never from per-slot comp tokens.

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
  - the 40 slot aliases, `content-decorative`, the `timeline-grouped-*` comp tokens, the classes, and the two strings.
- CTM moves its case timeline onto `variant="grouped"` and maps its categories to slots 1–8 (CTM#242).

## Enforced by

- G3 on the build PR: the API diff matches this entry.
- Check 6: the slots are sys -> sys, and `timeline-grouped-*` is comp -> sys. Check 7: no values in the names.
- Check 8: slot text on its tint, and the title (`-on-soft`) on the tint, ≥ 4.5:1, light and dark.
- `token-definitions`: no new ref.
- Locale check (G6): `timeline.pending` and `timeline.legend` exist in `en.json`; `ar.js` gets them only after owner approval.
- The build PR's behavior tests (plan §7e):
  - grouping and order;
  - the legend toggles from the keyboard, with `aria-pressed`;
  - the date's accessible name;
  - the watermark is `aria-hidden`;
  - an upcoming event shows Pending;
  - mirroring in RTL;
  - 1000 events.
