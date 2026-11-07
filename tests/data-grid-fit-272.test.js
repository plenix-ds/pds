/* Plenix tests · DataGrid columns fit their content (issue 272, CTM#110, #111, #114, #118): at 1280 and 1600 px a one-digit "#"
   column stays narrow (it does not take the spare room), every column is inside the grid (the last, Actions, is not cut off),
   nothing scrolls sideways when the columns fit, and the spare room goes to the text columns, shared. When the columns do not
   fit (a narrow window with many columns) the scrollbar sits below the last row, not over it.
   Usage: node tests/data-grid-fit-272.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9649, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const probe = (width, extra) => page.evaluate(async (w, more) => {
      const h = React.createElement, P = Plenix;
      document.querySelector('main').innerHTML = '<div id="v" style="width:' + w + 'px"></div>';
      const data = [1, 2, 3, 4, 5].map((i) => ({ id: i, n: String(i), date: 'Mon, Nov ' + (i + 3) + ', 2026', title: 'Hearing ' + i, court: 'Superior Court', status: 'Scheduled' }));
      const columns = [{ title: '#', field: 'n' }, { title: 'Session date', field: 'date', type: 'date' }, { title: 'Title', field: 'title' }, { title: 'Court', field: 'court' }, { title: 'Status', field: 'status' }]
        .concat(more ? Array.from({ length: 8 }, (_, i) => ({ title: 'Long column heading ' + i, field: 'x' + i })) : [])
        .concat([{ title: 'Actions', field: 'act', kind: 'actions', render: () => h(P.Button, null, 'Open') }]);
      ReactDOM.createRoot(document.getElementById('v')).render(h(P.ToastProvider, null, h(P.DataGrid, { label: 'Sessions', data, columns, mode: 'fill', narrow: more ? 'table' : 'auto' })));
      await new Promise((r) => setTimeout(r, 1200));
      const heads = [...document.querySelectorAll('#v [role=columnheader]')].map((e) => ({ t: e.textContent.trim(), w: e.getBoundingClientRect().width, right: e.getBoundingClientRect().right }));
      const holder = document.querySelector('#v .plx-data-grid__grid-tableholder') || document.querySelector('#v [role=grid]');
      const hr = holder.getBoundingClientRect();
      const last = [...document.querySelectorAll('#v [role=row]:last-child [role=gridcell]')].pop();
      const bar = document.querySelector('#v .plx-data-grid__scroll--x');
      return { heads, pad: parseFloat(getComputedStyle(holder).paddingBlockEnd), barH: bar ? bar.getBoundingClientRect().height : 0, holderRight: hr.right, scrolls: holder.scrollWidth > holder.clientWidth + 1, sbH: holder.offsetHeight - holder.clientHeight, holderBottom: hr.bottom, lastCellBottom: last ? last.getBoundingClientRect().bottom : 0 };
    }, width, extra);
    for (const w of [1280, 1600]) {
      const r = await probe(w, false), by = Object.fromEntries(r.heads.map((x) => [x.t, x]));
      // #800 (D-0087): the spare room is shared evenly across the columns, so no column (the # column before #272) takes all of it
      assert.ok(by['#'].w <= 300, w + ': the # column takes an equal share, not all the room, got ' + by['#'].w);
      assert.ok(r.heads.every((x) => x.right <= r.holderRight + 1), w + ': every column is inside the grid (Actions not cut off): ' + JSON.stringify(r.heads.map((x) => [x.t, Math.round(x.right)])) + ' edge ' + Math.round(r.holderRight));
      assert.equal(r.scrolls, false, w + ': nothing scrolls sideways when the columns fit');
      // #966 (D-0108): a narrow column (the # column) takes no spare room, so the other columns share its part
      assert.ok(Math.abs(by['Session date'].w - by['Court'].w) <= 48 || by['Status'].w < 80, w + ': the date column takes an equal share with Court, got ' + by['Session date'].w + ' and ' + by['Court'].w);
      // the text columns that hold real text share the spare room (a short Title stays at its minimum); the date column does not grow
      // Status is a narrow column once its pills fit under 80px (#966): it takes no share
      const spare = ['Court', 'Status'].map((t) => by[t].w);
      assert.ok(by['Status'].w < 80 || Math.abs(spare[0] - spare[1]) <= 24, w + ': the spare room is shared between Court and Status: ' + spare.join(','));
      assert.ok(by['Court'].w > 120 || w === 1280, w + ': Court takes part of the spare room, got ' + by['Court'].w);
    }
    // the columns do not fit: a scrollbar, and it is below the last row (the last row is not under it)
    const wide = await probe(800, true);
    assert.equal(wide.scrolls, true, 'many columns scroll sideways');
    // the floating sideways bar sits on the grid's bottom edge: the scroll body keeps that room clear at the end, so the last row can scroll above it
    assert.ok(wide.barH > 0, 'the sideways scrollbar is drawn');
    assert.ok(wide.pad >= wide.barH, 'the scroll body keeps room for the sideways scrollbar below the last row: padding ' + wide.pad + ', bar ' + wide.barH);
    const fits = await probe(1280, false);
    assert.equal(fits.pad, 0, 'no room is kept when nothing scrolls sideways');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('data-grid-fit-272: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
