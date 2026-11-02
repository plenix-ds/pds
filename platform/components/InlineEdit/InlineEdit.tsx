/* Plenix · InlineEdit
   Summary: A value people edit where it is shown: the read view is a button with the value; activating it swaps in a text
     field, a text area or a select with the value, and Enter (or the check button) saves it, Escape puts it back.
   Usage:
     <InlineEdit label="Title" value={title} onConfirm={(next) => save(next)} />
     <InlineEdit label="Description" type="textarea" value={text} placeholder="Add a description" onConfirm={…} />
     <InlineEdit label="Status" type="select" options={[{ value: 'draft', label: 'Draft' }, …]} value={status} onConfirm={…} />
     <InlineEdit label="Title" value={title} confirmButtons validate={(v) => (v.trim() ? null : 'Enter a title')} onConfirm={…} />
   Props:
     label: what the value is ("Title"); it names the field and the read view (required)
     value: the saved value (a string; for a select, an option's value)
     onConfirm(next): runs with the new value when it is saved; return a Promise to show the busy state until it settles
       (a rejected Promise keeps the field open with the error's message)
     onCancel(): runs when the edit is put back
     type: "text" (default) | "textarea" | "select"
     options: the choices of a select: [{ value, label }]; the read view shows the chosen option's label
     placeholder: the read view of an empty value, and the field's hint ("Add a description") (default strings.empty)
     confirmButtons: a check (save) and a close (cancel) button beside the field (default false)
     validate(next): returns an error message to keep the field open, or nothing when the value may be saved
     data: the data font, for technical values such as codes and file names (default false)
     disabled: shows the value without the edit affordance (default false)
     readOnly: shows the value without the edit affordance and keeps it focusable; it does not open for editing; default the nearest ReadOnly region's (useReadOnly)
     readView(value): draws the read view's content (default: the text, or the option's label)
     strings: the words it shows and announces, for other languages: { edit: "edit", save: "Save", cancel: "Cancel",
       empty: "Add a value", saved: "Saved", failed: "The change could not be saved" }
     className: more classes on the inline edit
   Behavior:
     Click, Enter or Space on the read view opens the field with the value, the text selected.
     Enter saves a text field or a select; in a text area Enter is a new line and Ctrl+Enter (Command+Enter) saves.
     Escape puts the value back; leaving the field (focus moves out of the inline edit) saves it.
     An unchanged value closes without saving. An invalid value stays open with its message under the field, and the
       field is marked invalid (aria-invalid, aria-describedby).
     After saving or cancelling with the keyboard or the buttons, focus returns to the read view; "Saved" is announced.
   Notes:
     The read view has the field's size and padding, so the text does not move when it turns into the field.
     The read view is a button (it opens an editor), never a link; it shows a pencil on hover and focus.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { announce } from '../../utils/announce.tsx';
import { Input, Textarea, Select } from '../Input/Input.tsx';
import type { SelectOption } from '../Input/Input.tsx';
import { Button } from '../Button/Button.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import { useReadOnly } from '../../providers/ReadOnly.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import PencilIcon from 'plenix-platform/icons/plenix/pencil';

type InlineEditWords = { empty: string; edit: string; save: string; cancel: string; saved: string; failed: string };
export type InlineEditProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onBlur'> & {
  /** the accessible name of the value and of its field */
  label: string;
  value?: string;
  /** the new value; a Promise keeps the field open (saving) until it settles; a rejection shows its message */
  onConfirm?: (value: string) => unknown;
  onCancel?: () => void;
  type?: 'text' | 'textarea' | 'select';
  /** the choices of a select */
  options?: SelectOption[];
  placeholder?: string;
  confirmButtons?: boolean;
  /** a message when the draft is not acceptable, else nothing */
  validate?: (value: string) => React.ReactNode;
  data?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** how the value shows while it is not being edited */
  readView?: (value: string) => React.ReactNode;
  strings?: Catalog | null;
};
export function InlineEdit({ label, value = '', onConfirm, onCancel, type = 'text', options = [], placeholder, confirmButtons = false, validate,
  data = false, disabled = false, readOnly: readOnlyOwn, readView, strings, className, ...rest }: InlineEditProps) {
  const locked = useReadOnly(readOnlyOwn);   // its own readOnly, else the nearest ReadOnly region's: the value shows, stays focusable, and does not open for editing
  const t = useStrings('inlineEdit', strings) as InlineEditWords;
  const id = useUid('plx-inline-edit');
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const [error, setError] = React.useState<React.ReactNode>(null);
  const [saving, setSaving] = React.useState(false);
  const root = React.useRef<HTMLDivElement>(null), read = React.useRef<HTMLButtonElement>(null), field = React.useRef<HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement>(null), refocus = React.useRef(false);
  const shownValue = type === 'select' ? ((options.find((o) => o.value === value) || {} as Partial<SelectOption>).label || '') : value;
  const empty = shownValue === '' || shownValue == null;
  const hint = placeholder || t.empty;

  React.useEffect(() => {
    if (editing && field.current) { field.current.focus(); if (field.current.select && type !== 'select') field.current.select(); }
    if (!editing && refocus.current && read.current) { refocus.current = false; read.current.focus(); }
  }, [editing, type]);

  const open = () => { if (disabled || locked) return; setDraft(value); setError(null); setEditing(true); };
  const close = (back: boolean) => { refocus.current = back; setEditing(false); setSaving(false); };
  const cancel = (back: boolean) => { setDraft(value); setError(null); close(back); if (onCancel) onCancel(); };
  const save = (back: boolean) => {
    if (saving) return;
    if (draft === value) { close(back); return; }
    const problem = validate ? validate(draft) : null;
    if (problem) { setError(problem); return; }
    const done = (onConfirm ? onConfirm(draft) : null) as Promise<unknown> | null;
    if (done && typeof done.then === 'function') {
      setSaving(true);
      done.then(() => { close(back); announce(t.saved); }, (e: { message?: string } | null) => { setSaving(false); setError((e && e.message) || t.failed); });
    } else { close(back); announce(t.saved); }
  };
  const onKey = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cancel(true); }
    else if (e.key === 'Enter' && (type !== 'textarea' || e.ctrlKey || e.metaKey)) { e.preventDefault(); save(true); }
  };
  // leaving the inline edit saves; moving between the field and its buttons does not
  const onBlur = (e: React.FocusEvent<HTMLDivElement>) => { if (root.current && e.relatedTarget && root.current.contains(e.relatedTarget as Node)) return; if (editing && !saving) save(false); };

  if (!editing) {
    return (
      <div ref={root} className={cx('plx-inline-edit', 'plx-inline-edit--' + type, data && 'plx-inline-edit--data', className)} {...rest}>
        <button ref={read} type="button" className={cx('plx-inline-edit__read', empty && 'is-empty')} onClick={open} disabled={disabled}>
          <VisuallyHidden>{label + ', '}</VisuallyHidden>
          <span className="plx-inline-edit__value">{empty ? hint : (readView ? readView(value) : shownValue)}</span>
          {disabled || locked ? null : <VisuallyHidden>{', ' + t.edit}</VisuallyHidden>}
          {disabled || locked ? null : <span className="plx-inline-edit__hint" aria-hidden="true"><Icon name={PencilIcon} /></span>}
        </button>
      </div>
    );
  }
  const errId = id + '-error';
  const common = { ref: field, 'aria-label': label, value: draft, invalid: !!error, readOnly: saving || undefined, onKeyDown: onKey,
    'aria-describedby': error ? errId : undefined, onChange: (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement>) => { setDraft(e.target.value); if (error) setError(null); } };
  const control = type === 'textarea' ? <Textarea {...common} autoGrow placeholder={hint} />
    : type === 'select' ? <Select {...common} block options={options} disabled={saving || undefined} />
    : <Input {...common} data={data} placeholder={hint} />;
  return (
    <div ref={root} className={cx('plx-inline-edit', 'plx-inline-edit--' + type, 'is-editing', data && 'plx-inline-edit--data', className)} onBlur={onBlur} {...rest}>
      <div className="plx-inline-edit__edit">
        <div className="plx-inline-edit__control">{control}</div>
        {confirmButtons ? (
          <div className="plx-inline-edit__actions">
            <Button size="xs" iconOnly icon={CheckIcon} label={t.save + ' ' + label.toLowerCase()} loading={saving} onMouseDown={(e) => e.preventDefault()} onClick={() => save(true)} />
            <Button size="xs" iconOnly icon={CloseIcon} label={t.cancel} disabled={saving} onMouseDown={(e) => e.preventDefault()} onClick={() => cancel(true)} />
          </div>
        ) : null}
      </div>
      {error ? <div id={errId} className="plx-inline-edit__error" role="alert">{error}</div> : null}
    </div>
  );
}
