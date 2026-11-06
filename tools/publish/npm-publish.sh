#!/usr/bin/env bash
# Publish @plenix-ds/{tokens,icons,styles,react}@<version> to GitHub Packages from the version's tag, after checking that
# the build is the one live on the CDN (#194, #312). Run on the agent host, which holds a GitHub login with
# write:packages; the CI job can't publish until each package grants plenix-ds/pds Actions write access.
#   bash tools/publish/npm-publish.sh <version> [<clean worktree>]
# A version already on the registry is kept, never overwritten. The token stays in an environment variable and a
# temporary config file that is deleted on exit; it is never printed.
set -euo pipefail
V=${1:?usage: npm-publish.sh <version> [<clean worktree>]}
D=${2:-$HOME/pds1/work/release-architect-deploy}
RC=$(mktemp); trap 'rm -f "$RC"' EXIT
printf '@plenix-ds:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}\n' > "$RC"
export NODE_AUTH_TOKEN; NODE_AUTH_TOKEN=$(gh auth token)
cd "$D"
[ -z "$(git status --porcelain)" ] || { echo "STOP: $D has uncommitted changes"; exit 1; }
git fetch -q origin --tags
git checkout -q --detach "v$V"
npm ci --no-audit --no-fund >/dev/null 2>&1
node build-usage.js >/dev/null && node build-packages.js >/dev/null
echo "$V built at $(git rev-parse --short HEAD)"
out=$(node tools/check-live-cdn.js "$V" --dir "release/cdn/$V" --sample 40 --deadline 8 2>&1 | tail -1); echo "$out"
[ "$out" = LIVE_CDN_OK ] || { echo "STOP: the $V build differs from the live CDN"; exit 1; }
for p in tokens icons styles react; do
  m="release/packages/$p/package.json"
  [ "$(node -p "require('./$m').version")" = "$V" ] || { echo "STOP: $m is not $V"; exit 1; }
  if npm view "@plenix-ds/$p@$V" version --userconfig "$RC" >/dev/null 2>&1; then echo "@plenix-ds/$p@$V already published: kept"; continue; fi
  (cd "release/packages/$p" && npm publish --userconfig "$RC")
done
