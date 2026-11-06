/* Plenix · DataGrid engine · header cells
   Summary: What the grid draws for each column of its header: the title with its sort mark and type icon, the column menu (the
     application's field actions, sort in the type's words, filter, group by this field), the right-click chooser of columns, the
     filter field, the resize handle (mouse, touch and keyboard) and the drag handle that reorders. Render functions over the engine's
     state, not components: one element tree, no extra React layer.
   Usage:
     import { headerRows } from './engine/headerRows.tsx';
     const { headerCell, chooserColumns } = headerRows({ B, S, props, table, columnDnd, startResize, ... });
   Props:
     The engine's values (the block class B, the strings S, props, the table, the columns and their order, the grouping, the sort and
       filter state, the metrics and the handlers); the call reads them in the render in which the header is drawn. Returns
       headerCell(column) and chooserColumns() (the columns the manage-columns dialog lists); the column menu and the chooser are
       built inside.
   Notes:
     Moved out of DataGridEngine.jsx without any change to the code (issue 714, the header): the parts were lines of the engine
     function, in the same order with the same values. The engine is documented in DataGridEngine.jsx.
*/
import React from 'react';
import { typeOf, kinds, interactive, typeIcons } from './helpers.tsx';
import { MenuDivider, MenuItem, Menu, ContextMenu } from '../../Menu/Menu.tsx';
import { Width, PressTrigger } from '../engine/parts.jsx';
import { Rare, preloadRare } from './rare.tsx';
import { Spinner } from '../../Loading/Loading.tsx';
import { cx } from '../../../utils/cx.ts';
import { headerKeys, resizeKeys } from '../engine/keys.js';
import { Icon } from '../../Icon/Icon.tsx';
import CircleInfoIcon from 'plenix-platform/icons/plenix/circle-info';
import { DragHandle } from '../../DragHandle/DragHandle.tsx';
import EdTextIcon from 'plenix-platform/icons/plenix/ed-text';
import { Popover } from '../../Popover/Popover.tsx';
import { Select, Input } from '../../Input/Input.tsx';
import { Button } from '../../Button/Button.tsx';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';
import FilterIcon from 'plenix-platform/icons/plenix/filter';

