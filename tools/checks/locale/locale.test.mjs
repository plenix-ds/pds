// Unit tests for the locale checks (#192). Each check: a case that passes and a case that fails.
import { describe, it, expect } from 'vitest';
import { checkCatalogs, checkJsx, checkUnused, newFindings, approvedMap, parseCatalogModule, entries } from './locale.mjs';
import { pseudoString, pseudoCatalog } from './pseudo.mjs';
import { formatNumber, formatDate } from '../../../platform/utils/format.ts';

const rules = (list) => list.map((x) => x.rule);
const SIX = { zero: 'لا توجد خلايا', one: 'خلية واحدة', two: 'خليتان', few: '{n} خلايا', many: '{n} خلية', other: '{n} خلية' };

describe('1. missing Arabic key', () => {
  it('passes when every English key has Arabic', () => {
    expect(checkCatalogs({ d: { close: 'Close' } }, { d: { close: 'إغلاق' } }, { 'd.close': 'إغلاق' })).toEqual([]);
  });
  it('fails a key with no Arabic', () => {
    expect(rules(checkCatalogs({ d: { close: 'Close', save: 'Save' } }, { d: { close: 'إغلاق' } }, { 'd.close': 'إغلاق' }))).toEqual(['missing-ar']);
  });
});

describe('2. Arabic without the owner\'s approval', () => {
  it('fails Arabic that has no approval', () => {
    expect(rules(checkCatalogs({ d: { close: 'Close' } }, { d: { close: 'إغلاق' } }, {}))).toEqual(['unapproved-ar']);
  });
  it('fails Arabic that differs from the approved text', () => {
    expect(rules(checkCatalogs({ d: { close: 'Close' } }, { d: { close: 'اغلق' } }, { 'd.close': 'إغلاق' }))).toEqual(['unapproved-ar']);
  });
  it('checks each plural form, and ignores text with no Arabic letters', () => {
    const en = { g: { cells: { one: '{n} cell', other: '{n} cells' }, dash: '—' } };
    expect(checkCatalogs(en, { g: { cells: SIX, dash: '—' } }, { 'g.cells': SIX })).toEqual([]);
    expect(rules(checkCatalogs(en, { g: { cells: { ...SIX, few: '{n} خلايا!' }, dash: '—' } }, { 'g.cells': SIX }))).toEqual(['unapproved-ar']);
  });
  it('reads the record\'s batches, later batches winning', () => {
    const m = approvedMap({ batches: [{ strings: { d: { close: 'أ' } } }, { strings: { d: { close: 'إغلاق' } } }] });
    expect(m['d.close']).toBe('إغلاق');
  });
});

describe('3. placeholder mismatch', () => {
  it('fails a placeholder the English does not have, and one it leaves out', () => {
    const out = checkCatalogs({ p: { range: '{first} to {last}' } }, { p: { range: '{first} إلى {end}' } }, { 'p.range': '{first} إلى {end}' });
    expect(out.map((x) => x.message)).toEqual(['p.range: {end} is not in the English', 'p.range: {last} from the English is missing']);
  });
  it('lets the zero, one and two forms leave out the count', () => {
    expect(checkCatalogs({ g: { cells: { one: '{n} cell', other: '{n} cells' } } }, { g: { cells: SIX } }, { 'g.cells': SIX })).toEqual([]);
  });
  it('does not let the few form leave out the count', () => {
    const ar = { ...SIX, few: 'خلايا' };
    expect(rules(checkCatalogs({ g: { cells: { one: '{n} cell', other: '{n} cells' } } }, { g: { cells: ar } }, { 'g.cells': ar }))).toEqual(['placeholder']);
  });
});

describe('4. Arabic plural forms', () => {
  it('fails a plural with fewer than the six forms, or as one string', () => {
    const en = { g: { cells: { one: '{n} cell', other: '{n} cells' } } };
    const two = { one: 'خلية واحدة', other: '{n} خلية' };
    expect(checkCatalogs(en, { g: { cells: two } }, { 'g.cells': two }).map((x) => x.message)).toEqual(['g.cells: Arabic lacks zero, two, few, many']);
    expect(rules(checkCatalogs(en, { g: { cells: '{n} خلية' } }, { 'g.cells': '{n} خلية' }))).toEqual(['plural-forms']);
  });
  it('counts an exact "=0" as the zero form', () => {
    const en = { c: { selected: { '=0': 'Nothing selected', one: '{count} item', other: '{count} items' } } };
    const ar = { '=0': 'لا شيء', one: 'عنصر واحد', two: 'عنصران', few: '{count} عناصر', many: '{count} عنصرًا', other: '{count} عنصر' };
    expect(checkCatalogs(en, { c: { selected: ar } }, { 'c.selected': ar })).toEqual([]);
  });
});

