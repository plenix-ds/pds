/* Plenix · DataGrid
   Summary: Records people work with, by column: sort, filter, select, open, edit, group or nest them. A React grid on
     TanStack Table (row models and column state) and TanStack Virtual (the rows drawn), both MIT and bundled into the
     Platform; every element is Plenix markup (plx-data-grid__*) drawn by data-grid.css with the data-grid tokens.
   Usage:
     <DataGrid label="Assets" data={assets} index="id" selectable
       columns={[
         { title: 'Attachments', field: 'attach', kind: 'icon', icon: 'attachment', sorter: 'number',
           render: (a) => (a.attach ? <Icon name="attachment" label={a.attach + ' attachments'} /> : null) },
         { title: 'Name', field: 'name', kind: 'name', filter: true, width: '--plx-ref-size-60u', editor: 'input' },
         { title: 'Status', field: 'status', kind: 'center', filter: 'list', render: (a) => <Badge tone="success">{a.status}</Badge> },
         { title: 'Size', field: 'size', type: 'bytes' }]}
       rowMenu={[{ label: 'Open', icon: 'open', onSelect: (a) => open(a) }, { separator: true },
                 { label: 'Delete', icon: 'trash', danger: true, onSelect: (a) => remove(a) }]}
       onRowClick={(asset) => open(asset)} />
   Props:
     label: names the grid for screen readers (required)
     data: an array: the rows, plain objects; index: the field that identifies a row (default "id")
     columns: [{ title, field, … }]:
       kind: "name" (the row's name, medium weight) | "data" (technical values in the data font, Reddit Mono, on the row's
         baseline) | "icon" (a mark column as wide as the checkbox column; its header shows icon) | "center" (centered in
         the row's height: badges, buttons) | "actions" (row buttons, shown while the row is hovered or selected) | "wrap"
         (long text: the lines that fit the row height step, then an ellipsis) | "deleted" (muted italic) | "avatar-name"
         ({ name, src }) | "tags" ([{ label, category }]) | "badge" ({ label, tone, icon }); two combine as a list
         (["name", "data"])
       type: "text" (default) | "number" | "currency" | "date" | "select" | "checkbox" | "file" | "image" | "link" |
         "person" | "long-text" | "bytes" (file sizes; filters take "> 2 MB") | "multi" (several values: a grouped table
         puts the record in each of its groups): the header icon and the sort words
       groupable: false disables header grouping; groupRange: positive numeric bucket width; groupBucket(value): custom bucket label.
       groupBy also accepts [{ field, interval: "day" | "week" | "month" | "year", range }]; calendar periods use UTC, weeks start Monday.
       render(record): the cell as a React element; sorter: "string" | "number" | "date" | a compare function
         sorter(valueA, valueB, recordA, recordB, field, direction) returns ascending order; direction lets a fixed
         category order (such as folders first) compensate for the descending inversion
       filter: true (contains text) | "list" (one of the column's values); summary: "sum" | "count" | "average" | "min" |
         "max" in each group header; empty: the text for a missing value (zero and false are values)
       width: a CSS length or a size token ("--plx-ref-size-60u"; numbers snap to a size token); without it the column
         fits its content up to --plx-comp-data-grid-auto-max-width (360px; longer text ends in an ellipsis, the full
         text on hover) and the last such column takes the room left, so the grid fills its width; minWidth, maxWidth; frozen: pinned at the start, on request
         only (nothing is pinned by default; the selection column pins beside a frozen column); rowLabel: this and the columns before it are the row
         header (shaded and emphasized, not pinned; issue 679)
       align: "left" | "center" | "right" (the cells); every header label starts at the start edge, whatever the column's
         align (owner rule), and headerAlign is ignored; sortable: false turns sorting off; resizable: false
       editor: "input" | "number" (a Plenix input; double-click or Enter edits, Escape cancels); editable(record): which
         rows may edit; validate(value, record): a message (or a promise of one) keeps the cell open with the message under it
         and nothing saved, null saves (ADR 0016); rowHandle: true makes the column the drag handle for moving rows
         A person column (type person) keeps a person's id and draws their Avatar and name: give editorProps.options (or a render) so the read cell can find the name; with
         only editorProps.loadOptions the grid remembers each person picked in the editor, so a saved cell shows the name, but an id it has not seen shows as the raw value
     selectable: the checkbox column (select all in its header); selected (keys) with onSelectionChange(keys,
       { count, hidden }); keepHiddenSelection (default true) keeps rows a filter hides selected
     cellSelection: true: cells can be selected as a block (off by default; a grid without it behaves exactly as before). Shift with an arrow,
       Home or End extends the block from the cell that has focus (the focus cell stays in view); Shift with a click makes it from where it began (or the
       focused cell) to the clicked cell; dragging with the mouse from one cell to another makes one, and the grid scrolls when the pointer is near its
       edge (a drag, or a click on a control inside a cell, never starts on a button, link or field); a plain arrow, a click or Escape collapses it; Ctrl or
       Command with C copies it as tab-separated text that a spreadsheet pastes as rows and columns (group rows skipped). The block has the selected
       fill and a 2px border on its outer edges, its cells carry aria-selected, and the count is announced politely once the keys pause.
       api.getCellRange() returns { rows, fields, text } or null, api.clearCellRange() and api.copyCellRange() act on it.
       It is independent of row selection and of editing (Enter edits the active cell and collapses the block). Not for the static Table.
     onCellSelectionChange({ from, to, cellCount, rowCount, columnCount, fields }): runs when the cell block changes (null when it ends; from and
       to are { rowId, field })
     unread(record) or unreadKeys: unread records; onUnreadChange(keys, {unreadCount}) controls updates. Unread text is semibold with the accent start bar.
     markReadOnOpen (default true), readDelay (milliseconds, default 0): opening with click/Enter marks read. Row and selection menus also mark read/unread.
     unreadOnly with onUnreadOnlyChange controls the unread filter. Nothing is drawn above the headers (Fluent): the app
       puts DataGrid.unreadCommands(...).filter in its CommandBar's quickFilters and .selection among its selection commands. The controller exposes getUnreadCount(), markRead(keys), markUnread(keys).
     onRowClick(record, event), onRowDoubleClick(record, event): with them rows are focusable and Enter clicks;
       onCellEdit(record, { field, value, previous, row, source }) -> void | Promise<void>: a promise shows the busy cell; a rejection brings the
       old value back with its message (ADR 0016). source: "edit" (typed or chosen; the default), "undo" or "redo" (ADR 0021); once per cell
       editing: { types: ["checkbox"] }: the cell editor types the application turns on ("input" and "number" always work)
       editing: { undo: true }: Ctrl+Z undoes and Ctrl+Y (or Cmd+Shift+Z) redoes cell edits, one step per action, inside this table
         only (up to 100 steps; a step whose cells the data no longer holds as it left them ends the history). Each undo reaches
         onCellEdit with the old value (source "undo"); an application that refuses it keeps the value and the grid says why. Default false
     openKey: a string, a number or null: the key of the record whose details show (the open row); default the row last opened by a click or Enter
       (with onRowClick); null: none. The open row is aria-current="true"; in a grid without selection it takes the
       selected look (the fill and the start bar); with selection, opening a row selects only it, so it is marked too
     density: "compact" (default: tables start Compact, owner 2026-10-22) | "standard" | "comfortable" | "page" (follow the
       page's density); set on the grid itself, so its rows (36 / 40 / 48px), header and pills follow it
     uniformPillWidths: deprecated, ignored (owner, uniform-pills-always-35): with cells="pill", every standard pill of a
       column is always as wide as that column's widest pill in the current view (filtered and sorted, the current page, every
       row of it); columns stay independent; custom cells, tags and badges keep their own widths. Remove the prop; it goes
       in a later release
     typeIcons: the column type icon before each header title (default: on in a DataGrid, off in the static Table);
       false hides them
     headerMenu (default true): a click on a title sorts; the options button at a header's end edge opens the column menu
       (sort in the type's words, filter by this field, group or don't group by this field); right-click on a header
       opens the column chooser (size this column or every column to fit, every column with a check, More… for the
       Manage columns dialog). columnMenu: the application's field actions first in the column menu (duplicate, insert
       left or right, copy link, description, permissions: [{ label, icon, onSelect(column), danger, disabled, separator }])
     Look (owner, 2026-10-23): a silver header (gray 50 to gray 200, a gray 400 line under it) 28/32/40px tall by
       density; hovered, every header line shows and the column under the pointer deepens with both edges in gray 400;
       a hovered row tints gray 100 with its lines in gray 300; a selected row is blue 100 with blue-gray lines and a 3px
       blue 600 bar at its start (blue 200 hovered); a click on a title sorts with no arrow drawn (aria-sort carries the order); an active filter shows a funnel
     rowMenu: [{ label, icon, onSelect(record), danger, disabled, separator }] or (record) => that list, opened by the
       row's button (rowMenuButton, default true) or right-click; DataGrid.useActions(actions, selectedKeys, strings)
       wraps selection commands with Undo for the CommandBar
     The page's view (the command bar drives it; each applies when it changes): filter(record), sort [{ field, dir }],
       groupBy (a field, or a list for nested groups), columnOrder, hiddenColumns; onAddToGroup(value, path): the add row
       at the end of each group
     tree: rows nest (children in childrenField, default "children"; the toggle in treeColumn; treeExpanded: start open)
     movableRows with onRowMove(records), movableColumns: drag, with the same moves in the menus
     rowHeight: "short" (the density's) | "medium" | "tall" | "extra-tall"; wrapHeaders; viewMenu: the grid's own view
       button (default false: the page's ViewMenu sets these)
     cells: "text" (default) | "pill": the pill view (owner, 2026-10-19): every value is a DataPill with its column's type
       icon (a calendar for a date, a person for a person; a person's value.gender makes it blue or pink with the male or
       female icon); technical values (numbers, currency, dates, sizes, kind data) in the data font. A column chooses per value
       with pill(value, record) → { tone, icon, variant, data, gender, fill } (a price band green to red, the sun or the moon
       by the hour) or keeps its plain value with pill: false. Tags, badges and deleted values keep their own look
     mode: "fill" (default: fills the room left on screen, virtual rows) | "pages" (pageSize, pageSizes, a footer with
       Pagination) | "load-more"; height: a size token or "100%" in place of the room "fill" measures
     fetchRows({ page, size, sort, filters, search }): rows from a server, returning { rows, total }; search: the page's
       search text. "pages" asks for one page at a time; "load-more" appends the next on Load more; "fill" (issue 522)
       appends the next page by itself when the scroll comes within 8 rows of the end (and while the rows do not yet
       fill the room), with a "Loading records" row at the end while it comes, a row with Retry when it fails, and no
       more asking at total. In "fill" and "load-more" an empty or short page (fewer rows than size) ends the list, even
       when total says more (issue 614). A sort, filter or search change starts again from page 1, in the same render
       as the change. size is pageSize (default 50)
     storageKey: a string: keeps the person's standalone view (sort, widths, order, hidden columns, row height, wrap, groups).
     onViewChange(patch): delegates view changes to an external controller; its presence disables the grid's own store.
       useCollectionView supplies this callback and columnWidths, so its collection state owns the view.
     onFilterField(field): the header menu's "Filter by this field" calls it instead of opening the header filter box; useCollectionView
       sets it so the command bar's Filter panel opens on that field (one filter state, shown in one place)
     columns[].wrap: true starts the column wrapped (as kind "wrap"); people turn Wrap text on or off in the column menu, and
       Wrap all columns in the header's right-click menu. A row with a wrapping column starts every cell at the top, at the
       reading line height; rows without one stay centered. wrapColumns ({ field: true|false }) and onWrapColumnsChange(next)
       control it from outside; the saved view keeps it (owner, 2026-10-24)
     narrow: "auto" (default, a SplitView's grid too; issue 679): a table while its visible columns fit the grid's measured width at their
       minimum readable widths (each column's minWidth, else its header and cell space, at least 80px; plus the selection, row
       menu and view columns; issue 929). Each column starts at its content (its header and widest value, capped at its set
       width); spare room goes to the title (the first key column), else the widest text column; over the room, the columns
       with the most room above their minimum give it up first and the title last; a column the person sized keeps its
       width; else the row cards | "table" (a fixed table at its set widths that may scroll sideways:
       the escape hatch for a dense specialized grid) | "list" (the row cards under narrowAt, 600px). Row cards (issue 679, owner 2026-11-01: every
       grid, by default): the row template, layout "A" unless the grid names another (see layout): a bar over the cards with the select-all checkbox and the
       count of records, then each record as three aligned lines (the title and the date, the subtitle and the primary value, the secondary and the tertiary)
       with the values the columns' own cells show (their render or formatter), the fields no slot takes as "Label: value" lines under the third, the selection
       checkbox at the start and the row menu at the end; nothing scrolls sideways. keyColumns, if the app gives them, are the title, the subtitle and
       the primary value. layout="plain" is the card of before (the key values, then every other field as a labeled detail). A right-to-left phone
       number (Arabic) needs a left-to-right mark before each space in its column's render (phone.replace(/ /g, '\u200E ')), as the sample does, or its groups read in the wrong order
     layout: "A" | "B" | "wide" | "plain" (issues 839 and 679; the row template). Unset, and without template, a grid draws "A" in its narrow card (the default of every grid; "plain" draws the old plain card; narrow="table" keeps a table). A and B are the narrow
       view's card (the table while the columns fit, else every record as a card; the switch is #679's, measured): A is three aligned lines
       (title | date, subtitle | primary, secondary | tertiary) with one vertical line down the list, for records with many fields that must line up and
       scan down; B has the primary value beside the title, the subtitle on its own line and the three small facts (secondary | tertiary | date) on the
       third, for short lists where the primary value matters most. "wide" draws the same slots as one aligned row at any width, a column each in the
       order title, subtitle, date, primary, secondary, tertiary, for when the room always fits. With only template set, the layout is "A"
     template: { title, subtitle, date, primary, secondary, tertiary }: the row template's slots, each a column's field, every slot optional. Slots left
       out are filled by one fixed rule (engine/rowTemplate.ts): the first date column is the date, the first number column the primary value, then
       title, subtitle, primary, secondary, tertiary and date take the next columns in the order of `columns`. A column that fills no slot is not drawn
       in a card that names its layout or template: map every field a person needs while scanning; the rest shows when the row is opened (the default card
       keeps such fields as "Label: value" lines under its last line). Selection, the open row, the keyboard and the row menu work in every layout
     empty: shown when no row matches; error and onRetry(): the error state and its one recovery; strings: the words
     strings.cardCount: the count over the template cards names the app's records (issue 679), a plural message in the
       locale's forms with {n}: { one: '{n} member', other: '{n} members' }; Arabic { zero: 'لا يوجد أعضاء', one: 'عضو واحد',
       two: 'عضوان', few: '{n} أعضاء', many: '{n} عضوًا', other: '{n} عضو' }. Without it the count says records
     className: more classes on the frame
   Behavior:
     Cell selection copy: copied cells keep their text as is: a value starting with =, +, - or @ is read by spreadsheet apps as a formula when
       pasted. Apps that copy untrusted text into spreadsheets should guard it.
     A column is dragged no wider than --plx-sys-shell-pane-window-share (90%) of the table, down to the 4px grid; a smaller maxWidth still applies.
     Search filtering yields to typing and evaluates each record once per predicate/data revision; numeric text collation and controlled sort state are reused.
     Width conversions are shared across cells and refreshed when the measured token environment changes.
     By default the grid switches to row cards before it would need to scroll sideways, and back to the table when it fits again
       (a resize, a pane drag, a column shown or hidden). The cards keep the sort, filter, groups, selection, the open row and
       the saved view (virtualization stays on for the table). In the cards the column headers are hidden: sorting and filtering
       come from the command bar's panels and the saved view.
     A long card list draws only the cards near the view (issue 809): more than 100 cards, each measured at its own height
       (lines that wrap, an open row), with a space before and after them exactly as tall as the cards not drawn, in the grid's
       own scroll area or the window when the grid grows with the page. The focused card and the headers of the group in view
       stay drawn, so focus is never lost and group headers stay stuck at the top; End (or Ctrl or Command with End) on a card
       goes to the last at once, the arrows to the next card wherever it is. Browser find sees only the drawn cards, as in
       the table. The counts, select-all, find and filters work on all the rows, and aria-rowcount is the full count. A list of 100 cards
       or fewer draws as before; remote rows keep their own loading.
     In a table (narrow="table", or one that fits), horizontal body scrolling moves the column headers by the same amount; only frozen headers and cells stay pinned.
       Pinned cells use the grid direction for placement, while their values retain automatic text direction.
     The grid is an ARIA grid: column headers (aria-sort), rows (aria-rowindex, aria-rowcount) and cells; its body is one
       Tab stop; the arrow keys move between cells, Home and End to the ends, Shift + F10 opens the focused header's or
       row's menu. On a cell its column lets people edit: Enter or F2 starts editing with the value kept, and typing a character starts it with that character
       in place of the value (not Space, which still chooses the row; not during IME composition, with Ctrl, Alt or Meta held, or in a read-only cell); Enter saves, Escape cancels. Menus are ARIA menus. Opening and closing a group is announced politely (announce()): "expanded" or "collapsed".
     Every drag has a way without dragging (WCAG 2.5.7): Move up, down, to top and to bottom on a row; Move left and right
       on a column; a focused handle moves its row with Alt + Arrow keys. Column widths step through the size tokens.
     Geometry: the row height, cell padding and text size are the density's tokens; a taller row step puts content at the
       top with a Short row's padding. Group rows: a chevron, the field as an eyebrow, the value and the record count,
       one sunken band between groups; group headers stick while their rows scroll; the grouped-by column is tinted.
     Virtual rows: only the rows in view are drawn; the rows not drawn are token-sized gaps (every row height is known,
       nothing is measured); printing and copying use every loaded row. Narrow: the key columns as a list, with the
       checkbox, handle and row actions kept.
   Notes:
     Inline styles only where the owner allows them (2026-10-13): column widths that equal a size token and the virtual
     gaps' heights from the tokens; never a row height, line height or cell padding. Hover, selected and selected + hover
     are three row colors; pinned and row-header cells follow the row.
*/
import React from 'react';
import { DataGridEngine } from './DataGridEngine.tsx';
import { useRowTemplate } from './engine/rowTemplate.ts';
import { useDataGridActions } from './actions.tsx';
import { unreadCommands } from './unread-commands.ts';
import { ToastProvider, useOptionalToast } from '../Toast/Toast.tsx';
import type { IconValue } from '../Icon/Icon.tsx';

