#!/usr/bin/env bash
# PDS1 team launcher (runs on the agent host, VM 131, as cc).
# Each agent is a Claude Code session in tmux session "pds1", visible in the
# Claude app through Remote Control as "PDS1 · <Role>" ("PDS1 - PM" for the Product
# Lead, the project contact, so it sorts first: "-" comes before "·"), with its own worktree
# and a memory limit from agents.config.yaml.
#
#   team.sh start-core          start the coordinators + Phase 0 roles (boot default)
#   team.sh start <role> [n] [model]   start one role (n = instance, for component-engineer; model = haiku|sonnet|opus,
#                               D-0173; default: the role definition's model)
#   team.sh stop <role> [n]     stop one role
#   team.sh stop-all            stop the whole team
#   team.sh status              list running sessions and free memory
#   team.sh update              pull main into every worktree
#   team.sh nudge               start waiting roles, stop finished ones (#246), then wake idle sessions to check
#                               GitHub (pds1-nudge.timer, every 10 min; #220). NUDGE_DRY=1 only prints the plan
#   team.sh schedule            only the start/stop part of nudge (NUDGE_DRY=1 prints it)
#   team.sh wake <win> <text>   type <text> into one session if it is idle (exit 0 sent, 3 not idle, 4 no window)
#   team.sh launch-test         G0 launch test (template v2.4 §5.1 rule 6; #768), a dry run: every active, non-parked
#                               role in the registry goes through start once without starting anything; parked roles
#                               are checked for an entry and a definition. Exit 1 when one fails
set -u
export PATH="${TEAM_TEST_BIN:+$TEAM_TEST_BIN:}$HOME/.local/bin:$HOME/.bun/bin:/usr/local/bin:/usr/bin:/bin"   # TEAM_TEST_BIN: a stub tmux in tools/ci/wake.test.mjs
S=pds1
ROOT=$HOME/pds1
REPO=$ROOT/work/pds                 # main checkout (coordinators)
CFG=${PDS1_CFG:-$REPO/agents.config.yaml}   # PDS1_CFG: another checkout (the launch test on a branch)
LOG=$ROOT/team.log

HERE=$(dirname "$(readlink -f "$0")")
# The roles come only from the role registry, agents.config.yaml roles: (#768; template v2.4 §5.1), one line each:
# id|title|instances|parked|boot|kind|memory GB. "boot: true" roles start at boot; the scheduler starts the rest as work
# needs them. A registry that can't be read stops the launcher: there is no second list here.
mapfile -t ROLES < <(node "$HERE/registry.mjs" roles "$CFG" 2>>"$LOG")
[ "${#ROLES[@]}" -gt 0 ] || { echo "team.sh: no roles in $CFG (see $LOG)"; exit 2; }
field() { local f=$2 r; for r in "${ROLES[@]}"; do [ "${r%%|*}" = "$1" ] && { cut -d'|' -f"$f" <<<"$r"; return; }; done; return 1; }
CORE=(); for r in "${ROLES[@]}"; do IFS='|' read -r id _ _ parked boot _ _ <<<"$r"; [ "$boot" = true ] && [ "$parked" != true ] && CORE+=("$id"); done

