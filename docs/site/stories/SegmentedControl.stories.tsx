// States: default, selected, focus, small, read-only, long labels (fold into a Select). Hover and active are the segments. Not applicable: disabled, loading, error.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { SegmentedControl } from '../../../platform/components/SegmentedControl/SegmentedControl.tsx';
import { rtl } from './rtl.tsx';

const options = [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }];
const meta = { title: 'Components/SegmentedControl', component: SegmentedControl, tags: ['autodocs'], args: { label: 'Theme', options, value: 'light', onChange: () => {} } } satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { value: 'dark' } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Small: Story = { args: { size: 'sm' } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const NoValue: Story = { args: { value: undefined } };
export const LongText: Story = { args: { options: [{ value: 'a', label: 'All of the documents in the workspace' }, { value: 'b', label: 'Only the documents shared with me' }, { value: 'c', label: 'Only the documents I own and have not shared' }] }, decorators: [(Story) => <div className="plx-u-max-w-600px"><Story /></div>] };
export const Rtl: Story = { decorators: [rtl] };
