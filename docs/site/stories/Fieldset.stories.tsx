// States: default, row layout, hidden legend. Hover, focus and active belong to the controls inside. Not applicable: disabled is the native fieldset disabled (Disabled), loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Fieldset } from '../../../platform/components/Fieldset/Fieldset.tsx';
import { Checkbox } from '../../../platform/components/Checkbox/Checkbox.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Fieldset', component: Fieldset, tags: ['autodocs'],
  args: { legend: 'Export', gap: 'sm', children: [<Checkbox key="o" label="Originals" />, <Checkbox key="m" label="Metadata" />] } } satisfies Meta<typeof Fieldset>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Row: Story = { args: { layout: 'row' } };
export const HiddenLegend: Story = { args: { hideLegend: true } };
export const Disabled: Story = { args: { disabled: true } };
export const LongText: Story = { args: { legend: 'Which parts of every document in the workspace should be included in the export', children: [<Checkbox key="o" label="The original files exactly as they were uploaded by each member" />, <Checkbox key="m" label="Metadata" />] } };
export const Rtl: Story = { decorators: [rtl] };
