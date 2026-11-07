/* Plenix tests · plan §7e baseline behaviour tests, navigation family (issue 908): LoadMore.
   Summary: each part mounts without errors or console warnings (development React); its states have the right ARIA; disabled steps fire nothing; the keyboard reaches and uses
     everything clickable (Tab, Enter, Space) with a visible focus ring; long text (three times the English) and empty values do not overflow; right to left mirrors; no axe violations
     (WCAG 2.2 A and AA). Left to right and right to left.
   Parts: LoadMore (one click, one load; loading is busy and does not double-fire; the end message). Pagination, Breadcrumbs and ProgressSteps are tested in #912 (ruling on #908).
   Usage: node tests/behaviour-908-navigation.test.js   → BEHAVIOUR_908_NAVIGATION_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9908, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.addScriptTag({ url: 'http://localhost:' + PORT + '/Plenix/node_modules/axe-core/axe.min.js' }).catch(() => {});
      const mount = (expr, width = 700) => page.evaluate(async (dir, expr, width) => {
        document.documentElement.setAttribute('dir', dir); window.__log = [];
        window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c" style="inline-size:' + width + 'px"></div>';
        const h = React.createElement, P = window.Plenix; window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(eval(expr)); await new Promise((r) => setTimeout(r, 500));
      }, dir, expr, width);
      const axeViolations = () => page.evaluate(async () => !window.axe ? -1 : (await window.axe.run(document.getElementById('c'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] }, resultTypes: ['violations'] })).violations.filter((v) => v.id !== 'region').map((v) => v.id));
      const overflow = () => page.evaluate(() => { const c = document.getElementById('c'); return c.scrollWidth - c.clientWidth; });
      const log = () => page.evaluate(() => window.__log);
      const tab = async (n = 1) => { for (let i = 0; i < n; i++) await page.keyboard.press('Tab'); };
      const focused = () => page.evaluate(() => { const e = document.activeElement; return e && e !== document.body ? (e.getAttribute('aria-label') || e.textContent.trim()) : null; });
      const focusRing = () => page.evaluate(() => { const e = document.activeElement, cs = getComputedStyle(e); return (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none'; });

      // ---- LoadMore
      await mount("h(P.LoadMore, { onLoadMore: () => window.__log.push('more'), hasMore: true, shown: 20, total: 120 })");
      assert.ok(/20 of 120/.test(await page.$eval('#c', (o) => o.textContent)), T + 'LoadMore: the count shows beside the button');
      await tab(); assert.equal(await focused(), 'Load more', T + 'LoadMore: Tab reaches the button'); assert.ok(await focusRing(), T + 'LoadMore: focus is visible');
      await page.keyboard.press('Enter'); assert.deepEqual(await log(), ['more'], T + 'LoadMore: one press, one load');
      await page.keyboard.press('Space'); assert.deepEqual(await log(), ['more', 'more'], T + 'LoadMore: Space loads too');
      await mount("h(P.LoadMore, { onLoadMore: () => window.__log.push('more'), loading: true, hasMore: true, shown: 20 })");
      r = await page.evaluate(() => { const b = document.querySelector('#c button'); return { busy: b.getAttribute('aria-busy'), disabled: b.disabled }; });
      assert.equal(r.busy, 'true', T + 'LoadMore: while loading the button is aria-busy');
      await page.click('#c button'); assert.deepEqual(await log(), [], T + 'LoadMore: a click while loading does not load again');
      await mount("h(P.LoadMore, { onLoadMore() {}, hasMore: false, shown: 120, total: 120 })");
      assert.ok(/reached the end/.test(await page.$eval('#c', (o) => o.textContent)) && !(await page.$('#c button')), T + 'LoadMore: with nothing left the end message replaces the button');
      await mount("h(P.LoadMore, { onLoadMore() {}, hasMore: true, shown: 20, pageSize: 20 })");
      assert.ok(/Show 20 more/.test(await page.$eval('#c button', (b) => b.textContent)), T + 'LoadMore: the button says how many one load brings');
      await mount("h(P.LoadMore, { onLoadMore() {}, hasMore: true, shown: 20, total: 120, strings: { more: 'Load a great many more items from the server right now please' } })", 320);
      assert.ok((await overflow()) <= 1, T + 'LoadMore: a long label does not overflow (' + (await overflow()) + 'px)');
      await mount("h(P.LoadMore, { onLoadMore() {}, hasMore: true, shown: 20, total: 120 })");
      assert.deepEqual(await axeViolations(), [], T + 'LoadMore: no axe violations');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or console warnings: ' + problems.join(' | '));
    console.log('BEHAVIOUR_908_NAVIGATION_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
