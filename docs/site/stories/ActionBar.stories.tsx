// States: default (buttons at the end), hover and focus on a button, disabled button, folding into More when narrow, embedded (not sticky). Not applicable: loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ActionBar } from '../../../platform/patterns/ActionBar/ActionBar.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const buttons = (<><Button variant="danger-secondary">Delete</Button><Button priority="high">Cancel</Button><Button type="submit" variant="primary">Save changes</Button></>);
const meta = { title: 'Patterns/ActionBar', component: ActionBar, tags: ['autodocs'], args: { label: 'Asset type actions', sticky: false, children: buttons } } satisfies Meta<typeof ActionBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelectorAll('button')[2] as HTMLElement); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const DisabledButton: Story = { args: { children: <><Button>Cancel</Button><Button variant="primary" disabled>Save changes</Button></> } };
export const Narrow: Story = { decorators: [(Story) => <div className="plx-u-max-w-600px"><Story /></div>], args: { children: <>{Array.from({ length: 6 }, (_, i) => <Button key={i}>Action {i + 1}</Button>)}<Button variant="primary">Save</Button></> } };
export const LongText: Story = { args: { children: <><Button>Cancel and discard every change made to this record</Button><Button variant="primary">Save every change to this record and close it</Button></> } };
export const Rtl: Story = { decorators: [rtl] };
