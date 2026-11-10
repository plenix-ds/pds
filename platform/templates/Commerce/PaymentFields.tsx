/* Plenix · Commerce: PaymentFields: the method and the card fields (form UI only)
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Field } from '../../components/Field/Field.tsx';
import { Input } from '../../components/Input/Input.tsx';
import { Checkbox, ChoiceList } from '../../components/Checkbox/Checkbox.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import LockIcon from 'plenix-platform/icons/plenix/lock';
import { cardBrand, formatCardNumber } from './card.ts';
import { money } from './totals.ts';

export const formatExpiry = (v: any) => { const d = String(v || '').replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; };

/** @public the prop type of PaymentFields (ADR 0011) */
export type PaymentFieldsProps = {
  value?: Record<string, unknown>;
  onChange?: (value: Record<string, unknown>) => void;
  savedMethods?: unknown[];
  amount?: unknown;
  currency?: string;
  billing?: boolean;
  disabled?: boolean;
  strings?: Record<string, string>;
  className?: string;
};

export function PaymentFields(props: PaymentFieldsProps) {
  const { value = {}, onChange, savedMethods = [], amount, currency = 'USD', billing = true, disabled = false, strings, className } = props as any;
  const t: any = useStrings('commerce.pay', strings);
  const set = (k: any, v: any) => { if (onChange) onChange(Object.assign({}, value, { [k]: v })); };
  const method = value.method || (savedMethods.length ? savedMethods[0].id : 'card');
  const brand = cardBrand(value.number);
  const card = method === 'card';
  return (
    <div className={cx('plx-commerce__payment', className)}>
      {savedMethods.length ? <ChoiceList legend={t.method} value={method} onChange={(m) => set('method', m)}
        options={savedMethods.map((m: any) => ({ value: m.id, label: m.label, description: m.description })).concat([{ value: 'card', label: t.newCard }])} /> : null}
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

