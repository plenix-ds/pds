#!/usr/bin/env node
// No remote addresses in the shipped scripts (#150, RedSave P-38): an MV3 extension page may not load remote code, and
// store review flags remote script addresses. Every runtime file (vendor engines, icon library, PDF module) must be
// found relative to the bundle itself or passed in by the app (pdfModuleUrl, setIconLibrary, window.PlenixVendorBase).
//
//   node tools/publish/no-remote-code.mjs <file|folder> [...]     (folders: every .js/.mjs/.cjs file in them, recursively)
//
// Fails on any http(s) address in a script except the ALLOWED ones, which are names, never fetched:
const ALLOWED = new Set([
  'http://www.w3.org/2000/svg', // the SVG namespace
  'http://www.w3.org/1999/xlink', // the XLink namespace
  'http://www.w3.org/1999/xhtml', // the XHTML namespace
  'https://plenix.invalid/', // a base for parsing relative links (hrefOf); .invalid never resolves
]);
import fs from 'node:fs';
import path from 'node:path';

const targets = process.argv.slice(2);
if (!targets.length) { console.error('usage: no-remote-code.mjs <file|folder> [...]'); process.exit(2); }
const files = [];
const walk = (p) => {
  const st = fs.statSync(p);
  if (st.isDirectory()) for (const e of fs.readdirSync(p)) walk(path.join(p, e));
  else if (/\.(m|c)?js$/.test(p)) files.push(p);
};
for (const t of targets) {
  if (!fs.existsSync(t)) { console.log(`REMOTE_FAIL: ${t} does not exist`); process.exit(1); }
  walk(t);
}
if (!files.length) { console.log('REMOTE_FAIL: no script found (a check that reads nothing is not a pass)'); process.exit(1); }

const found = [];
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  for (const m of text.matchAll(/https?:\/\/[A-Za-z0-9.-]+(?:[/][^\s"'`)<>\\]*)?/g)) {
    if (!ALLOWED.has(m[0])) found.push(`${f}: ${m[0].slice(0, 120)}`);
  }
}
if (found.length) {
  for (const x of [...new Set(found)].slice(0, 50)) console.log(`REMOTE_FAIL: ${x}`);
  console.log(`REMOTE_FAIL (${found.length} remote address${found.length > 1 ? 'es' : ''} in ${files.length} scripts; see #150)`);
  process.exit(1);
}
console.log(`REMOTE_OK (${files.length} scripts, no remote address)`);
