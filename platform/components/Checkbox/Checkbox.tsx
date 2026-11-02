/* Plenix · Checkbox, Radio, RadioGroup, ChoiceList, Switch
   Summary: Native choice inputs, so keyboard, forms and assistive technology work as usual.
   Usage:
     <Checkbox checked={on} onChange={(e) => …} label="Include subfolders" description="…" indeterminate={some} />
     <RadioGroup label="Format" value={fmt} onChange={(value) => …}
       options={[{ value: 'png', label: 'PNG', description: '…' }, { value: 'jpg', label: 'JPG' }]} layout="row" />
     <ChoiceList legend="Plan" value={plan} onChange={(value) => …} options={[{ value: 'team', label: 'Team', description: '…' }]} />
     <Switch checked={on} onChange={(e) => …} label="Notifications" />
   Props:
     Checkbox.label: the text beside the box
     Checkbox.description: a second line under the label
     Checkbox.indeterminate: shows the mixed state (default false)
     Checkbox.className: more classes on the row
     Checkbox.checked: whether the box is checked (passed to the <input>)
     Checkbox.onChange(event): runs when the box changes (passed to the <input>)
     Radio.label: the text beside the circle; without it there is no visible text
     Radio.description: a second line under the label
     Radio.className: more classes on the row
     RadioGroup.label: the legend of the group
     RadioGroup.name: the radio name (default a generated one)
     RadioGroup.value: a string: the selected option value
     RadioGroup.onChange(value): runs with the chosen option value
     RadioGroup.options: the choices: [{ value, label, description, disabled }]
     RadioGroup.layout: "column" (default) | "row"
     RadioGroup.className: more classes on the <fieldset>
     ChoiceList.legend: the legend of the list (the group's name, for every kind)
     ChoiceList.control: the control in each card (issue 804, control cards): "radio" (default: one choice) | "checkbox"
       (several choices) | "switch" (each option on or off; the switch at the card's end, as in a settings row)
     ChoiceList.name: the inputs' name (default a generated one)
     ChoiceList.value: the selected option value (radio)
     ChoiceList.values: an array: the checked option values (checkbox and switch)
     ChoiceList.onChange(value | values): runs with the chosen option value (radio), or the new array of values (checkbox and
       switch)
     ChoiceList.options: the choices, shown as cards with descriptions: [{ value, label, description, hidden, disabled }]
     ChoiceList.className: more classes on the <fieldset>
     Switch.label: the text beside the switch
     Switch.labelHidden: true hides the label and uses it as the accessible name (default false)
     Switch.className: more classes on the row
     Switch.checked: whether the switch is on (passed to the <input>)
     Switch.onChange(event): runs when the switch changes (passed to the <input>)
   Behavior:
     The whole row (control and label) is the target, at least the inline-action height.
     A Checkbox without label or description (a row's selection box) still has a 24px target (44px with touch): it extends
       invisibly past the 16px box (Platforms Standard 3.1).
     Switch is a checkbox with role="switch".
     The selected ChoiceList card shows the selected state.
     ChoiceList cards (issue 804): each card is the label of its native control, so the whole card is the target and the
       control is the one focus stop, named by the card's label alone (aria-labelledby) and described by its description
       (aria-describedby), so neither is read twice. A radio card is a native radio group (the arrow keys move the choice,
       Space chooses); a checkbox card and a switch card toggle with Space or a click and have no arrow keys; a switch is
       the native checkbox with role="switch", announced on or off. The fieldset's legend names the group for every kind. A disabled card is dimmed, has no hover, and is skipped by the keys.
   Notes:
     The Switch track is 36 × 20px and the knob 16px, centered: (track − knob) / 2.
     Checkbox, Radio and Switch pass other props (checked, onChange, name, value, disabled, …) and their ref to the <input>.
     RadioGroup and ChoiceList pass other props to the <fieldset>; their readOnly goes to each radio.
     Each is read-only by its own readOnly, else inside a read-only region (useReadOnly, providers/ReadOnly.tsx): it keeps its
       value and focus, a click or a change key does not change it, and Checkbox and Switch are marked aria-readonly.
     Writing direction (owner, ctm-needs-34): dir ("ltr" | "rtl") and lang ("ar", "en", …) on Checkbox, Radio and Switch go on
       the row (the <label>), so the box and its text change sides together; on RadioGroup and ChoiceList they go on the
       <fieldset>, so the legend and every option follow. An Arabic question can sit in an English page (and the reverse):
       <Fieldset dir="rtl" lang="ar" legend="بيانات الحضور"><RadioGroup … /><Checkbox label="…" /></Fieldset>.
       Use the dir attribute, never the CSS direction property: the :dir(rtl) rules answer only to the attribute.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useReadOnly, readOnlyProps } from '../../providers/ReadOnly.tsx';
import type { ControlProps } from '../../providers/ReadOnly.tsx';
import { dataWhenText } from '../../utils/dataText.tsx';

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** the mixed state of a select-all box */
  indeterminate?: boolean;
};
export const Checkbox = React.forwardRef(function Checkbox({ label, description, indeterminate = false, className, readOnly, dir, lang, ...rest }: CheckboxProps, ref: React.ForwardedRef<HTMLInputElement>) {
  const locked = useReadOnly(readOnly);
  const inner = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inner.current as HTMLInputElement);
  React.useEffect(() => { if (inner.current) inner.current.indeterminate = indeterminate; }, [indeterminate]);
  return (
    <label className={cx('plx-check', className)} dir={dir} lang={lang}>
      <input ref={inner} type="checkbox" className="plx-check__input" {...(readOnlyProps(locked, rest as ControlProps) as React.InputHTMLAttributes<HTMLInputElement>)} />
      {label || description ? <span className="plx-check__text"><span className="plx-check__label">{label}</span>{description ? <span className="plx-check__description">{dataWhenText(description)}</span> : null}</span> : null}
    </label>
  );
});

