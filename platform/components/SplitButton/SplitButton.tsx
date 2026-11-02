/* Plenix · SplitButton
   Summary: The most common action and its close alternatives in one control: a main button that runs the action, joined
     to a menu button that opens the related actions (04 Actions › Buttons › Split button). Built on Button and Menu.
   Usage:
     <SplitButton label="Save" onClick={save} menuLabel="More save options">
       <MenuItem onSelect={saveDraft}>Save as draft</MenuItem>
       <MenuItem onSelect={saveCopy}>Save a copy</MenuItem>
     </SplitButton>
     <SplitButton variant="primary" icon="upload" label="Upload" onClick={upload} menuLabel="More upload options" size="sm">…</SplitButton>
   Props:
     label: the main action, as a verb ("Save"): the main button's label (required)
     onClick(event): runs the main action
     menuLabel: the menu button's accessible name, "More <action> options" (default strings.more, filled with label)
     children: the related actions: MenuItem, MenuGroup, MenuDivider (Menu's items)
     variant: "secondary" (default) | "primary": both parts take the same emphasis
     size: Button's sizes: "md" (default) | "sm" | "xs" | "lg"
     icon: an icon before the main label
     disabled: both parts do nothing (default false)
     placement: where the menu opens: "bottom-end" (default: under the control, aligned with its end) | "bottom-start" |
       "top-start" | "top-end"
     strings: the words it announces, for other languages: { more: "More {label} options" } ({label} is filled with label)
     className: more classes on the control
     ref: forwarded to the main <button>
   Behavior:
     Two Tab stops with their own names: the main button runs the action; the menu button (aria-haspopup="menu",
       aria-expanded) opens the menu: Enter, Space or Arrow Down on its first item, Arrow Up on its last; Escape closes it
       and returns focus to the menu button (Menu).
     The two parts share one edge: square where they meet, a divider between them (on primary, the pressed step of the
       action color, so it shows on the fill).
     Disabled: both parts are disabled.
   Notes:
     The main action never changes by itself to the last one chosen. Use a split button when one action is clearly the
       most common; when all are equally likely, use a menu button (Button with caret and Menu).
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Button } from '../Button/Button.tsx';
import { Menu } from '../Menu/Menu.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';

const PLACES = ['bottom-start', 'bottom-end', 'top-start', 'top-end'];

export const SplitButton = React.forwardRef(function SplitButton({ label, onClick, menuLabel, children, variant = 'secondary', size = 'md', icon,
  disabled = false, placement = 'bottom-end', strings, className }, ref) {
  devWarn('SplitButton', { variant, size }, { variant: ['secondary','primary'], size: ['md','sm','xs','2xs','lg'] });
  const t = useStrings('splitButton', strings);
  const v = variant === 'primary' ? 'primary' : 'secondary';
  const more = menuLabel || t.more.replace('{label}', typeof label === 'string' ? label.toLowerCase() : '').replace(/\s+/g, ' ');
  return (
    <div role="group" aria-label={typeof label === 'string' ? label : undefined} className={cx('plx-split-button', 'plx-split-button--' + v, className)}>
      <Button ref={ref} variant={v} size={size} icon={icon} disabled={disabled} onClick={onClick} className="plx-split-button__main">{label}</Button>
      {disabled
        ? <Button variant={v} size={size} iconOnly caret label={more} disabled className="plx-split-button__toggle" />
        : (
          <Menu placement={PLACES.indexOf(placement) >= 0 ? placement : 'bottom-end'} label={more} className="plx-split-button__menu"
            trigger={<Button variant={v} size={size} iconOnly caret label={more} className="plx-split-button__toggle" />}>
            {children}
          </Menu>
        )}
    </div>
  );
});
