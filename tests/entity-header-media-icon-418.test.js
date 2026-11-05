// Plenix tests · #418 (D-0055): with no box the media icon fills the square it takes, in every layout and for a section,
// and box: true keeps the smaller icon in its tile.
//   node tests/entity-header-media-icon-418.test.js   → ENTITY_HEADER_MEDIA_ICON_418_OK
const assert = require('assert/strict');
const { serve, launch } = require('./lib.js');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9654;
  await serve(PORT); const browser = await launch();
  try {
    const page = await browser.newPage(); await page.setViewport({ width: 1200, height: 900 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const rows = await page.evaluate(() => new Promise((resolve) => {
      const layouts = ['top-small', 'top-large', 'column-small', 'column-large', 'edge'];
      const cases = [];
      for (const kind of ['page', 'section']) for (const layout of layouts) for (const box of [false, true]) cases.push({ kind, layout, box });
      document.querySelector('main').innerHTML = cases.map((_, i) => '<div id="c' + i + '" style="width:900px;margin-bottom:8px"></div>').join('');
      cases.forEach((c, i) => ReactDOM.createRoot(document.getElementById('c' + i)).render(React.createElement(Plenix.EntityHeader, { kind: c.kind, layout: c.layout, title: 'Council Session', subtitle: 'Weekly meeting of the parish council and its committees', media: { icon: 'event', hue: 'blue', box: c.box } })));
      setTimeout(() => resolve(cases.map((c, i) => {
        const root = document.getElementById('c' + i), tile = root.querySelector('.plx-entity-header__tile'), svg = tile && tile.querySelector('svg, .plx-icon'), path = svg && svg.querySelector('path');
        const t = tile && tile.getBoundingClientRect(), s = svg && svg.getBoundingClientRect(), g = path && path.getBoundingClientRect();
        return Object.assign({}, c, { tile: t && Math.round(t.width), tileH: t && Math.round(t.height), icon: s && Math.round(s.width), glyph: g && Math.round(Math.max(g.width, g.height)) });
      })), 1500);
    }));
    for (const r of rows) {
      const name = r.kind + ' ' + r.layout + (r.box ? ' box' : '');
      assert.ok(r.tile && r.icon, name + ': a tile and an icon are drawn');
      if (!r.box) {
        const area = Math.min(r.tile, r.tileH);
        assert.ok(r.icon >= area - 1, name + ': the icon (' + r.icon + 'px) fills the square (' + r.tile + 'x' + r.tileH + ')');
        assert.ok(r.glyph && Math.abs(r.glyph - area) <= Math.max(3, area * 0.1), name + ': the drawn glyph (' + r.glyph + 'px) spans the area (' + area + 'px) within 3px or 10% (D-0059)');
      }
      else assert.ok(r.icon < r.tile, name + ': the boxed icon (' + r.icon + 'px) is smaller than its tile (' + r.tile + 'px)');
    }
    console.log('ENTITY_HEADER_MEDIA_ICON_418_OK ' + rows.length + ' cases');
  } catch (e) { console.log('ENTITY_HEADER_MEDIA_ICON_418_FAIL ' + e.message); await browser.close(); process.exit(1); }
  await browser.close(); process.exit(0);
})();
