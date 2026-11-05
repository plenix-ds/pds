/* Plenix tests · cleaning rich text starts no request (issue 59): cleanRichText builds its copy in an inert document, so an
   <img src> in the result is not fetched until the output is put on the page.
   Usage: node tests/rich-text-clean-inert-59.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9640, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const seen = [];
    await page.setRequestInterception(true);
    page.on('request', (r) => { if (/__qa-probe/.test(r.url())) seen.push(r.url()); r.continue(); });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix, { timeout: 60000 });
    const clean = async () => page.evaluate(() => {
      const f = Plenix.cleanRichText || (Plenix.utils && Plenix.utils.cleanRichText);
      return f('<p>a</p><img src="/__qa-probe.png" alt="x">');
    });
    const out = await clean();
    await new Promise((r) => setTimeout(r, 500));
    assert.match(out, /__qa-probe\.png/, 'the picture stays in the output');
    assert.deepEqual(seen, [], 'cleaning requested no picture: ' + seen.join(','));
    console.log('rich-text-clean-inert-59: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
