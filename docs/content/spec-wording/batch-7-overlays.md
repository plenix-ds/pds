# Spec wording, batch 7: Overlays (25 questions)

Issue #120. Each question of the Overlays group in `questions.md` was checked against the spec text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## Result

- 23 of the 25 questions are already answered by text written after the questions were asked.
- Two needed a change:
  - The Rich tooltip's placement variants (below, above, at the start) said "the arrow pointing…". The rich tooltip has no arrow (`.plx-tooltip__bubble--rich::before { content: none }`; the overview says so). They now say where it sits and that it flips to stay in the window (`parts/w05C.records.js`).
  - The Hover card showed the Popover's keyboard and focus rows (Enter or Space opens it, Escape returns focus to the trigger). It now has its own pointer, keyboard and focus rows (`parts/w05A.docs.js`): focus on the trigger opens it at once without moving focus, and Escape closes it without moving focus.
- `check-spec.js`: SPEC_OK.

## Answers

| Part | Question | Answer on main | Evidence |
|---|---|---|---|
| Confirmation dialog | Confirm variant for undoable actions? | Confirm is for an action others will see (publish, send, share); actions that are easy to undo are done at once with Undo in a toast. | Confirm variant text and avoid line. |
| Confirmation dialog | "Larger actions" | Gone; the Destructive variant is the danger button with focus on Cancel. | Destructive variant. |
| Side drawer | Slides or not? | It slides in from its edge (the start edge with `side="start"`). | Overview and Motion row. |
| Side drawer | Is a navigation drawer allowed? | No: navigation is never a drawer (the navigation pane, its rail or the bottom bar). | Both side variants' avoid lines. |
| Full-height sheet | Wide windows | On Medium windows the same Sheet is a full-height side sheet; on Wide windows a dialog, unless the page shows a pane there. | Record text. |
| Inspector drawer | Drawer or bottom sheet on a phone? | Below 1024px it opens over the main region; under 600px it opens as a bottom sheet. | Record text. |
| Inspector drawer | Modal or scrim | Not a Drawer page now: the inspector has its own write-up; no copied Scrim rule. | Record. |
| Inspector drawer | Title wrapping; action order | No separate write-up with these rows remains on this page. | Record. |
| Dropdown surface | Shadow or border only? | A panel with the menu radius and a border, no shadow. | Record text. |
| Dropdown surface | Flip to fit | No separate write-up with a "does not flip" row remains. | Record. |
| Show more / less | Own purpose | Yes: shows the rest of a long list or text with one Show more button and folds it back. | Record purpose. |
| Truncate / expand | Own purpose | Yes: cuts long text to a set number of lines and lets the person show the whole text in place. | Record purpose. |
| Scrim | Does the backdrop fade? | Yes: the Dialog's backdrop fades in (quick duration); with reduced motion both appear at once. | Dialog and Scrim motion rows. |
| Hover card | Keyboard and focus | Changed: its own rows (see Result). | `w05A.docs.js`. |
| Popup, Inline dialog | Popover's write-up repeated | Intended: Popup and Inline dialog are the Popover, shown by `docsFrom`; the Hover card has its own rows. | Decision below. |
| Rich tooltip | Arrow? | No arrow. | `tooltip.css`; overview. |
| Rich tooltip | Placement variants | They apply to the rich tooltip too (it is placed against its trigger and flips); the arrow wording is removed. | Changed in this batch. |
| Teaching bubble | Spotlight in the anatomy | Yes, as an optional part: a Spotlight that dims the window while it is open (`spotlight={false}` turns it off). | Anatomy. |
| Wizard dialog | What is each size for? | Medium: three to five short steps. Large: steps with wide content, such as a table or a preview. Full screen: long or dense steps, and any wizard on a phone. | Size variants. |
| Wizard dialog | Parts | Dialog header, Step indicator, Step content, Actions (Cancel, Back, Next, Finish) and the unsaved-changes check. | Anatomy. |
| Wizard dialog | Own write-up | Yes: "Keeps a short stepped task in a modal layer", with its own announce rows. | Wizard dialog docs. |
| Help panel | Own write-up | Yes: search, read and Back; its keyboard row names the search field, the results and the article's controls. | Help panel docs. |
| Help panel | Variants | In the inspector, Search and Articles each say what they show and when to use them. | Variant pages. |
| Help panel | Overview repeats the purpose | The overview describes the parts: a heading, a search field, the matching articles, and an opened article with Back. | Record text. |

## Decision card

- **Applied:** the two changes above; everything else stays. Popup and Inline dialog keep showing the Popover's write-up.
- **To switch:** reply on #120 with the question and the wording you want.

## Next

- Batch 8 is the Specialized group (36 questions), then Page structures (15), Implementation (27), Patterns (17), Interaction (24), Foundations (24) and the two extra lists, one group per pull request.
