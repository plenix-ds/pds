/* Plenix · DataGridEngine (TanStack)
   Summary: The React-owned renderer behind the public DataGrid and static Table.
   Usage: <DataGridEngine label="People" data={people} columns={columns} selectable />
   Props: label/data/columns/index, selection and view state, rowHeight/wrapHeaders, narrow layout, fill/pages/load-more,
     groupBy, tree/childrenField/treeColumn, editable columns, row menus, storageKey, fetchRows and loading/error state.
     onRowClick(record,event), onRowDoubleClick(record,event), onCellEdit(record,change) receive application records.
   Behavior: TanStack owns row models and column state; TanStack Virtual chooses the rendered window. Existing
     token-sized CSS gaps represent missing rows. An automatic viewport is bounded by its allocated pane as well as the browser. Opening saved state is supplied on the very first render. Search filtering is deferred so typing stays responsive;
     controlled sort state and the numeric text collator are reused across search updates.
   Notes: Own Plenix markup and stylesheet use the existing table tokens. Applications use the public DataGrid entry point.
     A part takes the grid's modes and its row's state as its own classes (zero overlap, data-grid.css): a record row
     __grid-row--narrow (the list) and --virtual (the drawn window); every cell of it __grid-cell--narrow, --sized (a row
     height step) and --lines (a step taller than short), the first after the checkbox --after-lead, a plain value
     directly inside --bare, a nested row's tree cell __tree-cell--level-N; a value __value--wrap, --sized and --lines;
     row actions sit in __portal--actions; the checkbox input is __check-input. The grid, the scroll body and the table
     take the fill and the drawn window as __grid--fill, __grid-tableholder--fill, __grid-table--virtual and --narrow.
     A group's head is __group-head--gap after a band (not in its sticky copy), its label __group-label--level-N, its
     cells --narrow in the list, the add row's cell __group-cell--add; the eyebrow is the grid's own span. A custom cell's
     own element takes __cell-content (a link alone in a cell fills it); a data cell (kind data, type bytes) is
     __grid-cell--data, the data role in Mono. Table (isStatic) marks its parts --static: the root, grid, header, headers, columns, their
     contents and titles, the body, the table, rows, cells, values and the placeholder. */
import React from 'react';
import { useUnread } from './unread.ts';
import { GridPane } from './room.ts';
import { flushSync } from 'react-dom';

import { useSortable } from '../../utils/dnd.ts';

import { gridPx } from '../../utils/grid.ts';

import { MenuItem, MenuDivider } from '../Menu/Menu.tsx';

import { opening, recordKey, valueAt } from './state.ts';
import { valueText } from './cells.tsx';
import { createAdapter } from './adapter.ts';

import { recordsOf } from './records.ts';
import { useStrings, useLocale } from '../../providers/LocaleProvider.tsx';
import { formatNumber } from '../../utils/format.ts';
import { announce } from '../../utils/announce.tsx';
import { EMPTY_ROWS, GRID, kinds } from './engine/helpers.tsx';

import { useVirtualizer } from './engine/useVirtualizer.ts';
import { observeElementRect, observeElementOffset, elementScroll, observeWindowRect, observeWindowOffset, windowScroll, defaultRangeExtractor } from '@tanstack/react-virtual';
import { useSelection, selectionActions } from './engine/useSelection.ts';
import { useColumns } from './engine/useColumns.ts';
import { useEditedRows, editActions, useEditEffect } from './engine/useEditing.ts';
import { useTableSettings } from '../../providers/TableSettings.tsx';
import { useSorting } from './engine/useSorting.ts';
import { sortActions } from './engine/sortActions.ts';
import { useGrouping } from './engine/useGrouping.ts';
import { groupActions } from './engine/groupActions.ts';
import { useRowModel } from './engine/useRowModel.ts';
import { useViewSync } from './engine/useViewSync.ts';
import { useCellRange } from './engine/useCellRange.ts';
import { usePillWidths } from './engine/usePillWidths.ts';
import { useGridMetrics } from './engine/useGridMetrics.ts';
import { gridFrame } from './engine/gridFrame.tsx';
const LazyFormEdit = React.lazy(() => import('./engine/formEdit.tsx'));
import { columnSizing } from './engine/columnSizing.ts';
import { syncLive } from './engine/liveState.ts';
import { useRemoteRows } from './engine/useRemoteRows.ts';
import { useTableModel } from './engine/useTableModel.ts';
import { bodyRows } from './engine/bodyRows.tsx';
import { headerRows } from './engine/headerRows.tsx';

import { makeFocusCell } from './engine/keys.ts';
import { MemoGridRow, PixelGap } from './engine/parts.tsx';
// a card list of more cards than this draws only the cards near the view (issue 809)
const CARD_ALL = 100;
// the cards drawn beyond each edge of the view in the long card list (issue 809)
const CARD_OVERSCAN = 6;

