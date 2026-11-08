// States: default, focus, selected, multiple, invalid (error), warning, disabled, loading. Hover and active are the open list's rows. Not applicable: none.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Combobox } from '../../../platform/components/Combobox/Combobox.tsx';
import { rtl } from './rtl.tsx';

const options = [{ value: 'mc', label: 'Maya Chen' }, { value: 'ar', label: 'Ana Ruiz' }, { value: 'pb', label: "Patrick O'Brien" }];
const meta = { title: 'Components/Combobox', component: Combobox, tags: ['autodocs'], args: { label: 'Owner', options, placeholder: 'Choose an owner' } } satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async () => { await userEvent.tab(); await userEvent.keyboard('{ArrowDown}'); } };
export const Selected: Story = { args: { value: 'mc' } };
export const Multiple: Story = { args: { multiple: true, values: ['mc', 'ar'] } };
export const Creatable: Story = { args: { multiple: true, creatable: true, values: [] } };
export const Invalid: Story = { args: { invalid: true } };
export const Warning: Story = { args: { warning: true } };
export const Disabled: Story = { args: { disabled: true, value: 'mc' } };
export const Loading: Story = { args: { loading: true } };
export const LongText: Story = { args: { placeholder: 'Choose a council member from the full list of regional offices' } };
export const Rtl: Story = { decorators: [rtl] };
