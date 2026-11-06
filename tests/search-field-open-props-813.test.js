/* Plenix tests · SearchField hands no open/onOpenChange to its <input> (issue 813): React warned "Unknown event handler property
   onOpenChange" when CommandBar passed the collapsed-search props to the wide field.
   Summary (the browser, dev React): a wide SearchField given open and onOpenChange draws without a console warning and the
     input carries no open attribute; the collapsed one still reports its open state through onOpenChange
   Usage: node tests/search-field-open-props-813.test.js   → SEARCH_FIELD_OPEN_PROPS_813_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9813, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::/.test(m.text())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const got = await page.evaluate(async () => {
      const h = React.createElement; document.querySelector('main').innerHTML = '<div id="c"></div>';
      let reported = null;
      ReactDOM.createRoot(document.getElementById('c')).render(h('div', null,
        h('div', { id: 'wide' }, h(Plenix.SearchField, { label: 'Search', value: '', onChange() {}, open: false, onOpenChange() {} })),
        h('div', { id: 'narrow' }, h(Plenix.SearchField, { label: 'Search', collapsed: true, value: '', onChange() {}, onOpenChange(o) { reported = o; } }))));
      await new Promise((r) => setTimeout(r, 800));
      const input = document.querySelector('#wide input');
      const btn = document.querySelector('#narrow button'); if (btn) btn.click();
      await new Promise((r) => setTimeout(r, 400));
      return { hasInput: !!input, openAttr: input ? input.hasAttribute('open') : null, reported };
    });
    assert.equal(got.hasInput, true, 'the wide field draws an input');
    assert.equal(got.openAttr, false, 'the input has no open attribute');
    assert.equal(got.reported, true, 'the collapsed field still reports opening');
    assert.deepEqual(problems, [], 'no console warnings: ' + problems.join(' | ').slice(0, 300));
    console.log('SEARCH_FIELD_OPEN_PROPS_813_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
