// States: soft, solid, plain, tones, gender, data, fill (cut with an ellipsis). Not applicable: hover, focus, active, disabled, loading, error, selected (not interactive).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataPill } from '../../../platform/components/DataPill/DataPill.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/DataPill', component: DataPill, tags: ['autodocs'], args: { children: 'Sat May 9' } } satisfies Meta<typeof DataPill>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Data: Story = { args: { data: true, children: 'CTM-2026-00061' } };
export const Solid: Story = { args: { tone: 'green', variant: 'solid', data: true, children: '$639' } };
export const WithIcon: Story = { args: { tone: 'orange', icon: 'calendar' } };
export const Gender: Story = { args: { gender: 'female', fill: true, children: 'Marina Abdel-Malik' } };
export const Plain: Story = { args: { gender: 'male', variant: 'plain', children: "Patrick O'Brien" } };
export const Person: Story = { args: { person: true, children: 'Maya Chen' } };
export const Small: Story = { args: { size: 'sm' } };
export const LongText: Story = { args: { fill: true, children: 'Marina Abdel-Malik, regional director for the northern and eastern provinces' } };
export const Rtl: Story = { decorators: [rtl] };
