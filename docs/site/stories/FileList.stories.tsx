// States: list, table with columns, sortable, selectable, folders, delete variants, empty. Hover, focus and active are on the rows and their actions: focus is reached by play. Not applicable: disabled, loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FileList } from '../../../platform/patterns/FileList/FileList.tsx';
import { rtl } from './rtl.tsx';

const files = [
  { id: 'brand', name: 'Brand kit', kind: 'folder' as const, count: 24, modified: '2026-10-14', owner: 'Maya Chen' },
  { id: 'f1', name: 'Letterhead.pdf', size: 1240000, modified: '2026-10-14', owner: 'Maya Chen', status: { tone: 'success', label: 'Approved' } },
  { id: 'f2', name: 'Cross 014.png', size: 482000, modified: '2026-10-12', owner: 'Ana Ruiz' },
];
const meta = { title: 'Patterns/FileList', component: FileList, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { label: 'Files in Brand kit', files, onOpen: () => {} } } satisfies Meta<typeof FileList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Table: Story = { args: { view: 'table', columns: ['size', 'modified', 'owner', 'status'] } };
export const Sortable: Story = { args: { view: 'table', sortable: true, defaultSort: { field: 'modified', dir: 'desc' }, columns: ['size', 'modified'] } };
export const Selectable: Story = { args: { selectable: true, selected: ['f1'], onSelectionChange: () => {} } };
export const Actions: Story = { args: { onDownload: () => {}, onRename: () => {}, onDelete: () => {} } };
export const TrashDelete: Story = { args: { onDelete: () => {}, deleteVariant: 'trash', onRestore: () => {} } };
export const Tall: Story = { args: { rowHeight: 'tall' } };
export const Empty: Story = { args: { files: [], empty: 'No files yet.' } };
export const LongText: Story = { args: { files: [{ id: 'x', name: 'Quarterly summary of expenditure by department and cost centre for every regional office 2026.pdf', size: 1240000, owner: 'Marina Abdel-Malik Haddad-Williams' }] } };
export const Rtl: Story = { decorators: [rtl] };
