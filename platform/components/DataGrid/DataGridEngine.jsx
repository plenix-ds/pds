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
import { useUnread } from './unread.js';
import { GridPane } from './room.js';
import { flushSync } from 'react-dom';

import { useSortable } from '../../utils/dnd.ts';

import { gridPx } from '../../utils/grid.ts';

import { MenuItem, MenuDivider } from '../Menu/Menu.jsx';

import { opening, recordKey, valueAt } from './state.js';
import { createAdapter } from './adapter.js';

import { recordsOf } from './records.js';
import { useStrings, useLocale } from '../../providers/LocaleProvider.tsx';
import { formatNumber } from '../../utils/format.ts';
import { EMPTY_ROWS, GRID, kinds } from './engine/helpers.jsx';

import { useVirtualizer } from './engine/useVirtualizer.js';
import { useIntersection } from '../../hooks/useIntersection.ts';
import { useSelection, selectionActions } from './engine/useSelection.js';
import { useColumns } from './engine/useColumns.js';
import { useEditedRows, editActions, useEditEffect } from './engine/useEditing.js';
import { useSorting } from './engine/useSorting.js';
import { sortActions } from './engine/sortActions.js';
import { useGrouping } from './engine/useGrouping.js';
import { groupActions } from './engine/groupActions.js';
import { useRowModel } from './engine/useRowModel.js';
import { useViewSync } from './engine/useViewSync.js';
import { useCellRange } from './engine/useCellRange.js';
import { usePillWidths } from './engine/usePillWidths.js';
import { useGridMetrics } from './engine/useGridMetrics.js';
import { gridFrame } from './engine/gridFrame.jsx';
import { columnSizing } from './engine/columnSizing.js';
import { syncLive } from './engine/liveState.js';
import { useRemoteRows } from './engine/useRemoteRows.js';
import { useTableModel } from './engine/useTableModel.js';
import { bodyRows } from './engine/bodyRows.jsx';
import { headerRows } from './engine/headerRows.jsx';

import { makeFocusCell } from './engine/keys.js';
import { MemoGridRow } from './engine/parts.jsx';
// the cards the narrow card list draws at a time (issue 809, first step)
const CARD_CHUNK = 100;

