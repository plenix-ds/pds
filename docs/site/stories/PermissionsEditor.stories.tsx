// States: roles, people, with locked subject, read-only, empty. Hover, focus and active are on the checkboxes: focus is reached by play. Not applicable: disabled is read-only, loading, error, selected (a granted right is the checked state).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { PermissionsEditor } from '../../../platform/patterns/PermissionsEditor/PermissionsEditor.tsx';
import { rtl } from './rtl.tsx';

const subjects = [{ id: 'owner', label: 'Owner', locked: true }, { id: 'editor', label: 'Editor' }, { id: 'viewer', label: 'Viewer' }];
const capabilities = [{ id: 'view', label: 'View' }, { id: 'edit', label: 'Edit' }, { id: 'share', label: 'Share' }, { id: 'delete', label: 'Delete' }];
const meta = { title: 'Patterns/PermissionsEditor', component: PermissionsEditor, tags: ['autodocs'], parameters: { layout: 'padded' },
  args: { subjects, capabilities, value: { owner: ['view', 'edit', 'share', 'delete'], editor: ['view', 'edit'], viewer: ['view'] }, onChange: () => {}, onSave: () => {} } } satisfies Meta<typeof PermissionsEditor>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const People: Story = { args: { mode: 'people', subjects: [{ id: 'mc', label: 'Maya Chen' }, { id: 'ar', label: 'Ana Ruiz' }], value: { mc: ['view', 'edit'], ar: ['view'] } } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const NoRights: Story = { args: { value: {} } };
export const Empty: Story = { args: { subjects: [] } };
export const LongText: Story = { args: { capabilities: [{ id: 'view', label: 'View every document in the workspace of the regional office' }, { id: 'edit', label: 'Edit' }] } };
export const Rtl: Story = { decorators: [rtl] };
