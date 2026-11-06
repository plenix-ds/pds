// Plenix · tests/data-grid-person-label-477.test.js: a person column's read cell shows the Avatar and name, not the raw value (issue 477 item, G2 note on 431).
//   node tests/data-grid-person-label-477.test.js   → DATA_GRID_PERSON_LABEL_477_OK
// Proof first: before, a person column given only editorProps.options or loadOptions showed the raw value (an id) in the read cell.
//   With options: the read cell is the option's Avatar and name. With loadOptions only: after a person is picked in the editor the cell shows their name (the grid remembers it).
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9877, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 560 });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    for (const dir of ['ltr', 'rtl']) {
      await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement;
        const people = [{ value: 'u1', label: 'Mina Samir' }, { value: 'u2', label: 'Sara Nabil' }];
        const App = () => {
          const [data, setData] = React.useState([{ id: 'r1', a: 'u1', b: 'u1' }, { id: 'r2', a: 'u2', b: 'u2' }]);
          const columns = [
            { title: 'With options', field: 'a', type: 'person', editor: 'person', editorProps: { options: people } },
            { title: 'Load only', field: 'b', type: 'person', editor: 'person', editorProps: { loadOptions: (q) => Promise.resolve(people.filter((p) => p.label.toLowerCase().includes((q || '').toLowerCase()))) } },
          ];
          return h('div', { style: { height: 400 } }, h(Plenix.DataGrid, { label: 'People', data, columns, editing: { types: ['person'] }, onCellEdit: (r, e) => { window.__last = e.value; setData((d) => d.map((x) => (x.id === r.id ? Object.assign({}, x, { [e.field]: e.value }) : x))); } }));
        };
        window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(h(App)); await new Promise((r) => setTimeout(r, 1000));
      }, dir);
      const text = (field, row) => page.evaluate((field, row) => [...document.querySelectorAll('[role=row][data-plx-record]')][row].querySelector('[data-plx-field="' + field + '"]').textContent.trim(), field, row);
      assert.match(await text('a', 0), /Mina Samir/, dir + ': options give the read cell the name');
      assert.doesNotMatch(await text('a', 0), /u1/, dir + ': not the raw value');
      // pick Sara in the load-only column of row 1: the cell then shows her name
      await page.evaluate(() => [...document.querySelectorAll('[role=row][data-plx-record]')][0].querySelector('[data-plx-field="b"]').focus());
      await page.keyboard.press('Enter'); await wait(500); await page.keyboard.type('Sara'); await wait(500); await page.keyboard.press('ArrowDown'); await wait(200); await page.keyboard.press('Enter'); await wait(600);
      const picked = await page.evaluate(() => window.__last), want = { u1: 'Mina Samir', u2: 'Sara Nabil' }[picked];
      assert.ok(want, dir + ': a person was picked and saved (got ' + picked + ')');
      const after = await text('b', 0); 
      assert.match(after, new RegExp(want), dir + ': after picking, the load-only cell shows the name (got ' + after + ')');
      assert.doesNotMatch(after, /u[12]\b/, dir + ': not the raw value');
      await page.evaluate(() => window.__root.unmount());
    }
    console.log('DATA_GRID_PERSON_LABEL_477_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
