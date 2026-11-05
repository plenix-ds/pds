/* Plenix · SuggestedAction
   Summary: An optional suggestion as a compact action chip or a descriptive card, with explicit activation.
   Usage: <SuggestedAction onAction={run}>Summarize selection</SuggestedAction>
   Props:
     variant: "chip" (default) | "card".
     children: the specific action label.
     description: a supporting description in the card variant.
     onAction(): asynchronous explicit action.
     disabled: whether activation is unavailable; default false.
     strings: { failed, pending }; localized progress and fallback error.
     className: extra classes on the outer layout.
     ref: forwarded to the actual action button.
   Behavior: Never runs merely because it appears. Pending actions cannot repeat; errors remain beside the suggestion.
   Notes: Uses existing Button and sparkle icon roles only; there is no suggestion color or implicit acceptance.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { Stack,Inline } from '../../components/Stack/Stack.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { Badge } from '../Badge/Badge.tsx';
import { cx } from '../../utils/cx.ts';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';
export type SuggestedActionProps = {
  /** "chip" (default) | "card" */
  variant?: 'chip' | 'card';
  /** the specific action label */
  children?: React.ReactNode;
  /** a supporting description in the card variant */
  description?: React.ReactNode;
  /** the explicit action; async */
  onAction?(): unknown;
  disabled?: boolean;
  /** { failed, pending } */
  strings?: { failed?: string; pending?: string } | null;
  className?: string;
};
export const SuggestedAction=React.forwardRef(function SuggestedAction({variant='chip',children,description,onAction,disabled=false,strings,className}: SuggestedActionProps,ref: React.ForwardedRef<HTMLElement>){
  devWarn('SuggestedAction', { variant }, { variant: ['chip','card'] });
 const t={failed:'The action failed. Try again.',pending:'Working',...strings},[busy,setBusy]=React.useState(false),[error,setError]=React.useState(''),lock=React.useRef(false),live=React.useRef(true);
 React.useEffect(()=>{live.current=true;return()=>{live.current=false;};},[]);
 const act=async()=>{if(lock.current||disabled||!onAction)return;lock.current=true;setBusy(true);setError('');try{await onAction();}catch(e){if(live.current)setError((e as Error | undefined)?.message||t.failed);}finally{lock.current=false;if(live.current)setBusy(false);}};
 return <Stack className={cx('plx-suggested-action',className)}><Button ref={ref} variant="secondary" size={variant==='card'?'md':'sm'} stackedLabel={variant==='card'} className={cx('plx-suggested-action__button',variant==='card'&&'plx-suggested-action__button--card')} icon={SparkleIcon} disabled={disabled||busy||!onAction} aria-busy={busy||undefined} onClick={act}><Text as="span">{children}</Text>{variant==='card'&&description?<Text as="span" variant="caption">{description}</Text>:null}</Button>{busy?<Inline><Badge icon={SparkleIcon} role="status">{t.pending}</Badge></Inline>:null}{error?<Notice tone="danger">{error}</Notice>:null}</Stack>;
});
