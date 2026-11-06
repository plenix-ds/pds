/* Plenix tests · a date with no time (issue 342; the owner's option A, 2026-10-29): a date-only "YYYY-MM-DD" is that
   calendar day wherever the reader is, everywhere.
   Summary: in five time zones (New York, Los Angeles, UTC, Cairo, Tokyo; the cases of the issue's measurement) the value
     2026-10-18 lands on October 18:
       Node (utils, no browser): parseDate and isoDay (utils/format.ts), the "within N days" filter and the date quick filter
         (utils/fields.ts: today and the days before it are local days), the time scale (charts/scales.ts scaleTime: its
         domain read from date-only texts)
       the browser (the zone emulated): GanttChart (its data table's start and end), HeatMap's calendar (its data table's
         day), LineChart with a time axis (its data table's x), and what was already right stays right: Time, formatDate,
         Calendar and DatePicker (the chosen day), TimelineChart (its data table)
   Usage: node tests/date-only.test.js   → DATE_ONLY_OK */
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const Babel = require('@babel/standalone');
const { serve, launch } = require('./lib');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

const ROOT = path.join(__dirname, '..');
const ZONES = ['America/New_York', 'America/Los_Angeles', 'UTC', 'Africa/Cairo', 'Asia/Tokyo'];
const DAY = '2026-10-18';

// an ES module of utils/ or charts/ as CommonJS; imports of other Platform files load the same way, icons and React are stubs
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const mod = { exports: {} }; cache.set(file, mod.exports);
  const code = Babel.transform(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['transform-modules-commonjs'], presets: [['react', { runtime: 'classic' }], 'typescript'], filename: file }).code;
  const req = (spec) => {
    if (spec === 'react') return { createElement: () => null };
    if (/^plenix-platform\/icons\//.test(spec)) return { default: { name: spec.split('/').pop() } };
    if (spec.startsWith('.')) { let p = path.resolve(path.dirname(file), spec); if (!fs.existsSync(p)) p += ['.js', '.jsx', '.ts'].find((x) => fs.existsSync(p + x)) || '.tsx'; return load(p); }
    return require(spec);
  };
  new Function('module', 'exports', 'require', code)(mod, mod.exports, req);
  cache.set(file, mod.exports);
  return mod.exports;
}
const F = load(path.join(ROOT, 'platform', 'utils', 'format.ts'));
const fields = load(path.join(ROOT, 'platform', 'utils', 'fields.ts'));
const scales = load(path.join(ROOT, 'platform', 'charts', 'scales.ts'));