/* The public types (issue 292, ADR 0011, G3 ruling on #292; ADR 0016 for the editing props). Written from the Props block above.
   Records are R; what a column holds is unknown unless its type narrows it; callbacks get R. */

/** @public the cell editors a column can name (ADR 0016) */
export type EditorType = 'input' | 'number' | 'select' | 'combobox' | 'tags' | 'date' | 'checkbox' | 'textarea' | 'person';

/** @public what an application's own cell editor receives (ADR 0016) */
export type CellEditorProps<V = unknown> = {
  value: V;
  record: unknown;
  field: string;
  /** the draft */
  onChange(value: V): void;
  /** save (Enter, Tab, blur by the grid's rules) */
  onCommit(value?: V): void;
  /** Escape: the old value stays */
  onCancel(): void;
  /** the message to show under the cell */
  invalid?: string;
  autoFocus: boolean;
  dir: 'ltr' | 'rtl';
  /** the message's id while invalid */
  'aria-describedby'?: string;
};

/** @public the form's state a renderForm gets (ADR 0016 addendum F3, D-0063) */
export type FormEditState = {
  /** the draft: the record's editable fields, edited */
  value: Record<string, unknown>;
  setValue(next: Record<string, unknown>): void;
  /** field -> the message from the column's validate, after Save */
  errors: Record<string, string>;
  /** true while onRecordEdit's promise runs */
  busy: boolean;
};

