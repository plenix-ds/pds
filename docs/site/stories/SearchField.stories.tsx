// States: default, focus, with text (clear button), loading, suggestions, recent, on accent, collapsed. Hover and active are the buttons and rows. Not applicable: disabled, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { SearchField } from '../../../platform/components/SearchField/SearchField.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/SearchField', component: SearchField, tags: ['autodocs'], args: { label: 'Search assets', value: '', onChange: () => {}, onClear: () => {} } } satisfies Meta<typeof SearchField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const WithText: Story = { args: { value: 'kitchen' } };
export const Shortcut: Story = { args: { shortcut: 'Ctrl K' } };
export const Loading: Story = { args: { value: 'kitchen', loading: true } };
export const Suggestions: Story = { args: { value: 'kit', suggestions: ['kitchen plans', 'kitchen quote'] }, play: async () => { await userEvent.tab(); } };
export const Recent: Story = { args: { recent: ['quote.pdf', 'floor plans'], onSelect: () => {} }, play: async () => { await userEvent.tab(); } };
export const OnAccent: Story = { args: { onAccent: true } };
export const Collapsed: Story = { args: { collapsed: true } };
export const LongText: Story = { args: { value: 'quarterly summary of expenditure by department and cost centre for every regional office' } };
export const Rtl: Story = { decorators: [rtl], args: { value: 'kitchen', shortcut: 'Ctrl K' } };
