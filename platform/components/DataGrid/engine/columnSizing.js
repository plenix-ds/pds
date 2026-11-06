/* Plenix · DataGrid engine · column sizing by hand
   Summary: The two ways a person sizes a column other than the keyboard: fit (the width of the widest value, measured in the grid's
     own font, plus the cell's space on both sides) and startResize (the drag: a cover over the page so the pointer is not lost,
     then TanStack's resize handler for the mouse or the touch). Plain functions over the engine's state, not hooks.
   Usage:
     import { columnSizing } from './engine/columnSizing.js';
     const { fit, startResize } = columnSizing({ columns, frame, source, metrics, resize, table, B });
   Props:
     columns, frame (the grid's element ref), source (the records), metrics (the measured cell space), resize (the engine's
       width setter), table (TanStack's) and B (the block class). Returns fit(field) and startResize(event, column).
   Notes:
     Moved out of DataGridEngine.jsx without any change to the code (issue 714, column sizing): the functions were in the engine
     function, in the same place. The engine is documented in DataGridEngine.jsx.
*/
import { kinds } from './helpers.jsx';
import { valueText } from '../cells.jsx';
import { valueAt } from '../state.ts';

export function columnSizing({ columns, frame, source, resize, metrics, table, B }) {
  const fit = (field) => {
    const c = columns.find((c) => c.field === field),
      ctx = document.createElement('canvas').getContext('2d'),
      cs = getComputedStyle(frame.current);
    const data = kinds(c).includes('data');
    ctx.font =
      cs.getPropertyValue('--plx-comp-data-grid-font-size') +
      ' ' +
      cs.getPropertyValue(data ? '--plx-comp-data-grid-data-font-family' : '--plx-comp-data-grid-font-family');
    ctx.wordSpacing = data ? cs.getPropertyValue('--plx-sys-font-data-word-spacing').trim() || '0px' : '0px';
    const values = [c.title || field, ...source.map((r) => valueText(valueAt(r, field)))];
    resize(field, Math.max(...values.map((v) => ctx.measureText(v).width)) + metrics.space * 2);
  };
  const startResize = (event, column) => {
    if (event.type === 'mousedown' && event.button !== 0) return;
    if (event.type === 'mousedown') event.preventDefault();
    event.stopPropagation();
    const head = table.getFlatHeaders().find((h) => h.column.id === column.id);
    const doc = frame.current?.ownerDocument || document,
      cover = doc.createElement('div');
    cover.className = B + '__resize-cover';
    doc.body.appendChild(cover);
    const end = () => {
      cover.remove();
      doc.removeEventListener('mouseup', end);
      doc.removeEventListener('touchend', end);
      doc.removeEventListener('touchcancel', end);
    };
    doc.addEventListener('mouseup', end);
    doc.addEventListener('touchend', end);
    doc.addEventListener('touchcancel', end);
    head?.getResizeHandler(doc)(event);
  };
  return { fit, startResize };
}
