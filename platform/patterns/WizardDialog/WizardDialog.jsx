/* Plenix · WizardDialog
   Summary: A Wizard in a medium, large or full-screen Platform Dialog.
   Usage: <WizardDialog open title="Create record" steps={steps} onClose={close} />
   Props:
     open, title, size: Dialog props; size is "md", "lg" or "full".
     dirty: unsaved work; onClose(): dismiss; strings: Wizard strings plus close and unsaved.
     Other props reach Wizard, including steps, summary and onComplete.
   Behavior:
     Close, Escape, the veil and Cancel pass through the unsaved-change guard.
     Pending persistence cannot be dismissed. Closing resets the Wizard for the next opening.
   Notes:
     Dialog owns focus trapping and restoration. The caller closes after successful persistence.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { Dialog } from '../../components/Dialog/Dialog.tsx';
import { Wizard } from '../Wizard/Wizard.jsx';
import { useUnsavedGuard } from '../../providers/UnsavedGuard.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';

export function WizardDialog({ open, title, size = 'md', dirty = false, onClose, strings, ...props }) {
  devWarn('WizardDialog', { size }, { size: ['md','lg','full'] });
  const t = useStrings('wizardDialog', strings);
  const [busy, setBusy] = React.useState(false);
  const guard = useUnsavedGuard(open && dirty, t.unsaved);
  const close = guard(() => { if (!busy && onClose) onClose(); });
  return <Dialog open={open} title={title} size={['md', 'lg', 'full'].includes(size) ? size : 'md'}
    onClose={close} dismissible={!busy} closeLabel={t.close}>
    {open ? <Wizard {...props} className={["plx-wizard-dialog", props.className].filter(Boolean).join(" ")} label={title} strings={strings} onCancel={close} onComplete={async () => {
      setBusy(true);
      try { if (props.onComplete) await props.onComplete(); } finally { setBusy(false); }
    }} /> : null}
  </Dialog>;
}
