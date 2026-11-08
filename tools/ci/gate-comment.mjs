#!/usr/bin/env node
// A gate FAIL comment sets the gate label (#1071, part of #1068). #1060 merged with a recorded "G3: FAIL" because the
// reviewer did not also add g3-changes-requested, and only the label blocks a merge (tools/ci/check-g2.mjs).
//
// The first non-empty line of a PR comment decides, when the comment is signed by the gate's role (its last
// "— PDS1-<Role>" signature; GATES in check-g2.mjs names the role):
//   "G2: FAIL" / "G3: FAIL" (or "REQUEST CHANGES")  -> add g2-/g3-changes-requested
//   "G2: PASS" / "G3: PASS"                          -> remove it (only when check-g2 accepts the same comment as the
//                                                       role's re-review, so the removal never fails G2 on its own)
// Bold or heading marks at the start of the line are ignored. Anything else does nothing.
//
// A label set with GITHUB_TOKEN starts no workflow (lesson A-17), so after a change this re-runs the G2 check itself
// (a re-run is allowed with GITHUB_TOKEN): on the PR's head, and on its merge group when the PR is already in the
// merge queue. The re-run reads the new label, so a FAIL turns G2 red and takes a queued PR out of the queue.
//
//   PR_NUMBER=<n> COMMENT_BODY=<text> node tools/ci/gate-comment.mjs     (the gate-comment workflow; GH_TOKEN set)
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { GATES } from './check-g2.mjs';

const LABEL = { 2: 'g2-changes-requested', 3: 'g3-changes-requested' };

// body: the comment text, labels: the PR's label names -> { add: label } | { remove: label } | null
export function decide(body, labels) {
  const first = String(body || '').split('\n').map((l) => l.trim()).find((l) => l) || '';
  const m = /^[#*_\s]*G([23])\s*:\s*\**\s*(FAIL|PASS|REQUEST CHANGES)\b/.exec(first);
  if (!m) return null;
  const label = LABEL[m[1]];
  const gate = GATES[label];
  const signer = [...String(body).matchAll(/—\s*PDS1-([A-Za-z0-9-]+)/g)].pop()?.[1];
  if (!gate || signer?.toLowerCase() !== gate.role.toLowerCase()) return null;
  if (m[2] === 'PASS') return labels.includes(label) && gate.signed(body) ? { remove: label } : null;
  return labels.includes(label) ? null : { add: label };
}

const repo = process.env.GITHUB_REPOSITORY || 'plenix-ds/pds';
const gh = (...args) => execFileSync('gh', args, { encoding: 'utf8' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// re-run the newest G2 run for one commit and event; waits for a run in progress to finish first (a re-run needs a
// finished run). Returns what it did, for the log.
async function rerunG2(sha, event) {
  for (let i = 0; i < 18; i++) {
    const runs = JSON.parse(gh('api', `repos/${repo}/actions/workflows/g2.yml/runs?head_sha=${sha}&event=${event}&per_page=5`)).workflow_runs;
    const run = runs.sort((a, b) => b.id - a.id)[0];
    if (!run) return `no G2 run on ${sha.slice(0, 9)} (${event})`;
    if (run.status === 'completed') { gh('api', '-X', 'POST', `repos/${repo}/actions/runs/${run.id}/rerun`); return `G2 run ${run.id} re-run (${event})`; }
    await sleep(10_000);
  }
  throw new Error(`G2 on ${sha.slice(0, 9)} (${event}) did not finish within 3 minutes`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const n = process.env.PR_NUMBER;
  if (!/^\d+$/.test(n || '')) { console.log('GATE_COMMENT_FAIL: PR_NUMBER is not set'); process.exit(1); }
  const [owner, name] = repo.split('/');
  const q = `query($o: String!, $r: String!, $n: Int!) { repository(owner: $o, name: $r) { pullRequest(number: $n) {
    state headRefOid isInMergeQueue mergeQueueEntry { headCommit { oid } } labels(first: 100) { nodes { name } } } } }`;
  const read = () => JSON.parse(gh('api', 'graphql', '-f', `query=${q}`, '-F', `o=${owner}`, '-F', `r=${name}`, '-F', `n=${n}`)).data.repository.pullRequest;
  let pr;
  try { pr = read(); } catch (e) { console.log(`GATE_COMMENT_FAIL: could not read PR #${n}: ${String(e.message).split('\n')[0]}`); process.exit(1); }
  if (pr.state !== 'OPEN') { console.log(`GATE_COMMENT_OK: PR #${n} is ${pr.state.toLowerCase()}, nothing to do`); process.exit(0); }
  const action = decide(process.env.COMMENT_BODY || '', pr.labels.nodes.map((l) => l.name));
  if (!action) { console.log(`GATE_COMMENT_OK: no signed gate verdict that changes a label on PR #${n}`); process.exit(0); }
  try {
    if (action.add) gh('api', '-X', 'POST', `repos/${repo}/issues/${n}/labels`, '-f', `labels[]=${action.add}`);
    else gh('api', '-X', 'DELETE', `repos/${repo}/issues/${n}/labels/${action.remove}`);
    console.log(`PR #${n}: ${action.add ? `added ${action.add}` : `removed ${action.remove}`}`);
    // the queue state is read after the label change, so a PR queued meanwhile is covered too
    pr = read();
    console.log(await rerunG2(pr.headRefOid, 'pull_request'));
    if (pr.isInMergeQueue && pr.mergeQueueEntry?.headCommit?.oid) console.log(await rerunG2(pr.mergeQueueEntry.headCommit.oid, 'merge_group'));
  } catch (e) { console.log(`GATE_COMMENT_FAIL: ${String(e.message).split('\n')[0]}`); process.exit(1); }
  console.log(`GATE_COMMENT_OK: PR #${n} ${action.add ? `blocked by ${action.add}` : `cleared of ${action.remove}`}`);
}
