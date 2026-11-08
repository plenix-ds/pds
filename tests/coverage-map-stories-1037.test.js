/* Plenix tests · the coverage map's Stories column (issue 1037, part of 1034).
   Summary: tools/coverage-map.js build(root) on a fixture tree with two parts, Alpha (docs/site/stories/Alpha.stories.tsx with three stories: Default, Disabled,
     Error) and Beta (no story file). The row of Alpha reads 3 stories and the DESIGN.md states it covers (default, disabled, error); the row of Beta reads
     none. The summary says "1 of 2 parts have stories". A missing story never makes --check fail: check() reports the file current when it matches the build,
     whatever the story count.
   Usage: node tests/coverage-map-stories-1037.test.js   -> COVERAGE_MAP_STORIES_1037_OK */
const assert = require('assert/strict'), fs = require('fs'), os = require('os'), path = require('path');
const map = require('../tools/coverage-map.js');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cov-'));
const w = (p, s) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), s); };
w('platform/components/Alpha/Alpha.tsx', ''); w('platform/patterns/Beta/Beta.tsx', ''); w('tests/alpha.test.js', 'Alpha');
w('docs/site/stories/Alpha.stories.tsx', "export default {};\nexport const Default = {};\nexport const Disabled = { args: { disabled: true } };\nexport const Error = {};\n");
const md = map.build(root);
const row = (n) => md.split('\n').find((l) => l.startsWith('| ' + n + ' |'));
assert.ok(/\| 3 \(default, disabled, error\) \|/.test(row('Alpha')), 'Alpha: 3 stories and the states it covers: ' + row('Alpha'));
assert.ok(/\| – \| none \|/.test(row('Beta')), 'Beta: no stories: ' + row('Beta'));
assert.ok(/1 of 2 parts have stories/.test(md), 'the summary line');
assert.equal(map.stale(root, md), true, 'no file yet: stale');
fs.mkdirSync(path.join(root, 'docs/pds1'), { recursive: true }); fs.writeFileSync(path.join(root, 'docs/pds1/coverage.md'), md);
assert.equal(map.stale(root, md), false, 'the file matches the build, with Beta having no story: current, not stale');
console.log('COVERAGE_MAP_STORIES_1037_OK');
