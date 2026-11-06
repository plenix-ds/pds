/* Plenix · DataGrid engine · row model
   Summary: The rows the grid draws, in order: the rows in view (filtered, sorted, loaded so far), then, when the grid groups, TanStack's
     grouped row model over them (each level a column whose value is the row's bucket; a record of a multi-value column enters once per
     value; group summaries are TanStack aggregations), turned into the display list of group rows, gaps, add rows and records.
   Usage:
     import { useRowModel } from './engine/useRowModel.js';
     const { loadedRows, groups, model } = useRowModel({ mode, remoteMode, allRows, loaded, groupBy, columns, printing, collapsed, props });
   Props:
     The rows (allRows), the paging mode (mode, remoteMode) and how many are loaded, the grouping (groupBy, collapsed), the
       columns, printing and the grid's props (onAddToGroup). Returns loadedRows (the rows in view), groups (the tree of groups with
       their rows and summaries) and model (the list the body draws).
   Notes:
     Moved out of DataGridEngine.jsx without any change to the code (issue 714, the data pipeline): the parts were lines of the
     engine function, in the same order with the same values. The engine is documented in DataGridEngine.jsx.
*/
import React from 'react';
import { EMPTY_ROWS } from './helpers.jsx';
import { valueAt } from '../state.ts';
import { groupValue, valueKey, groupDisplay } from '../records.ts';
import { aggregationFns, useReactTable, getCoreRowModel, getGroupedRowModel } from '@tanstack/react-table';

export function useRowModel({ mode, remoteMode, allRows, loaded, groupBy, columns, printing, collapsed, props }) {
  const loadedRows = React.useMemo(
    () => (mode === 'load-more' && !remoteMode ? allRows.slice(0, loaded) : allRows),
    [allRows, mode, remoteMode, loaded]
  );
  // grouping: TanStack's grouped row model (owner, 2026-10-23) over the rows in view (filtered, sorted, loaded), in its
  // own table so selection, paging and counts keep the plain rows. Each level is a column whose grouping value is the
  // row's bucket (records.js groupValue: calendar periods in UTC, numeric ranges); a record of a multi-value column
  // enters once per value (owner: it belongs to every group of its values). Group summaries are TanStack aggregations.
  const levels = React.useMemo(
    () =>
      typeof groupBy === 'string' || typeof groupBy === 'function'
        ? [groupBy]
        : Array.isArray(groupBy)
          ? groupBy.filter(Boolean)
          : [],
    [typeof groupBy === 'function' ? groupBy : JSON.stringify(groupBy)]
  );
  // the same levels keep one array (an app may pass a new one on every render)
  const levelField = (level) => (typeof level === 'object' ? level.field : level);
  const groupInput = React.useMemo(() => {
    if (!levels.length) return EMPTY_ROWS;
    const out = [];
    for (const row of loadedRows) {
      if (!row.original) continue;
      let members = [[]];
      levels.forEach((level) => {
        const field = levelField(level),
          column = columns.find((c) => c.field === field) || {},
          raw = typeof field === 'function' ? field(row.original) : valueAt(row.original, field);
        const values =
            (column.multi || column.type === 'multi') && Array.isArray(raw) ? (raw.length ? raw : [null]) : [raw],
          seen = new Set(),
          buckets = [];
        for (const value of values) {
          const bucket = groupValue(value, level, column),
            key = valueKey(bucket);
          if (!seen.has(key)) {
            seen.add(key);
            buckets.push(bucket);
          }
        }
        members = members.flatMap((member) => buckets.map((bucket) => member.concat([bucket])));
      });
      members.forEach((member) => out.push({ row, member }));
    }
    return out;
  }, [loadedRows, levels, columns]);
  // TanStack's own aggregations over a group's records, each counted once (a record of a multi-value column enters a group more than once; sum, min and max read the records, not the subgroups)
  const onceEach = (name) => (id, leafRows) => {
    const once = [...new Map(leafRows.map((leaf) => [leaf.original.row.id, leaf])).values()];
    return aggregationFns[name](id, once, once);
  };
  const summaryColumns = React.useMemo(() => columns.filter((c) => c.summary), [columns]);
  const groupColumns = React.useMemo(
    () =>
      levels
        .map((level, i) => ({
          id: '__level' + i,
          accessorFn: (item) => item.member[i],
          getGroupingValue: (item) => valueKey(item.member[i]),
        }))
        .concat(
          summaryColumns.map((c) => ({
            id: '__summary:' + c.field,
            accessorFn: (item) => valueAt(item.row.original, c.field),
            aggregationFn: onceEach(
              { sum: 'sum', average: 'mean', min: 'min', max: 'max', count: 'count' }[c.summary] || 'count'
            ),
          }))
        ),
    [levels, summaryColumns]
  );
  const groupingState = React.useMemo(() => levels.map((level, i) => '__level' + i), [levels]);
  const groupTable = useReactTable({
    data: groupInput,
    columns: groupColumns,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    state: { grouping: groupingState },
    groupedColumnMode: false,
  });
  const groupedModel = groupTable.getRowModel();
  const groups = React.useMemo(() => {
    if (!levels.length) return [];
    const build = (rows, path) =>
      rows
        .filter((row) => row.getIsGrouped())
        .map((row, i) => {
          const depth = row.depth,
            field = levelField(levels[depth]),
            value = row.leafRows[0].original.member[depth],
            nextPath = path.concat({ field, value });
          return {
            id: 'group:' + JSON.stringify(nextPath.map((part) => [part.field, valueKey(part.value)])),
            field,
            value,
            depth,
            separated: i > 0,
            path: nextPath,
            rows: [...new Map(row.leafRows.map((leaf) => [leaf.original.row.id, leaf.original.row])).values()],
            groups: build(row.subRows, nextPath),
            summary: Object.fromEntries(summaryColumns.map((c) => [c.field, row.getValue('__summary:' + c.field)])),
          };
        });
    return build(groupedModel.rows, []);
  }, [groupedModel, levels, summaryColumns]);
  const model = React.useMemo(
    () => (groups.length ? groupDisplay(groups, printing ? new Set() : collapsed, !!props.onAddToGroup) : loadedRows),
    [groups, collapsed, loadedRows, !!props.onAddToGroup, printing]
  );
  return { loadedRows, groups, model };
}
