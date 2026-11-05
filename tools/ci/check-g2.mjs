#!/usr/bin/env node
// Gates G2 and G3 (plan §3; D-0056; #396, #449): a PR labeled `g2-changes-requested` (Design Director) or
// `g3-changes-requested` (DS Architect) can't merge. Only the role that adds its label removes it.
//
//   PR_LABELS='["…"]' node tools/ci/check-g2.mjs                         (a pull_request run: the PR's labels)
//   MERGE_BRANCH=gh-readonly-queue/main/pr-<n>-<sha> node tools/ci/check-g2.mjs   (a merge_group run: no PR payload, so
//                                                                          the PR is read from the queue branch's name)
// A label lookup that fails is a FAIL, never a pass.
import { execFileSync } from 'node:child_process';

// one list (#449): each label blocks the merge until the role that adds it removes it
const GATES = {
  'g2-changes-requested': "The Design Director's G2 review asks for changes. Make them; the Director re-checks and removes the label (D-0056).",
  'g3-changes-requested': "The DS Architect's G3 review asks for API changes. Make them; the DS Architect re-checks and removes the label (#449).",
};
let labels;
if (process.env.PR_LABELS) {
  try { labels = JSON.parse(process.env.PR_LABELS); } catch { console.log('G2_FAIL: PR_LABELS is not JSON'); process.exit(1); }
} else if (process.env.MERGE_BRANCH) {
  const m = /\/pr-(\d+)-/.exec(process.env.MERGE_BRANCH);
  if (!m) { console.log(`G2_FAIL: no PR number in the queue branch "${process.env.MERGE_BRANCH}"`); process.exit(1); }
  try {
    labels = JSON.parse(execFileSync('gh', ['pr', 'view', m[1], '-R', process.env.GITHUB_REPOSITORY || 'plenix-ds/pds', '--json', 'labels', '-q', '[.labels[].name]'], { encoding: 'utf8' }));
  } catch (e) { console.log(`G2_FAIL: could not read the labels of PR #${m[1]}: ${String(e.message).split('\n')[0]}`); process.exit(1); }
  console.log(`merge queue: PR #${m[1]}`);
} else { console.log('G2_FAIL: neither PR_LABELS nor MERGE_BRANCH is set'); process.exit(1); }

const open = Object.keys(GATES).filter((l) => labels.includes(l));
for (const l of open) console.log(`::error title=${l}::${GATES[l]} (label ${l})`);
if (open.length) { console.log(`G2_FAIL (${open.join(', ')})`); process.exit(1); }
console.log(`G2_OK (no ${Object.keys(GATES).join(' or ')} label)`);
