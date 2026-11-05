// Plenix · tests/data-grid-editor-checkbox-84.test.js: the checkbox cell editor (issue 84, DT-41 phase 2; ADR 0016, design 84-cell-editors §2).
//   node tests/data-grid-editor-checkbox-84.test.js   → DATA_GRID_EDITOR_CHECKBOX_84_OK
// Written first (proof first): before the change editor: "checkbox" opens a text box. In left to right and right to left, with editing={{ types: ['checkbox'] }}:
//   the cell shows a checkbox with the column's name that is checked when the value is true; Space on the cell toggles it and saves at once (no editor opens), as does a click on the box;
//   Enter and F2 open no editor; a cell editable() refuses shows a disabled box that does not change; a promise from onCellEdit shows the busy cell (the shared rules);
//   without the type turned on nothing changes (Enter opens the text editor).
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9830, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (editing, async) => page.evaluate(async (dir, editing, async) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en'); window.__edits = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = [{ id: 'r1', name: 'A', active: true }, { id: 'r2', name: 'B', active: false }, { id: 'r3', name: 'C', active: false }];
        const columns = [{ title: 'Name', field: 'name' }, { title: 'Active', field: 'active', editor: 'checkbox', editable: (cell) => cell.getData().id !== 'r3' }];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 400 } }, h(Plenix.DataGrid, { label: 'People', data, columns, editing, onCellEdit: (r, e) => { window.__edits.push(r.id + '.' + e.field + '=' + e.value); if (async) return new Promise(() => {}); return undefined; } })));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, editing, async);
      const cellEl = (r) => `[role=row][data-plx-record]:nth-of-type(${r + 1}) [data-plx-field="active"]`;
      const focus = (r) => page.evaluate((r) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="active"]').focus(); }, r);
      const box = (r) => page.evaluate((r) => { const c = [...document.querySelectorAll('[role=row][data-plx-record]')][r].querySelector('[data-plx-field="active"]'); const b = c.querySelector('input[type=checkbox]'); return b ? { checked: b.checked, disabled: b.disabled, label: b.getAttribute('aria-label') } : null; }, r);
      const editorOpen = () => page.evaluate(() => !!document.querySelector('.plx-data-grid__editor'));
      const key = async (k) => { await page.keyboard.press(k); await wait(250); };
      const edits = () => page.evaluate(() => window.__edits.slice());
      const ON = { types: ['checkbox'] };

      await check(T + 'the cell shows a named checkbox, checked for true', async () => {
        await mount(ON); assert.deepEqual(await box(0), { checked: true, disabled: false, label: 'Active' }); assert.equal((await box(1)).checked, false);
      });
      await check(T + 'Space toggles and saves at once, with no editor', async () => {
        await mount(ON); await focus(1); await key(' '); assert.deepEqual(await edits(), ['r2.active=true']); assert.equal(await editorOpen(), false); assert.equal((await box(1)).checked, true);
        await focus(0); await key(' '); assert.deepEqual(await edits(), ['r2.active=true', 'r1.active=false']);
      });
      await check(T + 'a click on the box toggles and saves', async () => {
        await mount(ON); await page.evaluate(() => [...document.querySelectorAll('[role=row][data-plx-record]')][1].querySelector('[data-plx-field="active"] input').click()); await wait(250);
        assert.deepEqual(await edits(), ['r2.active=true']);
      });
      await check(T + 'Enter and F2 open no editor', async () => {
        await mount(ON); await focus(1); await key('Enter'); assert.equal(await editorOpen(), false); await key('F2'); assert.equal(await editorOpen(), false); assert.deepEqual(await edits(), []);
      });
      await check(T + 'a cell editable() refuses is disabled and does not change', async () => {
        await mount(ON); assert.equal((await box(2)).disabled, true); await focus(2); await key(' '); assert.deepEqual(await edits(), []);
      });
      await check(T + 'a promise from onCellEdit makes the cell busy', async () => {
        await mount(ON, true); await focus(1); await key(' ');
        assert.equal(await page.evaluate(() => [...document.querySelectorAll('[role=row][data-plx-record]')][1].querySelector('[data-plx-field="active"]').getAttribute('aria-busy')), 'true');
      });
      await check(T + 'with the type not turned on nothing changes: Enter opens the text editor', async () => {
        await mount(undefined); assert.equal(await box(0), null); await focus(1); await key('Enter'); assert.equal(await editorOpen(), true);
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'DATA_GRID_EDITOR_CHECKBOX_84_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
