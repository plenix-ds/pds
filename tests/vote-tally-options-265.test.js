/* Plenix tests · VoteTally custom choice sets (issue 265, ADR 0009, brief AC-1 to AC-5).
   Cases: AC-1 no options: Approve, Deny, Abstain, the totals and the words as before; AC-2 Present/Absent, 5 members (3
     Present, 1 Absent, 1 none): two buttons per row, totals Present 3, Absent 1, Not recorded 1; AC-3 pressing the chosen one
     again calls onVote(id, null), and with changeVote "final" it does not; AC-4 dir="rtl": no script errors, the buttons and
     totals follow the reading direction; AC-5 1 or 6 options: a development warning naming the 2-to-5 limit, and the default set.
   Usage: node tests/vote-tally-options-265.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9647, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [], warns = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (/^warn/.test(m.type())) warns.push(m.text()); });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    // draws one VoteTally into #v and returns after a frame; window.votes collects onVote calls
    const draw = (props) => page.evaluate((p) => {
      window.votes = []; document.querySelector('main').innerHTML = '<div id="v"></div>';
      const members = [1, 2, 3, 4, 5].map((i) => ({ memberId: 'm' + i, name: 'Member ' + i, vote: (p.votes || [])[i - 1] || null }));
      const icon = (n) => n;
      const options = p.options ? p.options.map((o) => Object.assign({ icon: icon(o.icon), tone: o.tone }, o)) : undefined;
      ReactDOM.createRoot(document.getElementById('v')).render(React.createElement(Plenix.VoteTally, Object.assign({ label: 'Vote', members, options, onVote: (id, v) => window.votes.push([id, v]) }, p.extra || {})));
    }, props);
    const read = () => page.evaluate(() => ({
      buttons: [...document.querySelectorAll('#v li:first-child [role=group] button')].map((b) => (b.getAttribute('aria-label') || b.textContent).trim()),
      totals: [...document.querySelectorAll('#v .plx-vote-tally__totals .plx-badge')].map((b) => b.textContent.trim()),
    }));
    const present = { key: 'present', label: 'Present', icon: 'check', tone: 'success' }, absent = { key: 'absent', label: 'Absent', icon: 'close', tone: 'danger' };

    // AC-1
    await draw({ votes: ['approve', 'approve', 'deny', null, null] }); await sleep(300);
    let r = await read();
    assert.deepEqual(r.buttons, ['Approve', 'Deny', 'Abstain'], 'AC-1 buttons');
    assert.deepEqual(r.totals, ['Approve 2', 'Deny 1', 'Abstain 0', 'Not voted 2'], 'AC-1 totals');

    // AC-2
    await draw({ options: [present, absent], votes: ['present', 'present', 'present', 'absent', null] }); await sleep(300);
    r = await read();
    assert.deepEqual(r.buttons, ['Present', 'Absent'], 'AC-2 two buttons per row');
    assert.deepEqual(r.totals, ['Present 3', 'Absent 1', 'Not recorded 1'], 'AC-2 totals');

    // AC-3
    await page.click('#v li:first-child [role=group] button:first-child'); await sleep(100);
    assert.deepEqual(await page.evaluate(() => window.votes), [['m1', null]], 'AC-3 pressing the chosen one clears it');
    await draw({ options: [present, absent], votes: ['present'], extra: { settings: { changeVote: 'final' } } }); await sleep(200);
    await page.click('#v li:first-child [role=group] button:first-child'); await sleep(100);
    assert.deepEqual(await page.evaluate(() => window.votes), [['m1', 'present']], 'AC-3 final: it stays chosen');

    // AC-4
    await page.evaluate(() => { document.documentElement.setAttribute('dir', 'rtl'); });
    await draw({ options: [present, absent], votes: ['present', 'absent'] }); await sleep(300);
    const pos = await page.evaluate(() => { const b = [...document.querySelectorAll('#v li:first-child [role=group] button')].map((x) => x.getBoundingClientRect().left); return b; });
    assert.ok(pos[0] > pos[1], 'AC-4 in RTL the first option sits to the right of the second: ' + pos.join(','));
    await page.evaluate(() => { document.documentElement.setAttribute('dir', 'ltr'); });

    // AC-5
    for (const bad of [[present], [1, 2, 3, 4, 5, 6].map((i) => ({ key: 'k' + i, label: 'K' + i, icon: 'check', tone: 'neutral' }))]) {
      warns.length = 0;
      await draw({ options: bad, votes: [] }); await sleep(300);
      r = await read();
      assert.deepEqual(r.buttons, ['Approve', 'Deny', 'Abstain'], 'AC-5 the default set is used for ' + bad.length + ' options');
      assert.ok(warns.some((w) => /2 to 5/.test(w)), 'AC-5 a warning names the 2-to-5 limit for ' + bad.length + ' options: ' + warns.join(' | '));
    }
    // ADR 0009: a vote that is not a key of options counts as not recorded, with a warning (issue 281)
    warns.length = 0;
    await draw({ options: [present, absent], votes: ['present', 'maybe'] }); await sleep(300);
    r = await read();
    assert.deepEqual(r.totals, ['Present 1', 'Absent 0', 'Not recorded 4'], 'an unknown vote counts as not recorded');
    assert.ok(warns.some((w) => /member m2/.test(w) && /"maybe"/.test(w) && /not a key of options/.test(w)), 'a warning names the member and the key: ' + warns.join(' | '));
    assert.deepEqual(errors, [], 'no script errors');
    console.log('vote-tally-options-265: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
