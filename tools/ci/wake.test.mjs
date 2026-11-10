#!/usr/bin/env node
// Self-test of `team.sh wake` (the idle check the nudge and the pickup service use), with a stub tmux that serves a
// pane fixture. #1166: a pane that had run "/remote-control" kept the line "❯ /remote-control ..." above its real,
// empty input box; wake read the first "❯" line, judged the box non-empty and never woke the session (10.5 h idle).
//   node tools/ci/wake.test.mjs        (CI: the Process checks job)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wake-'));
const stub = path.join(tmp, 'tmux');
fs.writeFileSync(stub, `#!/bin/bash
case "$1" in
  display-message) case "\${@: -1}" in '#{window_activity}') echo "$STUB_ACT" ;; '#W') echo "$STUB_WIN" ;; esac ;;
  capture-pane) cat "$STUB_PANE" ;;
esac
`, { mode: 0o755 });

const home = path.join(tmp, 'home');
fs.mkdirSync(path.join(home, 'pds1'), { recursive: true });   // team.sh logs to $HOME/pds1/team.log, as the launch test's CI step prepares

const BAR = '─'.repeat(50);
const box = (typed = '') => `${BAR}\n❯ ${typed}\n${BAR}\n  ⏵⏵ bypass permissions on (shift+tab to cycle) · ← 1 agent\n`;
const rcHistory = '❯ /remote-control PDS1 · i18n Engineer\n\n  /remote-control is active · Continue here, on your phone\n\n';
const panes = {
  'idle, nothing above the box': box(),
  'idle, with the "❯ /remote-control" history line above the box (#1166)': rcHistory + box(),
  'idle, an old prompt and an answer above the box': '❯ check #5\n\n● done\n\n' + box(),
  'text typed in the box': rcHistory + box('half a sentence'),
  'working (esc to interrupt)': rcHistory + box().replace('← 1 agent', 'esc to interrupt · ← 1 agent'),
};
const wake = (name, activityAgeS, idleS = 120) => {
  const pane = path.join(tmp, 'pane.txt');
  fs.writeFileSync(pane, panes[name]);
  const r = spawnSync('bash', [path.join(root, 'deploy/agents/team.sh'), 'wake', 'i18n-engineer', 'x', String(idleS)], {
    encoding: 'utf8',
    env: { ...process.env, HOME: home, PDS1_CFG: path.join(root, 'agents.config.yaml'), TEAM_TEST_BIN: tmp, NUDGE_DRY: '1', STUB_PANE: pane, STUB_WIN: 'i18n-engineer',
      STUB_ACT: String(Math.floor(Date.now() / 1000) - activityAgeS) },
  });
  return r.status;
};

let failed = 0;
const check = (name, got, want) => {
  const ok = got === want;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} wake: ${name}${ok ? '' : ` (got ${got}, want ${want})`}`);
};
const names = Object.keys(panes);
check(names[0] + ' -> sent', wake(names[0], 38000), 0);
check(names[1] + ' -> sent', wake(names[1], 38000), 0);
check(names[2] + ' -> sent', wake(names[2], 38000), 0);
check(names[3] + ' -> not idle', wake(names[3], 38000), 3);
check(names[4] + ' -> not idle', wake(names[4], 38000), 3);
check('idle pane changed 10 s ago -> not idle yet', wake(names[1], 10), 3);

fs.rmSync(tmp, { recursive: true, force: true });
if (failed) { console.error(`${failed} wake check(s) failed`); process.exit(1); }
