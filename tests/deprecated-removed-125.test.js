/* Plenix tests · the deprecated classes are removed (issue 125; VERSIONING.md, Deprecation): every class listed in
   tests/fixtures/removed-classes-125.json (the 321 that platform/standards/deprecated-classes.json marked going away: nothing in the repository
   uses them) is gone from every Platform stylesheet, the going-away list is empty, the unused-classes rule still passes, and the classes that stay
   are still defined (a sample of every file the removal touched, so a too-wide cut shows). Usage: node tests/deprecated-removed-125.test.js */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'removed-classes-125.json'), 'utf8')), removed = fixture.classes, kept = fixture.kept;
const sheets = execFileSync('git', ['ls-files', 'platform/**/*.css', 'platform/*.css'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
const text = sheets.map((f) => [f, fs.readFileSync(path.join(ROOT, f), 'utf8')]);
const escape = (c) => c.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const still = [];
for (const c of removed) {
  const re = new RegExp('\\.' + escape(c) + '(?![\\w-])');
  for (const [f, s] of text) if (re.test(s)) still.push(c + ' in ' + f);
}
assert.deepEqual(still, [], 'no removed class is still defined (' + still.length + ' left)');
// the ten classes CTM still uses (the 0.91.0 release check): kept, still defined, listed as going away until CTM has moved off them
assert.deepEqual(JSON.parse(fs.readFileSync(path.join(ROOT, 'platform/standards/deprecated-classes.json'), 'utf8')).classes.slice().sort(), kept.slice().sort(), 'the going-away list is the ten kept classes');
for (const c of kept) assert.ok(text.some(([, s]) => new RegExp('\\.' + escape(c) + '(?![\\w-])').test(s)), c + ' is still defined (CTM uses it)');
// the classes that stay: a sample from each stylesheet the removal touched
const stay = { 'platform/system/utilities.css': ['plx-u-w-100p', 'plx-u-z-raised', 'plx-u-bg-data', 'plx-u-ws-nowrap'], 'platform/system/grid.css': ['plx-span-1', 'plx-span-4', 'plx-span-12'] };
for (const [f, list] of Object.entries(stay)) {
  const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
  for (const c of list) assert.ok(new RegExp('\\.' + escape(c) + '(?![\\w-])').test(s), c + ' is still defined in ' + f);
}
const r = require('../check-system.rules/unused-classes.js');
const findings = []; r.check({ add: (rule, file, line, msg) => findings.push(file + ':' + line + ' ' + msg), files: undefined });
assert.deepEqual(findings, [], 'unused-classes: ' + findings.slice(0, 3).join(' | '));
console.log('deprecated-removed-125: OK (' + removed.length + ' removed, ' + kept.length + ' kept)');
