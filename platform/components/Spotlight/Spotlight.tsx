/* Plenix · Spotlight
   Summary: Draws the eye to one element: the rest of the window is dimmed in the scrim role while the element stays
     bright and usable (a cut-out), or a small pulsing beacon marks it without dimming anything (10 Patterns ›
     Onboarding and education › Spotlight). TeachingBubble turns it on for its target; a product tour uses it step by step.
   Usage:
     const ref = React.useRef(null);
     <Button ref={ref} icon="filter">Filters</Button>
     <Spotlight target={ref} open={step === 1} onDismiss={endTour} />                       the cut-out around the button
     <Spotlight target={ref} open variant="beacon" />                                        a pulsing beacon on its corner
     <div className="plx-u-relative"><Button ref={ref}>…</Button><Spotlight target={ref} open contained /></div>   within one region
   Props:
     target: the element to light: a ref to it (or the element itself)
     open: whether it shows (default false)
     variant: "cutout" (default: everything but the target is dimmed) | "beacon" (nothing is dimmed: a pulsing dot on the
       target's top end corner, in the brand color)
     contained: covers its nearest positioned parent instead of the window (a demo, one region of a page); default false
     onDismiss(): Escape runs it while it shows (leave it out when the layer above handles Escape, as TeachingBubble does)
     className: more classes on the spotlight
   Behavior:
     The cut-out is four dimmed panels around the target, --plx-comp-spotlight-padding clear of its edges, placed by CSS
       anchor positioning: they follow the target on scroll and resize, and nothing is measured or written as a style.
       The target is never covered, so it keeps its pointer, focus and actions; the dimmed panels take the pointer, so a
       press beside it does nothing. Focus is not trapped (the page stays reachable by keyboard).
     The spotlight is decoration: hidden from assistive technology; the explanation is the layer above it (a
       TeachingBubble, a dialog), which names what is lit.
     It fades in with the scrim's motion; the beacon pulses on the loop duration; with reduced motion neither moves.
     Where the browser has no anchor positioning (Chrome before 125, Safari before 26, Firefox before 147) the panels
       are placed from the target's measured box and the --plx-comp-spotlight-padding token, written by script as inline
       insets (runtime geometry, owner 2026-10-13: measured layout and tokens only, never a literal), and again on
       scroll and resize.
   Notes:
     One at a time, for one element at a time; never for errors or for what people must do to finish a task. Over the
       window it covers only the window (fixed); give a contained spotlight a positioned parent.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { useLayer } from '../../utils/layer.ts';
import { Portal } from '../../utils/portal.tsx';
import { FLOATING_ANCHOR } from '../../utils/floating.ts';
import { snapToGrid } from '../../utils/grid.ts';

const VARIANTS = ['cutout', 'beacon'];
const SIDES = ['top', 'bottom', 'start', 'end'];

export function Spotlight({ target, open = false, variant = 'cutout', contained = false, onDismiss, className }) {
  devWarn('Spotlight', { variant }, { variant: ['cutout','beacon'] });
  const v = VARIANTS.indexOf(variant) >= 0 ? variant : 'cutout';
  const root = React.useRef(null);
  const shown = !!open;
  useLayer(root, shown && !!onDismiss, { onEscape: onDismiss });
  // the target names the anchor (and, contained, the parent scopes it, so each region finds its own target)
  React.useLayoutEffect(() => {
    const el = target && 'current' in target ? target.current : target;
    if (!shown || !el || !el.setAttribute) return undefined;
    el.setAttribute('data-plx-spotlight-target', '');
    const scope = contained && root.current ? root.current.parentElement : null;
    if (scope) scope.setAttribute('data-plx-spotlight-scope', '');
    return () => { el.removeAttribute('data-plx-spotlight-target'); if (scope) scope.removeAttribute('data-plx-spotlight-scope'); };
  }, [shown, target, contained]);
  // no anchor positioning: the panels' insets from the target's measured box (runtime geometry, written by script)
  React.useLayoutEffect(() => {
    const el = target && 'current' in target ? target.current : target;
    if (!shown || FLOATING_ANCHOR || !el || !root.current) return undefined;
    // a length token in pixels (tokens are written in px or rem)
    const px = (name) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim(), n = parseFloat(v) || 0;
      return /rem$/.test(v) ? n * parseFloat(getComputedStyle(document.documentElement).fontSize) : n;
    };
    const place = () => {
      const box = root.current; if (!box) return;
      const host = contained ? box.parentElement.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
      const r = el.getBoundingClientRect();   // measured layout: not snapped
      const pad = snapToGrid(px('--plx-comp-spotlight-padding'));   // the clear space, a token, kept on the grid
      const W = host.right - host.left, Hh = host.bottom - host.top;
      const t = r.top - host.top - pad, b = host.bottom - r.bottom - pad, l = r.left - host.left - pad, e = host.right - r.right - pad;
      const set = (node, v) => { if (node) Object.keys(v).forEach((k) => node.style.setProperty(k, v[k] + 'px')); };   // inline: runtime geometry (owner 2026-10-13)
      const dim = (part) => box.querySelector('.plx-spotlight__dim--' + part);
      set(dim('top'), { top: 0, left: 0, right: 0, bottom: Hh - t });
      set(dim('bottom'), { top: Hh - b, left: 0, right: 0, bottom: 0 });
      set(dim('start'), { top: t, bottom: b, left: 0, right: W - l });
      set(dim('end'), { top: t, bottom: b, left: W - e, right: 0 });
      const half = snapToGrid(px('--plx-comp-spotlight-beacon-size') / 2);   // half the beacon's size token, on the grid
      set(box.querySelector('.plx-spotlight__beacon'), { top: r.top - host.top - half, left: r.right - host.left - half });
    };
    place();
    window.addEventListener('resize', place); window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [shown, target, contained, v]);
  if (!shown) return null;
  const layer = (
    <div ref={root} aria-hidden="true" className={cx('plx-spotlight', 'plx-spotlight--' + v, contained && 'plx-spotlight--contained', className)}>
      {v === 'cutout'
        ? SIDES.map((s) => <div key={s} className={'plx-spotlight__dim plx-spotlight__dim--' + s} />)
        : <span className="plx-spotlight__beacon" />}
    </div>
  );
  return contained ? layer : <Portal>{layer}</Portal>;
}
