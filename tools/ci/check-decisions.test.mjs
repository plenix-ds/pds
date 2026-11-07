#!/usr/bin/env node
// Self-test of tools/ci/check-decisions.mjs. The three YAML breaks that took the dashboard down (#585) must fail the
// check, the same way the dashboard's yaml.safe_load (PyYAML) fails on them; a valid file must pass (#589).
// One file per decision (#955): decisions.d/D-NNNN.yaml is read with decisions.yaml; an id in both, a file named for
// another id, a file PyYAML can't read, an entry rewritten across the move, a new id already taken on main, and
// decisions.yaml added back after the fold all fail.
//   node tools/ci/check-decisions.test.mjs        (CI: the Decisions job, before the check itself)
import { spawnSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const check = path.join(dir, 'check-decisions.mjs');
const fixtures = path.join(dir, 'fixtures', 'decisions');
const NONE = path.join(fixtures, 'no-such-folder');
const run = (env, args = [], cwd = process.cwd()) => spawnSync(process.execPath, [check, ...args], { cwd, env: { ...process.env, ...env }, encoding: 'utf8' });
const cases = [
  // [name, file, folder, expected exit, text the output must hold when it fails]
  ['ok.yaml', 'ok.yaml', NONE, 0],
  ['flow-braces.yaml', 'flow-braces.yaml', NONE, 1, /not valid YAML/],        // { … } followed by more text inside a flow list
  ['flow-bare-quote.yaml', 'flow-bare-quote.yaml', NONE, 1, /not valid YAML/], // a bare "…" followed by more text inside a flow list
  ['single-quote.yaml', 'single-quote.yaml', NONE, 1, /not valid YAML/],       // an apostrophe inside a single-quoted value, not doubled
  ['file + folder', 'ok.yaml', 'dir-ok', 0],                                    // D-0001 in the file, D-0002 and D-0003 in the folder
  ['folder only', 'no-such-file.yaml', 'dir-ok', 0],                            // after the fold: no decisions.yaml
  ['an id in the file and the folder', 'ok.yaml', 'dir-dup', 1, /D-0001.*used twice/],
  ['a file named for another id', 'no-such-file.yaml', 'dir-name', 1, /D-0003\.yaml.*named for its id/],
  ['a folder file PyYAML rejects', 'no-such-file.yaml', 'dir-bad', 1, /D-0005\.yaml.*not valid YAML/],
];
let failed = 0;
const report = (name, ok, r, want) => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: exit ${r.status}, expected ${want}${ok ? '' : `\n${r.stdout}${r.stderr}`}`);
};
for (const [name, file, folder, want, text] of cases) {
  const r = run({ DECISIONS_FILE: path.join(fixtures, file), DECISIONS_DIR: path.isAbsolute(folder) ? folder : path.join(fixtures, folder) });
  report(name, r.status === want && (want === 0 || text.test(r.stdout)), r, want);
}

// against git refs: a throwaway repository whose "main" holds D-0001 in decisions.yaml and D-0002 in the folder
const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'decisions-test-'));
const git = (...a) => execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const put = (rel, from) => { fs.mkdirSync(path.dirname(path.join(repo, rel)), { recursive: true }); fs.copyFileSync(from, path.join(repo, rel)); };
try {
  git('init', '-q', '-b', 'main');
  git('config', 'user.email', 'test@example.invalid'); git('config', 'user.name', 'test');
  put('decisions.yaml', path.join(fixtures, 'ok.yaml'));
  put('decisions.d/D-0002.yaml', path.join(fixtures, 'dir-ok', 'D-0002.yaml'));
  git('add', '-A'); git('commit', '-q', '-m', 'base');
  const env = { DECISIONS_FILE: '', DECISIONS_DIR: '' };

  // the fold: D-0001 moves from the file into the folder unchanged; nothing is removed or rewritten
  git('checkout', '-q', '-b', 'fold');
  fs.rmSync(path.join(repo, 'decisions.yaml'));
  fs.writeFileSync(path.join(repo, 'decisions.d', 'D-0001.yaml'), fs.readFileSync(path.join(fixtures, 'ok.yaml'), 'utf8').replace(/^- /, '').replace(/^ {2}/gm, ''));
  let r = run(env, ['main'], repo);
  report('the fold keeps every entry', r.status === 0, r, 0);

  // a past entry rewritten in its new file
  fs.writeFileSync(path.join(repo, 'decisions.d', 'D-0002.yaml'), fs.readFileSync(path.join(fixtures, 'dir-ok', 'D-0002.yaml'), 'utf8').replace('area: process', 'area: release'));
  r = run(env, ['main'], repo);
  report('a past entry rewritten across files', r.status === 1 && /D-0002: "area" changed/.test(r.stdout), r, 1);

  // two branches take D-0003; the second runs after the first reached main (--main): it must renumber
  git('checkout', '-q', '-f', 'main'); git('clean', '-fdq');
  git('checkout', '-q', '-b', 'second');
  put('decisions.d/D-0003.yaml', path.join(fixtures, 'dir-ok', 'D-0003.yaml'));
  const second = path.join(repo, 'decisions.d', 'D-0003.yaml');
  fs.writeFileSync(second, fs.readFileSync(second, 'utf8').replace('A second entry', 'Another branch, same id'));
  git('add', '-A'); git('commit', '-q', '-m', 'second');
  git('checkout', '-q', 'main');
  put('decisions.d/D-0003.yaml', path.join(fixtures, 'dir-ok', 'D-0003.yaml'));
  git('add', '-A'); git('commit', '-q', '-m', 'first');
  git('checkout', '-q', 'second');
  const base = git('merge-base', 'main', 'second').trim();
  r = run(env, [base, '--main', 'main'], repo);
  report('a new id already taken on main', r.status === 1 && /D-0003: taken on main/.test(r.stdout), r, 1);
  r = run(env, [base], repo);
  report('the same branch without --main', r.status === 0, r, 0);

  // after the fold, decisions.yaml is retired: a branch that adds it back fails (its entry belongs in the folder)
  git('checkout', '-q', '-f', 'fold'); git('clean', '-fdq');
  git('add', '-A'); git('commit', '-q', '-m', 'fold');
  git('checkout', '-q', '-b', 'back');
  fs.writeFileSync(path.join(repo, 'decisions.yaml'), fs.readFileSync(path.join(fixtures, 'ok.yaml'), 'utf8').replace(/D-0001/, 'D-0009'));
  r = run(env, ['fold'], repo);
  report('decisions.yaml added back after the fold', r.status === 1 && /decisions\.yaml is retired/.test(r.stdout), r, 1);
} finally {
  fs.rmSync(repo, { recursive: true, force: true });
}

const total = cases.length + 5;
console.log(failed ? `DECISIONS_TEST_FAIL (${failed} of ${total})` : `DECISIONS_TEST_OK (${total})`);
process.exit(failed ? 1 : 0);
