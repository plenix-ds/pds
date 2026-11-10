/* Plenix · MediaViewer
   Summary: A full-screen preview of images and videos, one at a time (the lightbox).
   Usage:
     <MediaViewer open={open} onClose={close} items={[{ src, alt, title, meta: ['JPG', '2.4 MB'] }]}
       index={at} onIndexChange={(next) => …} actions={<…/>} />
   Props:
     open: whether the viewer is shown
     onClose(): runs from the close button and Escape
     items: [{ src, alt, title, meta, kind: "image" | "video", poster, audio, tracks }]
       Videos use MediaPlayer; audio is a separate sound URL. Leaving or closing an item pauses its playback.
     count, getItem(index): for a long list, instead of items. getItem builds item i and is called only for the shown item and its
       previous and next, once each per open (kept until count or getItem changes). It must be cheap and pure: build heavy
       fields such as formatted meta inside it. Only one of the pair is ignored with a dev warning; with items too, the pair wins.
     items[].meta: an array of short technical values shown under the title
     index: the shown item, when controlled
     defaultIndex: the first shown item, when uncontrolled (default 0)
     onIndexChange(next): runs with the new index when the item changes
     label: the accessible name of the viewer (default strings.label: "Preview")
     actions: extra controls under the image (give them the class plx-media-viewer__control)
     className: more classes on the viewer
     strings: the words it shows and announces, for other languages: { label: "Preview", close: "Close preview",
       previous: "Previous", next: "Next", counter: "{index} of {total}" }
   Behavior:
     Arrow Left / Right go to the previous / next item in reading order (in a right-to-left page Arrow Right goes back);
     with more than one item there are also Previous and Next buttons.
     Swipe an image or the stage background to move; native media controls keep their own gestures and arrow keys.
     Going past the last item wraps to the first, and back.
     Escape closes.
     Focus stays inside and returns to the opener.
     A counter ("2 of 5") describes the viewer.
     With no items nothing renders.
   Notes:
     The viewer renders in a portal on document.body.
*/
import { dataWhenText, dataPhrase } from '../../utils/dataText.tsx';
import React from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx.ts';
import { useLayer, useUid } from '../../utils/layer.ts';
import { MediaPlayer } from '../MediaPlayer/MediaPlayer.tsx';
import type { MediaTrack } from '../MediaPlayer/MediaPlayer.tsx';
import { useGesture } from '../../hooks/useGesture.ts';
import { Icon } from '../Icon/Icon.tsx';
import { arrowStep } from '../../utils/direction.ts';
import { development } from '../../utils/devWarn.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';
import CloseIcon from 'plenix-platform/icons/plenix/close';


