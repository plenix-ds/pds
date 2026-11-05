/* Plenix · Time
   Summary: A date or a time as a technical value: a timestamp, a relative time ("5 minutes ago"), a date label ("Today",
     "Yesterday", "Oct 8"), a date or a time alone, in the reader's locale and in Reddit Mono, on a <time> element with the
     machine-readable value (03 Content › Metadata › Timestamp, Relative time, Date label).
   Usage:
     <Time value={asset.modified} />                                  Oct 8, 2026, 2:05 PM
     <Time value={comment.created} format="relative" />               5 minutes ago (updates by itself)
     <Time value={task.due} format="label" />                         Today · Yesterday · Oct 8
     <Time value={invoice.date} format="date" dateStyle="long" />     October 8, 2026
     <Time value={log.at} format="time" seconds />                    2:05:33 PM
   Props:
     value: the moment: a Date, an ISO 8601 string or milliseconds since 1970
     format: "datetime" (default; the date and the time) | "relative" | "label" | "date" | "time"
     dateStyle: the date's length, as formatDate: "short" | "medium" (default) | "long" | "full" (datetime and date)
     seconds: shows the seconds (time; only when order within a minute matters) (default false)
     timeZone: an IANA zone ("Europe/Lisbon") to show the moment in; default the reader's
     timeZoneName: "short" names the zone after the time ("2:05 PM PST") (datetime and time)
     tooltip: the full date and time with its zone in a tooltip, on hover and keyboard focus; default true for relative and
       label, false otherwise
     live: updates the text as time passes, every --plx-comp-time-refresh-interval (default true for relative and label)
     now: the moment "now" is measured from (relative and label; for tests and previews)
     strings: the words it shows, for other languages: { now: "Just now" }
     locale: the language it is written in (default the page's language)
     className: more classes on the <time>
   Behavior:
     Under a minute a relative time reads "Just now"; after 7 days (the Formats standard) it becomes the date.
     A date label names the calendar day: "Today", "Yesterday" and "Tomorrow", else the short date (the year only when it
       is not this year).
     With the tooltip the <time> is a Tab stop, so keyboard users can reach the full value; the tooltip describes it.
     The live text changes in place without moving the layout and is never announced (it is not a live region).
     A value that is not a valid date renders nothing.
   Notes:
     The words and the order come from utils/format.ts (Intl): never build a date by hand.
     The <time> carries dateTime: the ISO 8601 moment, or the calendar day ("2026-10-08") for date and label.
     It is set in the data font (Reddit Mono) at the size and line height of the text around it.
     Other props pass through to the <time>.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { formatDate, formatTime, formatDateTime, formatRelative, formatLocale, numeralLocale, dateTimeAttr, parseDate } from '../../utils/format.ts';
import { tokenMs } from '../../utils/tokenTime.ts';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';

const FORMATS = ['datetime', 'relative', 'label', 'date', 'time'];
// the shared parser: a date-only value is that calendar day where the reader is, never midnight UTC (issue 342)
type Dated = string | number | Date | null | undefined;
const toDate = (v: Dated) => (v === undefined || v === null || v === '' ? null : parseDate(v));
const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const pad = (n: number) => (n < 10 ? '0' : '') + n;
const calendarDay = (d: Date) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

// "Today", "Yesterday", "Tomorrow" (Intl, numeric auto), else the short date
function dayLabel(d: Date, now: Date, o: { locale?: string; timeZone?: string }) {
  const days = Math.round((dayStart(d) - dayStart(now)) / 86400000);
  if (Math.abs(days) > 1) return formatDate(d, { dateStyle: 'short', timeZone: o.timeZone, locale: o.locale });
  const lang = numeralLocale(o.locale || formatLocale());
  const w = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }).format(days, 'day');
  return w.charAt(0).toLocaleUpperCase(lang) + w.slice(1);
}

type TimeFormat = 'datetime' | 'relative' | 'label' | 'date' | 'time';
export type TimeProps = Omit<React.TimeHTMLAttributes<HTMLTimeElement>, 'children'> & {
  /** the moment: a Date, an ISO string, a date-only string or a number */
  value?: Dated;
  /** "datetime" (default) | "relative" | "label" | "date" | "time" */
  format?: TimeFormat;
  dateStyle?: 'short' | 'medium' | 'long' | 'full' | string;
  seconds?: boolean;
  timeZone?: string;
  timeZoneName?: Intl.DateTimeFormatOptions['timeZoneName'];
  /** the full date and time in a tooltip; default on for relative and label */
  tooltip?: boolean;
  /** re-reads the clock every minute; default on for relative and label */
  live?: boolean;
  /** the moment to count from instead of now */
  now?: Dated;
  strings?: Catalog | null;
  locale?: string;
};
export function Time({ value, format = 'datetime', dateStyle, seconds = false, timeZone, timeZoneName, tooltip, live, now, strings, locale, className, ...rest }: TimeProps) {
  const f: TimeFormat = FORMATS.indexOf(format) >= 0 ? format : 'datetime';
  const moving = f === 'relative' || f === 'label';
  const ticking = live !== undefined ? !!live : moving;
  const [, tick] = React.useState(0);
  React.useEffect(() => {
    if (!ticking || now) return undefined;
    const t = setInterval(() => tick((n) => n + 1), tokenMs('--plx-comp-time-refresh-interval', 60000));
    return () => clearInterval(t);
  }, [ticking, now]);
  const words = useStrings('time', strings) as { now: string };   // every hook before the return below (issue 885)
  const d = toDate(value);
  if (!d) return null;
  const o = { locale, timeZone, timeZoneName, dateStyle, seconds };
  const at = toDate(now) || new Date();
  let text;
  if (f === 'relative') text = Math.abs(d.getTime() - at.getTime()) < 60000 ? words.now : formatRelative(d, { now: at, locale, timeZone });
  else if (f === 'label') text = dayLabel(d, at, o);
  else if (f === 'date') text = formatDate(d, o);
  else if (f === 'time') text = formatTime(d, o);
  else text = formatDateTime(d, o);
  const tip = tooltip !== undefined ? !!tooltip : moving;
  const el = (
    <time className={cx('plx-time', className)} dateTime={f === 'date' || f === 'label' ? calendarDay(d) : dateTimeAttr(d)} tabIndex={tip ? 0 : undefined} {...rest}>{text}</time>
  );
  return tip ? <Tooltip content={formatDateTime(d, { locale, timeZone, dateStyle: 'long', timeZoneName: 'short' })}>{el}</Tooltip> : el;
}
