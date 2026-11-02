/* Plenix · VoteTally
   Summary: A live vote: the members as a list, each with an avatar, the name and role, and three icon-only choices
     (Approve, Deny, Abstain); a turned-off member's lock badge in place of the choices; the totals, the quorum and the
     result under the list (owner, vote-live-36, vote-screen-36/37; the vote kit's shapes, packages/vote-kit).
   Usage:
     <VoteTally label="Motion 14: approve the 2027 budget" members={event.members} outcome={event.outcome}
       settings={event.settings} status={event.status} onVote={(memberId, option) => put(memberId, option)} />
   Props:
     label: the vote's name (the list's accessible name) (required)
     members: [{ memberId, name, role, picture, disabledReason, vote: "approve" | "deny" | "abstain" | null, voteHidden }]
       (the kit's member shape; disabledReason "Recused", "Absent" … turns the member off; voteHidden: the service holds
       this member's choice back from the viewer)
     outcome: { approve, deny, abstain, notVoted, turnedOff, present, quorum: { needed, present, met }, result } from the
       kit's counting; without it the part counts the three choices itself and shows no quorum or result
     settings: the vote's settings: labels { approve, deny, abstain, turnedOff } (the choices' words), liveVisibility
       ("totals" | "hidden-until-closed": the words shown for a held-back vote), changeVote ("final": a cast vote cannot be
       cleared)
     status: "open" (default) | "closed": closed, every choice is read-only
     readOnly: the choices only show the votes (default false)
     connection: "live" (default) | "reconnecting": while reconnecting a badge says so and the choices are read-only, so
       no vote is sent blind; the last totals stay
     onVote(memberId, option): a choice pressed; option null when the chosen one is pressed again (unless changeVote is
       "final")
     strings: the words, for other languages (default: the locale's voteTally words, through LocaleProvider; the settings'
       labels win for the three choices)
     className: more classes on the section
   Behavior:
     Each member's choices are a group named "Vote of <name>": three toggle buttons (aria-pressed), each with its name and
       tooltip. The chosen one fills green, red or gray (Button tone); the others are plain buttons. While the choices are
       read-only (closed, readOnly, reconnecting) the chosen one keeps its color and the others are disabled.
     The totals show only the counts they are given: a vote that holds the choices back sends none for the three.
     A turned-off member shows a Badge with a lock and the reason, and is counted nowhere.
     A held-back vote (voteHidden) shows "Hidden until the vote closes" or "Totals only" in place of the choices.
     The totals row is a polite live region: a new result is announced.
     A row whose vote changes (a live update or a press) flashes once: its tint fades back. Not on the first render; under
       reduced motion there is no flash.
     Narrow (under the stack width): the name and role above the choices.
   Notes:
     The part draws; it does not count the quorum or the result (the kit's rules do, the same function in the service).
     Every value is a --plx-comp-vote-tally-* token; the colors are Button's tone and Badge's.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Avatar } from '../Avatar/Avatar.tsx';
import { Badge } from '../Badge/Badge.tsx';
import { Button } from '../Button/Button.tsx';
import { Text } from '../Text/Text.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import LockIcon from 'plenix-platform/icons/plenix/lock';
import RemoveIcon from 'plenix-platform/icons/plenix/remove';
import ScheduleIcon from 'plenix-platform/icons/plenix/schedule';
import VisibilityOffIcon from 'plenix-platform/icons/plenix/visibility-off';
import { fill } from '../../utils/fill.ts';

const OPTIONS = [['approve', 'check', 'success'], ['deny', 'close', 'danger'], ['abstain', 'remove', 'neutral']];
const RESULT_TONE = { open: 'neutral', passing: 'active', failing: 'action-required', passed: 'success', failed: 'negative', tied: 'waiting', 'no-quorum': 'waiting' };
// the three counts when the app gives no outcome: only the members who are not turned off
function countOf(members) {
  const c = { approve: 0, deny: 0, abstain: 0, notVoted: 0, turnedOff: 0 };
  members.forEach((m) => { if (m.disabledReason) c.turnedOff += 1; else if (m.vote && c[m.vote] !== undefined) c[m.vote] += 1; else if (!m.voteHidden) c.notVoted += 1; });
  return c;
}

export function VoteTally({ label, members = [], outcome, settings = {}, status = 'open', readOnly = false, connection = 'live', onVote, strings, className }) {
  // the words: the locale's voteTally section (platform/i18n), then the strings prop, then the vote's own labels for the choices
  const base = useStrings('voteTally', strings);
  const t = Object.assign({}, base, settings.labels || {});
  const words = base.result || {};
  const o = outcome || countOf(members);
  const locked = readOnly || status === 'closed' || connection === 'reconnecting' || typeof onVote !== 'function';
  const hiddenText = settings.liveVisibility === 'totals' ? t.totalsOnly : t.hiddenUntilClosed;
  const choose = (m, option) => { if (!locked) onVote(m.memberId, m.vote === option && settings.changeVote !== 'final' ? null : option); };
  // a row whose vote changed since the last render flashes once (not on the first render); the class goes when it ends
  const before = React.useRef(null), [changed, setChanged] = React.useState(() => new Set());
  React.useEffect(() => {
    const now = new Map(members.map((m) => [m.memberId, (m.vote || '') + '|' + (m.disabledReason || '') + '|' + (m.voteHidden ? 1 : 0)]));
    if (before.current) {
      const ids = [...now].filter(([id, v]) => before.current.has(id) && before.current.get(id) !== v).map(([id]) => id);
      // under reduced motion there is no flash, so no row is marked (a 0s animation may not report its end)
      const still = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (ids.length && !still) setChanged((s) => new Set([...s, ...ids]));
    }
    before.current = now;
  }, [members]);
  const settled = (id) => setChanged((s) => { if (!s.has(id)) return s; const n = new Set(s); n.delete(id); return n; });
  return (
    <section className={cx('plx-vote-tally', className)} aria-label={label}>
      <ul className="plx-vote-tally__list">
        {members.map((m) => (
          <li key={m.memberId} className={cx('plx-vote-tally__member', changed.has(m.memberId) && 'is-changed')}
            onAnimationEnd={changed.has(m.memberId) ? () => settled(m.memberId) : undefined}>
            <Avatar name={m.name} src={m.picture || undefined} />
            <span className="plx-vote-tally__who"><Text variant="strong">{m.name}</Text>{m.role ? <Text variant="secondary">{m.role}</Text> : null}</span>
            {m.disabledReason ? <Badge tone="neutral" icon={LockIcon}>{m.disabledReason + ' (' + t.turnedOff + ')'}</Badge>
              : m.voteHidden ? <Badge tone="neutral" icon={VisibilityOffIcon}>{hiddenText}</Badge>
              : (
                <span className="plx-vote-tally__choices" role="group" aria-label={fill(t.voteOf, { name: m.name })}>
                  {OPTIONS.map(([option, icon, tone]) => (
                    <Button key={option} iconOnly icon={icon} label={t[option]} tone={tone} pressed={m.vote === option}
                      disabled={locked && m.vote !== option} onClick={() => choose(m, option)} />
                  ))}
                </span>
              )}
          </li>
        ))}
      </ul>
      <div className="plx-vote-tally__totals" aria-live="polite">
        {/* only the counts it is given: a vote that holds the choices back sends no approve, deny or abstain */}
        {o.approve !== undefined ? <Badge tone="success" icon={CheckIcon}>{t.approve + ' ' + o.approve}</Badge> : null}
        {o.deny !== undefined ? <Badge tone="negative" icon={CloseIcon}>{t.deny + ' ' + o.deny}</Badge> : null}
        {o.abstain !== undefined ? <Badge tone="neutral" icon={RemoveIcon}>{t.abstain + ' ' + o.abstain}</Badge> : null}
        {o.notVoted !== undefined ? <Badge tone="waiting" icon={ScheduleIcon}>{t.notVoted + ' ' + o.notVoted}</Badge> : null}
        {o.turnedOff ? <Badge tone="neutral" icon={LockIcon}>{t.turnedOff.charAt(0).toUpperCase() + t.turnedOff.slice(1) + ' ' + o.turnedOff}</Badge> : null}
        {o.result ? <Badge tone={RESULT_TONE[o.result] || 'neutral'} icon={o.result === 'passed' || o.result === 'passing' ? CheckIcon : ScheduleIcon}>{words[o.result] || o.result}</Badge> : null}
        {connection === 'reconnecting' ? <Badge tone="waiting" icon={ScheduleIcon}>{t.reconnecting}</Badge> : null}
        {o.quorum && o.quorum.needed ? <Text variant="secondary" className="plx-vote-tally__quorum">{fill(t.quorum, { present: o.quorum.present, needed: o.quorum.needed, state: o.quorum.met ? t.met : t.notMet })}</Text> : null}
      </div>
    </section>
  );
}
