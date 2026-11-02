/* Plenix · DraftState
   Summary: Draft Badge, version and actions to resume or confirm discarding work.
   Usage: <DraftState version="3" onResume={resume} onDiscard={discard} />
   Props:
     version: optional version; saveState: optional Autosave state; onResume(), onDiscard(): promises.
     strings: { draft, resume, discard, confirm, message, cancel, failed }; className: extra classes.
   Behavior:
     Discard requires confirmation. Failures retain the draft and show an error. Pending actions cannot repeat.
   Notes:
     The caller owns storage and content. Draft is always an icon Badge.
*/
import React from 'react';
import { Badge } from '../../components/Badge/Badge.tsx';
import { VersionLabel } from '../../components/VersionLabel/VersionLabel.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Dialog } from '../../components/Dialog/Dialog.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { Stack, Inline } from '../../components/Stack/Stack.tsx';
import { SaveStatus } from '../Autosave/Autosave.jsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import PencilIcon from 'plenix-platform/icons/plenix/pencil';

export function DraftState({ version, saveState, onResume, onDiscard, strings, className }) {
  const t = useStrings('draftState', strings);
  const [confirm, setConfirm] = React.useState(false), [busy, setBusy] = React.useState(false), [error, setError] = React.useState('');
  const lock = React.useRef(false), cancel = React.useRef(null);
  const run = async (fn) => {
    if (lock.current) return; lock.current = true; setBusy(true); setError('');
    try { await fn(); setConfirm(false); } catch (e) { setError(t.failed); }
    finally { lock.current = false; setBusy(false); }
  };
  return <Stack className={cx('plx-draft-state', className)}>
    <Inline wrap><Badge tone="neutral" icon={PencilIcon}>{t.draft}</Badge>
      {version != null ? <VersionLabel version={version} /> : null}{saveState ? <SaveStatus state={saveState} strings={strings} /> : null}
      {onResume ? <Button disabled={busy} onClick={() => run(onResume)}>{t.resume}</Button> : null}
      {onDiscard ? <Button variant="danger-secondary" disabled={busy} onClick={() => setConfirm(true)}>{t.discard}</Button> : null}</Inline>
    {!confirm && error ? <Notice tone="danger">{error}</Notice> : null}
    <Dialog open={confirm} role="alertdialog" size="sm" title={t.confirm} description={t.message} className="plx-dialog--destructive"
      initialFocus={cancel} dismissible={!busy} onClose={() => { if (!lock.current) setConfirm(false); }}
      footer={<><Button ref={cancel} disabled={busy} onClick={() => setConfirm(false)}>{t.cancel}</Button>
        <Button variant="danger" disabled={busy} onClick={() => run(onDiscard)}>{t.discard}</Button></>}>
      {error ? <Notice tone="danger">{error}</Notice> : null}
    </Dialog>
  </Stack>;
}
