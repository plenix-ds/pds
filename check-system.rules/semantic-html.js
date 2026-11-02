// Plenix · check-system rule "semantic-html" (library plan wave 2; the Semantic HTML page, WCAG 2.2 SC 1.3.1 and 4.1.2):
// an element that does something is an element that says so. A click handler on an element with no meaning of its own
// (div, span, p, li, td, section, article, img, i) needs a role (a button, an option, a tab: then it is a widget, with
// tabIndex and keys), or it is a mouse-only control that the keyboard and assistive technology cannot find. An anchor
// that does something with no href is an action: it is a button.
//   <div onClick={open}>…</div>                                  finding (use a button, or RowButton)
//   <div role="option" aria-selected={on} tabIndex={-1} onClick={…}>   ok: a widget with a role
//   <span aria-hidden="true" onClick={toggle} />                  ok: a pointer shortcut its owner's keys also reach
//   <a onClick={save}>Save</a>                                    finding (an action: Button)
//   h('div', { onClick: open })                                    finding
// Delegated clicks (a handler on a container that reacts to the buttons and links inside it) are listed in DELEGATES
// with their reason; a new one is added there, by the owner, with its reason. Documentation that shows what the rule
// rejects (a code sample in a string) carries plx-allow-semantic on its line.
// The rule is a module check-system.js runs (it loads every file in check-system.rules/):
//   require('./check-system.rules/semantic-html.js').check({ files, add })   files: [{ file }], add(rule, file, line, text)
// Alone: node check-system.rules/semantic-html.js     -> SEMANTIC_HTML_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const NAME = 'semantic-html';
// generated bundles and copies are checked through their sources
const SKIP_FILE = /[\\/](dist|release|node_modules|vendor|Archived|archive|backups|audit|docs|spec-chunks)[\\/]|(^|[\\/])(app|assets|spec-index|spec-parts|native-guidance)\.js$|\.min\.js$/;
const PLAIN = 'div|span|p|li|td|section|article|img|i';
// containers whose click handler reacts to the controls inside them (the controls are buttons and links, so the
// keyboard reaches each one): file (from platform/) and the element's class, with the reason
const DELEGATES = {
  'components/Combobox/Combobox.tsx|plx-combobox__field': 'a click on the field’s padding focuses its input; the input is the keyboard path',
  'components/Tree/Tree.jsx|plx-tree__row': 'the row is inside its treeitem, which takes focus and the keys (Enter, Space, the arrows)',
  'patterns/NavPane/NavPane.jsx|plx-nav-pane__body': 'closes the overlay pane after a link or button inside it is chosen',
  'patterns/SecondaryPane/SecondaryPane.jsx|plx-secondary-pane__body': 'opens the detail after a row button inside the list is chosen (list-detail)',
  'components/Card/Card.jsx|plx-media-card': 'a click on a selectable card toggles its selection checkbox, which is the keyboard path; its title link opens it',
  'design-system/parts/w01B.records.js|ds-float-pointer': 'the context-menu stage: a click closes the menu that Escape also closes; the stage takes focus and opens it with Shift F10'
};

function lineOf(text, i) { return text.slice(0, i).split('\n').length; }

