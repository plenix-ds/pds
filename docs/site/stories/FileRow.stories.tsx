// States: default, selectable, selected, uploading (progress), error (retry), with actions. Hover, focus and active are on the row's controls: focus is reached by play. Not applicable: disabled, loading is progress.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FileRow, FileRowList } from '../../../platform/components/FileRow/FileRow.tsx';
import { rtl } from './rtl.tsx';

const file = { name: 'Letterhead.pdf', size: 1240000, modified: '2026-10-14' };
const meta = { title: 'Components/FileRow', component: FileRow, tags: ['autodocs'], args: { file, owner: 'Maya Chen' } } satisfies Meta<typeof FileRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { args: { onOpen: () => {} }, play: async () => { await userEvent.tab(); } };
export const Selectable: Story = { args: { selectable: true, onSelectChange: () => {}, onOpen: () => {} } };
export const Selected: Story = { args: { selectable: true, selected: true, onSelectChange: () => {}, onOpen: () => {} } };
export const Actions: Story = { args: { onOpen: () => {}, onDownload: () => {}, onRename: () => {}, onDelete: () => {}, names: ['Other.pdf'] } };
export const Uploading: Story = { args: { progress: 42, progressLabel: 'Uploading', onCancel: () => {} } };
export const Error: Story = { args: { error: 'The connection was lost.', onRetry: () => {} } };
export const Status: Story = { args: { status: 'Shared' } };
export const List: Story = { render: () => <FileRowList label="Uploads"><FileRow as="li" file={file} /><FileRow as="li" file={{ name: 'Cross 014.png', size: 482000 }} progress={42} progressLabel="Uploading" /></FileRowList> };
export const LongText: Story = { args: { file: { ...file, name: 'Quarterly summary of expenditure by department and cost centre for every regional office 2026.pdf' }, owner: 'Maya Chen-Abdel-Malik, regional director' } };
export const Rtl: Story = { decorators: [rtl] };
