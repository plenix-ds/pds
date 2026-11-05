# #84 (DT-41): the nine cell editors: design (G2)

- **Source:** the owner-agreed design of 2026-10-28, `~/handoff/owner-review/464-465/DESIGN.md` §5–7 (answers 1–7 on #84). This file **records** it for PDS 1.0 and adds what G2 needs: states and tokens, densities, RTL, edge cases, message placement and the engineer's fixed choices. It changes none of the owner's answers.
- **Scope:** Phase 1 (the editing rules every editor follows) and Phase 2 (the nine editors, behind `editing.editors`). The menu choice (F1), the active cell (phase 3), ranges, fill, undo and Form Edit are separate slices.
- **Extends:**
  - today's DataGrid editor: `.plx-data-grid__editor`, a bare control filling the cell; the cell's editing outline (`data-grid-editing-outline-width`, `data-grid-outline-color`) is the frame;
  - the existing controls: Input, NumberInput, Select, Combobox, DatePicker, Checkbox, Textarea, EntityPicker, Tag, Spinner, Popover.
- **The owner's rule:** today's `input` and `number` editing is never removed or switched off. With `editing` unset, nothing on this page changes the look or the keys.

## 1. One frame for every editor

- **In the cell:** each editor draws **no border, fill or corners of its own** (like `.plx-data-grid__editor` today). The frame is the cell's editing outline: `data-grid-editing-outline-width` (2px, `border-width-medium`) in `data-grid-outline-color`, inset. The cell background while editing is `data-grid-background` (existing rule). The type is the cell's own (inherited), so text doesn't shift when the editor opens.
- **Size:** the editor fills the cell exactly: inline size 100%, block size the row height of the density. The cell padding (`data-grid-cell-padding-inline`, 8px) stays, so the value doesn't move.
- **Lists, calendars and boxes** (select, combobox, tags, date, person, textarea):
  - They open in the control's **own existing popover**, anchored to the cell's block-end edge and aligned to its inline-start.
  - Minimum inline size = the cell's width. Maximum inline size and the list height are the control's own tokens.
  - They flip above the cell when there's no room below (the last rows), using the existing Popover rule.
- **Numbers:** `number` keeps end alignment, `font-data` and `tabular-nums` while editing (DESIGN.md §8). Dates show in `font-data` in the cell, the same as the read cell.

## 2. The nine editors

| Editor | In the cell | Opens | Keys (owner) |
|---|---|---|---|
| `input` | bare Input, value selected on open | — | Enter saves |
| `number` | bare NumberInput, end-aligned, no stepper buttons (the arrows step) | — | ↑/↓ step, Enter saves |
| `select` | bare Select showing the current option, plus the chevron at inline-end | the list (the Select's own) | ↑/↓ pick, Enter saves |
| `combobox` | bare Combobox input with the typed text | its filtered list | typing filters, Enter saves |
| `tags` | the Tag chips on one line, then the input; chips that don't fit show as one "+N" Tag | its list of suggestions | Enter adds, Backspace on an empty input removes the last |
| `date` | bare DatePicker input in the locale's short date | the calendar | typing or the calendar, Enter saves |
| `checkbox` | Checkbox at inline-start (as the column's read cell), no editor mode | — | Space toggles **and saves** |
| `textarea` | the cell shows the value's first line | a box over the cell: Textarea, `autoGrow` up to 8 lines then scrolls; inline size the cell's width or 320px (`size-80u`), whichever is larger | Enter adds a line, Ctrl+Enter saves |
| `person` | Avatar (xs) + name, bare EntityPicker input when typing | its search results | typing searches, Enter saves |
| component | the application's own, inside the same frame | its own | it calls `commit(value)` or `cancel()` |

- **For every editor:**
  - Escape cancels and puts the old value back.
  - Tab and Shift+Tab save and move to the next and previous editable cell in reading order (to the inline-end in LTR, the inline-start in RTL).
  - Clicking elsewhere saves.
  - An open list's own Escape closes the list first; a second Escape cancels the edit.

## 3. State matrix (every editor; per-editor differences noted)

| State | Tokens / behavior |
|---|---|
| default (read) | the existing read cell, unchanged |
| hover | n/a (no hover change on an editable cell; no pencil icon. Not in the owner's design, and an icon in the cell would be an action link) |
| focus | the active cell's existing focus outline (`data-grid-focus-outline-color`); phase 3 makes it the active cell |
| active (editing) | the editing outline (§1); the list or box open where the editor has one |
| disabled | a cell that can't be edited (`editable(record)` false, or no `editor` on the column): no editor opens; `aria-readonly="true"`; it looks the same as today. Disabled options inside a list use the control's own disabled tokens |
| loading (the save waits for `onCellEdit`) | the new value is shown; Spinner `sm` at the cell's inline-end, inside the padding; the cell is `aria-busy="true"` and takes no new edit until it answers |
| error (wrong value: `validate`) | the cell stays open; the outline turns `input-invalid-border-color` (`feedback-danger-solid`); the message shows under the cell (§5) |
| error (refused by the app) | the old value comes back; the outline is `input-invalid-border-color` until the next move; the app's message shows under the cell (§5) |
| selected | the row's selected fill stays; the editing cell itself uses `data-grid-background` (existing rule) |
| empty | an empty value opens an empty editor. A `select`, `combobox` or `person` with no matches shows the control's existing "No results" row. `tags` with none shows only the input |
| long text | `input`/`combobox`/`date`: the value scrolls inside the cell. `select`: the current option ends in an ellipsis; list options wrap to 2 lines and then end in an ellipsis (the control's rule). `tags`: "+N". `textarea`: the box grows to 8 lines and then scrolls. `person`: the name ends in an ellipsis |

## 4. Densities, light and dark, RTL

- **Densities:**
  - The editor follows the row height of compact, standard and comfortable. No editor sets its own height.
  - The popovers keep the control's own density tokens.
  - The `checkbox` keeps its box size and only centers in the block direction.
- **Light and dark:** only existing tokens; nothing new for dark. Check 8 covers the invalid outline in both modes.
- **RTL:**
  - Every rule is logical: the chevron, the spinner and "+N" sit at inline-end, and popovers align to inline-start.
  - Tab follows reading order.
  - The date and number digits follow the locale (`docs/i18n/arabic.md`).
  - A `number`, date, ID or e-mail value is isolated LTR inside RTL text (`dir="ltr"` on the value only).

## 5. Messages (placement; words are the Technical Writer's, Arabic the i18n Engineer's with the owner's approval)

- **A wrong or refused value:**
  - the message goes under the cell (DESIGN.md §11: field errors under their field);
  - it's a small Popover anchored to the cell's block-end and flips above on the last rows;
  - type `field-error-font-size` (12px floor), colour `field-error-text`, with the Material Symbols `error` icon in the same colour;
  - it stays while the cell is open or until the next move, and it's linked by `aria-describedby`.
- **Screen readers** (live region, polite): "Editing <column>" on open, "Saved" on save, and the message on a wrong or refused value. These are three catalog strings: `dataGrid.editing`, `dataGrid.saved`, and the app's own message.
- **No Toast** for a cell save: the result belongs to the cell.

## 6. Edge cases

- **3x English:** column names in "Editing <column>" may be long; the live region reads them in full. Popover lists wrap as in §3. Cells never grow while editing.
- **Empty values:** see §3.
- **10,000 rows:**
  - The editing row stays rendered while it's open (pinned in the virtual window), so scrolling never saves or cancels an edit.
  - An open popover closes when its cell scrolls out of view; the edit stays open, and the popover reopens when the cell is back or the person types.
  - Lists over 200 options use the control's existing virtual list.
- **Narrow grid (320px):** the popovers keep the cell's width as the minimum and cap at the viewport's width, so they don't spill off-screen.

## 7. The engineer must not invent

- No new colour, radius or shadow. The new tokens are comp aliases only (for example `data-grid-editor-invalid-outline-color` → `input-invalid-border-color`, `data-grid-textarea-min-inline-size` → `size-80u`), and they go through the DS Architect (G3).
- No border or fill on an in-cell editor; no hover affordance; no Toast for a save.
- The keys are exactly the owner's table (§2), including Space saving a checkbox at once and Ctrl+Enter for the textarea.
- With `editing` unset, `input` and `number` behave and look exactly as today. That's a regression check, not a choice.

## Evidence

- **Planned:**
  - a CI visual of DataGrid with each editor open, light and dark at standard density, plus compact (density) and RTL (direction);
  - the behaviour tests named in the #84 build plan.
