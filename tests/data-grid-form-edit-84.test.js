// Plenix · tests/data-grid-form-edit-84.test.js: Form Edit, the record in a drawer (issue 84, F2; ADR 0016, design form-edit.md §2 to §4).
//   node tests/data-grid-form-edit-84.test.js   → DATA_GRID_FORM_EDIT_84_OK
// Written first (proof first): before the change editMode="form" still opens the inline editor. In left to right and right to left, with editModes=['inline','form'] and editMode="form":
//   Enter on an editable cell (and a double click) opens a drawer titled "Edit <the key column's value>" instead of the inline editor; its fields follow the visible column order: an editable column is a Field
//   (the title above its control, the control filled with the value), another column is its title over its value as plain text, an empty one shows a dash with "No value" for a screen reader;
//   Save calls onRecordEdit(record, changes) once with only the changed fields, closes the drawer and shows a Toast "Saved <name>"; Cancel closes it and saves nothing;
//   a value validate refuses shows its message under its field and does not save; a rejected onRecordEdit keeps the drawer open with the values and shows the application's message;
//   with editMode="inline" the same cell opens the inline editor as before.
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9874, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 700 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (extra, mode = 'form', reject = false) => page.evaluate(async (dir, extra, mode, reject) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en'); window.__saved = []; window.__cells = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = [{ id: 'r1', name: 'Person 1', age: 30, role: 'open', locked: 'Fixed 1', empty: '' }, { id: 'r2', name: 'Person 2', age: 31, role: 'closed', locked: 'Fixed 2', empty: '' }];
        const columns = [
          { title: 'Name', field: 'name', kind: 'name', editor: 'input' },
          { title: 'Age', field: 'age', editor: 'number', validate: (v) => (v < 0 ? 'Age cannot be negative' : null) },
          { title: 'Role', field: 'role', editor: 'select', editorProps: { options: [{ value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }] } },
          { title: 'Locked', field: 'locked' },
          { title: 'Empty', field: 'empty' }];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.ToastProvider, null, h('div', { style: { height: 400 } }, h(Plenix.DataGrid, Object.assign({ label: 'People', data, columns, viewMenu: true, editModes: ['inline', 'form'], editMode: mode, editing: { types: ['select'] },
          onRecordEdit: (r, changes) => { window.__saved.push(r.id + ':' + JSON.stringify(changes)); return reject ? Promise.reject(new Error('Name already used')) : Promise.resolve(); },
          onCellEdit: (r, e) => window.__cells.push(r.id + '.' + e.field + '=' + e.value) }, extra)))));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, extra, mode, reject);
      const focus = (r, f = 'name') => page.evaluate((r, f) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="' + f + '"]').focus(); }, r, f);
      const key = async (k) => { await page.keyboard.press(k); await wait(500); };
      const drawer = () => page.evaluate(() => { const d = document.querySelector('[role=dialog]'); if (!d) return null; const labels = [...d.querySelectorAll('label, .plx-field__label')].map((l) => l.textContent.trim()); const text = d.textContent.replace(/\s+/g, ' ').trim(); const inputs = [...d.querySelectorAll('input:not([type=hidden]), select, textarea, [role=combobox]')].map((i) => (i.value !== undefined && i.value !== '' ? i.value : i.textContent.trim())); return { title: (d.querySelector('h1, h2, [id$=title]') || {}).textContent, text, labels, inputs }; });
      const inlineOpen = () => page.evaluate(() => !!document.querySelector('input.plx-data-grid__editor'));
      const saved = () => page.evaluate(() => window.__saved.slice());
      const click = async (label) => { await page.evaluate((label) => { const d = document.querySelector('[role=dialog]'); [...d.querySelectorAll('button')].find((b) => b.textContent.trim() === label).click(); }, label); await wait(600); };
      const setInput = async (label, text) => { await page.evaluate((label) => { const d = document.querySelector('[role=dialog]'); const f = [...d.querySelectorAll('.plx-field')].find((x) => x.textContent.trim().startsWith(label)); const i = f.querySelector('input'); i.focus(); i.select(); }, label); await page.keyboard.type(text); await wait(200); };

      await check(T + 'F2 opens a drawer titled for the record, not the inline editor', async () => {
        await mount(); await focus(0); await key('F2'); const d = await drawer(); assert.ok(d, 'a drawer opens'); assert.match(d.text, /Edit Person 1/); assert.equal(await inlineOpen(), false);
      });
      await check(T + 'Enter and a typed letter do not open the form (nor the inline editor)', async () => {
        await mount(); await focus(0); await key('Enter'); assert.equal(await drawer(), null); assert.equal(await inlineOpen(), false);
        await key('x'); assert.equal(await drawer(), null); assert.equal(await inlineOpen(), false);
      });
      await check(T + 'a double click opens it too', async () => {
        await mount(); await page.evaluate(() => { const c = [...document.querySelectorAll('[role=row][data-plx-record]')][1].querySelector('[data-plx-field="name"]'); c.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })); }); await wait(600);
        const d = await drawer(); assert.ok(d); assert.match(d.text, /Edit Person 2/);
      });
      await check(T + 'the fields follow the column order: editable columns are Fields with values, the others plain text, an empty one a dash', async () => {
        await mount(); await focus(0); await key('F2'); const d = await drawer();
        for (const l of ['Name', 'Age', 'Role', 'Locked', 'Empty']) assert.ok(d.labels.some((x) => x.startsWith(l)), 'label ' + l + ': ' + JSON.stringify(d.labels));
        assert.ok(d.inputs.includes('Person 1') && d.inputs.includes('30'), 'controls hold the values: ' + JSON.stringify(d.inputs));
        assert.match(d.text, /Fixed 1/); assert.ok(!d.inputs.includes('Fixed 1'), 'a locked column is plain text'); assert.match(d.text, /—/); assert.match(d.text, /No value/);
      });
      await check(T + 'Save calls onRecordEdit once with only the changes, closes, and a Toast says Saved', async () => {
        await mount(); await focus(0); await key('F2'); await setInput('Name', 'Renamed'); await click('Save changes');
        assert.deepEqual(await saved(), ['r1:{"name":"Renamed"}']); assert.equal(await drawer(), null);
        assert.match(await page.evaluate(() => document.body.textContent), /Saved Person 1/);
      });
      await check(T + 'Cancel closes the drawer and saves nothing', async () => {
        await mount(); await focus(0); await key('F2'); await click('Cancel'); assert.deepEqual(await saved(), []); assert.equal(await drawer(), null);
      });
      await check(T + 'a value validate refuses shows its message under the field and does not save', async () => {
        await mount(); await focus(0); await key('F2'); await setInput('Age', '-5'); await click('Save changes');
        assert.deepEqual(await saved(), []); const d = await drawer(); assert.ok(d, 'stays open'); assert.match(d.text, /Age cannot be negative/);
        assert.equal(await page.evaluate(() => { const a = document.activeElement; const f = a && a.closest && a.closest('.plx-field'); return f ? f.textContent.trim().slice(0, 3) : null; }), 'Age', 'focus moves to the first wrong field');
      });
      await check(T + 'a rejected onRecordEdit keeps the drawer open with the values and shows the message', async () => {
        await mount({}, 'form', true); await focus(0); await key('F2'); await setInput('Name', 'Dup'); await click('Save changes');
        const d = await drawer(); assert.ok(d, 'stays open'); assert.match(d.text, /Name already used/); assert.equal(await page.evaluate(() => !!document.querySelector('[role=dialog] .plx-error-summary')), true, 'in an ErrorSummary at the top of the form'); assert.ok(d.inputs.includes('Dup'), 'the value is kept: ' + JSON.stringify(d.inputs)); assert.equal((await saved()).length, 1);
      });
      await check(T + 'with editMode inline the same cell opens the inline editor', async () => {
        await mount({}, 'inline'); await focus(0); await key('F2'); assert.equal(await inlineOpen(), true); assert.equal(await drawer(), null);
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'DATA_GRID_FORM_EDIT_84_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
