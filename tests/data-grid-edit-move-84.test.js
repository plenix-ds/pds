// Plenix · tests/data-grid-edit-move-84.test.js: Enter, Tab, Shift+Tab and Escape while editing (issue 84, DT-41 phase 1; ADR 0016, design 84-cell-editors §2).
//   node tests/data-grid-edit-move-84.test.js   → DATA_GRID_EDIT_MOVE_84_OK
// Written first (proof first): before the change Tab leaves the grid, and Enter and Escape drop the focus. In left to right and right to left, with columns Name (input), Age (number), Role (no editor), Note (input; locked on row 2):
//   Enter saves and the same cell keeps the focus; Escape cancels and the same cell keeps the focus;
//   Tab saves and moves the focus to the next editable cell in reading order (skipping a column with no editor, wrapping to the next row), Shift+Tab to the previous one;
//   a wrong value (validate) stays open on Tab; at the last editable cell Tab saves and leaves the focus on it.
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9828, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = () => page.evaluate(async (dir) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en'); window.__edits = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = Array.from({ length: 3 }, (_, i) => ({ id: 'r' + (i + 1), name: 'N' + (i + 1), age: 30 + i, role: 'R' + (i + 1), note: 'T' + (i + 1) }));
        const columns = [{ title: 'Name', field: 'name', editor: 'input', validate: (v) => (v === 'bad' ? 'No' : null) }, { title: 'Age', field: 'age', editor: 'number' }, { title: 'Role', field: 'role' }, { title: 'Note', field: 'note', editor: 'input', editable: (cell) => cell.getData().id !== 'r2' }];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 400 } }, h(Plenix.DataGrid, { label: 'People', data, columns, onCellEdit: (r, e) => window.__edits.push(r.id + '.' + e.field + '=' + e.value) })));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir);
      const focus = (r, f) => page.evaluate((r, f) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="' + f + '"]').focus(); }, r, f);
      const at = () => page.evaluate(() => { const a = document.activeElement; const row = a && a.closest && a.closest('[role=row][data-plx-record]'); return a && a.getAttribute && a.getAttribute('data-plx-field') ? row.getAttribute('data-plx-record').replace(/^string:/, '') + '.' + a.getAttribute('data-plx-field') : (a ? a.tagName : null); });
      const key = async (k, mods = []) => { for (const m of mods) await page.keyboard.down(m); await page.keyboard.press(k); for (const m of mods) await page.keyboard.up(m); await wait(300); };
      const edits = () => page.evaluate(() => window.__edits.slice());
      const edit = async (r, f, text) => { await focus(r, f); await key('F2'); await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type(text); };

      await check(T + 'Enter saves and the same cell keeps the focus', async () => {
        await mount(); await edit(0, 'name', 'Ann'); await key('Enter'); assert.deepEqual(await edits(), ['r1.name=Ann']); assert.equal(await at(), 'r1.name');
      });
      await check(T + 'Escape cancels and the same cell keeps the focus', async () => {
        await mount(); await edit(0, 'name', 'Ann'); await key('Escape'); assert.deepEqual(await edits(), []); assert.equal(await at(), 'r1.name');
      });
      await check(T + 'Tab saves and moves to the next editable cell, skipping a column with no editor', async () => {
        await mount(); await edit(0, 'age', '41'); await key('Tab'); assert.deepEqual(await edits(), ['r1.age=41']); assert.equal(await at(), 'r1.note');
      });
      await check(T + 'Tab wraps to the next row and skips a cell that is not editable', async () => {
        await mount(); await edit(0, 'note', 'x'); await key('Tab'); assert.equal(await at(), 'r2.name');
        await focus(1, 'age'); await key('F2'); await key('Tab'); assert.equal(await at(), 'r3.name', 'r2.note is locked');
      });
      await check(T + 'Shift+Tab saves and moves to the previous editable cell', async () => {
        await mount(); await edit(1, 'name', 'Bo'); await key('Tab', ['Shift']); assert.deepEqual(await edits(), ['r2.name=Bo']); assert.equal(await at(), 'r1.note');
      });
      await check(T + 'a wrong value stays open on Tab', async () => {
        await mount(); await edit(0, 'name', 'bad'); await key('Tab'); assert.deepEqual(await edits(), []);
        assert.equal(await page.evaluate(() => !!document.querySelector('.plx-data-grid__editor')), true);
      });
      await check(T + 'at the last editable cell Tab saves and keeps the focus there', async () => {
        await mount(); await edit(2, 'note', 'z'); await key('Tab'); assert.deepEqual(await edits(), ['r3.note=z']); assert.equal(await at(), 'r3.note');
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'DATA_GRID_EDIT_MOVE_84_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
