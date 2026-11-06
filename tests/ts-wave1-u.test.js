/* Plenix tests · TypeScript wave 1, batch U (issue 292, ADR 0011): MetricCard converted to TSX still behaves the same.
   A value card with a change (arrow and "up (good)" for a screen reader), a status badge and a link title; a progress card with rows and percents; a breakdown with its legend shares;
   a ranked list; a week and a month figure named for a screen reader; an empty card ("–" and its line); a loading card is busy; an error card shows Try again and calls onRetry.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-u.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9676, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 1100, height: 900 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement; window.retries = 0;
      document.querySelector('main').innerHTML = '<div id="a" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px"></div>';
      const M = Plenix.MetricCard;
      ReactDOM.createRoot(document.getElementById('a')).render(h(React.Fragment, null,
        h('div', { id: 'v' }, h(M, { title: 'Open tasks', context: 'All projects', value: '128', href: '#/tasks', change: { amount: '12', direction: 'up', versus: 'since last week' }, goodWhen: 'down', status: { tone: 'active', label: 'Live' } })),
        h('div', { id: 'p' }, h(M, { type: 'progress', title: 'Rooms', rows: [{ id: 'a', label: 'Kitchen', value: 36, max: 147, tone: 'good' }, { id: 'b', label: 'Hall', value: 50, max: 100, tone: 'bad' }] })),
        h('div', { id: 'b' }, h(M, { type: 'breakdown', title: 'Split', value: '100', parts: [{ id: 'x', label: 'Alpha', value: 75 }, { id: 'y', label: 'Beta', value: 25 }] })),
        h('div', { id: 'l' }, h(M, { type: 'list', title: 'Top', items: [{ id: '1', label: 'First', value: 9 }, { id: '2', label: 'Second', value: 4 }] })),
        h('div', { id: 'w' }, h(M, { type: 'week', title: 'Week', days: [1, 2, 3, null, null, null, null] })),
        h('div', { id: 'm' }, h(M, { type: 'month', title: 'Month', month: { year: 2026, month: 10, levels: [2, 3, 0, 1], today: 6 } })),
        h('div', { id: 'e' }, h(M, { title: 'Empty', state: 'empty', emptyText: 'No data yet' })),
        h('div', { id: 'o' }, h(M, { title: 'Loading', state: 'loading' })),
        h('div', { id: 'r' }, h(M, { title: 'Broken', state: 'error', onRetry: () => { window.retries++; } }))));
    });
    await sleep(900);
    const txt = (sel) => page.$eval(sel, (e) => e.textContent.replace(/\s+/g, ' ').trim());
    assert.match(await txt('#v article'), /Open tasks.*All projects.*128.*Live.*12.*since last week/, 'the value card');
    assert.equal(await page.$eval('#v a.plx-metric-card__link', (e) => e.getAttribute('href')), '#/tasks', 'the title is the link');
    assert.match(await page.$eval('#v .plx-metric-card__delta', (e) => e.textContent), /Up \(bad\)/, 'the change says up and bad for a screen reader (goodWhen down)');
    assert.deepEqual(await page.$$eval('#p .plx-metric-card__progress-row .plx-metric-card__delta', (e) => e.map((x) => x.textContent)), ['24%', '50%'], 'progress rows show their percent');
    assert.deepEqual(await page.$$eval('#b .plx-metric-card__share', (e) => e.map((x) => x.textContent)), ['75%', '25%'], 'the legend shares');
    assert.deepEqual(await page.$$eval('#l .plx-metric-card__rank', (e) => e.map((x) => x.textContent)), ['#1', '#2'], 'the ranked list');
    assert.match(await page.$eval('#w [role=img]', (e) => e.getAttribute('aria-label')), /1.*2.*3/, 'the week is named');
    assert.ok(await page.$eval('#m [role=img]', (e) => e.getAttribute('aria-label')), 'the month is named');
    assert.match(await txt('#e article'), /–.*No data yet/, 'an empty card shows the dash and its line');
    assert.equal(await page.$eval('#o article', (e) => e.getAttribute('aria-busy')), 'true', 'a loading card is busy');
    await page.click('#r button'); await sleep(200);
    assert.equal(await page.evaluate(() => window.retries), 1, 'Try again calls onRetry');
    const bad = problems.filter((p) => !/Failed to load resource|net::|was fetched at run time/.test(p)); if (bad.length) console.log(bad);
    assert.deepEqual(bad, [], 'no errors or warnings');
    console.log('ts-wave1-u: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
