// States: default, partly done (selected tasks), all done, collapsible, with a disabled task. Not applicable: hover/focus beyond the checkboxes, loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Checklist } from '../../../platform/components/Checklist/Checklist.tsx';
import { rtl } from './rtl.tsx';

const items = [{ id: 'profile', label: 'Complete your profile' }, { id: 'team', label: 'Invite your team', description: 'Up to ten people on the free plan.' }, { id: 'case', label: 'Open your first case' }];
const meta = { title: 'Components/Checklist', component: Checklist, tags: ['autodocs'], args: { title: 'Get started', items, completed: ['profile'], onChange: () => {} } } satisfies Meta<typeof Checklist>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { completed: [] } };
export const AllDone: Story = { args: { completed: ['profile', 'team', 'case'] } };
export const Collapsible: Story = { args: { collapsible: true, onDismiss: () => {} } };
export const DisabledTask: Story = { args: { items: [...items, { id: 'billing', label: 'Add billing details', disabled: true }] } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const LongText: Story = { args: { items: [{ id: 'a', label: 'Complete every field of your profile, including the optional ones that only your team administrators and your assigned reviewers can see', description: 'This takes about twenty minutes and can be paused and resumed at any time.' }] } };
export const Rtl: Story = { decorators: [rtl] };
