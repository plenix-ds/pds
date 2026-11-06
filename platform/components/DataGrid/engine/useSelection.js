/* Plenix · DataGrid engine · selection
   Summary: The grid's row selection: the selection map and its owner (the caller's selected list, or the grid's own),
     what a change tells the caller and the events, the one-row pick, and the clicks and checkboxes that choose rows
     (a plain click, Ctrl or Command, Shift for a range, select all).
   Usage:
     import { useSelection, selectionActions } from './engine/useSelection.js';
     const { selection, notifySelection, pick, selectionInfo, selectionAnchor } = useSelection({ selected, live, canonical, index, options, onSelectionChange, emit, api });
     const { selectionRows, selectedVisible, allVisible, selectAll, pickCheckbox, chooseRow } = selectionActions({ table, live, selection, selectionAnchor, pick, selectable, options });
   Props:
     useSelection: selected, an array of record keys (controlled) or undefined (the grid keeps its own); live, the engine's
       ref of current values; canonical, the records; index, the key field; options, the grid options (selectableRows);
       onSelectionChange(keys, { count, hidden }); emit and api, the engine's event emitter and adapter.
       Returns selection (a { key: true } map), notifySelection(next) (store, tell the caller and emit rowSelectionChanged),
       pick(key, value), and the refs selectionInfo (how many selected records a filter hides) and selectionAnchor (the
       row a Shift range starts from).
     selectionActions: table (the TanStack table), live, selection, selectionAnchor, pick, selectable, options; returns the
       rows that select all works on (selectionRows), selectedVisible, allVisible, selectAll(value), pickCheckbox(row, event)
       and chooseRow(row, event).
   Notes:
     Moved out of DataGridEngine.jsx without any change to the code (issue 714, first of its concerns): the hook's parts were
     lines of the engine function, read in the same order with the same values. The engine is documented in DataGridEngine.jsx.
*/
import React from 'react';
import { recordKey } from '../state.ts';

export function useSelection({ selected, live, canonical, index, options, onSelectionChange, emit, api }) {
  const selectionInfo = React.useRef({ hidden: 0 }),
    selectionAnchor = React.useRef(null);
  const [ownSelection, setSelection] = React.useState({});
  const selection = Array.isArray(selected)
    ? Object.fromEntries(selected.map((k) => [recordKey(k), true]))
    : ownSelection;
  const notifySelection = (next) => {
    live.current.selection = next;
    setSelection(next);
    const active = new Set(live.current.table.getFilteredRowModel().flatRows.map((r) => r.id)),
      records = canonical.filter((r) => next[recordKey(r[index])]);
    selectionInfo.current = { hidden: records.filter((r) => !active.has(recordKey(r[index]))).length };
    onSelectionChange?.(
      records.map((r) => r[index]),
      { count: records.length, hidden: selectionInfo.current.hidden }
    );
    emit(
      'rowSelectionChanged',
      records,
      records.map((r) => api.row(recordKey(r[index])))
    );
  };
  const pick = (key, value) => {
    const now = live.current;
    if (!!now.selection[key] === !!value) return;
    let row = null;
    try {
      row = now.table.getRow(key, true);
    } catch (e) {
      row = null;
    }
    if (row && row.getIsSelected() === !!now.selection[key]) row.toggleSelected(!!value, { selectChildren: false });
    else
      now.table.setRowSelection((old) => {
        const next = { ...old };
        if (options.selectableRows === 1 && value) Object.keys(next).forEach((k) => delete next[k]);
        if (value) next[key] = true;
        else delete next[key];
        return next;
      });
  };
  return { selection, notifySelection, pick, selectionInfo, selectionAnchor };
}

export function selectionActions({ table, live, selection, selectionAnchor, pick, selectable, options }) {
  const selectionRows = table.getPrePaginationRowModel().rows,
    selectedVisible = selectionRows.filter((r) => selection[r.id]),
    allVisible = selectionRows.length > 0 && selectedVisible.length === selectionRows.length;
  const selectAll = (value) => {
    const next = { ...selection };
    selectionRows.forEach((r) => {
      if (value) next[r.id] = true;
      else delete next[r.id];
    });
    table.setRowSelection(next);
  };
  const pickCheckbox = (row, event) => {
    const wanted = event.target.checked,
      from = selectionRows.findIndex((r) => r.id === selectionAnchor.current),
      to = selectionRows.indexOf(row);
    if ((event.nativeEvent?.shiftKey || event.shiftKey) && from >= 0 && to >= 0) {
      const next = { ...live.current.selection };
      selectionRows.slice(Math.min(from, to), Math.max(from, to) + 1).forEach((record) => {
        if (wanted) next[record.id] = true;
        else delete next[record.id];
      });
      table.setRowSelection(next);
    } else pick(row.id, wanted);
    selectionAnchor.current = row.id;
  };
  // a click on the row (or Enter on it), not on its checkbox (#452, as a file manager): a plain one selects only that row,
  // Ctrl or ⌘ toggles it, Shift extends from the anchor, Ctrl or ⌘ with Shift adds the range to the selection; the
  // checkbox and select all keep toggling
  const chooseRow = (row, e) => {
    if (!selectable && !options.selectableRows) return;
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && selectable) {
      pickCheckbox(row, { target: { checked: true }, nativeEvent: e.nativeEvent, shiftKey: true });
      return;
    } // Ctrl/⌘+Shift adds the range
    if (e.ctrlKey || e.metaKey) {
      if (selectable)
        pickCheckbox(row, { target: { checked: !selection[row.id] }, nativeEvent: e.nativeEvent, shiftKey: false });
      else pick(row.id, !selection[row.id]);
      return;
    }
    if (e.shiftKey && selectable) {
      pickCheckbox(row, { target: { checked: !selection[row.id] }, nativeEvent: e.nativeEvent, shiftKey: true });
      return;
    }
    const now = live.current.selection,
      keys = Object.keys(now).filter((k) => now[k]);
    if (!(keys.length === 1 && keys[0] === String(row.id))) table.setRowSelection({ [row.id]: true });
    selectionAnchor.current = row.id;
  };
  return { selectionRows, selectedVisible, allVisible, selectAll, pickCheckbox, chooseRow };
}
