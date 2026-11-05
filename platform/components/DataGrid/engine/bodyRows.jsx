/* Plenix · DataGrid engine · body rows
   Summary: What the grid draws for each line of its body: a group row (its band, chevron, count and summaries; also the sticky copy),
     an add-to-group row, a gap between groups and a record's row with its cells (the editor, the tree control, the row-move menu,
     custom cells, the cut-text popover, frozen columns, units and alignment). Render functions over the engine's state, not
     components: one element tree, no extra React layer between the engine and the rows (the row's own memo is MemoGridRow).
   Usage:
     import { bodyRows } from './engine/bodyRows.jsx';
     const { groupNode, rowNode, enterCut, leaveCut, anyWrap } = bodyRows({ B, S, props, columns, ordered, selectable, isNarrow, ... });
   Props:
     The engine's values (the block class B, the strings S, props, the columns and their order, the selection, the editing and cut
       state, the metrics, the table, the api and the handlers); the call reads them in the render in which the rows are drawn.
       Returns groupNode(group, sticky), rowNode(row) (a group, add, gap or record row) and the cut-text helpers.
   Notes:
     Moved out of DataGridEngine.jsx without any change to the code (issue 714, the body): the parts were lines of the engine
     function, in the same order with the same values. The engine is documented in DataGridEngine.jsx.
*/
import React from 'react';
import { cx } from '../../../utils/cx.ts';
import { words, kinds, interactive, typeOf, typeIcons, cellDirection } from './helpers.jsx';
import { valueText, CellValue } from '../cells.jsx';
import { groupKeys, rowKeys, cellKeys } from './keys.js';
import { Width, RowTarget, Check, CellEditor, CellStatus, CustomCell, RowMenuContent } from './parts.jsx';
import { Icon } from '../../Icon/Icon.tsx';
import ChevronRightIcon from 'plenix-platform/icons/plenix/chevron-right';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';
import { formatNumber } from '../../../utils/format.ts';
import { Button } from '../../Button/Button.tsx';
import AddIcon from 'plenix-platform/icons/plenix/add';
import { valueAt } from '../state.js';
import { editorTurnedOn } from './useEditing.js';
import { Menu, MenuItem, ContextMenu } from '../../Menu/Menu.tsx';
import { DragHandle } from '../../DragHandle/DragHandle.tsx';
import { Popover } from '../../Popover/Popover.tsx';
import ExpandIcon from 'plenix-platform/icons/plenix/expand';
import MoreIcon from 'plenix-platform/icons/plenix/more';

