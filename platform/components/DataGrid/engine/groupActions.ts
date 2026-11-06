/* Plenix · DataGrid engine · group changes
   Summary: Changing the grouping (the collapsed groups reset, onViewChange hears it) and opening or closing a group (a screen
     reader hears it; onViewChange hears the collapsed list).
   Usage:
     import { groupActions } from './engine/groupActions.ts';
     const { changeGroups, toggleGroup } = groupActions({ groupSignal, setGroupOwner, setGroups, setCollapsed, props, live, S });
   Props:
     groupSignal, setGroupOwner, setGroups, setCollapsed: from useGrouping; props: the grid's props (onViewChange); live: the
       engine's ref of current values (collapsed); S: the grid's words. Returns changeGroups(value) and toggleGroup(id, open).
   Notes:
     Moved out of DataGridEngine.jsx without any change to the code (issue 714, the grouping concern): the parts were lines of
     the engine function, in the same order with the same values. The engine is documented in DataGridEngine.jsx.
*/
import { announce } from '../../../utils/announce.tsx';

export function groupActions({ setGroupOwner, groupSignal, setGroups, setCollapsed, props, live, S }: any) {
  const changeGroups = (value: any) => {
    setGroupOwner(groupSignal);
    setGroups(() => value);
    setCollapsed(new Set());
    props.onViewChange?.({ groupBy: value, collapsed: [] });
  };
  const toggleGroup = (id: any, open: any) => {
    const next = new Set(live.current.collapsed),
      expand = open ?? next.has(id),
      changed = expand === next.has(id);
    if (expand) next.delete(id);
    else next.add(id);
    live.current.collapsed = next;
    setCollapsed(next);
    if (changed) announce(expand ? S.expanded : S.collapsed);
    props.onViewChange?.({ collapsed: [...next] });
  };
  return { changeGroups, toggleGroup };
}
