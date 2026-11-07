/* Plenix tests · Field `span` (issue 947, ADR 0029, D-0102): a Textarea (or RichTextEditor) Field spans every column of a grid by default, and a spanning Field lets its control fill it.
   Summary: in <Columns count={2}> with two Fields side by side and a Field with a Textarea below, at 1366 and 1920 wide: the Textarea's inline-end edge equals the second column's and its inline start the
     first column's (the right edge, the left in right to left); with span={1} it stays in the first column; span={2} spans two columns of a three-column grid; the one-line fields keep their cell and their own 600px
     cap; a Textarea Field in a one-column Form (no grid) fills the form's width. Left to right and right to left.
   Proof first: before the change the Textarea stops at the 600px field cap, short of the second column's edge, and `span` is not a prop.
   Usage: node tests/textarea-span-947.test.js   → TEXTAREA_SPAN_947_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9947, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ', end = dir === 'rtl' ? 'l' : 'r', start = dir === 'rtl' ? 'r' : 'l';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time/.test(m.text())) problems.push(m.text()); });
      for (const width of [1366, 1920]) {
        await page.setViewport({ width, height: 900 });
        await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
        const run = (tree, cols) => page.evaluate(async (dir, tree, cols) => {
          document.documentElement.setAttribute('dir', dir); window.__root && window.__root.unmount();
          const host = document.createElement('div'); host.id = 'c'; host.style.padding = '16px'; document.querySelector('main').replaceChildren(host);
          const h = React.createElement, P = window.Plenix; window.__root = ReactDOM.createRoot(host); window.__root.render(eval(tree));
          await new Promise((res) => setTimeout(res, 700));
          const box = (e) => { const b = e.getBoundingClientRect(); return { l: Math.round(b.left), r: Math.round(b.right) }; };
          const ta = document.querySelector('textarea'), grid = document.querySelector('.plx-columns'), fields = [...document.querySelectorAll('.plx-field')].map(box);
          return { ta: box(ta), grid: grid ? box(grid) : null, form: document.querySelector('.plx-form') ? box(document.querySelector('.plx-form')) : null, fields, ctl: [...document.querySelectorAll('input, select')].map(box), cls: ta.closest('.plx-field').className };
        }, dir, tree, cols);
        const T2 = T + width + 'px: ';
        // the owner's case: two fields side by side, a Textarea Field below
        let r = await run("h(P.Form, { label: 'Case summary' }, h(P.Columns, { count: 2 }, h(P.Field, { label: 'Reason' }, h(P.Input, null)), h(P.Field, { label: 'Member' }, h(P.Select, { options: [{ value: 'a', label: 'A' }] })), h(P.Field, { label: 'Children' }, h(P.Textarea, { rows: 4 }))))");
        assert.ok(Math.abs(r.ta[end] - r.grid[end]) <= 1 && Math.abs(r.ta[start] - r.grid[start]) <= 1, T2 + 'the Textarea Field spans both columns by default ' + JSON.stringify({ ta: r.ta, grid: r.grid }));
        const col2 = r.fields[1];
        assert.ok(Math.abs(r.ta[end] - col2[end]) <= 1, T2 + 'its inline end equals the second column\'s');
        r.ctl.forEach((c, i) => assert.ok(Math.abs(Math.abs(c.r - c.l) - Math.min(Math.abs(r.fields[i].r - r.fields[i].l), 600)) <= 1, T2 + 'a one-line field fills its cell up to its own cap'));
        // span 1 keeps it in one column
        r = await run("h(P.Columns, { count: 2 }, h(P.Field, { label: 'Reason' }, h(P.Input, null)), h(P.Field, { label: 'Member' }, h(P.Select, { options: [{ value: 'a', label: 'A' }] })), h(P.Field, { label: 'Children', span: 1 }, h(P.Textarea, { rows: 4 })))");
        assert.ok(Math.abs(r.ta[end] - r.fields[0][end]) <= 1 || Math.abs(r.ta[end] - r.fields[0][end]) <= 1, T2 + 'span={1} keeps the Textarea in the first column ' + JSON.stringify({ ta: r.ta, f: r.fields[0] }));
        // span 2 of 3
        r = await run("h(P.Columns, { count: 3 }, h(P.Field, { label: 'A' }, h(P.Input, null)), h(P.Field, { label: 'B' }, h(P.Input, null)), h(P.Field, { label: 'C' }, h(P.Input, null)), h(P.Field, { label: 'Notes', span: 2 }, h(P.Textarea, { rows: 3 })))");
        assert.ok(Math.abs(r.ta[end] - r.fields[1][end]) <= 1 && Math.abs(r.ta[start] - r.fields[0][start]) <= 1, T2 + 'span={2} spans the first two of three columns ' + JSON.stringify({ ta: r.ta, f: r.fields.slice(0, 2) }));
        // a one-column Form (no grid): the Textarea Field fills the form
        r = await run("h(P.Form, { label: 'F' }, h(P.Field, { label: 'Children' }, h(P.Textarea, { rows: 3 })))");
        assert.ok(Math.abs(r.ta[end] - r.form[end]) <= 1 && Math.abs(r.ta[start] - r.form[start]) <= 1, T2 + 'in a one-column Form the Textarea fills the form ' + JSON.stringify({ ta: r.ta, form: r.form }));
      }
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | '));
    console.log('TEXTAREA_SPAN_947_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
