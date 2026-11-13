/* Plenix tests · button label centering and the Danger pressed step (issue 610, owner 2026-10-29).
   Summary: two things the owner asked for in the button build.
     1. The label is centered in the button by its capital letters: the label box is trimmed to the letters (text-box: trim-both cap alphabetic), so the
        capitals sit within half a pixel of the button's middle at 32px and at 28px. Before, the capitals sat about 1.1px high at 28px.
     2. Danger and Danger secondary hold their fill in every state and show hover and pressed as a state layer (D-0037, #109: an 8% layer on hover, 10% pressed, over
        the rest glow; this replaced the 610 steps red-800 hover and red-900 pressed, which are now the glow's rim and the bottom edge, checked in
        button-elevation-610): Danger stays red-700 with the danger state-layer token colour, and Danger secondary keeps its fill with the neutral state-layer token colour (both read from the tokens, with the hover and pressed opacity tokens), in the light and in the dark theme.
   The probe is proved able to see the old values first: before the build, 28px read 1.13px high, so the centering limits below fail on the old code. Part 2 follows
     D-0037; it failed after #109 because it still asserted the 610 fill steps (#1333).
   Descenders: gypqjy and an Arabic label draw as far down as in a reference where the label is not clipped at all; the control without the clip margin shows the cut.
   Centering is measured on the picture: the button is photographed at four times the pixels with the text "HEH" (capitals only) and the first and last rows of dark ink
     give the capitals' middle.
   Usage: node tests/button-610.test.js   (run by layout.test.js when the Button changed) */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT0 = +process.env.TEST_PORT || 9630;
