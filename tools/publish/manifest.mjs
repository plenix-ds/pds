#!/usr/bin/env node
// Release records for one CDN version (P0-12, #194; plan §7c): SHA256SUMS and version.json at the version root.
//
//   node tools/publish/manifest.mjs <version> [--dir release/cdn/<version>] [--commit <sha>]
//
// SHA256SUMS: "<sha256>  <path>" for every file under the version folder (sorted, "/" separators; the same format as
// `sha256sum`, so `cd <version> && sha256sum -c SHA256SUMS` verifies a download). It lists every file except itself
// and version.json; version.json carries the sha256 of SHA256SUMS, so one fetch proves the whole set.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const version = args[0];
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version || '')) { console.error('usage: manifest.mjs <version> [--dir <folder>] [--commit <sha>]'); process.exit(2); }
const dir = opt('--dir', path.join('release', 'cdn', version));
const commit = opt('--commit', process.env.GITHUB_SHA || '');
if (!fs.existsSync(dir)) { console.error(`MANIFEST_FAIL: ${dir} does not exist (build first)`); process.exit(1); }

const OWN = new Set(['SHA256SUMS', 'version.json']);
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.isFile()) files.push(path.relative(dir, p).split(path.sep).join('/'));
    else { console.error(`MANIFEST_FAIL: ${p} is not a file or folder (links are not published)`); process.exit(1); }
  }
})(dir);
const listed = files.filter((f) => !OWN.has(f)).sort();
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

let bytes = 0;
const lines = listed.map((f) => {
  const buf = fs.readFileSync(path.join(dir, f));
  bytes += buf.length;
  return `${sha(buf)}  ${f}`;
});
const sums = lines.join('\n') + '\n';
fs.writeFileSync(path.join(dir, 'SHA256SUMS'), sums);

const record = {
  name: 'Plenix',
  version,
  commit,
  builtAt: new Date().toISOString(),
  files: listed.length,
  bytes,
  sha256sums: sha(Buffer.from(sums)),
  npm: ['tokens', 'icons', 'styles', 'react'].map((p) => `@plenix-ds/${p}@${version}`),
  cdn: `https://design-system.lighthouseway.org/cdn/${version}/`,
  api: 'https://design-system.lighthouseway.org/api/v1/',
};
fs.writeFileSync(path.join(dir, 'version.json'), JSON.stringify(record, null, 1) + '\n');
console.log(`MANIFEST_OK ${version}: ${listed.length} files, ${(bytes / 1048576).toFixed(1)} MB, SHA256SUMS ${record.sha256sums.slice(0, 12)}`);
