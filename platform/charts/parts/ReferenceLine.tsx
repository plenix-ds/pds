/* Plenix · ReferenceLine
   Summary: A line across a chart at a value that matters (07 Data Display › Charts › Reference line, Threshold): a target,
     an average or last year's figure (reference), or a limit the data should stay under or above (threshold, in the alert
     colors), with its name and value.
   Usage:
     <ReferenceLine scale={y} value={250} inner={inner} label="Target" />
     <ReferenceLine scale={y} value={avg} inner={inner} label="Average" />
     <ReferenceLine kind="threshold" level="critical" scale={y} value={90} inner={inner} label="Limit" format={(v) => v + '%'} />
     <ReferenceLine axis="x" scale={x} value={new Date(2026, 8, 15)} inner={inner} label="Release" />
   Props:
     scale: the scale the value is on (required)
     value: where the line goes (required)
     axis: "y" (default: a horizontal line at a value of the vertical scale) | "x" (a vertical line at a value of the
       horizontal scale: a date, a category)
     inner: the plot area's size, { width, height } (ChartFrame's inner) (required)
     kind: "reference" (default: a dashed line in the subtle content color) | "threshold" (a dashed line in an alert color)
     level: a threshold's color: "warning" (default) | "critical" (the data-viz alert scale)
     label: the line's name ("Target", "Average", "Limit"); shown at the line's end with its value
     showValue: shows the value after the name (default true), from format or the scale's own format (the data font)
     format: (value) => text, instead of the scale's format
     className: more classes on the <g>
   Behavior:
     A horizontal line's label sits above the line at its end; a vertical line's label at the top of the plot, after it.
     A value outside the scale's domain draws nothing. Hidden from assistive technology with the plot: say the reference in
       the chart's description ("The target is 250") and give it a row or a column in the data grid.
   Notes:
     The dash pattern tells a reference from a series (series are solid); a threshold's color is the alert scale's, never
       a series color, and its name says what it is, so color is not the only cue.
*/
import React from 'react';
import type { ChartScale, ChartInner, ChartValue } from '../chart-types.ts';
import { cx } from '../../utils/cx.ts';
import { scalePosition } from './position.ts';

const LEVELS = ['warning', 'critical'];

/** @public */
export type ReferenceLineProps = {
  scale: ChartScale;
  value: ChartValue;
  axis?: 'x' | 'y';
  inner: ChartInner;
  kind?: 'reference' | 'threshold';
  level?: 'warning' | 'critical';
  label?: string;
  showValue?: boolean;
  format?(value: ChartValue): string;
  className?: string;
};
export function ReferenceLine({ scale, value, axis = 'y', inner, kind = 'reference', level = 'warning', label, showValue = true, format, className }: ReferenceLineProps) {
  if (!scale || !inner || value === undefined || value === null) return null;
  const p = scalePosition(scale, value);
  const a = axis === 'x' ? 'x' : 'y';
  const span = a === 'y' ? inner.height : inner.width;
  if (p === undefined || p < -0.5 || p > span + 0.5) return null;
  const k = kind === 'threshold' ? 'threshold' : 'reference';
  const color = k === 'threshold' ? 'alert-' + (LEVELS.indexOf(level) >= 0 ? level : 'warning') : undefined;
  const shown = showValue ? (typeof format === 'function' ? format(value) : typeof scale.format === 'function' ? scale.format(value) : String(value)) : null;
  return (
    <g className={cx('plx-chart-reference', 'plx-chart-reference--' + k, 'plx-chart-reference--' + a, className)}>
      {a === 'y'
        ? <line className="plx-chart-reference__line" data-plx-dataviz={color} x1={0} x2={inner.width} y1={p} y2={p} />
        : <line className="plx-chart-reference__line" data-plx-dataviz={color} x1={p} x2={p} y1={0} y2={inner.height} />}
      {label || shown !== null ? (
        <text className="plx-chart-reference__label" x={a === 'y' ? inner.width : p} y={a === 'y' ? p : 0}>
          {label ? <tspan className="plx-chart-reference__name">{label}</tspan> : null}
          {label && shown !== null ? ' ' : null}
          {shown !== null ? <tspan className="plx-chart-reference__value">{shown}</tspan> : null}
        </text>
      ) : null}
    </g>
  );
}
