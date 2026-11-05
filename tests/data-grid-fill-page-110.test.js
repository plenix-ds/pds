/* Plenix tests · a "fill" DataGrid in a page scrolls alone (issue 110, RedSave P-60): in an AppShell with PageContent (its padding
   kept) and a grid with many rows, only the grid scrolls: the window, the main region and the page column do not.
   Usage: node tests/data-grid-fill-page-110.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9654, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    for (const [label, withHeading, after] of [['grid alone', false], ['a heading above the grid', true], ['a note after the grid', true, true]]) {
      const r = await page.evaluate(async (heading, after) => {
        const h = React.createElement, P = Plenix;
        document.querySelector('main').innerHTML = '<div id="v"></div>';
        const data = Array.from({ length: 200 }, (_, i) => ({ id: i, name: 'Row ' + i, kind: 'Post' }));
        ReactDOM.createRoot(document.getElementById('v')).render(h(P.ToastProvider, null, h(P.AppShell, { header: h('header', { style: { height: '48px' } }, 'Head') },
          h(P.PageContent, null, heading ? h('h2', null, 'Posts') : null, h(P.DataGrid, { label: 'Posts', data, columns: [{ title: 'Name', field: 'name' }, { title: 'Kind', field: 'kind' }], mode: 'fill' }), after ? h('p', null, 'Note after the grid') : null))));
        await new Promise((r) => setTimeout(r, 1500));
        const over = (e) => e.scrollHeight - e.clientHeight;
        const grid = document.querySelector('#v .plx-data-grid__grid-tableholder');
        return { doc: over(document.documentElement), main: over(document.querySelector('#v .plx-app-shell__main')), pc: over(document.querySelector('#v .plx-page-content')), grid: over(grid) };
      }, withHeading, after);
      assert.ok(r.doc <= 1, label + ': the window does not scroll (' + r.doc + 'px)');
      assert.ok(r.main <= 1, label + ': the main region does not scroll (' + r.main + 'px)');
      assert.ok(r.pc <= 1, label + ': the page column does not scroll (' + r.pc + 'px)');
      assert.ok(r.grid > 0, label + ': the grid scrolls');
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('data-grid-fill-page-110: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
