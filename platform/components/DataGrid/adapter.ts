/* Plenix · DataGridEngine compatibility
   Summary: The row, cell and column methods used by current Plenix application callbacks.
   Usage: Internal to DataGridEngine; onReady receives the table adapter.
   Props: React-owned model access and mutations, always read through a live ref.
   Behavior: Adapts records without exposing a second imperative renderer.
   Notes: The adapter remains private; public callbacks receive records directly. */
import { recordKey, valueAt } from './state.ts';
import { valueText } from './cells.tsx';
export function createAdapter(current: any) {
  // a person's code names a row by its own id (3, 'r10'); the grid keys its rows by recordKey(id). A key already in the grid's form passes through (issue 736).
  const asKey = (id: any) => current.current.recordsByKey.has(id) ? id : recordKey(id);
  const row = (key: any) => {
    const captured=current.current.recordsByKey.get(key);
    const data = () => current.current.recordsByKey.get(key) || captured;
    return { getData: data, getIndex: () => data()?.[current.current.index], getTable: () => api,
      getElement: () => current.current.rowElements.get(key),
      isSelected: () => !!current.current.selection[key], select: () => current.current.pick(key, true), deselect: () => current.current.pick(key, false),
      toggleSelect: () => current.current.pick(key, !current.current.selection[key]),
      update: (patch: any) => current.current.updateRecord(key,(record: any)=>({...record,...patch})), delete:()=>current.current.updateRecord(key,()=>null),
      treeExpand:()=>current.current.table.getCoreRowModel().rowsById[key]?.toggleExpanded(true),treeCollapse:()=>current.current.table.getCoreRowModel().rowsById[key]?.toggleExpanded(false),treeToggle:()=>current.current.table.getCoreRowModel().rowsById[key]?.toggleExpanded(),
      getTreeChildren:()=> (data()?.[current.current.childField]||[]).map((record: any)=>row(recordKey(record[current.current.index]))),
      getCell: (field: any) => cell(key, field), getCells: () => current.current.fields.map((c: any) => cell(key, c.field)) };
  };
  const column = (field: any) => ({ getField: () => field, getDefinition: () => current.current.fields.find((c: any) => c.field === field),
    getTable: () => api, getElement: () => current.current.headerElements.get(field),
    getWidth: () => current.current.table.getColumn(field)?.getSize(), isVisible: () => current.current.table.getColumn(field)?.getIsVisible(),
    show: () => current.current.table.getColumn(field)?.toggleVisibility(true), hide: () => current.current.table.getColumn(field)?.toggleVisibility(false),
    setWidth: (width: any) => current.current.resize(field, width),
    move: (target: any, after: any) => current.current.move(field, typeof target === 'string' ? target : target.getField(), after) });
  const cell = (key: any, field: any) => ({ getData: () => row(key).getData(), getValue: () => valueAt(row(key).getData(), field),
    setValue:(value: any)=>current.current.commitEdit(key,field,value),edit:()=>current.current.setEditing({key,field,value:valueAt(row(key).getData(),field)}),cancelEdit:()=>current.current.setEditing(null),
    getRow: () => row(key), getColumn: () => column(field), getField: () => field, getTable: () => api,
    getElement: () => current.current.rowElements.get(key)?.querySelector('[data-plx-field="' + CSS.escape(field) + '"]') });
  const group = (value: any) => ({getKey:()=>value.value,getField:()=>value.field,getRows:()=>value.rows.map((record: any)=>row(record.id)),getSubGroups:()=>value.groups.map(group),getVisibility:()=>!current.current.collapsed.has(value.id),show:()=>current.current.toggleGroup(value.id,true),hide:()=>current.current.toggleGroup(value.id,false)});
  const physicalRows=()=>current.current.model.filter((record: any)=>!record.__group&&!record.__gap&&!record.__add).map((record: any)=>row(record.id));
  const api = {
    get element(){return current.current.frame.current;},
    plxRows:physicalRows,plxData:()=>api.getData(),plxSelectedRows:()=>physicalRows().filter((record: any)=>record.isSelected()),
    updateRow:async(id: any,patch: any)=>{await current.current.updateRecord(recordKey(id),(record: any)=>({...record,...patch}));return api.getRow(id);},
    addData:(records: any)=>current.current.replaceData(current.current.source.concat(records)),
    deleteRow:(id: any)=>current.current.updateRecord(recordKey(id),()=>null),
    getRowPosition:(id: any)=>api.getData(true).findIndex((record: any)=>recordKey(record[current.current.index])===recordKey(id))+1,
    getRowFromPosition:(at: any)=>api.getRows(true)[at-1],
    getData: (active?: any) => active ? current.current.table.getPrePaginationRowModel().flatRows.map((r: any) => r.original) : current.current.data.slice(),
    getRows: (active?: any) => api.getData(active).map((record: any)=>row(recordKey(record[current.current.index]))),
    getDataCount:(active?: any)=>api.getData(active).length,setData:(records: any)=>current.current.replaceData(records),replaceData:(records: any)=>current.current.replaceData(records),
    updateData:(patches: any)=>Promise.all(patches.map((patch: any)=>current.current.updateRecord(recordKey(patch[current.current.index]),(record: any)=>({...record,...patch})))),
    getRow: (id: any) => current.current.recordsByKey.has(recordKey(id)) ? row(recordKey(id)) : false,
    getColumns: () => current.current.table.getAllLeafColumns().filter((c: any) => !c.id.startsWith('__')).map((c: any) => column(c.id)), getColumn: column,
    getSelectedData: () => current.current.data.filter((r: any) => current.current.selection[recordKey(r[current.current.index])]),
    getSelectedRows: () => api.getSelectedData().map((r: any) => row(recordKey(r[current.current.index]))),
    getSorters: () => current.current.sorting.map((s: any) => ({ field: s.id, dir: s.desc ? 'desc' : 'asc', column: column(s.id) })),
    setSort: (field: any, dir: any) => current.current.setSorting(Array.isArray(field) ? field.map(s => ({ id: s.column || s.field, desc: s.dir === 'desc' })) : [{ id: field, desc: dir === 'desc' }]),
    addFilter:(field: any,type: any,value: any)=>current.current.table.getColumn(field)?.setFilterValue(value),clearFilter:()=>current.current.table.setColumnFilters([]),
    setFilter:(filters: any,type: any,value: any)=>current.current.table.setColumnFilters((typeof filters==='string'?[{field:filters,value}]:filters).map((filter: any)=>({id:filter.field,value:filter.value}))),getFilters:()=>current.current.table.getState().columnFilters.map((filter: any)=>({field:filter.id,type:'like',value:filter.value})),
    clearSort: () => current.current.setSorting([]),
    selectRow: (id: any) => [].concat(id).forEach(value=>current.current.pick(recordKey(value), true)), deselectRow: (id: any) => [].concat(id).forEach(value=>current.current.pick(recordKey(value), false)),
    setPage: (page: any) => current.current.setPage(page - 1), getPage: () => current.current.page + 1,
    setPageSize: (size: any) => current.current.setPageSize(size), getPageSize: () => current.current.pageSize,
    scrollToRow: async (id: any) => { const at = current.current.model.findIndex((r: any) => r.id === recordKey(id)); if (at < 0) return; if(current.current.virtual.options.enabled)current.current.virtual.scrollToIndex(at,{align:'auto'});else current.current.rowElements.get(recordKey(id))?.scrollIntoView({block:'nearest'});await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))); },
    on: (name: any, fn: any) => { const listeners = current.current.listeners; if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
    off: (name: any, fn: any) => current.current.listeners.get(name)?.delete(fn),
    getGroups:()=>current.current.groups.map(group),setGroupBy:(value: any)=>current.current.changeGroups(value),
    getCellRange:()=>{const r=current.current.cellRange,v=r&&r.enabled?r.read():null;return v?{rows:v.rows,fields:v.fields,text:v.text}:null;},
    clearCellRange:()=>{const r=current.current.cellRange;if(r&&r.enabled)r.collapse();},
    copyCellRange:()=>{const r=current.current.cellRange;return !!(r&&r.enabled&&r.copy());},
    copyToClipboard:()=>{const fields=current.current.table.getVisibleLeafColumns();const text=[fields.map((c: any)=>c.columnDef.meta.title||c.id),...api.getData(true).map((record: any)=>fields.map((c: any)=>valueAt(record,c.id)))].map(values=>values.map((value: any)=>valueText(value).replace(/[\t\r\n]/g,' ')).join('\t')).join('\n');return navigator.clipboard.writeText(text);},
    print:()=>window.print(),options: {}, row: (id: any) => row(asKey(id)), column, cell: (id: any, field: any) => cell(asKey(id), field)
  };
  return api;
}
