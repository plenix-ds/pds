/* Plenix tests · navigation panes (issues 1242 and 1243, ADR 0057, design 1242, D-0168, D-0169): the settings nav is a docked SecondaryPane, and every navigation pane has one standard width, resizable.
   Summary: SettingsLayout draws a SecondaryPane in PagePanes (no card, no margin, titled "Settings"); at 1366 and 1920 px a NavPane and the settings pane are 240px; Arrow Right adds 8px, End reaches the max, Home the min;
     Enter and a double-click reset to 240px and do not collapse; the Collapse button folds it to the rail; the AppShell's nav pane resets the same way. Left to right and right to left.
   Proof first: before the change the nav is a NavPane card in .plx-settings__frame, the panes step up with the window, and Enter on the edge collapses.
   Usage: node tests/nav-panes-1243.test.js   → NAV_PANES_1243_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9997, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const [dir, width] of [['ltr', 1920], ['ltr', 1366], ['rtl', 1920]]) {
      const T = dir + ' ' + width + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.setViewport({ width, height: 800 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* none */ } });
      const mount = (what) => page.evaluate(async (dir, what) => {
        document.documentElement.setAttribute('dir', dir);
        const h = React.createElement, P = Plenix; window.__root && window.__root.unmount();
        const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c); window.__root = ReactDOM.createRoot(c);
        const nav = h(P.NavList, { label: 'Settings sections', groups: [{ items: [{ id: 'a', label: 'General' }, { id: 'b', label: 'Notifications' }] }], value: 'a', onSelect() {} });
        if (what === 'settings') window.__root.render(h('div', { style: { height: 600, display: 'flex', flexDirection: 'column' } }, h(P.SettingsLayout, { nav }, h(P.SettingsSection, { title: 'Regional' }, h(P.SettingsRow, { label: 'Date format' }, 'x')))));
        else window.__root.render(h(P.AppShell, { sideNav: h(P.NavPane, { label: 'Main' }, 'n'), header: h(P.AppHeader, { brand: 'Demo' }) }, h(P.PageContent, null, 'Content')));
        await new Promise((r) => setTimeout(r, 900));
      }, dir, what);
      const w = (sel) => page.evaluate((s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().width) : null; }, sel);
      // 1242: structure
      await mount('settings');
      const s = await page.evaluate(() => { const p = document.querySelector('.plx-secondary-pane'); if (!p) return null; const cs = getComputedStyle(p), t = p.querySelector('.plx-secondary-pane__title');
        return { inPanes: !!p.closest('.plx-page-panes'), card: !!document.querySelector('.plx-settings__nav, .plx-settings__frame'), title: t && t.textContent, mt: cs.marginTop, ms: cs.marginInlineStart, role: t && getComputedStyle(t).fontSize + '/' + getComputedStyle(t).fontWeight, top: Math.round(p.getBoundingClientRect().top),
          layoutTop: Math.round(document.querySelector('.plx-settings').getBoundingClientRect().top), sep: !!p.querySelector('[role=separator]'), collapse: !!p.querySelector('button[aria-label^="Collapse"]') }; });
      assert.ok(s && s.inPanes && !s.card, T + 'the nav is a SecondaryPane in PagePanes, no card frame ' + JSON.stringify(s));
      assert.equal(s.title, 'Settings', T + 'the pane is titled Settings'); assert.equal(s.mt + s.ms, '0px0px', T + 'no outer margin'); assert.equal(s.top, s.layoutTop, T + 'it starts at the top of the layout');
      assert.ok(s.sep && s.collapse, T + 'resizable and collapsible');
      // 1243: widths
      assert.equal(await w('.plx-secondary-pane'), 240, T + 'the settings pane is 240px');
      const sep = '.plx-secondary-pane [role=separator]';
      const val = () => page.evaluate((q) => +document.querySelector(q).getAttribute('aria-valuenow'), sep);
      await page.focus(sep); const mirror = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
      await page.keyboard.press(mirror); await wait(150); assert.equal(await w('.plx-secondary-pane'), 248, T + 'the arrow adds 8px');
      await page.keyboard.press('End'); await wait(150); assert.equal(await w('.plx-secondary-pane'), 400, T + 'End reaches the max');
      await page.keyboard.press('Home'); await wait(150); assert.equal(await w('.plx-secondary-pane'), 184, T + 'Home reaches the min (180, on the 8px drag grid: 184)');
      await page.keyboard.press('Enter'); await wait(200);
      assert.equal(await w('.plx-secondary-pane'), 240, T + 'Enter resets to 240px and does not collapse');
      await page.keyboard.press('End'); await wait(150);
      await page.evaluate((q) => { document.querySelector(q).dispatchEvent(new MouseEvent('dblclick', { bubbles: true })); }, sep); await wait(200);
      assert.equal(await w('.plx-secondary-pane'), 240, T + 'a double-click resets to 240px');
      await page.click('.plx-secondary-pane button[aria-label^="Collapse"]'); await wait(300);
      assert.equal(await page.evaluate(() => !document.querySelector('.plx-secondary-pane') && !!document.querySelector('.plx-secondary-pane-rail')), true, T + 'Collapse folds it to the rail');
      // the main nav
      await mount('shell');
      assert.equal(await w('.plx-nav-pane'), 240, T + 'the main nav is 240px');
      const nsep = '.plx-nav-pane [role=separator]';
      await page.focus(nsep); await page.keyboard.press('End'); await wait(200); assert.equal(await w('.plx-nav-pane'), 320, T + 'the nav pane resizes to its max');
      await page.keyboard.press('Enter'); await wait(250); assert.equal(await w('.plx-nav-pane'), 240, T + 'Enter on the nav edge resets to 240px (not collapse)');
      await page.close();
    }
    // G5c finding 1 (WCAG 1.4.10 Reflow): at Narrow, without the app's pane.detailOpen, the nav stacks above the content; nothing scrolls sideways
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ' 375: ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.setViewport({ width: 375, height: 800 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* none */ } });
      await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir);
        const h = React.createElement, P = Plenix;
        const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c); const root = ReactDOM.createRoot(c);
        const nav = h(P.NavList, { label: 'Settings sections', groups: [{ items: [{ id: 'a', label: 'General' }, { id: 'b', label: 'Notifications' }] }], value: 'a', onSelect() {} });
        root.render(h('div', { style: { display: 'flex', flexDirection: 'column' } }, h(P.SettingsLayout, { nav }, h(P.SettingsSection, { title: 'Regional' }, h(P.SettingsRow, { label: 'Date format' }, 'x')))));
        await new Promise((r) => setTimeout(r, 900));
      }, dir);
      const m = await page.evaluate(() => { const p = document.querySelector('.plx-secondary-pane'), c = document.querySelector('.plx-settings__content');
        const pr = p.getBoundingClientRect(), cr = c.getBoundingClientRect();
        return { paneW: Math.round(pr.width), contentW: Math.round(cr.width), paneBottom: Math.round(pr.bottom), contentTop: Math.round(cr.top), vw: innerWidth,
          scrollW: document.documentElement.scrollWidth, sep: !!p.querySelector('[role=separator]'), collapse: !!p.querySelector('button[aria-label^="Collapse"]') }; });
      assert.ok(m.contentW >= m.vw - 48, T + 'the content is not squeezed beside the pane ' + JSON.stringify(m));
      assert.ok(m.paneBottom <= m.contentTop + 1, T + 'the nav stacks above the content ' + JSON.stringify(m));
      assert.ok(m.scrollW <= m.vw, T + 'nothing scrolls sideways ' + JSON.stringify(m));
      assert.ok(!m.sep && !m.collapse, T + 'a stacked nav has no resize edge or Collapse button ' + JSON.stringify(m));
      await page.close();
    }
    // G5c finding 2: folding and unfolding the pane keeps focus on a control (the button that took its place)
    {
      const T = 'focus: ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.setViewport({ width: 1366, height: 800 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* none */ } });
      await page.evaluate(async () => {
        const h = React.createElement, P = Plenix;
        const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c); const root = ReactDOM.createRoot(c);
        const nav = h(P.NavList, { label: 'Settings sections', groups: [{ items: [{ id: 'a', label: 'General' }] }], value: 'a', onSelect() {} });
        root.render(h('div', { style: { height: 600, display: 'flex', flexDirection: 'column' } }, h(P.SettingsLayout, { nav }, h(P.SettingsSection, { title: 'Regional' }, 'x'))));
        await new Promise((r) => setTimeout(r, 900));
      });
      const label = () => page.evaluate(() => (document.activeElement && document.activeElement.getAttribute('aria-label')) || null);
      await page.click('.plx-secondary-pane button[aria-label^="Collapse"]'); await wait(300);
      assert.match(String(await label()), /^Expand/, T + 'after folding, focus is on the Expand button');
      await page.keyboard.press('Enter'); await wait(300);
      assert.match(String(await label()), /^Collapse/, T + 'after unfolding, focus is on the Collapse button');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('NAV_PANES_1243_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
