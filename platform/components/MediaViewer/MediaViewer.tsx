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
import React from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx.ts';
import { useLayer, useUid } from '../../utils/layer.ts';
import { MediaPlayer } from '../MediaPlayer/MediaPlayer.tsx';
import { useGesture } from '../../hooks/useGesture.ts';
import { Icon } from '../Icon/Icon.tsx';
import { arrowStep } from '../../utils/direction.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';
import CloseIcon from 'plenix-platform/icons/plenix/close';


export function MediaViewer({ open, onClose, items, index, defaultIndex = 0, onIndexChange, label, actions, strings, className }) {
  const t = useStrings('mediaViewer', strings);
  const ref = React.useRef(null);
  const id = useUid('plx-mv');
  const [own, setOwn] = React.useState(defaultIndex);
  const at = index !== undefined ? index : own;
  useLayer(ref, open, { modal: true, onEscape: onClose });
  const go = (n) => { const next = (n + items.length) % items.length; if (index === undefined) setOwn(next); if (onIndexChange) onIndexChange(next); };
  const item = items[at] || items[0];
  const many = items.length > 1;
  const stage = React.useRef(null);
  useGesture(stage, { disabled: !open || !many, axis: 'x', onSwipe: gesture => go(at + (gesture.inline === 'start' ? 1 : -1)) });
  if (!open || !items.length) return null;
  const onKeyDown = (e) => {
    if (!many || e.defaultPrevented || e.target.closest('video,audio,input,select,textarea,[contenteditable="true"]')) return;
    const step = arrowStep(e, e.currentTarget, { vertical: false });
    if (step) { e.preventDefault(); go(at + step); }
  };
  return createPortal(
    <div ref={ref} role="dialog" aria-modal="true" aria-label={label || t.label} aria-describedby={id + 'c'} tabIndex={-1}
      className={cx('plx-media-viewer', className)} onKeyDown={onKeyDown}>
      <div id={id + 'c'} className="plx-media-viewer__counter">{t.counter.split('{index}').join(String(at + 1)).split('{total}').join(String(items.length))}</div>
      <button type="button" className="plx-media-viewer__control plx-media-viewer__close" aria-label={t.close} onClick={onClose}><Icon name={CloseIcon} size="md" /></button>
      {many ? <button type="button" className="plx-media-viewer__control plx-media-viewer__nav plx-media-viewer__nav--previous" aria-label={t.previous} onClick={() => go(at - 1)}><Icon name={ChevronDownIcon} size="md" /></button> : null}
      <figure className="plx-media-viewer__figure">
        <div ref={stage} className={cx('plx-media-viewer__stage', 'plx-gesture--pan-x', item.kind === 'video' && 'plx-media-viewer__stage--video')}
          onPointerDownCapture={event => { if (event.target.closest('video,audio,button,input,select,a')) event.stopPropagation(); }}>
          {item.kind === 'video' ? <MediaPlayer fill key={at} src={item.src} audio={item.audio} poster={item.poster} tracks={item.tracks} label={item.title || label || t.label} />
            : <img draggable={false} src={item.src} alt={item.alt || ''} className="plx-media-viewer__image" />}
        </div>
        {item.title || item.meta ? (
          <figcaption className="plx-media-viewer__info">
            {item.title ? <div className="plx-media-viewer__title">{item.title}</div> : null}
            {item.meta ? <div className="plx-media-viewer__meta">{item.meta.map((m, i) => <span key={i}>{m}</span>)}</div> : null}
          </figcaption>
        ) : null}
        {actions ? <div className="plx-media-viewer__actions">{actions}</div> : null}
      </figure>
      {many ? <button type="button" className="plx-media-viewer__control plx-media-viewer__nav plx-media-viewer__nav--next" aria-label={t.next} onClick={() => go(at + 1)}><Icon name={ChevronDownIcon} size="md" /></button> : null}
    </div>,
    document.body,
  );
}
