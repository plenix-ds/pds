/* Plenix · DataGrid engine · table model
   Summary: The grid's TanStack table: one column definition per column (accessor, sort and filter functions, sizes from the measured
     metrics and the column's own width, minimum and maximum) and the table over the records (sorting, filtering, paging, expansion,
     pinning, visibility, order and sizing state), with every change it makes handed to the engine's own handlers.
   Usage:
     import { useTableModel } from './engine/useTableModel.js';
     const { leafDefs, table } = useTableModel({ columns, source, props, sorting, filters, ... });
   Props:
     The engine's columns, records and state (sorting, filters, selection, paging, visibility, order, sizing, pinning, expansion) and
       its handlers (changeSort, notifySelection, changeVisibility, changeOrder, resize, setFilters, setPage). Returns leafDefs (the
       column definitions) and table (the TanStack table).
   Notes:
     Moved out of DataGridEngine.jsx without any change to the code (issue 714, the table model): the parts were lines of the
     engine function, in the same order with the same values. The engine is documented in DataGridEngine.jsx.
*/
import React from 'react';
import { valueAt, recordKey } from '../state.ts';
import { byteFilter, listFilter, textFilter } from '../cells.tsx';
import { compare, kinds } from './helpers.tsx';
import { tokenPixels } from '../environment.ts';
import { SIZE_STEPS } from '../../../utils/sizeSteps.js';
import { parseDate } from '../../../utils/format.ts';
import { shareOf } from '../../../utils/paneLimit.ts';
import {
  useReactTable,
  getExpandedRowModel,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { isRtl } from '../../../utils/direction.ts';

// dates in time order, whatever form they come in (a Date, a timestamp, a bare "YYYY-MM-DD" as its local midnight); no date sorts last (issue 161)
const dateOrder = (a, b) => {
  const x = parseDate(a)?.getTime(), y = parseDate(b)?.getTime();
  return x === y ? 0 : x === undefined ? 1 : y === undefined ? -1 : x - y;
};

export function useTableModel({
  columns,
  sortingRef,
  metrics,
  floors,
  autoSizing,
  frame,
  source,
  index,
  childField,
  setExpanded,
  printing,
  expanded,
  sorting,
  columnOrder,
  columnVisibility,
  sizing,
  filters,
  activeFilter,
  page,
  pageSize,
  selection,
  columnPinning,
  changeSort,
  options,
  notifySelection,
  live,
  changeVisibility,
  changeOrder,
  resize,
  setFilters,
  setPage,
  recordFilter,
  deferredFilter,
  remoteMode,
  remote,
  mode,
}) {
  const leafDefs = React.useMemo(
    () =>
      columns.map((c) => ({
        id: c.field,
        accessorFn: (r) => valueAt(r, c.field),
        header: c.title || c.field,
        enableSorting: c.sortable !== false,
        filterFn: c.type === 'bytes' ? byteFilter : c.filter === 'list' ? listFilter : textFilter,
        sortingFn:
          typeof c.sorter === 'function'
            ? (a, b, id) =>
                c.sorter(
                  a.getValue(id),
                  b.getValue(id),
                  a.original,
                  b.original,
                  id,
                  sortingRef.current.find((s) => s.id === id)?.desc ? 'desc' : 'asc'
                )
            : c.sorter === 'number' || c.type === 'bytes'
              ? 'basic'
              : c.type === 'date' || c.sorter === 'date'
                ? (a, b, id) => dateOrder(a.getValue(id), b.getValue(id))
                : compare,
        size: kinds(c).includes('icon')
          ? metrics.lead
          : Math.max(
              metrics.min,
              floors[c.field] || 0,
              autoSizing[c.field] || tokenPixels(c.width, frame.current) || metrics.min
            ),
        minSize: kinds(c).includes('icon')
          ? metrics.lead
          : Math.max(floors[c.field] || 0, tokenPixels(c.minWidth, frame.current) || metrics.min),
        maxSize: kinds(c).includes('icon')
          ? metrics.lead
          : Math.min(
              c.maxWidth ? tokenPixels(c.maxWidth, frame.current) : SIZE_STEPS[SIZE_STEPS.length - 1],
              Math.max(
                Math.max(floors[c.field] || 0, tokenPixels(c.minWidth, frame.current) || metrics.min),
                shareOf(metrics.room, frame.current)
              )
            ),
        meta: c,
      })),
    [columns, metrics.min, metrics.lead, metrics.room, autoSizing, floors]
  );
  const table = useReactTable({
    data: source,
    columns: leafDefs,
    getRowId: (r) => recordKey(r[index]),
    getSubRows: childField ? (r) => r[childField] : undefined,
    onExpandedChange: setExpanded,
    filterFromLeafRows: true,
    state: {
      expanded: printing ? true : expanded,
      sorting,
      columnOrder,
      columnVisibility,
      columnSizing: sizing,
      columnFilters: filters,
      globalFilter: activeFilter,
      pagination: { pageIndex: page, pageSize },
      rowSelection: selection,
      columnPinning,
    },
    onSortingChange: changeSort,
    enableMultiRowSelection: options.selectableRows !== 1,
    enableSubRowSelection: false,
    onRowSelectionChange: (update) =>
      notifySelection(typeof update === 'function' ? update(live.current.selection || selection) : update),
    onColumnVisibilityChange: (update) => {
      changeVisibility(typeof update === 'function' ? update(columnVisibility) : update);
    },
    onColumnOrderChange: (update) => {
      changeOrder(typeof update === 'function' ? update(columnOrder) : update);
    },
    onColumnSizingChange: (update) => {
      const before = live.current.sizing || sizing,
        next = typeof update === 'function' ? update(before) : update;
      Object.keys(next).forEach((id) => {
        if (next[id] !== before[id]) resize(id, next[id]);
      });
    },
    columnResizeMode: 'onChange',
    columnResizeDirection: frame.current && isRtl(frame.current) ? 'rtl' : 'ltr',
    onColumnFiltersChange: (update) => {
      setFilters(update);
      setPage(0);
    },
    getColumnCanGlobalFilter: () => true,
    globalFilterFn: recordFilter,
    globalFilter: deferredFilter,
    manualPagination: remoteMode,
    manualSorting: remoteMode,
    manualFiltering: remoteMode,
    pageCount: remoteMode ? Math.ceil((remote?.total || 0) / pageSize) : undefined,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: (t) => () => {
      const all = t.getPreFilteredRowModel();
      return { rows: all.rows, flatRows: all.rows, rowsById: all.rowsById };
    },
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: mode === 'pages' ? getPaginationRowModel() : undefined,
    autoResetPageIndex: false,
  });
  return { table };
}
