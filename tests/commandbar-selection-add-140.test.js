// Plenix · tests/commandbar-selection-add-140.test.js: with rows selected CommandBar adds the selection's commands, it does not swap (issue 140, P-53; D-0068; design in docs/pds1/slices/140-commandbar-selection).
//   node tests/commandbar-selection-add-140.test.js   → COMMANDBAR_SELECTION_ADD_140_OK
// Written first (proof first): before, the selection's commands replaced the page's. In left to right and right to left:
//   no rows selected: the page's commands show, a command marked selection "only" does not;
//   rows selected (default mode "add"): the count and Clear first, then the selection's commands, a divider, then the page's commands (a command marked "never" is hidden, "only" is in the selection's group);
//   the divider shows only when both groups have a command; mode "swap" is today's bar (the page's commands give way);
//   when the bar narrows, the page's commands fold into More before any of the selection's.
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9881, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 500 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (props, width) => page.evaluate(async (dir, props, width) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', 'en');
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement; const f = () => {};
        const page = [{ id: 'export', label: 'Export', icon: 'download', onSelect: f }, { id: 'share', label: 'Share', icon: 'share', onSelect: f, selection: props.shareSel }, { id: 'archive', label: 'Archive', icon: 'archive', onSelect: f, selection: 'only' }, { id: 'import', label: 'Import', icon: 'upload', onSelect: f }];
        const sel = props.count === undefined ? undefined : { count: props.count, noun: 'asset', onClear: f, mode: props.mode, actions: props.noSelActions ? [] : [{ id: 'assign', label: 'Assign', icon: 'person', onSelect: f }, { id: 'tag', label: 'Tag', icon: 'tag', onSelect: f }] };
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { inlineSize: width + 'px' } }, h(Plenix.CommandBar, { label: 'Assets', actions: props.noPage ? [] : props.noOnly ? page.filter((a) => a.selection !== 'only') : page, selection: sel, find: h(Plenix.SearchField, { label: 'Search' }) })));
        await new Promise((r) => setTimeout(r, 900));
      }, dir, props, width);
      // the bar's controls left to right as drawn: names, and divider marks
      const order = () => page.evaluate(() => {
        const bar = document.querySelector('.plx-command-bar__row'); const out = [];
        const kids = [...bar.querySelectorAll('button, .plx-bar-actions__divider, [role=separator], hr, input')].filter((e) => e.offsetParent !== null && !e.closest('[role=menu]'));
        kids.sort((a, b) => (getComputedStyle(bar).direction === 'rtl' ? b.getBoundingClientRect().left - a.getBoundingClientRect().left : a.getBoundingClientRect().left - b.getBoundingClientRect().left));
        for (const e of kids) out.push(e.matches('button') ? (e.getAttribute('aria-label') || e.textContent).trim().replace(/\s+/g, ' ') : e.tagName === 'INPUT' ? 'search' : '|');
        return out;
      });
      const names = async () => (await order()).filter((x) => x !== '|');
      const more = () => page.evaluate(async () => { const b = document.querySelector('.plx-command-bar__row button[aria-label="More actions"]'); if (!b) return []; b.click(); await new Promise((r) => setTimeout(r, 300)); const items = [...document.querySelectorAll('[role=menu] [role=menuitem]')].map((e) => e.textContent.trim()); b.click(); await new Promise((r) => setTimeout(r, 200)); return items; });

      await mount({ shareSel: undefined }, 1000);
      let o = await names();
      assert.ok(o.includes('Export') && o.includes('Share') && o.includes('Import'), T + 'no selection: the page commands show: ' + o);
      assert.ok(!o.includes('Archive'), T + 'no selection: a command marked "only" is hidden');

      await mount({ count: 3, shareSel: 'never' }, 1000);
      o = await order();
      const idx = (n) => o.findIndex((x) => x === n || x.startsWith(n));
      assert.ok(idx('3 selected') >= 0 || o.some((x) => /selected|3/.test(x)), T + 'the count and Clear show: ' + o);
      const clear = o.findIndex((x) => /selected|clear/i.test(x));
      assert.ok(clear >= 0 && clear < idx('Assign'), T + 'the count and Clear come first: ' + o);
      assert.ok(idx('Assign') < idx('Tag') && idx('Tag') < idx('Archive'), T + 'the selection group: its commands, then those marked "only": ' + o);
      assert.ok(idx('Archive') < o.indexOf('|', idx('Archive')) && o.indexOf('|', idx('Archive')) < idx('Export'), T + 'a divider between the selection group and the page group: ' + o);
      assert.ok(idx('Export') >= 0 && idx('Import') > idx('Export'), T + 'the page commands still show (add, not swap): ' + o);
      assert.equal(idx('Share'), -1, T + 'a command marked "never" is hidden while rows are selected: ' + o);

      await mount({ count: 3, noSelActions: true, noOnly: true }, 1000); o = await order();
      const first = o.findIndex((x) => /Export/.test(x)), clearAt = o.findIndex((x) => /selected|clear/i.test(x));
      assert.ok(clearAt >= 0 && first > clearAt, T + 'a selection with no commands: the count and Clear, then the page commands: ' + o);
      assert.ok(!o.slice(clearAt, first).includes('|') || o.slice(clearAt, first).filter((x) => x === '|').length === 0, T + 'no divider without a selection group: ' + o);

      await mount({ count: 3, noPage: true }, 1000); o = await order();
      const lastCmd = o.findIndex((x) => /Tag/.test(x));
      assert.ok(lastCmd >= 0 && !o.slice(lastCmd + 1).some((x) => /Export|Share/.test(x)), T + 'no page commands: the selection group alone, no divider after it');

      await mount({ count: 3, mode: 'swap' }, 1000); o = await names();
      assert.ok(o.includes('Assign') && !o.includes('Export') && !o.includes('Import'), T + 'mode "swap" is today: the page commands give way: ' + o);

      // narrow: the page's commands fold into More before any of the selection's
      let sawPageFold = false;
      for (let w = 760; w >= 360; w -= 40) {
        await mount({ count: 3 }, w);
        const shown = await names(), inMore = await more();
        const selShown = ['Assign', 'Tag', 'Archive'].filter((n) => shown.some((x) => x.startsWith(n))), pageShown = ['Export', 'Import', 'Share'].filter((n) => shown.some((x) => x.startsWith(n)));
        const selFolded = ['Assign', 'Tag', 'Archive'].filter((n) => inMore.some((x) => x.startsWith(n)));
        if (selShown.length === 3 && inMore.some((x) => /Export|Import|Share/.test(x))) sawPageFold = true;
        if (selFolded.length) assert.equal(pageShown.length, 0, T + 'width ' + w + ': a selection command is in More while a page command is still in the bar: ' + JSON.stringify({ shown, inMore }));
      }
      assert.ok(sawPageFold, T + 'at some width the page commands are in More while all the selection commands stay in the bar');
    }
    console.log('COMMANDBAR_SELECTION_ADD_140_OK');

  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
