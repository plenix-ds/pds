// States: default (fixed rows), variable rows, groups, loading (more rows come), empty, unread rows, focus on the scroll area, count shown. Not applicable: disabled, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { VirtualList } from '../../../platform/components/VirtualList/VirtualList.tsx';
import { rtl } from './rtl.tsx';

const items = Array.from({ length: 4000 }, (_, i) => ({ id: i, label: 'Event ' + (i + 1), description: 'Something happened', meta: 'E-' + (i + 1) }));
const meta = { title: 'Components/VirtualList', component: VirtualList, tags: ['autodocs'], args: { label: 'Activity', items } } satisfies Meta<typeof VirtualList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithCount: Story = { args: { showCount: true } };
export const Variable: Story = { args: { mode: 'variable', items: items.map((it, i) => ({ ...it, description: 'A longer description that wraps onto more than one line in the variable mode. '.repeat((i % 3) + 1) })) } };
export const Groups: Story = { args: { items: undefined, groups: ['A', 'B', 'C'].map((g) => ({ id: g, label: g, items: Array.from({ length: 30 }, (_, i) => ({ id: g + i, label: g + ' item ' + (i + 1) })) })), height: 'lg' } };
export const Loading: Story = { args: { items: items.slice(0, 20), loading: true } };
export const Empty: Story = { args: { items: [] } };
export const Unread: Story = { args: { items: items.slice(0, 30), unread: (it: { id?: string | number }) => Number(it.id) < 5 } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const LongText: Story = { args: { items: [{ id: 1, label: 'An event with a very long label that does not fit the width of the list and so is cut with an ellipsis', description: 'And a description that is long too' }] } };
export const Rtl: Story = { decorators: [rtl], args: { showCount: true } };
