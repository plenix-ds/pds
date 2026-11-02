/* Plenix tests · a count in a metric, chart, record header, activity row or table value is in the data font (issue 260, owner 2026-10-30).
   Summary: Metric's description, ChartFrame's (and Gauge's) description, RecordPage.Header's description, ActivityList.Item's meta and a Table cell whose render function returns a string
     take a plain string through dataWhenText, so "40 pledges" is [40 in Reddit Mono] + " pledges" in the normal font, in the phrase's own size.
   The probe is proved able to see the old failure first: the old build wrote these strings as one DM Sans text, so no Reddit Mono text was found inside them and every case below
     fails on it (the typography check's "phrase" finding: 18 on 9 pages).
   Cases: each part, in an English page and an Arabic one (Arabic-Indic digits): a number is in a Mono element, the words are not, the text reads the same as the string, the data text keeps the
     phrase's size, and an element given as a table cell stays as given.
   Usage: node tests/data-phrase-260b-data.test.js   (run by layout.test.js when Metric, ChartFrame, Gauge, RecordPage, ActivityList or the DataGrid changed) */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9641, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const CASES = {
      en: { lang: 'en', dir: 'ltr', metric: '40 pledges', chart: '684,300 given of the 1.2 million goal', record: 'Sunday service, 3 services', meta: 'Round 3 concepts: 12 files', cell: '4 ministries' },
      ar: { lang: 'ar', dir: 'rtl', metric: '٤٠ تعهدا', chart: '٦٨٤٬٣٠٠ من هدف ١٫٢ مليون', record: 'خدمة الأحد، ٣ خدمات', meta: 'مفاهيم الجولة ٣: ١٢ ملفا', cell: '٤ خدمات' } };
    for (const key of Object.keys(CASES)) {
      const c = CASES[key];
      const found = await page.evaluate(async (c) => {
        document.documentElement.setAttribute('lang', c.lang); document.documentElement.setAttribute('dir', c.dir);
        document.querySelector('main').innerHTML = '<div id="c"></div>'; const h = React.createElement, P = Plenix;
        ReactDOM.createRoot(document.getElementById('c')).render(h('div', null,
          h(P.Metric, { label: 'Pledges', value: '684', description: c.metric }),
          h(P.ChartFrame, { title: 'Giving', description: c.chart, label: 'Giving' }, h('div', null)),
          h(P.RecordPage.Header, { title: 'Service', description: c.record }),
          h(P.ActivityList, { label: 'Recent' }, h(P.ActivityList.Item, { title: 'Review', meta: c.meta, time: '10:24 AM' })),
          h(P.Table, { label: 'Ministries', columns: [{ title: 'Ministry', field: 'm' }, { title: 'Count', field: 'n', render: (r) => r.n }, { title: 'Node', field: 'k', render: (r) => r.k }],
            data: [{ id: 1, m: 'Choir', n: c.cell, k: h('em', { id: 'own' }, '7 files') }] })));
        await new Promise((r) => setTimeout(r, 1000));
        const parts = { metric: '.plx-metric__description', chart: '.plx-chart__description', record: '.plx-record-page__description', meta: '.plx-activity-list__meta', cell: '[role="cell"][data-plx-field="n"] .plx-data-grid__value' }, out = {};   // the Count cell: every text cell has a value span, and the first is Ministry's "Choir" (issue 777)
        for (const k of Object.keys(parts)) {
          const el = document.querySelector(parts[k]), monos = [...el.querySelectorAll('*')].filter((e) => !e.children.length && /Mono/i.test(getComputedStyle(e).fontFamily));
          const inner = el.querySelector('.plx-text');
          out[k] = { text: el.textContent, monos: monos.map((e) => e.textContent), wordsMono: /Mono/i.test(getComputedStyle(inner || el).fontFamily), phraseSize: getComputedStyle(inner || el).fontSize, monoSize: monos[0] ? getComputedStyle(monos[0]).fontSize : null };
        }
        out.own = { text: document.getElementById('own').textContent, spans: document.getElementById('own').querySelectorAll('.plx-text').length };
        return out;
      }, c);
      for (const k of ['metric', 'chart', 'record', 'meta', 'cell']) {
        assert.equal(found[k].text, c[k], key + ' ' + k + ': the text reads exactly as the string');
        assert.ok(found[k].monos.length >= 1, key + ' ' + k + ': a number is in Reddit Mono (the old build: none)');
        assert.equal(found[k].wordsMono, false, key + ' ' + k + ': the words are not in Reddit Mono');
        assert.equal(found[k].monoSize, found[k].phraseSize, key + ' ' + k + ': the data text keeps the phrase\'s size');
      }
      assert.equal(found.own.text, '7 files', key + ': an element cell keeps its own text');
      assert.equal(found.own.spans, 0, key + ': an element cell gets no data span added');
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('data-phrase-260b-data: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
