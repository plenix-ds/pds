/* Plenix tests · EntityHeader's { icon, hue } media: the icon without a box, as decided (issue 275, CTM#109; D-0024, D-0036, #108).
   Summary: the CTM owner, 2026-11-05, on the case header (media { icon: 'folder', hue: 'purple' }): "the icon does not have
     the box around it as we decided". The decision is D-0024 ("do not put an icon inside a box") as applied to this media
     by D-0036 (design: docs/pds1/slices/108-icon-box/design.md, row 1). Light:
     page and section headers, top-small (default) and top-large: the media tile has no fill (transparent), no border, and
       the icon fills the square: the Icon is the square times the icon fill scale (D-0059, #418: Material icons keep a margin,
       so the drawn shape reaches the square's edges), while the square itself stays 44px, 32px in a section, 72px top-large
     the icon is drawn in its hue's on-surface colour (--plx-comp-entity-header-media-<hue>-icon), for every hue
     media { icon, hue, box: true } keeps the tinted, bordered tile (a box stays only where a usage needs it, D-0024),
       with the icon at the tile's icon size, as before
     no script errors
   Proof first: before 275 the default tile has a soft fill and a 1px border, and the icon is 24px in a 44px tile.
   Usage: node tests/entity-header-media-275.test.js   → ENTITY_HEADER_MEDIA_275_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)
const HUES = ['blue', 'green', 'purple', 'red', 'brown', 'gray', 'surface'];
(async () => {
  const PORT = +process.env.TEST_PORT || 9671, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const r = await page.evaluate(async (HUES) => {
      const h = React.createElement, P = window.Plenix;
      document.documentElement.setAttribute('data-plx-mode', 'light');
      document.getElementById('main').innerHTML = '<div id="c"></div>';
      const head = (id, props) => h('div', { key: id, id }, h(P.EntityHeader, Object.assign({ title: 'Case 20261020-04', subtitle: 'William Hayes vs. Amelia Hayes' }, props)));
      ReactDOM.createRoot(document.getElementById('c')).render(h('div', null,
        head('case', { media: { icon: 'folder', hue: 'purple' } }),
        head('large', { layout: 'top-large', media: { icon: 'folder', hue: 'blue' } }),
        head('section', { kind: 'section', title: 'Comments', summary: '3 open', media: { icon: 'message', hue: 'green' } }),
        head('boxed', { media: { icon: 'folder', hue: 'purple', box: true } }),
        ...HUES.map((hue) => head('hue-' + hue, { media: { icon: 'folder', hue } }))));
      await new Promise((res) => setTimeout(res, 800));
      const probe = (v) => { const d = document.createElement('div'); d.style.color = v; document.getElementById('c').appendChild(d); const s = getComputedStyle(d).color; d.remove(); return s; };
      const out = {};
      for (const el of document.querySelectorAll('#c > div > div[id]')) {
        const tile = el.querySelector('.plx-entity-header__tile'), icon = tile.querySelector('.plx-icon');
        const cs = getComputedStyle(tile), tr = tile.getBoundingClientRect(), ir = icon.getBoundingClientRect();
        out[el.id] = { bg: cs.backgroundColor, border: cs.borderTopWidth, color: cs.color, tile: tr.width, icon: ir.width,
          scale: parseFloat(cs.getPropertyValue('--plx-comp-entity-header-media-icon-fill-scale')) };
      }
      out.expect = {};
      for (const hue of HUES) out.expect[hue] = probe('var(--plx-comp-entity-header-media-' + hue + '-icon)');
      out.boxBg = probe('var(--plx-comp-entity-header-tile-purple-background)');
      return out;
    }, HUES);
    const clear = (c) => c === 'transparent' || /rgba\(.*, 0\)$/.test(c);
    for (const id of ['case', 'large', 'section']) {
      assert.ok(clear(r[id].bg), id + ': no fill behind the icon, got ' + r[id].bg);
      assert.equal(r[id].border, '0px', id + ': no border around the icon');
      assert.ok(r[id].scale > 1, id + ': the icon fill scale token resolves (' + r[id].scale + ')');
      assert.ok(Math.abs(r[id].icon - r[id].tile * r[id].scale) < 0.5, id + ': the icon is its square times the fill scale (' + r[id].icon + ' of ' + r[id].tile + ' x ' + r[id].scale + ')');
    }
    assert.deepEqual([r.case.tile, r.large.tile, r.section.tile], [44, 72, 32], 'the squares: 44px, 72px top-large, 32px in a section');
    for (const hue of HUES) {
      assert.notEqual(r.expect[hue], '', hue + ': the media icon token resolves');
      assert.equal(r['hue-' + hue].color, r.expect[hue], hue + ': the icon in its on-surface colour');
      assert.ok(clear(r['hue-' + hue].bg), hue + ': no fill');
    }
    // the opt-in box: the tinted tile with its border, the icon at the tile's icon size
    assert.equal(r.boxed.bg, r.boxBg, 'box: true keeps the tinted fill');
    assert.equal(r.boxed.border, '1px', 'box: true keeps the 1px border');
    assert.ok(r.boxed.icon < r.boxed.tile, 'box: true draws the icon inside the tile, smaller than it');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('ENTITY_HEADER_MEDIA_275_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
