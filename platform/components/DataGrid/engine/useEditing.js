/* Plenix · DataGrid engine · editing
   Summary: The grid's cell editing: the edited copy of the rows (so an edit shows at once and a new list from the caller
     replaces it), the cell being edited, committing an edit (the record changes, onCellEdit tells the caller, the cellEdit
     event follows once the rows have drawn), and replacing or changing records through the adapter (replaceData, updateRecord).
   Usage:
     import { useEditedRows, editActions, useEditEffect } from './engine/useEditing.js';
     const { setEdited, editing, setEditing, mutations, pendingEdit, source } = useEditedRows(incoming);
     const { replaceData, updateRecord, commitEdit } = editActions({ incoming, source, canonical, index, childField, props, setEdited, setEditing, mutations, pendingEdit });
     useEditEffect({ source, mutations, pendingEdit, emit, api });
   Props:
     useEditedRows(incoming): incoming, the rows the caller (or the server) gave; returns the rows to draw (source), the cell
       being edited ({ key, field, value } or null) with setEditing, setEdited, and the refs mutations (promises waiting for the
       rows to draw) and pendingEdit (the committed cell whose event is still to be emitted).
     editActions: returns replaceData(rows), updateRecord(key, change) (both return a promise that resolves when the rows have
       drawn) and commitEdit(key, field, value), which calls props.onCellEdit(record, { field, value, previous, row }).
     useEditEffect: after the rows draw, resolves the waiting promises and emits cellEdit for the committed cell.
   Notes:
     Moved out of DataGridEngine.jsx without any change to the code (issue 714, the editing concern): the parts were lines of
     the engine function, in the same order with the same values. The editor itself is CellEditor (engine/parts.jsx). The engine
     is documented in DataGridEngine.jsx.
*/
import React from 'react';
import { recordKey, valueAt } from '../state.js';
import { setField, changeRecord } from '../records.js';
import { announce } from '../../../utils/announce.tsx';
import { development } from '../../../utils/devWarn.ts';

let refusals = 0;   // the refusal message's id, so the cell can name it (aria-describedby)

export function useEditedRows(incoming) {
  const pendingEdit = React.useRef(null),
    mutations = React.useRef([]);
  const [edited, setEdited] = React.useState(null),
    [editing, setEditing] = React.useState(null),
    // a cell whose save is waiting for the caller ({ key, field, kind: 'saving' }) or was refused ({ …, kind: 'refused', message })
    [cellStatus, setCellStatus] = React.useState(null);
  const source = edited?.input === incoming ? edited.rows : incoming;
  return { setEdited, editing, setEditing, cellStatus, setCellStatus, mutations, pendingEdit, source };
}

export function editActions({
  incoming,
  source,
  canonical,
  index,
  childField,
  props,
  setEdited,
  setEditing,
  setCellStatus,
  S,
  mutations,
  pendingEdit
}) {
  const replaceData = (rows) =>
    new Promise((resolve) => {
      mutations.current.push(resolve);
      setEdited({ input: incoming, rows: rows.slice() });
    });
  const updateRecord = (key, change) =>
    new Promise((resolve) => {
      mutations.current.push(resolve);
      setEdited((old) => ({
        input: incoming,
        rows: changeRecord(old?.input === incoming ? old.rows : source, key, change, index, childField)
      }));
    });
  const commitEdit = (key, field, value) => {
    const old = canonical.find((record) => recordKey(record[index]) === key),
      previous = valueAt(old, field);
    updateRecord(key, (record) => setField(record, field, value));
    setEditing(null);
    pendingEdit.current = { key, field };
    const answer = props.onCellEdit?.(setField(old, field, value), { field, value, previous, row: old });
    // an answer that comes later (a promise): the new value shows, the cell is busy; a refusal brings the old value back with its message
    if (answer && typeof answer.then === 'function') {
      setCellStatus({ key, field, kind: 'saving' });
      answer.then(
        () => {
          setCellStatus((now) => (now?.key === key && now.field === field ? null : now));
          announce(S.saved);
        },
        (error) => {
          updateRecord(key, (record) => setField(record, field, previous));
          const message = (error && error.message) || S.saveRefused;
          setCellStatus({ key, field, kind: 'refused', message, id: 'plx-data-grid-refusal-' + ++refusals });
          announce(message, { politeness: 'assertive' });
        }
      );
    }
  };
  return { replaceData, updateRecord, commitEdit };
}

export function useEditEffect({ source, mutations, pendingEdit, emit, api }) {
  React.useLayoutEffect(() => {
    mutations.current.splice(0).forEach((resolve) => resolve());
    if (pendingEdit.current) {
      const { key, field } = pendingEdit.current;
      pendingEdit.current = null;
      emit('cellEdit', api.cell(key, field));
    }
  }, [source]);
}

// an editor type the application has not turned on (editing.types) edits as text; one development warning per column and type (ADR 0016)
const TURN_ON = ['select', 'combobox', 'tags', 'date', 'checkbox', 'textarea', 'person'],
  warned = new Set();
export function editorTurnedOn(column, types) {
  const type = column.editor;
  if (typeof type !== 'string' || !TURN_ON.includes(type)) return false;
  if ((types || []).includes(type)) return true;
  const id = type + ':' + column.field;
  if (development() && !warned.has(id)) {
    warned.add(id);
    console.warn(
      '[Plenix] DataGrid: column "' + column.field + '" asks for the ' + type + " editor, but editing.types doesn't turn it on; it edits as text"
    );
  }
  return false;
}
