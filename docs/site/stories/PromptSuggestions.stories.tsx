// States: chips (default), cards, hover and focus on an option, disabled option, loading (a pending choice), error (a failed choice stays available), empty. Not applicable: selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { PromptSuggestions } from '../../../platform/components/PromptSuggestions/PromptSuggestions.tsx';
import { rtl } from './rtl.tsx';

const options = [{ id: 'summary', label: 'Summarize', prompt: 'Summarize this case', description: 'A short summary' }, { id: 'next', label: 'Next steps', prompt: 'List the next steps' }, { id: 'draft', label: 'Draft a reply', prompt: 'Draft a reply', disabled: true }];
const meta = { title: 'Components/PromptSuggestions', component: PromptSuggestions, tags: ['autodocs'], args: { options, onSelect: () => {} } } satisfies Meta<typeof PromptSuggestions>;
export default meta;
type Story = StoryObj<typeof meta>;
const first = (c: HTMLElement) => within(c).getAllByRole('button')[0];

export const Default: Story = {};
export const Cards: Story = { args: { variant: 'cards' } };
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(first(canvasElement)); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Loading: Story = { args: { onSelect: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await userEvent.click(first(canvasElement)); } };
export const Error: Story = { args: { onSelect: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await userEvent.click(first(canvasElement)); } };
export const Empty: Story = { args: { options: [] } };
export const Disabled: Story = { args: { disabled: true } };
export const LongText: Story = { args: { variant: 'cards', options: [{ id: 'a', label: 'Summarize every document in this case for the president', prompt: 'Summarize', description: 'A summary of every supporting letter, every hearing note and every piece of new evidence in the file' }] } };
export const Rtl: Story = { decorators: [rtl], args: { variant: 'cards' } };
