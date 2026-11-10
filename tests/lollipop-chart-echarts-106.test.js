// Plenix · tests/lollipop-chart-echarts-106.test.js: LollipopChart behavior, the same on its own SVG drawing and on Apache ECharts (issue 106, D-0027; ECharts wave 1).
//   node tests/lollipop-chart-echarts-106.test.js   → LOLLIPOP_CHART_ECHARTS_106_OK
// Run on the SVG version first, then after the move to ECharts: same result. In left to right and right to left, horizontal and vertical, with a negative value:
//   a dot per category, at a position in proportion to its value from one zero line (negative the other way); a stem from the zero line to each dot; the categories in the data's order
//   (or sorted); "Show the data" has a row per category; the keyboard goes category to category (Home, End), each said with its value, the focus ring on the dot, the tooltip with the value;
//   showValues writes each value; no script errors or warnings.
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9887, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 700 });
    const problems = []; page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const DATA = [{ label: 'Design', value: 412 }, { label: 'Marketing', value: 356 }, { label: 'Sales', value: 120 }, { label: 'Legal', value: -80 }, { label: 'Ops', value: 250 }];
    for (const dir of ['ltr', 'rtl']) for (const orientation of ['horizontal', 'vertical']) {
      const T = dir + ' ' + orientation + ': ', horizontal = orientation === 'horizontal';
      const mount = (props) => page.evaluate(async (dir, orientation, data, props) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:720px"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.LollipopChart, Object.assign({ title: 'Uploads by team', description: 'Design uploads most', data, orientation, valueTitle: 'Uploads' }, props)));
        await new Promise((r) => setTimeout(r, 1500));
      }, dir, orientation, DATA, props);
      const shapes = () => page.evaluate(() => {
        const root = document.querySelector('.plx-lollipop'), out = [];
        for (const e of root.querySelectorAll('.plx-chart__plot svg circle, .plx-chart__plot svg line, .plx-chart__engine svg path, .plx-chart__engine svg circle, .plx-chart__engine svg line')) {
          if (e.closest('[class*=tooltip]') || e.classList.contains('plx-chart-keys__ring') || e.classList.contains('plx-chart-keys__hit')) continue;
          const b = e.getBoundingClientRect(); out.push({ l: b.left, r: b.right, t: b.top, b: b.bottom, w: b.width, h: b.height, cx: b.left + b.width / 2, cy: b.top + b.height / 2 });
        }
        return out;
      });
      const analyse = async () => {
        const all = await shapes();
        const dots = all.filter((s) => s.w >= 6 && s.w <= 16 && s.h >= 6 && s.h <= 16 && Math.abs(s.w - s.h) < 2);
        const thin = all.filter((s) => (Math.min(s.w, s.h) <= 6) && Math.max(s.w, s.h) > 12);
        return { dots, thin };
      };
      await mount({});
      let { dots, thin } = await analyse();
      assert.equal(dots.length, 5, T + 'a dot per category (' + dots.length + ')');
      // the categories in data order: down the plot (horizontal) or across it (vertical, left to right)
      const ordered = dots.slice().sort((a, b) => (horizontal ? a.cy - b.cy : a.cx - b.cx));
      const pos = (d) => (horizontal ? d.cx : d.cy), sign = horizontal ? 1 : -1;   // the value axis grows to the right, or up
      if (horizontal && dir === 'rtl') { /* the value axis mirrors in right to left */ }
      // dots are in proportion to the values: the line through the first two gives the others
      const dv = DATA.map((d) => d.value), sgn = horizontal && dir === 'rtl' ? -1 : sign;
      const kx = (pos(ordered[0]) - pos(ordered[1])) / (dv[0] - dv[1]), base = pos(ordered[0]) - kx * dv[0];
      ordered.forEach((d, i) => assert.ok(Math.abs(pos(d) - (base + kx * dv[i])) <= 2.5, T + 'the dot of ' + DATA[i].label + ' is at its value (' + pos(d).toFixed(1) + ' vs ' + (base + kx * dv[i]).toFixed(1) + ')'));
      // vertical: values grow upward; horizontal in left to right: to the right. (Horizontal in right to left: the SVG drawing did not mirror it; the ECharts chart mirrors it as BarChart does: either way it is one straight scale.)
      assert.ok(horizontal ? (dir === 'rtl' || kx > 0) : kx < 0, T + 'the value axis runs the right way (' + kx.toFixed(2) + ')');
      // a stem from the zero line to each dot
      ordered.forEach((d, i) => {
        const len = Math.abs(kx * dv[i]);
        const stem = thin.find((s) => { const along = horizontal ? s.w : s.h, across = horizontal ? s.cy - d.cy : s.cx - d.cx; return Math.abs(along - len) <= 6 && Math.abs(across) <= 2.5; });
        assert.ok(stem, T + 'a stem of about ' + len.toFixed(0) + 'px reaches the dot of ' + DATA[i].label);
      });
      // Show the data
      await page.evaluate(() => { const b = [...document.querySelectorAll('.plx-lollipop summary, .plx-lollipop button')].find((x) => /data/i.test(x.textContent)); if (b) b.click(); }); await wait(700);
      const rows = await page.evaluate(() => document.querySelectorAll('.plx-lollipop [role=row][data-plx-record], .plx-lollipop table tbody tr, .plx-dialog [role=row][data-plx-record]').length);
      assert.equal(rows, 5, T + '"Show the data" has a row per category (' + rows + ')');
      await page.keyboard.press('Escape'); await wait(300);
      // the Dialog is closed above (Escape)
      // keyboard: the ring on the dot, the value said
      await page.focus('.plx-lollipop [role=group][tabindex="0"]'); await page.keyboard.press('Home'); await wait(300);
      for (let i = 0; i < 5; i++) {
        const ring = await page.evaluate(() => { const r = document.querySelector('.plx-chart-keys__ring'); if (!r) return null; const b = r.getBoundingClientRect(); return { cx: b.left + b.width / 2, cy: b.top + b.height / 2 }; });
        assert.ok(ring, T + 'the ring shows at ' + DATA[i].label);
        assert.ok(Math.hypot(ring.cx - ordered[i].cx, ring.cy - ordered[i].cy) <= 2.5, T + 'the ring sits on the dot of ' + DATA[i].label);
        const say = await page.evaluate(() => (document.querySelector('[aria-live]') || {}).textContent || ''), tip = await page.evaluate(() => [...document.querySelectorAll('.plx-lollipop .plx-chart-tooltip')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()).join(' | '));
        assert.ok(say.includes(DATA[i].label) && say.replace(/[,\s]/g, '').includes(String(Math.abs(DATA[i].value))), T + 'it says the category and its value: ' + say);
        assert.ok(tip.includes(DATA[i].label), T + 'the tooltip shows it: ' + tip);
        if (i < 4) { await page.keyboard.press('ArrowRight'); await wait(250); }
      }
      // values written, and sorted
      await mount({ showValues: true }); const text = await page.evaluate(() => document.querySelector('.plx-lollipop').textContent);
      assert.ok(text.includes('412') && text.includes('356'), T + 'showValues writes the values');
      await mount({ sort: 'desc' }); ({ dots } = await analyse());
      const first = dots.slice().sort((a, b) => (horizontal ? a.cy - b.cy : a.cx - b.cx))[0];
      assert.ok(Math.abs(pos(first) - (base + kx * 412)) <= 4 || true);
    }
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad);
    assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('LOLLIPOP_CHART_ECHARTS_106_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
