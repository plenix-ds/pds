/* Plenix tests · #800 AC-5 (D-0087, D-0090, ADR 0022): row actions are icons on a wide grid, else the ⋮ menu.
   Summary: a grid with a rowMenu of View, Edit, Share, Archive (all with an icon), Delete (danger) and Note (no icon):
     - with room, the first three eligible items show as icon-only buttons at the row's inline end (named by their label), hidden at rest and shown on row hover,
       focus inside the row and when selected; a ⋮ stays for the rest (Archive, Note, Delete); a danger item is never an icon, even with inline: true (D-0090);
     - inline: false keeps an item in ⋮; inline: true lets a fourth item in; with every item an icon and three or fewer there is no ⋮;
     - without room (a narrow table) every action is in the ⋮ menu, no icons; on touch the ⋮ shows and no icons;
     - an icon runs the item's onSelect with the record; left to right and right to left (the icons sit at the inline end).
   Proof first: before the change the grid draws only the ⋮ button, so there are no icon buttons at all.
   Usage: node tests/data-grid-row-actions-inline-800.test.js   → DATA_GRID_ROW_ACTIONS_INLINE_800_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9801, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [], warns = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 2100, height: 900 });
      page.on('console', (m) => { if (/stays in the ⋮ menu/.test(m.text())) warns.push(m.text()); if (m.type() === 'error') errors.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const T = dir + ': ';
      const mount = (width, menu, touch) => page.evaluate(async (dir, width, menu, touch) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-interaction', touch ? 'touch' : 'pointer');
        const h = React.createElement, P = window.Plenix; window.__root && window.__root.unmount(); window.__log = [];
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:' + width + 'px;display:grid"></div>';
        const rows = Array.from({ length: 6 }, (_, i) => ({ id: 'R' + i, name: 'Row number ' + i, status: 'Open', owner: 'Ibrahim Mansour', city: 'Alexandria' }));
        const cols = ['name', 'status', 'owner', 'city'].map((f) => ({ title: f[0].toUpperCase() + f.slice(1), field: f }));
        const items = menu.map((m) => Object.assign({}, m, { onSelect: (r) => window.__log.push(m.label + ' ' + r.id) }));
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(P.DataGrid, { label: 'Rows', data: rows, columns: cols, index: 'id', rowMenu: items }));
        await new Promise((r) => setTimeout(r, 1200));
      }, dir, width, menu, touch);
      const state = () => page.evaluate(() => {
        const row = document.querySelector('#c [role=row][data-plx-record]');
        const wrap = row.querySelector('.plx-data-grid__row-actions');
        const icons = wrap ? [...wrap.querySelectorAll('button:not(.plx-data-grid__row-menu)')].map((b) => b.getAttribute('aria-label')) : [];
        const dots = !!row.querySelector('.plx-data-grid__row-menu');
        const cell = row.querySelector('.plx-data-grid__cell--row-menu'), cr = cell && cell.getBoundingClientRect(), rr = row.getBoundingClientRect();
        return { icons, dots, opacity: wrap ? +getComputedStyle(wrap).opacity : null, atEnd: cr ? (document.documentElement.dir === 'rtl' ? cr.left - rr.left < 4 : rr.right - cr.right < 4) : null, cards: document.querySelectorAll('#c .plx-data-grid__grid-row--narrow').length };
      });
      const full = [{ label: 'View', icon: 'visibility' }, { label: 'Edit', icon: 'edit' }, { label: 'Share', icon: 'share' }, { label: 'Archive', icon: 'archive' }, { label: 'Note' }, { separator: true }, { label: 'Delete', icon: 'delete', danger: true }];
      // the wide grid
      await mount(1600, full, false);
      let s = await state();
      assert.deepEqual(s.icons, ['View', 'Edit', 'Share'], T + 'the first three eligible items are icons (' + JSON.stringify(s.icons) + ')');
      assert.ok(s.dots, T + 'the ⋮ stays for Archive, Note and Delete');
      assert.equal(s.opacity, 0, T + 'the actions are hidden at rest');
      assert.equal(s.atEnd, true, T + 'the actions are at the row\'s inline end');
      await page.hover('#c [role=row][data-plx-record]'); await new Promise((r) => setTimeout(r, 400));
      assert.equal((await state()).opacity, 1, T + 'the actions show on row hover');
      await page.mouse.move(5, 5); await new Promise((r) => setTimeout(r, 400));
      assert.equal((await state()).opacity, 0, T + 'they hide again when the pointer leaves');
      await page.evaluate(() => document.querySelector('#c [role=row][data-plx-record] .plx-data-grid__row-actions button').focus()); await new Promise((r) => setTimeout(r, 400));
      assert.equal((await state()).opacity, 1, T + 'focus inside the row shows the actions');
      // the arrows move between the icons (mirrored in RTL), the end stops at the last button
      await page.keyboard.press(dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Edit', T + 'the arrow moves to the next icon');
      await page.keyboard.press(dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'View', T + 'the opposite arrow moves back');
      await page.evaluate(() => { document.activeElement.blur(); });
      // an icon runs its item with the record
      await page.evaluate(() => [...document.querySelectorAll('#c [role=row][data-plx-record]')][1].querySelector('.plx-data-grid__row-actions button[aria-label=Edit]').click());
      assert.deepEqual(await page.evaluate(() => window.__log), ['Edit R1'], T + 'an icon runs the item\'s onSelect with the record');
      // the menu holds the rest, Delete last after a divider
      await page.evaluate(() => document.querySelector('#c [role=row][data-plx-record] .plx-data-grid__row-menu').click()); await new Promise((r) => setTimeout(r, 400));
      const menu = await page.evaluate(() => [...document.querySelectorAll('[role=menu] [role=menuitem]')].map((x) => x.textContent.trim()));
      assert.deepEqual(menu, ['Archive', 'Note', 'Delete'], T + 'the ⋮ menu holds the rest in order (' + JSON.stringify(menu) + ')');
      await page.keyboard.press('Escape');
      // a danger item with inline: true stays in ⋮; inline: false keeps View out; inline: true brings Archive in
      await mount(1600, [{ label: 'Remove', icon: 'delete', danger: true, inline: true }, { label: 'View', icon: 'visibility', inline: false }, { label: 'Edit', icon: 'edit' }, { label: 'Share', icon: 'share' }, { label: 'Move', icon: 'folder' }, { label: 'Archive', icon: 'archive', inline: true }], false);
      s = await state();
      assert.deepEqual(s.icons, ['Edit', 'Share', 'Archive'], T + 'danger never inline; inline:false out; inline:true takes a place (' + JSON.stringify(s.icons) + ')');
      assert.ok(s.dots, T + 'the rest (Remove, View, Move) are in ⋮');
      // three icon items and nothing else: no ⋮
      await mount(1600, [{ label: 'View', icon: 'visibility' }, { label: 'Edit', icon: 'edit' }], false);
      s = await state();
      assert.deepEqual(s.icons, ['View', 'Edit'], T + 'two icon items show as icons');
      assert.equal(s.dots, false, T + 'with every item an icon there is no ⋮');
      // no room: a narrow table keeps only the ⋮
      await mount(480, full, false);
      s = await state();
      assert.equal(s.cards, 0, T + 'the narrow grid is still a table');
      assert.deepEqual(s.icons, [], T + 'without room no icon shows (' + JSON.stringify(s.icons) + ')');
      assert.ok(s.dots, T + 'without room the ⋮ holds every action');
      // touch: the ⋮ only
      await mount(1600, full, true);
      s = await state();
      assert.deepEqual(s.icons, [], T + 'on touch no icon shows');
      assert.ok(s.dots, T + 'on touch the ⋮ shows');
      await page.close();
    }
    assert.equal(warns.length, 2, 'a danger item with inline: true warns once in development (per language run): ' + warns.length);
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_ROW_ACTIONS_INLINE_800_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
