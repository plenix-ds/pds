// States: list, detail, read-only, built-in roles. Hover, focus and active are on the rows and controls: focus is reached by play. Not applicable: disabled is read-only, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { RoleManager } from '../../../platform/patterns/RoleManager/RoleManager.tsx';
import { rtl } from './rtl.tsx';

const permissions = [{ id: 'view', label: 'View', group: 'Content' }, { id: 'edit', label: 'Edit', group: 'Content' }, { id: 'share', label: 'Share', group: 'Sharing' }, { id: 'delete', label: 'Delete', group: 'Content' }];
const roles = [
  { id: 'owner', name: 'Owner', builtIn: 'owner' as const, permissions: ['view', 'edit', 'share', 'delete'], members: ['mc'] },
  { id: 'editor', name: 'Editor', builtIn: 'editor' as const, permissions: ['view', 'edit'], members: ['ar'] },
  { id: 'reviewer', name: 'Reviewer', description: 'Reads and comments', permissions: ['view'], members: [] },
];
const people = [{ value: 'mc', label: 'Maya Chen' }, { value: 'ar', label: 'Ana Ruiz' }];
const meta = { title: 'Patterns/RoleManager', component: RoleManager, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { label: 'Roles', roles, permissions, people, onChange: () => {} } } satisfies Meta<typeof RoleManager>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Detail: Story = { args: { view: 'detail', roleId: 'reviewer', onViewChange: () => {} } };
export const BuiltInDetail: Story = { args: { view: 'detail', roleId: 'owner', onViewChange: () => {} } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const Empty: Story = { args: { roles: [] } };
export const LongText: Story = { args: { roles: [{ id: 'x', name: 'Regional reviewer for the northern and eastern provinces', description: 'Reads and comments on every document held by the finance committee', permissions: ['view'], members: [] }] } };
export const Rtl: Story = { decorators: [rtl] };
