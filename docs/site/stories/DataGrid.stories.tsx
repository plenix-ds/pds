// States: default, selectable, empty, error, compact density. Hover, focus and active are on the rows and cells: focus is reached by play. Not applicable: disabled, loading (remote mode shows it while fetchRows runs).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { DataGrid } from '../../../platform/components/DataGrid/DataGrid.tsx';
import { rtl } from './rtl.tsx';

const data = [
  { id: 1, name: 'Brand kit', status: 'Approved', size: 2400000 },
  { id: 2, name: 'Annual report', status: 'Draft', size: 8100000 },
  { id: 3, name: 'Floor plans', status: 'Approved', size: 640000 },
];
const columns = [
  { title: 'Name', field: 'name', kind: 'name', sorter: 'string' },
  { title: 'Status', field: 'status', kind: 'center' },
  { title: 'Size', field: 'size', type: 'bytes' },
];
const meta = { title: 'Components/DataGrid', component: DataGrid, tags: ['autodocs'], parameters: { layout: 'padded' },
  args: { label: 'Assets', data, index: 'id', columns } } satisfies Meta<typeof DataGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selectable: Story = { args: { selectable: true } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Compact: Story = { args: { density: 'compact' } };
export const Empty: Story = { args: { data: [], empty: 'No assets yet.' } };
export const Error: Story = { args: { data: [], error: 'The assets could not be loaded.' } };
export const LongText: Story = { args: { data: [{ id: 1, name: 'Quarterly summary of expenditure by department and cost centre for every regional office', status: 'Awaiting approval from the finance committee', size: 1 }] } };
export const Rtl: Story = { decorators: [rtl], args: { selectable: true } };
