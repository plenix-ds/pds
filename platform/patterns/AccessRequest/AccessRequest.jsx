/* Plenix · AccessRequest
   Summary: Request access and communicate pending, approved or denied states with icon Badges.
   Usage: <AccessRequest status={status} onRequest={requestAccess} />
   Props:
     status: "request", "pending", "approved" or "denied"; onRequest(message): persistence promise.
     onOpen(): open approved resource; strings: title, description, message, request, pending, approved, denied,
       open, failed; className.
   Behavior:
     Submit once while pending; failed requests retain the message. Successful requests show Pending.
     A denied request can be submitted again. Approved access offers an explicit Open action.
   Notes:
     Only the server can approve access; a submitted request never grants permissions.
*/
import React from 'react';
import { Stack } from '../../components/Stack/Stack.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Textarea } from '../../components/Input/Input.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import LockIcon from 'plenix-platform/icons/plenix/lock';
import RefreshIcon from 'plenix-platform/icons/plenix/refresh';

export function AccessRequest({ status = 'request', onRequest, onOpen, strings, className }) {
  const t = useStrings('accessRequest', strings);
  const [message, setMessage] = React.useState(''), [busy, setBusy] = React.useState(false), [sent, setSent] = React.useState(false), [error, setError] = React.useState('');
  const lock = React.useRef(false);
  React.useEffect(() => { setSent(false); }, [status]);
  const shown = status === 'approved' ? 'approved' : sent ? 'pending' : status;
  const send = async () => {
    if (lock.current) return; lock.current = true; setBusy(true); setError('');
    try { await onRequest(message); setSent(true); } catch (e) { setError(t.failed); } finally { lock.current = false; setBusy(false); }
  };
  return <Stack className={cx('plx-access-request', className)} aria-busy={busy}>
    <EmptyState title={t.title}>{t.description}</EmptyState>
    {shown !== 'request' ? <Badge role="status" tone={shown === 'approved' ? 'success' : shown === 'denied' ? 'negative' : 'waiting'} icon={shown === 'approved' ? CheckIcon : shown === 'denied' ? LockIcon : RefreshIcon}>{t[shown]}</Badge> : null}
    {(shown === 'request' || shown === 'denied') && onRequest ? <><Field label={t.message}><Textarea value={message} disabled={busy} onChange={(e) => setMessage(e.target.value)} /></Field>
      <Button variant="primary" disabled={busy} onClick={send}>{t.request}</Button></> : null}
    {shown === 'approved' && onOpen ? <Button onClick={onOpen}>{t.open}</Button> : null}
    {error ? <Notice tone="danger">{error}</Notice> : null}
  </Stack>;
}
