// States: default, hover, focus, a preset chosen, a custom range, future direction, invalid (error), warning, disabled. Not applicable: loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { RelativeDateInput } from '../../../platform/components/RelativeDateInput/RelativeDateInput.tsx';
import { rtl } from './rtl.tsx';

const now = new Date(2026, 9, 19);
const meta = { title: 'Components/RelativeDateInput', component: RelativeDateInput, tags: ['autodocs'], args: { label: 'Modified', now, onChange: () => {} } } satisfies Meta<typeof RelativeDateInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Preset: Story = { args: { defaultValue: 'last-7-days' } };
export const Custom: Story = { args: { defaultValue: { direction: 'past', amount: 3, unit: 'month' } } };
export const Future: Story = { args: { direction: 'future', label: 'Due', defaultValue: 'next-7-days' } };
export const Invalid: Story = { args: { invalid: true, defaultValue: 'last-7-days' } };
export const Warning: Story = { args: { warning: true, defaultValue: 'last-7-days' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'last-7-days' } };
export const LongText: Story = { args: { label: 'The date the case was last modified by anyone on any team in any office', defaultValue: 'last-7-days' } };
export const Rtl: Story = { decorators: [rtl], args: { defaultValue: 'last-7-days' } };
