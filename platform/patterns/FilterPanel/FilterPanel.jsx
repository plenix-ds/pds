/* Plenix · FilterPanel
   Summary: The command bar's Filter (owner, 2026-10-14: "like Airtable's"): the advanced filter that holds every
     possibility, a "Filter" button that opens a panel of conditions: Where / and / or, a field, an operator by the field's
     type and a value (the chosen options as pills in their colors), condition groups one level deep. It is never labeled
     "advanced"; quick filters (QuickFilter) are optional shortcuts beside it.
   Usage:
     const [filter, setFilter] = React.useState({ join: 'and', items: [] });
     <FilterPanel fields={fields} value={filter} onChange={setFilter} />
     <DataGrid … filter={(row) => matchesFilter(filter, row, fields)} />      (or useCollectionView)
   Props:
     fields: the collection's fields: [{ value, label, kind: "text" | "select" | "multi" | "number" | "date", options, get }]
       (utils/fields.ts)
     value: the filter: { join: "and" | "or", items: [condition | { group: true, id, join, items }] }; a condition is
       { id, field, op, value }
     onChange(value): runs on every change
     inline: draws the panel alone (open, in a frame) instead of the bar button and its popover; default false
     open, onOpenChange(open): the panel's open state, controlled (useCollectionView sets them)
     request: { field, id }: open on one field (the grid's "Filter by this field"): a condition for that field is added when
       the filter has none, and the focus goes to the first row; each new id is one request
     strings: the words, for other languages: { label: "Filter", info, sub: "In this view, show records", where: "Where",
       and: "and", or: "or", empty: "No conditions: every record is shown", addCondition: "Add condition",
       addGroup: "Add condition group", remove: "Remove {what}", condition: "condition", group: "condition group",
       value: "Enter a value", choose: "Choose options", field: "Field", operator: "Operator", join: "And or or",
       moved, row, reorder, moveUp, moveDown (the row moves) }
   Behavior:
     The bar button reads "Filter" (its words never change); with conditions it takes the tint and a count badge (the
       number of conditions). Icons only, it is the filter icon with its tooltip, and the count.
     The panel opens with the focus on its first row's field (else Add condition). Each row: the join (Where on the first
       row; and / or on the second, which sets it for all; the same word after), the field (its type icon and name), the
       operator in the field type's words, the value (text, a number, a date, "the past week…", or options as pills),
       remove and the handle.
     Rows move by drag, by the handle's Move up and Move down, or by Alt + Arrow Up / Down on a focused row; each move is
       announced. A condition left unfinished does not filter.
   Notes:
     The panel holds the conditions; the page applies them (DataGrid filter, or matchesFilter on its rows). */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Button } from '../../components/Button/Button.tsx';
import { Input } from '../../components/Input/Input.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Tooltip } from '../../components/Tooltip/Tooltip.tsx';
import { PanelTrigger, PanelHead, Pick, MultiPick, useReorder } from '../CommandBar/panel-parts.jsx';
import { fill } from '../../utils/fill.ts';
import { WITHIN, fieldOf, kindOf, optionsOf, conditionsOf, newCondition, nextId, fieldWords, fieldOption } from '../../utils/fields.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import FilterIcon from 'plenix-platform/icons/plenix/filter';
import PlusIcon from 'plenix-platform/icons/plenix/plus';
import TrashIcon from 'plenix-platform/icons/plenix/trash';


function ConditionValue({ c, f, set, t }) {
  const fw = useStrings('fields');
  const k = kindOf(f);
  if (c.op === 'empty' || c.op === 'nempty') return <span className="plx-find-pick--value" />;
  if (k === 'select' || k === 'multi') return <MultiPick label={f.label} options={optionsOf(f)} value={[].concat(c.value || [])} onChange={(v) => set({ value: v })} placeholder={t.choose} />;
  if (k === 'date' && c.op === 'within') return <Pick label={f.label} size="value" value={c.value || WITHIN[0].value} options={fieldWords.within(fw)} onChange={(v) => set({ value: v })} />;
  if (k === 'date') return <Input type="date" data aria-label={f.label} className="plx-find-pick--value" value={c.value} onChange={(e) => set({ value: e.target.value })} />;
  if (k === 'number') return <Input type="number" data aria-label={f.label} placeholder={t.value} className="plx-find-pick--value" value={c.value} onChange={(e) => set({ value: e.target.value })} />;
  return <Input aria-label={f.label} placeholder={t.value} className="plx-find-pick--value" value={c.value} onChange={(e) => set({ value: e.target.value })} />;
}

