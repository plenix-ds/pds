/* Plenix · Commerce templates: buying
   Summary: The pages that turn a cart into an order (platform/templates/Commerce): the cart (Cart: the lines with their
     quantity steppers and Remove with Undo, the promo code, the summary with estimated totals and Check out), checkout
     (Checkout: the Wizard's steps, contact, delivery, payment and review, beside the order summary, ending in Place
     order), payment (Payment and PaymentFields: the method and the card fields as form UI only: nothing is charged or
     kept here) and the order confirmation (OrderConfirmation: the order number to copy, what happens next, the summary).
     Commerce.jsx documents every template.
   Usage:
     <Cart items={cart} currency="USD" onQuantityChange={setQty} onRemove={remove} onRestore={restore} onCheckout={go} continueHref="#/shop" />
     <Checkout items={cart} deliveryOptions={METHODS} onPlaceOrder={(details) => api.place(details)} />
     <Payment amount={64.5} currency="USD" onPay={(details) => provider.confirm(details)} onCancel={back} />
     <OrderConfirmation orderNumber="PX-10428" email="maya@example.com" items={cart} orderHref="#/orders/PX-10428" continueHref="#/shop" />
   Props:
     See Commerce.jsx (Cart, Checkout, PaymentFields, Payment, OrderConfirmation).
   Behavior:
     See Commerce.jsx.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { announce } from '../../utils/announce.tsx';
import { formatNumber } from '../../utils/format.ts';
import { useOptionalToast } from '../../components/Toast/Toast.jsx';
import { DeleteFlow } from '../../patterns/DeleteFlow/DeleteFlow.jsx';
import { Wizard } from '../../patterns/Wizard/Wizard.jsx';
import { Form, FormSection, FormActions } from '../../patterns/Form/Form.jsx';
import { PropertyList } from '../../patterns/PropertyList/PropertyList.jsx';
import { Field } from '../../components/Field/Field.tsx';
import { Input } from '../../components/Input/Input.tsx';
import { Checkbox, RadioGroup, ChoiceList } from '../../components/Checkbox/Checkbox.tsx';
import { CountrySelect } from '../../components/CountrySelect/CountrySelect.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { CopyButton } from '../../components/CopyButton/CopyButton.jsx';
import { Timeline } from '../../components/Timeline/Timeline.tsx';
import { StatusIcon } from '../../components/Icon/Icon.tsx';
import { CommerceLine, OrderSummary, orderTotals, money, useCommercePage } from './shared.jsx';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import BriefcaseIcon from 'plenix-platform/icons/plenix/briefcase';
import EdUndoIcon from 'plenix-platform/icons/plenix/ed-undo';
import LockIcon from 'plenix-platform/icons/plenix/lock';
import TrashIcon from 'plenix-platform/icons/plenix/trash';

/* ── the cart ── */

