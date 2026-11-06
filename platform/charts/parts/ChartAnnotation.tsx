/* Plenix · ChartAnnotation
   Summary: A note written on a chart (07 Data Display › Charts › Annotation): a ring on one data point with a short
     leader line to its note (point), or a shaded span of the plot with its name (range), to explain a spike, a release or
     a period.
   Usage:
     <ChartAnnotation x={x(peak.date)} y={y(peak.value)} inner={inner} label="Launch day" />
     <ChartAnnotation x={x(peak.date)} y={y(peak.value)} inner={inner} label="Outage" placement="bottom" />
     <ChartAnnotation kind="range" x={x(sale.start)} x2={x(sale.end)} inner={inner} label="Holiday sale" />
   Props:
     x: the point's position across the plot, or the start of the range, in plot pixels (required)
     y: the point's position down the plot (point)
     x2: the end of the range (range)
     inner: the plot area's size, { width, height } (ChartFrame's inner) (required)
     kind: "point" (default) | "range"
     label: the note: a few words, sentence case (required)
     placement: where a point's note goes: "top" (default: above the point) | "bottom" (under it)
     className: more classes on the <g>
   Behavior:
     A point note sits at the end of a leader line 24px above (or under) the ring; a range is shaded down the whole plot,
       behind the marks (draw it before them), its name at its top start.
     Hidden from assistive technology with the plot: put the same note in the chart's description or the data grid.
   Notes:
     One or two notes per chart; more becomes noise. No color is written: the ring, the leader, the shade and the note take
       the chart-parts tokens (existing roles: content colors and the sunken surface).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import type { PlotSize } from '../scales.ts';

/** @public the prop type (ADR 0011) */
export type ChartAnnotationProps = {
  x?: number | null;
  y?: number | null;
  x2?: number;
  inner?: PlotSize;
  kind?: 'point' | 'range';
  label?: React.ReactNode;
  placement?: 'top' | 'bottom';
  className?: string;
};

// SVG geometry, in pixels on the 4px grid: the ring's radius and the leader line's length
const RING = 6, LEADER = 24;

export function ChartAnnotation({ x, y, x2, inner, kind = 'point', label, placement = 'top', className }: ChartAnnotationProps) {
  if (x === undefined || x === null || !inner) return null;
  if (kind === 'range') {
    const a = Math.min(x, x2 === undefined ? x : x2), b = Math.max(x, x2 === undefined ? x : x2);
    return (
      <g className={cx('plx-chart-annotation', 'plx-chart-annotation--range', className)}>
        <rect className="plx-chart-annotation__band" x={a} y={0} width={Math.max(0, b - a)} height={inner.height} />
        {label ? <text className="plx-chart-annotation__label" x={a} y={0}>{label}</text> : null}
      </g>
    );
  }
  if (y === undefined || y === null) return null;
  const down = placement === 'bottom';
  const end = down ? y + LEADER : y - LEADER;
  return (
    <g className={cx('plx-chart-annotation', 'plx-chart-annotation--point', 'plx-chart-annotation--' + (down ? 'bottom' : 'top'), className)}>
      <line className="plx-chart-annotation__leader" x1={x} x2={x} y1={down ? y + RING : y - RING} y2={end} />
      <circle className="plx-chart-annotation__ring" cx={x} cy={y} r={RING} />
      {label ? <text className="plx-chart-annotation__label" x={x} y={end}>{label}</text> : null}
    </g>
  );
}
