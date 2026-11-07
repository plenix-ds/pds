/* Plenix · DataGrid engine · columns
   Summary: The grid's columns as the person and the caller set them: the order, which are hidden, each one's width (the
     saved widths, the sizes the grid measured, the floors a column cannot go below), what a change tells the caller
     (onViewChange), the pinned (frozen) columns, and moving a column.
   Usage:
     import { useColumns } from './engine/useColumns.ts';
     const { sizing, columnOrder, columnVisibility, resize, changeOrder, changeVisibility, move, columnPinning } =
       useColumns({ initial, props, columns, frame, live, emit, api });
   Props:
     initial: the saved view the grid opens with (order, visibility, widths); props: the grid's props (columnOrder,
       hiddenColumns, columnWidths, onViewChange); columns: the column definitions; frame, live: the engine's frame ref and ref of
       current values; emit, api: the engine's event emitter and adapter.
       Returns the column state (sizing, autoSizing, floors and their setters, columnOrder, columnVisibility, columnPinning,
       pinnedAt, orderAt) and what changes it: resize(field, width), changeOrder(order), changeVisibility(map) and
       move(field, target, after), which tell the caller and emit columnMoved.
   Notes:
     Moved out of DataGridEngine.tsx without any change to the code (issue 714, the columns concern): the parts were lines of
     the engine function, in the same order with the same values. The engine is documented in DataGridEngine.tsx.
*/
import React from 'react';
import { visibilityOf } from '../state.ts';
import { tokenPixels } from '../environment.ts';
import { SIZE_STEPS, snapSize } from '../../../utils/sizeSteps.js';
import { shareOf } from '../../../utils/paneLimit.ts';
import { snapToGrid } from '../../../utils/grid.ts';
import type { GridColumn, LiveGrid } from '../types.ts';

type ColumnProps = { columnOrder?: string[]; hiddenColumns?: string[]; columnWidths?: Record<string, number | string>; onViewChange?: (change: Record<string, unknown>) => void; isStatic?: boolean };
type Initial = { order: string[]; visibility: Record<string, boolean>; widths: Record<string, number | string> };
type Adapter = { column: (field: string) => unknown };

export function useColumns({ initial, props, columns, frame, live, emit, api }: { initial: Initial; props: ColumnProps; columns: Array<GridColumn & { minWidth?: string; maxWidth?: string; frozen?: boolean; rowLabel?: boolean }>; frame: { current: HTMLElement | null }; live: LiveGrid; emit: (name: string, ...args: unknown[]) => void; api: Adapter }) {
  const [order, setOrder] = React.useState(initial.order),
    [visibility, setVisibility] = React.useState(initial.visibility);
  const orderSignal = JSON.stringify(props.columnOrder),
    hiddenSignal = JSON.stringify(props.hiddenColumns);
  const [orderOwner, setOrderOwner] = React.useState<string | undefined>(undefined),
    [hiddenOwner, setHiddenOwner] = React.useState<string | undefined>(undefined);
  const [sizing, setSizing] = React.useState(() =>
    Object.fromEntries(Object.entries(initial.widths).map(([k, v]) => [k, parseFloat(String(v))]))
  );
  const [autoSizing, setAutoSizing] = React.useState<Record<string, number>>({}),
    [floors, setFloors] = React.useState<Record<string, number>>({});
  const widthsSignal = JSON.stringify(props.columnWidths || {});
  React.useEffect(() => {
    if (!props.onViewChange) return;
    const known = new Set(columns.map((column) => column.field)),
      next = Object.fromEntries(
        Object.entries(props.columnWidths || {})
          .filter(([field, value]) => known.has(field) && Number.isFinite(parseFloat(String(value))) && parseFloat(String(value)) > 0)
          .map(([field, value]) => [field, parseFloat(String(value))])
      );
    setSizing((old) => (JSON.stringify(old) === JSON.stringify(next) ? old : next));
  }, [widthsSignal, !!props.onViewChange, columns]);
  const controlledVisibility = React.useMemo(() => visibilityOf(props.hiddenColumns), [hiddenSignal]);
  const columnOrder = props.onViewChange
      ? props.columnOrder || order
      : orderOwner === orderSignal
        ? order
        : props.columnOrder || order,
    columnVisibility = props.onViewChange
      ? controlledVisibility
      : hiddenOwner === hiddenSignal
        ? visibility
        : props.hiddenColumns
          ? controlledVisibility
          : visibility;
  const resize = (field: string, value: number | string) => {
    const definition = columns.find((c) => c.field === field),
      at = frame.current;
    // a narrow column (#966) can be resized down to its own floor (size-8u at least)
    const narrowCol = floors[field] > 0 && floors[field] < tokenPixels('--plx-ref-size-20u', at) && !definition?.width && !definition?.minWidth;
    const min = Math.max(floors[field] || 0, tokenPixels(definition?.minWidth || (narrowCol ? '--plx-ref-size-8u' : '--plx-ref-size-20u'), at)),
      max = Math.min(
        definition?.maxWidth ? tokenPixels(definition.maxWidth, at) : SIZE_STEPS[SIZE_STEPS.length - 1],
        Math.max(min, shareOf(at?.clientWidth as number, at))
      );
    const width = snapToGrid(snapSize(tokenPixels(value, at), min, max), { el: at });
    live.current.sizing = { ...(live.current.sizing || sizing), [field]: width };
    setSizing((s) => ({ ...s, [field]: width }));
    props.onViewChange?.({ widths: { ...sizing, [field]: width } });
  };
  const changeOrder = (next: string[]) => {
    setOrderOwner(orderSignal);
    setOrder(next);
    props.onViewChange?.({ columnOrder: next });
  };
  const changeVisibility = (next: Record<string, boolean>) => {
    setHiddenOwner(hiddenSignal);
    setVisibility(next);
    props.onViewChange?.({ hiddenColumns: Object.keys(next).filter((field) => next[field] === false) });
  };
  const move = (field: string, target: string, after?: boolean) => {
    const current = live.current.table
      .getAllLeafColumns()
      .map((c) => c.id)
      .filter((id) => !id.startsWith('__') && id !== field);
    const at = current.indexOf(target);
    current.splice(Math.max(0, at + (after ? 1 : 0)), 0, field);
    changeOrder(current);
    emit('columnMoved', api.column(field), current.map(api.column));
  };
  // pinned (frozen) columns are TanStack's left pinning, listed in the columns' current order (columnOrder first, then
  // the rest as defined, as TanStack orders them), so a pinned column's offset is its getStart('left')
  const pinnedAt = columns.findIndex((c) => c.rowLabel),
    // a DataGrid pins only an explicit frozen column (issue 679): a row label keeps its emphasis and row-header role,
    // unpinned. A static Table keeps its row labels pinned, as before
    pinnedIds = columns.filter((c, i) => c.frozen || (props.isStatic && pinnedAt >= 0 && i <= pinnedAt)).map((c) => c.field);
  const orderAt = (id: string) => {
    const i = (columnOrder || []).indexOf(id);
    return i < 0 ? (columnOrder || []).length + columns.findIndex((c) => c.field === id) : i;
  };
  const columnPinning = React.useMemo(
    () => ({ left: pinnedIds.slice().sort((a, b) => orderAt(a) - orderAt(b)), right: [] }),
    [JSON.stringify(pinnedIds), JSON.stringify(columnOrder)]
  );
  return {
    sizing,
    autoSizing,
    setAutoSizing,
    floors,
    setFloors,
    columnOrder,
    columnVisibility,
    resize,
    changeOrder,
    changeVisibility,
    move,
    pinnedAt,
    orderAt,
    columnPinning
  };
}
