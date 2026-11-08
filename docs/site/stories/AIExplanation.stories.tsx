// States: closed (default), open, focus on the trigger, with factors, with confidence. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { AIExplanation } from '../../../platform/patterns/AIExplanation/AIExplanation.tsx';
import { rtl } from './rtl.tsx';

const factors = [{ id: 'a', label: 'Saved topics', detail: 'You saved three topics about budgets.' }, { id: 'b', label: 'Recent reading', detail: 'You read two related reports this week.' }];
const meta = { title: 'Patterns/AIExplanation', component: AIExplanation, tags: ['autodocs'], args: { summary: 'Suggested because it matches your saved topics.', factors } } satisfies Meta<typeof AIExplanation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole('button')); } };
export const SummaryOnly: Story = { args: { factors: [] }, play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole('button')); } };
export const LongText: Story = { args: { summary: 'Suggested because it matches your saved topics, the reports you read this week, the teams you follow and the cases you have opened in the last month.' }, play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole('button')); } };
export const Rtl: Story = { decorators: [rtl], play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole('button')); } };
