// Plenix · tests/gauge-echarts-106.test.js: Gauge behavior, the same on its own SVG drawing and on Apache ECharts (issue 106, D-0027; ECharts wave 1).
//   node tests/gauge-echarts-106.test.js   → GAUGE_ECHARTS_106_OK
// Run on the SVG version first, then after the move to ECharts: same result. In left to right and right to left, sizes sm, md and lg, with and without thresholds:
//   a meter (role meter) named by its title with its value, minimum, maximum and value text ("86%, of 100 GB, Nearly full"); the value in the middle, the label under it, the ends under the arc;
//   the fill runs from the start of the arc to the value's place on it (in proportion to the value); with thresholds the bands sit outside the track and the status badge names the range;
//   a value past an end is drawn at the end; "Show the data" lists the value, the ends and the thresholds; no script errors or warnings.
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9890, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 700 });
    const problems = []; page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const THRESHOLDS = [{ value: 80, level: 'warning', label: 'Nearly full' }, { value: 95, level: 'critical', label: 'Full' }];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (props) => page.evaluate(async (dir, props) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.Gauge, Object.assign({ title: 'Storage used', description: 'Of the plan', label: 'of 100 GB', format: (v) => v + '%' }, props)));
        await new Promise((r) => setTimeout(r, 1500));
      }, dir, props);
      // the arc shapes inside the dial: the track (the widest) and the fill (a part of it), by their left edge and right edge
      const arcs = () => page.evaluate(() => {
        const dial = document.querySelector('.plx-gauge__dial'), d = dial.getBoundingClientRect(), out = [];
        for (const e of dial.querySelectorAll('svg path')) { const b = e.getBoundingClientRect(); if (b.width < 6) continue; const cs = getComputedStyle(e), seen = (c) => c && c !== 'none' && !/rgba\(0, 0, 0, 0\)|transparent/.test(c); if (!seen(cs.fill) && !seen(cs.stroke)) continue; out.push({ l: b.left - d.left, r: b.right - d.left, t: b.top - d.top, b: b.bottom - d.top, w: b.width, h: b.height, fill: getComputedStyle(e).fill, stroke: getComputedStyle(e).stroke }); }
        return { out, dial: { w: d.width, h: d.height } };
      });
      for (const [name, props, frac, badge] of [['no thresholds', { value: 72 }, 0.72, null], ['with thresholds', { value: 86, thresholds: THRESHOLDS }, 0.86, 'Nearly full'], ['small, past the end', { value: 140, size: 'sm' }, 1, null], ['large, low', { value: 15, size: 'lg', thresholds: THRESHOLDS }, 0.15, null]]) {
        await mount(props);
        const meter = await page.evaluate(() => { const m = document.querySelector('.plx-gauge [role=meter]'); return { name: m.getAttribute('aria-labelledby') && document.getElementById(m.getAttribute('aria-labelledby')).textContent, now: m.getAttribute('aria-valuenow'), min: m.getAttribute('aria-valuemin'), max: m.getAttribute('aria-valuemax'), text: m.getAttribute('aria-valuetext') }; });
        assert.equal(meter.name, 'Storage used', T + name + ': the meter is named by its title');
        assert.deepEqual([meter.now, meter.min, meter.max], [String(props.value), '0', '100'], T + name + ': value, minimum and maximum');
        assert.ok(meter.text.startsWith(props.value + '%') && meter.text.includes('of 100 GB') && (!badge || meter.text.includes(badge)), T + name + ': the value text says value, label and range: ' + meter.text);
        const shown = await page.evaluate(() => ({ value: document.querySelector('.plx-gauge__value').textContent, label: document.querySelector('.plx-gauge__label').textContent, ends: [...document.querySelectorAll('.plx-gauge__end')].map((e) => e.textContent), badge: (document.querySelector('.plx-gauge__status') || {}).textContent || null }));
        assert.deepEqual([shown.value, shown.label, shown.ends.join('|')], [props.value + '%', 'of 100 GB', '0%|100%'], T + name + ': the value, its label and the ends are written');
        assert.equal(shown.badge, badge, T + name + ': the status badge names the range');
        // the arcs: the track is the widest arc; the fill ends where the value is on it
        const { out, dial } = await arcs();
        const track = out.slice().sort((a, b) => b.w - a.w)[0];
        const fills = out.filter((s) => s !== track && s.t >= track.t - 20 && Math.abs(s.l - track.l) <= 8 && s.w < track.w + 2);
        assert.ok(fills.length >= 1, T + name + ': a fill arc runs from the start of the track (' + out.length + ' arcs)');
        const fill = fills.sort((a, b) => b.w - a.w)[0], half = (track.r - track.l) / 2, expected = (1 - Math.cos(Math.PI * Math.min(1, frac))) / 2;
        const got = (fill.r - track.l) / (track.r - track.l);
        // the box of the old drawing is the arc's center line; the ECharts arc's is its ring (the track 12 wide on a radius of 60): both are accepted, each within 0.04
        const ring = (1.1 - 0.9 * Math.cos(Math.PI * Math.min(1, frac))) / 2.2;
        assert.ok(Math.min(Math.abs(got - expected), Math.abs(got - ring)) <= 0.04, T + name + ': the fill ends at ' + expected.toFixed(2) + ' (or ' + ring.toFixed(2) + ' by its ring) of the arc\'s width (got ' + got.toFixed(2) + ')');
        // the dial's width follows the size
        const widths = { sm: 160, md: 200, lg: 240 }; const size = props.size || 'md';
        assert.ok(Math.abs(dial.w - widths[size]) <= 4, T + name + ': the dial is as wide as its size (' + dial.w.toFixed(0) + ')');
        if (props.thresholds) assert.ok(out.length >= 3, T + name + ': the track, the fill and a threshold band are drawn (' + out.length + ' arcs)');
        // Show the data
        await page.evaluate(() => { const b = [...document.querySelectorAll('.plx-gauge summary')].find((x) => /data/i.test(x.textContent)); if (b) b.click(); }); await wait(700);
        const rows = await page.evaluate(() => document.querySelectorAll('.plx-gauge [role=row][data-plx-record], .plx-gauge table tbody tr').length);
        assert.equal(rows, 3 + (props.thresholds ? 2 : 0), T + name + ': "Show the data" lists the value, the ends and the thresholds (' + rows + ')');
      }
    }
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad);
    assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('GAUGE_ECHARTS_106_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
