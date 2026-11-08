// States: default, focus, selected, multiple, invalid (error), warning, disabled. Hover and active are the open list's rows. Not applicable: loading (shown inside the open list by loadOptions), selected row is Selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { EntityPicker } from '../../../platform/components/EntityPicker/EntityPicker.tsx';
import { rtl } from './rtl.tsx';

const options = [
  { value: 'mc', label: 'Maya Chen', description: 'Project lead' },
  { value: 'ar', label: 'Ana Ruiz', description: 'Architect' },
  { value: 'pb', label: "Patrick O'Brien", description: 'Contractor', disabled: true },
];
const meta = { title: 'Components/EntityPicker', component: EntityPicker, tags: ['autodocs'],
  args: { kind: 'people', label: 'Owner', options, placeholder: 'Choose an owner' } } satisfies Meta<typeof EntityPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async () => { await userEvent.tab(); await userEvent.keyboard('{ArrowDown}'); } };
export const Selected: Story = { args: { value: 'mc' } };
export const Multiple: Story = { args: { multiple: true, values: ['mc', 'ar'] } };
export const Teams: Story = { args: { kind: 'teams', label: 'Team', options: [{ value: 'a', label: 'Design' }, { value: 'b', label: 'Engineering' }] } };
export const Invalid: Story = { args: { invalid: true } };
export const Warning: Story = { args: { warning: true } };
export const Disabled: Story = { args: { disabled: true, value: 'mc' } };
export const LongText: Story = { args: { placeholder: 'Choose a council member from the full list of regional offices' } };
export const Rtl: Story = { decorators: [rtl] };
