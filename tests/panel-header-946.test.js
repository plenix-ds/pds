/* Plenix tests · the Panel header (issue 946, D-0106, the owner's read-only preset): 14px bold uppercase heading in the strong ink with its icon, a soft glow from the top of the card down to the heading
   line, and a divider under the heading inset to the header's own inline padding (not edge to edge).
   Summary: a Panel with an icon and a title, at 1366 and 1920, light and dark: the title is 14px, weight 700, uppercase, 20px line, in the default content ink; its icon shows; the header paints a glow
     (a gradient) and a divider layer shorter than the header by the header's inline padding on both sides (the inline start and end), with no edge-to-edge border; the body below is unchanged; right to left mirrors
     (the same insets). A Panel without a title still draws no header. Left to right and right to left.
   Proof first: before the change the title is not uppercase or 14px bold, the header has a full-width border and no glow.
   Usage: node tests/panel-header-946.test.js   → PANEL_HEADER_946_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9946, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
      for (const width of [1366, 1920]) for (const theme of ['light', 'dark']) {
        await page.setViewport({ width, height: 900 });
        await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
        const r = await page.evaluate(async (dir, theme) => {
          document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-theme', theme);
          const host = document.createElement('div'); host.id = 'c'; host.style.inlineSize = '720px'; document.querySelector('main').replaceChildren(host);
          const h = React.createElement, P = window.Plenix;
          ReactDOM.createRoot(host).render(h('div', null,
            h(P.Panel, { icon: 'document', title: 'Case summary', actions: h(P.Button, { size: 'sm' }, 'Edit') }, h('p', null, 'Body')),
            h('div', { id: 'bare' }, h(P.Panel, null, h('p', null, 'No header')))));
          await new Promise((res) => setTimeout(res, 800));
          const panel = document.querySelector('.plx-panel'), header = panel.querySelector('.plx-panel__header'), title = panel.querySelector('.plx-panel__title'), body = panel.querySelector('.plx-panel__body');
          const t = getComputedStyle(title), hs = getComputedStyle(header), pad = parseFloat(hs.paddingInlineStart) || 0, hb = header.getBoundingClientRect();
          return { size: t.fontSize, weight: t.fontWeight, caps: t.textTransform, line: t.lineHeight, color: t.color, tracking: t.letterSpacing, icon: !!panel.querySelector('.plx-panel__icon svg, .plx-panel__icon .plx-icon'),
            bg: hs.backgroundImage, bgSize: hs.backgroundSize, border: hs.borderBottomWidth, pad, hw: Math.round(hb.width), bare: !document.querySelector('#bare .plx-panel__header'),
            ink: getComputedStyle(document.documentElement).getPropertyValue('--plx-sys-content-default').trim() };
        }, dir, theme);
        const T2 = T + width + 'px ' + theme + ': ';
        assert.equal(r.size, '14px', T2 + 'the heading is 14px'); assert.ok(Number(r.weight) >= 700, T2 + 'the heading is bold (' + r.weight + ')');
        assert.equal(r.caps, 'uppercase', T2 + 'the heading is uppercase'); assert.equal(r.line, '20px', T2 + 'the heading has a 20px line');
        assert.ok(r.icon, T2 + 'the icon shows'); assert.ok(r.tracking === 'normal' ? false : (dir === 'rtl' ? true : parseFloat(r.tracking) > 0), T2 + 'caps tracking on the heading (' + r.tracking + ')');
        assert.equal(r.border, '0px', T2 + 'no edge-to-edge border under the header');
        assert.ok((r.bg.match(/gradient/g) || []).length >= 2, T2 + 'the header paints a glow and an inset divider layer (two gradients) ' + r.bg.slice(0, 160));
        const sizes = r.bgSize.split(/,(?![^(]*\))/).map((x) => x.trim()); const second = sizes[1] || '';
        const w = parseFloat((second.match(/^([\d.]+)px/) || [])[1] || (second.match(/^calc\((.+)\)/) ? NaN : 0));
        assert.ok(/calc\(100% - /.test(second) || (w > 0 && Math.abs(w - (r.hw - 2 * r.pad)) <= 1), T2 + 'the divider is inset by the header padding on both sides (' + second + ', header ' + r.hw + ', padding ' + r.pad + ')');
        assert.ok(r.bare, T2 + 'a Panel without a title draws no header');
      }
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | '));
    console.log('PANEL_HEADER_946_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
