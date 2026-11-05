// Plenix tests · #144 (D-0057): DeleteFlow's undo toast lasts 10 seconds by default (the toast pauses on hover and focus by itself),
// undoDuration overrides it (in milliseconds), and 0 keeps it until it is dismissed.
//   node tests/delete-flow-undo-144.test.js   → DELETE_FLOW_UNDO_144_OK
const assert = require('assert/strict');
const { serve, launch } = require('./lib.js');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9652;
  await serve(PORT); const browser = await launch();
  const run = async (prop, waitMs) => {
    const page = await browser.newPage();
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const at = await page.evaluate((prop, waitMs) => new Promise((resolve) => {
      document.querySelector('main').innerHTML = '<div id="d"></div>';
      const t0 = performance.now(); let committed = null;
      const props = Object.assign({ variant: 'undo', items: [{ id: 1 }], noun: 'file', open: true, onDelete() {}, onRestore() {}, onCommit() { committed = Math.round(performance.now() - t0); } }, prop);
      ReactDOM.createRoot(document.getElementById('d')).render(React.createElement(Plenix.ToastProvider, null, React.createElement(Plenix.DeleteFlow, props)));
      setTimeout(() => resolve(committed), waitMs);
    }), prop, waitMs);
    await page.close(); return at;
  };
  try {
    const dflt = await run({}, 13000);
    assert.ok(dflt !== null && dflt >= 9500 && dflt <= 12000, 'default: the delete is final after about 10 s, was ' + dflt + ' ms');
    const short = await run({ undoDuration: 1000 }, 4000);
    assert.ok(short !== null && short >= 800 && short <= 2500, 'undoDuration 1000: final after about 1 s, was ' + short + ' ms');
    const kept = await run({ undoDuration: 0 }, 6000);
    assert.equal(kept, null, 'undoDuration 0: the toast stays until dismissed');
    console.log('DELETE_FLOW_UNDO_144_OK');
  } catch (e) { console.log('DELETE_FLOW_UNDO_144_FAIL ' + e.message); await browser.close(); process.exit(1); }
  await browser.close(); process.exit(0);
})();
