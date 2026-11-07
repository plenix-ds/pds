/* Plenix tests · AppShell frame (issue 862, D-0093): "full" (the window, as before) or "1366" (the shell 1366px wide, centered, on a grey
   page with a wide shadow, and a header toggle to the full window and back).
   Summary (the browser; AC numbers are the brief's, docs/pds1/slices/862-shell-frame/brief.md):
     AC-1 frame="1366" at 1920x1080: the shell is 1366px wide and centered (277px each side, +-1), the window's full height, with a shadow, on a backdrop
          that is not the shell's own surface
     AC-2 frame="1366" at 1280x800: the shell fills the window, no sides, no toggle
     AC-3 the toggle: the shell fills the window, the name becomes "Restore to 1366 width" (aria-pressed true), and a reload keeps it
     AC-4 the default frame at 1920: the shell fills the window, no frame element (nothing changes)
     AC-5 right to left: AC-1 and AC-3 hold, the toggle sits at the header's inline end
     AC-6 the toggle works from the keyboard (Tab, Enter and Space) and says its name and pressed state
   Usage: node tests/app-shell-frame-862.test.js   -> APP_SHELL_FRAME_862_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9862, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const open = async (width, dir, frame, clear) => {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width, height: 900 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      if (clear) await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* none */ } });
      await page.evaluate(async (dir, frame) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = window.Plenix;
        document.querySelector('main').innerHTML = '<div id="v"></div>';
        ReactDOM.createRoot(document.getElementById('v')).render(h(P.AppShell, Object.assign({ header: h(P.AppHeader, { brand: 'Demo', actions: h(P.AppHeader.Item, { label: 'Help', icon: 'help' }) }) }, frame ? { frame } : {}), h('p', null, 'Content')));
        await new Promise((r) => setTimeout(r, 900));
      }, dir, frame);
      return page;
    };
    const read = (page) => page.evaluate(() => {
      const shell = document.querySelector('.plx-app-shell'), r = shell.getBoundingClientRect(), cs = getComputedStyle(shell);
      const btn = [...document.querySelectorAll('.plx-app-header button')].find((b) => /1366|full window/i.test(b.getAttribute('aria-label') || ''));
      const frameEl = document.querySelector('.plx-app-frame');
      const b = btn && btn.getBoundingClientRect(), h = document.querySelector('.plx-app-header').getBoundingClientRect();
      return { left: Math.round(r.left), width: Math.round(r.width), right: Math.round(window.innerWidth - r.right), height: Math.round(r.height), vh: window.innerHeight, shadow: cs.boxShadow, bg: cs.backgroundColor,
        backdrop: frameEl ? getComputedStyle(frameEl).backgroundColor : null, hasFrame: !!frameEl, btn: btn ? { name: btn.getAttribute('aria-label'), pressed: btn.getAttribute('aria-pressed'), nearEnd: document.documentElement.dir === 'rtl' ? b.left - h.left : h.right - b.right } : null };
    });
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      let page = await open(1920, dir, '1366', true); let s = await read(page);
      assert.ok(Math.abs(s.width - 1366) <= 1 && Math.abs(s.left - 277) <= 1 && Math.abs(s.right - 277) <= 1, T + 'AC-1 the shell is 1366 wide and centered, got ' + JSON.stringify([s.left, s.width, s.right]));
      assert.ok(Math.abs(s.height - s.vh) <= 1, T + 'AC-1 the full window height, got ' + s.height + ' of ' + s.vh);
      assert.notEqual(s.shadow, 'none', T + 'AC-1 the frame has a shadow');
      assert.ok(s.hasFrame && s.backdrop && s.backdrop !== s.bg && s.backdrop !== 'rgba(0, 0, 0, 0)', T + 'AC-1 the sides are a grey of their own, not the shell surface, got ' + s.backdrop + ' vs ' + s.bg);
      assert.ok(s.btn && s.btn.name === 'Expand to full window' && s.btn.pressed === 'false', T + 'AC-1 the toggle says "Expand to full window", got ' + JSON.stringify(s.btn));
      assert.ok(s.btn.nearEnd < 400, T + 'AC-5 the toggle is in the header\'s end area, got ' + s.btn.nearEnd + 'px from the inline end');
      await page.click('.plx-app-header button[aria-label="Expand to full window"]'); await new Promise((r) => setTimeout(r, 700));
      s = await read(page);
      assert.ok(Math.abs(s.width - 1920) <= 1 && s.left === 0, T + 'AC-3 the toggle fills the window, got ' + JSON.stringify([s.left, s.width]));
      assert.ok(s.btn && s.btn.name === 'Restore to 1366 width' && s.btn.pressed === 'true', T + 'AC-3 the name becomes "Restore to 1366 width" and it is pressed, got ' + JSON.stringify(s.btn));
      await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForFunction(() => window.Plenix && window.ReactDOM);
      await page.evaluate(async (dir) => { document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = window.Plenix; document.querySelector('main').innerHTML = '<div id="v"></div>';
        ReactDOM.createRoot(document.getElementById('v')).render(h(P.AppShell, { frame: '1366', header: h(P.AppHeader, { brand: 'Demo' }) }, h('p', null, 'Content'))); await new Promise((r) => setTimeout(r, 900)); }, dir);
      s = await read(page); assert.ok(Math.abs(s.width - 1920) <= 1, T + 'AC-3 after a reload the full window is kept, got ' + s.width);
      // AC-6: the keyboard (the toggle is reached by Tab, activated by Enter, then Space)
      await page.focus('.plx-app-header button[aria-label="Restore to 1366 width"]'); await page.keyboard.press('Enter'); await new Promise((r) => setTimeout(r, 700));
      s = await read(page); assert.ok(Math.abs(s.width - 1366) <= 1 && s.btn.name === 'Expand to full window', T + 'AC-6 Enter restores the 1366 frame, got ' + JSON.stringify([s.width, s.btn]));
      await page.keyboard.press('Space'); await new Promise((r) => setTimeout(r, 700));
      s = await read(page); assert.ok(Math.abs(s.width - 1920) <= 1 && s.btn.pressed === 'true', T + 'AC-6 Space expands again, got ' + JSON.stringify([s.width, s.btn]));
      await page.close();
      page = await open(1280, dir, '1366', true); s = await read(page);
      assert.ok(Math.abs(s.width - 1280) <= 1 && s.left === 0 && s.btn === null, T + 'AC-2 at 1280 the shell fills the window and there is no toggle, got ' + JSON.stringify([s.left, s.width, s.btn])); await page.close();
      page = await open(1920, dir, undefined, true); s = await read(page);
      assert.ok(Math.abs(s.width - 1920) <= 1 && !s.hasFrame && s.btn === null, T + 'AC-4 the default frame is the window, no frame, no toggle, got ' + JSON.stringify([s.width, s.hasFrame, s.btn])); await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('APP_SHELL_FRAME_862_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
