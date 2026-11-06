# #140 (P-53): CommandBar with rows selected: add, don't swap (G2)

- **Owner decision, 2026-10-19** (old plenix-ds/plenix-platform#195), recorded as D-0068:
  - "add, don't swap": with rows selected, the selection's commands come first, then a separator, then the page's commands;
  - Search, filters and quick filters stay;
  - `selection.mode: "swap"` stays available for small bars;
  - a command may say `selection: "also" | "only" | "never"`.
  - It replaces the 2026-10-15 swap default (issue 454): later decisions win.
- **Extends:** CommandBar and `BarActions` (`platform/patterns/CommandBar/`), the Toolbar fit ladder (fit-and-overflow §2–3, `useBarFit`), Divider, the existing selection count and Clear.

## Layout (default `selection.mode: "add"`)

- **No rows selected:**
  - today's bar: the page's commands, then the find side (search, filters);
  - commands marked `selection: "only"` don't show.
- **Rows selected,** in order from the bar's start:
  1. the selection count and Clear, as today in swap mode ("3 selected", existing words);
  2. the commands for the selection: those marked `"only"`, plus `"also"` commands with a selection action;
  3. a **vertical Divider**, the existing one at the bar's height, which shows only when both sides have at least one command;
  4. the page's commands, `"also"` (the default for page commands) and unmarked, while `"never"` commands hide;
  5. the find side: search and filters, unchanged and never hidden by a selection.
- **`selection.mode: "swap"`:** today's behaviour, unchanged.

## Fit (when the bar is narrow)

- The Toolbar ladder (fit-and-overflow §2–3): labels hide, then commands move into More.
- **Fold order: the page's commands fold before the selection's.** The selection is the task at hand. Within each group, the existing priority order applies (`low`, `normal`, `high`; the last first; danger last).
- In More, the two groups keep their order with a divider between them, as in the bar.
- The count and Clear never fold, and neither does the find side's search field (its own field ladder applies).

## States

| State | Behaviour |
|---|---|
| default, hover, focus, pressed | each command's existing Button and Menu states (#109 layers) |
| disabled | a command disabled for this selection (for example `single` with 2 rows) shows disabled, with no hiding |
| loading | n/a (commands run their own async state) |
| error | n/a (results go in a Toast) |
| selected (rows) | the layout above; the count reads the selection size |
| empty | no rows selected: today's bar; a selection with no selection commands: the count and Clear, then the page's commands, with no divider |
| long text | the Toolbar ladder; labels keep their tooltip when hidden |

- **Keyboard:** the bar stays one Tab stop; the arrows go through the count, Clear, the selection's commands, the page's commands, More, then the find side in that order. The Divider isn't a stop.
- **Screen readers:** the count is announced when the selection changes (existing).
- **RTL:** the same order from the inline-start; logical sides only.
- **Densities:** the bar's own heights.
- **Edge cases:**
  - 3x English: labels hide first, then More;
  - 10,000 rows selected: the count shows the number in the data font (D-0006);
  - 320px: everything but the count, Clear and search folds into More.

## The engineer must not invent

- No new token, colour or word. The Divider, the count, Clear and More all exist.
- Page commands fold before selection commands, and never the other way round.
- `"swap"` stays exactly today's behaviour.

## Evidence

- **Planned:** behaviour tests (add order, divider only with both groups, also/only/never, fold order, swap unchanged, keyboard order, RTL), plus a CI visual of the bar with and without a selection, light and dark at standard density.
