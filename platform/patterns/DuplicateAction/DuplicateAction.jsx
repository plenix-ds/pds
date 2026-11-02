/* Plenix · DuplicateAction, copyName
   Summary: Make a copy of one item. Copy of the name duplicates at once: the copy is named "Copy of Easter banner" (then
     "Copy of Easter banner (2)" when that name is taken) and a toast says so, with Undo when the page can take the copy
     back. Then rename opens a small dialog first: the name field holds the copy's name, selected so typing replaces it,
     a line says what is copied, and optional checkboxes choose what else comes along (tags, comments, members)
     (04 Actions › Duplicate; 10 Patterns › Duplicate).
   Usage:
     <DuplicateAction name="Easter banner" noun="asset" taken={names} onDuplicate={(name) => copy(name)}
       onUndo={(name) => removeCopy(name)} />
     <DuplicateAction variant="rename" name="Advent" noun="board" taken={boards}
       source="12 assets · 3 members" options={[{ id: 'members', label: 'Members' }, { id: 'comments', label: 'Comments' }]}
       onDuplicate={(name, chosen) => copyBoard(name, chosen)} />
     copyName('Easter banner', ['Copy of Easter banner'])   // "Copy of Easter banner (2)"
   Props:
     name: the item's name
     noun: the kind in words ("asset"), for the dialog's title and its errors
     variant: "copy" (default: at once, named copyName(name)) | "rename" (the dialog first)
     taken: the names already used where the copy goes; the copy's name avoids them, and rename refuses them
     onDuplicate(newName, chosen): makes the copy; chosen is the ids of the checked options (rename)
     onUndo(newName): takes the copy back; it adds Undo to the toast (copy)
     source: one line about what is copied ("12 assets · 3 members"), under the field (rename)
     options: [{ id, label, defaultChecked }]: what else to copy, as checkboxes (rename); none checked by default
     trigger: the control that starts it (one element; its onClick is taken); default a Button with the copy icon; false
       for none (a menu item starts it through open)
     open, onClose(): starts the rename dialog from elsewhere (a menu's Duplicate) and hears it close
     size: the default trigger's size (Button's sizes)
     strings: the words, for other languages: { duplicate: "Duplicate", copyOf: "Copy of {name}", numbered: "{name}
       ({n})", title: "Duplicate {noun}", name: "Name", from: "From {name}", also: "Also copy", empty: "Enter a name.",
       taken: "A {noun} named {name} already exists.", done: "Duplicated as {name}", undo: "Undo", cancel: "Cancel" }
     className: more classes on the dialog's content
   Behavior:
     Copy: one press, no question; the new name is announced in the toast (with a ToastProvider) or to screen readers.
     Rename: the field takes focus with its text selected; the name is checked when Duplicate is pressed: empty or taken
       keeps the dialog open with the error under the field (nothing is disabled). Escape and Cancel close it.
     The copy is placed by the page, next to the original, and selected, so people see where it went.
   Notes:
     copyName(name, taken, strings) is the naming rule, also for pages that duplicate on their own (a menu item).
     Duplicate never copies people's comments or members unless they choose it: those belong to the original's history.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { announce } from '../../utils/announce.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Dialog } from '../../components/Dialog/Dialog.jsx';
import { Field } from '../../components/Field/Field.tsx';
import { Input } from '../../components/Input/Input.tsx';
import { Checkbox } from '../../components/Checkbox/Checkbox.tsx';
import { Fieldset } from '../../components/Fieldset/Fieldset.tsx';
import { Icon } from '../../components/Icon/Icon.tsx';
import { useOptionalToast } from '../../components/Toast/Toast.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { createTranslator } from '../../providers/LocaleProvider.tsx';
import { formatLocale } from '../../utils/format.ts';
import EdCopyIcon from 'plenix-platform/icons/plenix/ed-copy';
import { fill } from '../../utils/fill.ts';

const q = (x) => '“' + x + '”';

export function copyName(name, taken = [], strings) {
  const t = Object.assign({}, createTranslator(formatLocale()).section('duplicateAction'), strings);   // a plain function: no hook
  const used = new Set((taken || []).map((x) => String(x).trim().toLowerCase()));
  const base = fill(t.copyOf, { name });
  if (!used.has(base.toLowerCase())) return base;
  for (let n = 2; ; n++) { const next = fill(t.numbered, { name: base, n }); if (!used.has(next.toLowerCase())) return next; }
}

export function DuplicateAction({ name = '', noun, variant = 'copy', taken = [], onDuplicate, onUndo, source, options = [],
  trigger, open, onClose, size, strings, className }) {
  devWarn('DuplicateAction', { variant, size }, { variant: ['copy','rename'], size: ['md','sm','xs','2xs','lg'] });
  const t = useStrings('duplicateAction', strings);
  const toast = useOptionalToast();
  const [shown, setShown] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState('');
  const [chosen, setChosen] = React.useState([]);
  const input = React.useRef(null);
  const formId = useUid('plx-duplicate');
  const fresh = () => copyName(name, taken, strings);
  const said = (newName) => fill(t.done, { name: q(newName) });

  const begin = () => {
    if (variant === 'rename') {
      setValue(fresh()); setError(''); setChosen(options.filter((o) => o.defaultChecked).map((o) => o.id)); setShown(true);
      return;
    }
    const newName = fresh();
    if (onDuplicate) onDuplicate(newName, []);
    if (toast) toast.show(said(newName), onUndo ? { action: { label: t.undo, onAction: () => onUndo(newName) } } : { tone: 'success' });
    else announce(said(newName));
    if (onClose) onClose();
  };
  const close = () => { setShown(false); if (onClose) onClose(); };

  const was = React.useRef(false);
  React.useEffect(() => { if (open && !was.current) begin(); if (!open && was.current) setShown(false); was.current = !!open; }, [open]);
  React.useEffect(() => { if (shown && input.current && input.current.select) input.current.select(); }, [shown]);

  const submit = (e) => {
    e.preventDefault();
    const v = value.trim();
    const used = new Set((taken || []).map((x) => String(x).trim().toLowerCase()));
    const problem = !v ? t.empty : used.has(v.toLowerCase()) ? fill(t.taken, { noun, name: q(v) }) : '';
    setError(problem);
    if (problem) { if (input.current) input.current.focus(); return; }
    if (onDuplicate) onDuplicate(v, chosen);
    if (toast) toast.show(said(v), { tone: 'success' }); else announce(said(v));
    close();
  };

  const own = trigger === false ? null : trigger || <Button icon={EdCopyIcon} size={size}>{t.duplicate}</Button>;
  const start = own ? React.cloneElement(own, { onClick: (e) => { if (own.props.onClick) own.props.onClick(e); if (!e.defaultPrevented) begin(); } }) : null;
  return (
    <>
      {start}
      {variant === 'rename' ? (
        <Dialog open={shown} onClose={close} title={fill(t.title, { noun })} size="sm" initialFocus={input}
          footer={<><Button onClick={close}>{t.cancel}</Button><Button variant="primary" type="submit" form={formId}>{t.duplicate}</Button></>}>
          <form id={formId} noValidate onSubmit={submit} className={cx('plx-duplicate-action', options.length && 'plx-duplicate-action--options', className)}>
            <Field label={t.name} error={error || undefined}>
              <Input ref={input} value={value} onChange={(e) => { setValue(e.target.value); if (error) setError(''); }} />
            </Field>
            <p className="plx-duplicate-action__source">
              <span className="plx-duplicate-action__icon" aria-hidden="true"><Icon name={EdCopyIcon} /></span>
              <span className="plx-duplicate-action__from">{fill(t.from, { name: q(name) }) + (source ? ' · ' + source : '')}</span>
            </p>
            {options.length ? (
              <Fieldset legend={t.also}>
                {options.map((o) => (
                  <Checkbox key={o.id} label={o.label} checked={chosen.indexOf(o.id) >= 0}
                    onChange={(e) => setChosen((c) => (e.target.checked ? c.concat(o.id) : c.filter((x) => x !== o.id)))} />
                ))}
              </Fieldset>
            ) : null}
          </form>
        </Dialog>
      ) : null}
    </>
  );
}
