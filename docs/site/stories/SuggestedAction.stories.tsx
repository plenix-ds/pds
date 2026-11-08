// States: chip (default), card, hover and focus, disabled, loading (a pending action), error (a failed action stays beside it). Not applicable: selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { SuggestedAction } from '../../../platform/components/SuggestedAction/SuggestedAction.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/SuggestedAction', component: SuggestedAction, tags: ['autodocs'], args: { children: 'Summarize selection', onAction: () => {} } } satisfies Meta<typeof SuggestedAction>;
export default meta;
type Story = StoryObj<typeof meta>;
const press = async (c: HTMLElement) => { await userEvent.click(within(c).getByRole('button')); };

export const Default: Story = {};
export const Card: Story = { args: { variant: 'card', description: 'A short summary of the text you selected' } };
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(within(canvasElement).getByRole('button')); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { onAction: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await press(canvasElement); } };
export const Error: Story = { args: { onAction: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await press(canvasElement); } };
export const LongText: Story = { args: { variant: 'card', children: 'Summarize every document in this case for the president', description: 'A summary of every supporting letter, every hearing note and every piece of new evidence in the case file' } };
export const Rtl: Story = { decorators: [rtl], args: { variant: 'card', description: 'A short summary' } };
