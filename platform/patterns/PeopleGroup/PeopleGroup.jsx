/* Plenix · PeopleGroup
   Summary: A set of people shown as one identity in a single row: a team (its own picture or initials, its name, what it
     does and its members' avatars) or a group (a permission or directory group: the group icon, its name, where it comes
     from and how many it holds, its members on demand). It says in words which it is ("Team", "Group"), so it is never
     taken for a person (03 Content & Identity › Identity › Team and Group).
   Usage:
     <PeopleGroup name="Brand team" description="Design and print" members={people} count={8} href="/teams/brand" />
     <PeopleGroup kind="group" name="Archive editors" count={48} source="Synced from directory" onShowMembers={open} />
   Props:
     name: the team's or group's name
     kind: "team" (default) | "group"
     description: one line about it ("Design and print")
     members: [{ id, name, src, presence }]: the people shown as an AvatarGroup (a team; a group shows them on demand)
     count: how many members it has: "8 members", the number in the data font (default: not shown)
     max: how many avatars show before +N (default 4)
     src: a team's own picture (default: its initials)
     source: where a group comes from ("Synced from directory"); a synced group is managed there
     href: the team's or group's page: its name becomes a link to it
     onShowMembers(): opens the full member list: a Show members button (a group), or the avatars' +N tile (a team)
     strings: the words, for other languages: { team: "Team", group: "Group", members: "{n} members", member: "{n} member",
       showMembers: "Show members", membersOf: "Members of {name}" }
     className: more classes on the row
   Behavior:
     The kind is read first, then the name ("Team, Brand team"); the picture or icon is decorative because the name is
       next to it. Avatars and the +N tile are AvatarGroup's: the tile is a button only with onShowMembers.
     A long name, description or source is cut with an ellipsis on one line; the full text is in its title.
     Not interactive itself: the name is a link with href, and Show members a button.
   Notes:
     A list of people with no shared identity is an AvatarGroup. A single person is a Persona. Granting a team or a group
       access shows it with a role (PermissionSummary for what that role allows).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { formatNumber } from '../../utils/format.ts';
import { Avatar } from '../../components/Avatar/Avatar.tsx';
import { AvatarGroup } from '../../components/AvatarGroup/AvatarGroup.tsx';
import { Icon } from '../../components/Icon/Icon.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import SettingsUsersIcon from 'plenix-platform/icons/plenix/settings-users';
import { fill } from '../../utils/fill.ts';

// "8 members" with the number in the data font
function Members({ n, t }) {
  const words = n === 1 ? t.member : t.members;
  const [before, after] = words.split('{n}');
  return <span className="plx-people-group__count">{before}<span className="plx-people-group__number">{formatNumber(n)}</span>{after}</span>;
}

export function PeopleGroup({ name, kind = 'team', description, members, count, max = 4, src, source, href, onShowMembers, strings, className, ...rest }) {
  const t = useStrings('peopleGroup', strings);
  const group = kind === 'group';
  const kindWord = group ? t.group : t.team;
  const showAvatars = !group && members && members.length;
  return (
    <div className={cx('plx-people-group', 'plx-people-group--' + (group ? 'group' : 'team'), className)} {...rest}>
      <span className={cx('plx-people-group__media', group && 'plx-people-group__media--icon')} aria-hidden="true">
        {group ? <Icon name={SettingsUsersIcon} size="md" className="plx-people-group__icon" /> : <Avatar name={name} src={src} size="lg" />}
      </span>
      <span className="plx-people-group__body">
        <span className="plx-people-group__name" title={name}>
          <VisuallyHidden>{kindWord + ', '}</VisuallyHidden>
          {href ? <Link href={href}>{name}</Link> : name}
        </span>
        <span className="plx-people-group__meta">
          <span className="plx-people-group__kind" aria-hidden="true">{kindWord}</span>
          {typeof count === 'number' ? <><span className="plx-people-group__separator" aria-hidden="true">·</span><Members n={count} t={t} /></> : null}
          {source ? <><span className="plx-people-group__separator" aria-hidden="true">·</span><span className="plx-people-group__source" title={source}>{source}</span></> : null}
        </span>
        {description ? <span className="plx-people-group__description" title={description}>{description}</span> : null}
      </span>
      {showAvatars ? <AvatarGroup className="plx-people-group__members" label={fill(t.membersOf, { name })} people={members} max={max} onMore={onShowMembers} /> : null}
      {group && onShowMembers ? <Button size="sm" variant="ghost" className="plx-people-group__show" onClick={onShowMembers}>{t.showMembers}</Button> : null}
    </div>
  );
}
