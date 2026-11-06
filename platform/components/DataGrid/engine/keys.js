/* Plenix · DataGrid engine · keyboard and focus
   Summary: The grid's keyboard paths and the cell focus they use: sorting a column with Enter or Space, resizing a column
     with the arrow keys, Home and End, a group row (Enter, Space, the arrows), a record row (Enter chooses and opens it,
     Arrow Down and Up move to the next row), a cell (Ctrl or Command with C copies; Enter edits; the arrows move across
     cells, mirrored in right to left), and the table body (Arrow Down enters the first cell).
   Usage:
     import { rowKeys, cellKeys, makeFocusCell } from './engine/keys.js';
     const focusCell = makeFocusCell({ model, ordered, virtualized, virtual, displayElements });
     <div role="row" onKeyDown={rowKeys({ chooseRow, row, emit, rowApi, props, record, on, unread, setOwnOpen, focusCell, model })} />
   Props:
     Each export takes one object of what the handler reads from the engine and returns the handler (or, for makeFocusCell,
     the function focusCell(rowIndex, columnIndex, step) that scrolls a cell into view and focuses it):
     headerKeys({ column }); resizeKeys({ resize, c, column }); groupKeys({ toggleGroup, group, model, virtual, holder, B });
     rowKeys({ chooseRow, row, emit, rowApi, props, record, on, unread, setOwnOpen, focusCell, model });
     cellKeys({ isStatic, value, canEdit, setEditing, row, c, model, ordered, column, frame, focusCell, cellRange, kept });
     tableKeys({ focusCell, first }).
     The card list (issue 809): makeFocusCell's cards (the long card list's virtualizer) scrolls a card into view, which draws
       it, and focuses it once drawn; rowKeys and cellKeys take cardList: End (or Ctrl or Command with End) on a card goes to
       the last card.
   Notes:
     Moved out of DataGridEngine.jsx without any change to the handlers' code (issue 714, the keyboard concern): each handler
     was an inline function of the engine's markup; it is the same function text, built from the same names, at the same place.
     The engine is documented in DataGridEngine.jsx.
*/
import { stepSize } from '../../../utils/sizeSteps.js';
import { valueText } from '../cells.jsx';
import { isRtl } from '../../../utils/direction.ts';

export const headerKeys =
  ({ column }) =>
  (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
      e.preventDefault();
      column.toggleSorting();
    }
  };

export const resizeKeys =
  ({ resize, c, column }) =>
  (e) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      resize(
        c.field,
        e.key === 'Home'
          ? column.columnDef.minSize
          : e.key === 'End'
            ? column.columnDef.maxSize
            : stepSize(
                column.getSize(),
                e.key === 'ArrowRight' ? 1 : -1,
                column.columnDef.minSize,
                column.columnDef.maxSize
              )
      );
    }
  };

export const makeFocusCell =
  ({ model, ordered, virtualized, virtual, displayElements, cards }) =>
  (rowIndex, columnIndex, step = 1) => {
    while (model[rowIndex] && !model[rowIndex].original) rowIndex += step;
    const record = model[rowIndex],
      column = ordered[columnIndex];
    if (!record || (columnIndex !== null && !column)) return;
    if (virtualized) virtual.scrollToIndex(rowIndex, { align: 'auto' });
    // the long card list (issue 809): scroll the card into view (it is drawn there), then focus it once it is drawn
    if (cards) cards.scrollToIndex(rowIndex, { align: 'auto' });
    const target = () => {
      const node = displayElements.current.get(record.displayKey || record.id);
      return columnIndex === null ? node : node?.querySelector('[data-plx-field="' + CSS.escape(column.id) + '"]');
    };
    let tries = cards ? 20 : 1;
    const settle = () => {
      const node = target();
      if (node || --tries <= 0) node?.focus({ preventScroll: true });
      else requestAnimationFrame(settle);
    };
    requestAnimationFrame(() => requestAnimationFrame(settle));
  };

export const groupKeys =
  ({ toggleGroup, group, model, virtual, holder, B }) =>
  (event) => {
    if (event.target !== event.currentTarget) return;
    if (['Enter', ' ', 'ArrowRight', 'ArrowLeft'].includes(event.key)) {
      event.preventDefault();
      toggleGroup(group.id, event.key === 'ArrowRight' ? true : event.key === 'ArrowLeft' ? false : undefined);
    } else if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      const headers = model.filter((row) => row.__group),
        next = headers[headers.findIndex((row) => row.id === group.id) + (event.key === 'ArrowDown' ? 1 : -1)];
      if (next) {
        virtual.scrollToIndex(model.indexOf(next), { align: 'center' });
        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            holder.current
              ?.querySelector('.' + B + '__grid-group[data-plx-group="' + CSS.escape(next.id) + '"]')
              ?.focus({ preventScroll: true })
          )
        );
      }
    }
  };

