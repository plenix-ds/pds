// Plenix · check-system rule "size-scale" (#463, owner: the size scale goes above 900px and the panes go as wide as a box):
//   the size tokens end at 1600px, the shell's panes and a Resizable box share one cap, and the generated files agree, so a
//   column, a pane or a box can be dragged past 900px up to 1600px and a regression fails here.
//   tokens     --plx-ref-size-240u, -1000px, -1200px, -1400px and -1600px exist in platform/tokens/reference.tokens.json
//   caps       build-steps.js sets GRID_PANE_MAX equal to GRID_BOX_MAX, and both are at least 1600
//   generated  platform/utils/sizeSteps.js (SIZE_STEPS ends at the largest token, GRID_PANE_MAX is the build's) and the
//              theme script's size list (platform/providers/theme-boot.js) end at the largest token too
// Alone: node check-system.rules/size-scale.js   -> SIZE_SCALE_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const NAME = 'size-scale';
const ROOT = path.join(__dirname, '..');
const NEEDED = [960, 1000, 1200, 1400, 1600];
const read = (f) => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { return ''; } };

function check({ add }) {
  const here = (f) => path.join(ROOT, f);
  let ref = {};
  try { ref = JSON.parse(read('platform/tokens/reference.tokens.json'))['plx-ref'] || {}; } catch (e) { add(NAME, here('platform/tokens/reference.tokens.json'), 0, 'cannot read the reference tokens: ' + e.message); return; }
  // the scale by value, not by name (docs/adr/0012: size-400u is 1600px); a deprecated alias is not a step
  const { css } = require('../tools/token-value.js');
  const sizes = Object.entries(ref).filter(([k, t]) => /^size-/.test(k) && !t.$deprecated).map(([, t]) => { const m = /^(\d+)px$/.exec(css(t.$value)); return m ? +m[1] : null; }).filter((n) => n !== null).sort((a, b) => a - b);
  for (const n of NEEDED) if (!sizes.includes(n)) add(NAME, here('platform/tokens/reference.tokens.json'), 0, 'no size token is ' + n + 'px (the scale must reach 1600px)');
  const steps = read('build-steps.js');
  const m = /GRID_PANE_MAX\s*=\s*(\d+)\s*,\s*GRID_BOX_MAX\s*=\s*(\d+)/.exec(steps);
  if (!m) add(NAME, here('build-steps.js'), 0, 'GRID_PANE_MAX and GRID_BOX_MAX are not set together, or the file cannot be read');
  else {
    if (+m[1] !== +m[2]) add(NAME, here('build-steps.js'), 0, 'GRID_PANE_MAX (' + m[1] + ') is not GRID_BOX_MAX (' + m[2] + '): a pane of the shell must go as wide as a box');
    if (+m[1] < 1600) add(NAME, here('build-steps.js'), 0, 'GRID_PANE_MAX is ' + m[1] + ', below 1600');
  }
  const last = sizes[sizes.length - 1];
  const gen = read('platform/utils/sizeSteps.js');
  const list = /SIZE_STEPS\s*=\s*\[([^\]]*)\]/.exec(gen);
  const gm = /GRID_PANE_MAX\s*=\s*(\d+)/.exec(gen);
  if (!list) add(NAME, here('platform/utils/sizeSteps.js'), 0, 'SIZE_STEPS not found, or the file cannot be read (run node build-app.js)');
  else { const l = list[1].split(',').map((x) => parseInt(x, 10)); if (l[l.length - 1] !== last) add(NAME, here('platform/utils/sizeSteps.js'), 0, 'SIZE_STEPS ends at ' + l[l.length - 1] + ', the largest size token is ' + last + ' (run node build-app.js)'); }
  if (m && gm && gm[1] !== m[1]) add(NAME, here('platform/utils/sizeSteps.js'), 0, 'GRID_PANE_MAX is ' + gm[1] + ' here and ' + m[1] + ' in build-steps.js (run node build-app.js)');
  const boot = /\/\* plx-size-steps \*\/\[([^\]]*)\]\/\* \/plx-size-steps \*\//.exec(read('platform/providers/theme-boot.js'));
  if (!boot) add(NAME, here('platform/providers/theme-boot.js'), 0, 'the size list between the plx-size-steps markers is missing, or the file cannot be read');
  else { const l = boot[1].split(',').map((x) => parseInt(x, 10)); if (l[l.length - 1] !== last) add(NAME, here('platform/providers/theme-boot.js'), 0, 'the theme script\'s size list ends at ' + l[l.length - 1] + ', the largest size token is ' + last + ' (run node build-app.js)'); }
}
module.exports = { name: NAME, check };

if (require.main === module) {
  const findings = [];
  check({ add: (rule, file, line, text) => findings.push(path.relative(ROOT, file) + '  ' + text) });
  if (findings.length) { findings.forEach((x) => console.log(x)); console.log('SIZE_SCALE_FAIL (' + findings.length + ')'); process.exit(1); }
  console.log('SIZE_SCALE_OK');
}