log() { echo "$(date -u +%FT%TZ) $*" >>"$LOG"; }
display() { field "$1" 2; }
# the session name: the Product Lead is "PDS1 - PM", like every project contact; every other role "PDS1 · <Role>",
# so the PM sorts first (owner)
session_title() { if [ "$1" = product-lead ]; then echo "PDS1 - PM"; else echo "PDS1 · $2"; fi; }
mem_limit() { field "$1" 7; }   # the role's memory_limit_gb, else memory.per_agent_limit_gb (registry.mjs; no default here)

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
  local role=$1 n=${2:-} model=${3:-} name win dir mem mflag=""
  name=$(display "$role") || { echo "unknown role: $role (not in the registry, $CFG)"; exit 2; }
  # D-0173: the model of the task this session takes next (agents.config.yaml models.allowed); empty = the role's own
  if [ -n "$model" ]; then
    grep -qx -- "$model" <(node "$HERE/registry.mjs" get models.allowed "$CFG" 2>>"$LOG" | tr -d "[]'\" " | tr ',' '\n') \
      || { echo "model $model is not in models.allowed ($CFG)"; return 2; }
    mflag="--model $model"
  fi
  [ "$(field "$role" 4)" = true ] && { echo "$name is parked (agents.config.yaml); not started"; return 3; }
  [ "$(field "$role" 3)" -gt 1 ] && n=${n:-1}
  [ -n "$n" ] && name="$name $n"
  name=$(session_title "$role" "$name"); win=$role${n:+-$n}
  [ -n "${LAUNCH_DRY:-}" ] && { echo "would start $name: window $win, worktree $(dry_worktree "$role" "$n"), MemoryMax=$(mem_limit "$role")G, claude --agent pds1-$role${mflag:+ $mflag}"; return; }
  tmux has-session -t $S 2>/dev/null || tmux new-session -d -s $S -n shell -c "$ROOT"
  tmux list-windows -t $S -F '#W' | grep -qx "$win" && { echo "$name already running"; return; }
  dir=$(worktree_for "$role" "$n"); mem=$(mem_limit "$role"); trust_dir "$dir"
  tmux new-window -d -t $S -n "$win" -c "$dir" \
    "systemd-run --user --scope -q -p MemoryMax=${mem}G -- env PDS1_ROLE=pds1-$role PDS1_WINDOW=$win claude --agent pds1-$role $mflag --name '$name' --remote-control '$name' --permission-mode bypassPermissions 'You are $name. Pull main, read CLAUDE.md, then work your open issues in plenix-ds/pds (gh issue list -R plenix-ds/pds --label agent:pds1-$role --state open), starting with pinned #178 Phase 0 if it names your role. Follow agents.config.yaml.'; echo; echo '$name stopped. Press Enter to close.'; read"
  mkdir -p "$ROOT/.models" && printf '%s\n' "$model" >"$ROOT/.models/$win"   # read by the scheduler (empty = role default)
  log "start $win ($name) in $dir${model:+ on $model}"; echo "started $name${model:+ on $model}"
}

dry_worktree() {  # the worktree start would use, without creating it
  case $1 in product-lead|delivery-lead) echo "$REPO"; return ;; esac; echo "$ROOT/work/$1${2:+-$2}"
}

# G0 launch test (#768): every role once through start_one with LAUNCH_DRY, plus its definition and memory limit
launch_test() {
  local r id title inst parked fail=0 out def
  for r in "${ROLES[@]}"; do
    IFS='|' read -r id title inst parked _ _ _ <<<"$r"
    def=$REPO/.claude/agents/pds1-$id.md; [ -f "$def" ] || def=$HERE/../../.claude/agents/pds1-$id.md
    if [ ! -f "$def" ]; then echo "FAIL $id: no definition .claude/agents/pds1-$id.md"; fail=1; continue; fi
    if [ "$parked" = true ]; then echo "ok   $id: parked (entry and definition only)"; continue; fi
    [[ "$(mem_limit "$id")" =~ ^[0-9]+(\.[0-9]+)?$ ]] || { echo "FAIL $id: no memory limit"; fail=1; continue; }
    if out=$(LAUNCH_DRY=1 start_one "$id" 2>&1) && [[ "$out" == "would start "* ]]; then echo "ok   $id: ${out#would start }"
    else echo "FAIL $id: ${out:-start_one returned an error}"; fail=1; fi
  done
  [ $fail = 0 ] && echo "LAUNCH_TEST_OK (${#ROLES[@]} roles)" || { echo "LAUNCH_TEST_FAIL"; return 1; }
}

