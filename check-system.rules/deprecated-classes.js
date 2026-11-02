// Plenix · check-style rule "deprecated-classes" (issue 882; VERSIONING.md, Deprecation): a class going away is not used
// anew. platform/standards/deprecated-classes.json lists the classes no page, application, design spec page, test or tool
// used when they were marked; they keep working for outside users until they are removed (no earlier than the next minor
// release). A source file that names one is a finding: choose a component or another utility instead.
// What it reads: the files check-common.js collects (stylesheets, scripts, pages), except the stylesheet that still
// defines the classes (platform/system/utilities.css) and the list itself.
// The rule is a module check-style.js runs (a style rule: check-common.js, STYLE_MODULES).
// Alone: node check-system.rules/deprecated-classes.js   -> DEPRECATED_CLASSES_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const NAME = 'deprecated-classes';
const ROOT = path.join(__dirname, '..');
const LIST = path.join(ROOT, 'platform', 'standards', 'deprecated-classes.json');
const SKIP = /[\\/]platform[\\/](system[\\/]utilities\.css|standards[\\/]deprecated-classes\.json)$/;

function classes(root = ROOT) {
  try { return JSON.parse(fs.readFileSync(path.join(root, 'platform', 'standards', 'deprecated-classes.json'), 'utf8')).classes || []; } catch (e) { return []; }
}

function findings(files) {
  const names = classes();
  if (!names.length) return [];
  const re = new RegExp('(?<![\\w-])(' + names.map((n) => n.replace(/[-]/g, '\\-')).join('|') + ')(?![\\w-])', 'g');
  const out = [];
  for (const file of files) {
    if (SKIP.test(file)) continue;
    let text; try { text = fs.readFileSync(file, 'utf8'); } catch (e) { continue; }
    if (!text.includes('plx-u-')) continue;
    text.split(/\r?\n/).forEach((line, i) => {
      for (const m of line.matchAll(re)) out.push({ file, line: i + 1, text: m[1] + ' is going away (platform/standards/deprecated-classes.json, issue 882): use a component or another utility' });
    });
  }
  return out;
}

function check({ files, add }) { for (const f of findings(files.map((x) => x.file))) add(NAME, f.file, f.line, f.text); }
module.exports = { check, findings, classes, NAME, LIST };

if (require.main === module) {
  const { collect } = require('../check-common.js');
  const list = findings(collect().map((x) => x.file));
  list.forEach((f) => console.log('  ' + path.relative(ROOT, f.file).split(path.sep).join('/') + ':' + f.line + '  ' + f.text));
  console.log(list.length ? 'DEPRECATED_CLASSES_FAIL (' + list.length + ')' : 'DEPRECATED_CLASSES_OK (' + classes().length + ' classes)');
  process.exit(list.length ? 1 : 0);
}
