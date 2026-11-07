/* Plenix tests · #851 (D-0091): icon buttons everyone knows show no visual tooltip; they keep their accessible name.
   Summary: Mounts each Plenix part with a known icon button (the close X of a Dialog, Sheet, Popover, Banner and Notice; the clear X of a Combobox; the previous and next chevrons of a
     Calendar and a Carousel; the DataGrid row ⋮) and hovers, then focuses, each button: it has an aria-label and no tooltip appears. An app's own icon button, and the ⋮ More of a
     CommandBar, keep theirs (DESIGN.md §6). Left to right.
   Proof first: before the change every one of these shows its label as a tooltip (the Dialog X showed "Cancel").
   Usage: node tests/no-tooltip-known-buttons-851.test.js   → NO_TOOLTIP_851_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9803, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 1200, height: 900 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const cases = [
      ['Dialog X', "h(P.Dialog, { open: true, onClose() {}, title: 'Rename', closeLabel: 'Close' }, 'Body')", '.plx-dialog__close', false],
      ['Popover X', "h(P.Popover, { defaultOpen: true, closeButton: true, title: 'Filter', trigger: h(P.Button, null, 'Open') }, 'Body')", '.plx-popover__close', false],
      ['Banner X', "h(P.Banner, { tone: 'info', onDismiss() {} }, 'Heads up')", '.plx-banner__dismiss', false],
      ['Notice X', "h(P.Notice, { tone: 'info', onDismiss() {} }, 'Heads up')", '.plx-notice__dismiss', false],
      ['Combobox clear', "h(P.Combobox, { label: 'Color', options: ['Red', 'Green'], value: 'Red', onChange() {}, clearable: true })", '.plx-combobox__clear', false],
      ['Calendar previous', "h(P.Calendar, { label: 'Pick a day' })", '.plx-calendar__nav--previous', false],
      ['Calendar next', "h(P.Calendar, { label: 'Pick a day' })", '.plx-calendar__nav--next', false],
      ['Carousel next', "h(P.Carousel, { label: 'Photos', perView: 2 }, [1, 2, 3, 4, 5, 6].map((n) => h('div', { key: n, style: { padding: 40 } }, 'Slide ' + n)))", '.plx-carousel__next', false],
      ['DataGrid row ⋮', "h(P.DataGrid, { label: 'Rows', data: [{ id: 'a', name: 'A' }], columns: [{ title: 'Name', field: 'name' }], index: 'id', rowMenu: [{ label: 'Open', onSelect() {} }] })", '.plx-data-grid__row-menu', false],
      ['an app icon button keeps its tooltip', "h(P.Button, { iconOnly: true, icon: 'archive', label: 'Archive', className: 'probe' })", '.probe', true],
    ];
    for (const [name, expr, selector, keeps] of cases) {
      await page.evaluate(async (expr) => {
        window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c" style="padding:80px"></div>';
        const h = React.createElement, P = window.Plenix; window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h(P.ToastProvider || React.Fragment, null, eval(expr))); await new Promise((r) => setTimeout(r, 900));
      }, expr);
      const sel = selector;
      const present = await page.$(sel);
      assert.ok(present, name + ': the button is on the page (' + sel + ')');
      const label = await page.$eval(sel, (b) => b.getAttribute('aria-label') || b.getAttribute('aria-labelledby'));
      assert.ok(label, name + ': it keeps its accessible name');
      await page.hover(sel); await new Promise((r) => setTimeout(r, 900));
      let tip = await page.evaluate(() => [...document.querySelectorAll('[role=tooltip]')].filter((t) => t.textContent.trim()).length);
      await page.mouse.move(2, 2); await new Promise((r) => setTimeout(r, 300));
      await page.$eval(sel, (b) => b.focus()); await page.keyboard.press('Shift'); await new Promise((r) => setTimeout(r, 900));
      tip += await page.evaluate(() => [...document.querySelectorAll('[role=tooltip]')].filter((t) => t.textContent.trim()).length);
      if (keeps) assert.ok(tip > 0, name + ': it shows a tooltip');
      else assert.equal(tip, 0, name + ': no tooltip on hover or focus');
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('NO_TOOLTIP_851_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
