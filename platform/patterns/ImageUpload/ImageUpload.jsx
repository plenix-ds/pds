/* Plenix · ImageUpload, ImageCrop
   Summary: Adds images with a preview of each before they are saved: a drop zone with a Choose button, the chosen images as
     previews with Replace, Remove and an optional description (alt text); in a fixed shape (aspect locked), or cropped to it
     first (ImageCrop: zoom and move the picture in the frame). Built only from Platform components.
   Usage:
     <Field label="Cover image" description="PNG or JPG, at least 1600 × 900 pixels">
       <ImageUpload value={cover} onChange={setCover} ratio="16-9" crop altText />
     </Field>
     <ImageUpload multiple max={8} value={photos} onChange={setPhotos} label="Product photos" />
     <ImageCrop src={url} ratio="1-1" onApply={({ url, blob }) => …} onCancel={…} />
   Props:
     value: the images: [{ id, url, name, size, alt, file, blob }] (url shows the preview; blob is the cropped picture when
       cropped); onChange(images) runs with the new list
     multiple: several images, shown as a grid of previews (default false: one image, which Replace swaps)
     max: the most images with multiple; the drop zone hides when it is reached
     ratio: "auto" (default: each picture's own shape) | "1-1" | "4-3" | "3-2" | "16-9" | "3-4" | "9-16": the previews keep
       this shape (aspect locked: the edges of other shapes are cut off in the preview)
     crop: a crop step after each image is chosen, to the ratio ("1-1" when ratio is "auto"); the cropped picture replaces it
     accept: the image types the picker offers (default "image/png,image/jpeg,image/webp,image/gif")
     maxSize: the largest file in bytes; a larger one is refused with strings.tooLarge
     altText: each image gets a Description field (its alt text), for images others will see (default false)
     description: the limits, shown in the drop zone ("PNG or JPG, up to 5 MB")
     label: the accessible name of the area (the Field's label otherwise)
     disabled: nothing can be added or removed
     strings: the words it shows and announces, for other languages: { drop: "Drop an image here, or", dropMany: "Drop
       images here, or", choose: "Choose image", chooseMany: "Choose images", replace: "Replace", remove: "Remove {name}",
       alt: "Description", altHint: "Describe this image for people who cannot see it", tooLarge: "{name} is larger than
       {max}", notImage: "{name} is not an image", added: (n) => …, removed: "{name} removed", crop: {…ImageCrop's} }
     className: more classes on the area
     ImageCrop.src: the picture to crop; ImageCrop.ratio: the frame's shape (as ratio, default "1-1")
     ImageCrop.onApply({ url, blob, width, height }): runs with the cropped picture; ImageCrop.onCancel(): leaves it
     ImageCrop.output: the cropped picture's width in pixels (default 1200)
     ImageCrop.strings: { title: "Crop image", zoom: "Zoom", frame: "Crop area. Drag the picture, or move it with the arrow
       keys", apply: "Apply", cancel: "Cancel" }
   Behavior:
     Drop images on the zone, or press Choose (the browser's file input, the keyboard way): each image shows at once as a
       preview with its name and size (the data font); a file that is not an image or too large is refused, the reason
       under the zone (a danger Notice, read out as an alert).
     Replace (single) chooses again; each preview's Remove takes that image out and focus moves to the next preview's
       Remove, or to Choose. How many images were added or removed is announced politely.
     ImageCrop: the frame shows the cropped result in the ratio; drag the picture or use the arrow keys to move it (Shift for
       bigger steps), the Zoom slider (100 to 300%) to enlarge it; Apply keeps it, Cancel keeps the uncropped picture.
       The picture is cropped in the browser (a canvas off the page), so what people see is what is saved.
   Notes:
     The page uploads value[].file (or .blob after a crop) when the form is saved; show progress with a ProgressBar.
     For profile pictures use AvatarUpload; for other files, FileInput or a drop zone.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { DropZone } from '../../components/DropZone/DropZone.tsx';
import { FileInput } from '../../components/FileInput/FileInput.tsx';
import { Image } from '../../components/Image/Image.jsx';
import { Button } from '../../components/Button/Button.tsx';
import { Icon } from '../../components/Icon/Icon.tsx';
import { Slider } from '../../components/Slider/Slider.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Input } from '../../components/Input/Input.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { announce } from '../../utils/announce.tsx';
import { formatBytes, formatNumber } from '../../utils/format.ts';
import { useStrings, useLocale } from '../../providers/LocaleProvider.tsx';
import EdCropIcon from 'plenix-platform/icons/plenix/ed-crop';
import TrashIcon from 'plenix-platform/icons/plenix/trash';
import UploadIcon from 'plenix-platform/icons/plenix/upload';
import { fill } from '../../utils/fill.ts';

const RATIOS = { '1-1': 1, '4-3': 4 / 3, '3-2': 3 / 2, '16-9': 16 / 9, '21-9': 21 / 9, '3-4': 3 / 4, '9-16': 9 / 16 };
let seq = 0;

/* ImageCrop: the picture drawn in the frame's ratio on a canvas off the page; the frame shows the result as an Image */
export function ImageCrop({ src, ratio = '1-1', output = 1200, onApply, onCancel, strings, className }) {
  const t = useStrings('imageUpload.crop', strings);
  const r = RATIOS[ratio] || 1;
  const [zoom, setZoom] = React.useState(100);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });   // the picture's offset, -1 to 1 of the room it has to move
  const [url, setUrl] = React.useState('');
  const img = React.useRef(null), canvas = React.useRef(null), drag = React.useRef(null);
  const outW = output, outH = Math.round(output / r);
  React.useEffect(() => {
    const im = new window.Image();
    im.onload = () => { img.current = im; draw(); };
    im.src = src;
    return () => { im.onload = null; };
  }, [src]);
  const draw = () => {
    const im = img.current;
    if (!im || typeof document === 'undefined') return;
    const c = canvas.current || (canvas.current = document.createElement('canvas'));
    c.width = outW; c.height = outH;
    const nw = im.naturalWidth || outW, nh = im.naturalHeight || outH;
    const s = Math.max(outW / nw, outH / nh) * (zoom / 100), w = nw * s, hgt = nh * s;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, outW, outH);
    ctx.drawImage(im, (outW - w) / 2 + pos.x * (w - outW) / 2, (outH - hgt) / 2 + pos.y * (hgt - outH) / 2, w, hgt);
    try { setUrl(c.toDataURL('image/png')); } catch (e) { setUrl(src); }
  };
  React.useEffect(() => { const id = requestAnimationFrame(draw); return () => cancelAnimationFrame(id); }, [zoom, pos.x, pos.y]);
  const clamp = (v) => Math.max(-1, Math.min(1, v));
  const nudge = (dx, dy) => setPos((p) => ({ x: clamp(p.x + dx), y: clamp(p.y + dy) }));
  const onKey = (e) => {
    const s = e.shiftKey ? 0.25 : 0.05;
    const map = { ArrowLeft: [s, 0], ArrowRight: [-s, 0], ArrowUp: [0, s], ArrowDown: [0, -s] };
    if (map[e.key]) { e.preventDefault(); nudge(map[e.key][0], map[e.key][1]); }
    else if (e.key === 'Home') { e.preventDefault(); setPos({ x: 0, y: 0 }); }
  };
  const onDown = (e) => {
    if (e.button !== 0) return;
    const box = e.currentTarget.getBoundingClientRect();
    drag.current = { x: e.clientX, y: e.clientY, from: pos, w: box.width, h: box.height };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    const d = drag.current; if (!d) return;
    setPos({ x: clamp(d.from.x - 2 * (e.clientX - d.x) / d.w), y: clamp(d.from.y - 2 * (e.clientY - d.y) / d.h) });
  };
  const apply = () => {
    const c = canvas.current;
    if (!c || !onApply) return;
    const done = (blob) => onApply({ url: blob && typeof URL !== 'undefined' ? URL.createObjectURL(blob) : url, blob: blob || null, width: outW, height: outH });
    if (c.toBlob) c.toBlob(done, 'image/png'); else done(null);
  };
  return (
    <div className={cx('plx-image-crop', className)} role="group" aria-label={t.title}>
      <div className="plx-image-crop__frame" tabIndex={0} role="img" aria-label={t.frame} onKeyDown={onKey}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
        {url ? <Image src={url} alt="" ratio={ratio} placeholder="none" loading="eager" /> : <Image src={src} alt="" ratio={ratio} loading="eager" />}
      </div>
      <Slider className="plx-image-crop__zoom" label={t.zoom} min={100} max={300} step={10} unit="%" value={zoom} onChange={setZoom} />
      <div className="plx-image-crop__actions">
        {onCancel ? <Button onClick={onCancel}>{t.cancel}</Button> : null}
        <Button variant="primary" icon={EdCropIcon} onClick={apply}>{t.apply}</Button>
      </div>
    </div>
  );
}

