// States: default (file), folder, open folder, chip, link/openable. Hover, focus and active are on the openable file: reached by play. Not applicable: disabled, loading, error, selected (FileRow has them).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { File } from '../../../platform/components/File/File.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/File', component: File, tags: ['autodocs'], args: { name: 'Letterhead.pdf', size: 1240000, modified: '2026-10-14' } } satisfies Meta<typeof File>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Folder: Story = { args: { kind: 'folder', name: 'Brand kit', count: 24, size: undefined, modified: undefined } };
export const OpenFolder: Story = { args: { kind: 'folder', name: 'Brand kit', count: 24, open: true, onOpen: () => {} } };
export const Openable: Story = { args: { onOpen: () => {} } };
export const Focus: Story = { args: { onOpen: () => {} }, play: async () => { await userEvent.tab(); } };
export const Chip: Story = { args: { appearance: 'chip', name: 'Minutes 2026-10.docx', size: 88000 } };
export const NameOnly: Story = { args: { size: undefined, modified: undefined } };
export const LongText: Story = { args: { name: 'Quarterly summary of expenditure by department and cost centre for every regional office 2026.pdf', onOpen: () => {} } };
export const Rtl: Story = { decorators: [rtl] };
