// Plenix tests · visual snapshot: the computed styles of every Button (6 variants × 5 sizes × 7 states × 4 forms = 840) in
// light mode at the default density (Standard), compared with the committed baseline (tests/baselines/button.json).
// (reset, owner 2026-10-26: dark mode comes last; the themes and densities are on demand, theme.test.js and density.test.js)
// Only values that do not depend on the operating system's fonts are compared (no measured widths), so the baseline
// holds on Windows and on the Linux CI runner alike.
//   node tests/visual.test.js            compare (fails on any difference)
//   node tests/visual.test.js --update   write a new baseline (only after a change that is meant to look different)
//   TEST_SCOPE=full: always; by default (tests/changed.js) only when the Button, a global file or this test changed
const fs = require('fs');
const path = require('path');
const { ROOT, launch } = require('./lib.js');
const changed = require('./changed.js');
if (!changed.wants({ units: ['components/Button'] })) changed.none('VISUAL_OK 0 values (0 buttons)');
changed.report('every Button');
const BASELINE = path.join(__dirname, 'baselines', 'button.json');
const PLAT = 'file://' + (ROOT.startsWith('/') ? '' : '/') + ROOT.replace(/\\/g, '/') + '/platform/';
const VARIANTS = ['secondary', 'primary', 'tertiary', 'ghost', 'danger', 'danger-secondary'];
const SIZES = ['md', 'sm', 'xs', '2xs', 'lg'];
const STATES = ['rest', 'hover', 'selected', 'focus', 'disabled', 'loading', 'expanded'];
const FORMS = ['label', 'icon', 'icon-only', 'caret'];
const PROPS = ['background-color', 'color', 'border-top-color', 'border-left-color', 'border-top-width', 'border-top-style', 'border-top-left-radius',
  'box-shadow', 'outline-color', 'outline-style', 'outline-width', 'outline-offset', 'font-family', 'font-size', 'font-weight', 'line-height',
  'min-block-size', 'min-inline-size', 'padding-inline-start', 'padding-inline-end', 'padding-block-start', 'column-gap',
  'text-decoration-line', 'text-decoration-thickness', 'text-underline-offset', 'cursor', 'opacity'];
const SUB = { '.plx-button__icon': ['block-size', 'inline-size', 'background-color'], '.plx-button__caret': ['block-size', 'inline-size', 'color', 'transform'] };

(async () => {
  let html = '<!doctype html><html lang="en" data-plx-theme="default"><head><meta charset="utf-8"><link rel="stylesheet" href="' + PLAT + 'platform.css"></head><body>';
  for (const v of VARIANTS) for (const s of SIZES) for (const st of STATES) for (const f of FORMS) {
    const cls = ['plx-button', 'plx-button--' + v, s !== 'md' ? 'plx-button--size-' + s : '', f === 'icon-only' ? 'plx-button--icon-only' : '',
      st === 'hover' ? 'is-hover' : '', st === 'selected' ? 'is-selected' : '', st === 'focus' ? 'is-focus-visible' : '', st === 'loading' ? 'is-loading' : ''].filter(Boolean).join(' ');
    // the Icon component's span (plx-icon--inline: not a bare class, #557); the measured values are the slot's, not the drawing's
    const icon = f === 'icon' || f === 'icon-only' ? '<span class="plx-button__icon"><span class="plx-icon plx-icon--add plx-icon--inline" aria-hidden="true"></span></span>' : '';
    html += '<button data-id="' + [v, s, st, f].join('|') + '" class="' + cls + '"' + (st === 'disabled' ? ' disabled' : '') + (st === 'expanded' ? ' aria-expanded="true"' : '') + '>'
      + icon + (f === 'icon-only' ? '' : '<span class="plx-button__label">Save</span>') + (f === 'caret' ? '<span class="' + ['plx-button__caret', (v === 'primary' || v === 'danger' || st === 'disabled' || st === 'loading') ? 'plx-button__caret--current' : '', st === 'expanded' ? 'plx-button__caret--open' : ''].filter(Boolean).join(' ') + '"></span>' : '') + '</button> ';
  }
  html += '<span class="plx-button-group"><button class="plx-button plx-button--secondary plx-button--joined-end-square plx-button--joined" data-id="group|a">A</button><button class="plx-button plx-button--secondary plx-button--joined-start-seam plx-button--joined-end-square plx-button--joined" data-id="group|b">B</button><button class="plx-button plx-button--secondary plx-button--joined-start-seam plx-button--joined is-focus-visible" data-id="group|c">C</button></span></body></html>';
  const file = path.join(__dirname, '.visual-button.html');
  fs.writeFileSync(file, html);
  const browser = await launch();
  const page = await browser.newPage();
  await page.goto('file://' + (file.startsWith('/') ? '' : '/') + file.replace(/\\/g, '/'));
  const snap = {};
  for (const mode of ['light']) for (const density of ['standard']) {
    const r = await page.evaluate((mode, density, PROPS, SUB) => {
      document.documentElement.setAttribute('data-plx-mode', mode); document.documentElement.setAttribute('data-plx-density', density);
      const out = {};
      for (const el of document.querySelectorAll('[data-id]')) {
        const cs = getComputedStyle(el), o = {};
        for (const k of PROPS) o[k] = cs.getPropertyValue(k);
        for (const sel in SUB) { const c = el.querySelector(sel); if (c) { const s = getComputedStyle(c); for (const k of SUB[sel]) o[sel + ' ' + k] = s.getPropertyValue(k); } }
        out[el.dataset.id] = o;
      }
      return out;
    }, mode, density, PROPS, SUB);
    for (const k in r) snap[mode + '|' + density + '|' + k] = r[k];
  }
  await browser.close(); fs.unlinkSync(file);
  if (process.argv.includes('--update')) {
    fs.mkdirSync(path.dirname(BASELINE), { recursive: true });
    fs.writeFileSync(BASELINE, JSON.stringify(snap));
    console.log('VISUAL_BASELINE written: ' + Object.keys(snap).length + ' buttons');
    return;
  }
  const base = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  let n = 0; const diffs = [], byProp = {};
  for (const k of new Set(Object.keys(base).concat(Object.keys(snap)))) {
    const a = base[k] || {}, b = snap[k] || {};
    for (const p of new Set(Object.keys(a).concat(Object.keys(b)))) {
      n++; byProp[p] = byProp[p] || [];
      if (a[p] !== b[p]) { diffs.push(k + ' ' + p + ': ' + a[p] + ' -> ' + b[p]); byProp[p].push(k + ': ' + a[p] + ' -> ' + b[p]); }
    }
  }
  // one result per style property in the results file (TEST_RESULTS), so CI can quarantine the properties a stale baseline
  // differs in and still block on any other (#1327)
  const shared = require('./check.js');
  Object.keys(byProp).sort().forEach((p) => shared.record(p + ': every button matches the baseline', !byProp[p].length, byProp[p].length + ' buttons differ · e.g. ' + byProp[p].slice(0, 2).join(' | ')));
  const props = Object.keys(byProp).filter((p) => byProp[p].length).sort();
  if (props.length) console.log('  properties that differ: ' + props.map((p) => p + ' (' + byProp[p].length + ')').join(', '));
  diffs.slice(0, 30).forEach((d) => console.log('  ' + d));
  console.log((diffs.length ? 'VISUAL_FAIL ' + diffs.length + ' differences in ' : 'VISUAL_OK ') + n + ' values (' + Object.keys(snap).length + ' buttons)');
  shared.ended();   // every failure above is a recorded check (G5a I1)
  process.exit(diffs.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
