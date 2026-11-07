#!/usr/bin/env node
// A version PR leaves no changelog fragment behind (#884). When this change (a PR, or its merge-queue group) sets a new
// `version` in package.json, changelog.d/ must hold no fragment (*.md other than README.md): every fragment is folded into
// CHANGELOG.md by tools/publish/fold-changelog.mjs. In the merge queue a fragment that merged ahead of the release PR is
// in the group's head, so the release PR fails and leaves the queue instead of shipping that change without its line
// (0.91.0, 0.92.0 and 0.93.0 did; docs/lessons.md). Fold it on the release branch and queue the PR again.
//   node tools/ci/check-release-notes.mjs <base ref>
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// the fragments a version change leaves unfolded ([] when the version is unchanged)
export function leftFragments({ baseVersion, headVersion, files }) {
  if (baseVersion === headVersion) return [];
  return files.filter((f) => f.endsWith('.md') && f !== 'README.md').sort();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const base = process.argv[2];
  if (!base) { console.error('usage: check-release-notes.mjs <base ref>'); process.exit(2); }
  const version = (ref) => JSON.parse(ref ? execFileSync('git', ['show', `${ref}:package.json`], { encoding: 'utf8' }) : fs.readFileSync('package.json', 'utf8')).version;
  const baseVersion = version(base), headVersion = version(null);
  const files = fs.existsSync('changelog.d') ? fs.readdirSync('changelog.d') : [];
  const left = leftFragments({ baseVersion, headVersion, files });
  if (left.length) {
    for (const f of left) console.log(`::error file=changelog.d/${f}::${f} is not folded into CHANGELOG.md, but this change releases ${headVersion}`);
    console.log(`RELEASE_NOTES_FAIL: ${left.length} fragment(s) merged before the ${headVersion} release commit. Run node tools/publish/fold-changelog.mjs on the release branch (or add the lines to its section), then queue it again.`);
    process.exit(1);
  }
  console.log(baseVersion === headVersion ? `RELEASE_NOTES_OK (no version change: ${headVersion})` : `RELEASE_NOTES_OK (${baseVersion} -> ${headVersion}, no fragment left)`);
}
