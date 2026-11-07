/* Plenix tests · plan §7e baseline behaviour tests, overlays and drop family (issue 908): Scrim, Spotlight, ContextualHelp, DropZone.
   Summary: each part mounts without errors or console warnings (development React); its states have the right ARIA; disabled steps fire nothing; the keyboard reaches and uses
     everything clickable (Tab, Enter, Space) with a visible focus ring; long text (three times the English) and empty values do not overflow; right to left mirrors; no axe violations
     (WCAG 2.2 A and AA). Left to right and right to left.
   Parts: Scrim (hidden from assistive technology, never a Tab stop, one click one onClick, the page locks and unlocks, contained covers its parent), Spotlight (closed draws nothing, four dim panels that never
     cover the target, Escape dismisses, the beacon dims nothing), ContextualHelp (the button opens by click, Enter or Space and never by hover, focus moves in and returns on Escape, outside click closes,
     inline is plain text with one Tab stop), DropZone (as a button it opens the picker by Enter and Space, active and reject states, reject says it in words).
   Usage: node tests/behaviour-908-overlays.test.js   → BEHAVIOUR_908_OVERLAYS_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9910, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.addScriptTag({ url: 'http://localhost:' + PORT + '/Plenix/node_modules/axe-core/axe.min.js' }).catch(() => {});
      const mount = (expr, width = 700) => page.evaluate(async (dir, expr, width) => {
        document.documentElement.setAttribute('dir', dir); window.__log = [];
        window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c" style="inline-size:' + width + 'px"></div>';
        const h = React.createElement, P = window.Plenix; window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(eval(expr)); await new Promise((r) => setTimeout(r, 500));
      }, dir, expr, width);
      const axeViolations = () => page.evaluate(async () => !window.axe ? -1 : (await window.axe.run(document.getElementById('c'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] }, resultTypes: ['violations'] })).violations.filter((v) => v.id !== 'region').map((v) => v.id));
      const overflow = () => page.evaluate(() => { const c = document.getElementById('c'); return c.scrollWidth - c.clientWidth; });
      const log = () => page.evaluate(() => window.__log);
      const tab = async (n = 1) => { for (let i = 0; i < n; i++) await page.keyboard.press('Tab'); };
      const focused = () => page.evaluate(() => { const e = document.activeElement; return e && e !== document.body ? (e.getAttribute('aria-label') || e.textContent.trim()) : null; });
      const focusRing = () => page.evaluate(() => { const e = document.activeElement, cs = getComputedStyle(e); return (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none'; });

      // ---- Scrim
      await mount("h('div', null, h('p', null, 'Page'), h(P.Scrim, { onClick: () => window.__log.push('scrim') }))");
      let r = await page.evaluate(() => { const s = document.querySelector('#c .plx-scrim'), b = s.getBoundingClientRect(); return { hidden: s.getAttribute('aria-hidden'), tab: s.tabIndex, w: Math.round(b.width), vw: window.innerWidth, locked: getComputedStyle(document.documentElement).overflow + '|' + getComputedStyle(document.body).overflow }; });
      assert.ok(r.hidden === 'true' && r.tab < 0, T + 'Scrim: hidden from assistive technology and never a Tab stop');
      assert.ok(r.w >= r.vw - 20, T + 'Scrim: over the window it covers it (' + r.w + ' of ' + r.vw + ')');
      assert.ok(/hidden|clip/.test(r.locked), T + 'Scrim: over the window the page cannot scroll (' + r.locked + ')');
      await page.mouse.click(500, 400); assert.deepEqual(await log(), ['scrim'], T + 'Scrim: a click on it runs onClick once');
      await mount("h('div', { style: { position: 'relative', height: 120 } }, h(P.Scrim, { contained: true, variant: 'light' }))");
      r = await page.evaluate(() => { const s = document.querySelector('#c .plx-scrim'), b = s.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height), locked: getComputedStyle(document.body).overflow }; });
      assert.ok(r.w <= 700 && r.h <= 130, T + 'Scrim: contained covers its parent, not the window (' + r.w + 'x' + r.h + ')');
      assert.ok(!/hidden/.test(r.locked), T + 'Scrim: contained does not lock the page');
      await page.mouse.click(100, 60); assert.deepEqual(await log(), [], T + 'Scrim: without onClick a click does nothing');
      await mount("h('div', { style: { position: 'relative', height: 120 } }, h(P.Scrim, { contained: true }))");
      assert.deepEqual(await axeViolations(), [], T + 'Scrim: no axe violations');
      await mount("h('p', null, 'after')"); assert.ok(!/hidden/.test(await page.evaluate(() => getComputedStyle(document.body).overflow)), T + 'Scrim: the page scrolls again when it is gone');

      // ---- Spotlight
      await mount("h('div', null, h(P.Button, { id: 'tgt' }, 'Filters'), h(P.Spotlight, { target: () => document.getElementById('tgt'), open: false }))");
      assert.equal(await page.$$eval('#c .plx-spotlight', (e) => e.length), 0, T + 'Spotlight: closed, it draws nothing');
      await mount("h('div', { style: { position: 'relative', height: 160, padding: 40 } }, h(P.Button, { id: 'tgt' }, 'Filters'), h(P.Spotlight, { target: document.getElementById('tgt') || null, open: true, contained: true, onDismiss: () => window.__log.push('dismiss') }))");
      await page.evaluate(() => { window.__root.render(React.createElement('div', { style: { position: 'relative', height: 160, padding: 40 } }, React.createElement(window.Plenix.Button, { id: 'tgt' }, 'Filters'), React.createElement(window.Plenix.Spotlight, { target: document.getElementById('tgt'), open: true, contained: true, onDismiss: () => window.__log.push('dismiss') }))); });
      await new Promise((res) => setTimeout(res, 600));
      r = await page.evaluate(() => { const s = document.querySelector('#c .plx-spotlight'), t = document.getElementById('tgt').getBoundingClientRect(); const at = document.elementFromPoint(t.left + t.width / 2, t.top + t.height / 2); return { has: !!s, hidden: s && s.getAttribute('aria-hidden'), panels: s ? s.querySelectorAll('.plx-spotlight__dim').length : 0, targetReachable: at && (at.id === 'tgt' || !!at.closest('#tgt')) }; });
      assert.ok(r.has && r.hidden === 'true' && r.panels === 4, T + 'Spotlight: four dimmed panels, hidden from assistive technology ' + JSON.stringify(r));
      assert.ok(r.targetReachable, T + 'Spotlight: the target is never covered, it keeps its pointer');
      await page.keyboard.press('Escape'); assert.deepEqual(await log(), ['dismiss'], T + 'Spotlight: Escape runs onDismiss once');
      await page.evaluate(() => { window.__root.render(React.createElement('div', { style: { position: 'relative', height: 160, padding: 40 } }, React.createElement(window.Plenix.Button, { id: 'tgt' }, 'Filters'), React.createElement(window.Plenix.Spotlight, { target: document.getElementById('tgt'), open: true, contained: true, variant: 'beacon' }))); });
      await new Promise((res) => setTimeout(res, 400));
      r = await page.evaluate(() => ({ dim: document.querySelectorAll('#c .plx-spotlight__dim').length, beacon: document.querySelectorAll('#c .plx-spotlight__beacon').length }));
      assert.ok(r.dim === 0 && r.beacon === 1, T + 'Spotlight: a beacon dims nothing ' + JSON.stringify(r));
      assert.deepEqual(await axeViolations(), [], T + 'Spotlight: no axe violations');

      // ---- ContextualHelp
      await mount("h('div', null, 'Retention ', h(P.ContextualHelp, { title: 'Retention', link: { href: '#help', label: 'About retention' } }, 'Deleted files stay in the trash for 30 days.'))");
      assert.equal(await page.$eval('#c button', (b) => b.getAttribute('aria-label')), 'More about Retention', T + 'ContextualHelp: the info button is named by its title');
      await tab(); assert.ok(await focusRing(), T + 'ContextualHelp: Tab reaches it and focus is visible');
      await page.hover('#c button'); await new Promise((res) => setTimeout(res, 500));
      assert.ok(!(await page.$('[role=dialog]')), T + 'ContextualHelp: it never opens on hover');
      await page.keyboard.press('Enter'); await new Promise((res) => setTimeout(res, 500));
      assert.ok(/30 days/.test(await page.evaluate(() => document.body.textContent)) && await page.$('[role=dialog]'), T + 'ContextualHelp: Enter opens the explanation in a popover');
      assert.ok(await page.evaluate(() => !!document.activeElement.closest('[role=dialog]')), T + 'ContextualHelp: focus moves into the popover');
      assert.ok(await page.$('[role=dialog] a[href="#help"]'), T + 'ContextualHelp: the link to more help is in the popover');
      assert.deepEqual(await axeViolations(), [], T + 'ContextualHelp: no axe violations while open');
      await page.keyboard.press('Escape'); await new Promise((res) => setTimeout(res, 400));
      assert.ok(!(await page.$('[role=dialog]')) && (await page.evaluate(() => document.activeElement.getAttribute('aria-label'))) === 'More about Retention', T + 'ContextualHelp: Escape closes it and returns focus to the button');
      await page.keyboard.press('Space'); await new Promise((res) => setTimeout(res, 400)); assert.ok(await page.$('[role=dialog]'), T + 'ContextualHelp: Space opens it');
      await page.mouse.click(5, 5); await new Promise((res) => setTimeout(res, 400)); assert.ok(!(await page.$('[role=dialog]')), T + 'ContextualHelp: a click outside closes it');
      await mount("h(P.ContextualHelp, { variant: 'inline', title: 'Tip', link: { href: '#more', label: 'Learn more' } }, 'Drop files anywhere on the page to upload them.')");
      assert.ok(/Drop files/.test(await page.$eval('#c', (o) => o.textContent)) && !(await page.$('#c button')), T + 'ContextualHelp: inline shows the tip in place, with no button');
      await tab(); assert.equal(await focused(), 'Learn more', T + 'ContextualHelp: inline, the link is the one Tab stop');
      await mount("h(P.ContextualHelp, { variant: 'inline', title: 'A very long tip title that goes on' }, 'An explanation that is three times as long as the English one and keeps going and going and going so that the wrapping of the tip is tested properly.')", 300);
      assert.ok((await overflow()) <= 1, T + 'ContextualHelp: a long tip wraps, no overflow (' + (await overflow()) + 'px)');
      await mount("h(P.ContextualHelp, { variant: 'inline', title: 'Tip' }, 'Short tip.')");
      assert.deepEqual(await axeViolations(), [], T + 'ContextualHelp: inline, no axe violations');

      // ---- DropZone
      await mount("h(P.DropZone, { as: 'button', onClick: () => window.__log.push('pick') }, 'Drop files or click to choose')");
      assert.equal(await page.$eval('#c .plx-drop-zone', (e) => e.tagName), 'BUTTON', T + 'DropZone: as a button it is a native button');
      await tab(); assert.ok(await focusRing(), T + 'DropZone: Tab reaches it and focus is visible'); await page.keyboard.press('Enter'); await page.keyboard.press('Space');
      assert.deepEqual(await log(), ['pick', 'pick'], T + 'DropZone: Enter and Space each open the picker once');
      await mount("h(P.DropZone, { active: true }, 'Drop files here')"); assert.ok(await page.$eval('#c .plx-drop-zone', (e) => e.classList.contains('is-active')), T + 'DropZone: active shows the highlight');
      await mount("h(P.DropZone, { reject: true, rejectContent: 'Only images can go here' }, 'Drop images here')");
      assert.ok(await page.$eval('#c .plx-drop-zone', (e) => e.classList.contains('is-reject') && /Only images/.test(e.textContent)), T + 'DropZone: reject says it in words, not by color alone');
      await mount("h(P.DropZone, { name: 'Archive', onDropItem() {}, accepts: () => true }, 'Archive')"); assert.ok(await page.$('#c .plx-drop-zone'), T + 'DropZone: a data drop target mounts');
      await mount("h(P.DropZone, null, 'Drop here a file with a very long name that goes on and on and on and on and on and on and never stops being long')", 260);
      assert.ok((await overflow()) <= 1, T + 'DropZone: long text wraps, no overflow (' + (await overflow()) + 'px)');
      await mount("h(P.DropZone, null)"); assert.ok(await page.$('#c .plx-drop-zone'), T + 'DropZone: empty content does not break it');
      await mount("h(P.DropZone, { as: 'button' }, 'Drop files or click to choose')");
      assert.deepEqual(await axeViolations(), [], T + 'DropZone: no axe violations');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or console warnings: ' + problems.join(' | '));
    console.log('BEHAVIOUR_908_OVERLAYS_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
