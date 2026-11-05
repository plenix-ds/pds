/* Plenix · TimeZoneSelect
   Summary: A field for choosing a time zone (05 Forms › Date, time, and color › Time-zone selector): a combobox over
     every IANA time zone the browser knows (Intl.supportedValuesOf), each with its city, its region and its offset from
     UTC, filtered as people type a city, a region, a zone name ("Pacific") or an offset ("+5:30").
   Usage:
     <Field label="Time zone"><TimeZoneSelect value={zone} onChange={setZone} /></Field>
     <TimeZoneSelect label="Time zone" grouped={false} value={zone} onChange={setZone} />          // one list by offset
     <TimeZoneSelect label="Time zone" zones={['Europe/Berlin', 'America/New_York', 'Asia/Tokyo']} … />
     timeZoneOptions({ date })   // the options themselves: [{ value, label, region, offset, minutes, name }]
   Props:
     value: the chosen zone, an IANA name ("America/Los_Angeles")
     onChange(zone): runs with the chosen zone's IANA name
     grouped: list the zones under their region (Africa, Americas, Asia…), by city (default true); false lists them in
       one list ordered by offset, west to east
     Digits: in Arabic the offsets are written Arabic-Indic; typing Arabic-Indic digits finds the same zones (owner, arabic-digits-35)
     showOffset: each zone's offset from UTC ("UTC−08:00") at the end of its option and of the field (default true)
     zones: the IANA names to offer (default: every zone the browser supports, and UTC)
     date: the moment the offsets are for (default now): offsets change with daylight saving time
     placeholder: the hint in the empty field (default "Choose a time zone")
     label: the accessible name when there is no Field
     invalid: shows the invalid state
     warning: true shows a warning state beside invalid (a Field with a warning sets it): a warning border and fill; the Field draws its icon and message
     readOnly: shows the chosen zone and does not open the list or change it; default the nearest ReadOnly region's (useReadOnly)
     disabled: the field cannot be used
     locale: the language of the zone names (default the page's language)
     strings: the words it shows and announces, for other languages: { placeholder, empty: "No matches", utc: "Coordinated
       Universal Time", other: "Other", results: (n) => n + " time zones", regions: { America: "Americas", … } }
     id: the id of the input (a Field sets it)
     className: more classes on the field
     ref: forwarded to the <input>; other props pass through to it
   Behavior:
     The list opens in the browser's top layer like the Combobox's: no dialog, drawer or scroll area clips it.
     The Combobox's behavior and look (its classes and tokens): the list opens on focus and on typing; ↓ and ↑ move,
     Enter chooses, Escape closes, a click outside closes. The active option stays in view.
     Typing filters by city, region, IANA name, the zone's long name in the reader's language and the offset; the number
       of matches is announced politely.
     Closed, the field shows the chosen city with its offset after it.
     A value the browser lists under another IANA name (Asia/Kolkata, listed as Asia/Calcutta) takes that zone’s place.
   Notes:
     Offsets are technical values: the data font (Reddit Mono). The city comes from the IANA name ("Buenos Aires, Argentina");
     the long name ("Pacific Standard Time") is only searched, never shown, so the list stays short.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { formatLocale, formatNumber } from '../../utils/format.ts';
import { localDigits, toLatinDigits } from '../../utils/digits.ts';
import { useDigits } from '../../providers/LocaleProvider.tsx';
import { Isolate } from '../Isolate/Isolate.tsx';
import { announce } from '../../utils/announce.tsx';
import { useFloating, TOP_LAYER } from '../../utils/floating.ts';

import { useStrings, useLocale, createTranslator } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { useReadOnly } from '../../providers/ReadOnly.tsx';
import SelectChevronIcon from 'plenix-platform/icons/plenix/select-chevron';

// a few zones for browsers without Intl.supportedValuesOf
const FALLBACK = ['America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York', 'America/Sao_Paulo', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
  'Africa/Cairo', 'Africa/Johannesburg', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Tokyo', 'Australia/Sydney', 'Pacific/Auckland'];
const MINUS = '−';

// the zone's offset from UTC at the date: minutes and "UTC−08:00"
type Words = { other: string; utc: string; regions: Record<string, string>; results?: (n: number) => string; empty: string; placeholder: string };
type ZoneOption = { value: string; label: string; region: string; offset: string; minutes: number; name: string; search?: string };
function offsetOf(zone: string, date: Date) {
  try {
    const part = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'longOffset' }).formatToParts(date).find((p) => p.type === 'timeZoneName');
    const m = /GMT([+-])(\d{2}):(\d{2})/.exec(part ? part.value : '');
    if (!m) return { minutes: 0, text: 'UTC±00:00' };
    const minutes = (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
    return { minutes, text: 'UTC' + (m[1] === '-' ? MINUS : '+') + m[2] + ':' + m[3] };
  } catch (e) { return { minutes: 0, text: 'UTC±00:00' }; }
}
function longName(zone: string, date: Date, locale: string) {
  try { const p = new Intl.DateTimeFormat(locale, { timeZone: zone, timeZoneName: 'long' }).formatToParts(date).find((x) => x.type === 'timeZoneName'); return p ? p.value : ''; } catch (e) { return ''; }
}

// Called directly (outside a component), it reads the page's language (formatLocale), not a LocaleProvider's catalogs; TimeZoneSelect passes its own words in strings.
type ZoneOptionsInput = { zones?: string[]; date?: Date; locale?: string; strings?: Record<string, unknown> | null };
export function timeZoneOptions({ zones, date = new Date(), locale, strings }: ZoneOptionsInput = {}): ZoneOption[] {
  // not a hook (it is exported, and the component calls it inside useMemo): the words are the locale's catalog section with strings on top
  const lang = locale || formatLocale();
  const t = Object.assign({}, createTranslator(lang).section('timeZoneSelect'), strings) as unknown as Words;
  const regions = t.regions;
  const all: string[] = zones || (typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : FALLBACK);
  const list = all.indexOf('UTC') >= 0 || zones ? all : ['UTC'].concat(all);
  return list.map((zone) => {
    const parts = zone.split('/');
    const utc = zone === 'UTC' || parts[0] === 'Etc';
    const region = utc ? t.other : regions[parts[0]] || (parts.length > 1 ? parts[0] : t.other);
    const label = zone === 'UTC' ? t.utc : parts.length > 1 ? parts.slice(1).reverse().join(', ').replace(/_/g, ' ') : zone.replace(/_/g, ' ');
    const off = offsetOf(zone, date);
    return { value: zone, label, region, offset: off.text, minutes: off.minutes, name: longName(zone, date, lang) };
  });
}

// the search text: an offset typed as "+5", "-08", "5:30" or "utc+1" matches "UTC+05:00"
const fold = (s: unknown) => toLatinDigits(String(s)).toLowerCase().replace(/[\u2212\u2013]/g, '-').replace(/_/g, ' ');
const offsetKeys = (o: ZoneOption) => { const sign = o.minutes < 0 ? '-' : '+', a = Math.abs(o.minutes), h = Math.floor(a / 60), m = a % 60;
  return [fold(o.offset), sign + h, sign + String(h).padStart(2, '0'), sign + h + ':' + String(m).padStart(2, '0'), 'utc' + sign + h, 'gmt' + sign + h].join(' '); };

/** @public the prop type (ADR 0011) */
export type TimeZoneSelectProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  /** the chosen zone, an IANA name ("Africa/Cairo") */
  value?: string;
  onChange?: (zone: string) => void;
  /** group the list by region (default true); false sorts by offset */
  grouped?: boolean;
  /** show each zone's UTC offset (default true) */
  showOffset?: boolean;
  /** the zones to offer (default: the browser's list) */
  zones?: string[];
  /** the day the offsets are read for (default today) */
  date?: Date | string | number;
  placeholder?: string;
  /** the accessible name */
  label?: string;
  invalid?: boolean;
  warning?: string | boolean;
  readOnly?: boolean;
  /** the language of the names (default the page's) */
  locale?: string;
  strings?: Catalog | null;
  className?: string;
};

