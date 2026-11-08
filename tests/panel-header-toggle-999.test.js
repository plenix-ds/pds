// Plenix tests · #999 (ADR 0041, D-0129): <Panel collapsible toggleOn="header"> toggles from its whole header; the button stays the only
// focusable control; actions and interactive children do not toggle; a text selection does not toggle; RTL closed chevron is +90deg.
//   node tests/panel-header-toggle-999.test.js   → PANEL_HEADER_TOGGLE_999_OK
const assert = require('assert/strict');
const { serve, launch } = require('./lib.js');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9999;
  await serve(PORT); const browser = await launch();
  try {
    const page = await browser.newPage(); await page.setViewport({ width: 1200, height: 900 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    await page.evaluate(() => {
      const P = Plenix, h = React.createElement;
      window.__log = [];
      document.querySelector('main').innerHTML = ['hdr', 'btn', 'rtl'].map((id) => '<div id="' + id + '" dir="' + (id === 'rtl' ? 'rtl' : 'ltr') + '" style="margin-bottom:12px"></div>').join('');
      const mk = (id, toggleOn) => ReactDOM.createRoot(document.getElementById(id)).render(h(P.Panel, { title: 'Details', description: 'About the case', collapsible: true, toggleOn, onToggle: (n) => window.__log.push(id + ':' + n), actions: h(P.Button, { size: 'sm', onClick: () => window.__log.push(id + ':action') }, 'Edit') }, h('p', null, 'Body')));
      mk('hdr', 'header'); mk('btn', undefined); mk('rtl', 'header');
    });
    await new Promise((r) => setTimeout(r, 800));
    const q = (id, sel) => '#' + id + ' ' + sel;
    const expanded = (id) => page.$eval(q(id, '.plx-panel__toggle'), (b) => b.getAttribute('aria-expanded'));
    // AC-4: without the opt-in a click on the title does nothing
    await page.click(q('btn', '.plx-panel__title')); assert.equal(await expanded('btn'), 'true', 'no opt-in: the title does not toggle');
    // AC-1: with it, a click on the title toggles and onToggle gets the new state
    await page.click(q('hdr', '.plx-panel__title')); assert.equal(await expanded('hdr'), 'false'); 
    assert.ok(await page.$eval('#hdr .plx-panel', (e) => e.classList.contains('plx-panel--toggle-header')), 'the modifier class');
    // the button still toggles once (not twice)
    await page.click(q('hdr', '.plx-panel__toggle')); assert.equal(await expanded('hdr'), 'true');
    // the empty part of the row toggles
    const hb = await page.$eval(q('hdr', '.plx-panel__header'), (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width * 0.6, y: r.top + 4 }; });
    await page.mouse.click(hb.x, hb.y); assert.equal(await expanded('hdr'), 'false', 'the empty part of the header toggles'); await page.click(q('hdr', '.plx-panel__toggle'));
    // AC-2: an action does not toggle and runs
    await page.click(q('hdr', '.plx-panel__actions button')); assert.equal(await expanded('hdr'), 'true');
    const log = await page.evaluate(() => window.__log);
    assert.deepEqual(log.filter((x) => x.startsWith('hdr')), ['hdr:false', 'hdr:true', 'hdr:false', 'hdr:true', 'hdr:action']);
    // AC-3: the header has no role, tabindex or key handler; only the button is focusable in it
    const hdrAttrs = await page.$eval(q('hdr', '.plx-panel__header'), (e) => ({ role: e.getAttribute('role'), tab: e.getAttribute('tabindex') }));
    assert.deepEqual(hdrAttrs, { role: null, tab: null });
    // a text selection does not toggle
    await page.evaluate(() => { const t = document.querySelector('#hdr .plx-panel__title'); const r = document.createRange(); r.selectNodeContents(t); const s = getSelection(); s.removeAllRanges(); s.addRange(r); });
    await page.click(q('hdr', '.plx-panel__description'), { clickCount: 1 }).catch(() => {});
    await page.evaluate(() => { const t = document.querySelector('#hdr .plx-panel__title'); const r = document.createRange(); r.selectNodeContents(t); const s = getSelection(); s.removeAllRanges(); s.addRange(r); });
    const before = await expanded('hdr');
    await page.evaluate(() => document.querySelector('#hdr .plx-panel__title').dispatchEvent(new MouseEvent('click', { bubbles: true })));
    assert.equal(await expanded('hdr'), before, 'a click that ends a selection does not toggle');
    // look: hovering the header gives the toggle the hover background; hovering the action does not; cursor is a pointer
    const bg = (id) => page.$eval(q(id, '.plx-panel__toggle'), (e) => getComputedStyle(e).backgroundColor);
    await page.mouse.move(1100, 800); await new Promise((r) => setTimeout(r, 300));
    const rest = await bg('hdr');
    await page.hover(q('hdr', '.plx-panel__title')); await new Promise((r) => setTimeout(r, 300));
    const hover = await bg('hdr'); assert.notEqual(hover, rest, 'header hover lights the toggle');
    assert.equal(await page.$eval(q('hdr', '.plx-panel__header'), (e) => getComputedStyle(e).cursor), 'pointer');
    await page.hover(q('hdr', '.plx-panel__actions button')); await new Promise((r) => setTimeout(r, 300));
    assert.equal(await bg('hdr'), rest, 'hovering an action does not light the toggle');
    // RTL: a closed chevron turns +90deg (and -90deg in LTR)
    if ((await expanded('hdr')) === 'true') await page.click(q('hdr', '.plx-panel__toggle'));
    await page.click(q('rtl', '.plx-panel__toggle'));
    await new Promise((r) => setTimeout(r, 500));
    const turn = (id) => page.$eval(q(id, '.plx-panel__toggle'), (e) => getComputedStyle(e).getPropertyValue('--plx-comp-icon-turn').trim());
    assert.equal(await turn('rtl'), 'rotate(90deg)', 'RTL closed chevron');
    assert.equal(await turn('hdr'), 'rotate(-90deg)', 'LTR closed chevron');
    console.log('PANEL_HEADER_TOGGLE_999_OK');
  } finally { await Promise.race([browser.close(), new Promise((x) => setTimeout(x, 5000))]); }
})().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
