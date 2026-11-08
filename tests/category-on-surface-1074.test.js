/* Plenix tests · a category's text color on the page surface and the Cascader placeholder in dark mode (issue 1074, ADR 0046, D-0137).
   Summary: every --plx-sys-category-<hue>-on-surface is 4.5:1 or more on --plx-sys-surface-default in light and dark; light keeps the on-soft value; a plain DataPill with a category and the Cascader placeholder have
     no axe color-contrast violation in light and dark.
   Proof first: before the change the tokens do not exist, the plain pill measured 2.95:1 (blue) and 2.65:1 (green) in dark and the Cascader placeholder 3.04:1.
   Usage: node tests/category-on-surface-1074.test.js   → CATEGORY_ON_SURFACE_1074_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9974, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    await page.addScriptTag({ url: 'http://localhost:' + PORT + '/Plenix/node_modules/axe-core/axe.min.js' });
    const HUES = ['red', 'green', 'yellow', 'blue', 'orange', 'purple', 'cyan', 'magenta', 'lime', 'pink', 'teal', 'lavender', 'brown', 'beige', 'maroon', 'mint', 'olive', 'apricot', 'navy', 'gray', 'grey', '1', '2', '3', '4', '5', '6', '7', '8'];
    for (const mode of ['light', 'dark']) {
      const r = await page.evaluate((mode, HUES) => {
        document.documentElement.setAttribute('data-plx-mode', mode);
        const rgb = (n) => { const e = document.createElement('i'); e.style.color = 'var(' + n + ')'; document.body.appendChild(e); const v = getComputedStyle(e).color; e.remove(); return v; };
        const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number).slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; };
        const bg = rgb('--plx-sys-surface-default');
        return HUES.map((h) => { const f = rgb('--plx-sys-category-' + h + '-on-surface'), soft = rgb('--plx-sys-category-' + h + '-on-soft'), a = lum(f), b = lum(bg); return { h, f, soft, ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) }; });
      }, mode, HUES);
      for (const x of r) { assert.ok(x.ratio >= 4.5, mode + ': category-' + x.h + '-on-surface is 4.5:1 or more on the surface (' + x.ratio.toFixed(2) + ', ' + x.f + ')'); if (mode === 'light') assert.equal(x.f, x.soft, 'light keeps on-soft for ' + x.h); }
      const violations = await page.evaluate(async (mode) => {
        document.documentElement.setAttribute('data-plx-mode', mode); const h = React.createElement, P = Plenix;
        const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c);
        ReactDOM.createRoot(c).render(h('div', null, h(P.Cascader, { label: 'Office', options: [{ id: 'eu', label: 'Europe', children: [{ id: 'p', label: 'Paris' }] }] }),
          ['blue', 'green', 'red', 'orange', 'purple', 'cyan', 'pink', 'teal', 'gray', 'yellow', 'magenta', 'lime', 'navy'].map((t) => h(P.DataPill, { key: t, tone: t, variant: 'plain' }, 'Name ' + t)), h(P.DataPill, { gender: 'male', variant: 'plain' }, 'Patrick')));
        await new Promise((r) => setTimeout(r, 700));
        return (await axe.run(c, { runOnly: ['color-contrast'] })).violations.flatMap((v) => v.nodes.map((n) => n.any.map((a) => a.message).join(' ').slice(0, 90) + ' | ' + n.html.slice(0, 70)));
      }, mode);
      assert.deepEqual(violations, [], mode + ': no color-contrast violation');
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('CATEGORY_ON_SURFACE_1074_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
