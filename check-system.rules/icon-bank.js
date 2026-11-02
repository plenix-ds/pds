// Plenix · check-system rule "icon-bank" (#882, owner 2026-11-01): the applications, the Asset Manager and the design spec
// draw icons only from the icon bank (platform/icons/: map.json, library/, custom/), through the Icon component. So in their
// source there is no inline drawing and no hand-made icon component:
//   <Icon name="folder" />                                          ok
//   <svg className="plx-chart__svg" …>  h('svg', { className: 'plx-sparkline__svg' })   ok: a Plenix component's own drawing (charts, sparklines, QR codes, barcodes, illustrations) carries its plx- class
//   <svg viewBox="0 0 24 24"><path d="M…"/></svg>                   finding: a hand-drawn icon
//   const Ico = ({ n }) => <svg …/>   createElementNS(…, 'svg')   innerHTML = '<svg …>'   finding
// A utility class (plx-u-…) is not a component class. A line that must draw its own svg (the spec's glyph browser, which draws
// every symbol of the bank) carries plx-allow-svg and its reason. Not covered: the Platform's own components (Icon, the brand
// logo, charts), which are the bank's drawing code, and generated bundles (checked through their sources).
// The rule is a module check-system.js runs (it loads every file in check-system.rules/):
//   require('./check-system.rules/icon-bank.js').check({ files, add })   files: [{ file }], add(rule, file, line, text)
// Alone: node check-system.rules/icon-bank.js     -> ICON_BANK_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const NAME = 'icon-bank';
const IN_SCOPE = /(^|[\\/])(suite|dashboard|projects|messages|contacts|calendar|tasks|notes|bookmarks|files|settings|dam)[\\/]|[\\/]platform[\\/]design-system[\\/]/;
const SKIP_FILE = /[\\/](dist|release|node_modules|vendor|Archived|archive|backups|audit|docs|spec-chunks|fixtures)[\\/]|(^|[\\/])(app|assets|spec-parts|spec-index|native-guidance|native-guidance-full|apple-refs|inventory-guidance|plenix-icons-[a-z]+)\.js$|\.min\.js$|[\\/]plenix-icons-/;
// a drawing: <svg in markup or a string, h('svg'…), createElement('svg'…), createElementNS(…, 'svg')
const DRAWING = /<svg\b|\b(?:h|createElement)\(\s*['"]svg['"]|createElementNS\([^)]*['"]svg['"]/;
// the Plenix component class a component's own drawing carries (not a plx-u- utility)
const COMPONENT_CLASS = /\bplx-(?!u-)[a-z]/;

// a line's code without its // comment and its /* */ comments on the same line
const code = (line) => line.replace(/\/\*.*?\*\//g, '').replace(/(^|[^:'"\\])\/\/.*$/, '$1');

// the findings of one text: [{ line, text }]
function scan(text) {
  const out = [];
  let inBlock = false;
  text.split('\n').forEach((raw, i) => {
    let line = raw;
    if (inBlock) { const end = line.indexOf('*/'); if (end < 0) return; line = line.slice(end + 2); inBlock = false; }
    const open = line.lastIndexOf('/*'); if (open >= 0 && line.indexOf('*/', open) < 0) { line = line.slice(0, open); inBlock = true; }
    if (/plx-allow-svg/.test(raw)) return;
    const c = code(line);
    if (DRAWING.test(c) && !COMPONENT_CLASS.test(c)) out.push({ line: i + 1, text: c.trim().slice(0, 160) });
  });
  return out;
}

function check({ files, add }) {
  for (const { file } of files) {
    if (!IN_SCOPE.test(file) || SKIP_FILE.test(file) || !/\.(js|jsx|ts|tsx|html)$/.test(file)) continue;
    let text; try { text = fs.readFileSync(file, 'utf8'); } catch (e) { continue; }
    if (!/svg/i.test(text)) continue;
    for (const f of scan(text)) add(NAME, file, f.line, 'an inline drawing: icons come from the icon bank through <Icon name> (add the symbol to platform/icons/map.json: docs "How to add an icon"); a drawing that is not an icon carries its component class, or plx-allow-svg and its reason: ' + f.text);
  }
}

module.exports = { name: NAME, check, scan };

if (require.main === module) {
  const { collect } = require('../check-common.js');
  const files = collect(), found = [];
  check({ files, add: (rule, file, line, text) => found.push(path.relative(path.join(__dirname, '..'), file) + ':' + line + '  ' + text) });
  // the rule's own fixtures: [source, findings]
  const fx = [
    ['<svg viewBox="0 0 24 24"><path d="M3 12L12 4l9 8"/></svg>', 1],
    ['<svg width={size} className="plx-u-block" dangerouslySetInnerHTML={{ __html: html }} />', 1],
    ["const Ico = () => h('svg', { viewBox: '0 0 20 20' });", 1],
    ["document.createElementNS('http://www.w3.org/2000/svg', 'svg')", 1],
    ['<svg className="plx-chart__svg" viewBox="0 0 360 240"></svg>', 0],
    ["'<svg class=\"plx-sparkline__svg\" viewBox=\"0 0 10 10\"></svg>'", 0],
    ['<svg viewBox="0 -960 960 960"><path d="M0 0"/></svg> {/* plx-allow-svg: draws every bank symbol */}', 0],
    ['<Icon name="folder" />', 0],
  ];
  fx.forEach(([src, n]) => { const got = scan(src).length; if (got !== n) found.push('fixture: ' + JSON.stringify(src) + ' gave ' + got + ', expected ' + n); });
  if (found.length) { console.log(found.join('\n')); process.exit(1); }
  console.log('ICON_BANK_OK');
}
