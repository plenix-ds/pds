// States: datetime, relative, label, date, time, empty value, with tooltip. Hover and focus on the relative tooltip: reached by play. Not applicable: active, disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Time } from '../../../platform/components/Time/Time.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Time', component: Time, tags: ['autodocs'], args: { value: '2026-10-08T14:05:00Z', timeZone: 'UTC' } } satisfies Meta<typeof Time>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Relative: Story = { args: { format: 'relative', value: new Date(Date.now() - 5 * 60000).toISOString() } };
export const RelativeHover: Story = { args: { format: 'relative', value: new Date(Date.now() - 5 * 60000).toISOString() }, play: async ({ canvasElement }) => { await userEvent.hover(canvasElement.querySelector('time') as Element); } };
export const Label: Story = { args: { format: 'label', value: new Date().toISOString() } };
export const DateOnly: Story = { args: { format: 'date', dateStyle: 'long' } };
export const TimeOnly: Story = { args: { format: 'time', seconds: true } };
export const Empty: Story = { args: { value: undefined } };
export const Rtl: Story = { decorators: [rtl] };
