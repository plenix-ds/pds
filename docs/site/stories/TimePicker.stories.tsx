// States: list, segments, focus, with value, min and max, invalid (error), warning, disabled, read-only. Hover and active are the list rows. Not applicable: loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { TimePicker } from '../../../platform/components/TimePicker/TimePicker.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/TimePicker', component: TimePicker, tags: ['autodocs'], args: { label: 'Start time', onChange: () => {} } } satisfies Meta<typeof TimePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async () => { await userEvent.tab(); await userEvent.keyboard('{ArrowDown}'); } };
export const WithValue: Story = { args: { value: '14:30' } };
export const Segments: Story = { args: { variant: 'segments', hourCycle: 24, value: '07:15', label: 'Alarm' } };
export const Range: Story = { args: { step: 30, min: '08:00', max: '18:00', value: '09:00' } };
export const Invalid: Story = { args: { invalid: true } };
export const Warning: Story = { args: { warning: true } };
export const Disabled: Story = { args: { disabled: true, value: '14:30' } };
export const ReadOnly: Story = { args: { readOnly: true, value: '14:30' } };
export const Rtl: Story = { decorators: [rtl], args: { value: '14:30' } };
