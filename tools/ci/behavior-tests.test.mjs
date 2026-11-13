#!/usr/bin/env node
// Self-test of tools/ci/behavior-tests.mjs (#1327): the CI job that runs tests/run.js on every PR and in the merge group, and
// the nightly --full run. Only failures outside the quarantine (tests/quarantine.json) block; a run that never reached its
// last line fails (a test never passes on nothing); every automatic test is in exactly one CI group.
//   node tools/ci/behavior-tests.test.mjs        (CI: the process checks job)
import { createRequire } from 'node:module';
import { groups, parseRun, readQuarantine, compare } from './behavior-tests.mjs';

const require = createRequire(import.meta.url);
const { END } = require('../../tests/check.js');
let failed = 0, count = 0;
const eq = (name, got, want) => {
  count++;
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : `: ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`}`);
};

// 1. groups: every automatic test exactly once, no empty group; a test that is not automatic never runs in CI
{
  const { AUTOMATIC } = require('../../tests/run.js');
  eq('run.js exports its automatic list', Array.isArray(AUTOMATIC) && AUTOMATIC.length > 10, true);
  const g = groups(AUTOMATIC);
  const all = g.flatMap((x) => x.tests.split(' '));
  eq('every automatic test is in a group', [...AUTOMATIC].sort().filter((t) => !all.includes(t)), []);
  eq('no test is in two groups', all.filter((t, i) => all.indexOf(t) !== i), []);
  eq('no test outside the automatic list', all.filter((t) => !AUTOMATIC.includes(t)), []);
  eq('no empty group', g.filter((x) => !x.tests), []);
  eq('every group has a name', g.every((x) => /^[a-z][a-z-]*$/.test(x.name)), true);
  const extra = groups(['pages', 'new-thing-999']);
  eq('a new automatic test lands in "other"', extra, [{ name: 'pages', tests: 'pages' }, { name: 'other', tests: 'new-thing-999' }]);
  eq('a test dropped from the automatic list is dropped from its group', groups(['typography']), [{ name: 'typography', tests: 'typography' }]);
}

// 2. parseRun: the runner's last line
eq('all passed', parseRun('── pages\nok\n\nTIMES pages 3.0s · total 3.0s\nTESTS_OK 2 tests\n'), { done: true, failed: [] });
eq('two failed', parseRun('x\nTESTS_FAIL pages, data-grid\n'), { done: true, failed: ['pages', 'data-grid'] });
eq('the runner stopped before its last line', parseRun('── pages\nSegmentation fault\n'), { done: false, failed: [] });
eq('an empty log', parseRun(''), { done: false, failed: [] });
eq('a test printing TESTS_OK in the middle does not count', parseRun('TESTS_OK 1 tests\n── pages\nkilled\n'), { done: false, failed: [] });

// 3. readQuarantine: every entry has a test, an issue, an owner and a date
{
  const good = { entries: [
    { test: 'pages', issue: 1400, owner: 'engineer', since: '2026-11-13', why: 'whole test' },
    { test: 'keyboard', check: 'Toolbar: Arrow Right moves', issue: 1401, owner: 'engineer', since: '2026-11-13' },
  ] };
  eq('a valid file', readQuarantine(good).errors, []);
  eq('a valid file keeps its entries', readQuarantine(good).entries.length, 2);
  eq('an empty file is valid', readQuarantine({ entries: [] }).errors, []);
  eq('no entries list', readQuarantine({}).errors.length, 1);
  eq('no owner', readQuarantine({ entries: [{ test: 'pages', issue: 1, since: '2026-11-13' }] }).errors.length, 1);
  eq('no issue', readQuarantine({ entries: [{ test: 'pages', owner: 'engineer', since: '2026-11-13' }] }).errors.length, 1);
  eq('issue not a number', readQuarantine({ entries: [{ test: 'pages', issue: '#12', owner: 'engineer', since: '2026-11-13' }] }).errors.length, 1);
  eq('bad date', readQuarantine({ entries: [{ test: 'pages', issue: 1, owner: 'engineer', since: 'today' }] }).errors.length, 1);
  eq('no test', readQuarantine({ entries: [{ issue: 1, owner: 'engineer', since: '2026-11-13' }] }).errors.length, 1);
  eq('unknown test name, when the list is given', readQuarantine({ entries: [{ test: 'nope', issue: 1, owner: 'x', since: '2026-11-13' }] }, ['pages']).errors.length, 1);
  eq('the same entry twice', readQuarantine({ entries: [
    { test: 'pages', issue: 1, owner: 'x', since: '2026-11-13' }, { test: 'pages', issue: 2, owner: 'y', since: '2026-11-13' }] }).errors.length, 1);
}

// 4. compare: only failures outside the quarantine block
{
  const q = readQuarantine({ entries: [
    { test: 'pages', issue: 1400, owner: 'engineer', since: '2026-11-13' },
    { test: 'keyboard', check: 'Toolbar: Arrow Right moves', issue: 1401, owner: 'engineer', since: '2026-11-13' },
    { test: 'reflow', check: 'Card: fits 320px', issue: 1402, owner: 'engineer', since: '2026-11-13' },
  ] }).entries;
  const r = (test, name, ok) => ({ test, part: '', name, ok, detail: ok ? '' : 'saw x' });
  const short = (c) => ({ blocking: c.blocking.map((f) => f.test + (f.check ? ' / ' + f.check : '')), quarantined: c.quarantined.map((f) => f.issue), stale: c.stale.map((e) => e.issue) });

  eq('nothing failed', short(compare({ ran: ['pages', 'keyboard'], failed: [], results: [], quarantine: q })),
    { blocking: [], quarantined: [], stale: [1400] });
  eq('a whole quarantined test failed', short(compare({ ran: ['pages'], failed: ['pages'], results: [r('pages', 'Members: no overlap', false)], quarantine: q })),
    { blocking: [], quarantined: [1400], stale: [] });
  eq('a quarantined check failed, nothing else (the test ran to its end)', short(compare({ ran: ['keyboard'], failed: ['keyboard'],
    results: [r('keyboard', 'Toolbar: Arrow Right moves', false), r('keyboard', 'Tabs: Home', true), r('keyboard', END, true)], quarantine: q })),
    { blocking: [], quarantined: [1401], stale: [] });
  // G5a I1 on PR #1328: a quarantined check must not hide a crash, or a failure the test does not record as a check. A failed
  // test is judged by its checks only when it recorded that it ran to its end (tests/check.js ended())
  eq('a quarantined check failed and the test crashed before its end: blocks', short(compare({ ran: ['keyboard'], failed: ['keyboard'],
    results: [r('keyboard', 'Toolbar: Arrow Right moves', false), r('keyboard', 'Tabs: Home', true)], quarantine: q })),
    { blocking: ['keyboard'], quarantined: [1401], stale: [] });
  eq('a quarantined child red plus an unrecorded failure of the parent (data-grid): blocks', short(compare({ ran: ['data-grid'], failed: ['data-grid'],
    results: [r('data-grid', 'data-grid-view-169: the child test passes', false)], quarantine: q.concat([
      { test: 'data-grid', check: 'data-grid-view-169: the child test passes', issue: 1338, owner: 'engineer', since: '2026-11-13' }]) })),
    { blocking: ['data-grid'], quarantined: [1338], stale: [] });
  eq('the blocking test-level failure says why', compare({ ran: ['keyboard'], failed: ['keyboard'], results: [r('keyboard', 'Toolbar: Arrow Right moves', false)], quarantine: q })
    .blocking.map((f) => /did not reach its end/.test(f.detail)), [true]);
  eq('a test that ran to its end but failed with no failing check still blocks', short(compare({ ran: ['keyboard'], failed: ['keyboard'],
    results: [r('keyboard', 'Toolbar: Arrow Right moves', true), r('keyboard', END, true)], quarantine: q })),
    { blocking: ['keyboard'], quarantined: [], stale: [1401] });
  eq('a whole-test entry still covers a crash', short(compare({ ran: ['pages'], failed: ['pages'], results: [r('pages', 'Members: no overlap', false)], quarantine: q })),
    { blocking: [], quarantined: [1400], stale: [] });
  eq('the end record is never stale and never blocks', short(compare({ ran: ['reflow'], failed: [], results: [r('reflow', END, true)], quarantine: q })),
    { blocking: [], quarantined: [], stale: [] });
  eq('a new check failed in a test with a quarantined check', short(compare({ ran: ['keyboard'], failed: ['keyboard'],
    results: [r('keyboard', 'Toolbar: Arrow Right moves', false), r('keyboard', 'Tabs: Home', false)], quarantine: q })),
    { blocking: ['keyboard / Tabs: Home'], quarantined: [1401], stale: [] });
  eq('a test failed with no check recorded (a crash, or a test without check.js)', short(compare({ ran: ['keyboard'], failed: ['keyboard'], results: [], quarantine: q })),
    { blocking: ['keyboard'], quarantined: [], stale: [] });
  eq('a test with no quarantine failed', short(compare({ ran: ['formats'], failed: ['formats'], results: [r('formats', 'date: ar', false)], quarantine: q })),
    { blocking: ['formats / date: ar'], quarantined: [], stale: [] });
  eq('a quarantined check now passes: stale, never blocking', short(compare({ ran: ['reflow'], failed: [],
    results: [r('reflow', 'Card: fits 320px', true)], quarantine: q })),
    { blocking: [], quarantined: [], stale: [1402] });
  eq('a quarantined check that did not run this time is not stale', short(compare({ ran: ['reflow'], failed: [], results: [], quarantine: q })),
    { blocking: [], quarantined: [], stale: [] });
  eq('a check counts by its last result', short(compare({ ran: ['formats'], failed: [],
    results: [r('formats', 'date: ar', false), r('formats', 'date: ar', true)], quarantine: q })),
    { blocking: [], quarantined: [], stale: [] });
  eq('a failed check in a test the runner says passed still blocks', short(compare({ ran: ['formats'], failed: [],
    results: [r('formats', 'date: ar', false)], quarantine: q })),
    { blocking: ['formats / date: ar'], quarantined: [], stale: [] });
  eq('tests that did not run in this group are not judged', short(compare({ ran: ['formats'], failed: [], results: [], quarantine: q })),
    { blocking: [], quarantined: [], stale: [] });

  // G5a M2: an entry quarantined for more than 14 days is listed in the report, never blocking
  const aged = (today) => (compare({ ran: ['keyboard'], failed: [], results: [], quarantine: q, today }).old || []).map((e) => e.issue);
  eq('entries older than 14 days are listed', aged('2026-11-28'), [1400, 1401, 1402]);
  eq('entries of 14 days or less are not', aged('2026-11-27'), []);
  eq('no date given: no age report', compare({ ran: [], failed: [], results: [], quarantine: q }).old, []);
}

// 4. the environment: the automatic runs never open the design spec (owner, 2026-10-25; tests/run.js). The spec page loads
// Plenix from the live CDN, so a CI run that opens it waits on the network and times out (baseline run 43481282090:
// messages-chat-s6, "Navigation timeout of 30000 ms exceeded"). An automatic test, or a child that layout runs, may open it
// only behind PLENIX_SPEC=1, which an on-demand run sets
{
  const fs = require('node:fs'), path = require('node:path');
  const { AUTOMATIC } = require('../../tests/run.js');
  const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'tests');
  const children = [...fs.readFileSync(path.join(dir, 'layout.test.js'), 'utf8').matchAll(/'([a-z0-9-]+\.test\.js)'/g)].map((m) => m[1]);
  const files = [...new Set(AUTOMATIC.map((t) => t + '.test.js').concat(children))].filter((f) => fs.existsSync(path.join(dir, f)));
  eq('layout lists its children', children.length > 5, true);
  const open = files.filter((f) => {
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    return /platform\/design-system\/index\.html/.test(src) && !/process\.env\.PLENIX_SPEC\b/.test(src);
  });
  eq('no automatic test opens the design spec without PLENIX_SPEC=1', open, []);
}

// 5. narrow entries (#1327, PM note on PR #1328): a quarantine entry names the failing check, so a new failure in the same test
// still blocks. The tests whose baseline failures are named findings (a page, a property, a token, a Platform name, a child
// test) record each finding through tests/check.js; a whole-test entry says in its "why" why its test cannot be narrowed
{
  const fs = require('node:fs'), path = require('node:path');
  const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'tests');
  const shared = require('../../tests/check.js');
  eq('check.js names a child test\'s result', typeof shared.childName === 'function' && shared.childName('narrow-fit-880.test.js'), 'narrow-fit-880: the child test passes');
  eq('check.js records that a test ran to its end', typeof shared.ended === 'function' && typeof shared.END === 'string' && shared.END.length > 10, true);
  const NAMED = ['visual', 'pages', 'reflow', 'site-coverage', 'component-tokens', 'data-grid', 'keyboard', 'layout', 'typography', 'arabic-catalog-427'];
  eq('the tests with named findings record them through check.js',
    NAMED.filter((t) => !/require\('\.\/check\.js'\)/.test(fs.readFileSync(path.join(dir, t + '.test.js'), 'utf8'))), []);
  eq('data-grid runs every child, even after one fails (one red child must not hide the others)',
    /if \(result\.status !== 0\) process\.exit/.test(fs.readFileSync(path.join(dir, 'data-grid.test.js'), 'utf8')), false);
  const q = JSON.parse(fs.readFileSync(path.join(dir, 'quarantine.json'), 'utf8')).entries;
  eq('every test with a named finding records that it ran to its end (G5a I1)',
    NAMED.filter((t) => !/shared\.ended\(\)/.test(fs.readFileSync(path.join(dir, t + '.test.js'), 'utf8'))), []);
  eq('data-grid records its own table views as checks, not only its children (G5a I1)',
    /res\.forEach\(\(\[n, ok, d\]\) => shared\.record\(/.test(fs.readFileSync(path.join(dir, 'data-grid.test.js'), 'utf8')), true);
  eq('a whole-test entry says why it cannot be narrowed', q.filter((e) => !e.check && !/^whole test: /.test(e.why || '')).map((e) => e.test), []);
  eq('the tests with named findings are quarantined by check only', q.filter((e) => !e.check && NAMED.includes(e.test)).map((e) => e.test), []);
  eq('#1340 is fixed on main (#1326) and is not quarantined', q.filter((e) => e.issue === 1340).length, 0);
}

console.log(failed ? `BEHAVIOR_TESTS_TEST_FAIL (${failed} of ${count})` : `BEHAVIOR_TESTS_TEST_OK (${count})`);
process.exit(failed ? 1 : 0);
