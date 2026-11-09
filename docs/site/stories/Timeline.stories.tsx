// States: default, with icons and badges, horizontal, alternate, grouped with legend, upcoming. Not applicable: hover, focus (the legend buttons in grouped), active, disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Timeline } from '../../../platform/components/Timeline/Timeline.tsx';
import { Badge } from '../../../platform/components/Badge/Badge.tsx';
import { rtl } from './rtl.tsx';

const items = [
  { id: 1, time: 'Oct 2, 2026', dateTime: '2026-10-02', title: 'Project created', description: 'Maya Chen set up the project.' },
  { id: 2, time: 'Oct 9, 2026', dateTime: '2026-10-09', title: 'Quotes uploaded', icon: 'upload', badge: <Badge tone="success">Approved</Badge> },
  { id: 3, time: 'Oct 20, 2026', dateTime: '2026-10-20', title: 'Inspection', description: 'Planned for the end of the month.', upcoming: true },
];
const meta = { title: 'Components/Timeline', component: Timeline, tags: ['autodocs'], args: { label: 'Project history', items } } satisfies Meta<typeof Timeline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Horizontal: Story = { args: { orientation: 'horizontal' } };
export const Alternate: Story = { args: { align: 'alternate' } };
export const Grouped: Story = { args: { variant: 'grouped', legend: true, items: items.map((i, n) => ({ ...i, category: n ? { id: 'b', label: 'Documents', color: '2' } : { id: 'a', label: 'Case', color: '1' } })) } };
export const GroupedFocus: Story = { args: Grouped.args, play: async () => { await userEvent.tab(); } };
export const GroupedHidden: Story = { args: { ...Grouped.args, hiddenCategories: ['b'] } };
export const Empty: Story = { args: { items: [] } };
export const LongText: Story = { args: { items: [{ id: 1, time: 'Oct 2, 2026', title: 'Quarterly summary of expenditure by department and cost centre for every regional office was created', description: 'Maya Chen-Abdel-Malik set up the project for the finance committee and invited every member of the regional offices.' }] } };
export const Rtl: Story = { decorators: [rtl] };
