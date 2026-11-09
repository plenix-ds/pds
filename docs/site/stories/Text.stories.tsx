// States: variants, truncate, lines (clamped), expandable (expanded and collapsed), tabular. Not applicable: hover, focus (the expand button only), active, disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Text } from '../../../platform/components/Text/Text.tsx';
import { rtl } from './rtl.tsx';

const long = 'A long description of the kitchen remodel: the cabinets, the island, the restored window frames and the lighting, with the plumber and the electrician booked for the second week.';
const meta = { title: 'Components/Text', component: Text, tags: ['autodocs'], args: { children: 'Last edited 2 days ago' } } satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', as: 'p' } };
export const Display: Story = { args: { variant: 'display', as: 'h1', children: '1,284 assets' } };
export const Danger: Story = { args: { variant: 'danger' } };
export const Truncate: Story = { args: { truncate: true, as: 'p', children: long }, decorators: [(Story) => <div className="plx-u-max-w-600px"><Story /></div>] };
export const Lines: Story = { args: { lines: 3, as: 'p', children: long }, decorators: [(Story) => <div className="plx-u-max-w-600px"><Story /></div>] };
export const Expandable: Story = { args: { lines: 2, expandable: true, as: 'p', children: long } };
export const Expanded: Story = { args: { lines: 2, expandable: true, defaultExpanded: true, as: 'p', children: long } };
export const FocusExpand: Story = { args: { lines: 2, expandable: true, as: 'p', children: long }, play: async () => { await userEvent.tab(); } };
export const Tabular: Story = { args: { tabular: true, variant: 'secondary', children: '12:40' } };
export const Rtl: Story = { decorators: [rtl], args: { variant: 'secondary', as: 'p' } };
