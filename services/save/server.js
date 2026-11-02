// Plenix save service (services/save, batch 258): the design system's Edit dialog saves here.
//   POST /api/tokens   { component, variant, file, changes: [{ token, from, to }] } -> a pull request on GitHub
//   GET  /api/session  who is signed in: { user, email, groups, canSave }
// It runs on the Plenix VM in Docker, behind the VM's Nginx, which accepts these paths only from Nginx Proxy Manager. The
// proxy signs people in through Authentik (forward auth) and passes X-authentik-username, -email and -groups (or, after
// the cutover, the VM's Nginx asks the Plenix login and passes X-Plenix-User, -Email and -Groups); only the Editors and
// Admins groups may save. A save: fetch main, check each token still has the value the dialog started from,
// write the new values into the token JSON, rebuild the token stylesheets (build-tokens.js), run the system check
// (check-system.js), commit on a new branch as the person who saved, push, and open a pull request. Nothing reaches main
// without a review; nothing reaches the live site without a release. Every attempt is logged (who, when, the changes, the
// result) in /data/log.jsonl. The GitHub token is the file /data/github-token (fine-grained: plenix-ds/plenix-platform,
// contents and pull requests read and write); without it, saves answer 503 "not configured".
// No dependencies: Node 22 and git.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const PORT = +process.env.PORT || 8781;
const DATA = process.env.DATA || '/data';
const WORK = path.join(DATA, 'work');
const LOG = path.join(DATA, 'log.jsonl');
const TOKEN_FILE = path.join(DATA, 'github-token');
const REPO = process.env.REPO || 'plenix-ds/plenix-platform';
const BASE = 'main';
// for tests: ORIGIN, a local repository instead of GitHub, and DRY_RUN=1, which pushes but opens no pull request
const ORIGIN = process.env.ORIGIN || 'https://github.com/' + REPO + '.git';
const DRY_RUN = process.env.DRY_RUN === '1';
const SAVE_GROUPS = ['Admins', 'Editors'];
const FILE_RE = /^platform\/tokens\/[a-z0-9.-]+\.tokens\.json$/;
const TOKEN_RE = /^--(plx-(?:ref|sys|comp))-([a-z0-9-]+)$/;
// a new value: a token reference as the JSON writes it ({plx-sys.state-hover}) or a plain CSS keyword or value
const VALUE_RE = /^(\{plx-(?:ref|sys|comp)\.[a-z0-9-]+\}|[a-zA-Z0-9#.%(), -]{1,120})$/;

// the Plenix login (services/login) passes X-Plenix-User, -Email and -Groups; Authentik's X-authentik-* still work until the cutover
const who = (req) => {
  const plenix = !!String(req.headers['x-plenix-user'] || '').trim(), h = (p, a) => String(req.headers[plenix ? p : a] || '').trim();
  const groups = h('x-plenix-groups', 'x-authentik-groups').split('|').map((g) => g.trim()).filter(Boolean);
  const user = h('x-plenix-user', 'x-authentik-username');
  return { user, email: h('x-plenix-email', 'x-authentik-email'), groups, canSave: !!user && groups.some((g) => SAVE_GROUPS.indexOf(g) >= 0) };
};
const send = (res, status, body) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); };
const log = (entry) => { try { fs.appendFileSync(LOG, JSON.stringify(Object.assign({ at: new Date().toISOString() }, entry)) + '\n'); } catch (e) { /* the log is best effort */ } };
const run = (cmd, args, opts) => new Promise((resolve, reject) => {
  execFile(cmd, args, Object.assign({ cwd: WORK, env: Object.assign({}, process.env, { GIT_TERMINAL_PROMPT: '0' }), maxBuffer: 8 * 1024 * 1024, timeout: 180000 }, opts || {}), (err, stdout, stderr) => {
    if (err) { err.output = String(stdout || '') + String(stderr || ''); reject(err); } else resolve(String(stdout || ''));
  });
});
const authHeader = (token) => 'AUTHORIZATION: basic ' + Buffer.from('x-access-token:' + token).toString('base64');
const git = (token, args) => run('git', ['-c', 'http.https://github.com/.extraheader=' + authHeader(token)].concat(args));

// one save at a time: the work tree is shared
let queue = Promise.resolve();
const serial = (job) => { const p = queue.then(job, job); queue = p.catch(() => {}); return p; };

