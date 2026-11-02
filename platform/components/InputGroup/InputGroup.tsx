/* Plenix · InputGroup
   Summary: One text field with what belongs to its value attached: text before or after it inside the field's border (a
     prefix such as "https://" or "$", a suffix such as "kg" or "%"), an icon at its start, and a Button or a Select joined
     to its outer edge (a search button, a unit or currency choice). The field and its affixes are one control with one
     border and one focus state.
   Usage:
     <Field label="Website"><InputGroup prefix="https://"><Input value={site} onChange={…} /></InputGroup></Field>
     <Field label="Weight"><InputGroup suffix="kg" width="sm" data><Input inputMode="decimal" /></InputGroup></Field>
     <InputGroup icon="search" end={<Button>Search</Button>}><Input aria-label="Search assets" /></InputGroup>
     <InputGroup start={<Select aria-label="Currency" options={CURRENCIES} />}><Input aria-label="Amount" /></InputGroup>
   Props:
     prefix: text before the value, inside the border (not part of the value)
     suffix: text after the value, inside the border (not part of the value)
     icon: an icon name shown at the start inside the border (decorative: the label says what the field is)
     start: a Button or a Select (or an array of them) joined to the field's start edge
     end: a Button or a Select (or an array of them) joined to the field's end edge
     width: "xs" | "sm" | "md" | "lg" (a group narrower than its row, --plx-sys-field-width-*) | "fill"; full width by default
     compact: a short box (--plx-comp-input-group-compact-box-width), the value centered: a count between its buttons (NumberInput quantity)
     data: the prefix and suffix in the data font (Reddit Mono), for technical values: units, currency codes, addresses
       (default false); give the Input data too
     invalid: handed to the Input; the box’s border turns the danger color (a Field with an error sets it)
     warning: true shows a warning state beside invalid (a Field with a warning sets it): a warning border and fill; the Field draws its icon and message
     disabled: handed to the Input; the box takes the disabled fill
     readOnly: handed to the Input; the box takes the read-only fill
     required: handed to the Input (a Field sets it)
     id: handed to the Input, with aria-describedby, which also lists the affixes (a Field sets both)
     children: exactly one Input (Plenix Input)
     className: more classes on the group
   Behavior:
     Clicking an affix or the icon focuses the field.
     The border turns the focus color when the field has focus, and the danger color when it is invalid (border only).
     The prefix and suffix are read with the field: they join its aria-describedby.
     Attached buttons and selects keep their own Tab stops, after (or before) the field in reading order.
   Notes:
     Other props pass through to the outer <div>.
     For a number with a unit, a currency or a percentage, use NumberInput: it builds on this group.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useDescribedBy } from '../../utils/describedBy.ts';
import { Icon } from '../Icon/Icon.tsx';
import type { IconValue } from '../Icon/Icon.tsx';

// the field's own ref, so the group's ref callback can pass the node on: React 19 keeps a ref in the element's props (reading
// element.ref warns there, issue 686); React 18 keeps it on the element and never in its props
const REACT_19 = parseInt(String(React.version || '18').split('.')[0], 10) >= 19;
const childRef = (child: React.ReactElement): React.Ref<HTMLElement> | undefined => (REACT_19 ? (child.props as { ref?: React.Ref<HTMLElement> }).ref : (child as unknown as { ref?: React.Ref<HTMLElement> }).ref);

const list = (x: React.ReactElement | React.ReactElement[] | null | undefined | false): React.ReactElement[] => (x == null || x === false ? [] : Array.isArray(x) ? x.filter(Boolean) : [x]);

// what the group reads from, and gives, its one field
type GroupedFieldProps = { id?: string; 'aria-describedby'?: string; invalid?: boolean; warning?: boolean; disabled?: boolean; readOnly?: boolean; required?: boolean; className?: string };
export type InputGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix' | 'children'> & {
  /** text before the value, inside the border */
  prefix?: React.ReactNode;
  /** text after the value, inside the border */
  suffix?: React.ReactNode;
  /** an icon name or an imported module at the start inside the border */
  icon?: IconValue | null;
  /** a Button or a Select (or an array of them) joined to the field's start edge */
  start?: React.ReactElement | React.ReactElement[] | null | false;
  /** the same at the end edge */
  end?: React.ReactElement | React.ReactElement[] | null | false;
  width?: 'xs' | 'sm' | 'md' | 'lg' | 'fill';
  compact?: boolean;
  data?: boolean;
  invalid?: boolean;
  warning?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** the field: one element */
  children: React.ReactElement;
};
export function InputGroup({ prefix, suffix, icon, start, end, width, compact = false, data = false, invalid, warning, disabled, readOnly, required, id, 'aria-describedby': describedBy, className, children, ...rest }: InputGroupProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const preId = prefix != null ? 'plx-ig' + uid + '-p' : undefined, sufId = suffix != null ? 'plx-ig' + uid + '-s' : undefined;
  const child = React.Children.only(children) as React.ReactElement<GroupedFieldProps>;
  const inputRef = React.useRef<HTMLElement | null>(null);
  const starts = list(start), ends = list(end);
  const own = child.props;
  const describedAt = useDescribedBy(own['aria-describedby'], describedBy, preId, sufId);   // the child's own, then the group's (a Field's), then the prefix and the suffix
  const pass = {
    id: own.id || id,
    'aria-describedby': describedAt,
    invalid: own.invalid !== undefined ? own.invalid : invalid,
    warning: own.warning !== undefined ? own.warning : warning,
    disabled: own.disabled !== undefined ? own.disabled : disabled,
    readOnly: own.readOnly !== undefined ? own.readOnly : readOnly,
    required: own.required !== undefined ? own.required : required,
    className: cx(own.className, 'plx-input-group__input', (icon || prefix != null) && 'plx-input-group__input--after-affix', suffix != null && 'plx-input-group__input--before-affix'),
    ref: (node: HTMLElement | null) => { inputRef.current = node; const r = childRef(child); if (typeof r === 'function') r(node); else if (r) (r as React.MutableRefObject<HTMLElement | null>).current = node; },
  };
  const isInvalid = pass.invalid, isWarning = pass.warning, isDisabled = pass.disabled, isReadOnly = pass.readOnly;
  // a press on the box outside the field (an affix, the icon) focuses the field
  const focusField = (e: React.MouseEvent<HTMLDivElement>) => { if (e.target !== inputRef.current && inputRef.current && !isDisabled) { e.preventDefault(); inputRef.current.focus(); } };
  // an attached Button or Select joins the box: the side facing the box is a seam (the box's edge is shared); between two
  // attached controls the corners are square
  const attach = (el: React.ReactElement, i: number, all: React.ReactElement[], side: 'start' | 'end') => React.cloneElement(el as React.ReactElement<{ joined?: { start?: string; end?: string } }>, {
    key: side + i,
    joined: side === 'start' ? { start: i > 0 ? 'square' : undefined, end: 'seam' } : { start: 'seam', end: i < all.length - 1 ? 'square' : undefined },
  });
  return (
    <div className={cx('plx-input-group', width && 'plx-input-group--width-' + width, compact && 'plx-input-group--compact', data && 'plx-input-group--data', className)} {...rest}>
      {starts.map((el, i) => attach(el, i, starts, 'start'))}
      <div className={cx('plx-input-group__box', starts.length && 'plx-input-group__box--joined-start', ends.length && 'plx-input-group__box--joined-end',
        isInvalid && 'is-invalid', isDisabled && 'is-disabled', isReadOnly && 'is-readonly')} data-plx-warning={isWarning || undefined} onMouseDown={focusField}>
        {icon ? <span className="plx-input-group__icon" aria-hidden="true"><Icon name={icon} /></span> : null}
        {prefix != null ? <span className="plx-input-group__affix plx-input-group__affix--prefix" id={preId}>{prefix}</span> : null}
        {React.cloneElement(child, pass as GroupedFieldProps)}
        {suffix != null ? <span className="plx-input-group__affix plx-input-group__affix--suffix" id={sufId}>{suffix}</span> : null}
      </div>
      {ends.map((el, i) => attach(el, i, ends, 'end'))}
    </div>
  );
}
