# ADR 0048: Timeline grouped "density: compact" (the CTM Key Dates look)

- **Status:** accepted
- **Date:** 2026-11-10
- **Deciders:** pds1-ds-architect (G3), on the CTM owner's approved choices (chat, 2026-11-10, relayed on #1152; D-0145). Decision D-0146 (owner may switch).
- **Issue:** #1152 (S2).
  - Brief: `docs/pds1/slices/1152/brief.md` (PR #1153).
  - Design (G2, `pds1-design-director`): `docs/pds1/slices/1152/design.md`. It owns the look and the measured values. This entry owns the prop, the classes, the token names and their tiers.
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
| **A. `density?: "page" \| "compact"` on `Timeline`, default `"page"` (today's look). `"compact"` sets the compact look and `data-plx-density="compact"` on the root** | Same prop name and value as `DataGrid`. Default unchanged. Spacing reuses the compact density tokens. | A density value that also changes layout. |
| B. A new variant value, `variant="grouped-compact"` | One prop | Mixes two axes in one enum. A later compact rail Timeline would need another value. |
| C. Follow the page density: compact pages get the compact look | No prop | Changes existing grouped Timelines on compact pages without an app change (a surprise in a MINOR). |

## Decision

**Option A** (D-0146; reply B or C on #1152 to switch).

### API (`Timeline`)

- **`density?: "page" | "compact"`**, default `"page"`.
  - `"page"`: today's grouped look, with the page density's spacing. No change.
  - `"compact"`: the compact look below. The root carries `data-plx-density="compact"`, so the compact spacing tokens apply inside it whatever the page density.
  - Grouped only. With `variant="default"`, `density` is ignored and `devWarn` says so.
  - `"standard"` and `"comfortable"` are not added now. Adding them later is MINOR.
- **No other new prop.** The tag text "· upcoming" comes from a new string (below). "Pending" is the existing `timeline.pending`.
- **Class:** `plx-timeline--compact` on the root, next to `plx-timeline--grouped`. No new element class; the existing `__group`, `__year`, `__event`, `__date`, `__date-band` are reused. In compact, the `__watermark` and the rule are not rendered (the DOM drops them, so no hidden node remains).
- **One line:** the event body is a single row. The title does not shrink. The description takes the rest with `text-overflow: ellipsis`, and the full text stays reachable: the cut text is still the whole text in the DOM, so screen readers read all of it. The tag sits at the inline end.
- **Strings (new, `timeline` namespace):** `upcoming`: "upcoming", drawn as "· upcoming" after the tag label. Through `strings` and the catalog. Arabic needs the owner's approval (D-0012): @pds1-i18n-engineer proposes it on #1152. The English ships behind it.

### Tokens

G2 sets the values; the names and tiers are fixed here. Every new comp token reads a sys role (check 6); no name carries a value (check 7); no new colour ref.

- **Equal padding (owner choice 3).** The event's inline padding reads the same role as its block padding:
  - `timeline-grouped-event-padding-inline` becomes `{plx-sys.space-inset-md}` in standard (12px) and `{plx-sys.space-inset-sm}` in compact (8px), equal to `-padding-block` in each density file. The owner's 10px and 6px are off the 4px grid; G2 confirms 12 and 8 (or moves both block and inline together).
  - This applies to the standard grouped look too (brief P1), as the owner gave the standard value. It is a visual change to `variant="grouped"`: MINOR, called out in the changeset.
- **New sys roles** (`semantic.tokens.json`, over existing refs):
  - `size-calendar-tile-sm`: the compact date tile, over `{plx-ref.size-10u}` (40px).
  - `size-calendar-band-sm`: the compact tile's band, over a `plx-ref.size-*` step G2 picks.
  - `content-max-list`: the readable maximum inline size of a list, over `{plx-ref.content-max-sm}` (760px, the nearest existing step to the study's 720px; no new ref). G2 may pick another existing `content-max-*` step.
- **New comp tokens `timeline-grouped-compact-*`** (`platform/tokens/components/timeline.tokens.json`, comp -> sys only):
  - `-max-inline-size` -> `content-max-list`;
  - `-date-size` -> `size-calendar-tile-sm`;
  - `-date-band-size` -> `size-calendar-band-sm`;
  - `-date-month-font-size`, `-date-day-font-size` -> `text-*-font-size` roles G2 picks (the month larger than today's label size);
  - `-date-month-text` -> the sys role that is ≥ 4.5:1 on the band in light and dark (G2 measures; `content-inverse` in light is the starting point). A dark band in dark mode needs a per-theme role; if none fits, the build adds a purpose-named sys role in the theme files, sys -> sys, under G3 review;
  - `-tag-upcoming-text` -> `content-muted` (the "· upcoming" suffix), if G2 draws it apart from the label.
- **Rings (owner choice 5).** The compact tile has no rings. The standard tile drops them too only if G2 confirms the study's `key-dates-standard.png` (brief P1). If they go, the `timeline-grouped-date-ring-*` tokens are deprecated (below), not removed.
- **Band colour:** unchanged mechanism (ADR 0036): the band is the category's `-on-soft` through `--plx-comp-category-*`. Upcoming keeps `timeline-grouped-date-band-upcoming`.

### Check 8 pairs (new)

- Compact month ink on the category band, all eight slots, light and dark, ≥ 4.5:1.
- The existing title and `content-muted` on the tint pairs cover the one-line row (same colours).

## Consequences

- **Semver: MINOR.** Added: `density` on `Timeline`, the class `plx-timeline--compact`, the string `timeline.upcoming`, the sys roles `size-calendar-tile-sm`, `size-calendar-band-sm`, `content-max-list`, the comp tokens `timeline-grouped-compact-*`. Changed look: the grouped event's inline padding equals its block padding.
- **Deprecations:** only if G2 removes the standard rings: `timeline-grouped-date-ring-width`, `-height`, `-color`, `-radius` get `$deprecated` ("The date tile has no rings (ADR 0048). It keeps working and is removed in 2.0.0."), the CSS stops using them, a docs note is added, and they are removed in 2.0.0.
- Release: 1.6.0 (#1152). Then CTM bumps and sets `density="compact"` on Key Dates (CTM#239), with no CTM CSS.

## Enforced by

- G3 on the build PR: the API diff (`TimelineProps.density`, the class, the string, the tokens) matches this entry.
- Check 6: `timeline-grouped-compact-*` are comp -> sys; the new sys roles read refs or sys only. Check 7: no values in the names.
- Check 8: the compact month ink on the band, eight slots, light and dark.
- `token-definitions`: no new colour ref.
- Locale check (G6): `timeline.upcoming` in `en.json`; `ar.js` only after owner approval.
- Behavior tests for #1152 AC-1..AC-7 (plan §7e): no rule and no watermark node in compact; one box per event with the slot tint and a 1px border, dashed when upcoming; computed inline-start padding equals block padding; one line with the ellipsis and the end tag; no ring nodes and a ~40px tile; the max inline size stops at the token and sits at the start; RTL mirrors; `density` with `variant="default"` warns.
