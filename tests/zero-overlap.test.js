// Plenix tests · zero overlap at run time (the Plenix Styling Standard 3.5; tests/clash-audit.js --strict).
//   1. The audit's fixtures (tests/fixtures/zero-overlap/audit.html): every element reports exactly the overlaps and
//      dependencies it declares in data-expect and data-expect-deps, with the pseudo-classes in data-force forced on.
//   2. The pilot (tests/fixtures/zero-overlap/pilot.html, when present): every element marked data-pilot has zero
//      overlap in every state the page forces, and the conditions it ran in are printed (its coverage).
// Prints ZERO_OVERLAP_TEST_OK, or each element that differs, and exits 1.
const assert = require('node:assert/strict');
const fs = require('fs'), path = require('path');
const { serve, launch, sleep } = require('./lib.js');
const { audit } = require('./clash-audit.js');

// Properties left out of the computed-style snapshot (#359), these (the first five from #359). They differ between Chrome versions and
// between Windows and Linux fonts, and the test's aim is that the styling rules did not change:
//   text-decoration-skip-spaces  Chrome 156 no longer lists it (the baseline, made with an older Chrome, has it everywhere)
//   width, inline-size           measured sizes (a text field's default width, text widths) change with the platform's fonts
//   transform-origin, perspective-origin   derived from the measured size
//   text-decoration-inset, position-visibility   the CI runner's Chrome lists the first on no element and spells the second
//     anchors-visible, where the Chrome that took the snapshot has 0px and anchor-visible (found on #782, issue 46)
// Precedent: the Visual test (tests/visual.test.js) leaves out measured widths for the same reason. Not a general escape hatch.
const SKIP = ['text-decoration-skip-spaces', 'width', 'inline-size', 'transform-origin', 'perspective-origin', 'text-decoration-inset', 'position-visibility'];
const without = (style) => style.split(';').filter((x) => !SKIP.includes(x.slice(0, x.indexOf(':')))).join(';');

// forces the pseudo-classes named in data-force (hover, active, focus, focus-visible, focus-within) on their elements
async function force(page) {
  const cdp = await page.target().createCDPSession();
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '[data-force]' });
  for (const nodeId of nodeIds) {
    const { attributes } = await cdp.send('DOM.getAttributes', { nodeId });
    const v = attributes[attributes.indexOf('data-force') + 1];
    await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: v.split(/\s+/).filter(Boolean) });
  }
  return cdp;
}

