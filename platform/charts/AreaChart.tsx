/* Plenix · AreaChart
   Summary: An area chart (07 Data Display › Charts › Area chart): a line chart whose lines are filled down to the zero
     baseline, to show a volume over time; stacked, the series pile up so the top edge is their total; percent, each
     column adds up to 100% and the areas show the shares. Built on LineChart's engine: the same axes, data grid,
     interaction (one Tab stop, crosshair, shared tooltip, live region, legend toggles, zoom) and props.
   Usage:
     <AreaChart title="Storage by file type" description="Video takes most of the growth." data={weeks} x="week"
       series={[{ id: 'video', label: 'Video' }, { id: 'images', label: 'Images' }]} stack="stacked" yLabel="Storage (GB)" />
     <AreaChart title="Share of traffic by platform" data={rows} x="month" series={platforms} stack="percent" />
     <AreaChart title="Active users" data={days} x="date" series={[{ id: 'users', label: 'Users' }]} />
   Props:
     Every LineChart prop (title, description, data, x, series, xType, curve, step, points, yDomain, format, formatX,
       xLabel, yLabel, size, margin, legend, legendPosition, interactive, zoom, onSelect, overlay, strings, className);
       the value axis always starts at zero
     stack: "none" (default: each area from zero, see-through where they overlap: one or two series) | "stacked" (each
       series on top of the one before it; the top edge is the total) | "percent" (stacked to 100%: the shares; the axis
       and the tooltip in percent, the tooltip with the value too)
   Behavior:
     As LineChart: ← → move the crosshair, ↑ ↓ the series, every move is said in the live region; hidden series leave
       the stack, and the rest close up (percent: the shares of the series shown).
     A missing value is a gap when not stacked; in a stack it counts as zero, so the stack stays closed.
   Notes:
     The fill is the series' data-viz color at --plx-comp-area-chart-fill-opacity (see-through, overlapping) or
       --plx-comp-area-chart-stacked-fill-opacity (stacked); the line on top is the frame's line. Put the most stable
       series at the bottom of a stack (first in series). More than two overlapping areas: a line chart.
*/
import React from 'react';
import { SeriesChart } from './LineChart.tsx';
import type { AreaChartProps } from './LineChart.tsx';

const STACKS = ['none', 'stacked', 'percent'];

export function AreaChart({ stack = 'none', ...props }: AreaChartProps) {
  return <SeriesChart {...props} kind="area" zero stack={STACKS.indexOf(stack) >= 0 ? stack : 'none'} />;
}