trust_dir() {  # pre-accept Claude's folder-trust prompt so unattended sessions don't hang
  node -e 'const fs=require("fs"),f=process.env.HOME+"/.claude.json";let j={};try{j=JSON.parse(fs.readFileSync(f,"utf8"))}catch{}
    j.projects=j.projects||{};const p=j.projects[process.argv[1]]=j.projects[process.argv[1]]||{};
    if(!p.hasTrustDialogAccepted){p.hasTrustDialogAccepted=true;fs.writeFileSync(f,JSON.stringify(j,null,2))}' "$1"
}

# Wake idle sessions (#220): nothing else tells a session about new issues, comments or check results.
# A window is idle when its screen has no "esc to interrupt" (Claude is working), its input box is empty and it
# has not changed for NUDGE_IDLE_S seconds. A round is skipped only when the repo had no activity since the last round,
# has no open PR and no role has open, unblocked, non-later work (#895: the old rule slept 10 h with an S1 open). With no
# activity and no PR, only the sessions whose role has work are woken; an unanswered S1/S2 is named to its role.
NUDGE_TEXT='Scheduled check (#220): keep working. 1) Queue every green PR of yours with gh pr merge --auto; fix any red or conflicting one. 2) If you are not in the middle of a task, take your next open issue (gh issue list -R plenix-ds/pds --label agent:pds1-ROLE --state open): highest severity first, then oldest; skip only issues labelled later and issues blocked by a named open issue or owner decision. Work it end to end to a merged PR, then take the next one. Reply "idle" only when every open issue of yours is later or blocked, and name each blocker.'
NUDGE_IDLE_S=${NUDGE_IDLE_S:-120}
NUDGE_STAMP=$ROOT/.nudge-last
NUDGE_OVERDUE=$ROOT/.nudge-overdue-rounds   # rounds in a row with an unanswered S1/S2 (#895)
OVERDUE_MIN=30                               # deploy/agents/dispatch.mjs OVERDUE_MIN
# Start waiting roles and stop finished ones (#246, D-0040): deploy/agents/scheduler.mjs makes the plan from GitHub,
# tmux, agents.config.yaml and free memory; this carries it out. Each start is logged and posted on #178.
schedule() {
  local plan line verb a b m why roles=() here=$HERE t toks
  for r in "${ROLES[@]}"; do roles+=("${r%%|*}"); done
  plan=$(PDS1_CFG="$CFG" PDS1_ROOT="$ROOT" PDS1_SESSION="$S" node "$here/scheduler.mjs" "${roles[@]}" 2>>"$LOG") \
    || { log "schedule: scheduler.mjs failed"; echo "schedule: scheduler failed (see $LOG)"; return; }
  while IFS= read -r line; do
    [ -n "$line" ] || continue
    # "<verb> <a> [<b>] [model=<m>] | why" (D-0173 adds model=)
    toks=(); m=""; for t in ${line%% |*}; do case $t in model=*) m=${t#model=} ;; *) toks+=("$t") ;; esac; done
    verb=${toks[0]:-}; a=${toks[1]:-}; b=${toks[2]:-}; why=${line#*| }
    case $verb in
      start)
        if [ -n "${NUDGE_DRY:-}" ]; then echo "would start $a${b:+ $b}${m:+ on $m} ($why)"; continue; fi
        start_one "$a" "$b" "$m" && log "schedule: started $a${b:+ $b}${m:+ on $m}: $why"
        gh issue comment 178 -R plenix-ds/pds --body "Started **$(session_title "$a" "$(display "$a")${b:+ $b}")** (scheduler, #246): $why.

— PDS1-Release-Architect (team.sh scheduler)" >/dev/null 2>>"$LOG" || log "schedule: could not post on #178" ;;
      restart)
        # D-0173: an idle session whose next task needs another model; same window, slot and worktree, new model
        if [ -n "${NUDGE_DRY:-}" ]; then echo "would restart $a on $m ($why)"; continue; fi
        local rr=$a rn=""; [[ $a =~ ^(.+)-([0-9]+)$ ]] && field "${BASH_REMATCH[1]}" 2 >/dev/null && { rr=${BASH_REMATCH[1]}; rn=${BASH_REMATCH[2]}; }
        tmux kill-window -t "$S:$a" 2>/dev/null
        start_one "$rr" "$rn" "$m" && log "schedule: restarted $a on $m: $why" ;;
      stop)
        if [ -n "${NUDGE_DRY:-}" ]; then echo "would stop $a ($why)"; continue; fi
        tmux kill-window -t "$S:$a" 2>/dev/null && log "schedule: stopped $a: $why" ;;
      note) echo "$a $b${why:+ | $why}" ;;
    esac
  done <<<"$plan"
}

