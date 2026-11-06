#!/usr/bin/env node
// Self-test of checks 13 and 15 (#768; template v2.4 §5.1, §9): tools/ci/check-roles.mjs and check-settings-prose.mjs.
//   node tools/ci/check-roles.test.mjs        (CI: the Process checks job, before the checks)
import { checkRoles, settingsInProse, flattenSettings } from '../../deploy/agents/registry.mjs';

let failed = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : `\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`}`);
};
const role = (o = {}) => ({ id: 'qa-engineer', title: 'QA Engineer', kind: 'task', label: 'agent:pds1-qa-engineer', instances: 1,
  parked: false, boot: false, definition: '.claude/agents/pds1-qa-engineer.md', wakes_on: ['issue_labeled'], ...o });
const env = { exists: (f) => f === '.claude/agents/pds1-qa-engineer.md', labels: new Set(['agent:pds1-qa-engineer']),
  definitions: ['pds1-qa-engineer'], described: ['pds1-qa-engineer'] };

// check 13
check('13: a complete role passes', checkRoles({ roles: [role()] }, env), []);
check('13: no definition file, no label on GitHub, no trigger',
  checkRoles({ roles: [role({ definition: '.claude/agents/pds1-nobody.md', label: 'agent:pds1-nobody', wakes_on: [] })] }, env).map((e) => e.what),
  ['label', 'definition', 'wakes_on', 'label']);
check('13: an unknown trigger and a bad kind',
  checkRoles({ roles: [role({ kind: 'sometimes', wakes_on: ['when_asked'] })] }, env).map((e) => e.what), ['kind', 'wakes_on']);
check('13: a role described in CLAUDE.md or with a definition file but no registry entry',
  checkRoles({ roles: [role()] }, { ...env, described: ['pds1-qa-engineer', 'pds1-ghost'], definitions: ['pds1-qa-engineer', 'pds1-spare'] }).map((e) => `${e.what}:${e.id}`),
  ['missing:ghost', 'missing:spare']);
check('13: a parked role needs only an entry and a definition',
  checkRoles({ roles: [role({ parked: true, wakes_on: [], label: 'agent:pds1-qa-engineer' })] }, env), []);
check('13: an id used twice', checkRoles({ roles: [role(), role()] }, env).map((e) => e.what), ['duplicate']);

// check 15
const settings = flattenSettings({ long_work: { max_running: 8 }, small_tasks: { max_minutes: 15, max_running: 'unlimited' },
  memory: { per_agent_limit_gb: 2.5 }, roles: [] });
check('15: settings are the numeric leaves, roles left out',
  settings, { 'long_work.max_running': 8, 'small_tasks.max_minutes': 15, 'memory.per_agent_limit_gb': 2.5 });
check('15: a document that states another value fails, one that names the setting passes',
  settingsInProse({ 'CLAUDE.md': '- at most 4 sessions on long work;\n- at most `long_work.max_running` sessions on long work;',
    'plan.md': 'The long-work limit (4), the small-task time cap (15 min).\nEach capped at 30 minutes.' }, settings)
    .map((m) => `${m.file}:${m.line} ${m.setting} ${m.stated}`),
  ['CLAUDE.md:1 long_work.max_running 4', 'plan.md:1 long_work.max_running 4', 'plan.md:2 small_tasks.max_minutes 30']);
check('15: the key written with another value fails',
  settingsInProse({ 'a.md': 'Set `per_agent_limit_gb: 1.5` on the VM.' }, settings).map((m) => m.stated), ['1.5']);
check('15: the same value passes (naming it is still better)', settingsInProse({ 'a.md': 'at most 8 sessions on long work' }, settings), []);

console.log(failed ? `ROLES_TEST_FAIL (${failed})` : 'ROLES_TEST_OK (10)');
process.exit(failed ? 1 : 0);
