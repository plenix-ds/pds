/* Plenix tests · MetricCard's rank reads "#1" right to left too (issue 897). The number is its own left-to-right island
   (Text's data value, issue 838), so the "#" before it was left alone and a right-to-left row drew it after the number: "1#".
   Written before the fix: right to left the "#" sat to the right of the number.
   Summary (the browser, 600 x 400):
     a ranked list (three rows), left to right (English) and right to left (Arabic): in each rank the "#" is drawn to the
       left of its number, and the rank's text is "#" then the number (#1, #2, #3; Arabic digits in Arabic)
     no script errors
   Usage: node tests/metric-card-rank-rtl-897.test.js   → METRIC_CARD_RANK_RTL_897_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

(async () => {
  const PORT = +process.env.TEST_PORT || 9694, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 600, height: 400 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    for (const dir of ['ltr', 'rtl']) {
      const r = await page.evaluate(async (dir) => {
        const h = React.createElement, P = window.Plenix, ar = dir === 'rtl';
        document.documentElement.setAttribute('dir', dir);
        window.__root && window.__root.unmount();
        document.getElementById('main').innerHTML = '<div id="c"></div>';
        const items = (ar ? ['الخدمة', 'الشباب', 'الكورال'] : ['Service', 'Youth', 'Choir']).map((l, i) => ({ id: 'i' + i, label: l, value: 40 - i * 9 }));
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(P.LocaleProvider, { locale: ar ? 'ar-EG' : 'en-US', dir }, h(P.MetricCard, { type: 'list', title: ar ? 'الأكثر حضورًا' : 'Most attended', items })));
        await new Promise((res) => setTimeout(res, 600));
        return [...document.querySelectorAll('.plx-metric-card__rank')].map((rank) => {
          // the "#" character's box and the number's box
          const walker = document.createTreeWalker(rank, NodeFilter.SHOW_TEXT); let hash = null, num = null, node;
          while ((node = walker.nextNode())) {
            const i = node.data.indexOf('#');
            if (i >= 0 && !hash) { const range = document.createRange(); range.setStart(node, i); range.setEnd(node, i + 1); hash = range.getBoundingClientRect(); }
            else if (/[0-9٠-٩]/.test(node.data) && !num) { const range = document.createRange(); range.selectNodeContents(node); num = range.getBoundingClientRect(); }
          }
          return { text: rank.textContent, hashLeft: hash && hash.left, numLeft: num && num.left };
        });
      }, dir);
      assert.equal(r.length, 3, dir + ': three ranks');
      r.forEach((x, i) => {
        assert.ok(/^#[0-9٠-٩]$/.test(x.text), dir + ': rank ' + (i + 1) + ' is "#" then its number; got ' + x.text);
        assert.ok(x.hashLeft !== null && x.numLeft !== null && x.hashLeft < x.numLeft, dir + ': rank ' + (i + 1) + ' draws "#" to the left of its number ("#1", not "1#")');
      });
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('METRIC_CARD_RANK_RTL_897_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
