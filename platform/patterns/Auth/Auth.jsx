/* Plenix · Auth, SignInForm, SignUpForm, PasswordResetForm, MfaChallenge, SsoButtons, AccountRecovery
   Summary: Getting people into their account and back in when something is lost (10 Patterns › Authentication and
     permissions: Sign in, Sign up, Password reset, Multi-factor authentication, Single sign-on, Account recovery). Auth
     is the frame: a centered card under the page's header, one column without a frame on narrow windows (the Plenix
     login's layout, promoted from services/login). The forms go inside it: SignInForm (an email or user name, a password
     with Show, Keep me signed in), SignUpForm (name, email, a new password with its rule shown first, the terms),
     PasswordResetForm (the email, the neutral "check your email" step, the new password, done), MfaChallenge (the code
     from the chosen method in an OtpInput, Remember this device, another method, a recovery code), SsoButtons (a button
     per identity provider, named in words, and the work-email step that finds the organization's) and AccountRecovery
     (a backup code, another sign-in method, or the administrator's help, then the notice that it was used).
   Usage:
     <Auth page title="Sign in to Plenix" description="Use your Plenix user name or email.">
       <SignInForm onSubmit={signIn} error={error} forgot={{ onClick: () => setView('reset') }}
         signUp={{ href: '/auth/sign-up' }} sso={<SsoButtons providers={[{ id: 'google', label: 'Google' }]} onProvider={go} />} />
     </Auth>
     <Auth title="Create your account"><SignUpForm onSubmit={create} terms={<>I agree to the <Link href="/terms">terms</Link></>} /></Auth>
     <Auth title="Reset your password"><PasswordResetForm onRequest={send} onReset={save} signIn={{ href: '/auth/sign-in' }} /></Auth>
     <Auth title="Two-step verification"><MfaChallenge methods={METHODS} onVerify={verify} onResend={resend} recovery={{ onClick: recover }} /></Auth>
     <Auth title="Recover your account"><AccountRecovery onCode={useCode} admin="Parish office (office@example.com)" /></Auth>
   Props:
     Auth.title: the card's heading (h1 on a page of its own); Auth.description: one line under it
     Auth.page: the frame fills the window below the header and centers the card (a page of its own); default false
     Auth.footer: a line under the card's body (a link to another flow, the legal line)
     Auth.headingLevel: the title's level (default 1); Auth.className: more classes; Auth.children: the form
     links: wherever a form names one (forgot, signUp, signIn, recovery, back): { href } is a Link (another page) or
       { onClick } a ghost button (another step of the same card); { label } replaces its words; leave it out for none
     SignInForm.onSubmit({ identifier, password, keep }): runs when both fields have a value
     SignInForm.error: the one general error after a failed sign-in ("Email or password is incorrect."), never which part
     SignInForm.defaultIdentifier: the identifier kept after a failure; SignInForm.busy: the button shows its spinner
     SignInForm.keepSignedIn: shows Keep me signed in (default true); keepDescription: the line under it
     SignInForm.forgot, signUp: links; SignInForm.sso: SsoButtons above the form, then "or"
     SignUpForm.onSubmit({ name, email, password, terms }); SignUpForm.minLength: the password's least length (default 12)
     SignUpForm.terms: the consent's label (text or nodes with a Link); it must be checked; SignUpForm.signIn: a link
     SignUpForm.errors: { name, email, password, terms } from the server (an email already in use); busy; sso
     PasswordResetForm.step: "request" | "sent" | "new" | "done" (controlled); defaultStep: the first (default "request")
     PasswordResetForm.onRequest(email): sends the link; the form moves to "sent" by itself unless step is controlled
     PasswordResetForm.onResend(email): Send the link again; onReset(password): saves the new one, then "done"
     PasswordResetForm.expires: how long the link works, in words ("30 minutes"); minLength (default 12); error; busy;
       signIn: the link back to sign in
     MfaChallenge.methods: [{ id, kind: "app" | "sms" | "email" | "key", label, detail }] (detail: "to the phone ending 42");
       the first is used unless defaultMethod names another
     MfaChallenge.onVerify(code, { method, remember }): the code once every box is filled (or Verify); a security key: null
     MfaChallenge.onResend(method): Send a new code (sms, email), offered after resendAfter seconds (default 30)
     MfaChallenge.remember: shows Remember this device for 30 days (default true); length: the code's length (default 6)
     MfaChallenge.autoFocus: the first box takes focus when the step appears (default false; a page of its own sets it)
     MfaChallenge.error: the code was wrong or expired; busy; recovery: the link to account recovery
     SsoButtons.providers: [{ id, label }]: Continue with {label}, one button each; onProvider(provider) hands over
     SsoButtons.organization: shows Continue with SSO and its work-email step; onOrganization(email) finds the provider
     SsoButtons.redirecting: the name of the provider being opened: a status line with a spinner replaces the buttons
     SsoButtons.error: why the provider refused, and who to ask
     AccountRecovery.step: "choose" | "code" | "help" | "done" (controlled); defaultStep (default "choose")
     AccountRecovery.onCode(code): checks a backup code; onFactor(): another sign-in method; admin: who helps when none
       works (shown in "help"); onSetUp(): Set up a new sign-in method after recovery; error; busy; back: a link
     strings: every form's words, for other languages; each form's own STRINGS in this file name every key
     className: more classes on a form
   Behavior:
     Every field takes paste and the password manager's autofill (autocomplete username, current-password, new-password,
       email, one-time-code); nothing blocks paste.
     A form is checked when it is submitted: each empty or wrong field says what to do under it and focus moves to the
       first; nothing is disabled before.
     Show password turns the password into text and back (a toggle button, aria-pressed); it never leaves the field.
     A failed sign-in keeps the identifier and says one general error at the top of the form (role alert).
     The reset's "sent" step says the same whether or not the email has an account.
     The code fills from a pasted or autofilled message; the last box verifies at once.
     The SSO hand-over and every step change are announced (a status line).
   Notes:
     Sign in, not Log in, everywhere. Never ask for the same thing twice (no "confirm password"). Offer single sign-on
       first where the organization uses it. Security questions are never a recovery method.
     services/login is the Plenix sign-in service; it draws this layout with the release's classes (no stylesheet of its own).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { around } from '../../utils/fillNodes.tsx';
import { useUid } from '../../utils/layer.ts';
import { announce } from '../../utils/announce.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Checkbox, RadioGroup } from '../../components/Checkbox/Checkbox.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Input } from '../../components/Input/Input.tsx';
import { InputGroup } from '../../components/InputGroup/InputGroup.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { OtpInput } from '../../components/OtpInput/OtpInput.tsx';
import { Spinner } from '../../components/Loading/Loading.tsx';
import { Form } from '../Form/Form.jsx';
import LockIcon from 'plenix-platform/icons/plenix/lock';
import VisibilityIcon from 'plenix-platform/icons/plenix/visibility';
import VisibilityOffIcon from 'plenix-platform/icons/plenix/visibility-off';
import { dataPhrase } from '../../utils/dataText.tsx';
import { fill } from '../../utils/fill.ts';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const H = ({ level, ...props }) => React.createElement('h' + Math.min(6, Math.max(1, level || 1)), props);

/* ── the frame ── */
export function Auth({ title, description, page = false, footer, headingLevel = 1, className, children, ...rest }) {
  const id = useUid('plx-auth');
  return (
    <div className={cx('plx-auth', page && 'plx-auth--page', className)} {...rest}>
      <section className="plx-auth__card" aria-labelledby={title ? id : undefined}>
        {title || description ? (
          <header className="plx-auth__header">
            {title ? <H level={headingLevel} id={id} className="plx-auth__title">{title}</H> : null}
            {description ? <p className="plx-auth__description">{description}</p> : null}
          </header>
        ) : null}
        <div className="plx-auth__body">{children}</div>
        {footer ? <div className="plx-auth__footer">{footer}</div> : null}
      </section>
    </div>
  );
}

