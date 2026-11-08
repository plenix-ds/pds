# 987: Timeline variation, grouped by year, with category-colored event containers

Source: plenix-ds/pds#987, the CTM owner (2026-11-07, "lock this in as variation in pds, and implement in ctm"; CTM D-0058), relayed by ctm3-product-lead. Reference: CTM `docs/design/timeline-study.html` (CTM#255). Decisions: D-0115, D-0116 (ADR 0036), D-0117. Design: `docs/pds1/slices/987/design.md` (PR #992). Part of 1.2.0 (#1001, D-0121).

## Goal

- A case history reads as years, latest first. Each event is its own tinted container in its category's color, with a calendar-style date tile, so the owner sees at a glance what kind of event happened and when.

## Already implemented

- `platform/components/Timeline/` (the current Timeline: dots on a rail).
- The pill palette and the data colors (`platform/tokens`), which the category slots alias (D-0117; no new color refs).
- Build in progress: PR #1009 (CE1). The G3 API is in PR #989 (ADR 0036), and the G2 design in PR #992.

## P0

- `variant="grouped"` with `groupBy="year"`: year headings (latest first, reversible by an order prop), with the group gap `space-stack-3xl`.
- Each event in a container in its category slot (`category-1…8`: tint, border, title color, band), with the title, a secondary-ink description and the category tag at the end. No dots.
- The date tile at the container's start: the category band, month and day. An upcoming event with a date shows its month and day with a dashed outline. "Pending" is shown only for an upcoming event with no date (G2 on PR #1009). The accessible name is the full date.
- The watermark year beside each event: decorative (`aria-hidden`), never overlapping.
- Light and dark mode, token-only (D-0116 mix roles). Title and description contrast ≥ 4.5:1 for all 8 slots in both modes (check 8).
- RTL: the date column and the watermark mirror.
- EN/AR strings through the catalog (`timeline.pending`, `timeline.legend`).

## P1

- The optional legend that toggles categories. An item that's on shows no selected fill (G2; avoids the #70 dark-mode bug).
- Compact and comfortable density spacing (compact group gap 64px).

## P2

- Grouping by month or by another key.

## Non-goals

- No new color refs (D-0117). The app maps its own categories to the slots 1-8.
- No change to the default (rail) Timeline.
- No editing of events from the timeline.

## Affected packages

- `@plenix-ds/tokens` (category and timeline-grouped sys and comp roles, mix-amount refs), `@plenix-ds/styles`, `@plenix-ds/react` (Timeline), i18n catalog.

## Acceptance

- **AC-1:** Given events across 2024-2026, when `variant="grouped"` renders, then year headings appear 2026, 2025, 2024, each followed by its events. Given the reversed order, then 2024 comes first.
- **AC-2:** Given an event with `category: 3`, then its container has `data-plx-category="3"` and uses the slot's tint, border and title tokens, with no dot element.
- **AC-3:** Given a dated upcoming event, then the tile shows its month and day and the container has the dashed outline. Given an upcoming event with no date, then the tile reads `timeline.pending`. Given a past event with no date (a data error), then it warns in development, joins the previous group, and its tile shows the band only.
- **AC-4:** Given any slot 1-8, in light and in dark, then the title and the description have contrast ≥ 4.5:1 against the container fill (check 8).
- **AC-5:** Given the legend with category 2 turned off, then category 2's events are hidden, and the remaining legend items show no selected fill.
- **AC-6:** Given `dir="rtl"`, then the date tile sits at the inline start (the right) and the watermark mirrors.
- **AC-7:** Given a screen reader, then the watermark is hidden, and each date tile is announced as the full date.
- **AC-8:** Given the default Timeline (no variant), then its output is unchanged.

## Anything unclear

| Question | Answer |
|---|---|
| The issue says upcoming events show "Pending". The owner's study shows the date. | Answered: the study is the decision (the issue says so). A dated upcoming event shows the date, and "Pending" is only for an event with no date (G2, PR #1009). |
| Category colors | Answered: D-0117, existing palette shades only. |
