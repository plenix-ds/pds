/* Plenix tests · Button elevation (issue 610; the owner's pick G-R4-H, his GO recorded on 610).
   Summary: secondary, tertiary, primary and danger are raised, light and dark:
     at rest a very subtle glow (a radial gradient, the plain fill to 75%; #910) and the card's Halo shadow
       (card-elevation-halo-shadow); on hover the glow on the hover fill and the same Halo (#910: hover no longer steps up
       to Lifted); pressed and disabled flat (no gradient, no shadow)
     primary and danger: the border is the glow's rim (blue-600, red-800) and the bottom edge one shade deeper (blue-700,
       red-900); hovered, the border one shade deeper (blue-700, red-900)
     secondary hover gray-200 and pressed gray-250 (dark gray-700, gray-900); tertiary on the control fill, gray when hovered
     ghost stays flat; so do buttons in a Toolbar (bar buttons) and the 2xs size
     tertiary's words pass 4.5:1 on each of its fills
   Proof first: before 610 every button is flat (no gradient, no shadow) and primary's border is its fill: those lines fail.
   Usage: node tests/button-elevation-610.test.js   → BUTTON_ELEVATION_610_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)
const rgb = (h) => 'rgb(' + [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(', ') + ')';
const lum = (s) => { const c = s.match(/\d+/g).slice(0, 3).map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
(async () => {
  const PORT = +process.env.TEST_PORT || 9665, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const look = async (mode) => {
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      return page.evaluate(async (mode) => {
        document.documentElement.setAttribute('data-plx-mode', mode);
        const h = React.createElement, P = window.Plenix, KINDS = ['secondary', 'tertiary', 'primary', 'danger', 'ghost'], STATES = { rest: '', hover: 'is-hover', pressed: 'is-pointer-down' };
        document.getElementById('main').innerHTML = '<div id="c"></div>';
        ReactDOM.createRoot(document.getElementById('c')).render(h('div', null,
          ...KINDS.flatMap((k) => Object.keys(STATES).map((s) => h(P.Button, { key: k + s, id: k + '-' + s, variant: k, className: STATES[s] || undefined }, k))),
          ...KINDS.map((k) => h(P.Button, { key: k + 'd', id: k + '-disabled', variant: k, disabled: true }, k)),
          h(P.Button, { id: 'small', size: '2xs' }, 'Show more'),
          h(P.Toolbar, { label: 'Bar' }, h(P.Button, { id: 'bar-secondary' }, 'Bar'), h(P.Button, { id: 'bar-primary', variant: 'primary' }, 'Bar'))));
        await new Promise((r) => setTimeout(r, 800));
        const out = {};
        for (const e of document.querySelectorAll('#c .plx-button[id]')) { const cs = getComputedStyle(e);
          out[e.id] = { image: cs.backgroundImage, shadow: cs.boxShadow, border: cs.borderTopColor, bottom: cs.borderBottomColor, bg: cs.backgroundColor, text: cs.color }; }
        const probe = document.createElement('div'); probe.style.boxShadow = 'var(--plx-comp-card-elevation-halo-shadow)';
        document.getElementById('c').appendChild(probe); out.halo = getComputedStyle(probe).boxShadow; probe.remove();
        return out;
      }, mode);
    };
    for (const mode of ['light', 'dark']) {
      const r = await look(mode);
      for (const k of ['secondary', 'tertiary', 'primary', 'danger']) {
        assert.match(r[k + '-rest'].image, /^radial-gradient\(.* 75%, .* 100%\)$/, mode + ' ' + k + ': the subtle glow at rest (fill to 75%)');
        assert.notEqual(r.halo, 'none', mode + ': the card Halo resolves');
        assert.equal(r[k + '-rest'].shadow, r.halo, mode + ' ' + k + ': the card Halo at rest');
        assert.match(r[k + '-hover'].image, /^radial-gradient\(.* 75%, .* 100%\)$/, mode + ' ' + k + ': the subtle glow on hover (fill to 75%)');
        assert.equal(r[k + '-hover'].shadow, r.halo, mode + ' ' + k + ': the card Halo on hover, as at rest (#910)');
        for (const s of ['pressed', 'disabled']) assert.deepEqual([r[k + '-' + s].image, r[k + '-' + s].shadow], ['none', 'none'], mode + ' ' + k + ' ' + s + ': flat');
      }
      for (const s of ['rest', 'hover', 'pressed']) assert.deepEqual([r['ghost-' + s].image, r['ghost-' + s].shadow], ['none', 'none'], mode + ' ghost ' + s + ': flat');
      for (const id of ['bar-secondary', 'bar-primary', 'small']) assert.deepEqual([r[id].image, r[id].shadow], ['none', 'none'], mode + ' ' + id + ': flat (a bar button, the 2xs size)');
      // primary and danger: the rim border, the deeper bottom edge, the deeper hover border (the same in light and dark)
      assert.deepEqual([r['primary-rest'].border, r['primary-rest'].bottom, r['primary-hover'].border], [rgb('#1F5BB8'), rgb('#005A9E'), rgb('#005A9E')], mode + ' primary edges');
      assert.deepEqual([r['danger-rest'].border, r['danger-rest'].bottom, r['danger-hover'].border], [rgb('#990000'), rgb('#7A0000'), rgb('#7A0000')], mode + ' danger edges');
      // the fills under the glow
      const fills = mode === 'light' ? ['#FFFFFF', '#E8E9EC', '#DCDDDE'] : ['#444444', '#56585E', '#34363B'];
      assert.deepEqual([r['secondary-rest'].bg, r['secondary-hover'].bg, r['secondary-pressed'].bg], fills.map(rgb), mode + ' secondary rest, hover, pressed fills');
      assert.deepEqual([r['tertiary-rest'].bg, r['tertiary-hover'].bg, r['tertiary-pressed'].bg], fills.map(rgb), mode + ' tertiary rest, hover, pressed fills');
      for (const s of ['rest', 'hover', 'pressed']) assert.ok(contrast(r['tertiary-' + s].text, r['tertiary-' + s].bg) >= 4.5, mode + ' tertiary ' + s + ': its words pass 4.5:1');
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('BUTTON_ELEVATION_610_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
