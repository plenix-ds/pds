// States: all items fit, items fold into the "…" menu (narrow). Hover, focus and active are on the buttons: focus is reached by play. Not applicable: loading, error, selected; a disabled item is in Disabled.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { OverflowList } from '../../../platform/components/OverflowList/OverflowList.tsx';
import { rtl } from './rtl.tsx';

const items = [{ id: 'share', label: 'Share', icon: 'share' }, { id: 'export', label: 'Export', href: '#/export' }, { id: 'print', label: 'Print' }, { id: 'archive', label: 'Archive' }, { id: 'delete', label: 'Delete', disabled: true }];
const meta = { title: 'Components/OverflowList', component: OverflowList, tags: ['autodocs'], args: { label: 'Page actions', items } } satisfies Meta<typeof OverflowList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Narrow: Story = { decorators: [(Story) => <div className="plx-u-max-w-600px"><Story /></div>] };
export const Small: Story = { args: { size: 'sm' } };
export const Disabled: Story = { args: { items: [items[4]] } };
export const Empty: Story = { args: { items: [] } };
export const LongText: Story = { args: { items: [{ id: 'a', label: 'Share with every member of the regional office' }, { id: 'b', label: 'Export all documents in the workspace' }] } };
export const Rtl: Story = { decorators: [rtl] };
