/* Plenix tests · check-style.js's hex rule ignores an issue number in a block comment (issue 1350).
   Summary: hexColors(text) in check-common.js lists the raw hex colors in code, with their line numbers. An issue number
     such as #1347 in a comment, on one line or over several, is not a color; a real color is still found, on its own line.
   Proof first: before #1350 only single-line comments were stripped, so "Fixes: #1347" on a later line of a block comment
     was reported as a hex color (and hexColors did not exist yet).
   Usage: node tests/check-style-hex-1350.test.js   → CHECK_STYLE_HEX_1350_OK */
const assert = require('assert/strict');
const { hexColors } = require('../check-common.js');
const lines = (text) => hexColors(text).map((f) => f.line + ':#' + f.hex);

// a block-comment header that names issues, on one line and over several
assert.deepEqual(lines('/* see #1347 */\nconst a = 1;\n'), [], 'a one-line block comment');
assert.deepEqual(lines('/*\n * Part of the review work\n * Fixes: #1347 and (#302), see "#1268"\n */\nconst a = 1;\n'), [], 'a multi-line block comment');
assert.deepEqual(lines('// Fixes: #1347\nconst a = 1;\n'), [], 'a single-line comment still passes');
// a real color is still found, and keeps its own line number (the check is diff-aware by line)
assert.deepEqual(lines("const c = '#abc';\n"), ['1:#abc'], 'a short color');
assert.deepEqual(lines("/*\n * header #1347\n */\nconst c = { fill: '#a1b2c3' };\n"), ['4:#a1b2c3'], 'a color after a block comment keeps its line');
assert.deepEqual(lines("const c = '#abc'; /* see #1347 */\n"), ['1:#abc'], 'a color before a comment on the same line');
assert.deepEqual(lines("/* x */ const c = '#abc';\n"), ['1:#abc'], 'a color after a comment on the same line');
// the rule's other exemptions stay
assert.deepEqual(lines("const c = '#abc'; // plx-allow-hex\n"), [], 'plx-allow-hex');
assert.deepEqual(lines("<a href=\"#abc\">x</a>\n"), [], 'an href anchor');
// a glob or a "/*" in a string does not open a comment that hides the colors after it
assert.deepEqual(lines("const g = 'platform/**/*.css';\nconst c = '#abc';\n"), ['2:#abc'], 'a glob');
assert.deepEqual(lines("const s = '/*';\nconst c = '#abc';\n"), ['2:#abc'], 'a "/*" in a string');
console.log('CHECK_STYLE_HEX_1350_OK');
