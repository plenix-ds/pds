/* Plenix tests · Button elevation (issue 610; the owner's pick G-R4-H, his GO recorded on 610).
   Summary: secondary, tertiary, primary and danger are raised, light and dark:
     at rest a very subtle glow (a radial gradient, the plain fill to 90%; #910, #269) and no shadow (D-0054); on hover the glow
       under an 8% state layer and the card's Halo shadow (#910); pressed the glow under a 10% layer and no shadow; disabled flat
       (no gradient, no shadow). Hover and pressed are state layers over an unchanged fill, border and text (D-0037, #109), so
       the 610 steps (a deeper hover fill and border, gray-200 and gray-250 fills) are gone (#1333)
     primary and danger: the border is the glow's rim (blue-600, red-800) and the bottom edge one shade deeper (blue-700,
       red-900) at rest; hovered, the border stays the rim
     secondary and tertiary keep the control fill in every state
     ghost stays flat at rest and takes only the state layer (no glow, no shadow); so do buttons in a Toolbar (bar buttons) and the 2xs size
     tertiary's words pass 4.5:1 on its fill
   Proof first: before 610 every button is flat (no gradient, no shadow) and primary's border is its fill: those lines fail.
     After #109 the hover, pressed and fill lines of the 610 build failed on the state layer (D-0037); they now follow it (#1333).
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
        const glow = /radial-gradient\(.* 90%, .* 100%\)$/, layer = (a) => new RegExp('^linear-gradient\\(color\\(srgb [\\d. ]+ / ' + a + '\\) 0px, color\\(srgb [\\d. ]+ / ' + a + '\\) 0px\\), ');
        assert.match(r[k + '-rest'].image, new RegExp('^' + glow.source), mode + ' ' + k + ': the subtle glow at rest, no layer (fill to 90%)');
        assert.notEqual(r.halo, 'none', mode + ': the card Halo resolves');
        assert.equal(r[k + "-rest"].shadow, "none", mode + " " + k + ": no shadow at rest (D-0054, #269)");
        assert.match(r[k + '-hover'].image, layer('0.08'), mode + ' ' + k + ': hover is an 8% state layer (D-0037)');
        assert.match(r[k + '-hover'].image, glow, mode + ' ' + k + ': the glow stays under the hover layer (fill to 90%)');
        assert.equal(r[k + '-hover'].bg, r[k + '-rest'].bg, mode + ' ' + k + ': hover keeps the rest fill (D-0037)');
        assert.equal(r[k + '-hover'].shadow, r.halo, mode + ' ' + k + ': the card Halo on hover, as at rest (#910)');
        assert.match(r[k + '-pressed'].image, layer('0.1'), mode + ' ' + k + ': pressed is a 10% state layer (D-0037)');
        assert.match(r[k + '-pressed'].image, glow, mode + ' ' + k + ': the glow stays under the pressed layer');
        assert.equal(r[k + '-pressed'].bg, r[k + '-rest'].bg, mode + ' ' + k + ': pressed keeps the rest fill (D-0037)');
        assert.equal(r[k + '-pressed'].shadow, 'none', mode + ' ' + k + ': no shadow when pressed');
        assert.deepEqual([r[k + '-disabled'].image, r[k + '-disabled'].shadow], ['none', 'none'], mode + ' ' + k + ' disabled: flat');
      }
      assert.deepEqual([r['ghost-rest'].image, r['ghost-rest'].shadow], ['none', 'none'], mode + ' ghost rest: flat');
      for (const s of ['hover', 'pressed']) assert.deepEqual([/^linear-gradient\(.*\), none$/.test(r['ghost-' + s].image), r['ghost-' + s].shadow], [true, 'none'], mode + ' ghost ' + s + ': a state layer only, no glow, no shadow');
      for (const id of ['bar-secondary', 'bar-primary', 'small']) assert.deepEqual([r[id].image, r[id].shadow], ['none', 'none'], mode + ' ' + id + ': flat (a bar button, the 2xs size)');
      // primary and danger: the rim border and the deeper bottom edge at rest; hovered, the border stays the rim (D-0037; the same in light and dark)
      assert.deepEqual([r['primary-rest'].border, r['primary-rest'].bottom, r['primary-hover'].border], [rgb('#1F5BB8'), rgb('#005A9E'), rgb('#1F5BB8')], mode + ' primary edges');
      assert.deepEqual([r['danger-rest'].border, r['danger-rest'].bottom, r['danger-hover'].border], [rgb('#990000'), rgb('#7A0000'), rgb('#990000')], mode + ' danger edges');
      // the fill under the glow, the same in every state
      const fill = rgb(mode === 'light' ? '#FFFFFF' : '#444444');
      for (const k of ['secondary', 'tertiary']) assert.deepEqual(['rest', 'hover', 'pressed'].map((s) => r[k + '-' + s].bg), [fill, fill, fill], mode + ' ' + k + ' fill is the same at rest, hover and pressed');
      for (const s of ['rest', 'hover', 'pressed']) assert.ok(contrast(r['tertiary-' + s].text, r['tertiary-' + s].bg) >= 4.5, mode + ' tertiary ' + s + ': its words pass 4.5:1');
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('BUTTON_ELEVATION_610_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
