/* Plenix tests · DataGrid undo and redo of cell edits (issue 3, ADR 0021): editing.undo turns on Ctrl+Z, Ctrl+Y and Cmd+Shift+Z.
   Each step is one user action; every change reaches onCellEdit once per cell with change.source ('edit' | 'undo' | 'redo');
   an app that refuses an undo keeps the value and the grid says why; with the option off the keys do nothing.
   Usage: node tests/data-grid-undo-3.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9843, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (editing, refuse) => page.evaluate(async (dir, editing, refuse) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en'); window.__edits = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = Array.from({ length: 4 }, (_, i) => ({ id: 'r' + (i + 1), name: ['Alma', 'Boris', 'Cara', 'Dev'][i], age: 30 + i }));
        const columns = [{ title: 'Name', field: 'name', editor: 'input' }, { title: 'Age', field: 'age', editor: 'number' }];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 400 } }, h(Plenix.DataGrid, { label: 'People', data, columns, editing,
          onCellEdit: (r, e) => { window.__edits.push(r.id + '.' + e.field + '=' + e.value + ':' + (e.source || '-')); if (refuse && e.source === 'undo') return Promise.reject(new Error('Locked by someone else.')); } })));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, editing, refuse);
      const focus = (r, f) => page.evaluate((r, f) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="' + f + '"]').focus(); }, r, f);
      const text = (r, f) => page.evaluate((r, f) => [...document.querySelectorAll('[role=row][data-plx-record]')][r].querySelector('[data-plx-field="' + f + '"]').textContent.trim(), r, f);
      const key = async (k, mods = []) => { for (const m of mods) await page.keyboard.down(m); await page.keyboard.press(k); for (const m of mods) await page.keyboard.up(m); await wait(200); };
      const edits = () => page.evaluate(() => window.__edits.slice());
      const edit = async (r, f, value) => { await focus(r, f); await key('F2'); await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type(value); await key('Enter'); };

      await mount({});
      await edit(0, 'name', 'Ann');
      assert.equal(await text(0, 'name'), 'Ann', T + 'edit applied');
      await focus(0, 'name'); await key('z', ['Control']);
      assert.equal(await text(0, 'name'), 'Ann', T + 'with editing.undo off, Ctrl+Z does nothing');
      assert.deepEqual(await edits(), ['r1.name=Ann:edit'], T + 'a typed edit says source edit');

      await mount({ undo: true });
      await edit(0, 'name', 'Ann'); await edit(1, 'name', 'Bo');
      await focus(1, 'name'); await key('z', ['Control']);
      assert.equal(await text(1, 'name'), 'Boris', T + 'Ctrl+Z restores the last edit');
      assert.equal(await text(0, 'name'), 'Ann', T + 'only that step');
      await key('z', ['Control']);
      assert.equal(await text(0, 'name'), 'Alma', T + 'a second Ctrl+Z restores the one before');
      await key('y', ['Control']);
      assert.equal(await text(0, 'name'), 'Ann', T + 'Ctrl+Y redoes');
      await key('z', ['Meta', 'Shift']); // Cmd+Shift+Z is redo too: the second step
      await key('z', ['Control']);
      await key('z', ['Meta', 'Shift']);
      assert.deepEqual(await edits(), ['r1.name=Ann:edit', 'r2.name=Bo:edit', 'r2.name=Boris:undo', 'r1.name=Alma:undo', 'r1.name=Ann:redo', 'r2.name=Bo:redo', 'r2.name=Boris:undo', 'r2.name=Bo:redo'], T + 'every step reaches onCellEdit once, with its source');
      await key('z', ['Control']);
      assert.equal(await text(1, 'name'), 'Boris');
      await edit(2, 'name', 'Cy'); await key('y', ['Control']);
      assert.equal(await text(1, 'name'), 'Boris', T + 'a new edit clears the redo steps');

      await mount({ undo: true }, true);
      await edit(0, 'name', 'Ann'); await focus(0, 'name'); await key('z', ['Control']); await wait(300);
      assert.ok((await text(0, 'name')).endsWith('Ann'), T + 'a refused undo keeps the value');
      assert.match(await page.evaluate(() => document.body.textContent), /Locked by someone else\./, T + 'and says why');
    }
    assert.deepEqual(problems, [], 'no script errors');
    console.log('data-grid-undo-3: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
