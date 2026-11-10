/* Plenix tests · the region loading state (issue 1032, D-0130, D-0131, ADR 0042): a spinner with a visible label, centred, after about 1 second; no Skeleton in any default.
   Summary: Spinner keeps its defaults (hidden label, shows at once). Spinner with delay and a visible label draws nothing before the delay and one role="status" holding the label after it, the ring aria-hidden.
     LoadingState: nothing at 500 ms, drawn after 1 s, delay 0 shows at once, progress gives a ProgressBar, a nested one draws nothing, centred on both axes. EntityTitle loading, MetricCard loading, DataGrid loading
     and ListingPage loading draw no .plx-skeleton. The region delay token is 1s. Left to right and right to left (the ring is at the inline start).
   Proof first: before the change LoadingState does not exist, and EntityTitle and MetricCard draw Skeleton bars.
   Usage: node tests/loading-state-1032.test.js   → LOADING_STATE_1032_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9932, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      // mounts an element, then reports what the page holds at each wait (ms)
      const probe = (expr, waits, width = 480) => page.evaluate(async (dir, expr, waits, width) => {
        document.documentElement.setAttribute('dir', dir);
        const host = document.createElement('div'); host.id = 'c'; host.style.inlineSize = width + 'px'; host.style.blockSize = '200px'; document.querySelector('main').replaceChildren(host);
        const h = React.createElement, P = window.Plenix; ReactDOM.createRoot(host).render(eval(expr));
        const out = []; let at = 0;
        for (const w of waits) {
          await new Promise((r) => setTimeout(r, w - at)); at = w;
          const c = document.getElementById('c'), ring = c.querySelector('.plx-spinner'), box = c.querySelector('.plx-loading-state'), label = c.querySelector('.plx-spinner__label');
          const rb = ring && ring.getBoundingClientRect(), lb = label && label.getBoundingClientRect(), bb = box && box.getBoundingClientRect(), hb = c.getBoundingClientRect();
          out.push({ states: c.querySelectorAll('[role=status]:not(.plx-loading-state__slow)').length, rings: c.querySelectorAll('.plx-spinner').length, boxes: c.querySelectorAll('.plx-loading-state').length, skeleton: c.querySelectorAll('.plx-skeleton').length,
            bars: c.querySelectorAll('progress, [role=progressbar]').length, ringHidden: ring ? ring.getAttribute('aria-hidden') : null, label: label ? label.textContent : null,
            hiddenLabel: !!c.querySelector('.plx-spinner .plx-visually-hidden'), ringX: rb && rb.left, labelX: lb && lb.left,
            cx: bb ? Math.abs((bb.left + bb.width / 2) - (hb.left + hb.width / 2)) : null, text: c.textContent });
        }
        return out;
      }, dir, expr, waits, width);

      // Spinner defaults are today's behaviour
      let r = (await probe(`h(P.Spinner, { label: 'Saving' })`, [50]))[0];
      assert.equal(r.rings, 1, T + 'Spinner draws at once'); assert.ok(r.hiddenLabel && r.label === null, T + 'Spinner keeps its hidden label'); assert.equal(r.states, 1, T + 'Spinner is one status');
      // Spinner with a visible label and the region delay
      r = await probe(`h(P.Spinner, { label: 'Loading cases…', labelPosition: 'after', delay: 'region' })`, [500, 1400]);
      assert.equal(r[0].rings + r[0].states, 0, T + 'nothing drawn or announced before 1 s');
      assert.equal(r[1].states, 1, T + 'one status after 1 s'); assert.equal(r[1].label, 'Loading cases…', T + 'the visible label'); assert.equal(r[1].ringHidden, 'true', T + 'the ring is aria-hidden'); assert.ok(!r[1].hiddenLabel, T + 'no second hidden label');
      // LoadingState
      assert.equal(await page.evaluate(() => typeof window.Plenix.LoadingState), 'function', T + 'LoadingState is exported');
      r = await probe(`h(P.LoadingState, { label: 'Loading cases…' })`, [500, 1400]);
      assert.equal(r[0].boxes + r[0].rings + r[0].states, 0, T + 'LoadingState: nothing before 1 s');
      assert.equal(r[1].states, 1, T + 'LoadingState: one status'); assert.equal(r[1].label, 'Loading cases…'); assert.ok(r[1].cx <= 2, T + 'centred on the inline axis (' + r[1].cx + ')');
      assert.ok(dir === 'ltr' ? r[1].ringX < r[1].labelX : r[1].ringX > r[1].labelX, T + 'the ring is at the inline start');
      r = (await probe(`h(P.LoadingState, { label: 'Now', delay: 0 })`, [100]))[0]; assert.equal(r.states, 1, T + 'delay 0 shows at once');
      r = await probe(`h(P.LoadingState, { label: 'Exporting', progress: 40 })`, [1400]); assert.equal(r[0].bars, 1, T + 'progress gives a ProgressBar');
      r = (await probe(`h(P.LoadingState, { label: 'Outer', delay: 0, children: h(P.LoadingState, { label: 'Inner', delay: 0 }) })`, [100]))[0]; assert.equal(r.states, 1, T + 'a nested LoadingState draws nothing');
      // no Skeleton in the defaults
      r = await probe(`h(P.EntityTitle, { loading: true, subtitle: true })`, [500, 1400]); assert.equal(r[0].skeleton + r[1].skeleton, 0, T + 'EntityTitle loading draws no Skeleton'); assert.equal(r[1].states, 1, T + 'EntityTitle loading shows a spinner');
      r = await probe(`h(P.MetricCard, { title: 'Open cases', state: 'loading' })`, [500, 1400]); assert.equal(r[0].skeleton + r[1].skeleton, 0, T + 'MetricCard loading draws no Skeleton'); assert.equal(r[1].states, 1, T + 'MetricCard loading shows a spinner');
      r = await probe(`h(P.DataGrid, { label: 'Cases', data: [], columns: [{ title: 'Name', field: 'name' }], loading: true })`, [500, 1400], 700); assert.equal(r[0].skeleton + r[1].skeleton, 0, T + 'DataGrid loading draws no Skeleton'); assert.equal(r[1].states, 1, T + 'DataGrid loading shows a spinner (not the empty text)');
      r = await probe(`h(P.ListingPage, { title: 'Cases', rows: [], columns: [{ title: 'Name', field: 'name' }], loading: true })`, [500, 1400], 900); assert.equal(r[1].skeleton, 0, T + 'ListingPage loading draws no Skeleton'); assert.ok(r[1].rings >= 1, T + 'ListingPage loading shows a spinner');
      // the token
      const delay = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--plx-sys-motion-loading-region-delay').trim()); assert.ok(/^1s$|^1000ms$/.test(delay), T + 'the region delay token is 1s (' + delay + ')');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | '));
    console.log('LOADING_STATE_1032_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
