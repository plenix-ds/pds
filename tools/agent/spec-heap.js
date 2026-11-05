// Measures the design spec's JS heap (after a forced GC) over N routes. Usage: node tools/agent/spec-heap.js [routes=40]
// Issue 5: the heap should stay roughly flat from route to route. CHROME_PATH picks the browser.
const { serve, launch } = require('../../tests/lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9645, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage();
    await page.goto('http://localhost:' + PORT + '/Plenix/platform/design-system/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('a[href^="#/"]', { timeout: 60000 });
    const cdp = await page.createCDPSession();
    const heap = async () => { await cdp.send('HeapProfiler.collectGarbage'); const { usedSize } = await cdp.send('Runtime.getHeapUsage'); return usedSize / 1048576; };
    const hrefs = await page.$$eval('a[href^="#/"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
    const n = Math.min(+process.argv[2] || 40, hrefs.length);
    await new Promise((r) => setTimeout(r, +process.env.SETTLE_MS || 20000));   // let the idle prefetch run
    const first = await heap(), series = [first];
    for (let i = 0; i < n; i++) { await page.evaluate((h) => { location.hash = h; }, hrefs[i]); await new Promise((r) => setTimeout(r, 400)); if (process.env.EACH || i % 10 === 9) { const h = await heap(); series.push(+h.toFixed(1)); if (process.env.EACH) console.log(i, hrefs[i], h.toFixed(1), await page.evaluate(() => (window.DS && DS.ROOTS ? DS.ROOTS.length : 'n') + '/' + document.querySelectorAll('iframe').length + '/' + document.getElementsByTagName('*').length)); } }
    const last = await heap();
    console.log(JSON.stringify({ routes: n, startMB: +first.toFixed(1), endMB: +last.toFixed(1), growthPerRouteMB: +((last - first) / n).toFixed(2), series: series.map((x) => +x.toFixed(1)) }));
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
