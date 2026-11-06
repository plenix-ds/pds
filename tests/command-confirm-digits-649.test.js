/* Plenix tests · #649: the CommandBar's confirm title writes its count in the locale's digits.
   Summary: "{verb} {count} {plural}?" in ar-EG writes the count in Arabic-Indic digits (docs/i18n/arabic.md: ar-EG CLDR); in en-US Latin, with grouping
     (1,200); a count the app passes as text stays as given.
   Proof first: before the fix the count went in as a raw number, so the Arabic title read "11" and the en-US title "1200": those lines fail.
   Usage: node tests/command-confirm-digits-649.test.js   → COMMAND_CONFIRM_DIGITS_649_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9861, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 1000, height: 500 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    // the title the dialog shows for a confirm, given the locale, the count and the plural
    const titleOf = (locale, count, plural) => page.evaluate(async (locale, count, plural) => {
      window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
      const actions = [{ id: 'delete', label: 'Delete', icon: 'trash', danger: true, onSelect: () => {}, confirm: { count, plural } }];
      window.__root = ReactDOM.createRoot(document.getElementById('c'));
      window.__root.render(h(Plenix.LocaleProvider, { locale }, h('div', { style: { width: 900, padding: 8 } }, h(Plenix.CommandBar, { label: 'Files', actions }))));
      await new Promise((r) => setTimeout(r, 900));
      const b = [...document.querySelectorAll('button')].find((x) => (x.getAttribute('aria-label') || x.textContent.trim()) === 'Delete'); b.click();
      await new Promise((r) => setTimeout(r, 400));
      const d = document.querySelector('[role=alertdialog], [role=dialog]'), t = d && d.querySelector('h1, h2, h3, [class*=title]');
      return d ? (t ? t.textContent : d.textContent).replace(/\s+/g, ' ').trim() : null;
    }, locale, count, plural);
    assert.match(await titleOf('ar-EG', 11, 'FM'), /١١/, 'ar-EG: the count in Arabic-Indic digits');
    assert.ok(!/11/.test(await titleOf('ar-EG', 11, 'FM')), 'ar-EG: no Latin digits in the count');
    assert.match(await titleOf('en-US', 1200, 'files'), /Delete 1,200 files\?/, 'en-US: Latin digits with grouping');
    assert.match(await titleOf('en-US', '3', 'files'), /Delete 3 files\?/, 'a count given as text stays as given');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('COMMAND_CONFIRM_DIGITS_649_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
