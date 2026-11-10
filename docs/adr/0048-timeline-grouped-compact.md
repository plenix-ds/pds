# ADR 0048: Timeline grouped "density: compact" (the CTM Key Dates look)

- **Status:** accepted
- **Date:** 2026-11-10
- **Deciders:** pds1-ds-architect (G3), on the CTM owner's approved choices (chat, 2026-11-10, relayed on #1152; D-0145). Decision D-0146, superseded by D-0150 to match the G2 design (owner may switch).
- **Issue:** #1152 (S2).
  - Brief: `docs/pds1/slices/1152/brief.md` (PR #1153).
  - Design (G2 PASS, PR #1158, D-0148): `docs/pds1/slices/1152/design.md`. It owns the look and the values (§1c). This entry owns the prop, the classes, the strings, the token names and their tiers.
- **Builds on:** ADR 0036 (`variant="grouped"`, the category slots).

## Context

- The CTM owner approved a compact look of the grouped Timeline for Key Dates (CTM#239). CTM will set a prop and add no CSS (D-0121).
- The look differs from today's grouped Timeline in layout, not only in spacing:
  - no rule under the year heading and no watermark year;
  - one line per event: title, description cut with an ellipsis, category tag at the inline end;
  - a smaller date tile (about 40px) with no rings and a white bold month on a category band;
  - a readable maximum inline size, aligned to the start.
- `DataGrid` already has `density?: "compact" | "standard" | "comfortable" | "page"`. That is the one precedent for a per-part density prop.
- The grouped Timeline already follows the page density through `components.density-*.tokens.json` (event padding). A region that carries `data-plx-density` gets that density's tokens (`platform/system/density.css`).
- Pages already set compact density (CTM, docs). If the compact look followed the page density, every grouped Timeline on a compact page would change shape with no app change.

## Options

| Option | For | Against |
|---|---|---|
| **A. `density?: "page" \| "compact"` on `Timeline`, default `"page"` (the standard look, following the page density). `"compact"` draws the compact look at one fixed size** | Same prop name and value as `DataGrid`. Default unchanged in shape. | A density value that also changes layout. |
| B. A new variant value, `variant="grouped-compact"` | One prop | Mixes two axes in one enum. A later compact rail Timeline would need another value. |
| C. Follow the page density: compact pages get the compact look | No prop | Changes existing grouped Timelines on compact pages without an app change (a surprise in a MINOR). |

## Decision

**Option A** (D-0150, superseding D-0146; reply B or C on #1152 to switch).

### API (`Timeline`)

- **`density?: "page" | "compact"`**, default `"page"`.
  - `"page"`: the standard grouped look, whose spacing follows the region density (8, 12, 16px padding).
  - `"compact"`: the compact look (design §1a). It is one size in every region density (design §3), so it reads its own `timeline-grouped-compact-*` tokens and does **not** set `data-plx-density` (that would also resize the Tags and legend Buttons inside).
  - Grouped only. With `variant="default"`, `density` is ignored and `devWarn` says so.
  - `"standard"` and `"comfortable"` are not added now. Adding them later is MINOR.
- **Class:** `plx-timeline--compact` on the root, next to `plx-timeline--grouped`. The existing element classes are reused. In compact, `__watermark` is not rendered. In both looks, the heading rule (`__year::after`) and the tile rings (`__date::before`, `::after`) are gone.
- **One line (compact):** title, description, tag. A cut title or description shows in full in the Plenix Tooltip while it is cut (`useTruncated`, `describe={false}`), and the full text stays in the accessibility tree. Internal: no new prop.
- **Strings (new, `timeline` namespace), patterns with a `{category}` slot** so Arabic can order them:
  - `tagUpcoming`: "{category} · upcoming";
  - `tagPending`: "{category} · pending" (an undated compact event; the 40px tile has no room for the word).
  - Through `strings` and the catalog. The Technical Writer words them; @pds1-i18n-engineer proposes the Arabic on #1152 (D-0012). Until the owner approves, the Arabic tag shows the category name alone. `timeline.pending` stays for the hidden `<time>` text and the standard tile.

### Tokens (design §1c; comp -> sys only, no new ref)

- **New sys roles** (`semantic.tokens.json` unless noted):
  - `content-max-list`: the readable maximum inline size of a list, `{plx-ref.size-180u}` (720px).
  - `size-calendar-tile-sm`: the compact date tile, `{plx-ref.size-10u}` (40px). (G2 proposed `-compact`; a density word in a size name reads like a mode, so the step name `-sm` is used, beside `size-calendar-tile`.)
  - `size-calendar-band-sm`: the compact tile's band, `{plx-ref.size-4u}` (16px).
  - `text-calendar-month-font-size`: the standard tile's month, `{plx-ref.font-size-14}` (14px), beside `text-calendar-day-font-size`.
- **Changed sys value:** `size-calendar-band` becomes `{plx-ref.size-5u}` (20px, the standard band). Only the Timeline reads it.
- **New comp tokens, compact look** (`platform/tokens/components/timeline.tokens.json`):

  | Token | Reads |
  |---|---|
  | `timeline-grouped-compact-max-inline-size` | `content-max-list` |
  | `timeline-grouped-compact-group-gap` | `space-stack-2xl` |
  | `timeline-grouped-compact-heading-gap` | `space-stack-sm` |
  | `timeline-grouped-compact-heading-font-size` | `text-surface-title-font-size` |
  | `timeline-grouped-compact-event-gap` | `space-stack-xs` |
  | `timeline-grouped-compact-event-padding` | `space-inset-sm` |
  | `timeline-grouped-compact-event-column-gap` | `space-inline-sm` |
  | `timeline-grouped-compact-body-gap` | `space-inline-sm` |
  | `timeline-grouped-compact-date-size` | `size-calendar-tile-sm` |
  | `timeline-grouped-compact-date-band-size` | `size-calendar-band-sm` |
  | `timeline-grouped-compact-date-month-font-size` | `text-label-font-size` |
  | `timeline-grouped-compact-date-day-font-size` | `text-surface-title-font-size` |

  - Compact needs no max-width token in the standard look: the standard look has no cap (a comp token cannot read `none`).
- **New comp tokens, both looks:**
  - `timeline-grouped-event-padding` -> `space-inset-md`; the density files set compact `space-inset-sm` and comfortable `space-inset-lg`. One token, so start = end = block-start = block-end (owner choice 3).
  - `timeline-grouped-date-month-upcoming-text` -> `content-default` (the month on the grey upcoming band).
- **Changed comp value:** `timeline-grouped-date-month-text` becomes `content-inverse` (white in light, black in dark; G2 measured 6.77-13.62:1).
- **The band** keeps ADR 0036's mechanism: the category title colour through `--plx-comp-category-*`, never `-on`.

### Check 8 pairs (new)

- `content-inverse` on the category band, eight slots, light and dark, ≥ 4.5:1.
- `content-default` on `timeline-grouped-date-band-upcoming`, light and dark, ≥ 4.5:1.

## Consequences

- **Semver: MINOR.**
  - Added: `density` on `Timeline`, the class `plx-timeline--compact`, the strings `timeline.tagUpcoming` and `timeline.tagPending`, the four sys roles, the `timeline-grouped-compact-*` tokens, `timeline-grouped-event-padding`, `timeline-grouped-date-month-upcoming-text`.
  - Changed look of `variant="grouped"` (owner-approved, D-0148 reading 3): no heading rule, no rings, a 20px band with a white (dark: black) 14px month, equal padding. Called out in the changeset.
- **Deprecated** (ADR 0002 rule: `$deprecated` "… (ADR 0048). It keeps working and is removed in 2.0.0.", a docs note, this MINOR, removal in 2.0.0). The CSS stops reading them:
  - `timeline-grouped-event-padding-block`, `-padding-inline` (and their density overrides) -> `timeline-grouped-event-padding`;
  - `timeline-grouped-heading-rule-width`, `-height`, `-color`, `-radius`, `-gap`, and the sys `size-section-rule`: no rule;
  - `timeline-grouped-date-ring-width`, `-height`, `-color`, `-radius`: no rings.
- Release: 1.6.0 (#1152). Then CTM bumps and sets `density="compact"` on Key Dates (CTM#239), with no CTM CSS.

## Enforced by

- G3 on the build PR: the API diff (`TimelineProps.density`, the class, the two strings, the tokens and the deprecations) matches this entry.
- Check 6: `timeline-grouped-*` comp -> sys; the new sys roles read refs. Check 7: no values in the names.
- Check 8: the two new pairs above.
- `token-definitions`: no new ref.
- Locale check (G6): `timeline.tagUpcoming` and `timeline.tagPending` in `en.json`; `ar.js` only after owner approval.
- Behavior tests: #1152 AC-1..AC-7 and design §6 (equal padding in both looks and three densities; no `::before`/`::after` on the tile; month colour per band; undated compact tag suffix; one-line ellipsis with the Tooltip only while cut; ≤ 720px at the inline start, LTR and RTL; `density` on `variant="default"` warns).
