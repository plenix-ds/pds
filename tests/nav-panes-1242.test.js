/* Plenix tests · #1242 and #1243 (ADR 0057, D-0168, D-0169; design docs/pds1/slices/1242/design.md): the settings nav is a docked SecondaryPane, and every navigation pane has one standard width.
   Summary: an AppShell with a NavPane and a SettingsLayout, light, LTR and RTL:
     AC-1 the settings nav is a SecondaryPane in PagePanes: no card, margin 0, its block start the main nav's, titled "Settings" (15px, 700), with a Collapse button;
     AC-2 in a 1366 and a 1920 window, framed or full, the NavPane and the settings pane are both 240px (no window steps);
     AC-3 the edge: Arrow keys move it 8px (mirrored in RTL), Home and End reach the limits (settings 180 (184 on the 8px drag grid) and 400, nav 200 and 320);
     AC-4 Enter and a double-click on the edge reset to 240px and do not collapse; Collapse and Ctrl+[ fold the panes;
     AC-5 the dragged width is remembered after a reload; AC-6 at Narrow the nav is the list of a list-detail screen.
   Proof first: before the change the settings nav is a NavPane card inside the content, the panes widen at 1440 and 1920 (320 each) and Enter on the edge collapses.
   Usage: node tests/nav-panes-1242.test.js   → NAV_PANES_1242_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9820, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const open = async (page, width, dir, frame) => {
      await page.setViewport({ width, height: 800 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate(async (dir, frame) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
        const h = React.createElement, P = Plenix, noop = () => {};
        const nav = h(P.NavPane, { label: 'Navigation', as: 'div' }, h(P.NavList, { label: 'Main', groups: [{ heading: 'App', items: [{ id: 'o', label: 'Overview', icon: 'home' }, { id: 's', label: 'Settings', icon: 'settings' }] }], value: 's', onSelect: noop }));
        const settingsNav = h(P.NavList, { label: 'Settings sections', items: [{ id: 'a', label: 'Account' }, { id: 'b', label: 'Regional' }, { id: 'c', label: 'TRIBUNAL SESSIONS' }], value: 'a', onSelect: noop });
        document.getElementById('main').innerHTML = '<div id="c" style="block-size:700px"></div>';
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(P.AppShell, Object.assign({ page: 'settings', sideNav: nav }, frame ? { frame: 'centered' } : {}), h(P.SettingsLayout, { nav: settingsNav }, h(P.SettingsSection, { title: 'Regional' }, h(P.SettingsRow, { label: 'Date format' }, 'x')))));
        await new Promise((r) => setTimeout(r, 1200));
      }, dir, frame);
    };
    const geo = (page) => page.evaluate(() => {
      const r = (e) => e && e.getBoundingClientRect(), nav = document.querySelector('.plx-nav-pane'), sec = document.querySelector('.plx-settings .plx-secondary-pane, .plx-page-panes .plx-secondary-pane'), title = sec && sec.querySelector('.plx-secondary-pane__title');
      const cs = (e) => e && getComputedStyle(e);
      return { nav: nav && Math.round(r(nav).width), navTop: nav && r(nav).top, sec: sec && Math.round(r(sec).width), secTop: sec && r(sec).top, panes: !!document.querySelector('.plx-settings .plx-page-panes'), card: !!document.querySelector('.plx-settings__nav'),
        margin: sec && ['marginTop', 'marginInlineStart', 'marginInlineEnd', 'marginBottom'].map((k) => cs(sec)[k]).join(), title: title && { text: title.textContent.trim(), size: cs(title).fontSize, weight: cs(title).fontWeight },
        collapse: !!(sec && sec.querySelector('.plx-secondary-pane__header button')), navSep: nav && (nav.querySelector('[role=separator]') ? +nav.querySelector('[role=separator]').getAttribute('aria-valuenow') : null) };
    });
    const sepOf = (page, which) => page.evaluate((which) => { const el = which === 'nav' ? document.querySelector('.plx-nav-pane [role=separator]') : document.querySelector('.plx-secondary-pane [role=separator]'); if (!el) return null; el.focus(); return { now: +el.getAttribute('aria-valuenow'), min: +el.getAttribute('aria-valuemin'), max: +el.getAttribute('aria-valuemax') }; }, which);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      { const p0 = await browser.newPage(); await p0.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' }); await p0.evaluate(() => localStorage.clear()); await p0.close(); }
      // AC-1 and AC-2
      for (const [width, frame] of [[1366, false], [1920, false], [1920, true]]) {
        const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await open(page, width, dir, frame); const g = await geo(page); const W = T + width + (frame ? ' framed' : '') + ': ';
        assert.equal(g.nav, 240, W + 'AC-2: the NavPane is 240px (' + g.nav + ')'); assert.equal(g.sec, 240, W + 'AC-2: the settings pane is 240px (' + g.sec + ')');
        if (width === 1366 && !frame) {
          assert.ok(g.panes && !g.card, W + 'AC-1: the settings nav is a pane in PagePanes, not a card'); assert.equal(g.margin, '0px,0px,0px,0px', W + 'AC-1: no outer margin');
          assert.ok(Math.abs(g.secTop - g.navTop) < 1, W + 'AC-1: its block start is the main nav\'s (' + g.secTop + ' / ' + g.navTop + ')');
          assert.ok(g.title && (dir === 'rtl' ? g.title.text.length > 0 : g.title.text === 'Settings') && g.title.size === '15px' && +g.title.weight >= 700, W + 'AC-1: titled "Settings" (15px, 700): ' + JSON.stringify(g.title)); assert.ok(g.collapse, W + 'AC-1: with a Collapse button');
        }
        await page.close();
      }
      // AC-3 and AC-4: the edge
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await open(page, 1366, dir, false);
      const grow = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight', shrink = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
      let s = await sepOf(page, 'sec'); assert.ok(s, T + 'AC-3: the settings pane has a resize edge'); assert.equal(s.now, 240, T + 'AC-3: it starts at 240');
      await page.keyboard.press(grow); await wait(200); assert.equal((await geo(page)).sec, 248, T + 'AC-3: the growing arrow adds 8px');
      await page.keyboard.press(shrink); await page.keyboard.press(shrink); await wait(200); assert.equal((await geo(page)).sec, 232, T + 'AC-3: the other arrow removes 8px');
      await page.keyboard.press('End'); await wait(200); assert.equal((await geo(page)).sec, 400, T + 'AC-3: End reaches the largest width (400)');
      await page.keyboard.press('Home'); await wait(200); assert.equal((await geo(page)).sec, 184, T + 'AC-3: Home reaches the smallest: 180 on the 8px drag grid is 184');
      await page.keyboard.press('Enter'); await wait(250); let g = await geo(page);
      assert.equal(g.sec, 240, T + 'AC-4: Enter on the edge resets to 240px, it does not collapse (' + g.sec + ')'); assert.ok(!(await page.evaluate(() => !!document.querySelector('.plx-secondary-pane-rail'))), T + 'AC-4: not folded');
      await page.keyboard.press('End'); await wait(150); const edge = await page.evaluate(() => { const r = document.querySelector('.plx-secondary-pane [role=separator]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
      await page.mouse.click(edge.x, edge.y); await page.mouse.click(edge.x, edge.y, { clickCount: 2 }); await wait(300);
      if ((await geo(page)).sec !== 240) await page.evaluate(() => document.querySelector('.plx-secondary-pane [role=separator]').dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))); await wait(300); assert.equal((await geo(page)).sec, 240, T + 'AC-4: a double-click resets it too');
      // the main nav's edge
      s = await sepOf(page, 'nav'); assert.ok(s && s.now === 240 && s.min === 200 && s.max === 320, T + 'AC-3: the nav edge: 240, limits 200 and 320 ' + JSON.stringify(s));
      await page.keyboard.press('End'); await wait(200); assert.equal((await geo(page)).nav, 320, T + 'AC-3: the nav End is 320'); await page.keyboard.press('Home'); await wait(200); assert.equal((await geo(page)).nav, 200, T + 'AC-3: the nav Home is 200');
      await page.keyboard.press('Enter'); await wait(250); g = await geo(page); assert.equal(g.nav, 240, T + 'AC-4: Enter on the nav edge resets to 240px (' + g.nav + ')');
      // AC-5: remembered after a reload
      await sepOf(page, 'sec'); await page.keyboard.press(grow); await page.keyboard.press(grow); await wait(300); assert.equal((await geo(page)).sec, 256);
      await open(page, 1366, dir, false); assert.equal((await geo(page)).sec, 256, T + 'AC-5: the dragged width is remembered after a reload');
      // collapse: the header's button folds the settings pane to a rail; Ctrl+[ folds the main nav
      await page.evaluate(() => document.querySelector('.plx-secondary-pane__header button').click()); await wait(300);
      assert.ok(await page.evaluate(() => !!document.querySelector('.plx-secondary-pane-rail')), T + 'AC-4: Collapse folds the settings pane to a rail');
      await page.close();
      // AC-6: Narrow
      const narrow = await browser.newPage(); narrow.on('pageerror', (e) => errors.push(e.message)); await open(narrow, 480, dir, false); await narrow.evaluate(() => localStorage.clear()); await open(narrow, 480, dir, false);
      const nw = await narrow.evaluate(() => { const p = document.querySelector('.plx-settings .plx-secondary-pane'); return p && { w: Math.round(p.getBoundingClientRect().width), vw: innerWidth, list: p.className.includes('plx-secondary-pane--list') }; });
      assert.ok(nw && nw.list && nw.w >= nw.vw - 2, T + 'AC-6: at Narrow the settings nav is the list of a list-detail screen, the full width: ' + JSON.stringify(nw));
      await narrow.evaluate(() => document.querySelector('.plx-settings .plx-secondary-pane__body button, .plx-settings .plx-secondary-pane__body a').click()); await wait(400);
      const det = await narrow.evaluate(() => ({ back: !!document.querySelector('.plx-secondary-pane-back button, .plx-nav-pane [class*=back], .plx-nav-pane button[class*=parent]') || [...document.querySelectorAll('button')].some((b) => /Back to Settings|العودة إلى/.test(b.textContent)), aside: !!document.querySelector('.plx-settings .plx-secondary-pane--aside'), content: !!document.querySelector('.plx-settings__content') && getComputedStyle(document.querySelector('.plx-settings__content')).display !== 'none' }));
      assert.ok(det.back && det.aside && det.content, T + 'AC-6: choosing a section shows it, the list steps aside, and a Back control leads it: ' + JSON.stringify(det)); await narrow.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('NAV_PANES_1242_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
