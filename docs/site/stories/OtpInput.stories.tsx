// States: default, hover, focus, partly filled, complete, masked (a PIN), invalid (error), warning, disabled. Not applicable: loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { OtpInput } from '../../../platform/components/OtpInput/OtpInput.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/OtpInput', component: OtpInput, tags: ['autodocs'], args: { label: 'Verification code' } } satisfies Meta<typeof OtpInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Partial: Story = { args: { defaultValue: '123' } };
export const Complete: Story = { args: { defaultValue: '123456' } };
export const Masked: Story = { args: { length: 4, masked: true, label: 'PIN', defaultValue: '12' } };
export const Alphanumeric: Story = { args: { kind: 'alphanumeric', length: 8, label: 'Recovery code' } };
export const Invalid: Story = { args: { invalid: true, defaultValue: '123456' } };
export const Warning: Story = { args: { warning: true, defaultValue: '1234' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: '123' } };
export const LongText: Story = { args: { length: 12, kind: 'alphanumeric', label: 'Recovery code for every device you have signed in on' } };
export const Rtl: Story = { decorators: [rtl], args: { defaultValue: '123' } };
