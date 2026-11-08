// States: default, hover, focus, with a value, disabled, read-only, rich mode. The picker opens while typing "@" (a play function). Not applicable: loading beyond loadOptions, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { MentionInput } from '../../../platform/components/MentionInput/MentionInput.tsx';
import { rtl } from './rtl.tsx';

const options = [{ value: 'maya', label: 'Maya Chen', description: 'Designer' }, { value: 'alex', label: 'Alex Kim', description: 'Engineer' }];
const meta = { title: 'Components/MentionInput', component: MentionInput, tags: ['autodocs'], args: { label: 'Comment', value: '', options, onChange: () => {} } } satisfies Meta<typeof MentionInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const WithValue: Story = { args: { value: 'Thanks @Maya Chen, I will review it today.' } };
export const PickerOpen: Story = { play: async () => { await userEvent.tab(); await userEvent.keyboard('@'); } };
export const Rich: Story = { args: { mode: 'rich', value: undefined, defaultValue: '<p>Thanks for the update.</p>' } };
export const Disabled: Story = { args: { disabled: true, value: 'Disabled comment' } };
export const ReadOnly: Story = { args: { readOnly: true, value: 'Read-only comment' } };
export const LongText: Story = { args: { value: 'Thanks for the update, I reviewed the third floor plans, the roof terrace and the two courtyards, and the structural notes still need a second pair of eyes before the hearing. '.repeat(3) } };
export const Rtl: Story = { decorators: [rtl] };
