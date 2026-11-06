/* Plenix tests · DataGrid undo of a saved row form (issue 3, ADR 0021, part 4): with editing.undo a saved Form Edit is one undo step, whatever
   number of fields it changed. Without onRecordEdit the changed fields reach onCellEdit once each (source 'edit') and one Ctrl+Z restores them all
   (source 'undo'); with onRecordEdit the application saved the record itself, and one Ctrl+Z reaches it as one cell edit per changed field.
   In left to right and right to left. Usage: node tests/data-grid-form-undo-3.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9846, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 700 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (recordLevel) => page.evaluate(async (dir, recordLevel) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en'); window.__cells = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const columns = [{ title: 'Name', field: 'name', kind: 'name', editor: 'input' }, { title: 'Role', field: 'role', editor: 'input' }, { title: 'Locked', field: 'locked' }];
        const App = () => {
          const [data, setData] = React.useState([{ id: 'r1', name: 'Alma', role: 'Cook', locked: 'Fa' }, { id: 'r2', name: 'Boris', role: 'Pilot', locked: 'Fb' }]);
          window.__data = data;
          const apply = (id, changes) => setData((rows) => rows.map((r) => (r.id === id ? Object.assign({}, r, changes) : r)));
          return h(Plenix.ToastProvider, null, h('div', { style: { height: 400 } }, h(Plenix.DataGrid, Object.assign({ label: 'People', data, columns, viewMenu: true, editModes: ['inline', 'form'], editMode: 'form', editing: { undo: true },
            onCellEdit: (r, e) => { window.__cells.push(r.id + '.' + e.field + '=' + e.value + ':' + e.source); apply(r.id, { [e.field]: e.value }); } },
            recordLevel ? { onRecordEdit: (r, changes) => { window.__cells.push('record:' + r.id + ':' + JSON.stringify(changes)); apply(r.id, changes); } } : {}))));
        };
        window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(h(App));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, recordLevel);
      const focus = (r, f = 'name') => page.evaluate((r, f) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="' + f + '"]').focus(); }, r, f);
      const text = (r, f) => page.evaluate((r, f) => [...document.querySelectorAll('[role=row][data-plx-record]')][r].querySelector('[data-plx-field="' + f + '"]').textContent.trim(), r, f);
      const key = async (k, mods = []) => { for (const m of mods) await page.keyboard.down(m); await page.keyboard.press(k); for (const m of mods) await page.keyboard.up(m); await wait(500); };
      const click = async (label) => { await page.evaluate((label) => { const d = document.querySelector('[role=dialog]'); [...d.querySelectorAll('button')].find((b) => b.textContent.trim() === label).click(); }, label); await wait(700); };
      const setInput = async (label, value) => { await page.evaluate((label) => { const d = document.querySelector('[role=dialog]'); const f = [...d.querySelectorAll('.plx-field')].find((x) => x.textContent.trim().startsWith(label)); const i = f.querySelector('input'); i.focus(); i.select(); }, label); await page.keyboard.type(value); await wait(200); };
      const cells = () => page.evaluate(() => window.__cells.slice());
      const saveForm = async () => { await focus(0); await key('F2'); await setInput('Name', 'Ann'); await setInput('Role', 'Chef'); await click('Save changes'); };

      await mount(false);
      await saveForm();
      assert.equal(await text(0, 'name'), 'Ann'); assert.equal(await text(0, 'role'), 'Chef');
      assert.deepEqual(await cells(), ['r1.name=Ann:edit', 'r1.role=Chef:edit'], T + 'the changed fields reach onCellEdit once each');
      await focus(0, 'name'); await key('z', ['Control']);
      assert.equal(await text(0, 'name'), 'Alma', T + 'one Ctrl+Z restores the whole form'); assert.equal(await text(0, 'role'), 'Cook');
      assert.deepEqual((await cells()).slice(2), ['r1.name=Alma:undo', 'r1.role=Cook:undo']);
      await key('y', ['Control']);
      assert.equal(await text(0, 'name'), 'Ann'); assert.equal(await text(0, 'role'), 'Chef', T + 'and one Ctrl+Y puts it back');

      await mount(true);
      await saveForm();
      assert.equal(await text(0, 'name'), 'Ann');
      await focus(0, 'name'); await key('z', ['Control']);
      assert.equal(await text(0, 'name'), 'Alma', T + 'with onRecordEdit one Ctrl+Z restores the record'); assert.equal(await text(0, 'role'), 'Cook');
      assert.deepEqual((await cells()).filter((c) => c.endsWith(':undo')), ['r1.name=Alma:undo', 'r1.role=Cook:undo'], T + 'each field reaches onCellEdit with source undo');
    }
    assert.deepEqual(problems, [], 'no script errors');
    console.log('data-grid-form-undo-3: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
