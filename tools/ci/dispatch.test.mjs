#!/usr/bin/env node
// Self-test of deploy/agents/dispatch.mjs (#895; template v2.4 §6.2, §6.4): a round with
// open work is never quiet, and an unanswered S1/S2 is named to its role until the role answers.
//   node tools/ci/dispatch.test.mjs        (CI: the Process checks job)
import { openWork, answered, unanswered, round, OVERDUE_MIN } from '../../deploy/agents/dispatch.mjs';

let failed = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : `\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`}`);
};
const issue = (number, labels, createdAt = '2026-11-07T04:00:00Z', comments = []) =>
  ({ number, labels: labels.map((name) => ({ name })), createdAt, comments });
const now = Date.parse('2026-11-07T15:00:00Z');

// the 2026-11-07 outage, as a fixture: nothing changed since the last round, no PR open, an S1 open for a role
const outage = [issue(893, ['type:bug', 'sev:S1', 'agent:pds1-ds-architect'])];
check('round: an open S1 for a role with no recent updates and no PR is NOT quiet (#895)',
  round({ issues: outage, openPrs: 0, changedSinceLast: false }), { quiet: false, wakeAll: false, coordinators: false, roles: ['ds-architect'] });
check('round: nothing open, no PR, no change -> quiet',
  round({ issues: [], openPrs: 0, changedSinceLast: false }), { quiet: true, wakeAll: false, coordinators: false, roles: [] });
check('round: later and blocked issues are not work -> quiet',
  round({ issues: [issue(1, ['agent:pds1-release-architect', 'later']), issue(2, ['agent:pds1-ds-architect', 'blocked'])], openPrs: 0, changedSinceLast: false }).quiet, true);
check('round: an open PR wakes only the coordinators, never every idle session (D-0155)',
  round({ issues: [], openPrs: 2, changedSinceLast: false }), { quiet: false, wakeAll: false, coordinators: true, roles: [] });
check('round: a change since the last round wakes the coordinators, not everyone (D-0155)',
  [round({ issues: [], openPrs: 0, changedSinceLast: true }).wakeAll, round({ issues: [], openPrs: 0, changedSinceLast: true }).coordinators], [false, true]);
check('round: most severe role first',
  round({ issues: [issue(5, ['sev:S3', 'agent:pds1-i18n-engineer']), issue(6, ['sev:S2', 'agent:pds1-qa-engineer'])], openPrs: 0, changedSinceLast: false }).roles,
  ['qa-engineer', 'i18n-engineer']);

check('work: one issue with two role labels counts for both',
  [...openWork([issue(894, ['sev:S1', 'agent:pds1-ds-architect', 'agent:pds1-release-architect'])])].map(([r, w]) => `${r}:${w.sev}:${w.numbers}`),
  ['ds-architect:1:894', 'release-architect:1:894']);

const signed = issue(893, ['sev:S1', 'agent:pds1-ds-architect'], '2026-11-07T04:00:00Z',
  [{ createdAt: '2026-11-07T04:10:00Z', body: 'Claiming.\n\n— PDS1-DS-Architect' }]);
check('answered: a comment signed by the role after it opened', answered(signed, 'ds-architect'), true);
check('answered: another role\'s signature does not count',
  answered(issue(893, ['sev:S1'], '2026-11-07T04:00:00Z', [{ createdAt: '2026-11-07T05:00:00Z', body: '— PDS1-Delivery-Lead' }]), 'ds-architect'), false);
check('answered: a comment before it opened does not count',
  answered(issue(893, ['sev:S1'], '2026-11-07T04:00:00Z', [{ createdAt: '2026-11-07T03:00:00Z', body: '— PDS1-DS-Architect' }]), 'ds-architect'), false);
check('answered: the registry title signs too ("Backend & Release Architect")',
  answered(issue(9, ['sev:S2'], '2026-11-07T04:00:00Z', [{ createdAt: '2026-11-07T05:00:00Z', body: '— PDS1-Backend-Release-Architect' }]), 'release-architect', [], 'Backend & Release Architect'), true);
check('answered: a PR that mentions the issue', answered(issue(893, ['sev:S1']), 'ds-architect', [{ title: 'Fix types (#893)', body: '' }]), true);
check('answered: #8930 is not #893', answered(issue(893, ['sev:S1']), 'ds-architect', [{ title: 'x', body: 'Closes #8930' }]), false);

const open = unanswered([...outage, issue(10, ['sev:S3', 'agent:pds1-ds-architect']), issue(11, ['sev:S2', 'agent:pds1-qa-engineer'], '2026-11-07T14:50:00Z')], [], now);
check('unanswered: S1/S2 only, oldest S1 first, with minutes since it opened',
  open.map((u) => `${u.role}:#${u.number}:S${u.sev}:${u.minutes}`), ['ds-architect:#893:S1:660', 'qa-engineer:#11:S2:10']);
check('unanswered: overdue past OVERDUE_MIN', open.filter((u) => u.minutes > OVERDUE_MIN).map((u) => u.number), [893]);
check('unanswered: a signed answer clears it', unanswered([signed], [], now), []);


console.log(failed ? `DISPATCH_TEST_FAIL: ${failed} failed` : 'DISPATCH_TEST_OK');
process.exit(failed ? 1 : 0);
