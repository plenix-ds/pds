# Spec wording, batch 5: Data display (29 questions)

Issue #120. Each question of the Data display group in `questions.md` was checked against the spec text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## Result

- 28 of the 29 questions are already answered by text written after the questions were asked.
- One needed a change: the chart pages called the table of values under each chart the "data grid". Under the table rule a chart's values are a static Table, so 25 mentions on 15 chart records and write-ups now say "data table" (`platform/design-system/parts/`).
- `check-spec.js`: SPEC_OK.

## Answers

| Part | Question | Answer on main | Evidence |
|---|---|---|---|
| Data grid | "Reference tables" use line | Moved: When not to use says "Static facts, in documentation or settings: use Table". | Data grid avoid lines. |
| Table | May a name/value table hide its header row? | Yes for a two-column name/value table (`headerVisible={false}`, the first column names each row). The Property table page is for reference facts with more than one value per row, which keep a header row. Both are correct. | Table anatomy; Property table use line. |
| Table | Grid role? | No: a Table is announced as a table (role table), with row headers when the first column names each row. | Table announce row. |
| Tag | Focus underline | The add field and the rename field show the field's focused border, like every field; the underline shadow is only for underline-style fields. | Tag docs; shadow note. |
| Counter | Solid pill? "amber"? | The pill is soft (light fill, border two shades darker, dark text) and the warning tone is called yellow. | Counter anatomy. |
| Metric | "Use Count" | Count is a component (a number on its own), so the line is right. | `Count.tsx`. |
| Card | Purpose says it opens | The Card has no purpose line that says it opens; the Static card variant does not open. | Card record. |
| Status label | Active and In review tones | Active is the active tone (blue), In review is waiting (yellow), Draft is neutral. Every pill is soft. | Status label text. |
| Lozenge | Solid, and a category? | Always a soft pill, for a status only; a category is a Tag. | Lozenge text. |
| List | Numbered? A table? | Yes, `<ul>` or `<ol>`. Rows people act on are an interactive list or a DataGrid. | List text. |
| Responsive table | Which is right? | Under 600px of its own width the DataGrid becomes a list of its key columns; inside a SplitView or with `narrow="table"` it scrolls sideways; the static Table always scrolls sideways. | Responsive table text. |
| Expandable table | Chevron or box? | A 14px box with + or −, in the name column. | Expandable table text. |
| Compact, Editable and Tree table | Repeat the DataGrid write-up | They have no copied purpose; they show the DataGrid write-up by `docsFrom`, written once on the DataGrid page. | Their records. |
| Chart foundations and the chart pages | "Data grid" for the values view | Changed: "data table" on the 15 chart pages (25 mentions). | `parts/w07C.docs.js`, `w08A`, `w09A`, `w09B`, `w09C`. |
| Chart threshold | Own purpose | Yes: marks a limit the data should stay under or above. | Threshold record. |
| Profile card | "Presence dot carries a shape from 40px" | The sentence is no longer on the page. | Profile card docs. |
| Chart reference line | "format or format" | The sentence is no longer on the page. | Reference line docs. |
| Chart accessibility | Keyboard on every chart? | Line, scatter, heat map, treemap, waterfall and similar charts read the values point by point; the others reach "Show the data", the same values as a table. The page says which. | Chart accessibility text. |
| Chart accessibility | "Data grid" | Now "data table" (see above). | Chart accessibility use lines. |
| Metric card | Which card is current? | The new card: one anatomy for every kind of data, 12 types, 5 layouts, 5 styles. | Metric card text. |
| Metric card | "Appearance" or "style" | The text says "style" and names the `appearance` setting. | Metric card text. |
| Bubble chart | "24px across its radius" | The largest bubble is 48px wide (a 24px radius). | Bubble chart text. |
| Box plot | "Points of the frame" | Reads: "The values beyond the whiskers, as points." | With outliers variant. |
| Step chart | Own purpose | Yes: values that change at moments and hold in between. | Step chart purpose. |
| Waterfall chart | "Total without a value" | Reads: a step marked as a total with no amount, so the chart shows the running total there. | Waterfall use line. |

## Decision card

- **Applied:** "data table" for the chart values view; everything else stays.
- **To switch:** reply on #120 with the question and the wording you want.

## Next

- Batch 6 is the Feedback group (16 questions), then Overlays (25), Specialized (36) and the rest of `questions.md`, one group per pull request.
