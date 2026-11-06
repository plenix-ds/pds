# Spec wording, batch 9: Page structures (15 questions)

Issue #120. Each question of the Page structures group in `questions.md` was checked against the spec text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## Result

- 9 of the 15 questions are already answered by text written after the questions were asked.
- 6 needed a change, all written from the templates' own header (`platform/templates/templates/Templates.jsx`) and the shell's header:
  - Listing page, Content template and Master-detail workspace had placeholder write-ups ("Provides a reusable implementation using existing Platform roles and controls."). Each now has its own purpose, parts, behavior, accessibility and content rows (`parts/w15A.docs.js`).
  - The four Landing page examples (Authentication, Error, Split workspace, Authentication template) said "A authentication page composed from existing Platform controls." They now say what each page is (`parts/w15A.records.js`).
  - The Application shell's localization row said the skip link "is fixed in code and needs translating" and that the arrow keys "should be checked" in right-to-left. It now states the rules: the skip link text comes from `strings` and the catalog; the splitters follow the writing direction (`inventory-docs.js`).
  - The Asset manager's reference path in its `plenix` field now reads `dam/index.html`, not the old `Plenix - DAM/` folder (`inventory.js`).
- `check-spec.js`: SPEC_OK.

## Answers

| Part | Question | Answer on main | Evidence |
|---|---|---|---|
| Application shell | To-do items in the localization row | Changed: now rules, not to-dos (see Result). | `inventory-docs.js`; `AppShell.tsx` header, `utils/direction.ts`. |
| Footer | Own purpose | Yes: the thin line across the bottom of every application with facts about the whole application (counts, sync state); it holds no actions. | Footer record. |
| Footer | "Whole page" or "whole application" | The whole application, on both pages. | Footer use line. |
| Three-pane workspace | Bottom sheet? | Yes: under 1024px the inspector opens over the main region; on Narrow windows (under 600px) it is a bottom sheet. | Record text; `SidePanel`. |
| Three-pane workspace | "Narrow and Medium" | Reads "Three columns below 1024px: the inspector overlays there". | Avoid line. |
| Inspector region | "Main area" | Reads "main region". | Variant avoid line. |
| Record page | What is the page about? | A page about one record: its header (title, facts, actions) over the body in panels, with an optional column of facts; the use lines describe the header. | Record text. |
| Record page | Live state against the status badge | The overview and the variants point to the entity header's states; the avoid line names where a fixed state goes. | Record variants. |
| Settings page | Create and Edit | Create and Edit are their own page kind (form); the Settings text and variants are about settings only. | Settings record. |
| Settings page, Landing page | Placeholder use and avoid lines | Real use and avoid lines on every variant (the Create and Edit pages are in the Forms group). | Variant pages. |
| Listing page | Placeholder write-up | Changed: its own write-up. | `w15A.docs.js`. |
| Content template | Placeholder write-up and name | Changed: its own write-up; the page is a page of cards (FeatureCards in a ContentGrid) with a filter row of the application's own above them. | `w15A.docs.js`; `ContentManagementPage`. |
| Master-detail workspace | Purpose copied from the DAM template | Own purpose: a list and the selected item's details side by side; on a phone the details open on their own screen with Back. Plus an own write-up (changed). | Record; `w15A.docs.js`. |
| DAM template | Old path | Changed: the text points to `../../dam/index.html` and the `plenix` field reads `dam/index.html`. | `inventory.js`. |
| Landing page | Placeholder write-up and foreign examples | Changed: the four examples now describe themselves; the page's own write-up is the shell's by `docsFrom` and its own content rows. | `w15A.records.js`. |

## Decision card

- **Applied:** the changes above; everything else stays.
- **To switch:** reply on #120 with the question and the wording you want.

## Next

- Batch 10 is the Implementation group (27 questions), then Patterns (17), Interaction (24), Foundations (24) and the two extra lists, one group per pull request.
