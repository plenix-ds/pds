// Plenix · tests/waterfall-chart-echarts-106.test.js: WaterfallChart behavior, the same on its own SVG drawing and on Apache ECharts (issue 106, D-0027; ECharts wave 1).
//   node tests/waterfall-chart-echarts-106.test.js   → WATERFALL_CHART_ECHARTS_106_OK
// Run on the SVG version first, then after the move to ECharts: same result. In left to right and right to left:
//   one bar per step and one for the end total; totals stand on the baseline, each change floats from the running total before it to the one after (positions in proportion to the values),
//   a change below zero floats under the baseline; the signed values are written at the bars ("+240", "−110"); "Show the data" has a row per bar;
//   the keyboard goes step to step (Home, End) and says "step: change, running total"; the tooltip shows the same; no script errors or warnings.
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9886, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 700 });
    const problems = []; page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const SETS = {
      'above zero': [{ label: 'Last year', value: 820, total: true }, { label: 'New customers', value: 240 }, { label: 'Churn', value: -110 }, { label: 'Price change', value: -60 }, { label: 'Upsell', value: 90 }],
      'crossing zero': [{ label: 'Start', value: 100, total: true }, { label: 'Loss', value: -250 }, { label: 'Gain', value: 400 }, { label: 'Fee', value: -50 }],
    };
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (data) => page.evaluate(async (dir, data) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:720px"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.WaterfallChart, { title: 'Revenue', description: 'Year over year', data, endLabel: 'This year' }));
        await new Promise((r) => setTimeout(r, 1500));
      }, dir, data);
      // the bars: filled shapes standing in the plot; the zero baseline from the totals
      const bars = () => page.evaluate(() => {
        const root = document.querySelector('.plx-waterfall-chart'), out = [];
        for (const e of root.querySelectorAll('.plx-chart__plot svg rect.plx-waterfall-chart__bar, .plx-chart__engine svg path')) {
          if (e.closest('[class*=tooltip]')) continue;
          const b = e.getBoundingClientRect(); if (b.width < 10 || b.width > 130 || b.height < 1) continue;
          const fill = getComputedStyle(e).fill; if (!fill || fill === 'none' || /rgba\(0, 0, 0, 0\)|transparent/.test(fill)) continue;
          out.push({ left: b.left, top: b.top, bottom: b.bottom, w: b.width, h: b.height, fill });
        }
        // a step across zero is drawn in two parts (up and down from the baseline): the parts of one column are one bar
        out.sort((a, b) => a.left - b.left); const merged = [];
        for (const o of out) { const last = merged[merged.length - 1]; if (last && Math.abs(last.left - o.left) < 2) { last.top = Math.min(last.top, o.top); last.bottom = Math.max(last.bottom, o.bottom); last.h = last.bottom - last.top; } else merged.push(Object.assign({}, o)); }
        return merged;
      });
      for (const [name, data] of Object.entries(SETS)) {
        await mount(data);
        const got = await bars();
        const steps = []; let run = 0; data.forEach((d, i) => { if (d.total) { run = d.value; steps.push({ from: 0, to: run }); } else { steps.push({ from: run, to: run + d.value }); run += d.value; } }); steps.push({ from: 0, to: run });
        assert.equal(got.length, steps.length, T + name + ': one bar per step and the end total (' + got.length + ')');
        // the scale from the first total: its bottom (value 0 or its low end) and height give pixels per unit
        const k = got[0].h / Math.abs(steps[0].to - steps[0].from), zeroY = steps[0].to >= 0 ? got[0].bottom : got[0].top;
        steps.forEach((s, i) => {
          const topV = Math.max(s.from, s.to), botV = Math.min(s.from, s.to);
          assert.ok(Math.abs(got[i].top - (zeroY - topV * k)) <= 2.5 && Math.abs(got[i].bottom - (zeroY - botV * k)) <= 2.5, T + name + ': bar ' + i + ' floats from ' + s.from + ' to ' + s.to + ' (top ' + got[i].top.toFixed(1) + ' expected ' + (zeroY - topV * k).toFixed(1) + ', bottom ' + got[i].bottom.toFixed(1) + ' expected ' + (zeroY - botV * k).toFixed(1) + ')');
        });
        if (name === 'above zero') {
          const text = await page.evaluate(() => document.querySelector('.plx-waterfall-chart').textContent);
          for (const w of ['+240', '−110', '−60', '+90', '820']) assert.ok(text.includes(w), T + name + ': the signed value ' + w + ' is written at its bar');
          const fills = got.map((g) => g.fill); assert.notEqual(fills[1], fills[2], T + name + ': an increase and a decrease differ in color'); assert.equal(fills[0], fills[fills.length - 1], T + name + ': the totals share a color');
        }
        // Show the data
        await page.evaluate(() => { const b = [...document.querySelectorAll('.plx-waterfall-chart summary, .plx-waterfall-chart button')].find((x) => /data/i.test(x.textContent)); if (b) b.click(); }); await wait(700);
        const rows = await page.evaluate(() => document.querySelectorAll('.plx-waterfall-chart [role=row][data-plx-record], .plx-waterfall-chart table tbody tr').length);
        assert.equal(rows, steps.length, T + name + ': "Show the data" has a row per bar (' + rows + ')');
        await page.evaluate(() => { const b = [...document.querySelectorAll('.plx-waterfall-chart summary')].find((x) => /data/i.test(x.textContent)); if (b) b.click(); }); await wait(300);
      }
      // keyboard and tooltip
      await mount(SETS['above zero']);
      await page.focus('.plx-waterfall-chart [role=group][tabindex="0"]'); await page.keyboard.press('Home'); await wait(300);
      const live = () => page.evaluate(() => (document.querySelector('[aria-live]') || {}).textContent || '');
      const tip = () => page.evaluate(() => [...document.querySelectorAll('.plx-waterfall-chart .plx-chart-tooltip')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()).join(' | '));
      assert.match(await live(), /Last year/, T + 'Home says the first step: ' + (await live()));
      await page.keyboard.press('ArrowRight'); await wait(300);
      let say = await live(), t = await tip(); assert.ok(/New customers/.test(say) && /\+240/.test(say) && /1,060|1060/.test(say), T + 'the next step is said with its change and running total: ' + say); assert.ok(/New customers/.test(t) && /\+240/.test(t), T + 'the tooltip shows it: ' + t);
      await page.keyboard.press('End'); await wait(300); say = await live(); assert.ok(/This year/.test(say) && /980/.test(say), T + 'End says the end total: ' + say);
    }
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad);
    assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('WATERFALL_CHART_ECHARTS_106_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
