#!/usr/bin/env node
// Which sessions a nudge round wakes (#895; template v2.4 §6.2: wake a lane while it has a Ready item). Pure functions,
// tested by tools/ci/dispatch.test.mjs; team.sh nudge runs the CLI below each round.
//
// The 2026-11-07 outage: the round was "quiet" when nothing on GitHub had changed since the last round and no PR was
// open. Idle agents change nothing, so once a round passed it stayed quiet for 10 hours while roles had open work (#893,
// an S1). Now:
// - A role has work when it has an open issue labeled agent:pds1-<role> without "later" or "blocked".
// - A round is quiet only when no role has work, no PR is open and nothing changed since the last round.
// - Severity first: an open S1 or S2 is "unanswered" while its role has posted no signed comment ("— PDS1-<Role>")
//   after it opened and no PR mentions it. Its role is woken every round, with the issue named, until it answers.
// - The heartbeat shows "Open S1/S2 with no response > 30 min: N"; the watchdog opens a P0 when N > 0 two rounds running.
//
//   node deploy/agents/dispatch.mjs --open-prs <n> --changed <0|1> [--now <ISO>]     reads GitHub; prints, one per line:
//     round quiet | round roles   quiet: wake nobody; roles: only the work lines (D-0155: there is no wake-all round)
//     coordinators                     the repo is busy: wake the coordinators (coordinators.roles) as well
//     work <role> <sev> <#n,#n…>          a role with open work (sev 1-5, 5 = none), most severe role first
//     unanswered <role> <#n> <sev> <min>  an S1/S2 with no response from its role, minutes since it opened
//     overdue <count> <#n,#n…>            unanswered for more than OVERDUE_MIN minutes (the heartbeat's health line)
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const OVERDUE_MIN = 30;

const names = (issue) => (issue.labels || []).map((l) => (typeof l === 'string' ? l : l.name));
const sevOf = (labels) => Math.min(5, ...labels.map((n) => Number((/^sev:S([1-4])$/.exec(n) || [])[1])).filter(Boolean));
const rolesOf = (labels) => labels.map((n) => (/^agent:pds1-(.+)$/.exec(n) || [])[1]).filter(Boolean);
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

// open, unblocked, non-later work per role: Map role -> { sev, numbers }
export function openWork(issues) {
  const byRole = new Map();
  for (const i of issues) {
    if (i.state && i.state !== 'OPEN' && i.state !== 'open') continue;
    const labels = names(i);
    if (labels.includes('later') || labels.includes('blocked')) continue;
    const sev = sevOf(labels);
    for (const role of rolesOf(labels)) {
      const r = byRole.get(role) || { sev: 5, numbers: [] };
      r.sev = Math.min(r.sev, sev); r.numbers.push(i.number);
      byRole.set(role, r);
    }
  }
  return byRole;
}

// did <role> answer <issue>? A comment after it opened signed "PDS1-<role id or title>", or a PR that mentions it
export function answered(issue, role, prs = [], title = '') {
  const sigs = [`pds1-${norm(role)}`, title && `pds1-${norm(title)}`].filter(Boolean);
  const signed = (issue.comments || []).some((c) => (c.createdAt || '') >= (issue.createdAt || '')
    && sigs.some((s) => norm(c.body).includes(s)));
  if (signed) return true;
  const ref = new RegExp(`#${issue.number}(?![0-9])`);
  return prs.some((p) => ref.test(`${p.title || ''}\n${p.body || ''}`));
}

// S1/S2 issues whose role has not answered: [{ role, number, sev, minutes }], most severe and oldest first
export function unanswered(issues, prs, nowMs, titles = new Map()) {
  const out = [];
  for (const [role, w] of openWork(issues)) {
    for (const n of w.numbers) {
      const i = issues.find((x) => x.number === n), sev = sevOf(names(i));
      if (sev > 2 || answered(i, role, prs, titles.get(role))) continue;
      out.push({ role, number: n, sev, minutes: Math.max(0, Math.floor((nowMs - Date.parse(i.createdAt)) / 60000)) });
    }
  }
  return out.sort((a, b) => a.sev - b.sev || b.minutes - a.minutes || a.number - b.number);
}

// the round: quiet, or which roles to wake ({ quiet, wakeAll, roles: [role…] most severe first })
// Owner, 2026-11-10 (D-0155): a round never wakes every idle session. Waking a session with nothing to do counted as
// activity, so long_work.idle_exit_min never fired and idle agents ran all day. A round wakes only the roles with
// actionable work (an open, unblocked, non-later issue labelled for them) and, while the repo is busy (an open PR or a
// change since the last round), the coordinators (coordinators.roles), who triage it.
export function round({ issues, openPrs, changedSinceLast }) {
  const work = [...openWork(issues)].sort((a, b) => a[1].sev - b[1].sev || a[0].localeCompare(b[0]));
  const busy = openPrs > 0 || changedSinceLast;
  return { quiet: !busy && work.length === 0, wakeAll: false, coordinators: busy, roles: work.map(([r]) => r) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const REPO = 'plenix-ds/pds';
  const arg = (k, d) => { const at = process.argv.indexOf(k); return at > 0 ? process.argv[at + 1] : d; };
  const nowMs = Date.parse(arg('--now', new Date().toISOString()));
  const openPrs = Number(arg('--open-prs', '1')), changedSinceLast = arg('--changed', '1') !== '0';
  const gh = (...a) => JSON.parse(execFileSync('gh', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 << 20 }));
  const issues = gh('issue', 'list', '-R', REPO, '--state', 'open', '--limit', '1000', '--json', 'number,labels,createdAt');
  // comments only for the S1/S2 issues (a few), and the PRs that may answer them (open, and merged or closed recently)
  for (const i of issues) if (sevOf(names(i)) <= 2) i.comments = gh('issue', 'view', String(i.number), '-R', REPO, '--json', 'comments').comments;
  const prs = gh('pr', 'list', '-R', REPO, '--state', 'all', '--limit', '100', '--json', 'number,title,body');
  let titles = new Map();
  try {
    const { load, roles, DEFAULT_FILE } = await import('./registry.mjs');
    titles = new Map(roles(load(process.env.PDS1_CFG || DEFAULT_FILE)).map((r) => [r.id, r.title]));
  } catch { /* signatures by role id still match */ }
  const r = round({ issues, openPrs, changedSinceLast });
  console.log(`round ${r.quiet ? 'quiet' : 'roles'}`);
  if (r.coordinators) console.log('coordinators');
  for (const [role, w] of [...openWork(issues)].sort((a, b) => a[1].sev - b[1].sev || a[0].localeCompare(b[0]))) {
    console.log(`work ${role} ${w.sev} ${w.numbers.map((n) => '#' + n).join(',')}`);
  }
  const open = unanswered(issues, prs, nowMs, titles);
  for (const u of open) console.log(`unanswered ${u.role} #${u.number} ${u.sev} ${u.minutes}`);
  const overdue = [...new Set(open.filter((u) => u.minutes > OVERDUE_MIN).map((u) => u.number))];
  console.log(`overdue ${overdue.length} ${overdue.map((n) => '#' + n).join(',')}`);
}
