/* Plenix tests · TypeScript wave 1, batch R (issue 292, ADR 0011): VoteTally converted to TSX still behaves the same: each member's choices are named, a press
   calls onVote(memberId, option) and the chosen one pressed again calls it with null, the counts come from the members when no outcome is
   given, a turned-off member shows a badge instead of choices, a closed vote is read-only, and custom options replace Approve, Deny and Abstain.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-r.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9674, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 900, height: 800 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement; window.calls = [];
      document.querySelector('main').innerHTML = '<div id="a"></div><div id="b"></div><div id="c"></div>';
      const members0 = [{ memberId: 'm1', name: 'Maya Chen', role: 'Chair', vote: null }, { memberId: 'm2', name: 'Paul Nasser', vote: 'approve' }, { memberId: 'm3', name: 'Rita Gad', disabledReason: 'Recused' }];
      const Live = () => { const [ms, setMs] = React.useState(members0); return h(Plenix.VoteTally, { label: 'Motion 14', members: ms, onVote: (id, o) => { window.calls.push(id + ':' + o); setMs(ms.map((m) => (m.memberId === id ? Object.assign({}, m, { vote: o }) : m))); } }); };
      ReactDOM.createRoot(document.getElementById('a')).render(h(Live));
      ReactDOM.createRoot(document.getElementById('b')).render(h(Plenix.VoteTally, { label: 'Closed', status: 'closed', members: members0, onVote: () => window.calls.push('closed-vote') }));
      ReactDOM.createRoot(document.getElementById('c')).render(h(Plenix.VoteTally, { label: 'Attendance', members: [{ memberId: 'x', name: 'Sam', vote: 'present' }],
        options: [{ key: 'present', label: 'Present', icon: 'check', tone: 'success' }, { key: 'absent', label: 'Absent', icon: 'close', tone: 'danger' }], onVote: (id, o) => window.calls.push('att:' + o) }));
    });
    await sleep(800);
    const btn = (root, name) => page.evaluate((r, n) => { const b = [...document.querySelectorAll(r + ' button')].find((x) => (x.getAttribute('aria-label') || x.textContent).trim() === n); return b ? { pressed: b.getAttribute('aria-pressed'), disabled: b.disabled } : null; }, root, name);
    const press = (root, group, name) => page.evaluate((r, g, n) => { const grp = [...document.querySelectorAll(r + ' [role=group]')].find((x) => x.getAttribute('aria-label').includes(g)); [...grp.querySelectorAll('button')].find((x) => (x.getAttribute('aria-label') || '') === n).click(); }, root, group, name);
    assert.match(await page.$eval('#a .plx-vote-tally__totals', (e) => e.textContent), /Approve 1/, 'the totals count the members when no outcome is given');
    await press('#a', 'Maya Chen', 'Approve'); await sleep(200);
    await press('#a', 'Maya Chen', 'Approve'); await sleep(200);
    assert.deepEqual(await page.evaluate(() => window.calls), ['m1:approve', 'm1:null'], 'a press votes and the chosen one pressed again clears');
    assert.ok((await page.$eval('#a .plx-vote-tally__member:nth-child(3)', (e) => e.textContent)).includes('Recused'), 'a turned-off member shows a badge');
    assert.equal(await page.$$eval('#a .plx-vote-tally__member:nth-child(3) button', (e) => e.length), 0, 'and no choices');
    const closedApprove = await page.evaluate(() => [...document.querySelectorAll('#b [role=group]')].map((g) => [...g.querySelectorAll('button')].map((b) => b.disabled)));
    assert.ok(closedApprove[0].every(Boolean), 'a closed vote is read-only: ' + JSON.stringify(closedApprove));
    assert.ok(await btn('#c', 'Present') && await btn('#c', 'Absent') && !(await btn('#c', 'Approve')), 'custom options replace the default three');
    await press('#c', 'Sam', 'Absent'); await sleep(150);
    assert.ok((await page.evaluate(() => window.calls)).includes('att:absent'));
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-r: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
