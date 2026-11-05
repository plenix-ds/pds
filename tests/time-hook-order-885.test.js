/* Plenix tests · Time keeps its hooks in the same order when its value comes and goes (issue 885).
   Summary: one <Time> re-rendered with a value that changes between empty, invalid and valid (and in each format) renders
     nothing for no date and the text for a date, with no React error. Before #885, Time called useStrings after its
     "no date: render nothing" return, so the second render with a date after one without (or the reverse) had a different
     number of hooks and React threw "Rendered more hooks than during the previous render".
   Checks:
     1. for each format (datetime, relative, label, date, time): the values '', 'not a date', '2026-10-08T14:05:00Z', null,
        '2026-10-08T14:05:00Z' render, in that order, in the same root: no <time> without a date, one <time> with one;
     2. no page error and no React error in the console;
     3. in the source: no hook is called after the first return in Time.
   The probe is proved able to see a failure: on the code before #885 the third render of check 1 throws, and the page
     error and the console hold "Rendered more hooks than during the previous render".
   Usage: node tests/time-hook-order-885.test.js   -> TIME_HOOK_ORDER_885_OK */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { serve, launch } = require('./lib');

// the source: in the Time function, every hook call comes before its own first return
const src = fs.readFileSync(path.join(__dirname, '..', 'platform/components/Time/Time.tsx'), 'utf8');
const body = src.slice(src.indexOf('export function Time('));
const end = body.indexOf('\n}\n');
// the function's own first return: a statement at its top level (two spaces in), not one inside an effect's callback
const fn = body.slice(0, end), firstReturn = fn.search(/\n  (?:if \([^\n]*\) )?return\b/);
const lateHooks = [...fn.matchAll(/\buse[A-Z]\w*\(/g)].filter((m) => m.index > firstReturn).map((m) => m[0]);
assert.deepEqual(lateHooks, [], 'Time: no hook after its first return');

(async () => {
  const PORT = +process.env.TEST_PORT || 9685, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const VALUES = ['', 'not a date', '2026-10-08T14:05:00Z', null, '2026-10-08T14:05:00Z'];
    for (const format of ['datetime', 'relative', 'label', 'date', 'time']) {
      const seen = await page.evaluate(async (format, VALUES) => {
        const h = React.createElement, P = window.Plenix;
        document.getElementById('main').innerHTML = '<div id="c"></div>';
        const root = ReactDOM.createRoot(document.getElementById('c')), out = [];
        for (const value of VALUES) {
          try { ReactDOM.flushSync(() => root.render(h(P.Time, { value, format, now: '2026-10-08T15:00:00Z' }))); }
          catch (e) { out.push('threw: ' + e.message); continue; }
          out.push(document.querySelectorAll('#c time').length);
        }
        root.unmount();
        return out;
      }, format, VALUES);
      assert.deepEqual(seen, [0, 0, 1, 0, 1], format + ': nothing without a date, the time with one, every render: ' + JSON.stringify(seen));
    }
    assert.deepEqual(errors, [], 'no page or React error');
    console.log('TIME_HOOK_ORDER_885_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
