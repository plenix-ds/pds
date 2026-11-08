// States: ready (default), loading, empty, error (with Try again), stale, link (hover and focus), each type. Not applicable: disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { MetricCard } from '../../../platform/components/MetricCard/MetricCard.tsx';
import { rtl } from './rtl.tsx';

const change = { amount: '12', direction: 'up' as const, versus: 'since last week' };
const meta = { title: 'Components/MetricCard', component: MetricCard, tags: ['autodocs'], args: { icon: 'checklist', title: 'Open tasks', context: 'All projects', value: '128', change, goodWhen: 'down' } } satisfies Meta<typeof MetricCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loading: Story = { args: { state: 'loading' } };
export const Empty: Story = { args: { state: 'empty', emptyText: 'No data for this period' } };
export const Error: Story = { args: { state: 'error', onRetry: () => {} } };
export const Stale: Story = { args: { state: 'stale', footer: 'Updated 2 hours ago' } };
export const Link: Story = { args: { href: '#/cases?assigned=none', layout: 'tile', title: 'Cases to assign' }, play: async () => { await userEvent.tab(); } };
export const Trend: Story = { args: { type: 'trend', value: '1,284', trend: [38, 41, 40, 44, 47, 52], trendVariant: 'area', change: { amount: '12.5%', direction: 'up', versus: 'vs previous 30 days' }, goodWhen: 'up', footer: 'Updated 5 minutes ago' } };
export const Progress: Story = { args: { type: 'progress', title: 'Tasks done', value: '36', target: '147', progress: { value: 36, max: 147 }, status: { tone: 'active', label: '24%' } } };
export const Person: Story = { args: { type: 'person', person: { name: 'Maya Chen', role: 'Designer' }, value: '12', unit: 'open tasks' } };
export const LongText: Story = { args: { title: 'Open tasks across every project in every workspace you manage', context: 'All projects, all teams and all offices, including archived ones' } };
export const Rtl: Story = { decorators: [rtl] };