/* ── shared parts ── */
// a way to another page (a Link) or to another step of the same card (a ghost button): never a link that acts
function Alt({ to, children }) {
  if (!to) return null;
  const text = to.label || children;
  if (to.href) return <Link variant="standalone" href={to.href}>{text}</Link>;
  return <Button variant="ghost" size="sm" onClick={to.onClick}>{text}</Button>;
}
function Alts({ children }) {
  const list = React.Children.toArray(children).filter(Boolean);
  return list.length ? <div className="plx-auth__links">{list}</div> : null;
}
function Or({ text }) {
  return <div className="plx-auth__or"><span className="plx-auth__or-text">{text}</span></div>;
}
function Submit({ busy, children, ...rest }) {
  return <Button type="submit" variant="primary" loading={!!busy} className="plx-auth__submit" {...rest}>{children}</Button>;
}
// a password field with Show: a toggle button joined to the field's end
const Password = React.forwardRef(function Password({ show, hide, value, onChange, autoComplete, invalid, id, ...rest }, ref) {
  const [visible, setVisible] = React.useState(false);
  return (
    <InputGroup id={id} invalid={invalid} {...rest}
      end={<Button iconOnly icon={visible ? VisibilityOffIcon : VisibilityIcon} label={visible ? hide : show} pressed={visible} onClick={() => setVisible(!visible)} />}>
      <Input ref={ref} type={visible ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} autoCapitalize="off" spellCheck={false} />
    </InputGroup>
  );
});
// checks fields on submit: { key: message }, focuses the first with a message
function useCheck(refs) {
  const [errors, setErrors] = React.useState({});
  const check = (found) => {
    setErrors(found);
    const first = Object.keys(refs).find((k) => found[k] && refs[k].current);
    if (first) refs[first].current.focus();
    return !Object.keys(found).some((k) => found[k]);
  };
  const clear = (k) => { if (errors[k]) setErrors(Object.assign({}, errors, { [k]: '' })); };
  return [errors, check, clear];
}

