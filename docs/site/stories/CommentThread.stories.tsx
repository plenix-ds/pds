// States: default, resolved (replies off), focus on the composer, a failed reply keeps the draft (error), a pending reply (loading), editing, empty. Not applicable: disabled beyond resolved, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { CommentThread } from '../../../platform/patterns/CommentThread/CommentThread.tsx';
import { rtl } from './rtl.tsx';

const comments = [{ id: 1, author: 'Maya Chen', body: 'Can we move the hearing to Thursday?', time: '2026-10-05T10:24' }, { id: 2, author: 'You', body: 'Yes, Thursday works.', time: '2026-10-05T10:30', own: true, edited: true }];
const meta = { title: 'Patterns/CommentThread', component: CommentThread, tags: ['autodocs'], args: { title: 'Hearing date', comments, onReply: () => {}, onResolve: () => {} } } satisfies Meta<typeof CommentThread>;
export default meta;
type Story = StoryObj<typeof meta>;
const reply = async (c: HTMLElement) => { await userEvent.type(within(c).getByRole('textbox'), 'Thanks{Enter}'); };

export const Default: Story = {};
export const Resolved: Story = { args: { resolved: true } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Loading: Story = { args: { onReply: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await reply(canvasElement); } };
export const Error: Story = { args: { onReply: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await reply(canvasElement); } };
export const Empty: Story = { args: { comments: [] } };
export const LongText: Story = { args: { comments: [{ ...comments[0], body: 'Can we move the hearing for the third floor case to Thursday, after the registry has confirmed the room and the president has reviewed the full submission and the supporting letters? '.repeat(3) }] } };
export const Rtl: Story = { decorators: [rtl] };
