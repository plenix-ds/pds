# Messaging standard

How PDS talks to people: errors, validation, confirmations, success, empty states, loading and help. Owner: the Technical Writer (plan §7d). The checks are `check-copy.js` and `platform/standards/content/rules.json`.

## Rules for all messages

- American English, sentence case, and the approved action verbs in `rules.json` (`actionVerbs`).
- Plain words. Say what the person can do, not what the system did.
- No blame ("You entered…"). No raw codes or stack text.
- Every message has an English and an Arabic entry in the catalog. Arabic words come only from the owner-approved catalog (`docs/i18n/arabic.md`); new words go to the i18n Engineer.
- A part's own `strings` prop wins over the catalog.
- A placeholder holds a name or a count, never a whole sentence, so Arabic can order the words itself.

## One pattern per type

| Type | Pattern | Example |
|---|---|---|
| Error | What happened + why (if known) + how to fix it | "Couldn't save the case. The connection dropped. Try again." |
| Field validation | What is needed, beside the field, when it becomes relevant | "Enter a date after the filing date." |
| Destructive confirm | Name the object and the consequence. The button repeats the question's verb | "Delete case 10234? Its 7 documents are deleted too." Buttons: **Delete case**, **Cancel** |
| Success | Short, past tense, with Undo when possible | "Case archived." **Undo** |
| Empty state | What goes here + one action | "No hearings yet." **Schedule a hearing** |
| Loading | Only past about 1 second; say what is loading | "Loading hearings…" |
| Help or tooltip | One sentence; never repeat the label | "Only people on the case can see notes." |

## Error

- Three parts, in this order: what happened, why (only if known), how to fix it.
- Never show a code alone. If a code helps support, put it after the fix, in secondary text.
- A component that can fail ships its error and its fix.
- Do not use "Error:", "Oops" or "Something went wrong" without a next step.

## Field validation

- Beside the field, linked to it with `aria-describedby`; also listed in an error summary on a long form.
- Say what is needed ("Enter a date after the filing date"), not what is wrong ("Invalid date").
- Show it after the person leaves the field or submits, not while typing.

## Destructive confirm

- The title is a question with the verb and the object: "Delete {name}?"
- The body states the consequence in one sentence, and whether it can be undone: "This cannot be undone." or "Restore it from the trash within {days} days."
- The primary button repeats the verb ("Delete"); the other is "Cancel". Never "OK" or "Yes".
- For many objects, use a count: "Delete {count} {plural}?"
- The catalog model is `deleteFlow` in `platform/i18n/en.json`.

### Command and action confirms (`actions[].confirm`, issue #109)

For CommandBar and BarActions, the Dialog takes its words from the action. Keys under `confirmAction` in the catalog:

| Key | English | Notes |
|---|---|---|
| `title` | `{verb} {name}?` | `{verb}` is the action's label; `{name}` is the object |
| `titleMany` | `{verb} {count} {plural}?` | When several objects are selected |
| `consequence` | one sentence given by the action (`confirm.consequence`) | Required for a destructive action; the check fails without it |
| `permanent` | `This cannot be undone.` | Shown when the action sets `confirm.permanent` |
| `confirm` | `{verb}` | The button repeats the title's verb |
| `cancel` | `Cancel` | |

- `{verb}` must be an approved action verb.
- The Arabic for these keys is requested from the i18n Engineer on the issue; none is written until approved.

## Success

- Past tense and short: "Case archived", "3 files uploaded".
- Offer Undo when the change can be reversed; keep the Toast up for the Undo window.
- Say what happened to what. Do not say "Success".

## Empty state

- Say what goes here, then one action that fills it. Not two actions.
- Say why when it is not obvious ("No results for 'abc'. Clear the filters.").

## Loading

- Show nothing for the first second. After that, say what is loading ("Loading hearings…"), not "Loading…" alone.
- Past about 10 seconds, the label stays and a second line adds the delay: "This is taking longer than usual." (`loading.slow`). Do not replace the label.
- When the work can be stopped, pass `onCancel` (DataGrid and ListingPage: `onLoadingCancel`). The Cancel button (`loading.cancel`) shows under the second line.
- With a progress value, nothing is added: no second line and no Cancel.
- Arabic for `loading.slow` waits on the owner (#1203). English shows until it is approved.

## Help and tooltip

- One sentence.
- Do not repeat the label. Add what the label cannot say.

## Checks

- `node check-copy.js`: American English, sentence case, approved verbs, inclusive language. Baseline only shrinks.
- check-system: every message key has both EN and AR entries.
- Review: message wording is reviewed on every component pull request by the Technical Writer.
