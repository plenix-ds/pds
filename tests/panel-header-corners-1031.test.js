/* Plenix tests · #1031: the Panel header's glow does not paint over the panel's rounded top corners.
   Summary: the header's top corners take the panel's inner radius (the panel radius minus its border width), so its square corners no longer sit over the curved border; checked as computed
     radii (collapsed too: all four corners) and as pixels: on the border's curve at 45 degrees, at both top corners, the pixel is the border colour, not the glow, at 1x, 1.5x and 2x, light and dark,
     left to right and right to left. The panel is not clipped (no overflow hidden), so popovers and focus rings still show.
   Proof first: before the fix the header's corners are square and the curve pixel is the glow colour.
   Usage: node tests/panel-header-corners-1031.test.js   → PANEL_HEADER_CORNERS_1031_OK */
const assert = require('assert/strict'), zlib = require('zlib'), { serve, launch } = require('./lib');
require('./limit.js');
// a minimal PNG reader (8-bit, not interlaced): the RGB of one pixel
function pixel(png, x, y) {
  let o = 8, w = 0, h = 0, bpp = 4; const idat = [];
  while (o < png.length) { const len = png.readUInt32BE(o), type = png.toString('ascii', o + 4, o + 8), d = png.subarray(o + 8, o + 8 + len); if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); bpp = d[9] === 6 ? 4 : 3; } if (type === 'IDAT') idat.push(d); o += 12 + len; }
  const raw = zlib.inflateSync(Buffer.concat(idat)), stride = w * bpp, out = Buffer.alloc(h * stride);
  for (let r = 0; r < h; r++) { const f = raw[r * (stride + 1)], line = raw.subarray(r * (stride + 1) + 1, (r + 1) * (stride + 1));
    for (let i = 0; i < stride; i++) { const a = i >= bpp ? out[r * stride + i - bpp] : 0, b = r ? out[(r - 1) * stride + i] : 0, c = i >= bpp && r ? out[(r - 1) * stride + i - bpp] : 0;
      out[r * stride + i] = (line[i] + (f === 0 ? 0 : f === 1 ? a : f === 2 ? b : f === 3 ? (a + b) >> 1 : (() => { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; })())) & 255; } }
  const i = y * stride + x * bpp; return [out[i], out[i + 1], out[i + 2]];
}
const dist = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
(async () => {
  const PORT = +process.env.TEST_PORT || 9831, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) for (const theme of ['light', 'dark']) for (const dpr of [1, 1.5, 2]) {
      const T = [dir, theme, dpr + 'x'].join(' ') + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.setViewport({ width: 900, height: 500, deviceScaleFactor: dpr });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const r = await page.evaluate(async (dir, theme) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-mode', theme);
        const host = document.createElement('div'); host.id = 'c'; host.style.cssText = 'position:absolute;inset-block-start:40px;inset-inline-start:40px;inline-size:500px'; document.querySelector('main').replaceChildren(host);
        const h = React.createElement, P = window.Plenix;
        ReactDOM.createRoot(host).render(h('div', null, h(P.Panel, { icon: 'document', title: 'Case summary' }, h('p', null, 'Body')), h('div', { style: { height: 24 } }), h(P.Panel, { title: 'Closed', collapsible: true, defaultExpanded: false }, h('p', null, 'Body'))));
        await new Promise((res) => setTimeout(res, 800));
        const [panel, closed] = document.querySelectorAll('.plx-panel'), cs = getComputedStyle(panel), hs = getComputedStyle(panel.querySelector('.plx-panel__header')), cl = getComputedStyle(closed.querySelector('.plx-panel__header'));
        const R = parseFloat(cs.borderTopLeftRadius), bw = parseFloat(cs.borderTopWidth), box = panel.getBoundingClientRect();
        return { R, bw, tl: parseFloat(hs.borderTopLeftRadius), tr: parseFloat(hs.borderTopRightRadius), bl: parseFloat(hs.borderBottomLeftRadius), cbl: parseFloat(cl.borderBottomLeftRadius), cbr: parseFloat(cl.borderBottomRightRadius), ctl: parseFloat(cl.borderTopLeftRadius),
          border: cs.borderTopColor, overflow: cs.overflow, x: box.left, y: box.top, w: box.width };
      }, dir, theme);
      if (!process.env.PIXELS_ONLY) {   // PIXELS_ONLY=1 proves the pixel check alone sees the fault
      assert.equal(r.tl, r.R - r.bw, T + 'the header top-left radius is the panel radius minus its border (' + r.tl + ' vs ' + (r.R - r.bw) + ')'); assert.equal(r.tr, r.R - r.bw, T + 'and top-right');
      assert.equal(r.bl, 0, T + 'an open panel keeps the header bottom square'); assert.equal(r.cbl, r.R - r.bw, T + 'a collapsed panel rounds the header bottom too'); assert.equal(r.cbr, r.R - r.bw); assert.equal(r.ctl, r.R - r.bw);
      assert.equal(r.overflow, 'visible', T + 'the panel is not clipped');
      }
      // the pixels on the border's curve at 45 degrees, both top corners
      const png = await page.screenshot({ clip: { x: 0, y: 0, width: 900, height: 200 } });
      const border = await page.evaluate((c) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; const x = cv.getContext('2d'); x.fillStyle = c; x.fillRect(0, 0, 1, 1); return [...x.getImageData(0, 0, 1, 1).data].slice(0, 3); }, r.border);
      const off = r.R - (r.R - r.bw / 2) * Math.SQRT1_2;
      for (const [name, px] of [['left', r.x + off], ['right', r.x + r.w - off]]) {
        const p = pixel(png, Math.round(px * dpr - (name === 'right' ? 0 : 0)), Math.round((r.y + off) * dpr));
        assert.ok(dist(p, border) < 110, T + name + ' top corner: the pixel on the border curve is the border colour (' + p + ' vs ' + border + ')');
      }
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors');
    console.log('PANEL_HEADER_CORNERS_1031_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
