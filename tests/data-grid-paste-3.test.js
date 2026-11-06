/* Plenix tests · DataGrid paste (issue 3, ADR 0021): editing.paste turns on Ctrl+V of a copied block (tab-separated rows, as Excel and
   Google Sheets write it). It lands at the active cell (or fills the selected block with one value), goes through each column's
   validate, skips cells that cannot be edited or fail the check, stops at the edge, reaches onCellEdit once per cell with source
   'paste', announces the counts, and is one undo step. In left to right and right to left. Usage: node tests/data-grid-paste-3.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9844, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (extra, refuseValue) => page.evaluate(async (dir, extra, refuseValue) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en'); window.__edits = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = Array.from({ length: 4 }, (_, i) => ({ id: 'r' + (i + 1), name: ['Alma', 'Boris', 'Cara', 'Dev'][i], age: 30 + i, role: ['Cook', 'Pilot', 'Nurse', 'Judge'][i], locked: 'Fixed' }));
        const columns = [{ title: 'Name', field: 'name', editor: 'input' }, { title: 'Age', field: 'age', editor: 'number', validate: (v) => (v != null && v < 0 ? 'Age cannot be negative.' : null) },
          { title: 'Role', field: 'role', editor: 'input' }, { title: 'Locked', field: 'locked', editor: 'input', editable: false }];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 400 } }, h(Plenix.DataGrid, { label: 'People', data, columns, editing: extra,
          cellSelection: !!extra.rangeSelect,
          onCellEdit: (r, e) => { window.__edits.push(r.id + '.' + e.field + '=' + e.value + ':' + (e.source || '-')); if (refuseValue && e.value === refuseValue) return Promise.reject(new Error('Not allowed.')); } })));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, extra, refuseValue);
      const focus = (r, f) => page.evaluate((r, f) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="' + f + '"]').focus(); }, r, f);
      const text = (r, f) => page.evaluate((r, f) => [...document.querySelectorAll('[role=row][data-plx-record]')][r].querySelector('[data-plx-field="' + f + '"]').textContent.trim(), r, f);
      const key = async (k, mods = []) => { for (const m of mods) await page.keyboard.down(m); await page.keyboard.press(k); for (const m of mods) await page.keyboard.up(m); await wait(200); };
      const paste = async (data) => { await page.evaluate((data) => { const dt = new DataTransfer(); dt.setData('text/plain', data); document.activeElement.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); }, data); await wait(400); };
      const edits = () => page.evaluate(() => window.__edits.slice());
      const said = () => page.evaluate(() => [...document.querySelectorAll('[aria-live]')].map((e) => e.textContent).join(' | '));

      await mount({});
      await focus(0, 'name'); await paste('Zed\t41');
      assert.equal(await text(0, 'name'), 'Alma', T + 'with editing.paste off a paste does nothing');
      assert.deepEqual(await edits(), []);

      await mount({ paste: true, undo: true });
      await focus(0, 'name'); await paste('Ann\t41\nBo\t42');
      assert.equal(await text(0, 'name'), 'Ann', T + 'a 2 by 2 block lands at the active cell'); assert.equal(await text(1, 'name'), 'Bo');
      assert.equal(await text(0, 'age'), '41'.replace(/\d/g, (d) => (dir === 'rtl' ? '٠١٢٣٤٥٦٧٨٩'[d] : d))); assert.equal(await text(2, 'name'), 'Cara', T + 'nothing else changes');
      assert.deepEqual(await edits(), ['r1.name=Ann:paste', 'r1.age=41:paste', 'r2.name=Bo:paste', 'r2.age=42:paste'], T + 'once per cell, with source paste');
      assert.match(await said(), /4 cells pasted|٤/, T + 'announced: ' + await said());
      await focus(0, 'name'); await key('z', ['Control']);
      assert.equal(await text(0, 'name'), 'Alma', T + 'one undo restores the whole paste'); assert.equal(await text(1, 'name'), 'Boris');
      assert.equal((await edits()).filter((e) => e.endsWith(':undo')).length, 4);

      await mount({ paste: true });
      await focus(0, 'role'); await paste('Chef\tx\nPilota\ty'); // role then locked: locked is skipped
      assert.equal(await text(0, 'role'), 'Chef'); assert.equal(await text(0, 'locked'), 'Fixed', T + 'a cell that cannot be edited is skipped');
      assert.equal(await text(1, 'role'), 'Pilota');
      assert.match(await said(), /2 cells skipped|٢/, T + 'the skipped count is announced: ' + await said());

      await mount({ paste: true });
      await focus(1, 'name'); await paste('Eve\t-5\nFay\tnot a number\nGus\t50'); // rows 2..4; age: negative and not a number are skipped
      assert.equal(await text(1, 'name'), 'Eve'); assert.equal(await text(2, 'name'), 'Fay'); assert.equal(await text(3, 'name'), 'Gus');
      assert.notEqual(await text(1, 'age'), '-5'); assert.deepEqual((await edits()).filter((e) => /age/.test(e)), ['r4.age=50:paste'], T + 'validate and the number column refuse their cells');

      await mount({ paste: true });
      await focus(3, 'name'); await paste('Hal\t1\nIan\t2\nJoy\t3');
      assert.deepEqual((await edits()).map((e) => e.split('.')[0]), ['r4', 'r4'], T + 'a paste stops at the last row and adds none');

      await mount({ paste: true }, 'Not-ok');
      await focus(0, 'name'); await paste('Kim\nNot-ok\nLee'); await wait(300);
      assert.equal(await text(0, 'name'), 'Kim'); assert.ok((await text(2, 'name')).endsWith('Lee'), T + 'accepted cells stay');
      assert.ok((await text(1, 'name')).includes('Boris'), T + 'the refused cell has its old value back');
      assert.match(await said(), /1 cell not saved|١/, T + 'the refused count is announced: ' + await said());

      await mount({ paste: true, rangeSelect: true });
      await focus(0, 'name'); await key('ArrowDown', ['Shift']); await key('ArrowRight', ['Shift']); await paste('Same');
      assert.equal((await edits()).filter((e) => e.endsWith('=Same:paste')).length, 2, T + 'the two text cells of the block, once each; the number cells refuse the text');
      assert.equal(await text(0, 'name'), 'Same'); assert.equal(await text(1, 'name'), 'Same', T + 'one value fills the selected block');
    }
    assert.deepEqual(problems, [], 'no script errors');
    console.log('data-grid-paste-3: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
