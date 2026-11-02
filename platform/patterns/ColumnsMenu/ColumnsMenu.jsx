/* Plenix · ColumnsMenu, ManageColumnsDialog
   Summary: The command bar's Columns (owner, 2026-10-14: the first column is a must; a list with reordering): a "Columns"
     dropdown listing every column with its handle, a checkbox (shown or hidden) and, for the first, its pinned mark; a
     First column select above the list names the first column. The handle opens a menu with Move up and Move down.
     ManageColumnsDialog is the same list, larger, with a find field, Show all, Hide all and the First column select,
     applied with Apply.
   Usage:
     const [columns, setColumns] = React.useState({ order: ['name', 'type', 'size'], hidden: [] });
     <ColumnsMenu fields={fields} value={columns} onChange={setColumns} />
     <ManageColumnsDialog fields={fields} value={columns} onChange={setColumns} />
     <DataGrid … columnOrder={columns.order} hiddenColumns={columns.hidden} />      (or useCollectionView)
   Props:
     fields: the columns: [{ value, label }] (the collection's fields)
     value: { order: [field…], hidden: [field…] }; the first of the order is the first column (never hidden)
     onChange(value): runs on every change (the dialog: on Apply)
     open, onOpenChange(open): (ManageColumnsDialog) the dialog opened by its owner, e.g. the DataGrid's "More…" in the
       header's right-click menu; trigger={null} draws no button
     inline: (ColumnsMenu) draws the list alone (open, in a frame); default false
     strings: { label: "Columns", manage: "Manage columns", first: "First column", moveMenu: "Move {name}",
       moveUp: "Move {name} up", moveDown: "Move {name} down", up: "Move up", down: "Move down", find: "Find a column",
       showAll: "Show all", hideAll: "Hide all", apply: "Apply", cancel: "Cancel", shown: "{name} shown", hidden: "{name}
       hidden", isFirst: "{name} is the first column", moved: "{name}, position {position} of {total}", row: "{name}{first}.
       Alt + Arrow Up or Down moves it", firstMark: ", first column", none: "No column matches" }
   Behavior:
     Changes in the dropdown apply at once; the dialog applies them with Apply (Cancel leaves the columns as they were).
     A row moves by drag (in Firefox a drag does not start on a button: start it from the row, not the handle), by Move up and
       Move down in the handle's menu (the way without dragging), or by Alt + Arrow Up /
       Down on the focused row; the First column select moves a column to the top. Each change is announced politely. The
       first column cannot be hidden. No row carries a "Make first column" or arrow button of its own.
     The button reads "Columns" with the thin chevron; icons only, its icon and tooltip; hidden columns tint it and show
       their count. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Button } from '../../components/Button/Button.tsx';
import { Checkbox } from '../../components/Checkbox/Checkbox.tsx';
import { Dialog } from '../../components/Dialog/Dialog.jsx';
import { Field } from '../../components/Field/Field.tsx';
import { Icon } from '../../components/Icon/Icon.tsx';
import { Menu, MenuItem } from '../../components/Menu/Menu.jsx';
import { Select } from '../../components/Input/Input.tsx';
import { SearchField } from '../../components/SearchField/SearchField.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { LiveRegion } from '../../utils/announce.tsx';
import { PanelTrigger, toggle } from '../CommandBar/panel-parts.jsx';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';
import ChevronUpIcon from 'plenix-platform/icons/plenix/chevron-up';
import DragIcon from 'plenix-platform/icons/plenix/drag';
import FieldsIcon from 'plenix-platform/icons/plenix/fields';
import PinFilledIcon from 'plenix-platform/icons/plenix/pin-filled';
import VisibilityIcon from 'plenix-platform/icons/plenix/visibility';
import VisibilityOffIcon from 'plenix-platform/icons/plenix/visibility-off';

const moveTo = (order, f, i) => { const rest = order.filter((x) => x !== f); rest.splice(i, 0, f); return rest; };
const nameIn = (fields) => (f) => { const x = fields.find((y) => y.value === f); return x ? x.label : f; };

// the list: one row per column
function ColumnsList({ fields, value, onChange, filter = '', t }) {
  const [msg, setMsg] = React.useState('');
  const [drag, setDrag] = React.useState(null);
  const box = React.useRef(null);
  const name = nameIn(fields);
  const order = value.order, hidden = value.hidden || [];
  const put = (o, h, words, focus) => {
    onChange({ order: o, hidden: h });
    setMsg(words);
    if (focus) setTimeout(() => { const el = box.current && box.current.querySelector('[data-plx-field="' + focus + '"]'); if (el) el.focus(); }, 0);
  };
  const move = (f, to, focus) => {
    if (to < 0 || to >= order.length) return;
    put(moveTo(order, f, to), to === 0 ? hidden.filter((x) => x !== f) : hidden,
      to === 0 ? fill(t.isFirst, { name: name(f) }) : fill(t.moved, { name: name(f), position: to + 1, total: order.length }), focus ? f : null);
  };
  const q = filter.trim().toLowerCase();
  const shown = order.filter((f) => !q || name(f).toLowerCase().indexOf(q) >= 0);
  return (
    <div className="plx-columns-list" ref={box}>
      {shown.length ? null : <Text variant="secondary">{t.none}</Text>}
      {shown.map((f) => {
        const i = order.indexOf(f);
        return (
          <div key={f} data-plx-field={f} tabIndex={0} draggable aria-label={fill(t.row, { name: name(f), first: i === 0 ? t.firstMark : '' })} aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"
            className={cx('plx-columns-list__row', drag === f && 'is-dragging')}
            onKeyDown={(e) => { if (e.target !== e.currentTarget || !e.altKey) return; if (e.key === 'ArrowUp') { e.preventDefault(); move(f, i - 1, true); } if (e.key === 'ArrowDown') { e.preventDefault(); move(f, i + 1, true); } }}
            onDragStart={(e) => { setDrag(f); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', f); }}
            onDragEnd={() => setDrag(null)} onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const from = e.dataTransfer.getData('text/plain') || drag; setDrag(null); if (from && from !== f) move(from, i); }}>
            <Menu label={fill(t.moveMenu, { name: name(f) })} trigger={<Button size="xs" variant="ghost" icon={DragIcon} iconOnly label={fill(t.moveMenu, { name: name(f) })} className="plx-columns-list__handle" />} placement="bottom-start">
              <MenuItem icon={ChevronUpIcon} disabled={i === 0} onSelect={() => move(f, i - 1, true)}>{t.up}</MenuItem>
              <MenuItem icon={ChevronDownIcon} disabled={i === order.length - 1} onSelect={() => move(f, i + 1, true)}>{t.down}</MenuItem>
            </Menu>
            <Checkbox label={name(f)} checked={hidden.indexOf(f) < 0} disabled={i === 0}
              onChange={() => put(order, toggle(hidden, f), fill(hidden.indexOf(f) >= 0 ? t.shown : t.hidden, { name: name(f) }))} />
            {i === 0 ? <span className="plx-columns-list__first"><Icon name={PinFilledIcon} /><Text variant="secondary">{t.first}</Text></span> : null}
          </div>
        );
      })}
      <LiveRegion kind="status">{msg}</LiveRegion>
    </div>
  );
}

export function ColumnsMenu({ fields = [], value, onChange, inline = false, strings }) {
  const t = useStrings('columnsMenu', strings);
  const v = value || { order: fields.map((f) => f.value), hidden: [] };
  const name = nameIn(fields);
  const first = <Field label={t.first}><Select value={v.order[0]} options={v.order.map((f) => ({ value: f, label: name(f) }))}
    onChange={(e) => onChange({ order: moveTo(v.order, e.target.value, 0), hidden: (v.hidden || []).filter((x) => x !== e.target.value) })} /></Field>;
  const list = <div className="plx-find-panel plx-find-panel--columns">{first}<ColumnsList fields={fields} value={v} onChange={onChange} t={t} /></div>;
  return <PanelTrigger icon={FieldsIcon} label={t.label} title={t.label} count={(v.hidden || []).length} caret size="lg" inline={inline}>{list}</PanelTrigger>;
}

export function ManageColumnsDialog({ fields = [], value, onChange, strings, trigger, open: openProp, onOpenChange }) {
  const t = useStrings('columnsMenu', strings);
  const v = value || { order: fields.map((f) => f.value), hidden: [] };
  const controlled = openProp !== undefined;
  const [own, setOwn] = React.useState(false), open = controlled ? !!openProp : own;
  const setOpen = (next) => { if (!controlled) setOwn(next); if (onOpenChange) onOpenChange(next); };
  const [draft, setDraft] = React.useState(v);
  const [q, setQ] = React.useState('');
  const name = nameIn(fields);
  // opened by its owner: start from the current columns, as the button does
  React.useEffect(() => { if (controlled && openProp) { setDraft(v); setQ(''); } }, [controlled, openProp]);
  const start = () => { setDraft(v); setQ(''); setOpen(true); };
  const button = trigger === null ? null : trigger ? React.cloneElement(trigger, { onClick: start }) : <Button size="sm" variant="ghost" icon={FieldsIcon} onClick={start}>{t.manage}</Button>;
  return (
    <>
      {button}
      <Dialog open={open} onClose={() => setOpen(false)} title={t.manage} icon={FieldsIcon} size="md"
        footer={<><Button onClick={() => setOpen(false)}>{t.cancel}</Button><Button variant="primary" onClick={() => { onChange(draft); setOpen(false); }}>{t.apply}</Button></>}>
        <div className="plx-find-panel plx-find-panel--dialog">
          <Field label={t.first}><Select value={draft.order[0]} options={draft.order.map((f) => ({ value: f, label: name(f) }))}
            onChange={(e) => setDraft({ order: moveTo(draft.order, e.target.value, 0), hidden: (draft.hidden || []).filter((x) => x !== e.target.value) })} /></Field>
          <SearchField width="fill" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} placeholder={t.find} label={t.find} />
          <div className="plx-find-panel__add">
            <Button size="sm" variant="ghost" icon={VisibilityIcon} onClick={() => setDraft({ order: draft.order, hidden: [] })}>{t.showAll}</Button>
            <Button size="sm" variant="ghost" icon={VisibilityOffIcon} onClick={() => setDraft({ order: draft.order, hidden: draft.order.slice(1) })}>{t.hideAll}</Button>
          </div>
          <ColumnsList fields={fields} value={draft} onChange={setDraft} filter={q} t={t} />
        </div>
      </Dialog>
    </>
  );
}
