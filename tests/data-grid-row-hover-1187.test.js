/* Plenix tests · #1187 (owner, CTM#310): every hovered row of a DataGrid or Table tints, whether or not the row can be clicked or selected.
   Summary: a read-only DataGrid (no row action), the static Table, and a clickable DataGrid, each hovered on a body row, light and dark: the row's background
     becomes the grid's hover token (the same colour a clickable row gets), and its line colour changes with it. A read-only row stays inert: no tab stop,
     no pointer cursor, no click behaviour. A clickable row is unchanged.
   Checks: AC-1 a read-only grid row tints on hover; AC-2 the static Table row tints; AC-3 a clickable row tints as before; AC-4 a read-only row is not focusable, not a pointer and
     a click on it changes nothing (no aria-current); AC-5 no tint when the pointer is elsewhere.
   Proof first: before the change a row without an action has no hover class, so its background does not change on hover.
   Usage: node tests/data-grid-row-hover-1187.test.js   → DATA_GRID_ROW_HOVER_1187_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9814, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const mode of ['light', 'dark']) {
      const T = mode + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 900 });
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate(async (mode) => {
        document.documentElement.setAttribute('data-plx-mode', mode); const h = React.createElement, P = Plenix;
        const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c);
        const data = [{ id: 'a', name: 'Alpha', n: 1 }, { id: 'b', name: 'Beta', n: 2 }, { id: 'c', name: 'Gamma', n: 3 }];
        const columns = [{ title: 'Name', field: 'name', kind: 'name' }, { title: 'N', field: 'n', width: 80 }];
        window.__clicks = [];
        ReactDOM.createRoot(c).render(h('div', null,
          h('div', { id: 'ro' }, h(P.DataGrid, { label: 'Read only', data, index: 'id', columns })),
          h('div', { id: 'tb' }, h(P.Table, { label: 'Static', data, index: 'id', columns })),
          h('div', { id: 'cl' }, h(P.DataGrid, { label: 'Clickable', data, index: 'id', columns, onRowClick: (r) => window.__clicks.push(r.id) }))));
        await new Promise((r) => setTimeout(r, 1500));
      }, mode);
      const row = (box) => '#' + box + ' [role=row][data-plx-record]:nth-of-type(2)';
      const read = (box) => page.evaluate((sel) => { const r = document.querySelector(sel), s = getComputedStyle(r); return { bg: s.backgroundColor, shadow: s.boxShadow, cursor: s.cursor, tab: r.getAttribute('tabindex'), current: r.getAttribute('aria-current') }; }, row(box));
      const hover = async (box) => { await page.mouse.move(2, 2); await wait(300); const b = await (await page.$(row(box))).boundingBox(); await page.mouse.move(b.x + b.width - 20, b.y + b.height / 2); await wait(450); return read(box); };
      const at = {}; for (const box of ['cl', 'ro', 'tb']) { await page.mouse.move(2, 2); await wait(300); at[box] = { rest: await read(box), hover: await hover(box) }; }
      // AC-3: a clickable row tints, as before
      assert.notEqual(at.cl.hover.bg, at.cl.rest.bg, T + 'AC-3: a clickable row tints on hover (' + at.cl.rest.bg + ' -> ' + at.cl.hover.bg + ')');
      // AC-1 and AC-2: the read-only rows tint to the same colour
      assert.equal(at.ro.hover.bg, at.cl.hover.bg, T + 'AC-1: a read-only grid row tints to the hover token (' + at.ro.hover.bg + ' vs ' + at.cl.hover.bg + ')');
      assert.notEqual(at.ro.hover.bg, at.ro.rest.bg, T + 'AC-1: it changes from its rest colour');
      assert.equal(at.tb.hover.bg, at.cl.hover.bg, T + 'AC-2: a static Table row tints to the hover token (' + at.tb.hover.bg + ')');
      assert.notEqual(at.tb.hover.bg, at.tb.rest.bg, T + 'AC-2: it changes from its rest colour');
      assert.equal(at.ro.hover.shadow, at.cl.hover.shadow, T + 'AC-1: the line colour changes with it');
      // AC-4: a read-only row stays inert
      assert.equal(at.ro.hover.tab, null, T + 'AC-4: no tab stop on a read-only row'); assert.notEqual(at.ro.hover.cursor, 'pointer', T + 'AC-4: no pointer cursor');
      await page.click(row('ro')); await wait(300);
      assert.deepEqual(await page.evaluate(() => ({ clicks: window.__clicks.slice(), current: document.querySelectorAll('#ro [aria-current=true]').length })), { clicks: [], current: 0 }, T + 'AC-4: a click on a read-only row does nothing');
      // AC-5: the pointer away, the tint goes
      await page.mouse.move(2, 2); await wait(450);
      assert.equal((await read('ro')).bg, at.ro.rest.bg, T + 'AC-5: no tint when the pointer is elsewhere');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_ROW_HOVER_1187_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
