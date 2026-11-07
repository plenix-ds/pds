/* Plenix tests · #924 (ADR 0025): a DataGrid column's `description` is its header's tooltip and accessible description.
   Summary: hover on the header title, and keyboard focus on the header cell, show the description in the Plenix Tooltip; the header cell's aria-describedby points at text equal to it;
     a column without a description has no aria-describedby and opens no Tooltip (its title fits). Left to right and right to left.
   Usage: node tests/data-grid-description-924.test.js   → DATA_GRID_DESCRIPTION_924_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const TEXT = 'Days since the first order, counted in calendar days';
(async () => {
  const PORT = +process.env.TEST_PORT || 9924, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 1000, height: 700 });
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) errors.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate(async (dir, TEXT) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = window.Plenix;
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:900px;block-size:400px;display:grid"></div>';
        const rows = Array.from({ length: 5 }, (_, i) => ({ id: 'r' + i, name: 'Row ' + i, age: i * 10 }));
        ReactDOM.createRoot(document.getElementById('c')).render(h(P.DataGrid, { label: 'Customers', data: rows, index: 'id', columns: [{ field: 'name', title: 'Name' }, { field: 'age', title: 'Age', description: TEXT }] }));
        await new Promise((r) => setTimeout(r, 900));
      }, dir, TEXT);
      const head = (title) => page.evaluateHandle((t) => [...document.querySelectorAll('#c [role=columnheader]')].find((c) => c.textContent.trim().startsWith(t)), title);
      const open = () => page.evaluate(() => [...document.querySelectorAll('.plx-tooltip__bubble.is-open')].map((b) => b.textContent.replace(/\s+/g, ' ').trim()));
      const age = (await head('Age')).asElement(), name = (await head('Name')).asElement();
      // hover on the title
      await (await age.$('.plx-data-grid__title-text')).hover(); await wait(800);
      assert.ok((await open()).includes(TEXT), T + 'hover shows the description (' + JSON.stringify(await open()) + ')');
      await page.mouse.move(5, 5); await wait(400);
      // keyboard focus on the header cell
      await age.focus(); await wait(800);
      assert.ok((await open()).includes(TEXT), T + 'keyboard focus shows the description (' + JSON.stringify(await open()) + ')');
      await page.keyboard.press('Escape'); await page.evaluate(() => document.activeElement && document.activeElement.blur()); await wait(300);
      // accessible description equals it
      const described = await page.evaluate((el) => { const ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean); return ids.map((i) => (document.getElementById(i) || {}).textContent).join(' ').trim(); }, age);
      assert.equal(described, TEXT, T + 'the header\'s accessible description is the description (' + described + ')');
      // a column without one
      assert.equal(await page.evaluate((el) => el.getAttribute('aria-describedby'), name), null, T + 'a column without a description has no aria-describedby');
      await (await name.$('.plx-data-grid__title-text')).hover(); await wait(800);
      assert.deepEqual(await open(), [], T + 'a column without a description opens no Tooltip');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors or warnings');
    console.log('DATA_GRID_DESCRIPTION_924_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
