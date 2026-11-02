/* Plenix · Carousel
   Summary: A set of equal items shown one (or a few) at a time in a strip people move through: Previous and Next
     buttons, a dot for each page, swipe on touch and drag with the mouse. It never moves by itself unless the page asks
     for autoplay, and then it shows a Pause button and stops while it is pointed at or holds focus (WCAG 2.2.2).
   Usage:
     <Carousel label="Featured assets">{assets.map((a) => <MediaCard key={a.id} {...a} />)}</Carousel>
     <Carousel label="Recent uploads" perView={3}>{…}</Carousel>
     <Carousel label="Announcements" controls="dots" autoplay>{…}</Carousel>
   Props:
     label: the carousel's accessible name (required)
     children: the slides, one child each (cards, images, short panels of equal weight)
     perView: how many slides show at once: 1 (default) | 2 | 3 | 4; with more than one, a part of the next slide shows
       at the end so people see there is more; in a strip too narrow for the least slide width
       (--plx-comp-carousel-slide-min) fewer show, down to one
     controls: "both" (default: Previous and Next and the dots) | "arrows" | "dots"
     autoplay: the pages advance by themselves every --plx-comp-carousel-autoplay-interval (default false); a Pause
       button shows; people who ask their system for less motion get it paused
     page, onPageChange(page): the page shown (0-based), when the page controls it; otherwise the carousel keeps its own
     strings: the words, for other languages: { slide: "{n} of {total}", previous: "Previous slide", next: "Next slide",
       goTo: "Go to slide {n}", goToPage: "Go to page {n}" (perView above 1), pages: "Slides", strip: "Slides",
       pause: "Pause", play: "Play", pauseLabel: "Pause the slides", playLabel: "Play the slides" }
     className: more classes on the carousel
   Behavior:
     The strip scrolls sideways and snaps to a slide: touch and trackpads scroll it, a mouse drags it (useGesture: a swipe
       goes to the next or the previous page), and in focus the arrow keys scroll it. Previous and Next move one page and
       turn off at the ends; a dot goes to its page. The page in view is read from the scroll position.
     The carousel is a region named by label with the role description "carousel"; each slide a group named "2 of 5".
       While it is still, the strip is a polite live region so a page change is read; while it plays, it is not.
     Autoplay waits while the pointer is over the carousel or focus is in it, and stops for good once Pause is pressed;
       after the last page it starts again from the first.
   Notes:
     Do not hide what people need in later slides: put it on the page. For a long set use a grid or a list. On iOS this
       is a paged scroll view with the system page control; on Android, Material's carousel.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { isRtl } from '../../utils/direction.ts';
import { tokenMs, reducedMotion as reduced } from '../../utils/tokenTime.ts';
import { useGesture } from '../../hooks/useGesture.ts';
import { Button } from '../Button/Button.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ChevronLeftIcon from 'plenix-platform/icons/plenix/chevron-left';
import ChevronRightIcon from 'plenix-platform/icons/plenix/chevron-right';
import { fill } from '../../utils/fill.ts';

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

export function Carousel({ label, children, perView = 1, controls = 'both', autoplay = false, page: pageProp, onPageChange, strings, className, ...rest }) {
  const t = useStrings('carousel', strings);
  const slides = React.Children.toArray(children).filter(Boolean);
  const n = slides.length;
  const asked = clamp(Math.round(perView) || 1, 1, 4);
  const [room, setRoom] = React.useState(0);   // the strip's width in px, 0 until measured
  const [minSlide, setMinSlide] = React.useState(0);   // --plx-comp-carousel-slide-min in px
  // the slides keep their least width: in a narrow strip fewer show at once (320px wide: one, with the next peeking)
  const per = room && minSlide ? clamp(Math.floor(room / minSlide), 1, asked) : asked;
  const pages = Math.max(1, Math.ceil(n / per));
  const [own, setOwn] = React.useState(0);
  const page = clamp(pageProp !== undefined ? pageProp : own, 0, pages - 1);
  const [playing, setPlaying] = React.useState(() => !!autoplay && !reduced());
  const [held, setHeld] = React.useState(false);   // pointer over it or focus in it: autoplay waits
  const root = React.useRef(null), track = React.useRef(null), shown = React.useRef(0);
  const setPage = (p) => { if (pageProp === undefined) setOwn(p); if (onPageChange && p !== page) onPageChange(p); };

  // the strip's width and the least slide width, kept current as the room changes
  React.useLayoutEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    const measure = () => {
      const v = parseFloat(getComputedStyle(el).getPropertyValue('--plx-comp-carousel-slide-min'));
      setMinSlide(v > 0 ? v : 0); setRoom(el.clientWidth);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // scrolls the strip so the page's first slide is at its start edge
  const scrollTo = React.useCallback((p) => {
    const el = track.current;
    if (!el || !el.children.length) return;
    const slide = el.children[clamp(p * per, 0, Math.max(0, n - per))];
    const a = slide.getBoundingClientRect(), b = el.getBoundingClientRect();
    const delta = isRtl(el) ? a.right - b.right : a.left - b.left;
    el.scrollBy({ left: delta, behavior: reduced() ? 'auto' : 'smooth' });
  }, [per, n]);
  const go = (p) => { const q = clamp(p, 0, pages - 1); setPage(q); scrollTo(q); };

  // the page in view, from the scroll position (the strip may have been scrolled by touch, a trackpad or the keys). The
  // listener is added once; it reads the current page and counts from a ref, so a render does not re-add it (#882)
  const latest = React.useRef(null);
  latest.current = { page, pages, per, setPage };
  React.useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    let frame = 0;
    const read = () => {
      frame = 0;
      const { page, pages, per, setPage } = latest.current;
      if (el.children.length < 1) return;
      const first = el.children[0].getBoundingClientRect(), second = el.children[1] ? el.children[1].getBoundingClientRect() : null;
      const pitch = second ? Math.abs(second.left - first.left) : first.width;
      const offset = Math.abs(el.scrollLeft), max = el.scrollWidth - el.clientWidth;
      const p = Math.ceil(offset) >= max ? pages - 1 : clamp(Math.round(offset / (pitch || 1) / per), 0, pages - 1);
      if (p !== page) setPage(p);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    el.addEventListener('scroll', onScroll, { passive: true });
    if (shown.current !== per) { if (shown.current) onScroll(); shown.current = per; }   // fewer or more slides at once move the pages under the same scroll position: read them again
    return () => { el.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);

  // a page set from outside scrolls the strip
  React.useEffect(() => { if (pageProp !== undefined) scrollTo(pageProp); }, [pageProp]);

  // a mouse drags the strip: a swipe toward the start goes on, toward the end goes back (touch scrolls natively)
  useGesture(track, { axis: 'x', disabled: n < 2, onSwipe: (g) => { if (g.inline === 'start') go(page + 1); else if (g.inline === 'end') go(page - 1); } });

  // autoplay: the next page every interval while playing and not held; after the last page, the first
  React.useEffect(() => {
    if (!autoplay || !playing || held || pages < 2) return undefined;
    const ms = tokenMs('--plx-comp-carousel-autoplay-interval', 6000, root.current);
    const id = setTimeout(() => go(page + 1 >= pages ? 0 : page + 1), ms);
    return () => clearTimeout(id);
  }, [autoplay, playing, held, page, pages]);
  React.useEffect(() => { if (!autoplay) setPlaying(false); }, [autoplay]);

  const hold = {
    onPointerEnter: () => setHeld(true), onPointerLeave: () => setHeld(false),
    onFocus: () => setHeld(true), onBlur: (e) => { if (!root.current || !root.current.contains(e.relatedTarget)) setHeld(false); },
  };
  const arrows = controls !== 'dots' && pages > 1, dots = controls !== 'arrows' && pages > 1;
  const live = autoplay && playing ? 'off' : 'polite';

  return (
    <section ref={root} aria-roledescription="carousel" aria-label={label} className={cx('plx-carousel', per > 1 && 'plx-carousel--multiple', className)} data-plx-per-view={per} {...hold} {...rest}>
      <div ref={track} className="plx-carousel__track" tabIndex={0} aria-label={t.strip} aria-live={live}>
        {slides.map((s, i) => (
          <div key={s.key || i} role="group" aria-roledescription="slide" aria-label={fill(t.slide, { n: i + 1, total: n })} className="plx-carousel__slide">{s}</div>
        ))}
      </div>
      {arrows || dots || autoplay ? (
        <div className="plx-carousel__controls">
          {autoplay ? (
            <Button size="sm" variant="ghost" className="plx-carousel__play" aria-label={playing ? t.pauseLabel : t.playLabel}
              onClick={() => setPlaying(!playing)}>{playing ? t.pause : t.play}</Button>
          ) : null}
          {arrows ? <Button size="sm" iconOnly icon={ChevronLeftIcon} label={t.previous} className="plx-carousel__previous" disabled={page <= 0} onClick={() => go(page - 1)} /> : null}
          {dots ? (
            <div className="plx-carousel__dots" role="group" aria-label={t.pages}>
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} type="button" className={cx('plx-carousel__dot', i === page && 'is-current')} aria-current={i === page ? 'true' : undefined}
                  aria-label={fill(per > 1 ? t.goToPage : t.goTo, { n: i + 1 })} onClick={() => go(i)} />
              ))}
            </div>
          ) : null}
          {arrows ? <Button size="sm" iconOnly icon={ChevronRightIcon} label={t.next} className="plx-carousel__next" disabled={page >= pages - 1} onClick={() => go(page + 1)} /> : null}
        </div>
      ) : null}
    </section>
  );
}
