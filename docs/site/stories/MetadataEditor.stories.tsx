// States: form, inline, bulk, with a required field empty (error), disabled. Hover, focus and active are on the fields: focus is reached by play. Not applicable: loading (saving), selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { MetadataEditor } from '../../../platform/patterns/MetadataEditor/MetadataEditor.tsx';
import { rtl } from './rtl.tsx';

const fields = [{ id: 'title', label: 'Title', required: true }, { id: 'notes', label: 'Notes', type: 'textarea' as const }, { id: 'status', label: 'Status', type: 'select' as const, options: ['Draft', 'Approved'] }];
const meta = { title: 'Patterns/MetadataEditor', component: MetadataEditor, tags: ['autodocs'], parameters: { layout: 'padded' },
  args: { fields, values: { title: 'Letterhead', notes: 'Final version', status: 'Draft' }, variant: 'form', onSave: () => {} } } satisfies Meta<typeof MetadataEditor>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Inline: Story = { args: { variant: 'inline' } };
export const Bulk: Story = { args: { variant: 'bulk' } };
export const RequiredEmpty: Story = { args: { values: { title: '' } }, play: async () => { await userEvent.tab(); await userEvent.tab(); } };
export const Disabled: Story = { args: { disabled: true } };
export const LongText: Story = { args: { values: { title: 'Quarterly summary of expenditure by department and cost centre for every regional office', notes: 'A long note about the permits, quotes and contractors for the third floor of the regional office.' } } };
export const Rtl: Story = { decorators: [rtl] };
