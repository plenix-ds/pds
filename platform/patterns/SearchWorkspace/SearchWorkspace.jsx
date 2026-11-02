/* Plenix · SearchWorkspace
   Summary: The Advanced Search workspace (level 3 of Plenix search), a view of the main work area like Categories or Files.
     It is normal browsing with more powerful filtering, never a form of field / operator / value rows.
   Usage:
     <SearchWorkspace title="Search results" query={query} onQueryChange={setQuery} placeholder="Search…"
       filters={[…]} onFilterChange={(id, value) => …} onClearAll={() => …} count={128} noun="asset"
       sort={{ value, options, onChange }} view={{ value, options, onChange }} onSave={() => …}
       headStart={<…/>} headEnd={<…/>} selection={{ count: selected.length, actions, onClear: clear }}>{results}</SearchWorkspace>
   Props:
     title: strings.title ("Search", the default) before a query, "Search results" after one, or a saved search's name (the capability decides)
     query: the search field's text (default "")
     onQueryChange(next): runs when the search field changes; Enter or typing updates the results (the capability filters)
     placeholder: the search field's placeholder (default strings.placeholder: "Search…")
     filters: FilterBar filters: [{ id, label, options, value, multiple }]
     onFilterChange(id, value): runs when a filter changes or its chip is removed
     onClearAll(): runs from Clear all, beside the chips of the set filters
     count: the number of results, for the result count line (default 0)
     noun: the word for one result in both count lines, as in "128 assets" (default strings.result: "result")
     plural: the word for several (default: noun + "s", or strings.results: "results" without a noun)
     sort: { value, options, onChange }; a Sort menu (optional)
     view: { value, options, onChange }; a Grid / Table switch (optional)
     onSave(): shows Save search (only capabilities that keep saved searches)
     headStart: extra controls at the start of the title row (a menu button, a details toggle)
     headEnd: extra controls at the end of the title row
     selection: CommandBar selection state ({ count, actions, onClear, noun, label }); preferred.
       onSelectAll and total: optional legacy Select all command, retained in the normal and selected bar.
     bulk: deprecated for one release; accepts selection state as above or a legacy React bar node.
       selection takes precedence; legacy nodes remain above results until callers migrate.
     className: more classes
     children: the results
     locale: the language the count is formatted in (default: the page's language, document.documentElement.lang)
     strings: the words it shows and announces, for other languages: { title: "Search", placeholder: "Search…", result:
       "result", results: "results", searchField: "Search {nouns}", save: "Save search", filters: "Filters", activeFilters:
       "Active filters", chip: "{label}: {value}", remove: "Remove {text}", clearAll: "Clear all", view: "View", grid: "Grid",
       table: "Table", sort: "Sort", sortValue: "Sort: {value}", noMatchQuery: "Nothing matches “{query}”.",
       noMatchQueryFilters: "Nothing matches “{query}” with these filters.", noMatchFilters: "Nothing matches these filters." }
   Behavior:
     Set filters are repeated as removable chips under the toolbar ("Type: PNG ×") with Clear all.
     The count line is announced politely. The results CommandBar swaps to selection commands while count is above zero.
     When count is 0 the results area says there is nothing to show for the query.
   Notes:
     The application shell (header, left navigation, a details panel where the capability has one) stays, and only the center changes.
     Pressing Enter in the header search opens it with the query kept.
*/
import React from 'react';
import { numeralLocale } from '../../utils/format.ts';
import { cx } from '../../utils/cx.ts';
import { Button } from '../../components/Button/Button.tsx';
import { SearchField } from '../../components/SearchField/SearchField.tsx';
import { CommandBar, CommandBarButton } from '../CommandBar/CommandBar.jsx';
import { Menu, MenuItem } from '../../components/Menu/Menu.jsx';
import { Chip } from '../../components/Tag/Tag.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { FilterBar } from '../FilterBar/FilterBar.jsx';
import { useUid } from '../../utils/layer.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ChecklistIcon from 'plenix-platform/icons/plenix/checklist';
import SaveIcon from 'plenix-platform/icons/plenix/save';
import SortIcon from 'plenix-platform/icons/plenix/sort';
import ViewTableIcon from 'plenix-platform/icons/plenix/view-table';
import { fill } from '../../utils/fill.ts';

const label = (f, v) => { const o = (f.options || []).find((x) => x.value === v); return o ? o.label : String(v); };

