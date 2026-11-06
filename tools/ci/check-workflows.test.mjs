#!/usr/bin/env node
// Self-test of check 16 (tools/ci/check-workflows.mjs) and the watchdog's age rule (tools/ci/watchdog.mjs) (#772;
// template v2.4 §6.1, §9).
//   node tools/ci/check-workflows.test.mjs        (CI: the Process checks job)
import { checkWorkflows } from './check-workflows.mjs';
import { heartbeatAge } from './watchdog.mjs';

let failed = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : `\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`}`);
};
const wf = (on, steps, env = {}) => ({ on, jobs: { j: { name: 'CI result', env, steps } } });
const tok = { GH_TOKEN: '${{ github.token }}' };

check('16: a required workflow with merge_group passes',
  checkWorkflows({ 'ci.yml': wf({ pull_request: null, merge_group: null }, [{ run: 'echo ok' }]) }, ['CI result']), []);
check('16: a required workflow without merge_group fails',
  checkWorkflows({ 'ci.yml': wf({ pull_request: null }, [{ run: 'echo ok' }]) }, ['CI result']).map((e) => e.what), ['merge_group']);
check('16: a workflow nobody requires needs no merge_group',
  checkWorkflows({ 'x.yml': { on: { pull_request: null }, jobs: { a: { name: 'Other', steps: [] } } } }, ['CI result']), []);
check('16: a label added with GITHUB_TOKEN is a defect',
  checkWorkflows({ 'x.yml': { on: { schedule: null }, jobs: { a: { steps: [{ env: tok, run: 'gh issue edit 5 --add-label agent:pds1-qa-engineer' }] } } } }, []).map((e) => e.what), ['handoff']);
check('16: a tag pushed with the job token is a defect',
  checkWorkflows({ 'x.yml': { on: { push: null }, jobs: { a: { env: { GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}' }, steps: [{ run: 'git push origin "refs/tags/v1.0.0"' }] } } } }, []).map((e) => e.what), ['handoff']);
check('16: a hand-off that ends with an explicit dispatch passes',
  checkWorkflows({ 'x.yml': { on: { schedule: null }, jobs: { a: { steps: [{ env: tok, run: 'gh issue create --label process -t x -b y\ngh workflow run dashboard.yml' }] } } } }, []), []);
check('16: a hand-off with another token (the App, a PAT) passes',
  checkWorkflows({ 'x.yml': { on: { schedule: null }, jobs: { a: { steps: [{ env: { GH_TOKEN: '${{ steps.app.outputs.token }}' }, run: 'gh pr edit 3 --add-label qa-passed' }] } } } }, []), []);

const body = (iso) => `Dispatcher heartbeat\n\nLast run: ${iso}\n`;
const now = Date.parse('2026-11-06T22:00:00Z');
check('watchdog: age in minutes from "Last run:"', heartbeatAge(body('2026-11-06T21:35:00Z'), now), 25);
check('watchdog: no "Last run:" line is infinitely old', heartbeatAge('nothing here', now), Infinity);

console.log(failed ? `WORKFLOWS_TEST_FAIL (${failed})` : 'WORKFLOWS_TEST_OK (9)');
process.exit(failed ? 1 : 0);
