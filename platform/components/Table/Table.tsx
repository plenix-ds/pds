/* Plenix · Table
   Summary: Static reference information in rows and columns, using the DataGrid's React renderer and Table tokens.
   Usage: <Table label="Fields" data={fields} columns={[{title:'Field',field:'name',rowLabel:true},{title:'Notes',field:'notes',kind:'wrap'}]} />
   Props:
     label: accessible table name (required); data: records; columns: title, field, kind, render(record), width,
       minWidth, maxWidth, rowLabel, frozen, align, headerAlign and wrap (true: the column wraps its text; a row with a wrapping
       column starts every cell at the top). Cells do not wrap otherwise; long text ends in an ellipsis. index identifies records (default "id").
     empty: no-record message; narrow: "table" by default; className.
     cells: "text" (default) | "pill": the pill view (owner, 2026-10-19): every value a DataPill with its column's type icon
       (type: text, number, currency, date, person …); a person's value.gender makes it blue or pink with the male or female
       icon; a column chooses per value with pill(value, record) → { tone, icon, variant, data, gender } or opts out with
       pill: false (as DataGrid). Every standard pill of a column is as wide as that column's widest pill (as DataGrid; owner,
       uniform-pills-always-35); custom cells, tags and badges keep their own widths.
     Table.preload(): compatibility no-op; the renderer is already bundled.
   Props: unread(record), unreadKeys and onUnreadChange match DataGrid; static rows never mark themselves read.
   Behavior: Every row is drawn. No sorting, filters, menus, selection, resizing, moving, editing or row hover.
     Links and controls supplied as cell content retain their own behavior. Wrapped cells stretch the entire row. The table grows with its rows and never scrolls internally.
   Notes: Existing Table tokens preserve the static-table look; use DataGrid for records people work with. */
import React from 'react';
import { DataGridEngine } from '../DataGrid/DataGridEngine.tsx';

type TableColumn = {
  title?: React.ReactNode; field: string; kind?: string; type?: string; pill?: unknown; render?(record: Record<string, unknown>): React.ReactNode;
  width?: number | string; minWidth?: number | string; maxWidth?: number | string; rowLabel?: boolean; frozen?: boolean;
  align?: 'start' | 'center' | 'end' | 'left' | 'right'; headerAlign?: 'start' | 'center' | 'end' | 'left' | 'right'; empty?: React.ReactNode; wrap?: boolean;
};
export type TableProps = {
  /** the accessible table name (required) */
  label: string;
  data?: Record<string, unknown>[];
  columns?: TableColumn[];
  /** the field that identifies a record; default "id" */
  index?: string;
  empty?: React.ReactNode;
  narrow?: string;
  headerVisible?: boolean;
  /** "text" (default) | "pill" */
  cells?: 'text' | 'pill';
  className?: string;
  unread?(record: Record<string, unknown>): boolean;
  unreadKeys?: unknown[];
  onUnreadChange?(keys: unknown[]): void;
};
export function Table({ label, data, columns = [], index, empty, narrow = 'table', headerVisible = true, cells = 'text', className, unread, unreadKeys, onUnreadChange }: TableProps) {
  const staticColumns = React.useMemo(() => columns.map(({ title, field, kind, type, pill, render, width, minWidth, maxWidth, rowLabel, frozen, align, headerAlign, empty, wrap }) =>
    ({ title, field, kind, type, pill, render, width, minWidth, maxWidth, rowLabel, frozen, align, headerAlign, empty, wrap, sortable: false, resizable: false })), [columns]);
  return <DataGridEngine isStatic unread={unread} unreadKeys={unreadKeys} onUnreadChange={onUnreadChange} label={label} data={data} columns={staticColumns} index={index} empty={empty} narrow={narrow} headerVisible={headerVisible} cells={cells} className={className} headerMenu={false} />;
}
Table.preload = (): void => {};
