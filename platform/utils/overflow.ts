/* Plenix · overflow (platform/utils/overflow.ts). Internal; not part of the public API.
   A one-row list whose items move into a "More" menu when they do not fit. The list wraps (flex-wrap) inside a box one
   row high that clips the rest. Its children, in DOM order (which is also the focus order), are the shown items, the
   More control (data-plx-overflow-more) and then the hidden items (each item: data-plx-overflow-item; render them with
   splitAt). useOverflow(listRef, count, key)
   returns how many items are shown: it starts from all of them whenever the width, the count or `key` (anything that
   changes the items' widths, such as their labels) changes, and lowers the number, before the browser paints, until the
   shown items and the More control are all on the first row. Items past that number are made inert. */
import React from 'react';

const firstRowTop = (list: Element) => Math.min.apply(null, Array.prototype.map.call(list.children, (el: HTMLElement) => el.offsetTop) as number[]);

export function useOverflow(listRef: React.RefObject<HTMLElement | null>, count: number, key?: unknown): number {
  const [fit, setFit] = React.useState(count);
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => { setFit(count); }, [count, key, width]);
  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => setWidth(list.clientWidth));
    ro.observe(list);
    return () => ro.disconnect();
  }, []);
  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || !list.children.length) return;
    const items = list.querySelectorAll<HTMLElement>(':scope > [data-plx-overflow-item]');
    const more = list.querySelector<HTMLElement>(':scope > [data-plx-overflow-more]');
    const top = firstRowTop(list);
    let fits = !(more && more.offsetTop !== top);
    for (let i = 0; i < Math.min(fit, items.length); i += 1) if (items[i].offsetTop !== top) fits = false;
    Array.prototype.forEach.call(items, (el: HTMLElement, i: number) => {
      if (i >= fit) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
      else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
    });
    if (!fits && fit > 0) setFit(fit - 1);
  });
  return Math.min(fit, count);
}

/* the list's children in DOM order: the first `fit` items, the More control, the rest */
export const splitAt = <T,>(items: T[], fit: number, more?: T | null): T[] => items.slice(0, fit).concat(more ? [more] : [], items.slice(fit));

/* useTruncated(ref) (batch 270): true while the element's text is cut short (shown with an ellipsis), so its full text can be offered in a
   Tooltip: cut across one line (wider than the box) or cut after several lines (taller than the box, issue 502); checked again whenever the element's size changes.
   An <input> is cut when its value is wider than its box (issue 558); it is checked again as people type. `key` (optional): anything that changes the text,
   such as a value set from outside; it is checked again when it changes. `on` (default true): false checks nothing and returns false. */
/* isCut(el) (ADR 0047): the one measure of "is this text cut": wider than its box (an ellipsis on one line) or taller than it (a line clamp). Text's Show more,
   the DataGrid cell's full-text Tooltip and the corner icon (FullTextAction) all read it. */
export const isCut = (el: HTMLElement): boolean => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;

export function useTruncated(ref: React.RefObject<HTMLElement | null>, key?: unknown, on = true): boolean {
  const [cut, setCut] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !on) { setCut(false); return undefined; }
    const line = el.tagName === 'INPUT';
    const check = () => setCut(line ? el.scrollWidth > el.clientWidth + 1 : isCut(el));
    check();
    if (line) el.addEventListener('input', check);
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(check);
    if (ro) ro.observe(el);
    return () => { if (ro) ro.disconnect(); if (line) el.removeEventListener('input', check); };
  }, [ref, key, on]);
  return cut;
}

/* inBar(el) (issue 558): the element sits in a bar or a header that sizes its fields (a "content" pattern of layout.json: layout-modes.css gives it
   --plx-comp-field-context-content-max-inline-size). useInBar(ref, not): the same, read once the element is on the page; false inside an element that
   matches the selector `not` (the field is part of a larger control there, such as an InputGroup). */
const inBar = (el: Element | null | undefined): boolean => !!el && typeof getComputedStyle === 'function' && getComputedStyle(el).getPropertyValue('--plx-comp-field-context-content-max-inline-size').trim() !== '';
export function useInBar(ref: React.RefObject<HTMLElement | null>, not?: string | null): boolean {
  const [bar, setBar] = React.useState(false);
  React.useLayoutEffect(() => { const el = ref.current; setBar(inBar(el) && !(not && el!.closest(not))); }, [ref, not]);
  return bar;
}
