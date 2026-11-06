/* Plenix · Axis
   Summary: A chart's axis (07 Data Display › Charts › Axis): the axis line and the tick labels of one scale on one side
     of the plot, and an optional axis title, drawn inside ChartFrame. Tick labels are technical values: the data font.
   Usage:
     <ChartFrame title="Uploads per month" margin={{ bottom: 44, start: 56 }} table={…}>
       {({ inner, margin }) => {
         const x = scaleBand({ domain: months, range: [0, inner.width] }), y = scaleLinear({ domain: [0, 310], range: [inner.height, 0], nice: true });
         return <g><Axis scale={y} orient="left" inner={inner} margin={margin} label="Uploads" />…<Axis scale={x} orient="bottom" inner={inner} margin={margin} /></g>;
       }}
     </ChartFrame>
   Props:
     scale: the axis's scale (scaleLinear, scaleLog, scaleBand or scaleTime from platform/charts/scales.js) (required)
     orient: the side of the plot: "bottom" (default) | "left" | "right" | "top"
     inner: the plot area's size, { width, height } (ChartFrame's inner) (required)
     margin: the frame's margins, { top, end, bottom, start } (ChartFrame's margin); the axis title sits at their edge
     ticks: the number of ticks to aim for (the scale's own count by default), or the values to label (an array)
     format: (value) => label, instead of the scale's own format (the reader's locale, the tick step's decimals)
     label: the axis title (what is measured, with its unit: "Uploads", "Size (MB)"); give the frame margin room for it
     line: draws the axis line (default true for bottom and top, false for left and right, where grid lines carry it)
     className: more classes on the <g>
   Behavior:
     Each tick label sits at its value (the middle of a band on a band scale), at the --plx-comp-chart-axis-tick-offset
       distance from the plot: under it (bottom), above it (top), ending before it (left) or starting after it (right).
     The axis title is centered along the axis at the margin's edge; on the left and right it reads along the axis.
     Hidden from assistive technology with the rest of the plot: the chart's data grid carries the values.
   Notes:
     No color, size or font is written: the axis line and tick labels take the frame's classes (plx-chart__axis-line,
       plx-chart__tick-label), the offset and the title their tokens (chart-parts.css).
*/
import React from 'react';
import type { ChartScale, ChartInner, ChartMargin, ChartTicks, ChartValue } from '../chart-types.ts';
import { cx } from '../../utils/cx.ts';
import { scalePosition, scaleTicks, scaleLabel } from './position.ts';

const ORIENTS = ['bottom', 'left', 'right', 'top'];
const NO_MARGIN = { top: 0, end: 0, bottom: 0, start: 0 };

/** @public */
export type AxisProps = {
  scale: ChartScale;
  orient?: 'bottom' | 'left' | 'right' | 'top';
  inner: ChartInner;
  margin?: ChartMargin;
  ticks?: ChartTicks;
  format?(value: ChartValue): string;
  label?: string;
  line?: boolean;
  className?: string;
};
export function Axis({ scale, orient = 'bottom', inner, margin, ticks, format, label, line, className }: AxisProps) {
  if (!scale || !inner) return null;
  const o = ORIENTS.indexOf(orient) >= 0 ? orient : 'bottom';
  const m = Object.assign({}, NO_MARGIN, margin);
  const across = o === 'bottom' || o === 'top';
  const showLine = line === undefined ? across : !!line;
  const edge = o === 'bottom' ? inner.height : o === 'right' ? inner.width : 0;
  const values = scaleTicks(scale, ticks);
  const axisLine = !showLine ? null : across
    ? <line className="plx-chart__axis-line" x1={0} x2={inner.width} y1={edge} y2={edge} />
    : <line className="plx-chart__axis-line" x1={edge} x2={edge} y1={0} y2={inner.height} />;
  const title = !label ? null
    : o === 'bottom' ? <text className="plx-chart-axis__label" x={inner.width / 2} y={inner.height + m.bottom}>{label}</text>
      : o === 'top' ? <text className="plx-chart-axis__label" x={inner.width / 2} y={-m.top}>{label}</text>
        : o === 'left' ? <text className="plx-chart-axis__label" transform={'translate(' + -m.start + ',' + inner.height / 2 + ') rotate(-90)'}>{label}</text>
          : <text className="plx-chart-axis__label" transform={'translate(' + (inner.width + m.end) + ',' + inner.height / 2 + ') rotate(90)'}>{label}</text>;
  return (
    <g className={cx('plx-chart-axis', 'plx-chart-axis--' + o, className)}>
      {axisLine}
      {values.map((v: any, i: any) => {
        const p = scalePosition(scale, v);
        if (p === undefined) return null;
        return (
          <text key={i} className="plx-chart__tick-label plx-chart-axis__tick" x={across ? p : edge} y={across ? edge : p}>
            {scaleLabel(scale, v, ticks, format)}
          </text>
        );
      })}
      {title}
    </g>
  );
}
