/* Plenix tests · a Drawer slides in with its own motion, not the dialog's pop-in (issue 912). Dialog's motion block came
   after the Drawer's rules, and a Drawer is also a .plx-dialog, so left to right both sides popped in like a dialog.
   Written before the fix: left to right, a Drawer's animation-name was motion-pop-in.
   Summary (the browser, 1280 x 800):
     left to right: a Drawer at the end slides in from the right (motion-slide-in-right), at the start from the left
       (motion-slide-in-left), each with the Drawer's own duration token; a Dialog pops in (motion-pop-in)
     right to left: the end slides in from the left, the start from the right; a Dialog pops in
     reduced motion: every one of them has a duration of 0s
     no script errors
   Usage: node tests/drawer-motion-912.test.js   → DRAWER_MOTION_912_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

(async () => {
  const PORT = +process.env.TEST_PORT || 9690, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const draw = (kind, side, dir) => page.evaluate(async (kind, side, dir) => {
      const h = React.createElement, P = window.Plenix;
      document.documentElement.setAttribute('dir', dir);
      window.__root && window.__root.unmount();
      document.getElementById('main').innerHTML = '<div id="c"></div>';
      window.__root = ReactDOM.createRoot(document.getElementById('c'));
      window.__root.render(kind === 'drawer'
        ? h(P.Drawer, { open: true, onClose() {}, title: 'Details', side }, 'Body')
        : h(P.Dialog, { open: true, onClose() {}, title: 'Rename' }, 'Body'));
      await new Promise((r) => setTimeout(r, 300));
      const el = document.querySelector(kind === 'drawer' ? '.plx-drawer' : '.plx-dialog'), cs = getComputedStyle(el);
      const token = getComputedStyle(document.documentElement).getPropertyValue('--plx-sys-motion-duration-base').trim();
      return { name: cs.animationName, duration: cs.animationDuration, base: token };
    }, kind, side, dir);
    const seconds = (v) => (/ms$/.test(v) ? parseFloat(v) / 1000 : parseFloat(v));

    const want = { ltr: { end: 'motion-slide-in-right', start: 'motion-slide-in-left' }, rtl: { end: 'motion-slide-in-left', start: 'motion-slide-in-right' } };
    for (const dir of ['ltr', 'rtl']) {
      for (const side of ['end', 'start']) {
        const r = await draw('drawer', side, dir);
        assert.equal(r.name, want[dir][side], dir + ': a Drawer at the ' + side + ' slides in with ' + want[dir][side] + '; got ' + r.name);
        assert.equal(seconds(r.duration), seconds(r.base), dir + ': the ' + side + ' Drawer takes its own duration (the base duration ' + r.base + '); got ' + r.duration);
      }
      const d = await draw('dialog', null, dir);
      assert.equal(d.name, 'motion-pop-in', dir + ': a Dialog still pops in; got ' + d.name);
    }

    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    for (const dir of ['ltr', 'rtl']) for (const [kind, side] of [['drawer', 'end'], ['drawer', 'start'], ['dialog', null]]) {
      const r = await draw(kind, side, dir);
      assert.equal(seconds(r.duration), 0, dir + ': with reduced motion the ' + (side ? side + ' ' : '') + kind + ' does not move (0s); got ' + r.duration);
    }

    assert.deepEqual(errors, [], 'no script errors');
    console.log('DRAWER_MOTION_912_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
