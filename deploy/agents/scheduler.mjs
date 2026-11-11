#!/usr/bin/env node
// PDS1 scheduler (#246, D-0040): which waiting roles to start and which idle ones to stop. Prints a plan; team.sh nudge
// carries it out (or only prints it with NUDGE_DRY=1). Read-only: it reads GitHub, tmux, agents.config.yaml and memory.
//
//   node deploy/agents/scheduler.mjs <role> [<role> …]      the roles team.sh can start (its ROLES list)
//
// Output, one per line:  start <role> [<instance>] | <reason>      stop <window> | <reason>      note <text>
//
// Rules (issue #246):
// - A role is waiting when it has open issues labeled agent:pds1-<role> without "later" or "blocked" (parked on a named blocker,
//   template §5.5) and no running window.
//   component-engineer runs as instance 1, then 2 (2 only when it has 2 or more waiting issues).
// - Starts only while long-work windows (everything but product-lead and delivery-lead) are below
//   long_work.max_running and free memory stays at or above start_new_below_free_gb after each start
//   (each start is counted at memory.per_agent_limit_gb).
// - Order (#769): the role's priority (release > integrate > verify > build > design > spec > evergreen), then the highest
//   severity of its issues (sev:S1 first), then its oldest issue. long_work.reserved_gate_slots are kept for gate roles.
// - Parked roles (agents.config.yaml roles: parked: true, for example mobile-app-builder, D-0013) are never started.
// - Stop: a long-work window idle for long_work.idle_exit_min (from its activity record, .claude/hooks/activity.cjs; a
//   window without a record falls back to the screen: no "esc to interrupt" and unchanged), whose role has no waiting
//   issue (D-0155: an open PR no longer keeps it running; pickup restarts it when its PR needs it).
// - Asks (#1130): a role with an event held for it or a mention it has not answered (pickup's .asks.json, at most 24 h)
//   is waiting too: it is started like a role with an issue, and idle exit never stops it.
// - Model per task (D-0173): role, session and task are separate. The PM labels each task model:haiku|sonnet|opus
//   (models.allowed); no label means the role definition's model. A start runs on the model of the task the role takes
//   next (its waiting issues by severity, then oldest). A running session keeps going while its next task needs the
//   model it runs; when the next task needs another model and the session has been idle long_work.idle_exit_min, the plan
//   says "restart <window> model=<m>" (models.on_change: restart). A working session is never restarted. Output lines
//   that start or restart a session carry model=<m>.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { load, roles, setting } from './registry.mjs';
import { idleFor, admit } from './capacity.mjs';
import { read as readAsks, summary as askSummary } from './asks.mjs';

const REPO = 'plenix-ds/pds';
const SESSION = process.env.PDS1_SESSION || 'pds1';
const ROOT = process.env.PDS1_ROOT || path.join(os.homedir(), 'pds1');
const CFG = process.env.PDS1_CFG || path.join(ROOT, 'work', 'pds', 'agents.config.yaml');
// the role registry (agents.config.yaml roles:, #768): coordinators, parked roles, instances and settings come only from it
const REG = load(CFG);
const ROLES = roles(REG);
const COORDINATORS = setting(REG, 'coordinators.roles').map((r) => r.replace(/^pds1-/, ''));
const PARKED = ROLES.filter((r) => r.parked === true).map((r) => r.id);
const INSTANCES = new Map(ROLES.map((r) => [r.id, r.instances || 1]));
const BY_ID = new Map(ROLES.map((r) => [r.id, r]));
const startable = process.argv.slice(2).filter((r) => !COORDINATORS.includes(r) && !PARKED.includes(r));

const run = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
const gh = (...args) => JSON.parse(run('gh', args));

