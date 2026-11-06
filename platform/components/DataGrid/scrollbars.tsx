/* Plenix · DataGridEngine scrollbars
   Summary: Floating pointer scroll controls for the React-owned viewport.
   Usage: <Scrollbars holder={holderRef}/>
   Props: A scrollable element ref; hideX: no sideways control (the row cards of a narrow grid never scroll sideways, issue 679).
   Behavior: CSS scroll timelines position the token-sized thumbs; pointer dragging writes native scroll offsets.
   Notes: Browsers without timeline and anchor support retain their native scrollbars. The thumb carries its axis
     (__thumb--x, --y) and its size (data-plx-thumb) itself, so its rules need no track above it. */
import React from 'react';
import { isRtl } from '../../utils/direction.ts';
export function Scrollbars({ holder, viewportId, hideX = false }: { holder: any; viewportId: any; hideX?: boolean }) {
  const thumbs = React.useRef<Record<string, any>>({});
  const [sizes, setSizes] = React.useState<any>({}),
    [drag, setDrag] = React.useState(null);
  React.useLayoutEffect(() => {
    const el = holder.current;
    if (!el) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const ratio = (size: any, total: any) =>
        total > size ? Math.max(10, Math.min(95, Math.round((size / total) * 20) * 5)) : null;
      // the sideways bar floats on the bottom edge: the scroll body keeps its room clear while it scrolls sideways (issue 272)
      el.toggleAttribute('data-plx-scroll-x', el.scrollWidth > el.clientWidth);
      setSizes((old: any) => {
        const next = { x: ratio(el.clientWidth, el.scrollWidth), y: ratio(el.clientHeight, el.scrollHeight) };
        return next.x === old.x && next.y === old.y ? old : next;
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    const position = () => {
      for (const axis of ['x', 'y']) {
        const total = axis === 'y' ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth,
          offset = axis === 'y' ? el.scrollTop : Math.abs(el.scrollLeft);
        thumbs.current[axis]?.setAttribute('aria-valuenow', String(total ? Math.round((offset / total) * 100) : 0));
      }
    };
    el.addEventListener('scroll', position, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    const mutation = new MutationObserver(schedule);
    mutation.observe(el, { childList: true, subtree: true });
    read();
    return () => {
      observer.disconnect();
      mutation.disconnect();
      el.removeEventListener('scroll', position);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [holder]);
  const start = (event: any, axis: any) => {
    if (event.button !== 0) return;
    const el = holder.current,
      track = event.currentTarget.classList.contains('plx-data-grid__thumb')
        ? event.currentTarget.parentElement
        : event.currentTarget,
      box = track.getBoundingClientRect(),
      vertical = axis === 'y',
      total = vertical ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth,
      travel = (vertical ? box.height : box.width) * (1 - sizes[axis] / 100),
      at = vertical ? event.clientY : event.clientX,
      initial = vertical ? el.scrollTop : Math.abs(el.scrollLeft),
      pointer = event.pointerId;
    let origin = initial;
    if (travel <= 0 || total <= 0) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget === track) {
      const point = vertical
          ? event.clientY - box.top
          : isRtl(el)
            ? box.right - event.clientX
            : event.clientX - box.left,
        thumb = (vertical ? box.height : box.width) - travel;
      origin = Math.max(0, Math.min(total, ((point - thumb / 2) / travel) * total));
      if (vertical) el.scrollTop = origin;
      else el.scrollLeft = isRtl(el) ? -origin : origin;
    }
    event.currentTarget.setPointerCapture(pointer);
    setDrag(axis);
    const node = event.currentTarget;
    const move = (e: any) => {
      const value = Math.max(
        0,
        Math.min(
          total,
          origin + (((vertical ? e.clientY : e.clientX) - at) / travel) * total * (vertical || !isRtl(el) ? 1 : -1)
        )
      );
      if (vertical) el.scrollTop = value;
      else el.scrollLeft = isRtl(el) ? -value : value;
    };
    const end = () => {
      setDrag(null);
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerup', end);
      node.removeEventListener('pointercancel', end);
    };
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerup', end);
    node.addEventListener('pointercancel', end);
  };
  return ['x', 'y'].map((axis) => (
    <div
      key={axis}
      className={'plx-data-grid__scroll plx-data-grid__scroll--' + axis}
      aria-hidden="true"
      onPointerDown={(event) => start(event, axis)}
      data-plx-thumb={(axis === 'x' && hideX ? null : sizes[axis]) || undefined}
      data-plx-dragging={drag === axis ? '' : undefined}
    >
      <div
        ref={(node) => {
          thumbs.current[axis] = node;
        }}
        className={'plx-data-grid__thumb plx-data-grid__thumb--' + axis}
        data-plx-thumb={(axis === 'x' && hideX ? null : sizes[axis]) || undefined}
        data-plx-scroll-viewport={viewportId}
        onPointerDown={(event) => start(event, axis)}
      />
    </div>
  ));
}
