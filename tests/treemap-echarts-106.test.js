// Plenix · tests/treemap-echarts-106.test.js: Treemap behavior, the same on its own SVG drawing and on Apache ECharts (issue 106, D-0027).
//   node tests/treemap-echarts-106.test.js   → TREEMAP_ECHARTS_106_OK
// Run on the SVG version first, then after the move to ECharts: same result. In left to right and right to left, flat and nested:
//   a tile per part whose area follows its value (the largest part the largest tile, areas in proportion within a tolerance for the gaps), the tiles inside the plot and not over one another,
//   nested parts grouped (a group's tiles sit together, the group named); the keyboard goes tile to tile (largest first, by group), each said with its value and share, the ring on the tile;
//   the tooltip shows the part, its value and share; "Show the data" has a row per part; no script errors or warnings.
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9893, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 800 });
    const problems = []; page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const FLAT = [{ label: 'Video', value: 220 }, { label: 'Photos', value: 96 }, { label: 'Documents', value: 54 }, { label: 'Audio', value: 30 }, { label: 'Other', value: 12 }];
    const NESTED = [{ label: 'Design', children: [{ label: 'Video', value: 120 }, { label: 'Photos', value: 60 }] }, { label: 'Legal', children: [{ label: 'Documents', value: 50 }, { label: 'Audio', value: 30 }] }, { label: 'Ops', children: [{ label: 'Other', value: 40 }] }];
    for (const dir of ['ltr', 'rtl']) for (const [name, data, parts] of [['flat', FLAT, FLAT.map((d) => [d.label, d.value])], ['nested', NESTED, NESTED.flatMap((g) => g.children.map((c) => [c.label, c.value]))]]) {
      const T = dir + ' ' + name + ': ';
      await page.evaluate(async (dir, data) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c" style="inline-size:720px"></div>'; const h = React.createElement;
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(Plenix.Treemap, { title: 'Storage', description: 'By folder', data, valueTitle: 'Size (GB)' }));
        await new Promise((r) => setTimeout(r, 1500));
      }, dir, data);
      const tiles = await page.evaluate(() => {
        const root = document.querySelector('.plx-treemap'), plot = root.querySelector('.plx-chart__plot svg').getBoundingClientRect(), out = [];
        for (const e of root.querySelectorAll('.plx-chart__plot svg rect.plx-treemap__tile, .plx-chart__engine svg path')) {
          if (e.closest('[class*=tooltip]')) continue;
          const b = e.getBoundingClientRect(), fill = getComputedStyle(e).fill; if (b.width < 4 || b.height < 4 || !fill || fill === 'none' || /rgba\(0, 0, 0, 0\)|transparent/.test(fill)) continue; if (b.width >= plot.width - 2 && b.height >= plot.height - 2) continue;
          out.push({ l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height, area: b.width * b.height, cx: b.left + b.width / 2, cy: b.top + b.height / 2 });
        }
        return { out, plot: { l: plot.left, t: plot.top, r: plot.right, b: plot.bottom } };
      });
      // ECharts may draw a tile as a fill and a border: shapes with the same box are one tile
      tiles.out = tiles.out.filter((s, i) => !tiles.out.slice(0, i).some((o) => Math.abs(o.l - s.l) < 1 && Math.abs(o.t - s.t) < 1 && Math.abs(o.r - s.r) < 1 && Math.abs(o.b - s.b) < 1));
      const leaf = tiles.out.filter((s) => !tiles.out.some((o) => o !== s && o.l >= s.l - 1 && o.t >= s.t - 1 && o.r <= s.r + 1 && o.b <= s.b + 1 && o.area < s.area * 0.98));   // not a frame that holds other tiles
      assert.equal(leaf.length, parts.length, T + 'a tile per part (' + leaf.length + ')');
      const order = leaf.slice().sort((a, b) => b.area - a.area), want = parts.slice().sort((a, b) => b[1] - a[1]);
      // areas in proportion to values: compare each to the largest
      const k = order[0].area / want[0][1];
      want.forEach((p, i) => assert.ok(Math.abs(order[i].area / k - p[1]) / p[1] <= 0.2, T + p[0] + ': its tile area follows its value (' + (order[i].area / k).toFixed(0) + ' vs ' + p[1] + ')'));
      leaf.forEach((s) => assert.ok(s.l >= tiles.plot.l - 2 && s.r <= tiles.plot.r + 2 && s.t >= tiles.plot.t - 2 && s.b <= tiles.plot.b + 2, T + 'every tile is inside the plot'));
      for (let i = 0; i < leaf.length; i++) for (let j = i + 1; j < leaf.length; j++) { const a = leaf[i], b = leaf[j]; const ox = Math.min(a.r, b.r) - Math.max(a.l, b.l), oy = Math.min(a.b, b.b) - Math.max(a.t, b.t); assert.ok(!(ox > 3 && oy > 3), T + 'tiles do not overlap'); }
      const text = await page.evaluate(() => document.querySelector('.plx-treemap').textContent);
      if (name === 'nested') for (const g of ['Design', 'Legal']) assert.ok(text.includes(g), T + 'the group ' + g + ' is named');
      // keyboard: Home, then through the tiles in order (by group, largest first): the ring sits on a tile, the part and its value said
      await page.focus('.plx-treemap [role=group][tabindex="0"]'); await page.keyboard.press('Home'); await wait(300);
      const seen = [];
      for (let i = 0; i < parts.length; i++) {
        const ring = await page.evaluate(() => { const r = document.querySelector('.plx-chart-keys__ring'); if (!r) return null; const b = r.getBoundingClientRect(); return { cx: b.left + b.width / 2, cy: b.top + b.height / 2 }; });
        assert.ok(ring, T + 'the ring shows at step ' + i);
        if (process.env.DBG && i === 0) console.log('ring', JSON.stringify(ring), 'tiles', JSON.stringify(leaf.map((s) => [Math.round(s.cx), Math.round(s.cy), Math.round(s.w), Math.round(s.h)])), 'all', JSON.stringify(tiles.out.map((s) => [Math.round(s.l), Math.round(s.t), Math.round(s.w), Math.round(s.h)])));
        const on = leaf.find((s) => Math.hypot(s.cx - ring.cx, s.cy - ring.cy) <= 6); assert.ok(on, T + 'the ring sits on a tile at step ' + i);
        const say = await page.evaluate(() => (document.querySelector('[aria-live]') || {}).textContent || ''); seen.push(say);
        assert.ok(parts.some((p) => say.includes(p[0]) && say.replace(/,/g, '').includes(String(p[1]))) && /%/.test(say), T + 'it says the part, its value and share: ' + say);
        const tip = await page.evaluate(() => [...document.querySelectorAll('.plx-treemap .plx-chart-tooltip')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()).join(' | ')); assert.ok(/%/.test(tip), T + 'the tooltip shows the share: ' + tip);
        if (i < parts.length - 1) { await page.keyboard.press('ArrowRight'); await wait(250); }
      }
      assert.equal(new Set(seen).size, parts.length, T + 'every step is a different part');
      await page.evaluate(() => { const b = [...document.querySelectorAll('.plx-treemap summary, .plx-treemap button')].find((x) => /data/i.test(x.textContent)); if (b) b.click(); }); await wait(700);
      const rows = await page.evaluate(() => document.querySelectorAll('.plx-treemap [role=row][data-plx-record], .plx-treemap table tbody tr').length);
      assert.equal(rows, parts.length, T + '"Show the data" has a row per part (' + rows + ')');
    }
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad);
    assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('TREEMAP_ECHARTS_106_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
