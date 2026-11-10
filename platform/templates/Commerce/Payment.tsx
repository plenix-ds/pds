/* Plenix · Commerce: Payment: the payment page
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { announce } from '../../utils/announce.tsx';
import { Form, FormSection, FormActions } from '../../patterns/Form/Form.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { PaymentFields } from './PaymentFields.tsx';
import { useCommercePage } from './useCommercePage.ts';
import { money } from './totals.ts';

/** @public the prop type of Payment (ADR 0011) */
export type PaymentProps = {
  amount?: unknown;
  currency?: string;
  savedMethods?: unknown;
  defaultValue?: unknown;
  onPay?: (details: Record<string, unknown>) => unknown;
  onCancel?: () => void;
  title?: React.ReactNode;
  strings?: Record<string, string>;
  className?: string;
};

export function Payment(props: PaymentProps) {
  const { amount, currency = 'USD', savedMethods, defaultValue, onPay, onCancel, title, strings, className } = props as any;
  useCommercePage('payment');
  const t: any = useStrings('commerce.payment', strings);
  const [value, setValue] = React.useState(() => Object.assign({ billingSame: true }, defaultValue));
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const lock = React.useRef(false);
  // one submission at a time: Pay turns off and shows its spinner until the page answers; a decline keeps every field
  const submit = async (e: any) => {
    e.preventDefault();
    if (lock.current) return;
    lock.current = true; setBusy(true); setError('');
    try { if (onPay) await onPay(value); announce(t.paid); }
    catch (err: any) { setError((err && err.message) || t.declinedText); announce(t.declined, { politeness: 'assertive' }); }
    finally { lock.current = false; setBusy(false); }
  };
  return (
    <Form label={title || t.title} onSubmit={submit} className={cx('plx-commerce', 'plx-commerce--payment', className)}>
      <FormSection title={title || t.title} description={t.description}>
        {error ? <Notice tone="danger" title={t.declined}>{error}</Notice> : null}
        <PaymentFields value={value} onChange={setValue} savedMethods={savedMethods} amount={amount} currency={currency} disabled={busy} strings={strings} />
      </FormSection>
      <FormActions sticky={false}>
        {onCancel ? <Button onClick={onCancel} disabled={busy}>{t.cancel}</Button> : null}
        <Button type="submit" variant="primary" loading={busy} disabled={busy}>{fill(t.pay, { amount: money(amount, currency) })}</Button>
      </FormActions>
    </Form>
  );
}

/* ── checkout: contact, delivery, payment, review ── */