function ConditionRows({ fields, node, setNode, nested, t }) {
  const fw = useStrings('fields');
  const items = node.items;
  const setItems = (list) => setNode(Object.assign({}, node, { items: list }));
  const nameOf = (x) => (x.group ? t.group : fieldOf(fields, x.field).label);
  const ro = useReorder(items, setItems, nameOf, t);
  const put = (i, ch) => setItems(items.map((x, j) => (j === i ? Object.assign({}, x, ch) : x)));
  const join = (i) => (i === 0 ? <Text variant="secondary" className="plx-find-panel__join">{t.where}</Text>
    : i === 1 ? <Pick label={t.join} size="join" value={node.join} options={[{ value: 'and', label: t.and }, { value: 'or', label: t.or }]} onChange={(v) => setNode(Object.assign({}, node, { join: v }))} />
    : <Text variant="secondary" className="plx-find-panel__join">{node.join === 'or' ? t.or : t.and}</Text>);
  const remove = (i, what) => (
    <Tooltip content={fill(t.remove, { what })}><Button variant="ghost" icon={TrashIcon} iconOnly label={fill(t.remove, { what })} onClick={() => setItems(items.filter((_, j) => j !== i))} /></Tooltip>
  );
  return (
    <div className={cx('plx-find-panel__rows', 'plx-find-panel__rows--framed', nested && 'plx-find-panel__rows--nested')} ref={ro.box}>
      {items.length ? null : <Text variant="secondary">{t.empty}</Text>}
      {items.map((x, i) => {
        if (x.group) {
          return (
            <div key={x.id} {...ro.rowProps(i, t.group)}>
              {join(i)}
              <div className="plx-find-panel__group">
                <ConditionRows fields={fields} node={x} setNode={(n) => put(i, n)} nested t={t} />
                <div className="plx-find-panel__add"><Button size="sm" variant="ghost" icon={PlusIcon} onClick={() => put(i, { items: x.items.concat(newCondition(fields[0])) })}>{t.addCondition}</Button></div>
              </div>
              {remove(i, t.group)}
              {ro.handle(i, t.group)}
            </div>
          );
        }
        const f = fieldOf(fields, x.field);
        return (
          <div key={x.id} {...ro.rowProps(i, f.label)}>
            {join(i)}
            <Pick label={t.field} value={x.field} options={fields.map(fieldOption)} onChange={(v) => put(i, newCondition(fieldOf(fields, v)))} />
            <Pick label={t.operator} size="op" value={x.op} options={fieldWords.operators(fw, kindOf(f)).map(([value, label]) => ({ value, label }))}
              onChange={(v) => put(i, { op: v, value: v === 'within' ? WITHIN[0].value : x.op === 'within' ? '' : x.value })} />
            <ConditionValue c={x} f={f} set={(ch) => put(i, ch)} t={t} />
            {remove(i, t.condition)}
            {ro.handle(i, f.label)}
          </div>
        );
      })}
      {ro.status}
    </div>
  );
}

export function FilterPanel({ fields = [], value, onChange, inline = false, strings, open, onOpenChange, request }) {
  const t = useStrings('filterPanel', strings);
  const node = value || { join: 'and', items: [] };
  const n = conditionsOf(node).length;
  const add = (x) => onChange(Object.assign({}, node, { items: node.items.concat(x) }));
  const handled = React.useRef(null);
  React.useEffect(() => {
    if (!request || handled.current === request.id) return;
    handled.current = request.id;
    const f = fields.find((x) => x.value === request.field);
    if (f && !conditionsOf(node).some((c) => c.field === f.value)) add(newCondition(f));
  }, [request]);
  const body = (
    <div className="plx-find-panel plx-find-panel--filter">
      <PanelHead title={t.label} info={t.info} sub={t.sub} />
      <ConditionRows fields={fields} node={node} setNode={onChange} t={t} />
      <div className="plx-find-panel__add">
        <Button size="sm" variant="ghost" icon={PlusIcon} disabled={!fields.length} onClick={() => add(newCondition(fields[0]))}>{t.addCondition}</Button>
        <Button size="sm" variant="ghost" icon={PlusIcon} disabled={!fields.length} onClick={() => add({ id: nextId(), group: true, join: 'and', items: [newCondition(fields[0])] })}>{t.addGroup}</Button>
      </div>
    </div>
  );
  return <PanelTrigger icon={FilterIcon} label={t.label} count={n} inline={inline} open={open} onOpenChange={onOpenChange}>{body}</PanelTrigger>;
}