/** @public the `editing` options object (ADR 0016) */
export type DataGridEditing = {
  /** the editor types this application turns on; "input" and "number" always work */
  types?: EditorType[];
  /** typing replaces the value (default true) */
  typeToReplace?: boolean;
  /** Enter edits an editable cell (default true) */
  enterEdits?: boolean;
  /** dragging across cells selects a range (default false) */
  rangeSelect?: boolean;
};

/** @public */
export type DataGridColumnType = 'text' | 'number' | 'currency' | 'date' | 'select' | 'checkbox' | 'file' | 'image' | 'link' | 'person' | 'long-text' | 'bytes' | 'multi';
/** @public */
export type DataGridColumnKind = 'name' | 'data' | 'icon' | 'center' | 'actions' | 'wrap' | 'deleted' | 'avatar-name' | 'tags' | 'badge' | 'id' | 'email' | 'url' | 'phone' | 'code';
/** @public */
export type DataGridSortDir = 'asc' | 'desc';
/** @public */
export type DataGridOption = { value: string; label: string; src?: string; color?: string; gender?: string };

/** @public a column of the grid; `field` names a field of the record */
export type DataGridColumn<R = Record<string, unknown>> = {
  field: keyof R & string;
  title?: string;
  /** one kind, or several that combine as a list */
  kind?: DataGridColumnKind | DataGridColumnKind[];
  type?: DataGridColumnType;
  icon?: IconValue | React.ReactNode;
  groupable?: boolean;
  groupRange?: number;
  groupBucket?(value: unknown): string;
  /** the cell as a React element */
  render?(record: R, cell?: unknown): React.ReactNode;
  sorter?: 'string' | 'number' | 'date' | ((a: unknown, b: unknown, recordA: R, recordB: R, field: string, direction: DataGridSortDir) => number);
  sortable?: boolean;
  /** true: contains text; "list": one of the column's values */
  filter?: boolean | 'list';
  summary?: 'sum' | 'count' | 'average' | 'min' | 'max';
  /** the text for a missing value */
  empty?: string;
  /** a CSS length or a size token */
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  frozen?: boolean;
  rowLabel?: boolean;
  align?: 'left' | 'center' | 'right';
  resizable?: boolean;
  wrap?: boolean;
  rowHandle?: boolean;
  /** a technical or custom pill for the pill view; false keeps the plain value */
  pill?: false | ((value: unknown, record: R) => { tone?: string; icon?: IconValue | React.ReactNode; variant?: string; data?: boolean; gender?: string; fill?: boolean } | void);
  /** ADR 0016 */
  editor?: EditorType | { component: React.ComponentType<CellEditorProps>; props?: object };
  editorProps?: {
    options?: DataGridOption[];
    loadOptions?(query: string): Promise<DataGridOption[]>;
    min?: string;
    max?: string;
    rows?: number;
  };
  editable?(record: R): boolean;
  /** a message keeps the cell open with it under; null saves */
  validate?(value: unknown, record: R): string | null | Promise<string | null>;
};

