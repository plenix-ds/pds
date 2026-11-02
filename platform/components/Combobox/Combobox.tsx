/* Plenix · Combobox
   Summary: A field with a list to choose from, filtered as you type (an ARIA combobox with a listbox).
   Usage:
     <Combobox label="Owner" options={[{ value: 'mc', label: 'Maya Chen' }]} value={owner} onChange={(value) => …} />
     <Combobox multiple creatable options={tags} values={chosen} onChange={(values) => …} onCreate={(text) => …} />
     <Combobox label="Owner" loadOptions={(text) => api.people(text)} value={owner} onChange={…} />   // async select
     <Combobox multiple marks="checkbox" options={…} values={…} onChange={…} />                        // checkbox select
     <Combobox marks="radio" options={…} value={…} onChange={…} />                                     // radio select
   Props:
     width: "xs" | "sm" | "md" | "lg" (the field-width scale, --plx-sys-field-width-*: pick by what it holds) | "fill" (the whole
       width); without a pattern sizing it, the field is never wider than its container (P-52, owner 2026-10-19)
     data: true forces the technical-value font on the field, false keeps the interface font; when not set, a chosen option whose label is wholly
       a number, a date or another technical value ("10", "Oct 25, 2026") shows in the data font, as a Select does
     size: "sm" | "md" (default): "sm" uses the existing toolbar control height; "md" keeps the standard field; multiple values can grow.
     options: the choices: [{ value, label, group, icon, description }]; options with a group are listed under its heading, in the order the groups first appear;
       icon (an icon name) shows before the label and description is a second line under it (as EntityPicker's options do; the label and the description
       are both searched); no other drawing of the row
     value: a string or a number: the chosen value, for a single choice
     values: an array: the chosen values, with multiple
     onChange(value): runs with the chosen value; with multiple it runs with the new array of values
     multiple: allows several values; chosen values show as tags before the field (default false)
     creatable: offers "Create “text”" when nothing matches exactly (default false)
     onCreate(text): runs with the typed text when "Create" is chosen
     placeholder: the hint in the empty field
     label: the accessible name when there is no Field
     invalid: shows the invalid state
     warning: true shows a warning state beside invalid (a Field with a warning sets it): a warning border and fill; the Field draws its icon and message
     disabled: the field cannot be used
     readOnly: shows the value and does not change it: the list does not open, nothing is chosen, created or removed (the tags lose their remove button);
       default the nearest ReadOnly region's (useReadOnly). CountrySelect passes it on
     emptyText: a string: the text when nothing matches (default "No matches")
     emptyAction: { label, onSelect(text), icon }: one action below "No matches" (for example "Add new"): a row the arrow keys reach and Enter
       or a click chooses; onSelect runs with the typed text and the list closes. Only when nothing matches (not while loading or after a failed load)
       The empty text is announced politely when the action row appears (that text is not an option, so the list alone would not say it)
     clearable: a Clear button at the end of the field, shown while there is text or a chosen value: it empties the text and the chosen values
       (onChange with '' or, with multiple, []) and returns focus to the field, as SearchField's does (default false; not in a read-only or disabled field)
     loadOptions(text): loads the options for the typed text (async select): returns the options or a Promise of them;
       the list shows those options as they are (the loader filters), while they load a spinner and "Loading…"
     loadDelay: the pause after typing before loadOptions runs, in milliseconds (default 300; 0 when the field is empty)
     minChars: the characters needed before loadOptions runs (default 0: it also loads when the list opens)
     loading: shows the loading row whatever loadOptions does (for options the caller loads itself) (default false)
     marks: a mark before each option: "checkbox" (several, with multiple) | "radio" (one choice) | none (default)
     strings: the words it shows and announces, for other languages: { loading: "Loading…", error: "The options could not
       be loaded", clear: "Clear", results: (n) => n + " options" } (results is announced after each load)
     id: the id of the input (a Field sets it)
     className: more classes on the combobox
     ref: forwarded to the <input>
   Behavior:
     The typed text is marked in each result it matches, every occurrence, in either case, by the shared helper (utils/highlight.tsx:
       highlightMatch; matchesText decides what is listed). An option's description is searched and marked the same way, so the
       mark says why a row is listed. Arabic matches without its vowel marks, and a match of Arabic letters is
       underlined instead of set heavier, so the joined letters stay whole. The list is read as plain text.
     The list opens on focus and on typing, and closes on a click outside. It opens in the browser's top layer, below the field
       (or above it near an edge), at least as wide as the field, placed like a Menu: no dialog, drawer or scroll area clips it.
     ↓ / ↑ move, Enter chooses, Escape closes. On a closed list ↓ and Alt+↓ open it on the first option, ↑ on the last;
       Alt+↓ on an open list moves nothing. Escape on a closed list leaves the value as it is (issue 706: the WAI-ARIA
       pattern makes clearing optional, and a chosen value is never lost to one key; clear it with the text or a tag's
       remove button).
     Backspace in an empty multiple field removes the last value.
     A single choice closes the list; with multiple, the list stays open after each choice.
     Tags (multiple without marks): the list offers only the values not chosen yet, so Enter or a click always adds; a
       chosen value is removed only by its tag's remove button (or Backspace in the empty field). Typing a chosen tag's
       exact name offers nothing (no duplicate, no Create).
     Checkbox select (multiple with marks="checkbox"): every option stays listed and choosing one toggles it.
     A tag's remove button removes its value.
     A single choice whose label is wider than the field ends in an ellipsis and shows the whole label in a tooltip on hover
       and focus, only while it is cut (issue 558); while the list is open the tooltip sits above the field.
     With loadOptions, each pause in typing loads once; an answer that arrives after a newer request is dropped. The list
       is busy (aria-busy) while it loads, the number of options is announced politely, a failed load says so in the list.
     Options loaded earlier keep naming the chosen values when a later load no longer has them.
     Marks are the Checkbox and Radio controls drawn inside the option: not focusable and hidden from assistive
       technology (the option's own aria-selected says it is chosen).
   Notes:
     The list is a menu surface: border only, no shadow (D9).
     Other props pass through to the <input>.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { highlightMatch, matchesText } from '../../utils/highlight.tsx';
import { Tag } from '../Tag/Tag.tsx';
import { Button } from '../Button/Button.tsx';
import { Spinner } from '../Loading/Loading.tsx';
import { announce } from '../../utils/announce.tsx';
import { useFloating, TOP_LAYER } from '../../utils/floating.ts';
import { useStrings, useLocale } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import { useReadOnly } from '../../providers/ReadOnly.tsx';
import { isDataValue } from '../../utils/dataValue.ts';
import { formatNumber } from '../../utils/format.ts';
import { Icon } from '../Icon/Icon.tsx';
import type { IconValue } from '../Icon/Icon.tsx';
import type { FieldWidth } from '../Input/Input.tsx';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { useTruncated } from '../../utils/overflow.ts';
import SelectChevronIcon from 'plenix-platform/icons/plenix/select-chevron';
import CloseIcon from 'plenix-platform/icons/plenix/close';


export type ComboValue = string | number;
export type ComboOption = { value: ComboValue; label: string; description?: string; group?: string; icon?: IconValue; [field: string]: unknown };
// the one action offered when nothing matches ("Add a person..."): an item of the list, so the keys reach it
export type ComboEmptyAction = { label: React.ReactNode; icon?: IconValue; onSelect?: (typed: string) => void };
// a row of the open list: an option, the create row, or the empty action
type ComboItem = { kind: 'option'; o: ComboOption } | { kind: 'create'; o?: undefined } | { kind: 'action'; o?: undefined };
type ComboWords = { emptyText: string; results?: string | ((count: number) => string); removeItem: string; clear: string; loading: string; error: string };
export type ComboboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size' | 'width'> & {
  options?: ComboOption[];
  /** the chosen value (single); '' or null: none */
  value?: ComboValue | null;
  /** the chosen values (multiple) */
  values?: ComboValue[];
  /** single: the value ('' when cleared); multiple: the values */
  onChange: (value: ComboValue | ComboValue[]) => void;
  multiple?: boolean;
  creatable?: boolean;
  onCreate?: (text: string) => void;
  width?: FieldWidth;
  /** the accessible name */
  label?: string;
  invalid?: boolean;
  warning?: boolean;
  emptyText?: React.ReactNode;
  emptyAction?: ComboEmptyAction;
  clearable?: boolean;
  /** async options: what the typed text finds */
  loadOptions?: (query: string) => ComboOption[] | Promise<ComboOption[]>;
  loadDelay?: number;
  minChars?: number;
  loading?: boolean;
  /** a check or radio mark in each row */
  marks?: boolean | 'checkbox' | 'radio';
  strings?: Catalog | null;
  size?: 'sm' | 'md' | number;
  /** true forces the data font, false keeps the interface font; unset, it follows the shown value */
  data?: boolean;
};
export const Combobox = React.forwardRef(function Combobox({ options = [], value, values, onChange, multiple = false, creatable = false, onCreate, width,
  placeholder, label, invalid, warning, disabled, readOnly: readOnlyOwn, emptyText, emptyAction, clearable = false, loadOptions, loadDelay = 300, minChars = 0, loading = false, marks, strings,
  className, id, size, data, ...rest }: ComboboxProps, ref: React.ForwardedRef<HTMLInputElement>) {
  const locked = useReadOnly(readOnlyOwn);   // its own readOnly, else the nearest ReadOnly region's: the value shows; the list does not open, nothing is chosen, created or removed
  const t = useStrings('combobox', strings) as ComboWords, words = t;
  const loc = useLocale();
  if (emptyText === undefined) emptyText = t.emptyText;
  const auto = 'plx-cb' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const listId = auto + '-list';
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const [active, setActive] = React.useState(0);
  const wrap = React.useRef<HTMLDivElement>(null), input = React.useRef<HTMLInputElement>(null), list = React.useRef<HTMLUListElement>(null);
  // the list opens in the top layer, placed against the field by the floating layer (flips up near an edge, follows scroll and resize): no dialog, drawer or scroll area clips it
  useFloating(wrap, list, { open, placement: 'bottom-start', matchWidth: true });
  React.useLayoutEffect(() => { const el = list.current; if (open && TOP_LAYER && el && el.showPopover && !el.matches(':popover-open')) el.showPopover(); }, [open]);
  React.useImperativeHandle(ref, () => input.current as HTMLInputElement);
  // async select: the options of the last load, the loads in flight (only the newest is shown) and every option seen
  const [loaded, setLoaded] = React.useState<ComboOption[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const loader = React.useRef(loadOptions), request = React.useRef(0), seen = React.useRef(new Map<ComboValue, ComboOption>());
  loader.current = loadOptions;
  const async = !!loadOptions;
  React.useEffect(() => {
    if (!async || !open) return undefined;
    const query = text.trim();
    if (query.length < minChars) { request.current++; setLoaded([]); setBusy(false); setFailed(false); return undefined; }
    const n = ++request.current;
    setBusy(true); setFailed(false);
    const timer = setTimeout(() => {
      Promise.resolve().then(() => loader.current!(query)).then((list) => {
        if (n !== request.current) return;
        const got = Array.isArray(list) ? list : [];
        got.forEach((o) => seen.current.set(o.value, o));
        setLoaded(got); setBusy(false); announce(typeof t.results === 'function' ? t.results(got.length) : loc.t('combobox.results', { count: got.length, n: formatNumber(got.length) }));
      }, () => { if (n !== request.current) return; setLoaded([]); setBusy(false); setFailed(true); });
    }, query ? loadDelay : 0);
    return () => clearTimeout(timer);
  }, [async, open, text, minChars, loadDelay]);
  const isLoading = !!loading || (async && busy);
  const optionOf = (v: ComboValue): ComboOption | undefined => options.find((x) => x.value === v) || (async ? loaded.find((x) => x.value === v) || seen.current.get(v) : undefined);
  const chosen: ComboValue[] = multiple ? (values || []) : (value !== undefined && value !== null && value !== '' ? [value] : []);
  const current = !multiple && chosen.length ? optionOf(chosen[0]) || null : null;
  // the data font: forced by data (true or false); otherwise when the chosen label is wholly a number, a date or another technical value
  // what the input shows decides: the typed text while there is some (open or not), else the chosen label
  const asData = data === undefined ? isDataValue(text.trim() ? text : (current ? String(current.label) : '')) : !!data;
  const q = text.trim().toLowerCase();
  // a tag picker (multiple without marks) offers only the values not chosen yet: a chosen tag leaves only by its remove
  // button, so Enter on a suggestion always adds (P-57: Enter on a chosen suggestion removed the tag)
  const tags = multiple && !marks;
  const offered = (async ? loaded : options).filter((o) => !tags || chosen.indexOf(o.value) < 0);
  const matching = isLoading || failed ? [] : async ? offered : offered.filter((o) => !q || matchesText(o.label, text) || (o.description && matchesText(o.description, text)));
  // grouped options stay together under their group's heading (groups in the order they first appear)
  const groupOrder: Array<string | undefined> = []; matching.forEach((o) => { if (groupOrder.indexOf(o.group) < 0) groupOrder.push(o.group); });
  const filtered = groupOrder.reduce((all: ComboOption[], g) => all.concat(matching.filter((o) => o.group === g)), []);
  const canCreate = creatable && q && !isLoading && !(async ? loaded : options).some((o) => String(o.label).toLowerCase() === q);
  // nothing matches: the empty text, and under it the one action the caller offers (it is an item, so the keys reach it)
  const noMatch = !isLoading && !failed && !filtered.length && !canCreate, showAction = noMatch && !!emptyAction;
  const items: ComboItem[] = filtered.map((o): ComboItem => ({ kind: 'option', o })).concat(canCreate ? [{ kind: 'create' }] : []).concat(showAction ? [{ kind: 'action' }] : []);
  // the empty text sits in a presentation row, so it is announced when the action row appears (a screen reader would hear only the action)
  const shownAction = open && showAction;
  React.useEffect(() => { if (shownAction && emptyText) announce(String(emptyText)); }, [shownAction]);
  React.useEffect(() => {
    if (!open) return undefined;
    const off = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', off);
    return () => document.removeEventListener('mousedown', off);
  }, [open]);
  const startAtLast = React.useRef(false);   // Arrow Up opened the list: its last option is the active one (issue 706)
  React.useEffect(() => { setActive(startAtLast.current ? Math.max(0, items.length - 1) : 0); startAtLast.current = false; }, [q, open]);
  const choose = (item: ComboItem | undefined) => {
    if (!item || locked) return;
    if (item.kind === 'create') { if (onCreate) onCreate(text.trim()); setText(''); return; }
    if (item.kind === 'action') { const typed = text.trim(); setText(''); setOpen(false); if (emptyAction!.onSelect) emptyAction!.onSelect(typed); return; }
    const v = item.o.value;
    if (tags) { if (chosen.indexOf(v) < 0) onChange(chosen.concat([v])); setText(''); }
    else if (multiple) { onChange(chosen.indexOf(v) >= 0 ? chosen.filter((x) => x !== v) : chosen.concat([v])); setText(''); }
    else { onChange(v); setText(''); setOpen(false); }
  };
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (locked) { if (!/^(Tab|Escape|Shift|Control|Alt|Meta)$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) e.preventDefault(); return; }   // read-only: no key opens, chooses, creates or removes
    // closed: Arrow Down (and Alt+Arrow Down) open on the first option, Arrow Up on the last; open: Alt+Arrow Down moves nothing
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); else if (!e.altKey) setActive((a) => Math.min(items.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (!open) { startAtLast.current = true; setOpen(true); } else setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { if (open && items[active]) { e.preventDefault(); choose(items[active]); } }
    else if (e.key === 'Escape') { if (open) { e.preventDefault(); setOpen(false); } }
    else if (e.key === 'Backspace' && multiple && !text && chosen.length) { onChange(chosen.slice(0, -1)); }
  };
  const clear = () => { if (locked || disabled) return; setText(''); onChange(multiple ? [] : ''); if (input.current) input.current.focus(); };
  const canClear = clearable && !locked && !disabled && (chosen.length > 0 || !!text);
  const optId = (i: number) => auto + '-o' + i;
  // a single choice whose label is cut (the box is narrower than it, issue 558): its full text goes in a Tooltip on hover and focus. While the list is
  // open the field shows the typed text, so the cut measured while it was closed stays; the Tooltip then sits above the field, clear of the list
  const label1 = !multiple && current ? String(current.label) : '';
  const cutNow = useTruncated(input, open ? 'open' : label1, !multiple), cutShut = React.useRef(false);
  if (!open) cutShut.current = cutNow;
  const cut = !!label1 && (open ? cutShut.current : cutNow) && !text.trim();
  const field = (
    <input ref={input} id={id} size={size === 'sm' || size === 'md' ? undefined : size as number | undefined} className="plx-combobox__input" role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list"
      aria-activedescendant={open && items[active] ? optId(active) : undefined} aria-label={label} disabled={disabled} readOnly={locked || undefined} aria-readonly={locked || undefined} autoComplete="off"
      value={open || multiple ? text : (current ? current.label : '')} placeholder={multiple && chosen.length ? '' : (current && !open ? current.label : placeholder)}
      onChange={(e) => { if (locked) return; setText(e.target.value); setOpen(true); }} onFocus={() => { if (!locked) setOpen(true); }} onKeyDown={onKey} {...rest} />
  );
  return (
    <div ref={wrap} className={cx('plx-combobox', size === 'sm' && 'plx-combobox--size-sm', width && 'plx-combobox--width-' + width, multiple && 'plx-combobox--multiple', marks && 'plx-combobox--marks', open && 'is-open', disabled && 'is-disabled', className)}>
      <div className={cx('plx-combobox__field', 'plx-input', asData && 'plx-input--data', disabled && 'is-disabled')} aria-invalid={invalid || undefined} data-plx-warning={warning || undefined} onClick={() => { if (!disabled && input.current) input.current.focus(); }}>
        {multiple ? chosen.map((v) => { const o = optionOf(v); const t = o ? o.label : v;
          return <Tag key={v} onRemove={locked ? undefined : () => onChange(chosen.filter((x) => x !== v))} removeLabel={words.removeItem.replace('{label}', t as string)}>{t}</Tag>; }) : null}
        {multiple ? field : <Tooltip content={label1} disabled={!cut} describe={false} placement={open ? 'top' : 'bottom'} className="plx-combobox__tip">{field}</Tooltip>}
        {canClear ? <Button variant="ghost" size="xs" iconOnly icon={CloseIcon} label={t.clear} className="plx-combobox__clear" onMouseDown={(e) => e.preventDefault()} onClick={clear} /> : null}
        <span className="plx-combobox__chevron" aria-hidden="true"><Icon icon={SelectChevronIcon} filled={false} /></span>
      </div>
      {open ? (
        <ul ref={list} className="plx-combobox__list" id={listId} role="listbox" popover={TOP_LAYER ? 'manual' : undefined} onMouseDown={(e) => e.preventDefault()} aria-multiselectable={multiple || undefined} aria-busy={isLoading || undefined}>
          {items.length ? ([showAction ? <li key="empty" className="plx-combobox__empty" role="presentation">{emptyText}</li> : null] as React.ReactNode[]).concat(items.map((it, i) => it.kind === 'action'
            ? <li key="action" id={optId(i)} role="option" aria-selected={false} className={cx('plx-combobox__option', 'plx-combobox__action', i === active && 'is-active')}
                onMouseDown={(e) => e.preventDefault()} onClick={() => choose(it)} onMouseEnter={() => setActive(i)}>
                {emptyAction!.icon ? <span className="plx-combobox__option-icon" aria-hidden="true"><Icon name={emptyAction!.icon} /></span> : null}{emptyAction!.label}</li>
            : it.kind === 'create'
            ? <li key="create" id={optId(i)} role="option" aria-selected={false} className={cx('plx-combobox__option', 'plx-combobox__create', i === active && 'is-active')}
                onMouseDown={(e) => e.preventDefault()} onClick={() => choose(it)} onMouseEnter={() => setActive(i)}>Create “{text.trim()}”</li>
            : [it.o.group && (i === 0 || !items[i - 1].o || items[i - 1].o!.group !== it.o.group) ? <li key={'g-' + it.o.group} className="plx-combobox__group" role="presentation">{it.o.group}</li> : null,
              <li key={it.o.value} id={optId(i)} role="option" aria-selected={chosen.indexOf(it.o.value) >= 0}
                className={cx('plx-combobox__option', i === active && 'is-active', chosen.indexOf(it.o.value) >= 0 && 'is-selected')}
                onMouseDown={(e) => e.preventDefault()} onClick={() => choose(it)} onMouseEnter={() => setActive(i)}>
                {marks ? <input type={marks === 'radio' ? 'radio' : 'checkbox'} className="plx-check__input plx-combobox__mark" tabIndex={-1} aria-hidden="true"
                  checked={chosen.indexOf(it.o.value) >= 0} readOnly /> : null}
                {it.o.icon ? <span className="plx-combobox__option-icon" aria-hidden="true"><Icon name={it.o.icon} /></span> : null}
                {it.o.description ? <span className="plx-combobox__option-text"><span className="plx-combobox__option-label">{highlightMatch(it.o.label, text)}</span><span className="plx-combobox__option-description">{highlightMatch(it.o.description, text)}</span></span>
                  : <span className="plx-combobox__option-label">{highlightMatch(it.o.label, text)}</span>}</li>]))
            : isLoading ? <li className="plx-combobox__loading" role="presentation"><Spinner size="sm" label={t.loading} /><span aria-hidden="true">{t.loading}</span></li>
            : failed ? <li className="plx-combobox__empty plx-combobox__error" role="presentation">{t.error}</li>
            : <li className="plx-combobox__empty" role="presentation">{emptyText}</li>}
        </ul>
      ) : null}
    </div>
  );
});
