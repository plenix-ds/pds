/* Plenix tests · the TimePicker option and the BottomSheetNav tile label take the whole text role (issue 122, Phase 4).
   Summary: plx-time-picker__option draws the body role's weight, letter-spacing and line-height (in the data font, the body size or its own size);
     plx-bottom-sheet-nav__tile-label draws the secondary role's font, weight, letter-spacing and line-height (it used the label font and label-height-sm before: a visible change).
     Computed style on a bare element inside a container whose text differs, against probes carrying each role's own values. Light and dark; left to right and right to left.
   Proof first: before 122 these properties came from the surrounding text or the label tokens, so the checks on them fail.
   Usage: node tests/text-role-time-tile-122.test.js   → TEXT_ROLE_TIME_TILE_122_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9900, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const mode of ['light', 'dark']) for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 700, height: 500 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const out = await page.evaluate((mode, dir) => {
        document.documentElement.setAttribute('data-plx-mode', mode); document.documentElement.setAttribute('dir', dir);
        const host = document.createElement('div'); host.style.cssText = 'font-size:19px;line-height:2;letter-spacing:0.1em;font-weight:700'; document.body.appendChild(host);
        const probe = (role) => { const s = document.createElement('span'); s.style.cssText = ['font-family', 'font-weight', 'letter-spacing', 'line-height'].map((k) => k + ':var(--plx-sys-text-' + role + '-' + k + ')').join(';'); s.textContent = 'x'; host.appendChild(s); const c = getComputedStyle(s); return { ff: c.fontFamily, fw: c.fontWeight, ls: c.letterSpacing, lh: c.lineHeight, fs: c.fontSize }; };
        const part = (cls) => { const s = document.createElement('span'); s.className = cls; s.textContent = '10:30'; host.appendChild(s); const c = getComputedStyle(s); return { ff: c.fontFamily, fs: c.fontSize, fw: c.fontWeight, ls: c.letterSpacing, lh: c.lineHeight }; };
        return { body: probe('body'), secondary: probe('secondary'), option: part('plx-time-picker__option'), tile: part('plx-bottom-sheet-nav__tile-label') };
      }, mode, dir);
      const ratio = (x) => +(parseFloat(x.lh) / parseFloat(x.fs)).toFixed(3), t = mode + ' ' + dir + ' ';
      assert.equal(out.option.fw, out.body.fw, t + 'time option weight'); assert.equal(parseFloat(out.option.ls) / parseFloat(out.option.fs), parseFloat(out.body.ls) / parseFloat(out.body.fs), t + 'time option letter-spacing'); assert.equal(ratio(out.option), ratio(out.body), t + 'time option line-height ratio');
      for (const k of ['ff', 'fw']) assert.equal(out.tile[k], out.secondary[k], t + 'tile label ' + k);
      assert.equal(ratio(out.tile), ratio(out.secondary), t + 'tile label line-height ratio');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('TEXT_ROLE_TIME_TILE_122_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
