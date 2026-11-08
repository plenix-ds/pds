/* Plenix · DataGridEngine lines (ADR 0043): columns[].lines, the N-line cell.
   Summary: linesOf(column) is the column's line count clamped to 1 to 4 (0: the column has none), with a development warning outside that range;
     stepFor(maxLines, frame) is the smallest row-height step whose record row fits that many lines, measured from the row-height and line-height tokens.
   Usage: Internal to DataGridEngine and bodyRows. */
import { development } from '../../../utils/devWarn.ts';
import { tokenPixels } from '../environment.ts';

export const STEPS = ['short', 'medium', 'tall', 'extra-tall'];
const warned = new Set<string>();
export function linesOf(column: any): number {
  if (column == null || column.lines == null) return 0;
  const n = Math.round(Number(column.lines)), k = Math.min(4, Math.max(1, isNaN(n) ? 1 : n));
  if (k !== n && development() && typeof console !== 'undefined') {
    const message = '[Plenix] DataGrid: columns[].lines takes a whole number from 1 to 4 (column "' + column.field + '" has ' + column.lines + '), so ' + k + ' is used.';
    if (!warned.has(message)) { warned.add(message); console.warn(message); }
  }
  return k;
}
// the lines a record row of this step holds: its height less the cell padding, over the line height (all from the grid's tokens, at its density)
const capacity = (step: string, frame: Element) => {
  const line = tokenPixels('--plx-comp-data-grid-text-line-height', frame), short = tokenPixels('--plx-sys-data-grid-row-height', frame);
  const height = step === 'short' ? short : tokenPixels('--plx-comp-data-grid-row-height-' + step, frame);
  return line ? Math.floor((height - (short - line)) / line) : 1;
};
export function stepFor(maxLines: number, frame: Element | null): string {
  if (!frame || maxLines < 2) return 'short';
  return STEPS.find((step) => capacity(step, frame) >= maxLines) || 'extra-tall';
}
