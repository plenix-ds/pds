/* Plenix tests · a Menu opens toward the start by default: its end edge on the trigger's end edge (issue 1248, ADR via G3 ruling, design 1248, D-0165).
   Summary: a ⋮ Menu's end edge equals its trigger's end edge in LTR and RTL; a trigger at the window's start edge makes it flip to start-aligned; a MenuBar's top-level menu stays start-aligned;
     an explicit placement still wins; a DataGrid rowMenu follows the default.
   Proof first: before the change the menu's start edge sits on the trigger's start edge.
   Usage: node tests/menu-placement-1248.test.js   → MENU_PLACEMENT_1248_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9996, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.setViewport({ width: 900, height: 700 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      // render the trigger at a chosen distance from the window's start edge, open it, report the menu and trigger edges
      const probe = (kind, offset) => page.evaluate(async (dir, kind, offset) => {
        document.documentElement.setAttribute('dir', dir);
        const h = React.createElement, P = Plenix; window.__root && window.__root.unmount();
        const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c); window.__root = ReactDOM.createRoot(c);
        const items = [h(P.MenuItem, { key: 1 }, 'A rather long menu item label'), h(P.MenuItem, { key: 2 }, 'Second')];
        const spacer = (n) => h('div', { style: { height: 8, [dir === 'rtl' ? 'marginInlineStart' : 'marginInlineStart']: n } });
        let node;
        if (kind === 'menu') node = h(P.Menu, { label: 'More', trigger: h(P.Button, { iconOnly: true, label: 'More', icon: 'more_vert' }) }, items);
        else if (kind === 'explicit') node = h(P.Menu, { label: 'More', placement: 'bottom-start', trigger: h(P.Button, { iconOnly: true, label: 'More', icon: 'more_vert' }) }, items);
        else if (kind === 'menubar') node = h(P.MenuBar, { label: 'App' }, h(P.Menu, { label: 'File' }, items));
        else node = h(P.DataGrid, { label: 'Rows', data: [{ id: 1, name: 'A' }], columns: [{ title: 'Name', field: 'name' }], index: 'id', rowMenu: [{ label: 'Open', onSelect() {} }, { label: 'A rather long row action', onSelect() {} }] });
        window.__root.render(h('div', { style: { paddingInlineStart: offset, paddingBlockStart: 40, inlineSize: kind === 'grid' ? 700 : 'auto' } }, node));
        await new Promise((r) => setTimeout(r, 700));
        const trig = kind === 'menubar' ? document.querySelector('[role=menubar] button') : kind === 'grid' ? document.querySelector('.plx-data-grid__row-menu') : document.querySelector('#c button');
        trig.click(); await new Promise((r) => setTimeout(r, 500));
        const m = document.querySelector('[role=menu]'); if (!m) return null;
        const a = trig.getBoundingClientRect(), b = m.getBoundingClientRect();
        return { tl: Math.round(a.left), tr: Math.round(a.right), ml: Math.round(b.left), mr: Math.round(b.right), mw: Math.round(b.width), vw: innerWidth };
      }, dir, kind, offset);
      const rtl = dir === 'rtl';
      let r = await probe('menu', 400); assert.ok(r && r.mw > r.tr - r.tl, T + 'menu opened wider than its trigger');
      assert.equal(rtl ? r.ml : r.mr, rtl ? r.tl : r.tr, T + 'the end edges meet (' + JSON.stringify(r) + ')');
      r = await probe('menu', 0); assert.ok(r.ml >= 0 && r.mr <= r.vw, T + 'at the window start the menu stays inside it (' + JSON.stringify(r) + ')');
      assert.equal(rtl ? r.mr : r.ml, rtl ? r.tr : r.tl, T + 'it flips to start-aligned at the window start edge');
      r = await probe('explicit', 400); assert.equal(rtl ? r.mr : r.ml, rtl ? r.tr : r.tl, T + 'an explicit bottom-start still wins');
      r = await probe('menubar', 400); assert.equal(rtl ? r.mr : r.ml, rtl ? r.tr : r.tl, T + 'a MenuBar top-level menu stays start-aligned (' + JSON.stringify(r) + ')');
      r = await probe('grid', 0); assert.ok(r, T + 'the row menu opened'); assert.equal(rtl ? r.ml : r.mr, rtl ? r.tl : r.tr, T + 'a DataGrid rowMenu follows the default (' + JSON.stringify(r) + ')');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('MENU_PLACEMENT_1248_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
