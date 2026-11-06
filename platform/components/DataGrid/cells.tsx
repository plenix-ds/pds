/* Plenix · DataGridEngine cells
   Summary: Existing Platform rich-cell parts rendered directly by React.
   Usage: <CellValue column={column} value={value} />
   Props: A column descriptor and its raw value; custom renderers stay with the table's cell adapter.
   Behavior: Formats bytes and renders deleted values, avatars, tags and status badges with shared CSS. In the pill view
     (pill) every other value is a DataPill with its column's type icon; column.pill(value, record) may return its tone,
     icon, variant, data and gender, and column.pill === false keeps the plain value. A person (type person, kind
     avatar-name) carries value.gender.
   Notes: A value of kind email, url, phone or code is a left-to-right island, of kind data one in its own direction, and of kind id one
     that follows the table's direction (Isolate; owner, issue 606: a computed identifier reads 01-20261020 in a right-to-left table). Imports no legacy grid implementation. Data still sorts and filters by its raw value. mods: the value classes the
     engine gives every value span (__value--wrap, --sized, --lines). */
import React from 'react';
import { Avatar } from '../Avatar/Avatar.tsx';
import { Badge } from '../Badge/Badge.tsx';
import { Tag } from '../Tag/Tag.tsx';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { DataPill } from '../DataPill/DataPill.tsx';
import { formatBytes, formatDate, parseDate } from '../../utils/format.ts';
import { Isolate } from '../Isolate/Isolate.tsx';
import { localDigits } from '../../utils/digits.ts';
import { useBarFit } from '../../utils/barFit.ts';
import CircleInfoIcon from 'plenix-platform/icons/plenix/circle-info';
export const valueText=(value: any): string=>value==null?'':Array.isArray(value)?value.map(valueText).join(', '):typeof value==='object'?String(value.label??value.name??''):String(value);
export function textFilter(row: any,field: any,search: any) {return valueText(row.getValue(field)).toLocaleLowerCase().includes(String(search??'').toLocaleLowerCase());}
export function listFilter(row: any,field: any,search: any) {const value=row.getValue(field);return [].concat(value??[]).some(item=>valueText(item).toLocaleLowerCase()===String(search??'').toLocaleLowerCase());}
export function byteFilter(row: any, field: any, search: any) {
  if (search == null || search === '') return true;
  const match = /^\s*(>=|<=|>|<|=|!=)?\s*(-?\d+(?:\.\d+)?)\s*(B|[KMGT]i?B)?\s*$/i.exec(String(search));
  if (!match) return false;
  const raw = row.getValue(field); if (raw === null || raw === undefined || raw === '') return false;
  const unit=(match[3]||'B').toUpperCase(),power=unit==='B'?0:['K','M','G','T'].indexOf(unit[0])+1;
  const amount = Number(match[2]) * Math.pow(unit.includes('I')?1024:1000,power), value = Number(row.getValue(field));
  if (!Number.isFinite(value)) return false;
  switch (match[1] || '=') { case '>': return value > amount; case '>=': return value >= amount; case '<': return value < amount; case '<=': return value <= amount; case '!=': return value !== amount; default: return value === amount; }
}
const DATA_TYPES = ['number', 'currency', 'date', 'bytes'];

// people picked in a person editor (issue 477): a column given only loadOptions has no list to find a saved id in, so the grid keeps the name and picture of each
// person picked, by column field and value, and the read cell draws them. Capped, oldest dropped first.
const PICKED_PEOPLE = new Map();
export function rememberPerson(field: any, value: any, option: any) {
  if (!option || value === undefined || value === null || value === '') return;
  const key = field + '|' + String(value); PICKED_PEOPLE.delete(key);
  PICKED_PEOPLE.set(key, { name: option.label, src: option.src, color: option.color, gender: option.gender });
  if (PICKED_PEOPLE.size > 500) PICKED_PEOPLE.delete(PICKED_PEOPLE.keys().next().value);
}
// a person column's id (a string or a number) as the person it names: the editor's options, else a person picked in this session; else it stays the raw value
function personOf(column: any, value: any) {
  const found = (column.editorProps?.options || []).find((o: any) => String(o.value) === String(value));
  if (found) return { name: found.label, src: found.src, color: found.color, gender: found.gender };
  return PICKED_PEOPLE.get(column.field + '|' + String(value)) || value;
}

