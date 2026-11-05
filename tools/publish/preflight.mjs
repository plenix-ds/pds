#!/usr/bin/env node
// Release preflight (P0-12, #194). Run after the build, before anything is published.
//
//   node tools/publish/preflight.mjs <version> [--cdn https://design-system.lighthouseway.org/cdn/] [--expect-published]
//
// 1. One version: the root package.json, every workspace (packages/*), the four published packages
//    (release/packages/{tokens,icons,styles,react}) and the CDN folder (release/cdn/<version>/) all say <version>;
//    the API folder (release/api/v1/) exists.
// 2. Immutable CDN: <version> must not be published yet. It is published when the live /cdn/index.json lists it or
//    /cdn/<version>/ answers anything but 404. A network error is a failure, never a pass.
//    --expect-published inverts step 2 for the negative proof: the version must be refused (exit 0 when it is).
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const version = args[0];
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const cdn = opt('--cdn', 'https://design-system.lighthouseway.org/cdn/').replace(/\/?$/, '/');
const expectPublished = args.includes('--expect-published');
if (!version) { console.error('usage: preflight.mjs <version> [--cdn <url>] [--expect-published]'); process.exit(2); }

const errors = [];
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

if (!expectPublished) {
  const root = readJson('package.json');
  const seen = [['package.json', root.version]];
  for (const pattern of root.workspaces || []) {
    const base = pattern.replace(/\/\*$/, '');
    for (const d of fs.existsSync(base) ? fs.readdirSync(base) : []) {
      const f = path.join(base, d, 'package.json');
      if (fs.existsSync(f)) seen.push([f, readJson(f).version]);
    }
  }
  for (const p of ['tokens', 'icons', 'styles', 'react']) {
    const f = path.join('release', 'packages', p, 'package.json');
    if (!fs.existsSync(f)) { errors.push(`${f} is missing (build-packages.js did not run)`); continue; }
    const m = readJson(f);
    seen.push([f, m.version]);
    if (m.name !== `@plenix-ds/${p}`) errors.push(`${f}: name ${m.name}, expected @plenix-ds/${p}`);
    if (m.private) errors.push(`${f} is private: it would not publish`);
    if ((m.publishConfig || {}).registry !== 'https://npm.pkg.github.com') errors.push(`${f}: publishConfig.registry is not GitHub Packages`);
  }
  for (const [f, v] of seen) if (v !== version) errors.push(`${f} says ${v}, the release is ${version}`);
  if (!fs.existsSync(path.join('release', 'cdn', version))) errors.push(`release/cdn/${version}/ is missing`);
  if (!fs.existsSync(path.join('release', 'api', 'v1'))) errors.push('release/api/v1/ is missing');
  console.log(`one version: ${seen.length} manifests checked`);
}

let published = false;
try {
  const idx = await fetch(cdn + 'index.json', { cache: 'no-store' });
  if (!idx.ok) throw new Error(`index.json answered ${idx.status}`);
  const versions = (await idx.json()).versions || [];
  if (!Array.isArray(versions) || versions.length === 0) throw new Error('index.json has no versions list');
  if (versions.includes(version)) { published = true; console.log(`${version} is listed in ${cdn}index.json`); }
  const head = await fetch(`${cdn}${version}/`, { method: 'HEAD', cache: 'no-store', redirect: 'manual' });
  if (head.status !== 404) { published = true; console.log(`${cdn}${version}/ answered ${head.status} (not 404)`); }
  console.log(`immutability: live index lists ${versions.length} versions; ${version} ${published ? 'IS' : 'is not'} published`);
} catch (e) {
  errors.push(`could not read the live CDN (${e.message}): a publish never proceeds without the immutability check`);
}
if (expectPublished) {
  if (!published && !errors.length) errors.push(`${version} should be published (negative proof) but the CDN does not have it`);
} else if (published) {
  errors.push(`${version} is already published at ${cdn}${version}/: published versions are immutable, a fix is a new version`);
}

if (errors.length) { for (const e of errors) console.log(`PREFLIGHT_FAIL: ${e}`); process.exit(1); }
console.log(expectPublished ? `PREFLIGHT_OK: ${version} is refused as already published` : `PREFLIGHT_OK ${version}`);
