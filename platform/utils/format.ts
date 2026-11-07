/* Plenix · Formatting (platform/utils/format.ts)
   Summary: Numbers, units, dates, times, money, percentages, names, addresses and phone numbers written the same way on
     every page, in the reader's locale, on the browser's Intl formatters (NumberFormat, DateTimeFormat,
     RelativeTimeFormat, ListFormat, DisplayNames). The rules (precision, when relative time ends, address layouts, phone
     groupings) are the Formats standard, platform/standards/formats.json; FORMATS below is the same data (the format test
     keeps the two equal).
   Usage:
     formatNumber(1234.5)                         // "1,234.5"
     formatBytes(1200000)                         // "1.2 MB"
     formatCompact(1234)                          // "1.2K"
     formatDate(date, { dateStyle: 'long' })          // "March 4, 2026"
     formatRelative(date)                         // "5 minutes ago" (an absolute date after 7 days)
     formatCurrency(12.5, 'EUR')                  // "€12.50"
     formatPercent(0.256)                         // "26%"
     formatPhone('+14155550123')                  // "+1 415 555 0123"
   Props:
     every function takes an options object last; options.locale overrides the reader's locale (formatLocale())
     formatLocale(): the page's language (<html lang>), else the browser's, else "en-US"
     digitsOf(locale): "arab" (Arabic-Indic ٠-٩) for Arabic locales, else "latn"; an explicit -u-nu-latn keeps Latin (owner, arabic-digits-35)
     numeralLocale(locale, digits): the locale tag with its digits explicit (-u-nu-arab), for Intl; every format function here uses it
     formatNumber(value, { decimals, signed }): a plain number; decimals fixes the precision (keep it the same in a column)
     formatUnit(value, unit, { display, decimals }): a measurement with an Intl unit ("kilometer", "celsius", "megabyte");
       display "short" (default), "long" or "narrow"
     formatBytes(bytes, { decimals }): a file size in B, kB, MB, GB or TB (powers of 1000)
     formatDuration(seconds, { display }): "1 hr, 5 min" (display "short", default), "1 hour, 5 minutes" ("long") or "1:05:00" ("clock")
     formatCompact(value, { decimals }): "1.2K", "3.4M": only where space is tight, with the full value beside it (title, tooltip)
     formatDate(date, { dateStyle, timeZone }): dateStyle "short" ("Mar 4"; the year when it is not this year), "medium"
       ("Mar 4, 2026", default), "long" ("March 4, 2026") or "full" ("Wednesday, March 4, 2026")
     formatTime(date, { seconds, timeZone, timeZoneName }): "2:05 PM"; timeZoneName "short" adds the zone ("2:05 PM PST")
     formatDateTime(date, { dateStyle, timeZone, timeZoneName }): the date (medium) and the time together
     formatRelative(date, { now, untilDays }): "5 minutes ago", "in 2 days", "yesterday"; after untilDays (FORMATS) the date
     formatRange(from, to, { kind, dateStyle }): two dates ("Mar 4 – 6, 2026", kind "date", default) or numbers ("3–5", kind "number")
     formatCurrency(amount, currency, { display, decimals, signed }): money in an ISO 4217 currency ("USD"); display
       "symbol" (default, "$12.50") or "code" ("USD 12.50", for pages that mix currencies)
     formatPercent(ratio, { decimals, signed }): a ratio as a percentage, 0.256 → "26%" (signed: "+3%", for changes)
     formatList(items, { type }): "A, B, and C"; type "conjunction" (default), "disjunction" ("A, B, or C") or "unit"
     formatPersonName(person, { display }): a name as the person wrote it; person is a string or { full, preferred };
       display "full" (default), "preferred" (the preferred name, else the full one) or "initials"
     formatAddress(address, { country, includeCountry }): the lines of a postal address in its country's order; address
       is { name, organization, street (a string or lines), locality, region, postalCode, country (ISO 3166 code) }
     regionName(code): a country's name in the reader's language ("DE" → "Germany")
     formatPhone(e164, { display }):a phone number stored as E.164 ("+14155550123"), "international" (default) or
       "national" ("(415) 555-0123")
     dateTimeAttr(date): the machine-readable value for <time dateTime={…}>
     parseDate(value): the Date every helper here reads: a Date as is, a date-only "YYYY-MM-DD" as that calendar day
       where the reader is (never midnight UTC, which is the day before in the Americas), else new Date(value); null when
       it is not a date. Components that read a date use it, so no component parses dates itself (issue 342). The owner's
       rule (2026-10-29, option A): one rule everywhere, so the charts' time axes, GanttChart, HeatMap and the filters
       read dates through it too
     isoDay(date): a date's calendar day where the reader is, as "YYYY-MM-DD" (its local parts, never toISOString, which
       is the UTC day: the day before east of UTC around midnight); internal, for the filters (utils/fields.ts)
     FORMATS: the standard's data (see platform/standards/formats.json)
   Behavior:
     Nothing is cached per locale beyond the Intl formatter objects; every call reads the locale unless one is given.
     Bare YYYY-MM-DD values represent local calendar dates; timestamps with a zone retain their instant.
     A value that is not a finite number or a valid date comes back as an empty string, never "NaN" or "Invalid Date".
   Notes:
     Never build a separator, a symbol position or a date order by hand: these functions are the only place they are made.
     Phone numbers and addresses follow FORMATS for the countries it lists; others fall back to a neutral layout.
*/

