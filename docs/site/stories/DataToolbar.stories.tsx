// States: default, hover and focus on a control (arrow keys move between them), with a truncated summary at the end. Not applicable: disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { DataToolbar } from '../../../platform/patterns/DataToolbar/DataToolbar.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { Text } from '../../../platform/components/Text/Text.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/DataToolbar', component: DataToolbar, tags: ['autodocs'], args: { label: 'View options', start: <><Button>List</Button><Button>Grid</Button></>, end: <Text truncate>24 assets</Text> } } satisfies Meta<typeof DataToolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelector('button') as HTMLElement); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Narrow: Story = { decorators: [(Story) => <div className="plx-u-max-w-600px"><Story /></div>], args: { end: <Text truncate>24,512 assets across every collection in every workspace you manage, filtered by owner and type</Text> } };
export const WithChildren: Story = { args: { children: <Button>Export</Button> } };
export const Rtl: Story = { decorators: [rtl] };
