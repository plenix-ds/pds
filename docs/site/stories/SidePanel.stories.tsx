// States: open (default), collapsed to its rail, hover and focus on Collapse, with actions, with a footer. Not applicable: disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { SidePanel } from '../../../platform/patterns/SidePanel/SidePanel.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/SidePanel', component: SidePanel, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { title: 'Details', icon: 'circle-info', open: true, onOpenChange: () => {}, children: <p>Properties of the selected asset.</p> } } satisfies Meta<typeof SidePanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Collapsed: Story = { args: { open: false } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelector('button') as HTMLElement); } };
export const WithActions: Story = { args: { actions: <Button size="xs">Edit</Button> } };
export const WithFooter: Story = { args: { footer: <><Button>Cancel</Button><Button variant="primary">Save</Button></> } };
export const LongText: Story = { args: { title: 'Details of the selected asset and every version of it', children: <p>{'A paragraph of properties that runs on well past the width of the panel. '.repeat(6)}</p> } };
export const Rtl: Story = { decorators: [rtl] };
