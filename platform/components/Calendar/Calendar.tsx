/* Plenix · Calendar
   Summary: A month grid of days to choose a date or a range from, with the weeks in the reader's locale (its first day of
     the week, its month and weekday names), today marked, the chosen date or range shown, days that cannot be chosen
     turned off, and optionally a second month beside the first and the week numbers.
   Usage:
     <Calendar label="Due date" value={due} onChange={setDue} />                          // "2026-10-15"
     <Calendar mode="range" months={2} value={range} onChange={setRange} />              // { start, end }
     <Calendar value={day} onChange={setDay} min="2026-10-01" max="2026-12-31" weekNumbers />
     <Calendar value={day} onChange={setDay} isDateDisabled={(iso) => weekend(iso)} />
   Props:
     mode: "single" (default; one date) | "range" (a start and an end: the first choice is the start, the second the end)
     value: the chosen date as "YYYY-MM-DD" (single), or { start, end } of such dates (range); controlled with onChange
     defaultValue: the first value of an uncontrolled calendar
     onChange(value): runs with the new date ("YYYY-MM-DD"), or with { start, end } in range mode (end null after the
       first choice)
     month: the month shown first, "YYYY-MM" (controlled, with onMonthChange); default: the chosen date's, else today's
     defaultMonth: the first month shown of an uncontrolled calendar
     onMonthChange(month): runs with "YYYY-MM" when the shown month changes (the arrows, Page Up, Page Down, a key that
       leaves the month)
     months: 1 (default) | 2: two months side by side (a range over a month's end); they stack on a narrow window
     weekNumbers: the ISO week number before each week, in the data font (default false)
     min, max: the first and last date that can be chosen ("YYYY-MM-DD"); the days outside them are off, and the arrows
       stop at their months
     isDateDisabled(date): true for a date that cannot be chosen ("YYYY-MM-DD"); the day is off but keys still reach it
     today: today's date, "YYYY-MM-DD" (default: the device's today)
     firstDayOfWeek: 0 (Sunday) to 6 (Saturday); default: the locale's (Intl.Locale weekInfo), else Sunday for en-US and
       Monday elsewhere
     locale: the locale of the names and numbers (default: formatLocale(), the page's language)
     label: the accessible name of the calendar (a group); default strings.label
     focusRef: a ref given the day that holds the Tab stop, so a popover can move focus to it (DatePicker)
     strings: the words it shows and announces, for other languages: { label: "Calendar", previous: "Previous month",
       next: "Next month", week: "Week", weekShort: "Wk", today: "Today" }
     className: more classes on the calendar
   Behavior:
     The days are a grid (role="grid"): one Tab stop, on the chosen day, else today, else the first day of the month.
       Arrow Left and Right move a day (mirrored right to left), Up and Down a week, Home and End to the week's first and
       last day, Page Up and Page Down a month, Shift with Page Up or Page Down a year; Enter or Space chooses. A key that
       leaves the shown month shows the new month.
     A day that cannot be chosen is announced as unavailable (aria-disabled) and stays reachable by the keys, so people
       hear why nothing happens; a press on it does nothing.
     Range: the first choice sets the start, the second the end (a day before the start becomes the start); while the end
       is open, the days between the start and the pointer or the focused day are shown as the range.
     One month shows the days of the weeks around it (muted); a press on one moves to its month. Two months show only
       their own days.
     The month's name is read when the month changes (a polite live region).
     Each day is named in full for screen readers ("Thursday, October 15, 2026"); today carries aria-current="date"; a
       chosen day is aria-selected.
   Notes:
     Dates are calendar dates ("YYYY-MM-DD"), not moments: no time zone moves them. A date with a time is DatePicker's
       date-time mode.
     Today is DateBadge's today (the number on the action color); a chosen day the selected state; a range the selected
       fill between its two ends.
     Other props pass through to the outer <div>.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { arrowStep } from '../../utils/direction.ts';
import { formatLocale, numeralLocale } from '../../utils/format.ts';
import { Button } from '../Button/Button.tsx';
import ChevronLeftIcon from 'plenix-platform/icons/plenix/chevron-left';
import ChevronRightIcon from 'plenix-platform/icons/plenix/chevron-right';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';

/* ---- calendar dates: "YYYY-MM-DD" strings; arithmetic on local dates at noon, so no daylight-saving change moves a day */
const pad = (n: number, w?: number) => String(n).padStart(w || 2, '0');
export function parseIsoDate(s: unknown): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3], 12);
  return d.getMonth() === +m[2] - 1 ? d : null;
}
function isoDate(d: Date | null) { return d ? d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) : ''; }
export function addDays(iso: string, n: number): string { const d = parseIsoDate(iso); if (!d) return iso; d.setDate(d.getDate() + n); return isoDate(d); }
export function addMonths(iso: string, n: number): string {
  const d = parseIsoDate(iso); if (!d) return iso;
  const day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + n);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0, 12).getDate();
  d.setDate(Math.min(day, last));
  return isoDate(d);
}
const dateOf = (s: string): Date => parseIsoDate(s) as Date;
export function todayIso() { return isoDate(new Date()); }
const monthOf = (iso: string) => String(iso).slice(0, 7);
const monthStart = (ym: string) => ym + '-01';
const shiftMonth = (ym: string, n: number) => monthOf(addMonths(monthStart(ym), n));
// the locale's first day of the week (0 Sunday … 6 Saturday)
function firstDayOf(locale: string) {
  try {
    const l = new Intl.Locale(locale);
    const wl = l as unknown as { getWeekInfo?: () => { firstDay?: number }; weekInfo?: { firstDay?: number } };
    const info = typeof wl.getWeekInfo === 'function' ? wl.getWeekInfo() : wl.weekInfo;
    if (info && info.firstDay) return info.firstDay % 7;
  } catch (e) { /* an unknown locale */ }
  return /-US$|^en$/i.test(locale) ? 0 : 1;
}
// the ISO 8601 week of the week holding this date (the week of its Thursday)
function isoWeek(d: Date) {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
  t.setDate(t.getDate() + 3 - ((t.getDay() + 6) % 7));
  const jan4 = new Date(t.getFullYear(), 0, 4, 12);
  return 1 + Math.round(((t.getTime() - jan4.getTime()) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7);
}
// the weeks of a month: rows of seven days, from the week holding its first day to the week holding its last
function weeksOf(ym: string, first: number) {
  const start = parseIsoDate(monthStart(ym)) as Date;
  start.setDate(start.getDate() - ((start.getDay() - first + 7) % 7));
  const lastDay = parseIsoDate(addDays(monthStart(shiftMonth(ym, 1)), -1)) as Date;
  const rows: string[][] = [];
  const d = new Date(start);
  do {
    const week: string[] = [];
    for (let i = 0; i < 7; i++) { week.push(isoDate(d)); d.setDate(d.getDate() + 1); }
    rows.push(week);
  } while (d <= lastDay);
  return rows;
}

/** @public a chosen range (ADR 0011) */
export type CalendarRange = { start: string | null; end: string | null };
/** @public the prop type (ADR 0011) */
export type CalendarProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  /** "single" (default) | "range" */
  mode?: 'single' | 'range';
  /** the chosen day "YYYY-MM-DD" (single) or { start, end } (range), controlled */
  value?: string | null | CalendarRange;
  defaultValue?: string | null | CalendarRange;
  onChange?: (next: string | CalendarRange) => void;
  /** the month shown "YYYY-MM", controlled */
  month?: string;
  defaultMonth?: string;
  onMonthChange?: (month: string) => void;
  /** 1 (default) or 2 months side by side */
  months?: 1 | 2;
  weekNumbers?: boolean;
  /** the first and last day that can be chosen, "YYYY-MM-DD" */
  min?: string;
  max?: string;
  isDateDisabled?: (iso: string) => boolean;
  /** today as "YYYY-MM-DD" (default the real today) */
  today?: string;
  /** 0 Sunday … 6 Saturday (default the locale's) */
  firstDayOfWeek?: number;
  locale?: string;
  label?: string;
  /** receives the day button that has the Tab stop */
  focusRef?: React.MutableRefObject<HTMLButtonElement | null>;
  strings?: Catalog | null;
  className?: string;
};

