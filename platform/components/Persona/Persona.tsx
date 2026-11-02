/* Plenix · Persona
   Summary: A person in one compact line: their avatar, their name and one detail (a role, a team, an email), with their
     presence and a role badge when they help (03 Content & Identity › Identity › Profile summary).
   Usage:
     <Persona name="Maya Chen" />
     <Persona name="Maya Chen" secondary="Designer · Brand team" presence="online" />
     <Persona name="Alex Kim" secondary="alex.kim@example.org" role="Owner" size="lg" href="../contacts/?id=12" />
   Props:
     name: the person's display name (the name they chose); the avatar's initials come from it
     src: the person's picture; color: their data color (Avatar's color)
     secondary: one detail under the name: a role, a team or an email
     role: a short role on a neutral badge after the name ("Owner", "Admin")
     presence: "online" | "away" | "busy" | "dnd" (do not disturb) | "offline": the dot on the avatar, and the state in
       words for assistive technology
     size: "xs" (24px avatar) | "sm" (28px) | "md" (32px, default) | "lg" (40px) | "xl" (48px): the avatar and the text
       sizes step together
     href: the person's profile: the name becomes a link to it
     strings: the words of presence, for other languages: { online: "Online", away: "Away", busy: "Busy",
       dnd: "Do not disturb", offline: "Offline" }
     className: more classes on the wrapper
   Behavior:
     The avatar is decorative (the name is next to it); the presence state is read after the name ("Maya Chen, Online").
     A long name or detail is cut with an ellipsis; its full text is in the title, shown on hover.
     Not interactive itself; with href the name is a link (one Tab stop).
   Notes:
     Other props pass through to the wrapper.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Avatar } from '../Avatar/Avatar.tsx';
import type { AvatarPresence } from '../Avatar/Avatar.tsx';
import { Badge } from '../Badge/Badge.tsx';
import { Link } from '../Link/Link.tsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const PRESENCE = ['online', 'away', 'busy', 'dnd', 'offline'];

export type PersonaProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> & {
  name: string;
  src?: string;
  /** the person's data color */
  color?: string;
  /** the line under the name */
  secondary?: React.ReactNode;
  /** a role badge after the name */
  role?: React.ReactNode;
  presence?: AvatarPresence;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** the name links here */
  href?: string;
  strings?: Catalog | null;
};
export function Persona({ name, src, color, secondary, role, presence, size = 'md', href, strings, className, ...rest }: PersonaProps) {
  devWarn('Persona', { size }, { size: ['xs','sm','md','lg','xl'] });
  const s = SIZES.indexOf(size) >= 0 ? size : 'md';
  const p = PRESENCE.indexOf(presence as string) >= 0 ? presence : null;
  const words = useStrings('persona', strings) as Record<string, string>;
  return (
    <div className={cx('plx-persona', 'plx-persona--' + s, className)} {...rest}>
      <Avatar name={name} src={src} color={color} presence={p || undefined} size={s} className="plx-persona__avatar" />
      <div className="plx-persona__text">
        <div className="plx-persona__primary">
          {href ? <Link href={href} variant="standalone" className="plx-persona__name" title={name}>{name}</Link>
            : <span className="plx-persona__name" title={name}>{name}</span>}
          {p ? <VisuallyHidden>{', ' + words[p as string]}</VisuallyHidden> : null}
          {role ? <Badge tone="neutral" size="sm" className="plx-persona__role">{role}</Badge> : null}
        </div>
        {secondary ? <div className="plx-persona__secondary" title={typeof secondary === 'string' ? secondary : undefined}>{secondary}</div> : null}
      </div>
    </div>
  );
}
