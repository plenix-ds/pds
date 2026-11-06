/* Plenix · ChartTooltip
   Summary: The values at one point of a chart (07 Data Display › Charts › Chart tooltip), shown where the pointer or the
     keyboard is: one point's value (single), or every series' value at one x position with a crosshair line (shared).
     Drawn inside ChartFrame's plot, beside the point, on the side with room.
   Usage:
     {active ? <ChartTooltip x={x(active.date)} y={y(active.value)} inner={inner} title={formatDate(active.date)} titleKind="data"
       items={[{ label: 'Downloads', value: formatNumber(active.value), color: seriesColor(0) }]} /> : null}
     <ChartTooltip variant="shared" x={x('Mar')} inner={inner} title="March"
       items={series.map((s, i) => ({ label: s.label, value: formatNumber(s.values[2]), color: seriesColor(i) }))} />
   Props:
     x: the point's position across the plot, in pixels (scalePosition(xScale, value)) (required)
     y: the point's position down the plot (single; shared tooltips sit at the top of the plot)
     inner: the plot area's size, { width, height } (ChartFrame's inner) (required)
     variant: "single" (default: one point; the tooltip sits above it, or under it near the top) | "shared" (every series
       at one x: a crosshair line down the plot and the tooltip at its top)
     title: the point's heading: its category, date or time
     titleKind: "text" (default: a name, the UI font) | "data" (a date, a time or a number: the data font)
     items: the values: [{ label, value, color }]; label the series' name, value the formatted value (the data font), color
       the series' data-viz step (seriesColor(i)); an item without a color has no swatch (a value that is not a
       series: a running total, a count); one item for single
     className: more classes on the tooltip
   Behavior:
     It does not take the pointer (pointer-events none), so moving along the chart keeps reaching the marks under it.
     The tooltip goes after the point when it is in the first half of the plot and before it in the second half, so it
       stays inside the chart.
     It shows values already in the chart's data grid; with the plot it is hidden from assistive technology. The chart
       interaction (useChartInteraction, platform/charts/interaction.js) moves it with the pointer and the arrow keys and
       says the same values in the live region: chartTooltipText({ title, items }) is that sentence ("March 2026: Web
       150, iOS 130, Android 90"), so the tooltip and the announcement never differ.
     chartTooltipText({ title, items }): the tooltip's content as one plain sentence, for the live region
   Notes:
     Drawn in an SVG foreignObject at the point (geometry only); the surface is the popover's (overlay surface, border,
       menu radius and shadow), from the chart-parts tokens. Swatches take the series' data-viz color.
*/
import React from 'react';
import type { ChartInner, ChartTooltipItem } from '../chart-types.ts';
import { cx } from '../../utils/cx.ts';

// the room the tooltip may take beside its point, in pixels (SVG geometry): it is laid out inside this box
const BOX_W = 240, BOX_H = 200;

// the tooltip as one sentence: the title, then each series' name and value (what the live region says)
export function chartTooltipText({ title, items = [] }: { title?: React.ReactNode; items?: ChartTooltipItem[] } = {}): string {
  const values = items.map((it) => [it.label, it.value].filter((x) => x !== undefined && x !== null && x !== '').join(' ')).join(', ');
  return title !== undefined && title !== null && title !== '' ? String(title) + (values ? ': ' + values : '') : values;
}

/** @public */
export type ChartTooltipProps = {
  x: number;
  y?: number;
  inner: ChartInner;
  variant?: 'single' | 'shared';
  title?: React.ReactNode;
  titleKind?: 'text' | 'data';
  items?: ChartTooltipItem[];
  className?: string;
};
export function ChartTooltip({ x, y, inner, variant = 'single', title, titleKind = 'text', items = [], className }: ChartTooltipProps) {
  if (x === undefined || x === null || !inner) return null;
  const v = variant === 'shared' ? 'shared' : 'single';
  const side = x > inner.width / 2 ? 'start' : 'end';
  const py = v === 'shared' || y === undefined || y === null ? 0 : y;
  const vert = v === 'shared' ? 'below' : py < BOX_H / 2 ? 'below' : 'above';
  const fx = side === 'end' ? x : x - BOX_W;
  const fy = vert === 'below' ? py : py - BOX_H;
  return (
    <g className={cx('plx-chart-tooltip-layer', 'plx-chart-tooltip-layer--' + v)}>
      {v === 'shared' ? <line className="plx-chart-tooltip__crosshair" x1={x} x2={x} y1={0} y2={inner.height} /> : null}
      <foreignObject className="plx-chart-tooltip__room" x={fx} y={fy} width={BOX_W} height={BOX_H}>
        <div className={cx('plx-chart-tooltip__place', 'plx-chart-tooltip__place--' + side, 'plx-chart-tooltip__place--' + vert)}>
          <div className={cx('plx-chart-tooltip', 'plx-chart-tooltip--' + v, className)}>
            {title !== undefined && title !== null ? <div className={cx('plx-chart-tooltip__title', titleKind === 'data' && 'plx-chart-tooltip__title--data')}>{title}</div> : null}
            <ul className="plx-chart-tooltip__list">
              {items.map((it, i) => (
                <li key={i} className="plx-chart-tooltip__item">
                  {it.color ? <span className="plx-chart-tooltip__swatch" data-plx-dataviz={it.color} /> : null}
                  <span className="plx-chart-tooltip__label">{it.label}</span>
                  <span className="plx-chart-tooltip__value">{it.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </foreignObject>
    </g>
  );
}
