// States: each tone, presence tones with shapes, sizes. Not applicable: hover, focus, active, disabled, loading, error, selected (a mark).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusDot } from '../../../platform/components/StatusDot/StatusDot.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/StatusDot', component: StatusDot, tags: ['autodocs'], args: { tone: 'success', label: 'Active' } } satisfies Meta<typeof StatusDot>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Neutral: Story = { args: { tone: 'neutral', label: 'Paused' } };
export const Warning: Story = { args: { tone: 'warning', label: 'Priority' } };
export const Danger: Story = { args: { tone: 'danger', label: 'Failed' } };
export const Busy: Story = { args: { tone: 'busy', size: 'md', icon: true, label: 'Busy' } };
export const DoNotDisturb: Story = { args: { tone: 'dnd', size: 'md', icon: true, label: 'Do not disturb' } };
export const Away: Story = { args: { tone: 'away', size: 'lg', icon: true, label: 'Away' } };
export const Online: Story = { args: { tone: 'online', size: 'lg', icon: true, label: 'Online' } };
export const Offline: Story = { args: { tone: 'offline', size: 'lg', icon: true, label: 'Offline' } };
export const Rtl: Story = { decorators: [rtl] };
