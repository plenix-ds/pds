/* Plenix · Autosave, SaveStatus, useAutosave
   Summary: Debounced serialized persistence and icon Badges for saving, saved, offline and failed work.
   Usage: const save = useAutosave(value, persist); <Autosave state={save.state} onRetry={save.retry} />
   Props:
     useAutosave(value, onSave, options): immutable value; onSave(value): promise; options.delay: ms (default 600).
     options.enabled: pause saving (default true); options.unsavedMessage: localized leaving warning.
     Initial value is saved; changes trigger persistence. Pending edits protect navigation.
     Returns { state, error, dirty, retry, flush }; flush persists immediately and resolves success.
     Autosave.state: "saving", "saved", "offline" or "failed"; onRetry(): retry; strings: state names plus retry.
     SaveStatus: the icon Badge only; className: extra classes.
   Behavior:
     One write at a time prevents old requests overwriting new work. Edits during a write queue the latest value.
     Offline edits retry after reconnect. Failures retain work for Retry or a subsequent edit.
     Timers and connection listeners stop on unmount; in-flight persistence belongs to the caller.
   Notes:
     No backend is assumed. Use immutable values. Public or costly changes need explicit submission.
*/
import React from 'react';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Inline } from '../../components/Stack/Stack.tsx';
import { useUnsavedGuard } from '../../providers/UnsavedGuard.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import AlertIcon from 'plenix-platform/icons/plenix/alert';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import CloudOffIcon from 'plenix-platform/icons/plenix/cloud-off';
import RefreshIcon from 'plenix-platform/icons/plenix/refresh';

const STATES = { saving: ['active', RefreshIcon], saved: ['success', CheckIcon], offline: ['waiting', CloudOffIcon], failed: ['negative', AlertIcon] };
const WORDS = { saving: 'Saving', saved: 'Saved', offline: 'Offline', failed: 'Save failed', retry: 'Retry' };
/** @public the autosave states */
export type SaveState = 'saving' | 'saved' | 'offline' | 'failed';
/** @public */
export type SaveStatusProps = { state?: SaveState; strings?: Record<string, string>; className?: string };
export function SaveStatus({ state = 'saved', strings, className }: SaveStatusProps) {
  const t: any = Object.assign({}, WORDS, strings), key = STATES[state] ? state : 'saved', s = STATES[key];
  return <Badge tone={s[0] as any} icon={s[1] as any} role={key === 'failed' ? 'alert' : 'status'} className={cx('plx-autosave__status', className)}>{t[key]}</Badge>;
}
/** @public */
export type AutosaveProps = SaveStatusProps & { onRetry?(): void };
export function Autosave({ state = 'saved', onRetry, strings, className }: AutosaveProps) {
  const t: any = Object.assign({}, WORDS, strings);
  return <Inline className={cx('plx-autosave', className)} wrap><SaveStatus state={state} strings={strings} />
    {state === 'failed' && onRetry ? <Button size="sm" onClick={onRetry}>{t.retry}</Button> : null}</Inline>;
}
export function useAutosave(value: any, onSave: any, { delay = 600, enabled = true, unsavedMessage }: { delay?: number; enabled?: boolean; unsavedMessage?: string } = {}) {
  const words: any = useStrings('autosave');
  const [snapshot, setSnapshot] = React.useState<any>({ state: 'saved', error: null, dirty: false });
  useUnsavedGuard(snapshot.dirty, unsavedMessage ?? words.unsaved);
  const ref = React.useRef<any>({ value, saved: value, onSave, enabled, alive: false, timer: null, running: null, online: typeof navigator === 'undefined' || navigator.onLine !== false });
  const r = ref.current; r.onSave = onSave; r.enabled = enabled;
  const publish = (state: any, error: any = null) => { if (r.alive) setSnapshot({ state, error, dirty: !Object.is(r.value, r.saved) }); };
  const flush = React.useCallback(async () => {
    clearTimeout(r.timer);
    if (r.running) { try { await r.running; } catch (e) { return false; } if (!r.alive) return false; return flush(); }
    if (!r.enabled || !r.alive) return false;
    if (Object.is(r.value, r.saved)) { publish('saved'); return true; }
    if (!r.online) { publish('offline'); return false; }
    const writing = r.value; publish('saving');
    const task = Promise.resolve().then(() => r.onSave(writing)); r.running = task;
    let ok = true;
    try { await task; r.saved = writing; } catch (e) { ok = false; publish(r.online ? 'failed' : 'offline', e); }
    finally { r.running = null; }
    if (!r.alive) return false;
    if (ok && !Object.is(r.value, r.saved)) return flush();
    if (ok) publish('saved');
    return ok;
  }, []);
  React.useEffect(() => {
    r.alive = true;
    const online = () => { r.online = true; if (!Object.is(r.value, r.saved)) flush(); };
    const offline = () => { r.online = false; if (!Object.is(r.value, r.saved)) publish('offline'); };
    window.addEventListener('online', online); window.addEventListener('offline', offline);
    return () => { r.alive = false; clearTimeout(r.timer); window.removeEventListener('online', online); window.removeEventListener('offline', offline); };
  }, [flush]);
  React.useEffect(() => {
    r.value = value; clearTimeout(r.timer);
    if (Object.is(value, r.saved)) { if (!r.running) publish('saved'); return; }
    publish(r.online ? 'saving' : 'offline');
    if (enabled && r.online) r.timer = setTimeout(flush, Math.max(0, delay));
    return () => clearTimeout(r.timer);
  }, [value, enabled, delay, flush]);
  return { ...snapshot, retry: flush, flush };
}
