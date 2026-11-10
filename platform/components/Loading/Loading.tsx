/* Plenix · Skeleton, Spinner
   Summary: Loading indicators. Skeleton is a placeholder block with a shimmer; Spinner is a turning ring. (The typing
     dots are a Chat variant: Chat.Typing.)
   Usage:
     <Skeleton width="160px" height="16px" />
     <Spinner size="sm" label="Saving" />
   Props:
     Skeleton: opt-in only. No Plenix component, pattern or template uses it as a default (D-0130); use LoadingState
     Skeleton.width: the block width, a size token's name ("200px" for --plx-ref-size-50u); none: as wide as its place
     Skeleton.height: the block height, a size token's name ("16px")
     Skeleton.className: more classes on the block
     Spinner.size: "sm" | "md" (default) | "lg"
     Spinner.label: the text announced to assistive technology (default "Loading")
     Spinner.labelPosition: "hidden" (default: the label is for assistive technology only) | "after" | "below": the label shows beside the ring
     Spinner.delay: a number of ms, or "region" (--plx-sys-motion-loading-region-delay, about 1s): nothing is drawn before it; unset: at once
     LoadingState: a region's first load: a centred spinner with its label after about 1s (label, progress, size, labelPosition, delay, onCancel, strings);
       from about 10s (a token) a second line "This is taking longer than usual." and, with onCancel, a Cancel button; the label stays; focus is never moved (ADR 0051);
       with progress (0 to 100) a ProgressBar; only the outermost one in a region draws (ADR 0042)
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
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import { ProgressBar } from '../ProgressBar/ProgressBar.tsx';
import { Button } from '../Button/Button.tsx';

// a size token's name from "200px" (or the older "var(--plx-ref-size-50u)"); the rule per size is in system/steps.css
const sizeName = (v: string | number | undefined) => (v ? String(v).replace(/^var\(--plx-ref-size-|\)$/g, '') : undefined);
export type SkeletonProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> & { width?: string | number; height?: string | number };
export function Skeleton({ width, height, className, ...rest }: SkeletonProps) {
  return <span className={cx('plx-skeleton', className)} aria-hidden="true" data-plx-width={sizeName(width)} data-plx-height={sizeName(height)} {...rest} />;
}

// the region delay is a token (--plx-sys-motion-loading-region-delay), read once; 1000 ms when it cannot be read
function regionDelay(): number {
  if (typeof document === 'undefined') return 1000;
  const v = getComputedStyle(document.documentElement).getPropertyValue('--plx-sys-motion-loading-region-delay').trim();
  const n = parseFloat(v);
  return !(n >= 0) ? 1000 : /ms$/.test(v) ? n : n * 1000;
}
// the long wait is a token too (--plx-sys-motion-loading-long-delay, ten seconds); 10000 ms when it cannot be read
function longDelay(): number {
  if (typeof document === 'undefined') return 10000;
  const v = getComputedStyle(document.documentElement).getPropertyValue('--plx-sys-motion-loading-long-delay').trim();
  const n = parseFloat(v);
  return !(n >= 0) ? 10000 : /ms$/.test(v) ? n : n * 1000;
}
// true once the delay has passed (0 or no delay: at once)
function useAfter(delay: number | 'region' | 'long' | undefined): boolean {
  const wait = React.useMemo(() => (delay === 'region' ? regionDelay() : delay === 'long' ? longDelay() : delay || 0), [delay]);
  const [ready, setReady] = React.useState(!wait);
  React.useEffect(() => {
    if (!wait) { setReady(true); return undefined; }
    setReady(false);
    const id = setTimeout(() => setReady(true), wait);
    return () => clearTimeout(id);
  }, [wait]);
  return ready;
}

export type SpinnerProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> & {
  size?: 'sm' | 'md' | 'lg'; label?: React.ReactNode; labelPosition?: 'hidden' | 'after' | 'below'; delay?: number | 'region';
};
export function Spinner({ size = 'md', label, labelPosition = 'hidden', delay, className, ...rest }: SpinnerProps) {
  devWarn('Spinner', { size, labelPosition }, { size: ['sm','md','lg'], labelPosition: ['hidden','after','below'] });
  const t = useStrings('loading');
  const ready = useAfter(delay);
  if (!ready) return null;
  const text = label ?? (t.label as React.ReactNode);
  if (labelPosition === 'hidden') {
    return (
      <span className={cx('plx-spinner', 'plx-spinner--' + size, className)} role="status" {...rest}>
        <VisuallyHidden>{text}</VisuallyHidden>
      </span>
    );
  }
  // the visible label is the status text, so it is announced once; the ring is decoration
  return (
    <span className={cx('plx-spinner-wrap', 'plx-spinner-wrap--' + labelPosition, className)} role="status" {...rest}>
      <span className={cx('plx-spinner', 'plx-spinner--' + size)} aria-hidden="true" />
      <span className="plx-spinner__label">{text}</span>
    </span>
  );
}

const InLoadingState = React.createContext(false);
export type LoadingStateProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  label?: React.ReactNode;
  /** 0 to 100: a ProgressBar in place of the ring */
  progress?: number | null;
  size?: 'sm' | 'md' | 'lg';
  labelPosition?: 'after' | 'below';
  delay?: number | 'region';
  /** from the long wait (about 10 s) a Cancel button calls it; without it there is no button (ADR 0051) */
  onCancel?: () => void;
  strings?: Catalog | null;
};
export function LoadingState({ label, progress, size = 'lg', labelPosition = 'after', delay = 'region', onCancel, strings, className, ...rest }: LoadingStateProps) {
  const t = useStrings('loading', strings);
  const nested = React.useContext(InLoadingState);
  const ready = useAfter(delay);
  const long = useAfter('long');   // counted from mount, not from when the ring appears
  if (nested || !ready) return null;
  const text = label ?? (t.label as React.ReactNode);
  return (
    <InLoadingState.Provider value>
      <div className={cx('plx-loading-state', long && 'plx-loading-state--long', className)} {...rest}>
        {typeof progress === 'number' ? <ProgressBar value={progress} label={typeof text === 'string' ? text : String(t.label)} showValue className="plx-loading-state__progress" />
          : <Spinner size={size} label={text} labelPosition={labelPosition} />}
        {typeof progress === 'number' ? null : <span className="plx-loading-state__slow" role="status">{long ? (t.slow as React.ReactNode) : null}</span>}
        {long && onCancel ? <Button size="sm" onClick={onCancel} className="plx-loading-state__cancel">{t.cancel as React.ReactNode}</Button> : null}
      </div>
    </InLoadingState.Provider>
  );
}