export const TimeZoneSelect = React.forwardRef<HTMLInputElement | null, TimeZoneSelectProps>(function TimeZoneSelect({ value, onChange, grouped = true, showOffset = true, zones, date, placeholder,
  label, invalid, warning, disabled, readOnly, locale, strings, id, className, ...rest }, ref) {
  const locked = useReadOnly(readOnly);
  const t = useStrings('timeZoneSelect', strings) as unknown as Words;
  const loc = useLocale();
  const digits = useDigits();
  const auto = 'plx-tz' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const listId = auto + '-list';
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const [active, setActive] = React.useState(0);
  const wrap = React.useRef<HTMLDivElement | null>(null), input = React.useRef<HTMLInputElement | null>(null), list = React.useRef<HTMLUListElement | null>(null);
  // the list opens in the top layer, placed against the field by the floating layer (flips up near an edge, follows scroll and resize): no dialog, drawer or scroll area clips it
  useFloating(wrap, list, { open: open, placement: 'bottom-start', matchWidth: true });
  React.useLayoutEffect(() => { const el = list.current; if (open && TOP_LAYER && el && el.showPopover && !el.matches(':popover-open')) el.showPopover(); }, [open]);
  React.useImperativeHandle(ref, () => input.current as HTMLInputElement);
  const day = date ? new Date(date).toDateString() : new Date().toDateString();
  const zoneKey = zones ? zones.join('|') : '';
  // the options for the day (offsets change with daylight saving time), sorted: by region then city, or by offset
  const options = React.useMemo(() => {
    const at = date ? new Date(date) : new Date();
    const out = timeZoneOptions({ zones, date: at, locale, strings: t });
    // a value the browser lists under another name (Asia/Kolkata, listed as Asia/Calcutta) takes that zone's place
    if (value && !out.some((o) => o.value === value)) {
      let canonical: string | null = null;
      try { canonical = new Intl.DateTimeFormat('en-US', { timeZone: value }).resolvedOptions().timeZone; } catch (e) { canonical = null; }
      if (canonical) {
        const own = timeZoneOptions({ zones: [value], date: at, locale, strings: t })[0];
        const i = out.findIndex((o) => o.value === canonical);
        if (i >= 0) out[i] = own; else out.push(own);
      }
    }
    out.forEach((o) => { o.search = [fold(o.label), fold(o.region), fold(o.value), fold(o.name), offsetKeys(o)].join(' '); });
    const byName = (a: ZoneOption, b: ZoneOption) => a.label.localeCompare(b.label, locale || formatLocale());
    return grouped
      ? out.sort((a, b) => Number(a.region === t.other) - Number(b.region === t.other) || a.region.localeCompare(b.region) || byName(a, b))
      : out.sort((a, b) => a.minutes - b.minutes || byName(a, b));
  }, [day, zoneKey, locale, loc.locale, grouped, value]);   // eslint-disable-line react-hooks/exhaustive-deps
  const current = options.find((o) => o.value === value) || null;
  const q = fold(text.trim());
  const shown = q ? options.filter((o) => q.split(/\s+/).every((w) => (o.search as string).indexOf(w) >= 0)) : options;
  React.useEffect(() => { if (open && q) announce(typeof t.results === 'function' ? t.results(shown.length) : loc.t('timeZoneSelect.results', { count: shown.length, n: formatNumber(shown.length) })); }, [q, open]);   // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (!open) return undefined;
    const off = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) { setOpen(false); setText(''); } };
    document.addEventListener('mousedown', off);
    return () => document.removeEventListener('mousedown', off);
  }, [open]);
  // opening starts on the chosen zone; typing starts on the first match
  React.useEffect(() => { if (open) setActive(q ? 0 : Math.max(0, shown.findIndex((o) => o.value === value))); }, [q, open]);   // eslint-disable-line react-hooks/exhaustive-deps
  const optId = (i: number) => auto + '-o' + i;
  React.useEffect(() => {
    if (!open || !list.current) return;
    const el = list.current.querySelector('#' + optId(active));
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }, [active, open]);   // eslint-disable-line react-hooks/exhaustive-deps
  const choose = (o?: ZoneOption) => { if (!o || locked) return; if (onChange) onChange(o.value); setText(''); setOpen(false); };
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (locked && e.key !== 'Tab' && e.key !== 'Escape') { if (!e.ctrlKey && !e.metaKey && !e.altKey) e.preventDefault(); return; }   // read-only: no keys open the list or choose
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); else setActive((a) => Math.min(shown.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Home' && open && !text) { e.preventDefault(); setActive(0); }
    else if (e.key === 'End' && open && !text) { e.preventDefault(); setActive(shown.length - 1); }
    else if (e.key === 'Enter') { if (open && shown[active]) { e.preventDefault(); choose(shown[active]); } }
    else if (e.key === 'Escape') { if (open) { e.preventDefault(); setOpen(false); setText(''); } }
  };
  return (
    <div ref={wrap} className={cx('plx-combobox', 'plx-time-zone-select', open && 'is-open', disabled && 'is-disabled', className)}>
      <div className="plx-combobox__field plx-input" aria-invalid={invalid || undefined} data-plx-warning={warning || undefined}>
        <input ref={input} id={id} className="plx-combobox__input" role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list"
          aria-activedescendant={open && shown[active] ? optId(active) : undefined} aria-label={label} disabled={disabled} autoComplete="off"
          aria-description={current && showOffset ? localDigits(current.offset, { digits }) : undefined}
          value={open ? text : (current ? current.label : '')} placeholder={current && open ? current.label : (placeholder || t.placeholder)}
          readOnly={locked || undefined} aria-readonly={locked || undefined}
          onChange={(e) => { if (locked) return; setText(e.target.value); setOpen(true); }} onFocus={() => { if (!locked) setOpen(true); }} onKeyDown={onKey} {...rest} />
        {showOffset && current && !open ? <span className="plx-time-zone-select__field-offset" aria-hidden="true"><Isolate>{current.offset}</Isolate></span> : null}
        <span className="plx-combobox__chevron" aria-hidden="true"><Icon icon={SelectChevronIcon} filled={false} /></span>
      </div>
      {open ? (
        <ul ref={list} className="plx-combobox__list plx-time-zone-select__list" id={listId} role="listbox" aria-label={label} popover={TOP_LAYER ? 'manual' : undefined} onMouseDown={(e) => e.preventDefault()}>
          {shown.length ? shown.map((o, i) => [
            grouped && (i === 0 || shown[i - 1].region !== o.region) ? <li key={'g-' + o.region} className="plx-combobox__group" role="presentation">{o.region}</li> : null,
            <li key={o.value} id={optId(i)} role="option" aria-selected={o.value === value}
              className={cx('plx-combobox__option', 'plx-time-zone-select__option', i === active && 'is-active', o.value === value && 'is-selected')}
              onMouseDown={(e) => e.preventDefault()} onClick={() => choose(o)} onMouseEnter={() => setActive(i)}>
              <span className="plx-time-zone-select__city">{o.label}</span>
              {showOffset ? <span className="plx-time-zone-select__offset"><Isolate>{o.offset}</Isolate></span> : null}
            </li>])
            : <li className="plx-combobox__empty" role="presentation">{t.empty}</li>}
        </ul>
      ) : null}
    </div>
  );
});
