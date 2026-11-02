/* Plenix · Scrim
   Summary: The translucent layer behind a modal layer or over a busy region that dims what is under it and takes its
     clicks (09 Overlays › Layer behavior › Backdrop / scrim).
   Usage:
     <Scrim onClick={close} />                          a modal layer's backdrop over the window
     <Scrim variant="light" contained />                 over one region (its positioned parent)
     <Scrim variant="inverse" contained />              a veil in the page color, behind a loading indicator
   Props:
     variant: "modal" (default; the scrim role at the middle opacity: dialogs, drawers, sheets) | "light" (the scrim role at
       the low opacity: a non-blocking dim, a drawer over a narrow window) | "inverse" (the canvas at the high opacity: a
       veil that keeps the content faintly readable, behind a loading indicator)
     contained: covers its nearest positioned parent instead of the window (default false)
     lockScroll: stops the page scrolling while the scrim is shown (default: true over the window, false when contained)
     onClick(event): runs on a click on the scrim (a modal layer closes when it is safe to); without it the click does nothing
     className: more classes on the scrim
   Behavior:
     The scrim is decoration: it is hidden from assistive technology and is never a Tab stop. The modal layer above it makes
       the page inert and traps focus (utils/layer.ts); the scrim only shows that the page is unavailable and takes the
       pointer.
     It fades in with the modal layer (motion-fade-in at the fast duration); with reduced motion it appears at once.
     Over the window it stops the page scrolling (utils/scrollLock.ts) for as long as it is shown; locks are counted, so
       nested layers release the page only when the last one closes.
   Notes:
     Never put text or controls on the scrim: they go in the layer above it. One scrim at a time.
     Dialog, Drawer and Sheet draw their own backdrop today; they adopt Scrim in a later wave.
     Other props pass through to the <div>.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { useScrollLock } from '../../utils/scrollLock.ts';

const VARIANTS = ['modal', 'light', 'inverse'];

export function Scrim({ variant = 'modal', contained = false, lockScroll, onClick, className, ...rest }) {
  devWarn('Scrim', { variant }, { variant: ['modal','light','inverse'] });
  const v = VARIANTS.indexOf(variant) >= 0 ? variant : 'modal';
  useScrollLock(lockScroll !== undefined ? !!lockScroll : !contained);
  return (
    <div className={cx('plx-scrim', 'plx-scrim--' + v, contained && 'plx-scrim--contained', className)} aria-hidden="true" onClick={onClick} {...rest} />
  );
}
