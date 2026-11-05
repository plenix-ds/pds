// Plenix · tests/data-grid-validate-84.test.js: a wrong value keeps the cell open with its message (issue 84, DT-41 phase 1; ADR 0016, design 84-cell-editors §3 and §5).
//   node tests/data-grid-validate-84.test.js   → DATA_GRID_VALIDATE_84_OK
// Written first (proof first): before the change a column's validate is ignored and the wrong value is saved. In left to right and right to left:
//   Enter with a value validate refuses keeps the editor open, marks it aria-invalid, shows the message under the cell (linked by aria-describedby) and does not call onCellEdit;
//   an async validate does the same; a good value then saves and the message goes; Escape cancels with no save and no message; a column without validate saves as before.
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9824, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = () => page.evaluate(async (dir) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en'); window.__edits = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = Array.from({ length: 3 }, (_, i) => ({ id: 'r' + (i + 1), name: 'Person ' + (i + 1), role: 'Role ' + (i + 1), plain: 'Plain ' + (i + 1) }));
        const columns = [
          { title: 'Name', field: 'name', editor: 'input', validate: (v) => (String(v).length < 3 ? 'At least 3 characters' : null) },
          { title: 'Role', field: 'role', editor: 'input', validate: (v) => new Promise((r) => setTimeout(() => r(String(v).startsWith('X') ? 'Not an X role' : null), 50)) },
          { title: 'Plain', field: 'plain', editor: 'input' }];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 400 } }, h(Plenix.DataGrid, { label: 'People', data, columns, onCellEdit: (r, e) => window.__edits.push(r.id + '.' + e.field + '=' + e.value) })));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir);
      const focus = (r, f) => page.evaluate((r, f) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="' + f + '"]').focus(); }, r, f);
      const state = () => page.evaluate(() => {
        const e = document.querySelector('.plx-data-grid__editor'); if (!e) return { open: false, msg: !!document.querySelector('.plx-data-grid__editor-message') };
        const m = document.querySelector('.plx-data-grid__editor-message'), cell = e.closest('[role=gridcell]'), cr = cell.getBoundingClientRect(), mr = m && m.getBoundingClientRect();
        let visible = false; if (m) { const hit = document.elementFromPoint(mr.left + mr.width / 2, mr.top + mr.height / 2); visible = !!hit && (hit === m || m.contains(hit)); }
        return { open: true, invalid: e.getAttribute('aria-invalid'), msg: m ? m.textContent : null, linked: !!m && e.getAttribute('aria-describedby') === m.id, below: !!m && mr.top >= cr.bottom - 1, visible, value: e.value };
      });
      const key = async (k) => { await page.keyboard.press(k); await wait(250); };
      const edits = () => page.evaluate(() => window.__edits.slice());
      const open = async (r, f, text) => { await focus(r, f); await key('F2'); await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type(text); };

      await check(T + 'a wrong value keeps the cell open with its message under it', async () => {
        await mount(); await open(0, 'name', 'ab'); await key('Enter');
        const s = await state(); assert.deepEqual([s.open, s.invalid, s.msg, s.linked, s.below, s.visible], [true, 'true', 'At least 3 characters', true, true, true]);
        assert.deepEqual(await edits(), [], 'nothing saved');
      });
      await check(T + 'a good value then saves and the message goes', async () => {
        await mount(); await open(0, 'name', 'ab'); await key('Enter'); await page.keyboard.type('c'); await key('Enter');
        const s = await state(); assert.deepEqual([s.open, s.msg], [false, false]); assert.deepEqual(await edits(), ['r1.name=abc']);
      });
      await check(T + 'an async validate refuses the same way', async () => {
        await mount(); await open(1, 'role', 'Xray'); await key('Enter'); await wait(150);
        const s = await state(); assert.deepEqual([s.open, s.invalid, s.msg], [true, 'true', 'Not an X role']); assert.deepEqual(await edits(), []);
      });
      await check(T + 'Escape cancels with no save and no message', async () => {
        await mount(); await open(0, 'name', 'ab'); await key('Enter'); await key('Escape');
        const s = await state(); assert.deepEqual([s.open, s.msg], [false, false]); assert.deepEqual(await edits(), []);
      });
      await check(T + 'a column without validate saves as before', async () => {
        await mount(); await open(0, 'plain', 'p'); await key('Enter'); assert.deepEqual(await edits(), ['r1.plain=p']);
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'DATA_GRID_VALIDATE_84_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
