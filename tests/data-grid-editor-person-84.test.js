// Plenix · tests/data-grid-editor-person-84.test.js: the person cell editor (issue 84, DT-41 phase 2; ADR 0016, design 84-cell-editors §1 and §2).
//   node tests/data-grid-editor-person-84.test.js   → DATA_GRID_EDITOR_PERSON_84_OK
// Written first (proof first): before the change editor: "person" opens a one-line text box. In left to right and right to left, with editing={{ types: ['person'] }} and editorProps.options (or loadOptions):
//   Enter opens Plenix's EntityPicker (people) in the cell, drawn bare, focused, with its list open and each suggestion with its name and detail; typing searches by name or email;
//   choosing a person saves their value at once; the first Escape closes the list, the second cancels and the cell keeps the focus; with the list closed Enter saves and Tab saves and moves;
//   without the type turned on Enter opens the one-line editor.
const assert = require('assert/strict');
const shared = require('./check.js');
const { serve, launch } = require('./lib');
require('./limit.js');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let passed = 0, failed = 0;
const check = async (name, fn) => { if (!shared.wanted(name)) return; try { await fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

(async () => {
  const PORT = +process.env.TEST_PORT || 9858, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const mount = (editing, load) => page.evaluate(async (dir, editing, load) => {
        window.__root && window.__root.unmount(); document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en'); window.__edits = [];
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const data = [{ id: 'r1', name: 'A', state: 'open' }, { id: 'r2', name: 'B', state: 'closed' }];
        const columns = [{ title: 'Name', field: 'name', editor: 'input' }, { title: 'State', field: 'state', width: '--plx-ref-size-40u', editor: 'person', editorProps: load ? { loadOptions: (t) => Promise.resolve(t && t !== 'nomatch' ? [{ value: t + '-1', label: t + ' one', description: t + '@example.org' }] : []) } : { options: [{ value: 'open', label: 'Open Ng', description: 'open@example.org', color: 'blue' }, { value: 'closed', label: 'Closed Ho with a very long family name that cannot fit in the cell at all', description: 'closed@example.org' }, { value: 'held', label: 'Hal Dee', description: 'hal@example.org' }] } }];
        window.__root = ReactDOM.createRoot(document.getElementById('c'));
        window.__root.render(h('div', { style: { height: 400 } }, h(Plenix.DataGrid, { label: 'Cases', data, columns, editing, onCellEdit: (r, e) => window.__edits.push(r.id + '.' + e.field + '=' + e.value) })));
        await new Promise((r) => setTimeout(r, 1000));
      }, dir, editing, load);
      const focus = (r) => page.evaluate((r) => { const row = [...document.querySelectorAll('[role=row][data-plx-record]')][r]; row.querySelector('[data-plx-field="state"]').focus(); }, r);
      const sel = () => page.evaluate(() => { const f = document.querySelector('.plx-data-grid__grid-editing input[role=combobox]'); if (!f) return null; const box = f.closest('.plx-input') || f, cs = getComputedStyle(box); return { expanded: f.getAttribute('aria-expanded'), listOpen: !!document.querySelector('[role=listbox]'), focused: document.activeElement === f, border: cs.borderTopWidth + '/' + cs.borderLeftWidth + '/' + cs.borderRightWidth, bg: cs.backgroundColor, text: f.value }; });
      const oneLine = () => page.evaluate(() => !!document.querySelector('input.plx-data-grid__editor'));
      const at = () => page.evaluate(() => { const a = document.activeElement; return a && a.getAttribute && a.getAttribute('data-plx-field') ? a.closest('[role=row]').getAttribute('data-plx-record').replace(/^string:/, '') + '.' + a.getAttribute('data-plx-field') : (a ? a.tagName : null); });
      const key = async (k) => { await page.keyboard.press(k); await wait(300); };
      const edits = () => page.evaluate(() => window.__edits.slice());
      // where the value's text starts (its inline-start edge) in the read cell and in the open editor: the value does not move (design §1)
      const startOf = (mode) => page.evaluate((mode, rtl) => {
        const cell = document.querySelector('[role=row][data-plx-record] [data-plx-field="state"]');
        const cr = cell.getBoundingClientRect(), edge = (r, el) => (getComputedStyle(el).direction === 'rtl' ? r.right - cr.right : r.left - cr.left);
        const person = cell.querySelector('.plx-data-grid__person'); if (person) return edge(person.getBoundingClientRect(), person);
        if (mode === 'read') { const w = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (n.textContent.trim()) { const r = document.createRange(); r.selectNodeContents(n); return edge(r.getBoundingClientRect(), n.parentElement); } } return null; }
        const t = cell.querySelector('.plx-select__value'); if (t) return edge(t.getBoundingClientRect(), t);
        const i = cell.querySelector('input'); const b = i.getBoundingClientRect(), cs = getComputedStyle(i);
        return cs.direction === 'rtl' ? b.right - cr.right - parseFloat(cs.paddingRight) : b.left - cr.left + parseFloat(cs.paddingLeft);
      }, mode, dir === 'rtl');
      const ON = { types: ['person'] };

      await check(T + 'Enter opens the EntityPicker in the cell with its list open, drawn bare', async () => {
        await mount(ON); await focus(0); await key('Enter'); const s = await sel();
        assert.deepEqual([s.expanded, s.listOpen, s.focused], ['true', true, true]); assert.equal(s.border, '0px/0px/0px'); assert.match(s.bg, /rgba\(0, 0, 0, 0\)|transparent/); assert.equal(await oneLine(), false);
      });
      await check(T + 'arrow keys then Enter pick an option and save at once', async () => {
        await mount(ON); await focus(0); await key('Enter'); await key('ArrowDown'); await key('Enter'); assert.deepEqual(await edits(), ['r1.state=closed']); assert.equal(await sel(), null);
      });
      await check(T + 'typing filters the list and Enter chooses and saves', async () => {
        await mount(ON); await focus(0); await key('Enter'); await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type('hal@'); await wait(300);
        assert.equal(await page.evaluate(() => document.querySelectorAll('[role=option]').length), 1); await key('ArrowDown'); await key('Enter'); assert.deepEqual(await edits(), ['r1.state=held']);
      });
      await check(T + 'a typed text that matches nothing shows the empty row and Enter saves nothing', async () => {
        await mount(ON); await focus(0); await key('Enter'); await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type('qqqq'); await wait(300);
        const row = await page.evaluate(() => { const l = document.querySelector('[role=listbox]'); return { options: document.querySelectorAll('[role=option]:not([aria-disabled=true])').length, text: l ? l.textContent.trim() : null }; });
        assert.equal(row.options, 0); assert.ok(row.text && row.text.length > 0, 'the list says there is nothing: ' + JSON.stringify(row));
        await key('Enter'); assert.deepEqual(await edits(), []); assert.notEqual(await sel(), null, 'the editor stays open');
      });
      await check(T + 'loadOptions returning nothing shows the same empty row', async () => {
        await mount({ types: ['person'] }, true); await focus(0); await key('Enter'); await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type('nomatch'); await wait(1100);
        assert.equal(await page.evaluate(() => document.querySelectorAll('[role=option]:not([aria-disabled=true])').length), 0); await key('Enter'); assert.deepEqual(await edits(), []); assert.notEqual(await sel(), null);
      });
      await check(T + 'the read cell shows the person with an avatar and the name, a long name ending in an ellipsis', async () => {
        await mount(ON); const r = await page.evaluate(() => { const cells = [...document.querySelectorAll('[role=row][data-plx-record]')].map((row) => row.querySelector('[data-plx-field="state"]')); const info = (c) => { const n = c.querySelector('.plx-data-grid__person-name'); return { avatar: !!c.querySelector('.plx-avatar'), name: n ? n.textContent : null, cut: n ? n.scrollWidth > n.clientWidth && getComputedStyle(n).textOverflow === 'ellipsis' : false }; }; return [info(cells[0]), info(cells[1])]; });
        assert.deepEqual([r[0].avatar, r[0].name], [true, 'Open Ng']); assert.deepEqual([r[1].avatar, r[1].cut], [true, true]);
      });
      await check(T + 'the open editor shows the current person with an avatar until text is typed', async () => {
        await mount(ON); await focus(0); await key('Enter'); const shown = () => page.evaluate(() => { const c = document.querySelector('.plx-data-grid__grid-editing'); const p = c.querySelector('.plx-data-grid__person'); return p ? { avatar: !!p.querySelector('.plx-avatar'), name: p.querySelector('.plx-data-grid__person-name').textContent.trim() } : null; });
        assert.deepEqual(await shown(), { avatar: true, name: 'Open Ng' }); await page.keyboard.type('h'); await wait(300); assert.equal(await shown(), null, 'typing replaces it with the search text');
      });
      await check(T + 'the suggestions show an avatar, a name and an email, and a search finds a person by name or by email', async () => {
        await mount(ON); await focus(0); await key('Enter'); const first = await page.evaluate(() => { const o = document.querySelector('[role=option]'); return { avatar: !!o.querySelector('.plx-avatar'), text: o.textContent.replace(/\s+/g, ' ').trim() }; });
        assert.equal(first.avatar, true); assert.match(first.text, /@example\.org/);
        const count = async (text) => { await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type(text); await wait(400); return page.evaluate(() => document.querySelectorAll('[role=option]').length); };
        assert.equal(await count('dee'), 1, 'by name'); assert.equal(await count('closed@'), 1, 'by email');
      });
      await check(T + 'loadOptions loads for the typed text', async () => {
        await mount({ types: ['person'] }, true); await focus(0); await key('Enter'); await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type('zz'); await wait(900);
        await key('ArrowDown'); await key('Enter'); assert.deepEqual(await edits(), ['r1.state=zz-1']);
      });
      await check(T + 'a click on an option saves it', async () => {
        await mount(ON); await focus(0); await key('Enter');
        await page.evaluate(() => [...document.querySelectorAll('[role=option]')].find((o) => /Hal Dee/.test(o.textContent)).dispatchEvent(new MouseEvent('click', { bubbles: true }))); await wait(300);
        assert.deepEqual(await edits(), ['r1.state=held']);
      });
      await check(T + 'the first Escape closes the list, the second cancels, and the cell keeps the focus', async () => {
        await mount(ON); await focus(0); await key('Enter'); await key('Escape'); const s = await sel(); assert.deepEqual([s.listOpen, s.expanded], [false, 'false']);
        await key('Escape'); assert.equal(await sel(), null); assert.deepEqual(await edits(), []); assert.equal(await at(), 'r1.state');
      });
      await check(T + 'with the list closed Enter saves the current choice', async () => {
        await mount(ON); await focus(1); await key('Enter'); await key('Escape'); await key('Enter'); assert.deepEqual(await edits(), ['r2.state=closed']); assert.equal(await at(), 'r2.state');
      });
      await check(T + 'Tab saves and moves to the next editable cell', async () => {
        await mount(ON); await focus(0); await key('Enter'); await key('Escape'); await key('Tab'); assert.deepEqual(await edits(), ['r1.state=open']); assert.equal(await at(), 'r2.name');
      });
      await check(T + 'the value text starts where the read text starts (within 1px)', async () => {
        await mount(ON); const before = await startOf('read'); await focus(0); await key('Enter'); const during = await startOf('edit');
        assert.ok(Math.abs(before - during) <= 1, 'read ' + before + ' vs editing ' + during);
      });
      await check(T + 'with the type not turned on Enter opens the one-line editor', async () => {
        await mount(undefined); await focus(0); await key('Enter'); assert.equal(await oneLine(), true); assert.equal(await sel(), null);
      });
    }
  } finally { if (browser) await browser.close(); server.close(); }
  console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'DATA_GRID_EDITOR_PERSON_84_OK (' + passed + ' checks)');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
