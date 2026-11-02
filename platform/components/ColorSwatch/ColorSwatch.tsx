/* Plenix · ColorSwatch
   Summary: A color from the data shown as a small square chip (a category's color).
   Usage:
     <ColorSwatch color={category.color} />
     <ColorSwatch color={category.color} label="Blue" pressed={picked === 'blue'} onClick={() => …} />
     <ColorSwatch color="green" label="Green" showLabel />
     <ColorPicker palette="category" colors={['red', 'green', 'blue']} value={c} onChange={setC} />
   Props:
     color: a data color: a hue name (blue, green, purple, red, brown, gray: the --plx-sys-data-color-<hue> tokens), set as data-plx-color; no value is written (batch 280)
     category: instead of color, a category color by name (CATEGORY_COLORS: the category palette, its own tokens), set as
       data-plx-category (batch 290)
     tone: instead of color, a surface of the system it previews: "accent" (the accent surface) | "surface" | "frost"
     size: "sm" (16px) | "md" (default; 20px)
     shape: "square" (default: 2px corners, owner batch 291) | "round" (a circle)
     pressed: marks the chosen color (aria-pressed), with onClick
     label: the accessible name of the color, with onClick
     showLabel: shows the label as text after the swatch (default false); with onClick the swatch and its label are one
       button (wave 4)
     onClick(event): makes the swatch a button that picks the color
     readOnly: a swatch button keeps its pressed state and does not run onClick; default the nearest ReadOnly region's (useReadOnly)
     className: more classes on the swatch
     ColorPicker: the data colors (DATA_COLORS) as a group of swatch buttons, one pressed (batch 280: a data color is a hue)
       ColorPicker.value: the chosen hue
       ColorPicker.onChange(hue): runs with the hue picked
       ColorPicker.label: the group's accessible name (default "Color")
       ColorPicker.size: the swatches' size (default "md")
       ColorPicker.palette: "data" (default: the data hues) | "category" (the category colors: categories use these)
       ColorPicker.colors: a custom set: the names to offer from the palette, in this order (unknown names are left out)
         (wave 4)
       ColorPicker shows one row (owner, batch 290): the colors that do not fit are in a More menu at its end ("+n", or the
       chosen color when it is one of them), each with its swatch and name
       ColorPicker.readOnly: shows the chosen color and picks nothing, in the row and in its More menu; default the nearest ReadOnly region's
       ColorPicker.className: more classes on the group
   Behavior:
     unavailable marks the swatch cursor; callers still supply aria-disabled and prevent unavailable choices.
     Labeled swatches pass pressed state to their chip; the chip owns its selected shadow.
     With onClick it is a button that picks the color; without it the swatch is hidden from assistive technology.
     With showLabel the color's name is text beside it, read as text; the swatch itself stays decorative.
     A swatch button's target is at least 24px (44px with touch) whatever its size: it extends invisibly past the swatch
       (Platforms Standard 3.1); with touch each swatch of a ColorPicker gets a slot that wide.
   Notes:
     The hue reaches the stylesheet as the data-plx-color attribute (system/steps.css), the only way a data color enters a page.
     Other props pass through to the <button> or <span>.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { DATA_COLORS } from './dataColors.js';
import { CATEGORY_COLORS } from './categoryColors.js';
import { Button } from '../Button/Button.tsx';
import { Menu, MenuItem } from '../Menu/Menu.tsx';
import { useOverflow, splitAt } from '../../utils/overflow.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { useReadOnly } from '../../providers/ReadOnly.tsx';

const nameOf = (h) => h.charAt(0).toUpperCase() + h.slice(1);

export function ColorSwatch({ color, category, tone, size = 'md', shape = 'square', pressed, label, showLabel = false, unavailable = false, onClick: pick, readOnly, className, ...rest }) {
  if (category === 'brown') category = 'orange';
  devWarn('ColorSwatch', { tone, size }, { tone: ['accent','surface','frost'], size: ['sm','md'] });
  const locked = useReadOnly(readOnly);
  // read-only: a swatch button stays a button (focus, pressed state) but its press picks nothing
  const onClick = pick ? (locked ? (e) => { e.preventDefault(); } : pick) : undefined;
  if (showLabel && label) {
    // the swatch and its name as one unit: a button when it picks the color, else a span with the name as text
    const chip = <ColorSwatch color={color} category={category} tone={tone} size={size} shape={shape} pressed={!!onClick && !!pressed} unavailable={unavailable} />;
    const text = <span className="plx-color-swatch-label__text">{label}</span>;
    return onClick ? <button type="button" className={cx('plx-color-swatch-label', className)} data-plx-unavailable={unavailable ? '' : undefined} aria-pressed={!!pressed} onClick={onClick} {...rest}>{chip}{text}</button>
      : <span className={cx('plx-color-swatch-label', className)} data-plx-unavailable={unavailable ? '' : undefined} {...rest}>{chip}{text}</span>;
  }
  const cls = cx('plx-color-swatch', 'plx-color-swatch--' + size, shape === 'round' && 'plx-color-swatch--round', tone && 'plx-color-swatch--' + tone, className);
  return onClick ? <button type="button" className={cls} data-plx-color={color || undefined} data-plx-category={category || undefined} data-plx-unavailable={unavailable ? '' : undefined} aria-pressed={!!pressed} aria-label={label} onClick={onClick} {...rest} />
    : <span className={cls} data-plx-color={color || undefined} data-plx-category={category || undefined} data-plx-unavailable={unavailable ? '' : undefined} data-plx-selected={pressed ? '' : undefined} aria-hidden="true" {...rest} />;
}

// the data colors to choose from: each a swatch button named by its hue, the chosen one pressed
export function ColorPicker({ value, onChange, label, size = 'md', palette = 'data', colors, invalid, required, readOnly, className, ...rest }) {   // invalid and required: from Field, not for a group
  devWarn('ColorPicker', { size }, { size: ['sm','md'] });
  const locked = useReadOnly(readOnly);
  const tw = useStrings('colorSwatch');
  if (label === undefined) label = tw.label;
  const colorName = (h) => (tw.colors && tw.colors[h]) || nameOf(h);
  const cat = palette === 'category';
  if (cat && value === 'brown') value = 'orange';
  const all = cat ? CATEGORY_COLORS : DATA_COLORS;
  const list = Array.isArray(colors) ? [...new Set(colors.map((h) => cat && h === 'brown' ? 'orange' : h))].filter((h) => all.indexOf(h) >= 0) : all;
  const ref = React.useRef(null);
  const fit = useOverflow(ref, list.length, palette + size + list.join());
  const hidden = list.slice(fit);
  const pick = (h) => { if (onChange && !locked) onChange(h); };
  const swatch = (h, extra) => <ColorSwatch key={h} color={cat ? undefined : h} category={cat ? h : undefined} size={size} {...extra} />;
  // each swatch in a slot as tall as the row, so every item and the More button share the first row's top
  const items = list.map((h) => <span key={h} data-plx-overflow-item="" className="plx-color-picker__slot">{swatch(h, { label: colorName(h), pressed: value === h, onClick: () => pick(h) })}</span>);
  const chosenHidden = hidden.indexOf(value) >= 0;
  const more = hidden.length ? (
    <span key="plx-more" data-plx-overflow-more="" className="plx-color-picker__more">
      <Menu label={tw.more} placement="bottom-end"
        trigger={<Button size="2xs" variant={chosenHidden ? 'secondary' : 'ghost'} caret aria-label={chosenHidden ? tw.moreChosen.replace('{name}', colorName(value)) : tw.more}>
          {chosenHidden ? <ColorSwatch color={cat ? undefined : value} category={cat ? value : undefined} size="sm" /> : '+' + hidden.length}</Button>}>
        {hidden.map((h) => <MenuItem key={h} role="menuitemradio" checked={value === h} icon={swatch(h, { size: 'sm' })} onSelect={() => pick(h)}>{colorName(h)}</MenuItem>)}
      </Menu>
    </span>
  ) : null;
  return (
    <div ref={ref} role="group" aria-label={label || undefined} className={cx('plx-color-picker', className)} {...rest}>
      {splitAt(items, fit, more)}
    </div>
  );
}
