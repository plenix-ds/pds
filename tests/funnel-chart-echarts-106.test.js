// Plenix · tests/funnel-chart-echarts-106.test.js: FunnelChart behavior, the same on its own SVG drawing and on Apache ECharts (issue 106, D-0027; ECharts wave 1).
//   node tests/funnel-chart-echarts-106.test.js   → FUNNEL_CHART_ECHARTS_106_OK
// Run on the SVG version first, then after the move to ECharts: same result. In left to right and right to left, vertical (stages down the side) and horizontal (stages along the bottom):
//   one bar per stage, each as long as its count on one scale from one zero edge; behind every bar after the first, the stage before's length (the drop); the count and the share kept
//   written at each bar's end ("5,200 · 42%"); the keyboard goes stage to stage (Home, End) with the ring on the bar and the count said; the tooltip shows count, kept and of-first shares;
//   "Show the data" has a row per stage; no script errors or warnings.
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9889, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 700 });
    const problems = []; page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const DATA = [{ label: 'Visited', value: 12400 }, { label: 'Started sign-up', value: 5200 }, { label: 'Signed up', value: 3900 }, { label: 'First upload', value: 2100 }];
    for (const dir of ['ltr', 'rtl']) for (const orientation of ['vertical', 'horizontal']) {
      const T = dir + ' ' + orientation + ': ', vertical = orientation === 'vertical';
      await page.evaluate(async (dir, orientation, data) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:720px"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.FunnelChart, { title: 'Sign-up funnel', description: 'Most drop before sign-up', data, orientation, valueTitle: 'People' }));
        await new Promise((r) => setTimeout(r, 1500));
      }, dir, orientation, DATA);
      const shapes = () => page.evaluate(() => {
        const root = document.querySelector('.plx-funnel'), out = [];
        const box = root.querySelector('.plx-chart__plot svg').getBoundingClientRect();
        for (const e of root.querySelectorAll('.plx-chart__plot svg rect, .plx-chart__engine svg path')) {
          if (e.closest('[class*=tooltip]') || e.classList.contains('plx-chart-keys__hit') || e.classList.contains('plx-chart-keys__ring')) continue;
          const b = e.getBoundingClientRect(); if (b.width < 2 || b.height < 2) continue; if (b.width >= box.width - 4 && b.height >= box.height - 40) continue;   // not the plot's own box
          const fill = getComputedStyle(e).fill; if (!fill || fill === 'none' || /rgba\(0, 0, 0, 0\)|transparent/.test(fill)) continue;
          out.push({ l: b.left, r: b.right, t: b.top, b: b.bottom, w: b.width, h: b.height, cx: b.left + b.width / 2, cy: b.top + b.height / 2, fill });
        }
        return { out, box: { l: box.left, r: box.right, t: box.top, b: box.bottom } };
      });
      const { out } = await shapes();
      const along = (s) => (vertical ? s.w : s.h), centre = (s) => (vertical ? s.cy : s.cx);
      // the stage in each row (column): by the centre across
      const cs = []; out.slice().sort((a, b) => centre(a) - centre(b)).forEach((s) => { const last = cs[cs.length - 1]; if (last && Math.abs(last - centre(s)) < 6) return; cs.push(centre(s)); });
      assert.equal(cs.length, 4, T + 'one row per stage (' + cs.length + ')');
      const row = (i) => out.filter((s) => Math.abs(centre(s) - cs[i]) < 6).sort((a, b) => along(b) - along(a));
      // the scale: the first stage's bar is its count; the first stage has no drop behind it
      const k = along(row(0)[0]) / DATA[0].value;
      DATA.forEach((d, i) => {
        const lens = row(i).map(along);
        assert.ok(lens.some((l) => Math.abs(l - d.value * k) <= 3), T + d.label + ': a bar as long as its count (' + (d.value * k).toFixed(0) + 'px) among ' + lens.map((x) => x.toFixed(0)));
        if (i) assert.ok(lens.some((l) => Math.abs(l - DATA[i - 1].value * k) <= 3), T + d.label + ': the stage before is drawn behind it (' + (DATA[i - 1].value * k).toFixed(0) + 'px)');
        else assert.equal(row(0).length, 1, T + 'the first stage has no drop behind it');
      });
      // one zero edge for every bar
      const lo = (s) => (vertical ? s.l : s.t), hi = (s) => (vertical ? s.r : s.b), first = row(0)[0];
      const edgeLo = out.every((s) => Math.abs(lo(s) - lo(first)) < 2.5), edgeHi = out.every((s) => Math.abs(hi(s) - hi(first)) < 2.5);
      assert.ok(edgeLo || edgeHi, T + 'every bar starts from one zero edge');
      const text = await page.evaluate(() => document.querySelector('.plx-funnel').textContent);
      for (const w of ['12,400', '5,200 · 42%', '3,900 · 75%', '2,100 · 54%']) assert.ok(text.includes(w), T + 'the label ' + w + ' is written at its bar');
      // Show the data
      await page.evaluate(() => { const b = [...document.querySelectorAll('.plx-funnel summary, .plx-funnel button')].find((x) => /data/i.test(x.textContent)); if (b) b.click(); }); await wait(700);
      const rows = await page.evaluate(() => document.querySelectorAll('.plx-funnel [role=row][data-plx-record], .plx-funnel table tbody tr, .plx-dialog [role=row][data-plx-record]').length);
      assert.equal(rows, 4, T + '"Show the data" has a row per stage (' + rows + ')');
      await page.keyboard.press('Escape'); await wait(300);
      // the Dialog is closed above (Escape)
      // keyboard: the ring on the bar, the count said, the tooltip
      await page.focus('.plx-funnel [role=group][tabindex="0"]'); await page.keyboard.press('Home'); await wait(300);
      for (let i = 0; i < 4; i++) {
        const ring = await page.evaluate(() => { const r = document.querySelector('.plx-chart-keys__ring'); if (!r) return null; const b = r.getBoundingClientRect(); return { cx: b.left + b.width / 2, cy: b.top + b.height / 2 }; });
        assert.ok(ring, T + 'the ring shows at ' + DATA[i].label);
        const bar = row(i).find((s) => Math.abs(along(s) - DATA[i].value * k) <= 3);
        assert.ok(Math.hypot(ring.cx - bar.cx, ring.cy - bar.cy) <= 3, T + 'the ring sits on the bar of ' + DATA[i].label + ' (' + Math.hypot(ring.cx - bar.cx, ring.cy - bar.cy).toFixed(1) + ')');
        const say = await page.evaluate(() => (document.querySelector('[aria-live]') || {}).textContent || ''), tip = await page.evaluate(() => [...document.querySelectorAll('.plx-funnel .plx-chart-tooltip')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()).join(' | '));
        assert.ok(say.includes(DATA[i].label) && say.replace(/,/g, '').includes(String(DATA[i].value)), T + 'it says the stage and its count: ' + say);
        assert.ok(tip.includes(DATA[i].label) && tip.replace(/,/g, '').includes(String(DATA[i].value)) && (i === 0 || /%/.test(tip)), T + 'the tooltip shows it: ' + tip);
        if (i < 3) { await page.keyboard.press('ArrowRight'); await wait(250); }
      }
    }
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad);
    assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('FUNNEL_CHART_ECHARTS_106_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
