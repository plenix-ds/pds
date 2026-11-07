#!/usr/bin/env node
// Self-test of tools/ci/check-release-notes.mjs (#884): a version PR whose merge group still holds a changelog fragment
// fails (0.91.0, 0.92.0 and 0.93.0 each shipped a late fragment without its line); every other case passes.
//   node tools/ci/check-release-notes.test.mjs        (CI: the process checks job)
import { leftFragments } from './check-release-notes.mjs';

const cases = [
  // [name, input, fragments the check must report]
  ['version PR, folded', { baseVersion: '0.92.0', headVersion: '0.93.0', files: ['README.md'] }, []],
  ['version PR, a fragment merged ahead in the queue', { baseVersion: '0.92.0', headVersion: '0.93.0', files: ['README.md', '353-bv.md'] }, ['353-bv.md']],
  ['ordinary PR with fragments', { baseVersion: '0.93.0', headVersion: '0.93.0', files: ['README.md', '900-x.md', '901-y.md'] }, []],
  ['version PR, only non-fragment files', { baseVersion: '0.92.0', headVersion: '0.93.0', files: ['README.md', '.gitkeep'] }, []],
];
let failed = 0;
for (const [name, input, want] of cases) {
  const got = leftFragments(input);
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${JSON.stringify(got)}${ok ? '' : `, expected ${JSON.stringify(want)}`}`);
}
console.log(failed ? `RELEASE_NOTES_TEST_FAIL (${failed})` : `RELEASE_NOTES_TEST_OK (${cases.length})`);
process.exit(failed ? 1 : 0);
