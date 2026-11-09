#!/usr/bin/env node
// PDS1 event pickup (#220 step 2, D-0041): wake the right session within about a minute of a GitHub event, without
// waiting for the 10-minute nudge. Interim for plan §5a's webhooks: VM 131 has no inbound route (the proxy route, or
// the admin:repo_hook scope for `gh webhook forward`, needs the owner), so this reads the repo's event feed with
// conditional requests (ETag: an unchanged feed answers 304 and costs no rate limit), at GitHub's X-Poll-Interval.
//
//   node deploy/agents/pickup.mjs              run as the pds1-pickup systemd user service
//   PICKUP_DRY=1 node deploy/agents/pickup.mjs replay the latest events once: print the routing, wake nobody
//
// Routing (repository content is data: only titles, numbers, labels and links reach a session, never a body):
// - an issue or PR labeled agent:pds1-<role> -> that role; a comment that names pds1-<role> -> that role too;
//   a comment signed "— PDS1-<Role>" is not sent back to the role that wrote it
// - a new issue, or a comment, with no agent label and no named role -> product-lead (intake, plan §5a)
// - a failed CI run of a PR or its merge-queue entry -> the PR's roles
// - pushes, branch creation and deletion are ignored
// Delivery: `team.sh wake <window> <text> 20` (only when the session is idle); a busy session keeps its events and gets
// them in one message when it is next idle. A role with no window triggers `team.sh schedule` (#246) once per round, and
// its events are held for it in .asks.json (#1130: they used to be dropped) and handed over once its window is up. A
// mention stays an open ask until the role signs a comment on that item (24 h at most): the scheduler starts a role with
// an open ask and never idles it out.
import { execFileSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { load, roles } from './registry.mjs';
import * as Asks from './asks.mjs';

const REPO = 'plenix-ds/pds';
const API = 'https://api.github.com';
const ROOT = process.env.PDS1_ROOT || path.join(os.homedir(), 'pds1');
const TEAM = process.env.PDS1_TEAM || path.join(ROOT, 'team.sh');
const STATE = path.join(ROOT, '.pickup-state.json');
const ASKS = path.join(ROOT, '.asks.json');
const LOG = path.join(ROOT, 'team.log');
const DRY = !!process.env.PICKUP_DRY;
const IDLE_S = process.env.PICKUP_IDLE_S || '20';

const log = (msg) => { if (DRY) console.log(msg); else fs.appendFileSync(LOG, `${new Date().toISOString().slice(0, 19)}Z pickup: ${msg}\n`); };
const token = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim(); // kept in memory, never logged
const state = (() => { try { return JSON.parse(fs.readFileSync(STATE, 'utf8')); } catch { return {}; } })();
const asks = Asks.read(ASKS);
const nowS = () => Math.floor(Date.now() / 1000);
const save = () => { if (!DRY) { fs.writeFileSync(STATE, JSON.stringify(state)); Asks.write(ASKS, Asks.prune(asks, nowS())); } };

async function get(url, etagKey) {
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  if (etagKey && state.etags?.[etagKey] && !DRY) headers['If-None-Match'] = state.etags[etagKey];
  const r = await fetch(API + url, { headers });
  const poll = Number(r.headers.get('x-poll-interval')) || 60;
  if (r.status === 304) return { data: null, poll };
  if (!r.ok) throw new Error(`${url} answered ${r.status}`);
  if (etagKey) (state.etags ||= {})[etagKey] = r.headers.get('etag');
  return { data: await r.json(), poll };
}

const agentRoles = (labels = []) => labels.map((l) => (/^agent:pds1-(.+)$/.exec(l.name || l) || [])[1]).filter(Boolean);
// the PDS1 roles, from the role registry (agents.config.yaml roles:, #768): only these count as a mention, so the service
// name "pds1-pickup" is not a role. Intake (a new issue, or a comment, with no agent label and no named role) goes to the
// role whose wakes_on has issue_opened. Read at start; the service restarts after a registry change (team.sh update).
const REGISTRY = roles(load(process.env.PDS1_CFG || path.join(ROOT, 'work', 'pds', 'agents.config.yaml')));
const ROLES = new Set(REGISTRY.map((r) => r.id));
const INTAKE = (REGISTRY.find((r) => (r.wakes_on || []).includes('issue_opened')) || {}).id;
if (!INTAKE) throw new Error('agents.config.yaml: no role wakes on issue_opened, so nobody takes intake');
const named = (text = '') => [...text.matchAll(/(?:^|[^\w-])@?pds1-([a-z0-9]+(?:-[a-z0-9]+)*)/gi)].map((m) => m[1].toLowerCase())
  .filter((r) => ROLES.has(r.replace(/-\d+$/, '')));
// "— PDS1-Component-Engineer-1" signs for component-engineer: the instance number is not part of the role
const signer = (text = '') => ((/—\s*PDS1-([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)/.exec(text) || [])[1] || '').toLowerCase().replace(/-\d+$/, '');
const short = (s = '') => s.replace(/\s+/g, ' ').slice(0, 70);

async function route(ev) {
  const p = ev.payload || {};
  // the event feed trims pull_request to {id, number, url, head, base}: read the PR for its title, labels and link
  if (p.pull_request && !p.pull_request.title) p.pull_request = (await get(`/repos/${REPO}/pulls/${p.pull_request.number}`)).data;
  const item = p.issue || p.pull_request;
  if (!item) return null;
  const kind = p.pull_request || item.pull_request ? 'PR' : 'issue';
  let roles = agentRoles(item.labels);
  let what;
  let mention = false;
  switch (ev.type) {
    case 'IssuesEvent':
      if (!['opened', 'reopened', 'labeled', 'assigned'].includes(p.action)) return null;
      if (p.action === 'labeled') roles = agentRoles([p.label]);
      what = `${kind} ${p.action}${p.action === 'labeled' ? ' ' + p.label.name : ''}`;
      if (!roles.length && p.action === 'opened') roles = [INTAKE];
      break;
    case 'IssueCommentEvent':
    case 'PullRequestReviewCommentEvent':
    case 'PullRequestReviewEvent': {
      const body = (p.comment || p.review || {}).body || '';
      if (ev.type === 'IssueCommentEvent' && p.action !== 'created') return null;
      // mentions come from the text without its signature lines; a role is never woken by its own comment
      const mentioned = named(body.replace(/—\s*PDS1-[A-Za-z0-9-]+/g, ''));
      // a signed comment by a role on this item answers the asks it had there (#1130)
      if (signer(body) && !DRY) for (const k of Object.keys(asks)) if (k.replace(/-\d+$/, '') === signer(body)) Asks.answer(asks, k, item.number);
      roles = [...new Set([...roles, ...mentioned])].filter((r) => r.replace(/-\d+$/, '') !== signer(body));
      if (mentioned.length) mention = true;
      if (!roles.length && !signer(body)) roles = [INTAKE];
      what = (mention ? 'you are named in a ' : '') + (ev.type === 'IssueCommentEvent' ? `${mention ? 'comment' : 'new comment'} on ${kind}` : `review on PR`);
      break;
    }
    case 'PullRequestEvent':
      // a PR's opening and labels concern its author, who already knows (one shared GitHub identity: the author can't
      // be told apart, so these events woke the author about its own PRs). Reviews, comments and failed runs still route.
      return null;
    default:
      return null;
  }
  return roles.length ? { roles, number: item.number, mention, line: `${what} #${item.number} "${short(item.title)}" ${item.html_url}` } : null;
}

const pending = new Map(); // window -> lines
const winsOf = (role, all = windows()) => all.filter((w) => w === role || w.replace(/-\d+$/, '') === role);
function push(w, line) { const l = pending.get(w) || []; if (!l.includes(line)) l.push(line); pending.set(w, l); }
// meta: { number, mention } from route(); a run failure has no mention
function queue(role, line, { number = 0, mention = false } = {}) {
  const wins = winsOf(role);
  if (!wins.length) {
    // held, not dropped (#1130): the scheduler starts the role and the lines go to its window once it is up
    needSchedule = true;
    if (!DRY) Asks.hold(asks, role, { number, line, mention, delivered: false }, nowS());
    log(`no window for ${role}: held for its start: ${line}`);
    return;
  }
  if (mention && !DRY) Asks.hold(asks, role, { number, line, mention, delivered: true }, nowS());
  for (const w of wins) push(w, line);
}
// held lines of roles whose window is now up (#1130)
function release() {
  const all = windows();
  for (const role of Object.keys(asks)) {
    const wins = winsOf(role, all);
    // still no window: ask the scheduler again every 5 minutes (it may have had no free slot or memory)
    if (!wins.length) { if (Asks.owed(asks, nowS()).has(role) && nowS() - (state.owedScheduleAt || 0) >= 300) { needSchedule = true; state.owedScheduleAt = nowS(); } continue; }
    const lines = Asks.take(asks, role);
    if (lines.length) log(`${role} is up: handing over ${lines.length} held event(s)`);
    for (const w of wins) for (const line of lines) push(w, line);
  }
}
let needSchedule = false;
function windows() {
  try { return execFileSync('tmux', ['list-windows', '-t', 'pds1', '-F', '#W'], { encoding: 'utf8' }).split('\n').filter((w) => w && w !== 'shell'); } catch { return []; }
}
function deliver() {
  for (const [win, lines] of pending) {
    lines.sort((a, b) => (b.startsWith('you are named') ? 1 : 0) - (a.startsWith('you are named') ? 1 : 0)); // asks first
    const text = `GitHub events for you (#220 pickup): ${lines.slice(0, 6).join(' | ')}${lines.length > 6 ? ` | and ${lines.length - 6} more` : ''}. Check them and act if they are yours; queue green PRs with gh pr merge --auto.`;
    let code = 0;
    try { execFileSync('bash', [TEAM, 'wake', win, text, IDLE_S], { stdio: DRY ? 'inherit' : 'ignore', env: { ...process.env, ...(DRY ? { NUDGE_DRY: '1' } : {}) } }); } catch (e) { code = e.status; }
    if (code === 0) { pending.delete(win); if (!DRY) log(`woke ${win}: ${lines.length} event(s)`); }
    else if (code === 4) {
      // the window closed between listing and waking: hold the lines for the role's next start (#1130)
      pending.delete(win);
      if (!DRY) for (const l of lines) Asks.hold(asks, win, { number: Number((/#(\d+)/.exec(l) || [])[1] || 0), line: l, mention: l.startsWith('you are named'), delivered: false }, nowS());
      needSchedule = true;
      log(`${win} is gone; held ${lines.length} event(s) for its next start`);
    }
    else if (DRY) console.log(`${win} is busy: would deliver later (${lines.length} event(s))`);
  }
  if (needSchedule) {
    needSchedule = false;
    try { execFileSync('bash', [TEAM, 'schedule'], { stdio: DRY ? 'inherit' : 'ignore', env: { ...process.env, ...(DRY ? { NUDGE_DRY: '1' } : {}) } }); } catch { log('schedule failed'); }
  }
}

// delivered once (#220): a webhook and the feed both report the same event; the first one delivers it. Keys are the ids
// the two share (comment, review, workflow run) or the issue action itself; entries older than 2 hours are dropped
const delivered = new Map();
function once(key) {
  const now = Date.now();
  for (const [k, t] of delivered) if (now - t > 2 * 3600 * 1000) delivered.delete(k);
  if (!key || delivered.has(key)) return !key ? true : false;
  delivered.set(key, now);
  return true;
}
const eventKey = (type, p = {}) => p.comment ? `c:${p.comment.id}` : p.review ? `r:${p.review.id}`
  : p.issue ? `i:${p.action}:${p.issue.number}:${(p.label && p.label.name) || ''}` : '';

// a failed run of a PR (or its merge-queue entry) -> the PR's roles; a failed G2 run is the gate working as designed (#491)
async function routeRun(run) {
  if (run.name === 'G2') { if (DRY) console.log(`${run.created_at} G2 failed on ${run.head_branch} -> (gate working as designed: ignored)`); return; }
  if (!once(`run:${run.id}`)) return;
  const n = run.pull_requests?.[0]?.number || Number((/\/pr-(\d+)-/.exec(run.head_branch) || [])[1]);
  if (!n) return;
  const pr = (await get(`/repos/${REPO}/pulls/${n}`)).data;
  const roles = agentRoles(pr.labels);
  const line = `${run.name} failed on PR #${n} "${short(pr.title)}" ${run.html_url}`;
  if (DRY) console.log(`${run.created_at} run failed -> ${roles.join(', ') || '(no agent label: ignored)'}  ${line}`);
  for (const role of roles) queue(role, line, { number: n });
}

async function round() {
  const { data: events, poll } = await get(`/repos/${REPO}/events?per_page=100`, 'events');
  if (events) {
    // event ids are not ordered by time: keep the ids already handled (the feed holds at most 300 events) and go by time
    events.sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id));
    const seen = new Set(state.seen || []);
    const first = !state.seen && !DRY;
    // GitHub's feed sometimes lists an old event again under a new id (#220: a 22:46 comment on #431 came back at 02:59),
    // so an event created more than 30 minutes ago is not news; the 10-minute nudge covers anything truly that late
    const STALE_MS = 30 * 60 * 1000;
    const fresh = events.filter((e) => DRY || (!seen.has(e.id) && Date.now() - Date.parse(e.created_at) < STALE_MS));
    if (state.seen) for (const e of events) if (!DRY && !seen.has(e.id) && Date.now() - Date.parse(e.created_at) >= STALE_MS) log(`stale event ignored: ${e.type} ${e.created_at} (id ${e.id})`);
    if (first) log(`first run: ${events.length} existing events marked as seen (not replayed)`);
    else for (const ev of DRY ? fresh.slice(-15) : fresh) {
      const r = await route(ev);
      if (DRY) { const it = ev.payload?.issue || ev.payload?.pull_request; console.log(`${ev.created_at} ${ev.type}${ev.payload?.action ? '/' + ev.payload.action : ''} #${it?.number ?? '-'} -> ${r ? r.roles.join(', ') : '(ignored)'}${r ? '  ' + r.line : ''}`); }
      if (r && once(eventKey(ev.type, ev.payload))) for (const role of r.roles) queue(role, r.line, r);
    }
    // remember exactly the ids of the current feed: an event that leaves the feed never returns, and a capped list
    // that drops its oldest entries forgot events still in the feed, so they were delivered again and again (#220:
    // #422's comment woke the Design Director every few minutes for hours)
    state.seen = events.map((e) => e.id);
  }
  const { data: runs } = await get(`/repos/${REPO}/actions/runs?status=failure&per_page=20`, 'runs');
  if (runs) {
    for (const run of runs.workflow_runs.filter((x) => DRY || x.id > (state.lastRunId || 0)).reverse().slice(DRY ? -3 : 0)) {
      if (!state.lastRunId && !DRY) continue;
      await routeRun(run);
    }
    if (runs.workflow_runs[0]) state.lastRunId = Math.max(state.lastRunId || 0, runs.workflow_runs[0].id);
  }
  if (!DRY) release();
  deliver();
  save();
  return Math.max(60, poll);
}

if (DRY) { await round(); process.exit(0); }

// GitHub webhooks (#220): `gh webhook forward` (pds1-webhook.service) posts each delivery here, so the session it is for
// is woken within seconds; the 60-second feed above stays as the fallback, and `once()` keeps the two from doubling up
const WEBHOOK_PORT = Number(process.env.PICKUP_WEBHOOK_PORT || 0);
const TYPES = { issues: 'IssuesEvent', issue_comment: 'IssueCommentEvent', pull_request_review: 'PullRequestReviewEvent',
  pull_request_review_comment: 'PullRequestReviewCommentEvent' };
if (WEBHOOK_PORT) {
  http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 25e6) req.destroy(); });
    req.on('end', async () => {
      res.writeHead(200).end('ok');
      try {
        const kind = req.headers['x-github-event'];
        const payload = JSON.parse(body || '{}');
        if (kind === 'workflow_run') {
          if (payload.action === 'completed' && payload.workflow_run?.conclusion === 'failure') await routeRun(payload.workflow_run);
        } else if (TYPES[kind]) {
          const ev = { type: TYPES[kind], payload };
          const r = await route(ev);
          if (r && once(eventKey(ev.type, payload))) for (const role of r.roles) queue(role, r.line, r);
        }
        release();
        deliver();
        save();
      } catch (e) { log(`webhook failed: ${e.message}`); }
    });
  }).listen(WEBHOOK_PORT, '127.0.0.1', () => log(`webhook listener on 127.0.0.1:${WEBHOOK_PORT}`));
}
log('started');
for (;;) {
  let wait = 60;
  try { wait = await round(); } catch (e) { log(`round failed: ${e.message}`); }
  await new Promise((r) => setTimeout(r, wait * 1000));
}
