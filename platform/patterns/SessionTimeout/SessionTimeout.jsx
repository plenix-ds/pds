/* Plenix · SessionTimeout, useSessionTimeout
   Summary: Ending a session that nobody is using without losing anyone's work (10 Patterns › Authentication and
     permissions › Session timeout). Before the end, a warning: an alert dialog that says how long is left, counting down
     in the data font, with Stay signed in (focused) and Sign out. After the end, the signed-out message: what happened,
     that the work was kept, and Sign in again, which brings people back to where they were. useSessionTimeout keeps the
     time: activity restarts it, the warning opens before the end, and the end signs out.
   Usage:
     const s = useSessionTimeout({ timeout: 30 * 60, warnBefore: 120, onTimeout: () => api.signOut() });
     <SessionTimeout state={s.state} expiresAt={s.expiresAt} idleMinutes={30} onStay={s.stay} onSignOut={s.signOut}
       onSignIn={() => location.assign('/auth/sign-in?rd=' + encodeURIComponent(location.pathname))} />
     <SessionTimeout state="signed-out" inline idleMinutes={30} onSignIn={signIn} />     the signed-out page's message
   Props:
     state: "active" (default: nothing shows) | "warning" (the warning with its countdown) | "signed-out"
     expiresAt: when the session ends, in milliseconds (Date.now() + …); the countdown counts to it
     remaining: instead, the seconds left (a countdown the page keeps itself)
     idleMinutes: how long without activity ends a session; said in the signed-out message
     saved: what happened to the work, said in both ("Your changes are saved."); default strings.saved
     onStay(): Stay signed in, Escape and the close button: the session goes on (the time restarts)
     onSignOut(): Sign out now
     onExpire(): runs once when the countdown reaches zero (useSessionTimeout signs out by itself)
     onSignIn(): Sign in again, in the signed-out message
     inline: the message is drawn in the page (a signed-out page, a pane) instead of a dialog; default false
     strings: the words, for other languages: { warningTitle: "Your session is about to end", warning: "You’ll be signed
       out in {time} because you haven’t been active.", stay: "Stay signed in", signOut: "Sign out", signedOutTitle: "You
       were signed out", signedOut: "For your security, you were signed out after {minutes} minutes without activity.",
       signedOutShort: "For your security, you were signed out because you weren’t active.", saved: "Your changes are
       saved.", signIn: "Sign in again", left: "{time} left", ended: "Signed out" }
     className: more classes on the dialog or the inline message
     useSessionTimeout({ timeout, warnBefore, onTimeout, events }): timeout and warnBefore in seconds (default 1800 and
       120); events: the activity that restarts the time (default pointerdown, keydown, wheel, touchstart). It returns
       { state, expiresAt, stay(), signOut() }; activity restarts the time only while state is "active" (in the warning
       only Stay signed in does).
   Behavior:
     The warning is an alert dialog: focus starts on Stay signed in; Escape and the close button also stay. The countdown
       is a timer that is not read every second: the dialog's opening says how long is left, and the time is announced
       politely at one minute, 30 seconds and 10 seconds.
     At zero onExpire runs and the warning gives way to the signed-out message, which cannot be dismissed: Sign in again
       is the way on.
     The time is written m:ss in the data font with tabular figures, so it does not shift as it counts.
   Notes:
     WCAG 2.2.1 Timing adjustable: warn at least 20 seconds before the end (two minutes is better) and let one action
       extend it. Save the work before signing out, and say so.
     The server decides when a session ends; the page only shows it. Keep the two clocks in step (expiresAt from the
       server's answer).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { around } from '../../utils/fillNodes.tsx';
import { useUid } from '../../utils/layer.ts';
import { announce } from '../../utils/announce.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Dialog } from '../../components/Dialog/Dialog.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { fill } from '../../utils/fill.ts';

const clock = (sec) => { const s = Math.max(0, Math.ceil(sec)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const MILESTONES = [60, 30, 10];

// the seconds left, from expiresAt (ticking every second) or from remaining
function useLeft(state, expiresAt, remaining) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (state !== 'warning' || typeof expiresAt !== 'number') return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [state, expiresAt]);
  if (typeof remaining === 'number') return remaining;
  if (typeof expiresAt === 'number') return Math.max(0, (expiresAt - now) / 1000);
  return 0;
}

export function SessionTimeout({ state = 'active', expiresAt, remaining, idleMinutes, saved, onStay, onSignOut, onExpire, onSignIn,
  inline = false, strings, className }) {
  const t = useStrings('sessionTimeout', strings);
  const left = useLeft(state, expiresAt, remaining);
  const stayRef = React.useRef(null);
  const signInRef = React.useRef(null);
  const said = React.useRef({});
  const expired = React.useRef(false);
  React.useEffect(() => { if (state === 'warning') { said.current = {}; expired.current = false; } }, [state, expiresAt]);
  React.useEffect(() => {
    if (state !== 'warning') return;
    MILESTONES.forEach((m) => { if (left <= m && left > m - 5 && !said.current[m]) { said.current[m] = true; announce(fill(t.left, { time: clock(left) })); } });
    if (left <= 0 && !expired.current) { expired.current = true; if (onExpire) onExpire(); }
  }, [state, Math.ceil(left)]);

  const savedLine = saved === false ? null : saved || t.saved;
  const time = <time className="plx-session-timeout__time" role="timer" dateTime={'PT' + Math.ceil(Math.max(0, left)) + 'S'}>{clock(left)}</time>;

  if (state !== 'warning' && state !== 'signed-out') return null;
  const warning = state === 'warning';
  // the main sentence: the dialog's description (read when it opens); the line about the work under it
  const lead = warning ? around(t.warning, 'time', time)
    : idleMinutes ? around(t.signedOut, 'minutes', <span className="plx-session-timeout__inline-time">{idleMinutes}</span>) : t.signedOutShort;
  const more = savedLine ? <p className="plx-session-timeout__text">{savedLine}</p> : null;
  const actions = warning ? (
    <>
      <Button onClick={onSignOut}>{t.signOut}</Button>
      <Button ref={stayRef} variant="primary" onClick={onStay}>{t.stay}</Button>
    </>
  ) : <Button ref={signInRef} variant="primary" onClick={onSignIn}>{t.signIn}</Button>;
  const title = warning ? t.warningTitle : t.signedOutTitle;
  if (inline) {
    return <Inline kind={state} title={title} actions={actions} className={className}><p className="plx-session-timeout__text">{lead}</p>{more}</Inline>;
  }
  return (
    <Dialog open role="alertdialog" size="sm" title={title} description={lead} footer={actions}
      onClose={warning ? onStay : undefined} dismissible={warning} initialFocus={warning ? stayRef : signInRef}
      className={cx('plx-session-timeout', 'plx-session-timeout--' + state, className)}>{more}</Dialog>
  );
}


// the message drawn in the page: a region named by its title, the text, then the actions
function Inline({ kind, title, actions, className, children }) {
  const id = useUid('plx-session-timeout');
  return (
    <section className={cx('plx-session-timeout', 'plx-session-timeout--' + kind, 'plx-session-timeout--inline', className)} aria-labelledby={id}>
      <h2 id={id} className="plx-session-timeout__title">{title}</h2>
      <div className="plx-session-timeout__body">{children}</div>
      <div className="plx-session-timeout__actions">{actions}</div>
    </section>
  );
}

export function useSessionTimeout({ timeout = 1800, warnBefore = 120, onTimeout, events = ['pointerdown', 'keydown', 'wheel', 'touchstart'] } = {}) {
  const [expiresAt, setExpiresAt] = React.useState(() => Date.now() + timeout * 1000);
  const [state, setState] = React.useState('active');
  const stateRef = React.useRef(state);
  stateRef.current = state;
  const end = React.useRef(onTimeout);
  end.current = onTimeout;
  const stay = React.useCallback(() => { setExpiresAt(Date.now() + timeout * 1000); setState('active'); }, [timeout]);
  const signOut = React.useCallback(() => { setState('signed-out'); if (end.current) end.current(); }, []);
  // activity restarts the time while nothing is shown
  React.useEffect(() => {
    const restart = () => { if (stateRef.current === 'active') setExpiresAt(Date.now() + timeout * 1000); };
    events.forEach((e) => window.addEventListener(e, restart, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, restart));
  }, [timeout, events.join(' ')]);
  // the warning before the end, and the end
  React.useEffect(() => {
    if (state === 'signed-out') return undefined;
    const tick = () => {
      const left = (expiresAt - Date.now()) / 1000;
      if (left <= 0) signOut();
      else if (left <= warnBefore && stateRef.current === 'active') setState('warning');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt, warnBefore, state, signOut]);
  return { state, expiresAt, stay, signOut };
}
