/* Plenix tests · #632: EntityHeader's state picker (header style 2) moves with the reading direction.
   Summary: the states radio group moves with the arrow keys: Right and Left follow the writing direction (in right-to-left, Right Arrow goes to the option on the
     right, which is the previous in reading order), Down goes to the next and Up to the previous in both. Each move selects and focuses the option; the ends wrap.
   Proof first: before the fix Right Arrow always goes to the next option, so in right-to-left it goes the wrong way: those lines fail.
   Usage: node tests/entity-header-states-keys-632.test.js   → ENTITY_HEADER_STATES_KEYS_632_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9854, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 1000, height: 500 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const App = () => { const [v, setV] = React.useState('b'); return h(Plenix.EntityHeader, { title: 'Case 14', states: { value: v, onChange: setV, label: 'State', options: [{ value: 'a', label: 'Alpha', tone: 'waiting' }, { value: 'b', label: 'Beta', tone: 'info' }, { value: 'c', label: 'Gamma', tone: 'success' }] } }); };
        ReactDOM.createRoot(document.getElementById('c')).render(h(App));
        await new Promise((r) => setTimeout(r, 800));
      }, dir);
      const T = dir + ': ';
      const radios = () => page.evaluate(() => [...document.querySelectorAll('.plx-entity-header__states [role=radio]')].map((b) => ({ label: b.textContent.trim(), on: b.getAttribute('aria-checked') === 'true', focus: document.activeElement === b, x: Math.round(b.getBoundingClientRect().left) })));
      let r = await radios(); assert.equal(r.length, 3, T + 'three options');
      // the visual order: in rtl the first option is the rightmost
      const first = r[0], last = r[2]; assert.ok(dir === 'rtl' ? first.x > last.x : first.x < last.x, T + 'options run in the reading direction');
      const sel = async () => (await radios()).find((o) => o.on).label;
      const press = async (key) => { await page.keyboard.press(key); await wait(150); };
      await page.focus('.plx-entity-header__states [role=radio][aria-checked=true]');
      assert.equal(await sel(), 'Beta');
      // Right Arrow goes toward the right: next in ltr, previous (Alpha) in rtl; Left the opposite
      await press('ArrowRight'); assert.equal(await sel(), dir === 'rtl' ? 'Alpha' : 'Gamma', T + 'Right Arrow goes toward the right');
      await press('ArrowLeft'); assert.equal(await sel(), 'Beta', T + 'Left Arrow goes back');
      await press('ArrowLeft'); assert.equal(await sel(), dir === 'rtl' ? 'Gamma' : 'Alpha', T + 'Left Arrow goes toward the left');
      await press('ArrowRight'); assert.equal(await sel(), 'Beta');
      // Down is the next and Up the previous in both directions
      await press('ArrowDown'); assert.equal(await sel(), 'Gamma', T + 'Down is next');
      await press('ArrowUp'); assert.equal(await sel(), 'Beta', T + 'Up is previous');
      assert.ok((await radios()).find((o) => o.on).focus, T + 'the selected option has the focus');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('ENTITY_HEADER_STATES_KEYS_632_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
