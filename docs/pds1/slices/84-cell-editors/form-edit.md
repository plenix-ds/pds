# #84: the editing menu choice (F1) and Form Edit (F2–F4): design (G2)

- **Source:** the owner-agreed design of 2026-10-28, `~/handoff/owner-review/464-465/DESIGN.md` §4, §11 and §12 (answers on #84). This file records it and adds what G2 needs: parts and tokens, states, placement, densities, RTL and edge cases. It changes none of the owner's answers.
- **API:** ADR 0016 (`editMode`, `editModes`, `TableSettings`, `formSurface`, `renderForm`, `onRecordEdit`). **Words:** the `dataGrid.editMode*` keys in `design.md` §5 (owner's words), plus the ones below for the Technical Writer.
- **Extends** existing parts only: ViewMenu and the grid's view button, FormFlow (drawer and dialog), Form and FormSection, Field, the nine editors at form size, SidePanel, ErrorSummary, Toast, the grid's open row.

## 1. F1: the menu choice

- **Where:** in the table's view menu, after Row height and Wrap text, under a divider, in two places:
  - the grid's view button (`viewMenu`);
  - the page's ViewMenu.
  - **Only** when the table has at least one editable column, and only when `editModes` offers both.
- **What:** the existing menu radio group: a group label "Editing" and two radio items, "Inline Edit" and "Form Edit", with the existing check mark on the chosen one. No icons on the items, so it matches Row height.
- **States:** the Menu's own (the state layer from #109; focus; the checked mark). Disabled is n/a: the item is hidden when it doesn't apply, never shown disabled.
- **Memory:** per table under `storageKey`, with the other view settings. No visual change apart from the checked mark.

## 2. Form Edit: the surface

| `formSurface` | Surface | Notes |
|---|---|---|
| default | FormFlow's **drawer** (side panel) at its existing width tokens, from the inline-end side | its own header, body and footer, as FormFlow draws them |
| `"dialog"` | FormFlow's **dialog**, medium size | the same header, body and footer |
| `"openPanel"` | the application's **own details panel** for the open row (SplitView or SidePanel); the form replaces the details in place | saving or Escape shows the details again: never a second panel (§12) |

- **Header:** the title "Edit {record name}" (`dataGrid.formTitle`). The record name is the table's key column value, or the first text column. Long names wrap to 2 lines, then end in an ellipsis with a tooltip (fit-and-overflow §2).
- **Footer:** FormFlow's own: primary "Save" and secondary "Cancel", end-aligned, Fluent buttons (D-0023, D-0054). Ctrl+Enter saves, and Escape is Cancel.

## 3. Form Edit: the fields (F2)

- **Order:** the table's visible column order. Hidden columns aren't shown. The row-menu, selection and action columns are never fields.
- **Each editable column** is a **Field** with the column's title as its label, **above** the control (the stacked label: a drawer or dialog is narrower than the 360px label-beside threshold, fit-and-overflow §4). The control is the column's editor at **form size**, with its own border and fill (not bare: the bare look is only for a cell). Spacing: `space-stack-xs` between a label and its control, `space-stack-lg` between fields.
- **Each non-editable column** is the same label over its value as **read-only text** (Field's read-only look, `content-default`, not a disabled input). A number or date in the data font, and numbers start-aligned in a form (end alignment is for table columns, DESIGN.md §8). An empty value shows "—" (`dataGrid.emptyValue`).
- **`renderForm(record)`:** the application's own form inside the same surface, header and footer.
- **Grouping:** one FormSection without a heading. FormSections only come from `renderForm`.

## 4. Form Edit: states

| State | Tokens / behaviour |
|---|---|
| default (open) | the surface as in §2, focus on the first editable field |
| hover, focus, active | each control's own states (#109 layers on buttons) |
| disabled | a field whose cell can't be edited (`editable(record)` false) is read-only text (§3), not a disabled input |
| loading (saving) | FormFlow's saving state: the Save button shows its spinner and is `aria-busy`; the fields stay as they are; Escape waits until the answer |
| error (a wrong value, `validate`) | the message under its field (Field's error, `field-error-text`, 12px, with the error icon); on Save, focus moves to the first wrong field; Save stays available |
| error (refused by the app, `onRecordEdit` rejects) | the form stays open with every value kept; the app's message (or `dataGrid.saveRefused`) shows in an **ErrorSummary at the top of the form body** (DESIGN.md §11: an error from the whole form) |
| saved | the surface closes; a **Toast** "Saved" (`dataGrid.saved`, DESIGN.md §11: the result of an action); the edited row stays the open row, marked |
| unsaved changes on close | FormFlow's existing "Discard changes?" confirmation (its own words) |
| selected | the form edits the active row only; the selection doesn't change (§12) |
| empty | a record with no editable column: Form Edit has nothing to edit, so the menu choice isn't offered (§1) |
| long text | labels wrap and are never cut; values wrap; a long-text field grows to 8 lines, then scrolls |

## 5. Densities, light and dark, RTL

- **Densities:** the form follows its surface's density (FormFlow's own). It doesn't take the grid's compact rows; controls use their standard form size.
- **Light and dark:** existing tokens only; nothing new.
- **RTL:** the drawer opens from the inline-end side (the left in RTL), the footer buttons mirror, labels and values read right to left, and numbers, dates, IDs and e-mails are isolated LTR inside RTL (`docs/i18n/arabic.md`).

## 6. Edge cases

- **3x English:** long labels wrap; the title wraps to 2 lines then ends in an ellipsis; the footer buttons keep one row (the action bar ladder).
- **10,000 rows:** the form edits one record. The edited row stays rendered and marked while the form is open, so closing returns focus to it.
- **320px:** the drawer is full width under the shell's narrow breakpoint (FormFlow's own rule), and the footer stacks below 400px (fit-and-overflow §2).

## 7. Words (the Technical Writer may edit; Arabic needs the owner's approval, D-0012)

| Key | English | Where |
|---|---|---|
| `dataGrid.formTitle` | "Edit {name}" | the surface's header and its accessible name |
| `dataGrid.emptyValue` | "—" | an empty read-only value |
| `dataGrid.saved` / `dataGrid.saveRefused` | as in `design.md` §5 | Toast / ErrorSummary |

## 8. The engineer must not invent

- No new colour, radius, shadow or spacing. Every part above already exists.
- No bare controls in the form; no fields for hidden, row-menu or selection columns.
- Messages go only in the places in §4: under the field, ErrorSummary at the top, Toast after saving.
- With `editModes={["inline"]}` (or no editable column) nothing appears in the menu, and today's tables don't change (regression check).

## Evidence

- **Planned:**
  - the named checks of the #84 build plan (F1–F4);
  - CI visuals: the drawer, the dialog and openPanel, light and dark at standard density, plus RTL (direction) and compact (the grid next to the form).
