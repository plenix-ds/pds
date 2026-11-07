/* Plenix tests · AppShell frame="centered" overlays (issue 877, D-0093, design §4): a Drawer opens from the frame's edge and a toast stays inside the frame.
   Summary: at 1920x1080 with frame="centered" (the frame 1366px wide, 277px of grey each side): a Drawer's outer edge meets the frame's edge (side "end" and "start", left to right and
     right to left) while its backdrop still covers the whole window; a toast lies inside the frame; a Dialog stays centered in the window with a backdrop over the whole window.
     With frame="full" nothing changes: the Drawer meets the window's edge and the toast sits in the window's corner.
   Proof first: before the change the Drawer opens at the window's edge (on the grey side) and the toast sits in the window's corner.
   Usage: node tests/app-shell-frame-overlays-877.test.js   -> APP_SHELL_FRAME_OVERLAYS_877_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9877, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const run = async (dir, frame, what) => {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 1920, height: 1080 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* none */ } });
      const r = await page.evaluate(async (dir, frame, what) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = window.Plenix;
        document.querySelector('main').innerHTML = '<div id="v"></div>';
        function Toaster() { const t = P.useToast(); React.useEffect(() => { t.show('Saved', { duration: 0 }); }, []); return null; }
        const overlay = what === 'drawer-end' ? h(P.Drawer, { open: true, onClose() {}, title: 'Details', side: 'end' }, 'Body')
          : what === 'drawer-start' ? h(P.Drawer, { open: true, onClose() {}, title: 'Details', side: 'start' }, 'Body')
          : what === 'dialog' ? h(P.Dialog, { open: true, onClose() {}, title: 'Rename' }, 'Body') : h(Toaster, null);
        ReactDOM.createRoot(document.getElementById('v')).render(h(P.ToastProvider, null, h(P.AppShell, { frame, header: h(P.AppHeader, { brand: 'Demo' }) }, h('p', null, 'Page')), overlay));
        await new Promise((res) => setTimeout(res, 1200));
        const rect = (el) => { const b = el.getBoundingClientRect(); return { left: Math.round(b.left), right: Math.round(b.right), width: Math.round(b.width) }; };
        const layer = document.querySelector('.plx-modal-layer'), panel = document.querySelector('.plx-dialog'), toast = document.querySelector('.plx-toast');
        const shell = document.querySelector('.plx-app-shell'); return { shell: rect(shell), layer: layer && rect(layer), panel: panel && rect(panel), toast: toast && rect(toast), vw: window.innerWidth };
      }, dir, frame, what);
      await page.close(); return r;
    };
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      for (const side of ['end', 'start']) {
        const r = await run(dir, 'centered', 'drawer-' + side), leftEdge = r.shell.left, rightEdge = r.shell.right, atRight = (side === 'end') === (dir === 'ltr');
        assert.ok(r.panel, T + side + ' drawer is on the page');
        if (atRight) assert.ok(Math.abs(r.panel.right - rightEdge) <= 1, T + side + ' drawer meets the frame\'s right edge (' + rightEdge + '), got ' + r.panel.right);
        else assert.ok(Math.abs(r.panel.left - leftEdge) <= 1, T + side + ' drawer meets the frame\'s left edge (' + leftEdge + '), got ' + r.panel.left);
        assert.ok(r.layer.left <= 0 && r.layer.right >= r.vw - 20, T + side + ' drawer: the backdrop still covers the whole window');
        const full = await run(dir, 'full', 'drawer-' + side);
        assert.ok(atRight ? full.panel.right === full.layer.right : full.panel.left === 0, T + side + ' drawer at frame="full" meets the window\'s edge, got ' + JSON.stringify(full.panel));
      }
      const t = await run(dir, 'centered', 'toast'), leftEdge = t.shell.left, rightEdge = t.shell.right;
      assert.ok(t.toast.left >= leftEdge - 1 && t.toast.right <= rightEdge + 1, T + 'the toast lies inside the frame, got ' + JSON.stringify(t.toast));
      const tf = await run(dir, 'full', 'toast');
      assert.ok(tf.toast.left < leftEdge || tf.toast.right > rightEdge, T + 'at frame="full" the toast sits in the window\'s corner, got ' + JSON.stringify(tf.toast));
      const d = await run(dir, 'centered', 'dialog');
      assert.ok(Math.abs((d.panel.left + d.panel.right) / 2 - (d.layer.left + d.layer.right) / 2) <= 2 && d.layer.left <= 0 && d.layer.right >= d.vw - 20, T + 'a Dialog stays centered in the window with its backdrop over the whole window, got ' + JSON.stringify(d));
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('APP_SHELL_FRAME_OVERLAYS_877_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