describe('5. literal JSX text', () => {
  it('fails text children and visible string attributes', async () => {
    const src = 'export const A = () => <div title="Open file"><b>Save</b>{t.ok}<i aria-label={"Close menu"}/></div>;';
    expect((await checkJsx(src, 'a.jsx')).map((x) => x.message)).toEqual(['title="Open file"', 'text "Save"', 'aria-label="Close menu"']);
  });
  it('passes catalog words, symbols, class names and TypeScript', async () => {
    const src = 'type P = { a: string };\nexport const A = ({ a }: P) => <div className="plx-a" aria-label={t.close}>{a} · {"+" + 3} ×</div>;';
    expect(await checkJsx(src, 'a.tsx')).toEqual([]);
  });
  it('skips the product name and a component\'s one-word setting, but not a DOM element\'s', async () => {
    const src = 'export const A = () => <a><span>Plenix</span><Image placeholder="none" /><input placeholder="name" /></a>;';
    expect((await checkJsx(src, 'a.jsx')).map((x) => x.message)).toEqual(['placeholder="name"']);
  });
});

describe('6. unused keys', () => {
  const en = { dataGrid: { saved: 'Saved', gone: 'Old' }, colors: { list: { red: 'Red' } } };
  it('counts a leaf read in the section\'s folder, or a group read by a computed name', () => {
    const src = {
      'platform/components/DataGrid/DataGrid.tsx': "const S = useStrings('dataGrid');",
      'platform/components/DataGrid/engine/parts.tsx': 'announce(S.saved);',
      'platform/components/Swatch/Swatch.tsx': "const t = useStrings('colors'); t.list[name];",
    };
    expect(checkUnused(en, src).map((x) => x.message)).toEqual(['dataGrid.gone: no Platform source reads it']);
  });
  it('fails an Arabic key English does not have', () => {
    expect(rules(checkCatalogs({}, { x: { y: 'ص' } }, { 'x.y': 'ص' }))).toEqual(['unused-key']);
  });
});

describe('only new problems block', () => {
  it('counts a finding new only beyond the base\'s count, ignoring lines', () => {
    const a = { rule: 'jsx-literal', file: 'a.jsx', message: 'text "Save"', line: 3 };
    expect(newFindings([a], [{ ...a, line: 9 }])).toEqual([]);
    expect(newFindings([a], [a, { ...a, line: 12 }])).toHaveLength(1);
  });
  it('reports a new missing Arabic key without blocking (the word waits for the owner)', () => {
    expect(newFindings([], [{ rule: 'missing-ar', file: 'platform/i18n/ar.js', message: 'x.y: no Arabic' }])).toEqual([]);
  });
});

describe('catalog files', () => {
  it('reads an export-default module as data and keeps plurals whole', () => {
    const cat = parseCatalogModule('// note\nexport default {\n "a": { "n": { "one": "x", "other": "y" } }\n};\n');
    expect(entries(cat)).toEqual({ 'a.n': { one: 'x', other: 'y' } });
  });
});

describe('pseudo-locales', () => {
  it('accents, expands and brackets a string, keeping placeholders', () => {
    const s = pseudoString('Edit {name}');
    expect(s.startsWith('⟦Éðíţ {name}')).toBe(true);
    expect(s.endsWith('⟧')).toBe(true);
    expect(s.length).toBeGreaterThan('Edit {name}'.length * 1.3);
  });
  it('isolates the right-to-left form and keeps the catalog\'s shape', () => {
    expect(pseudoString('Close', { rtl: true })).toMatch(/^⁧⟦.*⟧⁩$/);
    expect(Object.keys(pseudoCatalog({ a: { one: 'x', other: 'y' } }).a)).toEqual(['one', 'other']);
  });
});

describe('number and date formats (en-US, ar-EG)', () => {
  const day = new Date(Date.UTC(2026, 0, 15, 12));
  it('writes Latin digits in en-US and Arabic-Indic digits in ar-EG', () => {
    expect(formatNumber(1234.5, { locale: 'en-US', decimals: 1 })).toBe('1,234.5');
    expect(formatNumber(1234.5, { locale: 'ar-EG', decimals: 1 })).toMatch(/^[٠-٩٬٫]+$/);
  });
  it('writes Arabic month names in ar-EG', () => {
    expect(formatDate(day, { locale: 'en-US', dateStyle: 'long', timeZone: 'UTC' })).toBe('January 15, 2026');
    expect(formatDate(day, { locale: 'ar-EG', dateStyle: 'long', timeZone: 'UTC' })).toContain('يناير');
  });
});
