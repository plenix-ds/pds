/* Plenix · UserCard
   Summary: A person on a card (03 Content & Identity › Identity › User card; also the Profile card): their avatar, name,
     title or team, role and presence, a few ways to reach them, and the actions that concern them (Message, Call). The
     compact form is one row; a cover picture can head the card. Built from Card, Avatar, Badge, Link, List and Image.
   Usage:
     <UserCard name="Maya Chen" secondary="Designer · Brand team" presence="online"
       details={[{ icon: 'mail', label: 'maya.chen@example.org' }, { icon: 'phone', label: '+1 415 555 0134', data: true }]} />
     <UserCard name="Maya Chen" secondary="Designer" role="Owner" href="../contacts/?id=12"
       actions={<><Button variant="secondary" icon="message">Message</Button><Button variant="ghost" icon="phone">Call</Button></>} />
     <UserCard variant="compact" name="Alex Kim" secondary="alex.kim@example.org" actions={<Button variant="ghost">Follow</Button>} />
     <UserCard name="Maya Chen" cover="../dam/assets/thumb-14.svg" secondary="Designer" />
   Props:
     name: the person's display name (required): the card's heading; the avatar's initials come from it
     src: the person's picture; color: their data color (Avatar's color)
     secondary: one line under the name: a job title, a team, an email
     role: a short role on a neutral badge under the name ("Owner", "Admin"); the default variant only
     presence: "online" | "away" | "busy" | "dnd" | "offline": the avatar's presence, and the state in words after the
       name for assistive technology
     details: ways to reach or place them, one per line with an icon: [{ icon, label, data }]; data true sets the label in
       the data font (a phone number, a local time)
     actions: the buttons for this person (Message, Call, Follow), at the card's foot; or at the row's end (compact)
     cover: a picture across the top of the card (21:9), the avatar overlapping its lower edge (default variant)
     variant: "default" (the avatar above the name) | "compact" (one row: a smaller avatar, the name and the line beside it,
       the actions at the end; no details or cover)
     href: the person's profile: the name becomes a link to it
     headingLevel: the heading level of the name (default 3)
     strings: the words of presence, for other languages: { online: "Online", away: "Away", busy: "Busy",
       dnd: "Do not disturb", offline: "Offline" }
     className: more classes on the card
   Behavior:
     The name is the card's heading; with href it is a link (one Tab stop), and the actions are buttons of their own, so
       the card itself is not one target.
     The avatar is decorative (the name is beside it); the presence is read after the name ("Maya Chen, Online").
     Long names and lines wrap in the default card and are cut with an ellipsis in the compact row (full text on hover).
     The cover keeps its frame before it loads and is decorative.
   Notes:
     A list of people in a table is the DataGrid with Persona in its name column; a person inline is Persona; a person's
       preview on hover is the hover card. Other props pass through to Card's <article>.
*/
import React from 'react';
import type { IconValue } from '../../components/Icon/Icon.tsx';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Card } from '../../components/Card/Card.tsx';
import { Avatar } from '../../components/Avatar/Avatar.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Image } from '../../components/Image/Image.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { List } from '../../components/List/List.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';

const PRESENCE = ['online', 'away', 'busy', 'dnd', 'offline'];
const H = ({ level, ...props }: any) => React.createElement(level ? 'h' + level : 'div', props);

/** @public one line of a card's details; data true sets the label in the data font */
export type UserCardDetail = { icon?: string | IconValue; label: React.ReactNode; data?: boolean };
/** @public the prop type (ADR 0011) */
export type UserCardProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
  name: string;
  src?: string;
  color?: string;
  secondary?: React.ReactNode;
  role?: React.ReactNode;
  presence?: 'online' | 'away' | 'busy' | 'dnd' | 'offline';
  details?: UserCardDetail[];
  actions?: React.ReactNode;
  cover?: React.ReactNode;
  variant?: 'default' | 'compact';
  href?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  strings?: Record<string, string>;
  className?: string;
};
export function UserCard(props: UserCardProps) {
  const { name, src, color, secondary, role, presence, details, actions, cover, variant = 'default', href,
  headingLevel = 3, strings, className, ...rest } = props as any;
  devWarn('UserCard', { variant }, { variant: ['default','compact'] });
  const compact = variant === 'compact';
  const p = PRESENCE.indexOf(presence) >= 0 ? presence : null;
  const words = useStrings('userCard', strings);
  const withCover = !compact && !!cover;
  const hasActions = actions !== undefined && actions !== null && actions !== false;
  return (
    <Card bodyLayout="stack" className={cx('plx-user-card', 'plx-user-card--' + (compact ? 'compact' : 'default'), withCover && 'plx-user-card--cover', hasActions && 'plx-user-card--actions', className)} {...rest}>
      {withCover ? <span className="plx-user-card__cover"><Image src={cover} alt="" ratio="21-9" className="plx-user-card__cover-image" /></span> : null}
      <div className="plx-user-card__identity">
        <Avatar name={name} src={src} color={color} presence={p || undefined} size={compact ? 'lg' : '2xl'} className="plx-user-card__avatar" />
        <div className="plx-user-card__text">
          <H level={headingLevel} className="plx-user-card__name" title={compact && typeof name === 'string' ? name : undefined}>
            {href ? <Link href={href} variant="standalone">{name}</Link> : name}
            {p ? <VisuallyHidden>{', ' + words[p]}</VisuallyHidden> : null}
          </H>
          {secondary ? <p className="plx-user-card__secondary" title={compact && typeof secondary === 'string' ? secondary : undefined}>{secondary}</p> : null}
          {role && !compact ? <span className="plx-user-card__role"><Badge tone="neutral" size="sm">{role}</Badge></span> : null}
        </div>
        {compact && hasActions ? <div className="plx-user-card__actions">{actions}</div> : null}
      </div>
      {!compact && details && details.length ? (
        <List className="plx-user-card__details"
          items={details.map((d: any) => ({ icon: d.icon, children: d.data ? <Text variant="data">{d.label}</Text> : d.label }))} />
      ) : null}
      {!compact && hasActions ? <div className="plx-user-card__actions">{actions}</div> : null}
    </Card>
  );
}