(async () => {
  const PORT = +process.env.TEST_PORT || 8861, BASE = 'http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/zero-overlap/';
  const server = await serve(PORT), browser = await launch();
  const wrong = [];
  try {
    const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 1000 });
    // 1. the audit's own fixtures
    await page.goto(BASE + 'audit.html', { waitUntil: 'load' });
    await force(page);
    await page.evaluate(audit, false, 0, null, { strict: true, mark: true });
    const rows = await page.evaluate(() => [...document.querySelectorAll('[data-expect]')].map((e) => ({ el: e.tagName.toLowerCase() + '.' + (e.className || '') + (e.getAttribute('data-force') ? ':' + e.getAttribute('data-force') : ''),
      want: e.getAttribute('data-expect'), got: e.getAttribute('data-audit-overlap'), wantDeps: e.getAttribute('data-expect-deps'), gotDeps: e.getAttribute('data-audit-deps') })));
    for (const r of rows) {
      if (r.want !== r.got) wrong.push('fixture ' + r.el + ': overlaps expected [' + r.want + '], reported [' + r.got + ']');
      if (r.wantDeps !== null && r.wantDeps !== r.gotDeps) wrong.push('fixture ' + r.el + ': dependencies expected [' + r.wantDeps + '], reported [' + r.gotDeps + ']');
    }
    const fixtures = rows.length;
    // 2. the pilot: every element of every [data-pilot-scope] section, at two densities, with and without reduced
    // motion. Under reduced motion every duration is 0s and the computed styles are compared with the snapshot taken
    // before the rewrite (tests/baselines/pilot-computed.json; --record takes it) so the rewrite is proven to change
    // nothing. With motion on, the forced states are caught mid-transition, so only overlaps are judged there.
    let pilot = 0, cover = null; const overlaps = {}, snapshot = {};
    const SNAP = path.join(__dirname, 'baselines', 'pilot-computed.json'), RECORD = process.argv.includes('--record');
    if (fs.existsSync(path.join(__dirname, 'fixtures', 'zero-overlap', 'pilot.html'))) {
      for (const density of ['standard', 'comfortable']) for (const motion of ['reduce', 'no-preference']) {
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: motion }]);
        await page.goto('about:blank'); await page.goto(BASE + 'pilot.html?density=' + density, { waitUntil: 'load' });
        await page.waitForFunction(() => document.body.getAttribute('data-pilot-ready') === 'true', { timeout: 30000 });
        await page.evaluate(() => document.fonts.ready); await sleep(300);
        await force(page);
        const r = await page.evaluate(audit, false, 0, null, { strict: true, mark: true });
        cover = cover || []; cover.push(r.conditions);
        const found = await page.evaluate((reduce, skip) => {
          const label = (e) => e.tagName.toLowerCase() + [...e.classList].slice(0, 3).map((c) => '.' + c).join('') + (e.getAttribute('data-force') ? ':' + e.getAttribute('data-force').replace(/ /g, ':') : '') + (e.closest('[data-plx-surface]') ? ' in ' + e.closest('[data-plx-surface]').getAttribute('data-plx-surface') : '');
          const els = [...document.querySelectorAll('[data-pilot-scope], [data-pilot-scope] *')].filter((e) => !e.closest('svg'));
          // standard properties only: every element inherits the custom properties (the icon glyphs alone are megabytes)
          return els.map((e, i) => { const cs = getComputedStyle(e); const names = []; for (let j = 0; j < cs.length; j++) if (!cs[j].startsWith('--') && !skip.includes(cs[j])) names.push(cs[j]);
            return { i, scope: e.closest('[data-pilot-scope]').getAttribute('data-pilot-scope'), el: label(e), got: e.getAttribute('data-audit-overlap'),
              moving: reduce ? [cs.transitionDuration, cs.animationDuration].join(',').split(',').some((d) => parseFloat(d) > 0) : false,
              style: reduce ? names.sort().map((p) => p + ':' + cs.getPropertyValue(p)).join(';') : null }; });
        }, motion === 'reduce', SKIP);
        pilot = found.length;
        for (const f of found) {
          if (f.got) for (const p of f.got.split(',')) { const k = f.scope + ' | ' + p; (overlaps[k] = overlaps[k] || new Set()).add(f.el); }
          if (f.moving) wrong.push('pilot (' + density + ', reduced motion) ' + f.el + ': a duration is not 0s');
          // by position: an element that gains a class (a part taking its own state) is still the same element
          if (f.style) snapshot[density + ' #' + f.i] = f.el + '\n' + f.style;
        }
      }
      const n = Object.values(overlaps).reduce((a, s) => a + s.size, 0);
      if (n) { Object.entries(overlaps).sort().forEach(([k, s]) => console.log('OVERLAP ' + k + '  (' + s.size + ': ' + [...s].slice(0, 3).join(', ') + (s.size > 3 ? ' …' : '') + ')')); if (!RECORD) wrong.push('pilot: ' + Object.keys(overlaps).length + ' overlapping properties on ' + n + ' elements'); }
      if (RECORD) { fs.writeFileSync(SNAP, JSON.stringify({ $description: 'The pilot page\'s computed styles under reduced motion, taken before the zero-overlap rewrite (tests/zero-overlap.test.js --record).', styles: snapshot }) + '\n'); console.log('Recorded ' + Object.keys(snapshot).length + ' computed styles to tests/baselines/pilot-computed.json'); }
      else if (fs.existsSync(SNAP)) {
        const before = JSON.parse(fs.readFileSync(SNAP, 'utf8')).styles;
        for (const k of Object.keys(before)) { const [label, style] = before[k].split('\n'); before[k] = label + '\n' + without(style); }
        const keys = new Set([...Object.keys(before), ...Object.keys(snapshot)]);
        for (const k of keys) if (before[k] !== snapshot[k]) {
          if (!before[k] || !snapshot[k]) { wrong.push('pilot element ' + (before[k] ? 'gone' : 'new') + ': ' + k); continue; }
          const [la, sa] = before[k].split('\n'), [lb, sb] = snapshot[k].split('\n');
          if (sa === sb) continue;
          const a = Object.fromEntries(sa.split(';').map((x) => [x.slice(0, x.indexOf(':')), x.slice(x.indexOf(':') + 1)])), b = Object.fromEntries(sb.split(';').map((x) => [x.slice(0, x.indexOf(':')), x.slice(x.indexOf(':') + 1)]));
          wrong.push('pilot changed ' + k + ' ' + lb + (la !== lb ? ' (was ' + la + ')' : '') + ': ' + Object.keys(Object.assign({}, a, b)).filter((p) => a[p] !== b[p]).slice(0, 6).map((p) => p + ' ' + a[p] + ' -> ' + b[p]).join('; '));
        }
      }
    }
    if (wrong.length) { console.log(wrong.join('\n')); console.log('ZERO_OVERLAP_TEST_FAIL (' + wrong.length + ')'); process.exitCode = 1; return; }
    console.log('ZERO_OVERLAP_TEST_OK ' + fixtures + ' audit fixtures as expected' + (pilot ? '; pilot: ' + pilot + ' elements, zero overlap; coverage ' + cover.map((c) => c.width + 'px ' + c.theme + '/' + c.mode + ' ' + c.density + (c.reducedMotion ? ' reduced-motion' : ' motion') + ' forced [' + c.forced.join(' ') + ']').join(' | ') : ''));
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
