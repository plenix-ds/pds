/* Plenix · DataGrid engine · uniform pill widths
   Summary: In a grid that shows its values as pills (cells="pill"), every standard pill of a column is as wide as the column's widest
     pill in the current view (the filtered, sorted page, every row of it, not only the rows drawn), so scrolling a long list never
     changes it. The widest is measured like the column widths (the pill's font, weight, sides, border and icon), snapped up to the
     grid; the rule goes in a stylesheet the grid owns (one per document, a rule per grid) and leaves with the grid. Measured again
     when the web fonts are ready.
   Usage:
     import { usePillWidths } from './engine/usePillWidths.ts';
     const { gridKey } = usePillWidths({ frame, cells, columns, allRows, metrics, showTypes });
   Props:
     frame (the grid's element ref), cells ('pill' turns it on), columns, allRows (the rows in view), metrics (the measured cell
       space and row height) and showTypes. Returns gridKey, the id the grid's pill rule is under (data-plx-grid-key).
   Notes:
     Moved out of DataGridEngine.tsx without any change to the code (issue 714, the pill widths): the effects were in the engine function, in the
     same order between the same neighbors. The engine is documented in DataGridEngine.tsx.
*/
import React from 'react';
import { pillSheet, pillFont } from '../engine/pill.ts';
import { tokenPixels } from '../environment.ts';
import { gridStep, snapToGrid } from '../../../utils/grid.ts';
import { kinds, typeOf } from './helpers.tsx';
import { valueAt } from '../state.ts';
import { valueText } from '../cells.tsx';
import { formatBytes, formatDate, parseDate } from '../../../utils/format.ts';
import type { GridColumn } from '../types.ts';

type PillRow = { original?: Record<string, unknown> };

export function usePillWidths({ frame, cells, metrics, columns, allRows, showTypes }: { frame: { current: HTMLElement | null }; cells: string; metrics: { row?: number; space?: number }; columns: GridColumn[]; allRows: PillRow[]; showTypes?: boolean }) {
  // uniform pill widths (CTM, 2026-10-22; always on, owner uniform-pills-always-35): every standard pill of a column as wide as the
  // column's widest pill in the current view (the filtered, sorted page, every row of it, not only the rows drawn), so scrolling
  // a long list never changes it. The uniformPillWidths prop is accepted and ignored (deprecated).
  // Measured like the column widths (the pill's font, weight, sides, border and icon), snapped up to the grid, the text centered in it so the leftover splits between the two sides (#649).
  const gridKey = React.useId(),
    [fontsReady, setFontsReady] = React.useState(0);
  React.useEffect(() => {
    const fonts = frame.current?.ownerDocument.fonts as FontFaceSet | undefined;
    if (fonts && fonts.ready) fonts.ready.then(() => setFontsReady((n) => n + 1));
    // a face the page loads lazily (first use) may arrive after 'ready' resolved: measure again when it has (#815)
    const again = () => setFontsReady((n) => n + 1);
    fonts?.addEventListener?.('loadingdone', again);
    return () => fonts?.removeEventListener?.('loadingdone', again);
  }, []);
  React.useLayoutEffect(() => {
    const at = frame.current;
    if (!at || typeof CSSStyleSheet === 'undefined' || !at.ownerDocument.defaultView) return undefined; // a closed document (its frame removed): nothing to measure
    const store = pillSheet(at.ownerDocument);
    if (cells !== 'pill' || !metrics.row) {
      if (store.rules.delete(gridKey)) store.flush();
      return undefined;
    }
    const ctx = at.ownerDocument.createElement('canvas').getContext('2d') as CanvasRenderingContext2D,
      faces = { data: pillFont(at, ctx, true), text: pillFont(at, ctx, false) },
      px = (name: string) => tokenPixels(name, at),
      step = gridStep(at);
    const sides =
        px('--plx-comp-data-pill-md-padding-inline-start') +
        px('--plx-comp-data-pill-md-padding-inline-end') +
        2 * px('--plx-comp-data-pill-border-width'),
      glyph = px('--plx-comp-data-pill-icon-size') + px('--plx-comp-data-pill-gap');
    const key = CSS.escape(gridKey),
      rules: string[] = [];
    columns.forEach((c) => {
      const k = kinds(c);
      if (
        c.render ||
        c.pill === false ||
        k.includes('tags') ||
        k.includes('badge') ||
        k.includes('deleted') ||
        k.includes('icon')
      )
        return;
      const data = k.includes('data') || ['number', 'currency', 'date', 'bytes'].includes(c.type as string);
      const face = faces[data ? 'data' : 'text'],
        scale = face.scale;
      ctx.font = face.font;
      ctx.wordSpacing = face.wordSpacing;
      let widest = 0;
      allRows.forEach((r) => {
        if (!r.original) return;
        const v = valueAt(r.original, c.field);
        if (v == null || v === '') return;
        // the text the pill draws (cells.tsx): a size as "4.1 kB", a date as its short form, never the raw number or timestamp
        const text = c.type === 'bytes' && Number.isFinite(Number(v)) ? formatBytes(Number(v)) : c.type === 'date' && parseDate(v) ? formatDate(v as any) : valueText(v);
        widest = Math.max(widest, ctx.measureText(text).width * scale);
      });
      if (!widest) return;
      const icon = c.type === 'person' || k.includes('avatar-name') || (showTypes && typeOf(c) !== 'text');
      rules.push(
        '[data-plx-grid-key="' +
          key +
          '"] .plx-data-pill[data-plx-pill-field="' +
          CSS.escape(c.field) +
          '"]{inline-size:' +
          snapToGrid(widest + sides + (icon ? glyph : 0), { round: 'up', step }) +
          'px;justify-content:center;}'
      );
    });
    store.rules.set(gridKey, rules.join('\n'));
    store.flush();
    return undefined;
  }, [cells, columns, allRows, metrics.row, metrics.space, showTypes, fontsReady]);
  React.useEffect(
    () => () => {
      const doc = (frame.current?.ownerDocument || (typeof document !== 'undefined' ? document : null)) as (Document & { __plxPillWidths?: { rules: Map<string, string>; flush: () => void } }) | null;
      if (doc && doc.__plxPillWidths && doc.__plxPillWidths.rules.delete(gridKey)) doc.__plxPillWidths.flush();
    },
    []
  );
  return { gridKey };
}
