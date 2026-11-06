#!/usr/bin/env node
// Gates G2 and G3 (plan §3; D-0056, D-0062; #396, #449, #621): a PR labeled `g2-changes-requested` (Design Director) or
// `g3-changes-requested` (DS Architect) can't merge. Only the role that adds its label removes it.
//
// All agents share one GitHub account, so who removed a label can't be read from GitHub (#621). Instead, once a label
// has been on the PR and is gone, the owning role's signed re-review must exist: a comment or review body that is
//   g3: signed "— PDS1-DS-Architect" and says "G3: PASS" on one line ("G3: PASS on <sha>", "G3 still PASS" count);
//   g2: signed "— PDS1-Design-Director", names "G2" and says "conforms" or "PASS";
// posted after the label was last added and after the PR's newest commit (merge commits from main don't count).
// Order for the reviewer: post the sign-off, then remove the label (the removal re-runs this check).
//
//   PR_NUMBER=<n> node tools/ci/check-g2.mjs                                    (a pull_request run)
//   MERGE_BRANCH=gh-readonly-queue/main/pr-<n>-<sha> node tools/ci/check-g2.mjs   (a merge_group run: the PR number
//                                                                          comes from the queue branch's name)
// A lookup that fails is a FAIL, never a pass.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// one list (#449): each label blocks the merge until the role that adds it re-checks, signs and removes it
export const GATES = {
  'g2-changes-requested': {
    open: "The Design Director's G2 review asks for changes. Make them; the Director re-checks and removes the label (D-0056).",
    role: 'Design-Director',
    signed: (b) => /—\s*PDS1-Design-Director\b/i.test(b) && /\bG2\b/.test(b) && /\b(conforms|PASS)\b/.test(b),
    how: '"G2 … conforms" (or "G2: PASS"), signed "— PDS1-Design-Director"',
  },
  'g3-changes-requested': {
    open: "The DS Architect's G3 review asks for API changes. Make them; the DS Architect re-checks and removes the label (#449, D-0062).",
    role: 'DS-Architect',
    signed: (b) => /—\s*PDS1-DS-Architect\b/i.test(b) && /\bG3\b[^\n]{0,24}?\bPASS\b/.test(b),
    how: '"G3: PASS", signed "— PDS1-DS-Architect"',
  },
};

// data: { labels: [name], events: [{ type, label?, body?, at }], commits: [{ at, merge }] } -> { ok, errors }
export function decide({ labels, events, commits }) {
  const errors = [];
  const newestCommit = commits.filter((c) => !c.merge).map((c) => Date.parse(c.at)).reduce((a, b) => Math.max(a, b), 0);
  for (const [name, gate] of Object.entries(GATES)) {
    if (labels.includes(name)) { errors.push({ label: name, message: gate.open }); continue; }
    const added = events.filter((e) => e.type === 'LabeledEvent' && e.label === name).map((e) => Date.parse(e.at));
    if (!added.length) continue;
    const since = Math.max(Math.max(...added), newestCommit);
    const ok = events.some((e) => (e.type === 'IssueComment' || e.type === 'PullRequestReview')
      && Date.parse(e.at) > since && gate.signed(e.body || ''));
    if (!ok) errors.push({ label: name, message: `${name} was removed without the ${gate.role}'s re-review: post ${gate.how} after the newest commit, then remove the label (#621).` });
  }
  return { ok: !errors.length, errors };
}

const QUERY = `query($owner: String!, $repo: String!, $n: Int!) { repository(owner: $owner, name: $repo) { pullRequest(number: $n) {
  labels(first: 100) { nodes { name } }
  commits(last: 100) { nodes { commit { committedDate parents { totalCount } } } }
  timelineItems(last: 250, itemTypes: [LABELED_EVENT, UNLABELED_EVENT, ISSUE_COMMENT, PULL_REQUEST_REVIEW]) { nodes {
    __typename
    ... on LabeledEvent { createdAt label { name } }
    ... on UnlabeledEvent { createdAt label { name } }
    ... on IssueComment { createdAt body }
    ... on PullRequestReview { createdAt body } } } } } }`;

function load(n) {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || 'plenix-ds/pds').split('/');
  const out = JSON.parse(execFileSync('gh', ['api', 'graphql', '-f', `query=${QUERY}`, '-F', `owner=${owner}`, '-F', `repo=${repo}`, '-F', `n=${n}`], { encoding: 'utf8' }));
  const pr = out.data.repository.pullRequest;
  return {
    labels: pr.labels.nodes.map((l) => l.name),
    commits: pr.commits.nodes.map((c) => ({ at: c.commit.committedDate, merge: c.commit.parents.totalCount > 1 })),
    events: pr.timelineItems.nodes.map((e) => ({ type: e.__typename, label: e.label?.name, body: e.body, at: e.createdAt })),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let n = process.env.PR_NUMBER;
  if (!n && process.env.MERGE_BRANCH) {
    n = /\/pr-(\d+)-/.exec(process.env.MERGE_BRANCH)?.[1];
    if (!n) { console.log(`G2_FAIL: no PR number in the queue branch "${process.env.MERGE_BRANCH}"`); process.exit(1); }
    console.log(`merge queue: PR #${n}`);
  }
  if (!/^\d+$/.test(n || '')) { console.log('G2_FAIL: neither PR_NUMBER nor MERGE_BRANCH is set'); process.exit(1); }
  let data;
  try { data = load(n); } catch (e) { console.log(`G2_FAIL: could not read PR #${n}: ${String(e.message).split('\n')[0]}`); process.exit(1); }
  const r = decide(data);
  for (const e of r.errors) console.log(`::error title=${e.label}::${e.message}`);
  if (!r.ok) { console.log(`G2_FAIL (${r.errors.map((e) => e.label).join(', ')})`); process.exit(1); }
  console.log(`G2_OK (no open ${Object.keys(GATES).join(' or ')} label; every removed one has its role's sign-off)`);
}
