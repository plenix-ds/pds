/* Plenix tests · the top line of a hovered or selected row equals its bottom line, in DataGrid and Table (#559)
   Summary: a row clips what lies outside it (overflow: clip), so the old top line (a pseudo-element above the row) never
     showed. The fix: a hovered or selected row casts its top line above itself with an outer shadow; the first row, which
     has nothing above it, carries the --first class (DataGridEngine) and draws the line on its ::after inside its top edge.
     This test checks, by computed style, that
       - a hovered row and a selected row (not the first) cast a shadow 0 -w 0 0 in color c, where w and c are the
         resolved --plx-comp-data-grid-line-width and --plx-comp-data-grid-context-row-line on that row, and that w and c
         are also the row's own bottom border (the top line equals the bottom line in width and token color);
       - the first row, and only it, carries <block>__grid-row--first; hovered or selected, it casts no shadow and its ::after
         is the line inside its top edge (top 0, height w, bottom border w in c).
     Without the fix the shadow is "none" and no row carries --first, so every check fails.
   Table: a Table has no selection and no row hover (its rows are static), so the states are forced: the test adds
     plx-data-grid__grid-selected to one row and plx-data-grid__grid-selectable to another and hovers it, then checks the same
     computed styles. It also reads the two rules from the loaded stylesheets and checks that Table's are DataGrid's with
     the block name swapped, so the two stay the same rule.
   Usage: node tests/row-line-559.test.js   (started by tests/data-grid.test.js when the DataGrid or the Table changed).
   Parts (tests/check.js): DataGrid, Table. */
const { serve, launch } = require('./lib');
const shared = require('./check.js');   // the shared check helper: parts (TEST_ONLY) and the results file (TEST_RESULTS)
const PORT = +process.env.TEST_PORT || 9559;
const res = [];
const check = (n, ok, d) => { if (shared.check(n, ok, d)) res.push([n, !!ok, d]); };

// measured in the page: the row's top line (shadow or ::after), its bottom border and the two tokens resolved on the row
const MEASURE = (sel) => {
  const row = document.querySelector(sel);
  if (!row) return null;
  const cs = getComputedStyle(row), after = getComputedStyle(row, '::after');
  // the tokens as the row resolves them: a probe inside the row takes the line color and the line width
  const probe = document.createElement('i');
  probe.style.setProperty('display', 'block');
  probe.style.setProperty('position', 'absolute');
  probe.style.setProperty('color', 'var(--plx-comp-data-grid-context-row-line)');
  probe.style.setProperty('inline-size', 'var(--plx-comp-data-grid-line-width)');
  row.appendChild(probe);
  const token = { color: getComputedStyle(probe).color, width: parseFloat(getComputedStyle(probe).width) };
  probe.remove();
  const shadow = cs.boxShadow;
  const color = (/rgba?\([^)]*\)/.exec(shadow) || [''])[0];
  const nums = shadow.replace(/rgba?\([^)]*\)/, '').trim().split(/\s+/).filter(Boolean).map(parseFloat);
  // the grid or table this row belongs to (by role: the row's own class names hold the block name too)
  const root = row.closest('[role="grid"], [role="table"], [role="treegrid"]') || row.parentElement;
  const rows = [...root.querySelectorAll('[role="row"][data-plx-record]')];
  return {
    cls: row.className, first: /__grid-row--first\b/.test(row.className), isFirstRow: rows[0] === row,
    firstCount: root.querySelectorAll('[class*="__grid-row--first"]').length,
    token, shadow, shadowColor: color, shadowNums: nums,
    bottom: { color: cs.borderBottomColor, width: parseFloat(cs.borderBottomWidth), style: cs.borderBottomStyle },
    after: { content: after.content, top: after.top, height: parseFloat(after.height), position: after.position,
      color: after.borderBottomColor, width: parseFloat(after.borderBottomWidth), style: after.borderBottomStyle },
  };
};

