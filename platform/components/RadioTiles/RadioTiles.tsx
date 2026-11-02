/* Plenix · RadioTiles
   Summary: A choice of one among a few options shown as tiles, each with a preview, a label and a description
     (02 › Inputs › Selection › Selectable card).
   Usage:
     <RadioTiles legend="Header style" value={style} onChange={setStyle}
       options={[{ value: 'solid', label: 'Solid', description: 'The accent color', preview: <…/> }, { value: 'light', label: 'Light' }]} />
   Props:
     legend: what is being chosen (the group's name)
     legendHidden: the legend is for assistive technology only (default false)
     options: [{ value, label, description, preview, disabled }]
     value: the chosen value
     onChange(value): runs when another tile is chosen
     name: the radio group's name (default: a unique one)
     size: "sm" | "md" (default) | "lg": the tiles' minimum width
     readOnly: the choice shows but cannot change (default: the nearest read-only region's, useReadOnly)
     className: more classes on the group
   Behavior:
     Public context --plx-comp-radio-tiles-legend-line-height applies to legends inside its containing element; fallback inherit.
     A native radio group: Tab moves into it, the arrow keys move the choice, Space chooses.
     The chosen tile shows the selected border and a check; a focused tile shows the focus ring.
   Notes:
     The preview is decorative (aria-hidden); the label and description name the option.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { useReadOnly, readOnlyProps } from '../../providers/ReadOnly.tsx';
import { Icon } from '../Icon/Icon.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';

export type RadioTileOption = { value: string | number; label?: React.ReactNode; description?: React.ReactNode; preview?: React.ReactNode; disabled?: boolean };
export type RadioTilesProps = Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange'> & {
  legend?: React.ReactNode;
  legendHidden?: boolean;
  options?: RadioTileOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
};
export function RadioTiles({ legend, legendHidden = false, options = [], value, onChange, name, size = 'md', className, readOnly, ...rest }: RadioTilesProps) {
  const locked = useReadOnly(readOnly);
  devWarn('RadioTiles', { size }, { size: ['sm','md','lg'] });
  const auto = 'plx-rt' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <fieldset className={cx('plx-radio-tiles', 'plx-radio-tiles--' + size, className)} {...rest}>
      <legend className={cx('plx-radio-tiles__legend', legendHidden && 'plx-visually-hidden')}>{legend}</legend>
      <div className="plx-radio-tiles__grid">
        {options.map((o) => {
          const on = o.value === value;
          return (
            <label key={o.value} className={cx('plx-radio-tile', on && 'is-selected', o.disabled && 'is-disabled')}>
              <input className="plx-radio-tile__input plx-visually-hidden" type="radio"
                {...(readOnlyProps(locked, { name: name || auto, value: o.value, checked: on, disabled: o.disabled, onChange: () => { if (onChange) onChange(o.value); } }, { aria: false }) as React.InputHTMLAttributes<HTMLInputElement>)} />
              {o.preview ? <span className="plx-radio-tile__preview" aria-hidden="true">{o.preview}</span> : null}
              <span className="plx-radio-tile__text">
                <span className="plx-radio-tile__label">{o.label}</span>
                {o.description ? <span className="plx-radio-tile__description">{o.description}</span> : null}
              </span>
              <span className="plx-radio-tile__check" aria-hidden="true">{on ? <Icon name={CheckIcon} size="sm" filled /> : null}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
