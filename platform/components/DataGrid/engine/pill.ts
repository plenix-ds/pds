/* Plenix · DataGrid engine · a pill's text measured as the page draws it
   Summary: Measures a pill's text the way the page draws it, with a hidden probe pill, so the grid can size a column's
     pills.
   Usage:
     import { pillFont, pillSheet } from './engine/pill.ts';
     const { scale, font, wordSpacing } = pillFont(gridElement, ctx, data);
     const { rules, flush } = pillSheet(document);
   Props:
     pillFont(at, ctx, data): at, an element inside the grid; ctx, a canvas 2D context (left set to the pill's font);
       data, true for a data pill; returns { scale, font, wordSpacing }, scale being the page's width over the canvas's
     pillSheet(doc): the one constructed sheet per document that holds the uniform pill widths; returns { rules, flush }
   Notes:
     Moved out of DataGridEngine.tsx without any change to the code (issue 688). The engine is documented in DataGridEngine.tsx.
*/

// a pill's text measured as the page draws it: a hidden probe pill (md, data or not) inside the grid gives its font, size,
// weight and word spacing, and the ratio between the page's width of a sample and the canvas's (the mono font's
// size-adjust and fitted spaces are not the canvas's); the canvas is left set to that font
const PROBE = '0123456789 ABCDEFGHIJ abcdefghij';

export function pillFont(at: any, ctx: any, data: any) {
  const doc = at.ownerDocument,
    box = doc.createElement('span'),
    pill = doc.createElement('span'),
    value = doc.createElement('span');
  box.className = 'plx-visually-hidden';
  pill.className = 'plx-data-pill plx-data-pill--md' + (data ? ' plx-data-pill--data' : '');
  value.className = 'plx-data-pill__value';
  value.textContent = PROBE;
  pill.appendChild(value);
  box.appendChild(pill);
  (at.querySelector('.plx-data-grid__grid-row .plx-data-grid__grid-cell') || at).appendChild(box); // in a body cell: the cell's own text size
  const cs = getComputedStyle(value),
    page = value.scrollWidth;
  ctx.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
  ctx.wordSpacing = cs.wordSpacing || '0px';
  const canvas = ctx.measureText(PROBE).width;
  box.remove();
  return { scale: canvas ? page / canvas : 1, font: ctx.font, wordSpacing: ctx.wordSpacing };
}

// uniform pill widths: the widths live in one constructed sheet per document, one entry per grid
export function pillSheet(doc: any) {
  if (doc.__plxPillWidths) return doc.__plxPillWidths;
  const sheet = new doc.defaultView.CSSStyleSheet(),
    rules = new Map();
  doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
  return (doc.__plxPillWidths = { rules, flush: () => sheet.replaceSync([...rules.values()].join('\n')) });
}
