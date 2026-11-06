/* Plenix tests · DataGrid fill (issue 3, ADR 0021): editing.fill turns on Ctrl+D (the selected block's top row copied down through it) and
   the fill handle on the block's bottom inline-end corner (drag down, or toward the inline end, to repeat the block). Each filled cell goes
   through the column's rules (editable, validate, the editor's type) and reaches onCellEdit once with source 'fill'; the counts are
   announced; with editing.undo a fill is one undo step. In left to right and right to left. Usage: node tests/data-grid-fill-3.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9845, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (editing) => page.evaluate(async (dir, editing) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en'); window.__edits = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = Array.from({ length: 5 }, (_, i) => ({ id: 'r' + (i + 1), name: ['Alma', 'Boris', 'Cara', 'Dev', 'Esme'][i], role: ['Cook', 'Pilot', 'Nurse', 'Judge', 'Clerk'][i], age: 30 + i, locked: ['Fa', 'Fb', 'Fc', 'Fd', 'Fe'][i] }));
        const columns = [{ title: 'Name', field: 'name', editor: 'input' }, { title: 'Role', field: 'role', editor: 'input' }, { title: 'Age', field: 'age', editor: 'number' },
          { title: 'Locked', field: 'locked', editor: 'input', editable: false }];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 420 } }, h(Plenix.DataGrid, { label: 'People', data, columns, editing, cellSelection: true,
          onCellEdit: (r, e) => { window.__edits.push(r.id + '.' + e.field + '=' + e.value + ':' + (e.source || '-')); } })));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, editing);
      const focus = (r, f) => page.evaluate((r, f) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="' + f + '"]').focus(); }, r, f);
      const text = (r, f) => page.evaluate((r, f) => [...document.querySelectorAll('[role=row][data-plx-record]')][r].querySelector('[data-plx-field="' + f + '"]').textContent.trim(), r, f);
      const key = async (k, mods = []) => { for (const m of mods) await page.keyboard.down(m); await page.keyboard.press(k); for (const m of mods) await page.keyboard.up(m); await wait(250); };
      const edits = () => page.evaluate(() => window.__edits.slice());
      const said = () => page.evaluate(() => [...document.querySelectorAll('[aria-live]')].map((e) => e.textContent).join(' | '));
      const handles = () => page.evaluate(() => document.querySelectorAll('.plx-data-grid__fill-handle').length);
      const center = (r, f) => page.evaluate((r, f) => { const b = [...document.querySelectorAll('[role=row][data-plx-record]')][r].querySelector('[data-plx-field="' + f + '"]').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, r, f);
      const drag = async (from, to) => {
        const a = await page.evaluate(() => { const b = document.querySelector('.plx-data-grid__fill-handle').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
        await page.mouse.move(a.x, a.y); await page.mouse.down(); await page.mouse.move(to.x, to.y, { steps: 6 }); await page.mouse.up(); await wait(400);
      };
      // select rows 0..1 of Name and Role (Shift with arrows)
      const FWD = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';   // the arrows are mirrored: toward the inline end
      const select = async (rows, cols) => { await focus(0, 'name'); for (let i = 0; i < rows - 1; i++) await key('ArrowDown', ['Shift']); for (let j = 0; j < cols - 1; j++) await key(FWD, ['Shift']); };

      await mount({});
      await select(3, 2); await key('d', ['Control']);
      assert.equal(await text(2, 'name'), 'Cara', T + 'with editing.fill off Ctrl+D does nothing'); assert.equal(await handles(), 0, T + 'and no fill handle');

      await mount({ fill: true, undo: true });
      assert.equal(await handles(), 0, T + 'no handle without a selected block');
      await select(3, 2); await key('d', ['Control']);
      assert.equal(await text(1, 'name'), 'Alma', T + 'Ctrl+D copies the top row down'); assert.equal(await text(2, 'role'), 'Cook', JSON.stringify(await edits()));
      assert.equal(await text(3, 'name'), 'Dev', T + 'rows below the block are untouched');
      assert.deepEqual(await edits(), ['r2.name=Alma:fill', 'r2.role=Cook:fill', 'r3.name=Alma:fill', 'r3.role=Cook:fill'], T + 'once per cell, with source fill');
      assert.match(await said(), /4 cells filled|٤/, T + 'announced: ' + await said());
      await focus(0, 'name'); await key('z', ['Control']);
      assert.equal(await text(1, 'name'), 'Boris', T + 'one undo restores the whole fill'); assert.equal(await text(2, 'role'), 'Nurse');

      await mount({ fill: true });
      await select(3, 3); await key('d', ['Control']); // Name, Role, Age
      assert.match(await text(2, 'age'), /^(30|٣٠)$/, T + 'a number column fills its number');
      await mount({ fill: true });
      await focus(0, 'role'); await key('ArrowDown', ['Shift']); await key(FWD, ['Shift']); await key(FWD, ['Shift']);  // Role, Age, Locked
      await key('ArrowDown', ['Shift']); await key('d', ['Control']);
      assert.equal(await text(1, 'locked'), 'Fb', T + 'a cell that cannot be edited is skipped');

      await mount({ fill: true });
      await select(2, 2);
      assert.equal(await handles(), 1, T + 'one fill handle on the block');
      await drag(null, await center(4, 'name'));
      assert.equal(await text(2, 'name'), 'Alma'); assert.equal(await text(3, 'name'), 'Boris'); assert.equal(await text(4, 'name'), 'Alma', T + 'dragging down repeats the block');
      assert.equal(await text(4, 'role'), 'Cook');
      assert.equal((await edits()).every((e) => e.endsWith(':fill')), true, T + 'source fill');

      await mount({ fill: true });
      await focus(0, 'name'); await key('ArrowDown', ['Shift']);   // Name, rows 0..1
      await drag(null, await center(1, 'role'));
      assert.equal(await text(0, 'role'), 'Alma'); assert.equal(await text(1, 'role'), 'Boris', T + 'dragging toward the inline end repeats the block across');
      assert.equal(await text(2, 'role'), 'Nurse');
    }
    assert.deepEqual(problems, [], 'no script errors');
    console.log('data-grid-fill-3: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
