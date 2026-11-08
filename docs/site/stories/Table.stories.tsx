// States: default, with wrapping text, pills, empty. Not applicable: hover, focus beyond cell content, active, disabled, loading, error, selected (a static table; use DataGrid for records people work with).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from '../../../platform/components/Table/Table.tsx';
import { rtl } from './rtl.tsx';

const data = [{ id: 1, name: 'Case number', notes: 'The number the registry gave the case when it was opened.' }, { id: 2, name: 'Filed by', notes: 'Maya Chen' }, { id: 3, name: 'Hearing date', notes: 'The first Thursday of the next quarter.' }];
const meta = { title: 'Components/Table', component: Table, tags: ['autodocs'], args: { label: 'Fields', data, columns: [{ title: 'Field', field: 'name', rowLabel: true }, { title: 'Notes', field: 'notes' }] } } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Wrapping: Story = { args: { columns: [{ title: 'Field', field: 'name', rowLabel: true }, { title: 'Notes', field: 'notes', wrap: true }] } };
export const Pills: Story = { args: { cells: 'pill' } };
export const Empty: Story = { args: { data: [], empty: 'No fields yet.' } };
export const LongText: Story = { args: { data: [{ id: 1, name: 'A field with a very long name that does not fit its column', notes: 'A note that runs on well past the width of its column and so ends in an ellipsis rather than wrapping, because cells do not wrap unless their column says so.' }] } };
export const Rtl: Story = { decorators: [rtl] };
