// Plenix · tests/data-grid-editing-options-84.test.js: the editing options enterEdits, typeToReplace and rangeSelect (issue 84, F4; ADR 0016).
//   node tests/data-grid-editing-options-84.test.js   → DATA_GRID_EDITING_OPTIONS_84_OK
// Written first (proof first): before the change the three options do nothing. In left to right and right to left:
//   without editing options Enter edits, a typed letter starts an edit with that letter in place of the value (today's behavior) and Shift+Arrow selects nothing;
//   editing={{ enterEdits: false }}: Enter does not edit (F2 and a double click still do); editing={{ typeToReplace: false }}: a typed letter does not edit (Enter and F2 still do);
//   editing={{ rangeSelect: true }}: Shift+Arrow selects a block of cells, as the cellSelection option does; the TableSettings' editing options reach every table under it and the table's own win.
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9876, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (editing, settings) => page.evaluate(async (dir, editing, settings) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = Array.from({ length: 4 }, (_, i) => ({ id: 'r' + (i + 1), name: 'Person ' + (i + 1), age: 30 + i }));
        const columns = [{ title: 'Name', field: 'name', editor: 'input' }, { title: 'Age', field: 'age', editor: 'number' }];
        const grid = h(Plenix.DataGrid, { label: 'People', data, columns, editing, onCellEdit: () => {} });
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 400 } }, settings ? h(Plenix.TableSettings, settings, grid) : grid));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, editing, settings);
      const focus = (r, f = 'name') => page.evaluate((r, f) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="' + f + '"]').focus(); }, r, f);
      const editor = () => page.evaluate(() => { const e = document.querySelector('.plx-data-grid__editor'); return e ? e.value : null; });
      const selected = () => page.evaluate(() => document.querySelectorAll('[role=gridcell][aria-selected=true]').length);
      const key = async (k, mods = []) => { for (const m of mods) await page.keyboard.down(m); await page.keyboard.press(k); for (const m of mods) await page.keyboard.up(m); await wait(300); };

      await check(T + 'by default Enter edits, a letter replaces the value, and Shift+Arrow selects nothing', async () => {
        await mount(undefined); await focus(0); await key('Enter'); assert.equal(await editor(), 'Person 1'); await key('Escape');
        await focus(1); await key('x'); assert.equal(await editor(), 'x'); await key('Escape');
        await focus(0); await key('ArrowDown', ['Shift']); assert.equal(await selected(), 0);
      });
      await check(T + 'enterEdits false: Enter does not edit, F2 does', async () => {
        await mount({ enterEdits: false }); await focus(0); await key('Enter'); assert.equal(await editor(), null); await key('F2'); assert.equal(await editor(), 'Person 1');
      });
      await check(T + 'typeToReplace false: a letter does not edit, Enter and F2 do', async () => {
        await mount({ typeToReplace: false }); await focus(0); await key('x'); assert.equal(await editor(), null); await key('Enter'); assert.equal(await editor(), 'Person 1');
      });
      await check(T + 'rangeSelect true: Shift+Arrow selects a block', async () => {
        await mount({ rangeSelect: true }); await focus(0); await key('ArrowDown', ['Shift']); await key('ArrowDown', ['Shift']); assert.equal(await selected(), 3);
      });
      await check(T + 'TableSettings editing options reach the table, and the table wins', async () => {
        await mount(undefined, { editing: { enterEdits: false } }); await focus(0); await key('Enter'); assert.equal(await editor(), null, 'from TableSettings');
        await mount({ enterEdits: true }, { editing: { enterEdits: false } }); await focus(0); await key('Enter'); assert.equal(await editor(), 'Person 1', 'the table wins');
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'DATA_GRID_EDITING_OPTIONS_84_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
