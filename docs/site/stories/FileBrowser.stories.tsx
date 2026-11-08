// States: list, grid, with tree, folder open, selectable, empty. Hover, focus and active are on the items and the bar: focus is reached by play. Not applicable: disabled, loading, error (the bar reports failed commands), selected is Selectable.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FileBrowser } from '../../../platform/patterns/FileBrowser/FileBrowser.tsx';
import { rtl } from './rtl.tsx';

const items = [
  { id: 'brand', name: 'Brand kit', kind: 'folder' as const, count: 2, parent: null },
  { id: 'f1', name: 'Letterhead.pdf', size: 1240000, modified: '2026-10-14', parent: null },
  { id: 'f2', name: 'Logo.png', size: 482000, modified: '2026-10-12', parent: 'brand' },
  { id: 'f3', name: 'Palette.pdf', size: 96000, modified: '2026-10-11', parent: 'brand' },
];
const meta = { title: 'Patterns/FileBrowser', component: FileBrowser, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { items, root: { name: 'Library' }, onOpenFile: () => {} } } satisfies Meta<typeof FileBrowser>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Grid: Story = { args: { defaultView: 'grid' } };
export const Table: Story = { args: { listView: 'table' } };
export const Tree: Story = { args: { tree: true } };
export const InFolder: Story = { args: { defaultFolder: 'brand', breadcrumbs: true } };
export const Selectable: Story = { args: { selectable: true, selected: ['f1'], onSelectionChange: () => {}, onDelete: () => {}, onDownload: () => {} } };
export const Commands: Story = { args: { onCreateFolder: () => {}, onUpload: () => {}, onRename: () => {}, onMove: () => {} } };
export const Empty: Story = { args: { items: [] } };
export const LongText: Story = { args: { items: [{ id: 'x', name: 'Quarterly summary of expenditure by department and cost centre for every regional office 2026.pdf', size: 1240000, parent: null }] } };
export const Rtl: Story = { decorators: [rtl] };
