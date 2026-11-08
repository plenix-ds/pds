// States: default, selected (a chosen date), range, disabled days. Hover, focus and active are on the day buttons: focus is reached by play. Not applicable: loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Calendar } from '../../../platform/components/Calendar/Calendar.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Calendar', component: Calendar, tags: ['autodocs'],
  args: { label: 'Due date', today: '2026-10-15', defaultMonth: '2026-10' } } satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: '2026-10-20' } };
export const Range: Story = { args: { mode: 'range', months: 2, defaultValue: { start: '2026-10-12', end: '2026-10-18' } } };
export const WeekNumbers: Story = { args: { weekNumbers: true } };
export const Disabled: Story = { args: { min: '2026-10-10', max: '2026-10-25', isDateDisabled: (iso: string) => new Date(iso + 'T00:00:00').getDay() === 0 } };
export const Focus: Story = { play: async () => { await userEvent.tab(); await userEvent.tab(); await userEvent.tab(); } };
export const Rtl: Story = { decorators: [rtl], args: { defaultValue: '2026-10-20' } };
