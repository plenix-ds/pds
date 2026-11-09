// States: some selected, all selected, none (hidden), a danger action, a disabled action, summary only. Hover, focus and active are on the buttons: focus is reached by play. Not applicable: loading, error, selected (it is the selection).
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { BulkActions, SelectionSummary } from '../../../platform/patterns/BulkActions/BulkActions.tsx';
import { rtl } from './rtl.tsx';

const actions = [{ id: 'download', label: 'Download', icon: 'download-arrow', onSelect: () => {} }, { id: 'share', label: 'Share', icon: 'share', disabled: true, why: 'You cannot share these files' }, { id: 'delete', label: 'Delete', icon: 'trash', danger: true, onSelect: () => {} }];
const meta = { title: 'Patterns/BulkActions', component: BulkActions, tags: ['autodocs'], args: { count: 3, total: 120, noun: 'asset', onSelectAll: () => {}, onClear: () => {}, actions, label: 'Selection actions' } } satisfies Meta<typeof BulkActions>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const AllSelected: Story = { args: { count: 120 } };
export const One: Story = { args: { count: 1 } };
export const None: Story = { args: { count: 0 } };
export const Summary: Story = { render: () => <SelectionSummary count={3} total={120} noun="asset" onSelectAll={() => {}} onClear={() => {}} /> };
export const LongText: Story = { args: { noun: 'document from the shared drive of the regional office', plural: 'documents from the shared drive of the regional office' } };
export const Rtl: Story = { decorators: [rtl] };
