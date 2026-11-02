/* Plenix · LocaleProvider, useLocale, createTranslator
   Summary: Locale-scoped message catalogs, plural rules, formatting and writing direction. Existing components receive
     their strings explicitly from the catalog; a region never changes another region's locale.
   Usage:
     <LocaleProvider locale="fr-FR" catalogs={{ fr: french }}><App /></LocaleProvider>
     const { t, strings, format } = useLocale();
     <Wizard strings={strings('wizard')} />; t('collection.selected', { count: 2 }); format.date('2026-03-08');
   Props:
     locale: a BCP 47 language tag; default the page's formatLocale()
     catalogs: messages by locale, with flat dot keys or nested sections; Plenix's built-in words for the language come after
       them (i18n/ar.js: Arabic, owner arabic-batch4-36), and English is always the last fallback
     messages: the current locale's catalog, as a convenience
     fallbackLocale: locale searched after the requested locale and its language; default "en"
     timeZone: optional IANA time zone of the region ("Europe/Lisbon"; issue 813): its date/time formatters, and DatePicker and
       TimePicker show and save dates and times in it, so people in several countries see the same; default the computer's
     dir: explicit "ltr" or "rtl"; otherwise directionOf(locale)
     digits: "auto" (default: Arabic-Indic ٠-٩ for an Arabic locale, Latin for every other) | "arab" | "latn" (owner, arabic-digits-35):
       every format helper writes its digits so, and Isolate and Text write the digits of their text so; emails and web addresses keep Latin
     root: set the page's lang and dir through DirectionProvider; default false (a scoped region)
     children: the region's content
     useDigits(): "arab" or "latn", the digits of the nearest LocaleProvider (the page's language when there is none)
     useTimeZone(): the nearest LocaleProvider's timeZone, or undefined (the computer's zone)
     useLocale(): { locale, dir, digits, timeZone, t, strings, plural, format }; format has number, unit, bytes, duration, compact, date,
       time, dateTime, relative, range, currency, percent, list, personName, address, phone and regionName
     createTranslator(locale, catalogs, fallbackLocale): the same t/strings/plural API outside React, plus section(name): a
       whole section merged across the catalogs
     useStrings(section, strings): a component's words: its catalog section for the locale (the app's catalog, Plenix's
       built-in language, English), with its strings prop on top (owner, arabic-words-37). Every built-in word lives in
       i18n/en.js; check-system's built-in-words rule keeps English literals out of the components
   Behavior:
     Fallback: exact locale, language, configured fallback, then English. Missing messages return their key.
     Messages interpolate {name} as plain text. Plural messages are objects with one/other (or any Intl category),
     optional "=0" exact-count keys; t(key, { count }) selects them with Intl.PluralRules. t's third argument may
     set ordinal:true. Missing interpolation values keep their placeholder. No HTML is parsed.
     strings(section, values) combines that section across fallbacks for a component's strings prop.
   Notes:
     Translators never mutate catalogs or global Intl state. Pass the bound format helpers to localized content;
     unmodified components keep their existing defaults. Catalog translations are application-owned. */
import React from 'react';
import { DirectionProvider } from './DirectionProvider.tsx';
import { directionOf } from '../utils/direction.ts';
import * as F from '../utils/format.ts';
import type { Direction } from '../utils/direction.ts';
import type { Digits } from '../utils/format.ts';
import english from '../i18n/en.js';
import arabic from '../i18n/ar.js';

// a catalog: messages by key (flat dot keys or nested sections); a message is a text, a number or a plural object
export type Catalog = { [key: string]: unknown };
export type Values = Record<string, unknown>;
export type TranslateOptions = { ordinal?: boolean };
export type Translator = {
  locale: string; dir: Direction;
  t(key: string, values?: Values, options?: TranslateOptions): string;
  strings(section: string, values?: Values): Record<string, string>;
  plural(count: unknown, options?: TranslateOptions): Intl.LDMLPluralRule;
  section(name: string): Catalog;
};
// the bound format helpers: each takes the helper's own arguments, then its options (the locale and time zone are set)
export type BoundFormat = Record<keyof typeof FORMATTERS, (...args: unknown[]) => string>;
export type LocaleValue = Translator & { digits?: Digits; timeZone?: string; format: BoundFormat };
export type LocaleProviderProps = {
  locale?: string; catalogs?: Record<string, Catalog>; messages?: Catalog; fallbackLocale?: string; timeZone?: string;
  dir?: Direction; digits?: 'auto' | Digits; root?: boolean; children?: React.ReactNode;
};

