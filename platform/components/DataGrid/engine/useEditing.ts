/* Plenix · DataGrid engine · editing
   Summary: The grid's cell editing: the edited copy of the rows (so an edit shows at once and a new list from the caller
     replaces it), the cell being edited, committing an edit (the record changes, onCellEdit tells the caller, the cellEdit
     event follows once the rows have drawn), and replacing or changing records through the adapter (replaceData, updateRecord).
   Usage:
     import { useEditedRows, editActions, useEditEffect } from './engine/useEditing.ts';
     const { setEdited, editing, setEditing, mutations, pendingEdit, source } = useEditedRows(incoming);
     const { replaceData, updateRecord, commitEdit } = editActions({ incoming, source, canonical, index, childField, props, setEdited, setEditing, mutations, pendingEdit });
     useEditEffect({ source, mutations, pendingEdit, emit, api });
   Props:
     useEditedRows(incoming): incoming, the rows the caller (or the server) gave; returns the rows to draw (source), the cell
       being edited ({ key, field, value } or null) with setEditing, setEdited, and the refs mutations (promises waiting for the
       rows to draw) and pendingEdit (the committed cell whose event is still to be emitted).
     editActions: returns replaceData(rows), updateRecord(key, change) (both return a promise that resolves when the rows have
       drawn) and commitEdit(key, field, value), which calls props.onCellEdit(record, { field, value, previous, row, source }) and remembers the
       step when editing.undo is on; undo() and redo() walk the steps (ADR 0021), each cell reaching onCellEdit with source 'undo' or 'redo'.
     useEditEffect: after the rows draw, resolves the waiting promises and emits cellEdit for the committed cell.
   Notes:
     Moved out of DataGridEngine.tsx without any change to the code (issue 714, the editing concern): the parts were lines of
     the engine function, in the same order with the same values. The editor itself is CellEditor (engine/parts.jsx). The engine
     is documented in DataGridEngine.tsx.
*/
import React from 'react';
import { recordKey, valueAt } from '../state.ts';
import { setField, changeRecord } from '../records.ts';
import { announce } from '../../../utils/announce.tsx';
import { development } from '../../../utils/devWarn.ts';

/** one cell a step changed: the value before and after */
export type EditedCell = { key: any; field: any; before: any; after: any };
/** the undo and redo steps of a grid, newest last; a step is the cells one user action changed */
/** a step; `record` marks a saved row form that went through onRecordEdit, so its undo and redo do too */
export type EditStep = EditedCell[] & { record?: true };
export type EditHistory = { undo: EditStep[]; redo: EditStep[] };
/** where a cell change came from; the change the caller hears (onCellEdit) names it */
export type ChangeSource = 'edit' | 'paste' | 'fill' | 'undo' | 'redo';
const HISTORY_STEPS = 100;

let refusals = 0;   // the refusal message's id, so the cell can name it (aria-describedby)

