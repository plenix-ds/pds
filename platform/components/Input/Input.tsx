/* Plenix · Input, Textarea, Select
   Summary: The text field family, at the standard control height.
   Usage:
     <Input value={name} onChange={(e) => …} width="md" />
     <Textarea rows={5} value={notes} onChange={(e) => …} />
     <Select value={fmt} onChange={(e) => …} options={[{ value: 'png', label: 'PNG' }, { value: 'jpg', label: 'JPG' }]} />
     <Input appearance="filled" … />               <Textarea autoGrow … />
   Props:
     Input.size: "sm" | "md" (default) | a number: "sm" uses the existing toolbar control height; "md" keeps today’s standard height; a number keeps the native size attribute.
     Select.size: as Input.size; a number above 1 (or multiple) keeps the browser's own list box.
     Input.invalid: marks the field (aria-invalid); put the message in Field's error
     Input.warning: true marks the field with a warning (data-plx-warning, a warning border and fill); put the message in Field's warning
     Input.width: "xs" | "sm" | "md" | "lg" (a field narrower than its row, --plx-sys-field-width-*) | "fill" (the whole width)
       A date or a time (type date, time, datetime-local, month, week) is never narrower than its value, whatever the width:
       leave width out in a Field (it fills the column) or use "lg"; "xs", "sm" and "md" are for numbers and short codes
     Select.width: as Input.width
     Input.data: the data font, for codes, hex values, links to copy (default false)
     Input.emphasis: semibold, for a record's title (default false)
     Input.type: the input type (default "text"); "color" gives the color well: a square swatch the field's height, no border
       (owner, batch 275); the system sizes it, so it takes no width or utility
     Input.inputMode, autoComplete, enterKeyHint, autoCapitalize, spellCheck: the on-screen keyboard and autofill hints
       (Platforms Standard 3.5 and 6.2); a type of "email", "url", "tel" or "search" brings its matching defaults (below)
     Input.appearance: "outline" (default; a border on every side) | "filled" (the same border and corners, a gray fill and
       the value in dark gray); one appearance per form. There is no underline field (owner, 2026-10-16)
     Input.className: more classes on the <input>
     Textarea.invalid: marks the field (aria-invalid)
     Textarea.warning: true marks the field with a warning (data-plx-warning, a warning border and fill); put the message in Field's warning
     Textarea.rows: the visible lines (default 3); an autoGrow text area starts at its minimum height and grows from there
     Textarea.autoGrow: grows with its text, a line at a time, up to --plx-comp-textarea-auto-grow-max-height, then
       scrolls inside; it cannot be resized by hand (default false)
     Textarea.appearance: as Input.appearance
     Textarea.data: technical text (lists of extensions, paths, codes) in the data font, as Input.data
     Textarea.className: more classes on the <textarea>
     Select.invalid: marks the field (aria-invalid)
     Select.warning: true marks the field with a warning (data-plx-warning, a warning border and fill); put the message in Field's warning
     Select.options: the choices: [{ value, label, disabled }]; or pass <option>s (and <optgroup>s) as children
     Select.value, defaultValue, onChange(event), name, required, disabled, form, ref: as on a native select (event.target.value is the choice);
       the ref is the hidden native <select>
     Select.block: the select takes its own line, as wide as its room (InlineEdit)
     Select.joined: { start, end }: "square" | "seam": its corners square where it meets a neighbor (InputGroup sets it)
     Select.children: <option>s, when there are no options
     Select.appearance: as Input.appearance (on the <select>)
     Select.className: more classes on the wrapper
     Select.readOnly: the choice shows and takes focus but cannot change (default: the nearest read-only region's, useReadOnly)
   Behavior:
     Select.data: true forces the technical-value font variant (as Input.data) on the field, false keeps the interface font; when not set, the field
       shows its value in the data font when the chosen label is wholly a number, a date, a time, a size, a version, a file name or an ID ("10",
       "Oct 25, 2026"), the same font as the numbers and dates around it, and a word ("Compact", "15 minutes") keeps the interface font.
       A multi-select or list box (multiple, or a size above 1) keeps the browser's own select and does no auto detection: data there is only what the prop says
     Select is drawn by Plenix (owner, dropdown-look-36): a field and a list in the Menu's look, over a hidden native <select> that
     stays the source of truth (options, value, form, reset, label). The field is role="combobox" and the list role="listbox"; a
     <label for> or Field names and focuses it. The arrow is the form-icon size (--plx-sys-control-icon-inline), like the Combobox's.
     Keyboard: ↓ / ↑ / Enter / Space open the list; ↓ / ↑ move; Home and End jump to the first and last row; typing a letter
     goes to the next row that starts with it; Enter chooses; Alt+↑ chooses and closes; Escape closes; Tab chooses the row
     and moves on. Rows are the Menu's height and text size; the chosen row is blue and semibold; a disabled row is skipped.
     A value set straight on the native select through the ref shows on the next render. The options are compared after every
     render (length, then each value, label and state), so a list of hundreds costs a little each time.
     The box is as wide as the widest option. The list opens in the browser's top layer, below the field (or above it near an
     edge), at least as wide as the field, placed like a Menu: no dialog, drawer, table cell or scroll area clips it.
     Inside a Field, the label, description and error are connected for you.
     Input in a bar or a header (issue 558; not inside an InputGroup): a text value (text, search, email, url, tel; never a
       password) wider than the field ends in an ellipsis and shows in full in a tooltip on hover and focus, only while it
       is cut. The Input then sits in the Tooltip's wrapper (plx-input__tip), which takes its place in the bar.
     Every appearance keeps the same states: hover and focus change only the color of its border, never a ring outside
     it; invalid draws a 2px danger border (the border and a line inside it, so the value does not move) on the lightest
     red fill; read-only and disabled keep their fills.
     autoGrow: the browser sizes the text area to its content (field-sizing: content); where it cannot, the text area
     measures its content on each change and sets its height on the 4px grid (gridPx), the one inline style it writes.
     Keyboard hints by type, each overridden by its own prop: email and url get their inputMode, no capitals and no spell
     check; tel gets inputMode "tel"; search gets inputMode "search" and enterKeyHint "search".
   Notes:
     They take every native attribute (value, onChange, placeholder, disabled, readOnly, required…).
     Input and Textarea are read-only when their own readOnly says so, else when they sit in a read-only region (ReadOnly,
       useReadOnly).
     All three forward their ref to the native element.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { gridPx } from '../../utils/grid.ts';
import { isDataValue } from '../../utils/dataValue.ts';
import { useFloating, TOP_LAYER } from '../../utils/floating.ts';
import { useReadOnly, readOnlyProps } from '../../providers/ReadOnly.tsx';
import type { ControlProps } from '../../providers/ReadOnly.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { useTruncated, useInBar } from '../../utils/overflow.ts';
import SelectChevronIcon from 'plenix-platform/icons/plenix/select-chevron';


// the keyboard a type brings on a touch screen (Platforms Standard 3.5: the right type, inputmode and autocomplete)
const TYPE_HINTS: Record<string, React.InputHTMLAttributes<HTMLInputElement>> = {
  email: { inputMode: 'email', autoCapitalize: 'off', spellCheck: false },
  url: { inputMode: 'url', autoCapitalize: 'off', spellCheck: false },
  tel: { inputMode: 'tel' },
  search: { inputMode: 'search', enterKeyHint: 'search' },
};

// the appearance class (outline is the base look: no class)
export type FieldAppearance = 'outline' | 'filled';
export type FieldWidth = 'xs' | 'sm' | 'md' | 'lg' | 'fill';
// "sm", "md", or a number: the native size attribute
export type FieldSize = 'sm' | 'md' | number;
const look = (appearance: FieldAppearance | undefined) => appearance === 'filled' && 'plx-input--filled';

// the types whose value is text that a bar can cut (issue 558); never a password
const TEXT_TYPES: Record<string, number> = { text: 1, search: 1, email: 1, url: 1, tel: 1 };
// the Tooltip around a text Input in a bar: its width class follows the Input's (fixed: xs, sm, md)
const tipWidth = (width: FieldWidth | undefined) => (width === 'xs' || width === 'sm' || width === 'md' ? 'plx-input__tip--fixed' : width === 'lg' || width === 'fill' ? 'plx-input__tip--' + width : null);

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'width'> & {
  invalid?: boolean;
  /** true marks the field with a warning */
  warning?: boolean;
  width?: FieldWidth;
  data?: boolean;
  emphasis?: boolean;
  appearance?: FieldAppearance;
  size?: FieldSize;
};
export const Input = React.forwardRef(function Input({ invalid, warning, width, data = false, emphasis = false, appearance, size, className, type = 'text', readOnly, onInput, ...rest }: InputProps, ref: React.ForwardedRef<HTMLInputElement>) {
  // its own readOnly, else the nearest read-only region's (providers/ReadOnly.tsx)
  const locked = useReadOnly(readOnly);
  const own = React.useRef<HTMLInputElement | null>(null);
  const setRef = React.useCallback((el: HTMLInputElement | null) => { own.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }, [ref]);
  // in a bar (issue 558) a text Input whose value is cut shows its whole value in a Tooltip on hover and focus; it is wrapped once it is known to sit in one
  const bar = useInBar(own, '.plx-input-group') && !!TEXT_TYPES[type];
  const [, redraw] = React.useReducer((n: number) => n + 1, 0);
  const cut = useTruncated(own, bar ? 'bar|' + rest.value : '', bar);
  const field = <input ref={setRef} type={type} readOnly={locked || undefined} size={size === 'sm' || size === 'md' ? undefined : size as number | undefined} className={cx('plx-input', size === 'sm' && 'plx-input--size-sm', width && 'plx-input--width-' + width, data && 'plx-input--data', emphasis && 'plx-input--emphasis', bar && 'plx-input__bar-text', look(appearance), className)} aria-invalid={invalid || undefined} data-plx-warning={warning || undefined}
    onInput={bar ? (e: React.FormEvent<HTMLInputElement>) => { redraw(); if (onInput) onInput(e); } : onInput} {...TYPE_HINTS[type]} {...rest} />;
  if (!bar) return field;
  const text = rest.value !== undefined && rest.value !== null ? String(rest.value) : own.current ? own.current.value : String(rest.defaultValue || '');
  return <Tooltip content={text} disabled={!cut || !text} describe={false} className={cx('plx-input__tip', tipWidth(width))}>{field}</Tooltip>;
});