// The Formats standard (platform/standards/formats.json): edit both together; the format test compares them.
// what a formatter is given: a date, a date-only "YYYY-MM-DD", an ISO text or a time in milliseconds
export type DateInput = Date | string | number | null | undefined;
export type Digits = 'arab' | 'latn';
// the options the formatters share (each reads the ones it names in the header)
export type FormatOptions = {
  locale?: string; decimals?: number; signed?: boolean; display?: string;
  dateStyle?: 'short' | 'medium' | 'long' | 'full' | string; timeZone?: string; timeZoneName?: Intl.DateTimeFormatOptions['timeZoneName']; seconds?: boolean;
  now?: DateInput; untilDays?: number; kind?: 'number' | 'date'; type?: 'conjunction' | 'disjunction' | 'unit';
  country?: string; includeCountry?: boolean;
};
export type PersonName = { full?: string; preferred?: string };
export type Address = { name?: string; organization?: string; street?: string | string[]; locality?: string; region?: string; postalCode?: string; country?: string; [field: string]: unknown };
type FormatsStandard = {
  number: { decimals: { default: number; ratio: number; compact: number; bytes: number } };
  bytes: { base: number; units: string[] };
  relative: { untilDays: number };
  currency: { display: string; mixedDisplay: string };
  date: { default: string };
  address: Record<string, string[]> & { default: string[] };
  phone: Record<string, { national: string; international: string }>;
};
export const FORMATS: FormatsStandard = {
  number: { decimals: { default: 0, ratio: 0, compact: 1, bytes: 1 } },
  bytes: { base: 1000, units: ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'] },
  relative: { untilDays: 7 },
  currency: { display: 'symbol', mixedDisplay: 'code' },
  date: { default: 'medium' },
  address: {
    default: ['name', 'organization', 'street', 'locality region postalCode', 'country'],
    US: ['name', 'organization', 'street', 'locality, region postalCode', 'country'],
    CA: ['name', 'organization', 'street', 'locality region postalCode', 'country'],
    GB: ['name', 'organization', 'street', 'locality', 'postalCode', 'country'],
    DE: ['name', 'organization', 'street', 'postalCode locality', 'country'],
    FR: ['name', 'organization', 'street', 'postalCode locality', 'country'],
    IT: ['name', 'organization', 'street', 'postalCode locality region', 'country'],
    JP: ['country', 'postalCode', 'region locality', 'street', 'organization', 'name'],
  },
  phone: {
    '1': { national: '(###) ###-####', international: '+1 ### ### ####' },
    '33': { national: '0# ## ## ## ##', international: '+33 # ## ## ## ##' },
    '44': { national: '0#### ######', international: '+44 #### ######' },
    '49': { national: '0### #######', international: '+49 ### #######' },
    '61': { national: '0# #### ####', international: '+61 # #### ####' },
  },
};

const ok = (n: unknown): n is number => typeof n === 'number' && isFinite(n);
// A date-only value is a calendar date in the reader's zone, not midnight UTC (DT-7).
/** how a numeric timestamp counts: milliseconds (default) or seconds (Unix time); never guessed from the number's size (ADR 0028) */
export type Timestamp = 'ms' | 's';
// a numeric timestamp in seconds as milliseconds; every other value is unchanged
export const instantOf = (d: unknown, timestamp?: Timestamp): unknown => (timestamp === 's' && typeof d === 'number' ? d * 1000 : d);
export function parseDate(d: unknown, options?: { timestamp?: Timestamp }): Date | null {
  d = instantOf(d, options && options.timestamp);
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [year, month, day] = d.split('-').map(Number), x = new Date(0);
    x.setFullYear(year, month - 1, day); x.setHours(0, 0, 0, 0);
    return x.getFullYear() === year && x.getMonth() === month - 1 && x.getDate() === day ? x : null;
  }
  const x = d instanceof Date ? d : new Date(d as string | number); return isNaN(x.getTime()) ? null : x;
}
const toDate = parseDate;
// a date's calendar day where the reader is ("YYYY-MM-DD", from its local parts); "" when it is not a date
const pad2 = (n: number) => (n < 10 ? '0' : '') + n;
export function isoDay(date: unknown): string {
  const d = parseDate(date);
  return d ? String(d.getFullYear()).padStart(4, '0') + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) : '';
}

