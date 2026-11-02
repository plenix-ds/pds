/* Plenix · AvatarUpload
   Summary: Sets a person's (or a team's) picture: the current Avatar (the picture, or the initials without one) beside
     Change photo and Remove photo, with a square crop step before the new picture is kept. Built only from Platform
     components (Avatar, FileInput, Button, ImageCrop).
   Usage:
     <Field label="Profile photo" description="At least 200 × 200 pixels">
       <AvatarUpload name="Maya Chen" src={photo} onChange={(pic) => setPhoto(pic ? pic.url : null)} />
     </Field>
     <AvatarUpload name="Brand team" src={logo} onChange={…} crop={false} removable={false} />
   Props:
     name: whose picture it is: the initials without a picture, and the names of the actions
     src: the current picture's address (none: the initials)
     onChange(picture): runs with { url, blob, file } when a new picture is kept (blob is the cropped square), or null
       when it is removed
     crop: a square crop step after a picture is chosen (default true)
     removable: Remove photo while there is a picture (default true)
     size: the avatar's size: "xl" (48px) | "2xl" (64px, default)
     accept: the image types (default "image/png,image/jpeg,image/webp")
     maxSize: the largest file in bytes; a larger one is refused with strings.tooLarge
     description: the hint beside the actions ("At least 200 × 200 pixels")
     disabled: nothing can be changed
     strings: the words it shows, for other languages: { change: "Change photo", add: "Add photo", remove: "Remove photo",
       tooLarge: "The picture is larger than {max}", notImage: "Choose an image file", picture: "{name}’s photo", crop: {…} }
     className: more classes on the control
   Behavior:
     Change photo (Add photo without one) is the browser's file input drawn as a secondary Button: the keyboard way and the
       picker. The chosen picture opens in ImageCrop (a square frame: drag or arrow keys to move it, Zoom to enlarge it);
       Apply keeps the crop, Cancel keeps the picture uncropped. The Avatar shows the new picture at once.
     Remove photo goes back to the initials and moves focus to Change photo.
     The Avatar is an image named "<name>’s photo"; a refused file says why in a danger Notice (an alert).
   Notes:
     The Avatar's shape is Plenix's rounded square in every size (never a circle).
     Where the picture comes from an identity provider and cannot change here, show the Avatar alone and say where to
       change it.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { useDescribedBy } from '../../utils/describedBy.ts';
import { Avatar } from '../../components/Avatar/Avatar.jsx';
import { FileInput } from '../../components/FileInput/FileInput.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { ImageCrop } from '../ImageUpload/ImageUpload.jsx';
import { formatBytes } from '../../utils/format.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import TrashIcon from 'plenix-platform/icons/plenix/trash';


export function AvatarUpload({ name, src, onChange, crop = true, removable = true, size = '2xl', accept = 'image/png,image/jpeg,image/webp', maxSize,
  description, disabled = false, strings, className, id, 'aria-describedby': describedBy }) {
  devWarn('AvatarUpload', { size }, { size: ['xl','2xl'] });
  const t = useStrings('avatarUpload', strings);
  const [pending, setPending] = React.useState(null);   // { url, file } waiting for its crop
  const [error, setError] = React.useState('');
  const wrap = React.useRef(null);
  const auto = 'plx-au' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const describedAt = useDescribedBy(describedBy, description ? auto + '-hint' : null);   // what its owner (a Field) described, then the hint beside the actions
  const focusChange = () => setTimeout(() => { const inp = wrap.current && wrap.current.querySelector('input[type="file"]'); if (inp) inp.focus(); }, 0);
  const chosen = (files) => {
    const f = files[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) { setError(t.notImage); return; }
    if (maxSize && f.size > maxSize) { setError(t.tooLarge.replace('{max}', formatBytes(maxSize))); return; }
    setError('');
    const url = URL.createObjectURL(f);
    if (crop) setPending({ url, file: f });
    else if (onChange) onChange({ url, blob: null, file: f });
  };
  const word = src ? t.change : t.add;
  return (
    <div ref={wrap} className={cx('plx-avatar-upload', pending && 'is-cropping', className)}>
      <div className="plx-avatar-upload__row">
        <Avatar name={name} src={pending ? undefined : src} size={size} label={t.picture.replace('{name}', name || '')} />
        <div className="plx-avatar-upload__body">
          <div className="plx-avatar-upload__actions">
            <FileInput hideSummary accept={accept} disabled={disabled || !!pending} id={id} aria-describedby={describedAt}
              label={word} strings={{ choose: word }} onChange={chosen} />
            {removable && src && !pending ? <Button variant="ghost" icon={TrashIcon} disabled={disabled} onClick={() => { if (onChange) onChange(null); focusChange(); }}>{t.remove}</Button> : null}
          </div>
          {description ? <span className="plx-avatar-upload__hint" id={auto + '-hint'}>{description}</span> : null}
        </div>
      </div>
      {pending ? <ImageCrop src={pending.url} ratio="1-1" output={512} strings={t.crop}
        onApply={(res) => { setPending(null); if (onChange) onChange({ url: res.url, blob: res.blob, file: pending.file }); focusChange(); }}
        onCancel={() => { const p = pending; setPending(null); if (onChange) onChange({ url: p.url, blob: null, file: p.file }); focusChange(); }} /> : null}
      {error ? <Notice tone="danger">{error}</Notice> : null}
    </div>
  );
}
