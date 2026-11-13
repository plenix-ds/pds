// Plenix tests · keyboard behavior, with real key presses on the components of the St. John the Beloved test site
// (test-site/; owner, 2026-10-25: the tests run on the site, not on the design spec):
// a Toolbar is one Tab stop and its arrows follow reading order; Rating moves focus with the value; Tabs and
// SegmentedControl arrows follow reading order (right to left reverses them); the Tree opens toward the reading end; a
// collapsible settings section opens and closes with Enter and Space; the recent searches of a SearchField are a grid
// popup (WAI-ARIA combobox with grid popup): Arrow Down moves between rows, Arrow Right into the remove cell, Enter there
// removes the search, Delete removes the active one, Enter on a term searches it (the focus stays in the field). The command
// bar (owner, 2026-10-14) is one Tab stop per bar; Enter on Filter opens its panel with the focus inside and Escape returns it;
// a panel row moves with Alt + Arrow Down and the move is announced; the selection bar is one Tab stop and skips its
// disabled commands.
//   node tests/keyboard.test.js            (TEST_PORT: another port)
//   TEST_SCOPE=full: every component; by default (tests/changed.js) those whose component or site page changed
const shared = require('./check.js');   // the shared check helper: parts (TEST_ONLY) and the results file (TEST_RESULTS)
const { serve, launch, sleep, ready, at } = require('./lib.js');
const changed = require('./changed.js');
const site = require('./site.js');
const PORT = +process.env.TEST_PORT || 8797, BASE = 'http://127.0.0.1:' + PORT + '/Plenix/';
// each component checked: the site page that draws it and its Platform unit
const PARTS = { toolbar: ['readings', 'components/Toolbar'], rating: ['event', 'components/Rating'], tabs: ['member', 'components/Tabs'], settings: ['settings', 'patterns/SettingsLayout'], recent: ['search', 'components/SearchField'],
  cmdbar: ['members', 'patterns/CommandBar'], panels: ['members', 'patterns/FilterPanel'], bulk: ['directory', 'patterns/BulkActions'] };
// the command bar's action forms are a module of their own (command-actions.test.js): its change turns them on (#382 F1)
const want = (k) => changed.wants({ units: [PARTS[k][1]] }) || changed.pages([site.url(PARTS[k][0])]).length > 0 || (k === 'cmdbar' && changed.child('command-actions'));
const route = (k) => site.url(PARTS[k][0]);
const WANTED = Object.keys(PARTS).filter(want);
if (!WANTED.length) changed.none('KEYBOARD_OK 0/0');
changed.report(WANTED.join(', '));

