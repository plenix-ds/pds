/* Plenix · Metric
   Summary: A key figure: a large number over its label, with an optional change (03 › Data display › Labels and
     indicators › Metric). Metric.Group lays several out in a row, divided. With a trend it adds a sparkline of the recent
     values under the figure; as a card (Metric card) it is a Card titled by its label (07 › Cards and objects › Metric card).
   Usage:
     <Metric.Group label="This week">
       <Metric value="1,284" label="Assets added" />
       <Metric value="92%" label="Tagged" change="+4%" changeTone="success" />
       <Metric value="3" label="Failed imports" change="+2" changeTone="danger" />
     </Metric.Group>
     <Metric card value="1,284" label="Assets added" description="Last 30 days" change="+12%" changeTone="success"
       trend={[38, 41, 40, 44, 47, 45, 52]} trendLabel="Assets added per day" href="#/reports/assets" />
   Props:
     value: the figure, already formatted (a number or a string)
     label: what it counts (the card's title when card)
     unit: a unit after the figure, smaller ("GB", "items")
     change: a change since the last period, already formatted ("+4%", "−12")
     changeTone: "neutral" (default) | "success" | "danger": the change's color (good or bad, not up or down)
     description: one short line under the label (the card's line under its title: the period, "Last 30 days")
     size: "md" (default) | "lg" (the larger figure for a dashboard's first row)
     trend: the recent values, oldest first: a Sparkline under the figure, the width of the metric (library wave 9)
     trendVariant: the sparkline's form: "line" (default) | "area" | "bar"
     trendLabel: what the trend shows ("Assets added per day"), its accessible name with its summary (default the label)
     trendColor: a string: the sparkline's data-viz step (default "categorical-1")
     card: (deprecated: use MetricCard, one anatomy for every metric card) shows the metric as a card (Card): the label is its title, the description its line, the figure and the trend
       its body (default false; Metric card, library wave 9)
     href: with card, makes the card's title a link to the detailed view
     className: more classes on the metric (on the card with card)
     Metric.Group.label: the accessible name of the group (a list of metrics)
     Metric.Group.className: more classes on the group
   Behavior:
     A group is a list (role="list"); each metric is a list item there.
     The trend is one image to assistive technology, read after the figure: its label and a summary of the values ("Up 37%
       from 38 to 52; lowest 38, highest 52."). Use the same period for every trend of a group, and say it (description).
   Notes:
     The figure uses tabular numbers so metrics side by side line up.
     Other props pass through to the element.
     Missing data: show a dash ("–") as the value, never 0.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { dataWhenText } from '../../utils/dataText.tsx';
import { Card } from '../Card/Card.tsx';
import { Sparkline } from '../../charts/Sparkline.jsx';

type MetricProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
  /** the figure */
  value?: React.ReactNode;
  label?: React.ReactNode;
  unit?: React.ReactNode;
  /** the change, such as "+4%" */
  change?: React.ReactNode;
  /** "neutral" (default) | "positive" | "negative" */
  changeTone?: string;
  description?: React.ReactNode;
  /** "md" (default) | "lg" */
  size?: 'md' | 'lg';
  /** the numbers of a small trend chart */
  trend?: number[];
  /** "line" (default) | "area" | "bar" */
  trendVariant?: 'line' | 'area' | 'bar';
  trendLabel?: string;
  trendColor?: string;
  /** draws the metric as a Card */
  card?: boolean;
  /** with card: the card's link */
  href?: string;
};
export function Metric({ value, label, unit, change, changeTone = 'neutral', description, size = 'md', trend, trendVariant = 'line', trendLabel, trendColor,
  card = false, href, className, ...rest }: MetricProps) {
  devWarn('Metric', { size }, { size: ['md','lg'] });
  const figure = (
    <div className="plx-metric__figure">
      <span className="plx-metric__value">{value}</span>
      {unit ? <span className="plx-metric__unit">{unit}</span> : null}
      {change ? <span className={cx('plx-metric__change', 'plx-metric__change--' + changeTone)}>{change}</span> : null}
    </div>
  );
  const spark = trend && trend.length ? (
    <div className="plx-metric__trend">
      {/* @ts-expect-error Sparkline is still JavaScript (charts are converted in wave 2), so its optional props read as required */}
      <Sparkline values={trend} variant={trendVariant} size="fill" showLast={trendVariant !== 'bar'} color={trendColor} label={trendLabel || (typeof label === 'string' ? label : undefined)} />
    </div>
  ) : null;
  if (card) {
    return (
      <Card title={label} meta={description} href={href} className={cx('plx-metric--card', className)} {...rest}>
        <div className={cx('plx-metric', 'plx-metric--' + size)}>
          {figure}
          {spark}
        </div>
      </Card>
    );
  }
  return (
    <div className={cx('plx-metric', 'plx-metric--' + size, className)} {...rest}>
      {figure}
      <div className="plx-metric__label">{label}</div>
      {description ? <div className="plx-metric__description">{dataWhenText(description)}</div> : null}
      {spark}
    </div>
  );
}

Metric.Group = function MetricGroup({ label, className, children, ...rest }: React.HTMLAttributes<HTMLElement> & { label?: string }) {
  return (
    <div className={cx('plx-metric-group', className)} role="list" aria-label={label} {...rest}>
      {React.Children.map(children, (c) => (c ? <div role="listitem" className="plx-metric-group__item">{c}</div> : null))}
    </div>
  );
};
