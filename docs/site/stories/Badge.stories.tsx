import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../../platform/components/Badge/Badge.tsx';

const meta = { title: 'Components/Badge', component: Badge, tags: ['autodocs'], args: { children: 'Approved' } } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = { args: { tone: 'success', icon: 'check' } };
export const Waiting: Story = { args: { tone: 'waiting', children: 'Paused' } };
export const Negative: Story = { args: { tone: 'negative', children: 'Rejected' } };
