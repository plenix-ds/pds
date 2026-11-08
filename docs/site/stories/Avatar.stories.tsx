// States: default (initials), picture, presence, gender icon, AI provider. Not applicable: hover, focus, active, disabled, loading, error, selected (a static image).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../../../platform/components/Avatar/Avatar.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Avatar', component: Avatar, tags: ['autodocs'], args: { name: 'Maya Chen', label: 'Maya Chen' } } satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Large: Story = { args: { size: 'xl' } };
export const Colored: Story = { args: { color: 'purple' } };
export const Gender: Story = { args: { name: undefined, gender: 'female', label: 'Alex Kim' } };
export const Online: Story = { args: { size: 'lg', presence: 'online' } };
export const Busy: Story = { args: { size: 'lg', presence: 'busy' } };
export const Ai: Story = { args: { name: undefined, ai: 'claude', label: 'Claude' } };
export const LongText: Story = { args: { name: 'Alexandria Montgomery-Whitfield Jr.', label: 'Alexandria Montgomery-Whitfield Jr.' } };
export const Rtl: Story = { decorators: [rtl], args: { size: 'lg', presence: 'away' } };
