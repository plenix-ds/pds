# 1032: loading state is a labeled spinner after a delay, not skeleton bars

Source: plenix-ds/pds#1032, the CTM owner (2026-11-08, "I do not want this loading style view"), relayed by ctm3-product-lead. Decision: D-0130 (owner rule; G2 readings, PR #1042). Microsoft first (D-0078): Fluent 2 Spinner with a label.

## Goal

- While a region loads, people see nothing for a fast load. For a slower one, they see a spinner with a short label ("Loading cases…") centered in that region. There are no gray shimmer bars.

## Already implemented

- `platform/components/Loading/Loading.tsx`: `Skeleton` (shimmer block, aria-hidden) and `Spinner` (`size`, `label`, role="status").
- `platform/components/ProgressBar/`, `ProgressCircle/`.
- `DESIGN.md` line ~260: a control's loading state shows a spinner after `motion-loading-delay`.
- Skeleton as a default: `platform/components/EntityTitle/EntityTitle.tsx` ~86 (title bars) and `platform/components/MetricCard/MetricCard.tsx` ~377 (loading card).
- CTM builds its page loading from `P.Skeleton` (CTM `static/ctm/council.js` ~1257, ~3324, ~3402), following the old Skeleton guidance.

## P0

- A documented region loading state (G3 names it; for example `<LoadingState label="Loading cases…" />`, or `Spinner` with `delay` and `centered`). The spinner and its label are centered in the region, and the region keeps its size. Nothing shows before `motion-loading-delay` (about 1 s). `role="status"`, announced once, reduced motion respected.
- EntityTitle and MetricCard default to this state instead of Skeleton.
- DataGrid, ListingPage and the page templates use it while their data loads. No Plenix default or template uses Skeleton.
- DESIGN.md: the loading rule says a spinner plus label after the delay, a ProgressBar with label when progress is known, and Skeleton only as an opt-in.
- EN/AR through the catalog (the default label "Loading…").

## P1

- Skeleton docs: opt-in only, never a default; examples updated.
- Visual baselines for the loading state (light, dark).

## P2

- Mark Skeleton for removal in 2.0.0, if the owner wants it gone entirely.

## Non-goals

- No new colors or motion tokens beyond the existing `motion-loading-*`.
- No change to button and control loading (already a spinner after the delay).

## Affected packages

- `@plenix-ds/react` (Loading, EntityTitle, MetricCard, DataGrid, templates), `@plenix-ds/styles`, i18n catalog, DESIGN.md.

## Acceptance

- **AC-1:** Given a region whose data arrives within the delay, when it loads, then no spinner, label or skeleton ever appears.
- **AC-2:** Given data that takes longer than the delay, then a spinner with its label appears centered in the region, with `role="status"`, and the region keeps its size.
- **AC-3:** Given EntityTitle, MetricCard, DataGrid or a page template in its loading state, then it renders no Skeleton element.
- **AC-4:** Given known progress, then the documented pattern is a ProgressBar with its label.
- **AC-5:** Given `prefers-reduced-motion`, then the spinner does not rotate, and the label still shows.
- **AC-6:** Given Arabic, then the default label comes from the catalog and the layout mirrors.

## Anything unclear

| Question | Answer |
|---|---|
| Keep Skeleton at all? | Answered: kept as an opt-in component, never a default (D-0130). Removing it is P2, for the owner. |
