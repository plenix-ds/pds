#!/usr/bin/env node
// Dispatcher watchdog (template v2.4 §6.1; #772): the poller (team.sh nudge, every dispatch.heartbeat_min) writes
// "Last run: <UTC time>" into the pinned heartbeat issue (dispatch.heartbeat_issue). Run daily on a GitHub-hosted runner
// (.github/workflows/watchdog.yml), this opens a P0 process issue for the Delivery Lead when that time is older than
// 2 x heartbeat_min, or comments on the one already open. It also catches an agent host that is off.
// #895: it also reads the heartbeat's "Health:" line and opens a P0 when an S1/S2 has had no response from its role for
// more than 30 minutes, two nudge rounds in a row.
//   node tools/ci/watchdog.mjs [--dry-run]
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { load, setting } from '../../deploy/agents/registry.mjs';

const TITLE = 'P0 process: the dispatcher heartbeat is stale';
const TITLE_HEALTH = 'P0 process: an S1/S2 has no response from its role';

// the health line team.sh nudge writes (#895): { count, issues, rounds, p0 }, or null when there is none
export function overdueHealth(body) {
  const m = /^Health: open S1\/S2 with no response > \d+ min: (\d+)\s*([#\d,]*)\s*· rounds in a row: (\d+)/m.exec(body || '');
  if (!m) return null;
  const count = Number(m[1]), rounds = Number(m[3]);
  return { count, issues: m[2], rounds, p0: count > 0 && rounds >= 2 };
}

// open a P0 process issue for the Delivery Lead with <title>, or comment on the open one
function report(gh, repo, title, text) {
  const open = JSON.parse(gh('issue', 'list', '-R', repo, '--state', 'open', '--search', `"${title}" in:title`, '--json', 'number', '-q', '[.[].number]'));
  if (open.length) gh('issue', 'comment', String(open[0]), '-R', repo, '--body', text);
  else gh('issue', 'create', '-R', repo, '--title', title, '--body', text, '--label', 'type:bug', '--label', 'sev:S1', '--label', 'process', '--label', 'agent:pds1-delivery-lead');
  return open.length ? `commented on #${open[0]}` : 'opened a P0 process issue';
}

// minutes since the "Last run:" time in the heartbeat issue's body (Infinity when there is none)
export function heartbeatAge(body, nowMs) {
  const m = /^Last run:\s*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?Z)/m.exec(body || '');
  const t = m ? Date.parse(m[1]) : NaN;
  return Number.isFinite(t) ? Math.round((nowMs - t) / 60000) : Infinity;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dry = process.argv.includes('--dry-run');
  const repo = process.env.GITHUB_REPOSITORY || 'plenix-ds/pds';
  const gh = (...a) => execFileSync('gh', a, { encoding: 'utf8' });
  const reg = load('agents.config.yaml');
  const issue = setting(reg, 'dispatch.heartbeat_issue');
  const min = Number(setting(reg, 'dispatch.heartbeat_min'));
  const body = gh('issue', 'view', String(issue), '-R', repo, '--json', 'body', '-q', '.body');
  const age = heartbeatAge(body, Date.now());
  const limit = 2 * min;
  const run = `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID || 'local'}`;
  let failed = false;
  const health = overdueHealth(body);
  if (health?.p0) {
    const text = `The dispatcher heartbeat #${issue} reports **${health.count} open S1/S2 issue(s) with no response from their role for more than 30 minutes** (${health.issues}), ${health.rounds} nudge rounds in a row. The nudge names each one to its role every round (#895); the role has not answered.\n\n@pds1-delivery-lead: find out why the role is not answering (not running, stuck, or over capacity), get it answered, and record the cause (template v2.4 §6.4; \`docs/lessons.md\`).\n\n— watchdog (${run})`;
    if (dry) console.log(`WATCHDOG_UNANSWERED (dry run): ${health.count} (${health.issues}), ${health.rounds} rounds`);
    else console.log(`WATCHDOG_UNANSWERED: ${health.count} (${health.issues}), ${health.rounds} rounds; ${report(gh, repo, TITLE_HEALTH, text)}`);
    failed = true;
  } else console.log(`WATCHDOG_HEALTH: ${health ? `${health.count} unanswered S1/S2, ${health.rounds} round(s) in a row` : 'no health line yet (the poller predates #895)'}`);
  if (age <= limit) { console.log(`WATCHDOG_OK: heartbeat #${issue} is ${age} min old (limit ${limit} = 2 x dispatch.heartbeat_min)`); process.exit(failed ? 1 : 0); }
  const text = `The dispatcher heartbeat #${issue} is **${age === Infinity ? 'missing its "Last run:" line' : `${age} minutes old`}**, more than 2 × \`dispatch.heartbeat_min\` (${limit} min). The poller (\`team.sh nudge\`, \`pds1-nudge.timer\` on the agent host) has stopped, or the host is off, so no agent is woken.\n\n@pds1-delivery-lead: find the root cause within 24 hours, fix it and add a check so it cannot recur (template v2.4 §6.4; \`docs/lessons.md\`).\n\n— watchdog (${run})`;
  if (dry) { console.log(`WATCHDOG_STALE (dry run): would report: ${text.split('\n')[0]}`); process.exit(1); }
  console.log(`WATCHDOG_STALE: heartbeat #${issue} is ${age} min old; ${report(gh, repo, TITLE, text)}`);
  process.exit(1);
}
