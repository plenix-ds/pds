// Plenix · the Plenix style check, beside Stylelint (owner, style-plan-30: every style rule in exactly one place).
//   node check-style.js
// Stylelint (npx stylelint "platform/**/*.css" "services/**/*.css"; .stylelintrc.json and its plugin
// tools/stylelint/plenix.mjs) checks each stylesheet on its own. This check holds the style rules Stylelint cannot:
// rules on code and markup (Stylelint reads stylesheets only), rules that need other files, and the rules with a backlog
// that only shrinks. It reads the same files as check-system.js (check-common.js). Exits with 1 and lists every finding.
//
// In code (JavaScript, JSX, HTML):
//   tokens      every var(--…) is a Platform token (--plx-ref-, --plx-sys-, --plx-comp-, --plx-state-, --plx-ctx-) or a custom
//               property the source declares; no old names. Stylesheets: Stylelint (plenix/token-tiers)
//   hex         no raw hex colors written in code (colors come from tokens). Stylesheets: Stylelint (color-no-hex)
//   font-size   no font size written as a number in code: font sizes come from --plx-ref-font-size-* tokens. Stylesheets:
//               Stylelint (raw lengths)
//   icon-size   no icon size written as a number (<Icon size={14}>, <Ico size={13}>, <Avatar size={28}>): an icon takes its
//               control's grid icon (--plx-sys-control-icon-<role>) or a size token from CSS, so it sits on the 4px grid
//   media       no breakpoint written as a number in code (useMedia / matchMedia): the shell reads the breakpoint tokens
//               (below('--plx-sys-shell-rail-below')); the theme boot script, which runs before the tokens load, excepted
//   palette-class an application never colors with a palette utility class (plx-u-text-gray-700…): components only
//   fonts       no call to Google Fonts: DM Sans and Reddit Mono are hosted with the Platform (platform/fonts, batch 227)
//   inline-style (check-system.rules/inline-style.js; owner, 2026-10-13, replacing "no exceptions", batch 283): no style
//               written in markup (style="…" in an HTML file, an HTML string or a JSX string attribute; a <style> block),
//               and no hard-coded design value written by code (a color, a length with a unit, a font, a bare number) in
//               el.style.x =, style.setProperty(…), setAttribute('style', …), cssText, style={{…}} or style: {…}. A
//               JavaScript adjustment is allowed anywhere (React's style prop included): a var(--plx-…) reference or a value
//               computed from tokens, defined styles or measured layout. A DataGrid's row height and cell padding stay the
//               density's (tokens and classes): the style audit and the pages test check them at run time.
// Across files:
//   defined     every var(--plx-…) a file uses (stylesheets and code) is declared somewhere (a renamed or removed token
//               leaves no dangling use)
//   cascade-layers (check-system.rules/cascade-layers.js) every production stylesheet is in a cascade layer, in the order
//               platform/system/layers.json declares; a sheet the entry sheets import takes its layer there
// With a backlog that only shrinks:
//   selector-kinds (check-system.rules/selector-kinds.js) every selector is one of the five kinds (Styling Standard 3.6)
//   text-contract  (check-system.rules/text-contract.js) every part that declares typography has its text contract (6)
// On the token source (platform/tokens/**/*.tokens.json; Stylelint does not read JSON):
//   token-definitions (check-system.rules/token-definitions.js) no new colors (the reference palette is frozen; gray 250
//               the one addition), everything on the 4px grid, corners 2 to 6px (and 0); a backlog that only shrinks
//   color-groups, field-background, unused-component-tokens (check-system.rules/<name>.js)
//   deprecated-classes (check-system.rules/deprecated-classes.js, issue 882) no new use of a class going away
//               (platform/standards/deprecated-classes.json)
const fs = require('fs');
const { SPEC_PAGE, STYLE_MODULES, collect, reporter } = require('./check-common.js');

const files = collect();
const { add, runModules, finish } = reporter();

