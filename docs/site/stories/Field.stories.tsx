// States: default, required, description, error, warning, inline layout. Hover, focus and active belong to the control inside: focus is reached by play. Not applicable: disabled (set on the control), loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Field } from '../../../platform/components/Field/Field.tsx';
import { Input } from '../../../platform/components/Input/Input.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Field', component: Field, tags: ['autodocs'], args: { label: 'Name', children: <Input /> } } satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Required: Story = { args: { required: true, description: 'Shown on the asset' } };
export const Error: Story = { args: { error: 'Enter a name', required: true } };
export const Warning: Story = { args: { warning: 'This name is already used by another asset' } };
export const Info: Story = { args: { info: 'The name appears in search results.', infoLabel: 'About names' } };
export const Inline: Story = { args: { layout: 'inline' } };
export const Disabled: Story = { args: { children: <Input disabled value="Locked" readOnly /> } };
export const Counter: Story = { args: { counter: 40, children: <Input maxLength={40} /> } };
export const LongText: Story = { args: { label: 'The full legal name of the person or organization that owns this asset', description: 'Enter the name exactly as it appears on the registration documents held by the finance office.' } };
export const Rtl: Story = { decorators: [rtl], args: { required: true, description: 'Shown on the asset' } };
