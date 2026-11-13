/* Plenix · DataGridEngine records
   Summary: Canonical records, immutable edits and multi-membership grouping for the independent renderer.
   Usage: Internal to DataGridEngine.
   Props: TanStack rows, column descriptors and grouping fields.
   Behavior: Repeated memberships share one canonical record; group display instances have separate keys.
   Notes: No legacy engine models or renderer code are imported. */
import { recordKey, valueAt } from './state.ts';
/** a record as the application gave it */
export type DataRecord = Record<string, unknown>;
/** a column as grouping reads it */
import { parseDate } from '../../utils/format.ts';
export type GroupColumn = { field?: string; type?: string; multi?: boolean; groupBucket?: (value: unknown) => unknown; groupRange?: number; timestamp?: 'ms' | 's' };
/** a grouping level: a field, a function of the record, or { field, interval, range } */
export type GroupLevel = string | ((record: DataRecord) => unknown) | { field: string; interval?: string; range?: number };
/** a table row as TanStack gives it: the record and its row id */
type TableRowLike = { id: string; original: DataRecord };
/** one group: its rows, its subgroups and its place in the path */
export type Group = { id: string; field: unknown; value: unknown; depth: number; separated: boolean; path: Array<{ field: unknown; value: unknown }>; rows: TableRowLike[]; groups: Group[] };
export function recordsOf(rows: DataRecord[], index = 'id', children: string | null = null): DataRecord[] {
  const found = new Map<string, DataRecord>(), visited = new Set<DataRecord>();
  function visit(list: DataRecord[] | undefined): void { for (const record of list || []) { if (!record || visited.has(record)) continue; visited.add(record); const key = recordKey(record[index]); if (!found.has(key)) found.set(key, record); if (children && Array.isArray(record[children])) visit(record[children]); } }
  visit(rows); return [...found.values()];
}
export function setField(record: DataRecord, field: string, value: unknown): DataRecord {
  const path = String(field).split('.');
  if (path.some((part) =>  ['__proto__', 'constructor', 'prototype'].includes(part))) throw Error('Unsupported field path');
  const result: DataRecord = { ...record }; let at = result, original: DataRecord | undefined = record;
  path.forEach((part, i) => { if (i === path.length - 1) at[part] = value; else { const was = original && original[part]; at[part] = Array.isArray(was) ? was.slice() : { ...(was as DataRecord | undefined) }; at = at[part] as DataRecord; original = was as DataRecord | undefined; } });
  return result;
}
export function changeRecord(rows: DataRecord[], key: string, change: (record: DataRecord) => DataRecord | null | undefined, index = 'id', children: string | null = null): DataRecord[] {
  return rows.flatMap(record => {
    if (recordKey(record[index]) === key) { const next = change(record); return next == null ? [] : [next]; }
    if (children && Array.isArray(record[children])) return [{ ...record, [children]: changeRecord(record[children], key, change, index, children) }];
    return [record];
  });
}
export const valueKey = (value: unknown): string => value == null || value === '' ? 'empty' : typeof value + ':' + JSON.stringify(value);
// Calendar groups use UTC, so persisted group keys do not depend on the viewer's time zone.
export function groupValue(value: unknown, level?: GroupLevel, column: GroupColumn = {}): unknown {
  if (value == null || value === '') return null;
  if (typeof column.groupBucket === 'function') return column.groupBucket(value);
  const config: { interval?: string; range?: number } = typeof level === 'object' ? level : {};
  const interval = config.interval || (column.type === 'date' ? 'day' : undefined);
  if (interval && ['day', 'week', 'month', 'year'].includes(interval)) {
    // parseDate reads a bare "YYYY-MM-DD" as its own calendar day and a Date or a timestamp as the viewer's local day (issue 161, #342)
    const date = parseDate(value, { timestamp: column.timestamp as any }); if (!date) return null;
    const year = date.getFullYear(), month = date.getMonth(), dayOfMonth = date.getDate();
    if (interval === 'year') return String(year);
    if (interval === 'month') return new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 7);
    const day = new Date(Date.UTC(year, month, dayOfMonth));
    if (interval === 'week') day.setUTCDate(day.getUTCDate() - (day.getUTCDay() + 6) % 7);
    return day.toISOString().slice(0, 10);
  }
  const step = Number(config.range ?? column.groupRange);
  if (Number.isFinite(step) && step > 0 && typeof value === 'number' && Number.isFinite(value)) {
    const start = Math.floor(value / step) * step;
    return '[' + start + ', ' + (start + step) + ')';
  }
  return value;
}
export function groupedRows(rows: TableRowLike[], fields: unknown, columns: GroupColumn[]): Group[] {
  const levels: GroupLevel[] = typeof fields === 'string' || typeof fields === 'function' ? [fields as GroupLevel] : Array.isArray(fields) ? (fields as GroupLevel[]).filter(Boolean) : [];
  function build(input: TableRowLike[], depth: number, path: Array<{ field: unknown; value: unknown }>): Group[] {
    if (depth >= levels.length) return [];
    const level = levels[depth], field = typeof level === 'object' ? level.field : level, column = columns.find(column => column.field === field) || {}, buckets = new Map<string, { value: unknown; rows: TableRowLike[] }>();
    for (const row of input) {
      const raw = typeof field === 'function' ? field(row.original) : valueAt(row.original,field), multiple = column.multi || column.type === 'multi';
      const values = multiple && Array.isArray(raw) ? raw.length ? raw : [null] : [raw];
      const seen = new Set();
      for (const original of values) {
        const value = groupValue(original, level, column);
        const key = valueKey(value); if (seen.has(key)) continue; seen.add(key);
        if (!buckets.has(key)) buckets.set(key, { value, rows: [] }); buckets.get(key)!.rows.push(row);
      }
    }
    return [...buckets.values()].map((bucket, bucketIndex) => {
      const nextPath = path.concat({ field, value: bucket.value }), key = 'group:' + JSON.stringify(nextPath.map((part) => [part.field, valueKey(part.value)]));
      const unique = [...new Map(bucket.rows.map((row) => [row.id, row] as const)).values()];
      return { id: key, field, value: bucket.value, depth, separated:bucketIndex>0, path: nextPath, rows: unique, groups: build(unique, depth + 1, nextPath) };
    });
  }
  return build(rows, 0, []);
}
export function groupDisplay(groups: Group[], collapsed: Set<string>, add: boolean, gaps = true) {
  const display: Array<Record<string, unknown>> = [];
  function visit(group: Group): void {
    display.push({ id: group.id, displayKey: group.id, __group: group });
    if (collapsed.has(group.id)) return;
    if (group.groups.length) siblings(group.groups);
    else group.rows.forEach((row) => display.push({ ...row, displayKey: group.id + ':' + row.id }));
    if (add) display.push({ id: group.id + ':add', displayKey: group.id + ':add', __add: group });
  }
  function siblings(list: Group[]): void { list.forEach((group, i) => {if(i&&gaps)display.push({id:group.id+':gap',displayKey:group.id+':gap',__gap:true});visit(group);}); }
  siblings(groups);
  return display;
}