export type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & { label?: React.ReactNode; description?: React.ReactNode };
export const Radio = React.forwardRef(function Radio({ label, description, className, readOnly, dir, lang, ...rest }: RadioProps, ref: React.ForwardedRef<HTMLInputElement>) {
  const locked = useReadOnly(readOnly);
  return (
    <label className={cx('plx-check', className)} dir={dir} lang={lang}>
      <input ref={ref} type="radio" className="plx-check__input" {...(readOnlyProps(locked, rest as ControlProps, { aria: false }) as React.InputHTMLAttributes<HTMLInputElement>)} />
      {label ? <span className="plx-check__text"><span className="plx-check__label">{label}</span>{description ? <span className="plx-check__description">{dataWhenText(description)}</span> : null}</span> : null}
    </label>
  );
});

export type ChoiceOption = { value: string | number; label?: React.ReactNode; description?: React.ReactNode; disabled?: boolean; hidden?: boolean };
export type RadioGroupProps = Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange'> & {
  label?: React.ReactNode;
  name?: string;
  value?: string | number;
  onChange: (value: string | number) => void;
  options: ChoiceOption[];
  layout?: 'column' | 'row';
  readOnly?: boolean;
};
export function RadioGroup({ label, name, value, onChange, options, layout = 'column', className, readOnly, ...rest }: RadioGroupProps) {
  const auto = 'plx-r' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <fieldset className={cx('plx-radio-group', 'plx-radio-group--' + layout, className)} {...rest}>
      {label ? <legend className="plx-radio-group__legend">{label}</legend> : null}
      {options.map((o) => <Radio key={o.value} name={name || auto} value={o.value} label={o.label} description={o.description} checked={o.value === value} onChange={() => onChange(o.value)} disabled={o.disabled} readOnly={readOnly} />)}
    </fieldset>
  );
}

export type ChoiceListProps = Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange'> & {
  legend?: React.ReactNode;
  name?: string;
  /** radio: the chosen value */
  value?: string | number;
  /** checkbox and switch: the chosen values */
  values?: Array<string | number>;
  /** radio: the value; checkbox and switch: the values */
  onChange?: (value: string | number | Array<string | number>) => void;
  options: ChoiceOption[];
  control?: 'radio' | 'checkbox' | 'switch';
  readOnly?: boolean;
};
export function ChoiceList({ legend, name, value, values, onChange, options, control = 'radio', className, readOnly, ...rest }: ChoiceListProps) {
  const locked = useReadOnly(readOnly);
  const auto = 'plx-c' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const kind = control === 'checkbox' || control === 'switch' ? control : 'radio';
  const several = kind !== 'radio';
  const list: Array<string | number> = Array.isArray(values) ? values : [];
  const on = (o: ChoiceOption) => (several ? list.indexOf(o.value) >= 0 : o.value === value);
  const change = (o: ChoiceOption) => {
    if (!onChange) return;
    if (!several) { onChange(o.value); return; }
    onChange(on(o) ? list.filter((v) => v !== o.value) : list.concat([o.value]));
  };
  return (
    <fieldset className={cx('plx-choice-list', several && 'plx-choice-list--' + kind, className)} {...rest}>
      {legend ? <legend className="plx-choice-list__legend">{legend}</legend> : null}
      {options.map((o) => {
        // the name is the card's label alone and the description its hint, so neither is read twice
        const key = String(o.value).replace(/[^a-zA-Z0-9_-]/g, '_');
        const labelId = auto + '-l-' + key;
        const descId = o.description ? auto + '-d-' + key : undefined;
        const input = readOnlyProps(locked, { name: name || auto, value: o.value, checked: on(o), disabled: o.disabled || undefined, onChange: () => change(o), 'aria-labelledby': labelId, 'aria-describedby': descId },
          { aria: kind !== 'radio' }) as React.InputHTMLAttributes<HTMLInputElement>;
        const text = <span className="plx-choice__text"><span id={labelId} className="plx-choice__label">{o.label}</span>{o.description ? <span id={descId} className="plx-choice__description">{o.description}</span> : null}</span>;
        return (
          <label key={o.value} className={cx('plx-choice', 'plx-choice--' + kind, on(o) && 'is-selected', o.disabled && 'is-disabled')} hidden={o.hidden || undefined}>
            {kind === 'switch' ? (
              // the text first, the switch at the card's end (a settings row); the label's first control is the switch
              <>{text}<span className="plx-switch plx-choice__switch"><input type="checkbox" role="switch" className="plx-switch__input plx-choice__input" {...input} /><span className="plx-switch__track" aria-hidden="true" /></span></>
            ) : (
              <><input type={kind} className="plx-choice__input" {...input} />{text}</>
            )}
          </label>
        );
      })}
    </fieldset>
  );
}

export type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & { label?: React.ReactNode; labelHidden?: boolean };
export const Switch = React.forwardRef(function Switch({ label, labelHidden = false, className, readOnly, dir, lang, ...rest }: SwitchProps, ref: React.ForwardedRef<HTMLInputElement>) {
  const locked = useReadOnly(readOnly);
  return (
    <label className={cx('plx-switch', className)} dir={dir} lang={lang}>
      <input ref={ref} type="checkbox" role="switch" className="plx-switch__input" aria-label={labelHidden ? label as string : undefined} {...(readOnlyProps(locked, rest as ControlProps) as React.InputHTMLAttributes<HTMLInputElement>)} />
      <span className="plx-switch__track" aria-hidden="true" />
      {label && !labelHidden ? <span className="plx-switch__label">{label}</span> : null}
    </label>
  );
});
