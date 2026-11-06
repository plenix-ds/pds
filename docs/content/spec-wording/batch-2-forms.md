# Spec wording, batch 2: Forms (21 questions)

Issue #120. Each question of the Forms group in `questions.md` was checked against the spec text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## Result

- All 21 questions are already answered by text written after the questions were asked. No spec string needed to change in this batch.
- Nothing was changed in `platform/design-system/`. The record below is the evidence.

## Answers

| Part | Question | Answer on main | Evidence |
|---|---|---|---|
| Color swatch | Square or round by default? | Square with 2px corners is the default; round is the option. | The anatomy row reads "square with 2px corners (default) or round (optional)", as the overview and the variant. |
| Creatable select | Is the add-a-tag field a field like every other? | Yes. The anatomy and the focus row both say it is a text field like every other, with the field's focused border. | Record text and docs. |
| Search input | White, or the neutral fill? | Filled like every field (light gray) and outlined; the contrast row says the same: the field background and the field border, like every field. | Width rule and contrast row. |
| Radio group | Option counts across pages | One scale on every page: Radio group up to 7, Select 8 to about 15, Combobox more than 15, Segmented control two to five. | Radio group, Select, Combobox and Segmented control records and docs. |
| Required indicator | Mark optional fields instead? | Avoid it. The Required variants of Text field, Text area and Native select no longer say to mark the optional fields; they say to mark a field required only when the record cannot be saved without it. | The three Required variants. |
| Form | Field's purpose copied | Form has its own purpose: sections in one or two columns with one bar of actions that stays in view. | Form record purpose. |
| URL, Telephone, Password field | Text field error example | These pages have their own text (input type, keyboard, formatting) and no copied Text field write-up. | Their records. |
| Drop zone | No focus style? | The button version takes Tab and shows the standard focus ring; the plain drop area takes no focus. | Focus row. |
| Toggle button group | Look in the purpose | The page has no purpose that describes the look; the look sits in the anatomy, with the owner note (look A, 2026-10-14). | Record text; anatomy. |
| Swatch picker | Is brown still a data color? | Brown is drawn in orange: the data palette is blue, green, purple, red, brown (drawn in orange) and gray. | Data palette variant. |
| Field style variants | "or the line" in three rows | Gone. Only two looks exist, outline and filled; hover and focus change only the color of the border. | Record text. |
| Number input | Contrast figures | The row now states them: the text keeps 4.5:1 and the border 3:1 against the field. | Number input docs. |
| Searchable select | One-value purpose | Own text: a Combobox with one value, from a long list by typing. | Record text, purpose and use. |
| Date range picker | Own purpose | Yes: a period, a start date and an end date. | Record purpose. |
| Date-time picker | Own purpose | Yes: a moment, a date and a time. | Record purpose. |
| Attachment picker | Local files or several sources? | Files from the person's device; the use line says the same. | Record text and use. |
| Attachment picker | Avoid line, same on both variants | Each variant names its own case: Inline avoids short-space places (use Chips); Chips avoids cases that need each file's size and type (use Inline). | Variant pages. |
| Attachment picker | Use line and difference | Inline shows each file as a row with its name, size and type, and a menu to remove it; Chips shows a compact chip with a remove button. | Variant pages. |
| Attachment picker | Mouse row | There is no write-up with a Mouse row for this part now. | `parts/*.docs.js` has no entry. |
| Attachment picker | Anatomy without descriptions | Same: no write-up with an anatomy list. | As above. |
| Attachment picker | Purpose repeats the overview | The record has no purpose that repeats the overview. | Record. |

## Decision card

- **Applied:** nothing to rewrite for the Forms group; keep the strings as they are.
- **To switch:** reply on #120 with the question and the wording you want.

## Next

- Batch 3 is the Navigation group (14 questions), then Content (25) and the rest of `questions.md`, one group per pull request.
