// States: results, filters applied, selection, empty results, saved search. Hover, focus and active are on the search field, filters and buttons: focus is reached by play. Not applicable: disabled, loading (the app shows it in the results), error, selected is Selection.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { SearchWorkspace } from '../../../platform/patterns/SearchWorkspace/SearchWorkspace.tsx';
import { rtl } from './rtl.tsx';

const filters = [{ id: 'type', label: 'Type', options: [{ value: 'png', label: 'PNG' }, { value: 'pdf', label: 'PDF' }], value: ['png'], multiple: true }];
const sort = { value: 'recent', options: [{ value: 'recent', label: 'Most recent' }, { value: 'name', label: 'Name' }], onChange: () => {} };
const meta = { title: 'Patterns/SearchWorkspace', component: SearchWorkspace, tags: ['autodocs'], parameters: { layout: 'fullscreen' },
  args: { title: 'Search results', query: 'kitchen', onQueryChange: () => {}, placeholder: 'Search…', filters, onFilterChange: () => {}, onClearAll: () => {}, count: 128, noun: 'asset', sort, children: <p>The results go here.</p> } } satisfies Meta<typeof SearchWorkspace>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const NoFilters: Story = { args: { filters: [] } };
export const Selection: Story = { args: { selection: { count: 3, total: 128, noun: 'asset', onClear: () => {}, actions: [{ id: 'dl', label: 'Download', onSelect: () => {} }] } } };
export const Saved: Story = { args: { onSave: () => {}, view: { value: 'grid', options: [{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }], onChange: () => {} } } };
export const Empty: Story = { args: { count: 0, children: <p>No results for “kitchen”.</p> } };
export const LongText: Story = { args: { title: 'Search results across every document of the regional office for the northern and eastern provinces', query: 'quarterly summary of expenditure by department and cost centre' } };
export const Rtl: Story = { decorators: [rtl] };
