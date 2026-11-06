/* Plenix · DataGridEngine records
   Summary: Canonical records, immutable edits and multi-membership grouping for the independent renderer.
   Usage: Internal to DataGridEngine.
   Props: TanStack rows, column descriptors and grouping fields.
   Behavior: Repeated memberships share one canonical record; group display instances have separate keys.
   Notes: No legacy engine models or renderer code are imported. */
import { recordKey, valueAt } from './state.js';
export function recordsOf(rows, index = 'id', children = null) {
  const found = new Map(), visited = new Set();
  function visit(list) { for (const record of list || []) { if (!record || visited.has(record)) continue; visited.add(record); const key = recordKey(record[index]); if (!found.has(key)) found.set(key, record); if (children && Array.isArray(record[children])) visit(record[children]); } }
  visit(rows); return [...found.values()];
}
export function setField(record, field, value) {
  const path = String(field).split('.');
  if (path.some(part => ['__proto__', 'constructor', 'prototype'].includes(part))) throw Error('Unsupported field path');
  const result = { ...record }; let at = result, original = record;
  path.forEach((part, i) => { if (i === path.length - 1) at[part] = value; else { at[part] = Array.isArray(original && original[part]) ? original[part].slice() : { ...(original && original[part]) }; at = at[part]; original = original && original[part]; } });
  return result;
}
export function changeRecord(rows, key, change, index = 'id', children = null) {
  return rows.flatMap(record => {
    if (recordKey(record[index]) === key) { const next = change(record); return next == null ? [] : [next]; }
    if (children && Array.isArray(record[children])) return [{ ...record, [children]: changeRecord(record[children], key, change, index, children) }];
    return [record];
  });
}
export const valueKey = value => value == null || value === '' ? 'empty' : typeof value + ':' + JSON.stringify(value);
// Calendar groups use UTC, so persisted group keys do not depend on the viewer's time zone.
export function groupValue(value, level, column = {}) {
  if (value == null || value === '') return null;
  if (typeof column.groupBucket === 'function') return column.groupBucket(value);
  const config = typeof level === 'object' ? level : {};
  const interval = config.interval || (column.type === 'date' ? 'day' : undefined);
  if (['day', 'week', 'month', 'year'].includes(interval)) {
    const date = new Date(value); if (!Number.isFinite(date.getTime())) return null;
    // a bare "YYYY-MM-DD" is its own calendar day (read as UTC, so its UTC parts are the day); a Date or a timestamp is the viewer's local day (issue 161)
    const local = typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value);
    const year = local ? date.getFullYear() : date.getUTCFullYear(), month = local ? date.getMonth() : date.getUTCMonth(), dayOfMonth = local ? date.getDate() : date.getUTCDate();
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
export function groupedRows(rows, fields, columns) {
  const levels = typeof fields === 'string' || typeof fields === 'function' ? [fields] : Array.isArray(fields) ? fields.filter(Boolean) : [];
  function build(input, depth, path) {
    if (depth >= levels.length) return [];
    const level = levels[depth], field = typeof level === 'object' ? level.field : level, column = columns.find(column => column.field === field) || {}, buckets = new Map();
    for (const row of input) {
      const raw = typeof field === 'function' ? field(row.original) : valueAt(row.original,field), multiple = column.multi || column.type === 'multi';
      const values = multiple && Array.isArray(raw) ? raw.length ? raw : [null] : [raw];
      const seen = new Set();
      for (const original of values) {
        const value = groupValue(original, level, column);
        const key = valueKey(value); if (seen.has(key)) continue; seen.add(key);
        if (!buckets.has(key)) buckets.set(key, { value, rows: [] }); buckets.get(key).rows.push(row);
      }
    }
    return [...buckets.values()].map((bucket, bucketIndex) => {
      const nextPath = path.concat({ field, value: bucket.value }), key = 'group:' + JSON.stringify(nextPath.map(part => [part.field, valueKey(part.value)]));
      const unique = [...new Map(bucket.rows.map(row => [row.id, row])).values()];
      return { id: key, field, value: bucket.value, depth, separated:bucketIndex>0, path: nextPath, rows: unique, groups: build(unique, depth + 1, nextPath) };
    });
  }
  return build(rows, 0, []);
}
export function groupDisplay(groups, collapsed, add, gaps = true) {
  const display = [];
  function visit(group) {
    display.push({ id: group.id, displayKey: group.id, __group: group });
    if (collapsed.has(group.id)) return;
    if (group.groups.length) siblings(group.groups);
    else group.rows.forEach(row => display.push({ ...row, displayKey: group.id + ':' + row.id }));
    if (add) display.push({ id: group.id + ':add', displayKey: group.id + ':add', __add: group });
  }
  function siblings(list) { list.forEach((group,i)=>{if(i&&gaps)display.push({id:group.id+':gap',displayKey:group.id+':gap',__gap:true});visit(group);}); }
  siblings(groups);
  return display;
}
