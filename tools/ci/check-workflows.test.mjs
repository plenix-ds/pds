#!/usr/bin/env node
// Self-test of check 16 (tools/ci/check-workflows.mjs) (#772; template v2.4 §6.1, §9), and that the retired PDS1
// heartbeat watchdog stays retired (#1312).
//   node tools/ci/check-workflows.test.mjs        (CI: the Process checks job)
import { checkWorkflows } from './check-workflows.mjs';
import fs from 'node:fs';

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

// #1312 (D-0175): the PDS1 poller that rewrote the heartbeat issue (#809) was stopped at the PDS2 cutover; the host's
// watcher wakes the PM instead. No workflow may watch that heartbeat again, or it raises a P0 every hour for nothing.
const wfDir = new URL('../../.github/workflows/', import.meta.url);
const watchers = fs.readdirSync(wfDir).filter((f) => /\.ya?ml$/.test(f))
  .filter((f) => /watchdog\.mjs|heartbeat_issue|dispatcher heartbeat/i.test(fs.readFileSync(new URL(f, wfDir), 'utf8')));
check('#1312: no workflow watches the retired PDS1 heartbeat', watchers, []);
check('#1312: the PDS1 watchdog script is gone', fs.existsSync(new URL('./watchdog.mjs', import.meta.url)), false);

console.log(failed ? `WORKFLOWS_TEST_FAIL (${failed})` : 'WORKFLOWS_TEST_OK (9)');
process.exit(failed ? 1 : 0);
