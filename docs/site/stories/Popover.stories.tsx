// States: closed, open (click), hover card, with footer and close button, manual. Focus: the trigger is reached by play; focus moves into the popover when it opens. Not applicable: disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Popover } from '../../../platform/components/Popover/Popover.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Popover', component: Popover, tags: ['autodocs'],
  args: { trigger: <Button caret>Filter</Button>, title: 'Filter', children: <p>Choose what to show.</p> } } satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { args: { defaultOpen: true } };
export const FooterAndClose: Story = { args: { defaultOpen: true, closeButton: true, footer: <Button variant="primary" size="sm">Apply</Button> } };
export const Hover: Story = { args: { triggerOn: 'hover', trigger: <Button>Maya Chen</Button>, label: 'Maya Chen', size: 'sm', title: undefined, children: <p>Project lead, Brand team.</p> } };
export const Manual: Story = { args: { triggerOn: 'manual', open: true, onOpenChange: () => {} } };
export const LongText: Story = { args: { defaultOpen: true, title: 'Filter the documents by owner, status, date range and the regional office that filed them', children: <p>Choose what to show in the list of documents held by the finance committee for every region and every quarter of the year.</p> } };
export const Rtl: Story = { decorators: [rtl], args: { defaultOpen: true } };
