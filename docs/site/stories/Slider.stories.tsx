// States: default, hover, focus, range, marks, disabled. Not applicable: loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Slider } from '../../../platform/components/Slider/Slider.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Slider', component: Slider, tags: ['autodocs'], args: { label: 'Brightness', value: 40, min: 0, max: 100, step: 1, unit: '%', onChange: () => {} } } satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Range: Story = { args: { range: true, label: 'Price', value: [20, 80], max: 200, step: 5, unit: ' €' } };
export const Marks: Story = { args: { label: 'Quality', step: 25, marks: [0, 25, 50, 75, 100] } };
export const Minimum: Story = { args: { value: 0 } };
export const Maximum: Story = { args: { value: 100 } };
export const Disabled: Story = { args: { disabled: true } };
export const LongText: Story = { args: { label: 'Brightness of every screen in the regional office during the evening hours' } };
export const Rtl: Story = { decorators: [rtl], args: { range: true, value: [20, 80] } };
