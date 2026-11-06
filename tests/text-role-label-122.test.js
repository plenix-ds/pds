/* Plenix tests · four parts take the whole label role (issue 122, Phase 4; the Design Director's G2 table on the issue).
   Summary: plx-command-menu__page-title, plx-search__popup-title, plx-combobox__group and plx-focus-order__number draw the label role in full: the font, size, weight,
     letter-spacing and line-height of --plx-sys-text-label-* (they set only some of the six before, the rest came from whatever was around them).
     The test reads the computed style of each class on a bare element in a body-text container, against a probe that carries the label role's own values, and
     prints how each differed from the surrounding text before (the "visible change" list for the owner). Light and dark; left to right and right to left.
   Proof first: before 122 letter-spacing and line-height of these parts were inherited from the container: the checks on those two properties fail where the container differs.
   Usage: node tests/text-role-label-122.test.js   → TEXT_ROLE_LABEL_122_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const CLASSES = ['plx-command-menu__page-title', 'plx-search__popup-title', 'plx-combobox__group', 'plx-focus-order__number'];
(async () => {
  const PORT = +process.env.TEST_PORT || 9900, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [], changes = {};
    for (const mode of ['light', 'dark']) for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 700, height: 500 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const out = await page.evaluate((mode, dir, classes) => {
        document.documentElement.setAttribute('data-plx-mode', mode); document.documentElement.setAttribute('dir', dir);
        const host = document.createElement('div'); host.style.cssText = 'font-size:13px;line-height:1.5;letter-spacing:0.02em'; document.body.appendChild(host);
        const probe = document.createElement('span'); probe.style.cssText = 'font-family:var(--plx-sys-text-label-font-family);font-size:var(--plx-sys-text-label-font-size);font-weight:var(--plx-sys-text-label-font-weight);letter-spacing:var(--plx-sys-text-label-letter-spacing);line-height:var(--plx-sys-text-label-line-height)'; probe.textContent = 'Label'; host.appendChild(probe);
        const want = getComputedStyle(probe), res = { want: { ff: want.fontFamily, fs: want.fontSize, fw: want.fontWeight, ls: want.letterSpacing, lh: want.lineHeight }, parts: {} };
        const around = getComputedStyle(host);
        for (const c of classes) { const el = document.createElement('span'); el.className = c; el.textContent = 'Label'; host.appendChild(el); const cs = getComputedStyle(el); res.parts[c] = { ff: cs.fontFamily, fs: cs.fontSize, fw: cs.fontWeight, ls: cs.letterSpacing, lh: cs.lineHeight, aroundLs: around.letterSpacing, aroundLh: around.lineHeight }; }
        return res;
      }, mode, dir, CLASSES);
      for (const c of CLASSES) {
        const p = out.parts[c], w = out.want;
        assert.equal(p.ff, w.ff, mode + ' ' + dir + ' ' + c + ': the label font'); assert.equal(p.ls, w.ls, mode + ' ' + dir + ' ' + c + ': the label letter-spacing (got ' + p.ls + ', the label role says ' + w.ls + ')'); assert.equal(p.lh, w.lh, mode + ' ' + dir + ' ' + c + ': the label line-height (got ' + p.lh + ', the label role says ' + w.lh + ')');
        changes[c] = { size: p.fs, weight: p.fw, letterSpacing: p.ls, lineHeight: p.lh };
      }
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log(JSON.stringify(changes)); console.log('TEXT_ROLE_LABEL_122_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