// a row that is not the first: the outer shadow above it equals its bottom line
function notFirst(part, what, m) {
  const n = part + ': ' + what;
  if (!m) { check(n + ' is drawn', false, 'row not found'); return; }
  check(n + ' does not carry --first', !m.first, m.cls);
  check(n + ' casts its top line as an outer shadow 0 -w 0 0', m.shadowNums.length === 4 && m.shadowNums[0] === 0 && m.shadowNums[2] === 0 && m.shadowNums[3] === 0 && m.shadowNums[1] < 0, m.shadow);
  check(n + ' top line width equals the line-width token', Math.abs(-m.shadowNums[1] - m.token.width) < 0.01, { shadow: m.shadow, token: m.token });
  check(n + ' top line color equals the row-line token', m.shadowColor === m.token.color, { shadow: m.shadow, token: m.token });
  check(n + ' bottom line uses the same tokens', m.bottom.style === 'solid' && Math.abs(m.bottom.width - m.token.width) < 0.01 && m.bottom.color === m.token.color, { bottom: m.bottom, token: m.token });
  check(n + ' top line equals the bottom line', Math.abs(-m.shadowNums[1] - m.bottom.width) < 0.01 && m.shadowColor === m.bottom.color, { shadow: m.shadow, bottom: m.bottom });
}

// the first row: --first, no shadow, the line on ::after inside its top edge
function first(part, what, m) {
  const n = part + ': ' + what;
  if (!m) { check(n + ' is drawn', false, 'row not found'); return; }
  check(n + ' carries --first, and only the first row does', m.first && m.isFirstRow && m.firstCount === 1, { cls: m.cls, isFirstRow: m.isFirstRow, firstCount: m.firstCount });
  check(n + ' casts no shadow above itself', m.shadow === 'none', m.shadow);
  check(n + ' draws the line inside its top edge', m.after.content !== 'none' && m.after.position === 'absolute' && m.after.top === '0px' && Math.abs(m.after.height - m.token.width) < 0.01, m.after);
  check(n + ' line equals the bottom line in width and token color', m.after.style === 'solid' && Math.abs(m.after.width - m.token.width) < 0.01 && m.after.color === m.token.color
    && Math.abs(m.bottom.width - m.token.width) < 0.01 && m.bottom.color === m.token.color, { after: m.after, bottom: m.bottom, token: m.token });
}