export function bodyRows({
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
  menuItems,
}) {
  const groupNode = (group, sticky = false) => (
    <div
      key={group.id}
      data-plx-group={group.id}
      className={cx(
        '' + B + '__grid-row ' + B + '__grid-group',
        '' + B + '__grid-group-level-' + group.depth,
        group.separated && B + '__group--gap'
      )}
      role="row"
      tabIndex={0}
      aria-rowindex={semanticIndex.get(group.id)}
      aria-label={words(S.groupRow, {
        value: valueText(group.value) || S.noValue,
        count: group.rows.length,
        records: group.rows.length === 1 ? S.record : S.records,
      })}
      aria-level={group.depth + 1}
      aria-expanded={!collapsed.has(group.id)}
      onKeyDown={groupKeys({ toggleGroup, group, model, virtual, holder, B })}
    >
      <div
        className={cx(B + '__group-head', group.separated && !sticky && B + '__group-head--gap')}
        role="presentation"
      >
        {ordered.map((column, i) => (
          <Width
            key={column.id}
            width={widths[column.id] + (i === 0 && selectable ? metrics.lead : 0)}
            className={cx(
              B + '__group-cell',
              i === 0 && B + '__group-cell--first',
              column.columnDef.meta.summary && B + '__group-cell--summary',
              isNarrow && B + '__group-cell--narrow'
            )}
            role="gridcell"
            aria-colspan={i === 0 && selectable ? 2 : undefined}
          >
            {i === 0 ? (
              <div
                className={cx(
                  B + '__group-label',
                  group.depth >= 1 && group.depth <= 3 && B + '__group-label--level-' + group.depth
                )}
              >
                <span className={B + '__group-chevron'} aria-hidden="true" onClick={() => toggleGroup(group.id)}>
                  <Icon name={collapsed.has(group.id) ? ChevronRightIcon : ChevronDownIcon} />
                </span>
                <div className={B + '__group-text'}>
                  <span dir="auto" className={B + '__group-eyebrow'}>
                    {columns.find((c) => c.field === group.field)?.title || group.field}
                  </span>
                  <span
                    className={cx(
                      B + '__group-value',
                      kinds(columns.find((c) => c.field === group.field) || {}).includes('data') &&
                        B + '__group-value--data'
                    )}
                    data-plx-text-follow="size"
                    data-plx-kind={
                      kinds(columns.find((c) => c.field === group.field) || {}).includes('data') ? 'data' : undefined
                    }
                  >
                    {valueText(group.value) || S.noValue}
                  </span>
                </div>
                <span className={B + '__group-count'}>{formatNumber(group.rows.length)}</span>
              </div>
            ) : column.columnDef.meta.summary ? (
              <span className={B + '__group-summary'}>
                <span className={B + '__group-summary-name'}>
                  {
                    { sum: S.sum, count: S.countOf, average: S.average, min: S.min, max: S.max }[
                      column.columnDef.meta.summary
                    ]
                  }
                </span>
                <span className={B + '__group-summary-value'}>
                  {group.summary?.[column.columnDef.meta.field] == null
                    ? null
                    : formatNumber(group.summary[column.columnDef.meta.field])}
                </span>
              </span>
            ) : null}
          </Width>
        ))}
      </div>
    </div>
  );
  const enterCut = (event, id) => {
    if (cutOpen.current) return;
    const v = event.currentTarget.querySelector('.' + B + '__value');
    const cut = !!v && (v.scrollHeight > v.clientHeight + 1 || v.scrollWidth > v.clientWidth + 1);
    setCutAt(cut ? id : null);
  };
  const leaveCut = (id) => {
    if (!cutOpen.current) setCutAt((at) => (at === id ? null : at));
  };
  const anyWrap = table
    .getVisibleLeafColumns()
    .some((col) => col.columnDef.meta && col.columnDef.meta.field && wrapOf(col.columnDef.meta));
  const rowNode = (row) => {
    if (row.__group) return groupNode(row.__group);
    if (row.__add)
      return (
        <div key={row.id} className={B + '__add-row'} role="row" aria-rowindex={semanticIndex.get(row.id)}>
          <div
            role="gridcell"
            aria-colspan={ordered.length + (selectable ? 1 : 0)}
            className={cx(
              B + '__group-cell',
              B + '__group-cell--first',
              B + '__group-cell--add',
              isNarrow && B + '__group-cell--narrow'
            )}
          >
            <Button
              variant="ghost"
              size="xs"
              iconOnly
              icon={AddIcon}
              label={words(S.addTo, { value: valueText(row.__add.value) || S.noValue })}
              onClick={() => props.onAddToGroup(row.__add.value, row.__add.path)}
            />
          </div>
        </div>
      );
    if (row.__gap)
      return (
        <div key={row.id} className={B + '__group--gap'}>
          <div className={B + '__group-band'} />
        </div>
      );
    const rowApi = api.row(row.id),
      record = row.original;
    // a row template (issue 839): a card (A or B, narrow) draws only the columns that fill a slot, each placed in the card's grid; wide keeps every column of the table
    const tpl = props.rowTemplate,
      card = !!tpl && isNarrow && tpl.layout !== 'wide',
      slotted = !!tpl && (card || tpl.layout === 'wide'),
      cellList = card ? ordered.filter((column) => tpl.keep.has(column.id)) : ordered;
    const step = !isStatic && !isNarrow ? effectiveStep : undefined,
      sized = step != null,
      lines = sized && step !== 'short',
      modes = cx(
        isStatic && B + '__grid-cell--static',
        isNarrow && B + '__grid-cell--narrow',
        sized && B + '__grid-cell--sized',
        lines && B + '__grid-cell--lines'
      );
    const node = (
      <RowTarget
        key={row.displayKey || row.id}
        {...(!(props.movableRows ?? options.movableRows) || !recordPositions.has(record)
          ? null
          : rowDnd.itemProps(recordPositions.get(record)))}
        data-plx-unread={unread.has(record) || undefined}
        aria-label={
          unread.has(record)
            ? S.unreadRow.replace('{label}', String(valueAt(record, columns[0]?.field) ?? record[index]))
            : undefined
        }
        data-plx-record={row.id}
        onAttach={(node) => rememberRow(row, node)}
        role="row"
        aria-rowindex={(mode === 'pages' ? page * pageSize : 0) + (semanticIndex.get(row.displayKey || row.id) || 2)}
        aria-selected={selectable || options.selectableRows ? !!selection[row.id] : undefined}
        aria-current={isOpen(row.id) ? 'true' : undefined}
        tabIndex={props.onRowClick || on.rowClick || options.selectableRows ? 0 : undefined}
        aria-level={childField ? row.depth + 1 : undefined}
        aria-expanded={row.getCanExpand?.() ? row.getIsExpanded() : undefined}
        className={cx(
          '' + B + '__grid-row',
          (selectable || options.selectableRows || props.onRowClick || on.rowClick) && B + '__grid-selectable',
          childField && '' + B + '__grid-tree-level-' + Math.min(12, row.depth),
          marked(row.id) && '' + B + '__grid-selected',
          isStatic && B + '__grid-row--static',
          anyWrap && !isNarrow && (isStatic || (effectiveStep || 'short') !== 'short') && B + '__grid-row--wrap',
          isNarrow && B + '__grid-row--narrow',
          card && B + '__grid-row--template ' + B + '__grid-row--template-' + tpl.layout.toLowerCase(),
          slotted && !card && B + '__grid-row--template-wide',
          virtualized && B + '__grid-row--virtual',
          row === model[0] && B + '__grid-row--first'
        )}
        onClick={(e) => {
          if (e.target.closest(interactive)) return;
          chooseRow(row, e);
          emit('rowClick', e, rowApi);
          props.onRowClick?.(record, e);
          if (props.onRowClick || on.rowClick) {
            unread.open(record);
            setOwnOpen(row.id);
          }
        }}
        onDoubleClick={(e) => {
          if (!e.target.closest(interactive)) {
            props.onRowDoubleClick?.(record, e);
            emit('rowDblClick', e, rowApi);
          }
        }}
        onKeyDown={rowKeys({ chooseRow, row, emit, rowApi, props, record, on, unread, setOwnOpen, focusCell, model, cardList })}
      >
        {selectable ? (
          <div
            className={cx(
              `${B}__grid-cell ${B}__grid-row-header ${B}__w-lead`,
              card && B + '__grid-cell--template-check ' + B + '__grid-cell--card',
              leadFrozen && B + '__grid-frozen',
              modes,
              selection[row.id] && B + '__grid-cell--selected-start'
            )}
            role="gridcell"
          >
            <Check
              label={S.selectRow + ' ' + record[index]}
              card={card}
              checked={selection[row.id]}
              onChange={(e) => pickCheckbox(row, e)}
            />
          </div>
        ) : null}
        {cellList.map((column) => {
          const focusAfterEdit = (from, fromColumn, move) => {
            // the cell keeps the focus after an edit; Tab / Shift+Tab (move = 1 / -1) go on to the next / previous editable cell, row by row
            let r = model.indexOf(from),
              col = ordered.indexOf(fromColumn),
              target = null;
            while (move && !target) {
              col += move;
              if (col >= ordered.length || col < 0) {
                r += move;
                col = move > 0 ? 0 : ordered.length - 1;
              }
              const next = model[r];
              if (!next) break;
              if (!next.original) continue;
              const nc = ordered[col].columnDef.meta;
              if (nc?.editor && (typeof nc.editable === 'function' ? nc.editable(api.cell(next.id, nc.field)) : nc.editable !== false)) target = { r, col };
            }
            focusCell(target ? target.r : model.indexOf(from), target ? target.col : ordered.indexOf(fromColumn), move || 1);
          };
          const c = column.columnDef.meta,
            k = kindsOf(c),
            pinned = column.getIsPinned() === 'left',
            sticky = pinned ? pinStart(column) : 0;
          const cell = api.cell(row.id, c.field),
            status = cellStatus?.key === row.id && cellStatus.field === c.field ? cellStatus : null,
            // the checkbox editor (ADR 0016) is an option the application turns on: the cell shows a box and Space or a click toggles and saves, no editor opens
            turnedOn = editorTurnedOn(c, props.editing?.types),
            checkboxEditor = turnedOn && c.editor === 'checkbox',
            editable = !!c.editor && (typeof c.editable === 'function' ? c.editable(cell) : c.editable !== false),
            canToggle = checkboxEditor && editable && status?.kind !== 'saving',
            canEdit = !checkboxEditor && editable && status?.kind !== 'saving';
          const value = valueAt(record, c.field),
            isTree = !!childField && c.field === (props.treeColumn || columns[0]?.field),
            isEditing = editing?.key === row.id && editing.field === c.field,
            handled = c.rowHandle && (recordPositions.get(record) ?? -1) >= 0,
            actions = k.includes('actions');
          // in the row card (narrow, #679) every visible field that is not a key value shows as a labeled detail
          // the plain card (no template): every field that is not a key value; the default template card: the fields no slot took, as labeled details under its last line
          const detail =
            isNarrow &&
            (tpl ? card && tpl.implicit && !tpl.slotOf[c.field] : !keys.includes(c.field)) &&
            !actions &&
            !c.rowHandle &&
            !k.includes('icon');
          const mods =
              cx(
                isStatic && B + '__value--static',
                k.includes('wrap') && B + '__value--wrap',
                sized && B + '__value--sized',
                lines && k.includes('wrap') && B + '__value--lines',
                isNarrow && B + '__value--narrow'
              ) || undefined,
            shown = CellValue({
              block: B,
              column: c,
              value,
              strings: S,
              record,
              pill: cells === 'pill',
              pillField: c.field,
              icon: showTypes && typeOf(c) !== 'text' ? typeIcons[typeOf(c)] : undefined,
              mods,
            }); // a pill carries a type icon only when it says something (a date, a number)
          // a cell inside the selected block (the option cellSelection): its place in the block, null outside it or without the option
          const inRange = cellRange.rect ? cellRange.cellClasses(cellRange.rowAt.get(row.id), ordered.indexOf(column)) : null;
          const bare =
            !isEditing &&
            !handled &&
            !c.render &&
            !actions &&
            !(pinned && !isStatic) &&
            React.isValidElement(shown) &&
            shown.type === 'span' &&
            String(shown.props.className)
              .split(' ')
              .includes(B + '__value');
          return (
            <Width
              key={c.field}
              width={isNarrow ? null : widths[c.field]}
              frozenOffset={pinned && !isNarrow ? sticky : undefined}
              role={isStatic ? (c.rowLabel ? 'rowheader' : 'cell') : 'gridcell'}
              tabIndex={isStatic ? undefined : -1}
              data-plx-field={c.field}
              data-plx-unread={unread.has(record) || undefined}
              {...(!isStatic && !c.render && !actions && !isEditing
                ? {
                    onPointerEnter: (e) => enterCut(e, row.id + '|' + c.field),
                    onFocus: (e) => enterCut(e, row.id + '|' + c.field),
                    onPointerLeave: () => leaveCut(row.id + '|' + c.field),
                  }
                : null)}
              aria-selected={inRange ? true : undefined}
              onMouseDown={cellRange.enabled ? (e) => { if (!e.target.closest(interactive)) cellRange.press({ e, row, c, focusCell }); } : undefined}
              // a card's lines line up at the card's start edge in both directions (#679), so a card cell takes the grid's
              // direction; a table cell keeps its value's own direction (dir="auto")
              dir={(pinned && !isStatic) || kinds(c).includes('id') || isNarrow ? undefined : 'auto'}
              onDoubleClick={() => {
                if (canEdit) setEditing({ key: row.id, field: c.field, value });
              }}
              onKeyDown={cellKeys({
                isStatic,
                value,
                canEdit,
                toggle: canToggle ? () => commitEdit(row.id, c.field, !value) : null,
                setEditing,
                row,
                c,
                model,
                ordered,
                column,
                frame,
                focusCell,
                cardList,
                cellRange,
                kept: card ? tpl.keep : undefined,
              })}
              data-plx-sticky={pinned && sticky ? sticky + 'px' : undefined}
              data-plx-label={detail ? c.title || c.field : undefined}
              aria-busy={status?.kind === 'saving' ? 'true' : undefined}
              aria-readonly={checkboxEditor && !editable ? 'true' : undefined}
              aria-describedby={status?.kind === 'refused' ? status.id : undefined}
              aria-invalid={status?.kind === 'refused' ? 'true' : undefined}
              aria-label={detail ? (c.title || c.field) + ': ' + valueText(value) : undefined}
              data-plx-text-follow={c.rowLabel || columns.indexOf(c) <= pinnedAt ? 'size family weight' : 'size family'}
              className={cx(
                '' + B + '__grid-cell',
                modes,
                !selectable && marked(row.id) && cellList.indexOf(column) === 0 && B + '__grid-cell--selected-start',
                bare && B + '__grid-cell--bare',
                selectable && cellList.indexOf(column) === 0 && B + '__grid-cell--after-lead',
                cellList.indexOf(column) > 0 &&
                  cellList[cellList.indexOf(column) - 1].getIsPinned() === 'left' &&
                  column.getIsPinned() !== 'left' &&
                  B + '__grid-cell--after-frozen',
                isTree && row.depth > 0 && B + '__tree-cell--level-' + Math.min(12, row.depth),
                editing?.key === row.id && editing.field === c.field && '' + B + '__grid-editing',
                k.map((kind) => B + '__cell--' + kind).join(' '),
                (k.includes('data') || c.type === 'bytes') && B + '__grid-cell--data',
                []
                  .concat(groupBy || [])
                  .some((level) => (typeof level === 'object' ? level.field : level) === c.field) &&
                  B + '__cell--grouped',
                c.type === 'bytes' && B + '__cell--data',
                inRange && B + '__grid-cell--range',
                inRange && inRange.top && B + '__grid-cell--range-top',
                inRange && inRange.bottom && B + '__grid-cell--range-bottom',
                inRange && inRange.start && B + '__grid-cell--range-start',
                inRange && inRange.end && B + '__grid-cell--range-end',
                c.rowHandle && B + '__cell--handle',
                childField && c.field === (props.treeColumn || columns[0]?.field) && B + '__tree-cell',
                pinned && '' + B + '__grid-frozen',
                (c.rowLabel || columns.indexOf(c) <= pinnedAt) && B + '__cell--row-label',
                k.includes('icon') && B + '__w-lead',
                slotted && tpl.slotOf[c.field] && B + '__cell--slot ' + B + '__cell--slot-' + tpl.slotOf[c.field],
                card && tpl.slotOf[c.field] && B + '__cell--place-' + tpl.layout.toLowerCase() + '-' + tpl.slotOf[c.field],
                card && B + '__grid-cell--card',
                !card && keys.includes(c.field) && B + '__cell--key',
                detail && B + '__cell--list-detail',
                detail && card && B + '__cell--detail-line',
                !card && keys[0] === c.field && B + '__cell--key-first',
                (c.align || c.type === 'bytes') && B + '__cell--align-' + (c.align || 'right')
              )}
            >
              {childField && c.field === (props.treeColumn || columns[0]?.field) ? (
                <span className={B + '__tree-level'} data-plx-depth={0}>
                  {row.getCanExpand() ? (
                    <button
                      type="button"
                      className={B + '__grid-data-tree-control'}
                      aria-expanded={row.getIsExpanded()}
                      aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
                      onClick={() => row.toggleExpanded()}
                    >
                      <span
                        className={B + '__grid-data-tree-control-' + (row.getIsExpanded() ? 'collapse' : 'expand')}
                      />
                    </button>
                  ) : null}
                </span>
              ) : null}
              {status ? <CellStatus status={status} onClear={() => setCellStatus(null)} /> : null}
              {editing?.key === row.id && editing.field === c.field ? (
                cellDirection(
                  pinned && !isStatic,
                  <CellEditor
                    column={c}
                    record={record}
                    area={turnedOn && c.editor === 'textarea'}
                    select={turnedOn && c.editor === 'select'}
                    combobox={turnedOn && c.editor === 'combobox'}
                    tags={turnedOn && c.editor === 'tags'}
                    date={turnedOn && c.editor === 'date'}
                    custom={!!c.editor && typeof c.editor === 'object' && typeof c.editor.component === 'function'}
                    value={editing.value}
                    onCommit={(next, move) => {
                      commitEdit(row.id, c.field, next);
                      focusAfterEdit(row, column, move);
                    }}
                    onCancel={() => {
                      setEditing(null);
                      focusAfterEdit(row, column, 0);
                    }}
                  />
                )
              ) : c.rowHandle && (recordPositions.get(record) ?? -1) >= 0 ? (
                <Menu
                  label={S.moveRow}
                  trigger={<DragHandle dnd={rowDnd.handleProps(recordPositions.get(record) ?? -1)} />}
                >
                  <MenuItem
                    disabled={!rowDnd.canMove(recordPositions.get(record) ?? -1, -1)}
                    onSelect={() =>
                      rowDnd.moveTo(recordPositions.get(record) ?? -1, (recordPositions.get(record) ?? -1) - 1)
                    }
                  >
                    {S.moveUp}
                  </MenuItem>
                  <MenuItem
                    disabled={!rowDnd.canMove(recordPositions.get(record) ?? -1, 1)}
                    onSelect={() =>
                      rowDnd.moveTo(recordPositions.get(record) ?? -1, (recordPositions.get(record) ?? -1) + 1)
                    }
                  >
                    {S.moveDown}
                  </MenuItem>
                  <MenuItem onSelect={() => rowDnd.moveTo(recordPositions.get(record) ?? -1, 0)}>{S.moveTop}</MenuItem>
                  <MenuItem onSelect={() => rowDnd.moveTo(recordPositions.get(record) ?? -1, canonical.length - 1)}>
                    {S.moveBottom}
                  </MenuItem>
                </Menu>
              ) : checkboxEditor ? (
                <input
                  type="checkbox"
                  className={B + '__check-input'}
                  checked={!!value}
                  disabled={status?.kind === 'saving'}
                  aria-disabled={editable ? undefined : 'true'}
                  tabIndex={-1}
                  aria-label={c.title || c.field}
                  onChange={(e) => {
                    if (editable) commitEdit(row.id, c.field, e.target.checked);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : c.render ? (
                <span
                  className={cx(B + '__portal', actions && B + '__portal--actions')}
                  dir={pinned && !isStatic && !kinds(c).includes('id') ? 'auto' : undefined}
                  data-plx-link-target="cell"
                >
                  <CustomCell
                    column={c}
                    record={record}
                    cell={cell}
                    rowId={row.id}
                    selected={!!selection[row.id]}
                    block={B}
                    mods={mods}
                  />
                </span>
              ) : actions ? (
                <span
                  className={B + '__portal ' + B + '__portal--actions'}
                  dir={pinned && !isStatic && !kinds(c).includes('id') ? 'auto' : undefined}
                >
                  {shown}
                </span>
              ) : cutAt === row.id + '|' + c.field ? (
                <>
                  {cellDirection(pinned && !isStatic && !kinds(c).includes('id'), shown)}
                  <span className={B + '__cut'}>
                    <Popover
                      label={c.title}
                      title={c.title}
                      size="sm"
                      placement="bottom-end"
                      onOpenChange={(open) => {
                        cutOpen.current = open;
                        if (!open) setCutAt(null);
                      }}
                      trigger={<Button variant="ghost" size="xs" iconOnly icon={ExpandIcon} label={S.fullText} />}
                    >
                      <div className={B + '__full-text'}>{valueText(value)}</div>
                    </Popover>
                  </span>
                </>
              ) : (
                cellDirection(pinned && !isStatic && !kinds(c).includes('id'), shown)
              )}
            </Width>
          );
        })}
        {props.viewMenu ? <div className={cx(`${B}__grid-cell ${B}__w-view`, modes)} role="gridcell" /> : null}
        {rowMenu && rowMenuButton ? (
          <Width width={card ? null : metrics.menu} className={cx(`${B}__grid-cell ${B}__cell--row-menu`, card && B + '__grid-cell--template-menu ' + B + '__grid-cell--card', modes)} role="gridcell">
            <Menu
              label={S.rowActions}
              trigger={
                <Button
                  className={B + '__row-menu'}
                  variant="ghost"
                  size="xs"
                  iconOnly
                  icon={MoreIcon}
                  label={S.rowActions}
                />
              }
            >
              <RowMenuContent build={menuItems} items={rowMenu} record={record} rowApi={rowApi} />
            </Menu>
          </Width>
        ) : null}
      </RowTarget>
    );
    return rowMenu ? (
      <ContextMenu key={row.displayKey || row.id} target={node} label={S.rowActions}>
        <RowMenuContent build={menuItems} items={rowMenu} record={record} rowApi={rowApi} />
      </ContextMenu>
    ) : (
      node
    );
  };
  return { groupNode, rowNode };
}
