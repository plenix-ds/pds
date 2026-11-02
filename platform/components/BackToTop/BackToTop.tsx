/* Plenix · BackToTop
   Summary: A button that takes a long page back to its top (04 Actions & Commands › Common actions › Back to top):
     floating at the end of the window's bottom edge once the page has scrolled about a screen, or inline at the end of
     the content.
   Usage:
     <BackToTop />                                         // first in the page's content: floats once it has scrolled a screen
     <BackToTop scrollRef={mainRef} focusRef={titleRef} /> // a scrolling region, and where focus goes
     <BackToTop variant="inline" />                        // at the end of a long article
   Props:
     variant: "floating" (default; an icon button at the end of the window's bottom edge, shown after a screen of
       scrolling) | "inline" (a labeled button in the flow, always shown)
     scrollRef: a ref to the scrolling region that goes back to its top (default: the page)
     focusRef: a ref to the element that takes focus at the top (default: the region's first level 1 heading, else its
       main landmark, else the region)
     strings: the words it shows and announces, for other languages: { label: "Back to top" }
     className: more classes on the button
   Behavior:
     Floating: render it first in the scrolling content. A sentinel as tall as the reveal distance
       (--plx-comp-back-to-top-reveal-distance, one window height) sits where it is drawn; useIntersection watches it in the
       scroll region, so the button shows once the sentinel has left the view, without scroll handlers. Hidden, it is out
       of the Tab order.
     A press scrolls the region to its top (smoothly, or at once for people who ask for less motion) and moves focus to
       the top (focusRef), so keyboard and screen reader users continue from there.
   Notes:
     For long pages only; not in panes with their own short scroll, nor where a fixed header already holds the way up.
     The button is a Button (secondary, with the arrow-up icon: Material's arrow_upward); its target is at least the standard control height.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { reducedMotion as reduced } from '../../utils/tokenTime.ts';
import { Button } from '../Button/Button.tsx';
import { useIntersection } from '../../hooks/useIntersection.ts';
import ArrowUpIcon from 'plenix-platform/icons/plenix/arrow-up';
import { useStrings } from '../../providers/LocaleProvider.tsx';


export function BackToTop({ variant = 'floating', scrollRef, focusRef, strings, className }) {
  devWarn('BackToTop', { variant }, { variant: ['floating','inline'] });
  const t = useStrings('backToTop', strings);
  const floating = variant !== 'inline';
  const sentinel = React.useRef(null);
  const { visible: atTop, entry } = useIntersection(sentinel, { root: scrollRef || null, disabled: !floating });
  // shown once the sentinel has been measured and is out of view (not before the first report)
  const shown = floating && !!entry && !atTop;
  const goTop = () => {
    const area = scrollRef && scrollRef.current;
    const behavior = reduced() ? 'auto' : 'smooth';
    if (area) area.scrollTo({ top: 0, behavior }); else window.scrollTo({ top: 0, behavior });
    const root = area || document;
    let target = (focusRef && focusRef.current) || root.querySelector('h1') || root.querySelector('main, [role="main"]') || area;
    if (!target) return;
    if (!target.matches('a[href],button,input,select,textarea,[tabindex]')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };
  if (!floating) {
    return <Button variant="ghost" size="sm" icon={ArrowUpIcon} className={cx('plx-back-to-top', 'plx-back-to-top--inline', className)} onClick={goTop}>{t.label}</Button>;
  }
  return (
    <span className="plx-back-to-top__anchor">
      <span ref={sentinel} className="plx-back-to-top__sentinel" aria-hidden="true" />
      <Button iconOnly icon={ArrowUpIcon} label={t.label} className={cx('plx-back-to-top', 'plx-back-to-top--floating', shown && 'is-shown', className)} onClick={goTop} />
    </span>
  );
}
