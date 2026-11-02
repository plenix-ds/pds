/* Plenix · fields (platform/utils/fields.ts): the field model of the command bar's panels (owner, 2026-10-14, Airtable
   style): what a collection's fields are, how a filter tests a row, how sort levels order rows and how a date quick filter
   reads its presets. FilterPanel, SortPanel, GroupPanel, QuickFilter and useCollectionView use it; a page may too (a
   server that filters the same way).
   A field: { value (its key), label, kind: "text" | "select" | "multi" | "number" | "date", options: [{ value, label,
   color }] (select and multi: color is a category color name; without one they take the category colors in order),
   get(row) (the row's value; default row[value]) }.
   A filter: { join: "and" | "or", items: [condition | { group: true, id, join, items: [condition…] }] }; a condition:
   { id, field, op, value }. A condition left unfinished (no value) does not filter.
   Sort levels: [{ field, dir: "asc" | "desc" }], the first the main one; a select field sorts in its options' order. */

import english from '../i18n/en.js';
import { parseDate, isoDay } from './format.ts';
import CalendarIcon from 'plenix-platform/icons/plenix/calendar';
import EdTextIcon from 'plenix-platform/icons/plenix/ed-text';
import FieldNumberIcon from 'plenix-platform/icons/plenix/field-number';
import FieldSelectIcon from 'plenix-platform/icons/plenix/field-select';
import TagsIcon from 'plenix-platform/icons/plenix/tags';

export type FieldKind = 'text' | 'select' | 'multi' | 'number' | 'date';
export type FieldOption = { value: string; label?: string; color?: string };
// a field of a collection (see the header); a page's own fields pass through
export type Field = { value: string; label?: string; kind?: FieldKind | string; options?: (string | FieldOption)[]; get?(row: object): unknown; [key: string]: unknown };
export type Condition = { id?: string; field: string; op: string; value?: unknown; group?: false };
export type ConditionGroup = { group: true; id?: string; join?: 'and' | 'or'; items: FilterItem[] };
export type FilterItem = Condition | ConditionGroup;
export type Filter = { join?: 'and' | 'or'; items?: FilterItem[]; group?: boolean; id?: string };
export type SortLevel = { field: string; dir?: 'asc' | 'desc' };
export type DateRange = { preset?: string; from?: string; to?: string };
// the catalog's `fields` words in the reader's language (useStrings('fields')); any part may be missing
export type FieldWords = { operators?: Record<string, Record<string, string>>; within?: Record<string, string>; presets?: Record<string, string>; directions?: Record<string, string[]> };

// the type icon of each kind (the field pickers and the column headers' type icons)
export const KIND_ICONS = { text: EdTextIcon, select: FieldSelectIcon, multi: TagsIcon, number: FieldNumberIcon, date: CalendarIcon };
// the directions in each kind's words (Airtable's)
export const DIRECTIONS = english.fields.directions;
// the operators by kind: [op, words]
// (the words are the catalog's `fields` section, English here for apps; the panels read the locale's words with fieldWords)
const OP_ORDER: Record<FieldKind, string[]> = { text: ['contains', 'ncontains', 'is', 'isnot', 'empty', 'nempty'], select: ['any', 'none', 'empty', 'nempty'], multi: ['any', 'none', 'empty', 'nempty'],
  number: ['eq', 'ne', 'lt', 'gt', 'empty', 'nempty'], date: ['is', 'before', 'after', 'within', 'empty', 'nempty'] };
export const OPERATORS: Record<string, [string, string][]> = Object.fromEntries(Object.entries(OP_ORDER).map(([kind, ops]) => [kind, ops.map((op): [string, string] => [op, (english.fields.operators as Record<string, Record<string, string>>)[kind][op]])]));
// "is within": the past week, month or year
export const WITHIN: { value: string; label: string; days: number }[] = [{ value: 'week', label: english.fields.within.week, days: 7 }, { value: 'month', label: english.fields.within.month, days: 30 }, { value: 'year', label: english.fields.within.year, days: 365 }];
// the category colors (Trubetskoy's 20), in the order options take them
export const CATEGORY_ORDER = ['blue', 'green', 'purple', 'orange', 'teal', 'magenta', 'yellow', 'navy', 'red', 'cyan', 'lavender', 'brown', 'olive', 'pink', 'apricot', 'mint', 'maroon', 'lime', 'beige', 'gray'];

export const fieldOf = (fields: Field[], key: unknown): Field => fields.find((f) => f.value === key) || fields[0];
export const valueOf = (f: Field, row: object): unknown => (f.get ? f.get(row) : (row as Record<string, unknown>)[f.value]);
export const kindOf = (f: Field | null | undefined): string => (OPERATORS[(f && f.kind) as string] ? f!.kind as string : 'text');
// a field as a choice in a panel's field menu: its key, its name and its kind's icon (FilterPanel, SortPanel, GroupPanel; one copy, issue 882)
export const fieldOption = (f: Field) => ({ value: f.value, label: f.label, icon: KIND_ICONS[kindOf(f) as keyof typeof KIND_ICONS] });
// a field's options, each with its color (given, or the next category color)
export const optionsOf = (f: Field | null | undefined): FieldOption[] => ((f && f.options) || []).map((o) => (typeof o === 'string' ? { value: o } : o)).map((o: FieldOption, i) => Object.assign({ label: o.value, color: CATEGORY_ORDER[i % CATEGORY_ORDER.length] }, o));
export const blank = (x: unknown) => x === null || x === undefined || x === '' || (Array.isArray(x) && !x.length);
// days are calendar days where the reader is (the owner, issue 342 option A): today and "N days before" from local dates,
// never from toISOString (the UTC day, which is the day before east of UTC around midnight)
const iso = isoDay;
const daysBefore = (n: number, today: unknown) => { const d = new Date((parseDate(today) || new Date()).getTime()); d.setDate(d.getDate() - n); return iso(d); };

