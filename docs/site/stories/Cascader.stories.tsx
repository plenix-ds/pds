// States: default, selected, multiple, invalid (error), warning, disabled, read-only. Hover, focus and active are on the field button: focus is reached by play. Not applicable: loading (shown inside the open list by loadChildren).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Cascader } from '../../../platform/components/Cascader/Cascader.tsx';
import { rtl } from './rtl.tsx';

const options = [
  { id: 'eu', label: 'Europe', children: [{ id: 'paris', label: 'Paris' }, { id: 'rome', label: 'Rome' }] },
  { id: 'na', label: 'North America', children: [{ id: 'nyc', label: 'New York' }, { id: 'tor', label: 'Toronto', disabled: true }] },
  { id: 'af', label: 'Africa', children: [{ id: 'cai', label: 'Cairo' }] },
];
const meta = { title: 'Components/Cascader', component: Cascader, tags: ['autodocs'], args: { options, label: 'Office' } } satisfies Meta<typeof Cascader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Selected: Story = { args: { value: 'paris' } };
export const Multiple: Story = { args: { multiple: true, values: ['paris', 'cai'] } };
export const Searchable: Story = { args: { searchable: true } };
export const Invalid: Story = { args: { invalid: true } };
export const Warning: Story = { args: { warning: true } };
export const Disabled: Story = { args: { disabled: true, value: 'paris' } };
export const ReadOnly: Story = { args: { readOnly: true, value: 'paris' } };
export const LongText: Story = { args: { value: 'nyc', options: [{ id: 'na', label: 'North America, Central America and the Caribbean regional offices', children: [{ id: 'nyc', label: 'New York headquarters and the downtown satellite offices' }] }] } };
export const Rtl: Story = { decorators: [rtl], args: { value: 'paris' } };
