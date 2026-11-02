/* Plenix · CommandBar, CommandBarButton, CommandBarSearch, useCommandBar
   Summary: The bar over a collection (owner, 2026-10-14 and 2026-10-15, the command bar study): ONE white framed bar of
     one height, fixed at the top of the content while the content scrolls; the table under it never moves. With nothing
     selected: the page's actions, then the search and the filters, then Sort, Group, Columns and View, and the count at
     the end. With rows selected the bar swaps (Microsoft 365): the page's actions give way to the selection's commands
     (Delete last); the search, the filters and Sort, Group, Columns and View stay where they are, so the person can keep
     narrowing the list while rows are ticked (owner, issue 454); the bar ends with "× N selected", which clears the selection. A page with no actions has a view bar (1F).
   Usage:
     <CommandBar label="Assets" count="24 assets"
       actions={[{ id: 'new', label: 'New', icon: 'plus', items: <><MenuItem icon="folder-add">Folder</MenuItem>…</> },
                 { id: 'upload', label: 'Upload', icon: 'upload', onSelect: upload }]}
       find={<><CommandBarSearch value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} placeholder="Search assets" />
         <FilterPanel fields={fields} value={filter} onChange={setFilter} /></>}
       view={<><SortPanel fields={fields} value={sort} onChange={setSort} /><GroupPanel … /><ViewMenu … /></>}
       selection={{ count: sel.length, noun: 'asset', onClear: () => setSel([]),
         actions: [{ id: 'download', label: 'Download', icon: 'download-arrow', onSelect: … }, …, { id: 'delete', label: 'Delete', icon: 'trash', danger: true, onSelect: … }] }} />
   Props:
     label: the bar's accessible name (the collection: "Assets")
     actions: the page's commands, in order: [{ id, label, icon, onSelect, items, danger, disabled, why, primary, toggle,
       pressed, choices, value, onChange, loading, tooltip, panel }]. The bar holds commands only (owner, 2026-10-15, the Fluent model): an on/off
       setting is a toggle command (toggle: true, pressed, onSelect(next)), a pick of one value is a choices command
       (choices: [{ value, label, icon }], value, onChange(value)); folded into More they become a checked item and a
       submenu of radio items. No other controls go in the bar.
     actions[].items: makes the command a menu: Menu children (MenuItem…) or [{ id, label, icon, danger, disabled, onSelect }]
     actions[].danger: a destructive command: in the danger color, after a divider, the last to fold into More
     actions[].disabled: the command is grayed, never hidden (owner, 2026-10-14)
     actions[].why: the tooltip of a disabled command, saying why
     actions[].loading: spinner, busy and inert, including folded commands
     actions[].tooltip: help shown on hover and focus with labels or icons (disabled why takes precedence)
     actions[].panel({ close }): a small form in a Popover anchored to the action, including selection and More items;
       focus enters the form and returns on Escape or close. Use close() after the form succeeds.
     actions[].primary: the page's one primary command (filled; it keeps its label); default none
     find: the find side, in order: CommandBarSearch first (owner, 2026-10-14), then FilterPanel
     quickFilters: the app's quick filters after Filter, as descriptors (QuickFilter's props): [{ id, label, icon, noun,
       options, value, onChange, kind, required, counts }]; when the bar is short of room they fold into More after the commands, each a
       submenu of checkable values (a date: its presets as radio items) (owner, 2026-10-15, the Fluent model)
     view: the view side: SortPanel, GroupPanel, ColumnsMenu, ViewMenu
     count: the collection's count at the end ("24 assets"; a string or a number is drawn in the data font); hidden while
       rows are selected ("× N selected" takes its place)
     status: a short status text beside the count ("Synced 2 min ago"), muted; it steps out with the count when the bar
       is short of room, and while rows are selected
     end: more controls at the very end (Export); hidden while rows are selected. A descriptor { content,
       fold: { label, icon, items } } supplies its More submenu; without fold the content stays in the bar.
       items are Menu children or MenuItem descriptors, including checked toggles.
     selection.hidden: how many selected records are hidden by filters (DataGrid onSelectionChange supplies it)
     selection: the selection (the swap): { count, hidden, actions, onClear, noun, plural, label }; while count is above 0 the bar
       holds selection.actions ([{ id, label, icon, onSelect, items, danger, single, disabled, why }]; single: disabled
       while more than one is selected, with a why-tooltip) instead of the page's actions, and ends with "× N selected"
       (onClear); search and the filters stay (owner, issue 454); label names the bar meanwhile (default "{label} actions")
     layout: "auto" (default: "one" with actions, "view" without) | "one" (1A) | "view" (1F: a view bar, no actions);
       "split" (a separate action bar for many actions) is retired (2026-10-15) and draws "one": many actions fold into More
     sticky: "auto" (default) sticks only as a direct child of PageContent or AppShell main; true/false force
       sticky/normal flow. A bar inside a card or another layout wrapper stays in normal flow. It has no background
       until content scrolls under it (data-plx-stuck); then the page canvas, so the content does not show through.
     narrow: the bar starts at icons only with the search as its icon (a side panel's width); default false (the width
       decides)
     strings: { more: "More actions", actions: "{label} actions", find: "Find and view", selected: "{n} selected",
       clear: "Clear the selection", clearName: "{n} selected, clear the selection", swapped: "{n} selected. Selection
       actions available.", cleared: "Selection cleared.", why: "Select {plural} to {action}", single: "Select one {noun}
       to {action}" }
     className: more classes
     CommandBarButton: a find-and-view button (the trigger of a panel or a menu): { icon, label, count, active, caret }; ghost;
       icon and label, or its icon only while the bar is narrow (give it a Tooltip); active or a count tints it and shows the
       count in a badge; other props reach the Button (ref too)
     CommandBarSearch: the bar's SearchField (width "bar"; collapsed to its icon while the bar is narrow); SearchField's props
     useCommandBar(): { iconOnly, collapsed, step, searchOpen, setSearchOpen } of the bar around a control
   Behavior:
     The button rule, measured (owner, 2026-10-14 and 2026-10-15): every control shows its icon and label while the bar
       fits on one line; first, every labeled control becomes its icon only, each with its tooltip (the actions, Filter,
       the quick filters, Sort, Group, Columns, View); then the search becomes its icon, which opens the field across the
       bar, and the count and status step out; then the commands fold into "More actions" (⋮) one per step from the end,
       the danger commands last. More shows only
       when something does not fit. Last, the find side (the search, Filter and the kept quick filters) folds into one
       "Find and view" button that opens them, at full size, in a popover: nothing in the bar is drawn outside it. A change of width, labels or counts starts again from icons and labels.
     Sort, Filter, Group, View and Columns are never merged: each keeps its own button at every width.
     Commands are never hidden by state: they are disabled, with a tooltip saying why.
     Every button is ghost (no outline). The bar is white and framed (3A), never tinted while rows are selected.
     The swap keeps the bar's height and the focus where it is (on the table); it is announced ("2 selected. Selection
       actions available.", "Selection cleared."). Escape in the bar clears the selection. Sort, Group, Columns and View
       stay mounted through the swap, so an open panel keeps its state.
     The bar is a Toolbar: one Tab stop, the arrow keys move between its controls.
   Notes:
     The count and the end controls sit at the end of the bar. Pages with neither actions nor find and view have no
     bar: the plain table. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useBarFit } from '../../utils/barFit.ts';
import { Button } from '../../components/Button/Button.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Toolbar } from '../../components/Toolbar/Toolbar.jsx';
import { Divider } from '../../components/Divider/Divider.tsx';
import { Tooltip } from '../../components/Tooltip/Tooltip.tsx';
import { announce } from '../../utils/announce.tsx';
import { formatNumber } from '../../utils/format.ts';
import { SearchField } from '../../components/SearchField/SearchField.tsx';
import { BarActions, foldOrder } from './BarActions.jsx';
import { MenuSub, MenuItem, MenuRadioGroup } from '../../components/Menu/Menu.jsx';
import { QuickFilter } from '../QuickFilter/QuickFilter.jsx';
import { SingleQuickFilterMenu } from '../QuickFilter/single-menu.jsx';
import { Inline, Stack } from '../../components/Stack/Stack.tsx';
import { Popover } from '../../components/Popover/Popover.jsx';
import { fieldWords } from '../../utils/fields.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import SearchIcon from 'plenix-platform/icons/plenix/search';
import { fill } from '../../utils/fill.ts';

// the steps of the button rule: 0 icon and label; 1 icons only; 2 the search as its icon; then one more action per step
// into More
const ICONS = 1, SEARCH = 2;

const BarContext = React.createContext({ iconOnly: false, collapsed: false, step: 0, searchOpen: false, setSearchOpen: () => {} });
export const useCommandBar = () => React.useContext(BarContext);

export const CommandBarButton = React.forwardRef(function CommandBarButton({ icon, label, count = 0, active = false, caret = false, iconOnly, className, children, ...rest }, ref) {
  const ctx = useCommandBar();
  const only = iconOnly === undefined ? ctx.iconOnly : iconOnly;
  const n = Number(count) || 0;
  const badge = n ? <Badge size="sm" tone="active">{n}</Badge> : null;
  const name = n ? label + ', ' + n : label;
  // icons only: no caret (the tooltip names it); with a count: the icon and the count, named "Filter, 2"
  return (
    <Button ref={ref} size="sm" variant="ghost" icon={icon} caret={caret && !only} selected={active || n > 0} iconOnly={only && !n} label={only ? name : undefined}
      className={cx('plx-command-bar__button', className)} {...rest}>
      {only ? (n ? badge : label) : <>{children || label}{badge ? <>{' '}{badge}</> : null}</>}
    </Button>
  );
});

export const CommandBarSearch = React.forwardRef(function CommandBarSearch(props, ref) {
  const { collapsed, searchOpen, setSearchOpen } = useCommandBar();
  return <SearchField ref={ref} width="bar" collapsed={collapsed} open={collapsed ? searchOpen : undefined} onOpenChange={collapsed ? setSearchOpen : undefined} {...props} />;
});

export function CommandBar({ label, actions = [], find, quickFilters = [], view, count, status, end, selection, layout = 'auto', sticky = 'auto', narrow = false, strings, className }) {
  const t = useStrings('commandBar', strings);
  const fw = useStrings('fields');
  const root = React.useRef(null);
  // the selection (owner, 2026-10-15: the swap; issue 454): an object { count, actions, onClear, noun, plural, label }; while
  // its count is above 0 the selection's commands replace the page's actions; search and filters stay
  const sel = selection && !React.isValidElement(selection) && typeof selection === 'object' ? selection : null;
  const selCount = sel ? Number(sel.count) || 0 : 0;
  const selecting = selCount > 0;
  const selActs = selecting ? (sel.actions || []) : [];
  // "split" (a separate action bar) is retired (2026-10-15): many actions fold into More in the one bar
  const shape = layout === 'auto' || layout === 'split' ? (actions.length ? 'one' : 'view') : layout;
  const shown = selecting ? selActs : shape === 'view' ? [] : actions;
  const quick = quickFilters;   // search and filters stay while rows are ticked (owner, issue 454)
  const ending = end && !React.isValidElement(end) && !Array.isArray(end) && typeof end === 'object' && ('content' in end || 'fold' in end) ? end : null;
  const endContent = ending ? ending.content : end;
  const endFold = !selecting && ending && ending.fold;
  const finding = !!find || quick.length > 0;
  const folds = foldOrder(shown).length + quick.length + (endFold ? 1 : 0) + (finding ? 1 : 0);
  // the bar's search, opened across the bar: the bar holds its step while it is open
  const [searchOpen, setSearchOpen] = React.useState(false);
  const key = [shape, narrow, selecting ? 'sel' : 'rest', shown.map((a) => a.label + (a.disabled ? '0' : '') + (a.loading ? 'busy' : '')).join('|'), quickFilters.map((q) => q.label + (q.value && q.value.length ? q.value.length : '')).join('|'), endFold && endFold.label].join('§');
  const step = useBarFit(root, key, SEARCH + folds, narrow ? SEARCH : 0, ':scope > .plx-command-bar__bar > [data-plx-bar-row]', searchOpen);
  const ctx = React.useMemo(() => ({ iconOnly: step >= ICONS, collapsed: step >= SEARCH, step, searchOpen: searchOpen && step >= SEARCH, setSearchOpen }), [step, searchOpen]);
  // Commands fold first (from the end, Delete last), then an opted-in end control, then quick filters.
  const foldAll = Math.max(0, step - SEARCH);
  const fold = Math.min(foldAll, foldOrder(shown).length);
  const endAway = !!endFold && foldAll > fold;
  const quickAway = Math.min(quick.length, Math.max(0, foldAll - fold - (endAway ? 1 : 0)));
  // the last step: the find side folds into its button (after every command, the end control and the quick filters)
  const findAway = finding && foldAll > fold + (endAway ? 1 : 0) + quickAway;
  const quickKept = quick.slice(0, quick.length - quickAway), quickFolded = quick.slice(quick.length - quickAway);
  const quickMenu = quickFolded.map((q) => {
    const id = q.id || q.label;
    const counted = option => {
      const count = option.count !== undefined ? option.count : q.counts instanceof Map ? q.counts.get(option.value) || 0 : q.counts ? q.counts[option.value] || 0 : undefined;
      return count === undefined ? option.label || option.value : <Inline as="span" gap="xs">{option.label || option.value}<Text variant="data">{formatNumber(count)}</Text></Inline>;
    };
    if (q.kind === 'single') return <MenuSub key={id} label={q.label} icon={q.icon}><SingleQuickFilterMenu {...q} /></MenuSub>;
    if (q.kind === 'date') {
      const d = Object.assign({ preset: 'any', from: '', to: '' }, q.value);
      return <MenuSub key={id} label={q.label} icon={q.icon}><MenuRadioGroup label={q.label} value={d.preset} onChange={(v) => q.onChange && q.onChange(Object.assign({}, d, { preset: v }))}>
        {fieldWords.presets(fw).map((p) => <MenuItem key={p.value} value={p.value}>{counted(p)}</MenuItem>)}</MenuRadioGroup></MenuSub>;
    }
    const chosen = q.value || [];
    return <MenuSub key={id} label={chosen.length ? q.label + ' (' + chosen.length + ')' : q.label} icon={q.icon}>
      {(q.options || []).map((o) => (typeof o === 'string' ? { value: o, label: o } : o)).map((o) => (
        <MenuItem key={o.value} checked={chosen.indexOf(o.value) >= 0} keepOpen
          onSelect={() => q.onChange && q.onChange(chosen.indexOf(o.value) >= 0 ? chosen.filter((x) => x !== o.value) : chosen.concat(o.value))}>{counted(o)}</MenuItem>))}
    </MenuSub>;
  });
  const endMenu = endAway ? <MenuSub key="plx-end" label={endFold.label} icon={endFold.icon}>
    {Array.isArray(endFold.items) && endFold.items.length && !React.isValidElement(endFold.items[0]) ? endFold.items.map(item => <MenuItem key={item.id || item.label} icon={item.icon} checked={item.checked} disabled={item.disabled} danger={item.danger} onSelect={item.onSelect}>{item.label}</MenuItem>) : endFold.items}
  </MenuSub> : null;
  const extraMenu = endMenu ? [endMenu].concat(quickMenu) : quickMenu;
  // the swap is announced (the focus stays where it is, on the table)
  const was = React.useRef(selecting);
  // stuck: the bar is sticky, pinned at its scroll container's top, with content scrolled under it
  React.useEffect(() => {
    const el = root.current;
    if (!el || typeof window === 'undefined') return undefined;
    const scrollerOf = (node) => { for (let p = node.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowY; if (o === 'auto' || o === 'scroll') return p; } return null; };
    // the scroll container is found on each check: on the first render the page's stylesheets may not have applied yet
    const check = () => {
      const scroller = scrollerOf(el);
      const sticky = getComputedStyle(el).position === 'sticky';
      const top = scroller ? scroller.getBoundingClientRect().top + (parseFloat(getComputedStyle(scroller).paddingTop) || 0) : 0, scrolled = scroller ? scroller.scrollTop > 0 : window.scrollY > 0;
      const stuck = sticky && scrolled && el.getBoundingClientRect().top <= top + 1;
      if (stuck) el.setAttribute('data-plx-stuck', ''); else el.removeAttribute('data-plx-stuck');
    };
    // scroll events come at most once a frame already: the check runs on each
    const schedule = check;
    // scroll does not bubble: listening in the capture phase on the document hears every scroll container
    document.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('resize', schedule);
    check();
    return () => { document.removeEventListener('scroll', schedule, { capture: true }); window.removeEventListener('resize', schedule); };
  }, [sticky]);
  React.useEffect(() => {
    if (was.current !== selecting) announce(selecting ? fill(t.swapped, { n: formatNumber(selCount) }) : t.cleared);
    was.current = selecting;
  }, [selecting]);
  const words = { noun: (sel && sel.noun) || 'item', plural: (sel && sel.plural) || ((sel && sel.noun) || 'item') + 's' };
  const off = (a) => !!a.disabled || !!(a.single && selCount > 1);
  const why = (a) => a.why || fill(a.single && selCount > 1 ? t.single : t.why, Object.assign({ action: String(a.label).toLowerCase() }, words));
  const acts = shown.length || extraMenu.length ? (
    <Toolbar.Group className="plx-command-bar__actions">
      <BarActions actions={shown} iconOnly={ctx.iconOnly} fold={fold} moreLabel={t.more} dangerClass="plx-command-bar__danger"
        off={selecting ? off : undefined} why={selecting ? why : undefined} extra={extraMenu} />
    </Toolbar.Group>
  ) : null;
  const quickEls = quickKept.map((q) => <QuickFilter key={q.id || q.label} {...q} />);
  // folded, the find side opens from one button; inside the popover its controls show at full size (labels, the field open)
  const fullCtx = React.useMemo(() => ({ iconOnly: false, collapsed: false, step: 0, searchOpen: false, setSearchOpen }), []);
  const findEl = !(find || quickEls.length) ? null : findAway ? (
    <Toolbar.Group className="plx-command-bar__find">
      <Popover title={t.find} placement="bottom-end" trigger={<CommandBarButton icon={SearchIcon} label={t.find} iconOnly />}>
        <BarContext.Provider value={fullCtx}><Stack gap="sm" align="start">{find}{quickEls}</Stack></BarContext.Provider>
      </Popover>
    </Toolbar.Group>
  ) : <Toolbar.Group className="plx-command-bar__find">{find}{quickEls}</Toolbar.Group>;
  const viewEl = view ? <Toolbar.Group className="plx-command-bar__view">{view}</Toolbar.Group> : null;
  const countEl = selecting || count === undefined || count === null || ctx.collapsed ? null
    : typeof count === 'string' || typeof count === 'number' ? <Text variant="data" className="plx-command-bar__count">{count}</Text> : count;
  // while rows are selected the bar ends with "× N selected": the way out of the selection (Microsoft 365)
  const hiddenText = sel && sel.hidden > 0 ? fill(t.hidden, { n: formatNumber(sel.hidden) }) : '';
  const [hiddenBefore, hiddenAfter] = String(t.hidden).split('{n}');
  const [before, after] = String(t.selected).split('{n}');
  const clearEl = selecting ? (
    <Tooltip content={t.clear}>
      <Button size="sm" variant="ghost" icon={CloseIcon} className="plx-command-bar__clear" aria-label={fill(t.clearName, { n: formatNumber(selCount) }) + hiddenText} onClick={() => sel.onClear && sel.onClear()}>
        {before}<Text variant="data" className="plx-command-bar__number">{formatNumber(selCount)}</Text>{after}{hiddenText ? <>{hiddenBefore}<Text variant="data">{formatNumber(sel.hidden)}</Text>{hiddenAfter}</> : null}
      </Button>
    </Tooltip>
  ) : null;
  const statusEl = selecting || !status || ctx.collapsed ? null : <Text variant="secondary" className="plx-command-bar__status">{status}</Text>;
  const keptEnd = !selecting && !endAway ? endContent : null;
  const tail = countEl || statusEl || keptEnd || clearEl ? (
    <Toolbar.Group className="plx-command-bar__end">
      {selecting && viewEl ? <Divider orientation="vertical" /> : null}
      {countEl}{statusEl}{keptEnd}{clearEl}
    </Toolbar.Group>
  ) : null;
  // Escape in the bar clears the selection (as "× N selected" does)
  const onKeyDown = selecting && sel.onClear ? (e) => { if (e.key === 'Escape' && !e.defaultPrevented && !e.target.closest('input, textarea, [role="menu"], [role="dialog"]')) { e.preventDefault(); sel.onClear(); } } : undefined;   // Escape in the search clears the text, not the selection (issue 454)
  const parts = <>{acts}{acts && findEl ? <Divider orientation="vertical" /> : null}{findEl}<Toolbar.Spacer />{viewEl}{tail}</>;
  const name = selecting ? (sel.label || fill(t.actions, { label: label || '' }).trim()) : label;
  return (
    <BarContext.Provider value={ctx}>
      <div ref={root} className={cx('plx-command-bar', ctx.iconOnly && 'plx-command-bar--icons', selecting && 'plx-command-bar--selecting', className)} data-plx-layout={shape} data-plx-position={sticky === true ? 'sticky' : sticky === false ? 'static' : 'auto'} onKeyDown={onKeyDown}>
        <div className="plx-command-bar__bar">
          <Toolbar label={name} variant="bar" className="plx-command-bar__row" data-plx-bar-row="" data-plx-fit-shrink={step >= SEARCH + folds || undefined}>{parts}</Toolbar>
        </div>
        {React.isValidElement(selection) ? selection : null}
      </div>
    </BarContext.Provider>
  );
}
