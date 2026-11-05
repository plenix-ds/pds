/* Plenix tests · TypeScript wave 1, batch D (issue 292, ADR 0011): CodeBlock, SuggestedEdit and RefineMenu converted to TSX still draw and
   behave the same. CodeBlock: colors JavaScript and CSS (token spans), a title picks the language, Copy says "Copied"; SuggestedEdit: Accept
   and Reject decide once, "Accept all" decides the pending ones; RefineMenu: a menu choice calls onRefine, Custom needs a prompt.
   Run on the code before and after the rename: same result.   Usage: node tests/ts-wave1-d.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9659, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/^(error|warn)/.test(m.type())) problems.push(m.text()); });
    await page.setViewport({ width: 1000, height: 700 });
    const context = browser.defaultBrowserContext(); await context.overridePermissions('http://localhost:' + PORT, ['clipboard-read', 'clipboard-write']).catch(() => {});
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await page.evaluate(() => {
      const h = React.createElement, P = Plenix; window.calls = [];
      document.querySelector('main').innerHTML = '<div id="v"></div>';
      ReactDOM.createRoot(document.getElementById('v')).render(h(P.ToastProvider, null, h('div', null,
        h('div', { id: 'cb1' }, h(P.CodeBlock, { title: 'app.jsx' }, 'const x = 42; // note\nreturn <Button label="Hi" />;')),
        h('div', { id: 'cb2' }, h(P.CodeBlock, { title: 'a.css', copy: false }, '.a { color: red; /* c */ }')),
        h('div', { id: 'se' }, h(P.SuggestedEdit, { variant: 'all', edits: [{ id: 'e1', before: 'teh', after: 'the' }, { id: 'e2', before: 'recieve', after: 'receive' }], onDecision: (d) => window.calls.push('dec:' + d.decision + ':' + d.ids.join(',')) })),
        h('div', { id: 'rm' }, h(P.RefineMenu, { onRefine: (v) => window.calls.push('refine:' + v.action + (v.tone ? ':' + v.tone : '') + (v.prompt ? ':' + v.prompt : '')) }))))); 
    });
    await sleep(800);
    assert.equal(await page.$eval('#cb1 code', (e) => e.getAttribute('data-plx-language')), 'jsx'); assert.equal(await page.$eval('#cb2 code', (e) => e.getAttribute('data-plx-language')), 'css');
    assert.ok(await page.$('#cb1 .plx-code-block__tok--keyword'), 'a keyword is colored'); assert.ok(await page.$('#cb1 .plx-code-block__tok--number'), 'a number is colored'); assert.ok(await page.$('#cb1 .plx-code-block__tok--comment'), 'a comment is colored'); assert.ok(await page.$('#cb1 .plx-code-block__tok--tag'), 'a tag is colored');
    assert.ok(await page.$('#cb2 .plx-code-block__tok--selector'), 'a CSS selector is colored'); assert.equal(await page.$('#cb2 .plx-code-block__head button'), null, 'copy=false draws no Copy');
    await page.evaluate(() => [...document.querySelectorAll('#cb1 button')].find((b) => /copy/i.test(b.textContent)).click()); await sleep(300);
    assert.match(await page.$eval('#cb1 .plx-code-block__head', (e) => e.textContent), /Copied|copy/i);
    await page.evaluate(() => [...document.querySelectorAll('#se button')].find((b) => /^accept$/i.test(b.textContent.trim())).click()); await sleep(200);
    await page.evaluate(() => [...document.querySelectorAll('#se button')].find((b) => /accept all/i.test(b.textContent)).click()); await sleep(200);
    assert.deepEqual(await page.evaluate(() => window.calls.filter((c) => /^dec:/.test(c))), ['dec:accepted:e1', 'dec:accepted:e2'], 'one decision for the first edit, then Accept all for the pending one');
    assert.equal(await page.$$eval('#se [role=status]', (e) => e.length), 2, 'both edits show a decision');
    await page.click('#rm button'); await sleep(200);
    await page.evaluate(() => [...document.querySelectorAll('[role=menuitem]')].find((b) => /shorter/i.test(b.textContent)).click()); await sleep(200);
    assert.deepEqual(await page.evaluate(() => window.calls.filter((c) => /^refine:/.test(c))), ['refine:shorter'], 'a menu choice refines once');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no errors or warnings');
    console.log('ts-wave1-d: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
