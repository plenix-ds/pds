#!/usr/bin/env node
// Set one version offline across the root, the workspaces, their @plenix-ds/* references to each other and
// package-lock.json (P0-12, #194). Used by the release dry run for its throwaway version; `npm version --workspaces`
// asks the registry about the @plenix-ds/* workspaces and fails without a token. Never touches the network.
//
//   node tools/publish/set-version.mjs <version>
import fs from 'node:fs';
import path from 'node:path';

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version || '')) { console.error('usage: set-version.mjs <version>'); process.exit(2); }
const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const write = (f, j) => fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
const root = read('package.json');
const old = root.version;
const DEP_KEYS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
const ours = (name) => name.startsWith('@plenix-ds/');
const bumpDeps = (m) => {
  let n = 0;
  for (const k of DEP_KEYS) for (const [name, range] of Object.entries(m[k] || {})) {
    if (ours(name) && range === old) { m[k][name] = version; n++; }
  }
  return n;
};

let refs = 0;
const dirs = [];
for (const pattern of root.workspaces || []) {
  const base = pattern.replace(/\/\*$/, '');
  for (const d of fs.readdirSync(base)) if (fs.existsSync(path.join(base, d, 'package.json'))) dirs.push(path.join(base, d));
}
root.version = version;
refs += bumpDeps(root);
write('package.json', root);
for (const d of dirs) {
  const f = path.join(d, 'package.json');
  const m = read(f);
  if (m.version !== old) { console.error(`SET_VERSION_FAIL: ${f} is ${m.version}, the root was ${old}: versions already differ`); process.exit(1); }
  m.version = version;
  refs += bumpDeps(m);
  write(f, m);
}
if (fs.existsSync('package-lock.json')) {
  const lock = read('package-lock.json');
  lock.version = version;
  for (const [k, e] of Object.entries(lock.packages || {})) {
    if (k === '' || dirs.includes(k.split('/').join(path.sep))) { e.version = version; refs += bumpDeps(e); }
  }
  write('package-lock.json', lock);
}
console.log(`SET_VERSION_OK ${old} -> ${version}: root, ${dirs.length} workspaces, ${refs} @plenix-ds references, package-lock.json`);
