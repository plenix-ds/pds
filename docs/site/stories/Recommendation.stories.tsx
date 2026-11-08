// States: row (default), with reasons, hover and focus on a recommendation, a pending selection (loading), error (a failed selection), empty. Not applicable: disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Recommendation } from '../../../platform/patterns/Recommendation/Recommendation.tsx';
import { rtl } from './rtl.tsx';

const items = [{ id: 1, title: 'Council calendar', description: 'Meeting dates for the year', reason: 'You read a related report', href: '/calendar' }, { id: 2, title: 'Budget guide', description: 'How the budget is set', reason: 'You saved a budget topic' }, { id: 3, title: 'Filing checklist', description: 'Steps to file a case' }];
const meta = { title: 'Patterns/Recommendation', component: Recommendation, tags: ['autodocs'], args: { items, onSelect: () => {} } } satisfies Meta<typeof Recommendation>;
export default meta;
type Story = StoryObj<typeof meta>;
const pick = async (c: HTMLElement) => { await userEvent.click(within(c).getAllByRole('button').find((b) => /open|view|select/i.test(b.textContent || '')) || within(c).getAllByRole('button')[0]); };

export const Default: Story = {};
export const WithReasons: Story = { args: { variant: 'reason' } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Loading: Story = { args: { onSelect: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await pick(canvasElement); } };
export const Error: Story = { args: { onSelect: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await pick(canvasElement); } };
export const Empty: Story = { args: { items: [] } };
export const OnePerView: Story = { args: { perView: 1 } };
export const LongText: Story = { args: { variant: 'reason', items: [{ id: 1, title: 'A recommendation with a very long title that does not fit the width of its slide', description: 'A description that runs on well past the width of the slide.', reason: 'Suggested because it matches your saved topics and the reports you read this week' }] } };
export const Rtl: Story = { decorators: [rtl] };
