/* Plenix tests · TypeScript wave 1, batch E (issue 292, ADR 0011): MenuBar and SearchResult converted to TSX still draw and behave the same.
   MenuBar: two menus; ArrowRight moves between the menu buttons; Enter opens a menu and a choice calls its handler. SearchResult: the query's
   words are highlighted in the title and snippet, a link title is an anchor, the group has its heading, count and a More link.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-e.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9660, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 1000, height: 700 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement, P = Plenix; window.calls = [];
      document.querySelector('main').innerHTML = '<div id="v"></div>';
      ReactDOM.createRoot(document.getElementById('v')).render(h(P.ToastProvider, null, h('div', null,
        h(P.MenuBar, { label: 'App menu' }, h(P.MenuBarMenu, { label: 'File' }, h(P.MenuItem, { onSelect: () => window.calls.push('new') }, 'New')), h(P.MenuBarMenu, { label: 'Edit' }, h(P.MenuItem, { onSelect: () => window.calls.push('copy') }, 'Copy'))),
        h('div', { id: 'sr' }, h(P.SearchResultGroup, { heading: 'Pages', count: 2, moreHref: '/more' },
          h(P.SearchResult, { title: 'Hearing schedule', href: '/h', query: 'hearing', snippet: 'The hearing is set for Monday', path: ['Court', 'Cases'] }),
          h(P.SearchResult, { title: 'Other', kind: 'person', avatar: { name: 'Ann Lee' } }))))));
    });
    await sleep(800);
    const buttons = await page.$$eval('[role=menubar] [role=menuitem]', (b) => b.map((x) => x.textContent.trim())); assert.deepEqual(buttons, ['File', 'Edit'], 'two menu buttons');
    await page.focus('[role=menubar] [role=menuitem]'); await page.keyboard.press('ArrowRight'); await sleep(100);
    assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Edit', 'ArrowRight moves to the next menu');
    await page.keyboard.press('Enter'); await sleep(300);
    await page.evaluate(() => [...document.querySelectorAll('[role=menu] [role=menuitem]')].find((b) => /Copy/.test(b.textContent)).click()); await sleep(200);
    assert.deepEqual(await page.evaluate(() => window.calls), ['copy'], 'a choice calls its handler once');
    assert.equal(await page.$eval('#sr h3', (e) => e.textContent.replace(/\s+/g, ' ').trim()).then((t) => /Pages/.test(t) && /2/.test(t)), true, 'the group heading and count');
    assert.equal(await page.$eval('#sr a[href="/h"]', (a) => a.textContent), 'Hearing schedule'); assert.equal(await page.$$eval('#sr .plx-search-result__match', (e) => e.map((x) => x.textContent.toLowerCase()).join(',')), 'hearing,hearing', 'the query is highlighted in the title and the snippet');
    assert.equal(await page.$eval('#sr .plx-search-result__path', (e) => e.textContent.replace(/\s+/g, ' ').trim()).then((t) => /Court/.test(t) && /Cases/.test(t)), true);
    assert.equal(await page.$eval('#sr a[href="/more"]', (a) => a.textContent.trim().length > 0), true, 'the More link');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-e: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
