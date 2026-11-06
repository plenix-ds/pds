/* Plenix · TimePicker
   Summary: A time of day, typed or chosen: a field with a list of times at a set step (the default), or segments for the
     hour, the minute and, on a 12-hour clock, AM or PM. It follows the reader's clock (12 or 24 hours); the time is in the
     data font.
   Usage:
     <Field label="Start time"><TimePicker value={start} onChange={setStart} /></Field>
     <TimePicker step={30} min="08:00" max="18:00" value={t} onChange={setT} label="Meeting" />
     <TimePicker variant="segments" hourCycle="24" value={t} onChange={setT} label="Alarm" />
   Props:
     width: "xs" | "sm" | "md" | "lg" (the field-width scale, --plx-sys-field-width-*: pick by what it holds) | "fill" (the whole
       width); without a pattern sizing it, the field is never wider than its container (P-52, owner 2026-10-19)
     value: the time as "HH:MM" on a 24-hour clock ("14:30"), or "" for none; the same whatever clock is shown. With a time
       zone it may also be one moment, an ISO string ending in Z or an offset ("2026-03-08T14:30:00.000Z"): the picker shows
       its time in the zone
     defaultValue: the time it starts with, uncontrolled
     onChange(value): runs with the new "HH:MM" (or "" when cleared); for a moment value, the moment of the time chosen on
       the same day in the zone, in UTC ("2026-03-08T15:00:00.000Z")
     timeZone: the IANA zone a moment value shows and saves in ("Europe/Lisbon"; issue 813); default the nearest
       LocaleProvider's timeZone, else the computer's zone (exactly as before); null keeps the computer's zone. An "HH:MM"
       value is a time of day: no zone moves it
     variant: "list" (default: a field people type in, with the times at each step in a list under it) | "segments"
       (spin buttons for the hour, the minute and the period)
     hourCycle: "12" | "24": the clock shown; default the reader's locale's clock
     The list of times opens in the browser's top layer, below the field (or above it near an edge), as wide as the field: no dialog, drawer or scroll area clips it;
       its rows are the shared list row height (28px at the compact density), the times in the data font (owner, timepicker-rows-37)
     Digits: in Arabic the times are written Arabic-Indic (٢:٣٠), and a time typed in Arabic-Indic digits reads the same (owner, arabic-digits-35)
     step: the minutes between times in the list, and the minute segment's step (default 15 for the list, 1 for segments);
       a value that divides 60 (5, 10, 15, 30)
     min, max: the earliest and the latest time ("HH:MM"); the list holds only times between them
     label: the accessible name when there is no Field (the group's name with segments)
     invalid: the invalid state (the border in the danger color); a Field with an error sets it
     warning: true shows a warning state beside invalid (a Field with a warning sets it): a warning border and fill; the Field draws its icon and message
     disabled: the field cannot be used
     readOnly: shows the time and does not change it: the list does not open, the segments take no digits or arrows that change a value; default the nearest ReadOnly region's (useReadOnly)
     id: the id of the input, or of the first segment (a Field sets it)
     name: submits the "HH:MM" value with a form (a hidden input)
     strings: the words it shows and announces, for other languages: { hour: "Hour", minute: "Minute", period: "AM or
       PM", am: "AM", pm: "PM", times: "Times", empty: "--" }
     className: more classes on the picker
   Behavior:
     List: the field is a combobox; typing a time in almost any form ("2", "2pm", "2:30 pm", "14:30", "1430") and leaving
       the field or pressing Enter sets it, written back in the reader's format; text that is not a time puts the last
       time back. Arrow Down opens the list on the time nearest the value; Arrow Up and Down move, Enter chooses, Escape
       closes, Page Up and Down move an hour.
     Segments: one spin button per part (Tab moves between them, and so do Arrow Left and Right): Arrow Up and Down step
       it (the minute by step), Home and End go to its first and last value, digits type it (two digits move on to the next
       segment), A and P set the period, Backspace clears it. The value changes once every segment is filled.
     Times outside min and max are not offered and are brought back inside when typed.
     List: a time wider than the field (a narrow bar, issue 558) ends in an ellipsis and shows in full in a tooltip on hover
       and focus, only while it is cut and the list is closed.
   Notes:
     For a date and a time together, place a date picker beside it. For a duration, use a number input with a unit.
     Show the time zone in the description when people in several zones use the data.
     A moment value keeps its day in the zone: a time the zone skips when the clocks go forward reads as the time after the
       change (02:30 is 03:30), and a time it repeats when they go back is the earlier one.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { formatLocale } from '../../utils/format.ts';
import { useFloating, TOP_LAYER } from '../../utils/floating.ts';
import { localDigits, toLatinDigits } from '../../utils/digits.ts';
import { useDigits, useTimeZone } from '../../providers/LocaleProvider.tsx';
import { validZone, wallOf, isInstant, instantIso } from '../../utils/zone.ts';

import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import type { FieldWidth } from '../Input/Input.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { useTruncated } from '../../utils/overflow.ts';
import { useReadOnly } from '../../providers/ReadOnly.tsx';
import ScheduleIcon from 'plenix-platform/icons/plenix/schedule';

const pad = (n: number) => String(n).padStart(2, '0');
const toMin = (v: unknown): number | null => { const m = /^(\d{1,2}):(\d{2})$/.exec(String(v || '')); return m ? (+m[1]) * 60 + (+m[2]) : null; };
const fromMin = (n: number) => pad(Math.floor(n / 60) % 24) + ':' + pad(n % 60);
const localeCycle = () => {
  try { const o = new Intl.DateTimeFormat(formatLocale(), { hour: 'numeric' }).resolvedOptions(); return o.hourCycle === 'h11' || o.hourCycle === 'h12' || o.hour12 ? '12' : '24'; }
  catch (e) { return '12'; }
};
// "2", "2pm", "2:30 pm", "14:30", "1430", "230p" → minutes after midnight, or null
export const parseTime = (text: unknown, cycle: string): number | null => {
  const s = toLatinDigits(String(text || '')).trim().toLowerCase().replace(/\./g, '');   // what a person typed in Arabic-Indic digits reads the same
  if (!s) return null;
  const m = /^(\d{1,2})(?::?(\d{2}))?\s*(a|am|p|pm)?$/.exec(s);
  if (!m) return null;
  let h = +m[1]; const min = m[2] ? +m[2] : 0; const p = m[3] ? m[3][0] : null;
  if (min > 59) return null;
  if (p) { if (h < 1 || h > 12) return null; h = h % 12 + (p === 'p' ? 12 : 0); }
  else if (h > 23) return null;
  else if (cycle === '12' && h >= 1 && h <= 6 && !m[2]) h += 12;   // "2" on a 12-hour clock means the afternoon
  return h * 60 + min;
};
type Words = Record<'am' | 'pm' | 'hour' | 'minute' | 'period' | 'empty' | 'times', string>;
const show = (mins: number | null, cycle: string, t: Words, digits: ReturnType<typeof useDigits>): string => {
  if (mins === null) return '';
  const h = Math.floor(mins / 60), m = mins % 60;
  return localDigits(cycle === '12' ? ((h % 12) || 12) + ':' + pad(m) + ' ' + (h < 12 ? t.am : t.pm) : pad(h) + ':' + pad(m), { digits });   // the page's digits (Arabic-Indic in Arabic)
};

/** @public the prop type (ADR 0011) */
export type TimePickerProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'width' | 'step' | 'min' | 'max'> & {
  /** "HH:MM" (24-hour), or a UTC instant when a time zone is set */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** "list" (default) | "segments" */
  variant?: 'list' | 'segments';
  /** "12" | "24" (default the locale's) */
  hourCycle?: '12' | '24' | 12 | 24;
  /** minutes between the list's times (default 15) or a segment's minute step (default 1) */
  step?: number;
  /** the earliest and latest time, "HH:MM" */
  min?: string;
  max?: string;
  label?: string;
  width?: FieldWidth;
  invalid?: boolean;
  warning?: string | boolean;
  readOnly?: boolean;
  name?: string;
  /** an IANA zone: a moment value shows its time there */
  timeZone?: string;
  strings?: Catalog | null;
  className?: string;
};
type Inner = { t: Words; cycle: string; step: number; current: string; commit: (mins: number | null) => void; lo: number; hi: number; label?: string; invalid?: boolean; warning?: string | boolean;
  disabled?: boolean; locked: boolean; id?: string; cls: string; hidden: React.ReactNode; rest: Record<string, unknown> };