export function headerRows({
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
  resize,
}: any) {
  // the column menu (owner, 2026-10-23, Windows Explorer and Airtable): the application's field actions (columnMenu: duplicate,
  // insert, link, description, permissions), then sort in the type's words, filter, and group by this field. Width, order
  // and visibility live in the header's right-click menu (columnChooser); a click on the title sorts.
  const headerItems = (column: any) => (
    <Rare
      part="columnMenuItems"
      args={{ column, columnMenu, S, menuItems, api, props, setFilterField, changeGroups, wrapOf, changeWrap, wrapColumns, groupBy }}
      pending={
        <MenuItem disabled aria-busy="true">
          <Spinner size="sm" label={S.columnActions.replace('{title}', column.columnDef.meta.title)} />
        </MenuItem>
      }
      fallback={() => null}
    />
  );
  // the header's right-click menu (Windows Explorer): size this column or every column to fit, every column with a check
  // (TanStack's visibility; a pinned column stays shown) and More… for the columns dialog (order, find, show all, hide all)
  const columnChooser = (column: any) => (
    <>
      <MenuItem onSelect={() => fit(column.id)}>{S.sizeToFit}</MenuItem>
      <MenuItem onSelect={() => table.getVisibleLeafColumns().forEach((col: any) => fit(col.id))}>{S.sizeAllToFit}</MenuItem>
      {(() => {
        const cols = table
            .getVisibleLeafColumns()
            .map((col: any) => col.columnDef.meta)
            .filter((m: any) => m && m.field && !kinds(m).includes('icon')),
          all = cols.length > 0 && cols.every(wrapOf);
        return (
          <MenuItem checked={all} onSelect={() => changeWrap(Object.fromEntries(cols.map((m: any) => [m.field, !all])))}>
            {S.wrapAll}
          </MenuItem>
        );
      })()}
      <MenuDivider />
      {chooserColumns().map((col: any) => (
        <MenuItem
          key={col.id}
          checked={col.getIsVisible()}
          disabled={frozen.has(col.id)}
          onSelect={() => col.toggleVisibility(!col.getIsVisible())}
        >
          {col.columnDef.meta.title || col.id}
        </MenuItem>
      ))}
      <MenuDivider />
      <MenuItem onSelect={() => setManaging(true)}>{S.moreColumns}</MenuItem>
    </>
  );
  const chooserColumns = () => {
    const all = table
      .getAllLeafColumns()
      .filter((col: any) => !kinds(col.columnDef.meta).some((k) => ['icon', 'actions'].includes(k)));
    return all.slice().sort((x: any, y: any) => orderAt(x.id) - orderAt(y.id));
  };
  const headerCell = (column: any) => {
    const c = column.columnDef.meta,
      pinned = column.getIsPinned() === 'left',
      filtered = column.getIsFiltered(),
      icon = kinds(c).includes('icon'),
      titleFixed = icon ? 'flush' : null,
      offset = pinned ? pinStart(column) : 0;
    const node = (
      <Width
        key={c.field}
        {...columnDnd.itemProps(ordered.indexOf(column))}
        onAttach={(node: any) => {
          if (node) headerElements.current.set(c.field, node);
          else headerElements.current.delete(c.field);
        }}
        width={widths[c.field]}
        frozenOffset={pinned ? offset : undefined}
        role="columnheader"
        tabIndex={isStatic ? undefined : 0}
        data-plx-field={c.field}
        aria-sort={column.getIsSorted() ? (column.getIsSorted() === 'desc' ? 'descending' : 'ascending') : undefined}
        className={cx(
          '' + B + '__grid-col',
          isStatic && B + '__grid-col--static',
          selectable && ordered.indexOf(column) === 0 && B + '__grid-col--after-lead',
          ordered.indexOf(column) > 0 &&
            ordered[ordered.indexOf(column) - 1].getIsPinned() === 'left' &&
            column.getIsPinned() !== 'left' &&
            B + '__grid-col--after-frozen',
          column.getCanSort() && B + '__grid-sortable',
          column.getCanSort() && B + '__grid-col-sorter-element',
          kinds(c).includes('icon') && B + '__cell--icon',
          kinds(c).includes('icon') && B + '__w-lead',
          column.getIsFiltered() && B + '__filtered',
          pinned && '' + B + '__grid-frozen',
          ([] as any[]).concat(groupBy || []).some((level) => (typeof level === 'object' ? level.field : level) === c.field) &&
            B + '__cell--grouped'
        )}
        data-plx-sticky={pinned && offset ? offset + 'px' : undefined}
        onClick={(e: any) => {
          if (!e.target.closest(interactive) && column.getCanSort()) column.toggleSorting();
        }}
        onKeyDown={headerKeys({ column })}
      >
        <div
          className={cx(
            B + '__grid-col-content',
            isStatic && B + '__grid-col-content--static',
            icon && B + '__grid-col-content--icon',
            effectiveWrap && B + '__grid-col-content--wrap'
          )}
        >
          <div className={cx(B + '__grid-col-title-holder', icon && B + '__grid-col-title-holder--flush')}>
            <div
              className={cx(
                B + '__grid-col-title',
                isStatic && B + '__grid-col-title--static',
                titleFixed && B + '__grid-col-title--' + titleFixed,
                icon && B + '__grid-col-title--icon'
              )}
              title={c.title}
            >
              {kinds(c).includes('icon') ? (
                <span className={B + '__header-icon'}>
                  <Icon name={c.icon || CircleInfoIcon} label={c.title} />
                </span>
              ) : (
                <span className={B + '__title'}>
                  {(props.movableColumns ?? options.movableColumns) ? (
                    <DragHandle disabled={frozen.has(column.id)} dnd={columnDnd.handleProps(ordered.indexOf(column))} />
                  ) : null}
                  {showTypes ? (
                    <span className={B + '__type-icon'}>
                      <Icon name={typeIcons[typeOf(c) as keyof typeof typeIcons] || EdTextIcon} />
                    </span>
                  ) : null}
                  <span className={cx(B + '__title-text', effectiveWrap && B + '__title-text--wrap')}>
                    {c.title || c.field}
                  </span>
                </span>
              )}
            </div>
            {filtered || filterField === c.field ? (
              <span className={cx(B + '__title-filter', filtered && B + '__title-filter--on')}>
                <Popover
                  open={filterField === c.field}
                  onOpenChange={(open) => setFilterField(open ? c.field : null)}
                  title={S.filter + ' ' + c.title}
                  size="sm"
                  trigger={
                    <PressTrigger {...({} as any)} className={B + '__title-filter-button'} aria-label={S.filter + ' ' + c.title}>
                      <Icon name={FilterIcon} />
                    </PressTrigger>
                  }
                >
                  <div className={B + '__filter-form'}>
                    {c.filter === 'list' ? (
                      <Select
                        aria-label={S.filter + ' ' + c.title}
                        value={column.getFilterValue() || ''}
                        options={[
                          { value: '', label: S.any },
                          ...[
                            ...new Set([...column.getFacetedUniqueValues().keys()].map((value) => String(value ?? ''))),
                          ]
                            .filter(Boolean)
                            .map((value) => ({ value, label: value })),
                        ]}
                        onChange={(e) => column.setFilterValue(e.target.value || undefined)}
                      />
                    ) : (
                      <Input
                        aria-label={S.filter + ' ' + c.title}
                        value={column.getFilterValue() || ''}
                        onChange={(e) => column.setFilterValue(e.target.value)}
                      />
                    )}
                    <Button variant="ghost" size="sm" onClick={() => column.setFilterValue(undefined)}>
                      {S.clearFilter}
                    </Button>
                  </div>
                </Popover>
              </span>
            ) : null}
          </div>
          {headerMenu ? (
            <span className={cx(B + '__grid-header-popup-button', B + '__grid-header-popup-button--menu')}>
              <Menu
                label={S.columnActions.replace('{title}', c.title)}
                trigger={
                  <PressTrigger {...({} as any)}
                    className={B + '__menu-chevron'}
                    aria-label={S.columnActions.replace('{title}', c.title)}
                    onPointerEnter={preloadRare}
                    onFocus={preloadRare}
                    onPointerDown={preloadRare}
                  >
                    <Icon name={ChevronDownIcon} />
                  </PressTrigger>
                }
              >
                {headerItems(column)}
              </Menu>
            </span>
          ) : null}
        </div>
        {c.resizable !== false && !pinned && !kinds(c).includes('icon') ? (
          <span
            className={`${B}__grid-col-resize-handle`}
            data-plx-target-equivalent=""
            role="separator"
            aria-label={S.resize + ' ' + c.title}
            aria-orientation="vertical"
            tabIndex={0}
            aria-valuenow={column.getSize()}
            aria-valuemin={column.columnDef.minSize}
            aria-valuemax={column.columnDef.maxSize}
            onMouseDown={(e) => startResize(e, column)}
            onTouchStart={(e) => startResize(e, column)}
            onDoubleClick={() => fit(c.field)}
            onKeyDown={resizeKeys({ resize, c, column })}
          />
        ) : null}
      </Width>
    );
    return headerMenu ? (
      <ContextMenu key={c.field} target={node} label={S.columns}>
        {columnChooser(column)}
      </ContextMenu>
    ) : (
      node
    );
  };
  return { chooserColumns, headerCell };
}
