// States: default (searchable), search with matches, no matches (empty), a pending reuse (loading), error (a failed reuse stays in context), not searchable, empty history. Not applicable: disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { PromptHistory } from '../../../platform/patterns/PromptHistory/PromptHistory.tsx';
import { rtl } from './rtl.tsx';

const items = [{ id: 1, prompt: 'Summarize the hearing notes', createdAt: '2026-10-05T10:24:00Z' }, { id: 2, prompt: 'Draft a reply to the registry', createdAt: '2026-10-04T09:02:00Z' }, { id: 3, prompt: 'List the open questions', createdAt: '2026-10-03T16:40:00Z' }];
const meta = { title: 'Patterns/PromptHistory', component: PromptHistory, tags: ['autodocs'], args: { items, onSelect: () => {} } } satisfies Meta<typeof PromptHistory>;
export default meta;
type Story = StoryObj<typeof meta>;
const first = async (c: HTMLElement) => { await userEvent.click(within(c).getAllByRole('button')[0]); };

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Search: Story = { play: async ({ canvasElement }) => { await userEvent.type(within(canvasElement).getByRole('searchbox'), 'reply'); } };
export const NoMatches: Story = { play: async ({ canvasElement }) => { await userEvent.type(within(canvasElement).getByRole('searchbox'), 'zzzz'); } };
export const Loading: Story = { args: { onSelect: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await first(canvasElement); } };
export const Error: Story = { args: { onSelect: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await first(canvasElement); } };
export const NotSearchable: Story = { args: { searchable: false } };
export const Empty: Story = { args: { items: [] } };
export const LongText: Story = { args: { items: [{ id: 1, prompt: 'Summarize every hearing note, every supporting letter and every piece of new evidence in the case file and list the open questions for the president', createdAt: '2026-10-05T10:24:00Z' }] } };
export const Rtl: Story = { decorators: [rtl] };