// one condition against one row (today: an ISO date, for "is within"; default the current date)
export function matchesCondition(c: Condition, row: object, fields: Field[], today?: string): boolean {
  const f = fieldOf(fields, c.field), v = valueOf(f, row), val = c.value, k = kindOf(f);
  if (c.op === 'empty') return blank(v);
  if (c.op === 'nempty') return !blank(v);
  if (blank(val)) return true;
  if (k === 'text') { const s = String(v == null ? '' : v).toLowerCase(), q = String(val).toLowerCase(); return c.op === 'contains' ? s.includes(q) : c.op === 'ncontains' ? !s.includes(q) : c.op === 'is' ? s === q : s !== q; }
  if (k === 'select') { const list = ([] as unknown[]).concat(val); return c.op === 'any' ? list.indexOf(v) >= 0 : list.indexOf(v) < 0; }
  if (k === 'multi') { const list = ([] as unknown[]).concat(val), hit = ([] as unknown[]).concat(v || []).some((x) => list.indexOf(x) >= 0); return c.op === 'any' ? hit : !hit; }
  if (k === 'number') { const n = Number(v), q = parseFloat(val as string); if (isNaN(q)) return true; return c.op === 'eq' ? n === q : c.op === 'ne' ? n !== q : c.op === 'lt' ? n < q : n > q; }
  const d = blank(v) ? '' : String(v).slice(0, 10);
  if (c.op === 'within') { const w = WITHIN.find((x) => x.value === val) || WITHIN[0]; return d >= daysBefore(w.days, today); }
  return c.op === 'is' ? d === val : c.op === 'before' ? d < (val as string) : d > (val as string);
}
// a filter (or a condition group) against one row
export function matchesFilter(node: Filter | null | undefined, row: object, fields: Field[], today?: string): boolean {
  if (!node || !node.items || !node.items.length) return true;
  const t = (x: FilterItem): boolean => (x.group ? matchesFilter(x, row, fields, today) : matchesCondition(x, row, fields, today));
  return node.join === 'or' ? node.items.some(t) : node.items.every(t);
}
// every condition of a filter, its groups' included (the count on the Filter button)
export const conditionsOf = (node: Filter | null | undefined): Condition[] => ((node && node.items) || []).reduce<Condition[]>((l, x) => l.concat(x.group ? conditionsOf(x) : [x]), []);
let uid = 0;
export const nextId = (): string => 'c' + (++uid);
// a new condition on a field: its kind's first operator, no value yet
export const newCondition = (f: Field): Condition => ({ id: nextId(), field: f.value, op: OPERATORS[kindOf(f)][0][0], value: kindOf(f) === 'select' || kindOf(f) === 'multi' ? [] : '' });

// rows in the order of sort levels: a comparator
export function compareLevels(fields: Field[], levels: SortLevel[] | null | undefined): (a: object, b: object) => number {
  return (a, b) => {
    for (const l of levels || []) {
      const f = fields.find((x) => x.value === l.field); if (!f) continue;
      let x = valueOf(f, a) as any, y = valueOf(f, b) as any;   // compared as JavaScript compares them (text, numbers, an option's place)
      if (kindOf(f) === 'select' && f.options) { const o = optionsOf(f).map((p) => p.value); x = o.indexOf(x); y = o.indexOf(y); }
      if (Array.isArray(x)) x = x.join(', ');
      if (Array.isArray(y)) y = y.join(', ');
      const c = x < y ? -1 : x > y ? 1 : 0;
      if (c) return l.dir === 'desc' ? -c : c;
    }
    return 0;
  };
}

// the date quick filter: { preset: "any" | "7" | "30" | "year" | "custom", from, to } (ISO dates)
export const DATE_PRESETS: { value: string; label: string }[] = [{ value: 'any', label: english.fields.presets.any }, { value: '7', label: english.fields.presets['7'] }, { value: '30', label: english.fields.presets['30'] }, { value: 'year', label: english.fields.presets.year }];
export function matchesDate(range: DateRange | null | undefined, value: unknown, today?: string): boolean {
  if (!range || range.preset === 'any' || !range.preset) return true;
  const d = blank(value) ? '' : String(value).slice(0, 10);
  if (!d) return false;
  const now = today || iso(new Date());
  if (range.preset === '7' || range.preset === '30') return d >= daysBefore(Number(range.preset), now) && d <= now;
  if (range.preset === 'year') return d.slice(0, 4) === now.slice(0, 4);
  return (!range.from || d >= range.from) && (!range.to || d <= range.to);
}

// the words of the filter model in the reader's language: fw = useStrings('fields') (a hook-free helper set, so the panels, the query
// builder and the quick filters read them the same way)
export const fieldWords = {
  operators: (fw: FieldWords, kind: string): [string, string][] => (OPERATORS[kind] || []).map(([op, en]): [string, string] => [op, ((fw.operators || {})[kind] || {})[op] || en]),
  within: (fw: FieldWords) => WITHIN.map((w) => Object.assign({}, w, { label: (fw.within || {})[w.value] || w.label })),
  presets: (fw: FieldWords) => DATE_PRESETS.map((d) => Object.assign({}, d, { label: (fw.presets || {})[d.value] || d.label })),
  directions: (fw: FieldWords, kind: string): string[] => ((fw.directions || {})[kind]) || (DIRECTIONS as Record<string, string[]>)[kind],
};