# wake <window> <text> [idle seconds]: type <text> into a PDS1 session only when it is idle: Claude is not working
# (no "esc to interrupt"), its input box is empty and its screen has not changed for the idle time (default
# NUDGE_IDLE_S). Returns 0 sent (or would send, NUDGE_DRY=1), 3 not idle, 4 no such window. Used by nudge and by
# deploy/agents/pickup.mjs (#220).
wake() {
  local win=$1 text=$2 idle=${3:-$NUDGE_IDLE_S} pane prompt act
  act=$(tmux display-message -p -t "$S:$win" '#{window_activity}' 2>/dev/null) || return 4
  [ "$(tmux display-message -p -t "$S:$win" '#W' 2>/dev/null)" = "$win" ] || return 4
  pane=$(tmux capture-pane -p -t "$S:$win" 2>/dev/null | tail -12)
  WAKE_WHY=working; grep -q 'esc to interrupt' <<<"$pane" && return 3
  WAKE_WHY="screen changed less than ${idle}s ago"; (( $(date +%s) - act < idle )) && return 3
  # the box draws "❯" plus a no-break space (UTF-8 c2 a0): drop it and whitespace; only emptiness matters here
  # the input box is the LAST "❯" line; an earlier one is history (the "❯ /remote-control ..." echo of a session that has
  # been idle since, which made every such pane look busy for 10 h: #1166)
  prompt=$(grep '^❯' <<<"$pane" | tail -1 | sed 's/^❯//' | tr -d ' \t\302\240')
  WAKE_WHY="text in the input box"; [ -n "$prompt" ] && return 3
  WAKE_WHY=
  if [ -n "${NUDGE_DRY:-}" ]; then echo "would wake $win: ${text:0:100}"; return 0; fi
  tmux send-keys -t "$S:$win" -l "$text"; sleep 1; tmux send-keys -t "$S:$win" Enter
}

# selfupdate: the timers run this script from the Delivery Lead's checkout of main, so a merged change to team.sh,
# registry.mjs or agents.config.yaml only took effect when someone pulled by hand (the stale heartbeat of 2026-11-06,
# #821: #772 merged at 22:06 and the nudge kept running the old script). Fast-forward it each round, but only when that
# checkout is on main and clean, so it never touches work in progress.
selfupdate() {
  [ -n "${NUDGE_DRY:-}" ] && return
  [ "$(git -C "$REPO" branch --show-current 2>/dev/null)" = main ] || return
  [ -z "$(git -C "$REPO" status --porcelain 2>/dev/null)" ] || return
  git -C "$REPO" fetch -q origin main 2>>"$LOG" && git -C "$REPO" merge -q --ff-only origin/main >>"$LOG" 2>&1 || log "selfupdate: could not fast-forward $REPO"
}

