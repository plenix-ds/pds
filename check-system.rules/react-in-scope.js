// Plenix · check-system rule "react-in-scope" (the npm DataGrid that did not draw, 2026-11-02): a module of the shipped ES builds never uses `React`
// without binding it. The classic JSX runtime turns <div/> into React.createElement(...), so a source file that uses JSX must import React; where
// React is a global (the CDN script, the applications) a missing import goes unseen, but in the npm package and in plenix.esm.js the first render
// throws "React is not defined" (engine/chrome.jsx and engine/headerRows.jsx, 0.79.0).
//   what it reads   the built ES modules: every file of release/packages/react/dist (not the iife plenix.global.js or the CommonJS index.cjs) and
//                   release/cdn/<version>/plenix.esm.js
//   what it refuses a reference to `React` that no scope of the module declares (an import, a const, a parameter): the real binding, found by
//                   the parser, not a text match
//   unboundReact(text) -> { line, text } of the first one, or null   (called by check-bundle.js)
// Why a rule here and not ESLint react/react-in-jsx-scope: the repository has no ESLint setup for the Platform's sources, and this reads the
//   shipped output, the one place the failure shows; it is a few lines on the parser the other rules already use (docs/build.md lists it).
// Alone: node check-system.rules/react-in-scope.js   -> REACT_IN_SCOPE_OK, or the findings and exit 1
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BARE = /(?<![\w$.])React(?![\w$])/;

function unboundReact(text) {
  if (!BARE.test(text)) return null;   // most modules never mention React: nothing to parse
  const { parser, traverse: t } = require('@babel/standalone').packages, traverse = t.default;
  const ast = parser.parse(text, { sourceType: 'module', errorRecovery: true });
  let hit = null;
  traverse(ast, {
    ReferencedIdentifier(p) {
      if (hit || p.node.name !== 'React' || p.scope.hasBinding('React', { noGlobals: true })) return;
      hit = { line: p.node.loc.start.line, text: text.split('\n')[p.node.loc.start.line - 1].trim().slice(0, 100) };
    },
  });
  return hit;
}

// the shipped ES modules: [{ file, text }]
function esModules() {
  const out = [], dist = path.join(ROOT, 'release', 'packages', 'react', 'dist');
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.js$/.test(e.name) && e.name !== 'plenix.global.js') out.push(p); } };
  if (fs.existsSync(dist)) walk(dist);
  const cdn = path.join(ROOT, 'release', 'cdn');
  if (fs.existsSync(cdn)) for (const v of fs.readdirSync(cdn)) { const f = path.join(cdn, v, 'plenix.esm.js'); if (fs.existsSync(f)) out.push(f); }
  return out;
}

module.exports = { unboundReact, esModules };

if (require.main === module) {
  let bad = 0;
  for (const f of esModules()) {
    const hit = unboundReact(fs.readFileSync(f, 'utf8'));
    if (hit) { bad++; console.log(path.relative(ROOT, f) + ':' + hit.line + '  React is used but never imported (the first render throws "React is not defined"): ' + hit.text); }
  }
  console.log(bad ? 'REACT_IN_SCOPE_FAIL (' + bad + ' modules)' : 'REACT_IN_SCOPE_OK');
  process.exit(bad ? 1 : 0);
}
