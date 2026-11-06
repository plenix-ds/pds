/* Plenix · GridLines
   Summary: The grid lines behind a chart's marks (07 Data Display › Charts › Grid line): one thin line across the plot
     at each tick of a scale, so values can be read against the value axis. Drawn first, under the marks.
   Usage:
     <GridLines scale={y} inner={inner} />                                   // horizontal lines at the value axis's ticks
     <GridLines scale={x} direction="vertical" inner={inner} ticks={6} />     // vertical lines at a time axis's ticks
   Props:
     scale: the scale whose ticks the lines follow (required)
     direction: "horizontal" (default: lines across, at a vertical scale's ticks) | "vertical" (lines up the plot, at a
       horizontal scale's ticks)
     inner: the plot area's size, { width, height } (ChartFrame's inner) (required)
     ticks: the number of ticks to aim for, or the values (an array): the same as the axis beside them
     className: more classes on the <g>
   Behavior:
     The lines sit at the same positions as the axis's tick labels (the middle of a band on a band scale).
     Hidden from assistive technology with the rest of the plot.
   Notes:
     Lines take the frame's grid line class (plx-chart__grid-line: --plx-comp-chart-grid-line-color and -width); no color is
       written. Use the lines of one direction in most charts: horizontal for columns and lines, vertical for bars.
*/
import React from 'react';
import type { ChartScale, ChartInner, ChartTicks } from '../chart-types.ts';
import { cx } from '../../utils/cx.ts';
import { scalePosition, scaleTicks } from './position.ts';

/** @public */
export type GridLinesProps = {
  scale: ChartScale;
  direction?: 'horizontal' | 'vertical';
  inner: ChartInner;
  ticks?: ChartTicks;
  className?: string;
};
export function GridLines({ scale, direction = 'horizontal', inner, ticks, className }: GridLinesProps) {
  if (!scale || !inner) return null;
  const d = direction === 'vertical' ? 'vertical' : 'horizontal';
  return (
    <g className={cx('plx-chart-grid', 'plx-chart-grid--' + d, className)}>
      {scaleTicks(scale, ticks).map((v: any, i: any) => {
        const p = scalePosition(scale, v);
        if (p === undefined) return null;
        return d === 'horizontal'
          ? <line key={i} className="plx-chart__grid-line" x1={0} x2={inner.width} y1={p} y2={p} />
          : <line key={i} className="plx-chart__grid-line" x1={p} x2={p} y1={0} y2={inner.height} />;
      })}
    </g>
  );
}
