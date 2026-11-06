#!/usr/bin/env node
// Dispatcher watchdog (template v2.4 §6.1; #772): the poller (team.sh nudge, every dispatch.heartbeat_min) writes
// "Last run: <UTC time>" into the pinned heartbeat issue (dispatch.heartbeat_issue). Run daily on a GitHub-hosted runner
// (.github/workflows/watchdog.yml), this opens a P0 process issue for the Delivery Lead when that time is older than
// 2 x heartbeat_min, or comments on the one already open. It also catches an agent host that is off.
//   node tools/ci/watchdog.mjs [--dry-run]
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { load, setting } from '../../deploy/agents/registry.mjs';

const TITLE = 'P0 process: the dispatcher heartbeat is stale';

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
  if (age <= limit) { console.log(`WATCHDOG_OK: heartbeat #${issue} is ${age} min old (limit ${limit} = 2 x dispatch.heartbeat_min)`); process.exit(0); }
  const text = `The dispatcher heartbeat #${issue} is **${age === Infinity ? 'missing its "Last run:" line' : `${age} minutes old`}**, more than 2 × \`dispatch.heartbeat_min\` (${limit} min). The poller (\`team.sh nudge\`, \`pds1-nudge.timer\` on the agent host) has stopped, or the host is off, so no agent is woken.\n\n@pds1-delivery-lead: find the root cause within 24 hours, fix it and add a check so it cannot recur (template v2.4 §6.4; \`docs/lessons.md\`).\n\n— watchdog (${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID || 'local'})`;
  if (dry) { console.log(`WATCHDOG_STALE (dry run): would report: ${text.split('\n')[0]}`); process.exit(1); }
  const open = JSON.parse(gh('issue', 'list', '-R', repo, '--state', 'open', '--search', `"${TITLE}" in:title`, '--json', 'number', '-q', '[.[].number]'));
  if (open.length) gh('issue', 'comment', String(open[0]), '-R', repo, '--body', text);
  else gh('issue', 'create', '-R', repo, '--title', TITLE, '--body', text, '--label', 'type:bug', '--label', 'sev:S1', '--label', 'process', '--label', 'agent:pds1-delivery-lead');
  console.log(`WATCHDOG_STALE: heartbeat #${issue} is ${age} min old; ${open.length ? `commented on #${open[0]}` : 'opened a P0 process issue'}`);
  process.exit(1);
}
