// States: default (page actions), hover and focus on a command, a selection (count, Clear, selection commands), disabled command, loading command, folding into More when narrow. Not applicable: error (a command reports its own), selected beyond the selection.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { CommandBar } from '../../../platform/patterns/CommandBar/CommandBar.tsx';
import { rtl } from './rtl.tsx';

const actions = [{ id: 'new', label: 'New', icon: 'plus', primary: true, onSelect: () => {} }, { id: 'upload', label: 'Upload', icon: 'upload', onSelect: () => {} }, { id: 'share', label: 'Share', icon: 'share', onSelect: () => {} }];
const meta = { title: 'Patterns/CommandBar', component: CommandBar, tags: ['autodocs'], args: { label: 'Assets', count: '24 assets', actions } } satisfies Meta<typeof CommandBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelector('button') as HTMLElement); } };
export const WithSelection: Story = { args: { selection: { count: 3, noun: 'asset', onClear: () => {}, actions: [{ id: 'download', label: 'Download', icon: 'download-arrow', onSelect: () => {} }, { id: 'delete', label: 'Delete', icon: 'trash', danger: true, onSelect: () => {} }] } } };
export const DisabledCommand: Story = { args: { actions: [{ ...actions[0], disabled: true, why: 'You cannot create assets here' }, actions[1]] } };
export const LoadingCommand: Story = { args: { actions: [{ ...actions[0], loading: true }, actions[1]] } };
export const Narrow: Story = { decorators: [(Story) => <div className="plx-u-max-w-600px"><Story /></div>], args: { actions: [...actions, { id: 'move', label: 'Move', icon: 'move', onSelect: () => {} }, { id: 'copy', label: 'Copy', icon: 'copy', onSelect: () => {} }] } };
export const LongText: Story = { args: { count: '24,512 assets across every collection in every workspace you manage', actions: [{ id: 'a', label: 'A command with a very long label', icon: 'plus', onSelect: () => {} }] } };
export const Rtl: Story = { decorators: [rtl] };
