// States: closed (the Sort button), open (inline panel), with levels, grouped ("Sort within groups by"), focus. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { SortPanel } from '../../../platform/patterns/SortPanel/SortPanel.tsx';
import { rtl } from './rtl.tsx';

const fields = [{ value: 'name', label: 'Name', kind: 'text' }, { value: 'size', label: 'Size', kind: 'number' }, { value: 'modified', label: 'Modified', kind: 'date' }];
const meta = { title: 'Patterns/SortPanel', component: SortPanel, tags: ['autodocs'], args: { fields, value: [], onChange: () => {} } } satisfies Meta<typeof SortPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Inline: Story = { args: { inline: true } };
export const WithLevels: Story = { args: { inline: true, value: [{ field: 'name', dir: 'asc' as const }, { field: 'size', dir: 'desc' as const }] } };
export const Grouped: Story = { args: { inline: true, grouped: true, value: [{ field: 'name', dir: 'asc' as const }] } };
export const LongText: Story = { args: { inline: true, fields: [...fields, { value: 'long', label: 'A field with a very long name that does not fit the width of the panel', kind: 'text' }], value: [{ field: 'long', dir: 'asc' as const }] } };
export const Rtl: Story = { decorators: [rtl], args: { inline: true, value: [{ field: 'name', dir: 'asc' as const }] } };
