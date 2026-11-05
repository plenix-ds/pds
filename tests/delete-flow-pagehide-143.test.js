// Plenix tests · #143: DeleteFlow's undo form commits the delete when the page is hidden for good (pagehide) while the toast is
// still up, unless Undo was pressed; the commit runs once, and not again when the toast leaves afterwards.
//   node tests/delete-flow-pagehide-143.test.js   → DELETE_FLOW_PAGEHIDE_143_OK
const assert = require('assert/strict');
const { serve, launch } = require('./lib.js');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9653;
  await serve(PORT); const browser = await launch();
  const run = async (pressUndo) => {
    const page = await browser.newPage();
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const r = await page.evaluate((pressUndo) => new Promise((resolve) => {
      document.querySelector('main').innerHTML = '<div id="d"></div>';
      const log = { commits: 0, restores: 0 };
      const props = { variant: 'undo', items: [{ id: 1 }], noun: 'file', open: true, undoDuration: 1500, onDelete() {}, onRestore() { log.restores++; }, onCommit() { log.commits++; } };
      ReactDOM.createRoot(document.getElementById('d')).render(React.createElement(Plenix.ToastProvider, null, React.createElement(Plenix.DeleteFlow, props)));
      setTimeout(() => {
        if (pressUndo) { const b = [...document.querySelectorAll('button')].find((x) => /undo/i.test(x.textContent)); if (b) b.click(); }
        window.dispatchEvent(new Event('pagehide'));
        const atHide = log.commits;
        setTimeout(() => resolve({ atHide, final: log.commits, restores: log.restores }), 2500);
      }, 500);
    }), pressUndo);
    await page.close(); return r;
  };
  try {
    const a = await run(false);
    assert.equal(a.atHide, 1, 'pagehide with the toast up commits at once, was ' + a.atHide);
    assert.equal(a.final, 1, 'and the toast leaving later does not commit again, was ' + a.final);
    const b = await run(true);
    assert.equal(b.restores, 1, 'Undo restored');
    assert.equal(b.final, 0, 'after Undo, pagehide commits nothing, was ' + b.final);
    console.log('DELETE_FLOW_PAGEHIDE_143_OK');
  } catch (e) { console.log('DELETE_FLOW_PAGEHIDE_143_FAIL ' + e.message); await browser.close(); process.exit(1); }
  await browser.close(); process.exit(0);
})();
