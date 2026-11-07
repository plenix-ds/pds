// Every relative import in a TypeScript declaration file resolves inside the artifact that ships it (#894). 0.91.0 to
// 0.93.0 shipped an archive whose plenix.d.ts imported 672 files from ./types/ while the archive held no types/ folder,
// so an app that self-hosts the archive failed its typecheck. build-packages.js runs this on the archive, the CDN folder
// and @plenix-ds/react; a dangling import fails the build (and so the release dry run). Tested by
// tools/publish/dts-closure.test.mjs.
//   node tools/publish/dts-closure.cjs <folder> [<folder> …]      exit 1 and list the dangling imports
'use strict';
const fs = require('fs');
const path = require('path');

// the relative specifiers in one declaration file: from '…', import('…'), import '…', /// <reference path="…" />
function specifiers(text) {
  const out = new Set();
  const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/(?!\/ *<reference).*$/gm, '');
  for (const re of [/\bfrom\s*['"]([^'"]+)['"]/g, /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g, /^\s*import\s*['"]([^'"]+)['"]/gm, /\/\/\/\s*<reference\s+path\s*=\s*['"]([^'"]+)['"]/g]) {
    for (const m of code.matchAll(re)) if (m[1].startsWith('./') || m[1].startsWith('../')) out.add(m[1]);
  }
  return [...out];
}

// the declaration files a specifier may mean (TypeScript's rules for .d.ts: x.js -> x.d.ts, x -> x.d.ts | x/index.d.ts)
function candidates(file) {
  if (/\.d\.[mc]?ts$/.test(file)) return [file];
  if (file.endsWith('.js')) return [file.slice(0, -3) + '.d.ts'];
  if (file.endsWith('.mjs')) return [file.slice(0, -4) + '.d.mts'];
  if (file.endsWith('.cjs')) return [file.slice(0, -4) + '.d.cts'];
  return [file + '.d.ts', file + '/index.d.ts'];
}

// files: Map or object of artifact-relative path ('/'-separated) -> contents. Returns [{ file, specifier }] that resolve
// to nothing in files, or lead outside the artifact.
function dangling(files) {
  const has = files instanceof Map ? (p) => files.has(p) : (p) => Object.prototype.hasOwnProperty.call(files, p);
  const entries = files instanceof Map ? [...files] : Object.entries(files);
  const bad = [];
  for (const [file, data] of entries) {
    if (!/\.d\.[mc]?ts$/.test(file)) continue;
    for (const spec of specifiers(String(data))) {
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
      if (target.startsWith('../') || !candidates(target).some(has)) bad.push({ file, specifier: spec });
    }
  }
  return bad;
}

// every file of a folder (skipping node_modules), as artifact-relative path -> contents for declaration files only
function readFolder(dir) {
  const files = new Map();
  const walk = (rel) => {
    for (const e of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
      if (e.name === 'node_modules') continue;
      const r = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) walk(r);
      else files.set(r, /\.d\.[mc]?ts$/.test(r) ? fs.readFileSync(path.join(dir, r), 'utf8') : '');
    }
  };
  walk('');
  return files;
}

// throws with the first few dangling imports; label names the artifact in the message
function assertClosed(files, label) {
  const bad = dangling(files);
  if (bad.length) {
    throw new Error('DTS_CLOSURE_FAIL: ' + label + ' has ' + bad.length + ' declaration import(s) that resolve to no file inside it, for example '
      + bad.slice(0, 5).map((b) => b.file + ' -> ' + b.specifier).join(', ') + ' (#894)');
  }
  return [...(files instanceof Map ? files.keys() : Object.keys(files))].filter((f) => /\.d\.[mc]?ts$/.test(f)).length;
}

module.exports = { specifiers, candidates, dangling, readFolder, assertClosed };

if (require.main === module) {
  let fail = 0;
  for (const dir of process.argv.slice(2)) {
    try { console.log('DTS_CLOSURE_OK: ' + dir + ', ' + assertClosed(readFolder(dir), dir) + ' declaration files'); }
    catch (e) { console.log(e.message); fail = 1; }
  }
  process.exit(fail);
}
