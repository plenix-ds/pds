/* Plenix · SingleQuickFilterMenu
   Summary: A quick filter's single-choice radio group inside More.
   Usage: <SingleQuickFilterMenu {...quickFilter} />
   Props: label, options, value, required, onChange, counts and strings are the QuickFilter descriptor.
   Behavior: Required choices omit All; radio changes preserve the collection's array shape.
   Notes: The CommandBar folding task 132 consumes this shared group. */
import React from 'react';
import { MenuRadioGroup, MenuItem } from '../../components/Menu/Menu.tsx';
import { singleChoice } from './single-choice.ts';
import { Text } from '../../components/Text/Text.tsx';
import { Inline } from '../../components/Stack/Stack.tsx';
import { formatNumber } from '../../utils/format.ts';
export function SingleQuickFilterMenu({ label, options = [], value, required, onChange, counts, strings }: any) {
  const chosen = singleChoice(options, value, required);
  const items = options.map((option: any) => typeof option === 'string' ? { value: option, label: option } : option);
  if (!required) items.unshift({ value: '', label: strings && strings.all || 'All' });
  return <MenuRadioGroup label={label} value={chosen.length ? chosen[0] : ''} onChange={(v: any) => onChange && onChange(v === '' ? [] : [v])}>
    {items.map((option: any) => {
      const count = option.count !== undefined ? option.count : counts instanceof Map ? counts.get(option.value) || 0 : counts ? counts[option.value] || 0 : undefined;
      return <MenuItem key={option.value} value={option.value}>{count === undefined ? option.label || option.value : <Inline as="span" gap="xs">{option.label || option.value}<Text variant="data">{formatNumber(count)}</Text></Inline>}</MenuItem>;
    })}
  </MenuRadioGroup>;
}

