// Plenix · check-system rule "pane-defaults" (owner, issue 463 option C, step 2): the panes start wider on larger windows, as size tokens.
// What it rejects:
//   tokens   a missing token: --plx-sys-shell-nav-width-from-1440 / -from-1920, --plx-comp-side-panel-width-default-from-1440 / -from-1920,
//            --plx-comp-secondary-pane-width-{sm,md,lg}-from-1440 / -from-1920; or a value that is not the owner's table
//   css      system/grid.css without the two media rules (1440px <= width < 1920px, width >= 1920px) that set the tokens
//   decouple the side panel's default or minimum going back to the navigation pane's width (it must be 240px below 1440px), and the secondary
//            pane's narrowest drag being the small width again (it must be its own 180px token)
// Alone: node check-system.rules/pane-defaults.js     -> PANE_DEFAULTS_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const NAME = 'pane-defaults';
const ROOT = path.join(__dirname, '..');
const read = (f) => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { return ''; } };
const json = (f) => { try { return JSON.parse(read(f)); } catch (e) { return {}; } };
// the owner's table: token -> size (px)
const SYS = { 'shell-nav-width-from-1440': 272, 'shell-nav-width-from-1920': 320 };
const COMP = {
  'side-panel-width-default-from-1440': 320, 'side-panel-width-default-from-1920': 400,
  'secondary-pane-width-sm-from-1440': 220, 'secondary-pane-width-md-from-1440': 260, 'secondary-pane-width-lg-from-1440': 320,
  'secondary-pane-width-sm-from-1920': 260, 'secondary-pane-width-md-from-1920': 320, 'secondary-pane-width-lg-from-1920': 400,
};
// the px a size reference ends at: {plx-ref.size-…} followed to its value in reference.tokens.json (not read from the name:
// the palette's names say their step, docs/adr/0012)
const { css } = require('../tools/token-value.js');
let REF = null;
const px = (v) => {
  const m = /^\{plx-ref\.(size-[a-z0-9-]+)\}$/.exec(v || ''); if (!m) return null;
  REF = REF || json('platform/tokens/reference.tokens.json')['plx-ref'] || {};
  let t = REF[m[1]], n = 0;
  while (t && n++ < 10) { const r = /^\{plx-ref\.([a-z0-9-]+)\}$/.exec(String(t.$value)); if (!r) break; t = REF[r[1]]; }
  const x = t && /^(\d+(?:\.\d+)?)px$/.exec(css(t.$value));
  return x ? +x[1] : null;
};

function check({ add }) {
  const sys = json('platform/tokens/semantic.density-standard.tokens.json')['plx-sys'] || {};
  const comp = json('platform/tokens/components.tokens.json')['plx-comp'] || {};
  const at = (group, name, want, file) => { const t = group[name]; if (!t) return add(NAME, path.join(ROOT, file), 0, 'the token ' + name + ' is missing'); if (px(t.$value) !== want) add(NAME, path.join(ROOT, file), 0, name + ' is ' + t.$value + ', the owner\'s table says ' + want + 'px'); };
  for (const [n, v] of Object.entries(SYS)) at(sys, n, v, 'platform/tokens/semantic.density-standard.tokens.json');
  for (const [n, v] of Object.entries(COMP)) at(comp, n, v, 'platform/tokens/components.tokens.json');
  { const t = comp['secondary-pane-width-min']; if (!t || px(t.$value) !== 180) add(NAME, path.join(ROOT, 'platform/tokens/components.tokens.json'), 0, 'secondary-pane-width-min must be 180px (the narrowest drag: the small width rises on larger windows)'); }
  if (!/secondary-pane-width-min/.test(read('platform/patterns/SecondaryPane/SecondaryPane.jsx'))) add(NAME, path.join(ROOT, 'platform/patterns/SecondaryPane/SecondaryPane.jsx'), 0, 'its minimum must read --plx-comp-secondary-pane-width-min, not the small width');
  for (const n of ['side-panel-width-default', 'side-panel-width-min']) { const t = comp[n]; if (!t || px(t.$value) !== 240) add(NAME, path.join(ROOT, 'platform/tokens/components.tokens.json'), 0, n + ' must be 240px (its own token, not the navigation pane\'s width)'); }
  const css = read('platform/system/grid.css');
  for (const [re, what] of [[/@media\s*\(1440px\s*<=\s*width\s*<\s*1920px\)/, '(1440px <= width < 1920px)'], [/@media\s*\(width\s*>=\s*1920px\)/, '(width >= 1920px)']]) if (!re.test(css)) add(NAME, path.join(ROOT, 'platform/system/grid.css'), 0, 'the media rule ' + what + ' that sets the starting widths is missing');
  for (const v of ['--plx-sys-shell-nav-width', '--plx-comp-side-panel-width-default', '--plx-comp-secondary-pane-width-md']) if (!new RegExp(v + ':var\\(' + v + '-from-1920\\)').test(css)) add(NAME, path.join(ROOT, 'platform/system/grid.css'), 0, v + ' is not set to its -from-1920 token');
}
module.exports = { name: NAME, check };

if (require.main === module) {
  const findings = [];
  check({ add: (rule, file, line, text) => findings.push(path.relative(ROOT, file) + (line ? ':' + line : '') + '  ' + text) });
  if (findings.length) { findings.forEach((x) => console.log(x)); console.log('PANE_DEFAULTS_FAIL (' + findings.length + ')'); process.exit(1); }
  console.log('PANE_DEFAULTS_OK');
}
