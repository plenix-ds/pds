/* Plenix · Commerce: Checkout: the checkout page
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { announce } from '../../utils/announce.tsx';
import { Wizard as WizardJs } from '../../patterns/Wizard/Wizard.tsx';
import { PropertyList as PropertyListJs } from '../../patterns/PropertyList/PropertyList.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Input } from '../../components/Input/Input.tsx';
import { RadioGroup } from '../../components/Checkbox/Checkbox.tsx';
import { CountrySelect } from '../../components/CountrySelect/CountrySelect.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { PaymentFields } from './PaymentFields.tsx';
import { useCommercePage } from './useCommercePage.ts';
import { CommerceLine, OrderSummary } from './shared.tsx';
import { money, orderTotals } from './totals.ts';
const Wizard: any = WizardJs;
const PropertyList: any = PropertyListJs;

/** @public the prop type of Checkout (ADR 0011) */
export type CheckoutProps = {
  items?: unknown[];
  currency?: string;
  deliveryOptions?: unknown[];
  defaultValue?: unknown;
  savedMethods?: unknown;
  taxRate?: unknown;
  discount?: unknown;
  onPlaceOrder?: (details: Record<string, unknown>) => unknown;
  onCancel?: () => void;
  signInHref?: string;
  strings?: Record<string, string>;
  className?: string;
};

export function Checkout(props: CheckoutProps) {
  const { items = [], currency = 'USD', deliveryOptions = [], defaultValue, savedMethods, taxRate, discount, onPlaceOrder, onCancel,
  signInHref, strings, className } = props as any;
  useCommercePage('checkout');
  const t: any = useStrings('commerce.checkout', strings);
  const [d, setD] = React.useState(() => Object.assign({ email: '', name: '', street: '', street2: '', city: '', region: '', postal: '', country: 'US', phone: '',
    delivery: deliveryOptions.length ? deliveryOptions[0].value : '', payment: { billingSame: true } }, defaultValue));
  const set = (k: any) => (e: any) => setD(Object.assign({}, d, { [k]: e && e.target ? e.target.value : e }));
  const method = deliveryOptions.find((o: any) => o.value === d.delivery);
  const totals = orderTotals(items, { shipping: method ? method.price : 0, taxRate, discount });
  const saved = (savedMethods || []).find((m: any) => m.id === (d.payment.method || (savedMethods && savedMethods.length ? savedMethods[0].id : 'card')));
  const paidWith = saved ? saved.label : d.payment.number ? fill(t.card, { last4: String(d.payment.number).slice(-4) }) : '';
  const steps = [
    { id: 'contact', label: t.contact, content: (
      <>
        <Field label={t.email} description={t.emailHint} required><Input type="email" autoComplete="email" value={d.email} onChange={set('email')} /></Field>
        {signInHref ? <Text as="p">{t.account} <Link href={signInHref}>{t.signIn}</Link></Text> : null}
      </>) },
    { id: 'delivery', label: t.delivery, content: (
      <>
        <Field label={t.name} required><Input autoComplete="shipping name" value={d.name} onChange={set('name')} /></Field>
        <Field label={t.street} required><Input autoComplete="shipping address-line1" value={d.street} onChange={set('street')} /></Field>
        <Field label={t.street2}><Input autoComplete="shipping address-line2" value={d.street2} onChange={set('street2')} /></Field>
        <div className="plx-commerce__pair">
          <Field label={t.city} required><Input autoComplete="shipping address-level2" value={d.city} onChange={set('city')} /></Field>
          <Field label={t.region}><Input autoComplete="shipping address-level1" value={d.region} onChange={set('region')} /></Field>
        </div>
        <div className="plx-commerce__pair">
          <Field label={t.postal} required><Input data autoComplete="shipping postal-code" value={d.postal} onChange={set('postal')} /></Field>
          <Field label={t.country}><CountrySelect value={d.country} onChange={(c) => setD(Object.assign({}, d, { country: c }))} /></Field>
        </div>
        <Field label={t.phone} description={t.phoneHint}><Input type="tel" autoComplete="shipping tel" value={d.phone} onChange={set('phone')} /></Field>
        {deliveryOptions.length ? <RadioGroup label={t.method} value={d.delivery} onChange={(v) => setD(Object.assign({}, d, { delivery: v }))}
          options={deliveryOptions.map((o: any) => ({ value: o.value, label: o.label + ' · ' + (o.price ? money(o.price, currency) : t.free), description: o.description }))} /> : null}
      </>) },
    { id: 'payment', label: t.payment, content: <PaymentFields value={d.payment} onChange={(p: any) => setD(Object.assign({}, d, { payment: p }))} savedMethods={savedMethods} strings={strings} /> },
  ];
  const review = (
    <>
      <Text as="p" variant="secondary">{t.checkAnswers}</Text>
      <PropertyList>
        <PropertyList.Item label={t.email}>{d.email}</PropertyList.Item>
        <PropertyList.Item label={t.delivery}>{[d.name, d.street, d.street2, [d.postal, d.city].filter(Boolean).join(' '), d.region].filter(Boolean).join(', ')}</PropertyList.Item>
        {method ? <PropertyList.Item label={t.method}>{method.label}</PropertyList.Item> : null}
        <PropertyList.Item label={t.payment}>{paidWith}</PropertyList.Item>
      </PropertyList>
      <ul className="plx-commerce-lines" aria-label={t.items}>{items.map((x: any) => <CommerceLine key={x.id} item={x} currency={currency} />)}</ul>
    </>
  );
  return (
    <div className={cx('plx-commerce', 'plx-commerce--checkout', className)}>
      <div className="plx-commerce__columns">
        <div className="plx-commerce__main">
          <Wizard label={t.label} steps={steps} summary={review} onCancel={onCancel}
            onComplete={async () => { if (onPlaceOrder) await onPlaceOrder(d); announce(t.placed); }}
            strings={{ complete: t.placeOrder, summary: t.review, cancel: t.cancel }} />
        </div>
        <aside className="plx-commerce__aside" aria-label={t.summary}>
          <OrderSummary items={items} currency={currency} totals={totals} showItems estimated headingLevel={2} />
        </aside>
      </div>
    </div>
  );
}

/* ── the order confirmation ── */

