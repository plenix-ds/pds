/* Plenix vote kit · reference service (vote-kit/reference/server.js)
   Summary: A small in-memory service that keeps the contract (contract/openapi.yaml and contract/events.md), for reading and for
     trying a screen against. It is NOT the production service: an app's own service keeps the same contract on its own Postgres
     (schema/001_vote.sql). No dependencies.
   Usage:
     node vote-kit/reference/server.js                 // http://localhost:8790, one demo event "1"
     createVoteService({ canVote, canManage, appSettings })   // for an app: the two rights functions are the app's own
   Props:
     createVoteService({ canVote(caller, memberId), canManage(caller, eventId), appSettings, keep }): returns { handle(req, res), seed(event) }
       caller: read from the x-demo-user header here; an app reads its own session
       keep: how many changes per event are kept for catch-up (default 500)
   Behavior:
     Every change bumps the event's version, is kept in the history and is sent to the open streams as ballot + outcome events,
       cut to what each caller may see (settings.liveVisibility). A reconnect with Last-Event-ID replays what is kept, else a snapshot. */
import http from 'node:http';
import { resolveSettings } from '../src/settings.js';
import { count, viewFor } from '../src/count.js';

export function createVoteService({ canVote = () => true, canManage = () => true, appSettings = {}, keep = 500 } = {}) {
  const events = new Map();   // id -> { id, title, status, version, settings, members: Map, ballots: Map, history: [], streams: Set }

  const seed = (e) => events.set(String(e.id), { id: String(e.id), title: e.title, status: e.status || 'open', version: 0, settings: e.settings || {},
    members: new Map((e.members || []).map((m) => [m.memberId, Object.assign({ weight: 1, present: true, disabledReason: null }, m)])), ballots: new Map(), history: [], streams: new Set() });
  const settingsOf = (ev) => resolveSettings(appSettings, ev.settings);
  const ballotList = (ev) => [...ev.ballots].map(([memberId, option]) => ({ memberId, option }));
  const outcomeOf = (ev) => count(ev, [...ev.members.values()], ballotList(ev), settingsOf(ev));
  const viewOf = (ev, caller) => {
    const st = settingsOf(ev), full = outcomeOf(ev), v = viewFor(full, ballotList(ev), st, { status: ev.status, memberId: caller.id, canManage: canManage(caller, ev.id) });
    const votes = new Map(v.ballots.map((b) => [b.memberId, b.option]));
    return { id: ev.id, title: ev.title, status: ev.status, version: ev.version, settings: st, outcome: v.outcome, votesHidden: v.votesHidden,
      members: [...ev.members.values()].map((m) => Object.assign({}, m, { vote: votes.get(m.memberId) || null, voteHidden: v.votesHidden && m.memberId !== caller.id && !m.disabledReason })) };
  };
  const send = (res, id, name, data) => res.write((id !== null ? 'id: ' + id + '\n' : '') + 'event: ' + name + '\ndata: ' + JSON.stringify(data) + '\n\n');
  const note = (ev, change) => {
    ev.version += 1;
    const c = Object.assign({ version: ev.version, at: new Date().toISOString() }, change);
    ev.history.push(c); if (ev.history.length > keep) ev.history.shift();
    ev.streams.forEach((s) => {
      const st = settingsOf(ev), manager = canManage(s.caller, ev.id);
      if (c.kind === 'ballot' && (manager || st.liveVisibility === 'named' || c.memberId === s.caller.id)) send(s.res, c.version, 'ballot', c);
      send(s.res, c.version, 'outcome', viewOf(ev, s.caller).outcome);
    });
    return c;
  };
  const json = (res, code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); };
  const body = (req) => new Promise((ok) => { let d = ''; req.on('data', (c) => { d += c; }); req.on('end', () => { try { ok(d ? JSON.parse(d) : {}); } catch (e) { ok({}); } }); });

  async function handle(req, res) {
    const caller = { id: req.headers['x-demo-user'] || 'anonymous' };
    const m = /^\/vote\/events\/([^/]+)(?:\/(ballots|close|reopen|history|stream)(?:\/([^/]+))?)?$/.exec(new URL(req.url, 'http://x').pathname);
    const ev = m && events.get(m[1]);
    if (!ev) return json(res, 404, { error: 'no such event' });
    const part = m[2], st = settingsOf(ev);
    if (!part && req.method === 'GET') return json(res, 200, viewOf(ev, caller));
    if (part === 'history' && req.method === 'GET') return canManage(caller, ev.id) || st.liveVisibility === 'named' ? json(res, 200, ev.history) : json(res, 403, { error: 'not allowed' });
    if (part === 'ballots' && req.method === 'PUT') {
      const mem = ev.members.get(m[3]), b = await body(req);
      if (!mem || mem.disabledReason || !canVote(caller, m[3])) return json(res, 403, { error: 'not allowed to vote for this member' });
      if (ev.status !== 'open' || (st.changeVote === 'final' && ev.ballots.has(m[3]))) return json(res, 409, { error: 'closed or final' });
      if (b.option === null || b.option === undefined) ev.ballots.delete(m[3]); else if (['approve', 'deny', 'abstain'].indexOf(b.option) >= 0) ev.ballots.set(m[3], b.option); else return json(res, 400, { error: 'option' });
      const c = note(ev, { kind: 'ballot', memberId: m[3], option: b.option || null, by: caller.id, reason: b.reason || null });
      return json(res, 200, { version: c.version, member: Object.assign({}, mem, { vote: b.option || null }), outcome: viewOf(ev, caller).outcome });
    }
    if (part === 'close' && req.method === 'POST') {
      if (!canManage(caller, ev.id)) return json(res, 403, { error: 'not a manager' });
      if (ev.status !== 'open') return json(res, 409, { error: 'not open' });
      ev.status = 'closed'; note(ev, { kind: 'status', detail: { status: 'closed', result: outcomeOf(ev).result }, by: caller.id });
      return json(res, 200, viewOf(ev, caller));
    }
    if (part === 'reopen' && req.method === 'POST') {
      // reopen "chair-only" and "anyone-who-can-manage" both ask the app's canManage (the app decides who the chair is); "never" refuses
      if (st.reopen === 'never' || !canManage(caller, ev.id)) return json(res, 403, { error: 'not allowed' });
      ev.status = 'open'; note(ev, { kind: 'status', detail: { status: 'open' }, by: caller.id, reason: (await body(req)).reason || null });
      return json(res, 200, viewOf(ev, caller));
    }
    if (part === 'stream' && req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' });
      const s = { res, caller }, last = Number(req.headers['last-event-id']);
      const first = ev.history.length ? ev.history[0].version : ev.version + 1;
      if (Number.isFinite(last) && last >= first - 1 && last <= ev.version) {   // replay what is kept
        ev.history.filter((c) => c.version > last).forEach((c) => { if (c.kind === 'ballot' && (canManage(caller, ev.id) || st.liveVisibility === 'named' || c.memberId === caller.id)) send(res, c.version, 'ballot', c); });
        send(res, ev.version, 'outcome', viewOf(ev, caller).outcome);
      } else send(res, ev.version, 'snapshot', viewOf(ev, caller));
      ev.streams.add(s);
      const ping = setInterval(() => send(res, null, 'ping', {}), 20000);
      req.on('close', () => { clearInterval(ping); ev.streams.delete(s); });
      return undefined;
    }
    return json(res, 405, { error: 'method' });
  }
  return { handle, seed };
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const svc = createVoteService({ canVote: (c, memberId) => c.id === memberId || c.id === 'clerk', canManage: (c) => c.id === 'chair' || c.id === 'clerk' });
  svc.seed({ id: 1, title: 'Motion 14: approve the 2027 budget', members: [
    { memberId: 'maya', name: 'Maya Chen', role: 'Chair' }, { memberId: 'omar', name: 'Omar Haddad', role: 'Vice chair' },
    { memberId: 'lena', name: 'Lena Fischer', role: 'Member' }, { memberId: 'tariq', name: 'Tariq Aziz', role: 'Member' },
    { memberId: 'sofia', name: 'Sofia Rossi', role: 'Member', disabledReason: 'Recused' }] });
  http.createServer(svc.handle).listen(8790, () => console.log('vote reference service on http://localhost:8790/vote/events/1'));
}
