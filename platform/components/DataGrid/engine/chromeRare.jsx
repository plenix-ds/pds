/* Plenix · DataGrid engine · the rarely drawn chrome (loaded on first use)
   Summary: The part of the grid a person meets seldom: the manage-columns dialog (the list of columns to show, hide and reorder). It is a
     plain function over the engine's values, as chrome.jsx's are; rare.jsx draws it once this file has loaded, so the npm package does not
     carry the dialog (its list, search and sheet, about 23 KB) in every grid's first load (issue 807).
   Usage:
     <Rare part="manageDialog" args={{ headerMenu, isStatic, managing, setManaging, chooserColumns, changeOrder, changeVisibility }} fallback={(retry) => …} />
   Props:
     manageDialog({ headerMenu, isStatic, managing, setManaging, chooserColumns, changeOrder, changeVisibility }): the dialog, or null unless it is open.
   Notes:
     Moved out of chrome.jsx without any change to the code. The failure state with Retry stays in chrome.jsx: it is small, and it must
       draw even when this file cannot load. In the iife builds (the CDN script, the applications, pages opened from file://) the dynamic
       import is inlined by the bundler, so nothing is fetched.
*/
import React from 'react';
import { ManageColumnsDialog } from '../../../patterns/ColumnsMenu/ColumnsMenu.jsx';
import { MenuDivider, MenuItem, MenuRadioGroup } from '../../Menu/Menu.tsx';
import { typeOf } from './helpers.jsx';
import SortAscendingIcon from 'plenix-platform/icons/plenix/sort-ascending';
import SortDescendingIcon from 'plenix-platform/icons/plenix/sort-descending';
import FilterIcon from 'plenix-platform/icons/plenix/filter';
import GroupByIcon from 'plenix-platform/icons/plenix/group-by';

export function manageDialog({
  headerMenu,
  isStatic,
  managing,
  setManaging,
  chooserColumns,
  changeOrder,
  changeVisibility,
}) {
  return headerMenu && !isStatic && managing ? (
    <ManageColumnsDialog
      trigger={null}
      open={managing}
      onOpenChange={setManaging}
      fields={chooserColumns().map((col) => ({ value: col.id, label: col.columnDef.meta.title || col.id }))}
      value={{
        order: chooserColumns().map((col) => col.id),
        hidden: chooserColumns()
          .filter((col) => !col.getIsVisible())
          .map((col) => col.id),
      }}
      onChange={(next) => {
        changeOrder(next.order);
        changeVisibility(Object.fromEntries((next.hidden || []).map((field) => [field, false])));
      }}
    />
  ) : null;
}

// the items of a column's menu (the application's field actions, sort in the type's words, filter, group by this field, wrap): the panel loads the
// first time a column menu opens, and the trigger starts the download on hover, focus and touch (rare.jsx preloadRare), so it is normally ready
export function columnMenuItems({ column, columnMenu, S, menuItems, api, props, setFilterField, changeGroups, wrapOf, changeWrap, wrapColumns, groupBy }) {
  const c = column.columnDef.meta,
    custom = typeof columnMenu === 'function' ? columnMenu(c) : columnMenu || [];
  const groupedBy = (field) =>
    [].concat(groupBy || []).some((level) => (typeof level === 'object' ? level.field : level) === field);
  const direction =
    typeOf(c) === 'number' || typeOf(c) === 'currency' || typeOf(c) === 'bytes'
      ? S.sortNumber
      : typeOf(c) === 'date'
        ? S.sortDate
        : typeOf(c) === 'checkbox'
          ? S.sortCheck
          : S.sortText;
  const grouped = groupedBy(c.field),
    others = []
      .concat(groupBy || [])
      .filter((level) => (typeof level === 'object' ? level.field : level) !== c.field);
  return (
    <>
      {menuItems(custom, c, api.column(c.field))}
      {custom.length ? <MenuDivider /> : null}
      <MenuItem icon={SortAscendingIcon} disabled={!column.getCanSort()} onSelect={() => column.toggleSorting(false)}>
        {direction[0]}
      </MenuItem>
      <MenuItem icon={SortDescendingIcon} disabled={!column.getCanSort()} onSelect={() => column.toggleSorting(true)}>
        {direction[1]}
      </MenuItem>
      <MenuDivider />
      <MenuItem
        icon={FilterIcon}
        disabled={!column.getCanFilter()}
        onSelect={() => (props.onFilterField ? props.onFilterField(c.field) : setFilterField(c.field))}
      >
        {S.filterBy}
      </MenuItem>
      <MenuItem
        icon={GroupByIcon}
        disabled={!grouped && c.groupable === false}
        onSelect={() => changeGroups(grouped ? (others.length ? others : false) : c.field)}
      >
        {grouped ? S.noGroup : S.group}
      </MenuItem>
      <MenuDivider />
      <MenuItem
        checked={!!wrapOf(c)}
        onSelect={() => changeWrap({ ...(props.wrapColumns || wrapColumns), [c.field]: !wrapOf(c) })}
      >
        {S.wrapText}
      </MenuItem>
    </>
  );
}

// the items of the grid's view menu (row height, wrap headers, and the Editing choice when the grid offers two modes): loaded the first time the menu
// opens, started by the view button on hover, focus and touch (rare.jsx preloadRare)
export function viewMenuItems({ props, S, effectiveStep, setRowHeight, effectiveWrap, setWrapHeaders, editMenu }) {
  return (
    <>
        {['short', 'medium', 'tall', 'extra-tall'].map((step) => (
          <MenuItem
            key={step}
            checked={effectiveStep === step}
            onSelect={() => {
              setRowHeight(step);
              props.onViewChange?.({ rowHeight: step });
            }}
          >
            {S[step]}
          </MenuItem>
        ))}
        <MenuDivider />
        <MenuItem
          checked={effectiveWrap}
          onSelect={() => {
            setWrapHeaders(!effectiveWrap);
            props.onViewChange?.({ wrapHeaders: !effectiveWrap });
          }}
        >
          {S.wrapHeaders}
        </MenuItem>
        {editMenu?.show ? (
          <>
            <MenuDivider />
            <MenuRadioGroup
              label={S.editMode}
              value={editMenu.mode}
              onChange={(mode) => {
                editMenu.set(mode);
                props.onViewChange?.({ editMode: mode });
              }}
            >
              {editMenu.modes.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  {mode === 'form' ? S.editModeForm : S.editModeInline}
                </MenuItem>
              ))}
            </MenuRadioGroup>
          </>
        ) : null}
    </>
  );
}
