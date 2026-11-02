/* Plenix · ShareDialog
   Summary: Manage people and their roles, copy a restricted link, or invoke Web Share.
   Usage: <ShareDialog open title="Share record" people={people} grants={grants} url={url} onSave={save} onClose={close} />
   Props:
     open, title, onClose: modal lifecycle; people: EntityPicker options; grants: [{ person, role }].
     roles: [{ value, label }]; defaultRole: new grant role (default viewer); url: existing share URL.
     linkAccess: "restricted" (default) or "view"; onSave({ grants, linkAccess }): persistence promise.
     initialTab: "people" or "link"; webShare: show native share when supported (default true).
     strings: title, people, link, person, role, add, remove, save, cancel, copy, access, restricted, anyone,
       nativeShare, failed, unsaved and invalid; className: extra classes.
   Behavior:
     Draft grants reset on reopen. Duplicate people are not added. Pending writes block edits and dismissal.
     Failed saves retain the draft. Closing dirty changes asks first. Clipboard and Web Share do not change permissions.
   Notes:
     The server must authorize every grant and validate roles. A copied URL never enables public access itself.
*/
import React from 'react';
import { Dialog } from '../../components/Dialog/Dialog.jsx';
import { Stack, Inline } from '../../components/Stack/Stack.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Select } from '../../components/Input/Input.tsx';
import { EntityPicker } from '../../components/EntityPicker/EntityPicker.jsx';
import { RoleLabel } from '../../components/RoleLabel/RoleLabel.jsx';
import { CopyButton } from '../../components/CopyButton/CopyButton.jsx';
import { Button } from '../../components/Button/Button.tsx';
import { Tabs } from '../../components/Tabs/Tabs.jsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { useUnsavedGuard } from '../../providers/UnsavedGuard.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

const ROLES = [{ value: 'viewer', label: 'Viewer' }, { value: 'editor', label: 'Editor' }];
export function ShareDialog({ open, title, onClose, people = [], grants = [], roles = ROLES, defaultRole = 'viewer', url = '', linkAccess = 'restricted', onSave, initialTab = 'people', webShare = true, strings, className }) {
  const t = useStrings('shareDialog', strings);
  const [draft, setDraft] = React.useState(grants), [access, setAccess] = React.useState(linkAccess);
  const [person, setPerson] = React.useState(''), [role, setRole] = React.useState(defaultRole), [tab, setTab] = React.useState(initialTab);
  const [busy, setBusy] = React.useState(false), [error, setError] = React.useState('');
  const lock = React.useRef(false), epoch = React.useRef(0), initial = React.useRef(null);
  initial.current = { grants, linkAccess, defaultRole, initialTab };
  React.useEffect(() => { epoch.current++; const v = initial.current; setDraft(v.grants); setAccess(v.linkAccess); setPerson(''); setRole(v.defaultRole); setTab(v.initialTab); setError(''); setBusy(false); lock.current = false; return () => { epoch.current++; }; }, [open]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(grants) || access !== linkAccess;
  const guard = useUnsavedGuard(open && dirty, t.unsaved);
  const close = guard(() => { if (!lock.current && onClose) onClose(); });
  const run = async (fn) => {
    if (lock.current) return; const at = epoch.current; lock.current = true; setBusy(true); setError('');
    try { await fn(); } catch (e) { if (at === epoch.current && e?.name !== 'AbortError') setError(t.failed); }
    finally { if (at === epoch.current) { lock.current = false; setBusy(false); } }
  };
  const add = () => {
    if (!people.some((p) => p.value === person) || !roles.some((r) => r.value === role)) { setError(t.invalid); return; }
    setDraft((all) => all.some((g) => g.person === person) ? all : all.concat([{ person, role }]));
    setPerson(''); setError('');
  };
  const save = () => { const at = epoch.current; return run(async () => { await onSave({ grants: draft, linkAccess: access }); if (at === epoch.current && onClose) onClose(); }); };
  return <Dialog open={open} title={title || t.title} onClose={close} dismissible={!busy}
    footer={<><Button disabled={busy} onClick={close}>{t.cancel}</Button>{onSave ? <Button variant="primary" disabled={busy || !dirty} onClick={save}>{t.save}</Button> : null}</>}>
    <Stack className={cx('plx-share-dialog', className)} aria-busy={busy}>
      <Tabs variant="folder" label={title || t.title} value={tab} onChange={setTab} items={[
        { value: 'people', label: t.people, content: <Stack>
          <Field label={t.person}><EntityPicker kind="people" options={people} value={person} onChange={setPerson} disabled={busy} /></Field>
          <Field label={t.role}><Select value={role} options={roles} disabled={busy} onChange={(e) => setRole(e.target.value)} /></Field>
          <Button disabled={busy || !person || !onSave} onClick={add}>{t.add}</Button>
          {draft.map((g) => <Inline key={g.person} wrap><Text>{people.find((p) => p.value === g.person)?.label || g.person}</Text>
            <RoleLabel role={g.role} label={roles.find((r) => r.value === g.role)?.label} />
            <Select aria-label={t.role + ': ' + (people.find((p) => p.value === g.person)?.label || g.person)} value={g.role} options={roles} disabled={busy || !onSave}
              onChange={(e) => setDraft(draft.map((v) => v.person === g.person ? { ...v, role: e.target.value } : v))} />
            <Button disabled={busy || !onSave} onClick={() => setDraft(draft.filter((v) => v.person !== g.person))}>{t.remove}</Button></Inline>)}
        </Stack> },
        { value: 'link', label: t.link, content: <Stack>
          <Field label={t.access}><Select value={access} disabled={busy || !onSave} onChange={(e) => setAccess(e.target.value)}
            options={[{ value: 'restricted', label: t.restricted }, { value: 'view', label: t.anyone }]} /></Field>
          <CopyButton field value={url} label={t.copy} fieldLabel={t.link} disabled={!url || busy} />
          {webShare && typeof navigator !== 'undefined' && navigator.share ? <Button disabled={!url || busy} onClick={() => run(() => navigator.share({ title: title || t.title, url }))}>{t.nativeShare}</Button> : null}
        </Stack> }
      ]} />
      {error ? <Notice tone="danger">{error}</Notice> : null}
    </Stack>
  </Dialog>;
}
