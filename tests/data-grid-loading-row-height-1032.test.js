/* Plenix tests · the DataGrid loading placeholder keeps the density's row height (issue 1032, G2's QA item on PR 1056).
   Summary: a DataGrid with loading and no rows, once the region delay has passed (1 s), draws its placeholder as tall as one row of the density: 36px compact, 40px standard,
     48px comfortable (the row's own 1px rule makes a drawn row 1px taller, so the placeholder is the row's height without it), and the labeled spinner sits inside it.
     The grid does not jump when its first rows arrive: the placeholder and the first row differ by no more than that rule. Left to right and right to left.
   Usage: node tests/data-grid-loading-row-height-1032.test.js   -> DATA_GRID_LOADING_ROW_HEIGHT_1032_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9932, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      for (const [density, px] of [['compact', 36], ['standard', 40], ['comfortable', 48]]) {
        const T = dir + ' ' + density + ': ';
        const r = await page.evaluate(async (dir, density) => {
          document.documentElement.setAttribute('dir', dir);
          const h = React.createElement, P = Plenix, mount = (props) => { const host = document.createElement('div'); host.style.inlineSize = '700px'; document.querySelector('main').appendChild(host);
            ReactDOM.createRoot(host).render(h(P.DataGrid, Object.assign({ density, columns: [{ title: 'Name', field: 'name' }] }, props))); return host; };
          document.querySelector('main').replaceChildren();
          const loading = mount({ label: 'Loading grid', data: [], loading: true }), full = mount({ label: 'Full grid', data: [{ name: 'a' }] });
          await new Promise((r) => setTimeout(r, 1600));
          const ph = loading.querySelector('.plx-data-grid__grid-placeholder'), row = full.querySelector('.plx-data-grid__grid-row');
          return { ph: ph && ph.getBoundingClientRect().height, spinner: !!(ph && ph.querySelector('.plx-spinner')), row: row && row.getBoundingClientRect().height };
        }, dir, density);
        assert.ok(r.ph !== null, T + 'the placeholder is drawn');
        assert.equal(r.ph, px, T + 'placeholder height is the density row height (' + r.ph + ')');
        assert.ok(r.spinner, T + 'the spinner is inside the placeholder');
        assert.ok(Math.abs(r.row - r.ph) <= 1, T + 'the first row differs by no more than its 1px rule (' + r.row + ' vs ' + r.ph + ')');
      }
      await page.close();
    }
    assert.deepEqual(problems, [], 'no page errors or console warnings: ' + problems.join(' | '));
    console.log('DATA_GRID_LOADING_ROW_HEIGHT_1032_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
