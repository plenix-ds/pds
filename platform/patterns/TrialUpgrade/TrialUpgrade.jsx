/* Plenix · TrialUpgrade
   Summary: A trial banner and optional plan comparison dialog with explicit upgrade submission.
   Usage: <TrialUpgrade message={trialMessage} plans={plans} attributes={rows} onUpgrade={choosePlan} />
   Props:
     message: caller-formatted trial details; plans: ComparisonView items; attributes: compared feature rows.
     onUpgrade(planId): persistence or checkout promise; defaultOpen: show comparison initially (default false).
     strings: { trial, compare, title, plan, upgrade, cancel, failed, upgraded }; className.
   Behavior:
     Opening the comparison never purchases a plan. Upgrade is explicit, waits for persistence and retains selection on error.
     The caller supplies prices, terms and billing behavior; no price or trial date is invented.
   Notes:
     The pattern owns no payment processing or subscription authorization.
*/
import React from 'react';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Banner } from '../../components/Banner/Banner.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Dialog } from '../../components/Dialog/Dialog.jsx';
import { Field } from '../../components/Field/Field.tsx';
import { Select } from '../../components/Input/Input.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { ComparisonView } from '../ComparisonView/ComparisonView.jsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';

export function TrialUpgrade({ message, plans = [], attributes = [], onUpgrade, defaultOpen = false, strings, className }) {
  const t = useStrings('trialUpgrade', strings);
  const [open, setOpen] = React.useState(defaultOpen), [plan, setPlan] = React.useState(plans[0]?.id || ''), [busy, setBusy] = React.useState(false), [error, setError] = React.useState(''), [saved, setSaved] = React.useState(false);
  const lock = React.useRef(false);
  const upgrade = async () => {
    if (lock.current || !plans.some((p) => p.id === plan)) return; lock.current = true; setBusy(true); setError('');
    try { await onUpgrade(plan); setSaved(true); setOpen(false); } catch (e) { setError(t.failed); } finally { lock.current = false; setBusy(false); }
  };
  return <Stack className={cx('plx-trial-upgrade', className)}>
    <Banner tone="neutral" title={t.trial} actions={<Button size="sm" onClick={() => setOpen(true)}>{t.compare}</Button>}>{message}</Banner>
    {saved ? <Badge tone="success" icon={CheckIcon} role="status">{t.upgraded}</Badge> : null}
    <Dialog open={open} title={t.title} size="lg" dismissible={!busy} onClose={() => { if (!lock.current) setOpen(false); }}
      footer={<><Button disabled={busy} onClick={() => setOpen(false)}>{t.cancel}</Button><Button variant="primary" disabled={busy || !onUpgrade || !plans.some((p) => p.id === plan)} onClick={upgrade}>{t.upgrade}</Button></>}>
      <ComparisonView items={plans} attributes={attributes} mode="matrix" label={t.compare} strings={strings} />
      <Field label={t.plan}><Select value={plan} disabled={busy} onChange={(e) => setPlan(e.target.value)} options={plans.map((p) => ({ value: p.id, label: p.title }))} /></Field>
      {error ? <Notice tone="danger">{error}</Notice> : null}
    </Dialog>
  </Stack>;
}
