/* Plenix tests · stacked Fields have space (issue 273, CTM#117): in a FormFlow with two Columns the label sits one gap above its
   control, and the second row of fields is one gap (the Columns' gap) below the first, not touching it.
   Usage: node tests/field-columns-gap-273.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9648, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const draw = (gap) => page.evaluate(async (g) => {
      const h = React.createElement, P = Plenix, F = (l, c) => h(P.Field, { label: l }, c);
      document.querySelector('main').innerHTML = '<div id="v" style="width:700px"></div>';
      ReactDOM.createRoot(document.getElementById('v')).render(h(P.ToastProvider, null, h(P.FormFlow, { surface: 'page', title: 'Session', initialValue: {}, onSubmit: () => {} },
        () => h(P.Columns, { count: 2, gap: g }, F('Date', h(P.Input, { type: 'date' })), F('Time', h(P.Input, { type: 'time' })), F('Type', h(P.Select, { options: [{ value: 'a', label: 'A' }] })), F('Name', h(P.Input, {}))))));
      await new Promise((r) => setTimeout(r, 600));
      const f = [...document.querySelectorAll('#v .plx-field')].map((e) => { const r = e.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, lab: e.querySelector('label').getBoundingClientRect().bottom, ctl: e.querySelector('.plx-field__control').getBoundingClientRect().top, left: r.left }; });
      const cols = getComputedStyle(document.querySelector('#v .plx-columns'));
      return { f, columnGap: parseFloat(cols.columnGap) };
    }, gap);
    for (const gap of ['md', 'lg']) {
      const { f, columnGap } = await draw(gap);
      assert.ok(f[0].ctl - f[0].lab > 0, gap + ': a gap between the label and the control: ' + (f[0].ctl - f[0].lab));
      const rowGap = f[2].top - f[0].bottom;
      assert.ok(Math.abs(rowGap - columnGap) < 0.5 && rowGap > 0, gap + ': the second row is one column gap (' + columnGap + 'px) below the first, got ' + rowGap);
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('field-columns-gap-273: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
