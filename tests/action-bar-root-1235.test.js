/* Plenix tests · a sticky ActionBar still keeps the page's focused content clear of the bar, with no :has() on :root (issue 1235).
   Summary: with a sticky ActionBar mounted the page (:root) has scroll-padding-block-end of one bar row; with a static one, or none, it has none; unmounting removes it; two bars count.
   Usage: node tests/action-bar-root-1235.test.js   → ACTION_BAR_ROOT_1235_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9994, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const mount = (bars) => page.evaluate(async (bars) => {
      const h = React.createElement, P = Plenix; window.__root && window.__root.unmount();
      const c = document.createElement('div'); document.querySelector('main').replaceChildren(c);
      window.__root = ReactDOM.createRoot(c);
      window.__root.render(h('div', null, bars.map((b, i) => h(P.ActionBar, { key: i, label: 'Bar ' + i, sticky: b }, h(P.Button, { variant: 'primary' }, 'Save')))));
      await new Promise((r) => setTimeout(r, 400));
    }, bars);
    const pad = () => page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).scrollPaddingBlockEnd) || 0);
    await mount([]); assert.equal(await pad(), 0, 'no bar: no scroll padding');
    await mount([true]); const one = await pad(); assert.ok(one > 0, 'a sticky bar: the page keeps one bar row clear (' + one + ')');
    await mount([false]); assert.equal(await pad(), 0, 'a static bar: none');
    await mount([true, true]); assert.equal(await pad(), one, 'two sticky bars: still one row');
    await page.evaluate(() => { window.__root.unmount(); window.__root = null; }); await wait(200); assert.equal(await pad(), 0, 'unmounted: none');
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('ACTION_BAR_ROOT_1235_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
