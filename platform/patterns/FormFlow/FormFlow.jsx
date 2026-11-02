/* Plenix · FormFlow
   Summary: Create or edit on a page, in place, in a dialog or drawer with unsaved-change protection.
   Usage: <FormFlow title="Create record" initialValue={{name: ''}} onSubmit={save}>{({value, setValue}) => fields}</FormFlow>
   Props:
     mode: "create" (default) or "edit"; surface: "page", "inline", "dialog" or "drawer".
     open: active (default true); title: form name; initialValue: immutable record; sessionKey: record identity.
     validate(value): error string or false; onSubmit(value): promise; onSuccess(result): after persistence.
     onCancel(): exit after confirmation; children({ value, setValue, busy }): Platform fields.
     strings: { create, save, cancel, failed, invalid, saved, unsaved, close }; className: extra classes.
   Behavior:
     Values reset on reopen or sessionKey change. Failed saves retain values and show an error.
     Cancel, close, Escape and navigation protect dirty values. Pending submissions cannot repeat.
     Success clears dirty state and shows a Toast; wrap the application in ToastProvider.
   Notes:
     Use immutable updates and a stable sessionKey per record. Never nest another Form in children.
*/
import React from 'react';
import { Form, FormActions } from '../Form/Form.jsx';
import { Dialog, Drawer } from '../../components/Dialog/Dialog.jsx';
import { Button } from '../../components/Button/Button.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { Fieldset } from '../../components/Fieldset/Fieldset.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { useToast } from '../../components/Toast/Toast.jsx';
import { useUnsavedGuard } from '../../providers/UnsavedGuard.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

export function FormFlow({ mode = 'create', surface = 'page', open = true, title, initialValue, sessionKey, validate, onSubmit, onSuccess, onCancel, children, strings, className }) {
  const t = useStrings('formFlow', strings);
  const [value, setValue] = React.useState(initialValue), [saved, setSaved] = React.useState(initialValue);
  const [busy, setBusy] = React.useState(false), [error, setError] = React.useState('');
  const lock = React.useRef(false), generation = React.useRef(0), alive = React.useRef(false);
  const initial = React.useRef(initialValue); initial.current = initialValue;
  const toast = useToast();
  React.useEffect(() => { alive.current = true; return () => { alive.current = false; generation.current++; }; }, []);
  React.useEffect(() => { generation.current++; lock.current = false; setBusy(false); setValue(initial.current); setSaved(initial.current); setError(''); }, [open, sessionKey]);
  const guard = useUnsavedGuard(open && !Object.is(value, saved), t.unsaved);
  const cancel = guard(() => { if (!lock.current && onCancel) onCancel(); });
  const submit = async (e) => {
    e.preventDefault(); if (lock.current) return;
    lock.current = true; setBusy(true); setError('');
    const run = generation.current;
    try {
      const problem = validate ? await validate(value) : '';
      if (!alive.current || run !== generation.current) return;
      if (problem === false || typeof problem === 'string' && problem) { setError(typeof problem === 'string' ? problem : t.invalid); return; }
      const result = await onSubmit(value);
      if (!alive.current || run !== generation.current) return;
      setSaved(value); toast.show(t.saved, { tone: 'success' });
      if (onSuccess) onSuccess(result);
    } catch (e) { if (alive.current && run === generation.current) setError(t.failed); }
    finally { if (alive.current && run === generation.current) { lock.current = false; setBusy(false); } }
  };
  const overlay = surface === 'dialog' || surface === 'drawer';
  const body = <Form label={title} className={cx('plx-form-flow', className)} aria-busy={busy} onSubmit={submit}>
    {!overlay && title ? <Text as="h2" variant="heading">{title}</Text> : null}
    <Fieldset legend={title} hideLegend gap="md" disabled={busy}>{children({ value, setValue, busy })}</Fieldset>
    {error ? <Notice tone="danger">{error}</Notice> : null}
    <FormActions sticky={false}><Button onClick={cancel} disabled={busy}>{t.cancel}</Button>
      <Button type="submit" variant="primary" disabled={busy}>{mode === 'edit' ? t.save : t.create}</Button></FormActions>
  </Form>;
  if (!overlay) return open ? body : null;
  const Shell = surface === 'drawer' ? Drawer : Dialog;
  return <Shell open={open} title={title} onClose={cancel} dismissible={!busy} closeLabel={t.close}>{open ? body : null}</Shell>;
}
