// Held events and unanswered asks per role (#1130). Pure functions, tested by tools/ci/asks.test.mjs. pickup.mjs keeps
// them in <PDS1_ROOT>/.asks.json; scheduler.mjs reads that file.
// - An event for a role with no window is held for it (not dropped) and pickup asks the scheduler to start the role.
//   When its window is up, pickup hands it the held lines once.
// - A mention stays an open ask until the role posts a signed comment ("— PDS1-<Role>") on that item, or MAX_AGE_S
//   passes. A role with an open ask is waiting: the scheduler starts it and idle exit never stops it.
// Shape: { <role>: [{ number, line, mention, delivered, at }] }, times in seconds.
import fs from 'node:fs';

export const MAX_AGE_S = 24 * 3600;

export function hold(asks, role, { number, line, mention = false, delivered = false }, now) {
  const list = (asks[role] ||= []);
  const same = list.find((a) => a.number === number && a.line === line);
  if (same) { same.delivered = same.delivered && delivered; same.mention = same.mention || mention; return asks; }
  list.push({ number, line, mention, delivered, at: now });
  return asks;
}

// the lines held for a role that it has not been given yet; marks them given. A given non-mention is done.
export function take(asks, role) {
  const list = asks[role] || [];
  const lines = list.filter((a) => !a.delivered).map((a) => a.line);
  for (const a of list) a.delivered = true;
  asks[role] = list.filter((a) => a.mention);
  if (!asks[role].length) delete asks[role];
  return lines;
}

export function answer(asks, role, number) {
  if (!asks[role]) return asks;
  asks[role] = asks[role].filter((a) => a.number !== number);
  if (!asks[role].length) delete asks[role];
  return asks;
}

export function prune(asks, now, maxAge = MAX_AGE_S) {
  for (const role of Object.keys(asks)) {
    asks[role] = asks[role].filter((a) => now - a.at <= maxAge);
    if (!asks[role].length) delete asks[role];
  }
  return asks;
}

// roles with an open ask or an undelivered held event, younger than maxAge
export function owed(asks, now, maxAge = MAX_AGE_S) {
  return new Set(Object.keys(asks).filter((r) => (asks[r] || []).some((a) => now - a.at <= maxAge && (a.mention || !a.delivered))));
}

// per role: { count, oldest (ISO), numbers } for the scheduler's start reason
export function summary(asks, now, maxAge = MAX_AGE_S) {
  const out = new Map();
  for (const role of owed(asks, now, maxAge)) {
    const list = asks[role].filter((a) => now - a.at <= maxAge && (a.mention || !a.delivered));
    out.set(role, { count: list.length, oldest: new Date(Math.min(...list.map((a) => a.at)) * 1000).toISOString(),
      numbers: [...new Set(list.map((a) => a.number))] });
  }
  return out;
}

export const read = (file) => { try { return JSON.parse(fs.readFileSync(file, 'utf8')) || {}; } catch { return {}; } };
export const write = (file, asks) => fs.writeFileSync(file, JSON.stringify(asks));
