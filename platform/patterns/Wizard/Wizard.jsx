/* Plenix · Wizard
   Summary: Named form steps with validation, Back and Next, and an optional final summary.
   Usage: <Wizard label="Create record" steps={steps} onComplete={save} />
   Props:
     steps: [{ id, label, content, validate }]; validate resolves an error string, false, or nothing when valid.
     label: form name; defaultStep: initial index; navigation: "linear" (default) or "free".
     summary: optional review content; onComplete(): persistence promise; onCancel(): exit.
     strings: { back, next, complete, cancel, summary, invalid, failed, steps }; className: extra classes.
   Behavior:
     Forward navigation validates the current step; completion validates all steps and awaits persistence.
     Inactive steps stay mounted, hidden and disabled. Moving steps focuses the new heading.
     Free navigation uses Tabs so unvisited steps are never announced as complete.
     Failed validation or persistence keeps values. Pending actions cannot repeat.
   Notes:
     Callers own immutable values and per-step validation. Compose fields from Platform components.
*/
import React from 'react';
import { Form, FormActions } from '../Form/Form.jsx';
import { Tabs } from '../../components/Tabs/Tabs.tsx';
import { ProgressSteps } from '../../components/ProgressSteps/ProgressSteps.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

export function Wizard({ steps = [], label, defaultStep = 0, navigation = 'linear', summary, onComplete, onCancel, strings, className }) {
  const t = useStrings('wizard', strings);
  const all = summary == null ? steps : steps.concat([{ id: 'summary', label: t.summary, content: summary }]);
  const [index, setIndex] = React.useState(defaultStep), [busy, setBusy] = React.useState(false), [error, setError] = React.useState('');
  const lock = React.useRef(false), alive = React.useRef(false), moved = React.useRef(false);
  const base = 'plx-wizard-' + React.useId().replace(/:/g, '');
  const at = Math.max(0, Math.min(index, all.length - 1));
  React.useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  React.useEffect(() => { if (moved.current) document.getElementById(base + '-' + at)?.focus(); }, [at, base]);
  const move = (n) => { moved.current = true; setError(''); setIndex(n); };
  const valid = async (i) => {
    const section = document.getElementById(base + '-' + i)?.closest('fieldset');
    if (section) {
      const disabled = section.disabled; section.disabled = false;
      const nativeValid = Array.from(section.querySelectorAll("input, select, textarea")).every((field) => field.checkValidity()); section.disabled = disabled;
      if (!nativeValid) { if (alive.current) { move(i); setError(t.invalid); } return false; }
    }
    const result = all[i].validate ? await all[i].validate() : '';
    if (result === false || typeof result === 'string' && result) {
      if (alive.current) { move(i); setError(typeof result === 'string' ? result : t.invalid); }
      return false;
    }
    return alive.current;
  };
  const go = async (n, finish = false) => {
    if (lock.current || !all.length) return;
    lock.current = true; setBusy(true); setError('');
    try {
      if (finish) {
        for (let i = 0; i < all.length; i++) if (!await valid(i)) return;
        if (onComplete) await onComplete();
      } else if (n <= at || navigation === 'free' || await valid(at)) { if (alive.current) move(n); }
    } catch (e) { if (alive.current) setError(t.failed); }
    finally { lock.current = false; if (alive.current) setBusy(false); }
  };
  if (!all.length) return null;
  return <Form id={base} label={label} className={cx('plx-wizard', className)} aria-busy={busy}
    onSubmit={(e) => { e.preventDefault(); go(at + 1, at === all.length - 1); }}>
    {navigation === 'free' ? <Tabs label={t.steps} variant="folder" idBase={base} value={String(at)}
      items={all.map((s, i) => ({ value: String(i), label: s.label, disabled: busy }))} onChange={(n) => go(Number(n))} />
      : <ProgressSteps label={t.steps} current={at} steps={all.map((s) => ({ label: s.label, disabled: busy }))} onStepClick={(n) => go(n)} />}
    {all.map((s, i) => <Stack key={s.id || i} className="plx-wizard__step" as="fieldset" hidden={i !== at} disabled={i !== at || busy}
      id={base + "-panel-" + i} role={navigation === "free" ? "tabpanel" : undefined} aria-labelledby={navigation === "free" ? base + "-tab-" + i : undefined}>
      <Text as="legend" variant="heading" id={base + '-' + i} tabIndex={-1}>{s.label}</Text>{s.content}</Stack>)}
    {error ? <Notice tone="danger">{error}</Notice> : null}
    <FormActions sticky={false}>
      {onCancel ? <Button onClick={onCancel} disabled={busy}>{t.cancel}</Button> : null}
      <Button onClick={() => go(at - 1)} disabled={busy || at === 0}>{t.back}</Button>
      <Button type="submit" variant="primary" disabled={busy}>{at === all.length - 1 ? t.complete : t.next}</Button>
    </FormActions>
  </Form>;
}