// the attribute text of a JSX or HTML opening tag that starts at i ("<div"), to its closing ">" (braces and quotes skipped)
function tagAt(text, i) {
  let depth = 0, q = null;
  for (let j = i + 1; j < text.length; j++) {
    const c = text[j];
    if (q) { if (c === q && text[j - 1] !== '\\') q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { if (depth || /[=\s]/.test(text[j - 1])) q = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (c === '>' && depth <= 0) return text.slice(i, j + 1);
  }
  return text.slice(i);
}
// the props object of h('div', { … }) that starts at i ("{"), to its matching brace
function objectAt(text, i) {
  let depth = 0, q = null;
  for (let j = i; j < text.length; j++) {
    const c = text[j];
    if (q) { if (c === q && text[j - 1] !== '\\') q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return text.slice(i, j + 1);
  }
  return text.slice(i);
}
// the props object's own keys only (nested objects and functions dropped), so a handler inside a callback is not read
function ownKeys(obj) {
  let out = '', depth = 0, q = null;
  for (let j = 0; j < obj.length; j++) {
    const c = obj[j];
    if (q) { if (c === q && obj[j - 1] !== '\\') q = null; if (depth === 1) out += c; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; if (depth === 1) out += c; continue; }
    if (c === '{' || c === '(' || c === '[') { depth++; if (depth === 1) out += c; continue; }
    if (c === '}' || c === ')' || c === ']') { if (depth === 1) out += c; depth--; continue; }
    if (depth === 1) out += c;
  }
  return out;
}
// the class names written in the element's className (a string, or the strings inside cx(…))
const classOf = (attrs) => {
  const m = /className\s*[=:]\s*([\s\S]{0,300})/.exec(attrs);
  if (!m) return [];
  const out = [];
  for (const s of m[1].matchAll(/["'`]([^"'`]*)["'`]/g)) out.push(...s[1].split(/\s+/));
  return out;
};

// the findings of one file's text: [{ line, text }]; rel is the file's path under platform/ (for DELEGATES)
function scan(text, rel) {
  const out = [];
  const delegated = (attrs) => classOf(attrs).some((c) => DELEGATES[(rel || '') + '|' + c]);
  // JSX and HTML opening tags
  const tagRe = new RegExp('<(' + PLAIN + '|a)(?=[\\s>/])', 'g');
  for (const m of text.matchAll(tagRe)) {
    const attrs = tagAt(text, m.index);
    if (!/\bon[Cc]lick\s*=/.test(attrs)) continue;
    if (m[1] === 'a') {
      if (!/\bhref\s*=/.test(attrs) && !/\brole\s*=/.test(attrs)) out.push({ line: lineOf(text, m.index), text: 'an anchor with a click handler and no href is an action: use a button (Button): ' + attrs.slice(0, 90) });
      continue;
    }
    if (/\brole\s*=/.test(attrs) || /\baria-hidden\s*=\s*(?:"true"|\{true\}|'true')/.test(attrs) || delegated(attrs)) continue;
    out.push({ line: lineOf(text, m.index), text: 'a clickable <' + m[1] + '> with no role: use a button (Button, RowButton) or give it a widget role: ' + attrs.slice(0, 90) });
  }
  // createElement: h('div', { … onClick … })
  const hRe = new RegExp("\\b(?:h|createElement)\\(\\s*['\"](" + PLAIN + "|a)['\"]\\s*,\\s*\\{", 'g');
  for (const m of text.matchAll(hRe)) {
    const props = ownKeys(objectAt(text, m.index + m[0].length - 1));
    if (!/\bonClick\s*:/.test(props)) continue;
    if (m[1] === 'a') { if (!/\bhref\s*:/.test(props) && !/\brole\s*:/.test(props)) out.push({ line: lineOf(text, m.index), text: 'an anchor with a click handler and no href is an action: use a button' }); continue; }
    if (/\brole\s*:/.test(props) || /['"]?aria-hidden['"]?\s*:\s*(?:true|'true'|"true")/.test(props) || delegated(props)) continue;
    out.push({ line: lineOf(text, m.index), text: 'a clickable ' + m[1] + ' (createElement) with no role: use a button or give it a widget role' });
  }
  const lines = text.split('\n');
  return out.filter((x) => !/plx-allow-semantic/.test(lines[x.line - 1] || ''));
}

function relOf(file) {
  const parts = path.resolve(file).split(path.sep);
  const i = parts.lastIndexOf('platform');
  return i >= 0 ? parts.slice(i + 1).join('/') : parts.join('/');
}

function check({ files, add }) {
  for (const f of files) {
    const file = f.file || f;
    if (!/\.(jsx|js|tsx|ts|html)$/.test(file) || SKIP_FILE.test(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (!/on[Cc]lick/.test(text)) continue;
    scan(text, relOf(file)).forEach((x) => add(NAME, file, x.line, x.text));
  }
}

module.exports = { name: NAME, check, scan, DELEGATES };

if (require.main === module) {
  const ROOT = path.join(__dirname, '..');
  const DIRS = ['platform', 'suite', 'dam', 'dashboard', 'projects', 'messages', 'contacts', 'calendar', 'tasks', 'notes', 'bookmarks', 'files', 'settings', 'services'];
  const files = [];
  const walk = (d) => { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (SKIP_FILE.test(p + (e.isDirectory() ? path.sep : ''))) continue; if (e.isDirectory()) walk(p); else files.push({ file: p }); } };
  DIRS.forEach((d) => walk(path.join(ROOT, d)));
  const found = [];
  check({ files, add: (rule, file, line, text) => found.push(path.relative(ROOT, file).split(path.sep).join('/') + ':' + line + '  ' + text) });
  // the rule's own fixtures: [source, findings expected]
  const fx = [
    ['<div onClick={open}>x</div>', 1],
    ['<div className="row"\n  onClick={() => { if (a > b) go(); }}>x</div>', 1],
    ['<div role="option" aria-selected={on} tabIndex={-1} onClick={pick}>x</div>', 0],
    ['<span aria-hidden="true" onClick={toggle} />', 0],
    ['<button onClick={go}>Go</button>', 0],
    ['<a onClick={save}>Save</a>', 1],
    ['<a href="#/x" onClick={nav}>X</a>', 0],
    ["h('div', { className: 'x', onClick: open })", 1],
    ["h('div', { role: 'button', tabIndex: 0, onClick: open })", 0],
    ["h('div', { className: 'x', render: function () { return { onClick: 1 }; } })", 0],
    ['<div onScroll={s}>x</div>', 0],
    ['<div onclick="go()">x</div>', 1],
    ['"<div onClick={open}>x</div>"   // plx-allow-semantic', 0]];
  fx.forEach(([src, n]) => { const got = scan(src, '').length; if (got !== n) found.push('fixture: ' + src.replace(/\n/g, ' ') + ' gives ' + got + ' finding(s), expected ' + n); });
  found.forEach((x) => console.log('FAIL ' + x));
  console.log(found.length ? '\n' + found.length + ' finding(s)' : 'SEMANTIC_HTML_OK (' + files.length + ' files, ' + fx.length + ' fixtures)');
  process.exit(found.length ? 1 : 0);
}
