/* Plenix · DataGrid actions (internal and DataGrid.useActions)
   Summary: Complete an explicit row or selection action, then offer its captured inverse through useUndo.
   Usage: const actions = DataGrid.useActions([{label:'Delete',onSelect:remove,undo:restore}], selected);
   Props: actions: row-menu or CommandBar descriptors; selection: optional array of record keys; strings: undo,
     actionDone, actionFailed, undoFailed. Handler arguments reach undo unchanged, followed by the action result.
   Behavior: Only success offers Undo; pending repeats are blocked. Captured selection and row values do not change
     when the caller selects another record. Failed undo offers another attempt.
   Notes: The selection hook needs the app ToastProvider. DataGrid supplies a local provider for standalone row menus.
*/
import React from 'react';
import { useUndo, useToast } from '../Toast/Toast.tsx';
export function useDataGridActions(actions: any, selection: any, strings: any) {
  const undoable = useUndo(),
    toast = useToast(),
    pending = React.useRef(new Set()),
    t = {
      undo: 'Undo',
      actionDone: '{action} completed',
      actionFailed: 'The action failed. Try again.',
      undoFailed: 'Could not undo the action. Try again.',
      ...strings
    };
  const wrap = (action: any) => {
    if (!action || action.separator || typeof action.undo !== 'function') return action;
    const invoke = async (...given: any[]) => {
      const id = action.id || action.label;
      if (pending.current.has(id)) return;
      pending.current.add(id);
      const args = selection !== undefined ? [selection.slice()] : given.map((value, i) => i === 0 && value && typeof value === 'object' ? {
        ...value
      } : value);
      let result;
      try {
        const run = action.onSelect || action.action;
        if (typeof run !== 'function') return;
        result = await run(...args);
      } catch (e) {
        toast.show(t.actionFailed, {
          tone: 'danger'
        });
        return;
      } finally {
        pending.current.delete(id);
      }
      let restoring = false;
      const rollback = async () => {
        if (restoring) return;
        restoring = true;
        try {
          await action.undo(...args, result);
        } catch (e) {
          undoable(t.undoFailed, {
            label: t.undo,
            onUndo: rollback,
            tone: 'danger'
          });
        } finally {
          restoring = false;
        }
      };
      undoable(action.message || t.actionDone.replace('{action}', action.label || ''), {
        label: t.undo,
        onUndo: rollback,
        onCommit: typeof action.commit === 'function' ? () => action.commit(...args, result) : undefined
      });
      return result;
    };
    return {
      ...action,
      onSelect: invoke,
      action: invoke
    };
  };
  return typeof actions === 'function' ? (...args: any[]) => (actions(...args) || []).map(wrap) : Array.isArray(actions) ? actions.map(wrap) : actions;
}
