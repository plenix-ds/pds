/* Plenix tests · #1232 (owner, D-0164): the data font (Reddit Mono) is for data only; names and words never use it.
   Summary: each chart that draws a category axis (BarChart, LollipopChart, ComboChart, FunnelChart, LineChart on a band axis), light and dark, LTR and RTL:
     every axis label that is a word or a name (it holds a letter) is drawn in the text font; every label that is only a number (a value tick, a data label) is drawn in the data font.
   Checks: AC-1 a category name is not in the data font; AC-2 a value tick and a data label are in the data font; AC-3 the text font is the page's text font (not the data one).
   Proof first: before the change every axis label is drawn in the data font, so a member's name appears in Reddit Mono.
   Usage: node tests/chart-data-font-1232.test.js   → CHART_DATA_FONT_1232_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9817, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const NAMES = ['Maya Chen', 'Ibrahim Mansour', 'Sara Khalil'];
    for (const dir of ['ltr', 'rtl']) for (const mode of ['light', 'dark']) {
      const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 700 });
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const charts = {
        BarChart: "h(P.BarChart, { title: 'Cases', categories: N, series: [{ id: 'a', label: 'Open', values: [12, 30, 7] }], valueLabel: 'Cases', categoryLabel: 'Member', showValues: true })",
        LollipopChart: "h(P.LollipopChart, { title: 'Cases', data: N.map((n, i) => ({ label: n, value: [12, 30, 7][i] })), valueTitle: 'Cases' })",
        FunnelChart: "h(P.FunnelChart, { title: 'Funnel', data: N.map((n, i) => ({ label: n, value: [300, 200, 100][i] })), valueTitle: 'People' })",
        ComboChart: "h(P.ComboChart, { title: 'Combo', categories: N, bars: [{ id: 'u', label: 'Uploads', values: [12, 30, 7] }], lines: [{ id: 'r', label: 'Rate', values: [3, 5, 4] }], barLabel: 'Uploads', lineLabel: 'Rate', categoryLabel: 'Member' })",
        LineChart: "h(P.LineChart, { title: 'Line', data: N.map((n, i) => ({ who: n, a: [3, 9, 5][i] })), x: 'who', series: [{ id: 'a', label: 'Cases' }] })",
      };
      for (const [name, expr] of Object.entries(charts)) {
        const T = dir + ' ' + mode + ' ' + name + ': ';
        const got = await page.evaluate(async (dir, mode, expr, N) => {
          document.documentElement.setAttribute('dir', dir); document.documentElement.setAttribute('data-plx-mode', mode); document.documentElement.setAttribute('lang', 'en');
          const h = React.createElement, P = Plenix; window.__root && window.__root.unmount();
          document.querySelector('main').replaceChildren(Object.assign(document.createElement('div'), { id: 'c', style: 'inline-size:720px' }));
          window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(eval(expr)); await new Promise((r) => setTimeout(r, 2200));
          const rs = getComputedStyle(document.documentElement), first = (v) => v.split(',')[0].trim().replace(/['"]/g, '');
          const data = first(rs.getPropertyValue('--plx-sys-font-data')), text = first(getComputedStyle(document.body).fontFamily);
          const texts = [...document.querySelectorAll('#c svg text, #c svg tspan')].map((t) => ({ s: t.textContent.trim(), f: first(t.getAttribute('font-family') || getComputedStyle(t).fontFamily) })).filter((t) => t.s);
          return { data, text, texts };
        }, dir, mode, expr, NAMES);
        const words = got.texts.filter((t) => /[A-Za-z؀-ۿ]/.test(t.s)), numbers = got.texts.filter((t) => /^[\d.,:%٫٬٠-٩+\-\s]+$/.test(t.s));
        assert.ok(got.data !== got.text, T + 'AC-3: the data font and the text font are different fonts (' + got.data + ' / ' + got.text + ')');
        const nameLabels = got.texts.filter((t) => NAMES.includes(t.s));
        assert.ok(nameLabels.length >= 1, T + 'the category names are drawn: ' + JSON.stringify(got.texts.map((t) => t.s)));
        for (const t of words) assert.notEqual(t.f, got.data, T + 'AC-1: "' + t.s + '" is a word and is drawn in the data font (' + t.f + ')');
        assert.ok(numbers.length >= (name === 'FunnelChart' ? 0 : 2), T + 'numbers are drawn');
        for (const t of numbers) assert.equal(t.f, got.data, T + 'AC-2: "' + t.s + '" is a number and is not in the data font (' + t.f + ')');
      }
      await page.close();
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('CHART_DATA_FONT_1232_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
