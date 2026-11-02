/* Plenix · AssignControl
   Summary: Who is responsible for an item, and how to change it, in one row. Assign: nobody yet, so the people picker
     shows with Assign to me beside it. Reassign: the assignee (avatar, name, detail) with Reassign, which swaps the row to
     the people picker until a person is chosen or Escape puts the row back; Unassign empties it. Delegate with dates:
     someone acts for a person for a while; the row says to whom and from when to when, and Delegate opens a dialog
     with the person, the dates and a note (10 Patterns › Review and approval › Assign, Delegate).
   Usage:
     <AssignControl label="Assignee" people={people} value={assignee} onChange={setAssignee} me="mc" />
     <AssignControl variant="delegate" label="Approvals" people={people} delegation={away}
       onDelegate={(d) => setAway(d)} onEndDelegation={() => setAway(null)} />
   Props:
     label: what the role is ("Assignee", "Reviewer", "Approvals"); names the picker and the row
     people: the people who can be chosen: EntityPicker's options for kind "people" ([{ value, label, description, src,
       color, presence }])
     value: the assignee's value, or null (assign and reassign)
     onChange(value, person): runs with the chosen person's value, or null for Unassign
     me: the value of the person using the page: Assign to me while nobody is assigned
     clearable: offers Unassign (default true)
     variant: "assign" (default; assign and reassign) | "delegate"
     delegation: { to, start, end, note } (start and end "YYYY-MM-DD"): the current delegation, or null
     onDelegate({ to, start, end, note }): saves the delegation from the dialog
     onEndDelegation(): ends it now
     strings: the words, for other languages: { assign: "Assign", assignToMe: "Assign to me", reassign: "Reassign",
       unassign: "Unassign", unassigned: "Unassigned", cancel: "Cancel", assigned: "Assigned to {name}", cleared:
       "{label} removed", delegate: "Delegate", change: "Change", end: "End delegation", delegateTitle: "Delegate {label}",
       to: "Delegate to", dates: "Dates", note: "Note", noteHint: "Shown to the person you delegate to.", needPerson:
       "Choose a person.", needDates: "Choose the first and last day.", delegatedTo: "Delegated to {name}", notDelegated:
       "Not delegated", ended: "Delegation ended" }
     className: more classes on the row
   Behavior:
     Reassign swaps the row to the picker and puts focus in it; choosing a person puts the row back with the new name and
       announces it; Escape, or Cancel, puts it back unchanged with focus on Reassign.
     The delegate dialog checks the person and both dates when Delegate is pressed: a missing one keeps the dialog open
       with its error under the field (nothing is disabled). The dates are shown in the data font.
     Each change is announced, or toasted with a ToastProvider.
   Notes:
     One assignee per item; several people sharing a task are reviewers or members, not assignees.
     A delegation ends by itself after its last day; End delegation ends it sooner.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { announce } from '../../utils/announce.tsx';
import { formatRange } from '../../utils/format.ts';
import { Button } from '../../components/Button/Button.tsx';
import { Dialog } from '../../components/Dialog/Dialog.jsx';
import { Field } from '../../components/Field/Field.tsx';
import { Textarea } from '../../components/Input/Input.tsx';
import { DatePicker } from '../../components/DatePicker/DatePicker.jsx';
import { EntityPicker } from '../../components/EntityPicker/EntityPicker.jsx';
import { Persona } from '../../components/Persona/Persona.jsx';
import { Text } from '../../components/Text/Text.tsx';
import { useOptionalToast } from '../../components/Toast/Toast.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ForwardIcon from 'plenix-platform/icons/plenix/forward';
import PencilIcon from 'plenix-platform/icons/plenix/pencil';
import PersonIcon from 'plenix-platform/icons/plenix/person';
import { fill } from '../../utils/fill.ts';

export function AssignControl({ label, people = [], value = null, onChange, me, clearable = true, variant = 'assign',
  delegation, onDelegate, onEndDelegation, strings, className, ...rest }) {
  devWarn('AssignControl', { variant }, { variant: ['assign','delegate'] });
  const t = useStrings('assignControl', strings);
  label = label ?? t.label;
  const toast = useOptionalToast();
  const say = (text) => { if (toast) toast.show(text, { tone: 'success' }); else announce(text); };
  const find = (v) => people.find((p) => p.value === v) || null;
  const [editing, setEditing] = React.useState(false);
  const picker = React.useRef(null);
  const again = React.useRef(null);
  const back = React.useRef(false);
  React.useEffect(() => { if (editing && picker.current) picker.current.focus(); if (!editing && back.current && again.current) { again.current.focus(); back.current = false; } }, [editing]);

  // delegate dialog
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState({ to: null, range: null, note: '' });
  const [errors, setErrors] = React.useState({});
  const formId = useUid('plx-assign');

  if (variant === 'delegate') {
    const d = delegation && delegation.to ? delegation : null;
    const person = d ? find(d.to) : null;
    const begin = () => { setDraft({ to: d ? d.to : null, range: d ? { start: d.start, end: d.end } : null, note: d ? d.note || '' : '' }); setErrors({}); setOpen(true); };
    const save = (e) => {
      e.preventDefault();
      const next = { to: draft.to ? '' : t.needPerson, range: draft.range && draft.range.start && draft.range.end ? '' : t.needDates };
      setErrors(next);
      if (next.to || next.range) return;
      setOpen(false);
      if (onDelegate) onDelegate({ to: draft.to, start: draft.range.start, end: draft.range.end, note: draft.note.trim() });
      say(fill(t.delegatedTo, { name: (find(draft.to) || {}).label || '' }));
    };
    return (
      <div className={cx('plx-assign-control', 'plx-assign-control--delegate', className)} role="group" aria-label={label} {...rest}>
        <div className="plx-assign-control__who">
          {person ? <Persona name={person.label} src={person.src} color={person.color} size="sm"
            secondary={<span className="plx-assign-control__dates"><Text variant="data">{formatRange(d.start, d.end)}</Text></span>} />
            : <span className="plx-assign-control__empty">{t.notDelegated}</span>}
        </div>
        <div className="plx-assign-control__actions">
          <Button size="sm" variant="ghost" icon={person ? PencilIcon : ForwardIcon} onClick={begin}>{person ? t.change : t.delegate}</Button>
          {person && onEndDelegation ? <Button size="sm" variant="ghost" onClick={() => { onEndDelegation(); say(t.ended); }}>{t.end}</Button> : null}
        </div>
        <Dialog open={open} onClose={() => setOpen(false)} title={fill(t.delegateTitle, { label: label.toLowerCase() })} size="sm"
          footer={<><Button onClick={() => setOpen(false)}>{t.cancel}</Button><Button variant="primary" type="submit" form={formId}>{t.delegate}</Button></>}>
          <form id={formId} noValidate onSubmit={save} className="plx-assign-control__form">
            <Field label={t.to} error={errors.to || undefined}>
              <EntityPicker kind="people" options={people} value={draft.to} onChange={(v) => { setDraft((x) => Object.assign({}, x, { to: v })); setErrors((x) => Object.assign({}, x, { to: '' })); }} />
            </Field>
            <Field label={t.dates} error={errors.range || undefined}>
              <DatePicker mode="range" value={draft.range} onChange={(v) => { setDraft((x) => Object.assign({}, x, { range: v })); setErrors((x) => Object.assign({}, x, { range: '' })); }} />
            </Field>
            <Field label={t.note} description={t.noteHint}>
              <Textarea rows={2} value={draft.note} onChange={(e) => { const v = e.target.value; setDraft((x) => Object.assign({}, x, { note: v })); }} />
            </Field>
          </form>
        </Dialog>
      </div>
    );
  }

  const person = find(value);
  const choose = (v) => {
    setEditing(false);
    back.current = true;
    if (v === value) return;
    if (onChange) onChange(v, find(v));
    const p = find(v);
    say(p ? fill(t.assigned, { name: p.label }) : fill(t.cleared, { label }));
  };
  const cancel = () => { back.current = true; setEditing(false); };
  if (!person || editing) {
    return (
      <div className={cx('plx-assign-control', className)} role="group" aria-label={label} {...rest}
        onKeyDown={editing ? (e) => { if (e.key === 'Escape' && !e.defaultPrevented) cancel(); } : undefined}>
        <div className="plx-assign-control__picker">
          <EntityPicker ref={picker} kind="people" options={people} value={null} label={label} onChange={(v) => { if (v !== null && v !== undefined) choose(v); }} />
        </div>
        <div className="plx-assign-control__actions">
          {editing ? <Button size="sm" variant="ghost" onClick={cancel}>{t.cancel}</Button>
            : me && find(me) ? <Button size="sm" variant="ghost" icon={PersonIcon} onClick={() => choose(me)}>{t.assignToMe}</Button> : null}
        </div>
      </div>
    );
  }
  return (
    <div className={cx('plx-assign-control', 'plx-assign-control--assigned', className)} role="group" aria-label={label} {...rest}>
      <div className="plx-assign-control__who">
        <Persona name={person.label} src={person.src} color={person.color} presence={person.presence} secondary={person.description} size="sm" />
      </div>
      <div className="plx-assign-control__actions">
        <Button ref={again} size="sm" variant="ghost" icon={PersonIcon} onClick={() => setEditing(true)}>{t.reassign}</Button>
        {clearable ? <Button size="sm" variant="ghost" onClick={() => choose(null)}>{t.unassign}</Button> : null}
      </div>
    </div>
  );
}
