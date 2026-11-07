#!/usr/bin/env bash
# An app can run the site-icon tool from what Plenix ships (#941, RedSave P-64), both ways:
#   - npm: the packed @plenix-ds/icons (npm pack, so its `files` and `bin` count) installed into a throwaway app, then
#     `npx plenix-site-icons`; its one dependency, @babel/parser, comes from the public registry as an app would get it;
#   - the CDN archive: tools/ extracted from plenix-<version>.tgz into an empty folder, then `node tools/site-icons.cjs`,
#     with no install and no node_modules anywhere above it.
# Each must write plenix-icons-fixture.js holding exactly the icons a TSX source names (add, search).
#   bash tools/publish/site-icons-fixture.sh <version>      after build-packages.js; exit 1 on any failure
set -euo pipefail
V=${1:?usage: site-icons-fixture.sh <version>}
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT

src() {
  mkdir -p "$1/src" "$1/out"
  cat > "$1/src/App.tsx" <<'EOF'
type Props = { count: number };
declare const Icon: (p: { name: string }) => JSX.Element;
export const App = (p: Props) => <>{p.count}<Icon name="add" /><Icon name="search" /></>;
EOF
}
expect() {
  local f="$1/out/plenix-icons-fixture.js" how=$2
  [ -f "$f" ] || { echo "SITE_ICONS_FAIL ($how): no plenix-icons-fixture.js was written"; exit 1; }
  got=$(grep -oE '"name":"[a-z0-9_-]+"' "$f" | sort -u | tr '\n' ' ')
  [ "$got" = '"name":"add" "name":"search" ' ] || { echo "SITE_ICONS_FAIL ($how): the file registers $got, not add and search"; exit 1; }
  echo "SITE_ICONS_OK ($how): plenix-icons-fixture.js with add and search"
}

# npm
A="$T/npm-app"; src "$A"; printf '{ "name": "site-icons-fixture", "private": true }\n' > "$A/package.json"
tgz=$(cd "$ROOT/release/packages/icons" && npm pack --ignore-scripts --silent --pack-destination "$T" | tail -1)
(cd "$A" && npm install --no-audit --no-fund --ignore-scripts --userconfig /dev/null --registry https://registry.npmjs.org "$T/$tgz" >/dev/null)
(cd "$A" && npx --no-install plenix-site-icons fixture src --out out)
expect "$A" "npm $tgz"

# the CDN archive
B="$T/archive-app"; src "$B"
tar -xzf "$ROOT/release/cdn/$V/plenix-$V.tgz" -C "$B" tools
[ ! -e "$B/node_modules" ] || { echo "SITE_ICONS_FAIL: the archive app must have no node_modules"; exit 1; }
(cd "$B" && node tools/site-icons.cjs fixture src --out out)
expect "$B" "archive plenix-$V.tgz tools/site-icons.cjs"
