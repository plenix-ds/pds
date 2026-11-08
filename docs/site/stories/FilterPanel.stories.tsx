// States: closed (the Filter button), open (inline panel), with conditions, a group, empty, focus. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FilterPanel } from '../../../platform/patterns/FilterPanel/FilterPanel.tsx';
import { rtl } from './rtl.tsx';

const fields = [{ value: 'name', label: 'Name', kind: 'text' }, { value: 'status', label: 'Status', kind: 'select', options: [{ value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }] }, { value: 'size', label: 'Size', kind: 'number' }, { value: 'due', label: 'Due date', kind: 'date' }];
const meta = { title: 'Patterns/FilterPanel', component: FilterPanel, tags: ['autodocs'], args: { fields, value: { join: 'and' as const, items: [] }, onChange: () => {} } } satisfies Meta<typeof FilterPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Inline: Story = { args: { inline: true } };
export const WithConditions: Story = { args: { inline: true, value: { join: 'and', items: [{ id: 'c1', field: 'status', op: 'is', value: 'open' }, { id: 'c2', field: 'name', op: 'contains', value: 'report' }] } } };
export const WithGroup: Story = { args: { inline: true, value: { join: 'or', items: [{ id: 'c1', field: 'status', op: 'is', value: 'open' }, { group: true, id: 'g1', join: 'and', items: [{ id: 'c2', field: 'size', op: 'gt', value: 10 }] }] } } };
export const LongText: Story = { args: { inline: true, fields: [...fields, { value: 'long', label: 'A field with a very long name that does not fit the width of the panel', kind: 'text' }] } };
export const Rtl: Story = { decorators: [rtl], args: { inline: true } };
