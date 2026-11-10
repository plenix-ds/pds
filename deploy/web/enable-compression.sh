#!/usr/bin/env bash
# Turns on brotli (and gzip level 6) for the Plenix sites on the web host (#1188). Run on the agent host from the repository root:
#   bash deploy/web/enable-compression.sh
# Safe to run again. It backs up the nginx site file, checks the configuration (nginx -t) before reloading, then checks
# brotli, gzip and plain answers on the host. On any failure it puts the backed-up file back and reloads.
set -euo pipefail
cd "$(dirname "$0")/../.."
. tools/publish-config.sh
scp -q "${SSH_OPTS[@]}" deploy/web/plenix-compression.conf "$HOST:/tmp/plenix-compression.conf"
ssh "${SSH_OPTS[@]}" "$HOST" 'bash -s' <<'REMOTE'
set -euo pipefail
SITE=/etc/nginx/sites-available/plenix
BK=/srv/plenix/backup/nginx-plenix-$(date -u +%Y%m%dT%H%M%SZ)
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q libnginx-mod-http-brotli-filter >/dev/null
sudo install -m 644 /tmp/plenix-compression.conf /etc/nginx/snippets/plenix-compression.conf
rm -f /tmp/plenix-compression.conf
sudo cp -p "$SITE" "$BK"; echo "Backup: $BK"
restore() { sudo cp -p "$BK" "$SITE"; sudo nginx -t -q && sudo systemctl reload nginx; echo "COMPRESSION_FAIL: $1; the site file was put back"; exit 1; }
# each server block's own gzip line becomes the shared snippet (idempotent: a second run finds no gzip line to replace)
sudo sed -i 's|^\(\s*\)gzip on; gzip_types .*;$|\1include snippets/plenix-compression.conf;|' "$SITE"
sudo nginx -t -q 2>/dev/null || restore "nginx -t failed"
sudo systemctl reload nginx; sleep 1
code() { curl -s -o /dev/null -w '%{http_code}' -H "Host: design-system.lighthouseway.org" -H "Accept-Encoding: ${1:-identity}" "http://127.0.0.1/cdn/$2"; }
V=$(python3 -c 'import json; print(json.load(open("/srv/plenix/cdn/latest.json"))["latest"])')
big() { curl -s -o /dev/null -D - -H "Host: design-system.lighthouseway.org" -H "Accept-Encoding: $1" "http://127.0.0.1/cdn/$V/plenix.css" | tr -d '\r' | awk -F': ' 'tolower($1)=="content-encoding"{print $2}'; }
[ "$(big 'br, gzip')" = br ] || restore "no brotli answer"
[ "$(big gzip)" = gzip ] || restore "no gzip answer"
[ -z "$(big identity)" ] || restore "a plain request got a compressed answer"
[ "$(code br "$V/plenix.js")" = 200 ] || restore "plenix.js did not answer 200"
vary=$(curl -s -o /dev/null -D - -H "Host: design-system.lighthouseway.org" -H "Accept-Encoding: br" "http://127.0.0.1/cdn/$V/plenix.css" | tr -d '\r' | grep -ci '^vary:.*accept-encoding' || true)
[ "$vary" -ge 1 ] || restore "no Vary: Accept-Encoding"
echo "COMPRESSION_OK: brotli, gzip and plain answers checked on CDN $V"
REMOTE
