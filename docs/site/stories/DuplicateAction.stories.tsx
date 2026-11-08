// States: closed (trigger), open (copy), rename variant with options, name taken (error). Hover, focus and active are on the dialog's controls: focus is reached by play. Not applicable: disabled, loading (busy while copying), selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { DuplicateAction } from '../../../platform/patterns/DuplicateAction/DuplicateAction.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/DuplicateAction', component: DuplicateAction, tags: ['autodocs'],
  args: { name: 'Easter banner', noun: 'asset', taken: ['Easter banner copy'], onDuplicate: () => {}, onUndo: () => {} } } satisfies Meta<typeof DuplicateAction>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { args: { trigger: false, open: true, onClose: () => {} } };
export const Rename: Story = { args: { trigger: false, open: true, onClose: () => {}, variant: 'rename', name: 'Advent', noun: 'board', source: '12 assets · 3 members', options: [{ id: 'members', label: 'Members', defaultChecked: true }, { id: 'comments', label: 'Comments' }] } };
export const LongText: Story = { args: { trigger: false, open: true, onClose: () => {}, name: 'Quarterly summary of expenditure by department and cost centre for every regional office' } };
export const Rtl: Story = { decorators: [rtl], args: { trigger: false, open: true, onClose: () => {} } };
