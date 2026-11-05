/* Plenix tests · the design spec frees the React roots of pages it has left (issue 5: memory grows about 1.5 MB per page).
   A specimen's root (DS.mount) is unmounted when its container is no longer on the page; the registry never holds a root
   whose container is gone. The probe visits the foundation pages (tables and live examples), moves on, and counts.
   Usage: node tests/spec-roots-5.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9646, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('http://localhost:' + PORT + '/Plenix/platform/design-system/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('a[href^="#/"]', { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let seen = 0;
    for (const h of ['#/foundations/design-tokens', '#/foundations/color', '#/foundations/typography', '#/foundations/icon-inventory', '#/layout/divider']) {
      await page.evaluate((x) => { location.hash = x; }, h); await sleep(1500); seen = Math.max(seen, await page.evaluate(() => DS.ROOTS.length));
    }
    // read the registry as it is, with no sweep from the probe: the page itself must have freed the roots it left
    const r = await page.evaluate(() => ({ has: typeof DS.mount === 'function', live: DS.ROOTS ? DS.ROOTS.length : -1, connected: DS.ROOTS ? DS.ROOTS.filter((x) => x.container.isConnected).length : -1 }));
    assert.ok(r.has, 'DS.mount exists');
    assert.ok(seen > 0, 'the pages drew at least one live root, or the probe sees nothing');
    assert.equal(r.live, r.connected, 'every registered root has its container on the page (live ' + r.live + ', on the page ' + r.connected + ')');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('spec-roots-5: OK (' + r.live + ' roots now, most at once ' + seen + ')');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
