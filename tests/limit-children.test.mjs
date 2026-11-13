// Plenix tests · a parent test's time limit counts only its own work, never the time its child tests take (#1327).
// Layout, the DataGrid and Reflow run their child tests one after another with spawnSync; each child has its own limit.
// In run 43500024802 Layout's 15-minute limit fired at 1230s, right after its last child passed: the children's 20
// minutes had been charged to the parent. This runs a parent whose children together outlast its limit and expects it
// to finish; a parent whose own work outlasts the limit still times out.
//   node tests/limit-children.test.mjs
import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LIMIT = require_limit();
function require_limit() { return path.join(path.dirname(fileURLToPath(import.meta.url)), 'limit.js'); }
const dir = mkdtempSync(path.join(tmpdir(), 'limit-children-'));
const run = (name, body, limitMs) => {
  const file = path.join(dir, name + '.test.js');
  writeFileSync(file, `const limit = require(${JSON.stringify(LIMIT)});\n${body}\n`);
  const r = spawnSync(process.execPath, [file], { encoding: 'utf8', env: { ...process.env, TEST_TIMEOUT_MS: String(limitMs) } });
  return { status: r.status, out: r.stdout + r.stderr };
};
// a child that takes 700ms, run three times by a parent with a 1000ms limit: 2.1s of children, a few ms of its own work
const childFile = path.join(dir, 'slow-child.js');
writeFileSync(childFile, 'setTimeout(() => process.exit(0), 700);\n');
const spawnChild = `require('child_process').spawnSync(process.execPath, [${JSON.stringify(childFile)}], { stdio: 'inherit' })`;
try {
  const ok = run('parent', `for (let i = 0; i < 3; i++) limit.excluding(() => ${spawnChild});\nsetTimeout(() => { console.log('PARENT_DONE'); process.exit(0); }, 50);`, 1000);
  assert.equal(ok.status, 0, 'a parent whose children outlast its limit finishes: ' + ok.out);
  assert.match(ok.out, /PARENT_DONE/);
  assert.doesNotMatch(ok.out, /timed out/);

  const excludingReturns = run('returns', `const r = limit.excluding(() => 42); console.log('RESULT ' + r);`, 1000);
  assert.match(excludingReturns.out, /RESULT 42/, 'excluding returns what the work returns');

  const slow = run('stuck', `limit.excluding(() => ${spawnChild});\nsetTimeout(() => { console.log('PARENT_DONE'); process.exit(0); }, 1500);`, 1000);
  assert.equal(slow.status, 1, 'a parent whose own work outlasts its limit still times out: ' + slow.out);
  assert.match(slow.out, /STUCK_FAIL timed out after 1s/);
  assert.doesNotMatch(slow.out, /PARENT_DONE/);
  console.log('LIMIT_CHILDREN_OK');
} finally {
  rmSync(dir, { recursive: true, force: true });
}
