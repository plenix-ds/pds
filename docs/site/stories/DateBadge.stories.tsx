// States: default, today (selected look), with a machine-readable date. Not applicable: hover, focus, active, disabled, loading, error (a static label).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateBadge } from '../../../platform/components/DateBadge/DateBadge.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/DateBadge', component: DateBadge, tags: ['autodocs'], args: { day: 7, weekday: 'Wed' } } satisfies Meta<typeof DateBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Today: Story = { args: { day: 6, weekday: 'Tue', today: true } };
export const WithDate: Story = { args: { dateTime: '2026-10-07' } };
export const LongText: Story = { args: { day: 28, weekday: 'Wednesday' } };
export const Rtl: Story = { decorators: [rtl], args: { today: true } };
