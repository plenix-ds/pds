/* Plenix vote kit · counting (vote-kit/src/count.js)
   Summary: The one function that counts a vote, from the members, their ballots and the settings. It has no dates, no database
     and nothing random: the service runs it as the truth, and a browser may run it with the settings it was sent.
   Usage:
     const outcome = count({ status: 'open' }, members, ballots, resolveSettings(app, event));
     const shown = viewFor(outcome, ballots, settings, { status, memberId, canManage });   // what one caller may see
   Props:
     count(event, members, ballots, settings): event { status: 'open' | 'closed' }; members [{ memberId, disabledReason, weight, present }];
       ballots [{ memberId, option: 'approve' | 'deny' | 'abstain' }] (the current choices); settings from resolveSettings
       returns { approve, deny, abstain, notVoted, turnedOff, present, weights: { approve, deny, abstain }, quorum: { needed, present, met },
       majority, result }
       result while open: "open" | "passing" | "failing" | "tied" | "no-quorum"; closed: "passed" | "failed" | "tied" | "no-quorum"
     viewFor(outcome, ballots, settings, caller): { outcome, ballots, votesHidden } cut down to what the caller may see (liveVisibility);
       votesHidden is true when other members' choices are held back from this caller (the screen says "Hidden until the vote closes" instead of showing empty buttons)
   Behavior:
     Turned-off members (disabledReason) are counted nowhere. present is every member who is not turned off, or, with
       settings.present "list", those marked present; a ballot from anyone else is ignored.
     weights "on" counts each member's weight (default 1); the counts (approve, deny, abstain, notVoted) are always numbers of members.
     decided = approve + deny (+ abstentions as "no" when abstainInMajority). simple: approve > no; absolute: approve > half of the
       present weight; two-thirds: approve >= two thirds of decided.
     A tie is only possible with the simple majority; settings.tie "fails" makes it failing/failed, "chair-decides" leaves it tied.
     quorum "off" is always met; { count } needs that many present; { share } that share of the members who may vote. */

const OPTIONS = ['approve', 'deny', 'abstain'];

export function count(event, members, ballots, settings) {
  const closed = !!(event && event.status === 'closed');
  const all = members || [];
  const eligible = all.filter((m) => !m.disabledReason);
  const present = settings.present === 'list' ? eligible.filter((m) => m.present === true) : eligible;
  const weightOf = (m) => (settings.weights === 'on' && Number.isFinite(Number(m.weight)) ? Number(m.weight) : 1);
  const ballotOf = {};
  (ballots || []).forEach((b) => { if (OPTIONS.indexOf(b.option) >= 0) ballotOf[b.memberId] = b.option; });

  const n = { approve: 0, deny: 0, abstain: 0, notVoted: 0 }, w = { approve: 0, deny: 0, abstain: 0 };
  let presentWeight = 0;
  present.forEach((m) => {
    const o = ballotOf[m.memberId], wt = weightOf(m);
    presentWeight += wt;
    if (o) { n[o] += 1; w[o] += wt; } else n.notVoted += 1;
  });
  const cast = n.approve + n.deny + n.abstain;

  const q = settings.quorum;
  const needed = q === 'off' || !q ? null : q.count !== undefined ? q.count : Math.ceil(q.share * eligible.length);
  const quorum = { needed, present: present.length, met: needed === null || present.length >= needed };

  const no = w.deny + (settings.abstainInMajority ? w.abstain : 0);
  const decided = w.approve + no;
  const meets = settings.majority === 'absolute' ? w.approve > presentWeight / 2
    : settings.majority === 'two-thirds' ? decided > 0 && w.approve * 3 >= decided * 2
    : w.approve > no;
  const tie = settings.majority === 'simple' && cast > 0 && w.approve === no;

  let result;
  if (!closed && cast === 0) result = 'open';
  else if (!quorum.met) result = 'no-quorum';
  else if (tie) result = settings.tie === 'chair-decides' ? 'tied' : (closed ? 'failed' : 'failing');
  else result = meets ? (closed ? 'passed' : 'passing') : (closed ? 'failed' : 'failing');

  return { approve: n.approve, deny: n.deny, abstain: n.abstain, notVoted: n.notVoted, turnedOff: all.length - eligible.length,
    present: present.length, weights: w, quorum, majority: settings.majority, result };
}

// what one caller may see (settings.liveVisibility): named shows everything; totals hides who voted what; hidden-until-closed
// also holds the totals back until the vote closes. A manager sees everything.
export function viewFor(outcome, ballots, settings, caller) {
  const c = caller || {};
  const closed = c.status === 'closed';
  if (c.canManage || closed || settings.liveVisibility === 'named') return { outcome, ballots, votesHidden: false };
  const own = (ballots || []).filter((b) => b.memberId === c.memberId);
  if (settings.liveVisibility === 'totals') return { outcome, ballots: own, votesHidden: true };
  return { outcome: { notVoted: outcome.notVoted, turnedOff: outcome.turnedOff, present: outcome.present, quorum: outcome.quorum, result: 'open' }, ballots: own, votesHidden: true };
}