// can the browser size a text area to its content? (field-sizing: Chrome 123, Safari 26)
const SIZES_ITSELF = typeof CSS !== 'undefined' && !!CSS.supports && CSS.supports('field-sizing', 'content');

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
  warning?: boolean;
  appearance?: FieldAppearance;
  /** grows with its text, a line at a time, up to its maximum */
  autoGrow?: boolean;
  data?: boolean;
};
export const Textarea = React.forwardRef(function Textarea({ invalid, warning, appearance, autoGrow = false, data = false, className, rows = 3, onInput, readOnly, ...rest }: TextareaProps, ref: React.ForwardedRef<HTMLTextAreaElement>) {
  const locked = useReadOnly(readOnly);   // its own readOnly, else the nearest read-only region's
  const own = React.useRef<HTMLTextAreaElement | null>(null);
  const setRef = React.useCallback((el: HTMLTextAreaElement | null) => { own.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }, [ref]);
  // the fallback: measure the content and set the height on the grid (the stylesheet caps it at the maximum)
  const fit = React.useCallback(() => {
    const el = own.current;
    if (!el || !autoGrow || SIZES_ITSELF) return;
    el.style.blockSize = '';
    const edge = el.offsetHeight - el.clientHeight;
    el.style.blockSize = gridPx(el.scrollHeight + edge, { round: 'up', el });
  }, [autoGrow]);
  React.useLayoutEffect(() => { fit(); });
  return <textarea ref={setRef} rows={rows} readOnly={locked || undefined} className={cx('plx-input', 'plx-input--textarea', data && 'plx-input--data', autoGrow && 'plx-input--auto-grow', look(appearance), className)} aria-invalid={invalid || undefined} data-plx-warning={warning || undefined}
    onInput={(e) => { fit(); if (onInput) onInput(e); }} {...rest} />;
});

