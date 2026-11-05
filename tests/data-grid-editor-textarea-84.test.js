// Plenix · tests/data-grid-editor-textarea-84.test.js: the textarea cell editor (issue 84, DT-41 phase 2; ADR 0016, design 84-cell-editors §2).
//   node tests/data-grid-editor-textarea-84.test.js   → DATA_GRID_EDITOR_TEXTAREA_84_OK
// Written first (proof first): before the change editor: "textarea" opens a one-line text box. In left to right and right to left, with editing={{ types: ['textarea'] }}:
//   Enter opens a text area in a box over the cell, holding the whole value, with the focus in it; Enter inside it adds a line and saves nothing; Ctrl+Enter saves the lines;
//   Escape cancels and the cell keeps the focus; a click outside saves; Tab saves and moves; a value validate refuses keeps it open with the message;
//   without the type turned on Enter opens the one-line editor as before.
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9834, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (editing) => page.evaluate(async (dir, editing) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en'); window.__edits = [];
        document.querySelector('main').innerHTML = '<div id="c"></div><button id="away">away</button>'; const h = React.createElement;
        const data = [{ id: 'r1', name: 'A', note: 'one\ntwo' }, { id: 'r2', name: 'B', note: 'three' }];
        const columns = [{ title: 'Name', field: 'name', editor: 'input' }, { title: 'Note', field: 'note', editor: 'textarea', validate: (v) => (v === 'bad' ? 'Not allowed' : null) }];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 400 } }, h(Plenix.DataGrid, { label: 'People', data, columns, editing, onCellEdit: (r, e) => window.__edits.push(r.id + '.' + e.field + '=' + JSON.stringify(e.value)) })));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, editing);
      const focus = (r) => page.evaluate((r) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="note"]').focus(); }, r);
      const area = () => page.evaluate(() => { const t = document.querySelector('textarea.plx-data-grid__editor'); return t ? { value: t.value, focused: document.activeElement === t } : null; });
      const oneLine = () => page.evaluate(() => !!document.querySelector('input.plx-data-grid__editor'));
      const at = () => page.evaluate(() => { const a = document.activeElement; return a && a.getAttribute && a.getAttribute('data-plx-field') ? a.closest('[role=row]').getAttribute('data-plx-record').replace(/^string:/, '') + '.' + a.getAttribute('data-plx-field') : (a ? a.tagName : null); });
      const key = async (k, mods = []) => { for (const m of mods) await page.keyboard.down(m); await page.keyboard.press(k); for (const m of mods) await page.keyboard.up(m); await wait(300); };
      const edits = () => page.evaluate(() => window.__edits.slice());
      const ON = { types: ['textarea'] };

      await check(T + 'Enter opens a text area holding the whole value, focused', async () => {
        await mount(ON); await focus(0); await key('Enter'); assert.deepEqual(await area(), { value: 'one\ntwo', focused: true }); assert.equal(await oneLine(), false);
      });
      await check(T + 'Enter inside adds a line; Ctrl+Enter saves the lines', async () => {
        await mount(ON); await focus(0); await key('Enter'); await page.keyboard.press('End'); await key('Enter'); await page.keyboard.type('!'); assert.deepEqual(await edits(), []); assert.equal((await area()).value, 'one\ntwo\n!');
        await key('Enter', ['Control']); assert.deepEqual(await edits(), ['r1.note="one\\ntwo\\n!"']); assert.equal(await area(), null); assert.equal(await at(), 'r1.note');
      });
      await check(T + 'Escape cancels and the cell keeps the focus', async () => {
        await mount(ON); await focus(0); await key('Enter'); await page.keyboard.type('x'); await key('Escape'); assert.deepEqual(await edits(), []); assert.equal(await area(), null); assert.equal(await at(), 'r1.note');
      });
      await check(T + 'a click outside saves', async () => {
        await mount(ON); await focus(1); await key('Enter'); await page.keyboard.type('x'); await page.click('#away'); await wait(300); assert.deepEqual(await edits(), ['r2.note="threex"']);
      });
      await check(T + 'a value validate refuses keeps the area open with the message', async () => {
        await mount(ON); await focus(1); await key('Enter'); await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type('bad'); await key('Enter', ['Control']);
        assert.deepEqual(await edits(), []); assert.notEqual(await area(), null); assert.equal(await page.evaluate(() => (document.querySelector('.plx-data-grid__editor-message') || {}).textContent), 'Not allowed');
      });
      await check(T + 'with the type not turned on Enter opens the one-line editor', async () => {
        await mount(undefined); await focus(0); await key('Enter'); assert.equal(await oneLine(), true); assert.equal(await area(), null);
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'DATA_GRID_EDITOR_TEXTAREA_84_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
