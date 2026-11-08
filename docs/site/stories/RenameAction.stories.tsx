// States: inline, dialog (button), dialog open, name taken (error), disabled. Hover, focus and active are on the control: focus is reached by play. Not applicable: loading (a pending promise keeps the dialog open), selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { RenameAction } from '../../../platform/patterns/RenameAction/RenameAction.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/RenameAction', component: RenameAction, tags: ['autodocs'], args: { label: 'Name', value: 'Letterhead.pdf', names: ['Other.pdf'], extension: true, onRename: () => {} } } satisfies Meta<typeof RenameAction>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Dialog: Story = { args: { variant: 'dialog', value: 'Brand kit', extension: false } };
export const DialogOpen: Story = { args: { variant: 'dialog', open: true, onClose: () => {}, value: 'Brand kit', extension: false } };
export const NameTaken: Story = { args: { variant: 'dialog', open: true, onClose: () => {}, value: 'Other.pdf', extension: false, names: ['Other.pdf'] } };
export const Data: Story = { args: { data: true, value: 'CTM-2026-00061' } };
export const Disabled: Story = { args: { disabled: true } };
export const LongText: Story = { args: { value: 'Quarterly summary of expenditure by department and cost centre for every regional office 2026.pdf' } };
export const Rtl: Story = { decorators: [rtl] };
