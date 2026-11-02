/* Plenix · Thumbnail
   Summary: A small picture of a file or an item beside its name (a table's name cell, a list row).
     It shows the picture, or an icon when there is none, in a 28px rounded square on the sunken surface.
   Usage:
     <Thumbnail src={asset.thumbUrl} icon="image-a-2" />
   Props:
     src: the picture's URL
     alt: the picture's text alternative; default "" (empty when the name is next to it)
     icon: the icon shown without src; default "document"
   Behavior:
     An image that fails to load falls back to the icon.
     The picture loads lazily.
     The icon is decorative and hidden from assistive technology.
*/
import React from 'react';
import { Icon } from '../Icon/Icon.tsx';
import DocumentIcon from 'plenix-platform/icons/plenix/document';

export function Thumbnail({ src, alt = '', icon = 'document' }) {
  // the documented default is the name; it draws from its imported module (#280)
  const glyph = icon === 'document' ? DocumentIcon : icon;
  // an image that fails to load falls back to the icon, as when there is none (batch 215)
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => { setFailed(false); }, [src]);
  return src && !failed ? <img className="plx-thumbnail" src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} /> : <span className="plx-thumbnail plx-thumbnail--icon" aria-hidden="true"><Icon name={glyph} size="sm" /></span>;
}
