/* Plenix tests · the DataGrid cell tooltip measures the cut on hover or focus only (issue 1067, ADR 0043).
   Summary: 50 rows of a lines: 2 column render and scroll with no cut measurement (no scrollHeight read on a value, no clamp write on a value's style); hovering a cut cell shows the full text; focusing it by keyboard shows it;
     a cell whose text fits shows no tooltip. Left to right and right to left.
   Proof first: before the change every drawn cell reads scrollHeight and writes the clamp on draw (and on every resize).
   Usage: node tests/data-grid-cut-1067.test.js   → DATA_GRID_CUT_1067_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9967, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const LONG = 'The council recommends that the hearing be adjourned until the president has reviewed the full submission, the supporting letters and the new evidence in the case file. '.repeat(3);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 800 });
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const probe = await page.evaluate(async (dir, LONG) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = Plenix;
        const isValue = (el) => el && el.classList && [...el.classList].some((c) => /__value/.test(c));
        const counts = { reads: 0, writes: 0 };
        const d = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollHeight'); Object.defineProperty(Element.prototype, 'scrollHeight', { configurable: true, get() { if (isValue(this)) counts.reads++; return d.get.call(this); } });
        new MutationObserver((list) => { for (const m of list) if (isValue(m.target)) counts.writes++; }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['style'] });
        const c = document.createElement('div'); c.id = 'c'; c.style.inlineSize = '900px'; document.querySelector('main').replaceChildren(c);
        const data = Array.from({ length: 50 }, (_, i) => ({ id: i, name: 'Case ' + i, note: i === 1 ? 'Short note' : LONG + i }));
        ReactDOM.createRoot(c).render(h(P.DataGrid, { label: 'Cases', data, index: 'id', columns: [{ title: 'Case', field: 'name' }, { title: 'Recommendation', field: 'note', lines: 2 }] }));
        await new Promise((r) => setTimeout(r, 1200));
        const sc = c.querySelector('.plx-data-grid__scroll, [role=grid]'); if (sc) { sc.scrollTop = 600; await new Promise((r) => setTimeout(r, 500)); }
        return counts;
      }, dir, LONG);
      assert.deepEqual(probe, { reads: 0, writes: 0 }, T + 'rendering and scrolling run no cut measurement: ' + JSON.stringify(probe));
      const tips = () => page.evaluate(() => [...document.querySelectorAll('[role=tooltip]')].filter((t) => t.textContent.trim() && getComputedStyle(t).visibility !== 'hidden' && +getComputedStyle(t).opacity > 0).map((t) => t.textContent.trim().slice(0, 20)));
      const cell = (n) => '#c [role=row][data-plx-record] [data-plx-field=note]';
      await page.hover(cell()); await wait(900); let t = await tips(); assert.equal(t.length, 1, T + 'hover on a cut cell shows the full text (' + JSON.stringify(t) + ')'); await page.mouse.move(2, 2); await wait(500);
      await page.focus(cell()); await wait(900); t = await tips(); assert.equal(t.length, 1, T + 'keyboard focus on a cut cell shows it (' + JSON.stringify(t) + ')'); await page.evaluate(() => document.activeElement.blur()); await wait(500);
      await page.evaluate(() => { const c = [...document.querySelectorAll('#c [data-plx-field=note]')].find((e) => /^Short note/.test(e.textContent)); c.setAttribute('data-short', ''); c.scrollIntoView(); });
      await page.hover('#c [data-short]'); await wait(900); t = await tips(); assert.equal(t.length, 0, T + 'a cell whose text fits shows no tooltip (' + JSON.stringify(t) + ')');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors: ' + errors.join(' | '));
    console.log('DATA_GRID_CUT_1067_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