// one picture or video in the viewer
export type MediaViewerItem = { src: string; alt?: string; title?: string; meta?: React.ReactNode[]; kind?: 'image' | 'video'; poster?: string; audio?: string; tracks?: MediaTrack[] };
export type MediaViewerProps = {
  open?: boolean;
  onClose?: () => void;
  items?: MediaViewerItem[];
  /** with getItem: how many items there are, for a long list the app does not want to build up front. Both together replace items */
  count?: number;
  /** with count: builds item i. Called only for the shown item and its previous and next, once each per open. Must be cheap and pure */
  getItem?: (index: number) => MediaViewerItem;
  /** the shown item, when controlled */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** the viewer's accessible name */
  label?: string;
  actions?: React.ReactNode;
  strings?: Catalog | null;
  className?: string;
};
const NO_ITEMS: MediaViewerItem[] = [];
export function MediaViewer({ open, onClose, items: itemsProp, count, getItem, index, defaultIndex = 0, onIndexChange, label, actions, strings, className }: MediaViewerProps) {
  const t = useStrings('mediaViewer', strings) as Record<string, string>;
  const ref = React.useRef<HTMLDivElement>(null);
  const id = useUid('plx-mv');
  const [own, setOwn] = React.useState(defaultIndex);
  const at = index !== undefined ? index : own;
  useLayer(ref, open, { modal: true, onEscape: onClose });
  const lazy = typeof count === 'number' && typeof getItem === 'function';
  const items = itemsProp || NO_ITEMS;
  const total = lazy ? count : items.length;
  const memo = React.useRef<{ get?: typeof getItem; count?: number; open?: boolean; made: Map<number, MediaViewerItem> }>({ made: new Map() });
  if (memo.current.get !== getItem || memo.current.count !== count || memo.current.open !== !!open) memo.current = { get: getItem, count, open: !!open, made: new Map() };
  const warned = React.useRef('');
  React.useEffect(() => {
    const problem = (count === undefined) !== (getItem === undefined) ? 'count and getItem go together; only one was given, so items is used.'
      : lazy && itemsProp ? 'count and getItem were given with items; count and getItem win.' : '';
    if (problem && development() && warned.current !== problem) { warned.current = problem; console.warn('MediaViewer: ' + problem); }
  }, [count, getItem, itemsProp, lazy]);
  const build = (i: number): MediaViewerItem | undefined => {
    if (!lazy || !open || !total) return items[i];
    const k = ((i % total) + total) % total, made = memo.current.made;
    if (!made.has(k)) made.set(k, getItem(k));
    return made.get(k);
  };
  if (lazy && open && total) { build(at - 1); build(at + 1); }
  const go = (n: number) => { const next = (n + total) % total; if (index === undefined) setOwn(next); if (onIndexChange) onIndexChange(next); };
  const item = build(at) || build(0);
  const many = total > 1;
  const stage = React.useRef<HTMLDivElement>(null);
  useGesture(stage, { disabled: !open || !many, axis: 'x', onSwipe: gesture => go(at + (gesture.inline === 'start' ? 1 : -1)) });
  if (!open || !total || !item) return null;
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!many || e.defaultPrevented || (e.target as Element).closest('video,audio,input,select,textarea,[contenteditable="true"]')) return;
    const step = arrowStep(e, e.currentTarget, { vertical: false });
    if (step) { e.preventDefault(); go(at + step); }
  };
  return createPortal(
    <div ref={ref} role="dialog" aria-modal="true" aria-label={label || t.label} aria-describedby={id + 'c'} tabIndex={-1}
      className={cx('plx-media-viewer', className)} onKeyDown={onKeyDown}>
      <div id={id + 'c'} className="plx-media-viewer__counter">{dataPhrase(t.counter.split('{index}').join(String(at + 1)).split('{total}').join(String(total)))}</div>
      <button type="button" className="plx-media-viewer__control plx-media-viewer__close" aria-label={t.close} onClick={onClose}><Icon name={CloseIcon} size="md" /></button>
      {many ? <button type="button" className="plx-media-viewer__control plx-media-viewer__nav plx-media-viewer__nav--previous" aria-label={t.previous} onClick={() => go(at - 1)}><Icon name={ChevronDownIcon} size="md" /></button> : null}
      <figure className="plx-media-viewer__figure">
        <div ref={stage} className={cx('plx-media-viewer__stage', 'plx-gesture--pan-x', item.kind === 'video' && 'plx-media-viewer__stage--video')}
          onPointerDownCapture={event => { if ((event.target as Element).closest('video,audio,button,input,select,a')) event.stopPropagation(); }}>
          {item.kind === 'video' ? <MediaPlayer fill key={at} src={item.src} audio={item.audio} poster={item.poster} tracks={item.tracks} label={item.title || label || t.label} />
            : <img draggable={false} src={item.src} alt={item.alt || ''} className="plx-media-viewer__image" />}
        </div>
        {item.title || item.meta ? (
          <figcaption className="plx-media-viewer__info">
            {item.title ? <div className="plx-media-viewer__title">{item.title}</div> : null}
            {item.meta ? <div className="plx-media-viewer__meta">{item.meta.map((m, i) => <span key={i}>{dataWhenText(m)}</span>)}</div> : null}
          </figcaption>
        ) : null}
        {actions ? <div className="plx-media-viewer__actions">{actions}</div> : null}
      </figure>
      {many ? <button type="button" className="plx-media-viewer__control plx-media-viewer__nav plx-media-viewer__nav--next" aria-label={t.next} onClick={() => go(at + 1)}><Icon name={ChevronDownIcon} size="md" /></button> : null}
    </div>,
    document.body,
  );
}