export function SearchWorkspace({ title, query = '', onQueryChange, placeholder, filters = [], onFilterChange, onClearAll,
  count = 0, noun, plural, sort, view, onSave, headStart, headEnd, selection, bulk, locale, strings, className, children }) {
  const t = useStrings('searchWorkspace', strings);
  const loc = numeralLocale(locale || (typeof document !== 'undefined' && document.documentElement.lang) || undefined);
  const id = useUid('plx-search-ws');
  const field = React.useRef(null);
  // the query typed here is applied as the person types; Enter keeps focus in the field
  const chips = [];
  filters.forEach((f) => {
    if (f.multiple) (f.value || []).forEach((v) => chips.push({ f, v, text: fill(t.chip, { label: f.label, value: label(f, v) }), remove: () => onFilterChange(f.id, (f.value || []).filter((x) => x !== v)) }));
    else if (f.value !== null && f.value !== undefined && f.value !== '') chips.push({ f, v: f.value, text: fill(t.chip, { label: f.label, value: label(f, f.value) }), remove: () => onFilterChange(f.id, null) });
  });
  const nouns = count === 1 ? (noun || t.result) : (plural || (noun ? noun + 's' : t.results));
  const counted = count.toLocaleString(loc) + ' ' + nouns;
  const legacyState = bulk && !React.isValidElement(bulk) && !Array.isArray(bulk) && typeof bulk === 'object' && 'count' in bulk ? bulk : null;
  const selected = selection || legacyState;
  const selectAll = selected && selected.onSelectAll ? { id: 'select-all', label: t.selectAll, icon: ChecklistIcon,
    disabled: selected.total !== undefined && selected.count >= selected.total,
    why: fill(t.allSelected, { noun: selected.noun || noun || t.result }), onSelect: selected.onSelectAll } : null;
  const selectedBar = selected ? { ...selected, actions: (selected.actions || []).concat(selectAll ? [selectAll] : []) } : null;
  const layouts = view ? view.options || [{ value: 'grid', label: t.grid }, { value: 'table', label: t.table }] : [];
  return (
    <section aria-labelledby={id + '-title'} className={cx('plx-search-ws', className)}>
      <div className="plx-search-ws__head">
        {headStart}
        <h2 id={id + '-title'} className="plx-search-ws__title">{title === undefined ? t.title : title}</h2>
        <span className="plx-search-ws__count" aria-live="polite">{counted}</span>
        <span className="plx-search-ws__spacer" />
        {onSave ? <Button size="sm" icon={SaveIcon} onClick={onSave}>{t.save}</Button> : null}
        {headEnd}
      </div>
      <div role="search" className="plx-search-ws__query">
        <SearchField ref={field} label={fill(t.searchField, { nouns })} placeholder={placeholder === undefined ? t.placeholder : placeholder} value={query}
          onChange={(e) => onQueryChange && onQueryChange(e.target.value)} onClear={() => onQueryChange && onQueryChange('')} />
      </div>
      {/* Clear all lives with the active-filter chips below, once */}
      {filters.length ? <FilterBar label={t.filters} filters={filters} onChange={onFilterChange} /> : null}
      {chips.length ? (
        <div className="plx-search-ws__active" role="group" aria-label={t.activeFilters}>
          {chips.map((c) => <Chip key={c.f.id + ':' + c.v} selected onRemove={c.remove} removeLabel={fill(t.remove, { text: c.text })}>{c.text}</Chip>)}
          {onClearAll ? <Button size="xs" variant="ghost" onClick={onClearAll}>{t.clearAll}</Button> : null}
        </div>
      ) : null}
      <CommandBar className="plx-search-ws__bar" label={title || t.title} sticky={false} count={counted} actions={selectAll ? [selectAll] : []} selection={selectedBar}
        view={<>
          {view ? <Menu label={t.view} placement="bottom-end" trigger={<CommandBarButton icon={ViewTableIcon} label={t.view} caret />}>
            {layouts.map((o) => <MenuItem key={o.value} checked={view.value === o.value} onSelect={() => view.onChange(o.value)}>{o.label}</MenuItem>)}
          </Menu> : null}
          {sort ? <Menu label={t.sort} placement="bottom-end" trigger={<CommandBarButton icon={SortIcon} aria-label={fill(t.sortValue, { value: sort.value })} label={fill(t.sortValue, { value: sort.value })} caret />}>
            {sort.options.map((o) => <MenuItem key={o} checked={sort.value === o} onSelect={() => sort.onChange(o)}>{o}</MenuItem>)}
          </Menu> : null}
        </>} />
      {!selected && !legacyState ? bulk : null}
      <div className="plx-search-ws__body">
        {count ? children : <EmptyState size="inline">{query ? fill(chips.length ? t.noMatchQueryFilters : t.noMatchQuery, { query }) : t.noMatchFilters}</EmptyState>}
      </div>
    </section>
  );
}
