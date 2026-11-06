# ADR 0016: DataGrid editing: nine cell editors, Inline and Form Edit (public API)

- **Status:** accepted
- **Date:** 2026-11-05
- **Deciders:** pds1-ds-architect (G3), on the owner's decisions of 2026-10-28 (chat, recorded on #84: Q1 to Q7 and the build plan, "today's editing is never removed or switched off")
- **Issue:** #84 (S2, RedSave DT-41). Related: #83 (cell selection), #3 (paste, fill, undo).
- **G2:** the Design Director's design for each editor's states, RTL and the message words comes separately. This ADR fixes only the API shapes, which the owner already agreed.

## Context

- Today `columns[].editor` is `"input" | "number"`, `columns[].editable(record)` decides per row, and `onCellEdit(record, { field, value, previous })` saves (`DataGrid.jsx:43,62`). Double-click, Enter, F2 or typing starts an edit; Escape cancels.
- The owner asked for:
  - nine editor types, plus an application's own component;
  - each as an option the application turns on;
  - an Inline Edit / Form Edit choice in every editable table's view menu, remembered per table;
  - Enter saving with the active cell staying, Tab and Shift+Tab saving and moving;
  - typing replacing the value, and range selection by drag, each as an option.

## Options

| Option | For | Against |
|---|---|---|
| **A. Extend `columns[].editor` with the nine names or an application component; one `editing` options object on DataGrid; `editMode` / `editModes` on DataGrid and on a new `TableSettings` provider; Form Edit props** | Additive (today's columns keep working unchanged); one place for the per-application options, as the owner asked; the table wins over the application, the person's choice over both | A wider DataGrid API |
| B. A separate `EditableDataGrid` | DataGrid stays small | Two grids to keep in step; existing editable tables would have to move |

## Decision

**Option A.** All additions; nothing existing changes meaning.

```ts
type EditorType = 'input' | 'number' | 'select' | 'combobox' | 'tags' | 'date' | 'checkbox' | 'textarea' | 'person';

type CellEditorProps<V = unknown> = {
  value: V; record: unknown; field: string;
  onChange(value: V): void;            // the draft
  onCommit(value?: V): void;           // save (Enter, Tab, blur by the grid's rules)
  onCancel(): void;                    // Escape: the old value stays
  invalid?: string;                    // the message to show under the cell
  autoFocus: boolean; dir: 'ltr' | 'rtl';
  'aria-describedby'?: string;        // the message's id while invalid (addendum, #411)
};

// on a column (columns[])
editor?: EditorType | { component: React.ComponentType<CellEditorProps>; props?: object };
editorProps?: {
  options?: { value: string; label: string }[];                       // select, combobox, tags, person
  loadOptions?(query: string): Promise<{ value: string; label: string }[]>;   // combobox, person
  min?: string; max?: string;                                         // date (calendar days, YYYY-MM-DD)
  rows?: number;                                                      // textarea
};
validate?(value: unknown, record: unknown): string | null | Promise<string | null>;   // a message keeps the cell open

// on DataGrid
editing?: {
  types?: EditorType[];          // the editor types this application turns on; 'input' and 'number' always work (owner)
  typeToReplace?: boolean;       // Q2: typing replaces the value (default true: today's behavior since #737; false turns it off; addendum #456)
  enterEdits?: boolean;          // Q6: Enter edits an editable cell (default true, as today)
  rangeSelect?: boolean;         // Q5: dragging across cells selects a range (default false)
};
editMode?: 'inline' | 'form';    // default 'inline'
editModes?: ('inline' | 'form')[];   // one mode hides the menu item
formSurface?: 'drawer' | 'dialog' | { panel: React.RefObject<HTMLElement | null> };   // default 'drawer'; addendum F3
renderForm?(record: unknown, form: FormEditState): React.ReactNode;   // addendum F3
onRecordEdit?(record: unknown, changes: Record<string, unknown>): void | Promise<void>;   // a rejected promise: the form stays open with its message
onCellEdit?(record, change: { field, value, previous, row }): void | Promise<void>;   // may now answer later: a spinner, then the old value back if it rejects; row is the record before the edit (#354)

// a new provider
<TableSettings editMode? editModes? editing?>{children}</TableSettings>   // application-wide defaults
```

- **Precedence:** the person's choice (remembered under `storageKey`) wins over the table's `editMode`, which wins over `TableSettings`.
- **Dates:** a `date` editor's value is a calendar day string (`YYYY-MM-DD`), read through `parseDate`, so it keeps its day in every time zone.
- **An editor type the application hasn't turned on** (`editing.types`) falls back to `input`, with a development warning. So a column never fails to edit.
- **Messages:** every word ("Editing {column}", "Saved", the default refusal message, the menu's "Editing: Inline Edit / Form Edit") comes from the catalog. The Design Director gives the wording (G2), the i18n Engineer the Arabic for the owner (D-0012).
- **Bare in the cell (G3, #84):** the editing cell sets Input's existing context hooks on itself: `--plx-comp-input-context-border-start-width`, `-border-end-width` and `-border-block-width` to `0`, `-radius-start` and `-radius-end` to `0`, `-background` to `transparent` (and `--plx-comp-textarea-context-*` for `textarea`). Every field-based editor draws through `.plx-input`, so it shows no box of its own inside the cell's editing outline. No new prop or token.
- The nine editors are the existing Plenix controls at the cell's size (Input, NumberInput, Select, Combobox, TagInput, DatePicker, Checkbox, Textarea, EntityPicker). No new control.

## Consequences

- **Semver: MINOR.** New prop values and props, a new export (`TableSettings`), and new catalog keys. Every existing table behaves as today with no new setting.
- Built in phases (F1 the menu choice, 1 Inline rules, 2 the editors, F2–F4 Form Edit), each its own PR with its named checks (the build plan on #84).
- TypeScript: DataGrid is still `.jsx`. Its header's `Props:` block (read by `build-types.js`) gains these shapes until the TypeScript wave converts it (ADR 0011).

## Addendum (2026-11-05, #411): the application component's accessibility props

- The grid also gives an application editor `aria-describedby`: the id of the cell's message, set only while `invalid` is set. The component puts it on its focusable control, so a screen reader reads the message.
- `CellEditorProps` gains `'aria-describedby'?: string`. Additive: **MINOR**, within this ADR's release.
- Before its first `onChange`, `value` is the cell's value, or `''` when the cell is empty (as for the built-in editors).
- Enforced by: G3 review of #411; the #411 behavior tests.

## Addendum (2026-11-05, #431): the person editor's records

- `person` takes `editorProps.options` as well as `loadOptions`, like `combobox`.
- Its records are EntityPicker's people records: `{ value: string; label: string; description?: string; src?: string; color?: string; presence?: string }`. The extra fields are optional. A `{ value, label }` record works as for the other editors.
- `loadOptions` runs from EntityPicker's `minChars` (1): an empty field shows no list until the person types.
- **Semver: MINOR**, within this ADR's release. Enforced by: G3 review of #431; `tests/data-grid-editor-person-84.test.js`.

## Addendum (2026-11-05, #456): the `typeToReplace` default (D-0061)

- **Correction:** the ADR said `typeToReplace` defaults to `false` and called that today's behavior. Since #737, a typed character already starts an edit with that character in place of the value. Today's behavior is `true`.
- **The default is `true` (unset = today's behavior).** `typeToReplace: false` turns it off, and Enter, F2 or a double-click still start an edit.
- `rangeSelect: true` turns on the block selection that `cellSelection` turns on. A table's own `cellSelection` wins.
- `editing` also comes from a `TableSettings` above; the table's own options win (the ADR's precedence).
- **Semver: MINOR**, no break: every table that works today works the same.
- Enforced by: G3 review of #456; `tests/data-grid-editing-options-84.test.js` (the defaults cases).

## Addendum (2026-11-06, #84 F3): `renderForm`'s values and the application's panel (D-0063)

The one-line signatures left two gaps: how an application's own form reports its values, and how the grid draws into a panel it doesn't own.

**`renderForm(record, form)`:** the record stays the first argument, as the ADR wrote it. The second is the form's state, the shape FormFlow's own children get:

```ts
type FormEditState = {
  value: Record<string, unknown>;                 // the draft: the record's editable fields, edited
  setValue(next: Record<string, unknown>): void;  // the application's fields call it
  errors: Record<string, string>;                 // field -> the message from the column's validate, after Save
  busy: boolean;                                  // true while onRecordEdit's promise runs
};
```

- Save validates the draft with each column's `validate`, then sends `onRecordEdit(record, changes)` with only the fields that differ from the record (as F2 does).
- The grid keeps the header, the footer (Save, Cancel) and the ErrorSummary. The application draws only the body.

**`formSurface: { panel: ref }`** (replaces the ADR's `'openPanel'` string, which was never built):

- While the form is open, the grid renders its form (header, body, footer) into `panel.current` through a portal. It sets `data-plx-form-open` on that element, so the application's CSS hides its details there (`[data-plx-form-open] > .my-details { display: none }`). The attribute is removed when the form closes. The grid changes nothing else in the application's DOM.
- A `panel` whose `current` is null at open falls back to the drawer, with one development warning.
- The record shown is the one being edited. The application keeps it open (`openKey`) as usual.
- **One title (G2):** while `data-plx-form-open` is set, the grid's form takes the panel's whole content area, and the application hides its own details and its panel header there.
- **The application's close button acts as Cancel, with no new prop:** closing the open row (`openKey` moves away from the edited record) while the form is in the panel cancels it.
  - With unsaved changes, FormFlow's unsaved-changes question comes first. If the person keeps editing, the form moves to the drawer with its draft (the panel is gone), so nothing typed is lost.
  - On close, focus returns to the edited row.

- **No new prop:** `renderForm` gains an argument (no one calls it yet), and `formSurface` replaces an unbuilt value.
- **Semver: MINOR**, within this ADR's release.
- Enforced by: G3 review of the F3 PR; its behavior tests (`renderForm` values reach `onRecordEdit` as changes; `errors` after a refused `validate`; the panel portal and `data-plx-form-open`; the null-panel fallback).

## Addendum (2026-11-06, #465): FormFlow `defaultValue`, so the draft survives a surface change (D-0064)

- **FormFlow gains `defaultValue?: object`:** the draft it starts from (default `initialValue`). `initialValue` stays the baseline: dirty and the unsaved-changes question compare with it.
- **Form Edit uses it** for the F3 edge: the person closes the application's panel, then chooses to keep editing.
  - The grid keeps the latest draft (from FormFlow's `children({ value })`).
  - It remounts FormFlow in the drawer with `defaultValue={draft}` and the same `initialValue` and `sessionKey`, so nothing typed is lost and the question still asks.
- **Rejected:** a controlled FormFlow (`value` + `onChange`): more API, and every caller would own the state.
- **Semver: MINOR** (an additive optional prop on a public pattern).
- Enforced by: G3 review of the #465 PR; a behavior check (changes, close the panel, keep editing -> the drawer with the same values, and the question still asks on Cancel).

## Addendum (2026-11-06, #477): Combobox `chipOverflow`, the tags editor's "+N" (D-0065)

The `tags` editor is Plenix's `Combobox multiple`, and the design (84-cell-editors §2, §3) wants its chips on one line, with the ones that don't fit shown as one "+N" Tag. Combobox has no such behavior, so it gains an **opt-in** prop. Changing every multiple Combobox would change pages outside the grid.

```ts
chipOverflow?: 'wrap' | 'count';   // Combobox, with multiple; default 'wrap' (today: chips wrap to more lines)
```

- **`'count'`:** the chosen chips stay on one line before the input. The chips that don't fit fold into one "+N" Tag at the inline-end.
  - The Tag's accessible name is "{count} more" (catalog `combobox.moreChips`, English; Arabic needs the owner, D-0012).
  - The full list stays in the popup, where the chosen options are checked.
  - It refits on resize, and logical sides apply in RTL.
- Backspace on an empty input still removes the last chosen value, including a hidden one: N drops by one.
- No new token: the "+N" is a Tag at its existing size and tone.
- DataGrid's `tags` editor sets `chipOverflow="count"`. Everywhere else Combobox is unchanged.
- **The read cell folds the same way (G2):** a `tags` column's read cell (not editing; the grid's own tag rendering in `cells.jsx`) shows its tags on one line, with the rest as one "+N" Tag named "{count} more". The cell keeps its shape when the editor opens.
  - Combobox and the read cell share **one internal fit step** (a hook beside `useBarFit`, not exported), so both fold at the same widths.
  - No public API for the read cell: it's the grid's own rendering. TagList is unchanged.
- **Semver: MINOR** (an additive optional prop on a public control, and one catalog key).
- Enforced by: G3 review of the #477 item 1 PR; behavior checks (the chips fit on one line, "+N" counts the hidden ones and is announced, Backspace removes the last value, RTL); the default `'wrap'` is unchanged (a regression check).

## Enforced by

- G3 review of each phase's API diff against this ADR.
- The named behavior tests per phase (#84's build plan) and the acceptance criteria on #84.
- Locale checks: the new keys in `en.js`; no unapproved Arabic.
