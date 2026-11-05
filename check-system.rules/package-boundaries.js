// Plenix · check-system rule "package-boundaries" (docs/adr/0001, D-0031): the packages depend one way only.
//   react   may depend on styles, tokens, icons, locales
//   styles  may depend on tokens
//   tokens, icons, locales  depend on no @plenix-ds package
// Read from each workspace's package.json (packages/*/package.json: dependencies, peerDependencies,
// optionalDependencies). Also: every workspace is named @plenix-ds/<folder>, carries the root version (one version for
// npm, CDN and API), and every @plenix-ds dependency names that same version. An unknown workspace is a finding: a new
// package needs an ADR first. Import-level boundaries (no deep imports) come with the source move (ESLint
// no-restricted-imports per package).
// Alone: node check-system.rules/package-boundaries.js   -> PACKAGE_BOUNDARIES_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const NAME = 'package-boundaries';
const ROOT = path.join(__dirname, '..');
const ALLOWED = { react: ['styles', 'tokens', 'icons', 'locales'], styles: ['tokens'], tokens: [], icons: [], locales: [] };

function findings(root = ROOT) {
  const out = [], dir = path.join(root, 'packages');
  const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
  if (!fs.existsSync(dir)) return out;
  for (const folder of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, folder, 'package.json');
    if (!fs.existsSync(file)) continue;
    let m; try { m = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { out.push({ file, text: 'not valid JSON' }); continue; }
    if (!(folder in ALLOWED)) { out.push({ file, text: 'packages/' + folder + ' is not a package of docs/adr/0001: a new package needs an ADR' }); continue; }
    if (m.name !== '@plenix-ds/' + folder) out.push({ file, text: 'is named ' + m.name + ', not @plenix-ds/' + folder });
    if (m.version !== version) out.push({ file, text: m.name + ' is ' + m.version + ', not the root version ' + version });
    for (const field of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
      for (const [dep, range] of Object.entries(m[field] || {})) {
        if (!dep.startsWith('@plenix-ds/')) continue;
        const to = dep.slice('@plenix-ds/'.length);
        if (!ALLOWED[folder].includes(to)) out.push({ file, text: m.name + ' -> ' + dep + ' (' + field + ') breaks the one-way order react -> styles -> tokens' });
        else if (range !== version) out.push({ file, text: m.name + ' -> ' + dep + '@' + range + ': name the one version, ' + version });
      }
    }
  }
  return out;
}

function check({ add }) { for (const f of findings()) add(NAME, f.file, 0, f.text); }
module.exports = { check, findings, NAME, ALLOWED };

if (require.main === module) {
  const list = findings();
  list.forEach((f) => console.log('  ' + path.relative(ROOT, f.file).split(path.sep).join('/') + '  ' + f.text));
  console.log(list.length ? 'PACKAGE_BOUNDARIES_FAIL (' + list.length + ')' : 'PACKAGE_BOUNDARIES_OK');
  process.exit(list.length ? 1 : 0);
}
