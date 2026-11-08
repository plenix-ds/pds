// States: open, with folders, multiple, preselected, a disabled item, empty, closed. Hover, focus and active are on the rows and buttons: focus is reached by play. Not applicable: loading, error (the dialog reports a failed pick), selected is Preselected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FilePicker } from '../../../platform/patterns/FilePicker/FilePicker.tsx';
import { rtl } from './rtl.tsx';

const items = [
  { id: 1, name: 'Letterhead.pdf', kind: 'file', type: 'application/pdf', folderId: null, size: 1240000 },
  { id: 2, name: 'Logo.png', kind: 'file', type: 'image/png', folderId: 'brand', size: 482000 },
  { id: 3, name: 'Locked.pdf', kind: 'file', type: 'application/pdf', folderId: null, size: 96000, disabled: true },
];
const meta = { title: 'Patterns/FilePicker', component: FilePicker, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { open: true, items, onPick: () => {}, onClose: () => {} } } satisfies Meta<typeof FilePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Folders: Story = { args: { folders: [{ id: 'brand', label: 'Brand kit' }] } };
export const Multiple: Story = { args: { multiple: true } };
export const Preselected: Story = { args: { multiple: true, initialSelected: [1] } };
export const Assets: Story = { args: { mode: 'assets' } };
export const Empty: Story = { args: { items: [] } };
export const Closed: Story = { args: { open: false } };
export const LongText: Story = { args: { items: [{ id: 9, name: 'Quarterly summary of expenditure by department and cost centre for every regional office 2026.pdf', kind: 'file', type: 'application/pdf', folderId: null }] } };
export const Rtl: Story = { decorators: [rtl] };
