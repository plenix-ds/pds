/* Plenix · TransferList
   Summary: Two lists side by side for choosing a subset of many items (10 Patterns › Selection and organization ›
     Transfer list; also Dual listbox): the items not chosen on one side, the chosen ones on the other, and buttons
     between them that move the checked items across. The chosen list can keep an order of its own.
   Usage:
     <TransferList label="Columns" options={columns} value={shown} onChange={setShown} />
     <TransferList label="Columns" options={columns} value={shown} onChange={setShown} search ordered
       titles={{ source: 'Hidden columns', target: 'Shown columns' }} />
     <TransferList label="People" options={people} value={team} onChange={setTeam} search virtualized />   // thousands of items
   Props:
     label: names the whole control (a group) and the move buttons' group (required)
     options: every item: [{ value, label, meta, disabled }]; meta is a short technical value after the label (an id, a
       count), in the data font
     value: the chosen values; with ordered, in their order
     onChange(values): runs with the new chosen values (the moved ones added at the end of the chosen list)
     titles: the two lists' titles: { source: "Available", target: "Chosen" }
     search: a search field over each list (default false); it filters what the list shows and what its checkbox checks
     ordered: the chosen list keeps its order and has Move up and Move down for its checked items (default false)
     virtualized: only the items in view are drawn (useVirtualizer), for lists of thousands (default false; on by
       itself over 500 items)
     size: the lists' height: "sm" | "md" (default) | "lg"
     disabled: nothing can be checked or moved
     readOnly: the lists show what is chosen and nothing moves or is reordered (the move buttons are off; items can still be checked to read them);
       default the nearest ReadOnly region's (useReadOnly)
     strings: the words it shows and announces, for other languages: { source, target, add: "Add", addAll: "Add all",
       remove: "Remove", removeAll: "Remove all", up: "Move up", down: "Move down", search: "Search {title}", selectAll:
       "Check every item in {title}", count: "{checked} of {total} checked", moved: "{n} moved to {title}", empty:
       "No items", noMatch: "No matches", moves: "Move items" }
     className: more classes on the control
   Behavior:
     Each list is a listbox with several choices and one Tab stop: ↑ ↓ move, Home and End, Space checks or clears the
       active item, Ctrl+A (Command+A) checks all or clears them, Enter moves the checked items to the other list. A click
       checks or clears an item; a double click moves it at once.
     The header's checkbox checks every item the list shows (mixed when some are); the count beside it says how many are
       checked of how many shown.
     Add and Remove move the checked items; Add all and Remove all move every item of the list. A move is announced
       ("3 moved to Chosen"), and the moved items stay checked in their new list, so a wrong move is one click back.
     Ordered: Move up and Move down move the checked chosen items one place; the order is the value's order.
     At narrow widths the lists stack, with the move buttons in a row between them (a container query).
   Notes:
     Use it when people choose a subset from more items than fit a checkbox group (about fifteen or more) and should see
       both what is chosen and what is not. Fewer items: a checkbox group; one value: a select or Combobox.
     The checkboxes are the Checkbox control drawn in the row, not focusable and hidden from assistive technology: each
       option's aria-selected says it is checked.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { announce } from '../../utils/announce.tsx';
import { Button } from '../Button/Button.tsx';
import { SearchField } from '../SearchField/SearchField.tsx';
import { useVirtualizer, VirtualGap, VirtualProbe } from '../../hooks/useVirtualizer.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { useReadOnly } from '../../providers/ReadOnly.tsx';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';
import ChevronLeftIcon from 'plenix-platform/icons/plenix/chevron-left';
import ChevronRightIcon from 'plenix-platform/icons/plenix/chevron-right';
import ChevronUpIcon from 'plenix-platform/icons/plenix/chevron-up';
import { fill } from '../../utils/fill.ts';

const AUTO_VIRTUAL = 500;

// one list: header (check all, title, count, the order buttons), search field, the listbox
function Side({ id, title, items, checked, setChecked, onMove, search, virtual, disabled, t, tools, emptyText }) {
  const [text, setText] = React.useState('');
  const [active, setActive] = React.useState(0);
  const q = text.trim().toLowerCase();
  const shown = q ? items.filter((o) => String(o.label).toLowerCase().indexOf(q) >= 0 || String(o.meta || '').toLowerCase().indexOf(q) >= 0) : items;
  const usable = shown.filter((o) => !o.disabled);
  const nChecked = shown.filter((o) => checked.has(o.value)).length;
  const all = usable.length > 0 && usable.every((o) => checked.has(o.value));
  const some = nChecked > 0 && !all;
  const v = useVirtualizer({ count: virtual ? shown.length : 0 });
  const listRef = React.useRef(null);
  const at = Math.min(active, Math.max(0, shown.length - 1));
  React.useEffect(() => { setActive(0); }, [q]);
  const toggle = (o) => { if (!o || o.disabled || disabled) return; const next = new Set(checked); if (next.has(o.value)) next.delete(o.value); else next.add(o.value); setChecked(next); };
  const toggleAll = () => { const next = new Set(checked); usable.forEach((o) => { if (all) next.delete(o.value); else next.add(o.value); }); setChecked(next); };
  const go = (i) => {
    const n = Math.max(0, Math.min(shown.length - 1, i));
    setActive(n);
    if (virtual) v.scrollToIndex(n);
    else { const el = listRef.current && listRef.current.querySelector('[data-plx-index="' + n + '"]'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' }); }
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') go(at + 1);
    else if (e.key === 'ArrowUp') go(at - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(shown.length - 1);
    else if (e.key === ' ') toggle(shown[at]);
    else if (e.key === 'Enter') onMove(shown);
    else if ((e.key === 'a' || e.key === 'A') && (e.ctrlKey || e.metaKey)) toggleAll();
    else return;
    e.preventDefault();
  };
  const optId = (i) => id + '-o' + i;
  const option = (o, i, extra) => (
    <div key={o.value} id={optId(i)} role="option" aria-selected={checked.has(o.value)} aria-disabled={o.disabled || disabled || undefined} data-plx-index={i}
      className={cx('plx-transfer-list__option', i === at && 'is-active', checked.has(o.value) && 'is-selected', o.disabled && 'is-disabled')}
      onMouseDown={(e) => e.preventDefault()} onClick={() => { setActive(i); toggle(o); if (listRef.current) listRef.current.focus(); }}
      onDoubleClick={() => { if (!o.disabled && !disabled) onMove([o], true); }} {...extra}>
      <input type="checkbox" className="plx-check__input plx-transfer-list__mark" tabIndex={-1} aria-hidden="true" inert="" readOnly checked={checked.has(o.value)} disabled={o.disabled || disabled} />
      <span className="plx-transfer-list__label">{o.label}</span>
      {o.meta !== undefined && o.meta !== null ? <span className="plx-transfer-list__meta">{o.meta}</span> : null}
    </div>
  );
  const setRefs = (el) => { listRef.current = el; if (virtual) v.viewportRef.current = el; };
  return (
    <section className="plx-transfer-list__panel" aria-labelledby={id + '-title'}>
      <div className="plx-transfer-list__header">
        <input type="checkbox" className="plx-check__input plx-transfer-list__all" checked={all} disabled={disabled || !usable.length}
          ref={(el) => { if (el) el.indeterminate = some; }} onChange={toggleAll} aria-label={fill(t.selectAll, { title })} />
        <span id={id + '-title'} className="plx-transfer-list__title">{title}</span>
        <span className="plx-transfer-list__count" aria-label={fill(t.count, { checked: nChecked, total: shown.length })}>{nChecked + '/' + shown.length}</span>
        {tools ? <span className="plx-transfer-list__tools">{tools}</span> : null}
      </div>
      {search ? <div className="plx-transfer-list__search"><SearchField value={text} label={fill(t.search, { title })} placeholder={fill(t.search, { title })} width="fill"
        onChange={(e) => setText(e.target.value)} onClear={() => setText('')} /></div> : null}
      <div ref={setRefs} role="listbox" aria-multiselectable="true" aria-labelledby={id + '-title'} tabIndex={0} aria-disabled={disabled || undefined}
        aria-activedescendant={shown.length ? optId(at) : undefined} onKeyDown={onKeyDown}
        className={cx('plx-transfer-list__list', virtual && 'plx-transfer-list__list--virtual')}>
        {virtual && shown.length ? <VirtualProbe /> : null}
        {!shown.length ? <div className="plx-transfer-list__empty" role="presentation">{q ? t.noMatch : emptyText}</div>
          : virtual ? v.segments.map((s) => (s.gap ? <VirtualGap key={s.key} count={s.count} /> : option(shown[s.index], s.index, v.itemProps(s.index))))
            : shown.map((o, i) => option(o, i))}
      </div>
    </section>
  );
}

export function TransferList({ label, options = [], value = [], onChange, titles, search = false, ordered = false, virtualized, size = 'md', disabled = false, readOnly: readOnlyOwn,
  strings, className }) {
  devWarn('TransferList', { size }, { size: ['sm','md','lg'] });
  // read-only (its own readOnly, else the nearest ReadOnly region's): the lists show what is chosen and nothing moves or is reordered; checking items to read them still works
  const locked = useReadOnly(readOnlyOwn), frozen = disabled || locked;
  const t = useStrings('transferList', strings);
  const id = 'plx-tl' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const title = Object.assign({ source: t.source, target: t.target }, titles);
  const byValue = React.useMemo(() => new Map(options.map((o) => [o.value, o])), [options]);
  const chosenSet = new Set(value);
  const source = options.filter((o) => !chosenSet.has(o.value));
  const target = ordered ? value.map((v) => byValue.get(v)).filter(Boolean) : options.filter((o) => chosenSet.has(o.value));
  const [left, setLeft] = React.useState(() => new Set());
  const [right, setRight] = React.useState(() => new Set());
  const virtual = virtualized !== undefined ? virtualized : options.length > AUTO_VIRTUAL;
  const emit = (next) => { if (onChange) onChange(next); };
  // moving keeps the moved items checked in their new list
  const add = (list, title2) => {
    const moving = list.filter((o) => !o.disabled && !chosenSet.has(o.value)).map((o) => o.value);
    if (!moving.length || frozen) return;
    emit(value.concat(moving));
    setLeft((s) => { const n = new Set(s); moving.forEach((m) => n.delete(m)); return n; });
    setRight((s) => new Set(Array.from(s).concat(moving)));
    announce(fill(t.moved, { n: moving.length, title: title2 }));
  };
  const remove = (list, title2) => {
    const moving = list.filter((o) => !o.disabled && chosenSet.has(o.value)).map((o) => o.value);
    if (!moving.length || frozen) return;
    emit(value.filter((v) => moving.indexOf(v) < 0));
    setRight((s) => { const n = new Set(s); moving.forEach((m) => n.delete(m)); return n; });
    setLeft((s) => new Set(Array.from(s).concat(moving)));
    announce(fill(t.moved, { n: moving.length, title: title2 }));
  };
  const leftChecked = source.filter((o) => left.has(o.value)), rightChecked = target.filter((o) => right.has(o.value));
  // ordered: the checked chosen items one place up or down, keeping their order among themselves
  const shift = (dir) => {
    const list = value.slice();
    const idx = list.map((v, i) => (right.has(v) ? i : -1)).filter((i) => i >= 0);
    if (!idx.length) return;
    (dir < 0 ? idx : idx.slice().reverse()).forEach((i) => {
      const j = i + dir;
      if (j < 0 || j >= list.length || right.has(list[j])) return;
      const tmp = list[j]; list[j] = list[i]; list[i] = tmp;
    });
    emit(list);
  };
  const firstChecked = value.findIndex((v) => right.has(v)), lastChecked = value.length - 1 - value.slice().reverse().findIndex((v) => right.has(v));
  const orderTools = ordered ? (
    <>
      <Button size="xs" variant="ghost" iconOnly icon={ChevronUpIcon} label={t.up} disabled={frozen || firstChecked <= 0} onClick={() => shift(-1)} />
      <Button size="xs" variant="ghost" iconOnly icon={ChevronDownIcon} label={t.down} disabled={frozen || firstChecked < 0 || lastChecked >= value.length - 1} onClick={() => shift(1)} />
    </>
  ) : null;
  return (
    <div role="group" aria-label={label} className={cx('plx-transfer-list', 'plx-transfer-list--' + size, disabled && 'is-disabled', className)}>
      <div className="plx-transfer-list__body">
        <Side id={id + '-s'} title={title.source} items={source} checked={left} setChecked={setLeft} search={search} virtual={virtual} disabled={disabled} t={t}
          emptyText={t.empty} onMove={(list, all) => add(all ? list : list.filter((o) => left.has(o.value)), title.target)} />
        <div className="plx-transfer-list__moves" role="group" aria-label={t.moves}>
          <Button size="sm" iconEnd={ChevronRightIcon} disabled={frozen || !leftChecked.length} onClick={() => add(leftChecked, title.target)}>{t.add}</Button>
          <Button size="sm" disabled={frozen || !source.some((o) => !o.disabled)} onClick={() => add(source, title.target)}>{t.addAll}</Button>
          <Button size="sm" icon={ChevronLeftIcon} disabled={frozen || !rightChecked.length} onClick={() => remove(rightChecked, title.source)}>{t.remove}</Button>
          <Button size="sm" disabled={frozen || !target.some((o) => !o.disabled)} onClick={() => remove(target, title.source)}>{t.removeAll}</Button>
        </div>
        <Side id={id + '-t'} title={title.target} items={target} checked={right} setChecked={setRight} search={search} virtual={virtual} disabled={disabled} t={t}
          tools={orderTools} emptyText={t.empty} onMove={(list, all) => remove(all ? list : list.filter((o) => right.has(o.value)), title.source)} />
      </div>
    </div>
  );
}
