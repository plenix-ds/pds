#!/usr/bin/env node
// Release step after the live check (#750, D-0082): tell each app that auto-upgrades from cdn/latest.json that a new
// version is live, so it doesn't wait for its own schedule (GitHub ran CTM's */30 cron three times on 2026-11-06).
//
//   node tools/publish/notify-apps.mjs <version> [--dry-run] [--registry tools/baseline/apps.json]
//
// Each app in the registry with "notify": { "event_type": "…" } and a repository gets one
//   POST /repos/<repository>/dispatches {"event_type": "…", "client_payload": {"version": "<version>"}}
// sent with the agent host's gh login (the account that owns CTM; no new token or secret). It sends nothing unless
// the live CDN's /cdn/<version>/version.json names that version. When the PDS GitHub App exists (D-0019), the
// dispatch moves to its token. Exit 1 when a dispatch fails, so the release log shows it.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const CDN = 'https://design-system.lighthouseway.org/cdn/';

// apps, the version to announce, the version the live CDN serves for it -> { ok, calls, reason? }
export function plan(apps, version, live) {
  if (!/^\d+\.\d+\.\d+$/.test(version || '')) return { ok: false, calls: [], reason: `version "${version}" is not X.Y.Z` };
  if (live !== version) return { ok: false, calls: [], reason: `the live CDN version.json for ${version} says ${live}` };
  const calls = apps.filter((a) => a.notify?.event_type && a.repository).map((a) => ({
    app: a.name, path: `repos/${a.repository}/dispatches`,
    body: { event_type: a.notify.event_type, client_payload: { version } },
  }));
  return { ok: true, calls };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const version = args[0];
  const dry = args.includes('--dry-run');
  const reg = args.includes('--registry') ? args[args.indexOf('--registry') + 1] : 'tools/baseline/apps.json';
  let live = '';
  try {
    const r = await fetch(`${CDN}${version}/version.json`);
    live = r.ok ? (await r.json()).version : `HTTP ${r.status}`;
  } catch (e) { live = `unreachable (${e.message})`; }
  const p = plan(JSON.parse(fs.readFileSync(reg, 'utf8')).apps, version, live);
  if (!p.ok) { console.log(`NOTIFY_FAIL: ${p.reason}; nothing sent`); process.exit(1); }
  let fail = 0;
  for (const c of p.calls) {
    if (dry) { console.log(`dry run: POST ${c.path} ${JSON.stringify(c.body)}`); continue; }
    try {
      execFileSync('gh', ['api', '-X', 'POST', c.path, '--input', '-'], { input: JSON.stringify(c.body), stdio: ['pipe', 'ignore', 'pipe'] });
      console.log(`${c.app}: ${c.body.event_type} ${version} sent (${c.path})`);
    } catch (e) { fail++; console.log(`::error title=${c.app}::dispatch failed: ${String(e.stderr || e.message).trim().split('\n').pop()}`); }
  }
  if (fail) { console.log(`NOTIFY_FAIL (${fail})`); process.exit(1); }
  console.log(`NOTIFY_OK ${version} (${p.calls.length} app${p.calls.length === 1 ? '' : 's'})`);
}
