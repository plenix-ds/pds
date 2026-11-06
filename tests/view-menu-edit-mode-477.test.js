// Plenix · tests/view-menu-edit-mode-477.test.js: the page's ViewMenu offers the Editing choice (issue 477 item 2; ADR 0016, G3 shape on the issue).
//   node tests/view-menu-edit-mode-477.test.js   → VIEW_MENU_EDIT_MODE_477_OK
// Written first (proof first): before the change ViewMenu has no Editing group. In left to right and right to left, with useCollectionView, ViewMenu editModes={['inline','form']} and a DataGrid on tableProps:
//   the page's View menu ends with an "Editing" group, Inline Edit checked; choosing Form Edit there moves the grid to Form Edit (F2 opens the form, not the inline editor) and the grid's own view menu shows it checked;
//   choosing Inline Edit in the grid's view menu moves the page's menu check back (one value); the choice is in collection.view.editMode;
//   without editModes (or with one mode) the page's menu has no Editing group.
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9896, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 700 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (modes) => page.evaluate(async (dir, modes) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement, P = window.Plenix;
        const fields = [{ value: 'name', label: 'Name' }, { value: 'note', label: 'Note' }];
        const data = [{ id: 'r1', name: 'Person 1', note: 'x' }];
        function Page() {
          const c = P.useCollectionView(fields, {}); window.__view = c.view;
          return h(P.ToastProvider, null, h('div', null,
            h('div', { id: 'bar' }, h(P.CommandBar, { label: 'People', view: h(P.ViewMenu, Object.assign({}, c.viewProps, modes ? { editModes: modes } : {})) })),
            h('div', { style: { height: 360 } }, h(P.DataGrid, Object.assign({ label: 'People', data, columns: [{ title: 'Name', field: 'name', kind: 'name', editor: 'input' }, { title: 'Note', field: 'note' }], viewMenu: true, editModes: modes || ['inline'], onRecordEdit: () => Promise.resolve() }, c.tableProps)))));
        }
        window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(h(Page));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, modes);
      const openPage = async () => { await page.evaluate(() => { const b = document.querySelector('#bar button[aria-label="View"], #bar button'); const v = [...document.querySelectorAll('#bar button')].find((x) => /view/i.test(x.getAttribute('aria-label') || x.textContent)); (v || b).focus(); (v || b).click(); }); await wait(400); };
      const openGrid = async () => { await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.getAttribute('aria-label') === 'View options'); b.focus(); b.click(); }); await wait(400); };
      const group = () => page.evaluate(() => { const g = [...document.querySelectorAll('[role=group], [role=menu]')].find((e) => /Editing/.test(e.textContent) && e.querySelector('[role=menuitemradio]')); return g ? [...g.querySelectorAll('[role=menuitemradio]')].filter((r) => /Edit$/.test(r.textContent.trim())).map((r) => r.textContent.trim() + ':' + r.getAttribute('aria-checked')) : null; });
      const choose = async (label) => { await page.evaluate((label) => { [...document.querySelectorAll('[role=menuitemradio]')].find((r) => r.textContent.trim() === label).click(); }, label); await wait(500); await page.keyboard.press('Escape'); await wait(300); };
      const f2 = async () => { await page.evaluate(() => document.querySelector('[role=row][data-plx-record] [data-plx-field="name"]').focus()); await page.keyboard.press('F2'); await wait(700); return page.evaluate(() => ({ form: !!document.querySelector('[role=dialog]'), inline: !!document.querySelector('input.plx-data-grid__editor') })); };

      await check(T + 'the page View menu ends with an Editing group, Inline Edit checked', async () => {
        await mount(['inline', 'form']); await openPage(); assert.deepEqual(await group(), ['Inline Edit:true', 'Form Edit:false']);
      });
      await check(T + 'choosing Form Edit in the page menu moves the grid to Form Edit and its own menu agrees', async () => {
        await mount(['inline', 'form']); await openPage(); await choose('Form Edit');
        assert.equal(await page.evaluate(() => window.__view.editMode), 'form'); assert.deepEqual(await f2(), { form: true, inline: false });
        await page.keyboard.press('Escape'); await wait(300); await openGrid(); assert.deepEqual(await group(), ['Inline Edit:false', 'Form Edit:true']);
      });
      await check(T + 'choosing Inline Edit in the grid menu moves the page menu back', async () => {
        await mount(['inline', 'form']); await openPage(); await choose('Form Edit'); await openGrid(); await choose('Inline Edit');
        assert.equal(await page.evaluate(() => window.__view.editMode), 'inline'); await openPage(); assert.deepEqual(await group(), ['Inline Edit:true', 'Form Edit:false']);
      });
      await check(T + 'without editModes the page menu has no Editing group', async () => {
        await mount(undefined); await openPage(); assert.equal(await group(), null);
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'VIEW_MENU_EDIT_MODE_477_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
