// States: owner, editor, viewer, custom, no icon, with description. Not applicable: hover, focus, active, disabled, loading, error, selected (a label).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RoleLabel } from '../../../platform/components/RoleLabel/RoleLabel.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/RoleLabel', component: RoleLabel, tags: ['autodocs'], args: { role: 'owner' } } satisfies Meta<typeof RoleLabel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Editor: Story = { args: { role: 'editor' } };
export const Viewer: Story = { args: { role: 'viewer', icon: false } };
export const Custom: Story = { args: { role: 'Reviewer', category: 'purple' } };
export const Described: Story = { args: { role: 'editor', description: 'Can change and share' } };
export const LongText: Story = { args: { role: 'Regional reviewer for the northern and eastern provinces', category: 'blue' } };
export const Rtl: Story = { decorators: [rtl], args: { role: 'editor' } };
