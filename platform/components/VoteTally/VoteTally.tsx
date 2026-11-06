/* Plenix · VoteTally
   Summary: A live vote: the members as a list, each with an avatar, the name and role, and three icon-only choices
     (Approve, Deny, Abstain); a turned-off member's lock badge in place of the choices; the totals, the quorum and the
     result under the list (owner, vote-live-36, vote-screen-36/37; the vote kit's shapes, packages/vote-kit).
   Usage:
     <VoteTally label="Motion 14: approve the 2027 budget" members={event.members} outcome={event.outcome}
       settings={event.settings} status={event.status} onVote={(memberId, option) => put(memberId, option)} />
   Props:
     label: the vote's name (the list's accessible name) (required)
     options: [VoteTallyOption] (2 to 5; ADR 0009, issue 265): the choices instead of Approve, Deny and Abstain, for another
       per-member choice such as attendance (Present / Absent). VoteTallyOption = { key, label, icon, tone }: key is unique and
       is the value of members[].vote; label the button's name and the totals word (from the catalog or the app, as it is
       shown); icon an imported icon module or a Plenix icon name; tone "success" | "danger" | "neutral" (a Button tone).
       Not 2 to 5, a repeated or empty key or a missing label, icon or tone: a development warning and the default set. The
       totals then show one count per option and "Not recorded" (the part counts them itself; outcome.counts may give them)
     members: [{ memberId, name, role, picture, disabledReason, vote: "approve" | "deny" | "abstain" | a key of options | null, voteHidden }]
       (the kit's member shape; disabledReason "Recused", "Absent" … turns the member off; voteHidden: the service holds
       this member's choice back from the viewer)
     outcome: { approve, deny, abstain, notVoted, turnedOff, present, counts, quorum: { needed, present, met }, result } from the
       kit's counting (counts: { [option key]: n } for a custom options set); without it the part counts the three choices itself and shows no quorum or result
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
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import type { IconValue } from '../Icon/Icon.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import LockIcon from 'plenix-platform/icons/plenix/lock';
import RemoveIcon from 'plenix-platform/icons/plenix/remove';
import ScheduleIcon from 'plenix-platform/icons/plenix/schedule';
import VisibilityOffIcon from 'plenix-platform/icons/plenix/visibility-off';
import { fill } from '../../utils/fill.ts';
import { development } from '../../utils/devWarn.ts';

type VoteTone = 'success' | 'danger' | 'neutral';
/** @public one choice of a custom set: { key, label, icon, tone } (ADR 0009) */
export type VoteTallyOption = { key: string; label: string; icon: IconValue; tone: VoteTone };
/** @public a member: { memberId, name, role, picture, disabledReason, vote, voteHidden } */
export type VoteTallyMember = { memberId: string | number; name: string; role?: string; picture?: string | null; disabledReason?: string; vote?: string | null; voteHidden?: boolean };
/** @public the counting the app gives (the vote kit's): counts, quorum and result */
export type VoteTallyOutcome = { approve?: number; deny?: number; abstain?: number; notVoted?: number; turnedOff?: number; present?: number; counts?: Record<string, number>; quorum?: { needed?: number; present?: number; met?: boolean }; result?: string };
type Choice = [string, IconValue, VoteTone, string];
type Words = Record<string, string> & { result?: Record<string, string> };
const OPTIONS: Array<[string, string, VoteTone]> = [['approve', 'check', 'success'], ['deny', 'close', 'danger'], ['abstain', 'remove', 'neutral']];
const BADGE_TONE: Record<VoteTone, 'success' | 'negative' | 'neutral'> = { success: 'success', danger: 'negative', neutral: 'neutral' };   // a Button tone's Badge tone (as the default set)
// the options prop (ADR 0009): the problem with it, or '' when it is usable
function optionsProblem(options: unknown): string {
  if (!Array.isArray(options) || options.length < 2 || options.length > 5) return 'options must have 2 to 5 entries (got ' + (Array.isArray(options) ? options.length : typeof options) + ')';
  const keys = new Set<string>();
  for (const o of options as VoteTallyOption[]) {
    if (!o || typeof o.key !== 'string' || !o.key || keys.has(o.key)) return 'every option needs a unique, non-empty key';
    keys.add(o.key);
    if (!o.label || !o.icon || !BADGE_TONE[o.tone]) return 'option "' + o.key + '" needs a label, an icon and a tone (success, danger or neutral)';
  }
  return '';
}
const warned = new Set<string>();
const RESULT_TONE: Record<string, 'neutral' | 'active' | 'action-required' | 'success' | 'negative' | 'waiting'> = { open: 'neutral', passing: 'active', failing: 'action-required', passed: 'success', failed: 'negative', tied: 'waiting', 'no-quorum': 'waiting' };
// the three counts when the app gives no outcome: only the members who are not turned off
function countOf(members: VoteTallyMember[]): Record<string, number> {
  const c: Record<string, number> = { approve: 0, deny: 0, abstain: 0, notVoted: 0, turnedOff: 0 };
  members.forEach((m) => { if (m.disabledReason) c.turnedOff += 1; else if (m.vote && c[m.vote] !== undefined) c[m.vote] += 1; else if (!m.voteHidden) c.notVoted += 1; });
  return c;
}

