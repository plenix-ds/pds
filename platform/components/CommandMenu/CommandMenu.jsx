/* Plenix · CommandMenu
   Summary: A filterable list of commands (04 Actions & Commands › Menus and commands › Command menu): a search field
     and, under it, the commands that match what is typed, in groups, with their icons, descriptions and keyboard
     shortcuts; a command can open a page of further commands. It is the ARIA combobox pattern with a listbox, drawn in
     place; CommandPalette opens it in a dialog with Ctrl K.
   Usage:
     <CommandMenu label="Commands" items={[
       { id: 'new', label: 'Create collection', icon: 'plus', group: 'Create', shortcut: 'Mod+Shift+N', onSelect: create },
       { id: 'theme', label: 'Change theme', icon: 'gear', group: 'Settings', items: [
         { id: 'light', label: 'Light', onSelect: () => setTheme('light') }, { id: 'dark', label: 'Dark', onSelect: … }] },
     ]} />
     <CommandMenu items={found} query={q} onQueryChange={setQ} filter={false} loading={pending} />   // the app searches
   Props:
     items: the commands: [{ id, label, icon, group, description, keywords, shortcut, disabled, onSelect(item), items,
       placeholder }]; group puts it under that heading (groups in the order they first appear); description is a second
       line; keywords are more words it matches; shortcut is a hotkey binding ("Mod+K") shown with hotkeyLabel; items
       makes it open a page of those commands (placeholder: that page's hint)
     label: the accessible name of the field and the list (default strings.label)
     placeholder: the hint in the empty field (default strings.placeholder)
     query, onQueryChange(text): the typed text, controlled (default: kept inside)
     filter: true (default) filters and ranks the items by the text; false shows them as given (the app searches)
     loading: the commands are being fetched: a spinner in the field and a Loading row while there are none (default false)
     onSelect(item): runs after a command's own onSelect, for every command run (a palette closes on it)
     autoFocus: the field takes focus when it is drawn (default false; CommandPalette's dialog focuses it)
     strings: the words it shows and announces, for other languages: { label: "Commands", placeholder: "Type a command or
       search", empty: "No results for “{query}”", loading: "Loading", back: "Back", results: "{count} results" }
     className: more classes on the menu
     ref: forwarded to the <input>
   Behavior:
     Typing filters: a label that starts with the text comes first, then one with a word that starts with it, then one
       that contains it, then a match in keywords, description or group; the groups keep their headings.
     ↓ and ↑ move the active command (it wraps at the ends) while focus stays in the field (aria-activedescendant);
       Enter runs it; a pointer moves the active command and a click runs it. A disabled command shows but does not run.
     A command with items opens its page: the field empties, its hint changes, and a Back button with the page's name
       shows above it; Backspace in the empty field or Back returns. Escape clears the text, then goes back a page; on the
       first page it is left to the container (a palette closes).
     The number of results is announced politely as it changes; no results shows "No results for “text”".
     The shortcut keys are shown, not bound: bind them where the command lives (useHotkey with the same label).
   Notes:
     Command labels are verb plus object ("Create collection"), the same words as in the menus and buttons.
     Not for choosing a value in a form (Combobox), nor for searching records (SearchField and its results).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { hotkeyLabel } from '../../utils/hotkey.ts';
import { LiveRegion } from '../../utils/announce.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { Kbd } from '../Kbd/Kbd.tsx';
import { Button } from '../Button/Button.tsx';
import { SearchField } from '../SearchField/SearchField.tsx';
import ArrowLeftIcon from 'plenix-platform/icons/plenix/arrow-left';
import ChevronRightIcon from 'plenix-platform/icons/plenix/chevron-right';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { dataPhrase } from '../../utils/dataText.tsx';

// how well an item matches the text: 4 the label starts with it, 3 a word of the label does, 2 the label contains it,
// 1 the keywords, description or group do, 0 no match
function score(item, q) {
  if (!q) return 1;
  const label = String(item.label || '').toLowerCase();
  if (label.indexOf(q) === 0) return 4;
  if (label.split(/[\s\-_/]+/).some((w) => w.indexOf(q) === 0)) return 3;
  if (label.indexOf(q) >= 0) return 2;
  const more = [].concat(item.keywords || [], item.description || '', item.group || '').join(' ').toLowerCase();
  return more.indexOf(q) >= 0 ? 1 : 0;
}

export const CommandMenu = React.forwardRef(function CommandMenu({ items = [], label, placeholder, query: queryProp, onQueryChange, filter = true,
  loading = false, onSelect, autoFocus = false, strings, className, ...rest }, ref) {
  const t = useStrings('commandMenu', strings);
  const id = useUid('plx-cmd');
  const input = React.useRef(null);
  React.useImperativeHandle(ref, () => input.current);
  const list = React.useRef(null);
  const [own, setOwn] = React.useState('');
  const query = queryProp !== undefined ? queryProp : own;
  const setQuery = (v) => { if (queryProp === undefined) setOwn(v); if (onQueryChange) onQueryChange(v); };
  const [pages, setPages] = React.useState([]);          // the pages opened from the first one: [item, …]
  const [active, setActive] = React.useState(0);
  const page = pages.length ? pages[pages.length - 1] : null;
  const source = page ? page.items || [] : items;
  const q = query.trim().toLowerCase();

  // the matching commands, ranked, then kept together under their group (groups in the order they first appear)
  const ranked = filter
    ? source.map((it, i) => ({ it, s: score(it, q), i })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s || a.i - b.i).map((x) => x.it)
    : source.slice();
  const groups = [];
  ranked.forEach((it) => { if (groups.indexOf(it.group || '') < 0) groups.push(it.group || ''); });
  const shown = groups.reduce((all, g) => all.concat(ranked.filter((it) => (it.group || '') === g)), []);

  React.useEffect(() => { setActive(0); }, [q, pages.length, shown.length]);
  React.useEffect(() => { if (autoFocus && input.current) input.current.focus({ preventScroll: true }); }, []);
  // the active command stays in view as it moves: only the list scrolls (never the page around it)
  React.useEffect(() => {
    const L = list.current, el = L && L.querySelector('[data-plx-command-index="' + active + '"]');
    if (!el) return;
    // grid: a scroll position (scrollTop), not a style or a size: it brings the row's measured edge to the list's edge
    const lr = L.getBoundingClientRect(), er = el.getBoundingClientRect();
    if (er.top < lr.top) L.scrollTop -= lr.top - er.top;
    else if (er.bottom > lr.bottom) L.scrollTop += er.bottom - lr.bottom;
  }, [active]);

  const open = (item) => { setPages(pages.concat([item])); setQuery(''); if (input.current) input.current.focus(); };
  const back = () => { setPages(pages.slice(0, -1)); setQuery(''); if (input.current) input.current.focus(); };
  const run = (item) => {
    if (!item || item.disabled) return;
    if (item.items) { open(item); return; }
    if (item.onSelect) item.onSelect(item);
    if (onSelect) onSelect(item);
  };
  const move = (d) => { if (!shown.length) return; setActive((a) => (a + d + shown.length) % shown.length); };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { if (shown[active]) { e.preventDefault(); run(shown[active]); } }
    else if (e.key === 'Escape') {
      if (query) { e.preventDefault(); e.stopPropagation(); setQuery(''); }
      else if (pages.length) { e.preventDefault(); e.stopPropagation(); back(); }
    } else if (e.key === 'Backspace' && !query && pages.length) { e.preventDefault(); back(); }
  };

  const listId = id + '-list';
  const optId = (i) => id + '-o' + i;
  const name = label || t.label;
  const count = loading && !shown.length ? '' : q && !shown.length ? t.empty.replace('{query}', query.trim()) : t.results.replace('{count}', String(shown.length));
  let n = -1;
  return (
    <div className={cx('plx-command-menu', className)} {...rest}>
      {page ? (
        <div className="plx-command-menu__page">
          <Button variant="ghost" size="xs" iconOnly icon={ArrowLeftIcon} label={t.back} onClick={back} />
          <span className="plx-command-menu__page-title">{page.label}</span>
        </div>
      ) : null}
      <SearchField ref={input} className="plx-command-menu__search" value={query} onChange={(e) => setQuery(e.target.value)} onClear={query ? () => setQuery('') : undefined}
        loading={loading} label={page ? page.label : name} placeholder={(page && page.placeholder) || placeholder || t.placeholder}
        role="combobox" aria-expanded="true" aria-controls={listId} aria-autocomplete="list"
        aria-activedescendant={shown[active] ? optId(active) : undefined} onKeyDown={onKeyDown} />
      <div ref={list} id={listId} role="listbox" aria-label={page ? page.label : name} aria-busy={loading || undefined} hidden={!shown.length || undefined} className="plx-command-menu__list">
        {groups.map((g) => {
          const members = shown.filter((it) => (it.group || '') === g);
          const head = g ? id + '-g' + groups.indexOf(g) : undefined;
          const rows = members.map((it) => {
            n += 1;
            const i = n;
            return (
              <div key={it.id || it.label} id={optId(i)} role="option" aria-selected={i === active} aria-disabled={it.disabled || undefined}
                aria-haspopup={it.items ? 'listbox' : undefined} data-plx-command-index={i}
                className={cx('plx-command-menu__item', i === active && 'is-active')}
                onMouseDown={(e) => e.preventDefault()} onMouseMove={() => { if (i !== active) setActive(i); }} onClick={() => run(it)}>
                {it.icon ? <span className="plx-command-menu__icon" aria-hidden="true"><Icon name={it.icon} /></span> : null}
                <span className="plx-command-menu__text">
                  <span className="plx-command-menu__label">{it.label}</span>
                  {it.description ? <span className="plx-command-menu__description">{it.description}</span> : null}
                </span>
                {it.shortcut ? <Kbd className="plx-command-menu__shortcut">{hotkeyLabel(it.shortcut)}</Kbd> : null}
                {it.items ? <span className="plx-command-menu__chevron" aria-hidden="true"><Icon name={ChevronRightIcon} /></span> : null}
              </div>
            );
          });
          return g ? (
            <div key={'g' + g} role="group" aria-labelledby={head} className="plx-command-menu__group">
              <div id={head} className="plx-command-menu__group-label" role="presentation">{g}</div>
              {rows}
            </div>
          ) : <React.Fragment key="g">{rows}</React.Fragment>;
        })}
      </div>
      {!shown.length && loading ? <div className="plx-command-menu__status">{t.loading}</div> : null}
      {!shown.length && !loading ? <div className="plx-command-menu__status">{q ? t.empty.replace('{query}', query.trim()) : dataPhrase(t.results, { count: 0 })}</div> : null}
      <LiveRegion kind="status">{count}</LiveRegion>
    </div>
  );
});
