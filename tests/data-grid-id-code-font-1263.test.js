/* Plenix tests · #1263 (audit item 17 of #1232, D-0164, D-0165): the DataGrid kinds id and code draw in the data font, like kind data; kinds name and text in the text font.
   Summary: a DataGrid with a column of each kind (id, code, data, name, and a default text column), light and dark, LTR and RTL: the id, code and data cells compute to Reddit Mono,
     the name and text cells to DM Sans; a long id still ends in an ellipsis and does not widen its column.
   Checks: AC-1 an id cell is in the data font; AC-2 a code cell is in the data font; AC-3 data stays in it; AC-4 name and text stay in the text font.
   Proof first: before the change an id and a code cell are drawn in DM Sans (the type-roles check lists "DataGrid kind id" and "DataGrid kind code" as breaks).
   Usage: node tests/data-grid-id-code-font-1263.test.js   → DATA_GRID_ID_CODE_FONT_1263_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9822, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) for (const mode of ['light', 'dark']) {
      const T = dir + ' ' + mode + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 800 });
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const got = await page.evaluate(async (dir, mode) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-mode', mode);
        const h = React.createElement, P = Plenix; const c = document.createElement('div'); c.id = 'c'; c.style.inlineSize = '900px'; document.querySelector('main').replaceChildren(c);
        const data = [{ id: 'a', ref: 'CASE-2026-0114', snippet: 'SELECT * FROM cases', n: 5, name: 'Maya Chen', note: 'A short note' }];
        ReactDOM.createRoot(c).render(h(P.DataGrid, { label: 'Cases', data, index: 'id', columns: [
          { title: 'Reference', field: 'ref', kind: 'id' }, { title: 'Snippet', field: 'snippet', kind: 'code' }, { title: 'Count', field: 'n', kind: 'data' },
          { title: 'Name', field: 'name', kind: 'name' }, { title: 'Note', field: 'note' }] }));
        await new Promise((r) => setTimeout(r, 1200));
        const first = (v) => v.split(',')[0].trim().replace(/['"]/g, ''), rs = getComputedStyle(document.documentElement);
        const font = (field) => { const cell = document.querySelector('#c [role=row][data-plx-record] [data-plx-field=' + field + ']'); const v = cell && (cell.querySelector('.plx-data-grid__value') || cell); return v && first(getComputedStyle(v).fontFamily); };
        return { data: first(rs.getPropertyValue('--plx-sys-font-data')), id: font('ref'), code: font('snippet'), dataKind: font('n'), name: font('name'), text: font('note') };
      }, dir, mode);
      assert.equal(got.data, 'Reddit Mono', T + 'the data font is Reddit Mono');
      assert.equal(got.id, got.data, T + 'AC-1: an id cell is in the data font (' + got.id + ')'); assert.equal(got.code, got.data, T + 'AC-2: a code cell is in the data font (' + got.code + ')');
      assert.equal(got.dataKind, got.data, T + 'AC-3: a data cell is in the data font'); assert.notEqual(got.name, got.data, T + 'AC-4: a name cell is in the text font (' + got.name + ')'); assert.notEqual(got.text, got.data, T + 'AC-4: a text cell is in the text font (' + got.text + ')');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_ID_CODE_FONT_1263_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
