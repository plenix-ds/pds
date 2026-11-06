/* Plenix · DataGrid engine · grouping
   Summary: How the grid groups its rows: the group levels (the caller's, the grid's own, or the options') and which groups are
     collapsed; the caller's collapsed list replaces the grid's own when the caller keeps the view.
   Usage:
     import { useGrouping } from './engine/useGrouping.ts';
     const { groupBy, groupSignal, collapsed, setGroups, setGroupOwner, setCollapsed } = useGrouping({ props, options, initial });
   Props:
     props: the grid's props (groupBy, collapsedGroups, onViewChange); options: the grid options (groupBy); initial: the saved
       view (groupBy, collapsed). Returns groupBy (a field, a function, a list of levels, or false), groupSignal (props.groupBy
       as text), collapsed (a Set of group ids) and the setters the group actions use.
   Notes:
     Moved out of DataGridEngine.jsx without any change to the code (issue 714, the grouping concern): the parts were lines of
     the engine function, in the same order with the same values. The engine is documented in DataGridEngine.jsx.
*/
import React from 'react';

export function useGrouping({ initial, props, options }: any) {
  const [localGroups, setGroups] = React.useState(() => initial.groupBy),
    [groupOwner, setGroupOwner] = React.useState<any>(null),
    [collapsed, setCollapsed] = React.useState(() => new Set(initial.collapsed));
  const collapsedSignal = JSON.stringify(props.collapsedGroups || []);
  React.useEffect(() => {
    if (props.onViewChange)
      setCollapsed((old) =>
        JSON.stringify([...old]) === collapsedSignal ? old : new Set(props.collapsedGroups || [])
      );
  }, [collapsedSignal, !!props.onViewChange]);
  const groupSignal = JSON.stringify(props.groupBy),
    groupBy = props.onViewChange
      ? (props.groupBy ?? false)
      : groupOwner === groupSignal
        ? localGroups
        : (props.groupBy ?? options.groupBy ?? localGroups);
  return { setGroups, setGroupOwner, collapsed, setCollapsed, groupSignal, groupBy };
}
