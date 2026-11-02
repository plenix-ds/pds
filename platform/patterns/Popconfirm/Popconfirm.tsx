/* Plenix · Popconfirm
   Summary: A one-sentence question in a Popover beside the action it guards, with Cancel and the action's verb: a light
     check before a moderately risky action on one item (09 Overlays › Overlay surfaces › Popconfirm). Built from
     Popover and Button only.
   Usage:
     <Popconfirm trigger={<Button size="xs" icon="trash" iconOnly label="Remove tag" />} title="Remove this tag?"
       confirmLabel="Remove" tone="danger" onConfirm={remove} />
     <Popconfirm trigger={<Button>Publish</Button>} title="Publish 3 changes?" description="People with the link see them at once."
       confirmLabel="Publish" onConfirm={publish} />
   Props:
     trigger: the action's button (one element); it opens the question instead of running the action
     title: the question, naming the action and the object ("Remove this tag?")
     description: one more sentence when the consequence needs it (optional)
     confirmLabel: the confirm button's verb ("Remove", "Publish"; never "Yes")
     cancelLabel: the cancel button's text (default strings.cancel)
     tone: "default" (the primary button) | "danger" (the danger button: removing or undoing something)
     onConfirm(): runs the action; the question closes first
     onCancel(): runs when the question closes without the action (Cancel, Escape, a click outside)
     placement: where the question opens (default "bottom-start"; Popover's placements)
     strings: the words it shows, for other languages: { cancel: "Cancel" }
     className: more classes on the popover
   Behavior:
     The trigger opens the question (Popover, role alertdialog, named by the question and described by the description);
       focus moves to Cancel, so Enter never runs the action by accident.
     Confirm runs onConfirm and closes; Cancel, Escape and a click outside close without it; focus returns to the trigger
       from Cancel, Escape and Confirm.
     At the Narrow window class the question opens as a bottom sheet with the same two buttons.
   Notes:
     Irreversible or high-impact actions take a confirmation Dialog; actions that can be undone run at once and offer Undo
       (the toast's action) instead of asking first.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { Button } from '../../components/Button/Button.tsx';
import { Popover } from '../../components/Popover/Popover.tsx';
import type { PopoverProps } from '../../components/Popover/Popover.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';


export type PopconfirmProps = {
  /** the element that opens it: one element */
  trigger: React.ReactElement;
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  tone?: 'default' | 'danger';
  onConfirm?: () => void;
  onCancel?: () => void;
  placement?: PopoverProps['placement'];
  strings?: Catalog | null;
  className?: string;
};
export function Popconfirm({ trigger, title, description, confirmLabel, cancelLabel, tone = 'default', onConfirm, onCancel, placement = 'bottom-start', strings, className }: PopconfirmProps) {
  devWarn('Popconfirm', { tone }, { tone: ['default','danger'] });
  const t = useStrings('popconfirm', strings) as { cancel: string };
  const id = useUid('plx-popconfirm');
  const [open, setOpen] = React.useState(false);
  const cancelRef = React.useRef<HTMLElement>(null);
  const danger = tone === 'danger';
  const onOpenChange = (v: boolean) => { setOpen(v); if (!v && onCancel) onCancel(); };
  const cancel = () => { setOpen(false); if (onCancel) onCancel(); };   // Popover returns focus to the trigger
  const confirm = () => { setOpen(false); if (onConfirm) onConfirm(); };
  const child = React.Children.only(trigger) as React.ReactElement;
  const footer = (
    <>
      <Button ref={cancelRef} onClick={cancel}>{cancelLabel || t.cancel}</Button>
      <Button variant={danger ? 'danger' : 'primary'} onClick={confirm}>{confirmLabel}</Button>
    </>
  );
  return (
    <Popover trigger={child} title={title} footer={footer} role="alertdialog" size="sm" placement={placement} initialFocus={cancelRef}
      open={open} onOpenChange={onOpenChange} aria-describedby={description ? id : undefined}
      className={cx('plx-popconfirm', danger && 'plx-popconfirm--danger', className)}>
      {description ? <p id={id} className="plx-popconfirm__description">{description}</p> : null}
    </Popover>
  );
}
