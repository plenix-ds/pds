// Plenix · tests/data-grid-editor-date-84.test.js: the date cell editor (issue 84, DT-41 phase 2; ADR 0016, design 84-cell-editors §1, §2 and §4).
//   node tests/data-grid-editor-date-84.test.js   → DATA_GRID_EDITOR_DATE_84_OK
// Written first (proof first): before the change editor: "date" opens a one-line text box. In left to right and right to left, with editing={{ types: ['date'] }}:
//   Enter opens Plenix's DatePicker field in the cell, drawn bare, focused, with the value in the locale's form; typing a date then Enter saves the calendar day ("YYYY-MM-DD");
//   a day chosen in the calendar saves it at once; Escape cancels and the cell keeps the focus; Tab saves what was typed and moves; emptying the field saves null;
//   without the type turned on Enter opens the one-line editor.
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9838, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 700 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (editing) => page.evaluate(async (dir, editing) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en'); window.__edits = [];
        document.querySelector('main').innerHTML = '<div id="c"></div><button id="away">away</button>'; const h = React.createElement;
        const data = [{ id: 'r1', name: 'A', due: '2026-03-08' }, { id: 'r2', name: 'B', due: '2026-04-01' }];
        const columns = [{ title: 'Name', field: 'name', editor: 'input' }, { title: 'Due', field: 'due', editor: 'date' }];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 500 } }, h(Plenix.DataGrid, { label: 'Cases', data, columns, editing, onCellEdit: (r, e) => window.__edits.push(r.id + '.' + e.field + '=' + e.value) })));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, editing);
      const focus = (r) => page.evaluate((r) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="due"]').focus(); }, r);
      const field = () => page.evaluate(() => { const i = document.querySelector('.plx-data-grid__grid-editing .plx-date-picker__input'); if (!i) return null; const box = i.closest('.plx-date-picker__date'), cs = getComputedStyle(box); return { value: i.value, focused: document.activeElement === i, border: cs.borderTopWidth + '/' + cs.borderLeftWidth, bg: cs.backgroundColor }; });
      const oneLine = () => page.evaluate(() => !!document.querySelector('input.plx-data-grid__editor'));
      const at = () => page.evaluate(() => { const a = document.activeElement; return a && a.getAttribute && a.getAttribute('data-plx-field') ? a.closest('[role=row]').getAttribute('data-plx-record').replace(/^string:/, '') + '.' + a.getAttribute('data-plx-field') : (a ? a.tagName : null); });
      const key = async (k) => { await page.keyboard.press(k); await wait(300); };
      const edits = () => page.evaluate(() => window.__edits.slice());
      const typeDate = async (text) => { await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type(text); };
      const ON = { types: ['date'] };

      await check(T + 'Enter opens the DatePicker field in the cell, bare and focused, in the locale form', async () => {
        await mount(ON); await focus(0); await key('Enter'); const f = await field();
        assert.deepEqual([f.value, f.focused, f.border], ['03/08/2026', true, '0px/0px']); assert.match(f.bg, /rgba\(0, 0, 0, 0\)|transparent/); assert.equal(await oneLine(), false);
      });
      await check(T + 'a typed date then Enter saves the calendar day', async () => {
        await mount(ON); await focus(0); await key('Enter'); await typeDate('03/09/2026'); await key('Enter'); assert.deepEqual(await edits(), ['r1.due=2026-03-09']); assert.equal(await field(), null);
      });
      await check(T + 'a day chosen in the calendar saves it at once', async () => {
        await mount(ON); await focus(0); await key('Enter');
        await page.evaluate(() => document.querySelector('.plx-data-grid__grid-editing .plx-date-picker__button').click()); await wait(500);
        await page.evaluate(() => { const d = [...document.querySelectorAll('.plx-calendar__day')].find((e) => /^15$/.test(e.textContent.trim())); d.click(); }); await wait(400);
        assert.deepEqual(await edits(), ['r1.due=2026-03-15']);
      });
      await check(T + 'Escape cancels and the cell keeps the focus', async () => {
        await mount(ON); await focus(0); await key('Enter'); await typeDate('03/09/2026'); await key('Escape'); assert.deepEqual(await edits(), []); assert.equal(await field(), null); assert.equal(await at(), 'r1.due');
      });
      await check(T + 'Tab saves what was typed and moves', async () => {
        await mount(ON); await focus(0); await key('Enter'); await typeDate('03/10/2026'); await key('Tab'); assert.deepEqual(await edits(), ['r1.due=2026-03-10']); assert.equal(await at(), 'r2.name');
      });
      await check(T + 'a click elsewhere saves what was typed', async () => {
        await mount(ON); await focus(0); await key('Enter'); await typeDate('03/11/2026'); await page.click('#away'); await wait(400); assert.deepEqual(await edits(), ['r1.due=2026-03-11']); assert.equal(await field(), null);
      });
      await check(T + 'emptying the field saves null', async () => {
        await mount(ON); await focus(0); await key('Enter'); await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await key('Delete'); await key('Enter'); assert.deepEqual(await edits(), ['r1.due=null']);
      });
      await check(T + 'with the type not turned on Enter opens the one-line editor', async () => {
        await mount(undefined); await focus(0); await key('Enter'); assert.equal(await oneLine(), true); assert.equal(await field(), null);
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'DATA_GRID_EDITOR_DATE_84_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
