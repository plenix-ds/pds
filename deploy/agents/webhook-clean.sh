#!/bin/bash
# Run before `gh webhook forward` (pds1-webhook.service, ExecStartPre): delete the forwarder's own leftover hook (#1182).
# `gh webhook forward` creates a repository hook while it runs and deletes it when it exits cleanly. When its connection
# dies and it exits without cleaning up (2026-11-10 15:00 UTC), every restart fails with "Hook already exists" and the
# service loops for hours: no webhook reaches pickup, and the event feed alone is lossy and hours late. Only hooks whose
# URL is GitHub's forwarder (webhook-forwarder.github.com) are deleted; any other hook is left alone.
set -u
REPO=${WEBHOOK_REPO:-plenix-ds/pds}
GH=${GH_BIN:-gh}
"$GH" api "repos/$REPO/hooks" --jq '.[] | select(.config.url | startswith("https://webhook-forwarder.github.com/")) | .id' 2>/dev/null |
  while read -r id; do [ -n "$id" ] && "$GH" api -X DELETE "repos/$REPO/hooks/$id" >/dev/null 2>&1 && echo "webhook-clean: deleted stale forwarder hook $id"; done
exit 0
