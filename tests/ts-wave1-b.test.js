/* Plenix tests · TypeScript wave 1, batch B (issue 292, ADR 0011): Time, Metric, Anchor, RichText and GeneratedContent converted to TSX
   still draw and behave the same. Time: a fixed moment in each format; Metric: figure, change and a trend, and the Group's list;
   Anchor: a click goes to the section and marks it current; RichText: cleaned HTML (a script is dropped); GeneratedContent: versions,
   the version switch and feedback (once). Run on the code before and after the rename: same result.
   Usage: node tests/ts-wave1-b.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9657, server = await serve(PORT); let browser;
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
      const now = '2026-10-15T12:00:00Z';
      ReactDOM.createRoot(document.getElementById('v')).render(h(P.ToastProvider, null, h('div', null,
        h('div', { id: 'time' }, h(P.Time, { value: '2026-10-14T12:00:00Z', format: 'label', now, timeZone: 'UTC', locale: 'en' }), ' | ', h(P.Time, { value: '2026-10-15T11:55:00Z', format: 'relative', now, locale: 'en' }), ' | ', h(P.Time, { value: '2026-10-15', format: 'date', timeZone: 'UTC', locale: 'en' }), ' | ', h(P.Time, { value: null })),
        h('div', { id: 'met' }, h(P.Metric, { value: '1,284', label: 'Assets', change: '+4%', changeTone: 'positive', trend: [1, 3, 2, 5], trendLabel: 'Assets trend' }), h(P.Metric.Group, { label: 'Totals' }, h(P.Metric, { value: '9', label: 'Open' }), h(P.Metric, { value: '3', label: 'Closed' }))),
        h('div', { id: 'rt' }, h(P.RichText, { html: '<p>Hello <strong>bold</strong></p><script>window.hacked=1</script>' })),
        h('div', { id: 'gc' }, h(P.GeneratedContent, { versions: [{ id: 'a', content: 'First answer' }, { id: 'b', content: 'Second answer' }], onFeedback: (v) => window.calls.push('fb:' + v) })),
        h('div', { id: 'anc', style: { height: '150px', overflow: 'auto' } }, h(P.Anchor, { label: 'On this page', items: [{ id: 'sec-one', label: 'One' }, { id: 'sec-two', label: 'Two' }], onChange: (id) => window.calls.push('anchor:' + id) })),
        h('h2', { id: 'sec-one' }, 'Section one'), h('h2', { id: 'sec-two' }, 'Section two')))); 
    });
    await sleep(800);
    const text = (sel) => page.$eval(sel, (e) => e.textContent.trim().replace(/\s+/g, ' '));
    const t = await text('#time'); assert.match(t, /Yesterday/); assert.match(t, /5 minutes ago/); assert.match(t, /Oct 15|10\/15|15/);
    assert.equal(await page.$$eval('#time time', (e) => e.length), 3, 'a null value draws nothing');
    assert.equal(await page.$eval('#time time', (e) => e.getAttribute('datetime')), '2026-10-14', 'a label uses the calendar day');
    const m = await text('#met'); assert.match(m, /1,284/); assert.match(m, /\+4%/); assert.match(m, /Assets/);
    assert.equal(await page.$$eval('#met [role=listitem]', (e) => e.length), 2, 'Metric.Group lists its metrics');
    assert.ok(await page.$('#met .plx-metric__trend'), 'the trend is drawn');
    assert.equal(await page.$eval('#rt strong', (e) => e.textContent), 'bold'); assert.equal(await page.evaluate(() => window.hacked), undefined, 'no script ran'); assert.equal(await page.$('#rt script'), null);
    assert.match(await text('#gc'), /Second answer/, 'the last version shows first');
    await page.evaluate(() => [...document.querySelectorAll('#gc button')].find((b) => /previous/i.test(b.textContent)).click()); await sleep(100);
    assert.match(await text('#gc'), /First answer/, 'Previous shows the first version');
    await page.evaluate(() => [...document.querySelectorAll('#gc button')].find((b) => /^helpful$/i.test(b.textContent.trim())).click()); await sleep(200);
    assert.deepEqual(await page.evaluate(() => window.calls.filter((c) => /^fb:/.test(c))), ['fb:helpful'], 'feedback fires once');
    await page.click('#anc a[href="#sec-two"]'); await sleep(300);
    assert.ok(await page.evaluate(() => window.calls.includes('anchor:sec-two')), 'Anchor: a click reports the section');
    assert.equal(await page.$eval('#anc a[href="#sec-two"]', (a) => a.getAttribute('aria-current')), 'location', 'Anchor: the section is current');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-b: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