/** @public */
export type DataGridMenuAction<R> = { label?: string; icon?: IconValue | React.ReactNode; onSelect?(record: R): void; danger?: boolean; disabled?: boolean; separator?: boolean };
/** @public */
export type DataGridColumnMenuAction<R = Record<string, unknown>> = { label?: string; icon?: IconValue | React.ReactNode; onSelect?(column: DataGridColumn<R>): void; danger?: boolean; disabled?: boolean; separator?: boolean };
/** @public a row's key: the value of its `index` field */
export type DataGridKey = string | number;
/** @public */
export type DataGridCellPoint = { rowId: DataGridKey; field: string };
/** @public */
export type DataGridRowTemplate = { title?: string; subtitle?: string; date?: string; primary?: string; secondary?: string; tertiary?: string };
/** @public */
export type DataGridFetch = { page: number; size: number; sort?: { field: string; dir: DataGridSortDir }[]; filters?: unknown; search?: string };
/** @public */
export type DataGridGroup = string | { field: string; interval?: 'day' | 'week' | 'month' | 'year'; range?: number };

/** @public the DataGrid's props (ADR 0011) */
export type DataGridProps<R = Record<string, unknown>> = {
  /** names the grid for screen readers */
  label: string;
  /** the rows */
  data?: R[];
  /** the field that identifies a row (default "id") */
  index?: keyof R & string;
  columns: DataGridColumn<R>[];
  selectable?: boolean;
  selected?: DataGridKey[];
  onSelectionChange?(keys: DataGridKey[], info: { count: number; hidden: number }): void;
  keepHiddenSelection?: boolean;
  cellSelection?: boolean;
  onCellSelectionChange?(change: { from: DataGridCellPoint; to: DataGridCellPoint; cellCount: number; rowCount: number; columnCount: number; fields: string[] } | null): void;
  unread?(record: R): boolean;
  unreadKeys?: DataGridKey[];
  onUnreadChange?(keys: DataGridKey[], info: { unreadCount: number }): void;
  markReadOnOpen?: boolean;
  readDelay?: number;
  unreadOnly?: boolean;
  onUnreadOnlyChange?(next: boolean): void;
  onRowClick?(record: R, event: React.SyntheticEvent): void;
  onRowDoubleClick?(record: R, event: React.SyntheticEvent): void;
  onCellEdit?(record: R, change: { field: string; value: unknown; previous: unknown; row: R }): void | Promise<void>;
  /** ADR 0016 */
  editing?: DataGridEditing;
  editMode?: 'inline' | 'form';
  editModes?: ('inline' | 'form')[];
  formSurface?: 'drawer' | 'dialog' | { panel: React.RefObject<HTMLElement | null> };
  renderForm?(record: R, form: FormEditState): React.ReactNode;
  onRecordEdit?(record: R, changes: Record<string, unknown>): void | Promise<void>;
  /** the key of the record whose details show; null: none */
  openKey?: string | number | null;
  density?: 'compact' | 'standard' | 'comfortable' | 'page';
  /** deprecated, ignored */
  uniformPillWidths?: boolean;
  typeIcons?: boolean;
  headerMenu?: boolean;
  columnMenu?: DataGridColumnMenuAction<R>[];
  rowMenu?: DataGridMenuAction<R>[] | ((record: R) => DataGridMenuAction<R>[]);
  rowMenuButton?: boolean;
  /** the page's view */
  filter?(record: R): boolean;
  sort?: { field: string; dir: DataGridSortDir }[];
  groupBy?: DataGridGroup | DataGridGroup[];
  columnOrder?: string[];
  hiddenColumns?: string[];
  onAddToGroup?(value: unknown, path: unknown[]): void;
  tree?: boolean;
  childrenField?: string;
  treeColumn?: string;
  treeExpanded?: boolean;
  movableRows?: boolean;
  onRowMove?(records: R[]): void;
  movableColumns?: boolean;
  rowHeight?: 'short' | 'medium' | 'tall' | 'extra-tall';
  wrapHeaders?: boolean;
  viewMenu?: boolean;
  cells?: 'text' | 'pill';
  mode?: 'fill' | 'pages' | 'load-more';
  pageSize?: number;
  pageSizes?: number[];
  height?: string;
  fetchRows?(request: DataGridFetch): Promise<{ rows: R[]; total: number }>;
  search?: string;
  storageKey?: string;
  onViewChange?(patch: Record<string, unknown>): void;
  columnWidths?: Record<string, number | string>;
  onFilterField?(field: string): void;
  wrapColumns?: Record<string, boolean>;
  onWrapColumnsChange?(next: Record<string, boolean>): void;
  narrow?: 'auto' | 'table' | 'list';
  narrowAt?: number;
  keyColumns?: string[];
  layout?: 'A' | 'B' | 'wide' | 'plain';
  template?: DataGridRowTemplate;
  empty?: React.ReactNode;
  error?: React.ReactNode;
  onRetry?(): void;
  strings?: Record<string, unknown>;
  className?: string;
  /** called with the grid's controller once it is ready */
  onReady?(api: unknown): void;
};

// a toast when the page has a ToastProvider; nothing otherwise. Toast's own hook, not ReviewFlow's: ReviewFlow would pull the command bar, the quick filter, the avatar and a dialog into every grid (issue 807)

// the row menu's actions with Undo, as the CommandBar's selection commands
function ActionTable(props: DataGridProps<any>) { const rowMenu = useDataGridActions(props.rowMenu, undefined, props.strings), shaped = useRowTemplate(props); return <DataGridEngine {...shaped} rowMenu={rowMenu} />; }

export function DataGrid<R = Record<string, unknown>>(props: DataGridProps<R>) { const toast = useOptionalToast(); return toast ? <ActionTable {...props} /> : <ToastProvider><ActionTable {...props} /></ToastProvider>; }
DataGrid.useActions = useDataGridActions;
DataGrid.unreadCommands = unreadCommands;
// nothing to load ahead: the engine is part of the Platform bundle (kept so pages that called it keep working)
DataGrid.preload = () => {};
