/* Plenix · AvatarGroup
   Summary: The people of one item (owners, collaborators, assignees) as a row of avatars: overlapped in a stack or spaced
     in a grid, up to a maximum, then a +N tile for the rest (03 Content & Identity › Identity › Avatar group).
   Usage:
     <AvatarGroup label="Collaborators" people={[{ name: 'Maya Chen' }, { name: 'Alex Kim', presence: 'away' }]} />
     <AvatarGroup label="Assignees" people={team} max={3} size="md" onMore={() => setOpen(true)} />
     <AvatarGroup label="Members" people={team} layout="grid" max={12} />
   Props:
     people: [{ id, name, src, color, presence }]: each person as an Avatar (name gives the initials and the accessible
       name; src a picture; color a data color; presence "online" | "away" | "busy" | "dnd" | "offline")
     label: the group's accessible name, by role ("Collaborators", "Assignees")
     max: how many avatars show before the rest collapse into +N (default 4)
     size: "xs" (24px) | "sm" (28px, default) | "md" (32px) | "lg" (40px): every avatar of a group has the same size
     layout: "stack" (default: overlapped, each ringed in the surface color) | "grid" (spaced, wrapping to more rows)
     onMore: called when the +N tile is pressed (open the full list); without it the tile is a count, not a control
     strings: the words, for other languages: { more: "+{n}", moreLabel: "{n} more", online, away, busy, offline }
     className: more classes on the group
   Behavior:
     The group is one named group (role="group"); each avatar is an image named by the person (and their presence).
     With onMore the +N tile is a button: Enter or Space opens the full list; its focus changes the tile's ring to the
       focus color.
     People keep the order they are given (put the owner first).
   Notes:
     The count is a number: Reddit Mono (the data font), like other technical values.
     Other props pass through to the wrapper.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Avatar } from '../Avatar/Avatar.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { fill } from '../../utils/fill.ts';

const SIZES = ['xs', 'sm', 'md', 'lg'];

export function AvatarGroup({ people = [], label, max = 4, size = 'sm', layout = 'stack', onMore, strings, className, ...rest }) {
  devWarn('AvatarGroup', { size }, { size: ['xs','sm','md','lg'] });
  const s = SIZES.indexOf(size) >= 0 ? size : 'sm';
  const l = layout === 'grid' ? 'grid' : 'stack';
  const words = useStrings('avatarGroup', strings);
  const limit = Math.max(1, max | 0);
  const shown = people.length > limit ? people.slice(0, limit) : people;
  const rest_ = people.length - shown.length;
  const restText = (t) => fill(t, { n: rest_ });
  const more = rest_ > 0 ? <Avatar initials={restText(words.more)} size={s} label={onMore ? undefined : restText(words.moreLabel)} className="plx-avatar-group__more" /> : null;
  return (
    <div className={cx('plx-avatar-group', 'plx-avatar-group--' + l, 'plx-avatar-group--' + s, className)} role="group" aria-label={label} {...rest}>
      {shown.map((p, i) => (
        <Avatar key={p.id != null ? p.id : i} name={p.name} src={p.src} color={p.color} presence={p.presence} size={s} label={p.name} strings={strings} className="plx-avatar-group__avatar" />
      ))}
      {more && onMore ? <button type="button" className="plx-avatar-group__more-button" aria-label={restText(words.moreLabel)} onClick={onMore}>{more}</button> : more}
    </div>
  );
}