(async () => {
  const server = await serve(PORT);
  const browser = await launch();
  const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 1000 });
  const results = [];
  const check = (name, ok, detail) => { if (shared.check(name, ok, detail)) results.push([name, ok, detail]); };
  // each part's page: loaded and drawn (lib.ready), not a fixed wait (#382 F8)
  const open = async (url) => { await page.goto(BASE + url, { waitUntil: 'networkidle0' }); await ready(page); };
  const focusFirst = (sel) => page.evaluate((s) => { const el = document.querySelector(s); if (el) el.focus(); return !!el; }, sel);
  const active = () => page.evaluate(() => { const a = document.activeElement; return a ? (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 40) : ''; });
  const setDir = (sel, dir) => page.evaluate((s, d) => { const el = document.querySelector(s); if (el) el.closest('.ds-live, .ds-example, section, main').setAttribute('dir', d); }, sel, dir);

  // Toolbar: one Tab stop
  if (want('toolbar')) {
  at('toolbar'); await open(route('toolbar'));
  const tb = await page.evaluate(() => { const t = document.querySelector('main [role="toolbar"]'); if (!t) return null; const items = [...t.querySelectorAll('button,input,select,a[href]')].filter((e) => e.offsetParent); return { n: items.length, tabbable: items.filter((e) => e.tabIndex === 0).length }; });
  check('Toolbar: exactly one control in the Tab order', tb && tb.n > 1 && tb.tabbable === 1, JSON.stringify(tb));
  if (tb) {
    await page.evaluate(() => { const t = document.querySelector('main [role="toolbar"]'); const el = [...t.querySelectorAll('button,input,select,a[href]')].filter((e) => e.offsetParent && e.tabIndex === 0)[0]; el.focus(); });
    const a0 = await active(); await page.keyboard.press('ArrowRight'); const a1 = await active();
    check('Toolbar: Arrow Right moves to the next control', a0 !== a1, a0 + ' -> ' + a1);
    await page.keyboard.press('ArrowLeft'); const a2 = await active();
    check('Toolbar: Arrow Left moves back', a2 === a0, a2);
    await setDir('main [role="toolbar"]', 'rtl'); await sleep(100);
    await page.keyboard.press('ArrowLeft'); const a3 = await active();
    check('Toolbar (right to left): Arrow Left moves forward', a3 === a1, a3);
  }
  }

  // Rating: focus follows the value
  if (want('rating')) {
  at('rating'); await open(route('rating'));
  const has = await page.evaluate(() => { const el = [...document.querySelectorAll('main [role="radiogroup"] [role="radio"]')].filter((e) => e.tabIndex === 0)[0]; if (el) el.focus(); return !!el; });
  if (has) {
    const r0 = await active(); await page.keyboard.press('ArrowRight'); await sleep(150); const r1 = await active();
    const checked = await page.evaluate(() => { const a = document.activeElement; return a && a.getAttribute('aria-checked'); });
    check('Rating: Arrow Right moves focus to the newly chosen star', r0 !== r1 && checked === 'true', r0 + ' -> ' + r1 + ' checked=' + checked);
  } else check('Rating: an interactive rating is shown', false, 'none found');
  }

  // Tabs: arrows in reading order
  if (want('tabs')) {
  at('tabs'); await open(route('tabs'));
  if (await focusFirst('main [role="tablist"] [role="tab"][aria-selected="true"]')) {
    const t0 = await active(); await page.keyboard.press('ArrowRight'); await sleep(100); const t1 = await active();
    check('Tabs: Arrow Right moves to the next tab', t0 !== t1, t0 + ' -> ' + t1);
    await setDir('main [role="tablist"]', 'rtl'); await sleep(100);
    await page.keyboard.press('ArrowLeft'); await sleep(100); const t2 = await active();
    check('Tabs (right to left): Arrow Left moves to the next tab', t2 !== t1 && t2 !== t0, t1 + ' -> ' + t2);
  } else check('Tabs: a tab list is shown', false, 'none found');
  }

  // a collapsible settings section (SettingsSection collapsible, 2026-10-13): its header is one button; Enter and Space
  // open and close it, aria-expanded follows and the rows are hidden with it
  if (want('settings')) {
  at('settings section'); await open(route('settings'));
  const sec = await page.evaluate(() => { const b = document.querySelector('main .plx-settings__section-toggle'); if (!b) return null; b.focus(); return { expanded: b.getAttribute('aria-expanded'), body: !!document.getElementById(b.getAttribute('aria-controls')) }; });
  if (sec) {
    const state = () => page.evaluate(() => { const b = document.activeElement; const body = document.getElementById(b.getAttribute('aria-controls')); return { cls: b.className, expanded: b.getAttribute('aria-expanded'), hidden: body ? body.hidden : null }; });
    const s0 = await state(); await page.keyboard.press('Enter'); const s1 = await state();
    check('Settings section: Enter closes an open section (aria-expanded false, rows hidden)', s0.expanded === 'true' && s1.expanded === 'false' && s1.hidden === true, JSON.stringify([s0, s1]));
    await page.keyboard.press('Space'); const s2 = await state();
    check('Settings section: Space opens it again', s2.expanded === 'true' && s2.hidden === false, JSON.stringify(s2));
    check('Settings section: the header button names its rows (aria-controls)', sec.body, JSON.stringify(sec));
  } else check('Settings section: a collapsible section is shown', false, 'none found');
  }

  // recent searches (owner, 2026-10-14): the combobox with grid popup; each row has a term cell and a remove cell
  if (want('recent')) {
  at('recent searches'); await open(route('recent'));
  const field = 'main .plx-search input[aria-haspopup="grid"]';
  // (the field is marked once: after a search its popup is no longer a grid, and the selector would find another field)
  const st = () => page.evaluate(() => {
    const i = document.querySelector('[data-kb-recent]'); if (!i) return null;
    const grid = document.getElementById(i.getAttribute('aria-controls')), act = i.getAttribute('aria-activedescendant'), cell = act ? document.getElementById(act) : null;
    return { focus: document.activeElement === i, expanded: i.getAttribute('aria-expanded'), role: grid && grid.getAttribute('role'), rows: grid ? grid.querySelectorAll('[role="row"]').length : 0,
      cell: cell ? (cell.querySelector('button') ? 'remove:' + cell.querySelector('button').getAttribute('aria-label') : 'term:' + cell.textContent.trim()) : null, value: i.value };
  });
  const has = await page.evaluate((sel) => { const i = document.querySelector(sel); if (!i) return false; i.setAttribute('data-kb-recent', ''); i.focus(); return true; }, field);
  // the field may open on focus; the history demo starts with three searches
  if (has) {
    await sleep(200);
    const s0 = await st();
    check('Recent searches: the field opens a grid popup of rows (aria-haspopup grid, role grid)', s0 && s0.expanded === 'true' && s0.role === 'grid' && s0.rows >= 2, JSON.stringify(s0));
    await page.keyboard.press('ArrowDown'); await sleep(100); const s1 = await st();
    await page.keyboard.press('ArrowDown'); await sleep(100); const s2 = await st();
    check('Recent searches: Arrow Down moves from row to row on the term cell', s1.cell && /^term:/.test(s1.cell) && s2.cell && /^term:/.test(s2.cell) && s1.cell !== s2.cell && s2.focus, JSON.stringify([s1, s2]));
    await page.keyboard.press('ArrowRight'); await sleep(100); const s3 = await st();
    check('Recent searches: Arrow Right moves into the row\'s remove cell ("Remove <term>")', s3.cell === 'remove:Remove ' + s2.cell.slice(5) && s3.focus, JSON.stringify(s3));
    await page.keyboard.press('ArrowLeft'); await sleep(100); const s4 = await st();
    check('Recent searches: Arrow Left moves back to the term', s4.cell === s2.cell, JSON.stringify(s4));
    await page.keyboard.press('ArrowRight'); await sleep(100); await page.keyboard.press('Enter'); await sleep(250); const s5 = await st();
    check('Recent searches: Enter on the remove cell removes that search; the focus stays in the field', s5.rows === s0.rows - 1 && s5.focus && s5.expanded === 'true', JSON.stringify(s5));
    await page.keyboard.press('ArrowLeft'); await page.keyboard.press('Delete'); await sleep(250); const s6 = await st();
    check('Recent searches: Delete removes the active search', s6.rows === s5.rows - 1 && s6.focus, JSON.stringify(s6));
    if (s6.rows) {
      await page.keyboard.press('ArrowLeft'); const term = (await st()).cell;
      await page.keyboard.press('Enter'); await sleep(400);
      // the search runs: on the site the results screen draws its field again (the marked field may be gone)
      const s7 = (await st()) || (await page.evaluate(() => ({ value: [...document.querySelectorAll('main .plx-search input')].map((i) => i.value).find((v) => v) || '' })));
      check('Recent searches: Enter on a term searches it (its text in the field)', term && /^term:/.test(term) && s7.value === term.slice(5), JSON.stringify([term, s7]));
    }
  } else check('Recent searches: a field with removable recent searches is shown', false, 'none found');
  }

  // the command bar: one Tab stop per bar; the arrows move; Enter on Filter opens its panel (focus inside), Escape returns
  if (want('cmdbar')) {
  at('command bar'); await open(route('cmdbar'));
  // the page's live examples build their tables after the route changes: wait until every one is built (the bars measure
  // themselves again as the page settles)
  await page.waitForFunction(() => { const t = document.querySelectorAll('main .plx-data-grid'); return t.length > 0 && document.querySelectorAll('main .plx-data-grid .plx-data-grid__grid-tableholder').length >= t.length; }, { timeout: 15000 }).catch(() => {});
  await sleep(500);
  const row = 'main .plx-command-bar__row';
  const tb = await page.evaluate((sel) => { const t = document.querySelector(sel); if (!t) return null; const items = [...t.querySelectorAll('button,input')].filter((e) => e.offsetParent && !e.disabled); return { n: items.length, tabbable: items.filter((e) => e.tabIndex === 0).length }; }, row);
  check('Command bar: the bar is one Tab stop', tb && tb.n > 3 && tb.tabbable === 1, JSON.stringify(tb));
  const filt = await page.evaluate((sel) => { const b = [...document.querySelector(sel).querySelectorAll('button')].find((x) => /^Filter/.test(x.getAttribute('aria-label') || x.textContent.trim())); if (!b) return false; b.focus(); return true; }, row);
  if (filt) {
    const a0 = await active(); await page.keyboard.press('ArrowRight'); const a1 = await active();
    check('Command bar: Arrow Right moves to the next control', a0 !== a1, a0 + ' -> ' + a1);
    await page.keyboard.press('ArrowLeft'); await page.keyboard.press('Enter'); await sleep(400);
    const inside = await page.evaluate(() => { const a = document.activeElement; return !!(a && a.closest('.plx-popover')); });
    check('Command bar: Enter on Filter opens its panel with the focus inside it', inside, await active());
    await page.keyboard.press('Escape'); await sleep(300);
    const back = await active();
    check('Command bar: Escape closes the panel and the focus returns to Filter', /^Filter/.test(back), back);
  } else check('Command bar: a Filter button is shown', false, 'none found');
  // the swap (owner, 2026-10-15): with rows selected the bar holds the selection's commands, keeps its height, and Escape
  // in the bar brings the normal bar back
  // on the site nothing starts selected: check two members' rows first
  await page.evaluate(() => { [...document.querySelectorAll('main .plx-data-grid [role="row"] input[type="checkbox"]')].filter((c) => !c.closest('[role="columnheader"]') && !c.closest('.plx-data-grid__grid-group')).slice(0, 2).forEach((c) => c.click()); });
  await sleep(400);
  const sw = await page.evaluate(() => { const b = document.querySelector('main .plx-command-bar--selecting'); if (!b) return null; b.setAttribute('data-kb-swap', ''); const h = Math.round(b.getBoundingClientRect().height);
    const first = b.querySelector('.plx-command-bar__row button:not([disabled])'); if (first) first.focus(); return { h, clear: !!b.querySelector('.plx-command-bar__clear'), search: !!b.querySelector('.plx-search') }; });
  if (sw) {
    check('Command bar: rows selected swap the page\'s actions for the selection\'s commands and end with "× N selected"; the search stays (owner, #454)', sw.clear && sw.search, JSON.stringify(sw));
    await page.keyboard.press('Escape'); await sleep(300);
    const after = await page.evaluate(() => { const b = document.querySelector('[data-kb-swap]'); return b ? { selecting: b.classList.contains('plx-command-bar--selecting'), h: Math.round(b.getBoundingClientRect().height), search: !!b.querySelector('.plx-search') } : null; });
    check('Command bar: Escape clears the selection, the normal bar returns at the same height', after && !after.selecting && after.search && after.h === sw.h, JSON.stringify([sw, after]));
  } else check('Command bar: an example with rows selected is shown', false, 'none found');
  }

  // Task #107: action forms use real keys, including Escape without clearing the selection.
  if (want('cmdbar')) {
    at('command action forms'); await open(route('cmdbar'));
    const contextual = require('./command-actions.test.js');
    // the module throws on its first failed assertion: that is the named check's failure, and the parts after it still run (#1327)
    const count = async (run) => { try { return { n: await run() }; } catch (e) { return { error: String(e && e.message || e) }; } };
    const behavior = await count(() => contextual(page));
    check('Command actions: pending, help, contextual sticking and folded forms', behavior.n >= 18, behavior.error || String(behavior.n));
    const formKeys = await count(() => contextual.keyboard(page));
    check('Command actions: form focus, text keys, Tab, Escape and selection boundary', formKeys.n === 5, formKeys.error || String(formKeys.n));
  }

  // a panel row moves with Alt + Arrow Down; the move is announced
  if (want('panels')) {
  at('filter panel'); await open(route('panels'));
  // the members' Filter starts with two conditions: open its panel
  await page.evaluate(() => { const b = [...document.querySelectorAll('main .plx-command-bar__row button')].find((x) => /^Filter/.test(x.getAttribute('aria-label') || x.textContent.trim())); if (b) b.click(); });
  await sleep(500);
  const r = await page.evaluate(() => { const rows = [...document.querySelectorAll('.plx-find-panel__rows--framed > [data-plx-row]')]; if (rows.length < 2) return null; rows[0].focus(); return rows.map((x) => x.getAttribute('aria-label')); });
  if (r) {
    await page.keyboard.down('Alt'); await page.keyboard.press('ArrowDown'); await page.keyboard.up('Alt'); await sleep(300);
    const after = await page.evaluate(() => { const box = document.activeElement.parentElement; return { focus: document.activeElement.getAttribute('aria-label'), first: box.querySelector(':scope > [data-plx-row]').getAttribute('aria-label'), status: (box.querySelector(':scope > [role="status"]') || {}).textContent }; });
    check('Filter panel: Alt + Arrow Down moves the focused row down, keeps the focus on it and announces it', after.first.split(',')[0] === r[1].split(',')[0] && /moved to position 2/.test(after.status || '') && after.focus.split(',')[0] === r[0].split(',')[0], JSON.stringify([r.slice(0, 2), after]));
  } else check('Filter panel: an open panel with two rows is shown', false, 'none found');
  }

  // the selection bar: one Tab stop; disabled commands are skipped by the arrows
  if (want('bulk')) {
  at('selection bar'); await open(route('bulk'));
  const sb = await page.evaluate(() => { const t = document.querySelector('main .plx-bulk-actions--empty .plx-bulk-actions__row') || document.querySelector('main .plx-bulk-actions__row'); if (!t) return null; t.setAttribute('data-kb-bulk', ''); const all = [...t.querySelectorAll('button')].filter((e) => e.offsetParent); return { n: all.length, enabled: all.filter((e) => !e.disabled).map((e) => e.getAttribute('aria-label') || e.textContent.trim()), tabbable: all.filter((e) => e.tabIndex === 0 && !e.disabled).length }; });
  check('Selection bar: one Tab stop, the disabled commands are shown', sb && sb.n > sb.enabled.length && sb.tabbable === 1, JSON.stringify(sb));
  if (sb && sb.enabled.length > 1) {
    await page.evaluate(() => { const b = [...document.querySelectorAll('[data-kb-bulk] button')].find((e) => e.tabIndex === 0 && !e.disabled); if (b) b.focus(); });
    const s0 = await active(); await page.keyboard.press('ArrowRight'); const s1 = await active();
    check('Selection bar: Arrow Right moves to the next enabled control', s0 !== s1 && sb.enabled.indexOf(s1) >= 0, s0 + ' -> ' + s1);
  }
  }

  await browser.close(); server.close();
  const bad = results.filter((r) => !r[1]);
  results.forEach(([n, ok, d]) => console.log((ok ? '  ok   ' : '  FAIL ') + n + (ok ? '' : ' · ' + d)));
  console.log((bad.length ? 'KEYBOARD_FAIL ' : 'KEYBOARD_OK ') + (results.length - bad.length) + '/' + results.length);
  process.exit(bad.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
