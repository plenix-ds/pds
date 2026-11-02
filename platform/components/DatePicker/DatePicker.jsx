/* Plenix · DatePicker
   Summary: A field for a date that people type in their locale's numeric form or choose from a Calendar in a popover:
     one date, a range of two (a start and an end, with two months side by side), or a date with a time (the time field
     beside it, with the time zone). Optional presets (Today, Last 7 days) choose common values in one press. The value is
     in the data font (Reddit Mono).
   Usage:
     <Field label="Due date" description="MM/DD/YYYY"><DatePicker value={due} onChange={setDue} /></Field>
     <Field label="Period"><DatePicker mode="range" value={period} onChange={setPeriod} presets /></Field>
     <Field label="Starts"><DatePicker mode="date-time" value={starts} onChange={setStarts} min={todayIso()} /></Field>
   Props:
     width: "xs" | "sm" | "md" | "lg" (the field-width scale, --plx-sys-field-width-*: pick by what it holds) | "fill" (the whole
       width); without a pattern sizing it, the field is never wider than its container (P-52, owner 2026-10-19)
     mode: "single" (default; one date) | "range" (a start and an end) | "date-time" (a date and a time: one moment)
     value: "YYYY-MM-DD" (single), { start, end } of such dates (range), or "YYYY-MM-DDTHH:MM" (date-time); null when
       empty. Controlled with onChange. With a time zone, a date-time value is one moment: an ISO string ending in Z or an
       offset ("2026-03-08T07:30:00.000Z"); a value without one is read as a wall-clock time in the zone
     timeZone: the IANA zone the value shows and saves in ("Europe/Lisbon"; issue 813); default the nearest LocaleProvider's
       timeZone, else the computer's zone (exactly as before); null keeps the computer's zone inside a zoned region
     defaultValue: the first value of an uncontrolled field
     onChange(value): runs with the new value when a date is chosen, a preset is pressed, or typed text is read (when the
       field is left or Enter is pressed); null when the field is emptied. With a time zone, a date-time value is given as
       the moment in UTC ("2026-03-08T07:30:00.000Z")
     presets: true (the built-in presets of the mode: Today, Tomorrow, In a week; or Last 7 days, Last 30 days, This month,
       Last month) or a list [{ label, value }] (value in the mode's form); shown beside the calendar (default none)
     months: the months the calendar shows: 1 or 2 (default 2 for a range, else 1)
     min, max: the first and last date that can be chosen ("YYYY-MM-DD"); typed dates outside them are not taken
     isDateDisabled(date): true for a date that cannot be chosen (Calendar's)
     weekNumbers: the calendar shows the week numbers (default false)
     defaultTime: the time a date-time value takes when only its date is chosen ("HH:MM", default "09:00")
     timeZoneName: the time zone shown after the time ("short", default: "EDT"; false: none); with a timeZone, that zone,
       named for the value's moment (EST in winter, EDT in summer)
     invalid: the danger border and aria-invalid (a Field with an error sets it)
     warning: true shows a warning state beside invalid (a Field with a warning sets it): a warning border and fill; the Field draws its icon and message
     disabled: turns the field and its button off
     readOnly: shows the date and does not change it: the field is read-only and the calendar button is not shown; default the nearest ReadOnly region's (useReadOnly)
     required: handed to the date field (a Field sets it)
     id: handed to the date field, with aria-describedby (a Field sets both)
     locale: the locale of the typed form, the names and the first day of the week (default: the page's language)
     strings: the words it shows and announces; default: the locale's datePicker words from the catalog (platform/i18n: English, Arabic), through LocaleProvider; this prop wins: { open: "Choose date", dialog: "Choose date",
       time: "Time", presets: "Presets", today: "Today", tomorrow: "Tomorrow", nextWeek: "In a week", last7: "Last 7 days",
       last30: "Last 30 days", thisMonth: "This month", lastMonth: "Last month", calendar: {…Calendar's strings} }
     className: more classes on the date picker
     ref: forwarded to the date <input>
   Behavior:
     The field takes the locale's numeric date (10/15/2026 in en-US, 15.10.2026 in de-DE) and also YYYY-MM-DD; its
       placeholder shows the form (MM/DD/YYYY). A range is two dates with a dash between them. Typed text is read when the
       field is left or Enter is pressed: a date it cannot read, or one that cannot be chosen, leaves the text and marks
       the field invalid until it is corrected; the Field's error says what to fix.
     The field is one box like the text field (owner, form-controls-37): the date input and a 16px calendar icon button inside
       it at its end; a range and a date-time picker look the same, the time field beside it. The calendar opens in a popover 4px
       under the field.
     The calendar button (or Alt+Arrow Down in the field) opens the calendar in a popover under the field, with focus on
       the chosen day (else today); choosing a day (a range: its end) or a preset closes it and returns focus to the field.
       Escape, a press outside, and Tab out of it close it too.
     Range: the first day chosen is the start, the second the end; until the end is chosen, the days between are shown
       as the range as the pointer or the keys move.
     Date-time: the time field (the browser's own, typed or stepped) sits beside the date with the time zone after it;
       choosing a date keeps the time, or takes defaultTime.
     A date or a range wider than its box (a narrow bar, issue 558) ends in an ellipsis and shows in full in a tooltip on
       hover and focus, only while it is cut and the calendar is closed.
   Notes:
     The date field is as wide as its form (wider for a range) and the time field as wide as a time with its zone
       (--plx-comp-date-picker-*-width).
     The value is a calendar date (no time zone moves it); a date-time value is a local wall-clock time, and the time zone
       shown says which.
     Time zone (issue 813): with a timeZone (its own or LocaleProvider's), today, the calendar's today mark and the presets
       are the zone's today, and a date-time value shows its moment's date and time in the zone and saves the moment chosen
       there. A date or a range stays a calendar date. A time the zone skips when the clocks go forward reads as the
       time after the change (02:30 is 03:30); a time it repeats when they go back is the earlier one. Without a zone it
       works on the computer's zone, as before.
     A date people know by heart (a birth date) is typed: give it no calendar (use Input).
     Built on Popover (manual) and Calendar; the date-time's time field is an InputGroup.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { formatLocale, numeralLocale } from '../../utils/format.ts';
import { Button } from '../Button/Button.tsx';
import { Input } from '../Input/Input.tsx';
import { InputGroup } from '../InputGroup/InputGroup.tsx';
import { Popover } from '../Popover/Popover.jsx';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { useTruncated } from '../../utils/overflow.ts';
import { Calendar, parseIsoDate, addDays, addMonths, todayIso } from '../Calendar/Calendar.jsx';
import CalendarIcon from 'plenix-platform/icons/plenix/calendar';
import { useStrings, useTimeZone } from '../../providers/LocaleProvider.tsx';
import { useReadOnly } from '../../providers/ReadOnly.tsx';
import { validZone, wallOf, isInstant, instantIso, instantOf, todayIn, zoneName } from '../../utils/zone.ts';

const DASH = ' – ';

// the locale's numeric date: its parts in order ("month", "day", "year") and the form people read ("MM/DD/YYYY")
function numericForm(locale) {
  const f = new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
  const parts = f.formatToParts(new Date(2026, 9, 15, 12));
  return {
    format: (iso) => { const d = parseIsoDate(iso); return d ? f.format(d) : ''; },
    order: parts.filter((p) => p.type === 'day' || p.type === 'month' || p.type === 'year').map((p) => p.type),
    hint: parts.map((p) => (p.type === 'day' ? 'DD' : p.type === 'month' ? 'MM' : p.type === 'year' ? 'YYYY' : p.value)).join(''),
  };
}
// typed text to "YYYY-MM-DD" (or null): the locale's numeric order, or year first (2026-10-15)
function readDate(text, order) {
  const n = String(text || '').match(/\d+/g);
  if (!n || n.length !== 3) return null;
  let y, m, d;
  if (n[0].length === 4) { y = +n[0]; m = +n[1]; d = +n[2]; }
  else { const at = {}; order.forEach((k, i) => { at[k] = +n[i]; }); y = at.year; m = at.month; d = at.day; }
  if (y < 100) y += 2000;
  const iso = String(y).padStart(4, '0') + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  return parseIsoDate(iso) ? iso : null;
}
const monthBounds = (iso, n) => { const first = addMonths(iso.slice(0, 7) + '-01', n); return { start: first, end: addDays(addMonths(first, 1), -1) }; };

export const DatePicker = React.forwardRef(function DatePicker({ mode = 'single', value, defaultValue, onChange, presets, months, min, max, width,
  isDateDisabled, weekNumbers = false, defaultTime = '09:00', timeZoneName = 'short', invalid, warning, disabled, readOnly: readOnlyOwn, required, id,
  'aria-describedby': describedBy, locale: localeProp, timeZone: zoneProp, strings, className, ...rest }, ref) {
  const locked = useReadOnly(readOnlyOwn);   // its own readOnly, else the nearest ReadOnly region's: the value shows and nothing changes it (no calendar button)
  const t = useStrings('datePicker', strings);   // the locale's words (platform/i18n), with the strings prop on top
  const locale = numeralLocale(localeProp || formatLocale());
  const form = numericForm(locale);
  const range = mode === 'range', dateTime = mode === 'date-time';
  const [own, setOwn] = React.useState(defaultValue !== undefined ? defaultValue : null);
  const current = value !== undefined ? value : own;
  const commit = (v) => { if (locked) return; if (value === undefined) setOwn(v); if (onChange) onChange(v); };
  // the time zone (issue 813): its own, else LocaleProvider's; none (or one the browser does not know) is the computer's
  const providerZone = useTimeZone();
  const zone = validZone(zoneProp !== undefined ? zoneProp : providerZone);
  // a date-time value that names a moment, shown in the zone: its wall clock there
  const wall = dateTime && zone && current && isInstant(current) ? wallOf(Date.parse(current), zone) : null;
  // the parts of the value: the date (or range) and the time
  const datePart = dateTime ? (wall ? wall.date : current ? String(current).slice(0, 10) : null) : current;
  const timePart = wall ? wall.time : dateTime && current ? String(current).slice(11, 16) : '';
  // a date and a time as the value: with a zone, the moment they are there (in UTC); without, the wall clock as before
  const moment = (date, time) => (zone ? instantIso(date, time, zone) : date + 'T' + time);
  const show = (v) => (range ? (v && v.start ? form.format(v.start) + (v.end ? DASH + form.format(v.end) : '') : '') : form.format(v));
  const [text, setText] = React.useState(show(datePart));
  const [bad, setBad] = React.useState(false);
  const typing = React.useRef(false);
  React.useEffect(() => { if (!typing.current) { setText(show(datePart)); setBad(false); } }, [range ? JSON.stringify(datePart) : datePart, locale]);
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(null);   // a range while its end is still open
  const root = React.useRef(null), input = React.useRef(null), day = React.useRef(null);
  React.useImperativeHandle(ref, () => input.current);
  const allowed = (iso) => !((min && iso < min) || (max && iso > max) || (isDateDisabled && isDateDisabled(iso)));
  const withTime = (iso) => (iso ? moment(iso, timePart || defaultTime) : null);
  const setDate = (d) => commit(dateTime ? withTime(d) : d);

  // typed text, read when the field is left or Enter is pressed
  const read = () => {
    typing.current = false;
    if (locked) return;
    const s = text.trim();
    if (!s) { setBad(false); if (datePart) setDate(null); return; }
    if (range) {
      const two = s.split(/\s*(?:\u2013|\u2014|\s-\s|\bto\b)\s*/);
      const a = readDate(two[0], form.order), b = two[1] ? readDate(two[1], form.order) : null;
      if (!a || (two[1] && !b) || !allowed(a) || (b && !allowed(b))) { setBad(true); return; }
      const next = b && b < a ? { start: b, end: a } : { start: a, end: b };
      setBad(false); setText(show(next)); commit(next);
      return;
    }
    const iso = readDate(s, form.order);
    if (!iso || !allowed(iso)) { setBad(true); return; }
    setBad(false); setText(form.format(iso)); setDate(iso);
  };
  const close = (refocus) => { setOpen(false); setDraft(null); if (refocus && input.current) input.current.focus(); };
  const toggle = () => { if (open) close(true); else { setDraft(range ? (datePart || { start: null, end: null }) : null); setOpen(true); } };
  // a press outside, or focus leaving the field and its calendar, closes the calendar
  React.useEffect(() => {
    if (!open) return undefined;
    const outside = (e) => { if (root.current && !root.current.contains(e.target)) close(false); };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, [open]);
  const onBlur = (e) => { if (open && e.relatedTarget && root.current && !root.current.contains(e.relatedTarget)) close(false); };

  const choose = (v) => {
    if (range) {
      setDraft(v);
      if (v.start && v.end) { commit(v); setText(show(v)); setBad(false); close(true); }
      return;
    }
    setDate(v); setText(form.format(v)); setBad(false); close(true);
  };
  const today = zone ? todayIn(zone) : todayIso();   // the zone's today: near midnight it may be another day than the computer's
  const builtIn = range
    ? [{ label: t.last7, value: { start: addDays(today, -6), end: today } }, { label: t.last30, value: { start: addDays(today, -29), end: today } },
      { label: t.thisMonth, value: monthBounds(today, 0) }, { label: t.lastMonth, value: monthBounds(today, -1) }]
    : [{ label: t.today, value: today }, { label: t.tomorrow, value: addDays(today, 1) }, { label: t.nextWeek, value: addDays(today, 7) }];
  const presetList = presets === true ? builtIn : Array.isArray(presets) ? presets : null;
  const pick = (p) => {
    const v = dateTime && typeof p.value === 'string' ? (zone && isInstant(p.value) ? wallOf(Date.parse(p.value), zone).date : p.value.slice(0, 10)) : p.value;
    if (range) { commit(v); setText(show(v)); } else { setDate(v); setText(form.format(v)); }
    setBad(false); close(true);
  };

  // the zone's name: with a zone, for the value's moment (EST or EDT); otherwise for now, as before
  const at = zone && dateTime && datePart ? instantOf(datePart, timePart || defaultTime, zone) : NaN;
  const zoneLabel = dateTime && timeZoneName ? zoneName(locale, timeZoneName, zone, Number.isNaN(at) ? Date.now() : at) : '';
  const shown = range ? (draft || datePart || { start: null, end: null }) : datePart;
  const firstMonth = (range ? (shown && shown.start) : shown) || undefined;
  const cut = useTruncated(input, text);   // the date (or range) is cut (issue 558): its full text goes in a Tooltip on hover and focus
  const field = (
    <div className="plx-date-picker__field">
      <div className={cx('plx-date-picker__date', range && 'plx-date-picker__date--range', 'plx-input', 'plx-input--data', disabled && 'is-disabled')} aria-invalid={(invalid || bad) || undefined} data-plx-warning={warning || undefined}
        onMouseDown={(e) => { if (!disabled && input.current && e.target !== input.current && !e.target.closest('button')) { e.preventDefault(); input.current.focus(); } }}>
        <Tooltip content={text} disabled={!cut || !text || open} describe={false} className="plx-date-picker__tip">
          <input ref={input} id={id} type="text" className="plx-date-picker__input" value={text} placeholder={range ? form.hint + DASH + form.hint : form.hint} required={required}
            aria-describedby={describedBy} aria-invalid={(invalid || bad) || undefined} data-plx-warning={warning || undefined} disabled={disabled} readOnly={locked || undefined} autoComplete="off"
            onChange={(e) => { typing.current = true; setText(e.target.value); if (bad) setBad(false); }}
            onBlur={read}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { read(); }
              else if (e.key === 'ArrowDown' && e.altKey && !locked) { e.preventDefault(); if (!open) toggle(); }
            }} />
        </Tooltip>
        {locked ? null : <Button variant="ghost" size="2xs" iconOnly icon={CalendarIcon} className="plx-date-picker__button" label={t.open} expanded={open} aria-haspopup="dialog" disabled={disabled} onClick={toggle} />}
      </div>
      {dateTime ? (
        <InputGroup data suffix={zoneLabel || undefined} disabled={disabled} invalid={invalid} warning={warning} className="plx-date-picker__time">
          <Input type="time" data aria-label={t.time} value={timePart} disabled={disabled} readOnly={locked || undefined}
            onChange={(e) => { const v = e.target.value; if (datePart) commit(moment(datePart, v || defaultTime)); }} />
        </InputGroup>
      ) : null}
    </div>
  );
  return (
    <div ref={root} className={cx('plx-date-picker', 'plx-date-picker--' + (range ? 'range' : dateTime ? 'date-time' : 'single'), width && 'plx-date-picker--width-' + width, className)} onBlur={onBlur} {...rest}>
      <Popover anchorClassName="plx-date-picker__anchor" trigger={field} triggerOn="manual" open={open} onOpenChange={(v) => { if (!v) close(true); }} label={t.dialog} size="auto"
        placement="bottom-start" focusOnOpen initialFocus={day} sheetOnNarrow={false}>
        <div className={cx('plx-date-picker__panel', presetList && 'plx-date-picker__panel--presets')}>
          {presetList ? (
            <div role="group" aria-label={t.presets} className="plx-date-picker__presets">
              {presetList.map((p) => <Button key={p.label} variant="ghost" size="sm" className="plx-date-picker__preset" onClick={() => pick(p)}>{p.label}</Button>)}
            </div>
          ) : null}
          <Calendar mode={range ? 'range' : 'single'} value={shown} onChange={choose} months={months || (range ? 2 : 1)} defaultMonth={firstMonth ? firstMonth.slice(0, 7) : undefined}
            min={min} max={max} isDateDisabled={isDateDisabled} weekNumbers={weekNumbers} locale={locale} today={today} focusRef={day} label={t.dialog} strings={t.calendar} />
        </div>
      </Popover>
    </div>
  );
});

// the locale's numeric date form ("MM/DD/YYYY"), for a Field's description
DatePicker.formatHint = (locale) => numericForm(locale || formatLocale()).hint;
