/* Plenix · ContextualHelp
   Summary: Help where the question comes up: an info button beside a label, heading or setting that opens a short
     explanation in a Popover (09 Overlays › Contextual help), or the same explanation shown in place as an inline tip
     (10 Patterns › Contextual education).
   Usage:
     <Field label={<>Retention <ContextualHelp title="Retention">Deleted files stay in the trash for 30 days.</ContextualHelp></>}>…</Field>
     <ContextualHelp title="Storage" link={{ href: '../help/storage.html', label: 'About storage' }}>Originals count toward your quota; previews do not.</ContextualHelp>
     <ContextualHelp variant="inline" title="Tip">Drop files anywhere on the page to upload them.</ContextualHelp>
   Props:
     title: the explanation's title (the popover's title; bold before the text of an inline tip)
     children: the explanation: one to three sentences
     link: { href, label }: a link to more help after the explanation (optional): on its own line in the popover, at the
       end of the sentence in an inline tip
     variant: "info" (default: the info button and its popover) | "inline" (an inline tip: the explanation shown in place,
       after the info icon, in the muted color)
     label: the info button's accessible name (default strings.more with the title: "More about Retention")
     placement: where the popover opens (default "bottom-start"; Popover's placements)
     size: the popover's width: "sm" (default; 240px) | "md" | "lg"
     strings: the words it announces, for other languages: { more: "More about {title}", moreUntitled: "More information" }
     className: more classes on the wrapper
   Behavior:
     Info: the button opens the popover on click, Enter or Space (never on hover) and focus moves into it; Escape returns
       focus to the button, and a click outside or Tab away closes it. At the Narrow window class it opens as a bottom
       sheet (Popover's sheetOnNarrow).
     Inline: plain text in the page, read in order; the link is one Tab stop.
   Notes:
     The button is the inline-action role (a 24px target) and ghost, so it sits on the label's line without weight.
     Help that everyone needs is helper text, not hidden help; errors and warnings are never contextual help.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Button } from '../Button/Button.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { Link } from '../Link/Link.tsx';
import { Popover } from '../Popover/Popover.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import InfoCircleIcon from 'plenix-platform/icons/plenix/info-circle';


export function ContextualHelp({ title, children, link, variant = 'info', label, placement = 'bottom-start', size = 'sm', strings, className }) {
  devWarn('ContextualHelp', { variant, size }, { variant: ['info','inline'], size: ['sm','md','lg'] });
  const t = useStrings('contextualHelp', strings);
  const more = (v) => (link && link.href ? <Link href={link.href} variant={v} className="plx-contextual-help__link">{link.label}</Link> : null);
  if (variant === 'inline') {
    return (
      <div className={cx('plx-contextual-help', 'plx-contextual-help--inline', className)}>
        <span className="plx-contextual-help__icon" aria-hidden="true"><Icon name={InfoCircleIcon} size="sm" /></span>
        <p className="plx-contextual-help__tip">
          {title ? <strong className="plx-contextual-help__title">{title}</strong> : null}{title ? ' ' : null}{children}{link ? ' ' : null}{more('inline')}
        </p>
      </div>
    );
  }
  const name = label || (typeof title === 'string' && title ? t.more.split('{title}').join(title) : t.moreUntitled);
  return (
    <span className={cx('plx-contextual-help', 'plx-contextual-help--info', className)}>
      <Popover trigger={<Button variant="ghost" size="xs" iconOnly icon={InfoCircleIcon} label={name} />} title={title} label={name} placement={placement} size={size}>
        <p className="plx-contextual-help__text">{children}</p>
        {link && link.href ? <p className="plx-contextual-help__more">{more('standalone')}</p> : null}
      </Popover>
    </span>
  );
}
