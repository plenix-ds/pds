/* Plenix tests · no :has() on :root, html or body (issue 1226, performance).
   Why: Plenix declares about 7,500 custom properties on :root. A :has() whose subject is :root is re-checked on every DOM insertion or removal
   anywhere in the page, and a re-match restyles :root, which re-resolves all those properties: about 4 ms for each inserted element (Chrome 1.6.1:
   a 1-element insert measured 7 ms with the one ActionBar rule, 0.02 ms without it; grid load style recalculation 65 ms, 18 ms without it).
   Rule: a stylesheet in platform/ has no :has() on :root, html or body, alone or inside :where() / :is(). Use a class or attribute the component
   sets on its own container instead. Usage: node tests/root-has-1226.test.js */
const assert = require('assert/strict'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', 'platform');
const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); } else if (e.name.endsWith('.css')) files.push(p); } })(ROOT);
const TOP = '(?:^|,)\\s*(?::root|html|body)\\b';
const DIRECT = new RegExp('(?::root|\\bhtml|\\bbody)(?![\\w-])[^,{}]*?:has\\(');                       // :root.x:has(, html :has(, body:has(
const LISTED = /:(?:where|is)\(((?:[^()]|\([^()]*\))*)\)\s*:has\(/g;                                  // :where(:root, .a):has(
const bad = [];
for (const f of files) {
  const css = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of css.matchAll(/([^{};]+)\{/g)) {
    const sel = m[1].trim(); if (sel.startsWith('@')) continue;
    for (const part of sel.split(/,(?![^()]*\))/)) {
      let hit = DIRECT.test(part);
      for (const l of part.matchAll(LISTED)) if (new RegExp(TOP).test(l[1])) hit = true;
      if (hit) bad.push(path.relative(ROOT, f) + ': ' + part.trim().slice(0, 120));
    }
  }
}
assert.deepEqual(bad, [], 'a :has() on :root, html or body restyles the whole document on every DOM change:\n  ' + bad.join('\n  '));
console.log('root-has-1226: OK (' + files.length + ' stylesheets)');
