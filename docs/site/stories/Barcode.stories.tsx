// States: default, error (a value the format cannot hold). Not applicable: hover, focus, active, disabled, loading, selected (not interactive).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Barcode } from '../../../platform/components/Barcode/Barcode.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Barcode', component: Barcode, tags: ['autodocs'], args: { value: 'PLX-2026-0042' } } satisfies Meta<typeof Barcode>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Ean13: Story = { args: { value: '400638133393', format: 'ean13' } };
export const UpcA: Story = { args: { value: '03600029145', format: 'upca', size: 'lg', showText: false } };
export const Small: Story = { args: { size: 'sm' } };
export const Error: Story = { args: { value: 'abc', format: 'ean13' } };
export const LongText: Story = { args: { value: 'PLX-2026-0042-WAREHOUSE-NORTH-AISLE-17-SHELF-04-BIN-0099' } };
export const Rtl: Story = { decorators: [rtl] };