function NextEngine(props) {
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
    narrowAt = '--plx-ref-size-600px',
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
  const S = useStrings('dataGrid', props.strings),
    initial = React.useMemo(() => opening(props), [storageKey]);
  const frame = React.useRef(null),
    holder = React.useRef(null),
    header = React.useRef(null),
    live = React.useRef({}),
    ready = React.useRef(false);
  const warnedActions = React.useRef(new Set()),
    viewportId = React.useId(),
    displayElements = React.useRef(new Map()),
    parkedFocus = React.useRef(null),
    printView = React.useRef(null);
  const deliveredReady = React.useRef(null);
  const listeners = React.useRef(new Map()),
    rowElements = React.useRef(new Map()),
    headerElements = React.useRef(new Map());

  const { setSorting, sortSignal, setSortOwner, sorting, sortingRef } = useSorting({ initial, props });
  const [rowHeight, setRowHeight] = React.useState(initial.rowHeight),
    [wrapHeaders, setWrapHeaders] = React.useState(initial.wrapHeaders);
  // Wrap text, per column (owner, 2026-10-24): the column's wrap prop or kind "wrap" is the default; the column menu turns it on or off
  // the cut cell under the pointer or focus ("rowId|field") and its popover (owner, 2026-10-24: a popover with the full text)
  const [cutAt, setCutAt] = React.useState(null),
    cutOpen = React.useRef(false);
  const [wrapColumns, setWrapColumns] = React.useState(() => props.wrapColumns || initial.wrapColumns || {});
  const wrapOf = (c) => (props.wrapColumns || wrapColumns)[c.field] ?? (c.wrap === true || kinds(c).includes('wrap'));
  const kindsOf = (c) => {
    const k = kinds(c).filter((x) => x !== 'wrap');
    return wrapOf(c) ? k.concat('wrap') : k;
  };
  const changeWrap = (next) => {
    setWrapColumns(next);
    props.onViewChange?.({ wrapColumns: next });
    props.onWrapColumnsChange?.(next);
    // wrapped text needs room: a Short grid moves to Medium (2 lines) when a column starts wrapping
    if (Object.values(next).some(Boolean) && !props.rowHeight && (effectiveStep || 'short') === 'short') {
      setRowHeight('medium');
      props.onViewChange?.({ rowHeight: 'medium' });
    }
  };
  const [filterField, setFilterField] = React.useState(null),
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
  const [filters, setFilters] = React.useState([]),
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
  const [metrics, setMetrics] = React.useState({ row: 0, line: 0, lead: 0, menu: 0, min: 0, space: 0, room: 0 }),
    [isNarrow, setNarrow] = React.useState(false);
  // One conversion per distinct width and measured environment, shared by every visible cell.
  const widthPixels = React.useMemo(() => {
    const cache = new Map();
    return (value) => {
      if (!cache.has(value)) cache.set(value, gridPx(value, { el: frame.current || document.documentElement }));
      return cache.get(value);
    };
  }, [metrics]);
  const effectiveStep = props.rowHeight || rowHeight,
    effectiveWrap = props.wrapHeaders ?? wrapHeaders;

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
  const { setEdited, editing, setEditing, mutations, pendingEdit, source } = useEditedRows(incoming);
  const canonical = React.useMemo(() => recordsOf(source, index, childField), [source, index, childField]);
  // TanStack tries a global filter against columns; the public predicate describes a record, so evaluate it once.
  const unreadKey = React.useCallback((record) => record[index], [index]);
  const [ownOpen, setOwnOpen] = React.useState(null);
  const unread = useUnread(canonical, unreadKey, props),
    [localUnreadOnly] = React.useState(false);
  const unreadOnly = props.unreadOnly ?? localUnreadOnly;
  const activeFilter = React.useMemo(
    () => (unreadOnly ? { keys: unread.keys, filter: deferredFilter } : deferredFilter),
    [unreadOnly, unread.keys, deferredFilter]
  );
  const rowMenu =
    unread.enabled && !isStatic
      ? (record) => [
          ...(typeof suppliedRowMenu === 'function' ? suppliedRowMenu(record) : suppliedRowMenu || []),
          {
            label: unread.has(record) ? S.markRead : S.markUnread,
            onSelect: () => unread.mark([record], !unread.has(record))
          }
        ]
      : suppliedRowMenu;
  const recordFilter = React.useMemo(() => {
    const results = new WeakMap();
    return (row) => {
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
  const { replaceData, updateRecord, commitEdit } = editActions({
    incoming,
    source,
    canonical,
    index,
    childField,
    props,
    setEdited,
    setEditing,
    mutations,
    pendingEdit
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
  const emit = (name, ...args) => {
    live.current.props.on?.[name]?.(...args);
    listeners.current.get(name)?.forEach((fn) => fn(...args));
  };
  const api = React.useMemo(() => createAdapter(live), []);
  api.getUnreadCount = () => unread.count;
  api.markRead = (keys) =>
    unread.mark(
      canonical.filter((record) => [].concat(keys).includes(record[index])),
      false
    );
  api.markUnread = (keys) =>
    unread.mark(
      canonical.filter((record) => [].concat(keys).includes(record[index])),
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
  const estimate = (row) =>
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
  const semanticRows = model.filter((row) => !row.__gap),
    semanticIndex = new Map(semanticRows.map((row, i) => [row.displayKey || row.id, i + 2]));
  const virtualItems = virtual.getVirtualItems(),
    first = virtualized ? virtualItems[0]?.index || 0 : 0,
    last = virtualized
      ? (virtualItems[virtualItems.length - 1]?.index ?? Math.min(model.length, 1) - 1) + 1
      : model.length;
  // the card list (narrow, not virtualized) draws in chunks (issue 809, first step): the first CARD_CHUNK cards, the next
  // CARD_CHUNK when the end nears the view (a sentinel after the last card), every card on End or a key past the end. A list
  // of CARD_CHUNK or fewer draws as before; remote rows keep their own loading; the counts come from the data, not the cards.
  const chunked = isNarrow && !virtualized && !isStatic && !printing && mode !== 'pages' && !remoteMode;
  const [cardLimit, setCardLimit] = React.useState(CARD_CHUNK);
  React.useEffect(() => { if (!chunked) setCardLimit(CARD_CHUNK); }, [chunked]);
  // only ever grows (a memoized row may hold an older cardLimit in its closure)
  const drawTo = (index) => { if (chunked) setCardLimit((n) => Math.max(n, Math.ceil((index + 1) / CARD_CHUNK) * CARD_CHUNK)); };
  const moreCards = chunked && model.length > cardLimit;
  const cardEnd = React.useRef(null);
  // the area to watch the end in: the grid's own scroll area when it scrolls, else the window (a grid that grows with the
  // page); read after each layout, so it follows the grid's height
  const [cardRoot, setCardRoot] = React.useState(null);
  React.useLayoutEffect(() => {
    if (!moreCards) return;
    const h = holder.current, next = h && h.scrollHeight > h.clientHeight + 1 ? holder : null;
    setCardRoot((was) => (was === next ? was : next));
  });
  // a fresh observer for each chunk (the root object is new per cardLimit), so its first report says whether the end is still
  // near after the cards just drawn: one chunk per report, never a run of chunks on a stale answer
  const cardWatch = React.useMemo(() => ({ current: cardRoot ? cardRoot.current : null }), [cardRoot, cardLimit]);   // eslint-disable-line react-hooks/exhaustive-deps
  const askedAt = React.useRef(0);
  useIntersection(cardEnd, { root: cardWatch, rootMargin: '--plx-ref-size-400px', disabled: !moreCards,
    onChange: (entry) => { if (entry.isIntersecting && askedAt.current !== cardLimit) { askedAt.current = cardLimit; setCardLimit((n) => n + CARD_CHUNK); } } });
  const shown = virtualized ? model.slice(first, last) : moreCards ? model.slice(0, cardLimit) : model;
  // after the drawn cards: the sentinel the end is watched by
  const cardMore = moreCards ? <div ref={cardEnd} className={B + '__card-more'} aria-hidden="true" /> : null;
  const frozen = new Set(columnPinning.left),
    ordered = table.getLeftVisibleLeafColumns().concat(table.getCenterVisibleLeafColumns());
  const pinStart = (column) => (selectable ? metrics.lead : 0) + column.getStart('left');
  // the selection column pins only beside an explicit frozen column (issue 679): nothing is pinned by default
  const leadFrozen = frozen.size > 0 && !isNarrow;
  const widths = Object.fromEntries(ordered.map((column) => [column.id, column.getSize()]));
  const listable = (column) => !column.rowHandle && !kinds(column).some((kind) => ['icon', 'actions'].includes(kind));
  const keys = keyColumns?.length
    ? keyColumns
    : columns
        .filter((c) => !kinds(c).some((k) => ['icon', 'actions'].includes(k)) && !c.rowHandle)
        .slice(0, 3)
        .map((c) => c.field);
  const listed = props.rowTemplate
    ? narrow !== 'table' && columns.some(listable)
    : narrow === 'auto'
      ? columns.some(listable)
      : narrow === 'list' && columns.some((column) => listable(column) && !keys.includes(column.field));
  const columnDnd = useSortable({
    items: ordered,
    getId: (column) => column.id,
    getName: (column) => column.columnDef.meta.title || column.id,
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
    metrics,
    cells,
    columns,
    effectiveWrap,
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
  const isOpen = (id) => openId != null && String(id) === String(openId),
    marked = (id) => !!selection[id] || (!selectable && !options.selectableRows && isOpen(id));
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
  const menuItems = (items, row, extra) =>
    items.map((item, i) => {
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
  const focusCell = makeFocusCell({ model, ordered, virtualized, virtual, displayElements, drawTo });

  const rememberRow = (row, node) => {
    const displayKey = row.displayKey || row.id,
      previous = displayElements.current.get(displayKey),
      active = document.activeElement;
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
      if (previous?.contains(active)) {
        const cell = active.closest('[data-plx-field]'),
          controls = cell ? [...cell.querySelectorAll('input,button,a[href],select,textarea')] : [];
        parkedFocus.current = {
          key: displayKey,
          field: cell?.getAttribute('data-plx-field'),
          control: controls.indexOf(active)
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
    chunked,
    cellRange,
    pickCheckbox,
    kindsOf,
    pinStart,
    leadFrozen,
    editing,
    cells,
    showTypes,
    setEditing,
    frame,
    pinnedAt,
    groupBy,
    keys,
    commitEdit,
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
  const renderRow = (row) =>
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
      .filter((row) => row.__group)
      .map((row) => row.__group),
    currentGroup = model[first]?.__group || priorGroups[priorGroups.length - 1];
  const stickyGroups = currentGroup
    ? priorGroups.filter(
        (group, i) =>
          group.path.every((part, depth) => JSON.stringify(part) === JSON.stringify(currentGroup.path[depth])) &&
          !priorGroups.slice(i + 1).some((next) => next.depth === group.depth)
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
          return loc.t('dataGrid.cardCount', { count: n, n: formatNumber(n) });
        })()
      : null;
  return gridFrame({
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
    cardMore,
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
}

export function DataGridEngine(props) {
  return <NextEngine key={props.storageKey || ''} {...props} />;
}

DataGridEngine.preload = () => Promise.resolve();
