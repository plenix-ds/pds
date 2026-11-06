/* Plenix · DataGrid internal types (issue 292, ADR 0011): the shapes the engine files share while DataGrid moves to TypeScript.
   Internal: not exported from the package. The public DataGridProps and DataGridColumn come with the engine's own PR and the DS Architect's review (G3);
   until then a column is read by the fields the engine uses, and any other field of the application's passes through untouched. */

/** a column as the engine reads it (the application's column description) */
export type GridColumn = {
  field: string;
  title?: string;
  type?: string;
  /** "data", "id", "email", "tags", "actions", "wrap" … one name or several */
  kind?: string | string[];
  sorter?: string;
  rowHandle?: boolean;
  [key: string]: unknown;
};
/** a record as the application gave it */
export type DataRecord = Record<string, unknown>;
/** the slots of the narrow card's row template, each a column's field (issue 839) */
export type RowTemplate = { title?: string; subtitle?: string; date?: string; primary?: string; secondary?: string; tertiary?: string };
/** a row template resolved against the columns: the layout, which field is in which slot, and which columns the card keeps */
export type ResolvedTemplate = { layout: string; slots: Partial<Record<keyof RowTemplate, string>>; slotOf: Record<string, keyof RowTemplate>; keep: Set<string>; implicit: boolean };
/** the engine's live state, read through a ref by the adapter and the hooks: what the grid held at its last render (the fields named here are the ones the typed files read; the rest passes through) */
export type LiveGrid = { current: { sizing?: Record<string, number>; selection: Record<string, boolean>; table: import('@tanstack/react-table').Table<DataRecord>; [key: string]: unknown } };
