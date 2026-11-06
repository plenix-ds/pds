// Plenix · check-system rule "monitor-widths" (owner, issue 463 option C, step 3): the width a person dragged a pane to is remembered per monitor.
// What it rejects:
//   helper   utils/monitorWidths.ts without monitorKey, useMonitorWidth and the plenix.paneWidths store, or no longer limited by paneMax
//   zoom     monitorKey reading screen.width alone (a browser reports it zoom-adjusted, so every Ctrl+plus would look like a new monitor), or the
//            test not setting the zoom (issue 463)
//   use      SidePanel or AppShell (the navigation pane's width) no longer asking useMonitorWidth, or writing the old single key again
//            (plenix.sidePanelWidth, plenix.sideNav.width): one saved value for every screen is what this replaced
// Alone: node check-system.rules/monitor-widths.js     -> MONITOR_WIDTHS_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const NAME = 'monitor-widths';
const ROOT = path.join(__dirname, '..');
const read = (f) => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { return ''; } };

function check({ add }) {
  const h = read('platform/utils/monitorWidths.ts'), hf = path.join(ROOT, 'platform/utils/monitorWidths.ts');
  if (!/export const monitorKey/.test(h) || !/export function useMonitorWidth/.test(h)) add(NAME, hf, 0, 'monitorWidths.ts must export monitorKey and useMonitorWidth');
  const code = h.replace(/\/\*[^]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');   // code, not comments
  if (!/devicePixelRatio/.test(code) || /Math\.round\(s\.width\)/.test(code)) add(NAME, hf, 0, 'monitorKey must multiply the screen size by devicePixelRatio (screen.width alone is zoom-adjusted and changes with every Ctrl+plus)');
  if (!/devicePixelRatio/.test(read('tests/monitor-widths.test.js'))) add(NAME, path.join(ROOT, 'tests/monitor-widths.test.js'), 0, 'the test must set the zoom (devicePixelRatio and a scaled screen size) and check the width survives it');
  if (!/plenix\.paneWidths/.test(h)) add(NAME, hf, 0, 'the store key plenix.paneWidths is missing');
  if (!/paneMax\(/.test(h)) add(NAME, hf, 0, 'a remembered width must be limited by paneMax (it is used only when it still fits the window)');
  for (const [f, legacy] of [['platform/patterns/SidePanel/SidePanel.tsx', /localStorage\.setItem\(WIDTH_KEY/], ['platform/patterns/AppShell/AppShell.tsx', /writePref\('plenix\.sideNav\.width'/]]) {
    const s = read(f), file = path.join(ROOT, f);
    if (!/useMonitorWidth\(/.test(s)) add(NAME, file, 0, 'does not ask useMonitorWidth for the dragged width');
    if (legacy.test(s)) add(NAME, file, 0, 'writes the old single saved width again: a width is saved per monitor (setWidth from useMonitorWidth)');
  }
}
module.exports = { name: NAME, check };

if (require.main === module) {
  const findings = [];
  check({ add: (rule, file, line, text) => findings.push(path.relative(ROOT, file) + (line ? ':' + line : '') + '  ' + text) });
  if (findings.length) { findings.forEach((x) => console.log(x)); console.log('MONITOR_WIDTHS_FAIL (' + findings.length + ')'); process.exit(1); }
  console.log('MONITOR_WIDTHS_OK');
}
