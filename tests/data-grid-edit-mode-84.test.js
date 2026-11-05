// Plenix · tests/data-grid-edit-mode-84.test.js: the Editing choice in the grid's view menu (issue 84, F1; ADR 0016, design form-edit.md §1).
//   node tests/data-grid-edit-mode-84.test.js   → DATA_GRID_EDIT_MODE_84_OK
// Written first (proof first): before the change the view menu has no Editing group. In left to right and right to left:
//   with editModes={['inline','form']} and an editable column, the view menu ends with a divider and an "Editing" group of two radio items, "Inline Edit" (checked) and "Form Edit";
//   choosing Form Edit moves the check, calls onViewChange({ editMode: 'form' }) and is remembered per table under storageKey (a new grid with the same key opens on Form Edit);
//   editMode="form" opens on Form Edit when nothing is remembered; a TableSettings supplies editModes and editMode, and the table's own props win over it;
//   with one mode offered (or none: the default), with no editable column, or without viewMenu, the group does not appear.
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9870, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 600 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (extra, settings, editable = true) => page.evaluate(async (dir, extra, settings, editable) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en'); window.__views = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = [{ id: 'r1', name: 'A', note: 'x' }];
        const columns = [{ title: 'Name', field: 'name' }, editable ? { title: 'Note', field: 'note', editor: 'input' } : { title: 'Note', field: 'note' }];
        const grid = h(Plenix.DataGrid, Object.assign({ label: 'Cases', data, columns, viewMenu: true, onViewChange: (v) => window.__views.push(JSON.stringify(v)) }, extra));
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 300 } }, settings ? h(Plenix.TableSettings, settings, grid) : grid));
        await new Promise((r) => setTimeout(r, 900));
      }, dir, extra, settings, editable);
      const openMenu = async () => { await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.getAttribute('aria-label') === 'View options'); if (b) { b.focus(); b.click(); } }); await wait(400); };
      const group = () => page.evaluate(() => { const g = [...document.querySelectorAll('[role=group], [role=menu]')].find((e) => /Editing/.test(e.textContent) && e.querySelector('[role=menuitemradio]')); if (!g) return null; return [...g.querySelectorAll('[role=menuitemradio]')].map((r) => r.textContent.trim() + ':' + r.getAttribute('aria-checked')); });
      const hasEditing = () => page.evaluate(() => !![...document.querySelectorAll('[role=menu]')].find((m) => /Editing/.test(m.textContent)));
      const choose = async (label) => { await page.evaluate((label) => { [...document.querySelectorAll('[role=menuitemradio]')].find((r) => r.textContent.trim() === label).click(); }, label); await wait(400); };
      const BOTH = { editModes: ['inline', 'form'] };

      await check(T + 'the view menu ends with an Editing group of two radio items, Inline Edit checked', async () => {
        await mount(BOTH); await openMenu(); assert.deepEqual(await group(), ['Inline Edit:true', 'Form Edit:false']);
      });
      await check(T + 'choosing Form Edit moves the check, is reported and remembered per table', async () => {
        await page.evaluate(() => localStorage.clear());
        await mount({ ...BOTH, storageKey: 'edit-mode-84', onViewChange: null }); await openMenu(); await choose('Form Edit');
        await mount({ ...BOTH, storageKey: 'edit-mode-84', onViewChange: null }); await openMenu(); assert.deepEqual(await group(), ['Inline Edit:false', 'Form Edit:true'], 'a new grid with the same key opens on Form Edit');
        await mount({ ...BOTH, storageKey: 'other-84', onViewChange: null }); await openMenu(); assert.deepEqual(await group(), ['Inline Edit:true', 'Form Edit:false'], 'another table is not changed');
      });
      await check(T + 'onViewChange hears the choice', async () => {
        await mount(BOTH); await openMenu(); await choose('Form Edit'); const v = await page.evaluate(() => window.__views); assert.ok(v.some((x) => /"editMode":"form"/.test(x)), JSON.stringify(v));
      });
      await check(T + 'editMode opens on Form Edit when nothing is remembered', async () => {
        await page.evaluate(() => localStorage.clear()); await mount({ ...BOTH, editMode: 'form', storageKey: 'edit-mode-84b', onViewChange: null }); await openMenu(); assert.deepEqual(await group(), ['Inline Edit:false', 'Form Edit:true']);
      });
      await check(T + 'a TableSettings supplies the modes, and the table wins over it', async () => {
        await mount({}, { editModes: ['inline', 'form'], editMode: 'form' }); await openMenu(); assert.deepEqual(await group(), ['Inline Edit:false', 'Form Edit:true'], 'from TableSettings');
        await mount({ editModes: ['inline'] }, { editModes: ['inline', 'form'] }); await openMenu(); assert.equal(await hasEditing(), false, 'the table offers one mode');
        await mount({ editMode: 'inline' }, { editModes: ['inline', 'form'], editMode: 'form' }); await openMenu(); assert.deepEqual(await group(), ['Inline Edit:true', 'Form Edit:false'], 'the table editMode wins');
      });
      await check(T + 'one mode, the default, no editable column or no viewMenu: no Editing group', async () => {
        await mount({ editModes: ['form'] }); await openMenu(); assert.equal(await hasEditing(), false);
        await mount({}); await openMenu(); assert.equal(await hasEditing(), false, 'the default offers only inline');
        await mount(BOTH, undefined, false); await openMenu(); assert.equal(await hasEditing(), false, 'no editable column');
        await mount({ ...BOTH, viewMenu: false }); await openMenu(); assert.equal(await hasEditing(), false, 'no view menu');
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'DATA_GRID_EDIT_MODE_84_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
