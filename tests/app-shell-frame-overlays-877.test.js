/* Plenix tests · AppShell frame="centered": a Drawer opens from the frame's edge, a Toast stays inside the frame (issue 877, design 862 section 4).
   Summary (the browser, left to right and right to left, 1920x1080): with frame="centered" the frame spans 277 to 1643; a Drawer's panel
     meets the frame's inline-end edge (and the inline-start edge for side="start"), its backdrop still covers the whole window, a Toast lies inside the
     frame, a Dialog stays centered on the window; with frame="full" (and in a window of 1366 or less) the Drawer meets the window's edge, the Toast is at the
     window's corner as before
   Usage: node tests/app-shell-frame-overlays-877.test.js   -> APP_SHELL_FRAME_OVERLAYS_877_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9877, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) for (const [frame, width] of [['centered', 1920], ['full', 1920], ['centered', 1280]]) {
      const T = dir + ' ' + frame + ' ' + width + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width, height: 1000 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const got = await page.evaluate(async (dir, frame) => {
        try { localStorage.clear(); } catch (e) { /* none */ }
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = window.Plenix;
        document.querySelector('main').innerHTML = '<div id="v"></div>';
        let api; const Grab = () => { api = P.useToast(); return null; };
        const App = () => { const [side, setSide] = React.useState(null); window.__setSide = setSide;
          return h(P.ToastProvider, null, h(Grab), h(P.AppShell, { frame, header: h(P.AppHeader, { brand: 'Demo' }) }, h('p', null, 'Content'),
            h(P.Drawer, { open: side === 'end' || side === 'start', side: side || 'end', title: 'Details', onClose: () => setSide(null) }, 'Body'),
            h(P.Dialog, { open: side === 'dialog', title: 'Hello', onClose: () => setSide(null) }, 'Body'))); };
        ReactDOM.createRoot(document.getElementById('v')).render(h(App));
        await new Promise((r) => setTimeout(r, 900));
        const wait = () => new Promise((r) => setTimeout(r, 700));
        const shell = document.querySelector('.plx-app-shell').getBoundingClientRect(); const out = { shell: [Math.round(shell.left), Math.round(shell.right)], w: window.innerWidth };
        window.__setSide('end'); await wait(); let p = document.querySelector('.plx-dialog').getBoundingClientRect(); out.end = [Math.round(p.left), Math.round(p.right)];
        const scrim = getComputedStyle(document.querySelector('.plx-modal-layer'), '::before'); const layer = document.querySelector('.plx-modal-layer').getBoundingClientRect(); out.layer = [Math.round(layer.left), Math.round(layer.right)];
        window.__setSide(null); await wait(); window.__setSide('start'); await wait(); p = document.querySelector('.plx-dialog').getBoundingClientRect(); out.start = [Math.round(p.left), Math.round(p.right)];
        window.__setSide(null); await wait(); window.__setSide('dialog'); await wait(); p = document.querySelector('.plx-dialog').getBoundingClientRect(); out.dialog = Math.round((p.left + p.right) / 2); window.__setSide(null); await wait();
        api.show('Saved'); await wait(); const t = document.querySelector('.plx-toast').getBoundingClientRect(); out.toast = [Math.round(t.left), Math.round(t.right)];
        return out;
      }, dir, frame);
      const framed = frame === 'centered' && width > 1366, left = got.shell[0], right = got.shell[1];   // the frame as drawn
      assert.ok(!framed || Math.abs(right - left - 1366) <= 1, T + 'the frame is 1366 wide, got ' + (right - left));
      const rtl = dir === 'rtl', endEdge = rtl ? got.end[0] : got.end[1], startEdge = rtl ? got.start[1] : got.start[0];
      const near = (a, b) => a >= b - 12 && a <= b + 12;   // the panel keeps its small gap to the edge
      assert.ok(near(endEdge, rtl ? left : right), T + 'a Drawer at the end meets the ' + (framed ? 'frame' : 'window') + ' edge, got ' + JSON.stringify(got.end) + ' for ' + left + '..' + right);
      assert.ok(near(startEdge, rtl ? right : left), T + 'a Drawer at the start meets the edge, got ' + JSON.stringify(got.start));
      assert.ok(got.layer[0] === 0 && got.layer[1] >= width - 20, T + 'the backdrop covers the whole window, got ' + JSON.stringify(got.layer));
      assert.ok(Math.abs(got.dialog - width / 2) <= 12, T + 'a Dialog stays centered on the window, got ' + got.dialog);
      assert.ok(got.toast[0] >= left - 1 && got.toast[1] <= right + 1, T + 'the Toast lies inside ' + left + '..' + right + ', got ' + JSON.stringify(got.toast));
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('APP_SHELL_FRAME_OVERLAYS_877_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
