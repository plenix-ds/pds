#!/usr/bin/env bash
# Plenix · publish the apps and the design system to the publish host (PUBLISH_HOST).
#   plenix.lighthouseway.org         -> /Plenix/dashboard/
#   design-system.lighthouseway.org  -> /Plenix/platform/design-system/
#     /cdn/<version>/  the release's CDN files (kept for good: a published version never changes)
#     /api/v1/         the read-only JSON API (replaced on every deploy)
# The deployed apps run on a release, not on the source (#842): each page loads only the page loader
# (platform/loader/loader.js), which reads /cdn/latest.json once and loads every Plenix file of the page, the app's own
# script included, from one /cdn/<version>/ folder: the app's pin if the owner set one (tools/cdn-pin.sh), else the latest
# release. Each deploy makes this version the latest and keeps the pins. Platform changes reach the apps only through a
# new version, and a broken release shows in our own apps first.
# Both names serve /srv/plenix/www on the publish host (Nginx, site file /etc/nginx/sites-available/plenix); the reverse
# proxy gives them HTTPS. Only the folders listed below are published: never the build tools, archives or databases.
# The owner's study pages (docs/font-study, docs/composition, docs/reading-pane-study, docs/page-headers, and the DataGrid studies docs/grid-header-study, docs/grid-row-hover-study, docs/grid-row-selection-study, and the dashboard study docs/dashboard-study with its self-contained original in original/) are published too, at /Plenix/docs/<study>/.
# Run from the repository root:  bash deploy.sh   The publish host, account and key come from the environment or from
# publish.config (tools/publish-config.sh: PUBLISH_HOST, PUBLISH_USER, PUBLISH_KEY; no defaults).
set -euo pipefail
cd "$(dirname "$0")"
. tools/publish-config.sh

# a release is one commit (#842): nothing uncommitted or untracked (ignored files apart), so every published file comes
# from the commit that /version.json names
if [ -n "$(git status --porcelain)" ]; then echo "STOPPED: the working tree has uncommitted or untracked files. Commit or clean them, then deploy again."; git status --short | head -20; exit 1; fi
(node build-app.js >/dev/null 2>&1 && node build-usage.js >/dev/null) || { echo "BUILD FAILED: run node build-app.js"; exit 1; }
node check-system.js >/dev/null 2>&1 || { echo "check-system failed: fix it before publishing"; exit 1; }
# G6 (#902): no missing English, no missing or unapproved Arabic in the release
node tools/checks/locale/locale.mjs --release >/dev/null || { echo "G6 language gate failed: run node tools/checks/locale/locale.mjs --release"; exit 1; }
node build-packages.js >/dev/null || { echo "build-packages failed: run node build-packages.js"; exit 1; }
VERSION=$(node -p "require('./package.json').version")
# the release holds every app's own files (#842: apps/<app>/), since the page loader loads them from it
node -e "
const fs = require('fs'), { pages } = require('./check-system.rules/one-source.js'), dir = 'release/cdn/$VERSION/apps/';
const missing = [...new Set(pages().map((p) => p.app))].map((a) => dir + a + '/' + (a === 'dam' ? 'assets.js' : 'app.js')).concat(dir + 'suite/plenix-app-data.js').filter((f) => !fs.existsSync(f));
if (missing.length) { console.log('STOPPED: the release lacks app files: ' + missing.join(', ') + '. Run node build-packages.js, then deploy again.'); process.exit(1); }" || exit 1
# the design spec runs on this release from the CDN (platform/design-system/plenix-source.js): it must name this version
[ ! -f platform/design-system/plenix-source.js ] || grep -q "var VERSION = '$VERSION'" platform/design-system/plenix-source.js || { echo "The design spec pins another release: set VERSION in platform/design-system/plenix-source.js to $VERSION"; exit 1; }
# the Material Symbols library, shared by every release (the Icon component loads a Material name from it): copied once per pinned commit
MATERIAL=$(node -p "require('./platform/icons/map.json')._commit.slice(0, 12)")
# what /version.json says on each site (owner, version-json-33): the commit of the published tree ("-dirty" when the
# working tree has changes that are not committed) and the time of the publish
COMMIT=$(git rev-parse --short HEAD)$(git diff --quiet HEAD -- || echo -dirty)
PUBLISHED=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# the site keeps its Plenix/ folder: every path is packed under Plenix/ (not symlink targets)
PKG=$(mktemp -u).tgz
tar -czf "$PKG" --exclude='*.bak' --exclude='node_modules' --transform='s,^,Plenix/,S' \
  platform suite bookmarks calendar contacts dam dashboard files \
  messages notes projects settings tasks check-system.js \
  docs/font-study docs/composition docs/reading-pane-study docs/page-headers \
  docs/grid-header-study docs/grid-row-hover-study docs/grid-row-selection-study \
  docs/dashboard-study \
  release