nudge() {
  local now last updated open win role sent=0 hb plan mode changed=1 text overdue rounds health wh wake_roles=" " sev_text=""
  selfupdate
  schedule
  now=$(date -u +%FT%TZ); last=$(cat "$NUDGE_STAMP" 2>/dev/null || echo 1970-01-01T00:00:00Z)
  hb=$(node "$HERE/registry.mjs" get dispatch.heartbeat_issue "$CFG" 2>>"$LOG")
  # the newest update that is not the heartbeat issue itself (its body is rewritten every run, #772)
  updated=$(gh api 'repos/plenix-ds/pds/issues?state=all&sort=updated&direction=desc&per_page=2' -q "[.[] | select(.number != ${hb:-0})][0].updated_at" 2>/dev/null || echo "$now")
  open=$(gh pr list -R plenix-ds/pds --state open --json number -q length 2>/dev/null || echo 1)
  [[ "$updated" < "$last" ]] && changed=0
  # #895: quiet only when no role has open, unblocked, non-later work as well (deploy/agents/dispatch.mjs); a failed
  # read wakes everyone, never nobody
  plan=$(PDS1_CFG="$CFG" node "$HERE/dispatch.mjs" --open-prs "$open" --changed "$changed" 2>>"$LOG") || { log "nudge: dispatch.mjs failed: waking the coordinators"; plan=$'round roles\ncoordinators'; }  # D-0155: no wake-all; a failed read still wakes the coordinators, never nobody
  mode=$(awk '$1=="round"{print $2}' <<<"$plan"); mode=${mode:-roles}
  overdue=$(awk '$1=="overdue"{print $2" "$3}' <<<"$plan"); overdue=${overdue:-0}
  rounds=$(cat "$NUDGE_OVERDUE" 2>/dev/null || echo 0)
  if [ "${overdue%% *}" != 0 ]; then rounds=$((rounds + 1)); else rounds=0; fi
  [ -n "${NUDGE_DRY:-}" ] || echo "$rounds" >"$NUDGE_OVERDUE"
  health="open S1/S2 with no response > ${OVERDUE_MIN} min: ${overdue} · rounds in a row: $rounds"
  # the webhook forwarder (pds1-webhook) is the fast path to a stopped role; the event feed alone is lossy and hours late.
  # A restart loop went unseen for 2 h (#1182), so its state is on the heartbeat and a dead one is logged every round.
  wh=$(systemctl --user is-active pds1-webhook 2>/dev/null); wh=${wh:-unknown}
  [ "$wh" = active ] || log "nudge: pds1-webhook is $wh: webhooks are not reaching pickup (#1182)"
  health="$health · webhook: $wh"
  if [ "$mode" = quiet ]; then log "nudge: quiet (no activity since $last, no open PR, no open work)"; echo "$now" >"$NUDGE_STAMP"; heartbeat "$hb" "quiet round, no session woken" "$health"; return; fi
  tmux has-session -t $S 2>/dev/null || { log "nudge: team not running"; heartbeat "$hb" "the team session is not running" "$health"; return; }
  while read -r _ role _; do wake_roles+="$role "; done < <(grep '^work ' <<<"$plan")
  # D-0155: no wake-all round. While the repo is busy the coordinators are woken too; nobody else without work.
  if grep -qx coordinators <<<"$plan"; then for c in $(node "$HERE/registry.mjs" get coordinators.roles "$CFG" 2>>"$LOG" | tr -d "[],'" ); do wake_roles+="${c#pds1-} "; done; fi
  while read -r win; do
    [ "$win" = shell ] && continue
    role=${win%-[0-9]*}
    [[ "$wake_roles" == *" $role "* ]] || continue
    # severity first (#895): an S1/S2 this role has not answered is named, every round, until it is
    sev_text=$(awk -v r="$role" '$1=="unanswered" && $2==r {printf "%s%s (S%s, %s min)", (n++?", ":""), $3, $4, $5}' <<<"$plan")
    text="${NUDGE_TEXT//ROLE/$role}"
    [ -n "$sev_text" ] && text="Severity first: no response from you yet on $sev_text. Comment on it now (signed) and work it before anything else. $text"
    wake "$win" "$text" && { sent=$((sent + 1)); [ -n "${NUDGE_DRY:-}" ] || log "nudge: $win${sev_text:+ ($sev_text)}"; continue; }
    # a session with work that was not woken says why; "working" is the normal case and stays quiet (#1166: a refusal
    # that was never logged hid a 10 h outage)
    [ "$WAKE_WHY" = working ] || [ -n "${NUDGE_DRY:-}" ] || log "nudge: $win not woken: ${WAKE_WHY:-no such window}"
  done < <(tmux list-windows -t $S -F '#W')
  [ -n "${NUDGE_DRY:-}" ] || echo "$now" >"$NUDGE_STAMP"; echo "nudged $sent ($mode)"
  heartbeat "$hb" "woke $sent idle session(s) ($mode)" "$health"
}

