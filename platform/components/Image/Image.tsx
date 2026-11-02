/* Plenix · Image
   Summary: A picture in a frame of a fixed ratio and fit: an asset preview, a photo or a screenshot, with a placeholder
     while it loads and a fallback when it cannot load.
   Usage:
     <Image src="kitchen.jpg" alt="The finished kitchen, oak cabinets" ratio="4-3" />
     <Image src="hero-1600.jpg" srcSet="hero-800.jpg 800w, hero-1600.jpg 1600w" sizes="(max-width: 600px) 100vw, 50vw"
       alt="…" ratio="16-9" placeholder="blur" placeholderSrc="hero-24.jpg" />
     <Image sources={[{ media: '(max-width: 599px)', srcSet: 'hero-square.jpg' }]} src="hero-wide.jpg" alt="…" />
   Props:
     src: the picture's address (required)
     alt: the text alternative (required): what the picture shows or is for; "" for a decorative picture
     ratio: "auto" (default: the picture's own shape; give width and height) | "1-1" | "4-3" | "3-2" | "16-9" | "21-9" |
       "3-4" | "9-16" (the aspect-ratio scale)
     fit: "cover" (default: fills the frame, cropping the edges) | "contain" (the whole picture, on the frame's fill)
     srcSet: the responsive sources of the same picture, by width (800w) or density (2x); the browser picks one
     sizes: how wide the picture is drawn at each window width, for srcSet by width
     sources: art direction, [{ media, srcSet, sizes?, type? }]: other crops or formats by media query, drawn as a <picture>
     loading: "lazy" (default: loads when it nears the screen) | "eager"
     priority: the picture people see first (eager, fetched first); never more than one or two on a page
     placeholder: "color" (default: the neutral fill until it loads) | "blur" (placeholderSrc, a tiny copy, blurred) | "none"
     placeholderSrc: the tiny copy for placeholder="blur"
     rounded: the media corners (default false: square, for a picture inside a card or a preview that clips it)
     width, height: the picture's size in pixels, so its space is kept before it loads (ratio="auto")
     fallback: what shows when it cannot load (default: the image icon and strings.error)
     strings: { error: "Image not available" }
     onLoad: called when the picture has loaded
     onError: called when it cannot load
     className: more classes on the frame
   Behavior:
     Public context --plx-comp-image-zoom applies to every Image in the containing element; fallback 1.
     DocumentViewer supplies its stepped zoom without selecting Image anatomy.
     The frame keeps its space before the picture arrives (a ratio, or width and height), so nothing moves when it loads.
     While loading the frame shows its placeholder; the picture fades in over it once loaded (no fade with reduced motion).
     When the picture fails, the frame keeps its size and shows the fallback; a picture that loaded from the cache shows
       at once.
     Every source is the same picture: the alt text is the same for all of them.
   Notes:
     Not for icons (Icon) or illustrations of the Plenix set (Illustration), and never for text.
     Other props pass through to the <img>.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Icon } from '../Icon/Icon.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ImageAN2Icon from 'plenix-platform/icons/plenix/image-a-2';

const RATIOS = ['1-1', '4-3', '3-2', '16-9', '21-9', '3-4', '9-16'];

export const Image = React.forwardRef(function Image({ src, alt, ratio = 'auto', fit = 'cover', srcSet, sizes, sources, loading = 'lazy', priority = false,
  placeholder = 'color', placeholderSrc, rounded = false, width, height, fallback, strings, onLoad, onError, className, ...rest }, ref) {
  const s = useStrings('image', strings);
  const own = React.useRef(null);
  const [status, setStatus] = React.useState('loading');
  const setRef = (el) => { own.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; };
  // a new source starts over; a picture already in the cache is complete before React listens
  React.useEffect(() => {
    const el = own.current;
    if (el && el.complete && el.currentSrc) setStatus(el.naturalWidth > 0 ? 'loaded' : 'error');
    else setStatus('loading');
  }, [src, srcSet]);
  const img = (
    <img ref={setRef} className="plx-image__img" src={src} srcSet={srcSet} sizes={sizes} alt={alt} width={width} height={height}
      loading={priority ? 'eager' : loading} decoding="async" fetchpriority={priority ? 'high' : undefined}
      onLoad={(e) => { setStatus('loaded'); if (onLoad) onLoad(e); }}
      onError={(e) => { setStatus('error'); if (onError) onError(e); }} {...rest} />
  );
  return (
    <span className={cx('plx-image', 'plx-image--' + fit, 'plx-image--placeholder-' + placeholder, rounded && 'plx-image--rounded',
      RATIOS.indexOf(ratio) >= 0 ? 'plx-ratio-' + ratio : null, 'is-' + status, className)}>
      {placeholder === 'blur' && placeholderSrc && status !== 'loaded' ? <img className="plx-image__placeholder" src={placeholderSrc} alt="" aria-hidden="true" /> : null}
      {sources && sources.length
        ? <picture className="plx-image__picture">{sources.map((x, i) => <source key={i} media={x.media} srcSet={x.srcSet} sizes={x.sizes} type={x.type} />)}{img}</picture>
        : img}
      {status === 'error' ? (
        <span className="plx-image__fallback" role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
          {fallback || <React.Fragment><span className="plx-image__fallback-icon"><Icon name={ImageAN2Icon} /></span><span className="plx-image__fallback-text">{s.error}</span></React.Fragment>}
        </span>
      ) : null}
    </span>
  );
});
