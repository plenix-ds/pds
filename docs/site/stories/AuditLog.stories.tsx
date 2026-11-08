// States: table, diff, empty. Hover, focus and active are on the rows' controls. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuditLog } from '../../../platform/patterns/AuditLog/AuditLog.tsx';
import { rtl } from './rtl.tsx';

const entries = [
  { id: 1, actor: { name: 'Maya Chen' }, at: '2026-10-08T14:05:00Z', action: 'Renamed', target: 'Kitchen renovation', changes: [{ field: 'Name', before: 'Kitchen', after: 'Kitchen renovation' }] },
  { id: 2, actor: { name: 'Ana Ruiz' }, at: '2026-10-09T09:30:00Z', action: 'Changed the owner', target: 'Brand kit', changes: [{ field: 'Owner', before: 'Maya Chen', after: 'Ana Ruiz' }] },
];
const meta = { title: 'Patterns/AuditLog', component: AuditLog, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { entries, label: 'Workspace history' } } satisfies Meta<typeof AuditLog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Diff: Story = { args: { variant: 'diff' } };
export const Empty: Story = { args: { entries: [] } };
export const LongText: Story = { args: { entries: [{ ...entries[0], target: 'Quarterly summary of expenditure by department and cost centre for every regional office', changes: [{ field: 'Description', before: 'A short note', after: 'A long note about the permits, quotes and contractors for the third floor of the regional office' }] }], variant: 'diff' } };
export const Rtl: Story = { decorators: [rtl] };
