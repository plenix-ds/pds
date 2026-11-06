/* Plenix · SortPanel
   Summary: The command bar's Sort (owner, 2026-10-14: "just like Airtable"): a "Sort" button that opens a panel of sort
     levels, each a field and a direction in the field type's words (A → Z, 1 → 9, Oldest → newest); "Add another sort";
     while the collection is grouped the panel reads "Sort within groups by".
   Usage:
     const [sort, setSort] = React.useState([]);
     <SortPanel fields={fields} value={sort} onChange={setSort} grouped={groups.length > 0} />
     <DataGrid … sort={sort} />      (or useCollectionView)
   Props:
     fields: the collection's fields (utils/fields.ts)
     value: the levels: [{ field, dir: "asc" | "desc" }], the first the main sort
     onChange(value): runs on every change
     grouped: the collection is grouped: the title reads "Sort within groups by"; default false
     inline: draws the panel alone (open, in a frame); default false
     strings: { label: "Sort", title: "Sort by", within: "Sort within groups by", info, empty, add: "Add a sort",
       addAnother: "Add another sort", remove: "Remove the sort by {name}", removeTip: "Remove sort", field: "Field",
       direction: "Direction", moved, row, reorder, moveUp, moveDown }
   Behavior:
     The bar button shows the sort in force (a pop-up button, Apple HIG): "Sort" alone while there is none, "Sort: Name"
       with one level, "Sort: Name +1" with more; it takes the tint while it sorts.
     Each row: the field (its type icon), the direction, remove (×) and the handle. A field is used once: the pickers
       offer the fields not yet used. Rows move by drag, the handle's menu or Alt + Arrow Up / Down, announced.
     The panel opens with the focus on its first row (else the Add button).
   Notes:
     The panel holds the levels; the page applies them (DataGrid sort, or compareLevels on its rows). */
import type { Field } from '../../utils/fields.ts';
import React from 'react';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Tooltip } from '../../components/Tooltip/Tooltip.tsx';
import { PanelTrigger as PanelTriggerJs, PanelHead as PanelHeadJs, Pick as PickJs, useReorder as useReorderJs } from '../CommandBar/panel-parts.jsx';
const PanelTrigger: any = PanelTriggerJs;
const PanelHead: any = PanelHeadJs;
const Pick: any = PickJs;
const useReorder: any = useReorderJs;
import { fill } from '../../utils/fill.ts';
import { fieldOf, kindOf, fieldWords, fieldOption } from '../../utils/fields.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import PlusIcon from 'plenix-platform/icons/plenix/plus';
import SortIcon from 'plenix-platform/icons/plenix/sort';


/** @public one sort level, the first the main sort */
export type SortLevel = { field: string; dir?: 'asc' | 'desc' };
/** @public the prop type (ADR 0011) */
export type SortPanelProps = { fields?: Field[]; value?: SortLevel[]; onChange(value: SortLevel[]): void; grouped?: boolean; inline?: boolean; strings?: Record<string, string> };
export function SortPanel(props: SortPanelProps) {
  const { fields = [], value = [], onChange, grouped = false, inline = false, strings } = props as any;
  const t: any = useStrings('sortPanel', strings);
  const fw: any = useStrings('fields');
  const levels = value;
  const ro = useReorder(levels, onChange, (l: any) => fieldOf(fields, l.field).label, t);
  const put = (i: any, ch: any) => onChange(levels.map((l: any, j: any) => (j === i ? Object.assign({}, l, ch) : l)));
  const free = fields.filter((f: any) => !levels.some((l: any) => l.field === f.value));
  const body = (
    <div className="plx-find-panel plx-find-panel--sort">
      <PanelHead title={grouped ? t.within : t.title} info={t.info} />
      <div className="plx-find-panel__rows" ref={ro.box}>
        {levels.length ? null : <Text variant="secondary">{t.empty}</Text>}
        {levels.map((l: any, i: any) => {
          const f = fieldOf(fields, l.field), words = fieldWords.directions(fw, kindOf(f));
          return (
            <div key={l.field} {...ro.rowProps(i, f.label)}>
              <Pick label={t.field} value={l.field} options={fields.filter((x: any) => x.value === l.field || !levels.some((y: any) => y.field === x.value)).map(fieldOption)} onChange={(v: any) => put(i, { field: v })} />
              <Pick label={t.direction} size="dir" value={l.dir} options={[{ value: 'asc', label: words[0] }, { value: 'desc', label: words[1] }]} onChange={(v: any) => put(i, { dir: v })} />
              <Tooltip content={t.removeTip}><Button variant="ghost" icon={CloseIcon} iconOnly label={fill(t.remove, { name: f.label })} onClick={() => onChange(levels.filter((_: any, j: any) => j !== i))} /></Tooltip>
              {ro.handle(i, f.label)}
            </div>
          );
        })}
        {ro.status}
      </div>
      <div className="plx-find-panel__add">
        <Button size="sm" variant="ghost" icon={PlusIcon} disabled={!free.length} onClick={() => onChange(levels.concat({ field: free[0].value, dir: 'asc' }))}>{levels.length ? t.addAnother : t.add}</Button>
      </div>
    </div>
  );
  const current = levels.length ? fieldOf(fields, levels[0].field).label + (levels.length > 1 ? ' +' + (levels.length - 1) : '') : undefined;
  return <PanelTrigger icon={SortIcon} label={t.label} current={current} count={levels.length} inline={inline}>{body}</PanelTrigger>;
}
