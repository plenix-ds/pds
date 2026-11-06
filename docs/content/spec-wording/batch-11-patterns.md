# Spec wording, batch 11: Patterns (17 questions)

Issue #120. Each question of the Patterns group in `questions.md` was checked against the spec text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## Result

- 15 of the 17 questions are already answered by text written after the questions were asked. No variant page of this group now carries the generic "uses the same controls and persistence contract" or "Use this composition when it fits the task" lines.
- 2 needed a change (`parts/w00B.records.js`, `parts/w11A.docs.js`):
  - Multi-selection said "BulkActions above the results". It now says the selection's commands are in the command bar, or in the Bulk action bar on a page without one.
  - The Connected accounts "Error messages" row held a labeling rule ("List shared data in plain words"). It now says what the errors are: a failed connection says why and offers Reconnect; the plain-words rule stays as the scopes example.
- `check-spec.js`: SPEC_OK.

## Answers

| Part | Question | Answer on main | Evidence |
|---|---|---|---|
| Bulk selection | Is the Bulk action bar required? | No: it is only for a page without a command bar; under a command bar the selection's commands replace the page's actions. The parts list says so. | Bulk selection anatomy. |
| Multi-selection | Own purpose | Own text, changed in this batch to name the command bar. | Multi-selection text. |
| Saved view | Own purpose | Yes: it keeps how a person arranged a list (sort, filters, column widths, order, hidden columns) under a name. | Saved view text and purpose. |
| Filter and sort workflow | Older layout in the write-up | The write-up describes the command bar: Filter, Sort, Group, Columns and View buttons; no Apply button. | Anatomy and content rows. |
| Search workflow | Enter in every application? | Yes: Enter in the header field opens the Search workspace with the query kept; the dashboard home searches everything, an application only itself. | Keyboard row; record text. |
| Coach mark | Contrast row | Reads plainly: text and icons are the on-brand color on the brand blue, 4.5:1 or more in light and dark; the primary action reverses the pair. | Teaching bubble contrast row. |
| Resizable | A size menu | No size menu is mentioned; people resize by dragging or by the keyboard. | Resizable purpose. |
| Unpublish | "Delete when the content should be kept" | Reads: "Deleting content you want to keep: unpublish it instead, so it is hidden but not lost". | Unpublish avoid line. |
| Unpublish | Own purpose and sections | Own text and purpose; it shows the publishing flow's sections on purpose, because the same Draft, Publish and Unpublish rows apply. | Decision below. |
| Data review workflow | Order of Approve and Reject | On purpose: the bar ends on Reject (the danger action, as command bars always do); the review panel ends on Approve (the step that moves work forward). | Record text. |
| Wizard, Create flow, Autosave, Draft state, Save as, Archive | Generic variants and Guidance rows | Each variant says what it shows and when to use it; no Guidance row repeats the use lines. | Variant pages. |
| Permissions, Tour, Checklist, Onboarding, Feature introduction, Import workflow, Access request, Trial and upgrade, Offboarding | Generic variants; overview equals the purpose | Each variant has its own text and use and avoid lines; the overviews describe what the pattern shows. | Variant pages and records. |
| Import and Export | "The same workflow as the action page" | The use lines name the Import dialog and the Export dialog. | Records. |
| Multi-factor authentication | Error messages row | The row holds the errors ("That code didn't work…", "The code has expired…"). | MFA docs. |
| Connected accounts | Error messages row | Changed in this batch. | `w11A.docs.js`. |
| Lifecycle journeys | "Scrollable code region" | The focus row reads "Keep focus visible and restore it after modal tasks." | Lifecycle journeys docs. |

## Decision card

- **Applied:** the two changes above; everything else stays. Unpublish keeps showing the publishing flow's sections.
- **To switch:** reply on #120 with the question and the wording you want.

## Next

- Batch 12 is the Interaction group (24 questions), then Foundations (24) and the two extra lists (11 and 19 questions), one group per pull request.
