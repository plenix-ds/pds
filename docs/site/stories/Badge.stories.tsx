// States: default and every tone (success, waiting, negative, neutral, active, action-required). Not applicable: hover, focus, active, disabled, loading, error, selected (a static status).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../../platform/components/Badge/Badge.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Badge', component: Badge, tags: ['autodocs'], args: { children: 'Approved' } } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = { args: { tone: 'success', icon: 'check' } };
export const Waiting: Story = { args: { tone: 'waiting', children: 'Paused' } };
export const Negative: Story = { args: { tone: 'negative', children: 'Rejected' } };
export const Neutral: Story = { args: { tone: 'neutral', children: 'Draft' } };
export const Active: Story = { args: { tone: 'active', children: 'In review' } };
export const ActionRequired: Story = { args: { tone: 'action-required', children: 'Needs a reply' } };
export const LongText: Story = { args: { tone: 'waiting', children: 'Waiting for the president to review the full submission' } };
export const Rtl: Story = { decorators: [rtl], args: { tone: 'success', icon: 'check' } };