(async () => {
  const server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1100, height: 1000 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    await page.evaluate(async () => {
      document.querySelector('main').innerHTML = '<div id="g1"></div><div id="g2"></div><div id="t"></div>';
      const h = React.createElement, P = window.Plenix;
      const data = ['r1', 'r2', 'r3', 'r4', 'r5'].map((id, i) => ({ id, name: 'Record ' + (i + 1), city: 'City ' + (i + 1) }));
      const columns = [{ title: 'Name', field: 'name' }, { title: 'City', field: 'city' }];
      const grid = (selected) => h(P.DataGrid, { label: 'Rows', data, columns, index: 'id', selectable: true, selected, onSelectionChange: () => {}, narrow: 'table', height: '--plx-ref-size-320px' });
      // g1: the third row selected; g2: the first row selected
      ReactDOM.createRoot(document.getElementById('g1')).render(grid(['r3']));
      ReactDOM.createRoot(document.getElementById('g2')).render(grid(['r1']));
      ReactDOM.createRoot(document.getElementById('t')).render(h(P.Table, { label: 'Rows', data, columns, index: 'id' }));
      await new Promise((r) => setTimeout(r, 900));
    });
    // a row's data-plx-record is its typed record key (DataGrid state.js recordKey: "string:r5", since 0.49), in the DataGrid and the Table alike
    const row = (box, id) => '#' + box + ' [role="row"][data-plx-record="string:' + id + '"]';
    const away = () => page.mouse.move(1, 1);
    const settle = () => new Promise((r) => setTimeout(r, 150));

    // ---- DataGrid
    await away(); await settle();
    notFirst('DataGrid', 'a selected row', await page.evaluate(MEASURE, row('g1', 'r3')));
    first('DataGrid', 'the selected first row', await page.evaluate(MEASURE, row('g2', 'r1')));
    await page.hover(row('g1', 'r5')); await settle();
    notFirst('DataGrid', 'a hovered row', await page.evaluate(MEASURE, row('g1', 'r5')));
    await page.hover(row('g1', 'r1')); await settle();
    first('DataGrid', 'the hovered first row', await page.evaluate(MEASURE, row('g1', 'r1')));
    await away(); await settle();
    check('DataGrid: a row that is neither hovered nor selected has no top line', await page.evaluate((s) => getComputedStyle(document.querySelector(s)).boxShadow === 'none', row('g1', 'r2')), 'r2');

    // ---- Table (no selection, no row hover: the states are forced with the classes the rule keys on)
    const tableFirst = await page.evaluate((s) => { const r = document.querySelector(s); return !!r && /plx-data-grid__grid-row--first\b/.test(r.className); }, row('t', 'r1'));
    check('Table: the first row carries plx-data-grid__grid-row--first', tableFirst, 'r1');
    await page.evaluate((a, b, c) => {
      document.querySelector(a).classList.add('plx-data-grid__grid-selected');
      document.querySelector(b).classList.add('plx-data-grid__grid-selectable');
      document.querySelector(c).classList.add('plx-data-grid__grid-selected');
    }, row('t', 'r3'), row('t', 'r5'), row('t', 'r1'));
    await settle();
    notFirst('Table', 'a selected row (class forced)', await page.evaluate(MEASURE, row('t', 'r3')));
    first('Table', 'the selected first row (class forced)', await page.evaluate(MEASURE, row('t', 'r1')));
    await page.hover(row('t', 'r5')); await settle();
    notFirst('Table', 'a hovered row (selectable class forced)', await page.evaluate(MEASURE, row('t', 'r5')));
    await away(); await settle();

    // the stylesheet: DataGrid's two row-line rules, which apply to a static Table too: since issue 882 (one shared copy of the
    // table and grid styles) a Table's rows carry DataGrid's classes and there is no Table copy of the rules
    const rules = await page.evaluate(() => {
      const out = [];
      const walk = (list) => { for (const r of list) {
        if (r.styleSheet) { try { walk(r.styleSheet.cssRules); } catch (e) { /* not readable */ } }
        if (r.cssRules && !r.selectorText) { try { walk(r.cssRules); } catch (e) { /* not readable */ } }
        if (r.selectorText && /__grid-row(--first)?:is\(/.test(r.selectorText) && /__grid-selected/.test(r.selectorText) && (/box-shadow/.test(r.style.cssText) || /::after/.test(r.selectorText))) out.push({ sel: r.selectorText, css: r.style.cssText });
      } };
      for (const s of document.styleSheets) { try { walk(s.cssRules); } catch (e) { /* not readable */ } }
      return out;
    });
    const of = (block) => rules.filter((r) => r.sel.startsWith('.plx-' + block + '__')).map((r) => ({ sel: r.sel.split('plx-' + block + '__').join('B__'), css: r.css })).sort((a, b) => (a.sel < b.sel ? -1 : 1));
    const grid = of('data-grid'), table = of('table');
    check('DataGrid: the shadow rule and the first-row rule are in the stylesheet', grid.some((r) => /box-shadow/.test(r.css) && /:not\(\.B__grid-row--first\)/.test(r.sel)) && grid.some((r) => /::after/.test(r.sel) && /B__grid-row--first/.test(r.sel)), rules);
    check('Table: no copy of the row-line rules of its own (the grid\'s apply)', table.length === 0, table);
    const tableRow = await page.evaluate((s) => { const r = document.querySelector(s); return r ? r.className : null; }, row('t', 'r2'));
    check('Table: its rows carry DataGrid\'s row class, so DataGrid\'s row-line rules draw them', !!tableRow && /\bplx-data-grid__grid-row\b/.test(tableRow) && !/plx-table__/.test(tableRow), tableRow);

    check('DataGrid: no script errors', errors.length === 0, errors);
  } finally { if (browser) await browser.close(); server.close(); }
  const failed = res.filter((r) => !r[1]);
  for (const [n, ok, d] of res) console.log((ok ? '  ok   ' : '  FAIL ') + n + (ok ? '' : ' ' + JSON.stringify(d)));
  if (failed.length) { console.log('ROW_LINE_559_FAIL ' + failed.length + '/' + res.length); process.exit(1); }
  console.log('ROW_LINE_559_OK ' + res.length + ' checks: the top line of a hovered or selected row equals its bottom line (DataGrid and Table)');
})().catch((e) => { console.error(e); process.exit(1); });