function countOptions(members: VoteTallyMember[], choices: Choice[]) {
  const counts: Record<string, number> = {}; choices.forEach(([key]) => { counts[key] = 0; });
  let notRecorded = 0, turnedOff = 0;
  members.forEach((m) => {
    if (m.disabledReason) turnedOff += 1;
    else if (m.vote && counts[m.vote] !== undefined) counts[m.vote] += 1;
    else if (!m.voteHidden) {
      notRecorded += 1;
      // a vote that is not a key of options counts as not recorded, and development says so once per member and key (ADR 0009)
      const note = m.memberId + '|' + m.vote;
      if (m.vote && development() && !warned.has(note) && typeof console !== 'undefined') { warned.add(note); console.warn('[Plenix] VoteTally: member ' + m.memberId + ' has vote "' + m.vote + '", which is not a key of options; it counts as not recorded'); }
    }
  });
  return { counts, notRecorded, turnedOff };
}

/** @public the prop type (ADR 0011) */
export type VoteTallyProps = {
  /** the vote's name (the list's accessible name) */
  label: string;
  members?: VoteTallyMember[];
  /** 2 to 5 choices instead of Approve, Deny and Abstain */
  options?: VoteTallyOption[];
  outcome?: VoteTallyOutcome;
  /** labels (the choices' words), liveVisibility ("totals" | "hidden-until-closed"), changeVote ("final") */
  settings?: { labels?: Record<string, string>; liveVisibility?: 'totals' | 'hidden-until-closed'; changeVote?: 'final' | string };
  /** "open" (default) | "closed" */
  status?: 'open' | 'closed';
  readOnly?: boolean;
  /** "live" (default) | "reconnecting" */
  connection?: 'live' | 'reconnecting';
  /** a choice pressed; option is null when the chosen one is pressed again */
  onVote?: (memberId: string | number, option: string | null) => void;
  strings?: Catalog | null;
  className?: string;
};

