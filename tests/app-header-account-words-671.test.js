/* Plenix tests · AppHeader's account menu reads its words from the catalog (issue 671).
   Summary: AppHeader.Account with density, opened, in en-US and ar-EG: the menu's items (My account, Plenix settings, the
     density choices, Sign out) are the catalog's appHeader.account words in the page's language; strings still wins.
   Proof first: before the fix AppHeader.jsx used its own English ACCOUNT_STRINGS, so the Arabic page showed "Sign out" and
     the Arabic assertion fails.
   Opens a headless browser: run by the owner's test run, never by an agent.
   Usage: node tests/app-header-account-words-671.test.js   → APP_HEADER_ACCOUNT_WORDS_671_OK */
const assert = require('assert/strict');
const path = require('path'), { pathToFileURL } = require('url');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)
const en = require('../platform/i18n/en.json').appHeader.account;

(async () => {
  const ar = (await import(pathToFileURL(path.join(__dirname, '..', 'platform', 'i18n', 'ar.js')).href)).default.appHeader.account;
  const PORT = +process.env.TEST_PORT || 9873, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1200, height: 700 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const menuText = (locale, strings) => page.evaluate(async (locale, strings) => {
      const h = React.createElement, P = window.Plenix, rtl = locale.startsWith('ar');
      document.documentElement.setAttribute('lang', locale);
      document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
      window.__root && window.__root.unmount();
      document.getElementById('main').innerHTML = '<div id="c"></div>';
      window.__root = ReactDOM.createRoot(document.getElementById('c'));
      window.__root.render(h(P.LocaleProvider, { locale, dir: rtl ? 'rtl' : 'ltr' },
        h(P.AppHeader.Account, { name: 'Mina Adel', email: 'mina@example.org', myAccount: { href: '#a' }, settings: { href: '#s' }, density: true, strings })));
      await new Promise((r) => setTimeout(r, 400));
      document.querySelector('.plx-app-header__item--account, .plx-app-header__account-row').click();
      await new Promise((r) => setTimeout(r, 400));
      const m = document.querySelector('[role=menu]');
      return m ? m.textContent.replace(/\s+/g, ' ') : null;
    }, locale, strings || null);

    const e = await menuText('en-US');
    for (const k of ['myAccount', 'settings', 'density', 'compact', 'comfortable', 'signOut']) assert.ok(e && e.includes(en[k]), 'English: ' + k + ' is the catalog\'s; got ' + e);
    const a = await menuText('ar-EG');
    for (const k of ['myAccount', 'settings', 'density', 'compact', 'comfortable', 'signOut']) assert.ok(a && a.includes(ar[k]), 'Arabic: ' + k + ' is the catalog\'s Arabic; got ' + a);
    assert.ok(!a.includes(en.signOut), 'Arabic: no English Sign out');
    const own = await menuText('ar-EG', { signOut: 'Own sign out' });
    assert.ok(own && own.includes('Own sign out'), 'strings wins over the catalog');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('APP_HEADER_ACCOUNT_WORDS_671_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
