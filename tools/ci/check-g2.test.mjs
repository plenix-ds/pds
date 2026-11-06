#!/usr/bin/env node
// Self-test of tools/ci/check-g2.mjs (#621; D-0056, D-0062): a removed changes-requested label needs the owning role's
// signed re-review, posted after the label was last added and after the PR's newest commit.
//   node tools/ci/check-g2.test.mjs        (CI: the G2 job, before the check itself)
import { decide } from './check-g2.mjs';

const t = (m) => `2026-11-06T${m}:00Z`;
const lab = (name, at) => ({ type: 'LabeledEvent', label: name, at: t(at) });
const unlab = (name, at) => ({ type: 'UnlabeledEvent', label: name, at: t(at) });
const note = (body, at) => ({ type: 'IssueComment', body, at: t(at) });
const commit = (at, merge = false) => ({ at: t(at), merge });
const G3_OK = 'Re-checked the fix.\n\nG3: PASS\n\n— PDS1-DS-Architect';
const G2_OK = 'G2: the change conforms to DESIGN.md.\n\n— PDS1-Design-Director';

const cases = [
  ['never labeled: pass', { labels: [], events: [], commits: [commit('10:00')] }, true],
  ['label on the PR: fail', { labels: ['g3-changes-requested'], events: [lab('g3-changes-requested', '10:05')], commits: [commit('10:00')] }, false],
  ['g3 removed without a sign-off (#611, #619): fail',
    { labels: [], events: [lab('g3-changes-requested', '10:05'), unlab('g3-changes-requested', '10:20')], commits: [commit('10:15')] }, false],
  ['g3 removed after the DS Architect signed G3: PASS: pass',
    { labels: [], events: [lab('g3-changes-requested', '10:05'), note(G3_OK, '10:18'), unlab('g3-changes-requested', '10:20')], commits: [commit('10:15')] }, true],
  ['g3 sign-off by another role: fail',
    { labels: [], events: [lab('g3-changes-requested', '10:05'), note('G3: PASS\n\n— PDS1-Component-Engineer', '10:18'), unlab('g3-changes-requested', '10:20')], commits: [commit('10:15')] }, false],
  ['g3 sign-off older than the newest commit: fail',
    { labels: [], events: [lab('g3-changes-requested', '10:05'), note(G3_OK, '10:18'), unlab('g3-changes-requested', '10:20')], commits: [commit('10:15'), commit('10:30')] }, false],
  ['a merge commit from main after the sign-off does not count: pass',
    { labels: [], events: [lab('g3-changes-requested', '10:05'), note(G3_OK, '10:18'), unlab('g3-changes-requested', '10:20')], commits: [commit('10:15'), commit('10:30', true)] }, true],
  ['sign-off from before the label was added again: fail',
    { labels: [], events: [lab('g3-changes-requested', '10:05'), note(G3_OK, '10:18'), unlab('g3-changes-requested', '10:20'), lab('g3-changes-requested', '10:40'), unlab('g3-changes-requested', '10:50')], commits: [commit('10:15')] }, false],
  ['g2 removed after the Design Director signed G2 conforms: pass',
    { labels: [], events: [lab('g2-changes-requested', '10:05'), note(G2_OK, '10:18'), unlab('g2-changes-requested', '10:20')], commits: [commit('10:15')] }, true],
  ['g2 removed with only a G3 sign-off: fail',
    { labels: [], events: [lab('g2-changes-requested', '10:05'), note(G3_OK, '10:18'), unlab('g2-changes-requested', '10:20')], commits: [commit('10:15')] }, false],
  ['a review body counts as a sign-off: pass',
    { labels: [], events: [lab('g3-changes-requested', '10:05'), { type: 'PullRequestReview', body: G3_OK, at: t('10:18') }, unlab('g3-changes-requested', '10:20')], commits: [commit('10:15')] }, true],
];
let failed = 0;
for (const [name, data, want] of cases) {
  const r = decide(data);
  const ok = r.ok === want;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : `: got ${JSON.stringify(r)}`}`);
}
console.log(failed ? `G2_TEST_FAIL (${failed})` : `G2_TEST_OK (${cases.length})`);
process.exit(failed ? 1 : 0);
