#!/usr/bin/env bash
# Roll a failed release back on the web host (plan §7c, G8): put back the /cdn/latest.json and /srv/plenix/api that
# deploy.sh saved in <backup> (it prints "Backup: /srv/plenix/backup/pre-<version>-<time>"). The new /cdn/<version>/
# folder stays: a published version is never removed or overwritten, only no longer the latest. The owner's pins are
# whatever the backup holds; pins changed after the deploy would be lost, so the script stops when they differ.
#   bash tools/publish/rollback.sh /srv/plenix/backup/pre-<version>-<time>
set -euo pipefail
cd "$(dirname "$0")/../.."
. tools/publish-config.sh
BK=${1:?usage: rollback.sh /srv/plenix/backup/pre-<version>-<time>}
case "$BK" in /srv/plenix/backup/pre-*) ;; *) echo "STOPPED: $BK is not a deploy backup (/srv/plenix/backup/pre-*)"; exit 2 ;; esac
ssh "${SSH_OPTS[@]}" "$HOST" "set -e
  [ -f '$BK/latest.json' ] && [ -d '$BK/api' ] || { echo 'STOPPED: $BK lacks latest.json or api/'; exit 1; }
  pins() { python3 -c 'import json,sys; print(json.dumps(json.load(open(sys.argv[1])).get(\"pins\", {}), sort_keys=True))' \"\$1\"; }
  [ \"\$(pins '$BK/latest.json')\" = \"\$(pins /srv/plenix/cdn/latest.json)\" ] || { echo 'STOPPED: the pins changed since the deploy; restore latest.json by hand'; exit 1; }
  sudo rm -rf /srv/plenix/api.rollback && sudo cp -a '$BK/api' /srv/plenix/api.rollback
  sudo rm -rf /srv/plenix/api.failed && sudo mv /srv/plenix/api /srv/plenix/api.failed && sudo mv /srv/plenix/api.rollback /srv/plenix/api
  sudo cp -p '$BK/latest.json' /srv/plenix/cdn/latest.json.new && sudo mv /srv/plenix/cdn/latest.json.new /srv/plenix/cdn/latest.json
  echo \"ROLLBACK_OK: latest.json \$(tr -d ' \\n' < /srv/plenix/cdn/latest.json), API from $BK (the failed one kept as /srv/plenix/api.failed)\""