// custom properties the applications declare for themselves (--ds-r on the spec page, set by a lab's script); the
// retired legacy token file does not count, so its old names stay findings
const DECLARED = new Set();
for (const { file } of files) {
  if (/tokens[\\/]legacy\.css$/.test(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/(?:^|[;{\s'"])(--[a-z][a-z0-9-]*)\s*:/g)) if (!/^--plx-/.test(m[1])) DECLARED.add(m[1]);
  for (const m of text.matchAll(/setProperty\(\s*['"](--[a-z][a-z0-9-]*)/g)) DECLARED.add(m[1]);
}
// every Platform token declared anywhere (token files, themes, component stylesheets, style objects that set one)
const PLX = new Set();
for (const { file } of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/(--plx-[\w-]+)\s*:/g)) PLX.add(m[1]);
  for (const m of text.matchAll(/["'](--plx-[\w-]+)["']\s*[:,)]/g)) PLX.add(m[1]);
}

for (const { file } of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  const isCode = /\.(js|jsx|ts|tsx|html)$/.test(file);
  lines.forEach((line, i) => {
    const n = i + 1;
    // defined: a used token exists (a name ending in "-" is built in code, e.g. 'var(--plx-ref-radius-' + n + 'px)')
    for (const m of line.matchAll(/var\(\s*(--plx-[a-z0-9-]*[a-z0-9])(?![\w-])/g)) if (!PLX.has(m[1])) add('defined', file, n, m[1] + ' is not declared anywhere');
    // tokens, in code (a stylesheet's are Stylelint's: plenix/token-tiers)
    if (!/\.css$/.test(file)) for (const m of line.matchAll(/var\(\s*(--[a-z][a-z0-9-]*)/g)) {
      // the design system's samples (--ds-sample-<property>) are set at run time by DS.sample (ds.js)
      // the three token tiers, the state variables (Styling Standard 4.1: --plx-state-<component>-…, never inherited) and the
      // token layers build-tokens.js writes (--plx-ctx-<interaction|density|base>-<token>: one rule per context picks)
      if (/^--plx-(ref|sys|comp|state|ctx)-/.test(m[1]) || DECLARED.has(m[1]) || (SPEC_PAGE.test(file) && /^--ds-sample-[a-z-]+$/.test(m[1]))) continue;
      add('tokens', file, n, m[1] + ' in: ' + line);
    }
    // hex colors: a # with 3, 4, 6 or 8 hex digits where a value starts (after : ( , = or a quote), not in comments or
    // prose (an issue number); a color a person chose, kept as data, carries a plx-allow-hex comment on its line
    if (isCode && !/plx-allow-hex/.test(line)) {
      const code = line.replace(/\/\*.*?\*\/|\/\/.*$/g, '');
      for (const m of code.matchAll(/(?:[:(,'"=]\s*)#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b(?![\w-])/g)) {
        if (/href=|id=|url\(/.test(code.slice(Math.max(0, m.index - 12), m.index + 1))) continue;
        add('hex', file, n, '#' + m[1] + ' in: ' + line);
      }
    }
    // icon sizes written as numbers (Platform and applications)
    if (isCode && /<(Icon|Ico|Avatar)\b[^>]*\bsize=\{\s*\d+\s*\}/.test(line)) add('icon-size', file, n, line);
    // breakpoints written as numbers in code
    if (isCode && !/theme-boot\.js$/.test(file) && /(useMedia|matchMedia)\(\s*['"][^'"]*\d+(px|rem|em)/.test(line)) add('media', file, n, line);
    // font sizes written as numbers
    if (!/tokens[\\/]/.test(file)) {
      if (isCode && /fontSize\s*[:=]\s*['"]?[0-9.]+(px|rem|em|pt)?['"]?\s*[,}]/.test(line)) add('font-size', file, n, line);
      if (isCode && /font-size\s*:\s*[0-9.]+(px|rem|em|pt)/.test(line)) add('font-size', file, n, line);
    }
  });
  // fonts: the typefaces are hosted with the Platform (platform/fonts, system/fonts.css, batch 227): no page calls Google
  if (isCode && !/[\\/]dist[\\/]|(^|[\\/])(app|assets)\.js$/.test(file)) {
    for (const m of text.matchAll(/fonts\.(googleapis|gstatic)\.com/g)) add('fonts', file, text.slice(0, m.index).split('\n').length, 'a call to Google Fonts: ' + text.slice(Math.max(0, m.index - 20), m.index + 40).split('\n')[0]);
  }
}

// palette-class: an application never colors with a palette utility (plx-u-text-gray-700, plx-u-bg-white…): its look comes
// from Platform components and their tokens (the owner, batches 199–202)
for (const { file, app } of files) {
  if (app === 'platform' || !/\.(jsx|js|tsx|ts|html)$/.test(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/plx-u-(?:bg|text|border|border-[trbl]|accent|outline)-(?:white|black|gray-\d+|blue-\d+|red-\d+|green-\d+|brown-\d+|purple-\d+)(?![\w-])/g)) add('palette-class', file, text.slice(0, m.index).split('\n').length, m[0]);
}

// the style rules kept as their own modules (check-system.rules/<name>.js), listed in check-common.js
runModules(files, (name) => STYLE_MODULES.includes(name));

finish('STYLE_OK', 'STYLE_FAIL', files.length);
