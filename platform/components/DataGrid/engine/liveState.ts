/* Plenix · DataGrid engine · live values
   Summary: The engine's current values for the code that runs later (the adapter, handlers, timers): live.current is set in every
     render to the props, the records, the model, the groups, the table, the selection, the sort, the handlers and the elements, so
     the adapter (api.row, api.cell, api.getData...) always reads the latest and never a stale closure.
   Usage:
     import { syncLive } from './engine/liveState.ts';
     syncLive({ live, props, frame, index, source, model, table, selection, sorting, ... });
   Props:
     live: the engine's ref; the other names are the engine's values and handlers, stored under the same names. Returns nothing.
   Notes:
     Moved out of DataGridEngine.tsx without any change to the code (issue 714, the adapter): the assignment was in the engine
     function, in the same place. The engine is documented in DataGridEngine.tsx.
*/
export function syncLive({
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
  listeners,
}: any) {
  live.current = {
    props,
    frame,
    index,
    data: canonical,
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
    fields: columns,
    table,
    selection,
    sorting,
    setSorting: changeSort,
    resize,
    move,
    pick,
    setPage,
    page,
    pageSize,
    setPageSize,
    virtual,
    rowElements: rowElements.current,
    headerElements: headerElements.current,
    listeners: listeners.current,
  };
}
