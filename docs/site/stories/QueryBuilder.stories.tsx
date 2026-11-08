// States: empty (default), with rules, a nested group, text view, hover and focus on a rule, match count. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { QueryBuilder } from '../../../platform/patterns/QueryBuilder/QueryBuilder.tsx';
import { rtl } from './rtl.tsx';

const fields = [{ value: 'type', label: 'Type', kind: 'select', options: [{ value: 'image', label: 'Image' }, { value: 'doc', label: 'Document' }] }, { value: 'size', label: 'Size', kind: 'number' }, { value: 'modified', label: 'Modified', kind: 'date' }, { value: 'name', label: 'Name', kind: 'text' }];
const query = { join: 'and' as const, items: [{ id: 'r1', field: 'type', op: 'is', value: 'image' }, { group: true as const, id: 'g1', join: 'or' as const, items: [{ id: 'r2', field: 'size', op: 'gt', value: 40 }, { id: 'r3', field: 'name', op: 'contains', value: 'banner' }] }] };
const meta = { title: 'Patterns/QueryBuilder', component: QueryBuilder, tags: ['autodocs'], args: { label: 'Audience', fields, value: { join: 'and' as const, items: [] }, onChange: () => {} } } satisfies Meta<typeof QueryBuilder>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const WithRules: Story = { args: { value: query } };
export const WithMatches: Story = { args: { value: query, matches: 12 } };
export const LongText: Story = { args: { fields: [...fields, { value: 'long', label: 'A field with a very long name that does not fit the width of the rule row', kind: 'text' }], value: { join: 'and' as const, items: [{ id: 'r1', field: 'long', op: 'contains', value: 'a very long value that does not fit the width of its control' }] } } };
export const Rtl: Story = { decorators: [rtl], args: { value: query } };
