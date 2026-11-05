#!/usr/bin/env bash
# PDS1 team launcher (runs on the agent host, VM 131, as cc).
# Each agent is a Claude Code session in tmux session "pds1", visible in the
# Claude app through Remote Control as "PDS1 - <Role>", with its own worktree
# and a memory limit from agents.config.yaml.
#
#   team.sh start-core          start the coordinators + Phase 0 roles (boot default)
#   team.sh start <role> [n]    start one role (n = instance, for component-engineer)
#   team.sh stop <role> [n]     stop one role
#   team.sh stop-all            stop the whole team
#   team.sh status              list running sessions and free memory
#   team.sh update              pull main into every worktree
set -u
export PATH="$HOME/.local/bin:$HOME/.bun/bin:/usr/local/bin:/usr/bin:/bin"
S=pds1
ROOT=$HOME/pds1
REPO=$ROOT/work/pds                 # main checkout (coordinators)
CFG=$REPO/agents.config.yaml
LOG=$ROOT/team.log

# role|display name
ROLES=(
  "product-lead|Product Lead"
  "delivery-lead|Delivery Lead"
  "design-director|Design Director"
  "ds-architect|DS Architect"
  "component-engineer|Component Engineer"
  "i18n-engineer|i18n Engineer"
  "release-architect|Backend & Release Architect"
  "technical-writer|Technical Writer"
)
# Started at boot. The Delivery Lead starts the rest as work needs them.
CORE=(product-lead delivery-lead design-director ds-architect release-architect)

log() { echo "$(date -u +%FT%TZ) $*" >>"$LOG"; }
display() { for r in "${ROLES[@]}"; do [ "${r%%|*}" = "$1" ] && { echo "${r#*|}"; return; }; done; return 1; }
mem_limit() { awk '/per_agent_limit_gb:/{print $2; exit}' "$CFG" 2>/dev/null || echo 1.5; }

worktree_for() {  # role instance -> directory
  local role=$1 n=$2 dir
  case $role in product-lead|delivery-lead) echo "$REPO"; return ;; esac
  dir=$ROOT/work/$role${n:+-$n}
  if [ ! -d "$dir" ]; then
    git -C "$REPO" fetch -q origin
    git -C "$REPO" worktree add -q -B "agent/$role${n:+-$n}" "$dir" origin/main >>"$LOG" 2>&1
  fi
  echo "$dir"
}

start_one() {
  local role=$1 n=${2:-} name win dir mem
  name=$(display "$role") || { echo "unknown role: $role"; exit 2; }
  [ "$role" = component-engineer ] && n=${n:-1}
  [ -n "$n" ] && name="$name $n"
  name="PDS1 - $name"; win=$role${n:+-$n}
  tmux has-session -t $S 2>/dev/null || tmux new-session -d -s $S -n shell -c "$ROOT"
  tmux list-windows -t $S -F '#W' | grep -qx "$win" && { echo "$name already running"; return; }
  dir=$(worktree_for "$role" "$n"); mem=$(mem_limit); trust_dir "$dir"
  tmux new-window -d -t $S -n "$win" -c "$dir" \
    "systemd-run --user --scope -q -p MemoryMax=${mem}G -- env PDS1_ROLE=pds1-$role claude --agent pds1-$role --name '$name' --remote-control '$name' --permission-mode bypassPermissions; echo; echo '$name stopped. Press Enter to close.'; read"
  log "start $win ($name) in $dir"; echo "started $name"
}

trust_dir() {  # pre-accept Claude's folder-trust prompt so unattended sessions don't hang
  node -e 'const fs=require("fs"),f=process.env.HOME+"/.claude.json";let j={};try{j=JSON.parse(fs.readFileSync(f,"utf8"))}catch{}
    j.projects=j.projects||{};const p=j.projects[process.argv[1]]=j.projects[process.argv[1]]||{};
    if(!p.hasTrustDialogAccepted){p.hasTrustDialogAccepted=true;fs.writeFileSync(f,JSON.stringify(j,null,2))}' "$1"
}

stop_one() { local win=$1${2:+-$2}; tmux kill-window -t "$S:$win" 2>/dev/null && { log "stop $win"; echo "stopped $win"; }; }

case "${1:-status}" in
  start-core)
    mkdir -p "$ROOT/work"
    [ -d "$REPO/.git" ] || git clone -q https://github.com/plenix-ds/pds.git "$REPO"
    git -C "$REPO" pull -q --ff-only
    for r in "${CORE[@]}"; do start_one "$r"; done ;;
  start) start_one "${2:?role}" "${3:-}" ;;
  stop) stop_one "${2:?role}" "${3:-}" ;;
  stop-all) tmux kill-session -t $S 2>/dev/null && { log "stop-all"; echo "team stopped"; } ;;
  update) git -C "$REPO" pull -q --ff-only; for d in "$ROOT"/work/*/; do git -C "$d" fetch -q origin; done; echo updated ;;
  status) tmux list-windows -t $S -F '#W' 2>/dev/null | grep -v '^shell$' || echo "pds1 team is not running"; free -g | awk 'NR==2{print "free memory: "$7" GB available"}' ;;
  *) sed -n 2,13p "$0"; exit 2 ;;
esac
