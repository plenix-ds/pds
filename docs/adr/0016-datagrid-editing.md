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
formSurface?: 'drawer' | 'dialog' | 'openPanel';   // default 'drawer'
renderForm?(record: unknown): React.ReactNode;
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

## Enforced by

- G3 review of each phase's API diff against this ADR.
- The named behavior tests per phase (#84's build plan) and the acceptance criteria on #84.
- Locale checks: the new keys in `en.js`; no unapproved Arabic.
