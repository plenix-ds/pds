/* Plenix · chart kit (platform/charts/chart-kit.js): the small helpers the charts of library wave 9, lane B share
   (BarChart, ComboChart, PieChart, BulletChart, BoxPlot, RadarChart, SankeyDiagram, TimelineChart). Internal: not public.
   Summary: The mark under the pointer (useChartHover: the minimal pointer interaction that shows a ChartTooltip), the room
     an axis's labels need beside the plot (labelRoom), and the series' colors and legend items.
   Usage:
     const [active, hover] = useChartHover();
     <rect {...hover('2:1')} … />   {active === '2:1' ? <ChartTooltip … /> : null}
     const margin = { start: labelRoom(categories) };
   Props:
     useChartHover(): [active, hover, setActive]; hover(key) returns the pointer handlers of one mark (enter shows it,
       leave hides it)
     labelRoom(texts, extra?): the pixels a column of tick labels takes (their longest text in the data font, the tick
       offset and a gap), plus extra (an axis title's room); snapped to the 4px grid by ChartFrame
     halfRoom(text): the room after the plot for a tick label centered on the plot's end (the last tick of a value axis
       along the bottom)
     withColors(series): the series with an id and a data-viz step each (seriesColor by their order in the data)
     legendItems(series, value?): the ChartLegend items of the series; value(s, i) adds a figure after a name
   Behavior:
     Pointer only: keyboard and screen reader people read the values in the chart's data grid ("Show the data"). The
       chart interaction foundation (wave 9, lane A) replaces useChartHover with the keyboard, the pointer and a live
       region in one hook.
   Notes:
     The label room is an estimate from the number of characters (the data font is monospaced: about 7px a character at
       the tick labels' 11px); a margin given to the chart always wins. */
import React from 'react';
import { seriesColor } from './scales.ts';

// px: about one character of the data font at the tick labels' size (Reddit Mono 11px is 6.6px wide)
const CHAR = 7;
// px: the tick offset (8px, --plx-comp-chart-axis-tick-offset) and a 4px gap before the frame's edge
const TICK_ROOM = 12;

export function useChartHover() {
  const [active, setActive] = React.useState<any>(null);
  const hover = (key: any) => ({
    onPointerEnter: () => setActive(key),
    onPointerLeave: () => setActive((a: any) => (a === key ? null : a))
  });
  return [active, hover, setActive];
}

export function labelRoom(texts: any, extra = 0) {
  const longest = (texts || []).reduce((n: any, s: any) => Math.max(n, String(s === undefined || s === null ? '' : s).length), 0);
  return Math.ceil((longest * CHAR + TICK_ROOM + extra) / 4) * 4;
}

// the room after the plot that a tick label centered on its end needs (half its text and a gap; at least the 8px default)
export function halfRoom(text: any) {
  return Math.max(8, Math.ceil((String(text === undefined || text === null ? '' : text).length * CHAR / 2 + 4) / 4) * 4);
}

export function withColors(series: any) {
  return (series || []).map((s: any, i: any) => Object.assign({}, s, { id: s.id === undefined ? String(i) : s.id, color: s.color || seriesColor(i) }));
}

export function legendItems(series: any, value?: any) {
  return (series || []).map((s: any, i: any) => ({ id: s.id, label: s.label, color: s.color, value: value ? value(s, i) : undefined }));
}

export function finite(v: any) { const n = Number(v); return isFinite(n) ? n : 0; }
