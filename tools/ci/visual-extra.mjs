#!/usr/bin/env node
// VISUAL_EXTRA for check 12 (tests/visual; #191, D-0017): the specimens of the components this PR changed, so they also
// run in RTL and compact. A changed folder platform/components/<Name>/ selects every specimen named <name>-… (kebab
// case); a change to the shared direction or density code (platform/system/*.css with "rtl", "direction" or "density"
// in its name) selects all.
//   node tools/ci/visual-extra.mjs <base ref>      prints the comma list (empty when none)
import { execFileSync } from 'node:child_process';
import { specimens } from '../../tests/visual/specimens.mjs';

const base = process.argv[2];
if (!base) { console.error('usage: visual-extra.mjs <base ref>'); process.exit(2); }
const changed = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], { encoding: 'utf8' }).split('\n').filter(Boolean);
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
if (changed.some((f) => /^platform\/system\/[^/]*(rtl|direction|density)[^/]*\.css$/i.test(f))) { console.log('all'); process.exit(0); }
const comps = new Set(changed.map((f) => (/^platform\/components\/([^/]+)\//.exec(f) || [])[1]).filter(Boolean).map(kebab));
const out = Object.keys(specimens).filter((n) => [...comps].some((c) => n === c || n.startsWith(c + '-')));
console.log(out.join(','));
