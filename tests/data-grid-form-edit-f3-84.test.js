// Plenix · tests/data-grid-form-edit-f3-84.test.js: Form Edit with the application's own form and its own panel (issue 84, F3; ADR 0016 addendum D-0063, design form-edit.md §2).
//   node tests/data-grid-form-edit-f3-84.test.js   → DATA_GRID_FORM_EDIT_F3_84_OK
// Written first (proof first): before the change renderForm and a panel are ignored. In left to right and right to left, with editMode="form":
//   renderForm(record, { value, setValue, errors, busy }) fills the drawer's body (the header "Edit <name>" and the Save / Cancel footer stay the grid's); its fields start from the record's values,
//   setValue changes them, Save sends only the changed fields to onRecordEdit, and a column's validate message reaches it as errors[field];
//   formSurface={{ panel: ref }} draws the whole form (title, fields, footer) inside the application's panel, no dialog, and sets data-plx-form-open on that element while the form is open
//   (removed after Save or Cancel); a ref with no element falls back to the drawer.
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9882, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 700 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (kind) => page.evaluate(async (dir, kind) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en'); window.__saved = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = [{ id: 'r1', name: 'Person 1', age: 30 }];
        const columns = [{ title: 'Name', field: 'name', kind: 'name', editor: 'input' }, { title: 'Age', field: 'age', editor: 'number', validate: (v) => (v < 0 ? 'Age cannot be negative' : null) }];
        const panel = React.createRef(), empty = React.createRef();
        const extra = kind === 'render' ? { renderForm: (record, form) => h('div', { id: 'own-form' }, h('span', { id: 'own-name' }, record.name), h('input', { id: 'own-input', 'aria-label': 'My name', value: form.value.name ?? '', onChange: (e) => form.setValue({ ...form.value, name: e.target.value }) }), h('input', { id: 'own-age', 'aria-label': 'My age', value: form.value.age ?? '', onChange: (e) => form.setValue({ ...form.value, age: e.target.value }) }), h('span', { id: 'own-errors' }, JSON.stringify(form.errors || {}))) }
          : kind === 'panel' ? { formSurface: { panel } } : kind === 'nopanel' ? { formSurface: { panel: empty } } : {};
        const grid = h(Plenix.DataGrid, Object.assign({ label: 'People', data, columns, viewMenu: true, editModes: ['inline', 'form'], editMode: 'form',
          onRecordEdit: (r, changes) => { window.__saved.push(r.id + ':' + JSON.stringify(changes)); return Promise.resolve(); } }, extra));
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.ToastProvider, null, h('div', { style: { display: 'flex', gap: 16 } }, h('div', { style: { height: 400, flex: 1 } }, grid), h('div', { id: 'panel', ref: panel, style: { inlineSize: 320 } }, h('span', { id: 'details' }, 'Details of the open row')))));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, kind);
      const open = async () => { await page.evaluate(() => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][0]; row.querySelector('[data-plx-field="name"]').focus(); }); await page.keyboard.press('F2'); await wait(700); };
      const click = async (label) => { await page.evaluate((label) => { const root = document.querySelector('#panel [data-plx-form-open], #panel') && document.querySelector('[role=dialog]') ? document.querySelector('[role=dialog]') : document.getElementById('panel'); [...root.querySelectorAll('button')].find((b) => b.textContent.trim() === label).click(); }, label); await wait(700); };
      const saved = () => page.evaluate(() => window.__saved.slice());
      const dialog = () => page.evaluate(() => !!document.querySelector('[role=dialog]'));
      const panelState = () => page.evaluate(() => { const p = document.getElementById('panel'); return { open: p.hasAttribute('data-plx-form-open'), text: p.textContent.replace(/\s+/g, ' ').trim(), buttons: [...p.querySelectorAll('button')].map((b) => b.textContent.trim()).filter(Boolean) }; });

      await check(T + 'renderForm fills the body, the header and footer stay the grid\'s, Save sends the changed fields', async () => {
        await mount('render'); await open(); const d = await page.evaluate(() => { const x = document.querySelector('[role=dialog]'); return x ? { text: x.textContent.replace(/\s+/g, ' '), own: !!x.querySelector('#own-form'), plain: !!x.querySelector('.plx-field') } : null; });
        assert.ok(d && d.own, 'the application form is in the drawer'); assert.match(d.text, /Edit Person 1/); assert.equal(d.plain, false, 'the grid draws no fields of its own');
        await page.evaluate(() => { const i = document.getElementById('own-input'); i.focus(); i.select(); }); await page.keyboard.type('Renamed'); await wait(200); await click('Save changes');
        assert.deepEqual(await saved(), ['r1:{"name":"Renamed"}']); assert.equal(await dialog(), false);
      });
      await check(T + 'a column validate message reaches renderForm as errors after Save', async () => {
        await mount('render'); await open(); await page.evaluate(() => { const i = document.getElementById('own-age'); i.focus(); i.select(); }); await page.keyboard.type('-4'); await wait(200); await click('Save changes');
        assert.deepEqual(await saved(), []); assert.match(await page.evaluate(() => document.getElementById('own-errors').textContent), /Age cannot be negative/);
      });
      await check(T + 'formSurface panel draws the whole form in the application\'s panel and marks it while open', async () => {
        await mount('panel'); await open(); const s = await panelState(); assert.equal(s.open, true, 'data-plx-form-open is set'); assert.match(s.text, /Edit Person 1/); assert.ok(s.buttons.includes('Save changes') && s.buttons.includes('Cancel'));
        assert.equal(await dialog(), false, 'no drawer');
      });
      await check(T + 'in the panel, Cancel removes the mark and Save saves', async () => {
        await mount('panel'); await open(); await click('Cancel'); assert.equal((await panelState()).open, false); assert.deepEqual(await saved(), []);
        await open(); await page.evaluate(() => { const i = document.getElementById('panel').querySelector('input'); i.focus(); i.select(); }); await page.keyboard.type('In panel'); await wait(200); await click('Save changes');
        assert.deepEqual(await saved(), ['r1:{"name":"In panel"}']); assert.equal((await panelState()).open, false);
      });
      await check(T + 'a panel ref with no element falls back to the drawer', async () => {
        await mount('nopanel'); await open(); assert.equal(await dialog(), true);
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'DATA_GRID_FORM_EDIT_F3_84_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
