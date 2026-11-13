#!/usr/bin/env node
// Self-test of tools/ci/behavior-tests.mjs (#1327): the CI job that runs tests/run.js on every PR and in the merge group, and
// the nightly --full run. Only failures outside the quarantine (tests/quarantine.json) block; a run that never reached its
// last line fails (a test never passes on nothing); every automatic test is in exactly one CI group.
//   node tools/ci/behavior-tests.test.mjs        (CI: the process checks job)
import { createRequire } from 'node:module';
import { groups, parseRun, readQuarantine, compare } from './behavior-tests.mjs';

const require = createRequire(import.meta.url);
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
  eq('a quarantined check failed, nothing else', short(compare({ ran: ['keyboard'], failed: ['keyboard'],
    results: [r('keyboard', 'Toolbar: Arrow Right moves', false), r('keyboard', 'Tabs: Home', true)], quarantine: q })),
    { blocking: [], quarantined: [1401], stale: [] });
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
}

console.log(failed ? `BEHAVIOR_TESTS_TEST_FAIL (${failed} of ${count})` : `BEHAVIOR_TESTS_TEST_OK (${count})`);
process.exit(failed ? 1 : 0);
