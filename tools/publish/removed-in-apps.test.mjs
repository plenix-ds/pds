#!/usr/bin/env node
// Self-test of tools/publish/removed-in-apps.mjs (#125 release check): a class the release removes that a connected app
// still uses fails; a class kept on the deprecated list, a use inside node_modules or a copied Plenix stylesheet, and a
// longer class that only starts with the removed name do not.
//   node tools/publish/removed-in-apps.test.mjs        (CI: the release dry run, before the check itself)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { removedClasses, usesIn } from './removed-in-apps.mjs';

let failed = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : `: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`}`);
};

check('removed = on the previous list, not on the current one',
  removedClasses(['plx-u-a', 'plx-u-b', 'plx-u-left-0'], ['plx-u-left-0']), ['plx-u-a', 'plx-u-b']);
check('nothing removed when the list only grows', removedClasses(['plx-u-a'], ['plx-u-a', 'plx-u-c']), []);

const app = fs.mkdtempSync(path.join(os.tmpdir(), 'removed-in-apps-'));
const put = (f, s) => { fs.mkdirSync(path.dirname(path.join(app, f)), { recursive: true }); fs.writeFileSync(path.join(app, f), s); };
put('src/Header.jsx', '<div className="plx-u-a plx-stack">x</div>');
put('src/Other.tsx', 'const c = "plx-u-bee";');                   // longer name: not a use of plx-u-b
put('node_modules/x/index.js', 'el.className = "plx-u-b";');       // dependency: skipped
put('public/vendor/plenix.css', '.plx-u-b{top:0}');                 // a copied Plenix stylesheet: skipped
put('styles/app.css', '.card .plx-u-b { margin: 0 }');
check('uses found, with their files, skipping dependencies and copies',
  usesIn(app, ['plx-u-a', 'plx-u-b']), [{ cls: 'plx-u-a', files: ['src/Header.jsx'] }, { cls: 'plx-u-b', files: ['styles/app.css'] }]);
check('no use: empty', usesIn(app, ['plx-u-z']), []);
fs.rmSync(app, { recursive: true, force: true });

console.log(failed ? `REMOVED_IN_APPS_TEST_FAIL (${failed})` : 'REMOVED_IN_APPS_TEST_OK (4)');
process.exit(failed ? 1 : 0);
