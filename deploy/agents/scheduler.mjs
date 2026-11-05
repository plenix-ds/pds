#!/usr/bin/env node
// PDS1 scheduler (#246, D-0040): which waiting roles to start and which idle ones to stop. Prints a plan; team.sh nudge
// carries it out (or only prints it with NUDGE_DRY=1). Read-only: it reads GitHub, tmux, agents.config.yaml and memory.
//
//   node deploy/agents/scheduler.mjs <role> [<role> …]      the roles team.sh can start (its ROLES list)
//
// Output, one per line:  start <role> [<instance>] | <reason>      stop <window> | <reason>      note <text>
//
// Rules (issue #246):
// - A role is waiting when it has open issues labeled agent:pds1-<role> without "later" and no running window.
//   component-engineer runs as instance 1, then 2 (2 only when it has 2 or more waiting issues).
// - Starts only while long-work windows (everything but product-lead and delivery-lead) are below
//   long_work.max_running and free memory stays at or above start_new_below_free_gb after each start
//   (each start is counted at memory.per_agent_limit_gb).
// - Order: highest severity of the role's issues (sev:S1 first), then its oldest issue.
// - Parked roles (mobile-app-builder, D-0013) and roles team.sh has no window type for are never started.
// - Stop: a long-work window that is idle (no "esc to interrupt", unchanged for 30 minutes), whose role has no waiting
//   issue, no open PR labeled for it and no open PR from the branch checked out in its worktree.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const REPO = 'plenix-ds/pds';
const SESSION = process.env.PDS1_SESSION || 'pds1';
const ROOT = process.env.PDS1_ROOT || path.join(os.homedir(), 'pds1');
const CFG = process.env.PDS1_CFG || path.join(ROOT, 'work', 'pds', 'agents.config.yaml');
const COORDINATORS = ['product-lead', 'delivery-lead'];
const PARKED = ['mobile-app-builder'];
const IDLE_STOP_S = Number(process.env.NUDGE_STOP_IDLE_S || 1800);
const startable = process.argv.slice(2).filter((r) => !COORDINATORS.includes(r) && !PARKED.includes(r));

const run = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
const gh = (...args) => JSON.parse(run('gh', args));

// agents.config.yaml: the three numbers this needs (simple "key: value" lines inside their sections)
const cfgText = fs.readFileSync(CFG, 'utf8');
const section = (name) => (cfgText.split(/^(?=\S)/m).find((s) => s.startsWith(name + ':')) || '');
const num = (text, key, dflt) => { const m = text.match(new RegExp('^\\s+' + key + ':\\s*([0-9.]+)', 'm')); return m ? Number(m[1]) : dflt; };
const maxLong = Number(process.env.NUDGE_MAX_LONG || num(section('long_work'), 'max_running', 4));
const minFreeGb = num(section('memory'), 'start_new_below_free_gb', 2);
const perAgentGb = num(section('memory'), 'per_agent_limit_gb', 1.5);
const freeGb = Number(process.env.NUDGE_FREE_GB || (() => {
  const m = fs.readFileSync('/proc/meminfo', 'utf8').match(/^MemAvailable:\s+(\d+) kB/m);
  return m ? Number(m[1]) / 1048576 : 0;
})());

// GitHub: waiting issues per role, open PRs
const issues = gh('issue', 'list', '-R', REPO, '--state', 'open', '--limit', '1000', '--json', 'number,labels,createdAt');
const prs = gh('pr', 'list', '-R', REPO, '--state', 'open', '--limit', '200', '--json', 'number,headRefName,labels');
const byRole = new Map();
for (const i of issues) {
  const names = i.labels.map((l) => l.name);
  if (names.includes('later')) continue;
  const sev = Math.min(5, ...names.map((n) => (/^sev:S([1-4])$/.exec(n) || [])[1]).filter(Boolean).map(Number));
  for (const n of names) {
    const m = /^agent:pds1-(.+)$/.exec(n);
    if (!m) continue;
    const r = byRole.get(m[1]) || { count: 0, sev: 5, oldest: '9999', numbers: [] };
    r.count++; r.sev = Math.min(r.sev, sev); if (i.createdAt < r.oldest) r.oldest = i.createdAt; r.numbers.push(i.number);
    byRole.set(m[1], r);
  }
}
const prLabeled = (role) => prs.some((p) => p.labels.some((l) => l.name === `agent:pds1-${role}`));
const prHeads = new Set(prs.map((p) => p.headRefName));

