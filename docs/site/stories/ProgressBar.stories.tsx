// States: determinate, indeterminate, tones, small, hidden label, complete. Not applicable: hover, focus, active, disabled, loading (it is the loading state), selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from '../../../platform/components/ProgressBar/ProgressBar.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/ProgressBar', component: ProgressBar, tags: ['autodocs'], args: { value: 42, label: 'Uploading 3 files', showValue: true } } satisfies Meta<typeof ProgressBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Indeterminate: Story = { args: { value: undefined, showValue: false, label: 'Preparing the export' } };
export const Success: Story = { args: { value: 100, tone: 'success', label: 'Upload complete' } };
export const Warning: Story = { args: { tone: 'warning' } };
export const Danger: Story = { args: { tone: 'danger', label: 'Upload failed' } };
export const Small: Story = { args: { size: 'sm', value: 7, max: 12, tone: 'success', label: 'Tasks done', labelHidden: true, showValue: false } };
export const DataColor: Story = { args: { color: 'purple', label: 'Kitchen Renovation', value: 60 } };
export const Empty: Story = { args: { value: 0 } };
export const LongText: Story = { args: { label: 'Uploading all of the documents from the shared drive of the regional office to the workspace' } };
export const Rtl: Story = { decorators: [rtl] };
