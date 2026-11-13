// Plenix tests · the shared check helper (owner, runtests-parts-27): one place that decides whether a named check counts in
// this run and records its result. tests/lib.js exports it too; tests without a browser require this file directly, so they do
// not load the browser library.
//   check(name, ok, detail)   records the result and returns true; returns false (and records nothing) when the check is not
//                             in this run's parts. A test's own check function calls it first and, on false, neither prints nor
//                             counts the check, so each test keeps its own output format and still runs once.
//   wanted(name)              whether the check is in this run's parts (for a check whose result is known only later)
//   record(name, ok, detail)  records a result without the parts test (after wanted(name) said yes)
//   childName(file)           the name of a child test's result in its parent ('narrow-fit-880.test.js' -> 'narrow-fit-880: the
//                             child test passes'); a parent records it with record() for every child it ran, so the CI job
//                             (tools/ci/behavior-tests.mjs) can quarantine one red child and still block on the others (#1327)
//   ended()                   records END ("the test ran to its end, every failure recorded"), always passing. A test calls it
//                             just before its last exit, and only when every failure that exit counts is a recorded check. The
//                             CI job judges a failed test by its checks only when END is there; without it (a crash, an early
//                             exit, a failure the test never recorded) the test fails as a whole, so a quarantined check can
//                             never hide it (G5a I1 on PR #1328)
// A check's part is the component before the first ": " (a colon and a space) of its name ("Toolbar: Arrow Right moves …" is
// part Toolbar; "black on white is 21:1" has none).
//   TEST_ONLY=Toolbar,Tabs    only the checks of these parts count (tests/run.js sets it per test: keyboard:Toolbar,Tabs);
//                             a check whose name has no part does not count while TEST_ONLY is set
//   TEST_RESULTS=<file>       every counted check is added to this JSON file when the test ends:
//                             { results: [{ test, part, name, ok, detail, at }] }; tools/file-failures.js reads it
const fs = require('fs');
const path = require('path');

const TEST = path.basename(process.argv[1] || 'test').replace(/\.test\.js$/, '').replace(/\.js$/, '');
const ONLY = String(process.env.TEST_ONLY || '').split(',').map((s) => s.trim()).filter(Boolean);
const FILE = process.env.TEST_RESULTS || '';
const results = [];

const partOf = (name) => { const i = String(name).indexOf(': '); return i > 0 ? String(name).slice(0, i).trim() : ''; };
const wanted = (name) => !ONLY.length || ONLY.includes(partOf(name));
const text = (v) => (v === undefined || v === null ? '' : typeof v === 'string' ? v : JSON.stringify(v));
function record(name, ok, detail) {
  results.push({ test: TEST, part: partOf(name), name: String(name), ok: !!ok, detail: ok ? '' : text(detail).slice(0, 2000), at: new Date().toISOString() });
}
function check(name, ok, detail) {
  if (!wanted(name)) return false;
  record(name, ok, detail);
  return true;
}

// on exit, add this test's results to TEST_RESULTS (tests run one after another, so a read, add and write is safe)
if (FILE) {
  process.on('exit', () => {
    let all = { results: [] };
    try { all = JSON.parse(fs.readFileSync(FILE, 'utf8')); if (!Array.isArray(all.results)) all = { results: [] }; } catch (e) { /* a new file */ }
    all.results = all.results.concat(results);
    try { fs.mkdirSync(path.dirname(path.resolve(FILE)), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(all, null, 1) + '\n'); } catch (e) { console.error('TEST_RESULTS: could not write ' + FILE + ': ' + e.message); }
  });
}

const END = 'the test ran to its end, every failure recorded';
const ended = () => record(END, true, '');

const childName = (file) => String(file).replace(/\.test\.js$/, '') + ': the child test passes';

module.exports = { check, wanted, record, ended, END, childName, partOf, TEST, ONLY };
