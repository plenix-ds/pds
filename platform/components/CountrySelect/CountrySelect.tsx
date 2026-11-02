/* Plenix · CountrySelect
   Summary: A searchable select of countries and regions, locales, or languages, named in the reader's language by the
     browser (Intl.DisplayNames), sorted by name, and matched on the name, the name in English and the code. Built on
     Combobox.
   Usage:
     <Field label="Country"><CountrySelect value={country} onChange={setCountry} /></Field>                  // "DE"
     <Field label="Language"><CountrySelect type="language" value={lang} onChange={setLang} /></Field>        // "de"
     <Field label="Format"><CountrySelect type="locale" value={loc} onChange={setLoc} /></Field>              // "de-DE"
     <CountrySelect value={country} onChange={setCountry} only={['US', 'CA', 'MX']} flags aria-label="Ship to" />
   Props:
     type: "country" (default; ISO 3166 region codes: "DE") | "locale" (BCP 47 locale tags: "de-DE") | "language"
       (ISO 639 language codes: "de")
     value: the chosen code; onChange(code) runs with the new one (a Combobox single choice)
     only: the codes offered, in place of the full list
     priority: codes listed first, under strings.suggested (the reader's own country, the most used languages)
     ownNames: a language or a locale is named in itself ("Deutsch", "Deutsch (Deutschland)"), as people look for their
       own language (default true for "language" and "locale", false for "country")
     flags: the country's flag emoji before its name (country and locale; default false). A flag is never the only name
       of a language
     codes: the code after the name ("Germany (DE)") for technical settings (default false)
     locale: the language of the names (default: the page's language)
     placeholder: the hint in the empty field (default: the strings entry of the type)
     strings: the words it shows, for other languages: { country: "Choose a country or region", language: "Choose a
       language", locale: "Choose a language and region", suggested: "Suggested", all: "All" }
     invalid: the invalid state (a Field with an error sets it)
     disabled: the select cannot be used
     id: the id of the input (a Field sets it)
     label: the accessible name when there is no Field
     className: more classes on the select
     ref: forwarded to the <input>
   Behavior:
     Typing narrows the list as in Combobox (↓ ↑ move, Enter chooses, Escape closes); the name in the reader's language,
       the name in English and the code all match ("deu", "Germany", "DE" find Deutschland in a German page).
     The list is sorted by the shown name in the reader's language (Intl.Collator).
     With priority, those codes come first under "Suggested" and the rest under "All".
     The flag is drawn from the code's regional indicator letters; where the system has no flag glyphs (Windows) the two
       letters show instead, so the name always carries the meaning.
   Notes:
     The names come from the browser, so they follow the reader's language with no table to keep; the codes are the
       stable value to store.
     Other props pass through to Combobox's <input>.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { formatLocale } from '../../utils/format.ts';
import { Combobox } from '../Combobox/Combobox.tsx';
import type { ComboboxProps } from '../Combobox/Combobox.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';

// ISO 3166-1 alpha-2: every assigned country and region code
const REGION_CODES = ('AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG '
  + 'CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR '
  + 'GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY '
  + 'MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS '
  + 'PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA '
  + 'UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW').split(' ');
// ISO 639-1 languages with wide use in software
const LANGUAGE_CODES = ('af am ar az be bg bn bs ca cs cy da de el en es et eu fa fi fil fr ga gl gu he hi hr hu hy id is it ja ka kk km kn ko '
  + 'ky lo lt lv mk ml mn mr ms mt my nb ne nl pa pl ps pt ro ru si sk sl sq sr sv sw ta te th tr uk ur uz vi zh zu').split(' ');
// common locales: a language with the region whose conventions it sets (dates, numbers, money)
const LOCALE_CODES = ('ar-EG ar-SA bg-BG cs-CZ da-DK de-AT de-CH de-DE el-GR en-AU en-CA en-GB en-IE en-IN en-NZ en-US en-ZA es-AR es-ES es-MX '
  + 'es-US et-EE fi-FI fr-BE fr-CA fr-CH fr-FR he-IL hi-IN hr-HR hu-HU id-ID it-IT ja-JP ko-KR lt-LT lv-LV ms-MY nb-NO nl-BE nl-NL pl-PL pt-BR '
  + 'pt-PT ro-RO ru-RU sk-SK sl-SI sr-RS sv-SE th-TH tr-TR uk-UA vi-VN zh-CN zh-HK zh-TW').split(' ');

// a region code to its flag emoji: the two regional indicator letters
function flagOf(code: unknown) {
  const r = (String(code || '').split('-').pop() as string).toUpperCase();
  return /^[A-Z]{2}$/.test(r) ? String.fromCodePoint(...Array.from(r).map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : '';
}
const names = (locale: string, type: Intl.DisplayNamesType): Intl.DisplayNames | null => { try { return new Intl.DisplayNames(locale, { type, fallback: 'code' }); } catch (e) { return null; } };
const nameOf = (dn: Intl.DisplayNames | null, code: string): string => { try { return (dn && dn.of(code)) || code; } catch (e) { return code; } };

// the options of a type: { value, label, match } sorted by label in the reader's language
export type CountrySelectType = 'country' | 'language' | 'locale';
type CountryOption = { value: string; label: string; sort: string; match: string; group?: string };
function countryOptions({ type = 'country', locale, only, ownNames, flags = false, codes = false }: { type?: CountrySelectType; locale?: string; only?: string[]; ownNames?: boolean; flags?: boolean; codes?: boolean } = {}): CountryOption[] {
  const loc = locale || formatLocale();
  const kind = type === 'country' ? 'region' : 'language';
  const list = only || (type === 'language' ? LANGUAGE_CODES : type === 'locale' ? LOCALE_CODES : REGION_CODES);
  const own = ownNames !== undefined ? ownNames : type !== 'country';
  const dn = names(loc, kind), en = names('en', kind);
  const collator = new Intl.Collator(loc);
  return list.map((code) => {
    const name = own ? nameOf(names(code, kind), code) : nameOf(dn, code);
    const local = nameOf(dn, code);
    const shown = name + (own && local !== name ? ' · ' + local : '') + (codes ? ' (' + code + ')' : '');
    const flag = flags && type !== 'language' ? flagOf(code) + ' ' : '';
    return { value: code, label: flag + shown, sort: name, match: [name, local, nameOf(en, code), code].join(' ').toLowerCase() };
  }).sort((a, b) => collator.compare(a.sort, b.sort));
}

export type CountrySelectProps = Omit<ComboboxProps, 'options' | 'loadOptions' | 'loadDelay' | 'value' | 'values' | 'multiple' | 'strings'> & {
  /** what it lists: countries and regions, languages, or locales */
  type?: CountrySelectType;
  /** a code ("PT", "pt", "pt-PT") */
  value?: string | null;
  /** only these codes */
  only?: string[];
  /** these codes first, under Suggested */
  priority?: string[];
  /** each name in its own language (default for languages and locales) */
  ownNames?: boolean;
  flags?: boolean;
  codes?: boolean;
  locale?: string;
  strings?: Catalog | null;
};
export const CountrySelect = React.forwardRef(function CountrySelect({ type = 'country', value, onChange, only, priority, ownNames, flags = false,
  codes = false, locale, placeholder, strings, className, ...rest }: CountrySelectProps, ref: React.ForwardedRef<HTMLInputElement>) {
  const t = useStrings('countrySelect', strings) as Record<string, string>;
  const loc = locale || formatLocale();
  const options = React.useMemo(() => {
    const all = countryOptions({ type, locale: loc, only, ownNames, flags, codes });
    if (!priority || !priority.length) return all;
    const first = (priority.map((c) => all.find((o) => o.value === c)).filter(Boolean) as CountryOption[]).map((o) => Object.assign({}, o, { group: t.suggested }));
    return first.concat(all.filter((o) => priority.indexOf(o.value) < 0).map((o) => Object.assign({}, o, { group: t.all })));
  }, [type, loc, (only || []).join(), (priority || []).join(), ownNames, flags, codes, t.suggested, t.all]);
  // the list is filtered here, not by Combobox, so the English name and the code match too (Combobox shows a loader's
  // options as they are); the full list still names the chosen value
  const find = React.useCallback((text: string) => { const q = String(text || '').trim().toLowerCase(); return q ? options.filter((o) => o.match.indexOf(q) >= 0) : options; }, [options]);
  return (
    <Combobox ref={ref} className={cx('plx-country-select', className)} options={options} loadOptions={find} loadDelay={0} value={value}
      onChange={onChange} placeholder={placeholder || t[type] || t.country} {...rest} />
  );
});
