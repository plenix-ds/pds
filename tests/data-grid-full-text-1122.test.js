/* Plenix tests · a DataGrid cell's full text in a Dialog (issue 1122, ADR 0047, design 1122: columns[].overflow = "dialog").
   Summary: no button is drawn with the rows; hovering a cut cell, or focusing it, shows "Show full text: <column title>" over the cell's inline end (a fitting cell shows none); click opens a Dialog titled with the
     column title and holding the whole text; closing it returns focus to the cell; F2 on a focused read-only cut cell opens the Dialog while Enter keeps opening the row (onRowClick); on an editable cell F2 still starts
     editing; right to left puts the button on the left. Left to right and right to left.
   Proof first: before the change "dialog" is not a value of overflow: hovering a cut cell shows no button.
   Usage: node tests/data-grid-full-text-1122.test.js   → DATA_GRID_FULL_TEXT_1122_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9987, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const LONG = 'The council recommends that the hearing be adjourned until the president has reviewed the full submission, the supporting letters and the new evidence in the case file. '.repeat(3);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 800 });
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const mount = (editable) => page.evaluate(async (dir, LONG, editable) => {
        document.documentElement.setAttribute('dir', dir); const h = React.createElement, P = Plenix; window.__root && window.__root.unmount(); window.__rowClicks = 0;
        const c = document.createElement('div'); c.id = 'c'; c.style.inlineSize = '900px'; document.querySelector('main').replaceChildren(c);
        const mark = dir === 'rtl' ? '\u200f' : '';   // a cell is dir=auto: its text decides; the right-to-left mark makes the text read right to left
        const data = [0, 1, 2].map((i) => ({ id: i, name: 'Case ' + i, note: i === 1 ? 'Short note' : mark + LONG + i }));
        window.__root = ReactDOM.createRoot(c);
        window.__root.render(h(P.DataGrid, { label: 'Cases', data, index: 'id', onRowClick: () => { window.__rowClicks++; }, columns: [{ title: 'Case', field: 'name' }, Object.assign({ title: 'Recommendation', field: 'note', lines: 2, overflow: 'dialog' }, editable ? { editor: 'input' } : {})] }));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, LONG, editable);
      const buttons = () => page.evaluate(() => [...document.querySelectorAll('#c [aria-label^="Show full text"]')].map((b) => ({ name: b.getAttribute('aria-label'), x: b.getBoundingClientRect().left + b.getBoundingClientRect().width / 2 })));
      const dialog = () => page.evaluate(() => { const d = document.querySelector('[role=dialog]'); return d ? { title: (d.querySelector('h1,h2,h3,[class*=title]') || {}).textContent, text: d.textContent } : null; });
      const note = '#c [role=row][data-plx-record] [data-plx-field=note]';
      await mount(false);
      assert.equal((await buttons()).length, 0, T + 'no button is drawn with the rows');
      await page.hover(note); await wait(500); let b = await buttons();
      assert.equal(b.length, 1, T + 'hover on a cut cell shows one button (' + JSON.stringify(b) + ')'); assert.equal(b[0].name, 'Show full text: Recommendation', T + 'named with the column title');
      const cellBox = await page.evaluate((sel) => { const r = document.querySelector(sel).getBoundingClientRect(); return { l: r.left, r: r.right }; }, note);
      assert.ok(dir === 'ltr' ? b[0].x > (cellBox.l + cellBox.r) / 2 : b[0].x < (cellBox.l + cellBox.r) / 2, T + 'the button is at the inline end of the cell');
      await page.click('#c [aria-label^="Show full text"]'); await wait(400); let d = await dialog(); assert.ok(d, T + 'click opens the dialog'); assert.equal((d.title || '').trim(), 'Recommendation', T + 'titled with the column title'); assert.ok(d.text.includes('the new evidence in the case file'), T + 'holds the whole text');
      await page.keyboard.press('Escape'); await wait(400); assert.equal(await dialog(), null, T + 'Escape closes it'); assert.ok(await page.evaluate(() => { const a = document.activeElement; return a && a.getAttribute('role') === 'gridcell' && a.getAttribute('data-plx-field') === 'note'; }), T + 'focus returns to the cell');
      // a fitting cell
      await page.mouse.move(2, 2); await wait(300);
      await page.evaluate(() => { const c = [...document.querySelectorAll('#c [data-plx-field=note]')].find((e) => /^Short note/.test(e.textContent)); c.setAttribute('data-short', ''); });
      await page.hover('#c [data-short]'); await wait(500); assert.equal(await page.evaluate(() => document.querySelectorAll('#c [data-short] [data-plx-full-text]').length), 0, T + 'a cell whose text fits shows no button');
      // F2 and Enter on a read-only cut cell
      await page.mouse.move(2, 2); await wait(300);
      await page.focus(note); await wait(500); await page.keyboard.press('F2'); await wait(400); d = await dialog(); assert.ok(d, T + 'F2 on a focused cut read-only cell opens the dialog'); await page.keyboard.press('Escape'); await wait(400);
      await page.evaluate(() => { window.__rowClicks = 0; }); await page.focus(note); await page.keyboard.press('Enter'); await wait(300);
      assert.equal(await dialog(), null, T + 'Enter does not open the dialog'); assert.ok(await page.evaluate(() => window.__rowClicks) >= 1, T + 'Enter keeps opening the row');
      // an editable cell keeps F2 = edit
      await mount(true); await page.focus(note); await wait(500); await page.keyboard.press('F2'); await wait(400);
      assert.equal(await dialog(), null, T + 'F2 on an editable cell does not open the dialog'); assert.ok(await page.evaluate(() => !!document.querySelector('#c input')), T + 'F2 on an editable cell starts editing');
      // the cell says F2 while the text is cut; a column with no title still gets the button, named by the generic words
      await page.focus(note); await wait(500); assert.equal(await page.evaluate((sel) => document.querySelector(sel).getAttribute('aria-keyshortcuts'), note), 'F2', T + 'the cut cell announces F2');
      await page.evaluate(async (dir, LONG) => { const h = React.createElement, P = Plenix; window.__root.unmount(); const c = document.getElementById('c'); window.__root = ReactDOM.createRoot(c);
        window.__root.render(h(P.DataGrid, { label: 'Cases', data: [{ id: 1, note: (dir === 'rtl' ? '\u200f' : '') + LONG }], index: 'id', columns: [{ field: 'note', lines: 2, overflow: 'dialog' }] })); await new Promise((r) => setTimeout(r, 900)); }, dir, LONG);
      await page.hover(note); await wait(500); b = await buttons(); assert.equal(b.length, 1, T + 'an untitled column still gets the button'); assert.equal(b[0].name, 'Show full text', T + 'named by the generic words');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors: ' + errors.join(' | '));
    console.log('DATA_GRID_FULL_TEXT_1122_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
