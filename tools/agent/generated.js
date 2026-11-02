// node tools/agent/generated.js --check <base ref> [<head ref>]   fails when a branch changed a generated file since it
//                                                    left <base ref> (their merge base; head: default HEAD)
// node tools/agent/generated.js --restore            puts every generated file back as committed (before a commit)
// node tools/agent/generated.js --list               prints the patterns
// The files a task branch never commits. Since #692 the build's outputs are not in git at all (.gitignore; npm ci builds
// them through package.json's prepare script), so this list keeps only what the integrator writes into tracked files: the
// release's CHANGELOG.md and package.json "version" (release.sh), the spec submodule's pointer,
// and the library block of platform/index.js and platform.css (build-exports.js). Owner, 2026-10-15 (the Claude + Codex
// pilot); narrowed by #692.
// package.json is the one partly generated file: release.sh writes only its "version" field. --check fails on package.json
// only when that field differs from the merge base, --restore puts back only that field, and take-pr.js takes the rest of
// the file from the branch, so a branch may change its devDependencies, scripts and the rest (Dependabot, the Vite steps
// of #709). package-lock.json is not on the list: npm writes it with the dependencies.
const { execSync } = require('child_process');
const path = require('path');
const GENERATED = [
  /^packages\//, /^release\//,                            // the packages and the release (ignored; never committed)
  /^CHANGELOG\.md$/, /^package\.json$/,                    // written by release.sh
  /^platform\/design-system$/, /^node_modules$/,           // the submodule pointer and the dependency junction
  // the design system's own generated files are ignored in its repository (#692), and lanes carry sources only (check-system)
];
const PARTIAL = ['platform/index.js', 'platform/platform.css'];
const BLOCK = /\/\* BEGIN library parts[^]*?\/\* END library parts \*\//;
const generatedBlock = (text) => (text.match(BLOCK) || [''])[0];
const isGenerated = (file) => GENERATED.some((re) => re.test(file));
// package.json's release-written field: the text with its top-level "version" set to version (the rest unchanged)
const VERSION_FIELD = /^(\s*"version"\s*:\s*)"[^"]*"/m;
const versionOf = (text) => { try { return JSON.parse(text).version; } catch (e) { return undefined; } };
const withVersion = (text, version) => (version === undefined ? text : text.replace(VERSION_FIELD, (m, key) => key + JSON.stringify(version)));
module.exports = { GENERATED, isGenerated, versionOf, withVersion };
if (require.main === module) {
  const ROOT = path.resolve(__dirname, '../..');
  const sh = (c) => execSync(c, { cwd: ROOT, encoding: 'utf8' });
  const arg = process.argv[2];
  if (arg === '--list') { GENERATED.forEach((re) => console.log(re.source)); process.exit(0); }
  if (arg === '--check') {
    // <base ref> [<head ref>]: the branch's own commits, from where it last met the base (their merge base) to its head
    // (default HEAD). In a pull request CI passes the base branch and the PR's head commit, not the PR's merge commit
    // (which also holds the base's newer commits, e.g. "Generated files rebuilt", and read as the branch's own: #623)
    const base = process.argv[3], head = process.argv[4] || 'HEAD'; if (!base) { console.error('usage: --check <base ref> [<head ref>]'); process.exit(2); }
    const from = sh('git merge-base ' + base + ' ' + head).trim();
    const version = (ref) => { try { return versionOf(sh('git show ' + ref + ':package.json')); } catch (e) { return undefined; } };
    const changed = sh('git diff --name-only ' + from + ' ' + head).split('\n').filter(Boolean).filter((file) => isGenerated(file) && !(file === 'package.json' && version(from) === version(head)) && !(file === 'platform/components/DataGrid/data-grid-steps.css' && sh('git diff --diff-filter=D --name-only ' + from + ' ' + head + ' -- platform/components/DataGrid/DataGrid.jsx').trim() && sh('git diff --diff-filter=D --name-only ' + from + ' ' + head + ' -- platform/components/DataGrid/data-grid-steps.css').trim()));
    // index.js and platform.css: a branch may change their library block only to what build-exports.js makes from the branch's
    // own platform/exports (a renamed part file, a new part), so main is never left with a stale block until a rebuild commit.
    // Read on the checkout of head (CI checks out the PR's head commit): the file as committed there, and build-exports' check
    const fs = require('fs');
    const fromExports = (file) => {
      const full = path.join(ROOT, file);
      if (!fs.existsSync(full) || fs.readFileSync(full, 'utf8') !== sh('git show ' + head + ':' + file)) return false;
      return !require(path.join(ROOT, 'build-exports.js'))(ROOT, { check: true }).stale.includes(file);
    };
    for (const file of PARTIAL) if (generatedBlock(sh('git show ' + from + ':' + file)) !== generatedBlock(sh('git show ' + head + ':' + file)) && !fromExports(file)) changed.push(file);
    if (changed.length) {
      console.log('GENERATED_FAIL: this branch commits generated files (the integrator rebuilds them at merge):\n  ' + changed.join('\n  ') +
        '\nPut them back: node tools/agent/generated.js --restore, then commit (see AGENTS.md).');
      process.exit(1);
    }
    console.log('GENERATED_OK'); process.exit(0);
  }
  if (arg === '--restore') {
    const files = sh('git status --porcelain').split('\n').filter(Boolean).map((l) => ({ code: l.slice(0, 2), file: l.slice(3).replace(/^"|"$/g, '') }))
      .filter((x) => isGenerated(x.file) && x.code.trim() !== '??');
    // package.json: only its "version" goes back to HEAD's; the branch's other changes stay
    const pkg = files.find((x) => x.file === 'package.json');
    if (pkg) {
      files.splice(files.indexOf(pkg), 1);
      const full = path.join(ROOT, 'package.json'), current = require('fs').readFileSync(full, 'utf8'), committed = versionOf(sh('git show HEAD:package.json'));
      if (versionOf(current) !== committed) { require('fs').writeFileSync(full, withVersion(current, committed)); files.push({ file: 'package.json ("version" only)' }); }
    }
    for (const file of PARTIAL) {
      const full = path.join(ROOT, file);
      if (!require('fs').existsSync(full)) continue; // Partial build fixtures need not contain public entry files.
      const current = require('fs').readFileSync(full, 'utf8'), committed = generatedBlock(sh('git show HEAD:' + file));
      require('fs').writeFileSync(full, current.replace(BLOCK, () => committed));
    }
    for (const { file } of files.filter((x) => x.file !== 'package.json ("version" only)').filter((x) => x.file !== 'platform/components/DataGrid/data-grid-steps.css' || require('fs').existsSync(path.join(ROOT, 'platform/components/DataGrid/DataGrid.jsx')) || require('fs').existsSync(path.join(ROOT, x.file)))) sh('git checkout -- "' + file + '"');
    console.log(files.length ? 'restored: ' + files.map((x) => x.file).join(', ') : 'nothing to restore'); process.exit(0);
  }
  console.error('usage: node tools/agent/generated.js --check <base> | --restore | --list'); process.exit(2);
}
