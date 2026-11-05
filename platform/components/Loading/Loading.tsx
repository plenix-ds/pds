/* Plenix · Skeleton, Spinner
   Summary: Loading indicators. Skeleton is a placeholder block with a shimmer; Spinner is a turning ring. (The typing
     dots are a Chat variant: Chat.Typing.)
   Usage:
     <Skeleton width="160px" height="16px" />
     <Spinner size="sm" label="Saving" />
   Props:
     Skeleton.width: the block width, a size token's name ("200px" for --plx-ref-size-50u); none: as wide as its place
     Skeleton.height: the block height, a size token's name ("16px")
     Skeleton.className: more classes on the block
     Spinner.size: "sm" | "md" (default) | "lg"
     Spinner.label: the text announced to assistive technology (default "Loading")
     Spinner.className: more classes on the ring
   Behavior:
     The Skeleton shimmer runs left to right; the block is decorative (aria-hidden).
     Spinner is a status region (role="status"), so its label is announced.
     People who ask their system for less motion see the indicators still.
   Notes:
     Other props pass through to the <span>.
     The old text listed a radius prop for Skeleton; the code takes none (set it with a class).
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';

// a size token's name from "200px" (or the older "var(--plx-ref-size-50u)"); the rule per size is in system/steps.css
const sizeName = (v: string | number | undefined) => (v ? String(v).replace(/^var\(--plx-ref-size-|\)$/g, '') : undefined);
export type SkeletonProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> & { width?: string | number; height?: string | number };
export function Skeleton({ width, height, className, ...rest }: SkeletonProps) {
  return <span className={cx('plx-skeleton', className)} aria-hidden="true" data-plx-width={sizeName(width)} data-plx-height={sizeName(height)} {...rest} />;
}

export type SpinnerProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> & { size?: 'sm' | 'md' | 'lg'; label?: React.ReactNode };
export function Spinner({ size = 'md', label, className, ...rest }: SpinnerProps) {
  devWarn('Spinner', { size }, { size: ['sm','md','lg'] });
  const t = useStrings('loading');
  return (
    <span className={cx('plx-spinner', 'plx-spinner--' + size, className)} role="status" {...rest}>
      <VisuallyHidden>{label ?? (t.label as React.ReactNode)}</VisuallyHidden>
    </span>
  );
}