export const TimePicker = React.forwardRef<HTMLElement | null, TimePickerProps>(function TimePicker({ value, defaultValue = '', onChange, variant = 'list', hourCycle, step, min, max, label, width,
  invalid, warning, disabled, readOnly: readOnlyOwn, id, name, timeZone: zoneProp, strings, className, ...rest }, ref) {
  devWarn('TimePicker', { variant }, { variant: ['list','segments'] });
  const t = useStrings('timePicker', strings) as unknown as Words;
  const cycle = hourCycle ? String(hourCycle) : localeCycle();
  const locked = useReadOnly(readOnlyOwn);   // its own readOnly, else the nearest ReadOnly region's: the time shows and nothing changes it (the list does not open)
  const [own, setOwn] = React.useState(defaultValue);
  const value0 = value !== undefined ? value : own;
  // the time zone (issue 813): its own, else LocaleProvider's; a moment value shows its time in the zone, on its day there
  const providerZone = useTimeZone();
  const zone = validZone(zoneProp !== undefined ? zoneProp : providerZone);
  const wall = zone && isInstant(value0) ? wallOf(Date.parse(value0 as string), zone) : null;
  const current = wall ? wall.time : value0;   // the "HH:MM" shown
  const lo = (toMin(min) !== null ? toMin(min) : 0) as number, hi = (toMin(max) !== null ? toMin(max) : 24 * 60 - 1) as number;
  const clamp = (n: number) => Math.min(hi, Math.max(lo, n));
  const commit = (mins: number | null) => {
    if (locked) return;
    const v = mins === null ? '' : fromMin(clamp(mins));
    const out = wall && v ? instantIso(wall.date, v, zone as string) : v;   // a moment value stays a moment, on the same day in the zone
    if (value === undefined) setOwn(out as string);
    if (onChange && v !== current) onChange(out as string);
  };
  const cls = cx('plx-time-picker', 'plx-time-picker--' + variant, width && 'plx-time-picker--width-' + width, disabled && 'is-disabled', className);
  const hidden = name ? <input type="hidden" name={name} value={value0 || ''} /> : null;
  if (variant === 'segments') return <Segments ref={ref as React.Ref<HTMLSpanElement>} {...{ t, cycle, step: step || 1, current, commit, lo, hi, label, invalid, warning, disabled, locked, id, cls, hidden, rest }} />;
  return <ListPicker ref={ref as React.Ref<HTMLInputElement>} {...{ t, cycle, step: step || 15, current, commit, lo, hi, label, invalid, warning, disabled, locked, id, cls, hidden, rest }} />;
});

