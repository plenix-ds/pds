/* Plenix · Cascader
   Summary: A form field whose value is a leaf of a hierarchy, chosen level by level in columns that open under the field
     (region, then country, then city); the field shows the whole path ("Europe / France / Paris").
   Usage:
     <Field label="Office"><Cascader options={regions} value={office} onChange={setOffice} /></Field>
     <Cascader options={categories} expandTrigger="hover" value={v} onChange={setV} label="Category" />
     <Cascader options={regions} searchable value={v} onChange={setV} label="Office" />
     <Cascader options={regions} multiple values={offices} onChange={setOffices} label="Offices" />
   Props:
     options: the hierarchy: [{ id, label, children, disabled, choosable }] (MillerColumns' items); only leaves can be chosen, unless a parent is choosable
     choosableParents: every parent can be the answer too ("Europe", not only "Paris"), default false; options[].choosable true or false decides one parent. A
       choosable parent lists "All of Europe" first in its column (an ordinary row: click, Enter, a checkbox with multiple), and a search lists the parent too
     options[].hasChildren: true marks a parent whose children load when it is first opened (with loadChildren)
     loadChildren(option): returns the parent's children (an array or a promise of one) the first time it opens (issue 814,
       useBranchLoader, shared with its columns): its column shows a spinner and "Loading…", a failure Try again
     value: the chosen leaf's id, for a single choice; onChange(id, path) runs with it and its path of ids
     values: the chosen leaves' ids, with multiple; onChange(ids) runs with the new array
     multiple: several leaves, each a checkbox in the columns; the field shows them as tags (default false)
     maxTags: with multiple, how many tags the field shows; the others are one "+N" tag (a Tag you can Tab to and press: it opens the list) whose
       tooltip lists their names on hover and focus, as TreeSelect's "… and N more" does; default 0: every tag shows (the field as it was), so "+N" is opt-in
     maxChoices: a number: with multiple, the most that can be chosen; past it a click or Enter chooses nothing and says so (strings.limit), shown in the list and announced politely
     expandTrigger: "click" (default: a parent opens when chosen) | "hover" (pointing at a parent opens it)
     searchable: a search field at the top of the list finds leaves at every level by name and lists their paths
       (default false)
     loadOptions(text): with searchable, the search asks the server: it returns (or returns a Promise of) the matches: [{ id, label, path, disabled }], path being the
       labels of the parents, from the top (or [{ id, label }], so onChange's path has their ids); the results are shown as they are (the loader filters)
     loadDelay: the pause after typing before loadOptions runs, in milliseconds (default 300; 0 when the field is empty)
     minChars: the characters needed before the search runs (default 0); fewer shows the columns
     placeholder: the hint in the empty field (default strings.placeholder)
     label: the accessible name when there is no Field
     invalid: the invalid state (the field's border in the danger color); a Field with an error sets it
     warning: true shows a warning state beside invalid (a Field with a warning sets it): a warning border and fill; the Field draws its icon and message
     disabled: the field cannot be used
     readOnly: shows the choice and does not change it: the list does not open and the tags cannot be removed; default the nearest ReadOnly region's (useReadOnly)
     id: the id of the field's button (a Field sets it, so its label names it)
     strings: the words it shows and announces, for other languages: { placeholder: "Choose", separator: " / ",
       search: "Search", noMatches: "No matches", empty: "No items", remove: "Remove {label}", results: (n) => …,
       columns: "Options", allOf: "All of {label}", more: "+{n}", moreLabel: "{n} more", limit: "You can choose up to {n}.",
       loading: "Loading…", error: "The matches could not be loaded" }
     className: more classes on the cascader
   Behavior:
     The typed text is marked in each result it matches, every occurrence, in either case, by the shared helper (utils/highlight.tsx:
       highlightMatch; matchesText decides what is listed). Arabic matches without its vowel marks, and a match of Arabic letters is
       underlined instead of set heavier, so the joined letters stay whole. The list is read as plain text.
     The popup opens in the browser's top layer, below the field or above it near an edge: no dialog, drawer or scroll area clips it.
     The field is a button (aria-haspopup="dialog", aria-expanded) that opens the columns under it; focus moves into the
       first column, on the chosen path. The columns are MillerColumns: Arrow Up and Down in a column, Right into the
       children, Left back, Enter on a leaf chooses it (a click too). A single choice closes the list and returns focus to
       the field; with multiple, Enter or a click checks or unchecks the leaf and the list stays open.
     Escape, or a click outside, closes the list and returns focus to the field.
     With searchable the search field is first in the list: typing lists every leaf whose name matches, with its path,
       as one listbox (Arrow Down and Up move, Enter chooses); the number of matches is announced; clearing it brings the
       columns back.
     With loadOptions each pause in typing asks once; an answer that arrives after a newer request is dropped; the list is busy while it loads (a spinner and "Loading…"),
       the number of matches is announced politely, and a failed load says so in the list and is announced.
     The path in the field and in each match uses strings.separator; a path too long for the field ends in an ellipsis; the
       whole path is read as the field’s description.
     A parent to load (hasChildren) is opened like any other (click, hover, Arrow Right); search lists the leaves loaded so far and
       never loads a parent by itself; the field shows a chosen leaf's path once its parents are loaded (pass the chosen path's
       options loaded).
   Notes:
     For a hierarchy people should see whole, use a tree select; for two or three short levels, consider plain Selects.
     The list is a menu surface (the menu's corner, --plx-comp-cascader-popup-radius, and the menu elevation); its columns take the narrowest width step (160px).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { highlightMatch, matchesText } from '../../utils/highlight.tsx';
import { useDescribedBy } from '../../utils/describedBy.ts';
import { useReadOnly } from '../../providers/ReadOnly.tsx';
import { Tag } from '../Tag/Tag.tsx';
import { MillerColumns } from '../MillerColumns/MillerColumns.jsx';
import { useBranchLoader } from '../../hooks/useBranchLoader.ts';
import { announce } from '../../utils/announce.tsx';
import { useFloating, TOP_LAYER } from '../../utils/floating.ts';

import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { Spinner } from '../Loading/Loading.tsx';
import { fill } from '../../utils/fill.ts';
import { dataPhrase } from '../../utils/dataText.tsx';
import { useStrings, useLocale } from '../../providers/LocaleProvider.tsx';
import { formatNumber } from '../../utils/format.ts';
import { Icon } from '../Icon/Icon.tsx';
import SelectChevronIcon from 'plenix-platform/icons/plenix/select-chevron';


// every leaf of the hierarchy with its path of items
// the columns of the list take the narrowest width step (160px), so three levels fit under a form field
const NARROW = [1, 1, 1, 1, 1, 1];
// every choosable item of the hierarchy with its path of items: the leaves, and the parents that are choosable (a parent is listed before its children)
// (a parent still to load, pending: issue 814, is neither: it has no leaves yet and is never chosen itself until it loads)
const leavesOf = (items, trail = [], choosable = () => false, pending = () => false) => items.reduce((all, it) => {
  const here = trail.concat([it]);
  if (!Array.isArray(it.children)) return pending(it) ? all : all.concat([{ item: it, trail: here }]);
  return all.concat(choosable(it) ? [{ item: it, trail: here }] : [], leavesOf(it.children, here, choosable, pending));
}, []);
// a choosable parent lists "All of …" first among its children: an ordinary row for the columns (its id is the parent's, marked)
const SELF = '__plx-self:';
const withSelf = (items, choosable, label) => items.map((it) => (Array.isArray(it.children)
  ? Object.assign({}, it, { children: (choosable(it) ? [{ id: SELF + it.id, self: it.id, label: label(it), disabled: it.disabled }] : []).concat(withSelf(it.children, choosable, label)) }) : it));

const EMPTY = [];

export const Cascader = React.forwardRef(function Cascader({ options: given = EMPTY, loadChildren, value, values, onChange, multiple = false, expandTrigger = 'click', searchable = false,
  choosableParents = false, maxTags = 0, maxChoices, loadOptions, loadDelay = 300, minChars = 0, placeholder, label, invalid, warning, disabled, readOnly: readOnlyOwn, id, strings, className, 'aria-describedby': describedBy, ...rest }, ref) {
  const t = useStrings('cascader', strings);
  const branches = useBranchLoader(loadChildren);   // a parent with hasChildren loads its children when first opened (issue 814), shared with the columns
  const options = branches.merge(given);
  const loc = useLocale();
  const auto = 'plx-cs' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const describedAt = useDescribedBy(auto + '-value', describedBy);   // the chosen value first, then what its owner (a Field) described
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const [active, setActive] = React.useState(0);
  const [browse, setBrowse] = React.useState([]);
  const [limitShown, setLimitShown] = React.useState(false);
  // server search: the matches of the last load, the loads in flight (only the newest counts) and every match seen (they name a chosen value later)
  const [loaded, setLoaded] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const loader = React.useRef(loadOptions), request = React.useRef(0), seen = React.useRef(new Map());
  loader.current = loadOptions;
  const remote = !!loadOptions && searchable;
  const wrap = React.useRef(null), button = React.useRef(null), search = React.useRef(null), cols = React.useRef(null), popup = React.useRef(null);
  // the popup opens in the top layer, placed against the field by the floating layer (flips up near an edge, follows scroll and resize): no dialog, drawer or scroll area clips it
  useFloating(wrap, popup, { open, placement: 'bottom-start' });
  React.useLayoutEffect(() => { const el = popup.current; if (open && TOP_LAYER && el && el.showPopover && !el.matches(':popover-open')) el.showPopover(); }, [open]);
  React.useImperativeHandle(ref, () => button.current);
  const chosen = multiple ? (values || []) : (value !== undefined && value !== null && value !== '' ? [value] : []);
  const pathLabel = (trail) => trail.map((x) => x.label).join(t.separator);
  // which parents can be the answer, the choosable items and the columns' items ("All of …" first in a choosable parent)
  const choosable = (it) => Array.isArray(it.children) && (it.choosable !== undefined ? !!it.choosable : choosableParents);
  const leaves = React.useMemo(() => leavesOf(options, [], choosable, branches.needs), [options, choosableParents, !!loadChildren]);   // eslint-disable-line react-hooks/exhaustive-deps
  const columnsItems = React.useMemo(() => withSelf(options, choosable, (it) => fill(t.allOf, { label: it.label })), [options, choosableParents, t.allOf]);   // eslint-disable-line react-hooks/exhaustive-deps
  const pathFor = (v) => { const hit = leaves.find((l) => l.item.id === v) || seen.current.get(v); return hit ? hit.trail : null; };
  const checkedIds = chosen.map((v) => (leaves.some((l) => l.item.id === v && Array.isArray(l.item.children)) ? SELF + v : v));
  const current = !multiple && chosen.length ? pathFor(chosen[0]) : null;

  const locked = useReadOnly(readOnlyOwn);   // its own readOnly, else the nearest ReadOnly region's: the choice shows and nothing changes it (the list does not open)
  const openList = () => {
    if (disabled || locked) return;
    setBrowse(current ? current.map((x) => x.id) : []);
    setText(''); setLimitShown(false); setOpen(true);
  };
  const close = (refocus) => { setOpen(false); setText(''); setLimitShown(false); if (refocus && button.current) button.current.focus(); };
  // focus moves into the list when it opens: the search field, or the first column
  React.useEffect(() => {
    if (!open) return;
    const target = searchable ? search.current : cols.current && cols.current.querySelector('.plx-miller-columns__list');
    if (target) target.focus();
  }, [open]);
  React.useEffect(() => {
    if (!open) return undefined;
    const off = (e) => { if (wrap.current && !wrap.current.contains(e.target)) close(false); };
    document.addEventListener('mousedown', off);
    return () => document.removeEventListener('mousedown', off);
  }, [open]);

  const q = text.trim().toLowerCase();
  const said = (n) => announce(typeof t.results === 'function' ? t.results(n) : loc.t('cascader.results', { count: n, n: formatNumber(n) }));
  // with a server search, fewer letters than minChars show the columns; the matches are the server's (nothing filters them here)
  const searching = !!q && (!remote || q.length >= minChars);
  const matches = !searching ? [] : remote ? loaded : leaves.filter((l) => !l.item.disabled && matchesText(l.item.label, text));
  React.useEffect(() => { setActive(0); if (searching && !remote) said(matches.length); }, [q]);   // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (!remote || !open) return undefined;
    const query = text.trim();
    if (query.length < Math.max(1, minChars)) { request.current++; setLoaded([]); setBusy(false); setFailed(false); return undefined; }
    const n = ++request.current;
    setBusy(true); setFailed(false);
    const timer = setTimeout(() => {
      Promise.resolve().then(() => loader.current(query)).then((list) => {
        if (n !== request.current) return;
        const got = (Array.isArray(list) ? list : []).map((r) => {
          const ups = (r.path || []).map((x) => (typeof x === 'string' ? { label: x } : { id: x.id, label: x.label }));
          return { item: { id: r.id, label: r.label, disabled: r.disabled }, trail: ups.concat([{ id: r.id, label: r.label }]) };
        });
        got.forEach((m) => seen.current.set(m.item.id, m));
        setLoaded(got); setBusy(false); said(got.length);
      }, () => { if (n !== request.current) return; setLoaded([]); setBusy(false); setFailed(true); announce(t.error); });
    }, loadDelay);
    return () => clearTimeout(timer);
  }, [remote, open, text, minChars, loadDelay]);   // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (item, trail) => {
    if (locked) return;
    if (multiple) {
      const on = chosen.indexOf(item.id) >= 0;
      // past the limit nothing is chosen: the list says so, and a screen reader hears it
      if (!on && maxChoices && chosen.length >= maxChoices) { setLimitShown(true); announce(fill(t.limit, { n: formatNumber(maxChoices) })); return; }
      setLimitShown(false);
      onChange(on ? chosen.filter((x) => x !== item.id) : chosen.concat([item.id]));
    } else { onChange(item.id, trail.map((x) => x.id).filter((x) => x !== undefined)); close(true); }
  };
  const onListKey = (e) => { if (open && e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); } };
  const onSearchKey = (e) => {
    if (!searching) {
      if (e.key === 'ArrowDown') { e.preventDefault(); const l = cols.current && cols.current.querySelector('.plx-miller-columns__list'); if (l) l.focus(); }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(matches.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { if (matches[active] && !busy) { e.preventDefault(); pick(matches[active].item, matches[active].trail); } }
  };
  const optId = (i) => auto + '-m' + i;
  const shown = multiple ? null : current ? pathLabel(current) : null;
  // the tags the field draws: the first maxTags (0: every one), then "+N" for the rest
  const nameOf = (v) => { const trail = pathFor(v); return trail ? trail[trail.length - 1].label : String(v); };
  const capped = maxTags > 0 ? maxTags : chosen.length, shownTags = chosen.slice(0, capped), hiddenTags = chosen.slice(capped);

  return (
    <div ref={wrap} className={cx('plx-cascader', multiple && 'plx-cascader--multiple', open && 'is-open', disabled && 'is-disabled', className)} onKeyDown={onListKey}>
      <div className="plx-cascader__field plx-input" aria-invalid={invalid || undefined} data-plx-warning={warning || undefined}>
        {multiple ? shownTags.map((v) => <Tag key={v} onRemove={disabled || locked ? undefined : () => { setLimitShown(false); onChange(chosen.filter((x) => x !== v)); }} removeLabel={t.remove.replace('{label}', nameOf(v))}>{nameOf(v)}</Tag>) : null}
        {multiple && hiddenTags.length ? (
          <Tooltip content={hiddenTags.map(nameOf).join(', ')} placement="bottom" className="plx-cascader__more-tip">
            <Tag className="plx-cascader__more" tabIndex={0} role="button" aria-label={fill(t.moreLabel, { n: formatNumber(hiddenTags.length) })}
              onClick={openList} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); openList(); } }}>{dataPhrase(t.more, { n: hiddenTags.length })}</Tag>
          </Tooltip>
        ) : null}
        <button ref={button} type="button" id={id} className="plx-cascader__trigger" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? auto + '-pop' : undefined}
          aria-label={label || undefined} aria-describedby={describedAt} disabled={disabled}
          onClick={() => (open ? close(false) : openList())}
          onKeyDown={(e) => { if (e.key === 'ArrowDown' && !open) { e.preventDefault(); openList(); } }} {...rest}>
          <span id={auto + '-value'} className={cx('plx-cascader__value', !shown && 'plx-cascader__placeholder')}>{shown || (multiple && chosen.length ? '' : placeholder || t.placeholder)}</span>
          <span className="plx-cascader__chevron" aria-hidden="true"><Icon icon={SelectChevronIcon} filled={false} /></span>
        </button>
      </div>
      {open ? (
        <div ref={popup} className="plx-cascader__popup" id={auto + '-pop'} role="dialog" popover={TOP_LAYER ? 'manual' : undefined} aria-label={label || t.columns}>
          {searchable ? (
            <div className="plx-cascader__search">
              <input ref={search} type="search" className="plx-input plx-cascader__search-input" role="combobox" aria-expanded={searching} aria-controls={auto + '-matches'}
                aria-autocomplete="list" aria-activedescendant={searching && matches[active] ? optId(active) : undefined} aria-label={t.search} placeholder={t.search}
                value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onSearchKey} autoComplete="off" />
            </div>
          ) : null}
          {searching ? (
            <ul className="plx-cascader__matches" id={auto + '-matches'} role="listbox" aria-label={t.search} aria-multiselectable={multiple || undefined}>
              {matches.length ? matches.map((m, i) => (
                <li key={m.item.id} id={optId(i)} role="option" aria-selected={chosen.indexOf(m.item.id) >= 0}
                  className={cx('plx-cascader__match', i === active && 'is-active', chosen.indexOf(m.item.id) >= 0 && 'is-selected')}
                  onMouseDown={(e) => e.preventDefault()} onClick={() => pick(m.item, m.trail)} onMouseEnter={() => setActive(i)}>
                  <span className="plx-cascader__match-label">{highlightMatch(m.item.label, text)}</span>
                  {m.trail.length > 1 ? <span className="plx-cascader__match-path">{pathLabel(m.trail.slice(0, -1))}</span> : null}
                </li>
              )) : remote && busy ? <li className="plx-cascader__empty plx-cascader__loading" role="presentation"><Spinner size="sm" label={t.loading} /><span aria-hidden="true">{t.loading}</span></li>
                : remote && failed ? <li className="plx-cascader__empty plx-cascader__error" role="presentation">{t.error}</li>
                  : <li className="plx-cascader__empty" role="presentation">{t.noMatches}</li>}
            </ul>
          ) : (
            <div ref={cols}>
              <MillerColumns className="plx-cascader__columns" label={label || t.columns} items={columnsItems} loader={branches} path={browse} expandOnHover={expandTrigger === 'hover'}
                checked={multiple ? checkedIds : undefined} strings={{ empty: t.empty }}
                openOnClick columnWidths={NARROW} onPathChange={(p) => setBrowse(p)} onOpen={(item) => { const real = item.self !== undefined ? item.self : item.id, hit = leaves.find((l) => l.item.id === real); pick(hit ? hit.item : item, hit ? hit.trail : [item]); }} />
            </div>
          )}
          {multiple && limitShown ? <div className="plx-cascader__limit" aria-hidden="true">{dataPhrase(t.limit, { n: maxChoices })}</div> : null}
        </div>
      ) : null}
    </div>
  );
});
