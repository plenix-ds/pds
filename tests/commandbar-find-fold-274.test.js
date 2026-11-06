// CommandBar: the find side takes part in the fit. In a very narrow pane (200px) it folds into one "Find and view" button that
// opens the search in a popover; nothing in the bar is drawn outside it; with room, the search is back in the bar
// (RedSave: the side panel's People on this page bar).
const assert = require('assert');
const { serve, launch } = require('./lib.js');
const PORT = +process.env.TEST_PORT || 8878;
(async () => {
  const server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 600 });
    const state = () => page.evaluate(() => {
      const bar = document.querySelector('.plx-command-bar'), card = document.querySelector('.plx-card').getBoundingClientRect();
      const barBox = bar.querySelector('.plx-command-bar__row').getBoundingClientRect();
      const out = [...bar.querySelectorAll('button, input')].filter((el) => el.offsetParent !== null).some((el) => { const r = el.getBoundingClientRect(); return r.right > barBox.right + 0.5 || r.left < barBox.left - 0.5; });
      const find = bar.querySelector('.plx-command-bar__find');
      return { out, folded: !!(find && find.querySelector('button[aria-label="Find and view"]')), field: !!(find && find.querySelector('input')) };
    });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/stages/commandbar-find-fold.html?find=more', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.plx-command-bar'); await page.evaluate(() => document.fonts.ready); await new Promise((r) => setTimeout(r, 600));
    // the bar fits again when the fonts finish loading (useBarFit), so measure only after they have (issue 42)
    let s = await state();
    assert.equal(s.folded, false, 'wide: the find side is in the bar'); assert.equal(s.out, false);
    await page.evaluate(() => document.getElementById('stage').classList.add('rv-tiny'));
    await page.waitForFunction(() => !!document.querySelector('.plx-command-bar__find button[aria-label="Find and view"]'), { timeout: 20000 }).catch(() => {});
    s = await state();
    assert.equal(s.folded, true, 'narrow: Find and view ' + JSON.stringify(Object.assign(s, { fonts: await page.evaluate(() => document.fonts.status), bar: await page.evaluate(() => document.querySelector('.plx-command-bar__row').getBoundingClientRect().width) }))); assert.equal(s.out, false, 'nothing past the bar');
    await page.click('.plx-command-bar__find button[aria-label="Find and view"]');
    await page.waitForSelector('[role="dialog"] input', { timeout: 5000 });
    await page.type('[role="dialog"] input', 'maya');
    assert.equal(await page.evaluate(() => window.__q274), 'maya', 'the same search, opened at full size');
    await page.keyboard.press('Escape');
    await page.evaluate(() => document.getElementById('stage').classList.remove('rv-tiny'));
    await page.waitForFunction(() => !document.querySelector('.plx-command-bar__find button[aria-label="Find and view"]'), { timeout: 10000 }).catch(() => {});
    s = await state();
    assert.equal(s.folded, false, 'wide again: the find side is back'); assert.equal(s.out, false);
    console.log('COMMANDBAR_FIND_FOLD_274_OK fold, nothing outside the bar, search in the popover, unfold');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
