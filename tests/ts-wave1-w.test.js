/* Plenix tests · TypeScript wave 1, batch W (issue 292, ADR 0011): RenameAction, DeleteFlow and FileRow converted to TSX still behave the same.
   FileRow shows the name and size and a Select checkbox; its More menu opens the rename dialog (a taken name shows its message, a new one calls onRename with it and closes)
   and the delete dialog (Delete calls onDelete with the file). DeleteFlow type: the phrase must be typed. A transfer shows a progress bar, an error shows Try again.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-w.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9677, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 1000, height: 800 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement; window.log = [];
      document.querySelector('main').innerHTML = '<div id="a"></div><div id="b"></div>';
      const { FileRow, FileRowList, DeleteFlow } = Plenix;
      ReactDOM.createRoot(document.getElementById('a')).render(h(FileRowList, { label: 'Files' },
        h(FileRow, { as: 'li', file: { name: 'Letter.pdf', size: 1240000, modified: '2026-10-14' }, owner: 'Maya', selectable: true, onSelectChange: (c) => window.log.push('sel:' + c), onRename: (n) => { window.log.push('rename:' + n); }, names: ['Taken.pdf'], onDelete: (f) => window.log.push('delete:' + f.name) }),
        h(FileRow, { as: 'li', file: { name: 'Cross.png', size: 482000 }, progress: 42, progressLabel: 'Uploading', onCancel: () => {} }),
        h(FileRow, { as: 'li', file: { name: 'Border.svg', size: 96000 }, error: 'The connection was lost.', onRetry: () => window.log.push('retry') })));
      const Typed = () => { const [o, setO] = React.useState(false); return h('div', null, h('button', { id: 'open', onClick: () => setO(true) }, 'Delete it'), h(DeleteFlow, { variant: 'type', items: [{ id: 1, label: 'Project X' }], open: o, onClose: () => setO(false), onDelete: (i) => window.log.push('typed:' + i[0].label) })); };
      ReactDOM.createRoot(document.getElementById('b')).render(h(Typed));
    });
    await sleep(900);
    assert.match(await page.$eval('#a li', (e) => e.textContent), /Letter\.pdf.*Maya/, 'the row shows the name and the owner');
    await page.click('#a li:first-child input[type=checkbox]'); await sleep(150);
    assert.deepEqual(await page.evaluate(() => window.log.slice()), ['sel:true'], 'the checkbox calls onSelectChange');
    // rename
    await page.click('#a li:first-child button[aria-label^="More"]'); await sleep(300);
    const item = (txt) => page.evaluate((t) => { const e = [...document.querySelectorAll('[role=menuitem]')].find((x) => x.textContent.trim().startsWith(t)); e.click(); return !!e; }, txt);
    assert.ok(await item('Rename'), 'the menu has Rename'); await sleep(500);
    assert.ok(await page.$('[role=dialog] form'), 'the rename dialog opens');
    await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type('Taken.pdf'); await page.keyboard.press('Enter'); await sleep(300);
    assert.ok(await page.$eval('[role=dialog]', (e) => /Taken\.pdf/.test(e.textContent) && !!e.querySelector('[aria-invalid=true], .plx-field__error, [role=alert]')), 'a taken name shows its message');
    await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type('Renamed.pdf'); await page.keyboard.press('Enter'); await sleep(500);
    assert.ok((await page.evaluate(() => window.log)).includes('rename:Renamed.pdf'), 'a new name calls onRename');
    // delete
    await page.click('#a li:first-child button[aria-label^="More"]'); await sleep(300);
    assert.ok(await item('Delete')); await sleep(500);
    await page.evaluate(() => { const b = [...document.querySelectorAll('[role=alertdialog] button')].find((x) => x.textContent.trim() === 'Delete'); b.click(); }); await sleep(400);
    assert.ok((await page.evaluate(() => window.log)).includes('delete:Letter.pdf'), 'Delete calls onDelete with the file');
    // transfer and error
    assert.match(await page.$eval('#a .plx-file-row__percent', (e) => e.textContent), /42/, 'a transfer shows its percent');
    await page.click('#a li:last-child button'); await sleep(150);
    assert.ok((await page.evaluate(() => window.log)).includes('retry'), 'Try again calls onRetry');
    // type variant
    await page.click('#open'); await sleep(500);
    await page.evaluate(() => { const b = [...document.querySelectorAll('[role=alertdialog] button')].find((x) => x.textContent.trim() === 'Delete'); b.click(); }); await sleep(300);
    assert.ok(!(await page.evaluate(() => window.log)).includes('typed:Project X'), 'without the phrase nothing is deleted');
    await page.keyboard.type('Project X'); await page.evaluate(() => { const b = [...document.querySelectorAll('[role=alertdialog] button')].find((x) => x.textContent.trim() === 'Delete'); b.click(); }); await sleep(400);
    assert.ok((await page.evaluate(() => window.log)).includes('typed:Project X'), 'with the phrase it deletes');
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad);
    assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('ts-wave1-w: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
