/* Plenix · RoleLabel
   Summary: A person's role on a project, a folder or a workspace (03 Content › Identity › Role): its name in the tag look,
     with the role's icon before it. A role is a descriptive label, not a status: it is gray (the tag look), or the
     category color the application gives a custom role; never a status variant.
   Usage:
     <RoleLabel role="owner" />
     <RoleLabel role="editor" />
     <RoleLabel role="viewer" icon={false} />
     <RoleLabel role="custom" label="Billing admin" category="teal" />
     <RoleLabel role="Reviewer" />                      // any other name is a custom role
   Props:
     role: "owner" | "editor" | "viewer" (the built-in roles, named by strings) | "custom" (with label) | any other text,
       shown as a custom role; default "viewer"
     label: the role's name; it replaces the built-in name, and names a custom role
     icon: the icon before the name (an icon name from platform/icons/map.json); default the role's own: owner
       "settings-permissions", editor "pencil", viewer "visibility", a custom role "person"; false: no icon
     category: a custom role's category color from the application's data (one of the 20 category colors, as Tag takes
       them); without it the label is gray. The built-in roles stay gray.
     description: what the role allows ("Can edit and share"); read after the name by screen readers (visually hidden)
     strings: the built-in names, for other languages: { owner: "Owner", editor: "Editor", viewer: "Viewer" }
     className: more classes on the label
   Behavior:
     Static text: it takes no focus. To change a role use a Select or a menu beside it (the permissions editor).
     The icon is decorative; the name says the role.
   Notes:
     The look is the Tag's (its height, corners, fill, border and type: --plx-comp-tag-*); the icon size and the space
       after it are the role label's own tokens. data-plx-role carries the role for the application's own rules.
     Other props pass through to the <span>.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Icon } from '../Icon/Icon.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import PencilIcon from 'plenix-platform/icons/plenix/pencil';
import PersonIcon from 'plenix-platform/icons/plenix/person';
import SettingsPermissionsIcon from 'plenix-platform/icons/plenix/settings-permissions';
import VisibilityIcon from 'plenix-platform/icons/plenix/visibility';

const ICONS = { owner: SettingsPermissionsIcon, editor: PencilIcon, viewer: VisibilityIcon, custom: PersonIcon };

export function RoleLabel({ role = 'viewer', label, icon, category, description, strings, className, ...rest }) {
  const t = useStrings('roleLabel', strings);
  const builtIn = role === 'owner' || role === 'editor' || role === 'viewer';
  const kind = builtIn ? role : 'custom';
  const name = label || (builtIn ? t[role] : role === 'custom' ? '' : role);
  const glyph = icon === false ? null : icon || ICONS[kind];
  return (
    <span className={cx('plx-tag', 'plx-role-label', className)} data-plx-role={kind} data-plx-category={!builtIn && category ? category : undefined} {...rest}>
      {glyph ? <span className="plx-role-label__icon" aria-hidden="true"><Icon name={glyph} /></span> : null}
      <span className="plx-tag__label">{name}</span>
      {description ? <span className="plx-visually-hidden">{', ' + description}</span> : null}
    </span>
  );
}
