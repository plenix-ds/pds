// Plenix · tests/tags-first-chip-477.test.js: the first tag never folds (issue 477; the Design Director's ruling: at least one chip always shows, "+N" counts only the others).
//   node tests/tags-first-chip-477.test.js   → TAGS_FIRST_CHIP_477_OK
// Proof first: before, a one-tag cell's editor in a narrow column showed "+1" in place of the only tag.
//   In left to right and right to left, in a narrow column: the read cell with one tag shows that tag (no "+N"), with three tags it shows the first first;
//   the open tags editor with one tag shows the chip (not "+1"), and with two tags shows the first chip and "+1".
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9879, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (tags) => page.evaluate(async (dir, tags) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const options = ['Alphabetical', 'Bravo', 'Charlie'].map((l) => ({ value: l, label: l }));
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 300 } }, h(Plenix.DataGrid, { label: 'T', data: [{ id: 'r1', name: 'A', tags }], columns: [{ title: 'Name', field: 'name' }, { title: 'Tags', field: 'tags', kind: 'tags', width: '--plx-ref-size-40u', editor: 'tags', editorProps: { options } }], editing: { types: ['tags'] } })));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, tags);
      const cellTags = () => page.evaluate(() => [...document.querySelectorAll('[role=row][data-plx-record] [data-plx-field=tags] .plx-tag')].map((t) => t.textContent.trim()));
      const editorTags = () => page.evaluate(() => [...document.querySelectorAll('.plx-combobox__field .plx-tag')].map((t) => t.textContent.trim()));
      await mount(['Alphabetical']); let c = await cellTags();
      assert.ok(c.length === 1 && !/^\+\d+$/.test(c[0]), T + 'a one-tag cell shows the tag, not "+N": ' + JSON.stringify(c));
      await mount(['Alphabetical', 'Bravo', 'Charlie']); c = await cellTags();
      assert.ok(c.length >= 1 && !/^\+\d+$/.test(c[0]), T + 'the first tag shows first: ' + JSON.stringify(c));
      await mount(['Alphabetical']);
      await page.evaluate(() => [...document.querySelectorAll('[role=row][data-plx-record]')][0].querySelector('[data-plx-field=tags]').focus()); await page.keyboard.press('Enter'); await wait(800);
      let e = await editorTags(); assert.ok(e.length === 1 && !/^\+\d+$/.test(e[0]), T + 'the editor with one tag shows the chip, not "+1": ' + JSON.stringify(e));
      const inside = await page.evaluate(() => { const c = document.querySelector('[data-plx-field=tags]').getBoundingClientRect(), t = document.querySelector('.plx-combobox__field .plx-tag').getBoundingClientRect(); return t.left >= c.left - 1 && t.right <= c.right + 1; });
      assert.equal(inside, true, T + 'a chip wider than the cell ends in an ellipsis inside it');
      await page.keyboard.press('Escape'); await wait(300);
      await mount(['Alphabetical', 'Bravo']);
      await page.evaluate(() => [...document.querySelectorAll('[role=row][data-plx-record]')][0].querySelector('[data-plx-field=tags]').focus()); await page.keyboard.press('Enter'); await wait(800);
      e = await editorTags(); assert.ok(e.length >= 1 && !/^\+\d+$/.test(e[0]), T + 'the editor with two tags shows the first chip first: ' + JSON.stringify(e));
    }
    console.log('TAGS_FIRST_CHIP_477_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
