// Plenix · tests/data-grid-editor-select-84.test.js: the select cell editor (issue 84, DT-41 phase 2; ADR 0016, design 84-cell-editors §1 and §2).
//   node tests/data-grid-editor-select-84.test.js   → DATA_GRID_EDITOR_SELECT_84_OK
// Written first (proof first): before the change editor: "select" opens a one-line text box. In left to right and right to left, with editing={{ types: ['select'] }} and editorProps.options:
//   Enter opens the Plenix Select inside the cell with its list open, drawn bare (no border of its own, a clear fill) so the cell's outline is the frame;
//   picking an option (arrow keys then Enter) saves it at once; a click on an option saves it; the first Escape closes the list, the second cancels and the cell keeps the focus;
//   with the list closed Enter saves the current choice and Tab saves and moves; without the type turned on Enter opens the one-line editor.
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9836, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (editing) => page.evaluate(async (dir, editing) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en'); window.__edits = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = [{ id: 'r1', name: 'A', state: 'open' }, { id: 'r2', name: 'B', state: 'closed' }];
        const columns = [{ title: 'Name', field: 'name', editor: 'input' }, { title: 'State', field: 'state', editor: 'select', editorProps: { options: [{ value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }, { value: 'held', label: 'On hold' }] } }];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 400 } }, h(Plenix.DataGrid, { label: 'Cases', data, columns, editing, onCellEdit: (r, e) => window.__edits.push(r.id + '.' + e.field + '=' + e.value) })));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, editing);
      const focus = (r) => page.evaluate((r) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="state"]').focus(); }, r);
      const sel = () => page.evaluate(() => { const f = document.querySelector('.plx-data-grid__grid-editing [role=combobox]'); if (!f) return null; const cs = getComputedStyle(f); return { expanded: f.getAttribute('aria-expanded'), listOpen: !!document.querySelector('[role=listbox]'), focused: document.activeElement === f, border: cs.borderTopWidth + '/' + cs.borderLeftWidth + '/' + cs.borderRightWidth, bg: cs.backgroundColor, text: f.textContent }; });
      const oneLine = () => page.evaluate(() => !!document.querySelector('input.plx-data-grid__editor'));
      const at = () => page.evaluate(() => { const a = document.activeElement; return a && a.getAttribute && a.getAttribute('data-plx-field') ? a.closest('[role=row]').getAttribute('data-plx-record').replace(/^string:/, '') + '.' + a.getAttribute('data-plx-field') : (a ? a.tagName : null); });
      const key = async (k) => { await page.keyboard.press(k); await wait(300); };
      const edits = () => page.evaluate(() => window.__edits.slice());
      const ON = { types: ['select'] };

      await check(T + 'Enter opens the Select in the cell with its list open, drawn bare', async () => {
        await mount(ON); await focus(0); await key('Enter'); const s = await sel();
        assert.deepEqual([s.expanded, s.listOpen, s.focused, s.text], ['true', true, true, 'Open']); assert.equal(s.border, '0px/0px/0px'); assert.match(s.bg, /rgba\(0, 0, 0, 0\)|transparent/); assert.equal(await oneLine(), false);
      });
      await check(T + 'arrow keys then Enter pick an option and save at once', async () => {
        await mount(ON); await focus(0); await key('Enter'); await key('ArrowDown'); await key('Enter'); assert.deepEqual(await edits(), ['r1.state=closed']); assert.equal(await sel(), null);
      });
      await check(T + 'a click on an option saves it', async () => {
        await mount(ON); await focus(0); await key('Enter');
        await page.evaluate(() => [...document.querySelectorAll('[role=option]')].find((o) => o.textContent === 'On hold').dispatchEvent(new MouseEvent('click', { bubbles: true }))); await wait(300);
        assert.deepEqual(await edits(), ['r1.state=held']);
      });
      await check(T + 'the first Escape closes the list, the second cancels, and the cell keeps the focus', async () => {
        await mount(ON); await focus(0); await key('Enter'); await key('Escape'); const s = await sel(); assert.deepEqual([s.listOpen, s.expanded], [false, 'false']);
        await key('Escape'); assert.equal(await sel(), null); assert.deepEqual(await edits(), []); assert.equal(await at(), 'r1.state');
      });
      await check(T + 'with the list closed Enter saves the current choice', async () => {
        await mount(ON); await focus(1); await key('Enter'); await key('Escape'); await key('Enter'); assert.deepEqual(await edits(), ['r2.state=closed']); assert.equal(await at(), 'r2.state');
      });
      await check(T + 'Tab saves and moves to the next editable cell', async () => {
        await mount(ON); await focus(0); await key('Enter'); await key('Escape'); await key('Tab'); assert.deepEqual(await edits(), ['r1.state=open']); assert.equal(await at(), 'r2.name');
      });
      await check(T + 'with the type not turned on Enter opens the one-line editor', async () => {
        await mount(undefined); await focus(0); await key('Enter'); assert.equal(await oneLine(), true); assert.equal(await sel(), null);
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'DATA_GRID_EDITOR_SELECT_84_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
