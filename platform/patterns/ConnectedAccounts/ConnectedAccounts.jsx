/* Plenix · ConnectedAccounts, ConnectedAccount
   Summary: The accounts on other services that Plenix is linked to, and the way to link or unlink each (10 Patterns ›
     Authentication and permissions › Account connection). One row per service: its icon, its name and what it is for,
     its status as a Badge with its icon (Not connected, Connected, Connection error), the linked account in the data font,
     and its action. Connect first says what Plenix will be able to do there and only then hands over to the service;
     Disconnect asks first and says what stops working; a failed connection says why and offers Reconnect.
   Usage:
     <ConnectedAccounts label="Connected accounts" accounts={[
         { id: 'drive', service: 'Google Drive', icon: 'folder', description: 'Open and save files from your Drive.',
           status: 'connected', account: 'maya@example.com', connectedAt: '2026-10-02',
           scopes: ['See and open the files you choose', 'Save new files to a Plenix folder'],
           loses: 'Files linked from Drive stop opening in Plenix.' },
         { id: 'mail', service: 'Mailchimp', icon: 'mail', status: 'error', account: 'parish-office', error: 'Access expired on Oct 12.' },
       ]} onConnect={(a) => startOAuth(a.id)} onDisconnect={(a) => unlink(a.id)} onReconnect={(a) => startOAuth(a.id)} />
     <ConnectedAccount account={drive} onConnect={…} onDisconnect={…} />
   Props:
     accounts: the services, in order: [{ id, service, icon, description, status, account, connectedAt, scopes, loses,
       error, busy }]
     accounts[].service: the service's name (required): the row's title and every question names it
     accounts[].icon: its icon from platform/icons/map.json (default "link"); services are named in words, never by a logo alone
     accounts[].description: one line on what the connection is for
     accounts[].status: "disconnected" (default) | "connected" | "error"
     accounts[].account: the linked account on that service (an email or a user name), in the data font
     accounts[].connectedAt: when it was linked ("YYYY-MM-DD"), in the data font
     accounts[].scopes: what Plenix may do there, in plain words: listed before Connect hands over
     accounts[].loses: what stops working when it is disconnected (the Disconnect question says it)
     accounts[].error: why the connection failed, in words, and what to do
     accounts[].busy: the hand-over or the unlinking is under way: its button shows the spinner
     label: the list's accessible name (default strings.label)
     onConnect(account): runs after the Connect question is confirmed: hand over to the service (OAuth)
     onDisconnect(account): runs after the Disconnect question is confirmed
     onReconnect(account): Reconnect on a failed connection (no question: the person already agreed)
     confirm: false connects and disconnects without the questions (default true)
     headingLevel: the number of the heading level of each service's name (default 3)
     strings: the words, for other languages: { label: "Connected accounts", connect: "Connect", disconnect: "Disconnect",
       reconnect: "Reconnect", cancel: "Cancel", connected: "Connected", disconnected: "Not connected", error:
       "Connection error", as: "As {account}", since: "since {date}", connectTitle: "Connect {service}?", connectMessage:
       "You’ll sign in to {service} to allow this. Plenix will be able to:", continue: "Continue to {service}",
       disconnectTitle: "Disconnect {service}?", disconnectMessage: "You can connect it again at any time.",
       done: "{service} connected", undone: "{service} disconnected" }
     className: more classes on the list
     ConnectedAccount.account: one service, as in accounts; its other props as ConnectedAccounts' (one row, not a list)
   Behavior:
     Connect opens a question that lists the scopes and names the service; Continue runs onConnect, which hands over
       to the service's own sign-in (Plenix never asks for another service's password).
     Disconnect opens a question that says what stops working; Disconnect in it runs onDisconnect.
     Each change of status is announced ("Google Drive connected") when the row's status changes.
     The questions are dialogs: focus starts in them and returns to the button when they close.
   Notes:
     The status is the Badge's word and icon; the connected account and date are technical values (the data font).
     One row per service; for many accounts on one service, a row per account with the account in the title.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { around } from '../../utils/fillNodes.tsx';
import { announce } from '../../utils/announce.tsx';
import { formatDate, dateTimeAttr } from '../../utils/format.ts';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { ConfirmDialog } from '../../components/Dialog/Dialog.tsx';
import { Icon } from '../../components/Icon/Icon.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import LinkIcon from 'plenix-platform/icons/plenix/link';
import { fill } from '../../utils/fill.ts';

const STATUS = { connected: ['success', 'check'], disconnected: ['neutral', 'link'], error: ['negative', 'alert'] };
// a sentence with a node in place of {key}: the words around it stay in the UI font
const H = ({ level, ...props }) => React.createElement('h' + Math.min(6, Math.max(2, level || 3)), props);

export function ConnectedAccount({ account, onConnect, onDisconnect, onReconnect, confirm = true, headingLevel = 3, strings, as = 'div', className, ...rest }) {
  const t = useStrings('connectedAccounts', strings);
  const a = account || {};
  const status = STATUS[a.status] ? a.status : 'disconnected';
  const [ask, setAsk] = React.useState(null);   // "connect" | "disconnect"
  const seen = React.useRef(status);
  React.useEffect(() => {
    if (seen.current !== status) {
      if (status === 'connected') announce(fill(t.done, { service: a.service }));
      else if (status === 'disconnected' && seen.current === 'connected') announce(fill(t.undone, { service: a.service }));
      seen.current = status;
    }
  }, [status]);
  const connect = () => { setAsk(null); if (onConnect) onConnect(a); };
  const disconnect = () => { setAsk(null); if (onDisconnect) onDisconnect(a); };
  const Tag = as === 'li' ? 'li' : 'div';
  const [tone, icon] = STATUS[status];
  const word = status === 'connected' ? t.connected : status === 'error' ? t.error : t.disconnected;

  return (
    <Tag className={cx('plx-connected-accounts__item', className)} data-plx-state={status} {...rest}>
      <Icon className="plx-connected-accounts__icon" name={a.icon || LinkIcon} size="md" />
      <div className="plx-connected-accounts__body">
        <div className="plx-connected-accounts__head">
          <H level={headingLevel} className="plx-connected-accounts__service">{a.service}</H>
          <Badge tone={tone} icon={icon}>{word}</Badge>
        </div>
        {a.description ? <p className="plx-connected-accounts__description">{a.description}</p> : null}
        {status !== 'disconnected' && (a.account || a.connectedAt) ? (
          <p className="plx-connected-accounts__detail">
            {a.account ? around(t.as, 'account', <Text variant="data">{a.account}</Text>) : null}
            {a.account && a.connectedAt ? ', ' : null}
            {a.connectedAt ? around(t.since, 'date', <time className="plx-connected-accounts__date" dateTime={typeof a.connectedAt === 'string' ? a.connectedAt : dateTimeAttr(a.connectedAt)}>{formatDate(a.connectedAt)}</time>) : null}
          </p>
        ) : null}
        {status === 'error' && a.error ? <p className="plx-connected-accounts__error">{a.error}</p> : null}
      </div>
      <div className="plx-connected-accounts__actions">
        {status === 'error' && onReconnect ? <Button variant="primary" loading={!!a.busy} onClick={() => onReconnect(a)}>{t.reconnect}</Button> : null}
        {status === 'disconnected' && onConnect ? <Button loading={!!a.busy} onClick={() => (confirm ? setAsk('connect') : connect())}>{t.connect}</Button> : null}
        {status !== 'disconnected' && onDisconnect ? <Button variant={status === 'error' ? 'ghost' : 'secondary'} loading={status === 'connected' && !!a.busy} onClick={() => (confirm ? setAsk('disconnect') : disconnect())}>{t.disconnect}</Button> : null}
      </div>
      <ConfirmDialog open={ask === 'connect'} title={fill(t.connectTitle, { service: a.service })} message={fill(t.connectMessage, { service: a.service })}
        confirmLabel={fill(t.continue, { service: a.service })} cancelLabel={t.cancel} onConfirm={connect} onCancel={() => setAsk(null)}>
        {a.scopes && a.scopes.length ? <ul className="plx-connected-accounts__scopes">{a.scopes.map((s, i) => <li key={i}>{s}</li>)}</ul> : null}
      </ConfirmDialog>
      <ConfirmDialog open={ask === 'disconnect'} destructive title={fill(t.disconnectTitle, { service: a.service })}
        message={[a.loses, t.disconnectMessage].filter(Boolean).join(' ')} confirmLabel={t.disconnect} cancelLabel={t.cancel}
        onConfirm={disconnect} onCancel={() => setAsk(null)} />
    </Tag>
  );
}

export function ConnectedAccounts({ accounts = [], label, className, strings, ...rest }) {
  const t = useStrings('connectedAccounts', strings);
  const { onConnect, onDisconnect, onReconnect, confirm, headingLevel, ...own } = rest;
  return (
    <ul className={cx('plx-connected-accounts', className)} aria-label={label || t.label} {...own}>
      {accounts.map((a) => <ConnectedAccount key={a.id || a.service} as="li" account={a} onConnect={onConnect} onDisconnect={onDisconnect}
        onReconnect={onReconnect} confirm={confirm} headingLevel={headingLevel} strings={strings} />)}
    </ul>
  );
}