export function Cart({ items = [], currency = 'USD', onQuantityChange, onRemove, onRestore, onCheckout, continueHref, shipping, taxRate, discount, onApplyPromo,
  title, headingLevel = 1, strings, className }) {
  useCommercePage('cart');
  const t = useStrings('commerce.cart', strings);
  const toast = useOptionalToast();
  const [removed, setRemoved] = React.useState(null);
  const [code, setCode] = React.useState('');
  const [promo, setPromo] = React.useState({ discount: 0, label: '', error: '', busy: false });
  const totals = orderTotals(items, { shipping, taxRate, discount: (discount || 0) + promo.discount });
  const H = 'h' + Math.min(6, Math.max(1, headingLevel));
  // the total is announced when it changes (a quantity, a removal, a promo code)
  const first = React.useRef(true);
  React.useEffect(() => { if (first.current) { first.current = false; return; } announce(fill(t.total, { total: money(totals.total, currency) })); }, [totals.total]);
  const apply = async (e) => {
    if (e) e.preventDefault();
    if (!code.trim() || !onApplyPromo) return;
    setPromo((p) => Object.assign({}, p, { busy: true, error: '' }));
    try {
      const r = await onApplyPromo(code.trim());
      setPromo({ discount: (r && r.discount) || 0, label: (r && r.label) || code.trim(), error: '', busy: false });
      announce(fill(t.applied, { code: code.trim() }));
    } catch (err) { setPromo({ discount: 0, label: '', error: (err && err.message) || t.promoError, busy: false }); }
  };
  const count = totals.count === 1 ? t.item : fill(t.items, { n: formatNumber(totals.count) });
  if (!items.length && !removed) {
    return (
      <section className={cx('plx-commerce', 'plx-commerce--cart', className)} aria-label={title || t.title}>
        <EmptyState size="page" icon={BriefcaseIcon} title={t.empty} action={continueHref ? <Link href={continueHref} variant="standalone">{t.continue}</Link> : undefined}>{t.emptyText}</EmptyState>
      </section>
    );
  }
  return (
    <section className={cx('plx-commerce', 'plx-commerce--cart', className)} aria-label={title || t.title}>
      <header className="plx-commerce__head">
        <H className="plx-commerce__title">{title || t.title}</H>
        <Text variant="data">{count}</Text>
      </header>
      <div className="plx-commerce__columns">
        <div className="plx-commerce__main">
          {removed ? <Notice tone="info" actions={onRestore ? <Button size="xs" icon={EdUndoIcon} onClick={() => { onRestore(removed); setRemoved(null); }}>{t.undo}</Button> : undefined}
            onDismiss={() => setRemoved(null)}>{fill(t.removed, { title: removed.title })}</Notice> : null}
          <ul className="plx-commerce-lines" aria-label={t.lines}>
            {items.map((x) => (
              <CommerceLine key={x.id} item={x} currency={currency} onQuantityChange={onQuantityChange ? (n) => onQuantityChange(x, n) : undefined}
                remove={onRemove ? <DeleteFlow variant="undo" items={[{ id: x.id, label: x.title }]} noun={t.noun}
                  onDelete={() => { onRemove(x); if (!toast) setRemoved(x); }} onRestore={onRestore ? () => onRestore(x) : undefined}
                  trigger={<Button variant="ghost" size="xs" iconOnly icon={TrashIcon} label={fill(t.remove, { title: x.title })} />} /> : null} />
            ))}
          </ul>
        </div>
        <aside className="plx-commerce__aside" aria-label={t.checkout}>
          <OrderSummary items={items} currency={currency} totals={totals} estimated>
            {onApplyPromo ? (
              <form className="plx-commerce__promo" onSubmit={apply}>
                <Field label={t.promo} error={promo.error} description={promo.label ? fill(t.applied, { code: promo.label }) : undefined}>
                  <Input value={code} data autoComplete="off" onChange={(e) => setCode(e.target.value)} />
                </Field>
                <Button type="submit" loading={promo.busy}>{t.apply}</Button>
              </form>
            ) : null}
            <Button variant="primary" size="lg" disabled={!items.length} onClick={onCheckout}>{t.checkout}</Button>
            {continueHref ? <Link href={continueHref} variant="standalone">{t.continue}</Link> : null}
          </OrderSummary>
        </aside>
      </div>
    </section>
  );
}

