/* Plenix · DataGridEngine state
   Summary: Opening views and dimensions for the independent TanStack trial.
   Usage: Internal to DataGridEngine.
   Props: Existing DataGrid view props and storageKey.
   Behavior: Reads saved state before the first render; no post-build restoration.
   Notes: Canonical row keys preserve the distinction between numeric and string IDs. */
export const recordKey = value => typeof value + ':' + String(value);
export const normalizeSort = value => (Array.isArray(value) ? value : []).filter(x => x && (x.field || x.column)).map(x => ({ id: x.field || x.column, desc: x.dir === 'desc' }));
function readView(key) { try { return key ? JSON.parse(localStorage.getItem('plx-data-grid:' + key) || localStorage.getItem('plx-data-table:' + key) || 'null') : null; } catch (e) { return null; } }   // the old key (before 2026-10-19) still read
export function writeView(key, view) { if (key) try { localStorage.setItem('plx-data-grid:' + key, JSON.stringify(view)); } catch (e) { /* disabled storage */ } }
export const visibilityOf = hidden => Object.fromEntries((Array.isArray(hidden) ? hidden : []).map(field => [field, false]));
export const valueAt = (row, field) => String(field).split('.').reduce((value, key) => value == null ? undefined : value[key], row);
export function opening(props) {
  const saved = props.onViewChange ? {} : readView(props.storageKey) || {}, options = props.options || {}, known = new Set(props.columns.map(c=>c.field));
  const fields = values => Array.isArray(values) ? [...new Set(values.filter(f=>known.has(f)))] : undefined;
  const groups=value=>{if(!Array.isArray(value))return typeof value==='string'?(known.has(value)?value:false):value;const seen=new Set(),next=value.filter(level=>{const field=typeof level==='object'?level.field:level;if(!known.has(field)||seen.has(field))return false;seen.add(field);return true;});return next.length?next:false;};
  const storedWidths=props.columnWidths??saved.widths;
  const widths = storedWidths && typeof storedWidths==='object' ? Object.fromEntries(Object.entries(storedWidths).filter(([key,value])=>known.has(key)&&Number.isFinite(parseFloat(value))&&parseFloat(value)>0)) : {};
  const step = ['short','medium','tall','extra-tall'].includes(saved.rowHeight) ? saved.rowHeight : props.rowHeight || 'short';
  return { sorting: normalizeSort(Array.isArray(props.sort) ? (!props.onViewChange && !props.sort.length && !saved.sort ? options.initialSort : props.sort) : saved.sort || options.initialSort).filter(item=>known.has(item.id)),
    order: fields(props.columnOrder) || fields(saved.order) || props.columns.map(c => c.field),
    visibility: visibilityOf(fields(props.hiddenColumns) || fields(saved.hidden)), widths,
    groupBy:groups(props.groupBy??saved.groupBy??options.groupBy??false), collapsed:Array.isArray(props.collapsedGroups)?props.collapsedGroups:Array.isArray(saved.collapsed)?saved.collapsed:[], rowHeight: step, editMode: saved.editMode, wrapHeaders: saved.wrapHeaders ?? props.wrapHeaders ?? false };
}
