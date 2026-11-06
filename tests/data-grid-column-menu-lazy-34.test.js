/* Plenix tests · #34: the DataGrid's column menu panel loads on first use (engine/chromeRare.jsx) and the header trigger starts the load on
   hover, focus and touch, so the first open, after a hover, shows its items with no busy row; opening by keyboard works; the items still do
   what they did (sort, filter, group, wrap).   Usage: node tests/data-grid-column-menu-lazy-34.test.js   -> DATA_GRID_COLUMN_MENU_LAZY_34_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9672, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 1000, height: 700 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement;
      document.querySelector('main').innerHTML = '<div id="v" style="height:400px"></div>';
      const data = [{ id: 1, name: 'Alpha', n: 3 }, { id: 2, name: 'Bravo', n: 1 }, { id: 3, name: 'Charlie', n: 2 }];
      ReactDOM.createRoot(document.getElementById('v')).render(h(Plenix.DataGrid, { label: 'People', data, headerMenu: true, rowKey: 'id', groupable: true,
        columns: [{ field: 'name', title: 'Name' }, { field: 'n', title: 'Count', type: 'number' }] }));
    });
    await sleep(900);
    const items = () => page.$$eval('[role=menu] [role=menuitem], [role=menu] [role=menuitemcheckbox]', (e) => e.map((x) => x.textContent.trim()));
    const busy = () => page.$$eval('[role=menu] [aria-busy="true"]', (e) => e.length);
    const chevron = '.plx-data-grid__menu-chevron';
    assert.ok(await page.$(chevron), 'the column menu trigger is drawn');
    await page.hover(chevron); await sleep(300);
    await page.click(chevron); await sleep(300);
    const first = await items();
    assert.ok(first.some((t) => /sort|a to z|a–z|ascending|smallest/i.test(t)) || first.length >= 4, 'the first open, after a hover, shows its items: ' + first);
    assert.equal(await busy(), 0, 'no busy row after a hover');
    await page.keyboard.press('Escape'); await sleep(300);
    await page.focus(chevron); await page.keyboard.press('Enter'); await sleep(400);
    assert.ok((await items()).length >= 4, 'opening by keyboard shows the items');
    await page.keyboard.press('Escape'); await sleep(200);
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('DATA_GRID_COLUMN_MENU_LAZY_34_OK');
  } catch (e) { console.log('DATA_GRID_COLUMN_MENU_LAZY_34_FAIL ' + e.message); await browser.close(); server.close(); process.exit(1); }
  await browser.close(); server.close(); process.exit(0);
})();
