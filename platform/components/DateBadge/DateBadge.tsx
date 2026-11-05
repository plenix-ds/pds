/* Plenix · DateBadge
   Summary: A day shown as its number and weekday, with today marked (02 › Inputs › Date and time › Calendar).
   Usage:
     <DateBadge day={6} weekday="Tue" today />
     <DateBadge day={7} weekday="Wed" dateTime="2026-10-07" />
   Props:
     day: the day of the month
     weekday: the short weekday name, shown above the number
     today: marks today: the number on the action color (default false)
     dateTime: the date, machine-readable (wraps the badge in <time>)
     className: more classes on the badge
   Behavior:
     Today carries "Today" for assistive technology as well as its look.
   Notes:
     The time grid's day headers and the month view's day cells use it.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';

export type DateBadgeProps = React.HTMLAttributes<HTMLElement> & {
  /** the day of the month */
  day: number | string;
  /** the short weekday name, shown above the number */
  weekday?: string;
  /** marks today: the number on the action color */
  today?: boolean;
  /** the date, machine-readable (wraps the badge in <time>) */
  dateTime?: string;
};
export function DateBadge({ day, weekday, today = false, dateTime, className, ...rest }: DateBadgeProps) {
  const t = useStrings('dateBadge') as { today: string };
  const Tag = dateTime ? 'time' : 'span';
  return (
    <Tag className={cx('plx-date-badge', today && 'is-today', className)} dateTime={dateTime} {...rest}>
      {weekday ? <span className="plx-date-badge__weekday">{weekday}</span> : null}
      <span className="plx-date-badge__day">{day}</span>
      {today ? <VisuallyHidden>{t.today}</VisuallyHidden> : null}
    </Tag>
  );
}
