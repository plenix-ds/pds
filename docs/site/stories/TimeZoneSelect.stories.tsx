// States: grouped, by offset, selected, focus, invalid (error), disabled. Hover and active are the open list's rows. Not applicable: loading, warning is Combobox's, selected row is Selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { TimeZoneSelect } from '../../../platform/components/TimeZoneSelect/TimeZoneSelect.tsx';
import { rtl } from './rtl.tsx';

const zones = ['Europe/Berlin', 'America/New_York', 'Asia/Tokyo', 'Africa/Cairo'];
const meta = { title: 'Components/TimeZoneSelect', component: TimeZoneSelect, tags: ['autodocs'], args: { label: 'Time zone', zones, onChange: () => {} } } satisfies Meta<typeof TimeZoneSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async () => { await userEvent.tab(); await userEvent.keyboard('{ArrowDown}'); } };
export const Selected: Story = { args: { value: 'Europe/Berlin' } };
export const ByOffset: Story = { args: { grouped: false, value: 'Asia/Tokyo' } };
export const NoOffset: Story = { args: { showOffset: false, value: 'Africa/Cairo' } };
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true, value: 'Europe/Berlin' } };
export const Rtl: Story = { decorators: [rtl], args: { value: 'Africa/Cairo' } };
