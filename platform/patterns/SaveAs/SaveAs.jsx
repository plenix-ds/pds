/* Plenix · SaveAs
   Summary: Save a copy with a name, a tree location and an optional file format.
   Usage: <SaveAs locations={folders} initialLocation="root" onSave={saveCopy} />
   Props:
     locations: TreeSelect nodes; initialName, initialLocation, initialFormat: starting values; formats: Select options.
     onSave({ name, location, format }): persistence promise; onCancel(): guarded exit.
     strings: { title, name, location, format, save, cancel, required, failed, unsaved }; className: extra classes.
   Behavior:
     Blank names and locations fail validation. Values survive failed saves. Duplicate submissions are blocked.
   Notes:
     The caller resolves naming conflicts and unmounts after success. Never overwrite the original record.
*/
import React from 'react';
import { Form, FormActions } from '../Form/Form.jsx';
import { Field } from '../../components/Field/Field.tsx';
import { Input, Select } from '../../components/Input/Input.tsx';
import { TreeSelect } from '../../components/TreeSelect/TreeSelect.jsx';
import { Button } from '../../components/Button/Button.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { useUnsavedGuard } from '../../providers/UnsavedGuard.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

export function SaveAs({ locations = [], initialName = '', initialLocation = '', initialFormat = '', formats = [], onSave, onCancel, strings, className }) {
  const t = useStrings('saveAs', strings);
  const [name, setName] = React.useState(initialName), [location, setLocation] = React.useState(initialLocation);
  const [format, setFormat] = React.useState(initialFormat || formats[0]?.value || '');
  const [busy, setBusy] = React.useState(false), [error, setError] = React.useState(''), [saved, setSaved] = React.useState(false);
  const lock = React.useRef(false);
  const guard = useUnsavedGuard(!saved && (name !== initialName || location !== initialLocation || format !== (initialFormat || formats[0]?.value || '')), t.unsaved);
  const submit = async (e) => {
    e.preventDefault(); if (lock.current) return;
    if (!name.trim() || location === '' || location == null) { setError(t.required); return; }
    lock.current = true; setBusy(true); setError('');
    try { await onSave({ name: name.trim(), location, format }); setSaved(true); }
    catch (e) { setError(t.failed); } finally { lock.current = false; setBusy(false); }
  };
  return <Form label={t.title} className={cx('plx-save-as', className)} aria-busy={busy} onSubmit={submit}>
    <Field label={t.name} required><Input value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} disabled={busy} /></Field>
    <Field label={t.location} required><TreeSelect nodes={locations} value={location} onChange={(v) => { setLocation(v); setSaved(false); }} disabled={busy} label={t.location} /></Field>
    {formats.length ? <Field label={t.format}><Select options={formats} value={format} onChange={(e) => { setFormat(e.target.value); setSaved(false); }} disabled={busy} /></Field> : null}
    {error ? <Notice tone="danger">{error}</Notice> : null}
    <FormActions sticky={false}>{onCancel ? <Button onClick={guard(onCancel)} disabled={busy}>{t.cancel}</Button> : null}
      <Button type="submit" variant="primary" disabled={busy}>{t.save}</Button></FormActions>
  </Form>;
}
