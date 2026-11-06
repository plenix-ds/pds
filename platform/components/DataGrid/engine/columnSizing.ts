/* Plenix · DataGrid engine · column sizing by hand
   Summary: The two ways a person sizes a column other than the keyboard: fit (the width of the widest value, measured in the grid's
     own font, plus the cell's space on both sides) and startResize (the drag: a cover over the page so the pointer is not lost,
     then TanStack's resize handler for the mouse or the touch). Plain functions over the engine's state, not hooks.
   Usage:
     import { columnSizing } from './engine/columnSizing.ts';
     const { fit, startResize } = columnSizing({ columns, frame, source, metrics, resize, table, B });
   Props:
     columns, frame (the grid's element ref), source (the records), metrics (the measured cell space), resize (the engine's
       width setter), table (TanStack's) and B (the block class). Returns fit(field) and startResize(event, column).
   Notes:
     Moved out of DataGridEngine.tsx without any change to the code (issue 714, column sizing): the functions were in the engine
     function, in the same place. The engine is documented in DataGridEngine.tsx.
*/
import type React from 'react';
import { kinds } from './helpers.tsx';
import { valueText } from '../cells.tsx';
import { valueAt } from '../state.ts';
import type { Table, Column } from '@tanstack/react-table';
import type { GridColumn, DataRecord } from '../types.ts';

type SizingState = { columns: GridColumn[]; frame: { current: HTMLElement | null }; source: DataRecord[]; resize: (field: string, width: number) => void; metrics: { space: number }; table: Table<DataRecord>; B: string };

// (#815) the width a rendered element needs to show what it draws, in full: the extent of its text and icons (a Range reports a text's whole length even where the
// box clips it with an ellipsis) plus the trailing padding, border and margin of each box around the leaf, and the element's own padding on both sides. Start edge
// to the far edge of the last leaf, mirrored in a right-to-left grid. `only` limits the leaves (the header: its title text)
function extent(el: Element, only?: Element | null): { need: number; text: number } {
  const doc = el.ownerDocument, win = doc.defaultView as Window, cs = win.getComputedStyle(el), rtl = cs.direction === 'rtl';
  const box = el.getBoundingClientRect(), px = (v: string) => parseFloat(v) || 0;
  const padStart = px(rtl ? cs.paddingRight : cs.paddingLeft), padEnd = px(rtl ? cs.paddingLeft : cs.paddingRight);
  const origin = rtl ? box.right - padStart : box.left + padStart;
  let far = origin, text = 0;
  const walker = doc.createTreeWalker(only || el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let node = walker.currentNode as Node | null; node; node = walker.nextNode()) {
    let rect: DOMRect | null = null, leaf: Element | null = null;
    if (node.nodeType === Node.TEXT_NODE) {
      if (!(node.textContent || '').trim()) continue;
      const range = doc.createRange(); range.selectNodeContents(node); rect = range.getBoundingClientRect(); leaf = node.parentElement;
      text = Math.max(text, rect.width);
    } else {
      const e = node as Element, tag = e.tagName.toLowerCase();
      if (tag !== 'svg' && tag !== 'img' && tag !== 'input') continue;
      rect = e.getBoundingClientRect(); leaf = e;
    }
    if (!rect || (!rect.width && !rect.height) || !leaf) continue;
    // the room each box around the leaf keeps after it (padding, border and margin at the far side), up to the element
    let chrome = 0;
    for (let a: Element | null = leaf.nodeType === 1 && (leaf.tagName.toLowerCase() === 'svg' || leaf.tagName.toLowerCase() === 'img' || leaf.tagName.toLowerCase() === 'input') ? leaf : leaf; a && a !== el; a = a.parentElement) {
      const ac = win.getComputedStyle(a);
      chrome += px(rtl ? ac.paddingLeft : ac.paddingRight) + px(rtl ? ac.borderLeftWidth : ac.borderRightWidth) + (a === leaf ? 0 : px(rtl ? ac.marginLeft : ac.marginRight));
    }
    const edge = rtl ? rect.left - chrome : rect.right + chrome;
    far = rtl ? Math.min(far, edge) : Math.max(far, edge);
  }
  return { need: Math.abs(far - origin) + padStart + padEnd, text };
}

let lastTap = { id: '', at: 0 };   // the last touch on a resize handle, for the double tap
export function columnSizing({ columns, frame, source, resize, metrics, table, B }: SizingState) {
  // fit (#815): the column becomes as wide as its header and its widest drawn cell need. The cells in view are measured from the DOM (pills, people, icons and formatters
  // count); the records the grid has not drawn (a long list, a virtual window) are measured by the canvas on their text plus the chrome the drawn cells showed
  const fit = (field: string) => {
    const at = frame.current as HTMLElement | null, c = columns.find((c) => c.field === field);
    if (!at || !c) return;
    const esc = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(field) : field;
    let width = 0, chrome = 0, drawn = 0;
    at.querySelectorAll('[role="gridcell"][data-plx-field="' + esc + '"]').forEach((cell) => {
      const { need, text } = extent(cell); width = Math.max(width, need); chrome = Math.max(chrome, need - text); drawn += 1;
    });
    const heads = Array.from(at.querySelectorAll('[role="columnheader"]')), head = heads.find((h) => h.getAttribute('data-plx-field') === field) || heads[table.getVisibleLeafColumns().findIndex((x) => x.id === field) + (at.querySelector('[role="columnheader"] input[type=checkbox]') ? 1 : 0)];
    if (head) { const title = head.querySelector('.plx-data-grid__title-text'); if (title) width = Math.max(width, extent(head, title).need); }
    if (drawn < source.length) {
      const ctx = document.createElement('canvas').getContext('2d'), cs = getComputedStyle(at), data = kinds(c).includes('data') || ['number', 'currency', 'date', 'bytes'].includes(c.type as string);
      if (ctx) {
        ctx.font = cs.getPropertyValue('--plx-comp-data-grid-font-size') + ' ' + cs.getPropertyValue(data ? '--plx-comp-data-grid-data-font-family' : '--plx-comp-data-grid-font-family');
        ctx.wordSpacing = data ? cs.getPropertyValue('--plx-sys-font-data-word-spacing').trim() || '0px' : '0px';
        // only the longest texts can be the widest: measure a bounded number of them
        const texts = source.map((r) => valueText(valueAt(r, field))).sort((a, b) => b.length - a.length).slice(0, 24);
        width = Math.max(width, ...texts.map((t) => ctx.measureText(t).width + chrome));
      }
    }
    if (width > 0) resize(field, Math.ceil(width));
  };
  const startResize = (event: React.MouseEvent | React.TouchEvent, column: Column<DataRecord>) => {
    if (event.type === 'mousedown' && (event as React.MouseEvent).button !== 0) return;
    // the second press of a double-click (or a double tap) fits the column instead of starting a drag: the drag's cover over the page takes the pointer, so the
    // handle never saw the 'dblclick' event (#815)
    if (event.type === 'mousedown' && (event as React.MouseEvent).detail >= 2) { event.preventDefault(); event.stopPropagation(); fit(column.id); return; }
    if (event.type === 'touchstart') { const now = Date.now(); if (lastTap.id === column.id && now - lastTap.at < 350) { lastTap = { id: '', at: 0 }; event.stopPropagation(); fit(column.id); return; } lastTap = { id: column.id, at: now }; }
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
