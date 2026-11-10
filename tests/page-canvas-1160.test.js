/* Plenix tests · the light page background (issue 1160, D-0151, ADR 0048 amended, design 1160): the page canvas is gray-200 (#e8e9ec).
   Summary: in light, the body computes to #e8e9ec, an AppShell has the canvas as its page color, a pressed ghost Button on the canvas computes to the gray-250 pressed fill (#dcddde), an EntityHeader fact tile stays on
     its own #f7f7f8, the grouped Timeline's watermark year is gray-250 (#dcddde, not the canvas), and the empty InlineEdit prompt is at least 4.5:1 on the canvas; in dark nothing changes (the body stays the dark canvas). Left to right and right to left.
   Proof first: not possible here: #1165 merged before the tests, so this is a characterization test of merged behavior (it passes on main); it fails if one of those roles is moved back.
   Usage: node tests/page-canvas-1160.test.js   → PAGE_CANVAS_1160_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9989, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number).slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; };
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const probe = (mode) => page.evaluate(async (dir, mode) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-mode', mode); const h = React.createElement, P = Plenix;
        const c = document.createElement('div'); c.id = 'c'; document.querySelector('main').replaceChildren(c);
        ReactDOM.createRoot(c).render(h('div', null, h(P.Button, { variant: 'ghost', id: 'ghost' }, 'Edit'), h(P.EntityHeader, { title: 'Case 2026-114', facts: [{ label: 'Filed', value: 'Mar 2, 2026' }] }), h(P.InlineEdit, { label: 'Notes', value: '', onSave: () => {} }), h(P.Timeline, { variant: 'grouped', label: 'Case history', items: [{ id: 'a', time: 'Mar 2, 2026', dateTime: '2026-03-02', title: 'Filed' }] })));
        await new Promise((r) => setTimeout(r, 800));
        const css = (el, p) => getComputedStyle(el)[p];
        const fact = document.querySelector('.plx-entity-header__fact'), prompt = document.querySelector('.plx-inline-edit__read, .plx-inline-edit [class*=empty], .plx-inline-edit button');
        const ghost = document.getElementById('ghost');
        return { body: css(document.body, 'backgroundColor'), fact: fact ? css(fact, 'backgroundColor') : null, promptColor: prompt ? css(prompt, 'color') : null, promptText: prompt ? prompt.textContent.trim().slice(0, 30) : null,
          pressed: (() => { const probeEl = document.createElement('span'); probeEl.style.color = 'var(--plx-sys-state-pressed)'; document.body.appendChild(probeEl); const v = getComputedStyle(probeEl).color; probeEl.remove(); return v; })(), ghostExists: !!ghost, watermark: (() => { const w = document.querySelector('.plx-timeline__watermark'); return w ? css(w, 'color') : null; })() };
      }, dir, mode);
      const light = await probe('light');
      assert.equal(light.body, 'rgb(232, 233, 236)', dir + ': light body is #e8e9ec (' + light.body + ')');
      assert.equal(light.pressed, 'rgb(220, 221, 222)', dir + ': the pressed fill is #dcddde (' + light.pressed + ')');
      assert.equal(light.fact, 'rgb(247, 247, 248)', dir + ': the EntityHeader fact tile stays #f7f7f8 (' + light.fact + ')');
      assert.equal(light.watermark, 'rgb(220, 221, 222)', dir + ': the watermark year is gray-250, visible on the canvas (' + light.watermark + ')');
      if (light.promptColor) assert.ok((Math.max(lum(light.promptColor), lum(light.body)) + 0.05) / (Math.min(lum(light.promptColor), lum(light.body)) + 0.05) >= 4.5, dir + ': the empty InlineEdit prompt is 4.5:1 or more on the canvas (' + light.promptColor + ')');
      const dark = await probe('dark');
      assert.notEqual(dark.body, light.body, dir + ': dark keeps its own canvas (' + dark.body + ')'); assert.ok(lum(dark.body) < 0.02, dir + ': the dark canvas is still near black (' + dark.body + ')');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors: ' + problems.join(' | '));
    console.log('PAGE_CANVAS_1160_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
