#!/usr/bin/env node
// Activity record for the scheduler (#769; template v2.4 §5.2): every PDS1 session writes when it starts working and when
// it finishes a turn, to ~/pds1/.activity/<window>.json ({ "state": "working" | "idle", "t": <unix seconds>, "event" }).
// deploy/agents/scheduler.mjs reads it to stop a session idle for long_work.idle_exit_min, instead of reading the screen.
// Registered in .claude/settings.json for UserPromptSubmit, PreToolUse and PostToolUse (working) and Stop (idle).
// Only sessions started by team.sh (PDS1_ROLE set) write; it never fails, never prints and never blocks the session.
const fs = require('fs');
const os = require('os');
const path = require('path');
try {
  const role = process.env.PDS1_ROLE;
  if (role) {
    const event = process.argv[2] || 'unknown';
    // the tmux window: set by team.sh; else the worktree's folder (~/pds1/work/<window>); else the role (coordinators)
    const dir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
    const fromDir = /\/pds1\/work\/([a-z0-9-]+)\/?$/.exec(dir)?.[1];
    const win = process.env.PDS1_WINDOW || (fromDir && fromDir !== 'pds' ? fromDir : role.replace(/^pds1-/, ''));
    if (/^[a-z0-9-]+$/.test(win)) {
      const out = path.join(process.env.PDS1_ROOT || path.join(os.homedir(), 'pds1'), '.activity');
      fs.mkdirSync(out, { recursive: true });
      const file = path.join(out, `${win}.json`);
      const rec = { state: event === 'Stop' ? 'idle' : 'working', t: Math.floor(Date.now() / 1000), event };
      fs.writeFileSync(`${file}.tmp`, JSON.stringify(rec));
      fs.renameSync(`${file}.tmp`, file);
    }
  }
} catch { /* the record is a hint; a session must never fail because of it */ }
process.exit(0);
