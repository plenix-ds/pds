// States: default, with a change (success and danger tones), with a trend, as a card, large, a group. Not applicable: hover, focus (unless a link), active, disabled, loading, error, selected (see MetricCard for those states).
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Metric } from '../../../platform/components/Metric/Metric.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Metric', component: Metric, tags: ['autodocs'], args: { value: '1,284', label: 'Assets added' } } satisfies Meta<typeof Metric>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Success: Story = { args: { change: '+4%', changeTone: 'success' } };
export const Danger: Story = { args: { value: '3', label: 'Failed imports', change: '+2', changeTone: 'danger' } };
export const WithUnit: Story = { args: { value: '48', unit: 'GB' } };
export const Large: Story = { args: { size: 'lg' } };
export const Trend: Story = { args: { trend: [38, 41, 40, 44, 47, 45, 52], trendLabel: 'Assets added per day' } };
export const Card: Story = { args: { card: true, description: 'Last 30 days', change: '+12%', changeTone: 'success' } };
export const Link: Story = { args: { card: true, href: '#/reports/assets' }, play: async () => { await userEvent.tab(); } };
export const Group: Story = { render: () => <Metric.Group label="This week"><Metric value="1,284" label="Assets added" /><Metric value="92%" label="Tagged" change="+4%" changeTone="success" /><Metric value="3" label="Failed imports" change="+2" changeTone="danger" /></Metric.Group> };
export const LongText: Story = { args: { label: 'Assets added across every workspace and every team this quarter', description: 'The last thirty days, compared with the thirty days before them' } };
export const Rtl: Story = { decorators: [rtl], args: { change: '+4%', changeTone: 'success' } };
