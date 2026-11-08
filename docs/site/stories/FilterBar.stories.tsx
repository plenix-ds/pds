// States: no filters applied, some applied (Clear all), multiple choice, with actions. Hover, focus and active are on the filter buttons: focus is reached by play. Not applicable: disabled, loading, error, selected (an applied filter is the selected state).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FilterBar } from '../../../platform/patterns/FilterBar/FilterBar.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const filters = [
  { id: 'type', label: 'Type', options: [{ value: 'png', label: 'PNG', count: 12 }, { value: 'pdf', label: 'PDF', count: 4 }], value: ['png'], multiple: true },
  { id: 'owner', label: 'Owner', options: [{ value: 'mc', label: 'Maya Chen' }, { value: 'ar', label: 'Ana Ruiz' }], value: null },
];
const meta = { title: 'Patterns/FilterBar', component: FilterBar, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { label: 'Filters', filters, onChange: () => {}, onClearAll: () => {} } } satisfies Meta<typeof FilterBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const NoneApplied: Story = { args: { filters: filters.map((f) => ({ ...f, value: f.multiple ? [] : null })) } };
export const Single: Story = { args: { filters: [{ ...filters[1], value: 'ar' }] } };
export const Actions: Story = { args: { actions: <Button size="sm">Save view</Button> } };
export const LongText: Story = { args: { filters: [{ id: 'o', label: 'Regional office responsible for the permits and quotes', options: [{ value: 'a', label: 'Northern and eastern provinces regional office' }], value: 'a' }] } };
export const Rtl: Story = { decorators: [rtl] };
