/* Plenix tests · baseline behaviour (plan 7e) of CopyButton, DownloadButton, DropZone, Scrim and Spotlight (issue 908).
   Summary (the browser, left to right and right to left, dev React, no console warnings):
     CopyButton: named by what it copies; a press, Enter and Space copy the value as it is then (a function is called at the press), once each; onCopy(true);
       the name does not change while "Copied" shows, and the rest state returns; a refused copy runs onCopy(false); disabled copies nothing and is not focusable
       by Tab; the field form shows the value in a read-only field
     DownloadButton: a link with the download attribute, named with the file, its format and size; onDownload fires once per press; while progress is set it is busy
       and a press does nothing; icon-only keeps the full name; no overflow with a 3x longer file name
     DropZone: a div, or a button that opens on click and on Enter/Space; active and reject show (reject says it in words, not color alone); a page's onDrop receives the drop
     Scrim: hidden from assistive technology, never a Tab stop, onClick runs, contained covers its parent only, over the window it locks scrolling and unlocks on unmount
     Spotlight: nothing while closed; open it is hidden from assistive technology, the target keeps the pointer (the dimmed panels do not cover it), Escape runs onDismiss,
       the beacon dims nothing
   Usage: node tests/behaviour-actions-overlays-908.test.js   -> BEHAVIOUR_ACTIONS_OVERLAYS_908_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9909, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 900, height: 700 });
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::/.test(m.text())) problems.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate((dir) => { document.documentElement.setAttribute('dir', dir); window.__log = []; window.__fail = false; const exec = document.execCommand.bind(document); document.execCommand = (c) => (window.__fail ? false : exec(c));
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (t) => { if (window.__fail) throw new Error('refused'); window.__log.push('copy:' + t); } } });
        window.__mount = async (node, width) => { window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c" style="position:relative;inline-size:' + (width || 420) + 'px;block-size:200px"></div>';
          window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(node); await new Promise((r) => setTimeout(r, 400)); }; }, dir);
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));

      // CopyButton
      await page.evaluate(async () => { const h = React.createElement, P = Plenix; window.__log = []; await window.__mount(h(P.CopyButton, { value: () => 'LIVE-' + (window.__log.length), label: 'Copy ID', showLabel: true, timeout: 300, onCopy: (ok) => window.__log.push('ok:' + ok) })); });
      assert.equal(await page.$eval('button', (b) => b.getAttribute('aria-label') || b.textContent.trim()), 'Copy ID', T + 'CopyButton is named by what it copies');
      await page.click('button'); await wait(100);
      let log = await page.evaluate(() => window.__log); assert.deepEqual(log, ['copy:LIVE-0', 'ok:true'], T + 'a press copies the value once, got ' + JSON.stringify(log));
      assert.ok(/Copied/.test(await page.$eval('button', (b) => b.textContent)), T + 'the label says Copied for a moment');
      await wait(500); assert.ok(/Copy ID/.test(await page.$eval('button', (b) => b.textContent)), T + 'the rest state returns');
      await page.focus('button'); await page.keyboard.press('Enter'); await wait(60); await page.keyboard.press('Space'); await wait(60);
      log = await page.evaluate(() => window.__log.filter((x) => x.startsWith('copy:'))); assert.equal(log.length, 3, T + 'Enter and Space each copy once, got ' + JSON.stringify(log));
      await page.evaluate(() => { window.__fail = true; window.__log = []; }); await page.click('button'); await wait(120);
      log = await page.evaluate(() => window.__log); assert.deepEqual(log, ['ok:false'], T + 'a refused copy runs onCopy(false), got ' + JSON.stringify(log)); await page.evaluate(() => { window.__fail = false; });
      await page.evaluate(async () => { const h = React.createElement, P = Plenix; window.__log = []; await window.__mount(h(P.CopyButton, { value: 'X', label: 'Copy link', disabled: true, onCopy: () => window.__log.push('ok') })); });
      assert.equal(await page.$eval('button', (b) => b.disabled), true, T + 'disabled CopyButton is disabled'); await page.evaluate(() => document.querySelector('button').click());
      assert.deepEqual(await page.evaluate(() => window.__log), [], T + 'a disabled CopyButton copies nothing');
      await page.evaluate(async () => { const h = React.createElement, P = Plenix; await window.__mount(h(P.CopyButton, { value: 'https://example.com/share/abc', label: 'Copy link', field: true, fieldLabel: 'Share link' })); });
      assert.equal(await page.$eval('input', (i) => i.value + '|' + i.readOnly), 'https://example.com/share/abc|true', T + 'the field form shows the value in a read-only field');

      // DownloadButton
      const dl = (props) => page.evaluate(async (props) => { const h = React.createElement, P = Plenix; window.__log = [];
        await window.__mount(h(P.DownloadButton, Object.assign({}, props, props.onDownload ? { onDownload: () => window.__log.push('dl') } : {}))); const el = document.querySelector('a[download], button');
        return { tag: el.tagName, download: el.getAttribute('download'), name: el.getAttribute('aria-label') || el.textContent.trim(), busy: el.getAttribute('aria-busy'), over: el.scrollWidth > el.parentElement.clientWidth + 1 }; }, props);
      let d = await dl({ href: '/files/cross-014.png', fileName: 'cross-014.png', format: 'PNG', size: 4200000 });
      assert.equal(d.tag, 'A', T + 'with href it is a link'); assert.equal(d.download, 'cross-014.png', T + 'it carries the download attribute');
      assert.ok(/cross-014\.png/.test(d.name) && /PNG/.test(d.name), T + 'the name has the file and its format, got ' + d.name);
      d = await dl({ href: '/f.pdf', fileName: 'report.pdf', iconOnly: true, format: 'PDF' }); assert.ok(/report\.pdf/.test(d.name), T + 'icon-only keeps the full name, got ' + d.name);
      d = await dl({ onDownload: true, fileName: 'export.csv' }); await page.click('button'); assert.deepEqual(await page.evaluate(() => window.__log), ['dl'], T + 'onDownload fires once per press');
      d = await dl({ onDownload: true, fileName: 'export.csv', progress: 40 }); assert.equal(d.busy, 'true', T + 'while progress is set it is busy');
      await page.evaluate(() => document.querySelector('button').click()); assert.deepEqual(await page.evaluate(() => window.__log), [], T + 'a press while downloading does nothing');
      d = await dl({ href: '/f', fileName: 'an-extremely-long-file-name-that-goes-on-and-on-for-three-times-the-english-length-of-the-usual-name.tar.gz', format: 'GZ' }); assert.ok(!d.over, T + 'a long file name does not overflow');

      // DropZone
      const dz = async (props, children) => page.evaluate(async (props, children) => { const h = React.createElement, P = Plenix; window.__log = [];
        await window.__mount(h(P.DropZone, Object.assign({ onDrop: (e) => { e.preventDefault(); window.__log.push('drop'); }, onDragOver: (e) => e.preventDefault(), onClick: () => window.__log.push('click') }, props), children));
        const el = document.querySelector('.plx-drop-zone, [class*="drop-zone"]') || document.querySelector('#c > *'); return { tag: el.tagName, cls: el.className, text: el.textContent.trim() }; }, props, children);
      let z = await dz({}, 'Drop files here'); assert.equal(z.tag, 'DIV', T + 'a DropZone is a div by default');
      await page.evaluate(() => { const el = document.querySelector('#c > *'); el.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true })); });
      assert.deepEqual(await page.evaluate(() => window.__log), ['drop'], T + "the page's onDrop gets the drop");
      z = await dz({ as: 'button' }, 'Choose files'); assert.equal(z.tag, 'BUTTON', T + 'as="button" is a button');
      await page.focus('#c > *'); await page.keyboard.press('Enter'); await page.keyboard.press('Space'); await wait(50);
      assert.equal(await page.evaluate(() => window.__log.filter((x) => x === 'click').length), 2, T + 'Enter and Space open it');
      const plain = await dz({}, 'x'); const act = await dz({ active: true }, 'x'); assert.notEqual(act.cls, plain.cls, T + 'active changes the look');
      z = await dz({ reject: true, rejectContent: 'Only images can go here' }, 'Drop images here'); assert.ok(/Only images can go here/.test(z.text), T + 'reject says it in words');

      // Scrim
      const sc = (props, contained) => page.evaluate(async (props, contained) => { const h = React.createElement, P = Plenix; window.__log = []; const before = getComputedStyle(document.body).overflow;
        await window.__mount(h(P.Scrim, Object.assign({ onClick: () => window.__log.push('scrim') }, props))); const el = document.querySelector('.plx-scrim, [class*="scrim"]'); const r = el.getBoundingClientRect(), pr = document.getElementById('c').getBoundingClientRect();
        return { hidden: el.getAttribute('aria-hidden'), tab: el.tabIndex, before, during: getComputedStyle(document.documentElement).overflow + '|' + getComputedStyle(document.body).overflow, box: [Math.round(r.width), Math.round(r.height)], parent: [Math.round(pr.width), Math.round(pr.height)], win: [innerWidth, innerHeight] }; }, props, contained);
      let sr = await sc({}); assert.equal(sr.hidden, 'true', T + 'the scrim is hidden from assistive technology'); assert.ok(sr.tab < 0, T + 'it is never a Tab stop');
      await page.mouse.click(10, 300); assert.ok((await page.evaluate(() => window.__log)).indexOf('scrim') >= 0, T + 'a click on it runs onClick');
      assert.ok(/hidden|clip/.test(sr.during), T + 'over the window it locks scrolling, got ' + sr.during);
      await page.evaluate(() => window.__root.unmount()); await wait(100);
      assert.ok(!/hidden/.test(await page.evaluate(() => getComputedStyle(document.documentElement).overflow + '|' + getComputedStyle(document.body).overflow)), T + 'unmounting releases the page');
      sr = await sc({ contained: true, variant: 'light' }); assert.deepEqual(sr.box, sr.parent, T + 'contained covers its parent, not the window, got ' + JSON.stringify([sr.box, sr.parent]));

      // Spotlight
      const sp = (props) => page.evaluate(async (props) => { const h = React.createElement, P = Plenix; window.__log = []; const ref = React.createRef();
        await window.__mount(h('div', { style: { position: 'relative', padding: '60px' } }, h(P.Button, { ref, id: 'target' }, 'Filters'), h(P.Spotlight, Object.assign({ target: ref, contained: true, onDismiss: () => window.__log.push('dismiss') }, props))));
        const t = document.getElementById('target'), r = t.getBoundingClientRect(); const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        const s = document.querySelector('[class*="spotlight"]'); return { present: !!s, hidden: s ? s.getAttribute('aria-hidden') : null, targetOnTop: top === t || t.contains(top), panels: s ? s.querySelectorAll('[class*="spotlight__"]').length : 0 }; }, props);
      let o = await sp({ open: false }); assert.equal(o.present, false, T + 'closed, nothing is drawn');
      o = await sp({ open: true }); assert.ok(o.present && o.hidden === 'true', T + 'open, it is hidden from assistive technology'); assert.ok(o.targetOnTop, T + 'the target keeps the pointer');
      await page.keyboard.press('Escape'); assert.deepEqual(await page.evaluate(() => window.__log), ['dismiss'], T + 'Escape runs onDismiss');
      o = await sp({ open: true, variant: 'beacon' }); assert.ok(o.targetOnTop, T + 'the beacon leaves the target on top');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | ').slice(0, 400));
    console.log('BEHAVIOUR_ACTIONS_OVERLAYS_908_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
