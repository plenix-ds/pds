/* Plenix · Pictogram
   Summary: A large symbol for a concept (not an action) in a round frame: the picture of an empty state, a feature card
     or an onboarding step, when a full illustration is too much.
   Usage:
     <Pictogram icon="upload" />
     <Pictogram icon="folder-open" size="96" twoTone />
   Props:
     icon: the Plenix icon name (platform/icons/map.json): the set's own symbol, drawn large and never edited
     size: "48" | "64" (default) | "96": the frame's width and height; the symbol is two thirds of it on the 4px grid
       (32, 40, 64px)
     twoTone: the filled symbol on a blue tint instead of the outline on the sunken surface (default false)
     label: the accessible name, when no heading or text next to it says the same; without it the pictogram is decorative
     className: more classes on the frame
   Behavior:
     Not interactive: never a button or a link, never an action icon.
     The symbol uses the icon files drawn for 24px and up (optical size 24), outline or filled.
   Notes:
     One size and one tone per view; always next to a heading or text that names the concept.
     Other props pass through to the <span>.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Icon } from '../Icon/Icon.tsx';

const SIZES = ['48', '64', '96'];

export function Pictogram({ icon, size = '64', twoTone = false, label, className, ...rest }) {
  devWarn('Pictogram', { size }, { size: ['48','64','96',48,64,96] });
  const s = SIZES.indexOf(String(size)) >= 0 ? String(size) : '64';
  return (
    <span className={cx('plx-pictogram', 'plx-pictogram--' + s, twoTone && 'plx-pictogram--two-tone', className)} data-plx-icon-optical="24"
      role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} {...rest}>
      <Icon name={icon} filled={twoTone} />
    </span>
  );
}
