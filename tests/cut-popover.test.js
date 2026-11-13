/* Plenix tests · cut text opens in full (owner, 2026-10-24, option B; the popover became a Dialog, D-0140 and D-0141, #1122)
   Summary: in a DataGrid column with overflow: 'dialog', a cell whose text is cut shows an expand icon button when the pointer is on it; the
     button opens a Dialog with the full text. A cell whose text fits shows no button. (Clamping is opt-in since 1.4.0: a column
     without overflow: 'dialog' gets the cut-text Tooltip of ADR 0043, not a button.)
   Usage: node tests/cut-popover.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9581, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1280, height: 900 });
    // an empty page with this checkout's Platform: the test draws its own grid (the test site runs its own app, which
    // does not expect its page to be replaced)
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const long = 'Waiting on the signed copy from the client before we can send the final invoice, close the project and archive every file it has';
    await page.evaluate(async (long) => {
      document.body.innerHTML = '<div id="g" style="inline-size:420px"></div>';   // a narrow box: the Note column grows into free room, so the long note is cut at two lines
      const h = React.createElement, P = window.Plenix;
      const rows = [{ id: 1, name: 'Northwind', note: long }, { id: 2, name: 'Contoso', note: 'Short' }];
      ReactDOM.createRoot(document.getElementById('g')).render(h(P.DataGrid, { label: 'Grid', data: rows, height: '--plx-ref-size-80u', rowHeight: 'medium',
        columns: [{ title: 'Name', field: 'name', kind: 'name' }, { title: 'Note', field: 'note', width: '--plx-ref-size-60u', lines: 2, overflow: 'dialog' }] }));
      await new Promise((r) => setTimeout(r, 900));
    }, long);
    const cell = async (i) => (await page.$$('#g [role=row]'))[i].$('[data-plx-field="note"]');
    const buttons = () => page.evaluate(() => document.querySelectorAll('#g [aria-label^="Show full text"]').length);
    await (await cell(2)).hover(); await new Promise((r) => setTimeout(r, 300));
    assert.equal(await buttons(), 0, 'a cell whose text fits shows no button');
    await (await cell(1)).hover(); await new Promise((r) => setTimeout(r, 300));
    assert.equal(await buttons(), 1, 'a cut cell shows the expand button');
    assert.equal(await page.evaluate(() => document.querySelector('#g [aria-label^="Show full text"]').getAttribute('aria-label')), 'Show full text: Note', 'the button is named with the column title');
    await page.click('#g [aria-label^="Show full text"]'); await new Promise((r) => setTimeout(r, 500));
    const full = await page.evaluate(() => (document.querySelector('[role=dialog]') || {}).textContent || '');
    assert.ok(full.includes(long), 'the dialog shows the full text');
    assert.deepEqual(errors, []);
    console.log('CUT_POPOVER_OK button only on cut cells; dialog with the full text');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
