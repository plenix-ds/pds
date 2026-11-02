/* Plenix · MetadataEditor
   Summary: Editable metadata inline or in a validated form; bulk mode applies only explicitly selected fields.
   Usage: <MetadataEditor fields={fields} values={metadata} variant="form" onSave={saveMetadata} />
   Props:
     fields: [{ id, label, type: text | textarea | select, options, required, data, validate(value) }].
     values: saved field map; onSave(patch): persistence promise; variant: inline | form | bulk; disabled.
     strings: save, reset, apply, required, failed, saved; className.
   Behavior: InlineEdit saves one field. Forms preserve drafts on failure; bulk mode never overwrites untouched fields.
   Notes: The caller owns schema and server validation. Saved prop updates reset a clean draft; dirty edits are retained.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { InlineEdit } from '../../components/InlineEdit/InlineEdit.tsx';
import { Stack, Inline } from '../../components/Stack/Stack.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Input, Textarea, Select } from '../../components/Input/Input.tsx';
import { Checkbox } from '../../components/Checkbox/Checkbox.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { useUnsavedGuard } from '../../providers/UnsavedGuard.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';

export function MetadataEditor({ fields = [], values = {}, onSave, variant = 'inline', disabled = false, strings, className }) {
  devWarn('MetadataEditor', { variant }, { variant: ['inline','form','bulk'] });
  const t = useStrings('metadataEditor', strings);
  const [draft, setDraft] = React.useState(values), [touched, setTouched] = React.useState({}), [error, setError] = React.useState(''), [busy, setBusy] = React.useState(false), [saved, setSaved] = React.useState(false);
  const lock = React.useRef(false), dirty = Object.values(touched).some(Boolean);
  React.useEffect(() => { if (!dirty) setDraft(values); }, [values, dirty]);
  const guard = useUnsavedGuard(dirty, t.unsaved);
  const valid = (f, value) => f.required && !String(value ?? '').trim() ? t.required : f.validate ? f.validate(value) : '';
  const reset = guard(() => { setDraft(values); setTouched({}); setError(''); setSaved(false); });
  const submit = async (e) => {
    e.preventDefault(); if (lock.current) return;
    const chosen = variant === 'bulk' ? fields.filter((f) => touched[f.id]) : fields;
    const problem = chosen.map((f) => valid(f, draft[f.id])).find(Boolean); if (problem) { setError(problem); return; }
    if (!chosen.length) return;
    lock.current = true; setBusy(true); setError(''); setSaved(false);
    try { await onSave(Object.fromEntries(chosen.map((f) => [f.id, draft[f.id] ?? '']))); setTouched({}); setSaved(true); }
    catch (e) { setError(t.failed); } finally { lock.current = false; setBusy(false); }
  };
  return <Stack as={variant === 'inline' ? 'div' : 'form'} onSubmit={variant === 'inline' ? undefined : submit} className={cx('plx-metadata-editor', className)} aria-busy={busy}>
    {fields.map((f) => variant === 'inline' ? <InlineEdit key={f.id} label={f.label} value={values[f.id] ?? ''} type={f.type} options={f.options} data={f.data} validate={(v) => valid(f, v)}
      disabled={disabled || !onSave} onConfirm={(v) => onSave({ [f.id]: v })} strings={strings} /> : <Stack key={f.id} gap="sm">
      {variant === 'bulk' ? <Checkbox label={t.apply.replace('{field}', f.label)} checked={!!touched[f.id]} disabled={busy || disabled} onChange={(e) => setTouched({ ...touched, [f.id]: e.target.checked })} /> : null}
      <Field label={f.label} required={f.required && (variant !== 'bulk' || touched[f.id])}>
        {React.createElement(f.type === 'textarea' ? Textarea : f.type === 'select' ? Select : Input, { value: draft[f.id] ?? '', options: f.options, data: f.data,
          disabled: busy || disabled || variant === 'bulk' && !touched[f.id], onChange: (e) => { setDraft({ ...draft, [f.id]: e.target.value }); setTouched({ ...touched, [f.id]: true }); setSaved(false); } })}
      </Field></Stack>)}
    {variant !== 'inline' ? <Inline><Button type="submit" variant="primary" disabled={busy || disabled || !onSave || !dirty}>{t.save}</Button><Button disabled={busy || disabled || !dirty} onClick={reset}>{t.reset}</Button></Inline> : null}
    {error ? <Notice tone="danger">{error}</Notice> : null}{saved ? <Badge tone="success" icon={CheckIcon} role="status">{t.saved}</Badge> : null}
  </Stack>;
}