/* Plenix tests · the unsaved-changes dialog reads its words from the catalog (issue 668).
   Summary: a dirty useUnsavedGuard, then confirmLeave(): the dialog's title and buttons are the catalog's providers.UnsavedGuard
     words in the page's language (en-US, ar-EG); options.strings still wins.
   Proof first: before the fix UnsavedGuard.tsx used its own English STRINGS, so the Arabic page asked "Leave without saving?"
     and the Arabic assertion fails.
   Opens a headless browser: run by the owner's test run, never by an agent.
   Usage: node tests/unsaved-guard-words-668.test.js   → UNSAVED_GUARD_WORDS_668_OK */
const assert = require('assert/strict');
const path = require('path'), { pathToFileURL } = require('url');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)
const en = require('../platform/i18n/en.json').providers.UnsavedGuard;

(async () => {
  const ar = (await import(pathToFileURL(path.join(__dirname, '..', 'platform', 'i18n', 'ar.js')).href)).default.providers.UnsavedGuard;
  const PORT = +process.env.TEST_PORT || 9871, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 900, height: 600 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const dialogWords = (locale, strings) => page.evaluate(async (locale, strings) => {
      const h = React.createElement, P = window.Plenix, rtl = locale.startsWith('ar');
      document.documentElement.setAttribute('lang', locale);
      document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
      window.__root && window.__root.unmount();
      document.getElementById('main').innerHTML = '<div id="c"></div>';
      function Form() { P.useUnsavedGuard(true, undefined, strings ? { strings } : undefined); return h('p', null, 'form'); }
      window.__root = ReactDOM.createRoot(document.getElementById('c'));
      window.__root.render(h(P.LocaleProvider, { locale, dir: rtl ? 'rtl' : 'ltr' }, h(Form)));
      await new Promise((r) => setTimeout(r, 400));
      const answer = P.confirmLeave(null);
      await new Promise((r) => setTimeout(r, 400));
      const d = document.querySelector('[role=alertdialog], [role=dialog]');
      const out = d ? { text: d.textContent.replace(/\s+/g, ' '), buttons: [...d.querySelectorAll('button')].map((b) => b.textContent.trim()).filter(Boolean) } : null;
      // close it by staying (Escape keeps editing)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); if (d) d.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await Promise.race([answer, new Promise((r) => setTimeout(r, 600))]);
      return out;
    }, locale, strings || null);

    const e = await dialogWords('en-US');
    assert.ok(e && e.text.includes(en.title) && e.buttons.includes(en.leave) && e.buttons.includes(en.stay), 'English: the catalog\'s words; got ' + JSON.stringify(e));
    const a = await dialogWords('ar-EG');
    assert.ok(a && a.text.includes(ar.title) && a.buttons.includes(ar.leave) && a.buttons.includes(ar.stay), 'Arabic: the catalog\'s Arabic; got ' + JSON.stringify(a));
    assert.ok(!a.text.includes(en.title), 'Arabic: no English title');
    const own = await dialogWords('ar-EG', { title: 'Own title' });
    assert.ok(own && own.text.includes('Own title'), 'options.strings wins over the catalog');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('UNSAVED_GUARD_WORDS_668_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
