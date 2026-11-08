// States: default, presence, role, link (hover/focus by play), sizes. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Persona } from '../../../platform/components/Persona/Persona.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Persona', component: Persona, tags: ['autodocs'], args: { name: 'Maya Chen' } } satisfies Meta<typeof Persona>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Secondary: Story = { args: { secondary: 'Designer · Brand team', presence: 'online' } };
export const Role: Story = { args: { secondary: 'alex.kim@example.org', role: 'Owner', size: 'lg', name: 'Alex Kim' } };
export const Link: Story = { args: { href: '#/people/12' } };
export const Hover: Story = { args: { href: '#/people/12' }, play: async ({ canvasElement }) => { await userEvent.hover(within(canvasElement).getByRole('link')); } };
export const Focus: Story = { args: { href: '#/people/12' }, play: async () => { await userEvent.tab(); } };
export const Small: Story = { args: { size: 'xs', secondary: 'Designer' } };
export const LongText: Story = { args: { name: 'Marina Abdel-Malik Haddad-Williams', secondary: 'Regional director for the northern and eastern provinces', role: 'Owner' } };
export const Rtl: Story = { decorators: [rtl], args: { secondary: 'Designer · Brand team', presence: 'online' } };
