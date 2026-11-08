// States: default, focus, loading (a pending search), results with an answer and sources, empty results, error (a failed search keeps the previous result), semantic on. Not applicable: disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { AISearch } from '../../../platform/patterns/AISearch/AISearch.tsx';
import { rtl } from './rtl.tsx';

const found = { answer: 'The council meets quarterly.', sources: [{ id: 's1', title: 'Council calendar', href: '/calendar' }], results: [{ id: 'r1', title: 'Meeting schedule', href: '/schedule', description: 'Dates for the year' }] };
const meta = { title: 'Patterns/AISearch', component: AISearch, tags: ['autodocs'], args: { onSearch: async () => found } } satisfies Meta<typeof AISearch>;
export default meta;
type Story = StoryObj<typeof meta>;
const search = async (c: HTMLElement) => { await userEvent.type(within(c).getByRole('searchbox'), 'meetings{Enter}'); };

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Results: Story = { args: { defaultQuery: 'meetings' }, play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getAllByRole('button')[0]); } };
export const Loading: Story = { args: { onSearch: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await search(canvasElement); } };
export const Empty: Story = { args: { onSearch: async () => ({ results: [] }) }, play: async ({ canvasElement }) => { await search(canvasElement); } };
export const Error: Story = { args: { onSearch: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await search(canvasElement); } };
export const Semantic: Story = { args: { defaultSemantic: true } };
export const NoToggle: Story = { args: { semanticToggle: false } };
export const LongText: Story = { args: { defaultQuery: 'When does the council meet to review every application filed in every office during the quarter' } };
export const Rtl: Story = { decorators: [rtl] };
