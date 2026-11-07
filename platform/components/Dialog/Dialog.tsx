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
     The header is a filled band (--plx-sys-surface-dialog-chrome); the footer has no fill and a hairline above it only while the body scrolls.
     The title is at the start of the header, the close button at its end, the actions in the footer.
     The layer renders in a portal on document.body.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx.ts';
import { focusables, useLayer, useUid } from '../../utils/layer.ts';
import { asIcon } from '../Icon/Icon.tsx';
import type { IconValue } from '../Icon/Icon.tsx';
import { Button } from '../Button/Button.tsx';
import { Field } from '../Field/Field.tsx';
import { Input } from '../Input/Input.tsx';
import type { InputProps } from '../Input/Input.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CloseIcon from 'plenix-platform/icons/plenix/close';


// a non-modal dialog: focus moves in when it opens (not trapped), F6 moves between it and its opener, and focus goes back
// to the opener when it closes from inside (useLayer does this only for modal layers)
function useNonModalFocus(ref: React.RefObject<HTMLDivElement | null>, open: boolean | undefined, active: boolean, firstFocus: () => HTMLElement | null) {
  const inside = React.useRef(false);
  React.useEffect(() => {
    if (!open || !active) return undefined;
    const opener = document.activeElement as HTMLElement | null;
    const root = ref.current;
    const first = firstFocus() || root;
    if (first) first.focus({ preventScroll: true });
    inside.current = true;
    const f6 = (e: KeyboardEvent) => {
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

type DialogWords = { close: string; cancel: string; confirm: string; save: string };
export type DialogProps = {
  open?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** an icon name, an imported module or an element before the title */
  icon?: IconValue | React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** "dialog" or "alertdialog" */
  role?: string;
  footer?: React.ReactNode;
  /** what takes focus when it opens */
  initialFocus?: React.RefObject<HTMLElement | null>;
  closeLabel?: string;
  /** Close, Escape and the scrim close it (default true) */
  dismissible?: boolean;
  flush?: boolean;
  /** false: a non-modal dialog (the page stays usable; F6 moves between them) */
  modal?: boolean;
  className?: string;
  children?: React.ReactNode;
};
export type DrawerProps = Omit<DialogProps, 'size'> & { size?: 'sm' | 'md' | 'lg'; side?: 'start' | 'end' };
type ModalShellProps = Omit<DialogProps, 'size'> & { kind: 'dialog' | 'drawer'; size: string; side?: 'start' | 'end' };
function ModalShell({ kind, open, onClose, title, description, icon, size, side, role = 'dialog', footer, initialFocus,
  closeLabel, dismissible = true, flush = false, modal = true, className, children }: ModalShellProps) {
  const t = useStrings('dialog') as DialogWords;
  const ref = React.useRef<HTMLDivElement>(null);
  const id = useUid('plx-dlg');
  const firstFocus = () => {
    if (initialFocus && initialFocus.current) return initialFocus.current;
    const root = ref.current as HTMLDivElement;
    return focusables(root.querySelector('.plx-dialog__body'))[0] || focusables(root.querySelector('.plx-dialog__footer'))[0] || null;
  };
  // the footer hairline shows only while the body scrolls (D-0102)
  const [scrolls, setScrolls] = React.useState(false);
  React.useEffect(() => {
    const body = open && ref.current ? ref.current.querySelector<HTMLElement>('.plx-dialog__body') : null;
    if (!body) return undefined;
    const check = () => setScrolls(body.scrollHeight > body.clientHeight + 1);
    check();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(check);
    if (ro) { ro.observe(body); Array.from(body.children).forEach((c) => ro.observe(c)); }
    return () => { if (ro) ro.disconnect(); };
  });
  useLayer(ref, open, { modal, onEscape: dismissible && modal ? onClose : null, initialFocus: firstFocus });
  const inside = useNonModalFocus(ref, open, !modal, firstFocus);
  if (!open) return null;
  const onVeil = (e: React.MouseEvent<HTMLDivElement>) => { if (modal && dismissible && e.target === e.currentTarget && onClose) onClose(); };
  // non-modal: Escape closes it only while focus is inside it (a menu inside it closes first: its layer stops the key)
  const onKeyDown = !modal && dismissible ? (e: React.KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Escape' && onClose) { e.stopPropagation(); onClose(); } } : undefined;
  const track: React.HTMLAttributes<HTMLDivElement> = !modal ? {
    onFocus: () => { inside.current = true; },
    onBlur: (e) => { inside.current = !!(ref.current && ref.current.contains(e.relatedTarget as Node | null)); },
  } : {};
  return createPortal(
    <div className={cx('plx-modal-layer', 'plx-modal-layer--' + kind, side && 'plx-modal-layer--' + side, !modal && 'plx-modal-layer--non-modal')} onMouseDown={onVeil}>
      <div ref={ref} role={role} aria-modal={modal ? 'true' : undefined} aria-labelledby={id + 't'} aria-describedby={description ? id + 'd' : undefined}
        tabIndex={-1} className={cx('plx-dialog', kind === 'drawer' && 'plx-drawer', kind === 'drawer' && side === 'start' && 'plx-drawer--start', !modal && 'plx-dialog--non-modal', 'plx-' + kind + '--' + size, className)} onKeyDown={onKeyDown} {...track}>
        <div className="plx-dialog__header">
          {icon ? <span className="plx-dialog__icon">{asIcon(icon)}</span> : null}
          <h2 id={id + 't'} className="plx-dialog__title">{title}</h2>
          {dismissible ? <Button variant="ghost" iconOnly tooltip={false} icon={CloseIcon} label={closeLabel ?? t.close} className="plx-dialog__close" onClick={onClose} /> : null}
        </div>
        <div className={cx('plx-dialog__body', flush && 'plx-dialog__body--flush')}>
          {description ? <p id={id + 'd'} className="plx-dialog__description">{description}</p> : null}
          {children}
        </div>
        {footer ? <div className={cx('plx-dialog__footer', scrolls && 'plx-dialog__footer--divided')}>{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}

export function Dialog({ size = 'md', ...props }: DialogProps) {
  devWarn('Dialog', { size }, { size: ['sm','md','lg','xl','full'] });
  return <ModalShell kind="dialog" size={size} {...props} />;
}

export function Drawer({ size = 'md', side = 'end', ...props }: DrawerProps) {
  devWarn('Drawer', { size }, { size: ['sm','md','lg'] });
  return <ModalShell kind="drawer" size={size} side={side} {...props} />;
}

export type ConfirmDialogProps = {
  open?: boolean;
  title?: React.ReactNode;
  message?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  /** a destructive action: the danger button, and focus starts on Cancel */
  destructive?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
};
export function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, destructive = false, onConfirm, onCancel, children }: ConfirmDialogProps) {
  const t = useStrings('dialog') as DialogWords;
  const cancel = React.useRef<HTMLElement>(null);
  return (
    <ModalShell kind="dialog" size="sm" role="alertdialog" open={open} onClose={onCancel} title={title} description={message}
      initialFocus={destructive ? cancel : undefined} className={destructive ? 'plx-dialog--destructive' : undefined}
      footer={<><Button ref={cancel} onClick={onCancel}>{cancelLabel ?? t.cancel}</Button><Button variant={destructive ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel ?? t.confirm}</Button></>}>
      {children}
    </ModalShell>
  );
}

export type PromptDialogProps = {
  open?: boolean;
  title?: React.ReactNode;
  message?: React.ReactNode;
  /** the field's label */
  label?: React.ReactNode;
  defaultValue?: string;
  placeholder?: string;
  description?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  /** a message when the value is not acceptable, else nothing */
  validate?: (value: string) => React.ReactNode;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
  /** more props for the field's Input */
  inputProps?: InputProps;
  size?: DialogProps['size'];
};
export function PromptDialog({ open, title, message, label, defaultValue = '', placeholder, description, confirmLabel, cancelLabel,
  validate, onSubmit, onCancel, inputProps, size = 'sm' }: PromptDialogProps) {
  devWarn('PromptDialog', { size }, { size: ['sm','md','lg','xl','full'] });
  const t = useStrings('dialog') as DialogWords;
  const formId = useUid('plx-prompt');
  const input = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState(defaultValue);
  const [error, setError] = React.useState<React.ReactNode>('');
  // each time it opens: the value starts again from defaultValue, with no error, and its text is selected
  React.useEffect(() => { if (open) { setValue(defaultValue); setError(''); } }, [open]);
  React.useEffect(() => { if (open && input.current && input.current.select) input.current.select(); }, [open]);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
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
