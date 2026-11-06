/* Plenix tests · the page templates' words come from the catalog (issue 642).
   Summary: ListingPage with no rows, in English and in Arabic: the empty state's title and text are the catalog's
     (templates.templates.Templates.empty / emptyDescription), so an Arabic page shows them in Arabic; a template's strings
     prop still wins over the catalog.
   Proof first: before the fix Templates.jsx used its own English WORDS object, so the Arabic page showed "No records yet"
     and the Arabic assertion fails.
   Opens a headless browser: run by the owner's test run, never by an agent.
   Usage: node tests/templates-words-642.test.js   → TEMPLATES_WORDS_642_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)
const en = require('../platform/i18n/en.json').templates.templates.Templates;

(async () => {
  const PORT = +process.env.TEST_PORT || 9742, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const ar = (await import(require('url').pathToFileURL(require('path').join(__dirname, '..', 'platform', 'i18n', 'ar.js')).href)).default.templates.templates.Templates;
    const draw = (locale, strings) => page.evaluate(async (locale, strings) => {
      const h = React.createElement, P = window.Plenix, rtl = locale.startsWith('ar');
      document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', locale);
      window.__root && window.__root.unmount();
      document.getElementById('main').innerHTML = '<div id="c"></div>';
      window.__root = ReactDOM.createRoot(document.getElementById('c'));
      window.__root.render(h(P.LocaleProvider, { locale, dir: rtl ? 'rtl' : 'ltr' }, h(P.ListingPage, { title: 'x', rows: [], columns: [], strings })));
      await new Promise((res) => setTimeout(res, 600));
      return document.getElementById('c').textContent;
    }, locale, strings || null);

    const english = await draw('en-US');
    assert.ok(english.includes(en.empty) && english.includes(en.emptyDescription), 'English: the catalog\'s empty state; got ' + english.slice(0, 200));
    const arabic = await draw('ar-EG');
    assert.ok(arabic.includes(ar.empty) && arabic.includes(ar.emptyDescription), 'Arabic: the catalog\'s Arabic empty state; got ' + arabic.slice(0, 200));
    assert.ok(!arabic.includes(en.empty), 'Arabic: no English empty-state title');
    const own = await draw('ar-EG', { empty: 'Own words' });
    assert.ok(own.includes('Own words'), 'the strings prop wins over the catalog');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('TEMPLATES_WORDS_642_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
