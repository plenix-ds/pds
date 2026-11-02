/* Plenix · Offboarding
   Summary: Export data before explicit subscription cancellation or typed account deletion confirmation.
   Usage: <Offboarding open accountName="Workspace" action="delete" onConfirm={deleteAccount} onClose={close} onExport={exportData} formats={formats} />
   Props:
     open, onClose: lifecycle; accountName: exact confirmation text; action: "cancel" (default) or "delete".
     onConfirm({ action, reason }): persistence promise; onExport(options), formats: ExportDialog integration.
     strings: { title, backup, export, review, reason, confirmName, mismatch, cancel, complete }; className.
   Behavior:
     The first step offers export without requiring it. Deletion requires the exact account name.
     Failed final actions retain values and remain retryable; duplicate requests are blocked by Wizard.
   Notes:
     The caller must authorize cancellation/deletion and supply consequences in children.
*/
import React from 'react';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Input, Textarea } from '../../components/Input/Input.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { WizardDialog } from '../WizardDialog/WizardDialog.jsx';
import { ExportDialog } from '../ExportDialog/ExportDialog.jsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

export function Offboarding({ open, onClose, accountName, action = 'cancel', onConfirm, onExport, formats = [], children, strings, className }) {
  const words = useStrings('offboarding', strings);
  // the title and the last button name the action: an app's own words in strings win
  const named = action === 'delete' ? words.deleteAccount : words.cancelSubscription;
  const t = Object.assign({}, words, { title: (strings && strings.title) || named, complete: (strings && strings.complete) || named });
  const [reason, setReason] = React.useState(''), [name, setName] = React.useState(''), [exporting, setExporting] = React.useState(false);
  React.useEffect(() => { if (open) { setReason(''); setName(''); setExporting(false); } }, [open]);
  return <Stack className={cx('plx-offboarding', className)}>
    <WizardDialog className={cx("plx-offboarding", className)} open={open} title={t.title} onClose={onClose} dirty={!!(reason || name)} strings={t}
      onComplete={async () => { await onConfirm({ action, reason }); if (onClose) onClose(); }} steps={[
        { id: 'backup', label: t.backup, content: <Stack>{children}{onExport ? <Button onClick={() => setExporting(true)}>{t.export}</Button> : null}
          <Field label={t.reason}><Textarea value={reason} onChange={(e) => setReason(e.target.value)} /></Field></Stack> },
        { id: 'confirm', label: t.review, validate: () => action === 'delete' && (!accountName || name !== accountName) ? t.mismatch : '',
          content: <Stack><Text>{accountName}</Text>{action === 'delete' ? <Field label={t.confirmName} required><Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" /></Field> : null}</Stack> }
      ]} />
    {onExport ? <ExportDialog open={exporting && open} onClose={() => setExporting(false)} formats={formats} onExport={onExport} strings={strings} /> : null}
  </Stack>;
}
