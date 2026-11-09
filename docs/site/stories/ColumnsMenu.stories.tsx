// States: closed (default), open, hover and focus, a hidden column (unchecked), the manage dialog open. Not applicable: disabled, loading, error, selected beyond the checked columns.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { ColumnsMenu, ManageColumnsDialog } from '../../../platform/patterns/ColumnsMenu/ColumnsMenu.tsx';
import { rtl } from './rtl.tsx';

const fields = [{ value: 'name', label: 'Name' }, { value: 'type', label: 'Type' }, { value: 'size', label: 'Size' }, { value: 'owner', label: 'Owner' }];
const value = { order: ['name', 'type', 'size', 'owner'], hidden: [] as string[] };
const meta = { title: 'Patterns/ColumnsMenu', component: ColumnsMenu, tags: ['autodocs'], args: { fields, value, onChange: () => {} } } satisfies Meta<typeof ColumnsMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
const open = async (c: HTMLElement) => { await userEvent.click(within(c).getByRole('button')); };

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async ({ canvasElement }) => { await open(canvasElement); } };
export const HiddenColumn: Story = { args: { value: { ...value, hidden: ['size'] } }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Manage: Story = { render: () => <ManageColumnsDialog fields={fields} value={value} onChange={() => {}} open onOpenChange={() => {}} trigger={null} /> };
export const LongText: Story = { args: { fields: [...fields, { value: 'long', label: 'A column with a very long name that does not fit the width of the menu' }], value: { order: [...value.order, 'long'], hidden: [] } }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Rtl: Story = { decorators: [rtl], play: async ({ canvasElement }) => { await open(canvasElement); } };
