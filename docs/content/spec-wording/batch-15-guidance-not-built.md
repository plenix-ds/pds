# Spec wording, batch 15: Guidance for items not built yet (19 questions)

Issue #120. Each question of the last list in `questions.md` was checked against the spec text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## What this guidance is

- `platform/design-system/inventory-guidance.js` holds common-ground guidance for leaves Plenix has not built. The spec shows it only on a placeholder page ("Guidance written, not built"); a leaf with a record of its own never shows it.
- Of its 464 entries, 367 now belong to a leaf that has a record, so they are not shown any more. 97 entries are still shown.

## Result

- 15 of the 19 questions are about leaves that now have a record (Choropleth map, Pie, Gauge, Sankey, Treemap, Word cloud, Gantt, Radar, Sparkline, Object list, Version label, Circular progress, Field style variants, Style and grammar, Contrast rules, Portal, Scroll lock, Delete flow). Their guidance is no longer shown, and the built pages carry their own text, so the questions are answered by the built pages.
- 4 questions are about leaves still shown. Three needed a one-line fix (`inventory-guidance.js`); one was already right:
  - **Text alternatives:** "Provide data grids or summaries for charts" reads "Provide a data table or a summary for charts" (a chart's values are a static Table).
  - **Navigation bar:** the rail case now names the part: on wider screens use the side navigation or the Navigation rail.
  - **Previous / next navigation:** the end state is "Hide the control at the start and end: a link cannot be disabled."
  - **Donut chart:** already reads "Label each slice with its name and its share"; it has no axes line.
- The shared chart lines "Label axes with the measure and its unit" and "the question the chart answers" remain only on the Column chart, Stacked bar chart, Histogram and Donut chart entries, where axes or a title apply.
- `check-spec.js`: SPEC_OK.

## Decision card

- **Applied:** the three one-line fixes; the rest stays.
- **Follow-up for the DS Architect:** the 367 entries that are no longer shown could be deleted (`check-copy.js`, `build-packages.js` and `tools/variant-records.js` also read the file, so it needs a careful pass). I have not done it.
- **To switch:** reply on #120 with the question and the wording you want.

## End of the list

- All 15 groups of `questions.md` are now answered (batches 1 to 15). With the Layout group (15) to Written-since (11) and this list (19), the 322 questions are closed.
