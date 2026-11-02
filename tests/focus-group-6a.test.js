/* Plenix tests · roving focus groups, part 1 (issue 262, PR 6a): ToolRail on the shared focus group (useFocusGroup).
   Summary: the rail is one Tab stop whose tools are reached with the arrow keys, alone and as SecondaryPane's collapsed
     rail, in left to right and right to left:
       Tab enters on the first tool; Arrow Down and Up move (looping, skipping a disabled tool); End and Home reach the
       last and first; Arrow Left and Right do nothing; a held Alt still moves (as the rail always did); Tab leaves and
       Shift+Tab comes back to the tool focused last; exactly one tool is in the Tab order
   Proof first: the behavior was measured identical before and after the move (the rail's own key handler, then
     useFocusGroup), so these lines pass on both. What fails on a slide back is check-system's hook-adoption rule
     (ToolRail.tsx is listed under useFocusGroup).
   Usage: node tests/focus-group-6a.test.js   → FOCUS_GROUP_6A_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9658, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1000, height: 700 });
    const mount = async (dir, where) => {
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate(async (dir, where) => {
        document.documentElement.setAttribute('dir', dir);
        const h = React.createElement, P = window.Plenix;
        document.getElementById('main').innerHTML = '<div id="c"></div>';
        const tools = [h(P.ToolRail.Item, { key: 1, icon: 'add', label: 'One' }), h(P.ToolRail.Item, { key: 2, icon: 'add', label: 'Two', disabled: true }), h(P.ToolRail.Divider, { key: 'd' }),
          h(P.ToolRail.Item, { key: 3, icon: 'add', label: 'Three' }), h(P.ToolRail.Item, { key: 4, icon: 'add', label: 'Four' })];
        const rail = where === 'pane'
          ? h(P.SecondaryPane, { title: 'Files', collapsible: true, defaultCollapsed: true, rail: h(React.Fragment, null, tools) }, 'body')
          : h(P.ToolRail, { label: 'Tools' }, tools);
        ReactDOM.createRoot(document.getElementById('c')).render(h('div', null, h('button', { id: 'before' }, 'before'), h('div', { id: 'rail' }, rail), h('button', { id: 'after' }, 'after')));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, where);
    };
    const name = () => page.evaluate(() => { const a = document.activeElement; return a ? (a.id || a.getAttribute('aria-label') || a.textContent.trim()) : null; });
    const press = async (key, mod) => { if (mod) await page.keyboard.down(mod); await page.keyboard.press(key); if (mod) await page.keyboard.up(mod); await sleep(60); return name(); };
    for (const where of ['rail', 'pane']) {
      for (const dir of ['ltr', 'rtl']) {
        const at = where + ' ' + dir + ': ';
        await mount(dir, where);
        // the pane's rail starts with its own Expand button: Tab enters the rail there, then Arrow Down reaches the tools
        const first = where === 'pane' ? await page.evaluate(() => document.querySelector('#rail .plx-tool-rail__item').getAttribute('aria-label')) : 'One';
        await page.focus('#before');
        assert.equal(await press('Tab'), first, at + 'Tab enters the rail on its first tool');
        if (where === 'pane') assert.equal(await press('ArrowDown'), 'One', at + 'Arrow Down moves from Expand to the first tool');
        assert.equal(await press('ArrowDown'), 'Three', at + 'Arrow Down skips the disabled tool');
        assert.equal(await press('ArrowDown'), 'Four', at + 'Arrow Down moves to the next tool');
        assert.equal(await press('ArrowDown'), first, at + 'Arrow Down loops from the last tool to the first');
        assert.equal(await press('ArrowUp'), 'Four', at + 'Arrow Up loops from the first tool to the last');
        assert.equal(await press('Home'), first, at + 'Home reaches the first tool');
        assert.equal(await press('End'), 'Four', at + 'End reaches the last tool');
        assert.equal(await press('ArrowLeft'), 'Four', at + 'Arrow Left does nothing in a vertical rail');
        assert.equal(await press('ArrowRight'), 'Four', at + 'Arrow Right does nothing in a vertical rail');
        assert.equal(await press('ArrowUp', 'Alt'), 'Three', at + 'a held Alt still moves, as the rail always did');
        assert.equal(await page.evaluate(() => [...document.querySelectorAll('#rail .plx-tool-rail__item:not([disabled])')].filter((b) => b.tabIndex === 0).length), 1, at + 'exactly one tool is in the Tab order');
        assert.equal(await press('Tab'), 'after', at + 'Tab leaves the rail in one step');
        assert.equal(await press('Tab', 'Shift'), 'Three', at + 'Shift+Tab comes back to the tool focused last');
      }
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('FOCUS_GROUP_6A_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