export function CellValue({ column, value: given, strings, record, pill = false, pillField, icon, block = 'plx-data-grid', mods }: any) {
  const own = block + '__value' + (mods ? ' ' + mods : '');
  const kinds: string[] = [].concat(column.kind || []);
  const value = (column.type === 'person' || kinds.includes('avatar-name')) && given !== null && given !== undefined && given !== '' && typeof given !== 'object' ? personOf(column, given) : given;
  if (pill && column.pill !== false && value !== null && value !== undefined && value !== '' && !kinds.includes('tags') && !kinds.includes('badge') && !kinds.includes('deleted')) {
    const isPerson = column.type === 'person' || kinds.includes('avatar-name');
    const person = isPerson && typeof value === 'object' ? value : null;
    const own = typeof column.pill === 'function' ? column.pill(value, record) || {} : {};
    const text = column.type === 'bytes' ? formatBytes(Number(value)) : column.type === 'date' && parseDate(value) ? formatDate(value) : person ? (person.name || person.label || '') : valueText(value);
    return <DataPill size="md" data-plx-pill-field={pillField} tone={own.tone} variant={own.variant} icon={own.icon || (isPerson ? undefined : icon)} person={isPerson} gender={own.gender || (person ? person.gender : undefined)}
      data={own.data !== undefined ? own.data : kinds.includes('data') || DATA_TYPES.includes(column.type)} kind={kinds.includes('id') ? 'id' : undefined} fill={own.fill}>{text}</DataPill>;
  }
  if (value === null || value === undefined || value === '') return <span className={own+(kinds.includes('deleted')?' '+block+'__deleted':'')}>{column.empty??(kinds.includes('deleted')?strings?.deleted||'Deleted':'')}</span>;
  if (column.type === 'bytes') return <span className={own}>{formatBytes(Number(value))}</span>;
  // a date column reads a Date, a timestamp or a bare "YYYY-MM-DD" as the viewer's local calendar day (issue 161)
  if (column.type === 'date' && parseDate(value)) return <span className={own}>{localDigits(formatDate(value))}</span>;
  if (kinds.includes('deleted')) return <span className={`${own} ${block}__deleted`}>{valueText(value)}</span>;
  if (kinds.includes('avatar-name')) { const person = typeof value === 'object' ? value : { name: String(value) }, name=person.name||person.label||''; return <span className={`${block}__rich`}><Avatar name={name} src={person.src} size="2xs" aria-hidden="true" /><span className={own}>{name}</span></span>; }
  if (kinds.includes('tags')) return <TagsCell tags={[].concat(value)} block={block} />;
  if (kinds.includes('badge')) { const badge = typeof value === 'object' ? value : { label: String(value) }; return <Badge tone={badge.tone} icon={badge.icon||CircleInfoIcon}>{badge.label}</Badge>; }
  // the full text on hover, only when the cell cuts it off with an ellipsis (owner, 2026-10-22)
  // a technical value keeps its own direction inside a right-to-left table (owner, ctm-needs-34): emails, URLs, phone
  // numbers and code read left to right; an id reads as the table does (01-20261020 in a right-to-left one); any other data value
  // by its first strong letter
  const island=ISLANDS.find(k=>kinds.includes(k));
  if (island) return <span className={own} onMouseEnter={fullText}><Isolate dir={island==='data'?'auto':island==='id'?undefined:'ltr'} kind={island==='email'||island==='url'||island==='id'?island:undefined}>{valueText(value)}</Isolate></span>;
  return <span className={own} onMouseEnter={fullText}>{localDigits(valueText(value))}</span>;
}