export function VoteTally({ label, members = [], options, outcome, settings = {}, status = 'open', readOnly = false, connection = 'live', onVote, strings, className }: VoteTallyProps) {
  // the words: the locale's voteTally section (platform/i18n), then the strings prop, then the vote's own labels for the choices
  const base = useStrings('voteTally', strings) as unknown as Words;
  const t = Object.assign({}, base, settings.labels || {}) as Words;
  const words = base.result || {};
  // a custom choice set (ADR 0009), or the default three when it is missing or unusable (development says why, once)
  const problem = options === undefined ? '' : optionsProblem(options);
  if (problem && development() && !warned.has(problem) && typeof console !== 'undefined') { warned.add(problem); console.warn('[Plenix] VoteTally: ' + problem + '; the default Approve, Deny and Abstain are used'); }
  const custom = options !== undefined && !problem;
  const choices: Choice[] = custom ? (options as VoteTallyOption[]).map((x): Choice => [x.key, x.icon, x.tone, x.label]) : OPTIONS.map(([k, i, tn]): Choice => [k, i, tn, t[k]]);
  const own = custom ? countOptions(members, choices) : null;
  const o: VoteTallyOutcome = custom ? Object.assign({ notVoted: (own as NonNullable<typeof own>).notRecorded, turnedOff: (own as NonNullable<typeof own>).turnedOff }, outcome, { counts: (outcome && outcome.counts) || (own as NonNullable<typeof own>).counts }) : outcome || countOf(members);
  const locked = readOnly || status === 'closed' || connection === 'reconnecting' || typeof onVote !== 'function';
  const hiddenText = settings.liveVisibility === 'totals' ? t.totalsOnly : t.hiddenUntilClosed;
  const choose = (m: VoteTallyMember, option: string) => { if (!locked) (onVote as NonNullable<typeof onVote>)(m.memberId, m.vote === option && settings.changeVote !== 'final' ? null : option); };
  // a row whose vote changed since the last render flashes once (not on the first render); the class goes when it ends
  const before = React.useRef<Map<string | number, string> | null>(null), [changed, setChanged] = React.useState<Set<string | number>>(() => new Set());
  React.useEffect(() => {
    const now = new Map<string | number, string>(members.map((m): [string | number, string] => [m.memberId, (m.vote || '') + '|' + (m.disabledReason || '') + '|' + (m.voteHidden ? 1 : 0)]));
    const was = before.current;
    if (was) {
      const ids = [...now].filter(([id, v]) => was.has(id) && was.get(id) !== v).map(([id]) => id);
      // under reduced motion there is no flash, so no row is marked (a 0s animation may not report its end)
      const still = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (ids.length && !still) setChanged((s) => new Set([...s, ...ids]));
    }
    before.current = now;
  }, [members]);
  const settled = (id: string | number) => setChanged((s) => { if (!s.has(id)) return s; const n = new Set(s); n.delete(id); return n; });
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
                  {choices.map(([option, icon, tone, name]) => (
                    <Button key={option} iconOnly icon={icon} label={name} tone={tone} pressed={m.vote === option}
                      disabled={locked && m.vote !== option} onClick={() => choose(m, option)} />
                  ))}
                </span>
              )}
          </li>
        ))}
      </ul>
      <div className="plx-vote-tally__totals" aria-live="polite">
        {/* only the counts it is given: a vote that holds the choices back sends no approve, deny or abstain */}
        {custom ? choices.map(([key, icon, tone, name]) => ((o.counts as Record<string, number>)[key] !== undefined ? <Badge key={key} tone={BADGE_TONE[tone]} icon={icon}>{name + ' ' + (o.counts as Record<string, number>)[key]}</Badge> : null)) : null}
        {!custom && o.approve !== undefined ? <Badge tone="success" icon={CheckIcon}>{t.approve + ' ' + o.approve}</Badge> : null}
        {!custom && o.deny !== undefined ? <Badge tone="negative" icon={CloseIcon}>{t.deny + ' ' + o.deny}</Badge> : null}
        {!custom && o.abstain !== undefined ? <Badge tone="neutral" icon={RemoveIcon}>{t.abstain + ' ' + o.abstain}</Badge> : null}
        {o.notVoted !== undefined ? <Badge tone="waiting" icon={ScheduleIcon}>{(custom ? t.notRecorded : t.notVoted) + ' ' + o.notVoted}</Badge> : null}
        {o.turnedOff ? <Badge tone="neutral" icon={LockIcon}>{t.turnedOff.charAt(0).toUpperCase() + t.turnedOff.slice(1) + ' ' + o.turnedOff}</Badge> : null}
        {o.result ? <Badge tone={RESULT_TONE[o.result] || 'neutral'} icon={o.result === 'passed' || o.result === 'passing' ? CheckIcon : ScheduleIcon}>{words[o.result] || o.result}</Badge> : null}
        {connection === 'reconnecting' ? <Badge tone="waiting" icon={ScheduleIcon}>{t.reconnecting}</Badge> : null}
        {o.quorum && o.quorum.needed ? <Text variant="secondary" className="plx-vote-tally__quorum">{fill(t.quorum, { present: o.quorum.present, needed: o.quorum.needed, state: o.quorum.met ? t.met : t.notMet })}</Text> : null}
      </div>
    </section>
  );
}
