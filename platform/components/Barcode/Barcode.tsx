/* Plenix · Barcode
   Summary: A one-dimensional barcode drawn as SVG from a value (Code 128, EAN-13 or UPC-A), with the value printed under
     the bars for people to read and type: an asset tag, a product number, a shipment label.
   Usage:
     <Barcode value="PLX-2026-0042" />
     <Barcode value="400638133393" format="ean13" />
     <Barcode value="03600029145" format="upca" size="lg" showText={false} />
   Props:
     value: the text (Code 128: printable ASCII) or the digits (EAN-13: 12 or 13, UPC-A: 11 or 12; the check digit is
       computed, or checked when given)
     format: "code128" (default) | "ean13" | "upca"
     size: "md" (default; the bars 64px high) | "sm" (48px, a dense label) | "lg" (96px, a code to scan from the screen);
       the width follows the value's length at the same narrow-bar width
     showText: the human-readable line under the bars, in the data font (default true)
     label: the accessible name (default strings.label filled with the format and the value)
     strings: the words it uses, for other languages: { label: "Barcode {format}: {value}", invalid: "Not a valid {format} code",
       formats: { code128: "Code 128", ean13: "EAN-13", upca: "UPC-A" } }
     className: more classes on the barcode
   Behavior:
     The barcode is one image (role="img") named by its format and value; the bars and the line under them are hidden from
       assistive technology, which reads the name.
     A value the format cannot hold draws no bars: the line says it is not valid, in the danger color on the surface.
     The bars keep a quiet zone of ten narrow bars on each side, on the barcode's plate, so scanners find the start.
     Black on white in both themes, as the QR code (the media roles do not follow the theme), so scanners read it; the line
       under the bars is on the plate in the bars' black. An invalid value has no plate (the message is on the surface).
   Notes:
     Encoding is platform/utils/barcode.ts (encodeBarcode). Other props pass through to the outer <div>.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { encodeBarcode, BARCODE_QUIET_ZONE } from '../../utils/barcode.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { fill } from '../../utils/fill.ts';

// the height of the drawing in narrow bars: the stylesheet's height token sets the size, the width follows the viewBox
const HEIGHT_MODULES = 32;
export function Barcode({ value, format = 'code128', size = 'md', showText = true, label, strings, className, ...rest }) {
  devWarn('Barcode', { size }, { size: ['md','sm','lg'] });
  const t = useStrings('barcode', strings);   // formats merge key by key
  const code = React.useMemo(() => encodeBarcode(value, format), [value, format]);
  const name = t.formats[format] || format;
  if (!code) {
    return (
      <div className={cx('plx-barcode', 'plx-barcode--' + size, className)} {...rest}>
        <span className="plx-barcode__error">{fill(t.invalid, { format: name })}</span>
      </div>
    );
  }
  const width = code.modules + BARCODE_QUIET_ZONE * 2;
  const path = code.bars.map(([x, w]) => 'M' + (x + BARCODE_QUIET_ZONE) + ' 0h' + w + 'v' + HEIGHT_MODULES + 'h-' + w + 'z').join('');
  return (
    <div className={cx('plx-barcode', 'plx-barcode--' + size, className)} role="img" aria-label={label || fill(t.label, { format: name, value: code.value })} {...rest}>
      <svg className="plx-barcode__svg" viewBox={'0 0 ' + width + ' ' + HEIGHT_MODULES} preserveAspectRatio="xMidYMid meet" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
        <rect className="plx-barcode__background" x="0" y="0" width={width} height={HEIGHT_MODULES} />
        <path className="plx-barcode__bars" d={path} />
      </svg>
      {showText ? <span className="plx-barcode__text" aria-hidden="true">{code.text}</span> : null}
    </div>
  );
}
