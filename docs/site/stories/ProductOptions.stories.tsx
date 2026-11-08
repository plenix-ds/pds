// States: default, selected values, unavailable value, error, quantity, disabled. Hover, focus and active are on the option buttons: focus is reached by play. Not applicable: loading.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ProductOptions } from '../../../platform/components/ProductOptions/ProductOptions.tsx';
import { rtl } from './rtl.tsx';

const options = [
  { name: 'size', label: 'Size', kind: 'buttons' as const, values: [{ value: 'S' }, { value: 'M' }, { value: 'L' }, { value: 'XL', available: false }] },
  { name: 'color', label: 'Color', kind: 'swatches' as const, values: [{ value: 'navy', label: 'Navy', category: 'navy' }, { value: 'red', label: 'Red', category: 'red' }] },
];
const meta = { title: 'Components/ProductOptions', component: ProductOptions, tags: ['autodocs'], args: { product: 'Choir robe', options, value: {}, onChange: () => {} } } satisfies Meta<typeof ProductOptions>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Selected: Story = { args: { value: { size: 'M', color: 'navy' } } };
export const Error: Story = { args: { errors: { size: 'Choose a size' } } };
export const Quantity: Story = { args: { quantity: 2, onQuantityChange: () => {}, value: { size: 'M' } } };
export const SwatchLabels: Story = { args: { swatchLabels: true } };
export const Disabled: Story = { args: { disabled: true, value: { size: 'M' } } };
export const Rtl: Story = { decorators: [rtl], args: { value: { size: 'M' } } };
