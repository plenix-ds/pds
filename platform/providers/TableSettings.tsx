/* Plenix · TableSettings
   Summary: Application-wide defaults for the tables under it (ADR 0016, #84): how a table edits its cells, and which ways it offers. A table's own
     props win over it, and the person's remembered choice (under the table's storageKey) wins over both.
   Usage:
     <TableSettings editModes={['inline', 'form']} editMode="inline"> … every DataGrid below … </TableSettings>
   Props:
     editMode: "inline" (default) | "form": how a table opens when nothing is remembered
     editModes: the ways offered in each table's view menu ("Editing": Inline Edit, Form Edit); default ["inline"] (one way offers no choice)
     editing: DataGrid's `editing` options (the editor types turned on, typing replaces the value, Enter edits, range select) for every table
     children: the tables
   Behavior:
     Nothing changes for a table when no TableSettings is above it. Providers nest: the nearest one wins.
*/
import React from 'react';

type EditModeValue = 'inline' | 'form';
type TableSettingsValue = { editMode?: EditModeValue; editModes?: EditModeValue[]; editing?: Record<string, unknown> };
const TableSettingsContext = React.createContext<TableSettingsValue | null>(null);
export function TableSettings({ editMode, editModes, editing, children }: TableSettingsValue & { children?: React.ReactNode }) {
  const value = React.useMemo(() => ({ editMode, editModes, editing }), [editMode, JSON.stringify(editModes), editing]);
  return <TableSettingsContext.Provider value={value}>{children}</TableSettingsContext.Provider>;
}
export function useTableSettings(): TableSettingsValue {
  return React.useContext(TableSettingsContext) ?? {};
}
