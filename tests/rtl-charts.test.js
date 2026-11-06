/* Plenix tests · charts in right to left (issue 413, rtl-413-c; owner decision 584 B: time runs left to right in every chart,
   Arabic pages included).
   Summary: with dir="rtl" lang="ar" on the page:
     LineChart (time)   the dates run left to right (January at the left, June at the right); the value axis at the left;
                        its labels keep their Arabic-Indic digits
     LineChart (band)   the categories run left to right in their data order
     GanttChart         the dates run left to right; the task labels sit whole at the left of the bars, not cut by the edge
     HeatMap (calendar) the weeks run left to right after the weekday labels' room at the left; no weekday label overlaps a cell
     BarChart (bars)    not time: it still mirrors, its category labels at the right
     the frame          the drawing is left to right; the title (the surrounding text) still follows the page (right to left)
   Usage: node tests/rtl-charts.test.js   → RTL_CHARTS_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9654, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 900, height: 1400 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    await page.evaluate(() => { document.documentElement.setAttribute('dir', 'rtl'); document.documentElement.setAttribute('lang', 'ar'); });
    // the time chart's data: date-only values, mid-January to mid-June
    const MONTHS = ['2026-01-15', '2026-02-15', '2026-03-15', '2026-04-15', '2026-05-15', '2026-06-15'];
    await page.evaluate(async (months) => {
      const h = React.createElement, P = window.Plenix;
      document.getElementById('main').innerHTML = '<div id="c"></div>';
      ReactDOM.createRoot(document.getElementById('c')).render(h(P.Stack, { gap: 'xl' },
        h('div', { id: 'line' }, h(P.LineChart, { title: 'الرفع الشهري', x: 'day', xType: 'time', series: [{ id: 'n', label: 'الملفات' }], data: months.map((d, i) => ({ day: d, n: [3, 5, 4, 8, 7, 12][i] })) })),
        h('div', { id: 'band' }, h(P.LineChart, { title: 'حسب الشهر', x: 'm', series: [{ id: 'n', label: 'الملفات' }], data: ['يناير', 'فبراير', 'مارس', 'أبريل'].map((m, i) => ({ m, n: [2, 6, 4, 9][i] })) })),
        h('div', { id: 'gantt' }, h(P.GanttChart, { title: 'الخطة', tasks: [{ id: 'a', label: 'التصميم', start: '2026-10-01', end: '2026-10-05' }, { id: 'b', label: 'البناء', start: '2026-10-06', end: '2026-10-12' }] })),
        h('div', { id: 'heat' }, h(P.HeatMap, { variant: 'calendar', title: 'التعديلات اليومية', valueLabel: 'التعديلات', data: Array.from({ length: 42 }, (x, i) => { const d = new Date(2026, 8, 1 + i), p = (n) => String(n).padStart(2, '0'); return { date: d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()), value: (i * 7) % 11 }; }) })),
        h('div', { id: 'bar' }, h(P.BarChart, { title: 'التخزين حسب الفريق', categories: ['التصميم', 'التسويق', 'المبيعات'], series: [{ id: 'gb', label: 'التخزين', values: [420, 310, 120] }] }))));
    }, MONTHS);
    // fonts (issue 25): ECharts hides overlapping tick labels by their measured width, so labels drawn before the web fonts
    // arrived keep the fallback font's widths. Wait for the fonts, then nudge the viewport so every chart redraws with them
    await page.evaluate(() => document.fonts.ready);
    await page.setViewport({ width: 901, height: 1400 }); await page.setViewport({ width: 900, height: 1400 });
    await page.evaluate(() => { window.__plxSettle = null; });
    // settle (issue 25): the charts redraw when their plot is resized, so a fixed wait can read a drawing made at one width
    // against a scale built at another. Wait until every plot's width and every label have held for 10 frames in a row
    await page.waitForFunction(() => {
      const w = window.__plxSettle || (window.__plxSettle = { sig: '', n: 0 }), plots = [...document.querySelectorAll('#c .plx-chart__plot')];
      const sig = plots.length + '|' + plots.map((p) => Math.round(p.getBoundingClientRect().width * 10)).join(',') + '|' + document.getElementById('c').textContent.length;
      if (plots.length >= 4 && sig === w.sig) w.n++; else { w.sig = sig; w.n = 0; }
      return w.n >= 10;
    }, { polling: 'raf', timeout: 30000 });
    // every label drawn in a chart, in drawing order, with its left edge; and the plot's middle
    const read = (id) => page.evaluate((id) => {
      const texts = [...document.querySelectorAll('#' + id + ' .plx-chart__engine svg text, #' + id + ' .plx-chart__svg text')].filter((t) => t.getClientRects().length)
        .map((t) => ({ t: t.textContent.trim(), x: t.getBoundingClientRect().left }));
      const p = document.querySelector('#' + id + ' .plx-chart__plot').getBoundingClientRect();
      return { texts, left: p.left, width: p.width, mid: p.left + p.width / 2 };
    }, id);
    const digits = /^[٠-٩]+$/, increasing = (xs) => xs.length > 1 && xs.every((x, i) => i === 0 || x > xs[i - 1]);

    // LineChart, time: dates left to right, the value axis at the left, Arabic-Indic digits
    const line = await read('line');
    const dates = line.texts.filter((l) => !digits.test(l.t)), values = line.texts.filter((l) => digits.test(l.t));
    assert.ok(increasing(dates.map((l) => l.x)), 'LineChart (time): the dates run left to right: ' + JSON.stringify(dates));
    // the first and last ticks, from the data and #593's rule (issue 777). LineChart asks its time scale for about one tick
    // per 64px of plot (TICK_ROOM), and since #593 (21f931d3) date-only values take a calendar step of a day or coarser,
    // never hours: the step nearest span / count by ratio. Here the span is 151 days over a plot of about 800px (12 or 13
    // ticks wanted, about 12 days each), so the step is one week; week ticks fall on Sundays (local time), the first one
    // on or after the first date and the last one on or before the last date. That is 18 January to 14 June for this data
    const ymd = (s) => s.split('-').map(Number), iso = (d) => d.toISOString().slice(0, 10);
    const sunday = (s, dir) => { const [y, m, d] = ymd(s), t = new Date(Date.UTC(y, m - 1, d)); t.setUTCDate(d + (dir > 0 ? (7 - t.getUTCDay()) % 7 : -t.getUTCDay())); return iso(t); };
    const want = { first: sunday(MONTHS[0], 1), last: sunday(MONTHS[MONTHS.length - 1], -1) };
    // the Platform's own scale over the same data, at the drawn plot's width: its step, its end ticks and their labels
    const scale = await page.evaluate((months, room, drawnWidth) => {
      const P = window.Plenix, day = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
      const width = drawnWidth, count = Math.max(2, Math.floor(width / room));
      const ts = P.scaleTime({ domain: [day(months[0]), day(months[months.length - 1])], range: [0, width], unit: 'day' }), ticks = ts.ticks(count);
      const local = (d) => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
      return { width, count, step: ts.step(count).slice(0, 2), first: local(ticks[0]), last: local(ticks[ticks.length - 1]), texts: ticks.map((d) => ts.format(d, count)), firstText: ts.format(ticks[0], count), lastText: ts.format(ticks[ticks.length - 1], count) };
    }, MONTHS, 64, line.width);
    assert.deepEqual(scale.step, ['week', 1], 'LineChart (time): date-only values over five months take week ticks (#593: days or coarser): ' + JSON.stringify(scale));
    assert.deepEqual({ first: scale.first, last: scale.last }, want, 'LineChart (time): the ticks run from the first Sunday in the data to the last: ' + JSON.stringify({ scale, want }));
    assert.equal(dates[0].t, scale.firstText, 'LineChart (time): the first tick, at the left, is ' + want.first + ': ' + JSON.stringify(dates));
    // the engine hides tick labels that would overlap, by their measured width (hideOverlap), so how many of the scale's ticks
    // are drawn depends on the font. Whatever the font: the drawn labels are the scale's ticks, in order, at an even stride;
    // when every tick is drawn the last one is the scale's last, and when some are hidden no hidden tick could still have been
    // drawn after the last one shown (the gap to the end is less than one stride)
    const at = dates.map((l) => scale.texts.indexOf(l.t)), stride = at.length > 1 ? at[1] - at[0] : 1;
    assert.ok(at.every((i, k) => i >= 0 && (k === 0 || i - at[k - 1] === stride)), 'LineChart (time): the drawn labels are the scale\'s ticks at an even stride: ' + JSON.stringify({ dates, texts: scale.texts }));
    assert.ok(scale.texts.length - 1 - at[at.length - 1] < stride, 'LineChart (time): the labels run to the end of the scale: ' + JSON.stringify({ dates, texts: scale.texts }));
    if (stride === 1) assert.equal(dates[dates.length - 1].t, scale.lastText, 'LineChart (time): the last tick, at the right, is ' + want.last + ': ' + JSON.stringify(dates));
    assert.ok(/يناير/.test(dates[0].t) && /يونيو/.test(dates[dates.length - 1].t), 'LineChart (time): January first (left), June last (right): ' + JSON.stringify(dates));
    assert.ok(values.length > 1 && values.every((l) => l.x < line.mid), 'LineChart (time): the value axis is at the left: ' + JSON.stringify(values));
    assert.ok(dates.every((l) => /[٠-٩]/.test(l.t) && !/[0-9]/.test(l.t)), 'LineChart (time): the dates keep their Arabic-Indic digits: ' + JSON.stringify(dates));

    // LineChart, band: the categories in their data order, left to right
    const band = await read('band');
    const cats = ['يناير', 'فبراير', 'مارس', 'أبريل'].map((m) => (band.texts.find((l) => l.t === m) || {}).x);
    assert.ok(cats.every((x) => x !== undefined) && increasing(cats), 'LineChart (band): the categories run left to right: ' + JSON.stringify(band.texts));

    // GanttChart: dates left to right; the task labels whole, at the left of the bars
    const gantt = await read('gantt');
    const tasks = gantt.texts.filter((l) => l.t === 'التصميم' || l.t === 'البناء'), days = gantt.texts.filter((l) => /أكتوبر/.test(l.t));
    assert.ok(increasing(days.map((l) => l.x)), 'GanttChart: the dates run left to right: ' + JSON.stringify(days));
    assert.equal(tasks.length, 2, 'GanttChart: both task labels drawn');
    assert.ok(tasks.every((l) => l.x >= gantt.left && l.x < days[0].x), 'GanttChart: the task labels sit whole at the left of the bars: ' + JSON.stringify({ tasks, left: gantt.left, first: days[0] }));

    // since #593 the engine draws the heat map: the cells are its 42 paths and the weekday labels its text
    // HeatMap, calendar: the cells (drawn week by week, Sunday to Saturday) and the weekday labels (Monday, Wednesday, Friday)
    const heat = await page.evaluate(() => {
      const box = (e) => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; };
      // the weekday labels are the text beside the cells; the month names above them are not
      const cells = [...document.querySelectorAll('#heat .plx-chart__engine svg path')].map(box), top = Math.min.apply(null, cells.map((c) => c.t));
      return {
        cells: [...document.querySelectorAll('#heat .plx-chart__engine svg path')].map(box),
        days: [...document.querySelectorAll('#heat .plx-chart__engine svg text')].filter((t) => box(t).t >= top - 1).map((t) => Object.assign({ t: t.textContent.trim() }, box(t))),
        plot: box(document.querySelector('#heat .plx-chart__plot')),
      };
    });
    const firstCol = Math.min.apply(null, heat.cells.map((c) => c.l));
    assert.ok(heat.cells.length === 42 && heat.days.length === 3, 'HeatMap (calendar): 42 days and 3 weekday labels drawn: ' + JSON.stringify({ cells: heat.cells.length, days: heat.days }));
    // fails before the fix: in right to left the frame moved the drawing by the end margin (8px), not the start margin (40px) kept for the labels
    const weeks = []; heat.cells.forEach((c) => { if (!weeks.length || c.l > weeks[weeks.length - 1] + 1) weeks.push(c.l); });
    assert.ok(weeks.length === 7 && heat.cells.every((c, i) => i === 0 || c.l >= heat.cells[i - 1].l - 1) && firstCol - heat.plot.l >= 32,
      'HeatMap (calendar): the weeks run left to right in date order, after the weekday labels\' room at the left: ' + JSON.stringify({ weeks, plot: heat.plot.l }));
    // before the fix the SVG inherited dir=rtl, so each label's text-anchor "end" turned around and the label ran right, over the cells
    assert.ok(heat.days.every((d) => d.r <= firstCol && d.l >= heat.plot.l - 1), 'HeatMap (calendar): each weekday label sits whole left of the first week: ' + JSON.stringify({ days: heat.days, firstCol, plot: heat.plot.l }));
    // fails before the fix for the same reason: the turned-around labels ran from the plot's edge into the first week's cells
    assert.ok(heat.days.every((d) => heat.cells.every((c) => d.r <= c.l || d.l >= c.r || d.b <= c.t || d.t >= c.b)), 'HeatMap (calendar): no weekday label overlaps a cell: ' + JSON.stringify(heat.days));

    // BarChart, horizontal: bars are not time, so they still mirror: the category labels at the right of the plot
    // a guard, not a regression of this fix (BarChart is outside the diff and passes before it too): it fails if decision 584 B spreads to the bars
    const bar = await read('bar');
    const barCats = ['التصميم', 'التسويق', 'المبيعات'].map((c) => bar.texts.find((l) => l.t === c));
    assert.ok(barCats.every((l) => l && l.x > bar.mid), 'BarChart (horizontal): the category labels sit at the right in right to left: ' + JSON.stringify({ texts: bar.texts, mid: bar.mid }));

    // the frame: the drawing is left to right, the title follows the page
    // before the fix the heat map's SVG (no chart engine) inherited the page's rtl
    const dirs = await page.evaluate(() => ({ svg: getComputedStyle(document.querySelector('#gantt .plx-chart__svg')).direction, heat: getComputedStyle(document.querySelector('#heat .plx-chart__svg')).direction, engine: getComputedStyle(document.querySelector('#line .plx-chart__engine')).direction, title: getComputedStyle(document.querySelector('#line .plx-chart__title')).direction }));
    assert.deepEqual(dirs, { svg: 'ltr', heat: 'ltr', engine: 'ltr', title: 'rtl' }, 'the drawing is left to right; the title follows the page');

    assert.deepEqual(errors, [], 'no script errors');
    console.log('RTL_CHARTS_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
