#!/usr/bin/env node
// Self-test of deploy/agents/webhook-clean.sh (#1182): it deletes only the hook `gh webhook forward` left behind, so a
// restart of pds1-webhook.service no longer fails with "Hook already exists".
//   node tools/ci/webhook-clean.test.mjs        (CI: the Process checks job)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'whc-'));
const calls = path.join(tmp, 'calls.txt');
const hooks = [
  { id: 111, config: { url: 'https://webhook-forwarder.github.com/hook' } },
  { id: 222, config: { url: 'https://example.org/other-hook' } },
  { id: 333, config: { url: 'https://webhook-forwarder.github.com/hook' } },
];
const stub = path.join(tmp, 'gh');
// a stub gh: `api repos/R/hooks --jq F` runs the real filter through jq on the fixture; DELETE calls are recorded
fs.writeFileSync(path.join(tmp, 'hooks.json'), JSON.stringify(hooks));
fs.writeFileSync(stub, `#!/bin/bash
echo "$*" >> "${calls}"
if [ "$2" = "-X" ]; then exit 0; fi
jq -r "$4" "${tmp}/hooks.json"
`, { mode: 0o755 });

const r = spawnSync('bash', [path.join(root, 'deploy/agents/webhook-clean.sh')], { encoding: 'utf8', env: { ...process.env, GH_BIN: stub, WEBHOOK_REPO: 'o/r' } });
const deleted = fs.readFileSync(calls, 'utf8').split('\n').filter((l) => l.includes('-X DELETE')).map((l) => l.split('/').pop());
let failed = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} webhook-clean: ${name}${ok ? '' : ` (got ${JSON.stringify(got)}, want ${JSON.stringify(want)})`}`);
};
check('exits 0', r.status, 0);
check('deletes the forwarder hooks and no other hook', deleted, ['111', '333']);
fs.rmSync(tmp, { recursive: true, force: true });
if (failed) process.exit(1);
