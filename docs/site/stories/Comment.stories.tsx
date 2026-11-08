// States: default, own, edited, resolved, with reactions. Hover and focus are on its actions: focus is reached by play. Not applicable: disabled, loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Comment } from '../../../platform/components/Comment/Comment.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Comment', component: Comment, tags: ['autodocs'],
  args: { author: { name: 'Maya Chen' }, body: 'Ready for review.', time: '2026-10-15T12:00:00Z' } } satisfies Meta<typeof Comment>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Own: Story = { args: { own: true, onEdit: () => {} } };
export const Edited: Story = { args: { edited: true } };
export const Resolved: Story = { args: { resolved: true, onResolve: () => {} } };
export const Reactions: Story = { args: { reactions: [{ id: 'up', label: 'Thumbs up', count: 3, active: true }, { id: 'ok', label: 'Done', count: 1 }], onReact: () => {} } };
export const Focus: Story = { args: { onResolve: () => {} }, play: async () => { await userEvent.tab(); } };
export const LongText: Story = { args: { body: 'Ready for review, but please check the permit dates against the contractor schedule first, because the third floor works overlap with the inspection window and nobody has confirmed that yet.' } };
export const Rtl: Story = { decorators: [rtl] };
