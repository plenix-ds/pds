/* Plenix tests · an empty Table or DataGrid is valid ARIA (#313)
   Summary: with no rows, the row group holds the empty message as a row with one cell (what axe's aria-required-children
     asks for), on an empty DataGrid and an empty Table mounted on the St. John test site's page. The structure is checked
     directly: the accessibility scan itself runs on demand (owner, 2026-10-25), and the tests do not open the design spec.
   Usage: node tests/empty-table-a11y-313.test.js (started by tests/data-grid.test.js) */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9313, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    await page.evaluate(async () => {
      document.body.innerHTML = '<div id="g"></div><div id="t"></div>';
      const h = React.createElement, P = window.Plenix, columns = [{ title: 'Name', field: 'name' }, { title: 'City', field: 'city' }];
      ReactDOM.createRoot(document.getElementById('g')).render(h(P.DataGrid, { label: 'Empty grid', data: [], columns, height: '--plx-ref-size-60u' }));
      ReactDOM.createRoot(document.getElementById('t')).render(h(P.Table, { label: 'Empty table', data: [], columns }));
      await new Promise((r) => setTimeout(r, 800));
    });
    // every row group holds rows only, every row holds cells only, and the empty message sits in a row's cell
    const out = await page.evaluate(() => ['g', 't'].map((id) => {
      const box = document.getElementById(id);
      // the roles an element owns, as ARIA counts them: elements with no role (and none, presentation) are looked
      // through; hidden elements do not count
      const owned = (el) => [...el.children].flatMap((c) => {
        if (c.getAttribute('aria-hidden') === 'true' || c.hidden) return [];
        const role = c.getAttribute('role');
        return !role || role === 'none' || role === 'presentation' ? owned(c) : [role];
      });
      const groups = [...box.querySelectorAll('[role="rowgroup"]')];
      const badGroup = groups.filter((g) => { const r = owned(g); return !r.length || r.some((x) => x !== 'row'); }).length;
      const rows = [...box.querySelectorAll('[role="row"]')];
      const badRow = rows.filter((r) => { const o = owned(r); return !o.length || o.some((x) => !/^(cell|gridcell|columnheader|rowheader)$/.test(x)); }).length;
      const empty = box.querySelector('[class*="__empty"]');
      const cell = empty && empty.closest('[role="cell"], [role="gridcell"]');
      return { id, groups: groups.length, badGroup, badRow, empty: empty ? empty.textContent.trim() : '', inCell: !!(cell && cell.parentElement && cell.parentElement.getAttribute('role') === 'row') };
    }));
    for (const o of out) {
      assert.ok(o.groups > 0, o.id + ': has a row group ' + JSON.stringify(o));
      assert.equal(o.badGroup, 0, o.id + ': a row group holds rows only ' + JSON.stringify(o));
      assert.equal(o.badRow, 0, o.id + ': a row holds cells only ' + JSON.stringify(o));
      assert.ok(o.empty && o.inCell, o.id + ': the empty message is a row with one cell ' + JSON.stringify(o));
    }
    assert.deepEqual(errors, []);
    console.log('EMPTY_TABLE_A11Y_313_OK empty DataGrid and Table: the empty message is a row with one cell');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
