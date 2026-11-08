// States: queued, uploading, done, error (Retry), canceled, empty, dialog, docked panel. Hover, focus and active are on the row buttons: focus is reached by play. Not applicable: disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { UploadManager } from '../../../platform/patterns/UploadManager/UploadManager.tsx';
import { rtl } from './rtl.tsx';

const items = [
  { id: 'a', name: 'Letterhead.pdf', size: 1240000, status: 'done' as const, progress: 100 },
  { id: 'b', name: 'Cross 014.png', size: 482000, status: 'uploading' as const, progress: 42 },
  { id: 'c', name: 'Border 007.svg', size: 96000, status: 'error' as const, error: 'The connection was lost.', retry: true },
  { id: 'd', name: 'Notes.docx', size: 88000, status: 'queued' as const },
  { id: 'e', name: 'Old.zip', size: 9600000, status: 'canceled' as const },
];
const meta = { title: 'Patterns/UploadManager', component: UploadManager, tags: ['autodocs'], parameters: { layout: 'padded' },
  args: { items, onCancel: () => {}, onRetry: () => {}, onRemove: () => {}, onAdd: () => {}, variant: 'panel' } } satisfies Meta<typeof UploadManager>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Empty: Story = { args: { items: [] } };
export const Docked: Story = { args: { docked: true, onClose: () => {} } };
export const Dialog: Story = { args: { variant: 'dialog', open: true, onClose: () => {}, hint: 'PNG, JPG or PDF, up to 500 MB each.' } };
export const NoDropZone: Story = { args: { dropZone: false } };
export const LongText: Story = { args: { items: [{ id: 'x', name: 'Quarterly summary of expenditure by department and cost centre for every regional office 2026.pdf', size: 1240000, status: 'error' as const, error: 'The file is larger than the 500 MB limit set by the finance committee of the regional office.', retry: false }] } };
export const Rtl: Story = { decorators: [rtl] };
