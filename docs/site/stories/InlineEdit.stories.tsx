// States: read (default), hover, focus, editing, busy (saving), error (validation or a failed save), disabled, read-only, empty. Not applicable: loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { InlineEdit } from '../../../platform/components/InlineEdit/InlineEdit.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/InlineEdit', component: InlineEdit, tags: ['autodocs'], args: { label: 'Title', value: 'Quarterly report', onConfirm: () => {} } } satisfies Meta<typeof InlineEdit>;
export default meta;
type Story = StoryObj<typeof meta>;
const read = (c: HTMLElement) => within(c).getByRole('button');

export const Default: Story = {};
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(read(canvasElement)); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Editing: Story = { play: async ({ canvasElement }) => { await userEvent.click(read(canvasElement)); } };
export const WithButtons: Story = { args: { confirmButtons: true }, play: async ({ canvasElement }) => { await userEvent.click(read(canvasElement)); } };
export const Busy: Story = { args: { onConfirm: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await userEvent.click(read(canvasElement)); await userEvent.keyboard('{Enter}'); } };
export const Invalid: Story = { args: { value: '', placeholder: 'Add a title', validate: (v: string) => (v.trim() ? null : 'Enter a title') }, play: async ({ canvasElement }) => { await userEvent.click(read(canvasElement)); await userEvent.keyboard('{Enter}'); } };
export const Textarea: Story = { args: { type: 'textarea', label: 'Description', value: 'A short description of the report.' } };
export const Select: Story = { args: { type: 'select', label: 'Status', value: 'draft', options: [{ value: 'draft', label: 'Draft' }, { value: 'final', label: 'Final' }] } };
export const Empty: Story = { args: { value: '', placeholder: 'Add a title' } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const LongText: Story = { args: { value: 'Quarterly report for every team in every workspace, including the draft figures that have not been reviewed by the finance office yet' } };
export const Rtl: Story = { decorators: [rtl] };
