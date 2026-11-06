/* Plenix · PermissionSummary
   Summary: Who can reach an item and what they may do with it, in a few lines: the access in words with its icon ("Your
     team can edit"), where it comes from ("From the Marketing folder · 12 people"), then what that access allows and does
     not allow as two lists, Can (a check in the success color) and Cannot (a cross in the danger color); compact folds
     each list into one sentence. Manage access opens the sharing dialog (03 Content & Identity › Permission summary).
   Usage:
     <PermissionSummary access="Your team can edit" detail="From the Marketing folder · 12 people"
       can={['View', 'Comment', 'Edit details']} cannot={['Share', 'Delete']} onManage={openSharing} />
     <PermissionSummary variant="compact" icon="lock" access="Only you" can={['View', 'Edit']} cannot={['Share']} />
   Props:
     access: the access in words, audience first ("Anyone with the link can view", "Only you")
     icon: the icon before it: "lock" (default: restricted) | "settings-users" (a team or group) | "link" (anyone with the
       link) | "person" (one person) | any icon of the set; it repeats the words, never replaces them
     detail: where the access comes from and how many it reaches ("From the Marketing folder · 12 people")
     can: what the access allows: ["View", "Comment"]
     cannot: what it does not allow: ["Share", "Delete"]
     variant: "list" (default: Can and Cannot as headed lists) | "compact" (one sentence each: "Can view and comment",
       "Cannot share or delete")
     onManage(): shows Manage access, a button that opens the sharing settings (a dialog)
     manageHref: instead, Manage access is a link to the access settings page
     live: changes are announced politely (aria-live), for a summary that updates while people change the access
     strings: the words, for other languages: { can: "Can", cannot: "Cannot", manage: "Manage access", canSentence:
       "Can {list}", cannotSentence: "Cannot {list}" }
     className: more classes on the summary
   Behavior:
     Read only: it states the access; changing it is the sharing dialog's (onManage) or the settings page's (manageHref).
     The icons are decorative: the words say the access and each right; the success and danger colors repeat the check
       and the cross, so meaning never rests on color.
     Compact joins each list in the reader's language (formatList: "view, comment, and edit"; Cannot with "or").
   Notes:
     Lead with the audience, then the right. List the rights people ask about (share, delete, download), not every
       permission: Manage access shows the rest. A role's full grid of rights is the permissions editor's.
*/
import React from 'react';
import type { IconValue } from '../../components/Icon/Icon.tsx';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { formatList } from '../../utils/format.ts';
import { Icon } from '../../components/Icon/Icon.tsx';
import { List } from '../../components/List/List.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import LockIcon from 'plenix-platform/icons/plenix/lock';
import { fill } from '../../utils/fill.ts';

const lower = (x: any) => String(x).charAt(0).toLowerCase() + String(x).slice(1);

/** @public the prop type (ADR 0011) */
export type PermissionSummaryProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  /** the access in words, audience first */
  access: string;
  /** an icon name of the set, or an imported icon; it repeats the words */
  icon?: string | IconValue;
  detail?: string;
  can?: string[];
  cannot?: string[];
  variant?: 'list' | 'compact';
  onManage?(): void;
  manageHref?: string;
  live?: boolean;
  strings?: Record<string, string>;
  className?: string;
};
export function PermissionSummary({ access, icon = 'lock', detail, can = [], cannot = [], variant = 'list', onManage, manageHref, live = false, strings, className, ...rest }: PermissionSummaryProps) {
  // the documented default is the name; it draws from its imported module (#280)
  const glyph = icon === 'lock' ? LockIcon : icon;
  devWarn('PermissionSummary', { variant }, { variant: ['list','compact'] });
  const t: any = useStrings('permissionSummary', strings);
  const compact = variant === 'compact';
  const yes = (children: any) => ({ icon: CheckIcon, tone: 'success', children });
  const no = (children: any) => ({ icon: CloseIcon, tone: 'danger', children });
  const manage = manageHref ? <Link href={manageHref} className="plx-permission-summary__manage">{t.manage}</Link>
    : onManage ? <Button size="sm" variant="ghost" className="plx-permission-summary__manage" onClick={onManage}>{t.manage}</Button> : null;
  return (
    <div className={cx('plx-permission-summary', compact && 'plx-permission-summary--compact', className)} aria-live={live ? 'polite' : undefined} {...rest}>
      <div className="plx-permission-summary__head">
        <span className="plx-permission-summary__icon" aria-hidden="true"><Icon name={glyph} /></span>
        <span className="plx-permission-summary__access">
          <span className="plx-permission-summary__level">{access}</span>
          {detail ? <span className="plx-permission-summary__detail">{detail}</span> : null}
        </span>
        {manage}
      </div>
      {compact ? (
        can.length || cannot.length ? (
          <List className="plx-permission-summary__list" items={([] as any[]).concat(
            can.length ? [yes(fill(t.canSentence, { list: formatList(can.map(lower)) }))] : [],
            cannot.length ? [no(fill(t.cannotSentence, { list: formatList(cannot.map(lower), { type: 'disjunction' }) }))] : [])} />
        ) : null
      ) : can.length || cannot.length ? (
        <div className="plx-permission-summary__lists">
          {can.length ? (
            <div className="plx-permission-summary__section">
              <p className="plx-permission-summary__heading">{t.can}</p>
              <List className="plx-permission-summary__list" items={can.map(yes) as any} />
            </div>
          ) : null}
          {cannot.length ? (
            <div className="plx-permission-summary__section">
              <p className="plx-permission-summary__heading">{t.cannot}</p>
              <List className="plx-permission-summary__list" items={cannot.map(no) as any} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
