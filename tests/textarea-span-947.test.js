/* Plenix tests · a Textarea fills its row (issue 947, CTM): in a two-column grid of fields a field alone on its row spans both columns, and a Textarea ends exactly at the grid's inline-end edge.
   Summary: a form with two fields side by side in a two-column grid and a Textarea in a Field below them, at 900px and at 1400px: the Textarea's inline-end edge equals the grid's (the right edge; the left
     edge in right to left), and it starts at the inline start; the one-line fields in the grid still fill their own cells up to their own 600px cap; the Textarea does not overflow a narrow box. Left to right and right to left.
   Proof first: before the change the Textarea stops at the field-width cap (600px) and ends short of the grid's edge at 900px and more so at 1400px.
   Usage: node tests/textarea-span-947.test.js   → TEXTAREA_SPAN_947_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9947, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message)); await page.setViewport({ width: 1600, height: 900 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      for (const width of [900, 1400, 320]) {
        const r = await page.evaluate(async (dir, width) => {
          document.documentElement.setAttribute('dir', dir); window.__root && window.__root.unmount();
          const host = document.createElement('div'); host.id = 'c'; host.style.inlineSize = width + 'px'; document.querySelector('main').replaceChildren(host);
          const h = React.createElement, P = window.Plenix; window.__root = ReactDOM.createRoot(host);
          window.__root.render(h(P.Form, { label: 'Case summary' },
            h('div', { id: 'grid', style: { display: 'grid', gridTemplateColumns: width < 400 ? '1fr' : '1fr 1fr', columnGap: 16, rowGap: 16 } },
              h(P.Field, { label: 'Reason' }, h(P.Input, null)), h(P.Field, { label: 'Assigned member' }, h(P.Select, { options: ['a', 'b'] }))),
            h(P.Field, { label: 'Children', description: 'One child per line.' }, h(P.Textarea, { rows: 4 }))));
          await new Promise((res) => setTimeout(res, 700));
          const box = (e) => { const b = e.getBoundingClientRect(); return { l: Math.round(b.left), r: Math.round(b.right) }; };
          const grid = box(document.getElementById('grid')), ta = box(document.querySelector('textarea')), form = box(document.querySelector('.plx-form'));
          const cells = [...document.querySelectorAll('#grid .plx-field')].map(box), ctl = [...document.querySelectorAll('#grid .plx-field')].map((f) => box(f.querySelector('input, select, [role=combobox]')));
          return { grid, ta, form, cells, ctl, scroll: document.getElementById('c').scrollWidth - document.getElementById('c').clientWidth };
        }, dir, width);
        const T2 = T + width + 'px: ';
        const end = dir === 'rtl' ? 'l' : 'r', start = dir === 'rtl' ? 'r' : 'l';
        assert.ok(Math.abs(r.ta[end] - r.form[end]) <= 1 && Math.abs(r.ta[start] - r.form[start]) <= 1, T2 + 'the Textarea spans the whole row: ' + JSON.stringify({ ta: r.ta, form: r.form }));
        assert.ok(Math.abs(r.ta[end] - r.grid[end]) <= 1, T2 + 'its inline end equals the two-column grid\'s');
        if (width >= 400) r.ctl.forEach((c, i) => { const cw = Math.abs(r.cells[i].r - r.cells[i].l), w = Math.abs(c.r - c.l); assert.ok(Math.abs(w - Math.min(cw, 600)) <= 1, T2 + 'a one-line field in the grid still fills its cell up to its own 600px cap ' + JSON.stringify({ c, cell: r.cells[i] })); });
        assert.ok(r.scroll <= 1, T2 + 'nothing overflows');
      }
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors');
    console.log('TEXTAREA_SPAN_947_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
