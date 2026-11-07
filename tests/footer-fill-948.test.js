/* Plenix tests · footers without a fill (issue 948, D-0102).
   Static ActionBar and the Dialog footer are transparent; a sticky ActionBar takes the surface of the Card (panel) that holds it;
   the Dialog footer shows a hairline only while its body scrolls. Usage: node tests/footer-fill-948.test.js -> FOOTER_FILL_948_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9948, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const theme of ['light', 'dark']) {
      const T = theme + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1366, height: 768 });
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::/.test(m.text())) problems.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate((theme) => { document.documentElement.setAttribute('data-theme', theme);
        window.__mount = async (node) => { window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c"></div>';
          window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(node); await new Promise((r) => setTimeout(r, 500)); }; }, theme);
      const bg = (sel) => page.$eval(sel, (e) => getComputedStyle(e).backgroundColor);
      const topW = (sel) => page.$eval(sel, (e) => parseFloat(getComputedStyle(e).borderTopWidth) * (getComputedStyle(e).borderTopStyle === 'none' ? 0 : 1));
      const CLEAR = 'rgba(0, 0, 0, 0)';

      // a static ActionBar inside a Panel: no fill; a sticky one: the panel's surface
      await page.evaluate(async () => { const h = React.createElement, P = Plenix;
        await window.__mount(h(P.Panel, { id: 'pn', title: 'Card' }, h(P.ActionBar, { sticky: false }, h(P.Button, null, 'Cancel'), h(P.Button, { variant: 'primary' }, 'Save')), h(P.ActionBar, null, h(P.Button, null, 'Cancel')))); });
      assert.equal(await bg('.plx-action-bar--static'), CLEAR, T + 'a static ActionBar has no fill');
      assert.equal(await bg('.plx-action-bar:not(.plx-action-bar--static)'), await bg('.plx-panel'), T + 'a sticky ActionBar takes the surface of the Panel that holds it');

      // a short Dialog: transparent footer and no hairline; a long body: the hairline shows
      for (const long of [false, true]) {
        await page.evaluate(async (long) => { const h = React.createElement, P = Plenix;
          await window.__mount(h(P.Dialog, { open: true, title: 'T', onClose() {}, footer: h(P.Button, null, 'OK') },
            long ? h('div', { style: { height: 2000 } }, 'tall') : h('p', null, 'short'))); }, long);
        await new Promise((r) => setTimeout(r, 300));
        assert.equal(await bg('.plx-dialog__footer'), CLEAR, T + 'the Dialog footer has no fill');
        assert.equal(await topW('.plx-dialog__footer') > 0, long, T + 'the Dialog footer hairline shows only while the body scrolls (long=' + long + ')');
      }
      await page.close();
    }
    assert.deepEqual(problems, [], 'no console errors or warnings: ' + problems.join('|'));
    console.log('FOOTER_FILL_948_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
