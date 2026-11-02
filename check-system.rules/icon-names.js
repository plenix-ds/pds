// Plenix · check-system rule "icon-names": every icon a source file names is in the Plenix set (a key of
// platform/icons/map.json). An unknown name draws nothing: the Icon component resolves only the set's names (and Material
// names in a library) to a drawing (#557: no drawing is left in the stylesheet). So:
//   <Icon name="folder" />   icon="add"   { icon: 'pin' }   h(P.Icon, { name: 'close' })   "plx-icon--trash"   ok
//   <Icon name="star" />     icon="collection"   { icon: 'image' }                                            finding
// Only names written as whole literals are read (icon={'density-' + d.value} is computed at run time and not read).
// The suite's capability records (suite/plenix-app-data.js and suite/settings-data.js, icon: "mail") name Material symbols, which the
// pages list in a plx-icons comment (projects.jsx, settings.jsx); those records are not read here. Documentation that shows a wrong name on purpose carries
// plx-allow-icon on its line.
// The rule is a module check-system.js runs (it loads every file in check-system.rules/):
//   require('./check-system.rules/icon-names.js').check({ files, add })   files: [{ file }], add(rule, file, line, text)
// Alone: node check-system.rules/icon-names.js     -> ICON_NAMES_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const NAME = 'icon-names';
const ROOT = path.join(__dirname, '..');
// generated bundles and copies are checked through their sources; the capability records name other drawings
const SKIP_FILE = /[\\/](dist|release|node_modules|vendor|Archived|archive|backups|audit|docs|spec-chunks)[\\/]|(^|[\\/])(app|assets|spec-index|spec-parts|native-guidance)\.js$|\.min\.js$/;
const PATTERNS = [
  /<Icon\b[^>]*?\bname=["'{]{1,2}([a-z0-9-]+)["'](?!\s*\+)/g,                                   // <Icon name="x"> <Icon name={'x'}>
  /\bIcon\s*,\s*\{[^}]*?\bname:\s*["']([a-z0-9-]+)["'](?!\s*\+)/g,                                // h(P.Icon, { name: 'x' })
  /\b(?:icon|iconEnd|iconStart|leadingIcon|trailingIcon|iconName)=\{?["']([a-z0-9-]+)["'](?!\s*\+)/g, // icon="x" icon={'x'}
  /\b(?:icon|iconEnd|iconStart|leadingIcon|trailingIcon|iconName)\s*:\s*["']([a-z0-9-]+)["'](?!\s*\+)/g, // { icon: 'x' }
  /\bplx-icon--([a-z0-9]+(?:-[a-z0-9]+)*)\b(?!-)/g,                                      // "plx-icon--x" (not plx-icon--' + n)
];
// the Icon's own modifier classes
// the modifiers that are not names: the sizes, and the fill an owner passes (<Icon filled>, <Icon filled={false}>)
const MODIFIER = /^(size-(xs|sm|md|lg|xl)|filled|outline|inline|mirrored)$/;   // inline: the component's inline SVG drawing (2026-10-23); mirrored: a module outside the Plenix set that mirrors in right to left (issue 281)

function known(root) {
  const f = path.join(root, 'platform', 'icons', 'map.json');
  return new Set(Object.keys(JSON.parse(fs.readFileSync(f, 'utf8')).map || {}));
}

function check({ files, add }) {
  const names = known(ROOT);
  for (const { file } of files) {
    if (!/\.([jt]sx?|mjs|html)$/.test(file) || /\.d\.ts$/.test(file) || SKIP_FILE.test(file)) continue;
    let text; try { text = fs.readFileSync(file, 'utf8'); } catch (e) { continue; }
    if (!/icon/i.test(text)) continue;
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      if (/plx-allow-icon/.test(line) || !/icon/i.test(line)) return;
      const seen = new Set();
      for (const re of PATTERNS) {
        re.lastIndex = 0; let m;
        while ((m = re.exec(line))) {
          const n = m[1];
          if (names.has(n) || MODIFIER.test(n) || seen.has(n)) continue;
          seen.add(n);
          add(NAME, file, i + 1, '"' + n + '" is not a Plenix icon (platform/icons/map.json): ' + line.trim());
        }
      }
    });
  }
}

module.exports = { check };

if (require.main === module) {
  const out = [];
  const files = [];
  const walk = (d) => { for (const n of fs.readdirSync(d)) { const p = path.join(d, n); if (/node_modules|\.git$|Archived/.test(path.relative(ROOT, p))) continue; const s = fs.statSync(p); if (s.isDirectory()) walk(p); else files.push({ file: p }); } };
  for (const d of ['platform', 'suite', 'dam', 'dashboard', 'projects', 'messages', 'contacts', 'calendar', 'tasks', 'notes', 'bookmarks', 'files', 'settings']) if (fs.existsSync(path.join(ROOT, d))) walk(path.join(ROOT, d));
  check({ files, add: (rule, file, line, text) => out.push(path.relative(ROOT, file) + ':' + line + '  ' + text.slice(0, 160)) });
  out.forEach((l) => console.log('  ' + l));
  console.log(out.length ? 'ICON_NAMES_FAIL (' + out.length + ')' : 'ICON_NAMES_OK');
  process.exit(out.length ? 1 : 0);
}
