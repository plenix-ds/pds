// States: closed (the Group button), open (inline panel), with levels, with a subgroup, focus. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { GroupPanel } from '../../../platform/patterns/GroupPanel/GroupPanel.tsx';
import { rtl } from './rtl.tsx';

const fields = [{ value: 'status', label: 'Status', kind: 'select', options: [{ value: 'open', label: 'Open' }] }, { value: 'owner', label: 'Owner', kind: 'text' }, { value: 'due', label: 'Due date', kind: 'date' }];
const meta = { title: 'Patterns/GroupPanel', component: GroupPanel, tags: ['autodocs'], args: { fields, value: [], onChange: () => {} } } satisfies Meta<typeof GroupPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Inline: Story = { args: { inline: true } };
export const WithLevel: Story = { args: { inline: true, value: [{ field: 'status', dir: 'asc' as const }] } };
export const WithSubgroup: Story = { args: { inline: true, value: [{ field: 'status', dir: 'asc' as const }, { field: 'due', dir: 'desc' as const, interval: 'month' as const }] } };
export const LongText: Story = { args: { inline: true, fields: [...fields, { value: 'long', label: 'A field with a very long name that does not fit the width of the panel', kind: 'text' }], value: [{ field: 'long', dir: 'asc' as const }] } };
export const Rtl: Story = { decorators: [rtl], args: { inline: true, value: [{ field: 'status', dir: 'asc' as const }] } };
