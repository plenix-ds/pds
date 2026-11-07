/* Plenix · Banner
   Summary: A message about the whole page or a whole pane, across its full width at its top: a system notice, an expiring
     plan, a sync failure, read-only mode (08 Feedback › Messages › Banner). Notice is the message inside content.
   Usage:
     <Banner tone="warning" title="Your plan ends in 3 days">Renew it to keep sharing links active.</Banner>
     <Banner tone="danger" actions={<Button size="sm">Retry</Button>} onDismiss={() => …}>The library could not sync.</Banner>
     <Banner tone="info" placement="pane">This folder is read-only.</Banner>
   Props:
     tone: "info" (default) | "success" | "warning" | "danger" | "neutral": the soft fill, edge, text color and status icon
     title: a short bold lead before the message (optional)
     children: the message, one or two sentences
     actions: one or two Buttons (size "sm") after the message (optional)
     onDismiss(): shows a Dismiss button that runs it; the owner removes the banner (optional: without it the banner stays)
     placement: "page" (default; the top of the page, under the app header) | "pane" (the top of a pane or a panel)
     icon: an icon name in place of the tone's icon (optional)
     strings: the words it shows and announces, for other languages: { dismiss: "Dismiss" } and the StatusIcon tone words
     className: more classes on the banner
   Behavior:
     A danger banner is an alert (role="alert"): screen readers announce it when it appears. The other tones are a status
       (role="status"), announced politely.
     It spans the full width of its page or pane with an edge under it only; it has no corners and no shadow, and it pushes
       the content down rather than covering it.
     The message wraps; the actions and the Dismiss button stay on the first line's end at every width.
   Notes:
     One banner per page or pane at a time: show the most important one.
     Other props pass through to the banner element.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Icon, StatusIcon } from '../Icon/Icon.tsx';
import type { IconValue, StatusIconProps } from '../Icon/Icon.tsx';
import { Button } from '../Button/Button.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import { dataWhenText } from '../../utils/dataText.tsx';
import CloseIcon from 'plenix-platform/icons/plenix/close';

const TONES = ['info', 'success', 'warning', 'danger', 'neutral'];

export type BannerProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  title?: React.ReactNode;
  actions?: React.ReactNode;
  /** shows the dismiss button */
  onDismiss?: (event: React.MouseEvent<HTMLElement>) => void;
  placement?: 'page' | 'pane';
  /** an icon name or an imported icon module, in place of the tone's */
  icon?: IconValue | null;
  strings?: Catalog | null;
};
export function Banner({ tone = 'info', title, children, actions, onDismiss, placement = 'page', icon, strings, className, ...rest }: BannerProps) {
  devWarn('Banner', { tone }, { tone: ['info','success','warning','danger','neutral'] });
  const t = TONES.indexOf(tone) >= 0 ? tone : 'info';
  const words = useStrings('banner', strings);
  return (
    <div className={cx('plx-banner', 'plx-banner--' + t, 'plx-banner--' + (placement === 'pane' ? 'pane' : 'page'), className)}
      role={t === 'danger' ? 'alert' : 'status'} {...rest}>
      <span className="plx-banner__icon">
        {icon ? <span className={cx('plx-status-icon', 'plx-status-icon--' + t, 'plx-status-icon--md')}><span className="plx-status-icon__glyph"><Icon name={icon} size="md" /></span></span>
          : <StatusIcon tone={t as StatusIconProps['tone']} strings={strings} />}
      </span>
      <div className="plx-banner__body">
        {title ? <strong className="plx-banner__title">{title}</strong> : null}
        {children ? <span className="plx-banner__text">{dataWhenText(children)}</span> : null}
      </div>
      {actions ? <div className="plx-banner__actions">{actions}</div> : null}
      {onDismiss ? <Button variant="ghost" size="sm" iconOnly tooltip={false} icon={CloseIcon} label={words.dismiss as string} className="plx-banner__dismiss" onClick={onDismiss} /> : null}
    </div>
  );
}
