/* Plenix · NumberInput
   Summary: A field for a number: typed freely in the reader's locale, checked and formatted when the field is left,
     stepped with the arrow keys, and shown with what it measures: a currency, a percent sign or a unit inside the field.
     Stepper buttons (minus and plus at its end) or the quantity form (minus, the count, plus) change it one step at a time.
     The value is in the data font (Reddit Mono).
   Usage:
     <Field label="Copies"><NumberInput value={n} onChange={setN} min={1} max={99} stepper="buttons" width="sm" /></Field>
     <Field label="Price"><NumberInput value={price} onChange={setPrice} format="currency" currency="USD" min={0} /></Field>
     <Field label="Discount"><NumberInput value={pct} onChange={setPct} format="percent" min={0} max={100} /></Field>
     <Field label="Weight"><NumberInput value={kg} onChange={setKg} unit="kg" step={0.1} decimals={1} /></Field>
     <NumberInput stepper="quantity" value={qty} onChange={setQty} min={1} max={5} aria-label="Quantity, Blue chair" />
   Props:
     value: the number (null when empty); with onChange, a controlled field
     defaultValue: a number: the first number of an uncontrolled field (default null)
     onChange(value, event): the new number (null when the field is emptied) as it is typed, stepped or corrected
     min: a number: the least value; a smaller one is brought back to it when the field is left
     max: a number: the greatest value; a larger one is brought back to it when the field is left
     step: the change of one step (default 1); a value is kept to the step's decimals when it is stepped
     bigStep: the change of Page Up and Page Down, in steps (default 10)
     decimals: a number: the decimals shown when the field is left (default: the currency's own, else as typed)
     format: "number" (default) | "currency" (the currency's symbol or code inside the field, where the locale puts it) |
       "percent" (the percent sign after the value; the value is the percentage: 25 means 25%)
     currency: a string: an ISO 4217 code ("USD", "EUR"), with format "currency"
     currencyDisplay: "symbol" (default; "$") | "code" ("USD", for pages that mix currencies)
     unit: a string: a short unit shown after the value ("kg", "px", "GB"); say it in the label too when it is not obvious
     stepper: "none" (default) | "buttons" (minus and plus joined at the end) | "quantity" (minus before and plus after a
       short centered count: carts, copies, seats)
     width: "xs" | "sm" | "md" | "lg" (the group's width; quantity has its own); full width by default
     invalid: the danger border and aria-invalid (a Field with an error sets it)
     warning: true shows a warning state beside invalid (a Field with a warning sets it): a warning border and fill; the Field draws its icon and message
     disabled: turns the field and its buttons off
     readOnly: the value can be read and copied, not changed; the buttons turn off; default the nearest ReadOnly region's (useReadOnly)
     required: handed to the field (a Field sets it)
     id: handed to the field, with aria-describedby (a Field sets both)
     strings: the words it announces, for other languages: { decrease: "Decrease", increase: "Increase" }
     className: more classes on the group
     ref: forwarded to the <input>
   Behavior:
     The field is a spinbutton: Arrow Up and Arrow Down step it, Page Up and Page Down step it by bigStep, Home and End go
       to min and max; screen readers read the value with its currency, percent sign or unit (aria-valuetext).
     Typing is never blocked or reformatted while the field has focus; the locale's group and decimal marks are read.
       Leaving the field formats the value in the locale, keeps it inside min and max, or puts back the last valid
       number when the text is not a number.
     The stepper buttons are not Tab stops (the arrow keys step the field); a press keeps focus where it was. Each is
       turned off at its limit.
   Notes:
     It is an InputGroup around an Input in the data font; other props pass through to the <input> (name, placeholder,
       autoComplete, onBlur, onFocus…).
     Numbers that are really codes (ZIP codes, card numbers, phone numbers) are text: use Input.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { formatLocale, numeralLocale, formatNumber, formatCurrency } from '../../utils/format.ts';
import { Input } from '../Input/Input.tsx';
import type { FieldWidth } from '../Input/Input.tsx';
import { Button } from '../Button/Button.tsx';
import { InputGroup } from '../InputGroup/InputGroup.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import { useReadOnly } from '../../providers/ReadOnly.tsx';
import PlusIcon from 'plenix-platform/icons/plenix/plus';
import RemoveIcon from 'plenix-platform/icons/plenix/remove';

const decimalsOf = (n: number) => { const s = String(n); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };
const SPACES = /[\s\u00A0\u202F]/g;

// the locale's marks: group, decimal and minus, read from its own formatter
function marks(locale: string) {
  const parts = new Intl.NumberFormat(locale).formatToParts(-12345.6);
  const of = (type: string, d: string) => (parts.find((p) => p.type === type) || { value: d }).value;
  return { group: of('group', ','), decimal: of('decimal', '.'), minus: of('minusSign', '-') };
}

// the text a person typed as a number: null when empty, NaN when it is not a number
function parseNumber(text: unknown, locale?: string): number | null {
  const m = marks(locale || formatLocale());
  let s = String(text == null ? '' : text).replace(SPACES, '');
  if (!s) return null;
  if (m.group.replace(SPACES, '')) s = s.split(m.group).join('');
  s = s.split(m.decimal).join('.').split(m.minus).join('-').replace(/\u2212/g, '-');
  return /^-?(\d+\.?\d*|\.\d+)$/.test(s) ? Number(s) : NaN;
}

// where the locale writes a currency's symbol or code, or the percent sign: before or after the number
type Affix = { text: string; before: boolean; decimals?: number };
function affix(format: string, currency: string | undefined, display: Intl.NumberFormatOptions['currencyDisplay'], locale: string): Affix | null {
  if (format === 'currency' && currency) {
    const nf = new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: display });
    const parts = nf.formatToParts(1), c = parts.findIndex((p) => p.type === 'currency'), n = parts.findIndex((p) => p.type === 'integer');
    return { text: parts[c].value, before: c < n, decimals: nf.resolvedOptions().minimumFractionDigits };
  }
  if (format === 'percent') {
    const parts = new Intl.NumberFormat(locale, { style: 'percent' }).formatToParts(1), c = parts.findIndex((p) => p.type === 'percentSign'), n = parts.findIndex((p) => p.type === 'integer');
    return { text: parts[c].value, before: c < n };
  }
  return null;
}

export type NumberInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'width' | 'size'> & {
  /** the number; null when empty */
  value?: number | null;
  defaultValue?: number | null;
  /** the number (null when empty) and the event that changed it */
  onChange?: (value: number | null, event: React.SyntheticEvent) => void;
  min?: number;
  max?: number;
  step?: number;
  /** the step of Page Up and Page Down */
  bigStep?: number;
  decimals?: number;
  format?: 'number' | 'currency' | 'percent';
  /** an ISO 4217 code, with format "currency" */
  currency?: string;
  currencyDisplay?: Intl.NumberFormatOptions['currencyDisplay'];
  unit?: string;
  stepper?: 'none' | 'buttons' | 'quantity';
  width?: FieldWidth;
  invalid?: boolean;
  warning?: boolean;
  strings?: Catalog | null;
};
export const NumberInput = React.forwardRef(function NumberInput({ value, defaultValue = null, onChange, min, max, step = 1, bigStep = 10, decimals,
  format = 'number', currency, currencyDisplay = 'symbol', unit, stepper = 'none', width, invalid, warning, disabled, readOnly: readOnlyOwn, required, id,
  'aria-describedby': describedBy, strings, className, onFocus, onBlur, onKeyDown, ...rest }: NumberInputProps, ref: React.ForwardedRef<HTMLInputElement>) {
  const readOnly = useReadOnly(readOnlyOwn);   // its own readOnly, else the nearest ReadOnly region's: the step buttons and the keys follow either
  const t = useStrings('numberInput', strings) as { decrease: string; increase: string };
  const locale = numeralLocale(formatLocale());
  const aff = React.useMemo(() => affix(format, currency, currencyDisplay, locale), [format, currency, currencyDisplay, locale]);
  const places = decimals !== undefined ? decimals : aff && aff.decimals !== undefined ? aff.decimals : undefined;
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState<number | null>(defaultValue);
  const num = controlled ? value : inner;
  const show = React.useCallback((n: number | null | undefined) => (n == null || !isFinite(n) ? '' : formatNumber(n, { decimals: places })), [places]);
  const [text, setText] = React.useState(() => show(num));
  const [editing, setEditing] = React.useState(false);
  React.useEffect(() => { if (!editing) setText(show(num)); }, [num, editing, show]);

  const clamp = (n: number | null) => (n == null ? n : Math.min(max !== undefined ? max : Infinity, Math.max(min !== undefined ? min : -Infinity, n)));
  const commit = (n: number | null, e: React.SyntheticEvent) => { if (!controlled) setInner(n); if (onChange && n !== num) onChange(n, e); };
  const stepBy = (count: number, e: React.SyntheticEvent) => {
    if (disabled || readOnly) return;
    const typed = parseNumber(text, locale);
    const from = typed != null && !isNaN(typed) ? typed : num != null ? num : min !== undefined && min > 0 ? min - step * Math.sign(count || 1) : 0;
    const prec = Math.max(decimalsOf(step), decimalsOf(from));
    const next = clamp(Number((from + count * step).toFixed(prec)));
    setText(show(next));
    commit(next, e);
  };
  const atMin = num != null && min !== undefined && num <= min, atMax = num != null && max !== undefined && num >= max;

  const keys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) onKeyDown(e);
    if (e.defaultPrevented) return;
    const k = e.key;
    if (k === 'ArrowUp' || k === 'ArrowDown') { e.preventDefault(); stepBy(k === 'ArrowUp' ? 1 : -1, e); }
    else if (k === 'PageUp' || k === 'PageDown') { e.preventDefault(); stepBy((k === 'PageUp' ? 1 : -1) * bigStep, e); }
    else if (k === 'Home' && min !== undefined && !readOnly) { e.preventDefault(); setText(show(min)); commit(min, e); }
    else if (k === 'End' && max !== undefined && !readOnly) { e.preventDefault(); setText(show(max)); commit(max, e); }
  };
  const typed = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    const n = parseNumber(e.target.value, locale);
    if (n === null || !isNaN(n)) commit(n, e);
  };
  const left = (e: React.FocusEvent<HTMLInputElement>) => {
    setEditing(false);
    const n = parseNumber(text, locale);
    if (n !== null && isNaN(n)) setText(show(num));
    else { const c = clamp(n == null ? n : places !== undefined ? Number(n.toFixed(places)) : n); setText(show(c)); commit(c, e); }
    if (onBlur) onBlur(e);
  };
  const focused = (e: React.FocusEvent<HTMLInputElement>) => { setEditing(true); if (onFocus) onFocus(e); };

  const full = num == null ? undefined : format === 'currency' && currency ? formatCurrency(num, currency, { display: currencyDisplay as string, decimals: places })
    : (show(num) + (aff ? aff.text : unit ? ' ' + unit : ''));
  const keep = (e: React.MouseEvent) => e.preventDefault();   // a press on a stepper button keeps focus where it was
  const minus = <Button key="minus" iconOnly icon={RemoveIcon} label={t.decrease} tabIndex={-1} disabled={disabled || readOnly || atMin} onMouseDown={keep} onClick={(e) => stepBy(-1, e)} />;
  const plus = <Button key="plus" iconOnly icon={PlusIcon} label={t.increase} tabIndex={-1} disabled={disabled || readOnly || atMax} onMouseDown={keep} onClick={(e) => stepBy(1, e)} />;
  const quantity = stepper === 'quantity';

  return (
    <InputGroup className={cx('plx-number-input', stepper !== 'none' && 'plx-number-input--' + stepper, className)} width={quantity ? undefined : width} compact={quantity} data
      prefix={aff && aff.before ? aff.text : undefined} suffix={aff && !aff.before ? aff.text : unit || undefined}
      start={quantity ? minus : undefined} end={quantity ? plus : stepper === 'buttons' ? [minus, plus] : undefined}
      invalid={invalid} warning={warning} disabled={disabled} readOnly={readOnly} required={required} id={id} aria-describedby={describedBy}>
      <Input ref={ref} data role="spinbutton" inputMode={places === 0 || (decimalsOf(step) === 0 && places === undefined && format !== 'currency') ? 'numeric' : 'decimal'}
        autoComplete="off" value={text} onChange={typed} onKeyDown={keys} onFocus={focused} onBlur={left}
        aria-valuenow={num == null ? undefined : num} aria-valuemin={min} aria-valuemax={max} aria-valuetext={full} {...rest} />
    </InputGroup>
  );
});
