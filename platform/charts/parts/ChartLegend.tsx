/* Plenix · ChartLegend
   Summary: The key of a chart's series (07 Data Display › Charts › Chart legend): each series' color swatch and name,
     and its value when it helps; above the plot, beside it, or under it, and, interactive, a toggle per series that shows
     or hides it.
   Usage:
     const series = [{ id: 'web', label: 'Web' }, { id: 'ios', label: 'iOS' }, { id: 'android', label: 'Android' }]
       .map((s, i) => ({ ...s, color: seriesColor(i) }));
     <ChartFrame title="Sign-ups by platform" legend={<ChartLegend items={series} />} …>…</ChartFrame>
     <ChartFrame … legendPosition="end" legend={<ChartLegend items={series} orientation="vertical" />}>…</ChartFrame>
     <ChartLegend items={series} interactive hidden={off} onToggle={(id, visible) => …} />
   Props:
     items: the series, in the chart's order: [{ id, label, color, value }]; color is the series' data-viz step
       ("categorical-1", seriesColor(i)); value is an optional figure after the name (a total, a share), the data font
     orientation: "horizontal" (default: items in a row that wraps, above or under the plot) | "vertical" (one per line,
       beside the plot)
     shape: the swatch: "square" (default: bars, areas, slices) | "line" (line series)
     interactive: each item is a toggle button that shows or hides its series (default false)
     hidden: the ids of the hidden series, when the parent controls them; defaultHidden: the first ones, otherwise
     onToggle(id, visible): runs when a series is shown or hidden; the chart draws only the visible ones
     label: the legend's accessible name (default strings.legend)
     strings: the words it says, for other languages: { legend: "Legend" }
     className: more classes on the legend
   Behavior:
     The legend is real text next to the plot (not inside the image), so assistive technology reads the series names.
     Interactive: each toggle has aria-pressed (pressed = shown); Tab moves between them, Enter or Space toggles. A hidden
       series keeps its place with a hollow swatch (a line swatch in the disabled color) and a muted name, so it can
       be shown again. The last series shown cannot
       be hidden: its toggle does nothing.
     Names wrap rather than being cut; a vertical legend keeps its width to the longest name.
   Notes:
     Colors come from the data-viz scales through data-plx-dataviz (no color is written). Color is never the only cue: the
       names are always shown; on a line chart label the lines directly when there is room.
*/
import React from 'react';
import type { ChartLegendItem } from '../chart-types.ts';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

/** @public */
export type ChartLegendProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  items?: ChartLegendItem[];
  orientation?: 'horizontal' | 'vertical';
  shape?: 'square' | 'line';
  interactive?: boolean;
  /** the ids of the hidden series, when the parent controls them */
  hidden?: Array<string | number>;
  defaultHidden?: Array<string | number>;
  onToggle?(id: string | number, visible: boolean): void;
  label?: string;
  strings?: { legend?: string };
  className?: string;
};
export function ChartLegend({ items = [], orientation = 'horizontal', shape = 'square', interactive = false, hidden, defaultHidden = [],
  onToggle, label, strings, className, ...rest }: ChartLegendProps) {
  const t = useStrings('chart.chartLegend', strings) as { legend: string };
  const [own, setOwn] = React.useState(defaultHidden);
  const off = hidden === undefined ? own : hidden;
  const o = orientation === 'vertical' ? 'vertical' : 'horizontal';
  const s = shape === 'line' ? 'line' : 'square';
  const toggle = (id: string | number) => {
    const visible = off.indexOf(id) >= 0;
    // the last series shown stays shown: a chart never goes empty from its legend
    if (!visible && items.length - off.length <= 1) return;
    if (hidden === undefined) setOwn(visible ? off.filter((x: any) => x !== id) : off.concat([id]));
    if (onToggle) onToggle(id, visible);
  };
  return (
    <div className={cx('plx-chart-legend', 'plx-chart-legend--' + o, interactive && 'plx-chart-legend--interactive', className)} {...rest}>
      <ul className="plx-chart-legend__list" aria-label={label || t.legend}>
        {items.map((it, i) => {
          const id = it.id === undefined ? i : it.id;
          const shown = off.indexOf(id) < 0;
          const inside = (
            <React.Fragment>
              <span className={cx('plx-chart-legend__swatch', 'plx-chart-legend__swatch--' + s)} data-plx-dataviz={it.color || undefined} aria-hidden="true" />
              <span className="plx-chart-legend__label">{it.label}</span>
              {it.value !== undefined && it.value !== null ? <span className="plx-chart-legend__value">{it.value}</span> : null}
            </React.Fragment>
          );
          return (
            <li key={id} className="plx-chart-legend__item">
              {interactive
                ? <button type="button" className="plx-chart-legend__toggle" aria-pressed={shown} onClick={() => toggle(id)}>{inside}</button>
                : <span className="plx-chart-legend__entry">{inside}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
