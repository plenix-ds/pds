/* Plenix tests · pane starting widths (issue 463, option C; changed by #1243, ADR 0057, D-0168): the navigation panes keep ONE width at every window size, and only the side panel
   (content, not navigation) starts wider on larger windows: nav 240 | secondary sm 180, md 240, lg 280 | side panel 240 under 1440px, 320 from 1440px up to 1919px,
   400 from 1920px. A width dragged to or set by an app wins (not tested here). The secondary pane's narrowest drag stays 180px on every window.
   Summary: a NavPane, three SecondaryPanes and a SidePanel with no size set are measured at 1439, 1440, 1919 and 1920px and match the table.
   Usage: node tests/pane-defaults.test.js   (run by layout.test.js when AppShell or a pane of the shell changed) */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
const TABLE = [[1439, [240, 180, 240, 280, 240]], [1440, [240, 180, 240, 280, 320]], [1919, [240, 180, 240, 280, 320]], [1920, [240, 180, 240, 280, 400]]];
(async () => {
  const PORT = +process.env.TEST_PORT || 9617, server = await serve(PORT); let browser;
  try {
    browser = await launch();
    for (const [width, want] of TABLE) {
      const page = await browser.newPage(); const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.setViewport({ width, height: 900 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const got = await page.evaluate(async () => {
        document.querySelector('main').innerHTML = '<div id="c"></div>';
        const h = React.createElement, P = window.Plenix;
        ReactDOM.createRoot(document.getElementById('c')).render(h('div', { className: 'row' },
          h('div', { id: 'nav' }, h(P.NavPane, { label: 'Nav' }, 'n')),
          h('div', { id: 's1' }, h(P.SecondaryPane, { title: 'S', width: 'sm' }, 's')), h('div', { id: 's2' }, h(P.SecondaryPane, { title: 'M' }, 'm')), h('div', { id: 's3' }, h(P.SecondaryPane, { title: 'L', width: 'lg' }, 'l')),
          h('div', { id: 'side' }, h(P.SidePanel, { title: 'Details', open: true }, 'x'))));
        await new Promise((r) => setTimeout(r, 400));
        const w = (s) => Math.round(document.querySelector(s).getBoundingClientRect().width);
        return [w('#nav .plx-nav-pane'), w('#s1 .plx-secondary-pane'), w('#s2 .plx-secondary-pane'), w('#s3 .plx-secondary-pane'), w('#side .plx-side-panel')];
      });
      // the narrowest a secondary pane can be dragged is 180 on every window (its own token, not the small width, which rises)
      const least = await page.evaluate(() => { const e = document.createElement('div'); document.documentElement.appendChild(e); const v = getComputedStyle(document.documentElement).getPropertyValue('--plx-comp-secondary-pane-width-min'); e.remove(); return parseFloat(v); });
      assert.equal(least, 180, 'the secondary pane\'s narrowest drag at ' + width + 'px');
      assert.deepEqual(errors, [], 'no script errors at ' + width + 'px');
      assert.deepEqual(got, want, 'starting widths at ' + width + 'px: nav, secondary sm, md, lg, side panel');
      await page.close();
    }
    console.log('pane-defaults: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