// A tags cell: the tags that fit, then one "+N" Tag for the rest (design 84-cell-editors §2 and §3, issue 477). The fit is useBarFit's (the same step
// ladder as the command bar and the tags editor): the row starts with every tag, and each step hides one more from the end until the row fits on one line.
// The "+N" Tag is named "{count} more" (the same words as the tags editor's) and the hidden tags show in a Tooltip on hover and keyboard focus (D-0065).
function TagsCell({ tags, block }: { tags: any[]; block: string }) {
  const more: string = (useStrings('combobox') as any).moreChips, box = React.useRef<any>(null), label = (tag: any) => (typeof tag === 'object' ? tag.label : String(tag)), names = tags.map(label);
  const step = useBarFit(box, names.join('|'), Math.max(0, tags.length - 1), 0, ':self');
  const hidden = tags.slice(tags.length - step), listed = hidden.map(label).join(', '), descId = React.useId();
  // the first tag may be cut (its text ends in an ellipsis, Tag's rule); then its full name goes in the same Tooltip as the hidden ones, first
  const [firstCut, setFirstCut] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = box.current && box.current.querySelector('.plx-tag__label');
    if (!el) { setFirstCut(false); return undefined; }
    const check = () => setFirstCut(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(check);
    if (ro) ro.observe(el);
    return () => { if (ro) ro.disconnect(); };
  }, [names.join('|'), step]);
  const tip = (firstCut ? names[0] + (listed ? ', ' : '') : '') + listed;
  // the table keeps one Tab stop (owner answer 7): a tag is not a stop of its own. Its Tooltip shows while its cell is the active cell (the cell has the focus: the Tag is told, as a
  // focus on it would be): the "+N" Tag's (the cut first name, then the hidden ones), else the first tag's own when it is cut. The hidden names are the cell's description for a screen reader.
  React.useEffect(() => {
    const cell = box.current && box.current.closest('[data-plx-field]');
    const target = hidden.length ? box.current && box.current.querySelector('[data-plx-more]') : firstCut ? box.current && box.current.querySelector('.plx-tag__label') : null;
    if (!cell || !target) return undefined;
    const tell = (type: any) => (event: any) => { if (event.target === cell) target.dispatchEvent(new FocusEvent(type, { bubbles: true, relatedTarget: null })); };
    const on = tell('focusin'), off = tell('focusout');
    cell.addEventListener('focusin', on); cell.addEventListener('focusout', off);
    const before = cell.getAttribute('aria-describedby'); if (listed) cell.setAttribute('aria-describedby', (before ? before + ' ' : '') + descId);
    if (document.activeElement === cell) target.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    return () => { cell.removeEventListener('focusin', on); cell.removeEventListener('focusout', off); if (!listed) return; if (before) cell.setAttribute('aria-describedby', before); else cell.removeAttribute('aria-describedby'); };
  }, [hidden.length, firstCut, listed, descId]);
  return (
    <span ref={box} className={`${block}__rich ${block}__rich--tags`}>
      {tags.slice(0, tags.length - step).map((tag: any, i: any) => <Tag key={i} className={i > 0 ? `${block}__tag-fixed` : undefined} category={typeof tag === 'object' ? tag.category : undefined}>{label(tag)}</Tag>)}
      {hidden.length ? (
        <>
          <Tooltip content={tip} describe={false}>
            <Tag className={`${block}__tag-fixed`} tabIndex={-1} data-plx-more="" aria-label={more.replace('{count}', String(hidden.length))}>{'+' + hidden.length}</Tag>
          </Tooltip>
          <span id={descId} className="plx-visually-hidden">{listed}</span>
        </>
      ) : null}
    </span>
  );
}
const ISLANDS=['id','email','url','phone','code','data'];
function fullText(event: any) { const el = event.currentTarget; if (el.scrollWidth > el.clientWidth) el.title = el.textContent; else el.removeAttribute('title'); }
