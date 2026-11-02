/* Plenix · QRCode
   Summary: A QR code that moves a link or a short value from the screen to a phone camera: dark modules on a light plate
     with its quiet zone, in both modes, with what scanning does and the value as text (03 Content & Identity › Images and
     media › QR code).
   Usage:
     <QRCode value="https://plenix.lighthouseway.org/notes/" label="QR code: open Notes on your phone" />
     <QRCode value={shareUrl} label="QR code for the shared folder" caption="Scan to open the folder on your phone" showValue />
     <QRCode value={url} label="QR code: sign in on your phone" level="H" logo={<BrandMark size="lg" label="Plenix" />} />
   Props:
     value: the text to encode (a URL or a short value), as UTF-8
     label: the image's accessible name: what the code is for (required)
     level: the error correction: "L" (7%) | "M" (15%, default) | "Q" (25%) | "H" (30%); a higher level survives damage
       and glare but makes a denser code
     size: "sm" (96px) | "md" (160px, default) | "lg" (240px), quiet zone included
     logo: a mark for the center: the modules under it are left out and the code is encoded at level H, so it still scans
     caption: what scanning does, under the code ("Scan to open on your phone")
     showValue: the encoded value as text under the code, in the data font, so people can copy or type it (default false)
     onAccent: the caption and value in the accent colors, for an accent surface; the code keeps its light plate (default false)
     className: more classes on the wrapper
   Behavior:
     The matrix comes from qrEncode (platform/utils/qr.ts): byte mode, the smallest version that holds the value, the mask
       with the lowest penalty. It is one SVG path drawn on the plate; the quiet zone is four modules on every side.
     The plate and the modules keep their colors in dark mode: scanners read dark on light.
     A value too long for a QR code draws nothing and warns in the console.
   Notes:
     Always offer the value another way (showValue, or a copy action next to it): not everyone can scan.
     Other props pass through to the wrapper.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { qrEncode } from '../../utils/qr.ts';

const SIZES = ['sm', 'md', 'lg'];
const QUIET = 4;          // the quiet zone, in modules
const LOGO_SHARE = 0.25;  // the share of the code's width the logo's clear square takes

export function QRCode({ value, label, level = 'M', size = 'md', logo, caption, showValue = false, onAccent = false, className, ...rest }) {
  devWarn('QRCode', { size }, { size: ['sm','md','lg'] });
  const s = SIZES.indexOf(size) >= 0 ? size : 'md';
  const lv = logo ? 'H' : level;
  const code = React.useMemo(() => {
    try { return qrEncode(value == null ? '' : String(value), { level: lv }); } catch (e) { console.warn('QRCode: ' + e.message); return null; }
  }, [value, lv]);
  const d = React.useMemo(() => {
    if (!code) return '';
    const n = code.size;
    let clear = 0;
    if (logo) { clear = Math.round(n * LOGO_SHARE); if (clear % 2 === 0) clear++; }
    const lo = (n - clear) / 2, hi = lo + clear;
    const out = [];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if (!code.modules[y][x]) continue;
      if (clear && x >= lo && x < hi && y >= lo && y < hi) continue;
      out.push('M' + (x + QUIET) + ' ' + (y + QUIET) + 'h1v1h-1z');
    }
    return out.join('');
  }, [code, logo]);
  if (!code) return null;
  const box = code.size + QUIET * 2;
  return (
    <figure className={cx('plx-qr-code', 'plx-qr-code--' + s, onAccent && 'plx-qr-code--on-accent', className)} {...rest}>
      <span className="plx-qr-code__frame">
        <svg className="plx-qr-code__svg" viewBox={'0 0 ' + box + ' ' + box} role="img" aria-label={label} focusable="false" data-plx-qr-version={code.version} data-plx-qr-level={code.level}>
          <path className="plx-qr-code__modules" d={d} />
        </svg>
        {logo ? <span className="plx-qr-code__logo">{logo}</span> : null}
      </span>
      {caption || showValue ? (
        <figcaption className="plx-qr-code__caption">
          {caption ? <span className="plx-qr-code__text">{caption}</span> : null}
          {showValue ? <span className="plx-qr-code__value">{String(value)}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
