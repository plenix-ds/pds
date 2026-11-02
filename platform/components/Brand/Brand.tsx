/* Plenix · BrandMark
   Summary: The Plenix brand from the brand kit (platform/brand/): the mark alone, the wordmark, the logo (mark and wordmark
     in one lockup) and the product mark of each application, in the brand colors, in one color or on the accent.
   Usage:
     <BrandMark />                                  the mark, decorative, beside the product name (the header)
     <BrandMark label="Plenix" />                   the mark on its own, named
     <BrandMark kind="logo" size="lg" />            the logo: the mark and the wordmark
     <BrandMark kind="wordmark" tone="mono" />      the name alone, in the current text color
     <BrandMark kind="product" app="notes" />       the product mark of an application (PLENIX_APPS)
     <BrandMark kind="logo" tone="on-accent" />     on the blue header or another accent surface
   Props:
     BrandMark.kind: "mark" (default) | "wordmark" | "logo" (mark + wordmark) | "product" (the application's tile + its name)
     BrandMark.tone: the colors. Without it the mark takes the current text color (as in the header); "brand" (the default of
       the wordmark, the logo and the product mark) draws the mark in the brand blue and the name in the text color; "mono"
       draws everything in the current text color; "on-accent" everything in the accent content color (the blue header)
     BrandMark.size: "sm" (the minimum: a 16px mark) | "md" (20px) | "lg" (24px) | "xl" (32px); without it the mark takes
       the control icon size and a lockup is "md"
     BrandMark.app: kind="product": an application id from PLENIX_APPS ("notes") or an application ({ label, icon })
     BrandMark.showName: kind="product": false draws the tile alone, named by the application (default true)
     BrandMark.clearSpace: pads the lockup with the brand's clear space (brand-rules.json), for a logo that stands on its own
     BrandMark.label: the accessible name of the mark alone (or of the product tile alone); without it the mark is decorative
     BrandMark.strings: { name: "Plenix" } (the wordmark's text: the brand name of brand.json)
     BrandMark.className: more classes
   Behavior:
     The mark is the brand kit's file (platform/brand/brand.json files.mark), drawn as a mask in the color its tone gives:
       its square includes the kit's clear space. The wordmark is live text in the heading face, at a size of the type
       scale, so it is read as the brand name; the mark inside a lockup is decorative.
     The product mark is the application's icon (PLENIX_APPS) on the brand tile, then the application's name.
     The sizes stop at "sm": below it the mark loses its central cross (the minimum sizes of brand-rules.json).
   Notes:
     Never redraw or recolor the mark by hand: replace the kit's files and build (build-brand.js). The brand rules (clear
       space, minimum sizes, backgrounds, misuse) are platform/brand/brand-rules.json; the Brand application page shows them.
     The brand blue comes from the brand tokens (tokens/components/brand.tokens.json), never from a palette color.
     Other props pass through to the outer <span>.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Icon } from '../Icon/Icon.tsx';
import { appById, appIcon } from '../../providers/apps.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import HomeIcon from 'plenix-platform/icons/plenix/home';


export function BrandMark({ kind = 'mark', tone, size, app, showName = true, clearSpace = false, label, strings, className, ...rest }) {
  devWarn('BrandMark', { tone, size }, { tone: ['brand','mono','on-accent'], size: ['sm','md','lg','xl'] });
  const s = useStrings('brand', strings);
  if (kind === 'mark') {
    const cls = cx('plx-brand-mark', tone && 'plx-brand-mark--tone-' + tone, size && 'plx-brand-mark--size-' + size, className);
    return label ? <span role="img" aria-label={label} className={cls} {...rest} />
      : <span aria-hidden="true" className={cls} {...rest} />;
  }
  const lockup = cx('plx-brand-lockup', 'plx-brand-lockup--' + kind, 'plx-brand-lockup--tone-' + (tone || 'brand'),
    'plx-brand-lockup--size-' + (size || 'md'), clearSpace && 'plx-brand-lockup--clear', className);
  if (kind === 'product') {
    const a = typeof app === 'string' ? appById(app) : app;
    const name = a ? a.label : s.name;
    return (
      <span className={lockup} role={showName ? undefined : 'img'} aria-label={showName ? undefined : (label || name)} {...rest}>
        <span className="plx-brand-lockup__tile" aria-hidden="true"><Icon name={a ? appIcon(a) : HomeIcon} /></span>
        {showName ? <span className="plx-brand-lockup__app">{name}</span> : null}
      </span>
    );
  }
  return (
    <span className={lockup} {...rest}>
      {kind === 'logo' ? <span aria-hidden="true" className="plx-brand-mark plx-brand-lockup__mark" /> : null}
      <span className="plx-brand-lockup__name">{s.name}</span>
    </span>
  );
}
