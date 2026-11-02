/* Plenix · FloatingActionButton
   Summary: The one most important action of a screen (create, compose, upload) in a raised button that floats at the
     bottom end corner, over the content, and stays in reach while the page scrolls (04 Actions › Buttons › Floating
     action button).
   Usage:
     <FloatingActionButton icon="plus" label="New asset" onClick={create} />                           standard, icon only
     <FloatingActionButton icon="upload" label="Upload" extended onClick={upload} />                   extended: the icon and its label
     <FloatingActionButton icon="pencil" label="Compose" size="sm" variant="secondary" placement="inline" />
   Props:
     icon: the action's icon (an icon name or an <Icon>; required)
     label: the action, as a verb ("New asset", "Upload"): the accessible name, and the visible label when extended (required)
     extended: the label shows beside the icon (default false: a square, icon-only button named by label)
     size: "md" (default; 56px) | "sm" (40px) | "lg" (96px, the hero action of a large, empty screen)
     variant: "primary" (default; the action color) | "secondary" (the raised surface, the content color)
     placement: "corner" (default; fixed at the bottom end corner of the window, --plx-comp-floating-action-button-inset
       from its edges) | "inline" (in the flow: its container places it, e.g. a pane's own corner)
     disabled: the action is not available (default false)
     onClick(event): runs on a press, Enter or Space
     className: more classes on the button
     ref: forwarded to the <button>
     Other props pass through to the <button>.
   Behavior:
     It is a native button: a press, Enter or Space runs the action. In the corner it stays put while the page scrolls;
       give the scrolling content bottom space (--plx-comp-floating-action-button-clearance) so its last line can be read
       beside it.
     Its place in the Tab order is where it is written: write it where the action belongs (after the page header or the
       list it adds to), not at the end of a long page.
     Hover and press darken the fill (the action color's own steps); focus shows the focus ring.
   Notes:
     One per screen, and only for an action that is not already on the page. Extended when the icon alone is not clear;
       a phone-sized window keeps it icon-only to cover less. On a desktop page with a toolbar, put the action there
       (a primary Button) instead.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { asIcon } from '../Icon/Icon.tsx';

const SIZES = ['sm', 'md', 'lg'];

export const FloatingActionButton = React.forwardRef(function FloatingActionButton({ icon, label, extended = false, size = 'md', variant = 'primary',
  placement = 'corner', disabled = false, onClick, className, ...rest }, ref) {
  devWarn('FloatingActionButton', { size, variant }, { size: ['md','sm','lg'], variant: ['primary','secondary'] });
  const s = SIZES.indexOf(size) >= 0 ? size : 'md';
  return (
    <button ref={ref} type="button" disabled={disabled || undefined} aria-label={extended ? undefined : label} onClick={onClick}
      className={cx('plx-floating-action-button', 'plx-floating-action-button--' + s, variant === 'secondary' ? 'plx-floating-action-button--secondary' : 'plx-floating-action-button--primary', extended && 'plx-floating-action-button--extended',
        placement === 'inline' ? 'plx-floating-action-button--inline' : 'plx-floating-action-button--corner', className)} {...rest}>
      <span className="plx-floating-action-button__icon" aria-hidden="true">{asIcon(icon)}</span>
      {extended ? <span className="plx-floating-action-button__label">{label}</span> : null}
    </button>
  );
});
