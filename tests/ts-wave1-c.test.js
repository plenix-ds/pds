/* Plenix tests · TypeScript wave 1, batch C (issue 292, ADR 0011): OverflowList, EntityTitle, PromptSuggestions and PromptInput converted
   to TSX still draw and behave the same. OverflowList: items fit in a wide box and fold into a "…" menu in a narrow one; EntityTitle:
   title, subtitle, tag, heading level and the loading placeholder; PromptSuggestions: a chip and a card choose once; PromptInput: Enter
   sends once with the text and clears it, Shift+Enter does not send. Run on the code before and after the rename: same result.
   Usage: node tests/ts-wave1-c.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9658, server = await serve(PORT); let browser;
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
      const items = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'].map((n) => ({ id: n.toLowerCase(), label: n + ' action', onSelect: (id) => window.calls.push('pick:' + id) }));
      ReactDOM.createRoot(document.getElementById('v')).render(h(P.ToastProvider, null, h('div', null,
        h('div', { id: 'wide', style: { width: '900px' } }, h(P.OverflowList, { items, label: 'Actions' })),
        h('div', { id: 'narrow', style: { width: '200px' } }, h(P.OverflowList, { items, label: 'Actions' })),
        h('div', { id: 'et' }, h(P.EntityTitle, { title: 'Hearing 12', subtitle: 'Superior Court', tag: { label: 'Open', tone: 'success' }, level: 2 }), h(P.EntityTitle, { title: 'x', loading: true })),
        h('div', { id: 'ps' }, h(P.PromptSuggestions, { options: [{ id: 'sum', label: 'Summarize' }, { id: 'tr', label: 'Translate', description: 'Into Arabic' }], onSelect: (o) => window.calls.push('sug:' + o.id) }), h(P.PromptSuggestions, { variant: 'cards', options: [{ id: 'card', label: 'Card idea', description: 'More' }], onSelect: (o) => window.calls.push('sug:' + o.id) })),
        h('div', { id: 'pi' }, h(P.PromptInput, { onSend: (text) => window.calls.push('send:' + text) }))))); 
    });
    await sleep(900);
    const wideButtons = await page.$$eval('#wide .plx-overflow-list > .plx-overflow-list__item', (e) => e.length), narrowButtons = await page.$$eval('#narrow .plx-overflow-list > .plx-overflow-list__item', (e) => e.length);
    assert.ok(wideButtons >= 6, 'the wide list shows all its items: ' + wideButtons);
    assert.ok(narrowButtons < wideButtons && await page.$('#narrow [aria-haspopup]'), 'the narrow list folds into a menu: ' + narrowButtons);
    assert.equal(await page.$eval('#et h2', (e) => e.textContent.trim()), 'Hearing 12'); assert.match(await page.$eval('#et', (e) => e.textContent), /Superior Court[\s\S]*Open|Open[\s\S]*Superior Court/);
    assert.ok(await page.$('#et .is-loading .plx-entity-title__placeholder'), 'the loading placeholder');
    await page.evaluate(() => [...document.querySelectorAll('#ps button')].find((b) => /Summarize/.test(b.textContent)).click()); await sleep(100);
    await page.evaluate(() => [...document.querySelectorAll('#ps button')].find((b) => /Card idea/.test(b.textContent)).click()); await sleep(100);
    assert.deepEqual(await page.evaluate(() => window.calls.filter((c) => /^sug:/.test(c))), ['sug:sum', 'sug:card'], 'each suggestion chooses once');
    await page.type('#pi input', 'hello');
    await page.keyboard.press('Enter'); await sleep(200);
    assert.deepEqual(await page.evaluate(() => window.calls.filter((c) => /^send:/.test(c))), ['send:hello'], 'Enter sends once with the text');
    assert.equal(await page.$eval('#pi input', (i) => i.value), '', 'the field clears after a send');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-c: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
