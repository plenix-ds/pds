// Plenix · check-system rule "icon-imports" (#280, icon stage 5a): a Platform component draws its icons from imported
// modules, never from a name written as text. One module per icon, imported only where it is used (owner, #277), so a
// site that bundles Plenix carries only the icons of the components it uses, and an icon never waits for the stylesheet.
//   import AddIcon from 'plenix-platform/icons/plenix/add';   <Button icon={AddIcon}>   { icon: CheckIcon }     ok
//   <Button icon="add">   { icon: 'check' }   const ICONS = { done: 'check' }                                 finding
// The scan (platform/icons/uses.js) reads the Platform's source (components, patterns, hooks, providers, templates,
// charts and utils, .js and .jsx, and the Icon component's own tables) with Babel's parser: every icon slot, the constants and tables it reads, and asIcon. A name
// built at run time is a finding unless its line lists the names it can take in a "plx-icons:" comment.
// Four places keep names as text on purpose (EXCEPTIONS below, each with its reason); anything else written as text is
// a finding.
// Slots: icon, iconStart, iconEnd, glyph and any <name>Icon or <name>Icons; name on <Icon> and <StatusIcon>.
// Not slots, because in the Platform they carry no icon name: leading (it takes an element: an <Icon name="…"> inside
// it is judged as an Icon), mark (a drag-and-drop insertion mark, or a mark-as-read function; EmptyState's mark is a
// local that holds its icon prop), symbol (ECharts' marker shape in charts, the resolver's own field in Icon.tsx).
// What it knowingly misses:
//   - a name that arrives from outside the file: a prop (<Button icon={icon}>), {...rest}, or another file's constant
//     (an imported table is judged in its own file only when its name ends in Icon or Icons, or when it sits in a slot there)
//   - a constant that holds names but never reaches a slot in the file that declares it
//   - a slot under a name not listed above (a new prop that carries icons must be added to SLOT in uses.js)
//   - .js and .jsx outside components, patterns, hooks, providers, templates, charts and utils (the applications, the
//     suite and the Asset Manager import their own icons as they convert)
// Applications, the suite and the Asset Manager are not checked here: they import their own icons as they convert.
//   require('./check-system.rules/icon-imports.js').check({ files, add })   (check-system.js runs every rule module)
// Alone: node check-system.rules/icon-imports.js     -> ICON_IMPORTS_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const NAME = 'icon-imports';
const ROOT = path.join(__dirname, '..');

// the names that stay text on purpose: file, where (a named function or constant of that file, or a parameter's default)
// and why
const EXCEPTIONS = [
  { file: 'platform/components/File/File.tsx', inside: ['fileIcon', 'BY_EXT'],
    reason: 'fileIcon(name, type) is public and returns a name (a caller may print or compare it); the File draws fileIconModule, the same icon imported' },
  { file: 'platform/components/Thumbnail/Thumbnail.tsx', param: 'document',
    reason: 'the documented default of the icon prop (the spec reads defaults from the signature); the component draws its module' },
  { file: 'platform/patterns/PermissionSummary/PermissionSummary.jsx', param: 'lock',
    reason: 'the documented default of the icon prop (the spec reads defaults from the signature); the component draws its module' },
  { file: 'platform/providers/apps.ts', inside: ['PLENIX_APPS'],
    reason: 'PLENIX_APPS is public and its icons are names (an application may print or compare them); the header, the switcher and the brand mark draw appIcon(app), the same icon imported' },
];

// the source ranges of a file's named functions and constants
function ranges(file, names) {
  const Babel = require('@babel/standalone');
  const ast = Babel.transform(fs.readFileSync(path.join(ROOT, file), 'utf8'), { ast: true, code: false, sourceType: 'module', parserOpts: { plugins: /\.ts$/.test(file) ? ['typescript'] : /\.tsx$/.test(file) ? ['jsx', 'typescript'] : ['jsx'] } }).ast;
  const out = [];
  for (let n of ast.program.body) {
    if (n.type === 'ExportNamedDeclaration' && n.declaration) n = n.declaration;
    if (n.type === 'FunctionDeclaration' && n.id && names.includes(n.id.name)) out.push([n.start, n.end]);
    if (n.type === 'VariableDeclaration') for (const d of n.declarations) if (d.id.type === 'Identifier' && names.includes(d.id.name)) out.push([d.start, d.end]);
  }
  return out;
}

function findings() {
  const uses = require(path.join(ROOT, 'platform', 'icons', 'uses.js'));
  const glyphs = fs.readFileSync(path.join(ROOT, 'platform', 'components', 'Icon', 'glyphs.js'), 'utf8');
  const names = JSON.parse(glyphs.match(/export const NAMES = (\{.*\});/)[1]);
  const r = uses.scan(ROOT, uses.PLATFORM, { names, withIcon: true });
  const out = [];
  const within = {};
  for (const l of r.literals) {
    const ex = EXCEPTIONS.find((e) => e.file === l.file);
    if (ex && ex.param && l.param && l.name === ex.param) continue;
    if (ex && ex.inside) {
      within[l.file] = within[l.file] || ranges(l.file, ex.inside);
      if (within[l.file].some(([a, b]) => l.start >= a && l.end <= b)) continue;
    }
    out.push({ file: l.file, line: l.line, text: 'the icon "' + l.name + '" is written as text: import its module (plenix-platform/icons/plenix/' + l.name + ') and pass that' });
  }
  for (const u of r.unresolved) { const m = /^(.*):(\d+) (.*)$/.exec(u); out.push({ file: m[1], line: +m[2], text: 'an icon name built at run time ' + m[3] + ': list the names it can take in a "plx-icons:" comment on the line, or pass imported modules' }); }
  for (const u of r.unknown) { const m = /^(.*):(\d+) (.*)$/.exec(u); out.push({ file: m[1], line: +m[2], text: 'not a Plenix icon name in an icon slot: ' + m[3] }); }
  return out;
}

// check-system passes every file it reads; this rule reads the Platform's source itself (the scan needs whole files)
function check({ add }) {
  for (const f of findings()) add(NAME, path.join(ROOT, f.file), f.line, f.text);
}

module.exports = { check, EXCEPTIONS };

if (require.main === module) {
  const out = findings();
  out.forEach((f) => console.log('  ' + f.file + ':' + f.line + '  ' + f.text));
  console.log(out.length ? 'ICON_IMPORTS_FAIL (' + out.length + ')' : 'ICON_IMPORTS_OK');
  process.exit(out.length ? 1 : 0);
}
