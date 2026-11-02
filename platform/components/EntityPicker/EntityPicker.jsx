/* Plenix · EntityPicker
   Summary: A search-and-choose field for records of one kind (people, teams, projects, assets), each suggestion with its
     picture or icon, its name and the detail that tells similar ones apart; kind="people" is the people picker.
   Usage:
     <Field label="Owner"><EntityPicker kind="people" options={people} value={owner} onChange={setOwner} /></Field>
     <EntityPicker kind="people" multiple values={reviewers} onChange={setReviewers} loadOptions={(q) => api.people(q)} label="Reviewers" />
     <EntityPicker kind="teams" options={teams} value={team} onChange={setTeam} label="Team" />
     <EntityPicker entityName="projects" options={projects} value={p} onChange={setP} onBrowse={openProjectDialog} label="Project" />
   Props:
     kind: "records" (default: an icon, the name, a detail and an ID) | "people" (the avatar with presence, the name
       and an email or role) | "teams" (a team icon, the name and the member count)
     options: the records: [{ value, label, description, meta, icon, src, color, presence, disabled }]: description is the
       second line (an email, a role, a path), meta a technical value at the end (an ID, a count) in the data font, icon
       the icon (records), src, color and presence the person's (people)
     value: the chosen value, single; onChange(value, option) runs with it
     values: the chosen values, with multiple; onChange(values) runs with the new array
     multiple: several records, shown as tags before the text (default false)
     loadOptions(text): loads the records for the typed text (a directory too large to list): returns them or a Promise of
       them; loadDelay (default 300 ms) and minChars (default 1) as Combobox's
     entityName: the kind in the plural, lowercase, for the hint and the empty message ("projects"); default "people",
       "teams" or "records" by kind
     placeholder: the hint in the empty field (default "Search by name or email" for people, "Search {entityName}" otherwise)
     onBrowse(): shows "Browse all {entityName}" at the end of the list, for a dialog that searches with filters
     label: the accessible name when there is no Field
     invalid, disabled: the field's states; a Field sets invalid with its error
     warning: true shows a warning state beside invalid (a Field with a warning sets it): a warning border and fill; the Field draws its icon and message
     id: the id of the input (a Field sets it)
     strings: the words it shows and announces: { placeholderPeople: "Search by name or email", placeholder: "Search
       {entityName}", empty: "No {entityName} found", browse: "Browse all {entityName}", loading: "Loading…", error: "The
       results could not be loaded", results: (n) => …, remove: "Remove {label}" }
     className: more classes on the picker
     ref: forwarded to the <input>
   Behavior:
     The WAI-ARIA combobox with a listbox popup: the list opens on typing (and on focus when there are options to show),
       Arrow Down and Up move, Enter chooses, Escape closes, a click outside closes.
     Name, description and meta are all searched (a person by name or email, a record by name or ID).
     A single choice shows the chosen record's picture or icon before its name in the field and closes the list; with
       multiple, choosing adds or removes a tag and the list stays open; Backspace in the empty field removes the last
       tag; each tag has a remove button named "Remove <name>".
     The list opens in the browser's top layer, below the field or above it near an edge, as wide as the field at least: no dialog,
       drawer or scroll area clips it.
     The number of results is announced politely after each search; while loadOptions runs the list is busy and shows
       a spinner; a failed load says so in the list.
   Notes:
     The picture in each suggestion is decorative: the name and the detail are the option's text.
     For a few known choices use Select; for anything that is not a record, Combobox.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Tag } from '../Tag/Tag.tsx';
import { Avatar } from '../Avatar/Avatar.jsx';
import { Icon } from '../Icon/Icon.tsx';
import { Spinner } from '../Loading/Loading.tsx';
import { announce } from '../../utils/announce.tsx';
import { useFloating, TOP_LAYER } from '../../utils/floating.ts';

import { useStrings, useLocale } from '../../providers/LocaleProvider.tsx';
import { formatNumber } from '../../utils/format.ts';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import DocumentIcon from 'plenix-platform/icons/plenix/document';
import OpenIcon from 'plenix-platform/icons/plenix/open';
import SearchIcon from 'plenix-platform/icons/plenix/search';
import SettingsUsersIcon from 'plenix-platform/icons/plenix/settings-users';
import { fill } from '../../utils/fill.ts';

const NAMES = { people: 'people', teams: 'teams', records: 'records' };
export const EntityPicker = React.forwardRef(function EntityPicker({ kind = 'records', options = [], value, values, onChange, multiple = false,
  loadOptions, loadDelay = 300, minChars = 1, entityName, placeholder, onBrowse, label, invalid, warning, disabled, id, strings, className, ...rest }, ref) {
  const t = useStrings('entityPicker', strings);
  const loc = useLocale();
  const noun = entityName || NAMES[kind] || NAMES.records;
  const auto = 'plx-ep' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const listId = auto + '-list';
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const [active, setActive] = React.useState(0);
  const wrap = React.useRef(null), input = React.useRef(null), list = React.useRef(null);
  React.useImperativeHandle(ref, () => input.current);
  const [loaded, setLoaded] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const loader = React.useRef(loadOptions), request = React.useRef(0), seen = React.useRef(new Map());
  loader.current = loadOptions;
  const async = !!loadOptions;
  const query = text.trim();
  React.useEffect(() => {
    if (!async || !open) return undefined;
    if (query.length < minChars) { request.current++; setLoaded([]); setBusy(false); setFailed(false); return undefined; }
    const n = ++request.current;
    setBusy(true); setFailed(false);
    const timer = setTimeout(() => {
      Promise.resolve().then(() => loader.current(query)).then((list) => {
        if (n !== request.current) return;
        const got = Array.isArray(list) ? list : [];
        got.forEach((o) => seen.current.set(o.value, o));
        setLoaded(got); setBusy(false); announce(typeof t.results === 'function' ? t.results(got.length) : loc.t('entityPicker.results', { count: got.length, n: formatNumber(got.length) }));
      }, () => { if (n !== request.current) return; setLoaded([]); setBusy(false); setFailed(true); });
    }, loadDelay);
    return () => clearTimeout(timer);
  }, [async, open, query, minChars, loadDelay]);
  const optionOf = (v) => options.find((x) => x.value === v) || loaded.find((x) => x.value === v) || seen.current.get(v);
  const chosen = multiple ? (values || []) : (value !== undefined && value !== null && value !== '' ? [value] : []);
  const current = !multiple && chosen.length ? optionOf(chosen[0]) || null : null;
  const q = query.toLowerCase();
  const hit = (o) => [o.label, o.description, o.meta].some((x) => x !== undefined && x !== null && String(x).toLowerCase().indexOf(q) >= 0);
  const results = busy || failed ? [] : async ? loaded : options.filter((o) => !q || hit(o));
  const items = results.map((o) => ({ kind: 'option', o })).concat(onBrowse && !busy ? [{ kind: 'browse' }] : []);
  // the number of results, once typing pauses (the async loader announces its own)
  React.useEffect(() => {
    if (async || !open || !q) return undefined;
    const timer = setTimeout(() => announce(typeof t.results === 'function' ? t.results(results.length) : loc.t('entityPicker.results', { count: results.length, n: formatNumber(results.length) })), 500);
    return () => clearTimeout(timer);
  }, [q, open]);
  React.useEffect(() => {
    if (!open) return undefined;
    const off = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', off);
    return () => document.removeEventListener('mousedown', off);
  }, [open]);
  React.useEffect(() => { setActive(0); }, [q, open]);
  const choose = (item) => {
    if (!item) return;
    if (item.kind === 'browse') { setOpen(false); onBrowse(); return; }
    const o = item.o;
    if (o.disabled) return;
    if (multiple) { onChange(chosen.indexOf(o.value) >= 0 ? chosen.filter((x) => x !== o.value) : chosen.concat([o.value])); setText(''); }
    else { onChange(o.value, o); setText(''); setOpen(false); }
  };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); else setActive((a) => Math.min(items.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { if (open && items[active]) { e.preventDefault(); choose(items[active]); } }
    else if (e.key === 'Escape') { if (open) { e.preventDefault(); setOpen(false); } }
    else if (e.key === 'Backspace' && multiple && !text && chosen.length) { onChange(chosen.slice(0, -1)); }
  };
  const visual = (o, size) => {
    if (kind === 'people') return <Avatar name={o.label} src={o.src} color={o.color} presence={o.presence} size={size === 'field' ? 'xs' : 'sm'} />;
    const name = o.icon || (kind === 'teams' ? SettingsUsersIcon : DocumentIcon);
    return size === 'field' ? <Icon name={name} /> : <Icon name={name} size="sm" className="plx-entity-picker__icon" />;
  };
  const optId = (i) => auto + '-o' + i;
  const hint = placeholder || (kind === 'people' && !entityName ? t.placeholderPeople : fill(t.placeholder, { entityName: noun }));
  const showList = open && (items.length || busy || failed || q);
  // the list opens in the top layer, placed against the field by the floating layer (flips up near an edge, follows scroll and resize): no dialog, drawer or scroll area clips it
  useFloating(wrap, list, { open: !!showList, placement: 'bottom-start', matchWidth: true });
  React.useLayoutEffect(() => { const el = list.current; if (showList && TOP_LAYER && el && el.showPopover && !el.matches(':popover-open')) el.showPopover(); }, [showList]);
  return (
    <div ref={wrap} className={cx('plx-entity-picker', 'plx-entity-picker--' + kind, multiple && 'plx-entity-picker--multiple', open && 'is-open', disabled && 'is-disabled', className)}>
      <div className="plx-entity-picker__field plx-input" aria-invalid={invalid || undefined} data-plx-warning={warning || undefined}>
        {multiple ? chosen.map((v) => { const o = optionOf(v); const name = o ? o.label : String(v);
          return <Tag key={v} onRemove={disabled ? undefined : () => onChange(chosen.filter((x) => x !== v))} removeLabel={fill(t.remove, { label: name })}>{name}</Tag>; }) : null}
        {current && !open ? <span className="plx-entity-picker__chosen" aria-hidden="true">{visual(current, 'field')}</span> : null}
        <input ref={input} id={id} className="plx-entity-picker__input" role="combobox" aria-expanded={!!showList} aria-controls={listId} aria-autocomplete="list"
          aria-activedescendant={showList && items[active] ? optId(active) : undefined} aria-label={label} disabled={disabled} autoComplete="off"
          value={open || multiple ? text : (current ? current.label : '')} placeholder={multiple && chosen.length ? '' : (current && !open ? current.label : hint)}
          onChange={(e) => { setText(e.target.value); setOpen(true); }} onFocus={() => { if (!async) setOpen(true); }} onKeyDown={onKey} {...rest} />
        <span className="plx-entity-picker__search" aria-hidden="true"><Icon name={SearchIcon} /></span>
      </div>
      {showList ? (
        <ul ref={list} className="plx-entity-picker__list" id={listId} role="listbox" popover={TOP_LAYER ? 'manual' : undefined} onMouseDown={(e) => e.preventDefault()} aria-label={label || noun} aria-multiselectable={multiple || undefined} aria-busy={busy || undefined}>
          {busy ? <li className="plx-entity-picker__status" role="presentation"><Spinner size="sm" label={t.loading} /><span aria-hidden="true">{t.loading}</span></li>
            : failed ? <li className="plx-entity-picker__status plx-entity-picker__error" role="presentation">{t.error}</li>
            : null}
          {!busy && !failed && !results.length ? <li className="plx-entity-picker__status" role="presentation">{fill(t.empty, { entityName: noun })}</li> : null}
          {items.map((it, i) => it.kind === 'browse'
            ? <li key="browse" id={optId(i)} role="option" aria-selected={false} className={cx('plx-entity-picker__option', 'plx-entity-picker__browse', i === active && 'is-active')}
                onMouseDown={(e) => e.preventDefault()} onClick={() => choose(it)} onMouseEnter={() => setActive(i)}>
                <span className="plx-entity-picker__browse-icon" aria-hidden="true"><Icon name={OpenIcon} /></span>{fill(t.browse, { entityName: noun })}</li>
            : <li key={it.o.value} id={optId(i)} role="option" aria-selected={chosen.indexOf(it.o.value) >= 0} aria-disabled={it.o.disabled || undefined}
                className={cx('plx-entity-picker__option', i === active && 'is-active', chosen.indexOf(it.o.value) >= 0 && 'is-selected', it.o.disabled && 'is-disabled')}
                onMouseDown={(e) => e.preventDefault()} onClick={() => choose(it)} onMouseEnter={() => setActive(i)}>
                <span className="plx-entity-picker__visual" aria-hidden="true">{visual(it.o)}</span>
                <span className="plx-entity-picker__text">
                  <span className="plx-entity-picker__name">{it.o.label}</span>
                  {it.o.description ? <span className="plx-entity-picker__description">{it.o.description}</span> : null}
                </span>
                {it.o.meta !== undefined && it.o.meta !== null ? <span className="plx-entity-picker__meta">{it.o.meta}</span> : null}
                {chosen.indexOf(it.o.value) >= 0 ? <span className="plx-entity-picker__check" aria-hidden="true"><Icon name={CheckIcon} /></span> : null}
              </li>)}
        </ul>
      ) : null}
    </div>
  );
});