/* ── Sign in ── */
const SIGN_IN = {
  label: 'Sign in', identifier: 'Email or user name', password: 'Password', show: 'Show password', hide: 'Hide password',
  keep: 'Keep me signed in', keepDescription: 'For 30 days on this device. Otherwise, for 12 hours.', submit: 'Sign in',
  forgot: 'Forgot your password?', signUp: 'Create an account', or: 'or', needIdentifier: 'Enter your email or user name.',
  needPassword: 'Enter your password.',
};
export function SignInForm({ onSubmit, error, defaultIdentifier = '', busy = false, keepSignedIn = true, keepDescription, forgot, signUp, sso,
  strings, className, ...rest }) {
  const t = Object.assign({}, SIGN_IN, strings);
  const [identifier, setIdentifier] = React.useState(defaultIdentifier);
  const [password, setPassword] = React.useState('');
  const [keep, setKeep] = React.useState(false);
  const refs = { identifier: React.useRef(null), password: React.useRef(null) };
  const [errors, check, clear] = useCheck(refs);
  const submit = (e) => {
    e.preventDefault();
    if (check({ identifier: identifier.trim() ? '' : t.needIdentifier, password: password ? '' : t.needPassword }) && onSubmit) {
      onSubmit({ identifier: identifier.trim(), password, keep });
    }
  };
  return (
    <div className={cx('plx-auth__flow', className)}>
      {sso ? <>{sso}<Or text={t.or} /></> : null}
      <Form label={t.label} noValidate onSubmit={submit} className="plx-auth__form" {...rest}>
        {error ? <Notice tone="danger">{error}</Notice> : null}
        <Field label={t.identifier} error={errors.identifier || undefined}>
          <Input ref={refs.identifier} value={identifier} onChange={(e) => { setIdentifier(e.target.value); clear('identifier'); }} invalid={!!error || undefined}
            autoComplete="username" autoCapitalize="off" spellCheck={false} />
        </Field>
        <Field label={t.password} error={errors.password || undefined}>
          <Password ref={refs.password} show={t.show} hide={t.hide} value={password} onChange={(e) => { setPassword(e.target.value); clear('password'); }}
            autoComplete="current-password" invalid={!!error || undefined} />
        </Field>
        {keepSignedIn ? <Checkbox label={t.keep} description={keepDescription === undefined ? t.keepDescription : keepDescription} checked={keep} onChange={(e) => setKeep(e.target.checked)} /> : null}
        <Submit busy={busy}>{t.submit}</Submit>
      </Form>
      <Alts><Alt to={forgot}>{t.forgot}</Alt><Alt to={signUp}>{t.signUp}</Alt></Alts>
    </div>
  );
}

