/* Plenix tests · inline Fields in a Stack share one label column, without a :has() rule (issue 1250).
   Summary: three inline Fields with labels of different length in a Stack have their controls on one start edge; the Stack carries data-plx-inline-fields while it holds one and not after the last leaves;
     a Field nested in another child is not part of the column. Left to right and right to left.
   Usage: node tests/stack-inline-fields-1250.test.js   → STACK_INLINE_FIELDS_1250_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9995, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.setViewport({ width: 900, height: 700 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const mount = (n) => page.evaluate(async (dir, n) => {
        document.documentElement.setAttribute('dir', dir);
        const h = React.createElement, P = Plenix; window.__root && window.__root.unmount();
        const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c); window.__root = ReactDOM.createRoot(c);
        const labels = ['Name', 'A much longer label for the email field', 'Phone'];
        window.__render = (count) => window.__root.render(h(P.Stack, { id: 's' }, labels.slice(0, count).map((l, i) => h(P.Field, { key: i, label: l, layout: 'inline' }, h(P.Input, { id: 'i' + i }))),
          h('div', { id: 'wrap' }, h(P.Field, { label: 'Nested', layout: 'inline' }, h(P.Input, { id: 'inested' })))));
        window.__render(n); await new Promise((r) => setTimeout(r, 400));
      }, dir, n);
      const edges = () => page.evaluate(() => [0, 1, 2].map((i) => { const e = document.getElementById('i' + i); if (!e) return null; const r = e.getBoundingClientRect(); return Math.round(document.documentElement.dir === 'rtl' ? r.right : r.left); }));
      const marked = () => page.evaluate(() => document.getElementById('s').hasAttribute('data-plx-inline-fields'));
      await mount(3);
      const e = await edges(); assert.equal(new Set(e).size, 1, T + 'the three controls share one start edge: ' + e.join(','));
      assert.equal(await marked(), true, T + 'the Stack is marked while it holds inline Fields');
      await page.evaluate(() => { window.__render(1); }); await wait(300);
      assert.equal(await marked(), true, T + 'still marked with one left');
      await page.evaluate(() => { window.__render(0); }); await wait(300);
      assert.equal(await marked(), false, T + 'not marked after the last inline Field leaves');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('STACK_INLINE_FIELDS_1250_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