async function save(body, person) {
  const token = fs.existsSync(TOKEN_FILE) ? fs.readFileSync(TOKEN_FILE, 'utf8').trim() : '';
  if (!token) return [503, { error: 'not-configured', message: 'Saving is not set up yet: the save service has no GitHub token (owner step: /srv/plenix/save/github-token on the Plenix VM).' }];
  // the request
  if (!body || !FILE_RE.test(body.file || '')) return [400, { error: 'bad-file', message: 'Only the token files (platform/tokens/*.tokens.json) can be saved.' }];
  const changes = Array.isArray(body.changes) ? body.changes : [];
  if (!changes.length || changes.length > 200) return [400, { error: 'bad-changes', message: 'Send between 1 and 200 token changes.' }];
  for (const c of changes) {
    if (!TOKEN_RE.test(c.token || '') || !VALUE_RE.test(String(c.to || ''))) return [400, { error: 'bad-change', message: 'Not a token change: ' + JSON.stringify(c).slice(0, 160) }];
  }
  // the work tree: main as it is now
  if (!fs.existsSync(path.join(WORK, '.git'))) {
    fs.mkdirSync(WORK, { recursive: true });
    await git(token, ['clone', '--quiet', '--depth', '50', '--branch', BASE, ORIGIN, WORK]);
  }
  await git(token, ['fetch', '--quiet', 'origin', BASE]);
  await run('git', ['checkout', '--quiet', '--force', '-B', 'save-work', 'origin/' + BASE]);
  await run('git', ['clean', '--quiet', '-fd']);
  // the change: each token must still have the value the dialog started from
  const file = path.join(WORK, body.file);
  if (!fs.existsSync(file)) return [400, { error: 'bad-file', message: body.file + ' is not in the repository.' }];
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  // a value in the W3C typed form ({ value, unit }, a color object, a font list; #872) is compared as its CSS text, and an
  // edit of a typed value is written typed again: the checkout's own tools/token-value.js (a checkout without it has
  // text values only)
  const tv = path.join(WORK, 'tools', 'token-value.js');
  delete require.cache[tv];   // the checkout moves with main: read its current copy
  const { css, typed } = fs.existsSync(tv) ? require(tv) : { css: String, typed: (t) => t };
  for (const c of changes) {
    const own = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);   // own properties only: a token named constructor is not the Object function (issue 695)
    const m = TOKEN_RE.exec(c.token), group = own(json, m[1]) ? json[m[1]] : null, entry = own(group, m[2]) ? group[m[2]] : null;
    if (!entry) return [400, { error: 'unknown-token', message: c.token + ' is not in ' + body.file + '.' }];
    if (c.from !== undefined && css(entry.$value) !== String(c.from)) return [409, { error: 'conflict', message: c.token + ' changed since the dialog opened (now ' + css(entry.$value) + '). Reload and edit again.' }];
    entry.$value = typeof entry.$value !== 'string' ? typed(String(c.to), entry.$type) : c.to;
  }
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
  // the build and the check: a change that breaks the system is not proposed
  try { await run('node', ['build-tokens.js']); await run('node', ['check-system.js']); }
  catch (e) { return [422, { error: 'check-failed', message: 'The change does not pass the system check.', output: String(e.output || e.message).slice(-1500) }]; }
  // the branch, the commit as the person who saved, the pull request
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..*$/, '').replace('T', '-');
  const slug = (person.user || 'editor').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
  const branch = 'save/' + slug + '-' + stamp;
  const what = [body.component, body.variant].filter(Boolean).join(' · ') || body.file;
  const list = changes.map((c) => '- `' + c.token + '`: `' + (c.from === undefined ? '?' : c.from) + '` → `' + c.to + '`').join('\n');
  await run('git', ['add', '-A']);
  await run('git', ['-c', 'user.name=' + (person.user || 'Plenix editor'), '-c', 'user.email=' + (person.email || 'editor@plenix.invalid'), 'commit', '--quiet', '-m',
    'Tokens: ' + what + ' (' + changes.length + (changes.length === 1 ? ' change' : ' changes') + ')\n\nSaved from the design system\'s Edit dialog by ' + (person.user || 'an editor') + '.\n\n' + list]);
  await git(token, ['push', '--quiet', 'origin', 'HEAD:refs/heads/' + branch]);
  if (DRY_RUN) return [200, { ok: true, pr: null, branch, dryRun: true }];
  const r = await fetch('https://api.github.com/repos/' + REPO + '/pulls', {
    method: 'POST', headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'User-Agent': 'plenix-save' },
    body: JSON.stringify({ title: 'Tokens: ' + what, head: branch, base: BASE, body: 'Saved from the design system\'s Edit dialog by **' + (person.user || 'an editor') + '**.\n\n' + list + '\n\nThe token stylesheets are rebuilt and the system check passed. Merge, then release to make it live.' })
  });
  const pr = await r.json().catch(() => ({}));
  if (!r.ok) return [502, { error: 'github', message: 'The branch ' + branch + ' was pushed, but GitHub did not open the pull request: ' + (pr.message || r.status) + '.' }];
  return [200, { ok: true, pr: pr.html_url, number: pr.number, branch }];
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0], person = who(req);
  if (req.method === 'GET' && url === '/api/session') return send(res, person.user ? 200 : 401, person.user ? person : { error: 'signed-out' });
  if (url !== '/api/tokens') return send(res, 404, { error: 'not-found' });
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });
  if (!person.user) return send(res, 401, { error: 'signed-out', message: 'Sign in to save.' });
  if (!person.canSave) { log({ user: person.user, result: 403 }); return send(res, 403, { error: 'forbidden', message: 'Only Editors and Admins can save tokens.' }); }
  let raw = '';
  req.on('data', (d) => { raw += d; if (raw.length > 65536) req.destroy(); });
  req.on('end', () => {
    let body; try { body = JSON.parse(raw); } catch (e) { return send(res, 400, { error: 'bad-json' }); }
    serial(() => save(body, person)).then(([status, out]) => {
      log({ user: person.user, groups: person.groups, file: body.file, component: body.component, variant: body.variant, changes: body.changes, result: status, pr: out.pr || null, error: out.error || null });
      send(res, status, out);
    }, (e) => {
      log({ user: person.user, file: body.file, result: 500, error: String(e.message).slice(0, 300) });
      send(res, 500, { error: 'failed', message: 'The save did not finish: ' + String(e.output || e.message).replace(/x-access-token:[^@\s]+/g, '***').slice(-600) });
    });
  });
});
server.listen(PORT, '0.0.0.0', () => console.log('plenix-save listening on ' + PORT));
