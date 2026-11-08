// States: default, items checked, chosen (selected) items, search, ordered (move up and down), disabled item, empty list. Not applicable: loading, error, hover and focus beyond the controls.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { TransferList } from '../../../platform/components/TransferList/TransferList.tsx';
import { rtl } from './rtl.tsx';

const options = [{ value: 'name', label: 'Name' }, { value: 'status', label: 'Status', meta: 'S-12' }, { value: 'owner', label: 'Owner' }, { value: 'due', label: 'Due date' }, { value: 'locked', label: 'Locked', disabled: true }];
const meta = { title: 'Components/TransferList', component: TransferList, tags: ['autodocs'], args: { label: 'Columns', options, value: ['name'], onChange: () => {} } } satisfies Meta<typeof TransferList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NothingChosen: Story = { args: { value: [] } };
export const AllChosen: Story = { args: { value: ['name', 'status', 'owner', 'due', 'locked'] } };
export const Search: Story = { args: { search: true } };
export const Ordered: Story = { args: { ordered: true, value: ['status', 'name'] } };
export const Titles: Story = { args: { titles: { source: 'Hidden columns', target: 'Shown columns' } } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Many: Story = { args: { virtualized: true, options: Array.from({ length: 600 }, (_, i) => ({ value: i, label: 'Item ' + (i + 1) })), value: [0, 1] } };
export const LongText: Story = { args: { options: [{ value: 'a', label: 'A column with a very long name that does not fit its list and so wraps or is cut' }, { value: 'b', label: 'Short' }], value: [] } };
export const Rtl: Story = { decorators: [rtl] };