// the numbers this needs, from the registry; a missing one stops the scheduler (no default written here; check 15)
const maxLong = Number(process.env.NUDGE_MAX_LONG || setting(REG, 'long_work.max_running'));
const minFreeGb = Number(setting(REG, 'memory.start_new_below_free_gb'));
const perAgentGb = Number(setting(REG, 'memory.per_agent_limit_gb'));
const IDLE_STOP_S = Number(process.env.NUDGE_STOP_IDLE_S || setting(REG, 'long_work.idle_exit_min') * 60);
const reserved = Number(setting(REG, 'long_work.reserved_gate_slots'));
// model per task (D-0173)
const MODEL_PREFIX = setting(REG, 'models.label_prefix');
const MODELS = setting(REG, 'models.allowed');
const ON_CHANGE = setting(REG, 'models.on_change');
const defModel = (role) => {   // the role definition's model (its front matter), the default when a task has no label
  const def = BY_ID.get(role)?.definition; if (!def) return '';
  try { return (/^model:\s*([\w.-]+)/m.exec(fs.readFileSync(path.resolve(path.dirname(CFG), def), 'utf8')) || [])[1] || ''; } catch { return ''; }
};
const MODEL_DIR = path.join(ROOT, '.models');   // team.sh writes the model each window was started on
const runningModel = (win) => { try { return fs.readFileSync(path.join(MODEL_DIR, win), 'utf8').trim(); } catch { return ''; } };
const badModel = [];
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
  if (names.includes('later') || names.includes('blocked')) continue; // parked: deferred, or waiting on a named blocker (template §5.5)
  const sev = Math.min(5, ...names.map((n) => (/^sev:S([1-4])$/.exec(n) || [])[1]).filter(Boolean).map(Number));
  const asked = names.filter((n) => n.startsWith(MODEL_PREFIX)).map((n) => n.slice(MODEL_PREFIX.length));
  const model = asked.find((x) => MODELS.includes(x)) || '';
  if (asked.length && !model) badModel.push(i.number);
  for (const n of names) {
    const m = /^agent:pds1-(.+)$/.exec(n);
    if (!m) continue;
    const r = byRole.get(m[1]) || { count: 0, sev: 5, oldest: '9999', numbers: [], tasks: [] };
    r.count++; r.sev = Math.min(r.sev, sev); if (i.createdAt < r.oldest) r.oldest = i.createdAt; r.numbers.push(i.number);
    r.tasks.push({ number: i.number, sev, created: i.createdAt, model });
    byRole.set(m[1], r);
  }
}
// held events and unanswered mentions (#1130): the role is waiting, with the asked items as its numbers
for (const [key, a] of askSummary(readAsks(path.join(ROOT, '.asks.json')), Math.floor(Date.now() / 1000))) {
  const role = key.replace(/-\d+$/, '');
  const r = byRole.get(role) || { count: 0, sev: 5, oldest: '9999', numbers: [], tasks: [] };
  r.count += a.count; if (a.oldest < r.oldest) r.oldest = a.oldest;
  r.numbers.push(...a.numbers.filter((n) => !r.numbers.includes(n)));
  r.asked = true;
  byRole.set(role, r);
}
// the task a role (instance k) takes next and the model it needs: severity first, then oldest; an ask (no issue) uses
// the role's default
const nextTask = (role, k = 1) => {
  const t = [...(byRole.get(role)?.tasks || [])].sort((a, b) => a.sev - b.sev || a.created.localeCompare(b.created));
  const task = t[k - 1] || t[0];
  return { number: task?.number, model: task?.model || defModel(role) };
};
if (badModel.length) console.log(`note model label not in models.allowed (${MODELS.join(', ')}), role default used: #${badModel.slice(0, 5).join(', #')}`);
const prLabeled = (role) => prs.some((p) => p.labels.some((l) => l.name === `agent:pds1-${role}`));

// tmux: running windows, their last activity and whether Claude is working
let windows = [];
try {
  windows = run('tmux', ['list-windows', '-t', SESSION, '-F', '#W #{window_activity}']).trim().split('\n').filter(Boolean)
    .map((l) => { const [name, act] = l.split(' '); return { name, act: Number(act) }; }).filter((w) => w.name !== 'shell');
} catch { console.log('note team session not running: nothing to start or stop'); process.exit(0); }
const roleOf = (win) => win.replace(/-\d+$/, '');
const screenBusy = (win) => { try { return /esc to interrupt/.test(run('tmux', ['capture-pane', '-p', '-t', `${SESSION}:${win}`]).split('\n').slice(-12).join('\n')); } catch { return false; } };
const running = new Set(windows.map((w) => w.name));
const long = windows.filter((w) => !COORDINATORS.includes(roleOf(w.name)));
const now = Math.floor(Date.now() / 1000);
// activity (#769): the record .claude/hooks/activity.cjs writes; a window without one falls back to the screen and tmux
const ACTIVITY = path.join(ROOT, '.activity');
const record = (win) => { try { return JSON.parse(fs.readFileSync(path.join(ACTIVITY, `${win}.json`), 'utf8')); } catch { return null; } };
const idleSeconds = (w) => { const s = idleFor(record(w.name), now); return s === null ? (screenBusy(w.name) ? 0 : now - w.act) : s; };
const busy = (win) => idleSeconds(windows.find((w) => w.name === win) || { name: win, act: now }) === 0;

