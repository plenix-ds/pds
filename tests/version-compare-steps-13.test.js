// Plenix tests · #13: VersionCompare's Previous/Next change buttons stay on one row at 320px (fit-and-overflow §2: the labels
// hide and the icons stay, with their names as the accessible name and the tooltip), left to right and right to left.
//   node tests/version-compare-steps-13.test.js   → VERSION_COMPARE_STEPS_13_OK
// The St. John test site's document page (#/document/d1) shows a VersionCompare (tests/site.js).
const assert = require('assert/strict');
const { serve, launch, sleep } = require('./lib.js');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 8871;
  await serve(PORT); const browser = await launch();
  try {
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); await page.setViewport({ width: 320, height: 640 });
      await page.goto('http://127.0.0.1:' + PORT + '/Plenix/test-site/index.html#/document/d1'); await sleep(3000);
      await page.evaluate((d) => document.documentElement.setAttribute('dir', d), dir); await sleep(700);
      const r = await page.evaluate(() => {
        const steps = document.querySelector('.plx-version-compare__steps'); if (!steps) return null;
        const bs = [...steps.querySelectorAll('button')];
        return { n: bs.length, tops: bs.map((b) => Math.round(b.getBoundingClientRect().top)), names: bs.map((b) => b.getAttribute('aria-label') || ''), iconOnly: bs.map((b) => b.classList.contains('plx-button--icon-only')) };
      });
      assert.ok(r, dir + ': the steps are on the page');
      assert.equal(r.n, 2, dir + ': two buttons');
      assert.equal(new Set(r.tops).size, 1, dir + ': both on one row (tops ' + r.tops + ')');
      assert.ok(r.iconOnly.every(Boolean), dir + ': icon only at 320px');
      assert.ok(r.names.every((n) => n.length > 0), dir + ': each has its name (' + r.names + ')');
      await page.close();
    }
    console.log('VERSION_COMPARE_STEPS_13_OK');
  } catch (e) { console.log('VERSION_COMPARE_STEPS_13_FAIL ' + e.message); await browser.close(); process.exit(1); }
  await browser.close(); process.exit(0);
})();