export function formatLocale(): string {
  const lang = typeof document !== 'undefined' && document.documentElement && document.documentElement.getAttribute('lang');
  if (lang) return lang;
  if (typeof navigator !== 'undefined' && navigator.language) return navigator.language;
  return 'en-US';
}
/* the digits a locale writes (owner, arabic-digits-35 and arabic-ids-35): Arabic text uses Arabic-Indic digits (٠-٩) everywhere,
   whichever Arabic region the tag names (the browser alone writes Latin digits for "ar" and "ar-AE"); an explicit -u-nu-latn keeps Latin */
export function digitsOf(locale?: string | null): Digits {
  try { const l = new Intl.Locale(locale || formatLocale()); return l.numberingSystem === 'latn' ? 'latn' : l.numberingSystem === 'arab' || l.language === 'ar' ? 'arab' : 'latn'; } catch (e) { return 'latn'; }
}
// the locale tag with its digits made explicit (-u-nu-arab or -u-nu-latn), for Intl; a language that is not Arabic is left as it is
export function numeralLocale(locale?: string | null, digits?: string | null): string {
  const tag = locale || formatLocale();
  try {
    const l = new Intl.Locale(tag), want = digits === 'arab' || digits === 'latn' ? digits : (l.language === 'ar' ? digitsOf(tag) : null);
    return want ? new Intl.Locale(l.toString(), { numberingSystem: want }).toString() : l.toString();
  } catch (e) { return tag; }
}
const loc = (o?: FormatOptions | null) => numeralLocale((o && o.locale) || formatLocale());
const digits = (d: number | undefined) => (d === undefined ? {} : { minimumFractionDigits: d, maximumFractionDigits: d });

export function formatNumber(value: unknown, o: FormatOptions = {}): string {
  if (!ok(value)) return '';
  return new Intl.NumberFormat(loc(o), { ...digits(o.decimals), signDisplay: o.signed ? 'exceptZero' : 'auto' }).format(value);
}

export function formatUnit(value: unknown, unit: string, o: FormatOptions = {}): string {
  if (!ok(value)) return '';
  return new Intl.NumberFormat(loc(o), { style: 'unit', unit, unitDisplay: (o.display || 'short') as Intl.NumberFormatOptions['unitDisplay'], ...digits(o.decimals) }).format(value);
}

export function formatBytes(bytes: unknown, o: FormatOptions = {}): string {
  if (!ok(bytes)) return '';
  const { base, units } = FORMATS.bytes;
  let i = 0, v = Math.abs(bytes);
  while (v >= base && i < units.length - 1) { v /= base; i++; }
  const d = o.decimals !== undefined ? o.decimals : (i === 0 ? 0 : FORMATS.number.decimals.bytes);
  return new Intl.NumberFormat(loc(o), { style: 'unit', unit: units[i], unitDisplay: 'short', maximumFractionDigits: d }).format(Math.sign(bytes) * v);
}