export const Calendar = React.forwardRef<HTMLDivElement | null, CalendarProps>(function Calendar({ mode = 'single', value, defaultValue, onChange, month, defaultMonth, onMonthChange,
  months = 1, weekNumbers = false, min, max, isDateDisabled, today: todayProp, firstDayOfWeek, locale: localeProp, label, focusRef,
  strings, className, ...rest }, ref) {
  const t = useStrings('calendar', strings) as Record<string, string>;
  const locale = numeralLocale(localeProp || formatLocale());
  const today = todayProp || todayIso();
  const range = mode === 'range';
  const [ownValue, setOwnValue] = React.useState<string | null | CalendarRange>(defaultValue !== undefined ? defaultValue : (range ? { start: null, end: null } : null));
  const current = value !== undefined ? value : ownValue;
  const sel = (range ? (current || { start: null, end: null }) : null) as CalendarRange;
  const anchorDate = (range ? (sel.start || null) : (current || null)) as string | null;
  const first = firstDayOfWeek !== undefined ? firstDayOfWeek : firstDayOf(locale);
  const count = months === 2 ? 2 : 1;
  const [ownMonth, setOwnMonth] = React.useState(defaultMonth || monthOf(anchorDate || today));
  const shown = month || ownMonth;
  const setShown = (ym: string) => { if (month === undefined) setOwnMonth(ym); if (onMonthChange) onMonthChange(ym); };
  const [focused, setFocused] = React.useState<string | null>(null);   // the day with the Tab stop once people move in the grid
  const [hover, setHover] = React.useState<string | null>(null);       // the pointer's or the focused day, for the open range
  const moveFocus = React.useRef(false);
  const root = React.useRef<HTMLDivElement | null>(null);
  React.useImperativeHandle(ref, () => root.current as HTMLDivElement);

  const off = (iso: string) => (min && iso < min) || (max && iso > max) || (isDateDisabled ? !!isDateDisabled(iso) : false);
  const visible = (iso: string) => { const ym = monthOf(iso); return ym >= shown && ym <= shiftMonth(shown, count - 1); };
  // the Tab stop: the focused day when it is shown, else the chosen day, else today, else the first day of the month
  const stop = [focused, anchorDate, today].filter((d) => d && visible(d))[0] || monthStart(shown);

  const choose = (iso: string) => {
    if (off(iso)) return;
    let next: string | CalendarRange;
    if (!range) next = iso;
    else if (!sel.start || sel.end) next = { start: iso, end: null };
    else if (iso < sel.start) next = { start: iso, end: null };
    else next = { start: sel.start, end: iso };
    if (value === undefined) setOwnValue(next);
    if (onChange) onChange(next);
    if (!visible(iso)) setShown(monthOf(iso));
    setFocused(iso);
  };
  const goTo = (iso: string) => {
    if (min && iso < min) iso = min;
    if (max && iso > max) iso = max;
    if (!visible(iso)) setShown(iso < monthStart(shown) ? monthOf(iso) : shiftMonth(monthOf(iso), -(count - 1)));
    setFocused(iso);
    if (range && sel.start && !sel.end) setHover(iso);
    moveFocus.current = true;
  };
  React.useLayoutEffect(() => {
    if (!moveFocus.current || !root.current) return;
    moveFocus.current = false;
    const el = root.current.querySelector<HTMLElement>('[data-plx-date="' + stop + '"]');
    if (el) el.focus();
  });
  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const from = e.target && (e.target as HTMLElement).getAttribute ? (e.target as HTMLElement).getAttribute('data-plx-date') : null;
    if (!from) return;
    const pos = ((parseIsoDate(from) as Date).getDay() - first + 7) % 7;
    let next: string;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') next = addDays(from, arrowStep(e, e.currentTarget));
    else if (e.key === 'ArrowUp') next = addDays(from, -7);
    else if (e.key === 'ArrowDown') next = addDays(from, 7);
    else if (e.key === 'Home') next = addDays(from, -pos);
    else if (e.key === 'End') next = addDays(from, 6 - pos);
    else if (e.key === 'PageUp') next = addMonths(from, e.shiftKey ? -12 : -1);
    else if (e.key === 'PageDown') next = addMonths(from, e.shiftKey ? 12 : 1);
    else return;
    e.preventDefault();
    goTo(next);
  };

  const fullName = new Intl.DateTimeFormat(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const dayNumber = new Intl.DateTimeFormat(locale, { day: 'numeric' });
  const monthName = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  // Arabic weekday names are too long for a column: one letter each, as Arabic calendars do (owner, arabic-batch4-36)
  const weekdayShort = new Intl.DateTimeFormat(locale, { weekday: /^ar\b/i.test(locale) ? 'narrow' : 'short' });
  const weekdayLong = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  const weekNumber = new Intl.NumberFormat(locale);
  const weekdays = Array.from({ length: 7 }, (_, i) => { const d = new Date(2026, 1, 1 + ((first + i) % 7), 12); return { short: weekdayShort.format(d), long: weekdayLong.format(d) }; });   // Feb 1, 2026 was a Sunday

  // the range drawn: the chosen one, or from the start to the pointer while the end is open
  const lo = range ? sel.start : null;
  const hi = range ? (sel.end || (sel.start && hover && hover > sel.start ? hover : null)) : null;
  const inRange = (iso: string) => !!(lo && hi && iso > lo && iso < hi);
  const prevOff = min && shiftMonth(shown, -1) < monthOf(min);
  const nextOff = max && shiftMonth(shown, count) > monthOf(max);
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const outside = count === 1;
  const setRef = (iso: string) => (el: HTMLButtonElement | null) => { if (iso === stop && focusRef) focusRef.current = el; };

  const monthGrid = (ym: string, i: number) => {
    const titleId = 'plx-cal' + uid + '-' + i;
    const rows = weeksOf(ym, first);
    return (
      <div key={ym} className="plx-calendar__month">
        <div className="plx-calendar__header">
          {i === 0 ? <Button variant="ghost" size="sm" iconOnly tooltip={false} icon={ChevronLeftIcon} label={t.previous} className="plx-calendar__nav plx-calendar__nav--previous"
            disabled={!!prevOff} onClick={() => setShown(shiftMonth(shown, -1))} /> : <span className="plx-calendar__nav-space" aria-hidden="true" />}
          <div id={titleId} className="plx-calendar__title" aria-live="polite">{monthName.format(dateOf(monthStart(ym)))}</div>
          {i === count - 1 ? <Button variant="ghost" size="sm" iconOnly tooltip={false} icon={ChevronRightIcon} label={t.next} className="plx-calendar__nav plx-calendar__nav--next"
            disabled={!!nextOff} onClick={() => setShown(shiftMonth(shown, 1))} /> : <span className="plx-calendar__nav-space" aria-hidden="true" />}
        </div>
        <div role="grid" aria-labelledby={titleId} className="plx-calendar__grid" onKeyDown={onKeyDown} onMouseLeave={() => setHover(null)}>
          <div role="row" className="plx-calendar__row plx-calendar__row--weekdays">
            {weekNumbers ? <span role="columnheader" className="plx-calendar__weekday plx-calendar__weekday--week" aria-label={t.week}>{t.weekShort}</span> : null}
            {weekdays.map((w) => <span key={w.long} role="columnheader" className="plx-calendar__weekday" aria-label={w.long}>{w.short}</span>)}
          </div>
          {rows.map((row) => (
            <div key={row[0]} role="row" className="plx-calendar__row">
              {weekNumbers ? <span role="rowheader" className="plx-calendar__week-number" aria-label={t.week + ' ' + weekNumber.format(isoWeek(dateOf(row[3])))}>{weekNumber.format(isoWeek(dateOf(row[3])))}</span> : null}
              {row.map((iso) => {
                const own = monthOf(iso) === ym;
                if (!own && !outside) return <span key={iso} role="gridcell" className="plx-calendar__cell plx-calendar__cell--empty" />;
                const isStart = range && iso === lo, isEnd = range && !!hi && iso === hi;
                const chosen = range ? (isStart || isEnd) : iso === current;
                const between = range && own && inRange(iso);
                const disabled = off(iso);
                return (
                  <span key={iso} role="gridcell" aria-selected={chosen || between || undefined}
                    className={cx('plx-calendar__cell', own && between && 'is-in-range', own && isStart && hi && 'is-range-start', own && isEnd && 'is-range-end')}>
                    <button ref={setRef(iso)} type="button" data-plx-date={iso} tabIndex={iso === stop ? 0 : -1}
                      className={cx('plx-calendar__day', !own && 'is-outside', iso === today && 'is-today', chosen && 'is-selected', disabled && 'is-disabled')}
                      aria-label={fullName.format(dateOf(iso)) + (iso === today ? ', ' + t.today : '')} aria-current={iso === today ? 'date' : undefined}
                      aria-disabled={disabled || undefined}
                      onClick={() => { if (!own) setShown(monthOf(iso)); choose(iso); }}
                      onMouseEnter={() => { if (range && sel.start && !sel.end) setHover(iso); }}
                      onFocus={() => { setFocused(iso); if (range && sel.start && !sel.end) setHover(iso); }}>
                      {dayNumber.format(dateOf(iso))}
                    </button>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div ref={root} role="group" aria-label={label || t.label}
      className={cx('plx-calendar', count === 2 && 'plx-calendar--two-months', weekNumbers && 'plx-calendar--week-numbers', className)} {...rest}>
      <div className="plx-calendar__months">
        {Array.from({ length: count }, (_, i) => monthGrid(shiftMonth(shown, i), i))}
      </div>
    </div>
  );
});