/* the native control: a list box (multiple, or a size above 1) keeps the browser's own select */
export type SelectOption = { value: string | number; label?: React.ReactNode; disabled?: boolean };
export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'width'> & {
  invalid?: boolean;
  warning?: boolean;
  /** the choices; or <option>s (and <optgroup>s) as children */
  options?: SelectOption[];
  appearance?: FieldAppearance;
  /** a number above 1 (or multiple) keeps the browser's own list box */
  size?: FieldSize;
  /** its corners square where it meets a neighbor (InputGroup sets it) */
  joined?: { start?: 'square' | 'seam'; end?: 'square' | 'seam' };
  /** true forces the data font, false keeps the interface font; unset, it follows the chosen value */
  data?: boolean;
  block?: boolean;
  width?: FieldWidth;
  /** the choice shows and takes focus but cannot change */
  readOnly?: boolean;
};
const SelectNative = React.forwardRef(function SelectNative({ invalid, warning, options, appearance, size, joined, data = false, block = false, width, className, children, readOnly, ...rest }: SelectProps, ref: React.ForwardedRef<HTMLSelectElement>) {
  const locked = useReadOnly(readOnly);
  return (
    <span className={cx('plx-select', size === 'sm' && 'plx-select--size-sm', width && 'plx-select--width-' + width, block && 'plx-select--block', joined && joined.start && 'plx-select--joined-start-' + joined.start, joined && joined.end && 'plx-select--joined-end-' + joined.end, joined && (joined.start || joined.end) && 'plx-select--joined', className)}>
      <select ref={ref} size={size === 'sm' || size === 'md' ? undefined : size as number | undefined} className={cx('plx-input', 'plx-select__control', data && 'plx-input--data', look(appearance))} aria-invalid={invalid || undefined} data-plx-warning={warning || undefined} {...(readOnlyProps(locked, rest as ControlProps, { pointer: true }) as React.SelectHTMLAttributes<HTMLSelectElement>)}>
        {options ? options.map((o) => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>) : children}
      </select>
      <span className="plx-select__chevron" aria-hidden="true"><Icon icon={SelectChevronIcon} filled={false} /></span>
    </span>
  );
});

