/* Plenix tests · a split view resizes as far as its room allows (issue 873, P1; the owner, 2026-11-01: "I need to be able to
   resize any split view screen!!!!!"). Written before the fix: on the old SplitView it fails at the 720px ceiling.
   Summary (the browser, side by side unless said):
     an AITEAM-shaped split (defaultSize 540, no maxSize) starts at 544 (540 on the nearest 8px line, issue 882) and End, a pointer drag to the window's edge, and
       aria-valuemax all reach the room: the split view's panels less the gap and the second panel's token minimum, never
       720; the second panel keeps that minimum; the words at the limit say so ("The other pane needs at least …")
     maxSize 960 and maxSize 600 do not cap it (deprecated, no error): the same ceiling
     a split view wider than the window stops at the window's share (--plx-sys-shell-pane-window-share, 90%, on the 8px drag grid since issue 882),
       with "Largest width for … (Npx)"
     minSize above the ceiling is capped: aria-valuemin never passes aria-valuemax
     a remembered size (size 1000 with onSizeChange) is honoured, not cut to 720
     a smaller window lowers the ceiling at once; under 900px the panels stack (the stacked divider only)
     right to left: the drag toward the left edge reaches the same ceiling; the limit's number is in Arabic-Indic digits
     no script errors
   Usage: node tests/splitview-resize-873.test.js   → SPLITVIEW_RESIZE_873_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

(async () => {
  const PORT = +process.env.TEST_PORT || 9687, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const pause = (ms = 200) => new Promise((r) => setTimeout(r, ms));
    const open = async (width) => {
      await page.setViewport({ width, height: 800 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    };
    // draws a split view in a box `box` px wide (the window's width when not given); window.__sizes records onSizeChange
    const draw = (props, opts = {}) => page.evaluate(async (props, opts) => {
      const h = React.createElement, P = window.Plenix, ar = opts.dir === 'rtl';
      document.documentElement.setAttribute('dir', opts.dir || 'ltr');
      document.getElementById('main').innerHTML = '<div id="c"></div>';
      const sheet = document.getElementById('t873') || Object.assign(document.head.appendChild(document.createElement('style')), { id: 't873' });
      sheet.textContent = '#c{block-size:700px;display:grid;' + (opts.box ? 'inline-size:' + opts.box + 'px;' : '') + '}';
      window.__sizes = [];
      const label = ar ? 'العمل المسند' : 'Assigned work';
      function App() {
        const [size, setSize] = React.useState(props.size);
        const more = props.size !== undefined ? { size, onSizeChange: (s) => { window.__sizes.push(s); setSize(s); } } : {};
        const p = Object.assign({ label, firstLabel: label, first: h('div', null, 'list'), second: h('div', null, 'detail') }, props, more);
        return h(P.LocaleProvider, { locale: ar ? 'ar-EG' : 'en-US', dir: opts.dir || 'ltr' }, h(P.SplitView, p));
      }
      window.__root && window.__root.unmount();
      window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(h(App));
      await new Promise((r) => setTimeout(r, 600));
    }, props, opts);
    const SEP = '.plx-split-view .plx-resizable__edge--inline';
    // the ceiling the room gives: the panels' width less the gap and the second panel's token minimum, and the window's 90%
    const facts = () => page.evaluate((SEP) => {
      const panels = document.querySelector('.plx-split-view__panels'), second = document.querySelector('.plx-split-view__second'), first = document.querySelector('.plx-split-view__first');
      const sep = document.querySelector(SEP);
      const min = parseFloat(getComputedStyle(second).minInlineSize) || 0, gap = parseFloat(getComputedStyle(panels).columnGap) || 0;
      const share = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--plx-sys-shell-pane-window-share')) / 100;
      const room = panels.getBoundingClientRect().width - gap - min, win = Math.floor(window.innerWidth * share / 8) * 8;   // the 8px drag grid (issue 882)
      return { first: Math.round(first.getBoundingClientRect().width), second: Math.round(second.getBoundingClientRect().width), secondMin: min,
        room: Math.floor(room / 8) * 8, win, now: sep ? +sep.getAttribute('aria-valuenow') : null, min: sep ? +sep.getAttribute('aria-valuemin') : null, max: sep ? +sep.getAttribute('aria-valuemax') : null,
        stackedOnly: !sep && !!document.querySelector('.plx-split-view [role="separator"][aria-orientation="horizontal"]') };
    }, SEP);
    const words = () => page.evaluate(() => { const t = [...document.querySelectorAll('[popover]')].find((x) => x.matches(':popover-open')); return t ? t.textContent : ''; });
    const dragToEdge = async (dir) => {
      const b = await (await page.$(SEP)).boundingBox(), w = page.viewport().width;
      const x0 = b.x + b.width / 2, y = b.y + b.height / 2, x1 = dir === 'rtl' ? 1 : w - 1;
      await page.mouse.move(x0, y); await page.mouse.down();
      for (let i = 1; i <= 30; i++) { await page.mouse.move(x0 + (x1 - x0) * i / 30, y); await pause(10); }
      await pause(150); const said = await words(); await page.mouse.up(); await pause(300);
      return said;
    };

    for (const dir of ['ltr', 'rtl']) {
      const d = dir + ': ';
      // 1. AITEAM-shaped: defaultSize 540, no maxSize, at 1440
      await open(1440);
      await draw({ defaultSize: 540 }, { dir });
      let f = await facts();
      // the 8px drag grid (issue 882): a defaultSize settles on the nearest 8px line, a tie going up (540 opens at 544)
      assert.equal(f.now, 544, d + 'defaultSize opens on the nearest 8px line (540 -> 544)');
      const ceiling = Math.min(f.room, f.win);
      assert.ok(ceiling > 720, d + 'the room at 1440 is wider than the old 720px ceiling (' + ceiling + ')');
      assert.equal(f.max, ceiling, d + 'aria-valuemax is the room (the second panel keeps its minimum), never 720; got ' + f.max + ' for ' + ceiling);
      await page.focus(SEP); await page.keyboard.press('End'); await pause();
      f = await facts();
      assert.equal(f.now, ceiling, d + 'End goes to the room');
      await page.keyboard.press('Home'); await pause();
      const said = await dragToEdge(dir);
      f = await facts();
      assert.equal(f.first, ceiling, d + 'a drag to the window\'s edge reaches the room; got ' + f.first);
      assert.ok(Math.abs(f.second - f.secondMin) <= 1, d + 'the second panel keeps its token minimum (' + f.secondMin + 'px)');
      assert.ok(said.length > 0 && /[0-9٠-٩]/.test(said), d + 'the words at the limit say why; got "' + said + '"');
      if (dir === 'rtl') assert.ok(/[٠-٩]/.test(said) && !/[0-9]/.test(said), 'right to left, the limit\'s number is in Arabic-Indic digits; got "' + said + '"');

      // 2. maxSize does not cap it (deprecated): larger and smaller
      for (const maxSize of [960, 600]) {
        await draw({ defaultSize: 540, maxSize }, { dir });
        f = await facts();
        assert.equal(f.max, Math.min(f.room, f.win), d + 'maxSize ' + maxSize + ' does not cap the drag');
      }

      // 3. wider than the window: the window's share (90%)
      await draw({ defaultSize: 540 }, { dir, box: 2400 });
      f = await facts();
      assert.equal(f.max, f.win, d + 'a split view wider than the window stops at 90% of the window (' + f.win + 'px)');
      await page.focus(SEP); await page.keyboard.press('End'); await pause();
      const atShare = await words();
      assert.ok(new RegExp(String(f.win) + '|' + String(f.win).replace(/\d/g, (n) => '٠١٢٣٤٥٦٧٨٩'[n])).test(atShare), d + 'at the window\'s share the words name the width (' + f.win + 'px); got "' + atShare + '"');

      // 4. minSize above the ceiling is capped
      await draw({ defaultSize: 540, minSize: 5000 }, { dir });
      f = await facts();
      assert.ok(f.min <= f.max, d + 'minSize above the ceiling is capped: min ' + f.min + ' <= max ' + f.max);

      // 5. a remembered size past 720 is honoured
      await draw({ size: 1000 }, { dir });
      f = await facts();
      assert.equal(f.now, 1000, d + 'a remembered size of 1000px is honoured (not cut to 720)');

      // 6. a smaller window lowers the ceiling at once; under 900px the panels stack
      await page.setViewport({ width: 1100, height: 800 }); await pause(500);
      f = await facts();
      assert.equal(f.max, Math.min(f.room, f.win), d + 'a smaller window lowers the ceiling to its room');
      assert.ok(f.now <= f.max, d + 'the remembered size is held within the new ceiling');
      await page.setViewport({ width: 800, height: 800 }); await pause(500);
      f = await facts();
      assert.equal(f.stackedOnly, true, d + 'under 900px the panels stack, with the stacked divider only');
    }

    assert.deepEqual(errors, [], 'no script errors');
    console.log('SPLITVIEW_RESIZE_873_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
