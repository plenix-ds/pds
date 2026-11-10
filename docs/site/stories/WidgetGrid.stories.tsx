// States: auto columns, small items (itemSize sm), fixed columns, reorderable (handles), not reorderable, empty. Hover, focus and active are on the drag handles: focus is reached by play. Not applicable: disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { WidgetGrid } from '../../../platform/patterns/WidgetGrid/WidgetGrid.tsx';
import { Panel } from '../../../platform/components/Card/Card.tsx';
import { rtl } from './rtl.tsx';

const widgets = [{ id: 'a', title: 'Storage', body: '42 GB of 100 GB used.' }, { id: 'b', title: 'Members', body: '12 people.' }, { id: 'c', title: 'Recent', body: 'Brand kit, Floor plans.' }, { id: 'd', title: 'Quotes', body: 'Two waiting for review.' }];
const meta = { title: 'Patterns/WidgetGrid', component: WidgetGrid, tags: ['autodocs'], parameters: { layout: 'padded' },
  args: { label: 'Dashboard', items: widgets, onReorder: () => {}, renderItem: (w: { title?: string; body?: string }) => <Panel title={w.title} flush>{w.body}</Panel> } } satisfies Meta<typeof WidgetGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const TwoColumns: Story = { args: { columns: 2 } };
export const FourColumns: Story = { args: { columns: 4 } };
export const SmallItems: Story = { args: { itemSize: 'sm' } };
export const NotReorderable: Story = { args: { onReorder: undefined } };
export const Empty: Story = { args: { items: [] } };
export const LongText: Story = { args: { items: [{ id: 'a', title: 'Storage used by every team of the regional office', body: '42 GB of 100 GB used across the northern and eastern provinces and every shared drive.' }] } };
export const Rtl: Story = { decorators: [rtl] };