// tmux: running windows, their last activity and whether Claude is working
let windows = [];
try {
  windows = run('tmux', ['list-windows', '-t', SESSION, '-F', '#W #{window_activity}']).trim().split('\n').filter(Boolean)
    .map((l) => { const [name, act] = l.split(' '); return { name, act: Number(act) }; }).filter((w) => w.name !== 'shell');
} catch { console.log('note team session not running: nothing to start or stop'); process.exit(0); }
const roleOf = (win) => win.replace(/-\d+$/, '');
const busy = (win) => { try { return /esc to interrupt/.test(run('tmux', ['capture-pane', '-p', '-t', `${SESSION}:${win}`]).split('\n').slice(-12).join('\n')); } catch { return false; } };
const running = new Set(windows.map((w) => w.name));
const long = windows.filter((w) => !COORDINATORS.includes(roleOf(w.name)));
const now = Math.floor(Date.now() / 1000);

// stops first: a freed slot can go to a waiting role in the same run
const stops = [];
for (const w of long) {
  const role = roleOf(w.name);
  const waiting = byRole.get(role);
  if (waiting && !(role === 'component-engineer' && w.name.endsWith('-2') && waiting.count < 2)) continue;
  if (now - w.act < IDLE_STOP_S || busy(w.name)) continue;
  if (prLabeled(role)) continue;
  let branch = '';
  try { branch = run('git', ['-C', path.join(ROOT, 'work', w.name), 'rev-parse', '--abbrev-ref', 'HEAD']).trim(); } catch { continue; }
  if (prHeads.has(branch)) continue;
  stops.push(w.name);
  console.log(`stop ${w.name} | no waiting issue, no open PR, idle ${Math.round((now - w.act) / 60)} min`);
}

// starts: waiting roles without a window, by severity then oldest issue
const candidates = [];
for (const role of startable) {
  const r = byRole.get(role);
  if (!r) continue;
  if (role === 'component-engineer') {
    for (const n of [1, 2]) {
      if (running.has(`${role}-${n}`) && !stops.includes(`${role}-${n}`)) continue;
      if (n === 2 && r.count < 2) continue;
      candidates.push({ role, n, ...r });
      break;
    }
  } else if (!running.has(role)) {
    candidates.push({ role, n: '', ...r });
  }
}
candidates.sort((a, b) => a.sev - b.sev || a.oldest.localeCompare(b.oldest));
let slots = maxLong - (long.length - stops.length);
let mem = freeGb + stops.length * perAgentGb;
for (const c of candidates) {
  const what = `${c.role}${c.n ? ' ' + c.n : ''}`;
  const why = `${c.count} waiting issue${c.count > 1 ? 's' : ''} (${c.sev < 5 ? 'S' + c.sev : 'no severity'}, oldest ${c.oldest.slice(0, 10)}, e.g. #${c.numbers.slice(0, 3).join(', #')})`;
  if (slots <= 0) { console.log(`note waiting ${what}: no long-work slot (${long.length - stops.length}/${maxLong}) | ${why}`); continue; }
  if (mem - perAgentGb < minFreeGb) { console.log(`note waiting ${what}: memory ${mem.toFixed(1)} GB free, needs ${minFreeGb} GB after a ${perAgentGb} GB session | ${why}`); continue; }
  console.log(`start ${c.role}${c.n ? ' ' + c.n : ''} | ${why}`);
  slots--; mem -= perAgentGb;
}
