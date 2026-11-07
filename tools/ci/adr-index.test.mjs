#!/usr/bin/env node
// Self-test of tools/ci/adr-index.mjs (#956): a well-formed ADR folder passes and prints one row per ADR in number order;
// a missing status, a repeated number, a title whose number differs from the file's, and a committed index table fail.
//   node tools/ci/adr-index.test.mjs        (CI: the Decisions job, before the check itself)
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.join(dir, 'fixtures', 'adr');
const run = (folder, args) => spawnSync(process.execPath, [path.join(dir, 'adr-index.mjs'), ...args], {
  env: { ...process.env, ADR_DIR: path.join(fixtures, folder) }, encoding: 'utf8',
});
const cases = [
  ['ok', ['--check'], 0, /ADR_INDEX_OK \(3 ADRs\)/],
  ['no-status', ['--check'], 1, /0002-none\.md: no "- \*\*Status:\*\*" line/],
  ['dup-number', ['--check'], 1, /0001 is used by 2 files/],
  ['title-mismatch', ['--check'], 1, /0001-first\.md: the title says ADR 0002/],
  ['readme-table', ['--check'], 1, /README\.md lists ADRs in a table/],
];
let failed = 0;
for (const [folder, args, want, pattern] of cases) {
  const r = run(folder, args), out = r.stdout + r.stderr;
  const ok = r.status === want && pattern.test(out);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${folder} ${args.join(' ')}: exit ${r.status}, expected ${want}${ok ? '' : `\n${out}`}`);
}
// the printed index: a header and one row per ADR, in number order, status as written
const table = run('ok', []).stdout.trim().split('\n');
const rows = ['| ADR | Title | Status |', '|---|---|---|',
  '| [0001](0001-first.md) | First decision | accepted |',
  '| [0002](0002-second.md) | Second `code` decision | superseded by 0003 |',
  '| [0003](0003-third.md) | Third | proposed |'];
const same = JSON.stringify(table) === JSON.stringify(rows);
if (!same) failed++;
console.log(`${same ? 'PASS' : 'FAIL'} ok (print): the table${same ? '' : `\n${table.join('\n')}`}`);
console.log(failed ? `ADR_INDEX_TEST_FAIL (${failed})` : `ADR_INDEX_TEST_OK (${cases.length + 1})`);
process.exit(failed ? 1 : 0);
