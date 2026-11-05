/* Plenix tests · AppShell minSize (issue 274, ADR 0010, D-0044): below the shell's minimum screen (tokens --plx-sys-shell-min-width
   1024px, --plx-sys-shell-min-height 640px) the shell shows "Screen size not supported" and keeps the app mounted but hidden and
   inert; "Continue anyway" lets the person go on for the session.
   Cases: 800x600 and 1280x500 show the notice (an h1 inside the main landmark, with the size in its text); 1280x800 shows the app and
     no notice; growing the window brings the app back (live) with its typed state kept; Continue anyway shows the app at 800x600
     and stays dismissed after a new render; without the prop nothing changes at 800x600; no script errors.
   Usage: node tests/app-shell-min-size-274.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9652, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const draw = (minSize) => page.evaluate((m) => {
      document.querySelector('main') && (document.querySelector('main').innerHTML = '<div id="v"></div>');
      const h = React.createElement, P = Plenix;
      ReactDOM.createRoot(document.getElementById('v')).render(h(P.AppShell, { minSize: m, header: h('header', null, 'Head') }, h('input', { id: 'typed', 'aria-label': 'Typed' })));
    }, minSize);
    const state = () => page.evaluate(() => {
      const shell = document.querySelector('.plx-app-shell'), notice = [...document.querySelectorAll('#v h1')].find((x) => /Screen size not supported/.test(x.textContent));
      return { appHidden: !shell || shell.hidden || shell.hasAttribute('inert') || shell.getClientRects().length === 0, notice: !!notice, inMain: !!(notice && notice.closest('main')), text: notice ? notice.closest('main').textContent : '', typed: (document.getElementById('typed') || {}).value };
    });
    const size = async (w, h) => { await page.setViewport({ width: w, height: h }); await sleep(300); };

    await draw(true); await sleep(500);
    let s = await state();
    assert.equal(s.notice, false, '1280x800: no notice'); assert.equal(s.appHidden, false, '1280x800: the app shows');
    await page.type('#typed', 'kept');

    await size(800, 600); s = await state();
    assert.ok(s.notice, '800x600: the notice shows'); assert.ok(s.appHidden, '800x600: the app is hidden'); assert.ok(s.inMain, 'the notice heading is in a main landmark');
    assert.match(s.text, /1024/, 'the text names the width'); assert.match(s.text, /640/, 'the text names the height');
    await size(1280, 500); s = await state(); assert.ok(s.notice, '1280x500: the notice shows (too low)');
    await size(1280, 800); s = await state();
    assert.equal(s.notice, false, 'growing the window brings the app back'); assert.equal(s.typed, 'kept', 'the app kept its state while hidden');

    await size(800, 600);
    await page.evaluate(() => [...document.querySelectorAll('#v button')].find((b) => /Continue anyway/.test(b.textContent)).click()); await sleep(200);
    s = await state(); assert.equal(s.notice, false, 'Continue anyway: the notice is gone'); assert.equal(s.appHidden, false, 'Continue anyway: the app shows at 800x600');
    await draw(true); await sleep(300); s = await state(); assert.equal(s.notice, false, 'it stays dismissed for the session');

    await page.evaluate(() => sessionStorage.clear()); await draw(false); await sleep(300); s = await state();
    assert.equal(s.notice, false, 'without minSize nothing changes at 800x600');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('app-shell-min-size-274: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