# heartbeat <issue> <what this run did>: rewrite the pinned "Dispatcher heartbeat" issue (template v2.4 §6.1, #772);
# the hourly watchdog workflow opens a P0 process issue when its "Last run:" is older than 2 x dispatch.heartbeat_min,
# or when its "Health:" line shows an unanswered S1/S2 for 2 rounds in a row (#895).
# An edit wakes nobody (pickup ignores edits) and is left out of the quiet check above.
heartbeat() {
  local n=$1 what=$2 health=${3:-} windows
  [[ "$n" =~ ^[0-9]+$ ]] || { log "heartbeat: no dispatch.heartbeat_issue in $CFG"; return; }
  windows=$(tmux list-windows -t $S -F '#W' 2>/dev/null | grep -vc '^shell$')
  if [ -n "${NUDGE_DRY:-}" ]; then echo "would update heartbeat #$n: $what"; return; fi
  gh issue edit "$n" -R plenix-ds/pds --body "This issue is the dispatcher's heartbeat (template v2.4 §6.1, #772). **No action needed:** the poller (\`team.sh nudge\` on the agent host, every \`dispatch.heartbeat_min\`) rewrites this body on each run. The hourly watchdog workflow opens a P0 process issue when the time below is older than 2 × \`dispatch.heartbeat_min\`, or when Health shows an unanswered S1/S2 for 2 rounds in a row (#895).

Last run: $(date -u +%Y-%m-%dT%H:%M:%SZ)
Host: $(hostname) · sessions running: ${windows:-0} · this run: $what
Free memory: $(free -g | awk 'NR==2{print $7}') GB
Health: ${health:-not measured this run}" >/dev/null 2>>"$LOG" || log "heartbeat: could not update #$n"
}

stop_one() { local win=$1${2:+-$2}; tmux kill-window -t "$S:$win" 2>/dev/null && { log "stop $win"; echo "stopped $win"; }; }

case "${1:-status}" in
  start-core)
    mkdir -p "$ROOT/work"
    [ -d "$REPO/.git" ] || git clone -q https://github.com/plenix-ds/pds.git "$REPO"
    git -C "$REPO" pull -q --ff-only
    for r in "${CORE[@]}"; do start_one "$r"; done ;;
  start) start_one "${2:?role}" "${3:-}" "${4:-}" ;;
  launch-test) launch_test; exit $? ;;
  stop) stop_one "${2:?role}" "${3:-}" ;;
  stop-all) tmux kill-session -t $S 2>/dev/null && { log "stop-all"; echo "team stopped"; } ;;
  update) git -C "$REPO" pull -q --ff-only; for d in "$ROOT"/work/*/; do git -C "$d" fetch -q origin; done; echo updated ;;
  nudge) nudge ;;
  schedule) schedule ;;
  wake) wake "${2:?window}" "${3:?text}" "${4:-}"; exit $? ;;
  status) tmux list-windows -t $S -F '#W' 2>/dev/null | grep -v '^shell$' || echo "pds1 team is not running"; free -g | awk 'NR==2{print "free memory: "$7" GB available"}' ;;
  *) sed -n 2,17p "$0"; exit 2 ;;
esac
