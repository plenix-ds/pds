/* Plenix · DataLabel
   Summary: A value written on a chart beside its mark (07 Data Display › Charts › Data label): above a column, after the
     end of a bar, or centered on a point or a slice with a halo in the surface color, in the data font.
   Usage:
     {months.map((m) => <DataLabel key={m.name} x={scalePosition(x, m.name)} y={y(m.value)} value={m.value} />)}
     <DataLabel x={x(bar.value)} y={scalePosition(y, bar.name)} value={bar.value} position="end" />
     <DataLabel x={cx} y={cy} value="42%" position="center" />
   Props:
     x, y: the mark's anchor in plot pixels: the top middle of a column, the end middle of a bar, a point's center (required)
     value: the value: a number is formatted in the reader's locale (formatNumber); a string is shown as it is (already
       formatted: "42%", "1.2 MB")
     format: (value) => text, instead of formatNumber
     position: "top" (default: above the anchor, centered: columns) | "end" (after the anchor, centered on it: bars) |
       "center" (on the anchor, with a halo: points, slices, inside a large mark)
     className: more classes on the <text>
   Behavior:
     The label sits --plx-comp-chart-data-label-offset from its anchor (top, end), or on it (center); the halo is a stroke
       in the surface color painted under the text, so it stays readable over a mark or a line.
     Hidden from assistive technology with the rest of the plot: the data grid carries the values.
   Notes:
     Label the marks people compare, not every mark: a few labeled values (the last, the highest) read better than a full
       set. Values are technical: the data font; no color is written (the label's tokens).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { formatNumber } from '../../utils/format.ts';

const POSITIONS = ['top', 'end', 'center'] as const;
/** @public the prop type (ADR 0011) */
export type DataLabelProps = {
  x?: number | null;
  y?: number | null;
  value?: number | string;
  format?: (value: number | string | undefined) => string;
  position?: (typeof POSITIONS)[number];
  className?: string;
};

export function DataLabel({ x, y, value, format, position = 'top', className }: DataLabelProps) {
  if (x === undefined || y === undefined || x === null || y === null) return null;
  const p: (typeof POSITIONS)[number] = POSITIONS.indexOf(position) >= 0 ? position : 'top';
  const text = typeof format === 'function' ? format(value) : typeof value === 'number' ? formatNumber(value) : value;
  return <text className={cx('plx-chart-data-label', 'plx-chart-data-label--' + p, className)} x={x} y={y}>{text}</text>;
}
