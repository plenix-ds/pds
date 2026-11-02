/* Plenix · LoadingOverlay
   Summary: Covers a region (or the whole window) while it saves or refreshes: a veil over the content, a spinner or a
     progress bar in its middle and a short message, so nobody edits what is about to change (08 Feedback › Loading and
     progress › Loading overlay).
   Usage:
     <LoadingOverlay active={saving} message="Saving changes"><AssetTable … /></LoadingOverlay>
     <LoadingOverlay active={importing} progress={42} message="Importing 120 assets" onCancel={stop}>…</LoadingOverlay>
     <LoadingOverlay active fullPage message="Signing you in" />
   Props:
     active: covers the content while true (default true)
     fullPage: covers the whole window instead of its own region, and stops the page scrolling (default false)
     message: what is happening, in a few words ("Saving changes"); shown under the indicator and announced
     progress: how much is done (0 to 100); with it a progress bar replaces the spinner
     delay: milliseconds to wait before it shows, so a quick save does not flash (default 0)
     onCancel(): shows a Cancel button under the indicator that runs it, for work that can stop (optional)
     strings: the words it announces and shows, for other languages: { loading: "Loading", cancel: "Cancel" }
     children: the region it covers
     className: more classes on the region
   Behavior:
     While active the region is aria-busy and its content is inert: no pointer, no keyboard, no screen reader inside it.
     Only the covered region is blocked; the rest of the page keeps working (fullPage blocks the window).
     The indicator is a status: its message is announced politely when it shows (the Spinner's or the ProgressBar's name).
     When the work ends, focus returns to the element inside the region that had it.
     The veil is the inverse Scrim (the canvas at the high opacity): the content stays faintly visible, so nothing jumps.
   Notes:
     For content that loads the first time with a known layout, use skeletons; for work of minutes, run it in the
       background and report it with a toast.
     Other props pass through to the region element.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Scrim } from '../Scrim/Scrim.tsx';
import { Spinner } from '../Loading/Loading.tsx';
import { ProgressBar } from '../ProgressBar/ProgressBar.tsx';
import { Button } from '../Button/Button.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';

export type LoadingOverlayProps = React.HTMLAttributes<HTMLDivElement> & {
  active?: boolean;
  /** covers the page, not its own box */
  fullPage?: boolean;
  message?: string;
  /** 0 to 100: a progress bar instead of the spinner */
  progress?: number | null;
  /** ms before it shows (a quick load shows nothing) */
  delay?: number;
  onCancel?: () => void;
  strings?: Catalog | null;
};
export function LoadingOverlay({ active = true, fullPage = false, message, progress, delay = 0, onCancel, strings, children, className, ...rest }: LoadingOverlayProps) {
  const words = useStrings('loadingOverlay', strings) as { loading: string; cancel: string };
  const [shown, setShown] = React.useState(active && !delay);
  const content = React.useRef<HTMLDivElement>(null);
  const focused = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    if (!active) { setShown(false); return undefined; }
    if (!delay) { setShown(true); return undefined; }
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);
  // the content is inert while covered; the element that had focus inside it gets it back afterwards
  React.useEffect(() => {
    const el = content.current;
    if (!el || !shown) return undefined;
    const a = document.activeElement;
    focused.current = a && el.contains(a) ? a as HTMLElement : null;
    el.inert = true;
    return () => {
      el.inert = false;
      const back = focused.current; focused.current = null;
      if (back && back.isConnected && typeof back.focus === 'function') back.focus();
    };
  }, [shown]);
  const name = message || words.loading;
  const known = typeof progress === 'number' && !Number.isNaN(progress);
  return (
    <div className={cx('plx-loading-overlay', fullPage && 'plx-loading-overlay--page', className)} aria-busy={shown ? true : undefined} {...rest}>
      {children !== undefined ? <div ref={content} className="plx-loading-overlay__content">{children}</div> : null}
      {shown ? <Scrim variant="inverse" contained={!fullPage} lockScroll={fullPage} /> : null}
      {shown ? (
        <div className="plx-loading-overlay__status">
          {known ? <ProgressBar value={progress} label={name} showValue className="plx-loading-overlay__progress" />
            : <Spinner size="lg" label={name} />}
          {message && !known ? <span className="plx-loading-overlay__message" aria-hidden="true">{message}</span> : null}
          {onCancel ? <Button size="sm" onClick={onCancel}>{words.cancel}</Button> : null}
        </div>
      ) : null}
    </div>
  );
}
