/* Plenix · Dialog, ConfirmDialog, PromptDialog, Drawer
   Summary: Modal layers. Dialog is a centered window (or, with modal={false}, a non-modal one beside the page);
     ConfirmDialog is an alert dialog that asks to confirm an action; PromptDialog asks for one short value; Drawer is the
     same shell, docked to a side.
   Usage:
     <Dialog open={open} onClose={close} title="Rename" description="…" size="sm" footer={<>…</>}>…</Dialog>
     <Dialog open={open} onClose={close} title="Find and replace" modal={false} size="sm">…</Dialog>
     <ConfirmDialog open={open} title="Delete 3 assets?" message="…" confirmLabel="Delete" destructive
       onConfirm={() => …} onCancel={() => …} />
     <PromptDialog open={open} title="Rename asset" label="Name" defaultValue="Cross 014" confirmLabel="Rename"
       validate={(v) => (v.trim() ? '' : 'Enter a name.')} onSubmit={(value) => …} onCancel={() => …} />
     <Drawer open={open} onClose={close} title="Details" side="end" size="md" footer={<>…</>}>…</Drawer>
   Props:
     Dialog.open: whether the layer is shown
     Dialog.modal: false makes it non-modal (default true): no veil, the page behind stays usable, focus is not trapped
       and the page scrolls (09 Overlays › Dialogs › Non-modal dialog)
     Dialog.onClose(): runs from the close button, Escape and a click on the veil
     Dialog.title: the title at the start of the header; it names the dialog
     Dialog.description: a paragraph at the top of the body; it describes the dialog
     Dialog.icon: an <Icon> (or an icon name) before the title
     Dialog.size: "sm" | "md" (default) | "lg" | "xl" | "full"
     Dialog.footer: the footer actions (their height is the dialog role)
     Dialog.initialFocus: a ref to the element that takes focus when the layer opens
     Dialog.closeLabel: the accessible name of the close button (default "Close")
     Dialog.dismissible: false turns off Escape and the veil click, and hides the close button (default true)
     Dialog.flush: true removes the body padding (default false)
     Dialog.className: more classes on the dialog
     Dialog.children: the body
     Drawer.side: "end" (default) | "start"
     Drawer.size: "sm" | "md" (default) | "lg"
     ConfirmDialog.open: whether the dialog is shown
     ConfirmDialog.title: the question
     ConfirmDialog.message: the explanation under the title
     ConfirmDialog.confirmLabel: the confirm button text (default "Confirm")
     ConfirmDialog.cancelLabel: the cancel button text (default "Cancel")
     ConfirmDialog.destructive: the action destroys something (default false)
     ConfirmDialog.onConfirm(): runs from the confirm button
     ConfirmDialog.onCancel(): runs from the cancel button, the close button, Escape and the veil
     ConfirmDialog.children: more content in the body
     PromptDialog.open: whether the dialog is shown
     PromptDialog.title: the action, as a title ("Rename asset")
     PromptDialog.message: a sentence under the title (optional)
     PromptDialog.label: the field's visible label
     PromptDialog.defaultValue: the value the field starts with when the dialog opens (default "")
     PromptDialog.placeholder: a hint in the empty field (never in place of the label)
     PromptDialog.description: help text under the field
     PromptDialog.confirmLabel: the confirm button text, the action's verb (default "Save")
     PromptDialog.cancelLabel: the cancel button text (default "Cancel")
     PromptDialog.validate(value): returns an error message, or "" when the value is fine; it runs on submit
     PromptDialog.onSubmit(value): runs with the value when it is submitted and valid
     PromptDialog.onCancel(): runs from Cancel, the close button, Escape and the veil
     PromptDialog.inputProps: more props for the Input (maxLength, inputMode, autoComplete…)
     PromptDialog.size: as Dialog.size (default "sm")
   Behavior:
     Focus moves in (initialFocus, else the first control in the body, else the first footer action) and returns to the opener.
     Tab stays inside the layer.
     Escape and a click on the veil close it, unless dismissible is false.
     The page does not scroll while the layer is open.
     A destructive ConfirmDialog starts on Cancel, uses a danger confirm button and the destructive dialog role.
     Non-modal (modal={false}): the same window and place, with no veil; the page behind stays usable and scrolls. Focus
       moves in when it opens but is not trapped; F6 moves focus between the dialog and the element that opened it;
       Escape closes it while focus is inside it, and focus returns to the opener when it closes from inside.
       aria-modal is not set.
     PromptDialog: a form with one field. The field takes focus with its text selected; Enter submits; validate runs on
       submit, and an error keeps the dialog open with the message under the field (announced); nothing is disabled.
       The value starts again from defaultValue each time it opens.
   Notes:
     Drawer takes every Dialog prop (open, onClose, title, description, icon, footer, initialFocus, closeLabel, dismissible,
       flush, className, children), with its own side and size.
     Modal layers follow D3, option C.
     Full-screen dialog (09 Overlays › Dialogs › Full-screen dialog) is size="full": the whole modal layer, inside the
       layout inset.
     Header and footer are filled bands (--plx-sys-surface-dialog-chrome) with hairline dividers, always shown; the body is white.
     The title is at the start of the header, the close button at its end, the actions in the footer.
     The layer renders in a portal on document.body.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx.ts';
import { focusables, useLayer, useUid } from '../../utils/layer.ts';
import { asIcon } from '../Icon/Icon.tsx';
import { Button } from '../Button/Button.tsx';
import { Field } from '../Field/Field.tsx';
import { Input } from '../Input/Input.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CloseIcon from 'plenix-platform/icons/plenix/close';


// a non-modal dialog: focus moves in when it opens (not trapped), F6 moves between it and its opener, and focus goes back
// to the opener when it closes from inside (useLayer does this only for modal layers)
function useNonModalFocus(ref, open, active, firstFocus) {
  const inside = React.useRef(false);
  React.useEffect(() => {
    if (!open || !active) return undefined;
    const opener = document.activeElement;
    const root = ref.current;
    const first = firstFocus() || root;
    if (first) first.focus({ preventScroll: true });
    inside.current = true;
    const f6 = (e) => {
      if (e.key !== 'F6' || e.ctrlKey || e.metaKey || e.altKey || !ref.current) return;
      const into = !ref.current.contains(document.activeElement);
      const target = into ? (firstFocus() || ref.current) : opener;
      if (target && target.focus && document.contains(target)) { e.preventDefault(); target.focus({ preventScroll: true }); }
    };
    document.addEventListener('keydown', f6);
    return () => {
      document.removeEventListener('keydown', f6);
      const a = document.activeElement;
      if (inside.current && (!a || a === document.body) && opener && opener.focus && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [open, active]);
  return inside;
}

function ModalShell({ kind, open, onClose, title, description, icon, size, side, role = 'dialog', footer, initialFocus,
  closeLabel, dismissible = true, flush = false, modal = true, className, children }) {
  const t = useStrings('dialog');
  const ref = React.useRef(null);
  const id = useUid('plx-dlg');
  const firstFocus = () => {
    if (initialFocus && initialFocus.current) return initialFocus.current;
    const root = ref.current;
    return focusables(root.querySelector('.plx-dialog__body'))[0] || focusables(root.querySelector('.plx-dialog__footer'))[0] || null;
  };
  useLayer(ref, open, { modal, onEscape: dismissible && modal ? onClose : null, initialFocus: firstFocus });
  const inside = useNonModalFocus(ref, open, !modal, firstFocus);
  if (!open) return null;
  const onVeil = (e) => { if (modal && dismissible && e.target === e.currentTarget && onClose) onClose(); };
  // non-modal: Escape closes it only while focus is inside it (a menu inside it closes first: its layer stops the key)
  const onKeyDown = !modal && dismissible ? (e) => { if (e.key === 'Escape' && onClose) { e.stopPropagation(); onClose(); } } : undefined;
  const track = !modal ? {
    onFocus: () => { inside.current = true; },
    onBlur: (e) => { inside.current = !!(ref.current && ref.current.contains(e.relatedTarget)); },
  } : {};
  return createPortal(
    <div className={cx('plx-modal-layer', 'plx-modal-layer--' + kind, side && 'plx-modal-layer--' + side, !modal && 'plx-modal-layer--non-modal')} onMouseDown={onVeil}>
      <div ref={ref} role={role} aria-modal={modal ? 'true' : undefined} aria-labelledby={id + 't'} aria-describedby={description ? id + 'd' : undefined}
        tabIndex={-1} className={cx('plx-dialog', kind === 'drawer' && 'plx-drawer', kind === 'drawer' && side === 'start' && 'plx-drawer--start', !modal && 'plx-dialog--non-modal', 'plx-' + kind + '--' + size, className)} onKeyDown={onKeyDown} {...track}>
        <div className="plx-dialog__header">
          {icon ? <span className="plx-dialog__icon">{asIcon(icon)}</span> : null}
          <h2 id={id + 't'} className="plx-dialog__title">{title}</h2>
          {dismissible ? <Button variant="ghost" iconOnly icon={CloseIcon} label={closeLabel ?? t.close} className="plx-dialog__close" onClick={onClose} /> : null}
        </div>
        <div className={cx('plx-dialog__body', flush && 'plx-dialog__body--flush')}>
          {description ? <p id={id + 'd'} className="plx-dialog__description">{description}</p> : null}
          {children}
        </div>
        {footer ? <div className="plx-dialog__footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}

export function Dialog({ size = 'md', ...props }) {
  devWarn('Dialog', { size }, { size: ['sm','md','lg','xl','full'] });
  return <ModalShell kind="dialog" size={size} {...props} />;
}

export function Drawer({ size = 'md', side = 'end', ...props }) {
  devWarn('Drawer', { size }, { size: ['sm','md','lg'] });
  return <ModalShell kind="drawer" size={size} side={side} {...props} />;
}

export function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, destructive = false, onConfirm, onCancel, children }) {
  const t = useStrings('dialog');
  const cancel = React.useRef(null);
  return (
    <ModalShell kind="dialog" size="sm" role="alertdialog" open={open} onClose={onCancel} title={title} description={message}
      initialFocus={destructive ? cancel : undefined} className={destructive ? 'plx-dialog--destructive' : undefined}
      footer={<><Button ref={cancel} onClick={onCancel}>{cancelLabel ?? t.cancel}</Button><Button variant={destructive ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel ?? t.confirm}</Button></>}>
      {children}
    </ModalShell>
  );
}

export function PromptDialog({ open, title, message, label, defaultValue = '', placeholder, description, confirmLabel, cancelLabel,
  validate, onSubmit, onCancel, inputProps, size = 'sm' }) {
  devWarn('PromptDialog', { size }, { size: ['sm','md','lg','xl','full'] });
  const t = useStrings('dialog');
  const formId = useUid('plx-prompt');
  const input = React.useRef(null);
  const [value, setValue] = React.useState(defaultValue);
  const [error, setError] = React.useState('');
  // each time it opens: the value starts again from defaultValue, with no error, and its text is selected
  React.useEffect(() => { if (open) { setValue(defaultValue); setError(''); } }, [open]);
  React.useEffect(() => { if (open && input.current && input.current.select) input.current.select(); }, [open]);
  const submit = (e) => {
    e.preventDefault();
    const problem = validate ? validate(value) || '' : '';
    setError(problem);
    if (problem) { if (input.current) input.current.focus(); return; }
    if (onSubmit) onSubmit(value);
  };
  return (
    <ModalShell kind="dialog" size={size} open={open} onClose={onCancel} title={title} description={message} initialFocus={input}
      footer={<><Button onClick={onCancel}>{cancelLabel ?? t.cancel}</Button><Button variant="primary" type="submit" form={formId}>{confirmLabel ?? t.save}</Button></>}>
      <form id={formId} noValidate onSubmit={submit}>
        <Field label={label} description={description} error={error || undefined}>
          <Input ref={input} value={value} placeholder={placeholder} onChange={(e) => { setValue(e.target.value); if (error) setError(''); }} {...inputProps} />
        </Field>
      </form>
    </ModalShell>
  );
}
