/* Plenix tests · a field used alone is never wider than its container (issue 145, P-52).
   Summary: in a 300px container (a side panel's row), Input, Select, Combobox (with a long option), DatePicker, TimePicker, SearchField and EntityPicker are no wider than the
     container, at their default width and with width="fill" they fill it; a ResourceList row's field (items[].field) stays inside its row. Left to right and right to left.
   Usage: node tests/field-width-145.test.js   → FIELD_WIDTH_145_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9898, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 900, height: 700 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const out = await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en'); document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement, P = window.Plenix;
        const opts = [{ value: 'a', label: 'A very long option label that wants a very wide field to show itself in full and then some more words' }];
        const make = (id, el) => h('div', { key: id, id, style: { inlineSize: 300, marginBlockEnd: 8 } }, el);
        const list = [
          ['input', (w) => h(P.Input, { 'aria-label': 'i', value: 'x', onChange() {}, width: w })], ['select', (w) => h(P.Select, { 'aria-label': 's', options: opts, width: w })],
          ['combobox', (w) => h(P.Combobox, { label: 'c', options: opts, value: 'a', onChange() {}, width: w })], ['date', (w) => h(P.DatePicker, { 'aria-label': 'd', value: '2026-03-08', onChange() {}, width: w })],
          ['search', (w) => h(P.SearchField, { 'aria-label': 'q', value: 'x', onChange() {}, width: w })], ['entity', (w) => h(P.EntityPicker, { kind: 'people', label: 'e', options: [{ value: 'a', label: opts[0].label, description: 'a@example.org' }], value: 'a', onChange() {}, width: w })]];
        ReactDOM.createRoot(document.getElementById('c')).render(h('div', null, list.flatMap(([id, f]) => [make(id, f(undefined)), make(id + '-fill', f('fill'))])));
        await new Promise((r) => setTimeout(r, 1000));
        const res = {};
        for (const [id] of list) for (const k of [id, id + '-fill']) { const box = document.getElementById(k), kid = box.firstElementChild, b = box.getBoundingClientRect(), r = kid.getBoundingClientRect(); res[k] = { w: Math.round(r.width), inside: r.left >= b.left - 1 && r.right <= b.right + 1 }; }
        return res;
      }, dir);
      for (const [k, v] of Object.entries(out)) { assert.equal(v.inside, true, dir + ' ' + k + ': inside its 300px container (got ' + v.w + 'px)'); if (/-fill$/.test(k)) assert.ok(v.w >= 290, dir + ' ' + k + ': fills the container (got ' + v.w + 'px)'); }
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('FIELD_WIDTH_145_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
