/* Plenix tests · no custom property set from a :has() rule (issue 1226, performance).
   Why: a rule whose selector has :has() and whose body sets a custom property (--x) is re-checked whenever anything is inserted or removed below
   the element, and Chrome then restyles the element's whole subtree ("allDescendantsMightBeInvalid"), because every descendant inherits the property.
   Measured on 1.6.1 (three DataGrids in a Stack): the Stack's :has(> .plx-field--inline) rule made one grid filter cost 392 ms and 67,000 elements of
   style recalculation; without it 6 ms and 12 elements (load 254 ms to 22 ms, resize 565 ms to 15 ms).
   Rule: a stylesheet in platform/ sets custom properties only from a class or attribute, never from a :has() rule. The component that knows its
   children sets that class or attribute itself. Usage: node tests/has-custom-props-1226.test.js */
const assert = require('assert/strict'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', 'platform');
const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); } else if (e.name.endsWith('.css')) files.push(p); } })(ROOT);
const bad = [];
for (const f of files) {
  const css = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of css.matchAll(/([^{};]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim(); if (sel.startsWith('@') || !/:has\(/.test(sel) || /:has\([^)]*:(focus|hover|checked|active|disabled)/.test(sel)) continue;   // a state-only :has() (a Card's focus ring) is small and not the layout case measured
    if (/(^|[;\s])--[\w-]+\s*:/.test(m[2])) bad.push(path.relative(ROOT, f) + ': ' + sel.replace(/\s+/g, ' ').slice(0, 110));
  }
}
assert.deepEqual(bad, [], 'a :has() rule that sets a custom property restyles its whole subtree on every DOM change below it:\n  ' + bad.join('\n  '));
console.log('has-custom-props-1226: OK (' + files.length + ' stylesheets)');