export function useEditedRows(incoming: any) {
  const pendingEdit = React.useRef<any>(null),
    mutations = React.useRef([]);
  const [edited, setEdited] = React.useState<any>(null),
    [editing, setEditing] = React.useState<any>(null),
    // a cell whose save is waiting for the caller ({ key, field, kind: 'saving' }) or was refused ({ …, kind: 'refused', message })
    [cellStatus, setCellStatus] = React.useState<any>(null);
  // the undo and redo steps (editing.undo, ADR 0021): each step is the cells one user action changed
  const history = React.useRef<EditHistory>({ undo: [], redo: [] });
  const source = edited?.input === incoming ? edited.rows : incoming;
  return { setEdited, editing, setEditing, cellStatus, setCellStatus, mutations, pendingEdit, history, source };
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
  pendingEdit,
  history
}: any) {
  const replaceData = (rows: any) =>
    new Promise((resolve) => {
      mutations.current.push(resolve);
      setEdited({ input: incoming, rows: rows.slice() });
    });
  const updateRecord = (key: any, change: any) =>
    new Promise((resolve) => {
      mutations.current.push(resolve);
      setEdited((old: any) => ({
        input: incoming,
        rows: changeRecord(old?.input === incoming ? old.rows : source, key, change, index, childField)
      }));
    });
  // one cell's change: the record changes, the caller hears it once (with its source), and an answer that comes later or refuses is handled
  // here; it returns the cell as { key, field, before, after }, and the promise the caller answered with (or undefined)
  const applyCell = (key: any, field: any, value: any, changeSource: ChangeSource, refused?: () => void) => {
    const old = canonical.find((record: any) => recordKey(record[index]) === key),
      previous = valueAt(old, field);
    updateRecord(key, (record: any) => setField(record, field, value));
    setEditing(null);
    pendingEdit.current = { key, field };
    const answer = props.onCellEdit?.(setField(old, field, value), { field, value, previous, row: old, source: changeSource });
    // an answer that comes later (a promise): the new value shows, the cell is busy; a refusal brings the old value back with its message
    if (answer && typeof answer.then === 'function') {
      setCellStatus({ key, field, kind: 'saving' });
      answer.then(
        () => {
          setCellStatus((now: any) => (now?.key === key && now.field === field ? null : now));
          announce(S.saved);
        },
        (error: any) => {
          updateRecord(key, (record: any) => setField(record, field, previous));
          const message = (error && error.message) || S.saveRefused;
          setCellStatus({ key, field, kind: 'refused', message, id: 'plx-data-grid-refusal-' + ++refusals });
          announce(message, { politeness: 'assertive' });
          if (refused) refused();
        }
      );
    }
    return { cell: { key, field, before: previous, after: value } as EditedCell, answer };
  };
  const undoOn = () => !!props.editing?.undo;
  const remember = (cells: EditStep) => {
    if (!undoOn() || !cells.length) return;
    history.current.undo.push(cells);
    if (history.current.undo.length > HISTORY_STEPS) history.current.undo.shift();
    history.current.redo = [];
  };
  const commitEdit = (key: any, field: any, value: any) => {
    remember([applyCell(key, field, value, 'edit').cell]);
  };
  // Ctrl+Z and Ctrl+Y: one step each. A step whose cells no longer hold what it left (the data was replaced from outside) ends the history.
  const walk = (from: EditStep[], to: EditStep[], back: boolean) => {
    if (!undoOn()) return false;
    const step = from.pop();
    if (!step) return false;
    const now = (cell: EditedCell) => valueAt(canonical.find((record: any) => recordKey(record[index]) === cell.key), cell.field);
    if (step.some((cell) => now(cell) !== (back ? cell.after : cell.before))) {
      history.current = { undo: [], redo: [] };
      return false;
    }
    to.push(step);
    // a refused step goes back where it came from, so it can be tried again
    const refused = () => { const at = to.lastIndexOf(step); if (at >= 0) to.splice(at, 1); from.push(step); };
    if (step.record && props.onRecordEdit) {
      // a saved row form: the undo and the redo use the save's own path, onRecordEdit(record, changes, { source }) (ADR 0021 addendum)
      const key = step[0].key, changes: Record<string, any> = {};
      for (const cell of step) changes[cell.field] = back ? cell.before : cell.after;
      const old = canonical.find((record: any) => recordKey(record[index]) === key), was: Record<string, any> = {};
      for (const field of Object.keys(changes)) was[field] = valueAt(old, field);
      const put = (values: Record<string, any>) => updateRecord(key, (record: any) => Object.keys(values).reduce((r, field) => setField(r, field, values[field]), record));
      put(changes);
      const answer = props.onRecordEdit(old, changes, { source: back ? 'undo' : 'redo' });
      if (answer && typeof answer.then === 'function') {
        answer.then(null, (error: any) => {
          put(was);
          const message = (error && error.message) || S.saveRefused;
          announce(message, { politeness: 'assertive' });
          refused();
        });
      }
    } else step.forEach((cell) => applyCell(cell.key, cell.field, back ? cell.before : cell.after, back ? 'undo' : 'redo', refused));
    announce(back ? S.undone : S.redone);
    return true;
  };
  // several cells at once (a paste or a fill): each reaches onCellEdit once, with its source, and the cells are one undo step. The promise
  // resolves, once every answer has come, with how many the caller refused; those cells have their old value back and leave the step.
  const changeCells = (cells: { key: any; field: any; value: any }[], changeSource: ChangeSource) => {
    const made = cells.map((c) => applyCell(c.key, c.field, c.value, changeSource));
    const step = made.map((m) => m.cell);
    remember(step);
    const rejected: EditedCell[] = [];
    return Promise.all(made.map((m) => (m.answer && typeof m.answer.then === 'function' ? m.answer.then(() => null, () => { rejected.push(m.cell); }) : null))).then(() => {
      for (const cell of rejected) { const at = step.indexOf(cell); if (at >= 0) step.splice(at, 1); }
      if (!step.length) for (const list of [history.current.undo, history.current.redo]) { const at = list.indexOf(step); if (at >= 0) list.splice(at, 1); }
      return rejected.length;
    });
  };
  // a saved row form (Form Edit): one step for the whole record. Without onRecordEdit the changed fields go through onCellEdit, one call each;
  // with it the application saved the record itself, so the step is only remembered (an undo then reaches onCellEdit, one call per field)
  const commitCells = (key: any, changes: Record<string, any>) => changeCells(Object.entries(changes).map(([field, value]) => ({ key, field, value })), 'edit');
  const recordEdited = (key: any, changes: Record<string, any>) => {
    const old = canonical.find((record: any) => recordKey(record[index]) === key);
    const step: EditStep = Object.entries(changes).map(([field, after]) => ({ key, field, before: valueAt(old, field), after }));
    step.record = true;
    remember(step);
  };
  const undo = () => walk(history.current.undo, history.current.redo, true);
  const redo = () => walk(history.current.redo, history.current.undo, false);
  return { replaceData, updateRecord, commitEdit, changeCells, commitCells, recordEdited, undo, redo };
}

export function useEditEffect({ source, mutations, pendingEdit, emit, api }: any) {
  React.useLayoutEffect(() => {
    mutations.current.splice(0).forEach((resolve: any) => resolve());
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
export function editorTurnedOn(column: any, types: any) {
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
