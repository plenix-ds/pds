/* Plenix · DataGrid engine · view sync
   Summary: What the grid tells the outside once it has drawn, and what it keeps: the adapter handed to onReady (once the columns are
     measured; again if onReady changes) with the tableBuilt event, the saved view written to storage (sort, order, hidden columns,
     widths, row height, wrapped headers, grouping, collapsed groups) when the application does not keep the view itself, the
     selection reconciled against the records and filters (dropped rows, hidden count, onSelectionChange) with the dataFiltered
     event, and the dataChanged event when the records change.
   Usage:
     import { useViewSync } from './engine/useViewSync.js';
     useViewSync({ ready, props, metrics, autoSizing, sorting, columnOrder, columnVisibility, sizing, collapsed, groupBy, ... });
   Props:
     The engine's state the effects read (ready, deliveredReady, metrics, sorting, column state, grouping, selection, filters, source,
       canonical, table, the adapter api and emit) and the grid's props (onReady, onViewChange, storageKey, onSelectionChange,
       keepHiddenSelection). Returns nothing: the hook is its effects.
   Notes:
     Moved out of DataGridEngine.jsx without any change to the code (issue 714, view state and the adapter): the effects were in
     the engine function, in this order, between the same neighbors. The engine is documented in DataGridEngine.jsx.
*/
import React from 'react';
import { writeView, recordKey } from '../state.js';

export function useViewSync({
  metrics,
  autoSizing,
  ready,
  api,
  options,
  deliveredReady,
  onReady,
  emit,
  props,
  storageKey,
  sorting,
  columnOrder,
  columnVisibility,
  sizing,
  effectiveStep,
  effectiveWrap,
  editMenu,
  wrapColumns,
  groupBy,
  collapsed,
  groupSignal,
  table,
  selection,
  canonical,
  index,
  keepHiddenSelection,
  notifySelection,
  selectionInfo,
  onSelectionChange,
  filters,
  deferredFilter,
  source,
}) {
  React.useEffect(() => {
    if (!metrics.row || !Object.keys(autoSizing).length || ready.current) return;
    ready.current = true;
    api.options = options;
    deliveredReady.current = onReady;
    onReady?.(api);
    emit('tableBuilt');
  }, [metrics.row, autoSizing]);
  React.useEffect(() => {
    if (ready.current && onReady !== deliveredReady.current) {
      deliveredReady.current = onReady;
      onReady?.(api);
    }
  }, [onReady]);
  React.useEffect(() => {
    if (!ready.current || props.onViewChange) return;
    writeView(storageKey, {
      sort: sorting.map((s) => ({ column: s.id, dir: s.desc ? 'desc' : 'asc' })),
      order: columnOrder,
      hidden: Object.keys(columnVisibility).filter((k) => columnVisibility[k] === false),
      widths: Object.fromEntries(Object.entries(sizing).map(([k, v]) => [k, v + 'px'])),
      rowHeight: effectiveStep,
      wrapHeaders: effectiveWrap,
      editMode: editMenu?.mode,
      wrapColumns: props.wrapColumns || wrapColumns,
      groupBy,
      collapsed: [...collapsed],
    });
  }, [
    storageKey,
    JSON.stringify(sorting),
    JSON.stringify(columnOrder),
    JSON.stringify(columnVisibility),
    JSON.stringify(sizing),
    effectiveStep,
    effectiveWrap,
    editMenu?.mode,
    metrics.row,
    groupSignal,
    groupBy,
    collapsed,
  ]);
  React.useEffect(() => {
    if (!ready.current) return;
    const active = new Set(table.getFilteredRowModel().rows.map((r) => r.id)),
      next = { ...selection };
    const known = new Set(canonical.map((record) => recordKey(record[index])));
    const hidden = Object.keys(next).filter((key) => next[key] && known.has(key) && !active.has(key));
    const removed = Object.keys(next).filter((key) => next[key] && !known.has(key));
    if (removed.length || (!keepHiddenSelection && hidden.length)) {
      removed.concat(!keepHiddenSelection ? hidden : []).forEach((key) => delete next[key]);
      notifySelection(next);
    } else if (hidden.length !== selectionInfo.current.hidden) {
      selectionInfo.current = { hidden: hidden.length };
      const records = canonical.filter((r) => selection[recordKey(r[index])]);
      onSelectionChange?.(
        records.map((r) => r[index]),
        { count: records.length, hidden: hidden.length }
      );
    }
    emit(
      'dataFiltered',
      filters.map((f) => ({ field: f.id, type: 'like', value: f.value })),
      table.getFilteredRowModel().rows.map((r) => api.row(r.id))
    );
  }, [deferredFilter, JSON.stringify(filters), source, keepHiddenSelection]);
  const previousData = React.useRef(source);
  React.useEffect(() => {
    if (ready.current && previousData.current !== source) {
      previousData.current = source;
      emit('dataChanged', source);
    }
  }, [source]);
}
