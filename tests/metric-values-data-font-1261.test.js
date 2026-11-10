/* Plenix tests · #1261 (audit items 4 and 5 of #1232, D-0164): the figure of a Metric and of a MetricCard is a number, so it draws in the data font (Reddit Mono), at every size.
   Summary: a Metric (sm, md, lg) and a MetricCard (value, trend, summary types, sizes sm, md, lg) with figures such as "1,284", "$1.77M" and "36.5%": every figure computes to Reddit Mono; the title and
     the unit stay in the text font; a long figure at the largest size still fits its card on one line.
   Checks: AC-5 a figure that is only a word ("On track", "N/A") takes the text font, one with a digit stays data (D-0164: a word is never in the data font); AC-1 the Metric value; AC-2 the MetricCard value and the summary values; AC-3 the title, context and unit stay text; AC-4 a figure at size lg fits a 240px card (one line, not cut).
   Proof first: before the change the figure is in DM Sans (the heading face).
   Usage: node tests/metric-values-data-font-1261.test.js   → METRIC_VALUES_DATA_FONT_1261_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9825, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) for (const mode of ['light', 'dark']) {
      const T = dir + ' ' + mode + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 900 });
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const got = await page.evaluate(async (dir, mode) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-mode', mode); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
        const h = React.createElement, P = Plenix; const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c);
        const card = (extra) => h('div', { style: { inlineSize: 240, marginBlockEnd: 8 } }, h(P.MetricCard, Object.assign({ title: 'Open tasks', context: 'All projects', value: '$1.77M', unit: 'hrs' }, extra)));
        ReactDOM.createRoot(c).render(h('div', null,
          h('div', { id: 'm' }, ...['sm', 'md', 'lg'].map((size) => h(P.Metric, { key: size, size, label: 'Open tasks', value: '1,284' }))),
          h('div', { id: 'w' }, h(P.Metric, { label: 'Status', value: 'On track' }), h('div', { style: { inlineSize: 240 } }, h(P.MetricCard, { title: 'Health', value: 'N/A' })), h('div', { style: { inlineSize: 240 } }, h(P.MetricCard, { title: 'Sync', value: '3 of 4' }))),
          h('div', { id: 'mc' }, card({ size: 'sm' }), card({ size: 'md' }), card({ size: 'lg' }), card({ type: 'trend', size: 'lg', value: '36.5%', trend: [3, 4, 5, 4, 6] }),
            card({ type: 'summary', metrics: [{ value: '1,284', unit: 'cases', label: 'Open' }, { value: '36', unit: 'hrs', label: 'Logged' }] }))));
        await new Promise((r) => setTimeout(r, 900));
        const first = (v) => v.split(',')[0].trim().replace(/['"]/g, ''), rs = getComputedStyle(document.documentElement), q = (s) => [...document.querySelectorAll(s)];
        const f = (e) => first(getComputedStyle(e).fontFamily), fit = (e) => e.scrollWidth <= e.clientWidth + 1 && e.getBoundingClientRect().height < parseFloat(getComputedStyle(e).fontSize) * 2;
        return { data: first(rs.getPropertyValue('--plx-sys-font-data')),
          metric: q('#m .plx-metric__value').map((e) => ({ t: e.textContent.trim(), f: f(e) })), metricLabel: q('#m .plx-metric__label').map(f),
          values: q('#mc .plx-metric-card__value, #mc .plx-metric-card__summary-value').map((e) => ({ t: e.textContent.trim(), f: f(e), fit: fit(e) })),
          word: q('#w .plx-metric__value, #w .plx-metric-card__value').map((e) => ({ t: e.textContent.trim(), f: f(e) })),
          words: q('#mc .plx-metric-card__title, #mc .plx-metric-card__context, #mc .plx-metric-card__unit').map(f) };
      }, dir, mode);
      assert.equal(got.metric.length, 3, T + 'the Metrics are drawn'); for (const m of got.metric) assert.equal(m.f, got.data, T + 'AC-1: the Metric value ' + m.t + ' is in the data font (' + m.f + ')');
      assert.ok(got.metricLabel.length === 3 && got.metricLabel.every((x) => x !== got.data), T + 'AC-3: the Metric label stays in the text font');
      assert.ok(got.values.length >= 6, T + 'the card values are drawn: ' + got.values.length); for (const v of got.values) { assert.equal(v.f, got.data, T + 'AC-2: the card value ' + v.t + ' is in the data font (' + v.f + ')'); assert.ok(v.fit, T + 'AC-4: the value ' + v.t + ' fits its 240px card on one line'); }
      assert.equal(got.word.length, 3, T + 'the word-valued figures are drawn'); for (const w of got.word) { if (/^(On track|N\/A)$/.test(w.t)) assert.notEqual(w.f, got.data, T + 'AC-5: the word figure "' + w.t + '" is not in the data font (' + w.f + ')'); else assert.equal(w.f, got.data, T + 'AC-5: a figure with a digit ("' + w.t + '") stays in the data font'); }
      assert.ok(got.words.length >= 5 && got.words.every((x) => x !== got.data), T + 'AC-3: the card title, context and unit stay in the text font');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('METRIC_VALUES_DATA_FONT_1261_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