export function formatDuration(seconds: unknown, o: FormatOptions = {}): string {
  if (!ok(seconds)) return '';
  const s = Math.round(Math.abs(seconds)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  if (o.display === 'clock') {
    const two = (n: number) => String(n).padStart(2, '0');
    return (seconds < 0 ? '-' : '') + (h ? h + ':' + two(m) : String(m)) + ':' + two(r);
  }
  const display = o.display === 'long' ? 'long' : 'short';
  const parts = ([[h, 'hour'], [m, 'minute'], [r, 'second']] as [number, string][]).filter(([n], i, all) => n || (i === 2 && !all[0][0] && !all[1][0]));
  return formatList(parts.map(([n, unit]) => formatUnit(n, unit, { locale: o.locale, display })), { locale: o.locale, type: 'unit' });
}

export function formatCompact(value: unknown, o: FormatOptions = {}): string {
  if (!ok(value)) return '';
  return new Intl.NumberFormat(loc(o), { notation: 'compact', maximumFractionDigits: o.decimals !== undefined ? o.decimals : FORMATS.number.decimals.compact }).format(value);
}

const DATE_STYLES: Record<string, Intl.DateTimeFormatOptions> = {
  medium: { dateStyle: 'medium' },
  long: { dateStyle: 'long' },
  full: { dateStyle: 'full' },
};
export function formatDate(date: DateInput, o: FormatOptions = {}): string {
  const d = toDate(date);
  if (!d) return '';
  const style = o.dateStyle || FORMATS.date.default;
  if (style === 'short') {
    const thisYear = d.getFullYear() === new Date().getFullYear();
    return new Intl.DateTimeFormat(loc(o), { month: 'short', day: 'numeric', year: thisYear ? undefined : 'numeric', timeZone: o.timeZone }).format(d);
  }
  return new Intl.DateTimeFormat(loc(o), { ...(DATE_STYLES[style] || DATE_STYLES.medium), timeZone: o.timeZone }).format(d);
}

export function formatTime(date: DateInput, o: FormatOptions = {}): string {
  const d = toDate(date);
  if (!d) return '';
  return new Intl.DateTimeFormat(loc(o), { hour: 'numeric', minute: '2-digit', second: o.seconds ? '2-digit' : undefined, timeZone: o.timeZone, timeZoneName: o.timeZoneName }).format(d);
}

export function formatDateTime(date: DateInput, o: FormatOptions = {}): string {
  const d = toDate(date);
  if (!d) return '';
  const style = o.dateStyle && DATE_STYLES[o.dateStyle] ? o.dateStyle : FORMATS.date.default;
  if (o.timeZoneName) return new Intl.DateTimeFormat(loc(o), { ...(style === 'medium' ? { month: 'short' } : { month: 'long' }), day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: o.timeZone, timeZoneName: o.timeZoneName }).format(d);
  return new Intl.DateTimeFormat(loc(o), { dateStyle: style as Intl.DateTimeFormatOptions['dateStyle'], timeStyle: 'short', timeZone: o.timeZone }).format(d);
}

const STEPS: [Intl.RelativeTimeFormatUnit, number][] = [['second', 60], ['minute', 60], ['hour', 24], ['day', 7]];
export function formatRelative(date: DateInput, o: FormatOptions = {}): string {
  const d = toDate(date);
  if (!d) return '';
  const now = toDate(o.now || Date.now())!;
  const until = o.untilDays !== undefined ? o.untilDays : FORMATS.relative.untilDays;
  let diff = (d.getTime() - now.getTime()) / 1000;
  if (Math.abs(diff) >= until * 86400) return formatDate(d, { locale: o.locale, dateStyle: 'medium', timeZone: o.timeZone });
  const rtf = new Intl.RelativeTimeFormat(loc(o), { numeric: 'auto' });
  for (const [unit, size] of STEPS) {
    if (Math.abs(diff) < size || unit === 'day') return rtf.format(Math.round(diff), unit);
    diff /= size;
  }
  return '';
}

export function formatRange(from: unknown, to: unknown, o: FormatOptions = {}): string {
  if (o.kind === 'number') {
    if (!ok(from) || !ok(to)) return '';
    return new Intl.NumberFormat(loc(o), digits(o.decimals)).formatRange(from, to);
  }
  const a = toDate(from), b = toDate(to);
  if (!a || !b) return '';
  return new Intl.DateTimeFormat(loc(o), { ...(DATE_STYLES[o.dateStyle as string] || DATE_STYLES.medium), timeZone: o.timeZone }).formatRange(a, b);
}

export function formatCurrency(amount: unknown, currency: string, o: FormatOptions = {}): string {
  if (!ok(amount) || !currency) return '';
  return new Intl.NumberFormat(loc(o), { style: 'currency', currency, currencyDisplay: (o.display || FORMATS.currency.display) as Intl.NumberFormatOptions['currencyDisplay'], ...digits(o.decimals), signDisplay: o.signed ? 'exceptZero' : 'auto' }).format(amount);
}

export function formatPercent(ratio: unknown, o: FormatOptions = {}): string {
  if (!ok(ratio)) return '';
  const d = o.decimals !== undefined ? o.decimals : FORMATS.number.decimals.ratio;
  return new Intl.NumberFormat(loc(o), { style: 'percent', ...digits(d), signDisplay: o.signed ? 'exceptZero' : 'auto' }).format(ratio);
}

export function formatList(items: readonly unknown[] | null | undefined, o: FormatOptions = {}): string {
  const list = (items || []).filter((x) => x !== undefined && x !== null && x !== '').map(String);
  return new Intl.ListFormat(loc(o), o.type === 'unit' ? { type: 'unit', style: 'short' } : { type: o.type || 'conjunction' }).format(list);
}

export function formatPersonName(person: string | PersonName | null | undefined, o: FormatOptions = {}): string {
  const p: PersonName = typeof person === 'string' ? { full: person } : (person || {});
  const full = String(p.full || '').trim();
  if (o.display === 'preferred') return String(p.preferred || '').trim() || full;
  if (o.display === 'initials') {
    const words = full.split(/\s+/).filter(Boolean);
    const pick = words.length > 1 ? [words[0], words[words.length - 1]] : words;
    return pick.map((w) => Array.from(w)[0].toLocaleUpperCase(loc(o))).join('');
  }
  return full;
}

export function regionName(code: string | null | undefined, o: FormatOptions = {}): string {
  if (!code) return '';
  try { return new Intl.DisplayNames(loc(o), { type: 'region' }).of(code) || code; } catch (e) { return code; }
}

export function formatAddress(address: Address | null | undefined, o: FormatOptions = {}): string[] {
  const a: Address = address || {};
  const country = (o.country || a.country || '').toUpperCase();
  const layout = FORMATS.address[country] || FORMATS.address.default;
  const readerRegion = (loc(o).split('-')[1] || '').toUpperCase();
  const includeCountry = o.includeCountry !== undefined ? o.includeCountry : (!!country && country !== readerRegion);
  const value = (k: string): string => {
    if (k === 'country') return includeCountry ? regionName(country, o) : '';
    if (k === 'street') return ([] as string[]).concat(a.street || []).filter(Boolean).join('\n');
    return a[k] ? String(a[k]) : '';
  };
  const lines: string[] = [];
  layout.forEach((pattern) => {
    // a pattern line: field names with the punctuation between them; a separator is written only between two values
    let text = '', sep = '';
    for (const [, field, between] of pattern.matchAll(/([A-Za-z]+)|([^A-Za-z]+)/g)) {
      if (between) { sep = between; continue; }
      const v = value(field);
      if (!v) continue;
      text += (text ? sep : '') + v;
      sep = '';
    }
    text.split('\n').forEach((l) => { if (l.trim()) lines.push(l.trim()); });
  });
  return lines;
}

export function formatPhone(e164: unknown, o: FormatOptions = {}): string {
  const raw = String(e164 || '').trim();
  const num = raw.replace(/[^\d+]/g, '');
  if (!/^\+\d{4,15}$/.test(num)) return raw;
  const all = num.slice(1);
  const code = Object.keys(FORMATS.phone).sort((x, y) => y.length - x.length).find((c) => all.startsWith(c));
  const display = o.display === 'national' ? 'national' : 'international';
  if (code) {
    const rest = all.slice(code.length), pattern = FORMATS.phone[code][display];
    if ((pattern.match(/#/g) || []).length === rest.length) { let i = 0; return pattern.replace(/#/g, () => rest[i++]); }
  }
  // a country Formats does not list (or a length its pattern does not fit): the country code when it is known, then the
  // digits in groups of three, the last group taking up to four
  const groups: string[] = [];
  let rest = code ? all.slice(code.length) : all;
  while (rest.length > 4) { groups.push(rest.slice(0, 3)); rest = rest.slice(3); }
  groups.push(rest);
  return '+' + (code ? code + ' ' : '') + groups.join(' ');
}

export function dateTimeAttr(date: DateInput): string {
  const d = toDate(date);
  return d ? d.toISOString() : '';
}
