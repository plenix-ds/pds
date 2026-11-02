/* Plenix tests · sizes past the generated grid lines (#375 review): system/steps.css has a rule for every 4px grid line up to
   GRID_BOX_MAX and GRID_PANE_MAX (both 1600px: a pane of the shell goes as wide as a Resizable box, #463) (build-steps.js, exported
   by utils/sizeSteps.js). A size just above a cap lands on the cap, never on the box's default size, and the separators report the caps as their limits.
   Summary: a Resizable at a width of 1604 and 1700 and a height of 1700 is drawn at 1600; a PanelSplitter whose limit is
     past 1600 goes no further than 1600 with End; the stylesheet has a rule for each cap and none past it.
   Usage: node tests/resize-caps.test.js   (run by layout.test.js when Resizable, SplitView or a pane changed) */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9615, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 2000, height: 2000 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const got = await page.evaluate(async () => {
      document.querySelector('main').innerHTML = '<div id="c"></div>';
      const h = React.createElement, P = window.Plenix, steps = [];
      const box = (id, props) => h('div', { id }, h(P.Resizable, Object.assign({ label: id, minWidth: 4, maxWidth: 4000, minHeight: 4, maxHeight: 4000 }, props), h('span', null, id)));
      ReactDOM.createRoot(document.getElementById('c')).render(h('div', null,
        box('w1604', { width: 1604 }), box('w1700', { width: 1700 }), box('h1700', { axis: 'vertical', height: 1700 }),
        box('max2000', { width: 800, minWidth: 2, maxWidth: 2000 }),
        h('div', { id: 'pane' }, h(P.PanelSplitter, { label: 'Pane', value: 900, min: 140, max: () => 2000, onChange: (w) => steps.push(w) }))));
      await new Promise((r) => setTimeout(r, 300));
      const size = (id, k) => Math.round(document.querySelector('#' + id + ' .plx-resizable').getBoundingClientRect()[k]);
      const edge = document.querySelector('#pane .plx-panel-splitter');
      // the separators report the limits they can reach (#375 review): a maxWidth of 2000 reports 1600, a pane's 2000 reports 1600
      const aria = (el) => [+el.getAttribute('aria-valuemin'), +el.getAttribute('aria-valuemax')];
      const boxAria = aria(document.querySelector('#max2000 .plx-resizable__edge')), paneAria = aria(edge);
      edge.focus(); edge.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      // the stylesheet's own rules: the caps have one, the next grid line past them none
      // (through @import and cascade layers: platform.css imports each sheet into its layer)
      const rules = [];
      const walk = (list) => { for (const r of list || []) { if (r.styleSheet) { try { walk(r.styleSheet.cssRules); } catch (e) { /* not readable */ } } if (r.cssRules) walk(r.cssRules); if (r.selectorText) rules.push(r.selectorText); } };
      [...document.styleSheets].forEach((sh) => { try { walk(sh.cssRules); } catch (e) { /* not readable */ } });
      const has = (sel) => rules.some((t) => t.indexOf(sel) >= 0);
      return { boxAria, paneAria, w1604: size('w1604', 'width'), w1700: size('w1700', 'width'), h1700: size('h1700', 'height'), end: steps[steps.length - 1],
        rules: [has('.plx-resizable[data-plx-width="1600px"]'), has('.plx-resizable[data-plx-width="1604px"]'), has('.plx-nav-pane[data-plx-width="1600px"]'), has('.plx-nav-pane[data-plx-width="1604px"]')] };
    });
    assert.deepEqual(got.rules, [true, false, true, false], 'the stylesheet draws up to the caps (1600 for a box and for a pane) and not past them');
    assert.equal(got.w1604, 1600, 'a width of 1604 is drawn at 1600, not the default');
    assert.equal(got.w1700, 1600, 'a width of 1700 is drawn at 1600, not the default');
    assert.equal(got.h1700, 1600, 'a height of 1700 is drawn at 1600, not the default');
    // the 8px drag grid (issue 882): the smallest size a box reaches is 8, and a pane's 140px minimum is reached at 144
    assert.deepEqual(got.boxAria, [8, 1600], 'a box with minWidth 2 and maxWidth 2000 reports aria-valuemin 8 and aria-valuemax 1600, the sizes it can reach');
    assert.deepEqual(got.paneAria, [144, 1600], 'a pane splitter whose limit is 2000 reports aria-valuemax 1600 (and its 140 minimum as 144, the first 8px line)');
    assert.equal(got.end, 1600, 'a pane splitter whose limit is 2000 goes no further than 1600 with End');
    assert.deepEqual(errors, [], 'no page error');
    console.log('RESIZE_CAPS_OK widths and heights past 1600 drawn at 1600, a pane at most 1600, the separators report the reachable limits, the stylesheet up to the caps');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
