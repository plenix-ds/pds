/* Plenix tests · #997 (ADR 0039, D-0125, D-0127): AppHeader brand={{ logo, organization, application }}.
   Summary: the object form draws the default brand's layout with the app's logo, organization (product line) and application (app line), instead of "Plenix";
     a 1:1 logo is 36 by 36px, a 4:1 logo is at most 108px wide and keeps its proportions; the logo has no background, border or radius; a failed image is hidden;
     a long organization ends in an ellipsis; the logo sits at the inline start (right in RTL); with brandHref the brand is one link; as the switcher's
     trigger its name holds the organization and application; an element brand is unchanged.
   Proof first: before the change an object brand is rendered as a React child and throws.
   Usage: node tests/app-header-brand-997.test.js   → APP_HEADER_BRAND_997_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9809, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const svg = (w, h) => 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><rect width="100%" height="100%" fill="#06c"/></svg>');
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(dir + ' ' + e.message)); await page.setViewport({ width: 1100, height: 500 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const T = dir + ': ';
      const mount = (brand, extra) => page.evaluate(async (dir, brand, extra) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = Plenix; window.__root && window.__root.unmount();
        document.querySelector('main').textContent = ''; const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').appendChild(c);
        window.__root = ReactDOM.createRoot(c); window.__root.render(h(P.AppHeader, Object.assign({ tone: 'plain', brand }, extra))); await new Promise((r) => setTimeout(r, 700));
      }, dir, brand, extra || {});
      const read = () => page.evaluate(() => { const b = document.querySelector('#c .plx-app-header__brand'), l = b.querySelector('.plx-app-header__logo'), r = l && l.getBoundingClientRect(), cs = l && getComputedStyle(l), br = b.getBoundingClientRect();
        const prod = b.querySelector('.plx-app-header__product'), app = b.querySelector('.plx-app-header__app');
        return { text: b.textContent.trim(), tag: b.tagName, logo: !!l, w: r && Math.round(r.width), h: r && Math.round(r.height), bg: cs && cs.backgroundColor, bw: cs && cs.borderTopWidth, rad: cs && cs.borderTopLeftRadius, disp: cs && cs.display, fit: cs && cs.objectFit,
          atStart: r && (document.documentElement.dir === 'rtl' ? br.right - r.right < 8 : r.left - br.left < 8), alt: l && l.getAttribute('alt'), org: prod && prod.textContent, application: app && app.textContent, cut: prod && prod.scrollWidth > prod.clientWidth, links: document.querySelectorAll('#c a.plx-app-header__brand').length }; });
      await mount({ logo: { src: svg(100, 100) }, organization: 'Diocese of Los Angeles', application: 'Clerical Tribunal Management' });
      let s = await read();
      assert.ok(!/Plenix/.test(s.text), T + 'no Plenix in the brand: ' + s.text); assert.equal(s.org, 'Diocese of Los Angeles', T + 'the organization is the product line'); assert.equal(s.application, 'Clerical Tribunal Management', T + 'the application is the app line');
      assert.deepEqual([s.w, s.h], [36, 36], T + 'a square logo is 36 by 36'); assert.equal(s.alt, '', T + 'alt defaults to empty');
      assert.equal(s.bg, 'rgba(0, 0, 0, 0)', T + 'the logo has no background'); assert.equal(s.bw, '0px', T + 'no border'); assert.equal(s.rad, '0px', T + 'no radius'); assert.equal(s.atStart, true, T + 'the logo is at the inline start');
      await mount({ logo: { src: svg(400, 100), alt: 'Diocese' }, organization: 'Diocese', application: 'Tribunal' });
      s = await read(); assert.ok(s.w <= 108 && s.w >= 100 && s.h <= 36, T + 'a 4:1 logo is at most 108px wide (' + s.w + 'x' + s.h + ')'); assert.equal(s.fit, 'contain', T + 'contain'); assert.equal(s.alt, 'Diocese');
      // a failed image is hidden
      await mount({ logo: { src: 'http://localhost:' + PORT + '/nope.png' }, organization: 'Diocese', application: 'Tribunal' }); await new Promise((r) => setTimeout(r, 600));
      s = await read(); assert.equal(s.logo, false, T + 'a failed logo is not drawn');
      // a long organization ends in an ellipsis
      await mount({ organization: 'The Roman Catholic Archdiocese of Los Angeles and Surroundings', application: 'Tribunal' }, {});
      s = await read(); assert.equal(s.cut, true, T + 'a long organization is cut with an ellipsis'); assert.equal(s.logo, false, T + 'no logo, no mark');
      // a cut line shows the Tooltip on keyboard focus of the link, and adds no tab stop
      await mount({ organization: 'The Roman Catholic Archdiocese of Los Angeles and Surroundings', application: 'Tribunal' }, { brandHref: '/home' });
      const stops = () => page.evaluate(() => [...document.querySelectorAll('#c a, #c button, #c [tabindex]')].filter((x) => x.tabIndex >= 0).length);
      const withTip = await stops(); await page.focus('#c a.plx-app-header__brand'); await page.keyboard.press('Shift'); await new Promise((r) => setTimeout(r, 700));
      assert.equal(await page.evaluate(() => [...document.querySelectorAll('[role=tooltip]')].filter((x) => /Archdiocese/.test(x.textContent)).length), 1, T + 'focus shows the Tooltip for a cut line');
      assert.equal(await page.evaluate(() => document.querySelectorAll('#c [title]').length), 0, T + 'no native title');
      await mount({ organization: 'Diocese', application: 'Tribunal' }, { brandHref: '/home' }); await page.focus('#c a.plx-app-header__brand'); await page.keyboard.press('Shift'); await new Promise((r) => setTimeout(r, 700));
      assert.equal(await page.evaluate(() => [...document.querySelectorAll('[role=tooltip]')].filter((x) => x.textContent.trim()).length), 0, T + 'no Tooltip while the text fits'); assert.equal(await stops(), withTip, T + 'the tab order is unchanged');
      // application only: defaults to the computed app name; one link with brandHref
      await mount({ organization: 'Diocese' }, { appName: 'Tribunal', brandHref: '/home' });
      s = await read(); assert.equal(s.application, 'Tribunal', T + 'the application defaults to the app name'); assert.equal(s.links, 1, T + 'with brandHref the brand is one link');
      // an element brand is unchanged
      await mount(null, {}); await page.evaluate(() => window.__root.render(React.createElement(Plenix.AppHeader, { tone: 'plain', brand: React.createElement('b', { id: 'mine' }, 'Mine') }))); await new Promise((r) => setTimeout(r, 400));
      assert.equal(await page.evaluate(() => document.querySelector('#c #mine').textContent), 'Mine', T + 'an element brand is drawn as given');
      // the switcher trigger is named by the brand
      await page.evaluate(() => window.__root.render(React.createElement(Plenix.AppHeader.Switcher, { currentApp: 'assets', brand: { organization: 'Diocese', application: 'Tribunal' } }))); await new Promise((r) => setTimeout(r, 500));
      const name = await page.evaluate(() => document.querySelector('#c button[aria-haspopup=dialog]').getAttribute('aria-label'));
      assert.ok(/Diocese Tribunal/.test(name), T + 'the switcher name holds organization and application: ' + name);
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('APP_HEADER_BRAND_997_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
