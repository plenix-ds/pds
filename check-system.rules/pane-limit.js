// Plenix · check-system rule "pane-limit" (owner, issue 463 option C): a pane of the shell or a table column is never dragged wider than the
// window-share token (--plx-sys-shell-pane-window-share, 90%) of the window, of the table for a column, down to the 4px grid.
// What it rejects:
//   token    the token is missing, or is not a percentage between 50% and 100%
//   helper   utils/paneLimit.ts is gone, or no longer reads the token
//   use      PanelSplitter (Resizable), NavPane, SecondaryPane, SidePanel or the DataGrid's table model (engine/useTableModel.ts) no longer ask paneMax / shareOf for their limit
// Alone: node check-system.rules/pane-limit.js     -> PANE_LIMIT_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const NAME = 'pane-limit';
const ROOT = path.join(__dirname, '..');
const read = (f) => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { return ''; } };
const USERS = [
  ['platform/components/Resizable/Resizable.tsx', /paneMax\(/],
  ['platform/patterns/NavPane/NavPane.tsx', /paneMax\(/],
  ['platform/patterns/SecondaryPane/SecondaryPane.tsx', /paneMax\(/],
  ['platform/patterns/SidePanel/SidePanel.tsx', /paneMax\(/],
  ['platform/components/DataGrid/engine/useTableModel.ts', /shareOf\(/],
];

function check({ add }) {
  const tok = read('platform/tokens/semantic.density-standard.tokens.json');
  const m = /"shell-pane-window-share"\s*:\s*\{\s*"\$value"\s*:\s*"(\d+(?:\.\d+)?)%"/.exec(tok);
  const file = path.join(ROOT, 'platform/tokens/semantic.density-standard.tokens.json');
  if (!m) add(NAME, file, 0, 'the token shell-pane-window-share is missing or is not a percentage');
  else if (+m[1] < 50 || +m[1] > 100) add(NAME, file, 0, 'shell-pane-window-share is ' + m[1] + '%: it must be between 50% and 100%');
  const helper = read('platform/utils/paneLimit.ts');
  if (!/--plx-sys-shell-pane-window-share/.test(helper) || !/export function paneMax/.test(helper) || !/export function shareOf/.test(helper)) add(NAME, path.join(ROOT, 'platform/utils/paneLimit.ts'), 0, 'paneLimit.js must export paneMax and shareOf and read --plx-sys-shell-pane-window-share');
  for (const [f, re] of USERS) if (!re.test(read(f))) add(NAME, path.join(ROOT, f), 0, 'does not ask the window-share limit (' + re.source.replace('\\(', '') + ') for how far it can be dragged');
}
module.exports = { name: NAME, check };

if (require.main === module) {
  const findings = [];
  check({ add: (rule, file, line, text) => findings.push(path.relative(ROOT, file) + (line ? ':' + line : '') + '  ' + text) });
  if (findings.length) { findings.forEach((x) => console.log(x)); console.log('PANE_LIMIT_FAIL (' + findings.length + ')'); process.exit(1); }
  console.log('PANE_LIMIT_OK');
}
