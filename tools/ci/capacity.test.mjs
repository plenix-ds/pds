#!/usr/bin/env node
// Self-test of deploy/agents/capacity.mjs (#769; template v2.4 §5.2, §6.2): idle exit from the activity record, reserved
// gate slots and the start order.
//   node tools/ci/capacity.test.mjs        (CI: the Process checks job)
import { idleFor, admit, PRIORITY } from '../../deploy/agents/capacity.mjs';

let failed = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : `\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`}`);
};
const now = 10_000;
check('idle: a finished turn is idle since its Stop', idleFor({ state: 'idle', t: now - 400 }, now), 400);
check('idle: a working session is never idle, however old the record', idleFor({ state: 'working', t: now - 3000 }, now), 0);
check('idle: a working record older than 3 hours is idle (a crashed session)', idleFor({ state: 'working', t: now - 4 * 3600 }, now), 4 * 3600);
check('idle: no record -> null (the screen is the fallback)', idleFor(null, now), null);

check('order: the priority list', PRIORITY, ['release', 'integrate', 'verify', 'build', 'design', 'spec', 'evergreen']);
const c = (role, priority, gate, sev, oldest) => ({ role, n: '', priority, gate, sev, oldest, count: 1 });
const cands = [c('component-engineer', 'build', false, 1, '2026-11-01'), c('qa-engineer', 'verify', true, 3, '2026-11-05'),
  c('release-architect', 'release', true, 4, '2026-11-06'), c('design-director', 'design', false, 2, '2026-11-02')];
check('admit: priority first, then severity; builders cannot take the reserved slots',
  admit(cands, { slots: 3, reservedLeft: 2, mem: 99, perAgentGb: 2, minFreeGb: 1 }).map((x) => `${x.role}:${x.verdict}`),
  ['release-architect:start', 'qa-engineer:start', 'component-engineer:start', 'design-director:no-slot']);
check('admit: with every free slot reserved, builders wait even though slots are free',
  admit(cands.filter((x) => !x.gate), { slots: 2, reservedLeft: 2, mem: 99, perAgentGb: 2, minFreeGb: 1 }).map((x) => `${x.role}:${x.verdict}`),
  ['component-engineer:reserved', 'design-director:reserved']);
check('admit: memory still limits',
  admit(cands, { slots: 4, reservedLeft: 0, mem: 5, perAgentGb: 2, minFreeGb: 2 }).map((x) => `${x.role}:${x.verdict}`),
  ['release-architect:start', 'qa-engineer:memory', 'component-engineer:memory', 'design-director:memory']);

console.log(failed ? `CAPACITY_TEST_FAIL (${failed})` : 'CAPACITY_TEST_OK (8)');
process.exit(failed ? 1 : 0);
