/* Plenix · GroupPanel
   Summary: The command bar's Group (owner, 2026-10-14: "just like Airtable"): a "Group" button (the group-by icon, stacked
     rows) that opens a panel of group levels: each a field, its order, a "…" menu, remove and a handle; "Add subgroup";
     Collapse all and Expand all at the top.
   Usage:
     const [groups, setGroups] = React.useState([]);
     <GroupPanel fields={fields} value={groups} onChange={setGroups} />
     <DataGrid … groupBy={groups} sort={groups.concat(sort)} />
     (or useCollectionView)
   Props:
     fields: the fields rows can be grouped by (utils/fields.ts); groupable: false excludes a field; date fields offer UTC calendar periods
     value: the levels: [{ field, dir: "asc" | "desc", hideEmpty, interval: "day" | "week" | "month" | "year", range }], the first the outer group
     onChange(value): runs on every change
     table: the table controller, or a ref to it: Collapse all and Expand all close and open its
       groups; without it they are disabled
     inline: draws the panel alone (open, in a frame); default false
     strings: { label: "Group", title: "Group by", info, empty, add: "Add group", addSub: "Add subgroup", collapseAll:
       "Collapse all", expandAll: "Expand all", more: "More for {name}", hideEmpty: "Hide empty groups", remove: "Remove the
       grouping by {name}", removeTip: "Remove group", field, order, moved, row, reorder, moveUp, moveDown }
   Behavior:
     The bar button reads "Group" (never reworded); grouped, it takes the tint and a count badge (the levels).
     Each row: the field (its type icon), the order in the field type's words, the "…" menu (Hide empty groups), remove
       (trash) and the handle; a field is used once. Rows move by drag, the handle's menu or Alt + Arrow Up / Down,
       announced. The groups' order follows their levels' order (the page sorts by the levels first).
   Notes:
     The panel holds the levels; the page applies them (DataGrid groupBy, nested with several levels). */
import React from 'react';
import { Button } from '../../components/Button/Button.tsx';
import { Menu, MenuItem } from '../../components/Menu/Menu.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Tooltip } from '../../components/Tooltip/Tooltip.tsx';
import { PanelTrigger as PanelTriggerJs, PanelHead as PanelHeadJs, Pick as PickJs, useReorder as useReorderJs } from '../CommandBar/panel-parts.jsx';
const PanelTrigger: any = PanelTriggerJs;
const PanelHead: any = PanelHeadJs;
const Pick: any = PickJs;
const useReorder: any = useReorderJs;
import { fill } from '../../utils/fill.ts';
import { fieldOf, kindOf, fieldWords, fieldOption } from '../../utils/fields.ts';
import type { Field } from '../../utils/fields.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import GroupByIcon from 'plenix-platform/icons/plenix/group-by';
import MoreIcon from 'plenix-platform/icons/plenix/more';
import PlusIcon from 'plenix-platform/icons/plenix/plus';
import TrashIcon from 'plenix-platform/icons/plenix/trash';

// every group of the table, its subgroups too
const eachGroup = (t: any, fn: any) => {
  const table = t && t.current !== undefined && !t.getGroups ? t.current : t;
  if (!table || !table.getGroups) return;
  const walk = (gs: any) => gs.forEach((g: any) => { fn(g); walk(g.getSubGroups ? g.getSubGroups() : []); });
  walk(table.getGroups());
};

/** @public one grouping level, the first the outer group */
export type GroupLevel = { field: string; dir?: 'asc' | 'desc'; hideEmpty?: boolean; interval?: 'day' | 'week' | 'month' | 'year'; range?: unknown };
/** @public the prop type (ADR 0011) */
export type GroupPanelProps = {
  /** the fields rows can be grouped by (utils/fields.ts); groupable: false excludes one */
  fields?: (Field & { groupable?: boolean })[];
  value?: GroupLevel[];
  onChange(value: GroupLevel[]): void;
  /** the table controller, or a ref to it: Collapse all and Expand all close and open its groups */
  table?: unknown;
  inline?: boolean;
  strings?: Record<string, string>;
};
export function GroupPanel({ fields = [], value = [], onChange, table, inline = false, strings }: GroupPanelProps) {
  fields = fields.filter(f => f.groupable !== false);
  const t: any = useStrings('groupPanel', strings);
  const fw: any = useStrings('fields');
  const levels = value;
  const ro = useReorder(levels, onChange, (l: any) => fieldOf(fields, l.field).label, t);
  const put = (i: any, ch: any) => onChange(levels.map((l, j) => (j === i ? Object.assign({}, l, ch) : l)));
  const free = fields.filter((f) => !levels.some((l) => l.field === f.value));
  const off = !levels.length || !table;
  const body = (
    <div className="plx-find-panel plx-find-panel--group">
      <PanelHead title={t.title} info={t.info} actions={<>
        <Button size="sm" variant="ghost" disabled={off} onClick={() => eachGroup(table, (g: any) => g.hide())}>{t.collapseAll}</Button>
        <Button size="sm" variant="ghost" disabled={off} onClick={() => eachGroup(table, (g: any) => g.show())}>{t.expandAll}</Button>
      </>} />
      <div className="plx-find-panel__rows" ref={ro.box}>
        {levels.length ? null : <Text variant="secondary">{t.empty}</Text>}
        {levels.map((l, i) => {
          const f = fieldOf(fields, l.field), words = fieldWords.directions(fw, kindOf(f));
          return (
            <div key={l.field} {...ro.rowProps(i, f.label)}>
              <Pick label={t.field} value={l.field} options={fields.filter((x) => x.value === l.field || !levels.some((y) => y.field === x.value)).map(fieldOption)} onChange={(v: any) => put(i, { field: v, interval: fields.find(f => f.value === v)?.kind === 'date' ? 'day' : undefined, range: undefined })} />
              <Pick label={t.order} size="dir" value={l.dir || 'asc'} options={[{ value: 'asc', label: words[0] }, { value: 'desc', label: words[1] }]} onChange={(v: any) => put(i, { dir: v })} />
              <Menu label={fill(t.more, { name: f.label })} placement="bottom-end" trigger={<Button variant="ghost" icon={MoreIcon} iconOnly label={fill(t.more, { name: f.label })} />}>
                {f.kind === 'date' ? ['day', 'week', 'month', 'year'].map(interval => <MenuItem key={interval} checked={(l.interval || 'day') === interval} keepOpen onSelect={() => put(i, { interval })}>{interval[0].toUpperCase() + interval.slice(1)}</MenuItem>) : null}
                <MenuItem checked={!!l.hideEmpty} keepOpen onSelect={() => put(i, { hideEmpty: !l.hideEmpty })}>{t.hideEmpty}</MenuItem>
              </Menu>
              <Tooltip content={t.removeTip}><Button variant="ghost" icon={TrashIcon} iconOnly label={fill(t.remove, { name: f.label })} onClick={() => onChange(levels.filter((_, j) => j !== i))} /></Tooltip>
              {ro.handle(i, f.label)}
            </div>
          );
        })}
        {ro.status}
      </div>
      <div className="plx-find-panel__add">
        <Button size="sm" variant="ghost" icon={PlusIcon} disabled={!free.length} onClick={() => onChange(levels.concat({ field: free[0].value, dir: 'asc', interval: free[0].kind === 'date' ? 'day' : undefined, range: free[0].groupRange }))}>{levels.length ? t.addSub : t.add}</Button>
      </div>
    </div>
  );
  return <PanelTrigger icon={GroupByIcon} label={t.label} count={levels.length} inline={inline}>{body}</PanelTrigger>;
}
