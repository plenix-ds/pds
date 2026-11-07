#!/usr/bin/env node
// Self-test of tools/publish/dts-closure.cjs (#894): a declaration import that resolves to no file inside the artifact
// fails; the 0.93.0 archive's shape (plenix.d.ts -> ./types/…, no types/ folder) is the failing fixture.
//   node tools/publish/dts-closure.test.mjs        (the release dry run)
import { createRequire } from 'node:module';
const { specifiers, dangling, assertClosed } = createRequire(import.meta.url)('./dts-closure.cjs');

let failed = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : `\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`}`);
};

const index = "export { Badge } from './types/components/Badge/Badge.js';\nexport type { BadgeProps } from './types/components/Badge/Badge.js';\nexport * from './types/hooks/useX';\n";
const badge = "import type { Tone } from '../../tokens.js';\nimport type * as R from 'react';\nexport declare function Badge(p: { tone: Tone; c: import('../Icon/Icon.js').IconName }): R.ReactNode;\n";
check('specifiers: relative only, each once', specifiers(index), ['./types/components/Badge/Badge.js', './types/hooks/useX']);
check('specifiers: import() types, packages skipped', specifiers(badge), ['../../tokens.js', '../Icon/Icon.js']);
check('specifiers: comments ignored', specifiers("// from './gone.js'\n/* import('./gone2.js') */\nexport {};\n"), []);
check('specifiers: triple-slash reference path', specifiers('/// <reference path="./globals.d.ts" />\n'), ['./globals.d.ts']);

const archive093 = new Map([['plenix.d.ts', index], ['plenix.js', ''], ['README.md', '']]);
check('0.93.0 archive shape (no types/) fails, every missing import listed',
  dangling(archive093).map((d) => d.specifier), ['./types/components/Badge/Badge.js', './types/hooks/useX']);
let message = '';
try { assertClosed(archive093, 'the archive'); } catch (e) { message = e.message; }
check('assertClosed throws DTS_CLOSURE_FAIL naming the artifact', message.startsWith('DTS_CLOSURE_FAIL: the archive has 2 '), true);

const closed = new Map([...archive093, ['types/components/Badge/Badge.d.ts', badge], ['types/hooks/useX/index.d.ts', 'export {};'],
  ['types/tokens.d.ts', 'export type Tone = string;'], ['types/components/Icon/Icon.d.ts', 'export type IconName = string;']]);
check('with types/ the archive is closed (x.js -> x.d.ts, x -> x/index.d.ts)', dangling(closed), []);
check('assertClosed returns the number of declaration files', assertClosed(closed, 'x'), 5);
check('an import leading outside the artifact fails',
  dangling(new Map([['plenix.d.ts', "export * from '../outside.js';"], ['../outside.d.ts', '']])).length, 1);

console.log(failed ? `DTS_CLOSURE_TEST_FAIL: ${failed} failed` : 'DTS_CLOSURE_TEST_OK');
process.exit(failed ? 1 : 0);
