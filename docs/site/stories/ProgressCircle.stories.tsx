// States: determinate, indeterminate, sizes, tones, with value. Not applicable: hover, focus, active, disabled, loading (it is the loading state), selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressCircle } from '../../../platform/components/ProgressCircle/ProgressCircle.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/ProgressCircle', component: ProgressCircle, tags: ['autodocs'], args: { value: 62, label: 'Uploading 3 files' } } satisfies Meta<typeof ProgressCircle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Indeterminate: Story = { args: { value: undefined, label: 'Loading assets', size: 'sm' } };
export const Large: Story = { args: { size: 'lg', showValue: true, value: 7, max: 12, tone: 'success', label: 'Tasks done' } };
export const Danger: Story = { args: { tone: 'danger', label: 'Upload failed' } };
export const Empty: Story = { args: { value: 0 } };
export const Rtl: Story = { decorators: [rtl], args: { size: 'lg', showValue: true } };
