// States: closed (the button), open (a checklist), with values chosen (selected), date presets, single choice, hover and focus, with counts. Not applicable: disabled, loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { QuickFilter } from '../../../platform/patterns/QuickFilter/QuickFilter.tsx';
import { rtl } from './rtl.tsx';

const tags = [{ value: 'urgent', label: 'Urgent', color: 'red', count: 4 }, { value: 'review', label: 'Review', color: 'blue', count: 9 }, { value: 'archive', label: 'Archive', color: 'gray', count: 21 }];
const meta = { title: 'Patterns/QuickFilter', component: QuickFilter, tags: ['autodocs'], args: { label: 'Tags', icon: 'tags', noun: 'tag', options: tags, value: [], onChange: () => {} } } satisfies Meta<typeof QuickFilter>;
export default meta;
type Story = StoryObj<typeof meta>;
const open = async (c: HTMLElement) => { await userEvent.click(within(c).getByRole('button')); };

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Chosen: Story = { args: { value: ['urgent', 'review'] } };
export const Single: Story = { args: { kind: 'single', label: 'Type', value: ['urgent'] }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const DateFilter: Story = { args: { kind: 'date', label: 'Modified', icon: 'calendar', options: undefined, value: { preset: '7' } }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const LongText: Story = { args: { options: [{ value: 'a', label: 'A tag with a very long name that does not fit the width of the list and so wraps' }] }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Rtl: Story = { decorators: [rtl], play: async ({ canvasElement }) => { await open(canvasElement); } };