(async () => {
  const server = await serve(PORT0); let browser;
  try {
    browser = await launch(); const errors = [];
    const fresh = async (mode, scale) => {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message));
      await page.setViewport({ width: 900, height: 400, deviceScaleFactor: scale || 1 });
      await page.goto('http://localhost:' + PORT0 + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      if (mode) await page.evaluate((m) => document.documentElement.setAttribute('data-plx-mode', m), mode);
      return page;
    };
    // 1. the capitals' middle against the button's middle, in px (+ is low)
    const page = await fresh(null, 4);
    await page.evaluate(async () => {
      document.querySelector('main').innerHTML = '<div id="c" style="padding:24px"></div>'; const h = React.createElement, P = Plenix;
      ReactDOM.createRoot(document.getElementById('c')).render(h('div', { style: { display: 'flex', gap: 16, alignItems: 'center' } }, ['md', 'sm'].map((s) => h(P.Button, { key: s, size: s, id: 'b-' + s }, 'HEH'))));
      await new Promise((r) => setTimeout(r, 1200));
    });
    const offsets = {};
    for (const s of ['md', 'sm']) {
      const el = await page.$('#b-' + s), box = await el.boundingBox(), png = await el.screenshot({ encoding: 'base64' });
      offsets[s] = await page.evaluate(async (png, height) => {
        const img = await createImageBitmap(await (await fetch('data:image/png;base64,' + png)).blob()), c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d'); x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data, k = img.height / height, m = Math.round(2 * k);
        let top = -1, bot = -1;
        for (let y = m; y < c.height - m; y++) { let dark = 0; for (let xx = Math.round(8 * k); xx < c.width - Math.round(8 * k); xx++) { const i = (y * c.width + xx) * 4; if (d[i] + d[i + 1] + d[i + 2] < 300) dark++; } if (dark) { if (top < 0) top = y; bot = y; } }
        return ((top + bot + 1) / 2) / k - height / 2;
      }, png, box.height);
    }
    await page.close();
    assert.ok(Math.abs(offsets.md) <= 0.5, '32px: the capitals are within half a pixel of the middle, got ' + offsets.md.toFixed(2));
    assert.ok(Math.abs(offsets.sm) <= 0.5, '28px: the capitals are within half a pixel of the middle (the old build: 1.13 high), got ' + offsets.sm.toFixed(2));
    // 1b. descenders are not clipped: Latin letters with tails (gypqjy) and an Arabic label draw as far down in the button as in a reference where the label is not clipped at all.
    //     The control first shows the probe can see clipping: with the clip margin taken away (overflow-clip-margin: 0) the tails of gypqjy are cut at the baseline.
    const TEXT = { cap: 'HEH', latin: 'gypqjy', arabic: '\u062d\u0641\u0638 \u0627\u0644\u0645\u0644\u0641' };
    const inkBottoms = async (css) => {
      const p = await fresh(null, 4);
      await p.evaluate(async (T) => {
        document.querySelector('main').innerHTML = '<div id="c" style="padding:24px"></div>'; const h = React.createElement, P = Plenix;
        ReactDOM.createRoot(document.getElementById('c')).render(h('div', { style: { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' } },
          ['md', 'sm'].flatMap((s) => Object.keys(T).map((k) => h(P.Button, { key: s + k, size: s, id: 'b-' + s + '-' + k, lang: k === 'arabic' ? 'ar' : undefined }, T[k])))));
        await new Promise((r) => setTimeout(r, 1200));
      }, TEXT);
      if (css) await p.addStyleTag({ content: css });
      const out = {};
      for (const s of ['md', 'sm']) for (const k of Object.keys(TEXT)) {
        const el = await p.$('#b-' + s + '-' + k), box = await el.boundingBox(), png = await el.screenshot({ encoding: 'base64' });
        out[s + '-' + k] = await p.evaluate(async (png, height) => {
          const img = await createImageBitmap(await (await fetch('data:image/png;base64,' + png)).blob()), c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
          const x = c.getContext('2d'); x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data, kk = img.height / height, m = Math.round(2 * kk); let bot = -1;
          for (let y = m; y < c.height - m; y++) { let dark = 0; for (let xx = Math.round(8 * kk); xx < c.width - Math.round(8 * kk); xx++) { const i = (y * c.width + xx) * 4; if (d[i] + d[i + 1] + d[i + 2] < 300) dark++; } if (dark) bot = y; }
          return (bot + 1) / kk;
        }, png, box.height);
      }
      await p.close(); return out;
    };
    const real = await inkBottoms(null), unclipped = await inkBottoms('.plx-button__label{overflow-x:visible !important;overflow-y:visible !important}'), noMargin = await inkBottoms('.plx-button__label{overflow-clip-margin:0px !important}');
    for (const s of ['md', 'sm']) assert.ok(noMargin[s + '-latin'] <= real[s + '-cap'] + 0.25 && real[s + '-latin'] > real[s + '-cap'] + 2, s + ': the probe sees clipping: without the clip margin the tails of gypqjy are cut at the baseline');
    for (const s of ['md', 'sm']) for (const k of ['latin', 'arabic']) assert.ok(real[s + '-' + k] >= unclipped[s + '-' + k] - 0.25, s + ' ' + k + ': the label is not clipped (' + real[s + '-' + k] + ' against ' + unclipped[s + '-' + k] + ' unclipped)');
    // 2. the Danger fill and its state layers (D-0037), in both themes
    const read = async (mode) => {
      const p = await fresh(mode);
      await p.evaluate(async () => {
        document.querySelector('main').innerHTML = '<div id="c" style="display:flex;gap:12px;padding:16px"></div>'; const h = React.createElement;
        ReactDOM.createRoot(document.getElementById('c')).render(React.createElement(React.Fragment, null, ['danger', 'danger-secondary'].map((v) => h(Plenix.Button, { key: v, variant: v, id: 'b-' + v }, v))));
        await new Promise((r) => setTimeout(r, 900));
      });
      const out = {};
      for (const v of ['danger', 'danger-secondary']) {
        const col = () => p.evaluate((id) => (() => { const cs = getComputedStyle(document.getElementById(id)); return { fill: cs.backgroundColor, image: cs.backgroundImage }; })(), 'b-' + v);
        const rest = await col(); await p.hover('#b-' + v); await wait(250); const hover = await col(); await p.mouse.down(); await wait(250); const pressed = await col(); await p.mouse.up(); await p.mouse.move(2, 2);
        out[v] = { rest, hover, pressed };
      }
      // the state layer as the tokens resolve it, read from the page: Danger takes the danger layer colour, Danger secondary the neutral one (D-0037, #109)
      out.layers = await p.evaluate(() => {
        const TOK = { danger: '--plx-comp-button-danger-state-layer-color', 'danger-secondary': '--plx-comp-button-state-layer-color' }, AMT = { hover: '--plx-comp-button-state-layer-hover-opacity', pressed: '--plx-comp-button-state-layer-pressed-opacity' };
        const lp = document.createElement('div'); document.body.appendChild(lp); const L = {};
        for (const v of Object.keys(TOK)) { L[v] = {}; for (const a of Object.keys(AMT)) { lp.style.backgroundImage = 'linear-gradient(color-mix(in srgb, var(' + TOK[v] + ') var(' + AMT[a] + '), transparent) 0 0)'; L[v][a] = getComputedStyle(lp).backgroundImage; } }
        lp.style.color = 'var(' + TOK.danger + ')'; L.dangerColor = getComputedStyle(lp).color; lp.style.color = 'var(' + TOK['danger-secondary'] + ')'; L.neutralColor = getComputedStyle(lp).color; lp.remove(); return L;
      });
      await p.close(); return out;
    };
    for (const mode of ['light', 'dark']) {
      const c = await read(mode), d = c.danger, s = c['danger-secondary'];
      const layer = (x) => (x.image.match(/^linear-gradient\(color\(srgb ([\d. ]+) \/ ([\d.]+)\)/) || []).slice(1);
      assert.deepEqual([d.rest.fill, d.hover.fill, d.pressed.fill], Array(3).fill('rgb(183, 0, 0)'), mode + ': Danger keeps its red-700 fill at rest, hover and pressed (D-0037)');
      assert.notEqual(c.layers.dangerColor, c.layers.neutralColor, mode + ': the danger and neutral layer colours differ, so a swapped colour is seen');
      assert.deepEqual([d.hover, d.pressed].map((x) => x.image.split(', radial-gradient')[0]), [c.layers.danger.hover, c.layers.danger.pressed], mode + ': Danger shows hover and pressed as the danger state-layer token colour at the hover (8%) and pressed (10%) opacity tokens');
      assert.deepEqual([d.hover, d.pressed].map((x) => layer(x)[1]), ['0.08', '0.1'], mode + ': Danger layer amounts are 8% and 10% (D-0037)');
      assert.equal(d.rest.image.startsWith('radial-gradient('), true, mode + ': Danger rest is the glow alone, no layer');
      assert.match(d.rest.image, /\(rgb\(183, 0, 0\) 90%, rgb\(153, 0, 0\) 100%\)$/, mode + ': the glow runs from red-700 to a red-800 rim');
      assert.deepEqual([s.rest.fill, s.hover.fill, s.pressed.fill], Array(3).fill(s.rest.fill), mode + ': Danger secondary keeps its fill in every state (D-0037)');
      assert.deepEqual([s.hover, s.pressed].map((x) => x.image.split(', radial-gradient')[0]), [c.layers['danger-secondary'].hover, c.layers['danger-secondary'].pressed], mode + ': Danger secondary shows hover and pressed as the neutral state-layer token colour at the hover (8%) and pressed (10%) opacity tokens');
      assert.deepEqual([s.hover, s.pressed].map((x) => layer(x)[1]), ['0.08', '0.1'], mode + ': Danger secondary layer amounts are 8% and 10% (D-0037)');
      assert.equal(s.rest.image.startsWith('radial-gradient('), true, mode + ': Danger secondary rest is the glow alone, no layer');
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('button-610: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
