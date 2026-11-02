/* Plenix · OtpInput
   Summary: A one-time passcode or PIN of a known length, one box per character: typing moves on, Backspace moves back, a
     pasted or autofilled code fills every box.
   Usage:
     <Field label="Verification code" description="We sent a 6-digit code to j•••@example.com." error={err}>
       <OtpInput value={code} onChange={setCode} onComplete={verify} />
     </Field>
     <OtpInput length={4} masked label="PIN" />
     <OtpInput kind="alphanumeric" length={8} label="Recovery code" />
   Props:
     length: how many characters (default 6); 4 for a PIN
     value: the code typed so far (a string), for a controlled field
     defaultValue: the code it starts with, uncontrolled
     onChange(value): runs with the whole code after every change
     onComplete(value): runs once every box is filled
     kind: "numeric" (default; digits, the number keypad) | "alphanumeric" (letters and digits, shown in capitals)
     masked: each character shows as a dot once typed (a PIN); default false
     label: names the group and each box ("Verification code, character 2 of 6"); without it, inside a Field, the Field's
       label names the first box
     invalid: the invalid state (every box's border in the danger color); a Field with an error sets it
     warning: true shows a warning state beside invalid (a Field with a warning sets it): a warning border and fill; the Field draws its icon and message
     disabled: none of the boxes can be used
     required: the code is required (a Field sets it)
     autoFocus: the first box takes focus when it appears
     name: submits the code with a form under this name (a hidden input)
     id: the id of the first box (a Field sets it, so its label points at the first box)
     strings: { cell: 'character {n} of {total}' } (the name of each box after the label)
     className: more classes on the group
     aria-describedby: the description and error of a Field, on the group
   Behavior:
     Typing a character fills the box and moves to the next; a character the kind does not take is ignored.
     Backspace clears the box, or, in an empty box, moves back and clears the one before; Arrow Left and Right, Home and
       End move between boxes; focusing a box selects its character, so typing replaces it.
     Pasting (or the device's autofill of a code sent by message: autocomplete "one-time-code" on the first box) fills
       the boxes from the one in focus; focus moves to the next empty box, or the last.
     The boxes are written left to right in every writing direction (a code reads the same way everywhere).
   Notes:
     Only for codes of a known, short length (4 to 8). A password or a code of any length is one Input.
     Say where the code was sent and how long it lasts in the Field's description; give a way to send a new one.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';

const KEEP: Record<string, RegExp> = { numeric: /[^0-9]/g, alphanumeric: /[^0-9a-zA-Z]/g };

export type OtpInputProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> & {
  /** how many characters (default 6) */
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (code: string) => void;
  /** the whole code, once every box is filled */
  onComplete?: (code: string) => void;
  kind?: 'numeric' | 'alphanumeric';
  masked?: boolean;
  /** the group's name; each box adds its position */
  label?: string;
  invalid?: boolean;
  warning?: boolean;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  /** a hidden field of this name carries the code in a form */
  name?: string;
  strings?: Catalog | null;
};
export const OtpInput = React.forwardRef(function OtpInput({ length = 6, value, defaultValue = '', onChange, onComplete, kind = 'numeric', masked = false, label,
  invalid, warning, disabled, required, autoFocus, name, id, strings, className, 'aria-describedby': describedBy, ...rest }: OtpInputProps, ref: React.ForwardedRef<HTMLInputElement>) {
  const t = useStrings('otpInput', strings) as { cell: string };
  const n = Math.max(1, Number(length) || 6);
  const clean = (s: unknown) => String(s == null ? '' : s).replace(KEEP[kind] || KEEP.numeric, '').toUpperCase();
  const [own, setOwn] = React.useState(() => clean(defaultValue).slice(0, n));
  const code = value !== undefined ? clean(value).slice(0, n) : own;
  const boxes = React.useRef<Array<HTMLInputElement | null>>([]);
  React.useImperativeHandle(ref, () => boxes.current[0] as HTMLInputElement);
  const chars = Array.from({ length: n }, (x, i) => code[i] || '');
  const focusBox = (i: number) => { const el = boxes.current[Math.max(0, Math.min(n - 1, i))]; if (el) { el.focus(); el.select(); } };
  const commit = (next: string[]) => {
    const joined = next.join('').slice(0, n);
    if (value === undefined) setOwn(joined);
    if (onChange) onChange(joined);
    if (onComplete && next.every(Boolean) && joined.length === n) onComplete(joined);
  };
  // put text into the boxes from box i on; returns the box to focus next
  const fillFrom = (i: number, text: string) => {
    const next = chars.slice(), add = clean(text).split('');
    let at = i;
    add.forEach((c) => { if (at < n) next[at++] = c; });
    commit(next);
    const empty = next.indexOf('');
    return empty >= 0 ? empty : n - 1;
  };
  const onBoxChange = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const typed = e.target.value, cur = chars[i];
    if (!typed) { const next = chars.slice(); next[i] = ''; commit(next); return; }
    // a box that held a character gets it back with the new one: keep only what was added
    const added = cur && typed.length === cur.length + 1 ? (typed.indexOf(cur) === 0 ? typed.slice(cur.length) : typed.slice(0, 1)) : typed;
    const ok = clean(added);
    if (!ok) return;
    const after = fillFrom(i, ok);
    focusBox(ok.length > 1 ? after : i + 1);
  };
  const onKeyDown = (i: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !chars[i] && i > 0) { e.preventDefault(); const next = chars.slice(); next[i - 1] = ''; commit(next); focusBox(i - 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); focusBox(i - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); focusBox(i + 1); }
    else if (e.key === 'Home') { e.preventDefault(); focusBox(0); }
    else if (e.key === 'End') { e.preventDefault(); focusBox(n - 1); }
  };
  const onPaste = (i: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData ? e.clipboardData.getData('text') : '';
    if (!text) return;
    e.preventDefault();
    focusBox(fillFrom(i, text));
  };
  // without a label of its own, the first box keeps the name its Field's label gives it
  const boxName = (i: number) => (!label && i === 0 && id ? undefined : (label ? label + ', ' : '') + t.cell.replace('{n}', String(i + 1)).replace('{total}', String(n)));
  return (
    <div role="group" dir="ltr" aria-label={label} aria-describedby={describedBy} className={cx('plx-otp-input', invalid && 'is-invalid', disabled && 'is-disabled', className)} {...rest}>
      {chars.map((c, i) => (
        <input key={i} ref={(el) => { boxes.current[i] = el; }} id={i === 0 ? id : undefined} className="plx-otp-input__cell"
          type={masked ? 'password' : 'text'} inputMode={kind === 'numeric' ? 'numeric' : 'text'} autoComplete={i === 0 ? 'one-time-code' : 'off'}
          autoCapitalize={kind === 'alphanumeric' ? 'characters' : 'off'} spellCheck={false} enterKeyHint={i === n - 1 ? 'done' : 'next'}
          aria-label={boxName(i)} aria-invalid={invalid || undefined} data-plx-warning={warning || undefined} required={required} disabled={disabled} autoFocus={autoFocus && i === 0}
          value={c} onChange={onBoxChange(i)} onKeyDown={onKeyDown(i)} onPaste={onPaste(i)} onFocus={(e) => e.target.select()} />
      ))}
      {name ? <input type="hidden" name={name} value={code} /> : null}
    </div>
  );
});
