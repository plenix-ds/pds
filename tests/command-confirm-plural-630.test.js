/* Plenix tests · #630: actions[].confirm.plural takes a plural object as well as a string.
   Summary: the CommandBar's confirm title "{verb} {count} {plural}?" picks the noun form by the count with the locale's plural rules (Intl.PluralRules, as
     useStrings does): { one, other } in English; { zero, one, two, few, many, other } in Arabic. An exact count key ("=0") wins. A plain string keeps working.
   Proof first: before the fix an object fills the title as "[object Object]": those lines fail.
   Usage: node tests/command-confirm-plural-630.test.js   → COMMAND_CONFIRM_PLURAL_630_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9853, server = await serve(PORT); let browser;
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
    // English: a string keeps working; an object picks one or other
    assert.match(await titleOf('en', 3, 'files'), /Delete 3 files\?/, 'a plain string still fills the title');
    const en = { one: 'file', other: 'files' };
    assert.match(await titleOf('en', 1, en), /Delete 1 file\?/, 'one: the singular form');
    assert.match(await titleOf('en', 3, en), /Delete 3 files\?/, 'other: the plural form');
    assert.match(await titleOf('en', 0, { '=0': 'nothing', one: 'file', other: 'files' }), /Delete 0 nothing\?/, 'an exact count key wins');
    // Arabic: the six forms (Latin stand-ins, so the test holds no Arabic words)
    const ar = { zero: 'FZ', one: 'FO', two: 'FT', few: 'FF', many: 'FM', other: 'FX' };
    for (const [n, form] of [[0, 'FZ'], [1, 'FO'], [2, 'FT'], [5, 'FF'], [11, 'FM'], [100, 'FX']]) {
      const t = await titleOf('ar', n, ar); assert.ok(t && t.includes(form) && !/\[object Object\]/.test(t), 'ar ' + n + ' -> ' + form + ' (got ' + t + ')');
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('COMMAND_CONFIRM_PLURAL_630_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
