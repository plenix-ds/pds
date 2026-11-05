/* Plenix · useIntersection
   Summary: Tells a component when an element enters or leaves the window or a scroll area (IntersectionObserver), without scroll handlers: to load a thumbnail just before it shows, fetch the next page near the end of a list, or mark a sticky header once the content passes under it.
   Usage:
     const ref = React.useRef(null);
     const { visible } = useIntersection(ref, { once: true, rootMargin: '--plx-ref-size-50u' });   // load once, a little early
     <div ref={ref}>{visible ? <img … /> : <Skeleton … />}</div>
     const { ratio } = useIntersection(ref, { threshold: [0, 0.5, 1] });                             // how much of it shows
     useIntersection(sentinel, { root: listRef, onChange: (e) => { if (e.isIntersecting) loadMore(); } });
   Props:
     ref: a ref to the element to watch
     options.root (null): a ref to the scroll area to watch in (or an element); the window when null
     options.rootMargin (null): a length token (a name such as '--plx-ref-size-50u', or a list of up to four for the top, right, bottom and left) that grows the area, so it fires before the element is in view; a negative margin is not offered
     options.threshold (0): the visible share, from 0 to 1 (or a list), at which it reports
     options.once (false): stops watching once the element has been visible, and stays visible
     options.disabled (false): does not watch
     options.onChange (null): called with each IntersectionObserverEntry
     returns { visible (at least the threshold shows), ratio (0 to 1), entry (the last IntersectionObserverEntry) }
   Behavior:
     The observer starts after the element is drawn and disconnects when the component unmounts, the element changes, or once it has been seen (once).
     Without IntersectionObserver (an old browser, a page drawn on the server) the element counts as visible, so nothing that depends on it is lost.
   Notes:
     It reports; it hides nothing. Content that loads as it scrolls into view keeps a placeholder of its final size (no layout shift), newly loaded results are announced politely (a live region), and a "Load more" button stays as the keyboard way to the next page.
     The margin is a token, never a number: the tokens are in rem, so it is converted to pixels with the page's root font size.
*/
import React from 'react';

export type IntersectionOptions = {
  root?: React.RefObject<Element | null> | Element | null; rootMargin?: string | string[] | null; threshold?: number | number[];
  once?: boolean; disabled?: boolean; onChange?: ((entry: IntersectionObserverEntry) => void) | null;
};
export type IntersectionState = { visible: boolean; ratio: number; entry: IntersectionObserverEntry | null };

// a length token as pixels for rootMargin ('--plx-ref-size-50u' -> '200px'); the tokens are written in rem
function marginOf(value: string | string[] | null): string {
  if (!value || typeof document === 'undefined') return '0px';
  const root = document.documentElement, size = parseFloat(getComputedStyle(root).fontSize);
  return ([] as string[]).concat(value).slice(0, 4).map((name) => {
    const v = getComputedStyle(root).getPropertyValue(name).trim(), n = parseFloat(v) || 0;
    return Math.round(/rem$/.test(v) ? n * size : n) + 'px';
  }).join(' ');
}

export function useIntersection(ref: React.RefObject<Element | null>, options: IntersectionOptions = {}): IntersectionState {
  const { root = null, rootMargin = null, threshold = 0, once = false, disabled = false, onChange = null } = options;
  const [state, setState] = React.useState<IntersectionState>({ visible: false, ratio: 0, entry: null });
  const seen = React.useRef(false);
  const change = React.useRef(onChange);
  change.current = onChange;
  const margin = ([] as string[]).concat(rootMargin || []).join(' '), steps = ([] as number[]).concat(threshold).join(' ');

  React.useEffect(() => {
    const el = ref && ref.current;
    if (!el || disabled || (once && seen.current)) return undefined;
    if (typeof IntersectionObserver === 'undefined') { seen.current = true; setState({ visible: true, ratio: 1, entry: null }); return undefined; }
    const area = root && 'current' in root ? root.current : (root as Element | null);
    const min = Math.min.apply(null, ([] as number[]).concat(threshold));
    const io = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      const visible = entry.isIntersecting && entry.intersectionRatio >= min;
      if (change.current) change.current(entry);
      setState({ visible: visible || (once && seen.current), ratio: entry.intersectionRatio, entry });
      if (visible && once) { seen.current = true; io.disconnect(); }
    }, { root: area || null, rootMargin: marginOf(rootMargin), threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, root, margin, steps, once, disabled]);   // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
