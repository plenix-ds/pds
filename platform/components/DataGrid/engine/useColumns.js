/* Plenix · DataGrid engine · columns
   Summary: The grid's columns as the person and the caller set them: the order, which are hidden, each one's width (the
     saved widths, the sizes the grid measured, the floors a column cannot go below), what a change tells the caller
     (onViewChange), the pinned (frozen) columns, and moving a column.
   Usage:
     import { useColumns } from './engine/useColumns.js';
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
     Moved out of DataGridEngine.jsx without any change to the code (issue 714, the columns concern): the parts were lines of
     the engine function, in the same order with the same values. The engine is documented in DataGridEngine.jsx.
*/
import React from 'react';
import { visibilityOf } from '../state.js';
import { tokenPixels } from '../environment.js';
import { SIZE_STEPS, snapSize } from '../../../utils/sizeSteps.js';
import { shareOf } from '../../../utils/paneLimit.ts';
import { snapToGrid } from '../../../utils/grid.ts';

export function useColumns({ initial, props, columns, frame, live, emit, api }) {
  const [order, setOrder] = React.useState(initial.order),
    [visibility, setVisibility] = React.useState(initial.visibility);
  const orderSignal = JSON.stringify(props.columnOrder),
    hiddenSignal = JSON.stringify(props.hiddenColumns);
  const [orderOwner, setOrderOwner] = React.useState(null),
    [hiddenOwner, setHiddenOwner] = React.useState(null);
  const [sizing, setSizing] = React.useState(() =>
    Object.fromEntries(Object.entries(initial.widths).map(([k, v]) => [k, parseFloat(v)]))
  );
  const [autoSizing, setAutoSizing] = React.useState({}),
    [floors, setFloors] = React.useState({});
  const widthsSignal = JSON.stringify(props.columnWidths || {});
  React.useEffect(() => {
    if (!props.onViewChange) return;
    const known = new Set(columns.map((column) => column.field)),
      next = Object.fromEntries(
        Object.entries(props.columnWidths || {})
          .filter(([field, value]) => known.has(field) && Number.isFinite(parseFloat(value)) && parseFloat(value) > 0)
          .map(([field, value]) => [field, parseFloat(value)])
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
  const resize = (field, value) => {
    const definition = columns.find((c) => c.field === field),
      at = frame.current;
    const min = Math.max(floors[field] || 0, tokenPixels(definition?.minWidth || '--plx-ref-size-20u', at)),
      max = Math.min(
        definition?.maxWidth ? tokenPixels(definition.maxWidth, at) : SIZE_STEPS[SIZE_STEPS.length - 1],
        Math.max(min, shareOf(at?.clientWidth, at))
      );
    const width = snapToGrid(snapSize(tokenPixels(value, at), min, max), { el: at });
    live.current.sizing = { ...(live.current.sizing || sizing), [field]: width };
    setSizing((s) => ({ ...s, [field]: width }));
    props.onViewChange?.({ widths: { ...sizing, [field]: width } });
  };
  const changeOrder = (next) => {
    setOrderOwner(orderSignal);
    setOrder(next);
    props.onViewChange?.({ columnOrder: next });
  };
  const changeVisibility = (next) => {
    setHiddenOwner(hiddenSignal);
    setVisibility(next);
    props.onViewChange?.({ hiddenColumns: Object.keys(next).filter((field) => next[field] === false) });
  };
  const move = (field, target, after) => {
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
  const orderAt = (id) => {
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
