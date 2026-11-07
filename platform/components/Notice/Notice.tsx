/* Plenix · Notice
   Summary: A short message inside a page, a panel or a dialog (an inline message); with a title, actions or a dismiss
     button it is a section message: a message about one section of the page that people can act on or put away.
     It shows its tone's soft surface and content color, an icon and the text.
   Usage:
     <Notice tone="warning">This folder is shared with 3 people.</Notice>
     <Notice tone="danger" title="The export failed" actions={<Button size="xs" onClick={retry}>Try again</Button>}
       onDismiss={() => setShown(false)}>The server did not answer.</Notice>
   Props:
     tone: "info" (default) | "success" | "warning" | "danger"
     icon: an icon name; the tone's icon unless given
     title: a short heading above the text, which names the message (a section message)
     actions: buttons under the text (one or two, size "xs"), the next steps the message offers
     onDismiss(event): shows a dismiss button at the end; called when it is pressed (the page hides the notice)
     strings: the words it announces, for other languages: { dismiss: "Dismiss" } (the dismiss button's name)
     className: more classes on the notice
     children: the message text
     ...rest: other attributes go on the notice element
   Behavior:
     A danger notice has role="alert", so screen readers announce it.
     The dismiss button is the last Tab stop of the notice; the page decides what happens to focus after it hides the
       notice (it moves to the next thing in the section).
   Notes:
     Without a title, actions or onDismiss the markup is the plain inline message (the icon and the text).
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Icon } from '../Icon/Icon.tsx';
import type { IconModule, IconValue } from '../Icon/Icon.tsx';
import { Button } from '../Button/Button.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import AlertIcon from 'plenix-platform/icons/plenix/alert';
import CircleCheckIcon from 'plenix-platform/icons/plenix/circle-check';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import InfoCircleIcon from 'plenix-platform/icons/plenix/info-circle';
import WarningIcon from 'plenix-platform/icons/plenix/warning';

const ICONS: Record<string, IconModule> = { info: InfoCircleIcon, success: CircleCheckIcon, warning: WarningIcon, danger: AlertIcon };
export type NoticeProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  /** an icon name or an imported icon module, in place of the tone's */
  icon?: IconValue | null;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  /** shows the dismiss button */
  onDismiss?: (event: React.MouseEvent<HTMLElement>) => void;
  strings?: Catalog | null;
};
export function Notice({ tone = 'info', icon, title, actions, onDismiss, strings, className, children, ...rest }: NoticeProps) {
  devWarn('Notice', { tone }, { tone: ['info','success','warning','danger'] });
  const t = useStrings('notice', strings);
  const section = title || actions;
  return (
    <div className={cx('plx-notice', 'plx-notice--' + tone, className)} role={tone === 'danger' ? 'alert' : undefined} {...rest}>
      <Icon name={icon || ICONS[tone]} />
      {section ? (
        <div className="plx-notice__body">
          {title ? <div className="plx-notice__title">{title}</div> : null}
          {children ? <div className="plx-notice__text">{children}</div> : null}
          {actions ? <div className="plx-notice__actions">{actions}</div> : null}
        </div>
      ) : <div className="plx-notice__text">{children}</div>}
      {onDismiss ? <Button className="plx-notice__dismiss" variant="ghost" size="xs" iconOnly tooltip={false} icon={CloseIcon} label={t.dismiss as string} onClick={onDismiss} /> : null}
    </div>
  );
}
