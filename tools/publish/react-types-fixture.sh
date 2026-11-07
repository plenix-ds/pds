#!/usr/bin/env bash
# The packed @plenix-ds/react typechecks on its own (#935, RedSave P-66). dts-closure.cjs reads the build folder; this
# reads what npm actually ships: it packs the package (npm pack, so a `files` list or an .npmignore counts), installs the
# tarball into a throwaway project outside the repository with only react and @types/react beside it (no CDN fetch, no
# registry), and runs a strict tsc --noEmit (skipLibCheck off) on a file that imports every export and the Arabic opt-in.
# A declaration the tarball lacks fails with TS2307; two exports with one name (0.93.0's TS2308) fail too.
#   bash tools/publish/react-types-fixture.sh [<package folder>]     default release/packages/react; exit 1 on any error
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
PKG=$(cd "${1:-$ROOT/release/packages/react}" && pwd)
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
F="$T/fixture"; mkdir -p "$F/node_modules/@plenix-ds/react" "$F/node_modules/@types"

tgz=$(cd "$PKG" && npm pack --ignore-scripts --silent --pack-destination "$T" | tail -1)
tar -xzf "$T/$tgz" -C "$F/node_modules/@plenix-ds/react" --strip-components=1
n=$(find "$F/node_modules/@plenix-ds/react" -name '*.d.ts' | wc -l)
ln -s "$ROOT/node_modules/react" "$F/node_modules/react"
ln -s "$ROOT/node_modules/@types/react" "$F/node_modules/@types/react"

printf '{ "name": "react-types-fixture", "private": true, "type": "module" }\n' > "$F/package.json"
cat > "$F/app.tsx" <<'EOF'
import * as Plenix from '@plenix-ds/react';
import '@plenix-ds/react/i18n/ar';
export type Everything = typeof Plenix;
EOF
cat > "$F/tsconfig.json" <<'EOF'
{ "compilerOptions": { "strict": true, "jsx": "react-jsx", "module": "nodenext", "moduleResolution": "nodenext",
  "target": "es2022", "noEmit": true, "skipLibCheck": false, "types": [] }, "files": ["app.tsx"] }
EOF

set +e
out=$(cd "$F" && "$ROOT/node_modules/.bin/tsc" -p . 2>&1); rc=$?
loaded=$(cd "$F" && "$ROOT/node_modules/.bin/tsc" -p . --listFiles 2>/dev/null | grep -c '/@plenix-ds/react/')
set -e
if [ "$rc" -ne 0 ]; then
  printf '%s\n' "$out" | head -40
  echo "REACT_TYPES_FAIL: $tgz ($n declaration files) does not typecheck on its own: $(printf '%s\n' "$out" | grep -c 'error TS') error(s)"
  exit 1
fi
echo "REACT_TYPES_OK: $tgz, $n declaration files packed, $loaded loaded by a strict tsc --noEmit with no CDN fetch"
