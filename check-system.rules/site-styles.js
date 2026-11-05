// Plenix · check-system rule "site-styles" (owner, #381, 2026-10-28: "remove the sites' own styles, starting from the newest
// release; sites use tokens only"):
//   A site is a product that loads the Plenix release: the suite applications (dashboard/, tasks/, …), suite/, dam/, services/
//   and the St. John the Beloved test site (its own repository, read when it sits beside this one). A site has no
//   stylesheet, no <style> block and no style attribute of its own: it uses the Platform's classes and tokens.
// What it rejects:
//   stylesheet   a tracked .css file anywhere outside the exempt list below (so a new site stylesheet fails, whatever its folder)
//   markup       a <style> block, a style="…" attribute or a React style={{…}} object written in services/ or the St. John site (HTML,
//                an HTML string or JSX). The applications, dam/ and suite/ are covered for markup by the inline-style rule (check-style.js)
//   stale        an exempt file that no longer exists: remove its line, so the lists only ever shrink
// The exempt list (each entry has its reason; nothing else is exempt):
const EXEMPT_FILES = {
  'platform/platform.css': 'the Platform\'s one stylesheet: it imports the foundations, components and patterns that sites use',
  'platform/plenix-system.css': 'the Platform\'s foundations stylesheet (tokens, theme, layout layers)',
  'platform/loader/loader.css': 'the page loader\'s one rule hides the page until plenix.css arrives; it must load before Plenix (issue 842)',
  'docs/font-study/playground.css': 'a published study page (deploy.sh publishes it); the owner decides',
  'docs/reading-pane-study/study.css': 'a published study page (deploy.sh publishes it); the owner decides',
  'docs/dashboard-study/dashboard-spec.css': 'a published study page (deploy.sh publishes it; the dashboard study, #861); the owner decides',
  'services/auth/brand.css': 'generated from the tokens by services/auth/brand-css.js and pasted into the SSO service, whose custom CSS field cannot import the release (issue 365); removed at the login cutover; owner decision pending (#381)',
};
// markup exempt from the style-block and style-attribute scan (path from the site's own folder; the St. John site is read beside this repository)
const EXEMPT_MARKUP = {
  'site/screens/announcement-edit.jsx': 'the seed announcement is user content for the rich-text editor ("the person\'s own formatting is kept"): the rich-text engine is a standing exception to the no-inline-styles rule',
};
const EXEMPT_PREFIXES = {
  'platform/components/': 'the Platform\'s component stylesheets: the classes sites use (Stylelint checks them)',
  'platform/patterns/': 'the Platform\'s pattern stylesheets',
  'platform/system/': 'the Platform\'s foundation stylesheets (tokens, themes, layers, layout), many generated',
  'platform/charts/': 'the Platform\'s chart stylesheets',
  'platform/exports/': 'the Platform\'s export stylesheets',
  'platform/templates/': 'the Platform\'s page-template stylesheets',
  'lanes/': 'a lane carries design-system files into the design spec (lanes/<task>/design-system/…), which is not a site',
  'docs/briefs/': 'the few working pages (briefs) that a test or a live document still opens; the rest moved to the archive (docs/ARCHIVE.md); deploy.sh does not publish them',
  'tests/fixtures/': 'a fixture that holds the violations on purpose, so a rule can be shown to catch them',
  'tools/fixtures/spec-color-samples/': 'the fixtures of the check-spec rule color-samples (#263): a good and a shrunk spec sheet, so the rule can be shown to pass and to catch a shrunk sample',
  'platform/design-system/': 'the design spec\'s own sheets (folded in from its submodule, #183); bringing its 60 sheets onto Platform classes is a separate plan (#381)',
  'release/': 'a built release (generated)',
  'packages/': 'built packages (generated)',
};
// Everything else under platform/ (dev/, brand/, vendor/ and the rest) holds no sheet: a
// new folder or file there fails until it is added to a list on purpose. The published studies in docs/ have only the three files above.
// The design spec (platform/design-system) was a submodule until #183; its 60 sheets are exempt above and are a separate plan (#381).
// Alone: node check-system.rules/site-styles.js     -> SITE_STYLES_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const NAME = 'site-styles';
const ROOT = path.join(__dirname, '..');
const STJOHN = process.env.ST_JOHN_SITE || path.join(ROOT, '..', 'st-john-test-site');
const SKIP_DIR = /(^|[\\/])(node_modules|\.git|dist|vendor)([\\/]|$)/;
const lineOf = (text, i) => text.slice(0, i).split('\n').length;

function trackedCss() {
  try { return execFileSync('git', ['ls-files', '*.css'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26 }).split('\n').filter(Boolean); }
  catch (e) { return null; }   // no git here: only the stale check and the markup scan run
}
function walk(dir, out) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (SKIP_DIR.test(f)) continue;
    if (e.isDirectory()) walk(f, out);
    else if (/\.(html|htm|js|jsx|ts|tsx|mjs)$/.test(e.name)) out.push(f);
  }
  return out;
}

function check({ add }) {
  const css = trackedCss();
  if (css) for (const f of css) {
    if (EXEMPT_FILES[f] || Object.keys(EXEMPT_PREFIXES).some((p) => f.startsWith(p))) continue;
    add(NAME, path.join(ROOT, f), 0, 'a site stylesheet: sites use the Platform classes and tokens only (#381); not in the exempt list of check-system.rules/site-styles.js');
  }
  for (const f of Object.keys(EXEMPT_FILES)) if (!fs.existsSync(path.join(ROOT, f))) add(NAME, path.join(ROOT, 'check-system.rules', 'site-styles.js'), 0, f + ' is gone: remove it from the exempt list');
  // the markup of the services and of the St. John site
  const roots = [path.join(ROOT, 'services'), path.join(STJOHN, 'site'), path.join(STJOHN, 'public')];
  for (const k of Object.keys(EXEMPT_MARKUP)) if (fs.existsSync(STJOHN) && !fs.existsSync(path.join(STJOHN, k))) add(NAME, path.join(ROOT, 'check-system.rules', 'site-styles.js'), 0, k + ' is gone: remove it from the exempt list');
  for (const root of roots) for (const f of walk(root, [])) {
    if (Object.keys(EXEMPT_MARKUP).some((k) => f === path.join(STJOHN, k))) continue;
    if (/[\\/](app|assets)\.js$/.test(f) && /public/.test(f)) continue;   // the St. John site's generated bundle is checked through its sources
    const text = fs.readFileSync(f, 'utf8');
    for (const re of [/<style[\s>]/gi, /\sstyle\s*=\s*["']/gi, /\sstyle\s*=\s*\{/g]) for (const m of text.matchAll(re)) {
      const line = lineOf(text, m.index);
      const lineText = text.split('\n')[line - 1];
      if (/^\s*(\/\/|\/\*|\*)/.test(lineText)) continue;   // prose in a comment
      add(NAME, f, line, re.source.startsWith('<') ? 'a <style> block: no site styles of its own (#381)' : re.source.endsWith('\\{') ? 'a React style object: no site styles of its own (#381)' : 'a style attribute: no site styles of its own (#381)');
    }
  }
}
module.exports = { name: NAME, check, EXEMPT_FILES, EXEMPT_PREFIXES };

if (require.main === module) {
  const findings = [];
  check({ add: (rule, file, line, text) => findings.push(path.relative(ROOT, file) + (line ? ':' + line : '') + '  ' + text) });
  if (findings.length) { findings.forEach((x) => console.log(x)); console.log('SITE_STYLES_FAIL (' + findings.length + ')'); process.exit(1); }
  console.log('SITE_STYLES_OK');
}