// Plenix's own words in other languages: used after the application's catalog for the same language, before English
const BUILT_IN: Record<string, Catalog> = { ar: arabic };

const canonical = (value: string | null | undefined, fallback = 'en'): string => { try { return Intl.getCanonicalLocales(value || fallback)[0] || fallback; } catch (e) { return fallback; } };
const own = (value: unknown, key: string) => value && Object.prototype.hasOwnProperty.call(value, key);
const messageAt = (catalog: unknown, key: string): unknown => {
  if (own(catalog, key)) return (catalog as Catalog)[key];
  return String(key).split('.').reduce((node: unknown, part) => own(node, part) ? (node as Catalog)[part] : undefined, catalog);
};
const text = (message: unknown, values: Values) => String(message).replace(/\{(\w+)\}/g, (match, key: string) => own(values, key) ? String(values[key]) : match);

// a plural message: an object whose keys are only plural categories (zero, one, two, few, many, other) or exact counts ("=0"),
// with "other"; a section that merely has a key named "other" (TimeZoneSelect's "Other") is not one
const PLURAL_KEY = /^(zero|one|two|few|many|other|=\d+)$/;
const pluralMessage = (v: unknown) => !!v && typeof v === 'object' && !Array.isArray(v) && own(v, 'other') && Object.keys(v as Catalog).every((k) => PLURAL_KEY.test(k));

export function createTranslator(locale = 'en', catalogs: Record<string, Catalog> | null = {}, fallbackLocale = 'en'): Translator {
  const language = canonical(locale), fallback = canonical(fallbackLocale);
  const normalized = Object.fromEntries(Object.entries(catalogs || {}).map(([key, value]) => [canonical(key), value]));
  const chain = [...new Set([language, language.split('-')[0], fallback, fallback.split('-')[0], 'en'])];
  const sources: Catalog[] = chain.flatMap((key) => [normalized[key], BUILT_IN[key]]).filter(Boolean).concat(english);
  const cardinal = new Intl.PluralRules(language), ordinal = new Intl.PluralRules(language, { type: 'ordinal' });
  const plural = (count: unknown, options: TranslateOptions = {}) => (options.ordinal ? ordinal : cardinal).select(Number(count));
  const choose = (value: unknown, values: Values, options: TranslateOptions) => {
    if (typeof value === 'string' || typeof value === 'number') return text(value, values);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
    const exact = '=' + Number(values.count), category = plural(values.count, options);
    const item = own(value, exact) ? (value as Catalog)[exact] : (value as Catalog)[category] !== undefined ? (value as Catalog)[category] : (value as Catalog).other;
    return typeof item === 'string' || typeof item === 'number' ? text(item, values) : undefined;
  };
  const t = (key: string, values: Values = {}, options: TranslateOptions = {}) => {
    for (const source of sources) { const result = choose(messageAt(source, key), values, options); if (result !== undefined) return result; }
    return String(key);
  };
  const strings = (section: string, values: Values = {}) => {
    const keys = new Set<string>();
    sources.forEach((source) => {
      const node = messageAt(source, section);
      if (node && typeof node === 'object' && !Array.isArray(node)) Object.keys(node as Catalog).forEach((key) => keys.add(key));
      Object.keys(source).filter((key) => key.startsWith(section + '.') && !key.slice(section.length + 1).includes('.')).forEach((key) => keys.add(key.slice(section.length + 1)));
    });
    return Object.fromEntries([...keys].map((key) => [key, t(section + '.' + key, values)]));
  };
  // a component's words: the whole section, merged across the catalogs (English at the bottom, the language on top); nested
  // sections merge key by key, a plural message (an object with "other") is kept whole, so two languages never mix
  const isPlural = pluralMessage;
  const merge = (a: unknown, b: unknown): unknown => {
    if (!b || typeof b !== 'object' || Array.isArray(b) || isPlural(b)) return b === undefined ? a : b;
    const out = Object.assign({} as Catalog, a && typeof a === 'object' && !isPlural(a) ? a : {});
    Object.keys(b).forEach((k) => { out[k] = merge(out[k], (b as Catalog)[k]); });
    return out;
  };
  const section = (name: string) => sources.slice().reverse().reduce((acc: Catalog, source) => merge(acc, messageAt(source, name)) as Catalog, {});
  return { locale: language, dir: directionOf(language), t, strings, plural, section };
}

