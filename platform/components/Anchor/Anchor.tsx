/* Plenix · Anchor
   Summary: A list of the sections of a page (a page jump list, "On this page"): choosing one scrolls to it, and the section
     in view is marked as the person scrolls (06 Navigation & Discovery › Local navigation).
   Usage:
     <Anchor items={[{ id: 'intro', label: 'Introduction' }, { id: 'rights', label: 'Usage rights', children: [{ id: 'licenses', label: 'Licenses' }] }]} />
     <Anchor items={sections} scrollRef={mainRef} label="Contents of this guide" />   // a scrolling region instead of the page
     <Anchor items={sections} value={current} onChange={setCurrent} />                   // the application follows or sets the current section
   Props:
     items: the sections, in the order they appear: [{ id, label, children }]; id is the id of the element on the page that starts the section (a heading); children
       are subsections, the same shape, one level
     label: the accessible name of the navigation (default "On this page", strings.label)
     scrollRef: a ref to the scrolling region the sections are in (default: the page)
     value: a string or null: the id of the current section (controlled; null when none is); without it the current section follows the scroll
     onChange(id): runs when the current section changes, by scrolling or by a choice; not for the first reading when it is drawn
     strings: the words it shows and announces, for other languages: { label: "On this page" }
     className: more classes on the navigation
   Behavior:
     Each section is a link to its id (it works as an ordinary link without scripts, and opens in a new tab). A press scrolls the page or region to the section
       (smoothly, or at once for people who ask for less motion) and moves focus to it, so keyboard and screen reader users continue from there; the page's address is left as it is.
     The current section is the last whose start has reached the top of the region (its scroll margin counts: give the targets scroll-margin-block-start to clear a fixed header); at the end of the page it
       is the last section. It is read from the layout when the region scrolls, in a frame at a time, and when the window is resized or the sections change.
     The current link carries aria-current="location" and the selected look of a navigation row (NavList's current row).
   Notes:
     A section whose element is not on the page is listed and does nothing. Rows wrap; a long name is never cut.
     For long pages with sections: a short page does not need it. The navigation pane's own sections are NavList.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { reducedMotion as reduced } from '../../utils/tokenTime.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';

type AnchorItem = { id: string; label: React.ReactNode; children?: AnchorItem[] };
const flatten = (items: AnchorItem[], out: AnchorItem[] = []): AnchorItem[] => { items.forEach((it) => { out.push(it); if (it.children) flatten(it.children, out); }); return out; };
// how long a press keeps its section current while the smooth scroll passes the others
const HOLD = 900;

/** @public */
export type AnchorProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> & {
  /** the sections: { id, label, children? }; each id is the id of an element on the page */
  items?: AnchorItem[];
  /** the navigation's accessible name; default strings.label */
  label?: string;
  /** the scrolling area the sections sit in; default the window */
  scrollRef?: React.RefObject<HTMLElement | null>;
  /** the current section's id (controlled) */
  value?: string | null;
  onChange?(id: string): void;
  strings?: Catalog | null;
};
export function Anchor({ items = [], label, scrollRef, value, onChange, strings, className, ...rest }: AnchorProps) {
  const t = useStrings('anchor', strings) as { label: string };
  const nav = React.useRef<HTMLElement>(null);
  const [own, setOwn] = React.useState<string | null>(null);
  const controlled = value !== undefined;
  const current: string | null = controlled ? (value as string | null) : own;
  const now = React.useRef(current), change = React.useRef(onChange), until = React.useRef(0), measureNow = React.useRef<(() => void) | null>(null), mounted = React.useRef(false);
  now.current = current; change.current = onChange;
  // quiet: the first reading when it is drawn sets the current section without telling onChange (it is not a change)
  const set = (id: string, quiet?: boolean) => { if (id === now.current) return; now.current = id; if (!controlled) setOwn(id); if (change.current && !quiet) change.current(id); };
  const flat = flatten(items), ids = flat.map((i) => i.id).join('|');
  const pageOf = () => (nav.current && nav.current.ownerDocument) || document;

  React.useEffect(() => {
    const area = scrollRef && scrollRef.current, doc = pageOf(), view = doc.defaultView || window;
    const scroller = area || view;
    let frame = 0;
    const measure = (quiet?: boolean) => {
      frame = 0;
      if (performance.now() < until.current) return;
      const top = area ? area.getBoundingClientRect().top : 0;
      const there = flat.map((i) => ({ id: i.id, el: doc.getElementById(i.id) })).filter((x): x is { id: string; el: HTMLElement } => !!x.el);
      if (!there.length) return;
      let found = there[0].id;
      there.forEach((x) => { const margin = parseFloat(view.getComputedStyle(x.el).scrollMarginTop) || 0; if (x.el.getBoundingClientRect().top <= top + margin + 1) found = x.id; });
      const atEnd = area ? area.scrollTop + area.clientHeight >= area.scrollHeight - 1 : view.innerHeight + view.scrollY >= doc.documentElement.scrollHeight - 1;
      const scrolled = area ? area.scrollTop > 0 : view.scrollY > 0;   // a page too short to scroll does not jump to its last section
      set(atEnd && scrolled ? there[there.length - 1].id : found, quiet === true);
    };
    measureNow.current = () => measure();
    const onScroll = () => { if (!frame) frame = view.requestAnimationFrame(() => measure()); };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    view.addEventListener('resize', onScroll);
    if (!mounted.current) { mounted.current = true; measure(true); } else measure();
    return () => { scroller.removeEventListener('scroll', onScroll); view.removeEventListener('resize', onScroll); if (frame) view.cancelAnimationFrame(frame); measureNow.current = null; };
  }, [ids, scrollRef]);   // eslint-disable-line react-hooks/exhaustive-deps

  const go = (e: React.MouseEvent, id: string) => {
    const el = pageOf().getElementById(id);
    e.preventDefault();
    if (!el) return;
    until.current = performance.now() + HOLD;
    el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    if (!el.matches('a[href],button,input,select,textarea,[tabindex]')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    set(id);
    setTimeout(() => { if (measureNow.current) measureNow.current(); }, HOLD + 50);
  };

  const list = (rows: AnchorItem[], nested: boolean): React.ReactElement => (
    <ul className={cx('plx-anchor__list', nested && 'plx-anchor__list--nested')}>
      {rows.map((it) => (
        <li key={it.id} className="plx-anchor__item">
          <a href={'#' + it.id} className={cx('plx-anchor__link', it.id === current && 'is-current')} aria-current={it.id === current ? 'location' : undefined} onClick={(e) => go(e, it.id)}>{it.label}</a>
          {it.children && it.children.length ? list(it.children, true) : null}
        </li>
      ))}
    </ul>
  );
  return <nav ref={nav} aria-label={label || t.label} className={cx('plx-anchor', className)} {...rest}>{list(items, false)}</nav>;
}
