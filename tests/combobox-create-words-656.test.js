/* Plenix tests · Combobox's create option reads its words from the catalog (issue 656).
   Summary: a creatable Combobox, the typed text matching no option: the create option is combobox.create ("Create “{text}”")
     with the typed text in a <bdi>; a strings.create the app passes wins; an Arabic typed word in an English page stays
     inside the quotes (isolated).
   Proof first: before the fix the text was written in Combobox.tsx ("Create “…”"), so strings.create did not change it and
     the typed text had no <bdi>: those lines fail.
   Opens a headless browser: run by the owner's test run, never by an agent.
   Usage: node tests/combobox-create-words-656.test.js   → COMBOBOX_CREATE_WORDS_656_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const PORT = +process.env.TEST_PORT || 9867, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 800, height: 500 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const create = async (typed, strings) => {
      await page.evaluate((strings) => {
        const h = React.createElement, P = window.Plenix;
        window.__root && window.__root.unmount();
        document.getElementById('main').innerHTML = '<div id="c"></div>';
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(P.LocaleProvider, { locale: 'en-US' }, h(P.Combobox, { 'aria-label': 'Tags', creatable: true, options: [{ value: 'a', label: 'Alpha' }], onCreate: () => {}, strings })));
      }, strings || null);
      await wait(300); await page.focus('.plx-combobox__input'); await page.keyboard.type(typed); await wait(250);
      return page.evaluate(() => { const o = document.querySelector('.plx-combobox__create'); return o && { text: o.textContent, bdi: (o.querySelector('bdi') || {}).textContent || null }; });
    };
    const en = await create('Zed');
    assert.deepEqual(en, { text: 'Create “Zed”', bdi: 'Zed' }, 'the catalog\'s words, the typed text isolated');
    const own = await create('Zed', { create: 'Add “{text}” as a tag' });
    assert.equal(own && own.text, 'Add “Zed” as a tag', 'strings.create wins over the catalog');
    const mixed = await create('شباب');
    assert.equal(mixed && mixed.bdi, 'شباب', 'Arabic typed text sits in its own <bdi>');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('COMBOBOX_CREATE_WORDS_656_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
