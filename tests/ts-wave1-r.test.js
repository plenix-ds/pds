/* Plenix tests · TypeScript wave 1, batch R (issue 292, ADR 0011): VirtualList and VoteTally converted to TSX still behave the same.
   VirtualList draws only the rows in view with the whole list's size ("N items", aria-setsize), shows group headers, runs onEndReached once at the end,
   and its ref scrolls to a row. VoteTally lists the members, a choice press calls onVote(memberId, option) (null when pressed again), totals count the votes,
   and a closed vote disables the choices.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-r.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9674, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 1000, height: 800 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement; window.calls = []; window.ends = 0;
      document.querySelector('main').innerHTML = '<div id="a"></div><div id="b"></div><div id="c"></div>';
      const items = Array.from({ length: 2000 }, (_, i) => ({ id: i, label: 'Row ' + i, description: 'd' + i }));
      ReactDOM.createRoot(document.getElementById('a')).render(h(Plenix.VirtualList, { label: 'Rows', items, showCount: true, onEndReached: () => { window.ends++; }, ref: (r) => { window.vl = r; } }));
      ReactDOM.createRoot(document.getElementById('b')).render(h(Plenix.VirtualList, { label: 'Groups', groups: [{ id: 'g1', label: 'Alpha', items: [{ id: 1, label: 'One' }, { id: 2, label: 'Two' }] }, { id: 'g2', label: 'Beta', items: [{ id: 3, label: 'Three' }] }] }));
      const members = [{ memberId: 'm1', name: 'Mina', role: 'Chair' }, { memberId: 'm2', name: 'Sara', vote: 'approve' }, { memberId: 'm3', name: 'Paul', disabledReason: 'Recused' }];
      const Vote = (p) => { const [m, setM] = React.useState(members); return h(Plenix.VoteTally, Object.assign({ label: 'Motion 1', members: m, onVote: (id, o) => { window.calls.push(id + ':' + o); setM((old) => old.map((x) => (x.memberId === id ? Object.assign({}, x, { vote: o }) : x))); } }, p)); };
      ReactDOM.createRoot(document.getElementById('c')).render(h('div', null, h('div', { id: 'open' }, h(Vote, null)), h('div', { id: 'closed' }, h(Vote, { status: 'closed' }))));
    });
    await sleep(800);
    const rows = await page.$$eval('#a .plx-virtual-list__item', (e) => e.length);
    assert.ok(rows > 0 && rows < 100, 'only the rows in view are drawn (' + rows + ')');
    assert.match(await page.$eval('#a .plx-virtual-list__count', (e) => e.textContent), /2[,.]?000/, 'the count of the whole list');
    assert.equal(await page.$eval('#a .plx-virtual-list__item', (e) => e.getAttribute('aria-setsize')), '2000', 'every row knows the whole list size');
    assert.equal(await page.evaluate(() => window.ends), 0, 'not at the end yet');
    await page.evaluate(() => window.vl.scrollToIndex(1999)); await sleep(500);
    assert.ok(await page.evaluate(() => window.ends) >= 1, 'onEndReached runs at the end');
    assert.ok((await page.$$eval('#a .plx-virtual-list__label', (e) => e.map((x) => x.textContent))).includes('Row 1999'), 'scrollToIndex draws the last row');
    assert.deepEqual(await page.$$eval('#b .plx-virtual-list__header-label', (e) => e.map((x) => x.textContent)), ['Alpha', 'Beta'], 'group headers');
    const names = await page.$$eval('#open .plx-vote-tally .plx-vote-tally__member', (e) => e.map((x) => x.textContent));
    assert.equal(names.length, 3, 'three members');
    const btns = await page.$$eval('#open .plx-vote-tally .plx-vote-tally__member:first-child button', (e) => e.map((x) => x.getAttribute('aria-label')));
    assert.equal(btns.length, 3, 'three choices'); 
    await page.click('#open .plx-vote-tally .plx-vote-tally__member:first-child button'); await sleep(200);
    assert.deepEqual(await page.evaluate(() => window.calls), ['m1:approve'], 'a press votes');
    await page.click('#open .plx-vote-tally .plx-vote-tally__member:first-child button'); await sleep(200);
    assert.deepEqual(await page.evaluate(() => window.calls), ['m1:approve', 'm1:null'], 'pressing the chosen one again clears it');
    assert.match(await page.$eval('#open .plx-vote-tally .plx-vote-tally__totals', (e) => e.textContent), /1/, 'totals count the vote');
    assert.ok(await page.$eval('#closed .plx-vote-tally__member:first-child button', (e) => e.disabled), 'a closed vote disables the choices');
    assert.ok(await page.$('.plx-vote-tally__member .plx-badge, .plx-vote-tally__member [class*="badge"]'), 'a turned-off member shows its badge');
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad); assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('ts-wave1-r: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
