/* Plenix tests · TypeScript wave 1, batch A (issue 292, ADR 0011): the ten components converted to TSX still draw and behave the same.
   AIDisclaimer, ConfidenceIndicator, AIButton, StreamingText, Table, AILabel, Citation, SuggestedAction, Comment, DateBadge: each renders
   its documented output the actions fire once, and nothing throws or warns. Run on the code before and after the rename: same result.
   Usage: node tests/ts-wave1-a.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9656, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement, P = Plenix; window.calls = [];
      document.querySelector('main').innerHTML = '<div id="v"></div>';
      ReactDOM.createRoot(document.getElementById('v')).render(h(P.ToastProvider, null, h('div', null,
        h('div', { id: 'dis' }, h(P.AIDisclaimer, { href: '/policy' }, 'Check details.')),
        h('div', { id: 'conf' }, h(P.ConfidenceIndicator, { variant: 'numeric', value: 0.5, locale: 'en' }), h(P.ConfidenceIndicator, { level: 'high' }), h(P.ConfidenceIndicator, { level: 'nope' })),
        h('div', { id: 'btn' }, h(P.AIButton, { label: 'Summarize', onAction: () => window.calls.push('ai') })),
        h('div', { id: 'stream' }, h(P.StreamingText, { text: 'Hello there', state: 'done' })),
        h('div', { id: 'tbl' }, h(P.Table, { label: 'Fields', data: [{ id: 1, name: 'Alpha' }, { id: 2, name: 'Beta' }], columns: [{ title: 'Name', field: 'name' }] })),
        h('div', { id: 'lab' }, h(P.AILabel, { variant: 'inline' }, 'Made by AI')),
        h('div', { id: 'cit' }, h(P.Citation, { source: { id: 'g', title: 'Guide', href: '/guide' }, index: 3 }), h(P.Citation, { variant: 'card', source: { title: 'Card title', href: 'https://example.com/x', author: 'Ann' } })),
        h('div', { id: 'sug' }, h(P.SuggestedAction, { onAction: () => window.calls.push('sug') }, 'Summarize selection')),
        h('div', { id: 'com' }, h(P.Comment, { author: { name: 'Maya Chen' }, body: 'Ready for review', time: '2026-10-15T12:00:00Z', resolved: true, onResolve: (v) => window.calls.push('resolve:' + v) })),
        h('div', { id: 'date' }, h(P.DateBadge, { day: 6, weekday: 'Tue', today: true, dateTime: '2026-10-06' })))));
    });
    await sleep(800);
    const text = (sel) => page.$eval(sel, (e) => e.textContent.trim().replace(/\s+/g, ' '));
    assert.match(await text('#dis'), /Check details\./); assert.equal(await page.$eval('#dis a', (a) => a.getAttribute('href')), '/policy');
    const conf = await page.$$eval('#conf .plx-confidence-indicator', (els) => els.map((e) => e.textContent.trim().replace(/\s+/g, ' ')));
    assert.match(conf[0], /50\s?%/); assert.match(conf[1], /High/i); assert.match(conf[2], /unavailable/i);
    await page.click('#btn button'); await sleep(100);
    assert.deepEqual(await page.evaluate(() => window.calls.filter((c) => c === 'ai')), ['ai'], 'AIButton fires once');
    assert.match(await text('#stream'), /Hello there/); assert.match(await text('#stream'), /Response complete/);
    assert.deepEqual(await page.$$eval('#tbl [role=row]', (r) => r.length), 3, 'Table: a header row and two records');
    assert.match(await text('#tbl'), /Alpha[\s\S]*Beta/);
    assert.match(await text('#lab'), /Made by AI/);
    assert.match(await text('#cit'), /\[3\]/); assert.match(await text('#cit'), /Card title/); assert.match(await text('#cit'), /Ann/);
    assert.equal(await page.$eval('#cit .plx-citation__source a', (a) => a.getAttribute('target') + ' ' + a.getAttribute('rel')), '_blank noopener noreferrer', 'the source link opens in a new tab');
    assert.ok(await page.$('#cit .plx-citation__source a .plx-link__icon'), 'the source link shows the open icon');
    await page.click('#sug button'); await sleep(100);
    assert.deepEqual(await page.evaluate(() => window.calls.filter((c) => c === 'sug')), ['sug'], 'SuggestedAction fires once');
    assert.match(await text('#com'), /Maya Chen/); assert.match(await text('#com'), /Ready for review/);
    const reopen = await page.$$eval('#com button', (bs) => bs.find((b) => /reopen/i.test(b.textContent)));
    await page.evaluate(() => [...document.querySelectorAll('#com button')].find((b) => /reopen/i.test(b.textContent)).click()); await sleep(100);
    assert.deepEqual(await page.evaluate(() => window.calls.filter((c) => /^resolve/.test(c))), ['resolve:false'], 'Comment reopen calls onResolve(false)');
    assert.equal(await page.$eval('#date time', (t) => t.getAttribute('datetime')), '2026-10-06'); assert.match(await text('#date'), /Tue.*6.*Today/i);
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-a: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
