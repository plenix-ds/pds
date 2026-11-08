// States: open, with selection, background option, closed. Hover, focus and active are on the controls: focus is reached by play. Not applicable: disabled, loading (busy while exporting), error (the dialog reports it), selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ExportDialog } from '../../../platform/patterns/ExportDialog/ExportDialog.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/ExportDialog', component: ExportDialog, tags: ['autodocs'], parameters: { layout: 'fullscreen' },
  args: { open: true, onClose: () => {}, formats: [{ value: 'csv', label: 'CSV' }, { value: 'xlsx', label: 'Excel' }], selectedCount: 3, onExport: () => {} } } satisfies Meta<typeof ExportDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const NoSelection: Story = { args: { selectedCount: 0 } };
export const Background: Story = { args: { allowBackground: true, initialBackground: true } };
export const Closed: Story = { args: { open: false } };
export const LongText: Story = { args: { title: 'Export every document of the regional office to a spreadsheet for the finance committee', formats: [{ value: 'a', label: 'Comma separated values for the finance committee spreadsheet' }] } };
export const Rtl: Story = { decorators: [rtl] };
