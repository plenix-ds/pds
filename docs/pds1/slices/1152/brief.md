# 1152: grouped Timeline, a compact look with a calendar date tile (CTM Key Dates)

Source: plenix-ds/pds#1152, the CTM owner (chat, 2026-11-10, each choice approved), relayed by CTM3 - PM. Approved picture and study: LighthouseCollection/CTM `preview-239/2026-11-10/` (commit 110f45a), `key-dates-compact.png` and `key-dates-compact-study.html`. Decision: D-0145. Builds on the grouped Timeline (#987; D-0115, D-0116 / ADR 0036, D-0117). Part of D-0121: canonical in Plenix, no CTM CSS.

## Goal

- CTM's Key Dates card shows its events as a compact year-grouped list: one tinted line per event with a small calendar date tile, readable at a glance and at a readable width.

## Already implemented

- `platform/components/Timeline/Timeline.tsx` `variant="grouped"`: year groups, category containers (`category-1…8` slots), the date tile with band, month and day, the watermark year, "Pending" for an undated upcoming event, dashed upcoming outline, legend, RTL, dark mode (1.2.0, #987, #1055).
- Grouped design and tokens: `docs/pds1/slices/987/design.md`, the `timeline-grouped-*` comp tokens.

## P0

- A compact look of the grouped Timeline (G3 names it; for example `density="compact"` or a named variant), with exactly the owner's choices:
  1. A year heading above each year's events, **no line under it**. **No watermark year** in compact.
  2. Each event is **one tinted box** in its category color with a 1px border in that color. Upcoming: a dashed border. Undated: "Pending".
  3. **Inline-start padding equals top and bottom padding** (compact 6px, standard 10px, on the 4px-grid tokens G2 picks; 6 and 10 are the owner's values).
  4. **One line per event:** title (semibold, category color), then the short description (muted, cut with an ellipsis), then the **category tag at the inline end** ("· upcoming" added when upcoming).
  5. **Date tile:** no ring lines on top. A dark band in the category color holds the **month in white, larger and bold**, with little space above it, and the day large below it. About 40px in compact, about 56px in standard.
  6. **Not full width:** a readable maximum inline size (the study uses 720px; G2 picks the size token), aligned to the start.
- Tokens only. The eight categories use the existing slots. Light and dark; RTL mirrors.

## P1

- Choice 5's tile (no rings, white bold month) and choice 3's equal padding also apply to the standard grouped look, if G2 agrees it matches the study's `key-dates-standard.png`.
- A docs example: "Key dates" with fictional data.

## P2

- None.

## Non-goals

- No new color refs. No change to the default (rail) Timeline.
- No CTM-side CSS: CTM only sets the prop (CTM#239).

## Affected packages

- `@plenix-ds/react` (Timeline), `@plenix-ds/styles`, `@plenix-ds/tokens` (comp roles over existing sys tokens; G3).

## Acceptance

- **AC-1:** Given the compact look with events in 2025 and 2026, when it renders, then each year has a heading with no rule under it and no watermark year.
- **AC-2:** Given an event with `category: 4`, then it renders as one box with the slot's tint and a 1px slot-colored border. Given an upcoming event, then the border is dashed. Given an undated upcoming event, then the tile reads `timeline.pending`.
- **AC-3:** Given any event, then its box's inline-start padding equals its block padding (computed style).
- **AC-4:** Given a long description, then the event stays on one line: the title, the description cut with an ellipsis, and the category tag at the inline end ("· upcoming" when upcoming).
- **AC-5:** Given the date tile, then it has no ring elements, the band is the category color with the month in white bold, and the tile is about 40px in compact.
- **AC-6:** Given a wide container, then the timeline's inline size stops at the max-width token and sits at the inline start.
- **AC-7:** Given dark mode and `dir="rtl"`, then contrast stays ≥ 4.5:1 for title and description (check 8) and the layout mirrors.

## Anything unclear

| Question | Answer |
|---|---|
| Prop name | G3 decides (D-0145 proposes `density="compact"`). It does not block G1. |
| 6px is off the 4px grid | G2 maps it to the nearest grid token (DESIGN.md: everything on the 4px grid), keeping left = top = bottom. Owner's intent is "equal". |
