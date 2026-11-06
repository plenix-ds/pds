/* Plenix · DataGridEngine state
   Summary: Opening views and dimensions for the independent TanStack trial.
   Usage: Internal to DataGridEngine.
   Props: Existing DataGrid view props and storageKey.
   Behavior: Reads saved state before the first render; no post-build restoration.
   Notes: Canonical row keys preserve the distinction between numeric and string IDs. */
/** a row's key as the grid holds it: the type and the value, so 3 and "3" are two rows */
export const recordKey = (value: unknown): string => typeof value + ':' + String(value);
type SortInput = { field?: string; column?: string; dir?: string };
export type SortItem = { id: string; desc: boolean };
export const normalizeSort = (value: unknown): SortItem[] => (Array.isArray(value) ? (value as SortInput[]) : []).filter((x) => x && (x.field || x.column)).map((x) => ({ id: (x.field || x.column) as string, desc: x.dir === 'desc' }));
/** a view the grid saved: sort, order, hidden fields, widths, groups, row height */
export type SavedView = { sort?: SortInput[]; order?: string[]; hidden?: string[]; widths?: Record<string, number | string>; groupBy?: unknown; collapsed?: string[]; rowHeight?: string; editMode?: string; wrapHeaders?: boolean };
function readView(key?: string): SavedView | null { try { return key ? JSON.parse(localStorage.getItem('plx-data-grid:' + key) || localStorage.getItem('plx-data-table:' + key) || 'null') : null; } catch (e) { return null; } }   // the old key (before 2026-10-19) still read
export function writeView(key: string | undefined, view: unknown): void { if (key) try { localStorage.setItem('plx-data-grid:' + key, JSON.stringify(view)); } catch (e) { /* disabled storage */ } }
export const visibilityOf = (hidden: unknown): Record<string, false> => Object.fromEntries((Array.isArray(hidden) ? hidden : []).map((field) => [field, false]));
export const valueAt = (row: unknown, field: string | number): unknown => String(field).split('.').reduce<unknown>((value, key) => (value == null ? undefined : (value as Record<string, unknown>)[key]), row);
/** what opening reads of the grid's props */
export type OpeningProps = { columns: Array<{ field: string }>; onViewChange?: unknown; storageKey?: string; options?: { initialSort?: SortInput[]; groupBy?: unknown }; sort?: SortInput[]; columnOrder?: string[]; hiddenColumns?: string[];
  columnWidths?: Record<string, number | string>; groupBy?: unknown; collapsedGroups?: string[]; rowHeight?: string; wrapHeaders?: boolean };
export function opening(props: OpeningProps) {
  const saved: SavedView = props.onViewChange ? {} : readView(props.storageKey) || {}, options = props.options || {}, known = new Set(props.columns.map((c) => c.field));
  const fields = (values: unknown): string[] | undefined => (Array.isArray(values) ? [...new Set((values as string[]).filter((f) => known.has(f)))] : undefined);
  const groups = (value: unknown): unknown => {
    if (!Array.isArray(value)) return typeof value === 'string' ? (known.has(value) ? value : false) : value;
    const seen = new Set<string>(), next = value.filter((level) => { const field = typeof level === 'object' ? level.field : level; if (!known.has(field) || seen.has(field)) return false; seen.add(field); return true; });
    return next.length ? next : false;
  };
  const storedWidths = props.columnWidths ?? saved.widths;
  const widths: Record<string, number | string> = storedWidths && typeof storedWidths === 'object'
    ? Object.fromEntries(Object.entries(storedWidths).filter(([key, value]) => known.has(key) && Number.isFinite(parseFloat(String(value))) && parseFloat(String(value)) > 0)) : {};
  const step = ['short', 'medium', 'tall', 'extra-tall'].includes(saved.rowHeight as string) ? saved.rowHeight : props.rowHeight || 'short';
  return { sorting: normalizeSort(Array.isArray(props.sort) ? (!props.onViewChange && !props.sort.length && !saved.sort ? options.initialSort : props.sort) : saved.sort || options.initialSort).filter((item) => known.has(item.id)),
    order: fields(props.columnOrder) || fields(saved.order) || props.columns.map((c) => c.field),
    visibility: visibilityOf(fields(props.hiddenColumns) || fields(saved.hidden)), widths,
    groupBy: groups(props.groupBy ?? saved.groupBy ?? options.groupBy ?? false), collapsed: Array.isArray(props.collapsedGroups) ? props.collapsedGroups : Array.isArray(saved.collapsed) ? saved.collapsed : [], rowHeight: step, editMode: saved.editMode, wrapHeaders: saved.wrapHeaders ?? props.wrapHeaders ?? false };
}
