// States: unassigned, assigned, clearable, delegate (none and active). Hover, focus and active are on the control and the open list: focus is reached by play. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { AssignControl } from '../../../platform/patterns/AssignControl/AssignControl.tsx';
import { rtl } from './rtl.tsx';

const people = [{ value: 'mc', label: 'Maya Chen', description: 'Project lead' }, { value: 'ar', label: 'Ana Ruiz', description: 'Architect' }, { value: 'pb', label: "Patrick O'Brien" }];
const meta = { title: 'Patterns/AssignControl', component: AssignControl, tags: ['autodocs'], args: { label: 'Assignee', people, me: 'mc', onChange: () => {} } } satisfies Meta<typeof AssignControl>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Assigned: Story = { args: { value: 'ar' } };
export const NotClearable: Story = { args: { value: 'ar', clearable: false } };
export const Delegate: Story = { args: { variant: 'delegate', label: 'Approvals', onDelegate: () => {}, onEndDelegation: () => {} } };
export const Delegating: Story = { args: { variant: 'delegate', label: 'Approvals', delegation: { to: 'ar', start: '2026-10-10', end: '2026-10-20', note: 'On leave' }, onDelegate: () => {}, onEndDelegation: () => {} } };
export const LongText: Story = { args: { label: 'The person responsible for the permits, quotes and contractors', people: [{ value: 'x', label: 'Marina Abdel-Malik Haddad-Williams', description: 'Regional director for the northern and eastern provinces' }], value: 'x' } };
export const Rtl: Story = { decorators: [rtl], args: { value: 'ar' } };