function NextEngine(rawProps: any) {
  // the editing options (ADR 0016): a TableSettings above supplies defaults, the table's own win; rangeSelect is the cellSelection option by its other name
  const tableDefaults = useTableSettings().editing,
    editingOptions = tableDefaults ? { ...tableDefaults, ...rawProps.editing } : rawProps.editing,
    props = editingOptions === rawProps.editing && !editingOptions?.rangeSelect ? rawProps : { ...rawProps, editing: editingOptions, cellSelection: rawProps.cellSelection ?? editingOptions?.rangeSelect };
  const inPane = React.useContext(GridPane);
  const {
    label,
    data = EMPTY_ROWS,
    columns,
    index = 'id',
    selectable = false,
    selected,
    keepHiddenSelection = true,
    onSelectionChange,
    options = {},
    mode = 'fill',
    height,
    narrow: requestedNarrow,
    narrowAt = '--plx-ref-size-150u',
    keyColumns,
    storageKey,
    isStatic = false,
    cells = 'text',
    headerMenu = true,
    typeIcons: typeIconsProp,
    density = 'compact',
    uniformPillWidths: _uniformPillWidths,
    rowMenu: suppliedRowMenu,
    rowMenuButton = true,
    columnMenu,
    onReady,
    on = {},
    className,
    empty,
    error,
    onRetry
  } = props;
  const showTypes = typeIconsProp ?? !isStatic; // the column type icons: a DataGrid's sort and filter cue, not a static Table's
  // a DataGrid is a table while its visible columns fit its measured width, else the row card list, in a SplitView too
  // (issue 679, owner priority 1; it replaces #168's table-in-a-pane default); narrow="table" keeps a fixed table, and a
  // static Table keeps its list below narrowAt
  const narrow = requestedNarrow === undefined ? (isStatic ? 'list' : 'auto') : requestedNarrow;
  // one block for both (issue 882, owner: one shared copy of the table and grid styles, replacing "each its own block" of
  // 2026-10-19): a static Table draws the grid's parts and marks its root plx-data-grid--static and plx-table
  const B = GRID;
  const loc = useLocale();
  const S: any = useStrings('dataGrid', props.strings),
    initial = React.useMemo(() => opening(props), [storageKey]);
  const frame = React.useRef<any>(null),
    holder = React.useRef<any>(null),
    header = React.useRef<any>(null),
    live = React.useRef<any>({}),
    ready = React.useRef(false);
  const warnedActions = React.useRef(new Set()),
    viewportId = React.useId(),
    displayElements = React.useRef(new Map()),
    parkedFocus = React.useRef<any>(null),
    printView = React.useRef<any>(null);
  const deliveredReady = React.useRef<any>(null);
  const listeners = React.useRef(new Map()),
    rowElements = React.useRef(new Map()),
    headerElements = React.useRef(new Map());

  const { setSorting, sortSignal, setSortOwner, sorting, sortingRef } = useSorting({ initial, props });
  const [rowHeight, setRowHeight] = React.useState(initial.rowHeight),
    [wrapHeaders, setWrapHeaders] = React.useState(initial.wrapHeaders);
  // Wrap text, per column (owner, 2026-10-24): the column's wrap prop or kind "wrap" is the default; the column menu turns it on or off
  // the cut cell under the pointer or focus ("rowId|field") and its popover (owner, 2026-10-24: a popover with the full text)
  const [cutAt, setCutAt] = React.useState<any>(null),
    cutOpen = React.useRef(false);
  const [wrapColumns, setWrapColumns] = React.useState<any>(() => props.wrapColumns || (initial as any).wrapColumns || {});
  const wrapOf = (c: any) => (props.wrapColumns || wrapColumns)[c.field] ?? (c.wrap === true || kinds(c).includes('wrap'));
  const kindsOf = (c: any) => {
    const k = kinds(c).filter((x) => x !== 'wrap');
    return wrapOf(c) ? k.concat('wrap') : k;
  };
  const changeWrap = (next: any) => {
    setWrapColumns(next);
    props.onViewChange?.({ wrapColumns: next });
    props.onWrapColumnsChange?.(next);
    // wrapped text needs room: a Short grid moves to Medium (2 lines) when a column starts wrapping
    if (Object.values(next).some(Boolean) && !props.rowHeight && (effectiveStep || 'short') === 'short') {
      setRowHeight('medium');
      props.onViewChange?.({ rowHeight: 'medium' });
    }
  };
  const [filterField, setFilterField] = React.useState<any>(null),
    [managing, setManaging] = React.useState(false);
  const [expanded, setExpanded] = React.useState(props.treeExpanded ?? false);

  const { setGroups, setGroupOwner, collapsed, setCollapsed, groupSignal, groupBy } = useGrouping({
    initial,
    props,
    options,
  });
  const [loaded, setLoaded] = React.useState(props.pageSize || 50),
    [printing, setPrinting] = React.useState(false);

  const childField = props.tree ? props.childrenField || 'children' : null;
  const [filters, setFilters] = React.useState<any>([]),
    [page, setPage] = React.useState(0),
    [pageSize, setPageSize] = React.useState(props.pageSize || 50);

  // a sort, filter, search or page size change starts again from page 1 in the same render as the change (issue 614), so
  // no request for the old page number with the new search or filter goes out first
  const resetBy = [sortSignal, props.filter, JSON.stringify(filters), props.search, pageSize],
    [resetSeen, setResetSeen] = React.useState(resetBy);
  if (resetBy.some((value, i) => !Object.is(value, resetSeen[i]))) {
    setResetSeen(resetBy);
    if (page !== 0) setPage(0);
  }
  const [rawMetrics, setMetrics] = React.useState<any>({ row: 0, line: 0, lead: 0, menu: 0, min: 0, space: 0, room: 0 }),
    [rowActions, setRowActions] = React.useState<{ inline: boolean; width: number }>({ inline: false, width: 0 }),
    [isNarrow, setNarrow] = React.useState(false);
  // the metrics the parts draw with: the row-menu column is as wide as the icons the row actions give while there is room (#800 AC-5, ADR 0022)
  const metrics = React.useMemo(() => (rowActions.inline ? { ...rawMetrics, menu: rowActions.width } : rawMetrics), [rawMetrics, rowActions]);
  // One conversion per distinct width and measured environment, shared by every visible cell.
  const widthPixels = React.useMemo(() => {
    const cache = new Map();
    return (value: any) => {
      if (!cache.has(value)) cache.set(value, gridPx(value, { el: frame.current || document.documentElement }));
      return cache.get(value);
    };
  }, [metrics]);
  const effectiveStep = props.rowHeight || rowHeight,
    effectiveWrap = props.wrapHeaders ?? wrapHeaders;
  // how the table edits (ADR 0016): the person's remembered choice, then the table's editMode, then the TableSettings above it, then Inline Edit;
  // the choice is offered in the view menu only when both ways are offered and a column can be edited
  const settings = useTableSettings(),
    editModes = (props.editModes ?? settings.editModes ?? ['inline']).filter((m: any) => m === 'inline' || m === 'form'),
    [editModeChoice, setEditMode] = React.useState(initial.editMode),
    canChoose = editModes.length > 1 && props.columns.some((c: any) => c.editor),
    editMode = props.onViewChange && editModes.includes(props.editMode) ? props.editMode : editModes.includes(editModeChoice) ? editModeChoice : editModes.includes(props.editMode ?? settings.editMode) ? props.editMode ?? settings.editMode : editModes[0] || 'inline',
    editMenu = { mode: editMode, modes: editModes, show: canChoose, set: setEditMode };
  // Form Edit (ADR 0016, #84 F2): in this mode an edit asked for on a cell opens the record in a form instead of the inline editor
  const [formKey, setFormKey] = React.useState<any>(null),
    formFrom = React.useRef<any>(null),
    beginEdit = (next: any) => {
      if (next && editMode === 'form' && canChoose) {
        formFrom.current = { key: next.key, field: next.field };
        if (props.openKey === undefined) setOwnOpen(next.key);   // the edited row is the open, marked row (design form-edit.md §4)
        setFormKey(next.key);
      } else setEditing(next);
    };

  const deferredFilter = React.useDeferredValue(props.filter);

  // rows from a server: a page at a time ("pages"), appended by Load more ("load-more"), or appended as the person scrolls
  // near the end ("fill", issue 522: one list, no page controls)
  const { fetching, remoteBusy, remote, remoteError, setRetry, remoteMode, scrollFill } = useRemoteRows({
    props,
    mode,
    page,
    pageSize,
    sorting,
    filters
  });
  const incoming = remoteMode ? remote?.rows || EMPTY_ROWS : data;
  const { setEdited, editing, setEditing, cellStatus, setCellStatus, mutations, pendingEdit, history, source } = useEditedRows(incoming);
  // what was typed in the editing cell, kept while its row is out of the virtual window and cleared when the edit ends
  const draftStore = React.useRef<any>(null);
  React.useEffect(() => {
    if (!editing) draftStore.current = null;
  }, [editing]);
  const canonical = React.useMemo(() => recordsOf(source, index, childField), [source, index, childField]);
  // TanStack tries a global filter against columns; the public predicate describes a record, so evaluate it once.
  const unreadKey = React.useCallback((record: any) => record[index], [index]);
  const [ownOpen, setOwnOpen] = React.useState<any>(null);
  const unread = useUnread(canonical, unreadKey, props),
    [localUnreadOnly] = React.useState(false);
  const unreadOnly = props.unreadOnly ?? localUnreadOnly;
  const activeFilter = React.useMemo(
    () => (unreadOnly ? { keys: unread.keys, filter: deferredFilter } : deferredFilter),
    [unreadOnly, unread.keys, deferredFilter]
  );
  const rowMenu =
    unread.enabled && !isStatic
      ? (record: any) => [
          ...(typeof suppliedRowMenu === 'function' ? suppliedRowMenu(record) : suppliedRowMenu || []),
          {
            label: unread.has(record) ? S.markRead : S.markUnread,
            onSelect: () => unread.mark([record], !unread.has(record))
          }
        ]
      : suppliedRowMenu;
  const recordFilter = React.useMemo(() => {
    const results = new WeakMap();
    return (row: any) => {
      const record = row.original;
      if (unreadOnly && !unread.has(record)) return false;
      if (typeof deferredFilter !== 'function') return true;
      if (!results.has(record)) results.set(record, !!deferredFilter(record));
      return results.get(record);
    };
  }, [deferredFilter, source, unreadOnly, unread.keys]);
  const recordPositions = React.useMemo(() => new Map(canonical.map((record, i) => [record, i])), [canonical]);
  const recordsByKey = React.useMemo(
    () => new Map(canonical.map((record) => [recordKey(record[index]), record])),
    [canonical, index]
  );
  const { replaceData, updateRecord, commitEdit, changeCells, commitCells, recordEdited, undo, redo } = editActions({
    incoming,
    source,
    canonical,
    index,
    childField,
    props,
    setEdited,
    setEditing,
    setCellStatus,
    S,
    mutations,
    pendingEdit,
    history
  });

  const { changeGroups, toggleGroup } = groupActions({
    setGroupOwner,
    groupSignal,
    setGroups,
    setCollapsed,
    props,
    live,
    S,
  });
  const emit = (name: any, ...args: any[]) => {
    live.current.props.on?.[name]?.(...args);
    listeners.current.get(name)?.forEach((fn: any) => fn(...args));
  };
  const api: any = React.useMemo(() => createAdapter(live), []);
  api.getUnreadCount = () => unread.count;
  api.markRead = (keys: any) =>
    unread.mark(
      canonical.filter((record) => ([] as any[]).concat(keys).includes(record[index])),
      false
    );
  api.markUnread = (keys: any) =>
    unread.mark(
      canonical.filter((record) => ([] as any[]).concat(keys).includes(record[index])),
      true
    );

  const {
    sizing,
    autoSizing,
    setAutoSizing,
    floors,
    setFloors,
    columnOrder,
    columnVisibility,
    resize,
    changeOrder,
    changeVisibility,
    move,
    pinnedAt,
    orderAt,
    columnPinning
  } = useColumns({ initial, props, columns, frame, live, emit, api });
  const { selection, notifySelection, pick, selectionInfo, selectionAnchor } = useSelection({
    selected,
    live,
    canonical,
    index,
    options,
    onSelectionChange,
    emit,
    api
  });

  const { changeSort } = sortActions({ sorting, setSortOwner, sortSignal, setSorting, setPage, props, emit });

  const { table } = useTableModel({
    columns,
    sortingRef,
    metrics,
    floors,
    autoSizing,
    frame,
    source,
    index,
    childField,
    setExpanded,
    printing,
    expanded,
    sorting,
    columnOrder,
    columnVisibility,
    sizing,
    filters,
    activeFilter,
    page,
    pageSize,
    selection,
    columnPinning,
    changeSort,
    options,
    notifySelection,
    live,
    changeVisibility,
    changeOrder,
    resize,
    setFilters,
    setPage,
    recordFilter,
    deferredFilter,
    remoteMode,
    remote,
    mode
  });
  const allRows = (printing ? table.getPrePaginationRowModel() : table.getRowModel()).rows;

  const { gridKey } = usePillWidths({ frame, cells, metrics, columns, allRows, showTypes });
  const virtualized = !isStatic && mode !== 'pages' && !isNarrow && !printing;
  const { loadedRows, groups, model } = useRowModel({
    mode,
    remoteMode,
    allRows,
    loaded,
    groupBy,
    columns,
    printing,
    collapsed,
    props,
  });
  const estimate = (row: any) =>
    row?.__group
      ? metrics.group + metrics.line * (row.__group.separated ? 2 : 1)
      : row?.__gap
        ? metrics.groupGap
        : row?.__add
          ? metrics.add + metrics.line
          : metrics.row + metrics.line;
  const virtual = useVirtualizer({
    count: model.length,
    getScrollElement: () => holder.current,
    estimateSize: (i) => estimate(model[i]),
    getItemKey: (i) => model[i]?.displayKey || model[i]?.id,
    overscan: 4,
    enabled: virtualized && metrics.row > 0,
    initialRect: { width: 0, height: 0 },
    initialOffset: () => printView.current?.top ?? holder.current?.scrollTop ?? 0
  });
  const semanticRows = model.filter((row: any) => !row.__gap),
    semanticIndex = new Map(semanticRows.map((row: any, i: any) => [row.displayKey || row.id, i + 2]));
  const virtualItems = virtual.getVirtualItems(),
    first = virtualized ? virtualItems[0]?.index || 0 : 0,
    last = virtualized
      ? (virtualItems[virtualItems.length - 1]?.index ?? Math.min(model.length, 1) - 1) + 1
      : model.length;
  // the card list (narrow, issue 809): a list of more than CARD_ALL cards draws only the cards near the view, each measured
  // (its own height: lines that wrap, an open row), with a spacer of whole pixels before and after them as tall as the
  // cards they stand for. The list scrolls in the grid's own scroll area when that scrolls, else with the page. A list of
  // CARD_ALL or fewer draws every card, as before; printing and the pages mode draw every card; remote rows keep their own
  // loading. The counts and selection come from the data, not the drawn cards.
  const cardList = isNarrow && !virtualized && !isStatic && !printing && mode !== 'pages' && !remoteMode;
  const cardsVirtual = cardList && model.length > CARD_ALL;
  // where the list scrolls: the grid's own scroll area when it scrolls, else the window; and where the list starts in it
  const [cardScroller, setCardScroller] = React.useState('holder');
  const [cardTop, setCardTop] = React.useState(0);
  // the estimate for a card not measured yet: the most common measured height (most cards of a list share one)
  const cardSizes = React.useRef(new Map());
  const cardEstimate = () => {
    let best = 0, seen = 0;
    cardSizes.current.forEach((count, size) => { if (count > seen) { seen = count; best = size; } });
    // before any card is measured: two rows, and never 0, so the first layout already holds the whole list's height (the
    // grid measures the room under its body against it)
    return best || Math.max(1, metrics.row * 2 + metrics.line);
  };
  const windowed = cardScroller === 'window';
  // the card that has focus stays drawn wherever the list scrolls (Home, a scroll by the wheel), so focus is never lost
  const cardFocus = React.useRef<any>(null);   // the focused card's key
  // and the headers of the group the view is in (each level) stay drawn, so they stay stuck at the top as their rows scroll,
  // exactly as when every card was drawn
  const cardHeads = React.useMemo(() => (cardsVirtual ? model.map((row: any, i: any) => (row.__group ? [i, row.__group.depth] : null)).filter(Boolean) : []), [cardsVirtual, model]);
  const cardRange = (range: any) => {
    const out = defaultRangeExtractor(range), at = cardFocus.current == null ? undefined : cardIndex.current.get(cardFocus.current);
    const add = (i: any) => { if (i !== undefined && i >= 0 && i < model.length && !out.includes(i)) out.push(i); };
    add(at);
    // the nearest header before the view at each level, going up the levels
    let depth = Infinity;
    for (let k = cardHeads.length - 1; k >= 0 && depth > 0; k -= 1) {
      const [i, d] = cardHeads[k];
      if (i <= range.startIndex && d < depth) { add(i); depth = d; }
    }
    out.sort((a, b) => a - b);
    return out;
  };
  const cardVirtual = useVirtualizer({
    count: cardsVirtual ? model.length : 0,
    getScrollElement: () => (windowed ? window as any : holder.current),
    observeElementRect: (windowed ? observeWindowRect : observeElementRect) as any,
    observeElementOffset: (windowed ? observeWindowOffset : observeElementOffset) as any,
    scrollToFn: (windowed ? windowScroll : elementScroll) as any,
    estimateSize: cardEstimate,
    getItemKey: (i) => model[i]?.displayKey || model[i]?.id,
    scrollMargin: cardTop,
    rangeExtractor: cardRange,
    overscan: CARD_OVERSCAN,
    enabled: cardsVirtual,
    redrawOnSize: true,
    initialRect: { width: 0, height: 0 }
  });
  React.useLayoutEffect(() => {
    if (!cardsVirtual) return;
    const h = holder.current, table = h && h.querySelector(':scope .' + B + '__grid-table');
    if (!h || !table) return;
    const scrolls = h.scrollHeight > h.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(h).overflowY);
    const next = scrolls ? 'holder' : 'window';
    if (next !== cardScroller) { setCardScroller(next); return; }
    const top = Math.round(table.getBoundingClientRect().top + (scrolls ? h.scrollTop - h.getBoundingClientRect().top : window.scrollY));
    if (top !== cardTop) setCardTop(top);
  });
  // each drawn card is measured as it is drawn and whenever its size changes (an open row, a wrap): whole pixels
  const cardIndex = React.useRef(new Map());
  if (cardsVirtual) cardIndex.current = new Map(model.map((row: any, i: any) => [row.displayKey || row.id, i]));
  const cardObserver = React.useRef<any>(null);
  const cardKeyOf = React.useRef(new WeakMap());
  const cardMeasured = React.useRef(new Map());   // a card's key -> its last measured height
  const measureCard = (node: any) => {
    const key = cardKeyOf.current.get(node), index = cardIndex.current.get(key);
    if (index === undefined) return;
    const size = Math.round(node.getBoundingClientRect().height), last = cardMeasured.current.get(key);
    if (!size || size === last) return;
    if (last) cardSizes.current.set(last, cardSizes.current.get(last) - 1);
    cardSizes.current.set(size, (cardSizes.current.get(size) || 0) + 1);
    cardMeasured.current.set(key, size);
    cardVirtual.resizeItem(index, size);
  };
  const watchCard = (row: any, node: any, previous: any) => {
    if (!cardsVirtual || typeof ResizeObserver === 'undefined') return;
    if (!cardObserver.current) cardObserver.current = new ResizeObserver((entries) => entries.forEach((e) => measureCard(e.target)));
    if (previous && previous !== node) cardObserver.current.unobserve(previous);
    if (node) { cardKeyOf.current.set(node, row.displayKey || row.id); cardObserver.current.observe(node); measureCard(node); }
  };
  React.useEffect(() => () => cardObserver.current?.disconnect(), []);
  React.useEffect(() => {
    const h = holder.current;
    if (!cardsVirtual || !h) return undefined;
    const onFocus = (e: any) => {
      const card = e.target.closest && e.target.closest('.' + B + '__grid-row');
      const key = card ? cardKeyOf.current.get(card) : undefined;
      if (key !== undefined) cardFocus.current = key;
    };
    const onBlur = (e: any) => { if (!h.contains(e.relatedTarget)) cardFocus.current = null; };
    h.addEventListener('focusin', onFocus);
    h.addEventListener('focusout', onBlur);
    return () => { h.removeEventListener('focusin', onFocus); h.removeEventListener('focusout', onBlur); };
  }, [cardsVirtual, B]);
  // the drawn cards (the window and the focused card), each preceded by the space for the cards before it not drawn
  const cardItems = cardsVirtual ? cardVirtual.getVirtualItems() : [];
  const shown = virtualized ? model.slice(first, last) : cardsVirtual ? cardItems.map((item) => model[item.index]).filter(Boolean) : model;
  const cardGaps = new Map();   // a drawn card's key -> the pixels of space before it
  let cardEnd = cardTop;
  cardItems.forEach((item) => { const row = model[item.index]; if (row) cardGaps.set(row.displayKey || row.id, item.start - cardEnd); cardEnd = item.end; });
  // the space after the last drawn card; before the first cards are known (no view size yet), the whole list's height
  const cardAfter = cardsVirtual ? <PixelGap px={cardVirtual.getTotalSize() + cardTop - cardEnd} /> : null;
  const frozen = new Set(columnPinning.left),
    ordered = table.getLeftVisibleLeafColumns().concat(table.getCenterVisibleLeafColumns());
  const pinStart = (column: any) => (selectable ? metrics.lead : 0) + column.getStart('left');
  // the selection column pins only beside an explicit frozen column (issue 679): nothing is pinned by default
  const leadFrozen = frozen.size > 0 && !isNarrow;
  const widths = Object.fromEntries(ordered.map((column) => [column.id, column.getSize()]));
  const listable = (column: any) => !column.rowHandle && !kinds(column).some((kind) => ['icon', 'actions'].includes(kind));
  const keys = keyColumns?.length
    ? keyColumns
    : columns
        .filter((c: any) => !kinds(c).some((k) => ['icon', 'actions'].includes(k)) && !c.rowHandle)
        .slice(0, 3)
        .map((c: any) => c.field);
  const listed = props.rowTemplate
    ? narrow !== 'table' && columns.some(listable)
    : narrow === 'auto'
      ? columns.some(listable)
      : narrow === 'list' && columns.some((column: any) => listable(column) && !keys.includes(column.field));
  const columnDnd = useSortable({
    items: ordered,
    getId: (column) => column.id,
    getName: (column) => (column.columnDef.meta as any).title || column.id,
    label: S.columnsLabel.replace('{label}', label),
    orientation: 'horizontal',
    disabled: !(props.movableColumns ?? options.movableColumns),
    onReorder: (next, { item }) => {
      changeOrder(next.map((column) => column.id));
      emit(
        'columnMoved',
        api.column(item.id),
        next.map((column) => api.column(column.id))
      );
    }
  });
  const rowDnd = useSortable({
    items: canonical,
    getId: (record) => recordKey(record[index]),
    getName: (record) => String(valueAt(record, columns[0]?.field) ?? record[index]),
    label: S.rowsLabel.replace('{label}', label),
    disabled: !(props.movableRows ?? options.movableRows) || !!groupBy || !!childField,
    onReorder: (rows, { item }) => {
      setEdited({ input: incoming, rows });
      props.onRowMove?.(rows);
      emit('rowMoved', api.row(recordKey(item[index])));
    }
  });

  syncLive({
    live,
    props,
    frame,
    index,
    canonical,
    source,
    recordsByKey,
    replaceData,
    model,
    groups,
    groupBy,
    changeGroups,
    toggleGroup,
    collapsed,
    updateRecord,
    commitEdit,
    editing,
    setEditing,
    childField,
    expanded,
    setExpanded,
    columns,
    table,
    selection,
    sorting,
    changeSort,
    resize,
    move,
    pick,
    setPage,
    page,
    pageSize,
    setPageSize,
    virtual,
    rowElements,
    headerElements,
    listeners
  });

  useGridMetrics({
    frame,
    metrics: rawMetrics,
    setRowActions,
    cells,
    columns,
    effectiveWrap,
    editMenu,
    showTypes,
    isStatic,
    headerMenu,
    source,
    selectable,
    rowMenu,
    rowMenuButton,
    props,
    setAutoSizing,
    setFloors,
    setMetrics,
    live,
    narrow,
    narrowAt,
    listed,
    setNarrow,
    height,
    mode,
    holder,
    inPane,
    effectiveStep,
    keys,
    autoSizing,
    sizing,
    columnVisibility,
    virtual,
    model,
    collapsed
  });
  useViewSync({
    metrics,
    autoSizing,
    ready,
    api,
    options,
    deliveredReady,
    onReady,
    emit,
    props,
    storageKey,
    sorting,
    columnOrder,
    columnVisibility,
    sizing,
    effectiveStep,
    effectiveWrap,
    editMenu,
    wrapColumns,
    groupBy,
    collapsed,
    groupSignal,
    table,
    selection,
    canonical,
    index,
    keepHiddenSelection,
    notifySelection,
    selectionInfo,
    onSelectionChange,
    filters,
    deferredFilter,
    source
  });
  React.useEffect(() => {
    setLoaded(pageSize);
  }, [sortSignal, props.filter, JSON.stringify(filters), props.search, pageSize]);
  React.useEffect(() => {
    const before = () => {
        const el = holder.current;
        printView.current = el ? { top: el.scrollTop, left: el.scrollLeft, max: el.style.maxBlockSize } : null;
        if (el) el.style.removeProperty('max-block-size');
        flushSync(() => setPrinting(true));
      },
      after = () => {
        setPrinting(false);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            const el = holder.current,
              saved = printView.current;
            if (el && saved) {
              if (saved.max) el.style.maxBlockSize = gridPx(parseFloat(saved.max), { el });
              else el.style.removeProperty('max-block-size');
              virtual.scrollToOffset(saved.top);
              el.scrollLeft = saved.left;
              printView.current = null;
            }
          })
        );
      };
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
    };
  }, []);

  const displayedTotal = remoteMode ? remote?.total || 0 : table.getFilteredRowModel().rows.length;
  // fill with a server (issue 522): the next page is asked for when the scroll comes within 8 rows of the end, and again
  // while the rows do not yet fill the room; never while one is on its way, after a failure (Retry asks again) or at the total
  const nearEnd = React.useCallback(() => {
    const el = holder.current;
    if (!scrollFill || !el || fetching.current || remoteError || !remote) return;
    if ((remote.rows || []).length >= (remote.total || 0)) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight <= Math.max(1, metrics.row) * 8) {
      fetching.current = true;
      setPage((n) => n + 1);
    }
  }, [scrollFill, remote, remoteError, metrics.row]);
  React.useEffect(() => {
    const el = holder.current;
    if (!scrollFill || !el) return undefined;
    nearEnd();
    el.addEventListener('scroll', nearEnd, { passive: true });
    return () => el.removeEventListener('scroll', nearEnd);
  }, [scrollFill, nearEnd]);
  // the open row (#453): the record whose details show, the row last opened by a click or Enter, or openKey (null: none);
  // it is aria-current, and in a grid without selection it takes the selected look (with selection, opening selects it)
  const openId = props.openKey !== undefined ? (props.openKey == null ? null : recordKey(props.openKey)) : ownOpen;
  const isOpen = (id: any) => openId != null && String(id) === String(openId),
    marked = (id: any) => !!selection[id] || (!selectable && !options.selectableRows && isOpen(id));
  const { selectedVisible, allVisible, selectAll, pickCheckbox, chooseRow } = selectionActions({
    table,
    live,
    selection,
    selectionAnchor,
    pick,
    selectable,
    options
  });

  const { fit, startResize } = columnSizing({ columns, frame, source, resize, metrics, table, B });
  const menuItems = (items: any, row: any, extra: any) =>
    items.map((item: any, i: any) => {
      if (
        !item.separator &&
        !item.disabled &&
        typeof (item.onSelect || item.action) !== 'function' &&
        Object.prototype.hasOwnProperty.call(React.createElement('span'), '_store') &&
        !warnedActions.current.has(item.label)
      ) {
        warnedActions.current.add(item.label);
        console.warn('DataGrid: missing action handler for ' + item.label);
      }
      return item.separator ? (
        <MenuDivider key={i} />
      ) : (
        <MenuItem
          key={i}
          icon={item.icon}
          danger={item.danger}
          disabled={typeof item.disabled === 'function' ? item.disabled(row) : item.disabled}
          onSelect={() => {
            (item.onSelect || item.action)?.(row, extra);
          }}
        >
          {item.label}
        </MenuItem>
      );
    });

  const { chooserColumns, headerCell } = headerRows({
    groupBy,
    columnMenu,
    S,
    menuItems,
    api,
    props,
    setFilterField,
    changeGroups,
    wrapOf,
    changeWrap,
    wrapColumns,
    fit,
    table,
    frozen,
    setManaging,
    orderAt,
    filterField,
    pinStart,
    columnDnd,
    ordered,
    headerElements,
    widths,
    isStatic,
    B,
    selectable,
    effectiveWrap,
    editMenu,
    options,
    showTypes,
    headerMenu,
    startResize,
    resize
  });
  // cell range selection (the option cellSelection, off by default): the block of cells Shift and the arrows select, and its copy
  const cellRange = useCellRange({
    enabled: !!props.cellSelection && !isStatic,
    model,
    ordered,
    index,
    onChange: props.onCellSelectionChange,
    frame,
    scroller: holder,
  });
  live.current.cellRange = cellRange;
  const focusCell = makeFocusCell({ model, ordered, virtualized, virtual, displayElements, cards: cardsVirtual ? cardVirtual : null });

  const rememberRow = (row: any, node: any) => {
    const displayKey = row.displayKey || row.id,
      previous = displayElements.current.get(displayKey),
      active = document.activeElement;
    watchCard(row, node, previous);
    if (node) {
      displayElements.current.set(displayKey, node);
      rowElements.current.set(row.id, node);
      if (parkedFocus.current?.key === displayKey && active === holder.current) {
        const saved = parkedFocus.current;
        parkedFocus.current = null;
        requestAnimationFrame(() => {
          if (document.activeElement === holder.current) {
            const cell = saved.field ? node.querySelector('[data-plx-field="' + CSS.escape(saved.field) + '"]') : node;
            const control =
              saved.control >= 0 ? cell?.querySelectorAll('input,button,a[href],select,textarea')[saved.control] : null;
            (control || cell || holder.current)?.focus({ preventScroll: true });
          }
        });
      }
    } else {
      if (previous?.contains(active as any)) {
        const cell = (active as any).closest('[data-plx-field]'),
          controls = cell ? [...cell.querySelectorAll('input,button,a[href],select,textarea')] : [];
        parkedFocus.current = {
          key: displayKey,
          field: cell?.getAttribute('data-plx-field'),
          control: controls.indexOf(active as any)
        };
        holder.current?.focus({ preventScroll: true });
      }
      displayElements.current.delete(displayKey);
      if (rowElements.current.get(row.id) === previous) {
        const replacement = [...displayElements.current.values()].find((el) => el.dataset.plxRecord === row.id);
        if (replacement) rowElements.current.set(row.id, replacement);
        else rowElements.current.delete(row.id);
      }
    }
  };
  useEditEffect({ source, mutations, pendingEdit, emit, api });

  // Ctrl+V of a copied block (editing.paste, ADR 0021): the pieces land from the active cell or the selected block; each one goes through its
  // column's editor rules (can it be edited, is it a value of that type) and validate; the rest are skipped. One announcement gives the counts.
  const pasteBlock = async (text: string, rowId: any, field: any) => {
    const ops = await import('./engine/pasteOps.ts');
    const pieces = ops.plan({ table: ops.parseTable(text), rect: cellRange.rect, at: { r: model.findIndex((m: any) => m.id === rowId), c: ordered.findIndex((o: any) => o.id === field) }, rows: model, columns: ordered });
    const accepted: any[] = [];
    let skipped = 0;
    for (const piece of pieces) {
      const meta = piece.column.columnDef.meta, record = canonical.find((r: any) => recordKey(r[index]) === piece.row.id);
      const editable = !!meta.editor && (typeof meta.editable === 'function' ? meta.editable(api.cell(piece.row.id, meta.field)) : meta.editable !== false);
      const taken = editable && record ? ops.valueFor(meta, piece.text) : null;
      if (!taken || (meta.validate && (await meta.validate(taken.value, record)))) { skipped += 1; continue; }
      accepted.push({ key: piece.row.id, field: meta.field, value: taken.value });
    }
    const said = (key: string, n: number) => loc.t(key, { count: n, n: formatNumber(n) });
    if (accepted.length) announce([said('dataGrid.cellsPasted', accepted.length), skipped ? said('dataGrid.cellsSkipped', skipped) : ''].filter(Boolean).join(' '));
    else if (skipped) announce(said('dataGrid.cellsSkipped', skipped));
    if (!accepted.length) return;
    const refused = await changeCells(accepted, 'paste');
    if (refused) announce(said('dataGrid.cellsRefused', refused), { politeness: 'assertive' });
  };
  // Ctrl+D and the fill handle (editing.fill, ADR 0021): the pairs say which cell's value goes to which cell; each target goes through its column's
  // rules (can it be edited, validate); the rest are skipped. One announcement gives the counts; the cells are one undo step.
  const fillPairs = async (pairs: any[]) => {
    const accepted: any[] = [];
    let skipped = 0;
    for (const pair of pairs) {
      const meta = pair.to.column.columnDef.meta, from = canonical.find((r: any) => recordKey(r[index]) === pair.from.row.id), target = canonical.find((r: any) => recordKey(r[index]) === pair.to.row.id);
      const editable = !!meta.editor && (typeof meta.editable === 'function' ? meta.editable(api.cell(pair.to.row.id, meta.field)) : meta.editable !== false);
      const value = from ? valueAt(from, pair.from.column.columnDef.meta.field) : undefined;
      if (!editable || !target || (meta.validate && (await meta.validate(value, target)))) { skipped += 1; continue; }
      accepted.push({ key: pair.to.row.id, field: meta.field, value });
    }
    const said = (key: string, n: number) => loc.t(key, { count: n, n: formatNumber(n) });
    if (accepted.length) announce([said('dataGrid.cellsFilled', accepted.length), skipped ? said('dataGrid.cellsSkipped', skipped) : ''].filter(Boolean).join(' '));
    else if (skipped) announce(said('dataGrid.cellsSkipped', skipped));
    if (!accepted.length) return;
    const refused = await changeCells(accepted, 'fill');
    if (refused) announce(said('dataGrid.cellsRefused', refused), { politeness: 'assertive' });
  };
  const fillDown = async () => {
    if (!cellRange.rect) return;
    const ops = await import('./engine/pasteOps.ts');
    await fillPairs(ops.fillDown({ rect: cellRange.rect, rows: model, columns: ordered }));
  };
  const fillRight = async () => {
    if (!cellRange.rect) return;
    const ops = await import('./engine/pasteOps.ts');
    await fillPairs(ops.fillRight({ rect: cellRange.rect, rows: model, columns: ordered }));
  };
  // the handle on the block's bottom inline-end corner: dragged to a cell, it repeats the block down or toward the inline end, then the block covers what it filled
  const startFill = (event: any) => {
    const rect = cellRange.rect;
    if (!rect || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const cellAt = (e: any) => {
      const cell = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-plx-field]') as HTMLElement | null, row = cell?.closest('[data-plx-record]') as HTMLElement | null;
      if (!cell || !row) return null;
      const r = model.findIndex((m: any) => String(m.id) === row.getAttribute('data-plx-record')), c = ordered.findIndex((o: any) => o.id === cell.getAttribute('data-plx-field'));
      return r < 0 || c < 0 ? null : { r, c };
    };
    let drop: any = null;
    const move = (e: any) => { drop = cellAt(e) || drop; };
    const finish = async () => {
      window.removeEventListener('pointermove', move, true);
      window.removeEventListener('pointerup', finish, true);
      if (!drop) return;
      const ops = await import('./engine/pasteOps.ts');
      const { pairs, reach } = ops.fillTo({ rect, drop, rows: model, columns: ordered });
      if (!pairs.length || !reach) return;
      cellRange.select({ anchor: { key: model[reach.r0].id, field: ordered[reach.c0].id }, focus: { key: model[reach.r1].id, field: ordered[reach.c1].id } });
      await fillPairs(pairs);
    };
    window.addEventListener('pointermove', move, true);
    window.addEventListener('pointerup', finish, true);
  };
  const { groupNode, rowNode } = bodyRows({
    B,
    semanticIndex,
    S,
    collapsed,
    toggleGroup,
    model,
    virtual,
    holder,
    ordered,
    widths,
    selectable,
    metrics,
    rowActions,
    isNarrow,
    columns,
    cutOpen,
    setCutAt,
    table,
    wrapOf,
    props,
    api,
    isStatic,
    effectiveStep,
    options,
    recordPositions,
    rowDnd,
    unread,
    index,
    rememberRow,
    mode,
    page,
    pageSize,
    selection,
    isOpen,
    on,
    childField,
    marked,
    virtualized,
    chooseRow,
    emit,
    setOwnOpen,
    focusCell,
    cardList,
    cellRange,
    pickCheckbox,
    kindsOf,
    pinStart,
    leadFrozen,
    editing,
    cellStatus,
    setCellStatus,
    cells,
    showTypes,
    setEditing: beginEdit,
    formMode: editMode === 'form' && canChoose,
    draftStore,
    frame,
    pinnedAt,
    groupBy,
    keys,
    commitEdit,
    undoRedo: props.editing?.undo ? { undo, redo } : null,
    pasteBlock: props.editing?.paste ? pasteBlock : null,
    fill: props.editing?.fill && cellRange.enabled ? { down: fillDown, right: fillRight, start: startFill } : null,
    canonical,
    cutAt,
    rowMenu,
    rowMenuButton,
    menuItems
  });
  const rowVersion = React.useMemo(
    () => ({}),
    [
      cutAt,
      wrapColumns,
      unread.keys,
      unreadOnly,
      props,
      source,
      model,
      editing,
      cellStatus,
      metrics,
      autoSizing,
      sizing,
      columnOrder,
      columnVisibility,
      sorting,
      expanded,
      page,
      pageSize,
      isNarrow,
      collapsed,
      printing,
      filterField,
      groupBy,
      loaded,
      cellRange.rect
    ]
  );
  const renderRow = (row: any) =>
    row.original ? (
      <MemoGridRow
        key={row.displayKey || row.id}
        row={row}
        render={rowNode}
        selected={(selection[row.id] ? 1 : 0) + (isOpen(row.id) ? 2 : 0)}
        version={(props.movableRows ?? options.movableRows) ? {} : rowVersion}
      />
    ) : (
      rowNode(row)
    );
  const priorGroups = model
      .slice(0, first)
      .filter((row: any) => row.__group)
      .map((row: any) => row.__group),
    currentGroup = model[first]?.__group || priorGroups[priorGroups.length - 1];
  const stickyGroups = currentGroup
    ? priorGroups.filter(
        (group: any, i: any) =>
          group.path.every((part: any, depth: any) => JSON.stringify(part) === JSON.stringify(currentGroup.path[depth])) &&
          !priorGroups.slice(i + 1).some((next: any) => next.depth === group.depth)
      )
    : [];
  // a fill grid that already shows rows says a failed next page in its last row (with Retry), not over the table
  const moreFailed = scrollFill && remoteError && model.length > 0,
    failed = error || (moreFailed ? null : remoteError);
  // the bar over the template cards (issue 679): the select-all checkbox and the count of records
  const cardBar =
    isNarrow && props.rowTemplate && props.rowTemplate.layout !== 'wide'
      ? (() => {
          const n = remoteMode ? remote?.total || 0 : table.getFilteredRowModel().rows.length;
          // the words: strings.cardCount (an app names its records: "6 members"), else the catalog's; a plural object picks its
          // form by the locale's plural rules (an exact "=n" first, then the category, then other), a text is used as it is
          const words: any = S.cardCount, values = { count: n, n: formatNumber(n) };
          if (!words || typeof words !== 'object') return words ? String(words).replace(/\{n\}/g, values.n) : loc.t('dataGrid.cardCount', values);
          const form = words['=' + n] !== undefined ? words['=' + n] : words[loc.plural(n)] !== undefined ? words[loc.plural(n)] : words.other;
          return String(form).replace(/\{n\}/g, values.n);
        })()
      : null;
  const frameNode = gridFrame({
    cardBar,
    widthPixels,
    headerMenu,
    isStatic,
    managing,
    setManaging,
    chooserColumns,
    changeOrder,
    changeVisibility,
    frame,
    B,
    pinnedAt,
    listed,
    isNarrow,
    height,
    mode,
    className,
    cells,
    gridKey,
    density,
    virtualized,
    effectiveStep,
    effectiveWrap,
    editMenu,
    failed,
    S,
    onRetry,
    remoteError,
    setRetry,
    groups,
    childField,
    label,
    remoteMode,
    remoteBusy,
    semanticRows,
    remote,
    table,
    ordered,
    selectable,
    rowMenu,
    rowMenuButton,
    props,
    header,
    columnDnd,
    leadFrozen,
    allVisible,
    selectedVisible,
    selectAll,
    headerCell,
    setRowHeight,
    setWrapHeaders,
    metrics,
    viewportId,
    holder,
    focusCell,
    first,
    fetching,
    source,
    setPage,
    setLoaded,
    allRows,
    pageSize,
    rowDnd,
    stickyGroups,
    groupNode,
    model,
    shown,
    cardGaps,
    cardAfter,
    cardsVirtual,
    renderRow,
    last,
    empty,
    scrollFill,
    moreFailed,
    displayedTotal,
    page,
    setPageSize,
    loadedRows
  });
  const formRecord = formKey != null ? recordsByKey.get(formKey) : null;
  if (!formRecord) return frameNode;
  const formColumns = ordered.map((column) => column.columnDef.meta as any),
    nameColumn = formColumns.find((c: any) => c.kind === 'name') || formColumns[0];
  return (
    <>
      {frameNode}
      <React.Suspense fallback={null}>
        <LazyFormEdit
          record={formRecord}
          rowKey={formKey}
          columns={formColumns}
          isEditable={(c: any) => (typeof c.editable === 'function' ? c.editable(api.cell(formKey, c.field)) : c.editable !== false)}
          name={valueText(valueAt(formRecord, (nameColumn as any).field))}
          types={props.editing?.types ?? settings.editing?.types}
          surface={props.formSurface}
          renderForm={props.renderForm}
          openKey={props.openKey === undefined ? undefined : props.openKey == null ? null : recordKey(props.openKey)}
          onRecordEdit={props.onRecordEdit}
          commitEdit={commitEdit}
          commitCells={commitCells}
          recordEdited={recordEdited}
          onClose={() => {
            // focus goes back to the cell the edit began in (a drawer or dialog does it itself; the application's panel does not)
            const from = formFrom.current;
            setFormKey(null);
            if (from) focusCell(model.findIndex((r: any) => r.id === from.key), Math.max(0, ordered.findIndex((col) => (col.columnDef.meta as any).field === from.field)));
          }}
          S={S}
        />
      </React.Suspense>
    </>
  );
}

/** @public the engine takes DataGrid's props (DataGrid passes them through) */
export type DataGridEngineProps = import('./DataGrid.tsx').DataGridProps;
export function DataGridEngine(props: any) {
  return <NextEngine key={props.storageKey || ''} {...props} />;
}

DataGridEngine.preload = () => Promise.resolve();
