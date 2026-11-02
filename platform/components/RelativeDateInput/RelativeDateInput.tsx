/* Plenix · RelativeDateInput, resolveRelativeDate
   Summary: A date range relative to today, for filters, saved searches and rules that must stay right as time passes:
     a preset (Last 7 days, Next 30 days) or a custom amount and unit, with the dates it means today written under it.
   Usage:
     <Field label="Modified"><RelativeDateInput value={when} onChange={setWhen} /></Field>
     <RelativeDateInput direction="future" value={due} onChange={setDue} label="Due" />
     <RelativeDateInput value={{ direction: 'past', amount: 3, unit: 'month' }} onChange={setWhen} label="Created" />
     const { from, to } = resolveRelativeDate(when);   // the dates it means today
   Props:
     value: the choice: a preset id ("today", "last-7-days" …) or { direction: "past" | "future", amount, unit: "day" |
       "week" | "month" | "year" } for a custom range; "" for none
     defaultValue: the choice it starts with, uncontrolled
     onChange(value, range): runs with the new value and the dates it means today ({ from, to }, Date objects)
     direction: "past" (default: Today, Yesterday, Last 7 days …) | "future" (Today, Tomorrow, Next 7 days …) | "both"
       (both lists): which presets are offered, and the custom range's direction
     presets: the preset ids to offer, in order (default by direction; see RELATIVE_PRESETS)
     now: the date counted from (default: today), for tests and examples
     label: the accessible name when there is no Field
     invalid, disabled: the field's states (a Field sets invalid with its error)
     warning: true shows a warning state beside invalid (a Field with a warning sets it): a warning border and fill; the Field draws its icon and message
     id: the id of the preset select (a Field sets it)
     strings: the words it shows, for other languages: { custom: "Custom", none: "Any time", amount: "Amount", unit:
       "Unit", past: "Last", future: "Next", units: { day: ["day", "days"], … }, presets: { "last-7-days": "Last 7 days", … },
       range: "{range}" }
     className: more classes on the input
   Behavior:
     The preset is a Select; choosing Custom shows, in the same row, the direction (with direction "both"), a number
       input for the amount (NumberInput, 1 to 999, in the data font) and a Select of the unit. Every part has its own name.
     The dates the choice means today are written under it in the data font ("Mar 1 – Mar 7, 2026") and read as the
       control's description, so people can check them; they are worked out again each day (the value stays relative).
     Ranges count whole days: the past ones end today, the future ones start today; "last 7 days" is today and the six
       days before.
   Notes:
     Store the value (the preset id or the custom object), never the resolved dates: they change every day.
     For one fixed date, use a date picker.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useDescribedBy } from '../../utils/describedBy.ts';
import { Select } from '../Input/Input.tsx';
import type { SelectProps } from '../Input/Input.tsx';
import { NumberInput } from '../NumberInput/NumberInput.tsx';
import { formatRange, formatDate } from '../../utils/format.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';

// presets: [id, direction, amount, unit, offset] (offset: whole units before or after today, for yesterday and tomorrow)
export const RELATIVE_PRESETS: Record<string, [string, number, string, number?]> = {
  today: ['both', 0, 'day'], yesterday: ['past', 1, 'day', 1], 'last-7-days': ['past', 7, 'day'], 'last-30-days': ['past', 30, 'day'],
  'last-90-days': ['past', 90, 'day'], 'last-12-months': ['past', 12, 'month'], tomorrow: ['future', 1, 'day', 1], 'next-7-days': ['future', 7, 'day'],
  'next-30-days': ['future', 30, 'day'], 'next-90-days': ['future', 90, 'day'], 'next-12-months': ['future', 12, 'month'],
};
const DEFAULT_PRESETS: Record<string, string[]> = { past: ['today', 'yesterday', 'last-7-days', 'last-30-days', 'last-90-days', 'last-12-months'],
  future: ['today', 'tomorrow', 'next-7-days', 'next-30-days', 'next-90-days', 'next-12-months'] };
DEFAULT_PRESETS.both = DEFAULT_PRESETS.past.concat(DEFAULT_PRESETS.future.slice(1));
const UNITS = ['day', 'week', 'month', 'year'];
const CUSTOM = 'custom';

// a custom value: { direction, amount, unit }; a preset is its id ("last-7-days")
export type RelativeDateCustom = { direction: 'past' | 'future'; amount: number; unit: 'day' | 'week' | 'month' | 'year' };
export type RelativeDateValue = string | RelativeDateCustom;
export type RelativeDateRange = { from: Date; to: Date };
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const add = (d: Date, unit: string, n: number) => {
  const x = new Date(d.getTime());
  if (unit === 'day') x.setDate(x.getDate() + n);
  else if (unit === 'week') x.setDate(x.getDate() + 7 * n);
  else if (unit === 'month') x.setMonth(x.getMonth() + n);
  else if (unit === 'year') x.setFullYear(x.getFullYear() + n);
  return x;
};
// the dates a relative value means, counted from now: { from, to } (whole days, Date objects at the start of each day)
export function resolveRelativeDate(value: RelativeDateValue | null | undefined, now?: Date | string | number | null): RelativeDateRange | null {
  const today = startOfDay(now ? new Date(now) : new Date());
  if (!value) return null;
  let dir: string, amount: number, unit: string, offset = 0;
  if (typeof value === 'string') { const p = RELATIVE_PRESETS[value]; if (!p) return null; [dir, amount, unit, offset] = [p[0], p[1], p[2], p[3] || 0]; }
  else { dir = value.direction; amount = Math.max(1, Math.round(+value.amount || 1)); unit = UNITS.indexOf(value.unit) >= 0 ? value.unit : 'day'; }
  if (offset) { const d = add(today, unit, dir === 'past' ? -offset : offset); return { from: d, to: d }; }
  if (!amount) return { from: today, to: today };
  if (dir === 'future') return { from: today, to: add(add(today, unit, amount), 'day', -1) };
  return { from: add(add(today, unit, -amount), 'day', 1), to: today };
}

type RelativeDateWords = { none: string; custom: string; presets: Record<string, string>; direction: string; past: string; future: string; amount: string; unit: string; units: Record<string, [string, string]> };
export type RelativeDateInputProps = Omit<SelectProps, 'value' | 'defaultValue' | 'onChange'> & {
  value?: RelativeDateValue;
  defaultValue?: RelativeDateValue;
  /** the value and the dates it means today */
  onChange?: (value: RelativeDateValue, range: RelativeDateRange | null) => void;
  direction?: 'past' | 'future' | 'both';
  /** the preset ids offered */
  presets?: string[];
  /** the moment counted from (default now) */
  now?: Date | string | number | null;
  /** the accessible name */
  label?: string;
  strings?: Catalog | null;
};
export const RelativeDateInput = React.forwardRef(function RelativeDateInput({ value, defaultValue = '', onChange, direction = 'past', presets, now, label,
  invalid, warning, disabled, id, strings, className, 'aria-describedby': describedBy, ...rest }: RelativeDateInputProps, ref: React.ForwardedRef<HTMLSelectElement>) {
  const t = useStrings('relativeDateInput', strings) as RelativeDateWords;   // units and presets merge key by key
  const auto = 'plx-rd' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const [own, setOwn] = React.useState<RelativeDateValue>(defaultValue);
  const current = value !== undefined ? value : own;
  const custom = current && typeof current === 'object';
  const list = presets || DEFAULT_PRESETS[direction] || DEFAULT_PRESETS.past;
  const set = (v: RelativeDateValue) => { if (value === undefined) setOwn(v); if (onChange) onChange(v, resolveRelativeDate(v, now)); };
  const range = resolveRelativeDate(current, now);
  const rangeText = range ? (range.from.getTime() === range.to.getTime() ? formatDate(range.from, { dateStyle: 'medium' }) : formatRange(range.from, range.to)) : '';
  const customDir = direction === 'future' ? 'future' : 'past';
  const onPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    if (v === CUSTOM) set({ direction: custom ? (current as RelativeDateCustom).direction : customDir, amount: custom ? (current as RelativeDateCustom).amount : 7, unit: custom ? (current as RelativeDateCustom).unit : 'day' });
    else set(v);
  };
  const part = (k: string, v: unknown) => set(Object.assign({}, current, { [k]: v }) as RelativeDateValue);
  const amount = custom ? (current as RelativeDateCustom).amount : 7;
  const options = [{ value: '', label: t.none }].concat(list.map((p) => ({ value: p, label: t.presets[p] || p })), [{ value: CUSTOM, label: t.custom }]);
  const descr = useDescribedBy(range ? auto + '-range' : null, describedBy);   // the resolved range, then what its owner (a Field) described
  return (
    <div className={cx('plx-relative-date-input', custom && 'plx-relative-date-input--custom', className)}>
      <div className="plx-relative-date-input__row" role="group" aria-label={label}>
        <Select ref={ref} id={id} className="plx-relative-date-input__preset" value={custom ? CUSTOM : (current as string) || ''} onChange={onPreset} options={options}
          aria-label={label} invalid={invalid} warning={warning} disabled={disabled} aria-describedby={descr} {...rest} />
        {custom ? (
          <React.Fragment>
            {direction === 'both' ? <Select className="plx-relative-date-input__direction" value={(current as RelativeDateCustom).direction} aria-label={t.direction} disabled={disabled}
              options={[{ value: 'past', label: t.past }, { value: 'future', label: t.future }]} onChange={(e) => part('direction', e.target.value)} /> : null}
            <NumberInput className="plx-relative-date-input__amount" min={1} max={999} step={1} decimals={0} width="xs" value={amount} aria-label={t.amount}
              disabled={disabled} invalid={invalid} warning={warning} aria-describedby={descr}
              onChange={(n) => { if (n !== null && n >= 1) part('amount', Math.min(999, Math.round(n))); }} />
            <Select className="plx-relative-date-input__unit" value={(current as RelativeDateCustom).unit} aria-label={t.unit} disabled={disabled}
              options={UNITS.map((u) => ({ value: u, label: t.units[u][+amount === 1 ? 0 : 1] }))} onChange={(e) => part('unit', e.target.value)} />
          </React.Fragment>
        ) : null}
      </div>
      {range ? <p className="plx-relative-date-input__range" id={auto + '-range'}>{rangeText}</p> : null}
    </div>
  );
});