// one row of the drawn list, read from the native select's options
type ListItem = { value: string; label: string; disabled: boolean | null; group: string | null };
/* the Plenix-drawn dropdown (owner, dropdown-look-36): a field (role combobox) and a list (role listbox) drawn by Plenix over a
   hidden native <select>, which stays the source of truth: the options, the value, the form, the ref and onChange(event) all
   come from it, so a form posts, a reset resets and e.target.value works as before. */
const SelectList = React.forwardRef(function SelectList({ invalid, warning, options, appearance, size, joined, data, block = false, width, className, children, id, onFocus, onBlur, onKeyDown,
  'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-errormessage': errorMessage, readOnly, ...rest }: SelectProps, ref: React.ForwardedRef<HTMLSelectElement>) {
  const locked = useReadOnly(readOnly);   // keeps the value and focus; a press, Space, the arrows or typing do not open or change it
  const native = React.useRef<HTMLSelectElement | null>(null), field = React.useRef<HTMLDivElement>(null), wrap = React.useRef<HTMLSpanElement>(null), list = React.useRef<HTMLUListElement>(null), last = React.useRef<ListItem[] | null>(null), buffer = React.useRef(''), timer = React.useRef<ReturnType<typeof setTimeout> | 0>(0);
  const setNative = React.useCallback((el: HTMLSelectElement | null) => { native.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }, [ref]);
  const auto = React.useId();
  const [items, setItems] = React.useState<ListItem[]>([]);
  const [chosen, setChosen] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const [labelId, setLabelId] = React.useState<string | null>(null);
  const [, redraw] = React.useReducer((n: number) => n + 1, 0);
  const valueRef = React.useRef<HTMLSpanElement>(null), cut = useTruncated(valueRef);   // the chosen text is cut (its box is narrower than the text): its full text goes in a Tooltip
  const disabled = !!rest.disabled;
  // the list opens in the top layer, placed against the field by the floating layer (flips up near an edge, follows scroll and resize), so no dialog, drawer, table cell or scroll area clips it
  useFloating(wrap, list, { open, placement: 'bottom-start', matchWidth: true });
  React.useLayoutEffect(() => { const el = list.current; if (open && TOP_LAYER && el && el.showPopover && !el.matches(':popover-open')) el.showPopover(); }, [open]);
  const listId = auto + '-list', optId = (i: number) => auto + '-o' + i;
  // read the native select (its options, in order, and its chosen one) after every render
  const read = React.useCallback(() => {
    const el = native.current;
    if (!el) return;
    const next: ListItem[] = Array.from(el.options).map((o) => ({ value: o.value, label: o.text, disabled: o.disabled || (o.parentElement && (o.parentElement as HTMLOptGroupElement).disabled === true), group: o.parentElement && o.parentElement.tagName === 'OPTGROUP' ? (o.parentElement as HTMLOptGroupElement).label : null }));
    const prev = last.current;   // the same options? a length and field-by-field comparison, cheap for a long list
    if (!prev || prev.length !== next.length || next.some((o, i) => o.value !== prev[i].value || o.label !== prev[i].label || o.disabled !== prev[i].disabled || o.group !== prev[i].group)) { last.current = next; setItems(next); }
    setChosen(el.selectedIndex);
  }, []);
  React.useLayoutEffect(read);
  React.useEffect(() => {   // a form reset puts the first choice back
    const form = native.current && native.current.form;
    if (!form) return undefined;
    const reset = () => setTimeout(read, 0);
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  }, [read]);
  React.useEffect(() => {   // a <label for="id"> names the field and focuses it
    if (!id || labelledBy || typeof document === 'undefined') return undefined;
    const label = document.querySelector('label[for="' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]');
    if (!label) return undefined;
    if (!label.id) label.id = id + '-label';
    setLabelId(label.id);
    const focus = () => { if (field.current) field.current.focus(); };
    label.addEventListener('click', focus);
    return () => label.removeEventListener('click', focus);
  }, [id, labelledBy]);
  React.useEffect(() => {   // keep the row under the arrow keys in view
    if (!open || active < 0) return;
    const el = document.getElementById(optId(active));
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }, [open, active]);
  const step = (from: number, dir: number) => { for (let i = from; i >= 0 && i < items.length; i += dir) if (!items[i].disabled) return i; return -1; };
  const show = (at?: number) => { setActive(at !== undefined ? at : (chosen >= 0 && !(items[chosen] && items[chosen].disabled) ? chosen : step(0, 1))); setOpen(true); };
  const choose = (i: number) => {
    const el = native.current, it = items[i];
    if (!el || !it || it.disabled) return;
    setOpen(false);
    if (i !== el.selectedIndex) {
      el.selectedIndex = i;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
    redraw();
    setTimeout(read, 0);
  };
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onKeyDown) onKeyDown(e as unknown as React.KeyboardEvent<HTMLSelectElement>);
    if (e.defaultPrevented || disabled) return;
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowUp') {
      e.preventDefault();
      if (!open) { show(); return; }
      if (e.altKey && k === 'ArrowUp') { choose(active); return; }
      const j = step(active + (k === 'ArrowDown' ? 1 : -1), k === 'ArrowDown' ? 1 : -1);
      if (j >= 0) setActive(j);
    } else if (k === 'Home' || k === 'End') {
      e.preventDefault();
      const j = k === 'Home' ? step(0, 1) : step(items.length - 1, -1);
      if (open) setActive(j); else show(j);
    } else if ((k === 'Enter' || k === ' ') && !(k === ' ' && buffer.current)) {
      e.preventDefault();
      if (open) choose(active); else show();
    } else if (k === 'Escape') {
      if (open) { e.preventDefault(); e.stopPropagation(); setOpen(false); }
    } else if (k === 'Tab') {
      if (open && active >= 0) choose(active);
      else setOpen(false);
    } else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {   // type-ahead: the next row that starts with what was typed
      clearTimeout(timer.current as ReturnType<typeof setTimeout>);
      buffer.current += k.toLowerCase();
      timer.current = setTimeout(() => { buffer.current = ''; }, 700);
      const from = (open ? active : chosen) + (buffer.current.length === 1 ? 1 : 0);
      const order = items.map((it, i) => i).slice(Math.max(0, from)).concat(items.map((it, i) => i).slice(0, Math.max(0, from)));
      const j = order.find((i) => !items[i].disabled && items[i].label.toLowerCase().indexOf(buffer.current) === 0);
      if (j !== undefined) { if (open) setActive(j); else show(j); }
    }
  };
  const current = items[chosen];
  // the data font: forced by data (true or false); otherwise when the chosen label is wholly a number, a date or another technical value
  const asData = data === undefined ? !!(current && isDataValue(current.label)) : !!data;
  const grouped: Array<{ name: string | null; rows: Array<{ it: ListItem; i: number }> }> = [];   // the rows in order, a group's rows together (an <optgroup>)
  items.forEach((it, i) => { const g = grouped[grouped.length - 1]; if (g && g.name === it.group && it.group != null) g.rows.push({ it, i }); else grouped.push({ name: it.group, rows: [{ it, i }] }); });
  return (
    <span ref={wrap} className={cx('plx-select', 'plx-select--list', size === 'sm' && 'plx-select--size-sm', width && 'plx-select--width-' + width, block && 'plx-select--block', joined && joined.start && 'plx-select--joined-start-' + joined.start, joined && joined.end && 'plx-select--joined-end-' + joined.end, joined && (joined.start || joined.end) && 'plx-select--joined', open && 'is-open', disabled && 'is-disabled', className)}>
      <select ref={setNative} tabIndex={-1} aria-hidden="true" className={cx('plx-input', 'plx-select__control', 'plx-select__native', asData && 'plx-input--data', look(appearance))}
        {...(readOnlyProps(locked, Object.assign({ onFocus: () => { if (field.current) field.current.focus(); } }, rest) as ControlProps, { pointer: true }) as React.SelectHTMLAttributes<HTMLSelectElement>)}>
        {options ? options.map((o) => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>) : children}
      </select>
      {/* the Tooltip wraps the part that takes focus, so the whole chosen text shows on keyboard focus as on hover while it is cut (issue 577);
          describe={false}: the field's own text already gives the value to a screen reader */}
      <Tooltip content={current ? current.label : ''} disabled={!cut || open} describe={false} className="plx-select__tip">
      <div ref={field} id={id} role="combobox" tabIndex={disabled ? -1 : 0} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listId : undefined}
        aria-activedescendant={open && active >= 0 ? optId(active) : undefined} aria-label={ariaLabel} aria-labelledby={labelledBy || (ariaLabel ? undefined : labelId || undefined)}
        aria-describedby={describedBy} aria-errormessage={errorMessage} aria-invalid={invalid || undefined} data-plx-warning={warning || undefined} aria-required={rest.required || undefined} aria-disabled={disabled || undefined}
        className={cx('plx-input', 'plx-select__field', asData && 'plx-input--data', look(appearance), disabled && 'is-disabled')}
        {...(readOnlyProps(locked, { onClick: () => { if (disabled) return; if (open) setOpen(false); else show(); }, onKeyDown: onKey } as unknown as ControlProps, { pointer: true }) as React.HTMLAttributes<HTMLDivElement>)}
        onFocus={onFocus as unknown as React.FocusEventHandler<HTMLDivElement>} onBlur={(e) => { setOpen(false); if (onBlur) onBlur(e as unknown as React.FocusEvent<HTMLSelectElement>); }}>
        <span ref={valueRef} className="plx-select__value">{current ? current.label : ''}</span>
      </div>
      </Tooltip>
      <span className="plx-select__chevron" aria-hidden="true"><Icon icon={SelectChevronIcon} filled={false} /></span>
      {open ? (
        <ul ref={list} id={listId} role="listbox" popover={TOP_LAYER ? 'manual' : undefined} aria-label={ariaLabel} aria-labelledby={labelledBy || (ariaLabel ? undefined : labelId || undefined)} className="plx-select__list" onMouseDown={(e) => e.preventDefault()}>
          {grouped.map((g, gi) => {
            const rows = g.rows.map(({ it, i }) => <li key={'o' + i} id={optId(i)} role="option" aria-selected={i === chosen} aria-disabled={it.disabled || undefined}
              className={cx('plx-select__option', i === active && 'is-active', i === chosen && 'is-selected', it.disabled && 'is-disabled')}
              onMouseDown={(e) => e.preventDefault()} onClick={() => choose(i)} onMouseEnter={() => { if (!it.disabled) setActive(i); }}>{it.label}</li>);
            return g.name == null ? rows : (
              <li key={'g' + gi} role="group" aria-labelledby={auto + '-g' + gi} className="plx-select__group-wrap">
                <div id={auto + '-g' + gi} role="presentation" className="plx-select__group">{g.name}</div>
                <ul role="presentation" className="plx-select__group-list">{rows}</ul>
              </li>);
          })}
        </ul>
      ) : null}
    </span>
  );
});

/* options: [{ value, label }] or children <option>s */
export const Select = React.forwardRef(function Select(props: SelectProps, ref: React.ForwardedRef<HTMLSelectElement>) {
  const listBox = props.multiple || (typeof props.size === 'number' && props.size > 1);
  return listBox ? <SelectNative {...props} ref={ref} /> : <SelectList {...props} ref={ref} />;
});
