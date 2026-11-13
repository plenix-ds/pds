/* Plenix · DataGrid engine · the engine's small shared values and functions
   Summary: The engine's small shared values and functions: the grid's class name (GRID), what counts as interactive
     inside a row, the icon for each column type (typeIcons), how a column's type is found (typeOf), the sort helpers
     (sorted, compare), words (fills a template) and cellDirection (marks a cell's text direction).
   Usage:
     import { GRID, typeIcons, typeOf, sorted, compare, words, cellDirection } from './engine/helpers.tsx';
   Props:
     none: a module of constants and plain functions, used only by the DataGrid engine (not a public export)
   Notes:
     Moved out of DataGridEngine.tsx without any change to the code (issue 688). The engine is documented in DataGridEngine.tsx.
*/
import React from 'react';
import { valueText } from '../cells.tsx';
import type { GridColumn } from '../types.ts';
import AttachmentIcon from 'plenix-platform/icons/plenix/attachment';
import CalendarIcon from 'plenix-platform/icons/plenix/calendar';
import EdTextIcon from 'plenix-platform/icons/plenix/ed-text';
import FieldCurrencyIcon from 'plenix-platform/icons/plenix/field-currency';
import FieldLongTextIcon from 'plenix-platform/icons/plenix/field-long-text';
import FieldNumberIcon from 'plenix-platform/icons/plenix/field-number';
import FieldSelectIcon from 'plenix-platform/icons/plenix/field-select';
import ImageAN2Icon from 'plenix-platform/icons/plenix/image-a-2';
import LinkIcon from 'plenix-platform/icons/plenix/link';
import PersonIcon from 'plenix-platform/icons/plenix/person';
import SelectIcon from 'plenix-platform/icons/plenix/select';

// Frozen cells inherit the grid direction for logical sticky placement; their values retain automatic bidi.
export const cellDirection = (enabled: boolean, content: React.ReactNode) =>
  enabled ? (
    <span className={GRID + '__cell-direction'} dir="auto">
      {content}
    </span>
  ) : (
    content
  );

export const EMPTY_ROWS: never[] = [];

export const words = (template: unknown, values: Record<string, unknown>): string => String(template).replace(/\{(\w+)\}/g, (match, key) => String(values[key] ?? match));

export const GRID = 'plx-data-grid',
  interactive = 'a,button,input,select,textarea,label,[role="button"],[contenteditable="true"],[data-plx-no-row-click]';

export const typeIcons = {
  multi: FieldSelectIcon,
  text: EdTextIcon,
  number: FieldNumberIcon,
  bytes: AttachmentIcon,
  currency: FieldCurrencyIcon,
  date: CalendarIcon,
  select: FieldSelectIcon,
  checkbox: SelectIcon,
  file: AttachmentIcon,
  image: ImageAN2Icon,
  link: LinkIcon,
  person: PersonIcon,
  'long-text': FieldLongTextIcon
};

export const kinds = (c: Pick<GridColumn, 'kind'>): string[] => ([] as string[]).concat(c.kind || []);

export const typeOf = (c: GridColumn): string =>
  c.type ||
  (kinds(c).includes('wrap') ? 'long-text' : c.sorter === 'number' ? 'number' : c.sorter === 'date' ? 'date' : 'text');

export const sorted = (s: Array<{ id: string; desc?: boolean }>) => s.map((x) => ({ field: x.id, dir: x.desc ? 'desc' : 'asc' }));

export { lengthName } from './lengthName.ts';

const sortCollator = new Intl.Collator(undefined, { numeric: true });

export const compare = (a: { getValue: (id: string) => unknown }, b: { getValue: (id: string) => unknown }, id: string): number => {
  const x = a.getValue(id),
    y = b.getValue(id);
  if (x == null || y == null) return x == null ? (y == null ? 0 : -1) : 1;
  return sortCollator.compare(valueText(x), valueText(y));
};
