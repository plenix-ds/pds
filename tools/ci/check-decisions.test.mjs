#!/usr/bin/env node
// Self-test of tools/ci/check-decisions.mjs (#589): the three YAML breaks that took the dashboard down (#585) must fail the
// check, the same way the dashboard's yaml.safe_load (PyYAML) fails on them; a valid file must pass.
//   node tools/ci/check-decisions.test.mjs        (CI: the Decisions job, before the check itself)
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.join(dir, 'fixtures', 'decisions');
const cases = [
  ['ok.yaml', 0],
  ['flow-braces.yaml', 1],      // { … } followed by more text inside a flow list
  ['flow-bare-quote.yaml', 1],  // a bare "…" followed by more text inside a flow list
  ['single-quote.yaml', 1],     // an apostrophe inside a single-quoted value, not doubled
];
let failed = 0;
for (const [file, want] of cases) {
  const r = spawnSync(process.execPath, [path.join(dir, 'check-decisions.mjs')], {
    env: { ...process.env, DECISIONS_FILE: path.join(fixtures, file) }, encoding: 'utf8',
  });
  const ok = r.status === want && (want === 0 || /not valid YAML/.test(r.stdout));
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${file}: exit ${r.status}, expected ${want}${ok ? '' : `\n${r.stdout}${r.stderr}`}`);
}
console.log(failed ? `DECISIONS_TEST_FAIL (${failed})` : `DECISIONS_TEST_OK (${cases.length})`);
process.exit(failed ? 1 : 0);
