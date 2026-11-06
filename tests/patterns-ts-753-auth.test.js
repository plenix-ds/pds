/* Plenix tests · TypeScript wave 3, Auth (issue 753): the seven Auth forms draw the same after the rename. A smoke probe mounts each (Auth, SignInForm, SignUpForm, PasswordResetForm, MfaChallenge, SsoButtons, AccountRecovery), reads what it draws
   (the text, the roles, the number of buttons, fields and links, the accessible names) and prints one line per case. The same probe run on the code before
   the change prints the same lines (tests/fixtures/patterns-ts-753-auth.base.txt). No script errors or dev warnings. Usage: node tests/patterns-ts-753-auth.test.js [--print] */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');
require('./limit.js');
const BASE = path.join(__dirname, 'fixtures', 'patterns-ts-753-auth.base.txt');
(async () => {
  const PORT = +process.env.TEST_PORT || 9862, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const P = 'Plenix.';
    const cases = {
      auth: "h(Plenix.Auth, { title: 'Welcome back', description: 'Sign in to continue', footer: 'Legal line' }, h('p', null, 'body'))",
      signIn: "h(Plenix.SignInForm, { onSubmit() {}, error: 'Email or password is incorrect.', keepDescription: 'On this device only', forgot: { href: '#f' }, signUp: { onClick() {} } })",
      signUp: "h(Plenix.SignUpForm, { onSubmit() {}, terms: 'I agree to the terms', errors: { email: 'Already in use' }, signIn: { href: '#s' } })",
      resetRequest: "h(Plenix.PasswordResetForm, { signIn: { href: '#s' } })",
      resetSent: "h(Plenix.PasswordResetForm, { step: 'sent', expires: '30 minutes' })",
      resetNew: "h(Plenix.PasswordResetForm, { step: 'new' })",
      resetDone: "h(Plenix.PasswordResetForm, { step: 'done' })",
      mfa: "h(Plenix.MfaChallenge, { methods: [{ id: 'app', kind: 'app', label: 'Authenticator app' }, { id: 'sms', kind: 'sms', label: 'Text message', detail: 'to the phone ending 42' }], recovery: { href: '#r' } })",
      mfaKey: "h(Plenix.MfaChallenge, { methods: [{ id: 'key', kind: 'key', label: 'Security key' }] })",
      sso: "h(Plenix.SsoButtons, { providers: [{ id: 'g', label: 'Google' }, { id: 'm', label: 'Microsoft' }], organization: true, error: 'Provider refused' })",
      ssoRedirect: "h(Plenix.SsoButtons, { providers: [{ id: 'g', label: 'Google' }], redirecting: 'Google' })",
      recoveryChoose: "h(Plenix.AccountRecovery, { back: { href: '#b' } })",
      recoveryCode: "h(Plenix.AccountRecovery, { step: 'code', error: 'Wrong code' })",
      recoveryHelp: "h(Plenix.AccountRecovery, { step: 'help', admin: 'Ask Sam' })",
      recoveryDone: "h(Plenix.AccountRecovery, { step: 'done', onSetUp() {} })",
    };
    const lines = [];
    for (const [name, expr] of Object.entries(cases)) {
      await page.evaluate(async (expr) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', 'ltr'); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(h(Plenix.ToastProvider || React.Fragment, null, h('div', { style: { width: 800 } }, eval(expr))));
        await new Promise((r) => setTimeout(r, 900));
      }, expr);
      const sig = await page.evaluate(() => {
        const q = (s) => document.querySelectorAll(s).length;
        const text = document.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 300);
        const names = [...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')).filter(Boolean).slice(0, 12).join('|');
        return { text, buttons: q('button'), inputs: q('input,textarea,select'), links: q('a[href]'), roles: [...new Set([...document.querySelectorAll('[role]')].map((e) => e.getAttribute('role')))].sort().join(','), names };
      });
      lines.push(name + ' ' + JSON.stringify(sig));
    }
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | '));
    const out = lines.join('\n') + '\n';
    if (process.argv.includes('--print')) { fs.writeFileSync(BASE, out); console.log('written', BASE); }
    else assert.equal(out, fs.readFileSync(BASE, 'utf8'), 'what the patterns draw is unchanged');
    console.log('patterns-ts-753-auth: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
