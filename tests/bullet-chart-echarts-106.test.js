// Plenix · tests/bullet-chart-echarts-106.test.js: BulletChart behavior, the same on its own SVG drawing and on Apache ECharts (issue 106, D-0027; ECharts wave 1).
//   node tests/bullet-chart-echarts-106.test.js   → BULLET_CHART_ECHARTS_106_OK
// Run on the SVG version first, then after the move to ECharts: same result. In left to right and right to left, horizontal and vertical:
//   one row (column) per measure; three range bands, then a narrower value bar, all from one zero line, each as long as its number on one scale; a target mark across the row at the target's place;
//   the pointer over a measure shows a tooltip with its value, target and range; "Show the data" has a row per measure; no script errors or warnings.
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9888, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 700 });
    const problems = []; page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const ITEMS = [{ id: 'up', label: 'Uploads', value: 820, target: 750, ranges: [400, 700, 1000] }, { id: 'rv', label: 'Reviews', value: 610, target: 800, ranges: [300, 550, 1000] }, { id: 'ap', label: 'Approvals', value: 280, target: 600, ranges: [200, 500, 1000] }];
    for (const dir of ['ltr', 'rtl']) for (const orientation of ['horizontal', 'vertical']) {
      const T = dir + ' ' + orientation + ': ', horizontal = orientation === 'horizontal';
      await page.evaluate(async (dir, orientation, items) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:720px"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.BulletChart, { title: 'Quarter against targets', description: 'Approvals are behind', items, orientation, valueLabel: 'Count' }));
        await new Promise((r) => setTimeout(r, 1500));
      }, dir, orientation, ITEMS);
      const shapes = () => page.evaluate(() => {
        const root = document.querySelector('.plx-bullet-chart'), out = [];
        for (const e of root.querySelectorAll('.plx-chart__plot svg rect, .plx-chart__plot svg line, .plx-chart__engine svg path, .plx-chart__engine svg rect')) {
          if (e.closest('[class*=tooltip]') || e.classList.contains('plx-bullet-chart__item')) continue;   // the pointer's hit areas are not marks
          const b = e.getBoundingClientRect(); if (b.width < 0.5 && b.height < 0.5) continue; out.push({ l: b.left, r: b.right, t: b.top, b: b.bottom, w: b.width, h: b.height, cx: b.left + b.width / 2, cy: b.top + b.height / 2 });
        }
        return out;
      });
      const all = await shapes();
      // the shapes of the measures: bands and bars are long along the value axis and thick across it; the target mark is thin along it
      const along = (s) => (horizontal ? s.w : s.h), across = (s) => (horizontal ? s.h : s.w), centre = (s) => (horizontal ? s.cy : s.cx);
      const frameBox = await page.evaluate(() => { const b = document.querySelector('.plx-bullet-chart .plx-chart__plot svg').getBoundingClientRect(); return { w: b.width, h: b.height }; });
      const body = all.filter((s) => along(s) > 20 && across(s) >= 6 && across(s) < 260 && !(s.w >= frameBox.w - 4 && s.h >= frameBox.h - 40));   // not the plot's own box
      const lo = (s) => (horizontal ? s.l : s.t), hi = (s) => (horizontal ? s.r : s.b);
      // one row per measure, by the centre across
      const rowsC = []; body.slice().sort((a, b) => centre(a) - centre(b)).forEach((s) => { const last = rowsC[rowsC.length - 1]; if (last && Math.abs(last - centre(s)) < 8) return; rowsC.push(centre(s)); });
      assert.equal(rowsC.length, 3, T + 'one row per measure (' + rowsC.length + ')');
      // the scale: the widest shape of the first row is its last range (1000)
      const row = (i) => body.filter((s) => Math.abs(centre(s) - rowsC[i]) < 8);
      const first = row(0).sort((a, b) => along(b) - along(a));
      const k = along(first[0]) / 1000; if (process.env.DBG) console.log(JSON.stringify(body.map((s) => [Math.round(s.l), Math.round(s.t), Math.round(s.w), Math.round(s.h)])));
      // the zero edge: the one every shape of the rows shares
      const zeroLo = body.every((s) => Math.abs(lo(s) - lo(first[0])) < 2.5), zero = zeroLo ? lo(first[0]) : hi(first[0]), dirn = zeroLo ? 1 : -1;
      ITEMS.forEach((it, i) => {
        const lens = row(i).map(along).sort((a, b) => a - b);
        for (const v of it.ranges.concat([it.value])) assert.ok(lens.some((l) => Math.abs(l - v * k) <= 3), T + it.label + ': a band or bar as long as ' + v + ' (' + (v * k).toFixed(0) + 'px) among ' + lens.map((x) => x.toFixed(0)));
        // the target mark: thin along the value axis, centred at the target's place
        const mark = all.find((s) => along(s) <= 6 && across(s) > 6 && Math.abs(centre(s) - rowsC[i]) < 12 && Math.abs((horizontal ? s.cx : s.cy) - (zero + dirn * it.target * k)) <= 3);
        assert.ok(mark, T + it.label + ': the target mark sits at ' + it.target + ' (expected ' + (zero + dirn * it.target * k).toFixed(1) + ' at row ' + rowsC[i].toFixed(1) + '; thin shapes: ' + JSON.stringify(all.filter((s) => along(s) <= 6).map((s) => [Math.round(s.cx), Math.round(s.cy), Math.round(s.w), Math.round(s.h)]).slice(0, 8)) + ')');
      });
      // value bar thinner than the bands
      const r0 = row(0); const bar = r0.find((s) => Math.abs(along(s) - 820 * k) <= 3), band = r0.find((s) => Math.abs(along(s) - 1000 * k) <= 3);
      assert.ok(across(bar) < across(band), T + 'the value bar is narrower than the bands');
      // the tooltip under the pointer
      const target = row(1)[0]; await page.mouse.move(5, 5); await page.mouse.move(target.cx, target.cy, { steps: 3 }); await wait(400);
      const tip = await page.evaluate(() => [...document.querySelectorAll('.plx-bullet-chart .plx-chart-tooltip')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()).join(' | '));
      assert.ok(/Reviews/.test(tip) && /610/.test(tip) && /800/.test(tip), T + 'the tooltip shows the measure, its value and target: ' + tip); await page.mouse.move(5, 5);
      await page.evaluate(() => { const b = [...document.querySelectorAll('.plx-bullet-chart summary, .plx-bullet-chart button')].find((x) => /data/i.test(x.textContent)); if (b) b.click(); }); await wait(700);
      const rows = await page.evaluate(() => document.querySelectorAll('.plx-bullet-chart [role=row][data-plx-record], .plx-bullet-chart table tbody tr').length);
      assert.equal(rows, 3, T + '"Show the data" has a row per measure (' + rows + ')');
    }
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad);
    assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('BULLET_CHART_ECHARTS_106_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
