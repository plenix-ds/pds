// States: expanded (default), collapsed, hover and focus on the header, with actions. Not applicable: disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { CollapsibleSection } from '../../../platform/components/CollapsibleSection/CollapsibleSection.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/CollapsibleSection', component: CollapsibleSection, tags: ['autodocs'], args: { title: 'Collections', icon: 'briefcase', children: 'Three collections are shared with your team.' } } satisfies Meta<typeof CollapsibleSection>;
export default meta;
type Story = StoryObj<typeof meta>;
const header = (c: HTMLElement) => within(c).getByRole('button');

export const Default: Story = {};
export const Collapsed: Story = { args: { defaultExpanded: false } };
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(header(canvasElement)); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const WithActions: Story = { args: { actions: <Button size="xs">Add</Button> } };
export const LongText: Story = { args: { title: 'Collections shared with every member of every team in every workspace you manage' } };
export const Rtl: Story = { decorators: [rtl] };
