// Capacity rules for the scheduler (#769; template v2.4 §5.2, §6.2). Pure functions, tested by tools/ci/capacity.test.mjs.
// - A session's activity comes from the record the activity hook writes (.claude/hooks/activity.cjs): working or idle,
//   with the time of the last change. A working record older than STALE_S counts as idle (a crashed session).
// - Of long_work.max_running, long_work.reserved_gate_slots are kept for roles with gate: true (verify, locale, docs,
//   release); other roles never take them.
// - Starts go in priority order (release > integrate > verify > build > design > spec > evergreen), then by severity
//   and the oldest waiting issue. Memory still limits every start.
export const PRIORITY = ['release', 'integrate', 'verify', 'build', 'design', 'spec', 'evergreen'];
const STALE_S = 3 * 3600;

// seconds idle from an activity record ({ state, t } in seconds), 0 when working, null when there is no record
export function idleFor(record, now) {
  if (!record || typeof record.t !== 'number') return null;
  if (record.state === 'working') return now - record.t > STALE_S ? now - record.t : 0;
  return Math.max(0, now - record.t);
}

// candidates: [{ role, n, priority, gate, sev, oldest, ... }]; budget: { slots, reservedLeft, mem, perAgentGb, minFreeGb }
// -> the candidates in start order, each with verdict start | no-slot | reserved | memory
export function admit(candidates, budget) {
  const rank = (p) => (PRIORITY.includes(p) ? PRIORITY.indexOf(p) : PRIORITY.length);
  const sorted = [...candidates].sort((a, b) => rank(a.priority) - rank(b.priority) || a.sev - b.sev || String(a.oldest).localeCompare(String(b.oldest)));
  let { slots, reservedLeft, mem } = budget;
  return sorted.map((c) => {
    let verdict = 'start';
    if (slots <= 0) verdict = 'no-slot';
    else if (!c.gate && slots - reservedLeft <= 0) verdict = 'reserved';
    else if (mem - budget.perAgentGb < budget.minFreeGb) verdict = 'memory';
    if (verdict === 'start') {
      slots--; mem -= budget.perAgentGb;
      if (c.gate && reservedLeft > 0) reservedLeft--;
    }
    return { ...c, verdict, slotsLeft: slots, reservedLeft, mem };
  });
}