(async () => {
  const zone0 = process.env.TZ;
  try {
    // Node: the shared reader and its users, zone by zone (Node reads a TZ change at once)
    for (const tz of ZONES) {
      process.env.TZ = tz;
      const d = F.parseDate(DAY);
      assert.equal(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(), '2026-10-18', tz + ': parseDate reads the calendar day');
      assert.equal(F.isoDay(DAY), DAY, tz + ': isoDay gives the same day back');
      assert.equal(F.isoDay(new Date(2026, 9, 18, 0, 30)), DAY, tz + ': isoDay of a local time just after midnight is that local day, not the UTC day');
      assert.equal(F.formatDate(DAY, { locale: 'en-US' }).replace(/\s/g, ' '), 'Oct 18, 2026', tz + ': formatDate stays right (#504)');
      // the "within N days" filter and the date quick filter: today Oct 20, a row dated Oct 18 is within 7 days; Oct 12 is not
      const f = [{ value: 'when', label: 'When', kind: 'date' }];
      const within = (v) => fields.matchesCondition({ field: 'when', op: 'within', value: 'week' }, { when: v }, f, '2026-10-20');
      assert.equal(within(DAY), true, tz + ': Oct 18 is within the last 7 days of Oct 20');
      assert.equal(within('2026-10-12'), false, tz + ': Oct 12 is not within the last 7 days of Oct 20');
      assert.equal(fields.matchesDate({ preset: '7' }, DAY, '2026-10-20'), true, tz + ': the date quick filter keeps Oct 18');
      assert.equal(fields.matchesDate({ preset: '7' }, '2026-10-13', '2026-10-20'), true, tz + ': the 7-day window starts on Oct 13, a local day');
      assert.equal(fields.matchesDate({ preset: '7' }, '2026-10-12', '2026-10-20'), false, tz + ': Oct 12 is outside the 7-day window');
      // the time scale: a domain written as date-only texts starts on that local day
      const s = scales.scaleTime({ domain: [DAY, '2026-10-25'], range: [0, 100] });
      const lo = s.domain()[0];
      assert.equal(lo.getFullYear() + '-' + (lo.getMonth() + 1) + '-' + lo.getDate(), '2026-10-18', tz + ': the time scale starts on Oct 18');
      assert.equal(Math.round(s(DAY)), 0, tz + ': Oct 18 sits at the start of the axis');
    }
  } finally { if (zone0 === undefined) delete process.env.TZ; else process.env.TZ = zone0; }

  // the browser: each chart's data table (and the parts that were already right) in each zone
  const PORT = +process.env.TEST_PORT || 9642, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewport({ width: 1100, height: 900 });
    for (const tz of ZONES) {
      await page.emulateTimezone(tz);
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const got = await page.evaluate(async (DAY) => {
        const h = React.createElement, P = window.Plenix;
        document.getElementById('main').innerHTML = '<div id="c"></div>';
        const tableOf = (id) => { const el = document.getElementById(id); const t = el && el.querySelector('.plx-chart__data'); return t ? t.textContent : ''; };
        ReactDOM.createRoot(document.getElementById('c')).render(h('div', null,
          h('div', { id: 'gantt' }, h(P.GanttChart, { title: 'Plan', tasks: [{ id: 'a', label: 'Design', start: DAY, end: '2026-10-20' }] })),
          h('div', { id: 'heat' }, h(P.HeatMap, { variant: 'calendar', title: 'Edits', data: [{ date: DAY, value: 5 }] })),
          h('div', { id: 'line' }, h(P.LineChart, { title: 'Uploads', x: 'day', xType: 'time', series: [{ id: 'n', label: 'Uploads' }], data: [{ day: DAY, n: 3 }, { day: '2026-10-19', n: 4 }] })),
          h('div', { id: 'timeline' }, h(P.TimelineChart, { title: 'Events', items: [{ id: 'x', label: 'Launch', start: DAY }] })),
          h('div', { id: 'time' }, h(P.Time, { value: DAY, format: 'date' })),
          h('div', { id: 'pick' }, h(P.DatePicker, { label: 'Day', value: DAY, onChange: () => {} }))));
        await new Promise((r) => setTimeout(r, 1500));
        const pick = document.querySelector('#pick input');
        return { gantt: tableOf('gantt'), heat: tableOf('heat'), line: tableOf('line'), timeline: tableOf('timeline'),
          time: (document.querySelector('#time time') || {}).textContent || '', timeAttr: (document.querySelector('#time time') || { getAttribute: () => '' }).getAttribute('datetime'),
          pick: pick ? pick.value : '' };
      }, DAY);
      for (const k of ['gantt', 'heat', 'line', 'timeline']) {
        assert.ok(/Oct 18\b/.test(got[k]) && !/Oct 17\b/.test(got[k]), tz + ': ' + k + ' shows Oct 18 for 2026-10-18, got ' + got[k].slice(0, 160));
      }
      assert.ok(/Oct 18/.test(got.time) && got.timeAttr === DAY, tz + ': Time stays right, got ' + got.time + ' [' + got.timeAttr + ']');
      assert.ok(/18/.test(got.pick) && /10|Oct/.test(got.pick), tz + ': DatePicker shows the 18th, got ' + got.pick);
    }
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DATE_ONLY_OK (' + ZONES.length + ' zones)');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
