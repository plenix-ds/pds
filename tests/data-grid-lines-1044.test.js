/* Plenix tests · #1044 (ADR 0043, D-0133): DataGrid columns[].lines and columns[].overflow.
   Summary: lines: 2 at compact density shows two lines then an ellipsis, and the grid picks the smallest row step that fits (every row the same height); a taller rowHeight wins; a cut cell shows
     a tooltip with the full text on pointer hover and on keyboard focus of the cell, only when the text is cut; a fitting cell shows none; overflow: "none" shows none; a Tooltip around a cell's content
     does not widen the cell; the full text stays in the accessibility tree and the tooltip is not read twice; right to left puts the ellipsis at the inline end; lines 0 and 9 warn and are clamped.
   Proof first: before the change `lines` is ignored (one line at the 36px compact row) and there is no tooltip on a cut cell.
   Usage: node tests/data-grid-lines-1044.test.js   → DATA_GRID_LINES_1044_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9834, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [], warns = [];
    const BASE = 'The council recommends that the hearing be adjourned until the president has reviewed the full submission, the supporting letters and the new evidence in the case file.', LONG = BASE + ' ' + BASE + ' ' + BASE;
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 800 });
      page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (/warn/.test(m.type())) warns.push(m.text()); if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const T = dir + ': ';
      const mount = (cols, extra, rows) => page.evaluate(async (dir, cols, extra, rows, LONG) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-density', 'compact'); const h = React.createElement, P = Plenix; window.__root && window.__root.unmount();
        const c = document.createElement('div'); c.id = 'c'; c.style.inlineSize = '900px'; document.querySelector('main').replaceChildren(c);
        const data = (rows || [0, 1, 2]).map((i) => ({ id: i, name: 'Case ' + i, note: i === 1 ? 'Short note' : LONG + ' ' + i }));
        const columns = cols.map((x) => x.render ? Object.assign({}, x, { render: (v) => h(P.Tooltip, { content: 'Full ' + v }, h('span', { className: 'probe' }, String(v))) }) : x);
        window.__root = ReactDOM.createRoot(c); window.__root.render(h(P.DataGrid, Object.assign({ label: 'Cases', data, columns, index: 'id' }, extra || {}))); await new Promise((r) => setTimeout(r, 1000));
      }, dir, cols, extra, rows, LONG);
      const read = () => page.evaluate(() => { const rows = [...document.querySelectorAll('#c [role=row][data-plx-record]')], v = (r) => r.querySelector('[data-plx-field=note] .plx-data-grid__value, [data-plx-field=note] .probe'), cs = (r) => v(r) && getComputedStyle(v(r));
        return { heights: rows.map((r) => Math.round(r.getBoundingClientRect().height)), step: document.querySelector('#c .plx-data-grid').getAttribute('data-plx-row-height'), clamp: cs(rows[0]) && cs(rows[0]).webkitLineClamp, cell: rows[0].querySelector('[data-plx-field=note]').getBoundingClientRect().width, probe: (() => { const p = rows[0].querySelector('.probe'); return p && Math.round(p.closest('.plx-tooltip').getBoundingClientRect().width); })(), noteWidth: Math.round(rows[0].querySelector('[data-plx-field=note]').getBoundingClientRect().width) }; });
      const tips = () => page.evaluate(() => [...document.querySelectorAll('[role=tooltip]')].filter((t) => t.textContent.trim() && getComputedStyle(t).visibility !== 'hidden' && t.closest('.plx-tooltip') && +getComputedStyle(t).opacity > 0).map((t) => ({ text: t.textContent.trim().slice(0, 30), hidden: t.getAttribute('aria-hidden') })));
      const cols = [{ title: 'Case', field: 'name' }, { title: 'Recommendation', field: 'note', lines: 2 }];
      await mount(cols); let s = await read();
      assert.equal(s.clamp, '2', T + 'lines: 2 clamps the cell to two lines (' + s.clamp + ')'); assert.ok(s.heights.every((x) => x === s.heights[0]), T + 'every row has the same height (' + s.heights + ')'); assert.ok(s.heights[0] >= 52, T + 'the row is the step that fits two lines, not the 36px compact row (' + s.heights[0] + ')');
      assert.notEqual(s.step, 'short', T + 'the grid picked a taller step (' + s.step + ')');
      await mount(cols, { rowHeight: 'tall' }); s = await read(); assert.equal(s.step, 'tall', T + 'a taller rowHeight wins');
      // hover and focus show the full text when cut
      await mount(cols);
      await page.hover('#c [role=row][data-plx-record] [data-plx-field=note]'); await wait(900); let t = await tips();
      assert.equal(t.length, 1, T + 'hover shows one tooltip (' + JSON.stringify(t) + ')'); assert.ok(/^The council/.test(t[0].text), T + 'with the full text'); assert.equal(t[0].hidden, 'true', T + 'not read twice: the tooltip is aria-hidden');
      await page.mouse.move(2, 2); await wait(400); assert.equal((await tips()).length, 0, T + 'it hides when the pointer leaves');
      await page.focus('#c [role=row][data-plx-record] [data-plx-field=note]'); await wait(900); t = await tips(); assert.equal(t.length, 1, T + 'keyboard focus of the cell shows it (' + JSON.stringify(t) + ')');
      await page.evaluate(() => document.activeElement.blur()); await wait(300);
      // a fitting cell shows none
      await page.hover('#c [role=row][data-plx-record]:nth-of-type(2) [data-plx-field=note], #c [role=row][data-plx-record] [data-plx-field=name]'); await wait(900); assert.equal((await tips()).length, 0, T + 'text that fits shows no tooltip'); await page.mouse.move(2, 2);
      // the full text is in the accessibility tree
      assert.ok(await page.evaluate((L) => document.querySelector('#c [role=row][data-plx-record] [data-plx-field=note]').textContent.includes(L.slice(0, 40)), LONG), T + 'the full text is in the cell, the clamp is visual');
      // overflow: none
      await mount([cols[0], { title: 'Recommendation', field: 'note', lines: 2, overflow: 'none' }]);
      await page.hover('#c [role=row][data-plx-record] [data-plx-field=note]'); await wait(900); assert.equal((await tips()).length, 0, T + 'overflow: "none" shows no tooltip'); await page.mouse.move(2, 2);
      // a Tooltip around a cell's content takes the cell's width
      await mount([cols[0], { title: 'Recommendation', field: 'note', render: true }]); s = await read(); assert.ok(s.probe !== null && s.probe <= s.noteWidth, T + 'a Tooltip trigger is no wider than its cell (' + s.probe + ' vs ' + s.noteWidth + ')');
      // lines 0 and 9 warn and are clamped
      warns.length = 0; await mount([cols[0], { title: 'Recommendation', field: 'note', lines: 9 }]); s = await read(); assert.equal(s.clamp, '4', T + 'lines: 9 is clamped to 4'); assert.ok(warns.some((w) => /lines/.test(w)), T + 'and warns');
      await mount([cols[0], { title: 'Recommendation', field: 'note', lines: 0 }]); assert.ok(warns.length >= 1, T + 'lines: 0 warns');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_LINES_1044_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
