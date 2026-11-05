/* Plenix · AIDisclaimer
   Summary: A plain language reminder to review AI output, inline or in a footer.
   Usage: <AIDisclaimer href="/ai-policy">Check important details before using this content.</AIDisclaimer>
   Props: variant: footer|inline; children: caller disclaimer text; href: optional policy URL; strings: message, learn; className.
   Behavior: Renders text and a real policy link; never promises accuracy or substitutes for informed review.
   Notes: Existing roles and the existing sparkle icon only. Caller owns AI output, data, authorization and persistence.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Inline } from '../Stack/Stack.tsx';
import { Text } from '../Text/Text.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { Link } from '../Link/Link.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';
export type AIDisclaimerProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  /** "footer" (default) or "inline" */
  variant?: 'footer' | 'inline';
  /** the caller's disclaimer text; default strings.message */
  children?: React.ReactNode;
  /** a policy URL */
  href?: string;
  /** { message, learn } */
  strings?: Catalog | null;
};
export function AIDisclaimer({variant='footer',children,href,strings,className,...rest}: AIDisclaimerProps){
  devWarn('AIDisclaimer', { variant }, { variant: ['footer','inline'] });
  const t=useStrings('aiDisclaimer', strings) as { message: string; learn: string };return <Inline as={variant==='inline'?'span':'footer'} wrap className={cx('plx-ai-disclaimer',className)} {...rest}><Icon name={SparkleIcon}/><Text variant="secondary">{children||t.message}</Text>{href?<Link href={href}>{t.learn}</Link>:null}</Inline>;}
