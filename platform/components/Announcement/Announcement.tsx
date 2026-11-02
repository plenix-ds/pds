/* Plenix · Announcement
   Summary: The same announcement as a Banner, Card or Dialog, with explicit actions and recoverable dismissal.
   Usage: <Announcement id="release" title="New workspace tools" onDismiss={markRead}>Details</Announcement>
   Props:
     id: changes reset dismissed state; variant: banner (default) | card | dialog; open: default true.
     title, children, actions: application content; dismissible: default true; onDismiss(): optional persistence promise.
     tone: existing Banner tone; strings: dismiss, failed; className.
   Behavior: Dismissal waits for persistence and cannot repeat. A failure keeps the announcement visible.
   Notes: No automatic expiry, navigation, analytics or persistence. Dialog uses native Platform focus management.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { Banner } from '../Banner/Banner.tsx';
import { Card } from '../Card/Card.tsx';
import { Dialog } from '../Dialog/Dialog.tsx';
import { Stack } from '../Stack/Stack.tsx';
import { Button } from '../Button/Button.tsx';
import { Notice } from '../Notice/Notice.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

export function Announcement({ id, variant = 'banner', open = true, title, children, actions, dismissible = true, onDismiss, tone = 'info', strings, className }) {
  devWarn('Announcement', { variant, tone }, { variant: ['banner','card','dialog'], tone: ['info','success','warning','danger','neutral'] });
  const t = useStrings('announcement', strings);
  const [closed, setClosed] = React.useState(false), [busy, setBusy] = React.useState(false), [error, setError] = React.useState('');
  const lock = React.useRef(false), epoch = React.useRef(0);
  React.useEffect(() => { epoch.current++; lock.current = false; setClosed(false); setBusy(false); setError(''); return () => { epoch.current++; }; }, [id, open]);
  const dismiss = async () => {
    if (!dismissible || lock.current) return; const at = epoch.current; lock.current = true; setBusy(true); setError('');
    try { if (onDismiss) await onDismiss(); if (at === epoch.current) setClosed(true); }
    catch (e) { if (at === epoch.current) setError(t.failed); }
    finally { if (at === epoch.current) { lock.current = false; setBusy(false); } }
  };
  if (!open || closed) return null;
  const content = <Stack className={cx('plx-announcement', className)} aria-busy={busy}>{children}{error ? <Notice tone="danger">{error}</Notice> : null}</Stack>;
  const close = dismissible ? <Button disabled={busy} onClick={dismiss}>{t.dismiss}</Button> : null;
  if (variant === 'dialog') return <Dialog open title={title} onClose={dismiss} dismissible={dismissible && !busy} footer={<>{actions}{close}</>}>{content}</Dialog>;
  if (variant === 'card') return <Card title={title} actions={actions}>{content}{close}</Card>;
  return <Banner title={title} tone={tone} actions={actions} onDismiss={dismissible && !busy ? dismiss : undefined} strings={{ ...strings, dismiss: t.dismiss }}>{content}</Banner>;
}