type Seg = 'h' | 'm' | 'p';
type Parts = { h: number | null; m: number | null; p: 'am' | 'pm' | null };
const ListPicker = React.forwardRef<HTMLInputElement | null, Inner>(function ListPicker({ t, cycle, step, current, commit, lo, hi, label, invalid, warning, disabled, locked, id, cls, hidden, rest }, ref) {
  const digits = useDigits();
  const auto = 'plx-tp' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState<string | null>(null);   // the text while typing; null shows the value
  const [active, setActive] = React.useState(0);
  const wrap = React.useRef<HTMLDivElement | null>(null), input = React.useRef<HTMLInputElement | null>(null), list = React.useRef<HTMLUListElement | null>(null);
  // the list opens in the top layer, placed against the field by the floating layer (flips up near an edge, follows scroll and resize): no dialog, drawer or scroll area clips it
  useFloating(wrap, list, { open, placement: 'bottom-start', matchWidth: true });
  React.useLayoutEffect(() => { const el = list.current; if (open && TOP_LAYER && el && el.showPopover && !el.matches(':popover-open')) el.showPopover(); }, [open]);
  React.useImperativeHandle(ref, () => input.current as HTMLInputElement);
  const times: number[] = [];
  for (let n = Math.ceil(lo / step) * step; n <= hi; n += step) times.push(n);
  const mins = toMin(current);
  const nearest = (n: number | null) => { if (n === null || !times.length) return 0; let best = 0; times.forEach((x, i) => { if (Math.abs(x - n) < Math.abs(times[best] - n)) best = i; }); return best; };
  const openAt = (n: number | null) => { if (locked) return; setActive(nearest(n)); setOpen(true); };
  React.useEffect(() => {
    if (!open) return undefined;
    const off = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', off);
    return () => document.removeEventListener('mousedown', off);
  }, [open]);
  React.useEffect(() => {
    if (!open || !list.current) return;
    const o = list.current.querySelector('[data-plx-index="' + active + '"]');
    if (o && o.scrollIntoView) o.scrollIntoView({ block: 'nearest' });
  }, [open, active]);
  const settle = () => {
    if (text === null) return;
    const n = text.trim() ? parseTime(text, cycle) : null;
    if (n !== null || !text.trim()) commit(n);
    setText(null);
  };
  const choose = (i: number) => { commit(times[i]); setText(null); setOpen(false); };
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const perHour = Math.max(1, Math.round(60 / step));
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) openAt(text !== null ? parseTime(text, cycle) : mins); else setActive((a) => Math.min(times.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (!open) openAt(mins); else setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'PageDown' && open) { e.preventDefault(); setActive((a) => Math.min(times.length - 1, a + perHour)); }
    else if (e.key === 'PageUp' && open) { e.preventDefault(); setActive((a) => Math.max(0, a - perHour)); }
    else if (e.key === 'Enter') { if (open && text === null && times[active] !== undefined) { e.preventDefault(); choose(active); } else { settle(); setOpen(false); } }
    else if (e.key === 'Escape') { if (open) { e.preventDefault(); setOpen(false); } else if (text !== null) { e.preventDefault(); setText(null); } }
  };
  const optId = (i: number) => auto + '-o' + i;
  const shownText = text !== null ? text : show(mins, cycle, t, digits);
  const cut = useTruncated(input, shownText);   // the time is cut (issue 558): its full text goes in a Tooltip on hover and focus
  return (
    <div ref={wrap} className={cls}>
      <div className="plx-time-picker__field plx-input" aria-invalid={invalid || undefined} data-plx-warning={warning || undefined}>
        <Tooltip content={shownText} disabled={!cut || !shownText || open} describe={false} className="plx-time-picker__tip">
          <input ref={input} id={id} className="plx-time-picker__input" role="combobox" aria-expanded={open} aria-controls={auto + '-list'} aria-autocomplete="none"
            aria-activedescendant={open && times[active] !== undefined ? optId(active) : undefined} aria-label={label} disabled={disabled} readOnly={locked || undefined} aria-readonly={locked || undefined} autoComplete="off" inputMode="text"
            value={shownText} placeholder={cycle === '12' ? '9:00 ' + t.am : '09:00'}
            onChange={(e) => { setText(e.target.value); const n = parseTime(e.target.value, cycle); if (n !== null) setActive(nearest(n)); }}
            onBlur={() => { settle(); }} onClick={() => { if (!open && !disabled) openAt(mins); }} onKeyDown={onKey} {...rest} />
        </Tooltip>
        <span className="plx-time-picker__icon" aria-hidden="true"><Icon icon={ScheduleIcon} filled={false} /></span>
      </div>
      {open ? (
        <ul ref={list} className="plx-time-picker__list" id={auto + '-list'} role="listbox" popover={TOP_LAYER ? 'manual' : undefined} onMouseDown={(e) => e.preventDefault()} aria-label={label ? label + ', ' + t.times : t.times}>
          {times.map((n, i) => (
            <li key={n} id={optId(i)} data-plx-index={i} role="option" aria-selected={n === mins}
              className={cx('plx-time-picker__option', i === active && 'is-active', n === mins && 'is-selected')}
              onMouseDown={(e) => e.preventDefault()} onClick={() => choose(i)} onMouseEnter={() => setActive(i)}>{show(n, cycle, t, digits)}</li>
          ))}
        </ul>
      ) : null}
      {hidden}
    </div>
  );
});

