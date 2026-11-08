// States: default, hover, focus, with a value, stepper buttons, quantity, currency, percent, unit, disabled, read-only, invalid (error). Not applicable: loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { NumberInput } from '../../../platform/components/NumberInput/NumberInput.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/NumberInput', component: NumberInput, tags: ['autodocs'], args: { 'aria-label': 'Copies', defaultValue: 2, min: 1, max: 99 } } satisfies Meta<typeof NumberInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Empty: Story = { args: { defaultValue: null } };
export const Stepper: Story = { args: { stepper: 'buttons', width: 'sm' } };
export const Quantity: Story = { args: { stepper: 'quantity', max: 5, 'aria-label': 'Quantity, Blue chair' } };
export const Currency: Story = { args: { format: 'currency', currency: 'USD', defaultValue: 1299.5, min: 0 } };
export const Percent: Story = { args: { format: 'percent', defaultValue: 25, min: 0, max: 100 } };
export const Unit: Story = { args: { unit: 'kg', step: 0.1, decimals: 1, defaultValue: 4.2 } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const Invalid: Story = { args: { invalid: true } };
export const LongText: Story = { args: { defaultValue: 1234567890.123456, decimals: 6, width: 'sm' } };
export const Rtl: Story = { decorators: [rtl], args: { stepper: 'buttons' } };