/* ── payment: the method and the card fields (form UI only) ── */
// the card's brand from its first digits, and the number in groups as people type it (4 4 4 4, or 4 6 5 for American Express)
export function cardBrand(number) {
  const d = String(number || '').replace(/\D/g, '');
  if (/^4/.test(d)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'mastercard';
  if (/^3[47]/.test(d)) return 'amex';
  if (/^(6011|65|64[4-9])/.test(d)) return 'discover';
  return '';
}
export function formatCardNumber(number) {
  const d = String(number || '').replace(/\D/g, '').slice(0, 19);
  const groups = cardBrand(d) === 'amex' ? [4, 6, 5] : [4, 4, 4, 4, 3];
  const out = []; let i = 0;
  for (const g of groups) { if (i >= d.length) break; out.push(d.slice(i, i + g)); i += g; }
  return out.join(' ');
}
const formatExpiry = (v) => { const d = String(v || '').replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; };

export function PaymentFields({ value = {}, onChange, savedMethods = [], amount, currency = 'USD', billing = true, disabled = false, strings, className }) {
  const t = useStrings('commerce.pay', strings);
  const set = (k, v) => { if (onChange) onChange(Object.assign({}, value, { [k]: v })); };
  const method = value.method || (savedMethods.length ? savedMethods[0].id : 'card');
  const brand = cardBrand(value.number);
  const card = method === 'card';
  return (
    <div className={cx('plx-commerce__payment', className)}>
      {savedMethods.length ? <ChoiceList legend={t.method} value={method} onChange={(m) => set('method', m)}
        options={savedMethods.map((m) => ({ value: m.id, label: m.label, description: m.description })).concat([{ value: 'card', label: t.newCard }])} /> : null}
      {card ? (
        <>
          <Field label={t.number} description={brand ? t.brands[brand] : t.accepted} required>
            <Input data inputMode="numeric" autoComplete="cc-number" value={formatCardNumber(value.number)} disabled={disabled} maxLength={23} pattern="[0-9 ]{12,23}"
              onChange={(e) => set('number', e.target.value.replace(/\D/g, '').slice(0, 19))} />
          </Field>
          <div className="plx-commerce__pair">
            <Field label={t.expiry} description={t.expiryHint} required>
              <Input data inputMode="numeric" autoComplete="cc-exp" value={formatExpiry(value.expiry)} disabled={disabled} maxLength={7} pattern="(0[1-9]|1[0-2]) / [0-9]{2}"
                onChange={(e) => set('expiry', e.target.value.replace(/\D/g, '').slice(0, 4))} />
            </Field>
            <Field label={t.cvc} description={t.cvcHint} required>
              <Input data inputMode="numeric" autoComplete="cc-csc" value={value.cvc || ''} disabled={disabled} maxLength={4} pattern="[0-9]{3,4}"
                onChange={(e) => set('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))} />
            </Field>
          </div>
          <Field label={t.name} required>
            <Input autoComplete="cc-name" value={value.name || ''} disabled={disabled} onChange={(e) => set('name', e.target.value)} />
          </Field>
        </>
      ) : null}
      {billing ? <Checkbox label={t.billingSame} checked={value.billingSame !== false} disabled={disabled} onChange={(e) => set('billingSame', e.target.checked)} /> : null}
      {billing && value.billingSame === false ? (
        <fieldset className="plx-commerce__fields">
          <legend className="plx-commerce__legend">{t.billing}</legend>
          <Field label={t.street} required><Input autoComplete="billing street-address" value={value.billingStreet || ''} disabled={disabled} onChange={(e) => set('billingStreet', e.target.value)} /></Field>
          <div className="plx-commerce__pair">
            <Field label={t.city} required><Input autoComplete="billing address-level2" value={value.billingCity || ''} disabled={disabled} onChange={(e) => set('billingCity', e.target.value)} /></Field>
            <Field label={t.postal} required><Input data autoComplete="billing postal-code" value={value.billingPostal || ''} disabled={disabled} onChange={(e) => set('billingPostal', e.target.value)} /></Field>
          </div>
        </fieldset>
      ) : null}
      <Notice tone="info" icon={LockIcon}>{t.secure}</Notice>
      {typeof amount === 'number' ? <Text as="p">{t.charge} <Text variant="data">{money(amount, currency)}</Text></Text> : null}
    </div>
  );
}


export function Payment({ amount, currency = 'USD', savedMethods, defaultValue, onPay, onCancel, title, strings, className }) {
  useCommercePage('payment');
  const t = useStrings('commerce.payment', strings);
  const [value, setValue] = React.useState(() => Object.assign({ billingSame: true }, defaultValue));
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const lock = React.useRef(false);
  // one submission at a time: Pay turns off and shows its spinner until the page answers; a decline keeps every field
  const submit = async (e) => {
    e.preventDefault();
    if (lock.current) return;
    lock.current = true; setBusy(true); setError('');
    try { if (onPay) await onPay(value); announce(t.paid); }
    catch (err) { setError((err && err.message) || t.declinedText); announce(t.declined, { politeness: 'assertive' }); }
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

export function Checkout({ items = [], currency = 'USD', deliveryOptions = [], defaultValue, savedMethods, taxRate, discount, onPlaceOrder, onCancel,
  signInHref, strings, className }) {
  useCommercePage('checkout');
  const t = useStrings('commerce.checkout', strings);
  const [d, setD] = React.useState(() => Object.assign({ email: '', name: '', street: '', street2: '', city: '', region: '', postal: '', country: 'US', phone: '',
    delivery: deliveryOptions.length ? deliveryOptions[0].value : '', payment: { billingSame: true } }, defaultValue));
  const set = (k) => (e) => setD(Object.assign({}, d, { [k]: e && e.target ? e.target.value : e }));
  const method = deliveryOptions.find((o) => o.value === d.delivery);
  const totals = orderTotals(items, { shipping: method ? method.price : 0, taxRate, discount });
  const saved = (savedMethods || []).find((m) => m.id === (d.payment.method || (savedMethods && savedMethods.length ? savedMethods[0].id : 'card')));
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
          options={deliveryOptions.map((o) => ({ value: o.value, label: o.label + ' · ' + (o.price ? money(o.price, currency) : t.free), description: o.description }))} /> : null}
      </>) },
    { id: 'payment', label: t.payment, content: <PaymentFields value={d.payment} onChange={(p) => setD(Object.assign({}, d, { payment: p }))} savedMethods={savedMethods} strings={strings} /> },
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
      <ul className="plx-commerce-lines" aria-label={t.items}>{items.map((x) => <CommerceLine key={x.id} item={x} currency={currency} />)}</ul>
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

export function OrderConfirmation({ orderNumber, email, items = [], currency = 'USD', totals, delivery = {}, steps = [], orderHref, continueHref, headingLevel = 1, autoFocus = true, strings, className }) {
  useCommercePage('order-confirmation');
  const t = useStrings('commerce.confirm', strings);
  const uid = useUid('plx-commerce');
  const heading = React.useRef(null);
  // the page's heading takes the focus when it opens: the success is the first thing read
  React.useEffect(() => { if (autoFocus && heading.current) heading.current.focus(); }, []);
  const H = 'h' + Math.min(6, Math.max(1, headingLevel)), H2 = 'h' + Math.min(6, headingLevel + 1);
  return (
    <article className={cx('plx-commerce', 'plx-commerce--confirmation', className)}>
      <header className="plx-commerce__confirmed">
        <StatusIcon tone="success" size="lg" />
        <H ref={heading} tabIndex={-1} className="plx-commerce__title">{t.title}</H>
        <span className="plx-commerce__order-number">
          <Text variant="secondary">{t.number}</Text>
          <Text variant="data">{orderNumber}</Text>
          <CopyButton value={orderNumber} label={t.copy} size="xs" />
        </span>
        {email ? <Text as="p">{fill(t.sent, { email })}</Text> : null}
      </header>
      <div className="plx-commerce__columns">
        <div className="plx-commerce__main">
          {steps.length ? (
            <section className="plx-commerce__section" aria-labelledby={uid + '-next'}>
              <H2 id={uid + '-next'} className="plx-commerce__subtitle">{t.next}</H2>
              <Timeline label={t.next} items={steps} />
            </section>
          ) : null}
          {delivery.address || delivery.method ? (
            <PropertyList>
              {delivery.address ? <PropertyList.Item label={t.delivery}>{delivery.address}</PropertyList.Item> : null}
              {delivery.method ? <PropertyList.Item label={t.method}>{delivery.method}</PropertyList.Item> : null}
            </PropertyList>
          ) : null}
          <ul className="plx-commerce-lines" aria-label={t.items}>{items.map((x) => <CommerceLine key={x.id} item={x} currency={currency} />)}</ul>
          <span className="plx-commerce__links">
            {orderHref ? <Link href={orderHref} variant="standalone">{t.view}</Link> : null}
            {continueHref ? <Link href={continueHref} variant="standalone">{t.continue}</Link> : null}
          </span>
        </div>
        <aside className="plx-commerce__aside" aria-label={t.items}>
          <OrderSummary items={items} currency={currency} totals={totals} headingLevel={Math.min(6, headingLevel + 1)} />
        </aside>
      </div>
    </article>
  );
}

