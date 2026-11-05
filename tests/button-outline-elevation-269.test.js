/* Plenix tests · the outline buttons share one light elevation (issue 269, CTM#115; the owner's earlier direction #6).
   Summary: the CTM owner, 2026-11-05: "Buttons are not consistent. Delete has no glow or shadow. Reduce glow and shadow
     and make buttons look consistent." secondary, tertiary and danger-secondary, side by side, light and dark:
     at rest each has the same shadow, control-raised-shadow, which is lighter than the card Halo it replaces (fewer
       layers, a smaller blur), and a very subtle glow (a radial gradient, the plain fill to 90%)
     hovered, the same shadow (hover does not deepen it) and the glow on the hover fill
     pressed and disabled flat (no gradient, no shadow); in a Toolbar, and at the 2xs size, flat as before
   Proof first: before 269 danger-secondary has no gradient and no shadow, and the others carry the card Halo: those
     lines fail.
   Usage: node tests/button-outline-elevation-269.test.js   → BUTTON_OUTLINE_ELEVATION_269_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)
// a box-shadow's layers: each one's blur radius (the third length) and its colour's alpha
const layers = (s) => (s === 'none' ? [] : s.split(/,(?![^(]*\))/).map((l) => {
  const alpha = (l.match(/rgba?\(([^)]*)\)/) || [, '0,0,0,1'])[1].split(',').map(Number)[3];
  const px = (l.replace(/rgba?\([^)]*\)/, '').match(/-?[\d.]+px/g) || []).map(parseFloat);
  return { blur: px[2] || 0, alpha: alpha === undefined ? 1 : alpha };
}));
(async () => {
  const PORT = +process.env.TEST_PORT || 9669, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const look = async (mode) => {
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      return page.evaluate(async (mode) => {
        document.documentElement.setAttribute('data-plx-mode', mode);
        const h = React.createElement, P = window.Plenix, KINDS = ['secondary', 'tertiary', 'danger-secondary'], STATES = { rest: '', hover: 'is-hover', pressed: 'is-pointer-down' };
        document.getElementById('main').innerHTML = '<div id="c"></div>';
        ReactDOM.createRoot(document.getElementById('c')).render(h('div', null,
          ...KINDS.flatMap((k) => Object.keys(STATES).map((s) => h(P.Button, { key: k + s, id: k + '-' + s, variant: k, className: STATES[s] || undefined }, k))),
          ...KINDS.map((k) => h(P.Button, { key: k + 'd', id: k + '-disabled', variant: k, disabled: true }, k)),
          h(P.Button, { id: 'danger-secondary-small', variant: 'danger-secondary', size: '2xs' }, 'Remove'),
          h(P.Toolbar, { label: 'Bar' }, h(P.Button, { id: 'bar-danger-secondary', variant: 'danger-secondary' }, 'Delete'))));
        await new Promise((r) => setTimeout(r, 800));
        const out = {};
        for (const e of document.querySelectorAll('#c .plx-button[id]')) { const cs = getComputedStyle(e); out[e.id] = { image: cs.backgroundImage, shadow: cs.boxShadow }; }
        const probe = (v) => { const d = document.createElement('div'); d.style.boxShadow = v; document.getElementById('c').appendChild(d); const s = getComputedStyle(d).boxShadow; d.remove(); return s; };
        out.raised = probe('var(--plx-sys-control-raised-shadow)');
        out.halo = probe('var(--plx-comp-card-elevation-halo-shadow)');
        return out;
      }, mode);
    };
    for (const mode of ['light', 'dark']) {
      const r = await look(mode);
      assert.notEqual(r.raised, 'none', mode + ': control-raised-shadow resolves');
      // lighter than the card Halo: fewer layers, and no layer blurs wider than the Halo's widest
      const L = layers(r.raised), H = layers(r.halo);
      assert.ok(L.length < H.length, mode + ': fewer shadow layers than the card Halo (' + r.raised + ' vs ' + r.halo + ')');
      assert.ok(Math.max(...L.map((x) => x.blur)) < Math.max(...H.map((x) => x.blur)), mode + ': a smaller blur than the card Halo');
      for (const k of ['secondary', 'tertiary', 'danger-secondary']) {
        assert.match(r[k + '-rest'].image, /^radial-gradient\(.* 90%, .* 100%\)$/, mode + ' ' + k + ': the very subtle glow at rest (fill to 90%)');
        assert.equal(r[k + '-rest'].shadow, r.raised, mode + ' ' + k + ': the one light shadow at rest');
        assert.match(r[k + '-hover'].image, /^radial-gradient\(.* 90%, .* 100%\)$/, mode + ' ' + k + ': the glow on hover (fill to 90%)');
        assert.equal(r[k + '-hover'].shadow, r.raised, mode + ' ' + k + ': the same shadow on hover');
        for (const s of ['pressed', 'disabled']) assert.deepEqual([r[k + '-' + s].image, r[k + '-' + s].shadow], ['none', 'none'], mode + ' ' + k + ' ' + s + ': flat');
      }
      // side by side they match: one elevation across the outline family
      assert.equal(new Set(['secondary', 'tertiary', 'danger-secondary'].map((k) => r[k + '-rest'].shadow)).size, 1, mode + ': the three share one shadow at rest');
      for (const id of ['bar-danger-secondary', 'danger-secondary-small']) assert.deepEqual([r[id].image, r[id].shadow], ['none', 'none'], mode + ' ' + id + ': flat (a bar button, the 2xs size)');
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('BUTTON_OUTLINE_ELEVATION_269_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
