// Plenix · what the two Plenix checks share (style-plan-30, step 4): the files they read and the way they report.
//   check-system.js   the system check: structure, markup, files and generated code (npm run lint:system)
//   check-style.js    the Plenix style check, beside Stylelint: the style rules Stylelint cannot check one stylesheet at
//                     a time (token files, backlogs, other files, code and markup)
// Every style rule lives in exactly one place: Stylelint (.stylelintrc.json, tools/stylelint/plenix.mjs) or check-style.js
// (owner, style-plan-30). STYLE_MODULES says which check-system.rules/ modules check-style.js runs; check-system.js runs
// the others. A module without check() is run by Stylelint (logical-properties.js).
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DAM = path.join(ROOT, 'dam');
const SUITE = ['dashboard', 'projects', 'messages', 'contacts', 'calendar', 'tasks', 'notes', 'bookmarks', 'files', 'settings'];
const SKIP = /[\\/](node_modules|dist|vendor|Archived|archive|backups|audit|docs|handoff|capabilities|architecture|metadata|AI_CONTEXT|shared - Copy|Original 2026-09-23)([\\/]|$)/;
// files that are not part of either application (kept for reference, never loaded)
const NOT_LOADED = new Set([]);
const SOURCES = [
  // native-guidance.js is generated data: its code samples are Swift, Kotlin and Android XML (UIAlertAction style:,
  // <style name=…>), shown as text in a code block, never markup a page renders (batch 341)
  { dir: path.join(ROOT, 'platform'), app: 'platform', skip: /[\\/]design-system[\\/]native-guidance(-full)?\.js$/ },
  { dir: path.join(ROOT, 'suite'), app: 'suite' },
  ...SUITE.map((f) => ({ dir: path.join(ROOT, f), app: f, skip: /[\\/]app\.js$/ })),
  { dir: path.join(DAM, 'app'), app: 'asset manager', skip: /[\\/]app[\\/]assets\.js$/ },
  { dir: DAM, app: 'asset manager', flat: true },
];
// the check-system.rules/ modules that are style rules: check-style.js runs them, check-system.js skips them
const STYLE_MODULES = ['inline-style', 'cascade-layers', 'selector-kinds', 'text-contract', 'token-definitions', 'color-groups', 'field-background', 'unused-component-tokens', 'deprecated-classes'];
const SPEC_PAGE = /[\\/]platform[\\/]design-system[\\/]/;
const rel = (f) => path.relative(path.dirname(ROOT), f).split(path.sep).join('/');

function walk(dir, flat, out) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (SKIP.test(f)) continue;
    if (e.isDirectory()) { if (!flat) walk(f, false, out); }
    else if (/\.(css|js|jsx|ts|tsx|html)$/.test(e.name)) out.push(f);
  }
  return out;
}
// the files both checks read: [{ file, app }]
function collect() {
  const files = [];
  for (const s of SOURCES) for (const f of walk(s.dir, s.flat, [])) {
    if (s.skip && s.skip.test(f)) continue;
    if (NOT_LOADED.has(path.relative(ROOT, f).split(path.sep).join('/'))) continue;
    if (!files.some((x) => x.file === f)) files.push({ file: f, app: s.app });
  }
  return files;
}

// a check's findings: add(rule, file, line, text), then finish(OK, FAIL) prints them by rule and exits
function reporter() {
  const findings = [];
  const ALL = process.argv.includes('--all');   // list every finding, not the first 25 of each rule
  const lineText = (file, n) => { try { return fs.readFileSync(file, 'utf8').split('\n')[n - 1] || ''; } catch { return ''; } };
  // a line of prose that names the rule (documentation in the design system) carries plx-allow-style
  const add = (rule, file, line, text) => (rule === 'inline-style' && line && /plx-allow-style/.test(lineText(file, line))) ? null : findings.push({ rule, where: rel(file) + (line ? ':' + line : ''), text: text.trim().slice(0, 140) });
  // the modules of check-system.rules/ this check runs (each { check({ files, add }) }; the library waves, batch 347)
  const runModules = (files, which) => {
    const dir = path.join(ROOT, 'check-system.rules');
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir).filter((x) => /\.js$/.test(x)).sort()) {
      if (!which(f.replace(/\.js$/, ''))) continue;
      const rule = require(path.join(dir, f));
      if (typeof rule.check === 'function') rule.check({ files, add });
    }
  };
  const finish = (ok, fail, count) => {
    const byRule = {};
    for (const f of findings) (byRule[f.rule] = byRule[f.rule] || []).push(f);
    for (const rule of Object.keys(byRule)) {
      console.log(rule + ': ' + byRule[rule].length);
      byRule[rule].slice(0, ALL ? undefined : 25).forEach((f) => console.log('  ' + f.where + '  ' + f.text));
      if (!ALL && byRule[rule].length > 25) console.log('  … and ' + (byRule[rule].length - 25) + ' more');
    }
    console.log(findings.length ? fail + ' (' + findings.length + ' findings in ' + count + ' files)' : ok + ' (' + count + ' files)');
    process.exit(findings.length ? 1 : 0);
  };
  return { add, runModules, finish };
}

module.exports = { ROOT, DAM, SPEC_PAGE, STYLE_MODULES, rel, collect, reporter };