/* ── Sign up ── */
const SIGN_UP = {
  label: 'Create an account', name: 'Full name', email: 'Email', password: 'Password', show: 'Show password', hide: 'Hide password',
  rule: 'At least {n} characters. A few words you’ll remember work well.', submit: 'Create account', signIn: 'Already have an account? Sign in',
  or: 'or', needName: 'Enter your name.', needEmail: 'Enter your email, like name@example.org.', needPassword: 'Use at least {n} characters.',
  needTerms: 'Agree to the terms to create an account.',
};
export function SignUpForm({ onSubmit, errors: server, busy = false, minLength = 12, terms, signIn, sso, strings, className, ...rest }) {
  const t = Object.assign({}, SIGN_UP, strings);
  const [v, setV] = React.useState({ name: '', email: '', password: '', terms: false });
  const refs = { name: React.useRef(null), email: React.useRef(null), password: React.useRef(null), terms: React.useRef(null) };
  const termsError = useUid('plx-auth-terms');
  const [errors, check, clear] = useCheck(refs);
  const set = (k, x) => { setV(Object.assign({}, v, { [k]: x })); clear(k); };
  const err = (k) => errors[k] || (server && server[k]) || undefined;
  const submit = (e) => {
    e.preventDefault();
    const found = {
      name: v.name.trim() ? '' : t.needName, email: EMAIL.test(v.email.trim()) ? '' : t.needEmail,
      password: v.password.length >= minLength ? '' : fill(t.needPassword, { n: minLength }), terms: !terms || v.terms ? '' : t.needTerms,
    };
    if (check(found) && onSubmit) onSubmit({ name: v.name.trim(), email: v.email.trim(), password: v.password, terms: v.terms });
  };
  return (
    <div className={cx('plx-auth__flow', className)}>
      {sso ? <>{sso}<Or text={t.or} /></> : null}
      <Form label={t.label} noValidate onSubmit={submit} className="plx-auth__form" {...rest}>
        <Field label={t.name} error={err('name')}><Input ref={refs.name} value={v.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" /></Field>
        <Field label={t.email} error={err('email')}><Input ref={refs.email} type="email" value={v.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" /></Field>
        <Field label={t.password} description={dataPhrase(t.rule, { n: minLength })} error={err('password')}>
          <Password ref={refs.password} show={t.show} hide={t.hide} value={v.password} onChange={(e) => set('password', e.target.value)} autoComplete="new-password" />
        </Field>
        {terms ? (
          <div className="plx-auth__consent">
            <Checkbox ref={refs.terms} label={terms} checked={v.terms} onChange={(e) => set('terms', e.target.checked)} aria-invalid={err('terms') ? true : undefined}
              aria-describedby={err('terms') ? termsError : undefined} />
            {err('terms') ? <p id={termsError} className="plx-auth__error">{err('terms')}</p> : null}
          </div>
        ) : null}
        <Submit busy={busy}>{t.submit}</Submit>
      </Form>
      <Alts><Alt to={signIn}>{t.signIn}</Alt></Alts>
    </div>
  );
}

/* ── Password reset ── */
const RESET = {
  label: 'Reset your password', email: 'Email', emailHint: 'The email of your Plenix account.', send: 'Send reset link',
  sent: 'If an account uses {email}, we sent it a link to reset the password. The link works for {expires} and only once.',
  resend: 'Send the link again', resent: 'Sent again', newPassword: 'New password', rule: 'At least {n} characters.',
  show: 'Show password', hide: 'Hide password', save: 'Reset password', others: 'You’ll be signed out on your other devices.',
  done: 'Your password is reset. Sign in with the new one.', signIn: 'Back to sign in', signInNow: 'Sign in',
  needEmail: 'Enter your email, like name@example.org.', needPassword: 'Use at least {n} characters.', expires: '30 minutes',
};
export function PasswordResetForm({ step, defaultStep = 'request', onRequest, onResend, onReset, expires, minLength = 12, error, busy = false, signIn,
  strings, className, ...rest }) {
  const t = Object.assign({}, RESET, strings);
  const [own, setOwn] = React.useState(defaultStep);
  const now = step || own;
  const move = (s) => { if (!step) setOwn(s); };
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const refs = { email: React.useRef(null), password: React.useRef(null) };
  const [errors, check, clear] = useCheck(refs);
  React.useEffect(() => { if (now === 'sent' || now === 'done') announce(now === 'sent' ? fill(t.sent, { email: email || '…', expires: expires || t.expires }) : t.done); }, [now]);
  const request = (e) => {
    e.preventDefault();
    if (!check({ email: EMAIL.test(email.trim()) ? '' : t.needEmail })) return;
    if (onRequest) onRequest(email.trim());
    move('sent');
  };
  const reset = (e) => {
    e.preventDefault();
    if (!check({ password: password.length >= minLength ? '' : fill(t.needPassword, { n: minLength }) })) return;
    if (onReset) onReset(password);
    move('done');
  };
  let body;
  if (now === 'sent') {
    body = (
      <div className="plx-auth__form">
        <Notice tone="info">{around(fill(t.sent, { expires: expires || t.expires }), 'email', <span className="plx-auth__data">{email}</span>)}</Notice>
        {onResend ? <Button className="plx-auth__submit" onClick={() => { onResend(email); announce(t.resent); }}>{t.resend}</Button> : null}
      </div>
    );
  } else if (now === 'new') {
    body = (
      <Form label={t.label} noValidate onSubmit={reset} className="plx-auth__form" {...rest}>
        {error ? <Notice tone="danger">{error}</Notice> : null}
        <Field label={t.newPassword} description={dataPhrase(t.rule, { n: minLength })} error={errors.password || undefined}>
          <Password ref={refs.password} show={t.show} hide={t.hide} value={password} onChange={(e) => { setPassword(e.target.value); clear('password'); }} autoComplete="new-password" />
        </Field>
        <p className="plx-auth__note">{t.others}</p>
        <Submit busy={busy}>{t.save}</Submit>
      </Form>
    );
  } else if (now === 'done') {
    body = (
      <div className="plx-auth__form">
        <Notice tone="success">{t.done}</Notice>
        {signIn ? (signIn.href ? <Button variant="primary" href={signIn.href} className="plx-auth__submit">{t.signInNow}</Button>
          : <Button variant="primary" onClick={signIn.onClick} className="plx-auth__submit">{t.signInNow}</Button>) : null}
      </div>
    );
  } else {
    body = (
      <Form label={t.label} noValidate onSubmit={request} className="plx-auth__form" {...rest}>
        {error ? <Notice tone="danger">{error}</Notice> : null}
        <Field label={t.email} description={t.emailHint} error={errors.email || undefined}>
          <Input ref={refs.email} type="email" value={email} onChange={(e) => { setEmail(e.target.value); clear('email'); }} autoComplete="email" />
        </Field>
        <Submit busy={busy}>{t.send}</Submit>
      </Form>
    );
  }
  return (
    <div className={cx('plx-auth__flow', className)} data-plx-step={now}>
      {body}
      {now !== 'done' ? <Alts><Alt to={signIn}>{t.signIn}</Alt></Alts> : null}
    </div>
  );
}

/* ── Multi-factor authentication ── */
const MFA = {
  label: 'Two-step verification', code: 'Verification code', app: 'Enter the {n}-digit code from your authenticator app.',
  sms: 'Enter the {n}-digit code we sent {detail}.', email: 'Enter the {n}-digit code we emailed {detail}.',
  key: 'Insert your security key, or hold it near your device, and touch it.', useKey: 'Use security key',
  remember: 'Remember this device for 30 days', verify: 'Verify', resend: 'Send a new code', resendIn: 'You can ask for a new code in {s} seconds.',
  resent: 'A new code is on its way.', other: 'Use another method', methods: 'Choose how to verify', choose: 'Continue',
  recovery: 'Use a recovery code', needCode: 'Enter all {n} characters of the code.',
};
export function MfaChallenge({ methods = [{ id: 'app', kind: 'app', label: 'Authenticator app' }], defaultMethod, onVerify, onResend, resendAfter = 30,
  remember: showRemember = true, length = 6, error, busy = false, recovery, autoFocus = false, strings, className, ...rest }) {
  const t = Object.assign({}, MFA, strings);
  const [methodId, setMethodId] = React.useState(defaultMethod || (methods[0] && methods[0].id));
  const [choosing, setChoosing] = React.useState(false);
  const [pick, setPick] = React.useState(methodId);
  const [code, setCode] = React.useState('');
  const [remember, setRemember] = React.useState(false);
  const [wait, setWait] = React.useState(resendAfter);
  const [own, setOwn] = React.useState('');
  const first = React.useRef(null);
  const method = methods.find((m) => m.id === methodId) || methods[0] || { kind: 'app' };
  const sends = method.kind === 'sms' || method.kind === 'email';
  const changed = React.useRef(false);
  React.useEffect(() => {
    setWait(resendAfter); setCode(''); setOwn('');
    // another method chosen: focus its code (or its first control)
    if (changed.current && first.current && first.current.focus) first.current.focus();
    changed.current = true;
  }, [methodId]);
  React.useEffect(() => {
    if (!sends || wait <= 0) return undefined;
    const id = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(id);
  }, [wait, sends]);
  const verify = (c) => {
    if (method.kind !== 'key' && String(c || '').length < length) { setOwn(fill(t.needCode, { n: length })); return; }
    setOwn('');
    if (onVerify) onVerify(method.kind === 'key' ? null : c, { method: method.id, remember });
  };
  const submit = (e) => { e.preventDefault(); verify(code); };
  if (choosing) {
    return (
      <div className={cx('plx-auth__flow', className)}>
        <Form label={t.methods} noValidate className="plx-auth__form" onSubmit={(e) => { e.preventDefault(); setMethodId(pick); setChoosing(false); }}>
          <RadioGroup label={t.methods} value={pick} onChange={setPick} options={methods.map((m) => ({ value: m.id, label: m.label, description: m.detail }))} />
          <Submit>{t.choose}</Submit>
        </Form>
      </div>
    );
  }
  const hint = method.kind === 'key' ? t.key : fill(t[method.kind] || t.app, { n: length, detail: method.detail || '' });
  return (
    <div className={cx('plx-auth__flow', className)}>
      <Form label={t.label} noValidate onSubmit={submit} className="plx-auth__form" {...rest}>
        {method.kind === 'key' ? <p className="plx-auth__note">{hint}</p> : (
          <Field label={t.code} description={hint} error={own || error || undefined}>
            <OtpInput ref={first} length={length} value={code} onChange={(c) => { setCode(c); if (own) setOwn(''); }} onComplete={verify} autoFocus={autoFocus} />
          </Field>
        )}
        {method.kind === 'key' && error ? <Notice tone="danger">{error}</Notice> : null}
        {showRemember ? <Checkbox label={t.remember} checked={remember} onChange={(e) => setRemember(e.target.checked)} /> : null}
        <Submit busy={busy}>{method.kind === 'key' ? t.useKey : t.verify}</Submit>
        {sends && onResend ? (wait > 0
          ? <p className="plx-auth__note" aria-live="off">{around(t.resendIn, 's', <span className="plx-auth__data">{wait}</span>)}</p>
          : <Button variant="ghost" size="sm" onClick={() => { onResend(method.id); setWait(resendAfter); announce(t.resent); }}>{t.resend}</Button>) : null}
      </Form>
      <Alts>
        {methods.length > 1 ? <Alt to={{ onClick: () => { setPick(methodId); setChoosing(true); } }}>{t.other}</Alt> : null}
        <Alt to={recovery}>{t.recovery}</Alt>
      </Alts>
    </div>
  );
}

/* ── Single sign-on ── */
const SSO = {
  label: 'Single sign-on', provider: 'Continue with {name}', organization: 'Continue with single sign-on (SSO)', email: 'Work email',
  emailHint: 'We’ll find your organization’s sign-in from it.', next: 'Continue', redirecting: 'Taking you to {name}…',
  needEmail: 'Enter your work email, like name@example.org.', back: 'Back',
};
export function SsoButtons({ providers = [], onProvider, organization = false, onOrganization, redirecting, error, strings, className, ...rest }) {
  const t = Object.assign({}, SSO, strings);
  const [asking, setAsking] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const refs = { email: React.useRef(null) };
  const [errors, check, clear] = useCheck(refs);
  React.useEffect(() => { if (redirecting) announce(fill(t.redirecting, { name: redirecting })); }, [redirecting]);
  if (redirecting) {
    return (
      <div className={cx('plx-auth__sso', className)} {...rest}>
        <p className="plx-auth__status"><Spinner size="sm" label={fill(t.redirecting, { name: redirecting })} /><span aria-hidden="true">{fill(t.redirecting, { name: redirecting })}</span></p>
      </div>
    );
  }
  if (asking) {
    return (
      <div className={cx('plx-auth__sso', className)} {...rest}>
        <Form label={t.label} noValidate className="plx-auth__form" onSubmit={(e) => {
          e.preventDefault();
          if (check({ email: EMAIL.test(email.trim()) ? '' : t.needEmail }) && onOrganization) onOrganization(email.trim());
        }}>
          {error ? <Notice tone="danger">{error}</Notice> : null}
          <Field label={t.email} description={t.emailHint} error={errors.email || undefined}>
            <Input ref={refs.email} type="email" value={email} onChange={(e) => { setEmail(e.target.value); clear('email'); }} autoComplete="email" autoFocus />
          </Field>
          <Submit>{t.next}</Submit>
        </Form>
        <Alts><Alt to={{ onClick: () => setAsking(false) }}>{t.back}</Alt></Alts>
      </div>
    );
  }
  return (
    <div className={cx('plx-auth__sso', className)} role="group" aria-label={t.label} {...rest}>
      {error ? <Notice tone="danger">{error}</Notice> : null}
      {providers.map((p) => <Button key={p.id} icon={p.icon} className="plx-auth__submit" onClick={() => onProvider && onProvider(p)}>{fill(t.provider, { name: p.label })}</Button>)}
      {organization ? <Button icon={LockIcon} className="plx-auth__submit" onClick={() => setAsking(true)}>{t.organization}</Button> : null}
    </div>
  );
}

/* ── Account recovery ── */
const RECOVERY = {
  label: 'Recover your account', how: 'How do you want to get back in?', code: 'Use a backup code',
  codeHint: 'One of the codes you saved when you set up two-step verification. Each works once.',
  factor: 'Use another sign-in method', factorHint: 'A security key, or the authenticator app on another device.',
  help: 'Ask your administrator', helpHint: 'They confirm it’s you and reset your two-step verification.', next: 'Continue',
  backupCode: 'Backup code', verify: 'Use code', needCode: 'Enter a backup code.', contact: 'Contact {admin}. Tell them you can’t use your two-step verification; they’ll check it’s you before they reset it.',
  contactShort: 'Contact your administrator. Tell them you can’t use your two-step verification; they’ll check it’s you before they reset it.',
  done: 'You’re back in. We emailed every address on your account to say a backup code was used.', setUp: 'Set up a new sign-in method',
  back: 'Back to sign in', otherWays: 'Other ways to get back in',
};
export function AccountRecovery({ step, defaultStep = 'choose', onCode, onFactor, admin, onSetUp, error, busy = false, back, strings, className, ...rest }) {
  const t = Object.assign({}, RECOVERY, strings);
  const [own, setOwn] = React.useState(defaultStep);
  const now = step || own;
  const move = (s) => { if (!step) setOwn(s); };
  const options = [{ value: 'code', label: t.code, description: t.codeHint }];
  if (onFactor) options.push({ value: 'factor', label: t.factor, description: t.factorHint });
  options.push({ value: 'help', label: t.help, description: t.helpHint });
  const [pick, setPick] = React.useState('code');
  const [code, setCode] = React.useState('');
  const refs = { code: React.useRef(null) };
  const [errors, check, clear] = useCheck(refs);
  // a step people moved to: focus its field (not on the first render: the page decides where focus starts)
  const moved = React.useRef(false);
  React.useEffect(() => {
    if (moved.current && now === 'code' && refs.code.current) refs.code.current.focus();
    if (now === 'done') announce(t.done);
    moved.current = true;
  }, [now]);
  let body;
  if (now === 'code') {
    body = (
      <Form label={t.backupCode} noValidate className="plx-auth__form" onSubmit={(e) => {
        e.preventDefault();
        if (check({ code: code.trim() ? '' : t.needCode }) && onCode) onCode(code.trim().replace(/\s+/g, ''));
      }} {...rest}>
        <Field label={t.backupCode} description={t.codeHint} error={errors.code || error || undefined}>
          <Input ref={refs.code} data value={code} onChange={(e) => { setCode(e.target.value); clear('code'); }} autoComplete="one-time-code" autoCapitalize="off" spellCheck={false} />
        </Field>
        <Submit busy={busy}>{t.verify}</Submit>
      </Form>
    );
  } else if (now === 'help') {
    body = <div className="plx-auth__form"><p className="plx-auth__note">{admin ? around(t.contact, 'admin', <strong className="plx-auth__strong">{admin}</strong>) : t.contactShort}</p></div>;
  } else if (now === 'done') {
    body = (
      <div className="plx-auth__form">
        <Notice tone="success">{t.done}</Notice>
        {onSetUp ? <Button variant="primary" className="plx-auth__submit" onClick={onSetUp}>{t.setUp}</Button> : null}
      </div>
    );
  } else {
    body = (
      <Form label={t.label} noValidate className="plx-auth__form" onSubmit={(e) => { e.preventDefault(); if (pick === 'factor') { if (onFactor) onFactor(); } else move(pick); }} {...rest}>
        <RadioGroup label={t.how} value={pick} onChange={setPick} options={options} />
        <Submit>{t.next}</Submit>
      </Form>
    );
  }
  return (
    <div className={cx('plx-auth__flow', className)} data-plx-step={now}>
      {body}
      <Alts>{now === 'code' || now === 'help' ? <Alt to={{ onClick: () => move('choose') }}>{t.otherWays}</Alt> : null}{now !== 'done' ? <Alt to={back}>{t.back}</Alt> : null}</Alts>
    </div>
  );
}
