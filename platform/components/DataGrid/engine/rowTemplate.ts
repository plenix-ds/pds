/* Plenix · DataGrid engine · row template
   Summary: Which column fills which slot of a row template (issue 839, owner 2026-11-01: A, B and wide as options). The six slots are
     title, subtitle, date, primary, secondary and tertiary. The app maps columns to slots with `template`; slots it leaves out are
     filled from the column order by one fixed rule. The result tells the grid how to draw a record as a card (layout A or B, in the
     narrow view) or as one aligned row (layout wide, at any width).
   Usage:
     import { useRowTemplate } from './engine/rowTemplate.ts';
     const resolved = useRowTemplate(props);   // the grid's props, with columns, narrow and rowTemplate set for a layout; the props as given when no layout or template is set
     resolveRowTemplate({ columns, layout, template })   // { layout, slots, slotOf, keep } or null
   Props:
     layout: "A" | "B" | "wide" | "plain". A and B are for the narrow view: the grid is a table while its visible columns fit its width, else every
       record is a card of three rows (the #679 switch is unchanged). "wide" draws the same slots as one aligned row, with a divider between
       columns, at any width. "plain" is the card of before the template (the key values, then every other field as a labeled detail).
       Neither layout nor template set (issue 679, owner 2026-11-01: every grid, by default): the narrow card is layout "A", with the slots filled by
       the rule below; keyColumns, if the app gives them, are the title, the subtitle and the primary value; a grid with narrow="table" stays a
       table. DEFAULT_LAYOUT names the default.
     template: { title, subtitle, date, primary, secondary, tertiary }, each the `field` of a column; every slot is optional.
   Behavior:
     Slots the app does not name are filled in this fixed order from the columns that can be shown (not a row handle, icon or actions column),
       in the order of the `columns` prop (never the person's view order), skipping columns the app already named:
       1. date: the first column of type date or datetime; primary: the first column of type number, currency or percent;
       2. title, subtitle, primary, secondary, tertiary, date: each still empty slot takes the next remaining column, in that order.
     A column that fills no slot is not drawn in a card that names its layout or template (less to scan); the record's other fields show when the row is
       opened. The default card (no layout, no template) keeps them as "Label: value" lines under its last line, so no field of an existing grid
       disappears from its narrow view. In wide,
       the columns are the slots, in the order title, subtitle, date, primary, secondary, tertiary (the row handle and icon columns first,
       the actions last).
     A template field that is not a column, or named twice, is ignored (the first slot that names it keeps it).
   Notes:
     The slot of a cell is its class (plx-data-grid__cell--slot-<name>); every other behavior (selection, the open row, the keyboard, the row
     menu, editing) is the grid's own, because a card is the same row with its cells placed in a grid.
*/
import React from 'react';
import { kinds } from './helpers.tsx';
import type { GridColumn, RowTemplate, ResolvedTemplate } from '../types.ts';

// the layout of a grid that names none (owner, 2026-11-01: A)
const DEFAULT_LAYOUT = 'A';
const SLOTS: Array<keyof RowTemplate> = ['title', 'subtitle', 'date', 'primary', 'secondary', 'tertiary'];
const FILL: Array<keyof RowTemplate> = ['title', 'subtitle', 'primary', 'secondary', 'tertiary', 'date'];
const LAYOUTS: Record<string, string> = { A: 'A', B: 'B', WIDE: 'wide' };
const DATES = ['date', 'datetime'], NUMBERS = ['number', 'currency', 'percent'];
const showable = (c: GridColumn): boolean => !c.rowHandle && !kinds(c).some((k) => k === 'icon' || k === 'actions');
const typed = (c: GridColumn): string => c.type || (c.sorter === 'number' ? 'number' : c.sorter === 'date' ? 'date' : 'text');

// narrow: the grid's narrow prop; a grid that names no layout and no template gets the default layout in its narrow card (unless it is a table by choice, or layout "plain")
type RowTemplateProps = { columns: GridColumn[]; layout?: string; template?: RowTemplate | null; keyColumns?: string[]; narrow?: string; [key: string]: unknown };
function resolveRowTemplate({ columns, layout, template, keyColumns, narrow }: RowTemplateProps): ResolvedTemplate | null {
  if (layout === 'plain') return null;   // the plain card of before: every other field a labeled detail
  const implicit = layout === undefined && !template;
  if (implicit && narrow !== undefined && narrow !== 'auto' && narrow !== 'list') return null;
  const kind = LAYOUTS[String(layout === undefined ? DEFAULT_LAYOUT : layout).toUpperCase()];
  if (!kind) return null;
  // keyColumns keep their meaning: the first three are the title, the subtitle and the primary value
  if (implicit && keyColumns && keyColumns.length) template = { title: keyColumns[0], subtitle: keyColumns[1], primary: keyColumns[2] };
  const list = columns.filter(showable), known = new Set(list.map((c) => c.field));
  const slots: ResolvedTemplate['slots'] = {}, used = new Set<string>();
  for (const slot of SLOTS) {
    const field = template ? template[slot] : undefined;
    if (field !== undefined && known.has(field) && !used.has(field)) { slots[slot] = field; used.add(field); }
  }
  const take = (slot: keyof RowTemplate, test: (c: GridColumn) => boolean) => {
    if (slots[slot] !== undefined) return;
    const column = list.find((c) => !used.has(c.field) && test(c));
    if (column) { slots[slot] = column.field; used.add(column.field); }
  };
  take('date', (c) => DATES.includes(typed(c)));
  take('primary', (c) => NUMBERS.includes(typed(c)));
  for (const slot of FILL) take(slot, () => true);
  const slotOf: ResolvedTemplate['slotOf'] = {};
  for (const slot of SLOTS) if (slots[slot] !== undefined) slotOf[slots[slot]] = slot;
  // an explicit layout draws only the slots (the rest shows when the row is opened); the default draws every column, the ones no slot takes as labeled details under the last line
  const keep = new Set(columns.filter((c) => implicit || !showable(c) || slotOf[c.field]).map((c) => c.field));
  return { layout: kind, slots, slotOf, keep, implicit };
}

// wide: the slots as columns in slot order, the handle and icon columns first, the actions last
const wideColumns = (columns: GridColumn[], resolved: ResolvedTemplate) => {
  const first = columns.filter((c) => !showable(c) && !kinds(c).includes('actions')),
    last = columns.filter((c) => kinds(c).includes('actions')),
    byField = new Map(columns.map((c) => [c.field, c]));
  return first.concat(SLOTS.filter((s) => resolved.slots[s] !== undefined).map((s) => byField.get(resolved.slots[s] as string) as GridColumn), last);
};

export function useRowTemplate<P extends RowTemplateProps>(props: P): P & { rowTemplate?: ResolvedTemplate } {
  const { columns, layout, template, narrow, keyColumns } = props;
  const signal = JSON.stringify(template || null);
  return React.useMemo(() => {
    const resolved = resolveRowTemplate({ columns, layout, template, keyColumns, narrow });
    if (!resolved) return props;
    return Object.assign({}, props, { rowTemplate: resolved }, resolved.layout === 'wide' ? { columns: wideColumns(columns, resolved), narrow: 'table' } : null);
  }, [props, columns, layout, signal, narrow, keyColumns]);   // eslint-disable-line react-hooks/exhaustive-deps
}
