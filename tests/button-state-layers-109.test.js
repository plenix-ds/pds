/* Plenix tests · Button state layers (issue 109; D-0037, ADR 0004, design 109-state-layers §1).
   Summary: the neutral, subtle and outline buttons (secondary, tertiary, ghost, danger-secondary) show Fluent 2's state layer: their fill does not change on
     hover or press; a see-through layer of the text colour sits over it, 8% on hover, 10% pressed and 10% on keyboard focus (--plx-sys-state-layer-*).
     disabled buttons show no layer; primary and danger keep their own stepped fills and show no layer (ruling on the PR); light and dark.
   Proof first: before 109 these buttons change fill on hover (tertiary and danger-secondary fill solid) and have no layer: those lines fail.
   Usage: node tests/button-state-layers-109.test.js   → BUTTON_STATE_LAYERS_109_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// the alpha of the first colour stop of a background-image: Chrome writes color-mix as color(srgb r g b / a)
const alpha = (img) => { const m = /\/\s*([0-9.]+)\)/.exec(img || ''); return m ? +m[1] : (/gradient/.test(img || '') ? 1 : 0); };
(async () => {
  const PORT = +process.env.TEST_PORT || 9850, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const mode of ['light', 'dark']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 900, height: 400 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate(async (mode) => {
        document.documentElement.setAttribute('data-plx-mode', mode); document.querySelector('main').innerHTML = '<div id="c" style="display:flex;gap:12px;padding:16px;flex-wrap:wrap"></div>'; const h = React.createElement;
        ReactDOM.createRoot(document.getElementById('c')).render(h(React.Fragment, null, ['secondary', 'tertiary', 'ghost', 'danger-secondary', 'primary', 'danger'].map((v) => h(Plenix.Button, { key: v, variant: v, id: 'b-' + v }, v)), h(Plenix.Button, { id: 'b-off', disabled: true }, 'off')));
        await new Promise((r) => setTimeout(r, 900));
      }, mode);
      const read = (id) => page.evaluate((id) => { const cs = getComputedStyle(document.getElementById(id)); return { bg: cs.backgroundColor, img: cs.backgroundImage }; }, id);
      const out = {};
      for (const v of ['secondary', 'tertiary', 'ghost', 'danger-secondary', 'primary', 'danger']) {
        await page.mouse.move(2, 2); await wait(200); const rest = await read('b-' + v);
        await page.hover('#b-' + v); await wait(300); const hover = await read('b-' + v);
        await page.mouse.down(); await wait(300); const pressed = await read('b-' + v); await page.mouse.up(); await page.mouse.move(2, 2); await wait(200);
        await page.keyboard.press('Tab'); await page.evaluate((id) => document.getElementById(id).focus(), 'b-' + v); await wait(300);
        const focus = await read('b-' + v);
        out[v] = { rest, hover, pressed, focus };
      }
      for (const v of ['secondary', 'tertiary', 'ghost', 'danger-secondary']) {
        const o = out[v];
        assert.equal(o.hover.bg, o.rest.bg, mode + ' ' + v + ': hover keeps the fill');
        assert.equal(o.pressed.bg, o.rest.bg, mode + ' ' + v + ': pressed keeps the fill');
        assert.ok(Math.abs(alpha(o.hover.img) - 0.08) < 0.005, mode + ' ' + v + ': hover layer is 8% (got ' + alpha(o.hover.img) + ')');
        assert.ok(Math.abs(alpha(o.pressed.img) - 0.1) < 0.005, mode + ' ' + v + ': pressed layer is 10% (got ' + alpha(o.pressed.img) + ')');
        assert.ok(Math.abs(alpha(o.focus.img) - 0.1) < 0.005, mode + ' ' + v + ': keyboard focus layer is 10% (got ' + alpha(o.focus.img) + ')');
      }
      for (const v of ['primary', 'danger']) {
        assert.notEqual(out[v].hover.bg, out[v].rest.bg, mode + ' ' + v + ': keeps its stepped hover fill');
        assert.ok(alpha(out[v].hover.img) === 0 || alpha(out[v].hover.img) === 1 && !/color\(srgb/.test(out[v].hover.img), mode + ' ' + v + ': no state layer');
      }
      await page.mouse.move(2, 2); await page.hover('#b-off'); await wait(300); const off = await read('b-off'); assert.ok(!/color\(srgb[^)]*\/\s*0\.08/.test(off.img), mode + ': a disabled button shows no layer');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('BUTTON_STATE_LAYERS_109_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
