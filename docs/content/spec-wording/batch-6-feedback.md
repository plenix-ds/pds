# Spec wording, batch 6: Feedback (16 questions)

Issue #120. Each question of the Feedback group in `questions.md` was checked against the spec text and the code on main on 2026-11-06, with the rules of `proposal.md`.

## Result

- All 16 questions are already answered by text written after the questions were asked. No spec string needed to change in this batch.
- Nothing was changed in `platform/design-system/`. The record below is the evidence.

## Answers

| Part | Question | Answer on main | Evidence |
|---|---|---|---|
| Spinner | Two sizes or three? | Three: small (12px), medium (16px) and large (24px). | Spinner text. |
| Empty state | Errors? | An empty state covers "content that could not load" with `tone="error"` and Retry; an error in one field shows at the field, and a passing failure of an action is a Toast. No page says "do not use it for errors". | Empty state use and avoid lines. |
| Empty state | Overview too narrow | It covers nothing yet, no results and content that could not load, as a whole view or a line inside a list. | Empty state text. |
| Skeleton | Under a second or half a second? | Under a second, on both the Skeleton and the Shimmer pages. | Skeleton and Shimmer avoid lines. |
| Toast | Should a plain save show a toast? | A save people start with a Save button shows "Saved"; saving that happens by itself says nothing. | Success toast use and avoid lines. |
| Snackbar | "Leaves on its own" | Reads: leaves on its own (a danger toast stays until dismissed). | Snackbar text. |
| Presence indicator | Same as Availability indicator | There is no separate Presence indicator record; Availability indicator carries the presence roles, the larger dots with a shape, and the rule that it never rests on color alone. | Availability indicator text. |
| Health indicator | Dot or badge? | A status badge with its icon: success for working, waiting for slow or partial, negative for down. Status dot is only for a person's availability. | Health indicator text. |
| Severity indicator | Three or four levels? | Three: information, warning and danger. | Severity indicator avoid line. |
| Notification | NotificationList or ActivityList? | NotificationList is the component for notifications; ActivityList is a separate component. | `components/NotificationList`, `components/ActivityList`. |
| Status badge | Does it carry an icon? | Yes: a short status word on a soft fill, with its status icon inside. | Status badge text. |
| Banner | One action or two? | One or two actions. | Banner purpose and "With actions" variant. |
| Banner | "The owner removes the banner" | Reads: a Dismiss button at the end removes the banner. | Dismissible variant. |
| Loading overlay | Is the message required? | Optional: most overlays say what is happening; without a message, "Loading" is announced. | With message variant. |
| Loading overlay | Motion wording | Reads: "The veil fades in and the spinner turns; with reduced motion, neither moves." | Loading overlay motion row. |
| Undo pattern | Motion wording | Reads: "The toast slides in and out; with reduced motion it appears at once." | Undo pattern motion row. |

## Decision card

- **Applied:** nothing to rewrite for the Feedback group; keep the strings as they are.
- **To switch:** reply on #120 with the question and the wording you want.

## Next

- Batch 7 is the Overlays group (25 questions), then Specialized (36) and the rest of `questions.md`, one group per pull request.