export const rowKeys =
  ({ chooseRow, row, emit, rowApi, props, record, on, unread, setOwnOpen, focusCell, model, cardList }) =>
  (e) => {
    // the card list (issue 809): End on a card, or Ctrl (Command) with End, draws every card and focuses the last
    if (cardList && e.key === 'End' && !e.defaultPrevented && (e.target === e.currentTarget || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      focusCell(model.length - 1, null, -1);
      return;
    }
    if (
      e.key === 'Enter' &&
      !e.defaultPrevented &&
      (e.target === e.currentTarget || e.target.getAttribute('role') === 'gridcell')
    ) {
      e.preventDefault();
      chooseRow(row, e);
      emit('rowClick', e, rowApi);
      props.onRowClick?.(record, e);
      if (props.onRowClick || on.rowClick) {
        unread.open(record);
        setOwnOpen(row.id);
      }
    }
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && e.target === e.currentTarget) {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      focusCell(model.indexOf(row) + step, null, step);
    }
  };

export const cellKeys =
  ({ isStatic, value, canEdit, enterEdits, typeToReplace, toggle, setEditing, row, c, model, ordered, column, frame, focusCell, cellRange, kept, cardList }) =>
  (event) => {
    if (isStatic || event.target !== event.currentTarget) return;
    // a checkbox cell (the option editing.types): Space toggles it and saves at once (ADR 0016)
    if (toggle && event.key === ' ' && !event.ctrlKey && !event.altKey && !event.metaKey) {
      event.preventDefault();
      toggle();
      return;
    }
    // the card list (issue 809): End (or Ctrl or Command with End) on a card's cell draws every card and focuses the last card's
    // cell in this column (a card is a row, so End goes to the last row, as in a list)
    if (cardList && event.key === 'End' && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      focusCell(model.length - 1, ordered.indexOf(column), -1);
      return;
    }
    // cell range selection (the option cellSelection, issue 465): Shift with an arrow, Home or End extends the block from the cell that has
    // focus; Escape collapses it; Ctrl or Command with C copies it. Home and End are not used by the grid's cells otherwise (the resize edge
    // keeps its own), so Shift with them is free. Without the option cellRange does nothing and the keys below are as they were.
    if (cellRange && cellRange.enabled) {
      const plain = !event.ctrlKey && !event.metaKey && !event.altKey;
      if (event.shiftKey && plain && ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        cellRange.extend({ row, c, key: event.key, rtl: isRtl(frame.current), focusCell });
        return;
      }
      if (event.key === 'Escape' && cellRange.rect) { event.preventDefault(); event.stopPropagation(); cellRange.collapse(); return; }
      if (!event.shiftKey && !event.altKey && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c' && cellRange.rect && !document.getSelection()?.toString()) {
        event.preventDefault();
        cellRange.copy();
        return;
      }
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
      if (document.getSelection()?.toString()) return;
      event.preventDefault();
      navigator.clipboard.writeText(valueText(value));
      return;
    }
    if (event.key === 'Enter' && canEdit && enterEdits !== false) {
      event.preventDefault();
      if (cellRange) cellRange.collapse();
      setEditing({ key: row.id, field: c.field, value });
      return;
    }
    // F2 starts editing with the value kept; a printable character starts it with that character in place of the value (issue 737, the APG grid pattern).
    // Neither in a cell that cannot be edited, nor during IME composition, nor with Ctrl, Alt or Meta held (a shortcut). Space keeps choosing the row;
    // a number column takes only a character a number has.
    if (canEdit && !event.ctrlKey && !event.altKey && !event.metaKey && !event.nativeEvent?.isComposing && event.keyCode !== 229) {
      const typed = typeToReplace !== false && event.key.length === 1 && event.key !== ' ' && (c.editor !== 'number' || /[0-9.\-]/.test(event.key));
      if (event.key === 'F2' || typed) {
        event.preventDefault();
        if (cellRange) cellRange.collapse();
        setEditing({ key: row.id, field: c.field, value: typed ? event.key : value });
        return;
      }
    }
    const index = model.indexOf(row),
      at = ordered.indexOf(column),
      keys = {
        ArrowDown: [index + 1, at],
        ArrowUp: [index - 1, at],
        ArrowLeft: [index, at + (isRtl(frame.current) ? 1 : -1)],
        ArrowRight: [index, at + (isRtl(frame.current) ? -1 : 1)]
      };
    if (kept && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      // a row template's card draws only some columns (issue 839): the arrow goes to the next drawn cell, and stays on the last one at the end
      const step = keys[event.key][1] - at;
      let to = at + step;
      while (ordered[to] && !kept.has(ordered[to].id)) to += step;
      keys[event.key] = [index, ordered[to] ? to : at];
    }
    if (keys[event.key]) {
      event.preventDefault();
      if (cellRange) cellRange.collapse();   // a plain arrow moves cell by cell and ends the block
      focusCell(...keys[event.key], event.key === 'ArrowUp' ? -1 : 1);
    }
  };

export const tableKeys =
  ({ focusCell, first }) =>
  (event) => {
    if (event.target === event.currentTarget && event.key === 'ArrowDown') {
      event.preventDefault();
      focusCell(first, 0);
    }
  };
