/* Plenix · RenameAction
   Summary: Giving something a new name (04 Actions › Common actions › Rename): in place, where the name is shown
     (inline: the name turns into a field, InlineEdit), or in a small dialog opened from a button or a menu item
     (dialog). Both check the new name the same way: not empty, no slash, not the name of another item in the same place;
     a file keeps its extension (only the name before it is selected). Built from InlineEdit, Dialog, Field, Input and
     Button.
   Usage:
     <RenameAction label="Name" value={asset.name} names={siblings} extension onRename={(next) => save(next)} />
     <RenameAction variant="dialog" value={folder.name} names={siblings} onRename={(next) => save(next)} />
     <RenameAction variant="dialog" open={renaming} onClose={() => setRenaming(false)} value={asset.name} onRename={…} />
                                                                     // opened from a menu item ("Rename…")
   Props:
     value: the current name (required)
     onRename(next): runs with the new name; return a Promise to keep the field busy until it settles (a rejected Promise
       keeps it open with the error's message)
     variant: "inline" (default) | "dialog"
     label: what the name is ("Name", "File name"): the field's label (default strings.label)
     names: the names of the other items in the same place; a new name may not be one of them (compared without regard
       to case)
     extension: the name is a file name: the part after the last dot stays as it is and only the name before it is
       selected when the field opens (default false)
     validate(next): more rules: returns an error message, or nothing when the name may be saved
     maxLength: the longest name (default 255)
     data: the name in the data font, for technical names such as codes (default false; file names people choose are
       UI text)
     open, onClose(): the dialog opened from elsewhere (a menu item, a shortcut); without open the dialog variant draws
       its own button ("Rename…")
     triggerProps: more props for that button (size, variant, iconOnly)
     disabled: the name cannot change now (default false)
     strings: the words it shows and announces, for other languages: { label: "Name", rename: "Rename", open: "Rename…",
       title: "Rename {name}", cancel: "Cancel", empty: "Enter a name", slash: "A name can’t contain / or \\",
       taken: "There’s already an item named {name} here", tooLong: "Use {max} characters or fewer",
       renamed: "Renamed to {name}", failed: "The name could not be changed" }
     className: more classes on the rename action
   Behavior:
     Inline: click, Enter, Space or F2 on the name opens the field; Enter saves, Escape puts the name back, leaving the field
       saves (InlineEdit). Dialog: the button opens the dialog with the name selected; Rename (or Enter) saves, Cancel,
       Escape or the close button put it back; focus returns to the button.
     An unchanged name closes without saving. A name that breaks a rule keeps the field open with its message under it
       (aria-invalid, aria-describedby), and focus stays in the field.
     "Renamed to …" is announced when the new name is saved.
   Notes:
     The dialog's button reads "Rename…" (an ellipsis: it asks for more before acting); as an item in an actions menu use
       the menu item with open and onClose. Leading and trailing spaces are taken off before the rules run.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { announce } from '../../utils/announce.tsx';
import { useUid } from '../../utils/layer.ts';
import { InlineEdit } from '../../components/InlineEdit/InlineEdit.tsx';
import { Dialog } from '../../components/Dialog/Dialog.jsx';
import { Field } from '../../components/Field/Field.tsx';
import { Input } from '../../components/Input/Input.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import RenameIcon from 'plenix-platform/icons/plenix/rename';
import { fill } from '../../utils/fill.ts';

// the name before a file's extension (the whole name when it has none, or starts with its only dot)
export function baseNameEnd(name) { const i = String(name).lastIndexOf('.'); return i > 0 ? i : String(name).length; }

export function RenameAction({ value = '', onRename, variant = 'inline', label, names = [], extension = false, validate, maxLength = 255, data = false,
  open: openProp, onClose, triggerProps, disabled = false, strings, className, ...rest }) {
  devWarn('RenameAction', { variant }, { variant: ['inline','dialog'] });
  const t = useStrings('renameAction', strings);
  const name = label || t.label;
  const formId = useUid('plx-rename');
  const controlled = openProp !== undefined;
  const [ownOpen, setOwnOpen] = React.useState(false);
  const open = controlled ? openProp : ownOpen;
  const [draft, setDraft] = React.useState(value);
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const input = React.useRef(null);

  // the rules every new name passes (the page's own validate last)
  const check = (raw) => {
    const next = String(raw).trim();
    if (!next) return t.empty;
    if (/[\/\\]/.test(next)) return t.slash;
    if (next.length > maxLength) return fill(t.tooLong, { max: maxLength });
    const lower = next.toLowerCase();
    if (next !== value && names.some((n) => n !== value && String(n).toLowerCase() === lower)) return fill(t.taken, { name: next });
    return validate ? validate(next) || '' : '';
  };
  // a file name opens with only the name before its extension selected
  const selectBase = (el) => { if (el && el.setSelectionRange) el.setSelectionRange(0, extension ? baseNameEnd(el.value) : el.value.length); };

  React.useEffect(() => { if (open) { setDraft(value); setError(''); setBusy(false); } }, [open]);
  React.useEffect(() => { if (open && input.current) setTimeout(() => selectBase(input.current), 0); }, [open]);

  const close = () => { if (controlled) { if (onClose) onClose(); } else setOwnOpen(false); };
  const done = (next) => { close(); announce(fill(t.renamed, { name: next })); };
  const submit = (e) => {
    e.preventDefault();
    if (busy) return;
    const next = String(draft).trim();
    if (next === value) { close(); return; }
    const problem = check(next);
    setError(problem);
    if (problem) { if (input.current) input.current.focus(); return; }
    const r = onRename ? onRename(next) : null;
    if (r && typeof r.then === 'function') {
      setBusy(true);
      r.then(() => done(next), (err) => { setBusy(false); setError((err && err.message) || t.failed); if (input.current) input.current.focus(); });
    } else done(next);
  };

  if (variant !== 'dialog') {
    // InlineEdit selects the whole name when it opens; a file name then narrows the selection to the name before the dot.
    // The announcement waits a turn, so it comes after InlineEdit's own (left empty here)
    return (
      <span {...rest} className={cx('plx-rename-action', 'plx-rename-action--inline', className)}
        onFocus={(e) => { if (extension && e.target.tagName === 'INPUT') { const el = e.target; setTimeout(() => selectBase(el), 0); } }}
        onKeyDown={(e) => { if (e.key === 'F2' && e.target.classList && e.target.classList.contains('plx-inline-edit__read')) { e.preventDefault(); e.target.click(); } }}>
        <InlineEdit label={name} value={value} data={data} disabled={disabled} validate={(v) => check(v) || null}
          onConfirm={(next) => { const v = String(next).trim(); const r = onRename ? onRename(v) : null; const say = () => setTimeout(() => announce(fill(t.renamed, { name: v })), 0); if (r && typeof r.then === 'function') return r.then(say); say(); return r; }}
          strings={{ saved: '' }} />
      </span>
    );
  }
  return (
    <span {...rest} className={cx('plx-rename-action', 'plx-rename-action--dialog', className)}>
      {controlled ? null : <Button icon={RenameIcon} disabled={disabled} {...triggerProps} onClick={() => setOwnOpen(true)}>{t.open}</Button>}
      <Dialog open={open} onClose={close} title={fill(t.title, { name: value })} size="sm" initialFocus={input}
        footer={<><Button onClick={close}>{t.cancel}</Button><Button variant="primary" type="submit" form={formId} loading={busy}>{t.rename}</Button></>}>
        <form id={formId} noValidate onSubmit={submit} className="plx-rename-action__form">
          <Field label={name} error={error || undefined}>
            <Input ref={input} value={draft} data={data} maxLength={maxLength} autoComplete="off" spellCheck={false}
              onChange={(e) => { setDraft(e.target.value); if (error) setError(''); }} />
          </Field>
        </form>
      </Dialog>
    </span>
  );
}
