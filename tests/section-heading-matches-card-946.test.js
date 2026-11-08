/* Plenix tests · a page section heading matches the card heading (issue 946, D-0110): SectionHeading and the Panel title draw with the same type, so the two can never drift apart.
   Summary: a SectionHeading (every level, and a plain label with no level) and a Panel title side by side, light and dark, left to right and right to left: font family, size, weight, line height,
     letter spacing, text transform and color are equal (14px bold uppercase in the default content ink); a collapsible SectionHeading still works with the keyboard.
   Proof first: before the change the SectionHeading is 10 to 13px in a muted ink and its size follows its level.
   Usage: node tests/section-heading-matches-card-946.test.js   → SECTION_HEADING_MATCHES_CARD_946_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9947, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) for (const mode of ['light', 'dark']) {
      const T = dir + ' ' + mode + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
      await page.setViewport({ width: 1366, height: 900 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const r = await page.evaluate(async (dir, mode) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-mode', mode);
        const host = document.createElement('div'); host.id = 'c'; document.querySelector('main').replaceChildren(host);
        const h = React.createElement, P = window.Plenix;
        ReactDOM.createRoot(host).render(h('div', null,
          h(P.Panel, { icon: 'document', title: 'Case summary' }, h('p', null, 'Body')),
          h(P.SectionHeading, { level: 2, id: 's2' }, 'Appearance'), h(P.SectionHeading, { level: 3, id: 's3' }, 'Notifications'), h(P.SectionHeading, { level: 4, id: 's4' }, 'Privacy'),
          h(P.SectionHeading, { level: null, id: 'sn' }, 'Plain label'), h(P.SectionHeading, { collapsible: true, expanded: true, controls: 'x', onToggle() { window.__t = (window.__t || 0) + 1; }, id: 'sc' }, 'Recent'),
          h(P.SectionHeading, { icon: 'document', id: 'si' }, 'With icon'), h(P.SectionHeading, { icon: 'document', collapsible: true, expanded: true, controls: 'x', onToggle() {}, id: 'sic' }, 'Collapsible icon')));
        await new Promise((res) => setTimeout(res, 800));
        const type = (el) => { const c = getComputedStyle(el); return [c.fontFamily, c.fontSize, c.fontWeight, c.lineHeight, c.letterSpacing, c.textTransform, c.color].join('|'); };
        const panel = type(document.querySelector('.plx-panel__title'));
        const geo = (el) => { const sp = el.querySelector('[class*=\"__icon\"]'); if (!sp) return null; const cs = getComputedStyle(el), ic = sp.querySelector('svg, .plx-icon') || sp, r = ic.getBoundingClientRect(), hr = el.getBoundingClientRect(), lab = sp.nextElementSibling || sp.parentElement.querySelector('[class*=\"label\"]');
          const sr = sp.getBoundingClientRect(); let lr = lab ? lab.getBoundingClientRect() : null; if (!lr) { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (n.textContent.trim() && !sp.contains(n)) { const rg = document.createRange(); rg.selectNodeContents(n); lr = rg.getBoundingClientRect(); break; } } } return { hidden: sp.getAttribute('aria-hidden'), size: Math.round(r.width), gap: Math.round(Math.abs(dirIsRtl() ? sr.left - lr.right : lr.left - sr.right)), start: dirIsRtl() ? Math.round(hr.right - sr.right) : Math.round(sr.left - hr.left), cls: el.className }; };
        function dirIsRtl() { return document.documentElement.dir === 'rtl'; }
        const panelIcon = geo(document.querySelector('.plx-panel__title'));
        return { panelIcon, icon: geo(document.getElementById('si')), iconToggle: geo(document.getElementById('sic')), panel, headings: ['s2', 's3', 's4', 'sn', 'sc'].map((id) => [id, type(document.getElementById(id))]) };
      }, dir, mode);
      for (const [id, t] of r.headings) assert.equal(t, r.panel, T + 'SectionHeading #' + id + ' has the card heading\'s type\n  ' + t + '\n  ' + r.panel);
      assert.ok(r.icon && r.icon.hidden === 'true', T + 'the icon is aria-hidden'); assert.ok(r.iconToggle && r.iconToggle.hidden === 'true', T + 'the icon in a collapsible heading is aria-hidden');
      assert.ok(/section-heading--icon/.test(r.icon.cls), T + 'the heading carries plx-section-heading--icon');
      assert.equal(r.icon.size, r.panelIcon.size, T + 'the icon is the Panel title icon\'s size (' + r.icon.size + ' and ' + r.panelIcon.size + ')');
      assert.equal(r.icon.gap, r.panelIcon.gap, T + 'the gap after the icon is the Panel title\'s (' + r.icon.gap + ' and ' + r.panelIcon.gap + ')');
      assert.ok(r.icon.start <= 2, T + 'the icon sits at the inline start (' + r.icon.start + 'px from the edge)');
      await page.keyboard.press('Shift');
      await page.evaluate(() => document.querySelector('#sc button').focus()); await page.keyboard.press('Enter'); await page.keyboard.press('Space');
      assert.equal(await page.evaluate(() => window.__t), 2, T + 'a collapsible SectionHeading toggles from the keyboard');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | '));
    console.log('SECTION_HEADING_MATCHES_CARD_946_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
