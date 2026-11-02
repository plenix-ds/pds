/* Plenix · Field
   Summary: A label, the control, and its help or error, connected for assistive technology.
   Usage:
     <Field label="Name" description="Shown on the asset" error={msg} required info={<…/>} layout="inline">
       <Input …/>
     </Field>
   Props:
     label: the label text
     hideLabel: the label is read by screen readers and still labels the control, but is not drawn (a title field, a search
       box whose purpose is plain from where it sits); default false (owner, 2026-10-16, the composition standard)
     description: help text under the control (under the label with "row")
     error: the error message under the control; it marks the field invalid
     warning: an element (or text): the warning message under the control (a caution that does not block): drawn with a warning icon and the word "Warning"
       for screen readers, never by color alone; the control takes a warning border and fill (its warning prop). An error wins: with
       both, only the error shows.
     required: marks the field and the control required; the label shows " *" (default false)
     info: an element: content for a small (i) button next to the label
     infoLabel: the accessible name of the (i) button (default the catalog's field.about, "About {label}")
     layout: "stacked" (default; label above) | "inline" (label beside the control: settings rows, a 160px label column) |
       "row" (the description under the label and the control at the end); without it, the layout of the Form around the
       field (FieldLayoutContext: a two-column Form makes its fields inline), else "stacked"
     counter: true or a number: a character counter at the end of the help line: true (the limit is the control's maxLength) or the limit
       as a number; default none
     strings: the counter's words for screen readers: { left: '{n} characters left', over: '{n} characters too many' }
     labelWidth: a string: the width of the label column, as a size name (adds plx-field--label-<value>)
     type, inputMode, autoComplete, enterKeyHint: keyboard and autofill hints handed to the control (Platforms Standard 3.5),
       unless it sets its own
     children: exactly one control
     className: more classes on the field
   Behavior:
     The child control gets id, aria-describedby, invalid, warning and required, unless it sets its own.
     The error is announced (role="alert"); the warning politely (role="status").
     The (i) button shows and hides the info text under the control (aria-expanded).
     counter: the count updates as people type ("12/100", in the data font) and is part of the control's description.
       People may type past the limit: the native maxLength is not set, so nothing is cut off; past it the count and the
       control turn invalid (the danger color, aria-invalid). Near the limit (the last tenth) and past it, the characters
       left or over are announced politely, once typing pauses (announce).
   Notes:
     Other props pass through to the <div>.
     Writing direction (owner, ctm-needs-34): dir ("ltr" | "rtl") and lang on the Field go on the <div>, so the label, the control,
       the description and the error all take that direction: an Arabic field in an English page, or the reverse. Use
       the dir attribute, never the CSS direction property: the :dir(rtl) rules answer only to the attribute.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useTruncated } from '../../utils/overflow.ts';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { announce } from '../../utils/announce.tsx';
import { formatNumber } from '../../utils/format.ts';
import { useDescribedBy } from '../../utils/describedBy.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import { dataWhenText } from '../../utils/dataText.tsx';
import { Icon } from '../Icon/Icon.tsx';
import WarningIcon from 'plenix-platform/icons/plenix/warning';

// the layout a Form gives the fields inside it (Form's layout "two-column" makes them inline); a Field's own layout wins
export type FieldLayout = 'stacked' | 'inline' | 'row';
export const FieldLayoutContext = React.createContext<FieldLayout | null>(null);

const countText = (t: unknown, n: number) => String(t).replace('{n}', formatNumber(n));

// what Field reads from, and gives, its one control
type FieldControlProps = { id?: string; maxLength?: number | string; defaultValue?: unknown; value?: unknown; 'aria-describedby'?: string; invalid?: boolean;
  required?: boolean; warning?: unknown; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; [prop: string]: unknown };
export type FieldProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  label?: React.ReactNode;
  hideLabel?: boolean;
  description?: React.ReactNode;
  error?: React.ReactNode;
  /** a caution that does not block; true marks the control only */
  warning?: React.ReactNode;
  required?: boolean;
  info?: React.ReactNode;
  infoLabel?: string;
  layout?: FieldLayout;
  /** a size name for the label column (plx-field--label-<value>) */
  labelWidth?: string;
  /** true (the limit is the control's maxLength) or the limit */
  counter?: boolean | number;
  strings?: Catalog | null;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLElement>['inputMode'];
  autoComplete?: string;
  enterKeyHint?: React.HTMLAttributes<HTMLElement>['enterKeyHint'];
  /** the control: one element */
  children: React.ReactElement;
};
export function Field({ label, hideLabel = false, description, error, warning, required = false, info, infoLabel, layout, labelWidth, counter, strings, type, inputMode, autoComplete, enterKeyHint, className, children, ...rest }: FieldProps) {
  const id = React.useId();
  const formLayout = React.useContext(FieldLayoutContext);
  const lay = layout || formLayout || 'stacked';
  const controlId = 'plx-f' + id.replace(/[^a-zA-Z0-9]/g, '');
  const descId = description ? controlId + '-d' : undefined, errId = error ? controlId + '-e' : undefined;
  const showWarning = !!warning && !error, warnId = showWarning ? controlId + '-w' : undefined;
  const [showInfo, setShowInfo] = React.useState(false);
  const labelRef = React.useRef<HTMLLabelElement>(null);
  const cut = useTruncated(labelRef);
  const child = React.Children.only(children) as React.ReactElement<FieldControlProps>;
  // the character counter: the limit, the length (the control's value, else what was typed), what is left
  const max = counter ? (typeof counter === 'number' ? counter : Number(child.props.maxLength) || 0) : 0;
  const [typed, setTyped] = React.useState(() => String(child.props.defaultValue == null ? '' : child.props.defaultValue).length);
  const length = child.props.value != null ? String(child.props.value).length : typed;
  const over = max > 0 && length > max;
  const t = useStrings('field.counter', strings) as { over: string; left: string };
  const about = useStrings('field').about as string;
  const warnWord = useStrings('field').warning as string;
  const countId = max ? controlId + '-c' : undefined;
  const near = max > 0 && max - length <= Math.ceil(max / 10);
  const said = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (!max || !near || said.current === null) { said.current = length; return; }
    if (said.current !== length) { said.current = length; announce(over ? countText(t.over, length - max) : countText(t.left, max - length)); }
  }, [length, max, near, over, t.over, t.left]);
  // the control's own descriptions first, then the field's: the description, the counter, the error (utils/describedBy.ts)
  const describedBy = useDescribedBy(child.props['aria-describedby'], descId, countId, errId, warnId);
  const props: Record<string, unknown> = {
    id: child.props.id || controlId,
    'aria-describedby': describedBy,
    invalid: child.props.invalid !== undefined ? child.props.invalid : (error || over ? true : undefined),
    required: child.props.required !== undefined ? child.props.required : (required || undefined),
  };
  if (child.props.warning !== undefined) props.warning = child.props.warning;
  else if (showWarning) props.warning = true;
  if (max) {
    // people may type past the limit (the count shows it); the length is followed for an uncontrolled control
    props.maxLength = undefined;
    props.onChange = (e: React.ChangeEvent<HTMLInputElement>) => { setTyped(e.target.value.length); if (child.props.onChange) child.props.onChange(e); };
  }
  // keyboard hints given on the Field reach the control, unless it has its own
  const hints: Record<string, unknown> = { type, inputMode, autoComplete, enterKeyHint };
  Object.keys(hints).forEach((k) => { if (hints[k] !== undefined && child.props[k] === undefined) props[k] = hints[k]; });
  const control = React.cloneElement(child, props);
  return (
    <div className={cx('plx-field', 'plx-field--' + lay, labelWidth && 'plx-field--label-' + labelWidth, error && 'is-invalid', showWarning && 'is-warning', className)} {...rest}>
      <div className={cx('plx-field__head', hideLabel && 'plx-visually-hidden')}>
        <Tooltip content={label} disabled={!cut} describe={false} className="plx-field__label-tip">
          <label ref={labelRef} className="plx-field__label" htmlFor={child.props.id || controlId}>{label}{required ? <span className="plx-field__required" aria-hidden="true"> *</span> : null}</label>
        </Tooltip>
        {info ? <button type="button" className="plx-field__info" aria-label={infoLabel || about.replace('{label}', label as string)} aria-expanded={showInfo} onClick={() => setShowInfo(!showInfo)}>i</button> : null}
        {lay === 'row' && description ? <div className="plx-field__description" id={descId}>{dataWhenText(description)}</div> : null}
      </div>
      <div className="plx-field__control">
        {control}
        {max ? (
          <div className="plx-field__foot">
            {lay !== 'row' && description ? <div className="plx-field__description" id={descId}>{dataWhenText(description)}</div> : null}
            <div className={cx('plx-field__counter', over && 'is-over')}>
              <span className="plx-field__count" aria-hidden="true">{formatNumber(length) + '/' + formatNumber(max)}</span>
              <span className="plx-visually-hidden" id={countId}>{over ? countText(t.over, length - max) : countText(t.left, max - length)}</span>
            </div>
          </div>
        ) : lay !== 'row' && description ? <div className="plx-field__description" id={descId}>{dataWhenText(description)}</div> : null}
        {error ? <div className="plx-field__error" id={errId} role="alert">{error}</div> : null}
        {showWarning ? <div className="plx-field__warning" id={warnId} role="status"><Icon icon={WarningIcon} aria-hidden="true" /><span><span className="plx-visually-hidden">{warnWord + ': '}</span>{warning}</span></div> : null}
        {info && showInfo ? <div className="plx-field__info-text">{info}</div> : null}
      </div>
    </div>
  );
}