// stops first: a freed slot can go to a waiting role in the same run
const stops = [];
for (const w of long) {
  const role = roleOf(w.name);
  const waiting = byRole.get(role);
  // instance k of a multi-instance role may stop when its role has fewer than k waiting issues
  const k = Number((/-(\d+)$/.exec(w.name) || [])[1] || 1);
  if (waiting && !(INSTANCES.get(role) > 1 && k > 1 && waiting.count < k)) {
    // D-0173: keep the session for its next task only when that task needs the model it runs
    const next = nextTask(role, k), have = runningModel(w.name) || defModel(role);
    if (ON_CHANGE === 'restart' && next.number && next.model && have && next.model !== have && !waiting.asked && idleSeconds(w) >= IDLE_STOP_S) {
      // not a stop: team.sh replaces the session in the same slot, so the long-work budget is unchanged
      console.log(`restart ${w.name} model=${next.model} | next task #${next.number} needs ${next.model}, the session runs ${have}; idle ${Math.round(idleSeconds(w) / 60)} min`);
    }
    continue;
  }
  if (idleSeconds(w) < IDLE_STOP_S) continue;
  // D-0155 (owner, 2026-11-10): an open PR waiting on checks or a review is not a reason to stay running; pickup starts
  // the role again when an event on its PR needs it (a failed check, a review, a mention).
  stops.push(w.name);
  console.log(`stop ${w.name} | no waiting issue, idle ${Math.round(idleSeconds(w) / 60)} min (long_work.idle_exit_min)${prLabeled(role) ? '; its open PR waits on checks or review' : ''}`);
}

// starts: waiting roles without a window, by severity then oldest issue
const candidates = [];
for (const role of startable) {
  const r = byRole.get(role);
  if (!r) continue;
  const max = INSTANCES.get(role) || 1;
  if (max > 1) {
    for (let n = 1; n <= max; n++) {
      if (running.has(`${role}-${n}`) && !stops.includes(`${role}-${n}`)) continue;
      if (n > 1 && r.count < n) continue;
      candidates.push({ role, n, ...r });
      break;
    }
  } else if (!running.has(role)) {
    candidates.push({ role, n: '', ...r });
  }
}
// reserved gate slots (#769): gate windows still running use them first
const gateRunning = long.filter((w) => !stops.includes(w.name) && BY_ID.get(roleOf(w.name))?.gate === true).length;
const budget = { slots: maxLong - (long.length - stops.length), reservedLeft: Math.max(0, reserved - gateRunning),
  mem: freeGb + stops.length * perAgentGb, perAgentGb, minFreeGb };
const withRole = candidates.map((c) => ({ ...c, priority: BY_ID.get(c.role)?.priority, gate: BY_ID.get(c.role)?.gate === true }));
for (const c of admit(withRole, budget)) {
  const what = `${c.role}${c.n ? ' ' + c.n : ''}`;
  const why = `${c.count} waiting ${c.asked ? 'item' : 'issue'}${c.count > 1 ? 's' : ''}${c.asked ? ', incl. an unanswered mention' : ''} (${c.priority || 'no priority'}, ${c.sev < 5 ? 'S' + c.sev : 'no severity'}, oldest ${c.oldest.slice(0, 10)}, e.g. #${c.numbers.slice(0, 3).join(', #')})`;
  if (c.verdict === 'no-slot') console.log(`note waiting ${what}: no long-work slot (${long.length - stops.length}/${maxLong}) | ${why}`);
  else if (c.verdict === 'reserved') console.log(`note waiting ${what}: the free slots are reserved for gate roles (long_work.reserved_gate_slots) | ${why}`);
  else if (c.verdict === 'memory') console.log(`note waiting ${what}: memory ${c.mem.toFixed(1)} GB free, needs ${minFreeGb} GB after a ${perAgentGb} GB session | ${why}`);
  else {
    const next = nextTask(c.role, c.n || 1);
    console.log(`start ${what}${next.model ? ' model=' + next.model : ''} | ${why}${next.number ? `; next task #${next.number} on ${next.model || 'the role default'}` : ''}`);
  }
}
