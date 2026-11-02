/* Plenix tests · a DataGrid's card count names the app's records (issue 679, the owner's card review): strings.cardCount
   makes "6 records" read "6 members", in the locale's plural forms; with no strings the count is as before.
   Written before the change: the count read the catalog's dataGrid.cardCount only, so a grid's strings were ignored.
   Summary (the browser, 380 x 600, the narrow cards: narrow="list", so the cards show whatever the columns need, issue 929):
     English: with strings.cardCount { one, other }, 1 row reads "1 member" and 6 rows "6 members"; with none, 6 rows read
       "6 records"
     Arabic (right to left): with the six forms, 1 row reads "عضو واحد", 2 rows "عضوان", 3 rows the "few" form and 11 rows
       the "many" form; with none, 6 rows read the catalog's "few" form for records
     no script errors
   Usage: node tests/data-grid-card-count-679.test.js   → DATA_GRID_CARD_COUNT_679_OK */
const assert = require('assert/strict');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

const EN = { one: '{n} member', other: '{n} members' };
const AR = { zero: 'لا يوجد أعضاء', one: 'عضو واحد', two: 'عضوان', few: '{n} أعضاء', many: '{n} عضوًا', other: '{n} عضو' };

(async () => {
  const PORT = +process.env.TEST_PORT || 9696, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 380, height: 600 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    // the card header's words for n rows (numbers read as ASCII digits, so the Arabic page's digits compare alike)
    const count = (n, dir, cardCount) => page.evaluate(async (n, dir, cardCount) => {
      const h = React.createElement, P = window.Plenix, ar = dir === 'rtl';
      document.documentElement.setAttribute('dir', dir);
      window.__root && window.__root.unmount();
      document.getElementById('main').innerHTML = '<div id="c"></div>';
      const sheet = document.getElementById('t679c') || Object.assign(document.head.appendChild(document.createElement('style')), { id: 't679c' });
      sheet.textContent = '#c{block-size:560px;display:grid;}';
      const data = Array.from({ length: n }, (_, i) => ({ id: 'm' + i, name: (ar ? 'عضو ' : 'Member ') + (i + 1), role: ar ? 'خادم' : 'Servant', joined: '2024-01-1' + (i % 10) }));
      const columns = [{ field: 'name', title: ar ? 'الاسم' : 'Name', width: 200 }, { field: 'role', title: ar ? 'الدور' : 'Role', width: 160 }, { field: 'joined', title: ar ? 'الانضمام' : 'Joined', type: 'date', width: 160 }];
      window.__root = ReactDOM.createRoot(document.getElementById('c'));
      window.__root.render(h(P.LocaleProvider, { locale: ar ? 'ar-EG' : 'en-US', dir },
        h(P.DataGrid, { label: 'Members', data, columns, index: 'id', selectable: true, narrow: 'list', strings: cardCount ? { cardCount } : undefined })));
      await new Promise((r) => setTimeout(r, 900));
      const head = document.querySelector('.plx-data-grid__grid-header--card');
      return head ? head.textContent.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)).trim() : null;
    }, n, dir, cardCount);

    assert.equal(await count(1, 'ltr', EN), '1 member', 'English: 1 row reads "1 member"');
    assert.equal(await count(6, 'ltr', EN), '6 members', 'English: 6 rows read "6 members"');
    assert.equal(await count(6, 'ltr', null), '6 records', 'English: without strings, 6 rows still read "6 records"');

    assert.equal(await count(1, 'rtl', AR), 'عضو واحد', 'Arabic: 1 row takes the "one" form');
    assert.equal(await count(2, 'rtl', AR), 'عضوان', 'Arabic: 2 rows take the "two" form');
    assert.equal(await count(3, 'rtl', AR), '3 أعضاء', 'Arabic: 3 rows take the "few" form');
    assert.equal(await count(11, 'rtl', AR), '11 عضوًا', 'Arabic: 11 rows take the "many" form');
    assert.equal(await count(6, 'rtl', null), '6 سجلات', 'Arabic: without strings, 6 rows read the catalog\'s records');

    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATA_GRID_CARD_COUNT_679_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