const FORMATTERS: Record<string, [keyof typeof F, number]> = { number: ['formatNumber', 1], unit: ['formatUnit', 2], bytes: ['formatBytes', 1], duration: ['formatDuration', 1],
  compact: ['formatCompact', 1], date: ['formatDate', 1], time: ['formatTime', 1], dateTime: ['formatDateTime', 1], relative: ['formatRelative', 1],
  range: ['formatRange', 2], currency: ['formatCurrency', 2], percent: ['formatPercent', 1], list: ['formatList', 1],
  personName: ['formatPersonName', 1], address: ['formatAddress', 1], phone: ['formatPhone', 1], regionName: ['regionName', 1] };
const bind = (locale: string, timeZone?: string, digits?: string): BoundFormat => { const tag = F.numeralLocale(locale, digits); return Object.fromEntries(Object.entries(FORMATTERS).map(([name, [fn, count]]) =>
  [name, (...args: unknown[]) => (F[fn] as (...a: unknown[]) => string)(...Array.from({ length: count }, (_, index) => args[index]), Object.assign({ locale: tag, timeZone }, args[count]))])) as BoundFormat; };
const LocaleContext = React.createContext<LocaleValue | null>(null);

export function LocaleProvider({ locale, catalogs, messages, fallbackLocale = 'en', timeZone, dir, digits = 'auto', root = false, children }: LocaleProviderProps) {
  const language = canonical(locale || F.formatLocale());
  // a language whose built-in words are not on the page yet (the CDN's plenix.js leaves Arabic to plenix-ar.js, issue 882):
  // ask the page loader for them, and draw again when they arrive ('plenix:language', i18n/optional.js). A switch to Arabic
  // without a reload gets its words; in this checkout and the npm builds Arabic is built in, so nothing is asked
  const [arrived, setArrived] = React.useState(0);
  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const base = language.split('-')[0], slot = BUILT_IN[base];
    const heard = () => setArrived((n) => n + 1);
    window.addEventListener('plenix:language', heard);
    const loader = (window as unknown as { PlenixLoader?: { loadLanguage?: (code: string) => void } }).PlenixLoader;
    if (slot && !Object.keys(slot).length && loader && typeof loader.loadLanguage === 'function') loader.loadLanguage(base);
    return () => window.removeEventListener('plenix:language', heard);
  }, [language]);
  const value = React.useMemo((): LocaleValue => {
    const sources = Object.assign({}, catalogs, messages ? { [language]: messages } : {});
    return Object.assign(createTranslator(language, sources, fallbackLocale), { timeZone: timeZone || undefined, dir: dir || directionOf(language), digits: F.digitsOf(F.numeralLocale(language, digits === 'auto' ? undefined : digits)), format: bind(language, timeZone, digits === 'auto' ? undefined : digits) });
  }, [language, catalogs, messages, fallbackLocale, timeZone, dir, digits, arrived]);
  return <LocaleContext.Provider value={value}><DirectionProvider locale={language} dir={value.dir} root={root}>{children}</DirectionProvider></LocaleContext.Provider>;
}

// a component's words (owner, arabic-words-37): its section of the catalogs for the locale, with the component's strings
// prop on top (an app's own words still win). useStrings('pagination', strings) -> { label, range, previous, … }
export function useStrings(name: string, strings?: Catalog | null): Catalog {
  const loc = useLocale();
  return React.useMemo(() => {
    const base = loc.section(name);
    if (!strings) return base;
    const out: Catalog = Object.assign({}, base);
    Object.keys(strings).forEach((k) => {
      const v = strings[k], b = base[k];
      out[k] = v && typeof v === 'object' && !Array.isArray(v) && b && typeof b === 'object' && !Array.isArray(b) && !pluralMessage(v) ? Object.assign({}, b, v) : v;
    });
    return out;
  }, [loc, name, strings]);
}

export function useLocale(): LocaleValue {
  const value = React.useContext(LocaleContext);
  const language = canonical(F.formatLocale());
  const fallback = React.useMemo((): LocaleValue => Object.assign(createTranslator(language), { format: bind(language) }), [language]);
  return value || fallback;
}

// the digits the text around uses ("arab" or "latn"): the nearest LocaleProvider's, else the page's language (cheap: no translator is built)
export function useDigits(): Digits | undefined {
  const value = React.useContext(LocaleContext);
  return value ? value.digits : F.digitsOf(F.formatLocale());
}

// the time zone of the nearest LocaleProvider (issue 813), or undefined: the computer's zone
export function useTimeZone() {
  const value = React.useContext(LocaleContext);
  return value ? value.timeZone : undefined;
}
