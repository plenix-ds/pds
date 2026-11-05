// Plenix · tests/data-grid-editor-component-84.test.js: an application's own cell editor (issue 84, DT-41 phase 2; ADR 0016: editor: { component, props }, CellEditorProps).
//   node tests/data-grid-editor-component-84.test.js   → DATA_GRID_EDITOR_COMPONENT_84_OK
// Written first (proof first): before the change an object in `editor` opens the one-line text box. In left to right and right to left, with no editing.types (an application's own component always works):
//   Enter opens the component inside the cell with { value, record, field, dir, autoFocus: true, invalid }; its onCommit(value) saves that value; onCommit() saves the last onChange draft;
//   Tab saves the draft and moves; Escape (not handled by the component) cancels and the cell keeps the focus; a click elsewhere saves the draft; a value validate refuses reaches it as `invalid`.
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9848, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = () => page.evaluate(async (dir) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en'); window.__edits = []; window.__props = null;
        document.querySelector('main').innerHTML = '<div id="c"></div><button id="away">away</button>'; const h = React.createElement;
        // the application's editor: two buttons and a keyboard; "pick" commits at once, "draft" only reports a draft
        const Pick = (p) => { window.__props = { value: p.value, field: p.field, dir: p.dir, autoFocus: p.autoFocus, invalid: p.invalid, recordId: p.record && p.record.id, extra: p.extra };
          return h('span', { 'data-app-editor': '1', tabIndex: 0, ref: (el) => { if (el && p.autoFocus && document.activeElement !== el) el.focus(); } },
            h('button', { type: 'button', id: 'pickB', onClick: () => p.onCommit('B') }, 'B'),
            h('button', { type: 'button', id: 'draftC', onClick: () => p.onChange('C') }, 'C'),
            h('button', { type: 'button', id: 'pickZ', onClick: () => p.onCommit('Z') }, 'Z'),
            h('button', { type: 'button', id: 'commitNone', onClick: () => p.onCommit() }, 'commit')); };
        const data = [{ id: 'r1', name: 'A', pick: 'A' }, { id: 'r2', name: 'B', pick: 'A' }];
        const columns = [{ title: 'Name', field: 'name', editor: 'input' }, { title: 'Pick', field: 'pick', editor: { component: Pick, props: { extra: 'x' } }, validate: (v) => (v === 'Z' ? 'Not Z' : null) }];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 400 } }, h(Plenix.DataGrid, { label: 'P', data, columns, onCellEdit: (r, e) => window.__edits.push(r.id + '.' + e.field + '=' + e.value) })));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir);
      const focus = (r) => page.evaluate((r) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="pick"]').focus(); }, r);
      const open = () => page.evaluate(() => !!document.querySelector('.plx-data-grid__grid-editing [data-app-editor]'));
      const oneLine = () => page.evaluate(() => !!document.querySelector('input.plx-data-grid__editor'));
      const props = () => page.evaluate(() => window.__props);
      const at = () => page.evaluate(() => { const a = document.activeElement; return a && a.getAttribute && a.getAttribute('data-plx-field') ? a.closest('[role=row]').getAttribute('data-plx-record').replace(/^string:/, '') + '.' + a.getAttribute('data-plx-field') : (a ? a.tagName : null); });
      const key = async (k) => { await page.keyboard.press(k); await wait(300); };
      const click = async (id) => { await page.evaluate((id) => document.getElementById(id).click(), id); await wait(300); };
      const edits = () => page.evaluate(() => window.__edits.slice());

      await check(T + 'Enter opens the application component with the editor props', async () => {
        await mount(); await focus(0); await key('Enter'); assert.equal(await open(), true); assert.equal(await oneLine(), false);
        assert.deepEqual(await props(), { value: 'A', field: 'pick', dir, autoFocus: true, recordId: 'r1', extra: 'x' });
      });
      await check(T + 'onCommit(value) saves that value', async () => {
        await mount(); await focus(0); await key('Enter'); await click('pickB'); assert.deepEqual(await edits(), ['r1.pick=B']); assert.equal(await open(), false);
      });
      await check(T + 'onCommit() saves the last onChange draft', async () => {
        await mount(); await focus(0); await key('Enter'); await click('draftC'); assert.deepEqual(await edits(), []); await click('commitNone'); assert.deepEqual(await edits(), ['r1.pick=C']);
      });
      await check(T + 'Tab saves the draft and moves', async () => {
        await mount(); await focus(0); await key('Enter'); await click('draftC'); await page.evaluate(() => document.querySelector('[data-app-editor]').focus()); await key('Tab'); assert.deepEqual(await edits(), ['r1.pick=C']); assert.equal(await at(), 'r2.name');
      });
      await check(T + 'Escape cancels and the cell keeps the focus', async () => {
        await mount(); await focus(0); await key('Enter'); await click('draftC'); await page.evaluate(() => document.querySelector('[data-app-editor]').focus()); await key('Escape'); assert.deepEqual(await edits(), []); assert.equal(await open(), false); assert.equal(await at(), 'r1.pick');
      });
      await check(T + 'a click elsewhere saves the draft', async () => {
        await mount(); await focus(0); await key('Enter'); await click('draftC'); await page.click('#away'); await wait(300); assert.deepEqual(await edits(), ['r1.pick=C']);
      });
      await check(T + 'a value validate refuses reaches the component as invalid and keeps it open', async () => {
        await mount(); await focus(0); await key('Enter'); await click('pickZ'); assert.deepEqual(await edits(), []); assert.equal(await open(), true); assert.equal((await props()).invalid, 'Not Z');
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'DATA_GRID_EDITOR_COMPONENT_84_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
