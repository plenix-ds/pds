// Plenix tests · #5: the design spec's audit probes (iframes that load whole applications to measure them) stop when the page
// that asked for them is left: after leaving the radius and control-height pages no probe frame is added or kept.
//   node tests/spec-probes-5.test.js   → SPEC_PROBES_5_OK
const assert = require('assert/strict');
const { serve, launch } = require('./lib.js');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9651;
  await serve(PORT); const browser = await launch();
  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:' + PORT + '/Plenix/platform/design-system/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('a[href^="#/"]', { timeout: 60000 });
    await new Promise((r) => setTimeout(r, 5000));
    for (const route of ['#/foundations/radius', '#/foundations/control-heights']) {
      await page.evaluate((h) => { location.hash = h; }, route);
      await new Promise((r) => setTimeout(r, 600));
      await page.evaluate(() => { location.hash = '#/layout/divider'; });
      // a probe frame may be on the way out; give it the time one audit step takes, then none may be left or arrive
      await new Promise((r) => setTimeout(r, 4000));
      const added = await page.evaluate(() => new Promise((res) => { let n = 0; const mo = new MutationObserver((l) => l.forEach((m) => m.addedNodes.forEach((x) => { if (x.nodeName === 'IFRAME' && /probe/.test(x.className)) n++; }))); mo.observe(document.body, { childList: true, subtree: true }); setTimeout(() => { mo.disconnect(); res(n + document.querySelectorAll('iframe.ds-radius-probe').length); }, 6000); }));
      assert.equal(added, 0, route + ': ' + added + ' probe frame(s) after the page was left');
    }
    console.log('SPEC_PROBES_5_OK');
  } catch (e) { console.log('SPEC_PROBES_5_FAIL ' + e.message); await browser.close(); process.exit(1); }
  await browser.close(); process.exit(0);
})();