gzip -t "$PKG" || { echo "package is damaged; nothing published"; rm -f "$PKG"; exit 1; }
SUM=$(sha256sum "$PKG" | cut -d' ' -f1)
scp -q "${SSH_OPTS[@]}" "$PKG" "$HOST:/tmp/plenix-site.tgz"
rm -f "$PKG"
# unpack beside the live copy; swap only when the upload checks out and unpacks cleanly (the old copy stays as www.old)
ssh "${SSH_OPTS[@]}" "$HOST" "set -e
  echo '$SUM  /tmp/plenix-site.tgz' | sha256sum -c --quiet -
  sudo rm -rf /srv/plenix/www.new
  sudo mkdir -p /srv/plenix/www.new
  sudo tar -xzf /tmp/plenix-site.tgz -C /srv/plenix/www.new --no-same-owner
  rm /tmp/plenix-site.tgz
  # the design spec reads the Asset Manager audit notes (batches 15-26), which live outside the repository: keep the live copy
  D='Plenix - DAM/audit/batches'
  if [ -f \"/srv/plenix/www/\$D/15-26.md\" ]; then sudo mkdir -p \"/srv/plenix/www.new/\$D\" && sudo cp -p \"/srv/plenix/www/\$D/15-26.md\" \"/srv/plenix/www.new/\$D/\"; fi
  sudo find /srv/plenix/www.new -type d -exec chmod 755 {} +
  sudo find /srv/plenix/www.new -type f -exec chmod 644 {} +
  sudo rm -rf /srv/plenix/www.old /srv/plenix/www.bad
  # a CDN version is added once and never overwritten (#842): when this version is already published, every file of this
  # build's release folder must equal the published one; any difference stops the deploy before anything changes, because
  # the apps would mix the published release with newer files of their own
  if [ -d /srv/plenix/cdn/$VERSION ]; then
    if ! diff -rq /srv/plenix/www.new/Plenix/release/cdn/$VERSION /srv/plenix/cdn/$VERSION >/tmp/plenix-cdn-diff.txt 2>&1; then
      echo 'STOPPED: CDN $VERSION is already published and this build differs from it:'
      head -20 /tmp/plenix-cdn-diff.txt; rm -f /tmp/plenix-cdn-diff.txt
      echo 'Raise the version in package.json to release these changes, then deploy again. Nothing was changed on the site.'
      sudo rm -rf /srv/plenix/www.new; exit 1
    fi
    rm -f /tmp/plenix-cdn-diff.txt
  fi
  # the apps load Plenix from the CDN (#842): the page loader reads /cdn/latest.json (the app's pin, else the latest
  # release) and loads every file from that one release; if latest.json cannot be read, this release
  for f in /srv/plenix/www.new/Plenix/*/index.html /srv/plenix/www.new/Plenix/dam/*.html; do
    sudo sed -i -e 's|<script src=\"../platform/loader/loader.js\" data-plenix-app=\"\\([a-z]*\\)\">|<script src=\"../platform/loader/loader.js\" data-plenix-app=\"\\1\" data-plenix-cdn=\"https://design-system.lighthouseway.org/cdn/\" data-plenix-fallback=\"$VERSION\">|' \"\$f\"
  done
  # live app pages leave out the development audits and open the connection to the CDN first thing (batch 237)
  for f in /srv/plenix/www.new/Plenix/*/index.html /srv/plenix/www.new/Plenix/dam/*.html; do
    sudo sed -i -e '/platform\/dev\//d' -e '/the radius audit (development)/d' \
      -e '/<meta name=\"viewport\"/a <link rel=\"preconnect\" href=\"https://design-system.lighthouseway.org\">' \"\$f\"
  done
  # the study pages load one stylesheet (the source platform.css with its imports inlined and minified, plenix.min.css, built by build-packages.js; #882)
  # instead of platform.css and its hundred imports (batch 237); the design system loads the CDN release (plenix-source.js)
  sudo mv /srv/plenix/www.new/Plenix/release/packages/styles/plenix.min.css /srv/plenix/www.new/Plenix/platform/dist/platform.bundle.css
  sudo rm -rf /srv/plenix/www.new/Plenix/release/packages
  B=\$(sha256sum /srv/plenix/www.new/Plenix/platform/dist/platform.bundle.css | cut -c1-8)
  # the study pages too: platform.css's two hundred imports trip the server's request limit (429) and the page shows unstyled.
  # Only a study's own pages (docs/<study>/*.html, 9 of them) are rewritten; a file one folder deeper, such as the dashboard
  # study's self-contained original (docs/dashboard-study/original/), is published unchanged
  for f in /srv/plenix/www.new/Plenix/docs/*/*.html; do
    sudo sed -i \"s|href=\\\"../../platform/platform.css\\\"|href=\\\"../../platform/dist/platform.bundle.css?v=\$B\\\"|\" \"\$f\"
  done
  grep -l platform.bundle.css /srv/plenix/www.new/Plenix/docs/*/*.html | wc -l | xargs -I{} echo 'Study pages on one stylesheet: {}'
  # every app page loads Plenix from the CDN through the loader, and nothing from the source copy (#842): a page left on
  # the source copy, or naming a release of its own, would mix versions
  pages=\$(ls /srv/plenix/www.new/Plenix/*/index.html /srv/plenix/www.new/Plenix/dam/*.html | sort -u)
  total=\$(echo \"\$pages\" | wc -l)
  onCdn=\$(grep -l 'data-plenix-cdn=\"https://design-system.lighthouseway.org/cdn/\" data-plenix-fallback=\"$VERSION\"' \$pages | wc -l)
  mixed=\$(grep -l -E '(src|href)=\"[^\"]*(\.\./platform/(dist|vendor|providers|engines|system|fonts|dev)/|\.\./platform/platform\.css|/cdn/[0-9]|plenix-icons-|plenix-app-data|app\.js|app/assets\.js)' \$pages || true)
  if [ \"\$onCdn\" != \"\$total\" ] || [ -n \"\$mixed\" ]; then
    echo \"STOPPED: \$onCdn of \$total app pages load Plenix through the loader from the CDN.\"
    grep -L 'data-plenix-fallback=\"$VERSION\"' \$pages | sed 's|^|  no loader on the CDN: |'
    for m in \$mixed; do echo \"  loads a Plenix file itself: \$m\"; done
    echo 'Put the page on the page loader (check-system rule one-source), then deploy again. Nothing was changed on the site.'
    sudo rm -rf /srv/plenix/www.new; exit 1
  fi
  echo \"Apps on the page loader, CDN latest.json, fallback $VERSION: \$onCdn of \$total pages\"
  # every check passed: the API, the Material library and the CDN version go live, then the site is swapped
  # the API is replaced; a CDN version is added once and never overwritten
  sudo rm -rf /srv/plenix/api.new && sudo mv /srv/plenix/www.new/Plenix/release/api /srv/plenix/api.new
  sudo rm -rf /srv/plenix/api && sudo mv /srv/plenix/api.new /srv/plenix/api
  sudo mkdir -p /srv/plenix/cdn
  if [ ! -d /srv/plenix/cdn/material/$MATERIAL ]; then sudo mkdir -p /srv/plenix/cdn/material && sudo cp -r /srv/plenix/www.new/Plenix/platform/icons/library /srv/plenix/cdn/material/$MATERIAL && echo 'Material library published at /cdn/material/$MATERIAL/'; fi
  if [ -d /srv/plenix/cdn/$VERSION ]; then echo 'CDN $VERSION is already published, and this build is identical to it: kept as it was'
  else sudo mv /srv/plenix/www.new/Plenix/release/cdn/$VERSION /srv/plenix/cdn/$VERSION; echo 'CDN $VERSION published'; fi
  sudo rm -rf /srv/plenix/www.new/Plenix/release
  # /cdn/latest.json (#842): this release is the latest; the owner's pins (tools/cdn-pin.sh) are kept
  sudo python3 -c 'import json,os,sys; p=\"/srv/plenix/cdn/latest.json\"; old=json.load(open(p)) if os.path.exists(p) else {}; json.dump({\"latest\": sys.argv[1], \"pins\": old.get(\"pins\", {})}, open(p + \".new\", \"w\"), indent=1); os.chmod(p + \".new\", 0o644); os.replace(p + \".new\", p)' $VERSION
  echo \"CDN latest.json: latest $VERSION, pins \$(python3 -c 'import json; print(json.load(open(\"/srv/plenix/cdn/latest.json\"))[\"pins\"] or \"none\")')\"
  ls /srv/plenix/cdn | grep -E '^[0-9]+[.][0-9]+[.][0-9]+' | sort -V | python3 -c 'import sys,json; v=[l.strip() for l in sys.stdin if l.strip()]; print(json.dumps({\"versions\": v, \"latest\": v[-1]}))' | sudo tee /srv/plenix/cdn/index.json >/dev/null
  # /version.json on each site (owner, version-json-33): name, version, commit and time only. Each name serves its own
  # folder (the header above): plenix.lighthouseway.org is Plenix/dashboard/, design-system.lighthouseway.org is Plenix/platform/design-system/
  printf '{\"name\": \"Plenix apps\", \"version\": \"$VERSION\", \"commit\": \"$COMMIT\", \"publishedAt\": \"$PUBLISHED\"}\n' | sudo tee /srv/plenix/www.new/Plenix/dashboard/version.json >/dev/null
  printf '{\"name\": \"Design spec\", \"version\": \"$VERSION\", \"commit\": \"$COMMIT\", \"publishedAt\": \"$PUBLISHED\"}\n' | sudo tee /srv/plenix/www.new/Plenix/platform/design-system/version.json >/dev/null
  sudo chmod 644 /srv/plenix/www.new/Plenix/dashboard/version.json /srv/plenix/www.new/Plenix/platform/design-system/version.json
  sudo mv /srv/plenix/www /srv/plenix/www.old
  sudo mv /srv/plenix/www.new /srv/plenix/www"
echo "Published: https://plenix.lighthouseway.org/  https://design-system.lighthouseway.org/  (CDN /cdn/$VERSION/, API /api/v1/)"