export function ImageUpload({ value = [], onChange, multiple = false, max, ratio = 'auto', crop = false, accept = 'image/png,image/jpeg,image/webp,image/gif',
  maxSize, altText = false, description, label, disabled = false, strings, className, id, 'aria-describedby': describedBy }) {
  const t = useStrings('imageUpload', strings);
  const loc = useLocale();
  // "N images added": a plural message in the catalog (Arabic has six forms); an app's own function in strings still wins
  const addedText = (n) => (typeof t.added === 'function' ? t.added(n) : loc.t('imageUpload.added', { count: n, n: formatNumber(n) }));
  const images = value || [];
  const [over, setOver] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const [cropping, setCropping] = React.useState(null);   // the image waiting for its crop
  const zone = React.useRef(null), removes = React.useRef({});
  const shape = crop && ratio === 'auto' ? '1-1' : ratio;
  const full = multiple ? (max && images.length >= max) : false;
  const add = (files) => {
    const bad = [], ok = [];
    files.forEach((f) => {
      if (!/^image\//.test(f.type)) bad.push(fill(t.notImage, { name: f.name }));
      else if (maxSize && f.size > maxSize) bad.push(fill(t.tooLarge, { name: f.name, max: formatBytes(maxSize) }));
      else ok.push(f);
    });
    setErrors(bad);
    const room = multiple ? (max ? Math.max(0, max - images.length) : ok.length) : 1;
    const take = ok.slice(0, room).map((f) => ({ id: 'img-' + (++seq), url: URL.createObjectURL(f), name: f.name, size: f.size, alt: '', file: f }));
    if (!take.length) return;
    if (crop) { setCropping({ queue: take }); return; }
    commit(take);
  };
  const commit = (take) => {
    onChange(multiple ? images.concat(take) : take.slice(0, 1));
    announce(addedText(take.length));
  };
  const onCropped = (res) => {
    const [first, ...rest] = cropping.queue;
    const done = Object.assign({}, first, { url: res.url, blob: res.blob });
    if (rest.length) { setCropping({ queue: rest, done: (cropping.done || []).concat([done]) }); return; }
    const all = (cropping.done || []).concat([done]);
    setCropping(null); commit(all);
  };
  const onCropCancel = () => {
    const [first, ...rest] = cropping.queue;
    const all = (cropping.done || []).concat([first]);
    if (rest.length) { setCropping({ queue: rest, done: all }); return; }
    setCropping(null); commit(all);
  };
  const remove = (i) => {
    const gone = images[i];
    const next = images.filter((_, j) => j !== i);
    onChange(next);
    announce(fill(t.removed, { name: gone.name }));
    // focus: the next preview's Remove, or the Choose button
    setTimeout(() => {
      const after = next[Math.min(i, next.length - 1)];
      const el = after && removes.current[after.id];
      if (el) el.focus(); else if (zone.current) { const inp = zone.current.querySelector('input[type="file"]'); if (inp) inp.focus(); }
    }, 0);
  };
  const setAlt = (i, alt) => onChange(images.map((im, j) => (j === i ? Object.assign({}, im, { alt }) : im)));
  const dropProps = disabled ? {} : {
    onDragOver: (e) => { e.preventDefault(); setOver(true); },
    onDragLeave: () => setOver(false),
    onDrop: (e) => { e.preventDefault(); setOver(false); add(Array.from((e.dataTransfer && e.dataTransfer.files) || [])); },
  };
  const picker = (word) => <FileInput hideSummary accept={accept} multiple={multiple} disabled={disabled} id={id} aria-describedby={describedBy}
    label={label ? label + ', ' + word : word} strings={{ choose: word, chooseMany: word }} onChange={(files) => add(files)} />;
  const showZone = !cropping && !full && (multiple || !images.length);
  return (
    <div className={cx('plx-image-upload', multiple && 'plx-image-upload--multiple', shape !== 'auto' && 'plx-image-upload--locked', className)} role="group" aria-label={label} ref={zone}>
      {cropping ? <ImageCrop key={cropping.queue[0].id} src={cropping.queue[0].url} ratio={shape} onApply={onCropped} onCancel={onCropCancel} strings={t.crop} /> : null}
      {images.length && !cropping ? (
        <ul className="plx-image-upload__list">
          {images.map((im, i) => (
            <li key={im.id || im.url} className="plx-image-upload__item">
              <div className="plx-image-upload__preview">
                <Image src={im.url} alt={im.alt || ''} ratio={shape === 'auto' ? (multiple ? '1-1' : '4-3') : shape} fit={shape === 'auto' && !multiple ? 'contain' : 'cover'} loading="eager" />
              </div>
              <div className="plx-image-upload__meta">
                <span className="plx-image-upload__name">{im.name}</span>
                {im.size ? <span className="plx-image-upload__size">{formatBytes(im.size)}</span> : null}
              </div>
              <div className="plx-image-upload__actions">
                {!multiple && !disabled ? picker(t.replace) : null}
                <Button ref={(el) => { removes.current[im.id] = el; }} variant="ghost" size="xs" icon={TrashIcon} disabled={disabled} label={fill(t.remove, { name: im.name })}
                  iconOnly={multiple} onClick={() => remove(i)}>{multiple ? undefined : fill(t.remove, { name: '' }).trim()}</Button>
              </div>
              {altText ? <Field className="plx-image-upload__alt" label={t.alt} description={t.altHint}>
                <Input value={im.alt || ''} disabled={disabled} onChange={(e) => setAlt(i, e.target.value)} /></Field> : null}
            </li>
          ))}
        </ul>
      ) : null}
      {showZone ? (
        <DropZone className="plx-image-upload__zone" active={over} {...dropProps}>
          <span className="plx-image-upload__zone-icon" aria-hidden="true"><Icon name={UploadIcon} size="lg" /></span>
          <span className="plx-image-upload__zone-text">{multiple ? t.dropMany : t.drop}</span>
          {picker(multiple ? t.chooseMany : t.choose)}
          {description ? <span className="plx-image-upload__limits">{description}</span> : null}
        </DropZone>
      ) : null}
      {errors.length ? <Notice tone="danger" className="plx-image-upload__error">{errors.join(' ')}</Notice> : null}
    </div>
  );
}