const Segments = React.forwardRef<HTMLSpanElement | null, Inner>(function Segments({ t, cycle, step, current, commit, lo, hi, label, invalid, warning, disabled, locked, id, cls, hidden, rest }, ref) {
  const digits = useDigits();
  const mins = toMin(current);
  // the parts being edited: hour on the clock shown (1–12 or 0–23), minute, period ('am' | 'pm'); null = empty
  const fromValue = (): Parts => (mins === null ? { h: null, m: null, p: null }
    : { h: cycle === '12' ? (Math.floor(mins / 60) % 12) || 12 : Math.floor(mins / 60), m: mins % 60, p: Math.floor(mins / 60) < 12 ? 'am' : 'pm' });
  const [parts, setParts] = React.useState<Parts>(fromValue);
  const typed = React.useRef('');
  React.useEffect(() => { setParts(fromValue()); }, [current, cycle]);
  const refs = [React.useRef<HTMLSpanElement | null>(null), React.useRef<HTMLSpanElement | null>(null), React.useRef<HTMLSpanElement | null>(null)];
  React.useImperativeHandle(ref, () => refs[0].current as HTMLSpanElement);
  const segs: Seg[] = cycle === '12' ? ['h', 'm', 'p'] : ['h', 'm'];
  const update = (next: Parts) => {
    setParts(next);
    const full = next.h !== null && next.m !== null && (cycle !== '12' || next.p !== null);
    if (full) { const h24 = cycle === '12' ? ((next.h as number) % 12) + (next.p === 'pm' ? 12 : 0) : (next.h as number); commit(h24 * 60 + (next.m as number)); }
    else if (next.h === null && next.m === null && (cycle !== '12' || next.p === null)) commit(null);
  };
  const range: Record<'h' | 'm', [number, number]> = { h: cycle === '12' ? [1, 12] : [0, 23], m: [0, 59] };
  const move = (i: number) => { const el = refs[Math.max(0, Math.min(segs.length - 1, i))].current; if (el) el.focus(); };
  const onKey = (k: Seg, i: number) => (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;
    const n = Object.assign({}, parts);
    if (locked && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') { if (/^(ArrowUp|ArrowDown|Home|End|Backspace|Delete|\d|[apAP])$/.test(e.key)) e.preventDefault(); return; }
    const wrapAround = (v: number | null, d: number, a: number, b: number, s: number) => { const span = b - a + 1; return ((((v === null ? (d > 0 ? a - s : b + 1) : v) - a + d * s) % span) + span) % span + a; };
    if (e.key === 'ArrowLeft') { e.preventDefault(); move(i - 1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); move(i + 1); return; }
    if (k === 'p') {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); n.p = n.p === 'am' ? 'pm' : 'am'; update(n); }
      else if (/^[ap]$/i.test(e.key)) { e.preventDefault(); n.p = e.key.toLowerCase() === 'a' ? 'am' : 'pm'; update(n); }
      else if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); n.p = null; update(n); }
      return;
    }
    const [a, b] = range[k], s = k === 'm' ? step : 1;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); typed.current = ''; n[k] = wrapAround(n[k], e.key === 'ArrowUp' ? 1 : -1, a, b, s); if (k === 'm') n.m = Math.floor((n.m as number) / s) * s; update(n); }
    else if (e.key === 'Home') { e.preventDefault(); n[k] = a; update(n); }
    else if (e.key === 'End') { e.preventDefault(); n[k] = k === 'm' ? Math.floor(b / s) * s : b; update(n); }
    else if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); typed.current = ''; n[k] = null; update(n); }
    else if (/^\d$/.test(e.key)) {
      e.preventDefault();
      const tryText = typed.current + e.key;
      let v = +tryText;
      if (v > b) { v = +e.key; typed.current = e.key; } else typed.current = tryText;
      n[k] = v; update(n);
      if (typed.current.length >= 2 || v * 10 > b) { typed.current = ''; move(i + 1); }
    }
  };
  const lbl: Record<Seg, string> = { h: t.hour, m: t.minute, p: t.period };
  const text = (k: Seg) => (parts[k] === null ? t.empty : k === 'p' ? (parts.p === 'am' ? t.am : t.pm) : localDigits(k === 'h' && cycle === '12' ? String(parts.h) : pad(parts[k]), { digits }));
  return (
    <div className={cls}>
      <div role="group" aria-label={label} className="plx-time-picker__field plx-time-picker__segments plx-input" aria-invalid={invalid || undefined} data-plx-warning={warning || undefined} {...rest}>
        {segs.map((k, i) => (
          <React.Fragment key={k}>
            {k === 'm' ? <span className="plx-time-picker__separator" aria-hidden="true">:</span> : null}
            <span ref={refs[i]} id={i === 0 ? id : undefined} role="spinbutton" tabIndex={disabled ? -1 : 0} aria-label={lbl[k]} aria-disabled={disabled || undefined} aria-readonly={locked || undefined}
              aria-invalid={invalid || undefined} data-plx-warning={warning || undefined}
              aria-valuemin={k === 'p' ? undefined : range[k][0]} aria-valuemax={k === 'p' ? undefined : range[k][1]}
              aria-valuenow={k === 'p' || parts[k] === null ? undefined : parts[k]} aria-valuetext={parts[k] === null ? undefined : text(k)}
              className={cx('plx-time-picker__segment', k === 'p' && 'plx-time-picker__segment--period', parts[k] === null && 'is-empty')}
              onKeyDown={onKey(k, i)} onBlur={() => { typed.current = ''; }}>{text(k)}</span>
          </React.Fragment>
        ))}
        <span className="plx-time-picker__icon" aria-hidden="true"><Icon icon={ScheduleIcon} filled={false} /></span>
      </div>
      {hidden}
    </div>
  );
});
