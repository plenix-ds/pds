/* Plenix tests · the DataGrid's long card list draws only the cards near the view (issue 809): a narrow grid of thousands of
   rows draws about one screen of cards, each measured, with a space before and after them as tall as the cards not drawn.
   Written before step 2: the first step drew the cards in chunks of 100, so End drew all 10,000 cards (about 3.8 s).
   Summary (the browser, 320 x 640, the cards: narrow="list"):
     10,000 rows: cards, fewer than 40 drawn, a spacer after them, aria-rowcount 10,001, the page answers at once
     scrolling the grid's own scroll area to the end draws the last card (aria-rowindex 10,001), still fewer than 40
     Arrow Down on the last drawn card focuses the next card
     End on a card focuses the last card within 1 s, still fewer than 40 drawn
     Home after End keeps focus on the last card (the focused card stays drawn), still fewer than 40 drawn
     select-all selects all 10,000 rows (the data, not the drawn cards)
     a grouped list: scrolled deep into its first group, that group's header is still drawn
     a grid of 100 rows or fewer (100, 30) draws every card and no spacer (as before); the wide table is unchanged (virtualized)
     right to left the same
     no script errors
   Usage: node tests/data-grid-card-chunks-809.test.js   → DATA_GRID_CARD_CHUNKS_809_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

(async () => {
  const PORT = +process.env.TEST_PORT || 9688, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const pause = (ms = 300) => new Promise((r) => setTimeout(r, ms));
    const open = async (width) => {
      await page.setViewport({ width, height: 640 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    };
    const draw = (n, opts = {}) => page.evaluate(async (n, opts) => {
      const h = React.createElement, P = window.Plenix, ar = opts.dir === 'rtl';
      document.documentElement.setAttribute('dir', opts.dir || 'ltr');
      window.__root && window.__root.unmount();
      document.getElementById('main').innerHTML = '<div id="c"></div>';
      const sheet = document.getElementById('t809') || Object.assign(document.head.appendChild(document.createElement('style')), { id: 't809' });
      sheet.textContent = '#c{block-size:600px;display:grid;}';
      window.__selected = 0;
      const data = Array.from({ length: n }, (_, i) => ({ id: 'g' + i, donor: (ar ? 'متبرع ' : 'Donor ') + (i + 1), fund: i < n / 2 ? 'General' : 'Building', amount: (i % 9 + 1) * 25 }));
      const columns = [{ field: 'donor', title: 'Donor', width: 180 }, { field: 'fund', title: 'Fund', width: 140 }, { field: 'amount', title: 'Amount', width: 120, type: 'currency' }];
      // narrow: 'list' (issue 929): the cards under 600px whatever the columns need
      window.__root = ReactDOM.createRoot(document.getElementById('c'));
      window.__root.render(h(P.LocaleProvider, { locale: ar ? 'ar-EG' : 'en-US', dir: opts.dir || 'ltr' },
        h(P.DataGrid, Object.assign({ label: 'Gifts', data, columns, index: 'id', selectable: true, narrow: 'list',
          onSelectionChange: (s) => { window.__selected = (Array.isArray(s) ? s : Object.keys(s || {})).length; } }, opts.grid || {}))));
      await new Promise((r) => setTimeout(r, 900));
    }, n, opts);
    const state = () => page.evaluate(() => {
      const g = document.querySelector('[role="grid"], [role="treegrid"]'), a = document.activeElement, row = a && a.closest && a.closest('[role="row"]');
      const rows = [...document.querySelectorAll('.plx-data-grid__grid-row')];
      return { narrow: !!document.querySelector('.plx-data-grid--narrow'), rows: rows.length,
        last: Math.max(0, ...rows.map((r) => +r.getAttribute('aria-rowindex') || 0)),
        spacer: !!document.querySelector('.plx-data-grid__gap--px'), rowcount: g && +g.getAttribute('aria-rowcount'), active: row ? +row.getAttribute('aria-rowindex') : null };
    });
    const answers = () => page.evaluate(() => performance.now()).then(() => true);

    for (const dir of ['ltr', 'rtl']) {
      const d = dir + ': ';
      await open(320);
      await draw(10000, { dir });
      await Promise.race([answers(), new Promise((_, no) => setTimeout(() => no(new Error(d + 'the page did not answer within 5 s')), 5000))]);
      let s = await state();
      assert.equal(s.narrow, true, d + '10,000 rows at 320px are cards');
      assert.ok(s.rows > 0 && s.rows < 40, d + 'only the cards near the view are drawn; got ' + s.rows);
      assert.equal(s.spacer, true, d + 'a spacer stands for the cards not drawn');
      assert.equal(s.rowcount, 10001, d + 'aria-rowcount is the full count (10,000 rows and the header)');

      // scrolling to the end draws the last card, not every card
      await page.evaluate(() => { const h = document.querySelector('.plx-data-grid__grid-tableholder'); h.scrollTop = h.scrollHeight; });
      await pause(600);
      s = await state();
      assert.equal(s.last, 10001, d + 'scrolling to the end draws the last card');
      assert.ok(s.rows < 40, d + 'and still only the cards near the view; got ' + s.rows);

      // Arrow Down past the drawn cards (back at the top)
      await page.evaluate(() => { const h = document.querySelector('.plx-data-grid__grid-tableholder'); h.scrollTop = 0; });
      await pause(400);
      const next = await page.evaluate(() => { const rows = [...document.querySelectorAll('.plx-data-grid__grid-row')]; const r = rows[rows.length - 1]; r.querySelector('[role="gridcell"][tabindex]').focus(); return +r.getAttribute('aria-rowindex') + 1; });
      await page.keyboard.press('ArrowDown'); await pause();
      s = await state();
      assert.equal(s.active, next, d + 'Arrow Down on the last drawn card focuses the next card (' + next + ')');

      // End: the last card, at once
      const t0 = Date.now();
      await page.keyboard.press('End');
      await page.waitForFunction(() => { const a = document.activeElement, r = a && a.closest && a.closest('[role="row"]'); return r && +r.getAttribute('aria-rowindex') === 10001; }, { timeout: 5000, polling: 'raf' });
      const took = Date.now() - t0;
      s = await state();
      assert.ok(took < 1000, d + 'End focuses the last card within 1 s; took ' + took + 'ms');
      assert.ok(s.rows < 40, d + 'End draws no more than the cards near the view; got ' + s.rows);

      // Home (the scroll area goes to the top): focus stays on the last card, which stays drawn
      await page.keyboard.press('Home'); await pause(500);
      s = await state();
      assert.equal(s.active, 10001, d + 'Home after End keeps focus on the last card');
      assert.ok(s.rows < 40, d + 'still only the cards near the view and the focused one; got ' + s.rows);

      // select-all is the data's
      await draw(10000, { dir });
      await page.evaluate(() => { const c = document.querySelector('[role="columnheader"] input[type="checkbox"], .plx-data-grid__grid-header input[type="checkbox"]'); c.click(); });
      await pause();
      assert.equal(await page.evaluate(() => window.__selected), 10000, d + 'select-all selects every row, not only the drawn cards');

      // a grouped list: deep in the first group, its header is still drawn (it stays stuck at the top)
      await draw(10000, { dir, grid: { groupBy: 'fund' } });
      await page.evaluate(() => { const h = document.querySelector('.plx-data-grid__grid-tableholder'); h.scrollTop = Math.floor(h.scrollHeight / 4); });
      await pause(600);
      assert.ok(await page.evaluate(() => !!document.querySelector('.plx-data-grid__grid-group')), d + 'deep in a group, its header is still drawn');

      // small grids are as before
      await draw(100, { dir });
      s = await state();
      assert.deepEqual([s.rows, s.spacer], [100, false], d + '100 rows: every card and no spacer');
      await draw(30, { dir });
      s = await state();
      assert.deepEqual([s.rows, s.spacer], [30, false], d + '30 rows: every card and no spacer');

      // the wide table is unchanged: virtualized, no card spacer
      await open(1280);
      await draw(10000, { dir });
      s = await state();
      assert.equal(s.narrow, false, d + 'at 1280px the grid is a table');
      assert.ok(s.rows < 100 && !s.spacer, d + 'the table stays virtualized, with no card spacer; got ' + s.rows + ' rows');
    }

    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_CARD_CHUNKS_809_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
